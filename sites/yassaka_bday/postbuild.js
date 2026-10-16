import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlPath = path.resolve(__dirname, 'dist', 'index.html');

if (!fs.existsSync(htmlPath)) {
  console.error('❌ dist/index.html not found');
  process.exit(1);
}

let s = fs.readFileSync(htmlPath, 'utf8');

const scriptStart = s.indexOf('<script');
const scriptCloseTag = '</script>';
const scriptEnd = s.indexOf(scriptCloseTag) + scriptCloseTag.length;

if (scriptStart === -1 || scriptEnd === -1) {
  console.log('No script block found');
  process.exit(0);
}

const scriptBlock = s.slice(scriptStart, scriptEnd);
// Convert to regular script (remove type="module" and crossorigin)
const cleanScript = scriptBlock.replace(/<script\b[^>]*>/i, '<script>');

// Remove script from its current position
const withoutScript = s.slice(0, scriptStart) + s.slice(scriptEnd);

// Find <div id="root">
const rootIdx = withoutScript.indexOf('id="root"');
if (rootIdx === -1) {
  console.error('❌ id="root" not found in HTML');
  process.exit(1);
}

const rootCloseTag = '</div>';
const rootEnd = withoutScript.indexOf(rootCloseTag, rootIdx) + rootCloseTag.length;

// Insert script right after <div id="root"></div>
const finalHtml = withoutScript.slice(0, rootEnd) + '\n    ' + cleanScript + withoutScript.slice(rootEnd);

fs.writeFileSync(htmlPath, finalHtml, 'utf8');
console.log('🎉 Successfully converted to single-file offline/file:// compatible bundle!');
console.log('Final HTML length:', finalHtml.length);
