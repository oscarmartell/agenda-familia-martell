# Agenda Familia Martell: GitHub con PIN familiar de 4 números

La dirección visible es https://oscarmartell.github.io/agenda-familia-martell/. GitHub contiene la agenda servida por Google Apps Script dentro de un iframe; no redirige. El PIN se comprueba en el servidor y nunca se guarda en GitHub, en el HTML ni en el calendario.

## Actualizar la implementación actual

1. En Google Apps Script reemplazar Código.gs por apps-script/Code.gs y el HTML Index por apps-script/Index.html. Conservar la I mayúscula. No copiar index.html de la raíz, que es el contenedor de GitHub.
2. Configuración del proyecto → Propiedades: conservar FAMILY_CALENDAR_ID y establecer FAMILY_PASSWORD con un PIN de exactamente 4 números (puede comenzar con cero). No escribirla en GitHub ni compartirla en el chat.
3. Guardar y publicar en la misma implementación: Implementar → Administrar implementaciones → implementación actual → lápiz → Nueva versión → Implementar. Para poder mostrarla dentro de GitHub sin inicio de sesión de Google, el despliegue debe permitir cualquier usuario y ejecutarse como la cuenta dueña. La contraseña de esta aplicación protege todas las lecturas y escrituras.
4. Archivar otras implementaciones antiguas que hayan quedado activas sin contraseña, para que no conserven acceso por sus enlaces. Actualizar esta implementación no modifica automáticamente las demás.
5. Abrir la página de GitHub y recargar. Ingresar la contraseña para ver Familia. Probar desde el celular. Si el navegador o Google Workspace bloquea la integración, informar el mensaje: la integración en producción necesita verificación real.

La URL /exec actual debe permanecer en config.js, en FAMILY_APP_URL. Si se crea otra implementación cambia la URL; preferir editar la existente. El dominio visible del navegador será GitHub aunque el contenido privado se sirva desde Google.

## Protección de la integración

Apps Script habilita ALLOWALL para poder mostrar la página en un iframe. Antes de mostrar el formulario se verifica un intercambio de mensajes con la ventana superior cuyo origen debe ser exactamente https://oscarmartell.github.io. GitHub rechaza ejecutarse dentro de otra ventana y solo responde a orígenes oficiales de Google. Ningún mensaje transmite contraseña ni token. Abrir el enlace de Google directamente ofrece volver a GitHub.

Las sesiones son temporales y están ligadas a la contraseña vigente. Cambiar FAMILY_PASSWORD invalida sesiones previas; los tokens de la versión de acceso público tampoco se aceptan. Diez intentos de contraseña incorrecta bloquean los nuevos ingresos hasta 15 minutos de forma global. Es una clave compartida, sin identificación individual.

## Comportamiento

- Calendario limitado a Familia por ID y nombre; no se usa el calendario principal.
- Agenda desde hoy, días vacíos ocultos, encabezado fijo y navegación mensual.
- Carga por texto con reglas, sin IA ni audio, con revisión antes de guardar.
- Completado se guarda solo en propiedades de la app, sin cambios en Google Calendar.
- Reagendar modifica el mismo evento, tras confirmación. Las series recurrentes se reagendan desde Google Calendar. Se rechazan cambios concurrentes y los reintentos no duplican eventos.

## Verificación

node check.cjs comprueba interpretación y sintaxis; node ui-check.cjs comprueba la agenda y el intercambio de mensajes permitido/rechazado; node server-check.cjs comprueba contraseña, sesiones, completado sin escrituras en Calendar y reagendado. Son pruebas con servicios simulados. No se ha comprobado la integración real en el navegador ni la publicación de Apps Script hasta que el dueño lo confirme.
