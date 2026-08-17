import path from 'path';
import fs from 'fs';

// Entry point wrapper for hosting services like Render or Heroku that default to `node server.js`
const distServerPath = path.join(process.cwd(), 'dist', 'server.cjs');

if (fs.existsSync(distServerPath)) {
  await import('./dist/server.cjs');
} else {
  console.error('CRITICAL ERROR: dist/server.cjs not found.');
  console.error('Please make sure your Render Build Command is set to: npm install && npm run build');
  process.exit(1);
}
