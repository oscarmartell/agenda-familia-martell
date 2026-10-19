# Agenda Familia Martell — entrada visual en GitHub

La interfaz y el ingreso con PIN se muestran en GitHub Pages. La dirección visible permanece en https://oscarmartell.github.io/agenda-familia-martell/. Apps Script funciona en un iframe oculto para consultar y modificar el calendario Familia.

El dueño confirmó expresamente que el PIN solo se valide en GitHub y que Apps Script no tenga contraseña. El PIN es una barrera visual que se puede saltear. El servicio directo permite consultar, agregar y reagendar eventos sin autenticación. Los tokens de sesión solo ordenan las solicitudes y no prueban la identidad de quien los obtiene. El PIN no se transmite a Google ni aparece en estas instrucciones públicas.

## Activación

1. Reemplazar Código.gs con apps-script/Code.gs e Index.html con apps-script/Index.html (I mayúscula).
2. Conservar FAMILY_CALENDAR_ID. FAMILY_PASSWORD ya no se lee y puede dejarse como está o eliminarse.
3. Guardar y actualizar la misma implementación: Implementar, Administrar implementaciones, lápiz, Nueva versión, Implementar. No crear otra implementación. La URL /exec debe coincidir con config.js.
4. Abrir la web de GitHub, ingresar el PIN elegido y verificar primero la lectura del calendario.

No hay opción para cambiar el PIN en la agenda. Se cambia el verificador de la interfaz de GitHub cuando lo solicite el dueño, sin modificar Apps Script. Se conservan diseño compacto, encabezado fijo, inicio desde hoy, días vacíos ocultos, creación con confirmación, completado separado de Calendar y reagendado de eventos individuales.

Las pruebas locales comprueban el PIN visual, que no se transmite a Google, el puente de mensajes, las operaciones de calendario y la navegación. Falta verificar la conexión real después de publicar los dos archivos en Apps Script.
