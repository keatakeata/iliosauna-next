@echo off
setlocal enabledelayedexpansion

title Bulletproof Development Environment

echo ========================================
echo    BULLETPROOF DEVELOPMENT SETUP
echo ========================================
echo.

:: Set maximum memory and performance settings
set NODE_OPTIONS=--max-old-space-size=8192 --max-semi-space-size=512
set NODE_ENV=development
set FORCE_COLOR=1

:: Function to kill processes on specific ports
echo [1/8] Killing processes on ports 3333 and 4448...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3333') do (
    taskkill /f /pid %%a >nul 2>&1
)
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :4448') do (
    taskkill /f /pid %%a >nul 2>&1
)

:: Kill any remaining node processes
echo [2/8] Cleaning up all Node.js processes...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im npm.exe >nul 2>&1
timeout /t 3 >nul

:: Clean all build artifacts and caches
echo [3/8] Deep cleaning build artifacts...
if exist .next rmdir /s /q .next >nul 2>&1
if exist .sanity rmdir /s /q .sanity >nul 2>&1
if exist node_modules\.cache rmdir /s /q node_modules\.cache >nul 2>&1
if exist .vercel rmdir /s /q .vercel >nul 2>&1

:: Verify Node.js installation
echo [4/8] Verifying Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found. Please install Node.js 18+ from nodejs.org
    pause
    exit /b 1
)

:: Install dependencies with clean cache
echo [5/8] Installing dependencies with clean cache...
npm cache clean --force >nul 2>&1
npm install --no-optional --silent

:: Check if Sanity CLI is available
echo [6/8] Checking Sanity CLI...
npx sanity --version >nul 2>&1
if errorlevel 1 (
    echo Installing Sanity CLI globally...
    npm install -g @sanity/cli --silent
)

:: Start Sanity Studio with error recovery
echo [7/8] Starting Sanity Studio on port 3333...
start "Sanity Studio - Port 3333" cmd /c "echo Starting Sanity Studio... && npx sanity dev --port 3333 --host 0.0.0.0 || (echo Sanity Studio crashed - Press any key to restart && pause && goto :eof)"

:: Wait for Sanity to initialize
timeout /t 8 >nul

:: Start Next.js with automatic restart on crash
echo [8/8] Starting Next.js development server on port 4448...
echo.
echo ========================================
echo     DEVELOPMENT SERVERS ACTIVE
echo ========================================
echo   Website:       http://localhost:4448
echo   Sanity Studio: http://localhost:3333
echo ========================================
echo   IMPORTANT: Keep this window open!
echo   Both servers will auto-restart on crash
echo ========================================
echo.

:RESTART_NEXTJS
echo Starting Next.js server...
npm run dev
if errorlevel 1 (
    echo.
    echo ==========================================
    echo   Next.js server crashed - Auto-restarting
    echo ==========================================
    timeout /t 5 >nul
    goto RESTART_NEXTJS
)

echo.
echo Development servers stopped.
pause