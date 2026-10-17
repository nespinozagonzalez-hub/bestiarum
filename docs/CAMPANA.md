# Las Crónicas del Velo · Campaña 3.2

## Checklist de esta ampliación

- [x] Prólogo de cuatro escenas, accesible desde la portada y tras la iniciación.
- [x] Quince capítulos ilustrados: prólogo, seis entradas, seis cierres, desenlace y escena de colección completa.
- [x] Lectura manual, saltar mediante «Continuar después», relectura y página recordada.
- [x] Sección permanente de Crónicas, avisos discretos y títulos velados hasta desbloquear.
- [x] Entrada regional por contrato; cierre por todas las capturas regionales.
- [x] Desenlace por Quimerax, respetando sus seis requisitos originales; escena adicional con 22 bestias.
- [x] Kael, Brann e Iria con voces recurrentes y confidencias desbloqueadas por Vínculo.
- [x] Cinco investigaciones opcionales, tres resoluciones y un vestigio por lugar; Astucia abre la tercera vía.
- [x] Percepción y farol equipado revelan pistas; Percepción II añade interpretación.
- [x] Ocho recetas únicas, coste visible, consumo real y equipo en tres ranuras.
- [x] Equipo mostrado con emblemas en credencial y taller; el farol equipado afecta las investigaciones.
- [x] Cuatro talentos, dos niveles por talento y ocho puntos máximos derivados de capturas y regiones.
- [x] Oficio descuenta materiales realmente; costes pagados registrados para futuras migraciones.
- [x] Seis reliquias regionales derivadas, vestigios de las investigaciones y memorial del cazador.
- [x] Atlas con estado restaurado y texto ambiental; temas regionales desbloqueables para el refugio.
- [x] Faro cooperativo: recuentos agregados y tres hitos compartidos desde el servidor.
- [x] Guardado local compatible y operaciones de campaña validadas en Apps Script.
- [x] Repeticiones, migración con materiales gastados y datos de usuario comprobados en simulación.
- [ ] Activar la URL real de Google y probar sincronización entre dispositivos.
- [ ] Recibir la revisión del usuario sobre ritmo, tono y equilibrio de recetas y talentos.

## Qué cambia para quienes ya juegan

Se conservan IDs, códigos, XP, materiales y capturas. Los capítulos, las reliquias y los puntos disponibles se calculan con las capturas que ya existen: nadie necesita repetir una expedición. No hay un premio adicional de XP por releer ni por cerrar una región. Su recompensa especial es una reliquia, un capítulo, un punto de senda y un tema de refugio. Las cantidades originales de botín se entregan en la captura; la forja permite gastarlas después, voluntariamente.

La especialidad elegida al registrarse sigue siendo una identidad narrativa. Los cuatro talentos se aprenden con puntos; todos los cazadores pueden escoger cualquiera de ellos. Esto evita ventajas accidentales al cambiar la apariencia o la especialidad.

El equipo se representa mediante emblemas y nombres junto al retrato. No son nuevas ilustraciones del personaje vestido con cada pieza. Los capítulos reutilizan los siete escenarios originales ya ilustrados, con composición de novela gráfica y texto independiente y legible.

## Ritmo durante el año

1. Inicio: leer el prólogo, prestar juramento y recibir el primer contrato externo.
2. Cada expedición: el responsable entrega códigos mediante sus actividades; la interfaz solo habla de contratos y sellos.
3. Entre códigos: leer archivos, investigar lugares, forjar, equipar y elegir talentos.
4. Cierre de región: aparece un capítulo, se restaura su ambiente y se obtiene una reliquia y un tema.
5. Último umbral: Quimerax exige las mismas seis capturas clave. El desenlace puede leerse antes de terminar toda la colección.
6. Colección completa: escena de la séptima llama y memorial con los progresos y recuerdos del cazador.

No hay caducidad de capítulos, rachas diarias, penalizaciones por llegar tarde ni captura aleatoria fallida. La distribución de los códigos determina el ritmo. Hay 22 capturas: para un curso de más semanas se pueden distribuir contratos, capturas y pausas de lectura sin inventar códigos adicionales.

## Guardado y servidor

`campaign` conserva páginas, capítulos leídos, piezas, equipo, talentos, decisiones, tema y materiales gastados. Capítulos y reliquias se derivan de los sellos; no se aceptan desde el cliente como premios. Las operaciones remotas llevan identificador y firma; un reintento no vuelve a descontar materiales.

El faro suma capturas de las cuentas que comparten esta hoja, sin enviar sus nombres ni sus estados. Hitos: 10, 30 y 60 sellos totales. Son tres cambios narrativos del lugar común, sin premios de XP. Para separar cursos se usa una instalación/hoja por Gremio. La vista local no simula compañeros ni progreso colectivo.

La instalación de Google sigue pendiente. Reemplazar `Code.gs` por la versión 3.2 completa y desplegar una nueva versión antes de configurar `/exec`; el cliente nuevo necesita las acciones `campaign` y `community`.

## Desarrollo y comprobación

Editar las reglas en `assets/js/campaign.js` y la interfaz en `assets/js/campaign-ui.js`. Ejecutar `python scripts/build-campaign.py` para actualizar las copias incluidas en `backend/Code.gs` y el controlador. No editar las regiones entre marcadores manualmente.

La comprobación automática incluye `tests/campaign.cjs`, además de las tres suites previas. Los informes distinguen pruebas simuladas de revisión en navegador y de la conexión real a Google, que sigue pendiente.
