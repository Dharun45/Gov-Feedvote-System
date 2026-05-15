import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const colors = { reset: '\x1b[0m', green: '\x1b[32m', blue: '\x1b[34m', yellow: '\x1b[33m', red: '\x1b[31m' };
const log = (service, color, msg) => console.log(`${color}[${service}]${colors.reset} ${msg}`);

const root = __dirname;

// 1. Start Python AI Service
const aiService = spawn('python', ['-m', 'uvicorn', 'main:app', '--host', '0.0.0.0', '--port', '8001', '--reload'], {
  cwd: path.join(root, 'ai_service'),
  shell: true,
});
aiService.stdout.on('data', d => log('AI SERVICE', colors.blue, d.toString().trim()));
aiService.stderr.on('data', d => log('AI SERVICE', colors.blue, d.toString().trim()));

// 2. Start Node.js Backend
const backend = spawn('npm', ['run', 'dev'], {
  cwd: path.join(root, 'backend'),
  shell: true,
});
backend.stdout.on('data', d => log('BACKEND', colors.green, d.toString().trim()));
backend.stderr.on('data', d => log('BACKEND', colors.red, d.toString().trim()));

// 3. Start Frontend
const frontend = spawn('npm', ['run', 'dev'], {
  cwd: root,
  shell: true,
});
frontend.stdout.on('data', d => log('FRONTEND', colors.yellow, d.toString().trim()));
frontend.stderr.on('data', d => log('FRONTEND', colors.yellow, d.toString().trim()));

log('STARTUP', colors.green, '🚀 GovFeedback Hub 1.0 PRO — All services starting...');
log('STARTUP', colors.green, '   Frontend:   http://localhost:8080');
log('STARTUP', colors.green, '   Backend:    http://localhost:5000');
log('STARTUP', colors.green, '   AI Service: http://localhost:8001/docs');

process.on('exit', () => { aiService.kill(); backend.kill(); frontend.kill(); });
