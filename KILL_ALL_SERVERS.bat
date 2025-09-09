@echo off
echo Killing all Node.js processes...
taskkill /f /im node.exe 2>nul
taskkill /f /im npm.cmd 2>nul
taskkill /f /im npx.cmd 2>nul

echo Clearing port 4448...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :4448') do taskkill /f /pid %%a 2>nul

echo All servers killed. You can now start fresh.
pause