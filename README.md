# Buscasofa

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-6-646CFF?logo=vite&logoColor=white)
![Node](https://img.shields.io/badge/Node-18%2B-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-Backend-000000?logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite%20%2F%20libSQL-Datos-003B57?logo=sqlite&logoColor=white)
![Cypress](https://img.shields.io/badge/Cypress-14-17202C?logo=cypress&logoColor=white)

**Buscasofa** es un buscador de precios de gasolineras españolas que utiliza los datos abiertos de la API pública del Ministerio. Permite consultar y comparar precios de combustible, localizar estaciones en un mapa y gestionar tus gasolineras favoritas tras iniciar sesión.

Proyecto desarrollado por el **Grupo N03** (equipo nº 3) para la asignatura de **Ingeniería del Software**.

---

## Funcionalidades

- **Registro e inicio de sesión** de usuarios con autenticación mediante tokens JWT.
- **Perfil de usuario** con sus datos y preferencias.
- **Búsqueda de precios** de gasolineras a partir de los datos abiertos del Ministerio.
- **Mapa interactivo** (Leaflet) con la localización de las estaciones.
- **Gasolineras favoritas**: guardar, listar y eliminar estaciones favoritas (funcionalidad original).
- **Comentarios** asociados a las estaciones.

---

## Stack tecnológico

### Frontend (`app/`)
- React 19
- Vite 6
- React Router 7
- Leaflet (mapas)
- Cypress 14 + Cucumber (pruebas e2e)

### Backend (`server/`)
- Node.js + Express
- Base de datos SQLite mediante libSQL (`@libsql/client`)
- Persistencia en la nube opcional con Turso
- Autenticación con JWT

---

## Estructura del monorepo

```
actividad3_grupal/
├── app/        # Frontend React + Vite (incluye pruebas Cypress y vercel.json)
├── server/     # Backend Node + Express + SQLite/libSQL
├── README.md   # Este documento
└── DEPLOY.md   # Guía de despliegue
```

El backend, si encuentra la carpeta `app/dist` (el frontend ya compilado), también sirve la aplicación web. De este modo es posible desplegar todo el proyecto bajo una sola URL pública.

---

## Requisitos

- **Node.js 18 o superior** (incluye `npm`).

---

## Ejecución en local (paso a paso)

### 1. Arrancar el backend

```bash
cd server
npm install
npm run dev
```

El servidor queda escuchando en `http://localhost:4000` (o el puerto definido en la variable de entorno `PORT`).

> Variables de entorno del backend:
> - `JWT_SECRET`: clave para firmar los tokens de autenticación.
> - `TURSO_DATABASE_URL` y `TURSO_AUTH_TOKEN` (opcionales): para persistencia en la nube. Si no se definen, se usa un fichero SQLite local (`database.db`).

### 2. Arrancar el frontend

```bash
cd app
npm install
npm run dev
```

### 3. Abrir la aplicación

Abre el navegador en **http://localhost:5173**.

---

## Pruebas

Las pruebas end-to-end y de componentes se ejecutan con Cypress desde la carpeta `app/`:

```bash
cd app
npx cypress run
```

### NOTA IMPORTANTE (error `bad option: --smoke-test`)

Si al lanzar Cypress aparece el error **`bad option: --smoke-test`**, se debe a que la variable de entorno `ELECTRON_RUN_AS_NODE` está definida en tu sistema. Hay que eliminarla antes de ejecutar Cypress.

En **PowerShell**:

```powershell
Remove-Item Env:\ELECTRON_RUN_AS_NODE
npx cypress run
```

### Estado de las pruebas

- **26 pruebas e2e** + **1 prueba de componente**.
- Todas en verde.

---

## Demo desplegada

Aplicación desplegada: _(pendiente de publicar — añadir aquí la URL pública)_

---

## Créditos

Este proyecto parte del código de partida proporcionado por el profesor:

- Frontend (con pruebas): https://github.com/luispedraza/buscasofa
- Backend: https://github.com/luispedraza/buscasofa-server

Repositorio del grupo: https://github.com/viktorcito/buscasofa-isw

---

## Equipo

**Grupo N03** (equipo nº 3) — Ingeniería del Software.
