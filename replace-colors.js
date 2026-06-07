import fs from 'fs';
import path from 'path';

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function replaceColors() {
  walkDir('src', function(filePath) {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      let content = fs.readFileSync(filePath, 'utf8');
      let originalContent = content;
      
      content = content.replace(/purple/g, 'rose');
      content = content.replace(/blue/g, 'orange');
      content = content.replace(/indigo/g, 'amber');
      content = content.replace(/teal/g, 'emerald');
      content = content.replace(/cyan/g, 'emerald');
      content = content.replace(/sky/g, 'emerald');
      // Fix a strange RGBA shadow left over
      content = content.replace(/rgba\(168,85,247,0.85\)/g, 'rgba(244,63,94,0.85)'); // rose-500
      content = content.replace(/rgba\(168,85,247,0.35\)/g, 'rgba(244,63,94,0.35)'); // rose-500
      
      if (originalContent !== content) {
        fs.writeFileSync(filePath, content);
        console.log(`Replaced colors in ${filePath}`);
      }
    }
  });
}

replaceColors();
