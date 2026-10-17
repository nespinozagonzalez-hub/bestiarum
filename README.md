# Bestiarium · Crónicas del Gremio

Remasterización 3.1 de la experiencia de cacería y colección. Fantasía oscura original, 22 bestias, seis territorios y seis rangos de cazador. Publicación estática, sin compilación ni dependencias de producción.

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

## Partidas anteriores

La clave continúa siendo `bestiariumV25`. Antes de leer una partida anterior se conserva una copia en `bestiariumV25.pre-remaster`. No se recalculan XP ni inventario. El respaldo descargable es un archivo de conservación; no se habilita su importación automática. El sistema no borra partidas para cambiar la apariencia.

## Cuentas y Sheets: listo para instalar

El backend y la interfaz de usuarios están implementados y comprobados en simulación. `backend/Code.gs` crea las cinco pestañas y valida sesiones, capturas y recompensas. La guía es `backend/INSTALACION.md`. La URL de despliegue está vacía en `assets/js/config.js`: hasta publicar Apps Script en la cuenta de Google, el juego conserva el guardado local.

## Comprobación

Las 18 comprobaciones funcionales ejecutadas con un DOM simulado están registradas en `docs/validation.json`. Se reproducen con Node y jsdom mediante `node tests/state.cjs` (o la variable `BESTIARIUM_JSDOM` apuntando al módulo). Cubren captura, duplicaciones, jefe final, colección completa, persistencia y migración. La revisión visual del navegador se registra por separado en la checklist. `tests/regression.cjs` contiene una suite adicional de Playwright; no se presenta como ejecutada cuando no hay un navegador local disponible. No se ha probado físicamente cada modelo de teléfono.


El backend añade 11 pruebas y su integración con la interfaz otras cinco: `node tests/backend.cjs` y `node tests/accounts.cjs` (con jsdom disponible). Los registros están en `docs/backend-validation.json`, `docs/accounts-validation.json` y `docs/browser-validation.json`.
