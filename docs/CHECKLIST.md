# Checklist de la remasterización · Bestiarium 3.4.0

## Implementación

- [x] Identidad original de fantasía oscura: carbón, hueso, cuero, cobre y brasa.
- [x] Portada ilustrada con el cazador y la fortaleza del Gremio.
- [x] Iniciación con nombre individual o de equipo, cuatro apariencias, cuatro sendas y cinco refugios de origen.
- [x] Refugio del Cazador con progreso, territorios y acceso al tablón.
- [x] 22 ilustraciones individuales de bestias, con siluetas diferentes.
- [x] 22 ilustraciones con transparencia, optimizadas en WebP para la colección y las ceremonias.
- [x] Seis territorios con paisajes, refugios secundarios y lugares de interés propios.
- [x] Fichas con ilustración ambiental compuesta, historia, amenaza, rasgos, hábitat y punto débil.
- [x] Identidad velada en fichas, búsquedas, avisos e historial de apertura.
- [x] Tablón de contratos, inventario con iconografía propia y ocho trofeos.
- [x] Perfil, avatar y crónica de expediciones.
- [x] Ceremonia por fases controladas por el jugador: sello, revelación y botín.
- [x] Control de sonido y preferencia de movimiento reducido.
- [x] Referencias a asignaturas y a instrucciones docentes fuera de la aventura.
- [x] Especialidades como identidad narrativa, sin bonificaciones ficticias.
- [x] Guardado local y descarga de respaldo, sin botón destructivo de reinicio.
- [x] Código separado en catálogo, presentación, controlador y persistencia.
- [x] Tipografías incluidas en el repositorio; sin depender de Google Fonts durante el uso.
- [x] Copia de la versión anterior en la rama `backup/pre-remaster-2026-10-16`.

## Compatibilidad y pruebas funcionales ejecutadas

Las pruebas registradas en `validation.json` se ejecutaron con eventos del controlador dentro de un DOM simulado. La revisión visual se registra por separado.

- [x] Coincidencia exacta de los 22 IDs, códigos, recompensas y requisitos con V2.5.
- [x] Registro de nombre, avatar, senda y origen.
- [x] Apertura con código válido y rechazo de códigos incorrectos.
- [x] Captura cerrada antes del código inicial.
- [x] Rechazo de códigos de captura correspondientes a otra zona cerrada.
- [x] Repetición de códigos sin duplicar XP, materiales ni eventos.
- [x] Quimerax bloqueado hasta reunir sus seis capturas originales.
- [x] Quimerax capturable tras cumplir los requisitos.
- [x] Colección completa: 22 capturas, suma exacta de XP y materiales, ocho trofeos y 44 eventos.
- [x] Recuperación del progreso y de partidas anteriores V2.5.
- [x] Copia previa a la migración; conservación del dato corrupto sin sobrescribirlo durante la lectura.
- [x] Fallo de almacenamiento: se revierte la captura y aparece un aviso.
- [x] Cambiar apariencia conserva la colección.
- [x] Nombres tratados como texto y movimiento reducido persistente.
- [x] Comprobación de 33 WebP de publicación y transparencia de las 22 ilustraciones originales.

## Revisión visual y publicación

- [x] Inspección visual del arte generado y de la diversidad de siluetas.
- [x] Revisar la experiencia publicada en el navegador.
- [x] Revisar los tamaños de 320, 390 y 768 píxeles, sin desbordamiento horizontal en las vistas comprobadas.
- [x] Confirmar portada, cazadores, territorios, bestiario y una captura completa con ceremonia y ficha.
- [x] Publicar la vista de revisión y comprobar una captura real en el navegador.
- [x] Publicar la versión principal y confirmar el despliegue exitoso de GitHub Pages.

## Usuarios y Sheets: implementación y activación

- [x] Código de usuarios y clave de seis dígitos.
- [x] Script instalador para cinco pestañas y backend de validación.
- [x] Código de sesiones, recuperación del progreso por login y cierre de sesión.
- [x] Validación de capturas y recompensas en servidor.
- [x] Solicitud de migración y aprobación manual del responsable.
- [x] Once pruebas del servidor y cinco pruebas de integración del cliente con el servidor simulado.
- [x] Ejecutar y publicar Apps Script en Google; configurar la URL `/exec`.
- [ ] Probar la conexión real entre dispositivos con la hoja desplegada.

Esta entrega conserva el ciclo original de cacería y captura. No incorpora cuestionarios internos ni cambia automáticamente a captura libre por código.

## Campaña y progresión

- [x] Crónicas del Velo: 15 capítulos con páginas guardadas y relectura.
- [x] Forja, equipo, cuatro talentos y cinco investigaciones.
- [x] Reliquias, refugio personalizable y territorio restaurado.
- [x] Faro cooperativo preparado en servidor; requiere activar Google.
- [x] Checklist detallada de campaña en [CAMPANA.md](CAMPANA.md).

## Recuperación y estabilidad 3.2.1

- [x] Evitar doble avance durante un guardado remoto de lectura.
- [x] Una respuesta tardía no mueve otro capítulo abierto después.
- [x] Un error de conexión conserva la escena y permite reintentar.
- [x] Cambios de otra pestaña refrescan capítulos, reliquias, ambientación y avisos.
- [x] 52 comprobaciones automáticas aprobadas, sin contar ejecuciones repetidas del backend.
- [x] Campaña revisada en navegador publicado: prólogo, captura, forja, pista y decisión recuperada tras recarga.
- [x] Crónicas, lector y taller revisados a 320, 390 y 768 px en marcos del navegador, sin desbordamiento horizontal.
- [x] Estado de continuidad en `docs/ESTADO.json`; Google real sigue pendiente.

## Inmersión y navegación 3.3

- [x] 46 escenas con imagen y sin repetir una imagen dentro del mismo capítulo.
- [x] 13 ilustraciones narrativas nuevas, incluidas Kael, Brann, Iria y los seis hallazgos regionales.
- [x] Lector inmersivo y vista de libro, texto regulable y página recordada.
- [x] Botón de pantalla completa con lectura ampliada alternativa si el navegador la rechaza.
- [x] Navegación con flechas y foco recuperado al pasar de página.
- [x] Música original «Vigilia del Gremio», 64 segundos, en bucle; pausa y volumen.
- [x] Estado de reproducción real: no se indica música activa si falla la reproducción.
- [x] Usuario + código de seis números visible en portada, refugio y ajustes.
- [x] Conexión pendiente indicada; no se crea una cuenta ficticia ni se guarda el código localmente.
- [x] Origen ilustrado, tres primeros pasos y menú móvil para las nueve secciones.
- [x] 62 comprobaciones automáticas aprobadas, incluidas diez de inmersión.
- [x] Comprobar visualmente el despliegue 3.3 y la reproducción real del archivo.
- [x] Nueve pantallas y lector ampliado comprobados a 320, 390 y 768 px en Chrome remoto.
- [ ] Prueba física de sonido/pantalla completa en iPhone y conexión real a Google.

## Usuarios conectados 3.4

- [x] Servicio real preparado y URL configurada.
- [x] Alta directa desde portada con nombre válido aunque no exista partida local.
- [x] Botones de crear usuario y entrar visibles desde el principio.
- [x] Ventana de carga contextual para registro, acceso, recuperación y confirmación de acciones.
- [x] Reintentos y fallos de red devuelven el control sin mezclar partidas.
- [x] 68 comprobaciones automáticas y prueba real de API con dos sesiones independientes.
- [ ] Revisión visual del despliegue 3.4.
