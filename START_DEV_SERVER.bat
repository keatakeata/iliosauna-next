@echo off
echo Cleaning Next.js cache and fixing permissions...

REM Kill any existing Node processes
taskkill /F /IM node.exe 2>nul

REM Remove the problematic .next directory completely
if exist ".next" (
    echo Removing .next directory...
    rmdir /S /Q ".next" 2>nul
    timeout /t 1 >nul
)

REM Create .next directory with proper permissions
mkdir ".next" 2>nul

REM Grant full permissions to current user for .next directory
icacls ".next" /grant:r "%USERNAME%:(OI)(CI)F" /T /C /Q 2>nul

REM Set environment variables to disable telemetry and tracing
set NEXT_TELEMETRY_DISABLED=1
set NODE_ENV=development

REM Start the development server
echo Starting Next.js development server...
npm run dev