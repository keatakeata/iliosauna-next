@echo off
echo 🧹 CLEAN RESTART - Killing all server processes and starting fresh...
echo.

echo [+] Killing any remaining Node processes...
taskkill /F /IM node.exe /T 2>nul
taskkill /F /IM npm.exe /T 2>nul

echo [+] Waiting for processes to terminate...
timeout /t 3 /nobreak > nul

echo [+] Opening NOEX window for Sanity Studio...
start "Sanity Studio - http://localhost:3333" cmd /k "cd /d %~dp0 && npm run sanity:dev"

echo [+] Opening NOEX window for Next.js Website...
start "Next.js Website - http://localhost:4448" cmd /k "cd /d %~dp0 && npm run dev"

echo [+] All set! Two command windows should have opened.
echo.
echo [+] Wait for both to show "Ready" messages, then browse:
echo    - Sanity Studio: http://localhost:3333
echo    - Next.js Website: http://localhost:4448
echo.
pause
