const fs = require('fs');
let content = fs.readFileSync('src/components/css-categories/layout-box-model/properties/PaddingControl.tsx', 'utf8');

content = content.replace(/{ label: "auto", value: "auto".*?},/, '');
content = content.replace(/'auto' \| /g, '');
content = content.replace(/ \| 'auto'/g, '');
content = content.replace(/\| "auto"/g, '');
content = content.replace(/"auto" \|/g, '');
content = content.replace(/"auto", /g, '');
content = content.replace(/, "auto"/g, '');
content = content.replace(/\["px", "rem", "%", "em", "auto"\]/g, '["px", "rem", "%", "em"]');

content = content.replace(/px: { min: -100, max: 150 }/g, 'px: { min: 0, max: 150 }');
content = content.replace(/rem: { min: -10, max: 10 }/g, 'rem: { min: 0, max: 10 }');
content = content.replace(/%: { min: -50, max: 50 }/g, '%: { min: 0, max: 50 }');
content = content.replace(/em: { min: -10, max: 10 }/g, 'em: { min: 0, max: 10 }');

fs.writeFileSync('src/components/css-categories/layout-box-model/properties/PaddingControl.tsx', content);
