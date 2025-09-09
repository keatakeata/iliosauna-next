@echo off
echo Starting Ilio Sauna Website and Sanity Studio...
echo.

echo [+] Opening Sanity Studio in new window...
start "Sanity Studio - PORT 3333" cmd /k "cd /d %~dp0 && npm run sanity:dev"

echo [+] Opening Next.js Website in new window...
start "Next.js - PORT 4448" cmd /k "cd /d %~dp0 && npm run dev"

echo [+] Both windows should now be open!
echo.
echo Close both windows when you're done testing.
echo.
echo Sanity Studio: http://localhost:3333
echo Next.js Website: http://localhost:4448
echo.
pause
