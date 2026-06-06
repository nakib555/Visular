const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// For the outer wrapping div of the visual tools container:
code = code.replace(
  /className="flex flex-col gap-2 w-full max-w-full items-center md:h-full md:gap-0 md:bg-stone-50\/30 md:items-stretch overflow-hidden"/g,
  'className="flex flex-col gap-2 w-full max-w-full items-center md:h-auto md:min-h-full md:gap-0 md:bg-stone-50/30 md:items-stretch"'
);

// For the inner scrolling div:
code = code.replace(
  /className="bg-white\/95 backdrop-blur-xl border border-stone-200\/60 shadow-\[0_8px_30px_rgba\(0,0,0,0\.12\)\] p-2 rounded-2xl pointer-events-auto w-full max-\[767px\]:max-w-fit mx-auto overflow-x-auto overflow-y-hidden scrollbar-hide flex items-center min-w-0 transition-all duration-300 md:flex-1 md:w-full md:max-w-full md:rounded-none md:border-none md:shadow-none md:bg-transparent md:flex-col md:overflow-y-auto md:overflow-x-hidden md:p-6"/g,
  'className="bg-white/95 backdrop-blur-xl border border-stone-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-2 rounded-2xl pointer-events-auto w-full max-[767px]:max-w-fit mx-auto overflow-x-auto overflow-y-hidden scrollbar-hide flex items-center min-w-0 transition-all duration-300 md:flex-1 md:w-full md:max-w-full md:rounded-none md:border-none md:shadow-none md:bg-transparent md:flex-col md:overflow-visible md:p-6"'
);

// Ensure the tab container doesn't force h-full awkwardly
code = code.replace(
  /<div className="space-y-4 text-left transition-all h-full">/g,
  '<div className="space-y-4 text-left transition-all h-full md:h-auto">'
);

fs.writeFileSync('src/App.tsx', code);
console.log("Done");
