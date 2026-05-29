// URL base del backend.
// - En desarrollo (vite dev) el server corre aparte en el puerto 4000.
// - En producción, por defecto se usan rutas relativas (mismo origen): el server
//   Express sirve también el frontend compilado, así no hay CORS ni URLs que configurar.
// - Si el frontend se despliega en otro host (p.ej. Vercel), se define VITE_API_URL
//   con la URL del backend.
const fromEnv = import.meta.env.VITE_API_URL;
export const API_BASE =
  fromEnv != null && fromEnv !== ''
    ? fromEnv
    : import.meta.env.DEV
    ? 'http://localhost:4000'
    : '';
