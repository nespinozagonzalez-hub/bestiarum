# Usuarios, personaje y guardado automático · 3.5

La URL `/exec` está configurada y responde. Crear usuario y cazador es un único formulario: usuario, código de seis números, nombre del personaje, apariencia, senda y origen. El prólogo comienza después de registrar la cuenta. La otra opción de portada recupera la historia existente.

El avance confirmado se conserva automáticamente en Google y en `bestiarium.chronicle.v35`. Esta copia local solo contiene identificación y progreso, nunca PIN ni token. La sesión de doce horas se mantiene en `sessionStorage`. Entrar desde otro navegador recupera el estado del servidor; una sesión terminada vuelve al acceso y no abre otra partida local.

Los errores se muestran junto al formulario, conservan los datos para corregirlos y explican cuándo continuar con un usuario existente. Las consultas esperan hasta 60 segundos para tolerar el arranque de Apps Script; no se repite un registro automáticamente.

Las partidas antiguas y `bestiariumV25.pre-remaster` permanecen intactas. Su migración no acredita recompensas sin revisión.

Informes: `accounts-validation.json`, `account-loading-validation.json`, `live-onboarding-validation.json`. La cuenta QA del último informe comprueba el alta real y dos sesiones independientes; ambas se cierran al finalizar. No se guardan credenciales de prueba.

No hace falta modificar ni desplegar otra vez `Code.gs`.
