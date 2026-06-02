# Buscasofa — Buscador de precios de combustible

**Asignatura:** Ingeniería del Software

**Actividad 3 (grupal):** Desarrollo de producto con TDD/BDD

**Grupo:** N03 (equipo nº 3)

**Miembros del equipo:**

- Víctor García Santos
- Víctor Serrano Jiménez
- Ana González Bueno
- Compañero/a 4

**Fecha:** mayo 2026

---

## Índice de contenidos

1. Introducción
2. Pruebas
   - 2.1. Enfoque TDD / ATDD / BDD
   - 2.2. Pruebas de aceptación (BDD, Cucumber/Gherkin)
   - 2.3. Pruebas E2E con Cypress
   - 2.4. Prueba de componente
   - 2.5. Pruebas nuevas creadas por el equipo
   - 2.6. Ejecución de las pruebas
   - 2.7. Tabla resumen de pruebas
3. Manual de usuario
4. Enlace al código fuente
5. Créditos y código de partida

---

## 1. Introducción

**Buscasofa** es una aplicación web que muestra los precios del carburante de las gasolineras españolas a partir de la API pública del Ministerio (servicio *EstacionesTerrestres*). El objetivo del producto es permitir a cualquier usuario consultar, comparar y localizar de forma sencilla las gasolineras con los mejores precios en su provincia o municipio.

La aplicación está construida con un *stack* moderno de frontend:

- **React 19 + Vite** como base de la SPA.
- **React Router** para el enrutado entre páginas.
- **Leaflet** para la representación de gasolineras sobre un mapa interactivo.

El backend que da soporte a la autenticación y a la funcionalidad de favoritos está desarrollado en **Node.js / Express** con una base de datos **SQLite / libSQL**.

### Funcionalidades del MVP

- **Home (página de inicio):** resumen nacional de precios y resumen por comunidad autónoma, junto con un bloque de **gasolineras destacadas**.
- **Buscador / listado de gasolineras:** con filtros por **provincia, municipio y tipo de combustible**, además de **ordenación** y **paginación**.
- **Mapa:** visualización geográfica de las gasolineras mediante Leaflet.
- **Página "Quienes somos"** (`/about`): presentación del equipo y del número de grupo.
- **Registro e inicio de sesión** de usuarios, contra el backend Node/Express + SQLite/libSQL.
- **Página de perfil** (`/perfil`): datos del usuario autenticado y su lista de favoritos.
- **Funcionalidad original — Gasolineras FAVORITAS:** permite **guardar y quitar favoritos** asociados al usuario, de forma que cada persona mantiene su propia lista personalizada.
- **Comentarios y valoraciones** (estrellas) en el detalle de cada gasolinera.
- **"Cerca de mí":** geolocaliza al usuario y **ordena las gasolineras por distancia** (fórmula de Haversine). El mapa muestra además el **precio** de cada estación.
- **Modo oscuro** con persistencia, diseño **accesible** (etiquetas, foco visible, `aria-label`) y **responsive**.

### Punto de partida y metodología

El proyecto **partió de un código base proporcionado por el profesor** (https://github.com/luispedraza/buscasofa), que incluía un conjunto de **pruebas de aceptación ya definidas**. El trabajo del equipo consistió en **implementar la aplicación para que esas pruebas pasaran**, siguiendo un ciclo **rojo → verde** propio de **TDD / ATDD / BDD**, **sin modificar las pruebas existentes**. Adicionalmente, el equipo diseñó **3 pruebas nuevas** (más sus funcionalidades asociadas), respetando la misma disciplina de desarrollo dirigido por pruebas.

---

## 2. Pruebas

> Esta sección es el núcleo de la actividad. Recoge la estrategia de pruebas, los distintos niveles (aceptación, E2E y componente), las pruebas nuevas creadas por el equipo y el estado final de la batería completa.

### 2.1. Enfoque TDD / ATDD / BDD

El desarrollo se ha guiado por las pruebas en todo momento:

- **TDD (Test-Driven Development):** se escribe/ejecuta primero la prueba (estado **rojo**), después se implementa el código mínimo necesario para hacerla pasar (estado **verde**) y, por último, se refactoriza.
- **ATDD (Acceptance-Test-Driven Development):** las pruebas de aceptación entregadas por el profesor actúan como **especificación ejecutable** del producto. Su existencia define *qué* debe hacer la aplicación antes de programarla.
- **BDD (Behavior-Driven Development):** las pruebas de aceptación se describen en lenguaje natural estructurado (**Gherkin**) mediante *features* con escenarios `Dado / Cuando / Entonces`, ejecutados con **Cucumber** sobre Cypress (`cypress-cucumber-preprocessor`).

La regla fundamental fue **no modificar las pruebas de partida**: el código de la aplicación se fue construyendo hasta que todas pasaron a verde.

### 2.2. Pruebas de aceptación (BDD, Cucumber/Gherkin)

Escritas en formato `.feature` y ejecutadas mediante `cypress-cucumber-preprocessor`:

- **`features/header.feature`** — verifica que el **header** muestra el logo y los enlaces de navegación: *Buscador*, *Mapa*, *Quienes somos*, *Login* y *Registro*.
- **`features/notfound.feature`** — al navegar a una **ruta inexistente**, la aplicación muestra el mensaje *"No hemos encontrado la página que buscas"*.
- **`features/users.feature`** — cubre el **registro e inicio de sesión reales contra el backend**, comprobando los mensajes de confirmación de registro y el mensaje de bienvenida tras el login.

### 2.3. Pruebas E2E con Cypress

Pruebas de extremo a extremo que recorren la aplicación como lo haría un usuario:

- **`home.cy.js`** — comprueba el **título** y la **descripción** de la home, y que las tablas resumen se cargan correctamente: la de **resumen nacional con 2 filas** y la de **resumen por comunidad autónoma con 19 filas**.
- **`header.cy.js`** — valida la **navegación** funcional a través de cada uno de los enlaces del header.
- **`fuel_prices.cy.js`** — verifica la **carga de la tabla de precios** a partir de la **API interceptada** (mock de red), incluyendo los estados **"Cargando..."** y **"Error"**, y el contenido de las celdas: **nombre, dirección, municipio y precios**.

### 2.4. Prueba de componente

Realizada con **Cypress Component Testing**:

- **`About.cy.jsx`** — renderiza el componente de la página *Acerca de* de forma aislada y comprueba que muestra el encabezado `h1` **"Acerca de nosotros"** y el **número de equipo**.

### 2.5. Pruebas nuevas creadas por el equipo

Como parte del entregable, el equipo diseñó pruebas nuevas (y sus funcionalidades), siguiendo el mismo ciclo rojo → verde:

- **`footer.cy.js`** — comprueba que los **nombres de todos los miembros** del equipo aparecen en el **footer**.
- **`about.cy.js`** — verifica que la página `/about` muestra el **nombre y la aportación de cada miembro** del equipo, así como el **número de equipo**.
- **`perfil.cy.js`** — valida la **página de perfil** con los **datos del usuario autenticado**.
- **`favoritos.cy.js`** — cubre la **funcionalidad original**: **listar y quitar** gasolineras **favoritas** del usuario.

### 2.5.bis. Pruebas unitarias (Vitest)

De forma complementaria, se han añadido **pruebas unitarias** con **Vitest** sobre las funciones puras de geolocalización (`src/apis/geo.js`): parseo de coordenadas en formato español y cálculo de distancias con la fórmula de Haversine (7 pruebas).

### 2.6. Ejecución de las pruebas

La batería de Cypress se ejecuta en modo *headless* y las unitarias con Vitest:

```bash
npx cypress run        # e2e + (con --component) componente
npm run test:unit      # pruebas unitarias (Vitest)
```

En total, la suite consta de **26 pruebas E2E + 1 prueba de componente + 7 pruebas unitarias**, y **todas se encuentran en verde**.

### 2.7. Tabla resumen de pruebas

| Archivo | Qué verifica | Estado |
| --- | --- | --- |
| `features/header.feature` | Header con logo y enlaces Buscador, Mapa, Quienes somos, Login, Registro | Verde |
| `features/notfound.feature` | Ruta inexistente muestra "No hemos encontrado la página que buscas" | Verde |
| `features/users.feature` | Registro e inicio de sesión reales contra el backend (confirmación y bienvenida) | Verde |
| `home.cy.js` | Título, descripción y tablas resumen (nacional 2 filas, comunidad 19 filas) | Verde |
| `header.cy.js` | Navegación por los enlaces del header | Verde |
| `fuel_prices.cy.js` | Carga de tabla de precios (API interceptada), estados "Cargando..."/"Error", celdas | Verde |
| `About.cy.jsx` (componente) | Renderiza h1 "Acerca de nosotros" y el número de equipo | Verde |
| `footer.cy.js` (nueva) | Nombres de todos los miembros aparecen en el footer | Verde |
| `about.cy.js` (nueva) | `/about` muestra nombre y aportación de cada miembro y el número de equipo | Verde |
| `perfil.cy.js` (nueva) | Página de perfil con datos del usuario autenticado | Verde |
| `favoritos.cy.js` (nueva) | Listar y quitar gasolineras favoritas (funcionalidad original) | Verde |
| `geo.test.js` (unitaria, Vitest) | Parseo de coordenadas y distancias Haversine (7 casos) | Verde |

**Resultado global:** 26 pruebas E2E + 1 de componente + 7 unitarias — todas en verde.

---

## 3. Manual de usuario

A continuación se describen los pasos principales para utilizar Buscasofa. Los marcadores `[CAPTURA n]` indican dónde insertar las capturas de pantalla en la versión final.

### 3.1. Inicio (Home)

1. Acceda a la aplicación desde el navegador.
2. En la página de inicio verá el **resumen nacional de precios**, el **resumen por comunidad autónoma** y un bloque de **gasolineras destacadas**.

`[CAPTURA 1: Página de inicio con el resumen de precios nacional y por comunidad autónoma]`

### 3.2. Buscador con filtros

1. Pulse el enlace **Buscador** del menú superior.
2. Aplique filtros por **provincia**, **municipio** y **tipo de combustible**.
3. Use la **ordenación** y la **paginación** para recorrer los resultados.

`[CAPTURA 2: Listado de gasolineras con los filtros de provincia, municipio y combustible]`

### 3.3. Mapa

1. Pulse el enlace **Mapa** del menú superior.
2. Explore las gasolineras situadas sobre el mapa interactivo (Leaflet).

`[CAPTURA 3: Mapa con las gasolineras georreferenciadas]`

### 3.4. Registro

1. Pulse **Registro** en el menú.
2. Rellene el formulario con sus datos y confirme.
3. La aplicación mostrará un **mensaje de confirmación** del registro.

`[CAPTURA 4: Formulario de registro y mensaje de confirmación]`

### 3.5. Inicio de sesión (Login)

1. Pulse **Login** en el menú.
2. Introduzca sus credenciales.
3. Tras autenticarse, verá un **mensaje de bienvenida**.

`[CAPTURA 5: Pantalla de login con el mensaje de bienvenida tras iniciar sesión]`

### 3.6. Perfil

1. Una vez autenticado, acceda a la página **Perfil** (`/perfil`).
2. Consulte los **datos de su cuenta**.

`[CAPTURA 6: Página de perfil con los datos del usuario autenticado]`

### 3.7. Guardar y quitar favoritos

1. Desde el buscador o el detalle de una gasolinera, pulse el botón de **favorito** para **guardarla**.
2. Acceda a su lista de **favoritos** para revisarlos.
3. Pulse de nuevo sobre el favorito para **quitarlo** de la lista.

`[CAPTURA 7: Gasolinera marcada como favorita]`

`[CAPTURA 8: Lista de gasolineras favoritas del usuario con la opción de quitar]`

---

## 4. Enlace al código fuente

- **Repositorio público (equipo):** https://github.com/viktorcito/buscasofa-isw

Adicionalmente, está prevista una **demo desplegada** de la aplicación; su **enlace se añadirá** a esta memoria una vez publicada.

---

## 5. Créditos y código de partida

El proyecto parte del **código base del profesor**, disponible en:

- https://github.com/luispedraza/buscasofa

Dicho repositorio aportó las **pruebas de aceptación** que sirvieron como especificación del producto. El trabajo del equipo N03 consistió en implementar la aplicación hasta dejar todas las pruebas en verde (sin modificarlas) y en añadir 3 pruebas nuevas con sus funcionalidades, incluida la funcionalidad original de **gasolineras favoritas**.
