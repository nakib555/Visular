const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Change tablist to flex-wrap on desktop
code = code.replace(
  /className="bg-stone-900 border border-stone-800 p-1\.5 rounded-3xl flex items-center gap-1 shadow-\[0_8px_30px_rgba\(0,0,0,0\.2\)\] pointer-events-auto w-max max-w-full overflow-x-auto scrollbar-hide md:flex-shrink-0 md:w-full md:rounded-none md:border-none md:border-b md:border-stone-200 md:bg-white md:shadow-none md:p-0 md:gap-0 md:order-first md:overflow-x-auto md:scrollbar-hide"/g,
  'className="bg-stone-900 border border-stone-800 p-1.5 rounded-3xl flex items-center gap-1 shadow-[0_8px_30px_rgba(0,0,0,0.2)] pointer-events-auto w-max max-w-full overflow-x-auto scrollbar-hide md:flex-shrink-0 md:w-full md:rounded-none md:border-none md:border-b md:border-stone-200 md:bg-white md:shadow-none md:p-2 md:gap-1 md:order-first md:flex-wrap md:overflow-visible"'
);

// Change individual tab items on desktop
// From: md:py-3.5 md:rounded-none md:flex-col md:gap-1 
// To: md:py-2 md:rounded-lg md:flex-row md:gap-2 md:flex-auto md:w-[calc(50%-4px)]
code = code.replace(
  /className=\{\`relative px-3 py-1\.5 md:py-3\.5 rounded-2xl md:rounded-none flex items-center justify-center gap-1\.5 transition-colors duration-200 cursor-pointer shrink-0 md:flex-col md:gap-1 \$\{\s*inspectorSection === tab\.id \? "text-stone-950 scale-\[1\.02\] md:scale-100 md:text-purple-600 md:border-b-2 md:border-purple-600" : "text-stone-400 hover:text-stone-200 hover:bg-stone-800 md:hover:bg-stone-50 md:hover:text-stone-600"\s*\}\`\}/g,
  'className={`relative px-3 py-1.5 md:py-1.5 rounded-2xl md:rounded-md flex items-center justify-center gap-1.5 transition-colors duration-200 cursor-pointer shrink-0 md:flex-row md:gap-1.5 md:flex-auto md:justify-start ${inspectorSection === tab.id ? "text-stone-950 scale-[1.02] md:scale-100 md:text-purple-700 md:bg-purple-50 md:border-none" : "text-stone-400 hover:text-stone-200 hover:bg-stone-800 md:hover:bg-stone-50 md:hover:text-stone-600"}`}'
);

fs.writeFileSync('src/App.tsx', code);
console.log("Done");
