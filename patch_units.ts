import fs from 'fs';

const target_files = [
    "src/components/css-categories/layout-box-model/properties/PaddingControl.tsx",
    "src/components/css-categories/layout-box-model/properties/GapControl.tsx",
    "src/components/css-categories/layout-box-model/properties/MarginControl.tsx",
    "src/components/css-categories/layout-box-model/properties/WidthControl.tsx",
    "src/components/css-categories/layout-box-model/properties/HeightControl.tsx",
    "src/components/css-categories/layout-box-model/properties/PositionOffsetsControl.tsx",
    "src/components/css-categories/layout-box-model/properties/FlexBasisControl.tsx"
];

const UNITS = ['px', 'rem', '%', 'em', 'vw', 'vh', 'vmin', 'vmax', 'ch', 'ex', 'dvw', 'dvh', 'svw', 'svh', 'lvw', 'lvh'];
const ALL_UNIT_STR = UNITS.map(u => `"${u}"`).join(" | ");

function getDefaults() {
    return UNITS.map(u => {
        if (u === 'px') return 'px: { min: 0, max: 1440 }';
        if (u === 'rem') return 'rem: { min: 0, max: 100 }';
        if (u === '%') return '"%": { min: -100, max: 100 }'; // Allow negatives for some, slider will clamp natively or use 0-100 where needed
        return `"${u}": { min: 0, max: 100 }`;
    }).join(",\n    ");
}

function getLabels() {
    const labels = {
        'px': 'Pixels (px)',
        'rem': 'Relative (rem)',
        '%': 'Percent (%)',
        'em': 'Element (em)',
        'vw': 'Viewport W (vw)',
        'vh': 'Viewport H (vh)',
        'dvw': 'Dynamic VW (dvw)',
        'dvh': 'Dynamic VH (dvh)',
        'vmin': 'Viewport Min (vmin)',
        'vmax': 'Viewport Max (vmax)',
        'ch': 'Character (ch)',
        'ex': 'X-Height (ex)',
        'svw': 'Small VW (svw)',
        'svh': 'Small VH (svh)',
        'lvw': 'Large VW (lvw)',
        'lvh': 'Large VH (lvh)'
    };
    return Object.entries(labels).map(([k, v]) => `"${k}": "${v}"`).join(",\n    ");
}

target_files.forEach(file => {
    if (!fs.existsSync(file)) return;
    let content = fs.readFileSync(file, 'utf-8');

    // 1. replace unit useState
    content = content.replace(/useState<("px"[^>]*)>\("px"\);/g, (match, group1) => {
        const hasAuto = group1.includes('"auto"');
        return `useState<${ALL_UNIT_STR}${hasAuto ? ' | "auto"' : ''}>("px");`;
    });
    
    content = content.replace(/useState<("px" \| "%" \| "rem" \| "auto")>\("px"\);/g, (match) => {
        return `useState<${ALL_UNIT_STR} | "auto">("px");`;
    });

    // 2. replace customLimits useState
    content = content.replace(/(const \[customLimits, setCustomLimits\] = useState<Record<)[^>]+(>, \{ min: number; max: number \}>\(\{)\n[\s\S]*?(?=\n  \}\);)/g, (match, p1, p2) => {
        return p1 + ALL_UNIT_STR + p2 + "\n    " + getDefaults().replace(/"%/g, '%').replace(/%":/g, '%:');
    });

    // 3. replace defaults object inside reset button
    content = content.replace(/(const defaults = \{)\n(?:\s*.*?(?::|"%\":)\s*\{\s*min:.*?\},\n)+(\s*\};)/g, (match, p1, p2) => {
        return p1 + "\n                          " + getDefaults().replace(/\n/g, '\n                          ') + "\n" + p2;
    });

    // 4. replace unitLabels
    content = content.replace(/(const unitLabels(?::.*?)? = \{)\n(?:\s*.*?: ".*?",?\n)+(\s*(?:"auto": ".*?",?\s*)?\};)/g, (match, p1, p2) => {
        const hasAuto = p2.includes('"auto"');
        return p1 + "\n    " + getLabels() + (hasAuto ? ',\n    "auto": "Auto Space"' : '') + "\n  };";
    });

    // 5. replace parsedUnit logic (endsWith)
    const endsw_block = UNITS.filter(u => u !== 'px').map(u => 
        `if (primaryPart.endsWith("${u}")) return { numericValue: num, parsedUnit: "${u}" as const };`
    ).join("\n    ");
    
    content = content.replace(/(if \(isNaN\(num\)\)[^\n]+)\n+(?:\s*if \(primaryPart\.endsWith[^\n]+\n+)+\s*return \{ numericValue: num, parsedUnit: "px" as const \};/g, 
        `$1\n    ${endsw_block}\n    return { numericValue: num, parsedUnit: "px" as const };`
    );

    // FlexBasis parsedUnit logic (the match[2] block)
    content = content.replace(/unit === "px" && newUnit === "rem"/g, `unit === "px" && newUnit === "rem"`); // just skipping it, flexbasis has special switch

    // For Flex Basis, we also need to change the parsed dropdown array:
    content = content.replace(/\(\["px", "%", "rem", "em", "vw"\] as const\)/g, `([${UNITS.map(u=>`"${u}"`).join(", ")}] as const)`);
    // And for PositionOffsetsControl:
    content = content.replace(/\(\["px", "%", "rem", "auto"\] as const\)/g, `([${UNITS.map(u=>`"${u}"`).join(", ")}, "auto"] as const)`);

    fs.writeFileSync(file, content, 'utf8');
    console.log(`Patched ${file}`);
});
