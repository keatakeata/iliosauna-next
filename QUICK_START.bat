@echo off
title Quick Start - Garry Website

echo ========================================
echo    QUICK START - GARRY WEBSITE
echo ========================================

:: Kill any existing processes quickly
taskkill /f /im node.exe >nul 2>&1
taskkill /f /im npm.exe >nul 2>&1

:: Clean build
if exist .next rmdir /s /q .next >nul 2>&1

echo Starting development servers...
echo.

:: Start Sanity Studio
start "Sanity Studio" cmd /c "title Sanity Studio && npx sanity dev --port 3333"

:: Wait a moment
timeout /t 3 >nul

:: Start Next.js
echo Starting Next.js on port 4448...
npm run dev:stable

pause