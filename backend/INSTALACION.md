# Bestiarium · Activar usuarios con Google Sheets

El código está preparado. La conexión real necesita que publiques la aplicación web desde tu cuenta de Google y obtengas su URL `/exec`.

1. Crea una hoja de Google Sheets vacía, llamada **Bestiarium · Archivos del Gremio**.
2. Abre **Extensiones → Apps Script**, reemplaza el contenido de `Code.gs` con el archivo de esta carpeta y guarda.
3. Ejecuta **setupBestiarium** y concede los permisos solicitados por Google. Se crean las pestañas **Usuarios, Sesiones, Catalogo, Eventos y Migraciones**. Repetir la instalación no borra usuarios ni progreso. También puede ejecutarse desde un proyecto independiente: en ese caso crea una hoja nueva y deja su enlace en el registro de ejecución.
4. Selecciona **Implementar → Nueva implementación → Aplicación web**. Ejecutar como **tú**. Acceso **Cualquier persona**. Copia la dirección que termina en `/exec`, no la de prueba `/dev`.
5. En `assets/js/config.js`, deja `window.BESTIARIUM_REMOTE={url:'TU_URL_EXEC'};` y publica el cambio. La URL es pública; no pegues contraseñas, claves de Google ni tokens de administración.
6. Abre el juego y entra en **Ajustes y guía → Cuenta del Gremio**. Crea dos usuarios de prueba y confirma que sus capturas son independientes. Recarga, cierra sesión y vuelve a entrar para verificar la recuperación.

Mientras la URL esté vacía, la experiencia funciona con su crónica local y conserva las partidas anteriores. No muestra formularios de acceso que no puedan conectarse.

## Lo que hace el backend

- Usuario de 3–24 caracteres y clave de seis dígitos.
- Hash de clave con sal y secreto del servidor. Las claves no se guardan en texto plano.
- Bloqueo de 15 minutos después de cinco intentos fallidos por usuario.
- Sesiones de doce horas; el servidor guarda únicamente el hash del token. El navegador conserva el token en `sessionStorage`, nunca la clave.
- Códigos, requisitos, XP y materiales comprobados en el servidor. Los datos de progreso enviados por el navegador no se aceptan como recompensas.
- Bloqueo de escritura y recibos de operación para evitar doble botín. Captura, inventario e historial autoritativo se guardan juntos en una celda JSON.
- Catálogo editable en la hoja. Los códigos iniciales conservan la versión anterior; puedes cambiarlos allí para nuevas expediciones. El catálogo local y el historial público de Git contienen los códigos anteriores: no los trates como contraseñas.
- La hoja debe permanecer privada. Publicar el servicio web no requiere compartir públicamente la hoja.

## Migrar una crónica anterior

El jugador inicia sesión y elige **Solicitar revisión de mi crónica local**. Esto deja una fila **PENDIENTE** en `Migraciones`; no acredita automáticamente logros.

El responsable revisa los IDs, cambia la columna `estado` a **APROBAR** y ejecuta **procesarMigracionesAprobadas** desde Apps Script o desde el menú Bestiarium de la hoja vinculada. El servidor une las capturas aprobadas y recalcula XP y materiales con el catálogo. No importa XP arbitrarios de un archivo local. La copia local original permanece intacta.

Para cerrar nuevas inscripciones, cambia la propiedad del script `BG_REGISTRO_ABIERTO` a `false`.

## Comprobación pendiente de despliegue

Las pruebas locales verifican el controlador y el servidor con servicios de Sheets simulados. La autorización de Google, el acceso público `/exec` y el viaje real navegador → Apps Script → Sheets requieren la implementación en tu cuenta. No se presentan como comprobados antes de tener esa URL.

Referencias oficiales: [Aplicaciones web](https://developers.google.com/apps-script/guides/web) y [Content Service](https://developers.google.com/apps-script/guides/content).
