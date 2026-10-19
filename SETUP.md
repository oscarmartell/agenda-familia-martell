# Agenda Familia Martell — interfaz en GitHub

La interfaz y el formulario de PIN se sirven desde GitHub Pages. La dirección visible permanece en https://oscarmartell.github.io/agenda-familia-martell/. Apps Script funciona en un iframe oculto como conexión con Calendar.

## Activación

1. Reemplazar Código.gs por apps-script/Code.gs y el HTML Index por apps-script/Index.html (I mayúscula).
2. Conservar FAMILY_CALENDAR_ID. Configurar FAMILY_PASSWORD con el PIN de cuatro cifras elegido privadamente por el dueño. No publicar ese PIN en el repositorio.
3. Guardar y actualizar la misma implementación: Implementar, Administrar implementaciones, lápiz, Nueva versión, Implementar. No crear otra implementación. La URL /exec debe coincidir con config.js.
4. Abrir la página de GitHub e ingresar el PIN. Verificar primero la lectura de Familia y después probar una actividad.

El PIN se valida en el servidor. No hay botón, formulario ni función pública para cambiarlo. Si el dueño desea cambiarlo, lo pedirá en ChatGPT y se actualizará la propiedad del servidor.

Se conserva el diseño compacto, encabezado fijo, inicio desde hoy, días vacíos ocultos, carga con confirmación, completado separado de Calendar y reagendado de eventos individuales. Las series recurrentes se gestionan en Calendar.

El puente valida origen, procedencia del iframe, canal y operaciones permitidas. Google puede pedir autorización si cambian permisos o despliegue. Las pruebas locales verifican autenticación, operaciones de Calendar, navegación y mensajes; falta verificar la conexión real después de actualizar Apps Script.
