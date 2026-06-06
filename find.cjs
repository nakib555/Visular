const fs = require('fs');
const content = fs.readFileSync('src/App.tsx', 'utf-8');
const matches = content.match(/\b(stone|purple|indigo|emerald|zinc|slate)-[0-9]{2,}\b/g);
if (matches) {
  const unique = [...new Set(matches)].sort();
  console.log(unique);
}
