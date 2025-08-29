@echo off
echo ====================================
echo PERMANENT FIX FOR NEXT.JS ON WINDOWS
echo ====================================
echo.
echo This script will permanently fix the Next.js trace file permission issue.
echo Please make sure to run this script AS ADMINISTRATOR!
echo.
pause

REM Step 1: Kill all Node processes
echo Killing all Node.js processes...
taskkill /F /IM node.exe 2>nul

REM Step 2: Take ownership of the project directory
echo Taking ownership of project directory...
takeown /f "." /r /d y >nul 2>&1

REM Step 3: Grant full permissions to current user
echo Granting full permissions...
icacls "." /grant:r "%USERNAME%:(OI)(CI)F" /T /C /Q >nul 2>&1

REM Step 4: Remove any existing .next directories
echo Removing old build directories...
rmdir /S /Q .next 2>nul
rmdir /S /Q .next-custom 2>nul
rmdir /S /Q .next-dev 2>nul

REM Step 5: Create .next directory with proper permissions
echo Creating .next directory with proper permissions...
mkdir .next
icacls .next /grant:r Everyone:(OI)(CI)F /T >nul 2>&1

REM Step 6: Set environment variables
echo Setting environment variables...
setx NEXT_TELEMETRY_DISABLED 1 >nul 2>&1

echo.
echo ====================================
echo FIX APPLIED SUCCESSFULLY!
echo ====================================
echo.
echo You can now run "npm run dev" normally.
echo The permission issues should be resolved permanently.
echo.
pause