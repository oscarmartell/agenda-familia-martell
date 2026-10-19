# Agenda Familia Martell — pantalla de entrada en GitHub

GitHub Pages muestra un PIN visual de cuatro números. El PIN solicitado por el dueño es 2955 y está en el JavaScript público. No protege el servicio de Google ni impide abrir directamente su URL. No debe tratarse como autenticación segura.

Al ingresar el PIN se abre la agenda existente de Apps Script en la misma pestaña. La dirección pasa a ser la de Google. Esta variante no requiere cambiar el proyecto ni volver a publicar Apps Script. No usa iframe, contraseña en servidor ni una nueva integración.

En config.js se conserva la URL /exec actual. GitHub Pages se publica desde main, raíz del repositorio. Las actualizaciones de esta pantalla se realizan solo en GitHub.

Los archivos de apps-script del repositorio contienen otra variante de integración. No copiarlos ni desplegarlos para esta modificación: se usa exclusivamente la implementación de Google ya existente. Completado se guarda aparte del calendario y Reagendar cambia el mismo evento con confirmación, según la versión que ya haya publicado el dueño.

Verificar la entrada con node gateway-check.cjs. Las pruebas no verifican la publicación real ni el contenido actual del despliegue de Google.
