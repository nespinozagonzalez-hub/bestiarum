# Bestiarium · Crónicas del Gremio

Remasterización 3.5 de la experiencia de cacería y colección. Fantasía oscura original, 22 bestias, seis territorios y seis rangos de cazador. Publicación estática, sin compilación ni dependencias de producción.

## Abrir

- Experiencia: https://nespinozagonzalez-hub.github.io/bestiarum/
- Vista de revisión: https://nespinozagonzalez-hub.github.io/bestiarum/preview/
- Desarrollo local: `python -m http.server 8765` y abrir http://localhost:8765.

## Estructura

- `index.html`: estructura accesible y diálogos nativos.
- `assets/css/grimoire.css`: diseño adaptable, tipografía y movimiento reducido.
- `assets/js/catalog.js`: catálogo narrativo, recompensas originales, regiones y sendas.
- `assets/js/storage.js`: adaptador local, normalización y copia previa a la migración.
- `assets/js/app.js`: navegación, contratos, capturas, ceremonia, colección y crónica.
- `assets/art/`: ilustraciones originales; WebP para la interfaz con transparencia para las bestias.
- `docs/catalogo-docente.json`: catálogo previo, códigos y asociaciones pedagógicas originales, fuera de la aventura.
- `docs/GUIA_DOCENTE.md`: uso y continuación del proyecto.
- `docs/art-prompts.json`: especificaciones de las imágenes generadas con ImageGen.
- `tests/regression.cjs`: verificación de los flujos de juego y compatibilidad con V2.5.

## Progresión conservada

El orden sigue siendo código inicial de cacería → desafío externo → código final de captura. No se añadieron cuestionarios internos. Se mantienen los identificadores, códigos, XP, materiales internos y requisitos de Quimerax. Los nombres visibles de algunos monstruos y materiales cambian; las claves guardadas permanecen iguales.

Las cuatro sendas definen identidad narrativa. No anuncian ni conceden bonificaciones numéricas. Las ocho insignias reconocen hitos del progreso existente y no modifican las recompensas.

## Acceso y guardado automático

La portada tiene dos opciones: crear usuario y cazador, o continuar la historia. La inscripción solicita un usuario, un código personal de seis números y la identidad del personaje en un solo formulario. El prólogo se abre después de la creación. Todas las crónicas se consultan dentro de la aventura.

El cliente está conectado al Apps Script desplegado mediante `assets/js/config.js`. Cada acción confirmada genera una copia local de la crónica en `bestiarium.chronicle.v35`, sin PIN ni token. El servidor conserva el progreso que se recupera al entrar desde otro dispositivo. La sesión dura doce horas y se mantiene en `sessionStorage`; la copia local no concede acceso a otra cuenta.

La antigua partida `bestiariumV25` y su copia previa permanecen intactas. No se importan recompensas sin validación del servidor. El guardado no requiere botones, descargas ni elegir un modo local.

## Cuentas y Sheets

`backend/Code.gs` crea las cinco pestañas y valida sesiones, capturas y recompensas. La guía está en `backend/INSTALACION.md`. La versión 3.5 modifica el cliente y no requiere volver a desplegar el script. `tests/live-onboarding.cjs` prueba el formulario nuevo contra el servicio real con una cuenta QA identificada; no registra códigos personales ni tokens.

## Comprobación

Las 18 comprobaciones funcionales ejecutadas con un DOM simulado están registradas en `docs/validation.json`. Se reproducen con Node y jsdom mediante `node tests/state.cjs` (o la variable `BESTIARIUM_JSDOM` apuntando al módulo). Cubren captura, duplicaciones, jefe final, colección completa, persistencia y migración. La revisión visual del navegador se registra por separado en la checklist. `tests/regression.cjs` contiene una suite adicional de Playwright; no se presenta como ejecutada cuando no hay un navegador local disponible. No se ha probado físicamente cada modelo de teléfono.


El backend añade 11 pruebas y su integración con la interfaz otras cinco: `node tests/backend.cjs` y `node tests/accounts.cjs` (con jsdom disponible). Los registros están en `docs/backend-validation.json`, `docs/accounts-validation.json` y `docs/browser-validation.json`.

## Campaña 3.2: Las Crónicas del Velo

Quince capítulos ilustrados, cinco investigaciones, ocho recetas, equipo, talentos, reliquias y refugio personalizable. Consulta la [checklist de campaña](docs/CAMPANA.md). La activación de Google sigue pendiente: las cuentas y el faro cooperativo necesitan una URL real de Apps Script.

Tras editar las reglas o la interfaz de campaña ejecuta `python scripts/build-campaign.py`. Las pruebas de `tests/campaign.cjs` cubren desbloqueos, lectura, consumo de materiales, decisiones, migración y validación en servidor simulado.

## Cuentas conectadas

Crear usuario o entrar desde la portada. El código personal tiene seis números. En otro dispositivo se entra con el mismo usuario y código para recuperar capturas, inventario, equipo y lectura. El servicio público de Apps Script está configurado; la hoja permanece privada. El cliente muestra una ventana breve al consultar o guardar y no convierte los fallos de red en un guardado local de la cuenta.

Ver `docs/CUENTAS_PENDIENTES.md`, `docs/live-connection-validation.json` y `docs/account-loading-validation.json`.
