@echo off
title BULLETPROOF DEV SERVER - DO NOT CLOSE
echo ========================================
echo BULLETPROOF DEV SERVER STARTING
echo This will keep your server running at http://localhost:4448
echo DO NOT CLOSE THIS WINDOW
echo ========================================

:start
echo [%time%] Starting development server...
npm run dev

echo [%time%] Server stopped. Restarting in 3 seconds...
timeout /t 3 /nobreak >nul
goto start