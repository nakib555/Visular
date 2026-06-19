import fs from 'fs';

const files = [
    "src/components/css-categories/layout-box-model/properties/PaddingControl.tsx",
    "src/components/css-categories/layout-box-model/properties/MarginControl.tsx",
    "src/components/css-categories/layout-box-model/properties/GapControl.tsx",
    "src/components/css-categories/layout-box-model/properties/PositionOffsetsControl.tsx"
];

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf-8');

    // Replace `{(["px", ... "auto"] as const).map((u) => {` with the Object.keys approach
    content = content.replace(/\{\(\[.*?\] as const\)\.map\(\(u\) => \{/g, "{((Object.keys(unitLabels)) as readonly (keyof typeof unitLabels)[]).map((u) => {");

    // Fix `MarginControl` lacking `"auto"` in `unitLabels`
    if (file.includes('MarginControl.tsx')) {
        if (!content.includes('"auto": "Auto Space"')) {
            content = content.replace(/("lvh": "Large VH \(lvh\)")(\n\s*\};)/, "$1,\n    \"auto\": \"Auto Space\"$2");
        }
    }
    
    // PositionOffsetsControl
    if (file.includes('PositionOffsetsControl.tsx')) {
        if (!content.includes('"auto": "Auto Space"')) {
            content = content.replace(/("lvh": "Large VH \(lvh\)")(\n\s*\};)/, "$1,\n    \"auto\": \"Auto Space\"$2");
        }
    }

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Fixed arrays in ${file}`);
});
