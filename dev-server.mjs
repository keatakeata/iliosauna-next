#!/usr/bin/env node
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dev = true;
const hostname = 'localhost';
const port = 3000;

// Disable tracing
process.env.NEXT_TELEMETRY_DISABLED = '1';

const app = next({ 
  dev, 
  hostname, 
  port,
  dir: __dirname,
  conf: {
    distDir: '.next-dev',  // Use different build directory
  }
});

const handle = app.getRequestHandler();

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
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});