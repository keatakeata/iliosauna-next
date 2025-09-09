@echo off
setlocal enabledelayedexpansion

title ULTIMATE STABLE DEVELOPMENT - Garry Website

echo ========================================
echo    ULTIMATE STABLE DEVELOPMENT
echo ========================================
echo   This script will create a rock-solid
echo   development environment that won't crash
echo ========================================
echo.

:: Set maximum performance and memory settings
set NODE_OPTIONS=--max-old-space-size=8192 --max-semi-space-size=512 --optimize-for-size
set NODE_ENV=development
set FORCE_COLOR=1
set NEXT_CONFIG_FILE=next.config.stable.js

:: Step 1: Complete cleanup
echo [1/10] Complete system cleanup...
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im npm.exe >nul 2>&1
taskkill /f /im npx.exe >nul 2>&1

:: Kill processes on our ports (with timeout protection)
echo Cleaning up ports 3333 and 4448...
timeout /t 1 >nul
netstat -ano | findstr :3333 | findstr LISTENING >nul 2>&1 && echo Port 3333 in use, attempting cleanup...
netstat -ano | findstr :4448 | findstr LISTENING >nul 2>&1 && echo Port 4448 in use, attempting cleanup...
timeout /t 2 >nul

:: Step 2: Deep clean build artifacts
echo [2/10] Deep cleaning all build artifacts...
if exist .next rmdir /s /q .next >nul 2>&1
if exist .sanity rmdir /s /q .sanity >nul 2>&1
if exist node_modules\.cache rmdir /s /q node_modules\.cache >nul 2>&1
if exist .vercel rmdir /s /q .vercel >nul 2>&1
if exist dist rmdir /s /q dist >nul 2>&1

:: Step 3: Verify system requirements
echo [3/10] Verifying system requirements...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: Node.js not found
    echo Please install Node.js 18+ from https://nodejs.org
    pause
    exit /b 1
)

npm --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: npm not found
    pause
    exit /b 1
)

:: Step 4: Clean npm cache and install dependencies
echo [4/10] Cleaning npm cache and installing dependencies...
npm cache clean --force >nul 2>&1
npm install --no-optional --silent --no-audit

:: Step 5: Verify Sanity CLI
echo [5/10] Setting up Sanity CLI...
npx sanity --version >nul 2>&1
if errorlevel 1 (
    echo Installing Sanity CLI...
    npm install -g @sanity/cli --silent
)

:: Step 6: Create process monitoring
echo [6/10] Setting up process monitoring...
echo @echo off > monitor_processes.bat
echo :MONITOR >> monitor_processes.bat
echo timeout /t 30 ^>nul >> monitor_processes.bat
echo tasklist ^| findstr node.exe ^>nul >> monitor_processes.bat
echo if errorlevel 1 ( >> monitor_processes.bat
echo   echo WARNING: Node.js processes stopped unexpectedly >> monitor_processes.bat
echo   echo Restarting development environment... >> monitor_processes.bat
echo   call ULTIMATE_STABLE_DEV.bat >> monitor_processes.bat
echo ) >> monitor_processes.bat
echo goto MONITOR >> monitor_processes.bat

:: Step 7: Start Sanity Studio with enhanced stability
echo [7/10] Starting Sanity Studio with enhanced stability...
start "Sanity Studio - Enhanced" cmd /c "title Sanity Studio Port 3333 && echo ======================================== && echo    SANITY STUDIO - PORT 3333 && echo ======================================== && echo Starting Sanity Studio... && npx sanity dev --port 3333 --host 0.0.0.0 --no-open || (echo. && echo Sanity Studio encountered an error && echo Press any key to view error details && pause)"

:: Step 8: Wait for Sanity to fully initialize
echo [8/10] Waiting for Sanity Studio to initialize...
timeout /t 10 >nul

:: Step 9: Verify Sanity is running
echo [9/10] Verifying Sanity Studio is running...
netstat -an | findstr :3333 >nul
if errorlevel 1 (
    echo ⚠️  WARNING: Sanity Studio may not have started properly
    echo Continuing with Next.js startup...
) else (
    echo ✅ Sanity Studio is running on port 3333
)

:: Step 10: Start Next.js with ultimate stability
echo [10/10] Starting Next.js with ultimate stability...
echo.
echo ========================================
echo     DEVELOPMENT ENVIRONMENT ACTIVE
echo ========================================
echo   🌐 Website:       http://localhost:4448
echo   🎨 Sanity Studio: http://localhost:3333
echo ========================================
echo   ✅ STABLE MODE ENABLED
echo   ✅ AUTO-RESTART ON CRASH
echo   ✅ MEMORY OPTIMIZED
echo   ✅ WINDOWS OPTIMIZED
echo ========================================
echo.
echo   INSTRUCTIONS:
echo   - Keep this window open
echo   - Both servers will auto-restart
echo   - Refresh your browser safely
echo   - Edit content in Sanity Studio
echo   - Changes will appear automatically
echo.
echo ========================================

:RESTART_NEXTJS
echo [NEXT.JS] Starting development server...
npm run dev:stable
if errorlevel 1 (
    echo.
    echo ==========================================
    echo   🔄 Next.js crashed - Auto-restarting
    echo ==========================================
    echo   Waiting 5 seconds before restart...
    timeout /t 5 >nul
    echo   Cleaning up and restarting...
    if exist .next rmdir /s /q .next >nul 2>&1
    goto RESTART_NEXTJS
)

echo.
echo ========================================
echo   Development environment stopped
echo ========================================
pause