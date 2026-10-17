# Siguiente etapa: archivos remotos del Gremio

La remasterización visual se detiene antes de activar cuentas. No hay una URL de Apps Script ficticia ni campos de contraseña sin autenticación.

## Preparar en la siguiente sesión

1. Crear una hoja de cálculo propia de Bestiarium y un proyecto de Apps Script asociado.
2. Guardar el catálogo de códigos y recompensas en el servidor. Las versiones públicas actuales conservan los códigos originales; no constituyen un mecanismo de autorización seguro.
3. Implementar nombre de usuario y clave de seis dígitos con hash con sal, límites de intentos, identificadores de sesión aleatorios, expiración y revocación. Nunca almacenar claves o tokens de administración en el repositorio o la hoja de progreso en texto plano.
4. Validar apertura, requisitos y captura en el servidor. Utilizar un identificador de evento, bloqueo de transacciones y registro único por usuario/bestia para impedir doble recompensa.
5. Sincronizar perfil, capturas, XP, inventario, fechas, preferencias e historial. La respuesta del servidor será la autoridad sobre recompensas.
6. Registrar estados de conexión y mensajes del Gremio: consultando, guardado y reintento. No anunciar guardado remoto antes de confirmarlo.
7. Mantener el respaldo V2.5. Solicitar validación del responsable para migraciones; no aceptar XP o inventario arbitrario de un archivo local como prueba de logros.
8. Probar recuperación de sesión, claves incorrectas, concurrencia, desconexión durante una captura y migración parcial antes de activar la opción para jugadores.

El adaptador `GuildStorage` concentra la lectura y escritura local. La integración remota deberá añadir operaciones transaccionales de dominio para abrir contratos y capturar: no basta con reemplazar `localStorage` por una subida de JSON, porque eso permitiría inventar progreso desde el navegador.
