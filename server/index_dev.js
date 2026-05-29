const express = require('express');
const { createClient } = require('@libsql/client');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const SECRET = require('./secret').secret;
const PORT = process.env.PORT || 4000;

const app = express();
app.use(express.json());
app.use(cors());

// Base de datos libSQL.
// - En local / CI (sin variables de entorno): fichero SQLite local (cero configuración).
// - En producción: base de datos en la nube (Turso) → persistencia real, definiendo
//   TURSO_DATABASE_URL (libsql://...) y TURSO_AUTH_TOKEN.
const db = createClient({
    url: process.env.TURSO_DATABASE_URL || 'file:database.db',
    authToken: process.env.TURSO_AUTH_TOKEN,
});

async function initDb() {
    await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
    await db.execute(`
    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      station_id TEXT NOT NULL,
      user_id INTEGER NOT NULL,
      username TEXT NOT NULL,
      comment TEXT NOT NULL,
      rating INTEGER,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
    await db.execute(`
    CREATE TABLE IF NOT EXISTS favorites (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      station_id TEXT NOT NULL,
      station_name TEXT,
      station_address TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      UNIQUE(user_id, station_id)
    )
  `);
    console.log('Base de datos lista (libSQL)');
}

// Helper: extrae y verifica el usuario del token Bearer.
function getUserFromToken(req) {
    const auth = req.headers.authorization || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    if (!token) return null;
    try {
        return jwt.verify(token, SECRET);
    } catch {
        return null;
    }
}

// ---- Registro ----
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });

    try {
        const existing = await db.execute({
            sql: 'SELECT id FROM users WHERE username = ? OR email = ?',
            args: [username, email],
        });
        if (existing.rows.length > 0)
            return res.status(409).json({ message: 'Usuario o email ya existe' });

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.execute({
            sql: 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
            args: [username, email, hashedPassword],
        });
        res.status(201).json({ message: 'Usuario registrado correctamente' });
    } catch (err) {
        res.status(500).json({ message: 'Error en el servidor', error: err.message });
    }
});

// ---- Login ----
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });

    try {
        const result = await db.execute({
            sql: 'SELECT * FROM users WHERE email = ?',
            args: [email],
        });
        const user = result.rows[0];
        if (!user) return res.status(401).json({ message: 'Credenciales incorrectas' });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ message: 'Credenciales incorrectas' });

        const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '1h' });
        res.json({ message: 'Login correcto', token, username: user.username });
    } catch (err) {
        res.status(500).json({ message: 'Error en el servidor', error: err.message });
    }
});

// ---- Perfil del usuario autenticado ----
app.get('/api/profile', async (req, res) => {
    const payload = getUserFromToken(req);
    if (!payload) return res.status(401).json({ message: 'No autorizado' });

    try {
        const result = await db.execute({
            sql: 'SELECT id, username, email FROM users WHERE id = ?',
            args: [payload.id],
        });
        const user = result.rows[0];
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });
        res.json({ id: user.id, name: user.username, username: user.username, email: user.email });
    } catch (err) {
        res.status(500).json({ message: 'Error en el servidor', error: err.message });
    }
});

// ---- Comentarios ----
app.post('/api/comments', async (req, res) => {
    const payload = getUserFromToken({ headers: { authorization: `Bearer ${req.body.token || ''}` } });
    const { station_id, comment, rating } = req.body;
    if (!req.body.token || !station_id || !comment)
        return res.status(400).json({ message: 'Datos incompletos' });
    if (!payload) return res.status(401).json({ message: 'Token inválido' });

    const parsedRating = rating == null ? null : Number(rating);
    if (rating != null && (Number.isNaN(parsedRating) || parsedRating < 0 || parsedRating > 5)) {
        return res.status(400).json({ message: 'Rating inválido. Debe ser un número entre 0 y 5.' });
    }

    try {
        await db.execute({
            sql: 'INSERT INTO comments (station_id, user_id, username, comment, rating) VALUES (?, ?, ?, ?, ?)',
            args: [station_id, payload.id, payload.username, comment, parsedRating],
        });
        res.status(201).json({ message: 'Comentario guardado' });
    } catch (err) {
        res.status(500).json({ message: 'Error al guardar comentario', error: err.message });
    }
});

app.get('/api/comments/:station_id', async (req, res) => {
    try {
        const result = await db.execute({
            sql: 'SELECT username, comment, rating, created_at FROM comments WHERE station_id = ? ORDER BY created_at DESC',
            args: [req.params.station_id],
        });
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener comentarios', error: err.message });
    }
});

// ---- Gasolineras favoritas (requieren autenticación) ----
app.get('/api/favorites', async (req, res) => {
    const payload = getUserFromToken(req);
    if (!payload) return res.status(401).json({ message: 'No autorizado' });

    try {
        const result = await db.execute({
            sql: 'SELECT station_id, station_name, station_address, created_at FROM favorites WHERE user_id = ? ORDER BY created_at DESC',
            args: [payload.id],
        });
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: 'Error al obtener favoritos', error: err.message });
    }
});

app.post('/api/favorites', async (req, res) => {
    const payload = getUserFromToken(req);
    if (!payload) return res.status(401).json({ message: 'No autorizado' });

    const { station_id, station_name, station_address } = req.body;
    if (!station_id) return res.status(400).json({ message: 'Falta station_id' });

    try {
        await db.execute({
            sql: 'INSERT OR IGNORE INTO favorites (user_id, station_id, station_name, station_address) VALUES (?, ?, ?, ?)',
            args: [payload.id, station_id, station_name || null, station_address || null],
        });
        res.status(201).json({ message: 'Favorito guardado' });
    } catch (err) {
        res.status(500).json({ message: 'Error al guardar favorito', error: err.message });
    }
});

app.delete('/api/favorites/:station_id', async (req, res) => {
    const payload = getUserFromToken(req);
    if (!payload) return res.status(401).json({ message: 'No autorizado' });

    try {
        await db.execute({
            sql: 'DELETE FROM favorites WHERE user_id = ? AND station_id = ?',
            args: [payload.id, req.params.station_id],
        });
        res.json({ message: 'Favorito eliminado' });
    } catch (err) {
        res.status(500).json({ message: 'Error al eliminar favorito', error: err.message });
    }
});

// ---- Servir el frontend compilado (despliegue de una sola URL) ----
const distPath = path.join(__dirname, '..', 'app', 'dist');
if (fs.existsSync(distPath)) {
    app.use(express.static(distPath));
    app.get(/^\/(?!api).*/, (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Sirviendo frontend compilado desde', distPath);
}

initDb()
    .then(() => {
        app.listen(PORT, () => console.log(`Servidor backend (libSQL) en http://localhost:${PORT}`));
    })
    .catch(err => {
        console.error('Error inicializando la base de datos:', err);
        process.exit(1);
    });
