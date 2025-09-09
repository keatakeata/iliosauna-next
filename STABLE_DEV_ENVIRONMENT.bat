@echo off
setlocal enabledelayedexpansion

echo ========================================
echo    STABLE DEVELOPMENT ENVIRONMENT
echo ========================================
echo.

:: Set high memory allocation
set NODE_OPTIONS=--max-old-space-size=8192

:: Kill any existing processes first
echo [1/6] Cleaning up existing processes...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im npm.exe >nul 2>&1
timeout /t 2 >nul

:: Clean build artifacts
echo [2/6] Cleaning build artifacts...
if exist .next rmdir /s /q .next >nul 2>&1
if exist node_modules\.cache rmdir /s /q node_modules\.cache >nul 2>&1

:: Verify npm is working
echo [3/6] Verifying npm installation...
npm --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: npm not found. Please install Node.js
    pause
    exit /b 1
)

:: Install/update dependencies
echo [4/6] Ensuring dependencies are up to date...
npm install --silent

:: Start Sanity Studio in background
echo [5/6] Starting Sanity Studio on port 3333...
start "Sanity Studio" cmd /c "npm run sanity dev -- --port 3333 && pause"
timeout /t 5 >nul

:: Start Next.js development server
echo [6/6] Starting Next.js development server on port 4448...
echo.
echo ========================================
echo   SERVERS STARTING - DO NOT CLOSE
echo ========================================
echo   Next.js:      http://localhost:4448
echo   Sanity Studio: http://localhost:3333
echo ========================================
echo.

:: Start Next.js with error recovery
:START_NEXTJS
npm run dev
if errorlevel 1 (
    echo.
    echo ERROR: Next.js server crashed. Restarting in 3 seconds...
    timeout /t 3 >nul
    goto START_NEXTJS
)

pause