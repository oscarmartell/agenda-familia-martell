# Agenda Familia Martell — acceso directo sin contraseña

La página de GitHub muestra la agenda directamente, sin PIN ni formulario de acceso. Apps Script funciona en un iframe oculto como servicio para el calendario Familia. La dirección visible permanece en GitHub.

El dueño autorizó expresamente el acceso sin contraseña y conoce que el servicio directo permite consultar, agregar y reagendar actividades sin autenticar identidad. Las sesiones técnicas solo ordenan las solicitudes.

## Activación

La copia de Código.gs del repositorio no utiliza FAMILY_PASSWORD. Si el despliegue de Google todavía pide configurar esa propiedad, sigue ejecutando una versión anterior: reemplazar Código.gs por apps-script/Code.gs, guardar y actualizar la misma implementación con Nueva versión. No crear otra implementación ni cambiar la URL /exec. Mantener FAMILY_CALENDAR_ID. Index.html debe contener el puente apps-script/Index.html ya preparado.

La interfaz conserva las funciones y el diseño de la agenda. No hay opción para cambiar una clave porque no se solicita ninguna. Un error de conexión se muestra con un botón de reintento; no se recarga automáticamente.

Pruebas locales: open-ui-check.cjs, native-check.cjs y server-check.cjs. La verificación real requiere que el proyecto de Google tenga publicada la versión sin contraseña.
