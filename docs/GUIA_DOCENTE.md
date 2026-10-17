# Uso del Bestiarium 3.0

La interfaz de los jugadores es transversal: no muestra asignaturas, contenidos científicos ni instrucciones dirigidas al docente. Puede acompañar desafíos individuales o por equipos y cualquier área de aprendizaje.

1. Cada persona o equipo inscribe un nombre, elige apariencia, senda y origen.
2. Al comenzar la expedición, comparte el código inicial del territorio.
3. El contrato activa los rastros sin revelar nombres, historia ni ilustración completa.
4. Al completar el desafío externo, entrega el código final de la bestia correspondiente.
5. El sello registra una única captura y entrega los XP y materiales originales.
6. La ceremonia permite avanzar manualmente por verificación, revelación y botín; no obliga a esperar una animación.

Los códigos originales y sus contenidos asociados se conservan en `catalogo-docente.json`. Para un uso transversal, vincula cada sello a tu propio desafío. Las actividades científicas del archivo no se cargan en las pantallas de aventura.

## Territorios

| Identificador | Nombre de la remasterización | Bestias |
|---|---|---:|
| pantano | Ciénaga del Velo | 5 |
| bosque | Bosque de las Raíces Huecas | 4 |
| crater | Cráter de las Mil Formas | 4 |
| forja | Forja de las Cenizas | 4 |
| ruinas | Ruinas del Rey Olvidado | 4 |
| dominio | Dominio de Quimerax | 1 |

Quimerax conserva sus seis requisitos: virulox, bacillus, osmogarra, cromavorax, mitocrix y hormonarca. El aviso de requisitos pendientes identifica registros y territorios sin revelar los nombres de las bestias desconocidas.

## Progreso y respaldo

El progreso permanece en el mismo navegador. El selector de apariencia y juramento conserva todas las capturas. Ajustes y guía permite descargar un respaldo JSON. Si el almacenamiento del navegador falla, el cambio se revierte y aparece un aviso; no se anuncia como guardado.

El archivo descargado no se importa automáticamente: la migración futura a cuentas debe verificarse contra un registro autorizado. No se ha habilitado un botón de reinicio destructivo.

## Arte

Las ilustraciones se generaron individualmente mediante ImageGen. Las especificaciones se documentan en `art-prompts.json`. Las bestias se generan con transparencia y la web utiliza WebP optimizado para colección y ceremonia; las regiones tienen fondos panorámicos y los cazadores retratos propios. La ficha compone cada bestia sobre su territorio; no necesita descargar otra ilustración completa redundante.

## Reversión

La versión original permanece en el historial de Git y en la rama `backup/pre-remaster-2026-10-16`. Para revertir la interfaz, restaurar el commit anterior con un nuevo commit. No borrar ni sustituir las claves de almacenamiento de los jugadores.
