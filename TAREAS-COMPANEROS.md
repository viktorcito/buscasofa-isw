# Tareas para el equipo (Grupo N03)

Para que **todos** figuréis en el control de versiones (es un objetivo de la actividad),
cada miembro debe hacer **al menos 1 commit propio**. Son tareas cortas y fáciles.

## 0. Acceso al repositorio
- Pasadle a Víctor vuestro **usuario de GitHub** para que os añada como *collaborators*
  en `https://github.com/viktorcito/buscasofa-isw` (Settings → Collaborators).
- Aceptad la invitación que os llega por email/GitHub.

## 1. Poner tu nombre y tu aportación (tu commit)
Esto aparece en el **footer** y en la página **"Quienes somos"** (/about), y lo verifican
las pruebas automáticas, así que es importante.

1. Clona el repo (solo la primera vez):
   ```
   git clone https://github.com/viktorcito/buscasofa-isw.git
   cd buscasofa-isw
   ```
2. Abre el archivo **`app/src/data/team.js`** y sustituye tu entrada placeholder
   (`Compañero/a 2`, `3` o `4`) por tu **nombre real** y una **frase** de lo que has
   aportado. Ejemplo:
   ```js
   { name: 'Ana Pérez López', contribution: 'Manual de usuario y capturas de la aplicación.' },
   ```
3. Configura tu identidad de git (una vez):
   ```
   git config user.name "Tu Nombre"
   git config user.email "tu-email-de-github@example.com"
   ```
4. Guarda, haz tu commit y súbelo:
   ```
   git add app/src/data/team.js
   git commit -m "Anade mi nombre y aportacion al equipo"
   git pull --rebase
   git push
   ```

> Importante: no toquéis los archivos de `app/cypress/` (son las pruebas) ni renombréis
> clases/IDs de los componentes; solo vuestra línea en `team.js`.

## 2. Capturas para el manual de usuario
- Arrancad la app en local (ver `README.md`) y haced capturas de: inicio, buscador con
  filtros, mapa, registro, login, perfil con favoritos.
- Subidlas a la carpeta `capturas/` (creadla) o pasádselas a Víctor para la memoria.

## 3. Revisar la memoria
- Leed `MEMORIA.md` y comentad/corregid lo que veáis (redacción, datos del equipo).

## Cómo arrancar la app en local (resumen)
1. Backend: `cd server && npm install && npm run dev`
2. Frontend (otra terminal): `cd app && npm install && npm run dev`
3. Abrir http://localhost:5173
