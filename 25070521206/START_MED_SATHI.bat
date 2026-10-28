@echo off
title Med-Sathi Clinical Platform Launcher
echo ========================================================
echo        Starting Med-Sathi Clinical Platform...
echo ========================================================
echo.

set ROOT_DIR=%~dp0

if exist "%ROOT_DIR%25070521206\server" (
    set SERVER_DIR=%ROOT_DIR%25070521206\server
    set CLIENT_DIR=%ROOT_DIR%25070521206\client
) else (
    set SERVER_DIR=%ROOT_DIR%server
    set CLIENT_DIR=%ROOT_DIR%client
)

echo [1/3] Starting Backend API Server (Port 5000)...
start "Med-Sathi Backend Server" cmd /k "cd /d "%SERVER_DIR%" && npm run dev"

echo [2/3] Starting Frontend Client (Port 3000)...
start "Med-Sathi Frontend Client" cmd /k "cd /d "%CLIENT_DIR%" && npm run dev"

echo [3/3] Waiting for servers to initialize...
timeout /t 3 /nobreak >nul

echo.
echo Launching http://localhost:3000 in your browser...
start http://localhost:3000

echo.
echo ========================================================
echo  Med-Sathi is now running at http://localhost:3000!
echo  Keep the server windows open while using the website.
echo ========================================================
echo.
pause
