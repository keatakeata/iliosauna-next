@echo off
echo ========================================
echo        SERVER STATUS CHECK
echo ========================================
echo.

echo Checking port 4448 (Next.js)...
netstat -an | findstr :4448 >nul
if errorlevel 1 (
    echo   ❌ Next.js server is NOT running on port 4448
) else (
    echo   ✅ Next.js server is running on port 4448
)

echo.
echo Checking port 3333 (Sanity Studio)...
netstat -an | findstr :3333 >nul
if errorlevel 1 (
    echo   ❌ Sanity Studio is NOT running on port 3333
) else (
    echo   ✅ Sanity Studio is running on port 3333
)

echo.
echo Checking Node.js processes...
tasklist | findstr node.exe >nul
if errorlevel 1 (
    echo   ❌ No Node.js processes found
) else (
    echo   ✅ Node.js processes are running
    echo.
    echo Active Node.js processes:
    tasklist | findstr node.exe
)

echo.
echo ========================================
pause