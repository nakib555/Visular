const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Hide the Styles tab button on mobile
code = code.replace(
  /className=\{\`flex-1 py-1\.5 text-center text-\[10px\] sm:text-\[11px\] font-bold rounded-lg transition-all duration-200 flex flex-col items-center justify-center gap-1 cursor-pointer \$\{\s*activeTab === "styles"/g,
  `className={\`hidden md:flex flex-1 py-1.5 text-center text-[10px] sm:text-[11px] font-bold rounded-lg transition-all duration-200 flex-col items-center justify-center gap-1 cursor-pointer \${\n                  activeTab === "styles"`
);

// 2. Fix the outer container to properly stretch and handle overflow on desktop
code = code.replace(
  /className="flex flex-col gap-2 w-full max-w-full items-center md:h-full md:gap-0 md:bg-stone-50\/30"/g,
  'className="flex flex-col gap-2 w-full max-w-full items-center md:h-full md:gap-0 md:bg-stone-50/30 md:items-stretch overflow-hidden"'
);

// 3. Make sure the properties body has flex-1 on desktop so it scrolls
code = code.replace(
  /className="bg-white\/95 backdrop-blur-xl border border-stone-200\/60 shadow-\[0_8px_30px_rgba\(0,0,0,0\.12\)\] p-2 rounded-2xl pointer-events-auto w-full max-w-fit mx-auto overflow-x-auto overflow-y-hidden scrollbar-hide flex items-center min-w-0 transition-all duration-300 md:w-full md:max-w-full md:rounded-none md:border-none md:shadow-none md:bg-transparent md:h-full md:flex-col md:overflow-y-auto md:overflow-x-hidden md:p-6"/g,
  'className="bg-white/95 backdrop-blur-xl border border-stone-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-2 rounded-2xl pointer-events-auto w-full max-[767px]:max-w-fit mx-auto overflow-x-auto overflow-y-hidden scrollbar-hide flex items-center min-w-0 transition-all duration-300 md:flex-1 md:w-full md:max-w-full md:rounded-none md:border-none md:shadow-none md:bg-transparent md:flex-col md:overflow-y-auto md:overflow-x-hidden md:p-6"'
);

// 4. Ensure the tabs bar has flex-shrink-0 on desktop
code = code.replace(
  /className="bg-stone-900 border border-stone-800 p-1\.5 rounded-3xl flex items-center gap-1 shadow-\[0_8px_30px_rgba\(0,0,0,0\.2\)\] pointer-events-auto w-max max-w-full overflow-x-auto scrollbar-hide md:w-full md:rounded-none md:border-none md:border-b md:border-stone-200 md:bg-white md:shadow-none md:p-0 md:gap-0 md:order-first md:overflow-x-auto md:scrollbar-hide"/g,
  'className="bg-stone-900 border border-stone-800 p-1.5 rounded-3xl flex items-center gap-1 shadow-[0_8px_30px_rgba(0,0,0,0.2)] pointer-events-auto w-max max-w-full overflow-x-auto scrollbar-hide md:flex-shrink-0 md:w-full md:rounded-none md:border-none md:border-b md:border-stone-200 md:bg-white md:shadow-none md:p-0 md:gap-0 md:order-first md:overflow-x-auto md:scrollbar-hide"'
);

// 5. Replace `w-64` on inputs to include md:w-full
code = code.replace(/text-xs w-64 focus:outline-none/g, "text-xs w-64 md:w-full focus:outline-none");

fs.writeFileSync('src/App.tsx', code);
console.log("Done");
