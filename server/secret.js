// Clave para firmar los JWT. En despliegue se sobreescribe con la variable
// de entorno JWT_SECRET (no subir secretos reales al repositorio).
const secret = process.env.JWT_SECRET || "6isvK1s%40nLRnku";

module.exports = { secret };
