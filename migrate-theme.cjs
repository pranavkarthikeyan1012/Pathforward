const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      results.push(file);
    }
  });
  return results;
}

const files = walk('./src');
files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace text-white with text-app-text globally, except when preceded by specific button classes
  // Wait, regex might be tricky. Let's just do a blanket replace and we'll fix button text specifically.
  // Actually, replacing text-white with text-app-text is safest for a light theme. Buttons with text-app-text on green will be dark text on green, which is readable, though maybe not perfect. We can refine it.
  content = content.replace(/text-white/g, 'text-app-text');
  
  // Recharts theme updates for light mode
  content = content.replace(/#38bdf8/g, '#10b981'); // Accent green
  content = content.replace(/#334155/g, '#e2e8f0'); // Secondary bar (slate-200)
  content = content.replace(/#1e293b/g, '#e2e8f0'); // CartesianGrid (slate-200)
  content = content.replace(/#0f172a/g, '#ffffff'); // Tooltip background
  content = content.replace(/#fff/g, '#0f172a'); // Tooltip text
  content = content.replace(/#94a3b8/g, '#64748b'); // Axis ticks
  
  // Hardcoded cyan classes to app-accent
  content = content.replace(/\[#0ea5e9\]/g, 'app-accent');
  content = content.replace(/rgba\(14,165,233,/g, 'rgba(16,185,129,');
  content = content.replace(/rgba\(56,189,248,/g, 'rgba(16,185,129,');
  
  // prose invert
  content = content.replace(/prose-invert/g, '');
  
  // For any primary buttons we want white text. Let's find common button patterns:
  content = content.replace(/bg-app-accent hover:bg-\[#0284c7\] text-app-text/g, 'bg-app-accent hover:bg-emerald-600 text-white');
  content = content.replace(/bg-app-accent text-app-text/g, 'bg-app-accent text-white');
  
  // Replace the specific user message bubble in AiAdvisor
  content = content.replace(/msg\.role === 'user' \? "bg-app-panel text-app-text/g, `msg.role === 'user' ? "bg-app-accent text-white border-transparent shadow-md`);
  
  fs.writeFileSync(file, content, 'utf8');
});
console.log('Migration completed.');
