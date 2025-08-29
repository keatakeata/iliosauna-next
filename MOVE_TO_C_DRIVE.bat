@echo off
echo Moving Next.js project to C: drive for better compatibility...
echo.

REM Create directory on C: drive
mkdir C:\iliosauna-next 2>nul

REM Copy all files
xcopy "." "C:\iliosauna-next\" /E /I /H /Y

echo.
echo Project copied to C:\iliosauna-next
echo.
echo To start development:
echo   cd C:\iliosauna-next
echo   npm run dev
echo.
pause