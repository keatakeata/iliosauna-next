const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

// Create custom Next.js app with disabled tracing
const app = next({
  dev,
  hostname,
  port,
  dir: __dirname,
  conf: {
    // Use custom build directory to avoid permission issues
    distDir: '.next-custom',
    // Disable all telemetry and tracing
    generateBuildId: () => 'build',
    compress: false,
    poweredByHeader: false,
  }
});

const handle = app.getRequestHandler();

console.log('Preparing Next.js application...');

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  })
    .once('error', (err) => {
      console.error('Server error:', err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
      console.log('> Press CTRL-C to stop');
    });
}).catch((err) => {
  console.error('Failed to start Next.js:', err);
  process.exit(1);
});