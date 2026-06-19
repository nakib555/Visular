import fs from 'fs';

const file = "src/components/css-categories/layout-box-model/properties/FlexBasisControl.tsx";
let content = fs.readFileSync(file, 'utf-8');

content = content.replace(/\{\["px", "%", "rem", "em", "vw"\]\.map\(\(u\) => \{/g, "{((Object.keys(unitLabels)) as readonly (keyof typeof unitLabels)[]).map((u) => {");

fs.writeFileSync(file, content, 'utf8');
console.log(`Fixed arrays in ${file}`);
