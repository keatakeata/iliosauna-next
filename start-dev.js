// Custom dev server script to bypass trace file issues
const { spawn } = require('child_process');
const path = require('path');

// Set environment variables
process.env.NODE_ENV = 'development';
process.env.NEXT_TELEMETRY_DISABLED = '1';

// Start Next.js dev server
const child = spawn('npx', ['next', 'dev'], {
  cwd: __dirname,
  env: process.env,
  stdio: 'inherit',
  shell: true
});

child.on('error', (err) => {
  console.error('Failed to start dev server:', err);
});

child.on('exit', (code) => {
  console.log(`Dev server exited with code ${code}`);
});