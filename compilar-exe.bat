@echo off
cd /d "%~dp0"
echo Compilando TUMBADOR DE KAHOOT...
echo Al abrir el .exe se inicia el servidor y se abre el navegador con la interfaz.
echo.
call npm run build
echo.
if %ERRORLEVEL% equ 0 (
    echo Listo. El .exe y la carpeta public estan en: dist\
    start dist
) else (
    echo Hubo un error al compilar.
    pause
)
