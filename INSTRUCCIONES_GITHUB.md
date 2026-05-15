# Guía de Despliegue - Style Aeternum Monitor 📱

Esta es la aplicación móvil oficial para monitorear el Bot de WhatsApp de Style Aeternum. Sigue estos pasos para subirla a tu GitHub y generar el archivo instalable para tu Android.

## 1. Subir a GitHub
Abre una terminal dentro de la carpeta `monitor-app` y ejecuta los siguientes comandos:

```bash
# 1. Conectar con tu repositorio (reemplaza con TU URL de GitHub)
git remote add origin https://github.com/TU_USUARIO/style-aeternum-monitor.git

# 2. Preparar los archivos
git add .
git commit -m "Versión inicial - App de Monitoreo"

# 3. Subir el código
git branch -M main
git push -u origin main
```

## 2. Crear el archivo instalable (.APK)
Para no depender de Expo Go, usaremos **EAS Build**. Es gratuito y te genera una app real.

1. Instala el CLI de EAS:

   `eas login`
3. Configura el proyecto de construcción:
   `eas build:configure`
4. Genera la app para Android (versión de prueba):
   `eas build --platform android --profile preview`

**Expo te dará un link de descarga al finalizar. ¡Ese archivo .apk lo instalas en tu celular y listo!**

## 3. Características de la App
- **Dashboard**: Resumen de ventas y lista de chats activos.
- **Chat**: Control total del bot y envío de mensajes manuales.
- **Ventana de 24h**: Indicadores visuales automáticos (Verde/Amarillo/Rojo).
- **Historial**: Buscador de clientes antiguos.

---
*Desarrollado con elegancia para Style Aeternum.*
