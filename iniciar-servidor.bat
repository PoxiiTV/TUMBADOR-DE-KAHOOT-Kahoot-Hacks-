@echo off
cd /d "%~dp0"
title TUMBADOR - Servidor
echo Iniciando servidor en http://localhost:32853
echo Cierra esta ventana para parar el servidor.
echo.
node server.js
pause
