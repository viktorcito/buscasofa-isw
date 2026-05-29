# Guía de despliegue de Buscasofa

Este documento describe dos formas de desplegar **Buscasofa**. Elige la que mejor se adapte a tus necesidades.

- **Opción A (recomendada):** todo en **Render** bajo una sola URL.
- **Opción B:** frontend en **Vercel** + backend en **Render**.

Al final encontrarás la sección de **persistencia** (Turso), necesaria para que los datos de usuarios y favoritos no se reinicien.

---

## Opción A (RECOMENDADA): una sola URL en Render

El backend de Buscasofa sirve también el frontend compilado (`app/dist`) en el mismo origen. Esto significa que **una única URL pública sirve toda la aplicación**: cualquier persona puede entrar, registrarse y usarla sin configurar nada más.

### Pasos

1. Crea una cuenta en [Render](https://render.com) y conecta el repositorio de GitHub.
2. Crea un nuevo **Web Service** (plan **Free**).
3. Configura los comandos del servicio:

   **Build command:**
   ```bash
   npm install --prefix server && npm install --prefix app && npm run build --prefix app
   ```

   **Start command:**
   ```bash
   node server/index_dev.js
   ```

4. Define las **variables de entorno**:
   - `JWT_SECRET` — **obligatoria**. Clave secreta para firmar los tokens de autenticación.
   - `TURSO_DATABASE_URL` y `TURSO_AUTH_TOKEN` — **opcionales** pero recomendadas para persistencia real (ver sección de persistencia más abajo).

5. Despliega. Render asignará una URL pública (por ejemplo `https://buscasofa-isw.onrender.com`).

Como el build genera `app/dist` y el servidor lo sirve automáticamente, esa única URL entrega la aplicación entera (frontend + API).

### Nota sobre el plan Free

En el plan gratuito de Render el servicio **"duerme" tras unos 15 minutos de inactividad**. El primer acceso tras el periodo de inactividad será lento (unos segundos) mientras el servicio vuelve a arrancar; los siguientes accesos van con normalidad.

---

## Opción B: Vercel (frontend) + Render (backend)

En esta opción el frontend y el backend se despliegan por separado.

### Backend en Render

Igual que en la **Opción A**, pero el servidor solo actúa como API (no es necesario que sirva el frontend):

- **Build command:**
  ```bash
  npm install --prefix server && npm install --prefix app && npm run build --prefix app
  ```
- **Start command:**
  ```bash
  node server/index_dev.js
  ```
- Variables de entorno: `JWT_SECRET` (obligatoria) y, opcionalmente, `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN`.

Anota la URL pública del backend de Render (por ejemplo `https://buscasofa-api.onrender.com`).

### Frontend en Vercel

1. Crea una cuenta en [Vercel](https://vercel.com) e importa el repositorio.
2. Configura el proyecto:
   - **Root Directory:** `app`
   - **Framework Preset:** Vite
   - El fichero `app/vercel.json` ya está incluido (configura el *rewrite* para una SPA).
3. Define la variable de entorno del frontend:
   - `VITE_API_URL` — la URL del backend desplegado en Render (la que anotaste en el paso anterior).
4. Despliega. Vercel asignará una URL pública para el frontend.

---

## Persistencia (Turso)

Por defecto, si no defines las variables de Turso, el backend usa un **fichero SQLite local** (`database.db`). En hosts efímeros como el plan free de Render, ese fichero **se reinicia en cada redeploy**, por lo que los usuarios y favoritos se perderían.

Para que los datos persistan de verdad, usa una base de datos gratuita en **Turso**:

1. Regístrate en [Turso](https://turso.tech).
2. Crea una nueva base de datos.
3. Obtén la **URL de conexión** de la base de datos (con formato `libsql://...`).
4. Genera un **token de autenticación** para esa base de datos.
5. En tu servicio de **Render**, añade las variables de entorno:
   - `TURSO_DATABASE_URL` = la URL `libsql://...`
   - `TURSO_AUTH_TOKEN` = el token generado.

Con estas variables definidas, el backend usará la base de datos de Turso en la nube y los **usuarios y favoritos persistirán** entre reinicios y redespliegues.

> Si no defines estas variables, el backend seguirá funcionando con SQLite local, pero los datos no sobrevivirán a un redeploy en hosts efímeros.
