@echo off
echo ========================================
echo   GENERADOR DE APK - STYLE MONITOR
echo ========================================
echo.

echo [1/3] Asegurando que estas en la carpeta correcta...
cd /d "%~dp0"

echo [2/3] Verificando dependencias...
call npm install

echo [3/3] Iniciando compilacion de APK (EAS Build)...
echo.
echo NOTA: Si es la primera vez, te pedira iniciar sesion en Expo.
echo.
npx eas build --platform android --profile preview

echo.
echo ========================================
echo   SI EL PROCESO TERMINO, REVISA EL LINK
echo   DE EXPO PARA DESCARGAR TU APK.
echo ========================================
pause
