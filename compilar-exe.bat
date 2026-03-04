@echo off
cd /d "%~dp0"
echo Compilando TUMBADOR DE KAHOOT...
echo.
call npm run build
echo.
if %ERRORLEVEL% equ 0 (
    echo Listo. El .exe esta en la carpeta: dist\
    start dist
) else (
    echo Hubo un error al compilar.
    pause
)
