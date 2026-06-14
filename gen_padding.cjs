const fs = require('fs');
const content = fs.readFileSync('src/components/css-categories/layout-box-model/properties/MarginControl.tsx', 'utf8');
const newContent = content
  .replace(/margin/g, 'padding')
  .replace(/Margin/g, 'Padding')
  .replace(/MARGIN/g, 'PADDING')
  .replace("outside", "inside")
  .replace("margin collapsing rules may apply", "padding does not collapse and accepts no negative or auto values")
  .replace("margin property controls spacing", "padding property controls spacing");
fs.writeFileSync('src/components/css-categories/layout-box-model/properties/PaddingControl.tsx', newContent);
