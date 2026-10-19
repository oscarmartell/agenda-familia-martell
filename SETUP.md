# Agenda Familia Martell: acceso por enlace

Esta versión no pide contraseña adicional. Cualquier persona que tenga el enlace y pueda abrir el despliegue de Google puede leer, agregar y reagendar actividades de Familia. GitHub Pages abre directamente esa agenda, sin datos de demostración.

## Actualizar

1. Reemplazar Código.gs en Google Apps Script por apps-script/Code.gs.
2. Reemplazar el HTML llamado Index (I mayúscula) por apps-script/Index.html. No usar el index.html de la raíz, que solo abre el enlace.
3. Guardar. Implementar → Administrar implementaciones → implementación actual → lápiz → Nueva versión → Implementar.
4. Abrir el mismo enlace /exec y recargar. No se pide contraseña. Hasta publicar esta versión, sigue funcionando la anterior.

Conservar FAMILY_CALENDAR_ID en las propiedades del proyecto. FAMILY_PASSWORD ya no se utiliza y se puede eliminar. No es necesario compartir ni modificar la contraseña de Google.

## Primera instalación

Crear un proyecto en https://script.google.com/home/start con la cuenta que administra Familia, agregar los archivos de apps-script y elegir la zona horaria de Buenos Aires. Configurar FAMILY_CALENDAR_ID con el ID de Familia. La app rechaza el calendario principal y calendarios que no se llamen Familia.

Publicar como aplicación web ejecutando como la cuenta dueña. Elegir quién puede abrir la app; Cualquier usuario permite acceso por enlace sin otra contraseña. Las políticas de Google Workspace pueden restringir visitantes externos. Autorizar Calendar.

## GitHub Pages

Settings → Pages → Deploy from a branch → main → / (root) → Save. En config.js, FAMILY_APP_URL debe contener la URL /exec actual. Pages redirige a Google y ofrece un botón alternativo.

## Funciones

- Agenda compacta desde hoy, sin días vacíos; encabezado y controles fijos, lista desplazable y navegación entre meses.
- Texto con reglas de fechas y horas, sin audio ni API de IA. Ejemplo: 22/10 odontóloga Heidi 14 horas. Se confirma antes de guardar. Horario argentino; duración sugerida de una hora, editable. Para eventos nuevos que crucen medianoche, usar Google Calendar.
- Completado se guarda en las propiedades de esta aplicación y no modifica Google Calendar. Es compartido entre quienes usan la implementación. Las etiquetas guardadas por versiones antiguas no se borran ni reutilizan.
- Reagendar modifica el mismo evento en Familia tras confirmar fecha y horario. Conserva título, lugar y estado completado. Eventos de todo el día conservan su duración. Series recurrentes se reagendan desde Calendar; el completado admite una marca por ocurrencia.
- Los cambios concurrentes se rechazan y reintentar el mismo reagendado no crea duplicados.
- La sesión temporal se inicia automáticamente, sin contraseña. Si vence, recargar la página. No identifica al visitante: cualquiera con acceso a la app puede obtener una sesión.

## Verificación

Ejecutar node check.cjs, node ui-check.cjs y node server-check.cjs. Las pruebas usan servicios simulados y no comprueban el despliegue ni el acceso real. El dueño debe verificar la lectura y probar una actividad identificada.
