# Activar la agenda real

GitHub Pages abre directamente la agenda privada alojada en Google Apps Script. Ya no hay una demostración con actividades ficticias. No hay IA: la interpretación de texto usa reglas y exige revisar los campos.

## 1. Google Apps Script

1. Con la cuenta de Google dueña de Familia, abrir https://script.google.com/home/start y crear un proyecto llamado Agenda Familia.
2. Reemplazar Code.gs por el contenido de apps-script/Code.gs.
3. Crear un archivo HTML llamado Index (I mayúscula) y copiar apps-script/Index.html completo. No copiar el index.html de la raíz, que solo abre la agenda.
4. Configuración del proyecto → Propiedades de la secuencia de comandos: agregar FAMILY_CALENDAR_ID con el ID de Familia (Google Calendar → Configuración de Familia → Integrar calendario), y FAMILY_PASSWORD con una contraseña de al menos 16 caracteres. No guardar estos valores en GitHub ni enviarlos por este chat.
5. Configuración del proyecto → zona horaria: America/Argentina/Buenos_Aires. Si se edita el manifiesto, usar apps-script/appsscript.json.
6. Implementar → Nueva implementación → Aplicación web. Ejecutar como tu cuenta. Elegir el acceso que permita a tus familiares abrirla; la contraseña se exige antes de todas las consultas y cambios. Si Google Workspace no permite visitantes externos, se necesitará que el administrador lo habilite o usar otra cuenta autorizada.
7. Autorizar Calendar en Google y copiar la URL que termina en /exec. No compartir tokens ni contraseñas. La app nunca permite elegir otro calendario.
8. Abrir esa URL e ingresar la contraseña. Verificar que muestre los eventos existentes de Familia. Crear una actividad de prueba solo cuando quieras, comprobarla en Google Calendar, marcarla completa y abrir la app desde otro dispositivo para verificar el estado compartido.

## 2. GitHub Pages

En el repositorio → Settings → Pages → Deploy from a branch → main → / (root) → Save. Dirección esperada: https://oscarmartell.github.io/agenda-familia-martell/

Para ofrecer el acceso a la agenda real desde Pages, copiar la URL /exec en config.js, en FAMILY_APP_URL. Esa URL no es una contraseña. Pages redirige a la página de Google sin incrustarla, con un botón alternativo si el navegador no permite la redirección.

## Actualizar a completado independiente y reagendado

Reemplazar tanto Código.gs como Index en Google Apps Script por apps-script/Code.gs y apps-script/Index.html. Guardar y actualizar la misma implementación: Implementar → Administrar implementaciones → lápiz → Nueva versión → Implementar. Se conservan la contraseña, el ID de Familia y la URL /exec. Hasta publicar esa versión, el servidor anterior sigue funcionando como antes.

Marcar completado o pendiente solo guarda o elimina una propiedad de esta aplicación; no cambia título, fecha, color, descripción ni etiquetas del evento de Google Calendar. El estado es compartido entre los familiares que usan la misma implementación. Las etiquetas de completado que haya creado una versión anterior no se borran ni se reutilizan.

Reagendar abre un formulario con la fecha y el horario actuales. Requiere confirmar antes de modificar el mismo evento en Familia. Conserva título, lugar y el estado completado de las actividades individuales. Los eventos de todo el día conservan su duración. Las series recurrentes se reagendan desde Google Calendar y el botón lo indica; el estado completado sí puede registrarse por ocurrencia. La app rechaza cambios si alguien ya modificó el horario desde que se cargó la agenda.

## Uso y límites

- Texto admitido: `22/10 odontóloga Heidi 14 horas`, `mañana pediatra a las 16:30`, `hoy reunión a las 18` y fechas con año. Sin año usa el año actual; siempre se confirma la fecha antes de enviar. Si falta fecha u hora se completa manualmente.
- Horario fijo de Argentina; duración sugerida de una hora, editable. Las actividades que cruzan medianoche se cargan desde Google Calendar.
- Sesión de hasta 6 horas, conservada solo en memoria. Al recargar se pide contraseña. El caché puede expirar antes y requerir ingresar de nuevo.
- La contraseña se valida en Google. Tras 10 errores, el acceso se bloquea globalmente hasta 15 minutos; alguien que conozca la URL podría provocar ese bloqueo. Usar una frase larga y cambiar la propiedad FAMILY_PASSWORD para revocar futuros ingresos. Las sesiones existentes expiran en hasta seis horas.
- El estado completado se guarda fuera de Calendar, en las propiedades privadas de Apps Script. No implica ninguna escritura en el calendario.
- Las claves del calendario y la contraseña nunca deben subirse al repositorio. El permiso OAuth de Calendar es más amplio que Familia, pero el servidor restringe cada operación al ID configurado y exige que su nombre sea Familia.
- Las pruebas locales usan servicios simulados y no demuestran la sincronización real. El dueño debe confirmar el ingreso y la lectura, y probar una actividad identificada antes de dar por verificado el acceso real.
