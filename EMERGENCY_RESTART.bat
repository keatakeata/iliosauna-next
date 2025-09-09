@echo off
echo ========================================
echo        EMERGENCY RESTART
echo ========================================
echo.

echo Killing all Node.js processes...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im npm.exe >nul 2>&1

echo Waiting 3 seconds...
timeout /t 3 >nul

echo Clearing port 4448...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :4448') do (
    taskkill /f /pid %%a >nul 2>&1
)

echo Clearing port 3333...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3333') do (
    taskkill /f /pid %%a >nul 2>&1
)

echo.
echo ✅ Emergency cleanup complete!
echo You can now run BULLETPROOF_DEV.bat
echo.
pause