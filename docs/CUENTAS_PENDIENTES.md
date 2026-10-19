# Usuarios y Google Sheets · conexión activada

La URL `/exec` está configurada en `assets/js/config.js`. El servicio responde `ready: true` y permite crear cuentas desde la portada y recuperar la crónica con el mismo usuario y código de seis números.

El progreso de la cuenta se confirma en Google; el guardado local anterior se conserva aparte. Una sesión de doce horas se conserva durante la sesión del navegador; en otro navegador o dispositivo se vuelve a entrar con las mismas credenciales.

El informe `live-connection-validation.json` registra las pruebas reales. La cuenta cuyo nombre empieza por `qa_bst_` se creó únicamente para validar el despliegue. Su código de acceso y sus tokens no se publican; ambas sesiones de prueba se cierran al terminar.

La ventana de carga muestra la consulta al iniciar sesión, recuperar el avance y confirmar las acciones. Un fallo de red devuelve el control y conserva la última crónica disponible.

No hace falta modificar ni volver a desplegar `Code.gs` para esta activación del cliente.
