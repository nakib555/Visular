const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// replace shrink-0 on select with shrink-0 md:w-full
code = code.replace(
  /className="bg-stone-50 border border-stone-200 rounded-lg px-2 py-1 text-\[11px\] text-stone-700 focus:outline-none shrink-0"/g,
  'className="bg-stone-50 border border-stone-200 rounded-lg px-2 py-2 text-[11px] text-stone-700 focus:outline-none shrink-0 md:w-full"'
);

// replace p-1.5 on alignment buttons to be flex-1
code = code.replace(
  /className=\{\`p-1\.5 rounded transition cursor-pointer/g,
  'className={`p-1.5 rounded transition cursor-pointer md:flex-1 md:py-2 flex justify-center items-center'
);

code = code.replace(
  /className=\{\`px-3 py-1 rounded text-\[10px\] transition cursor-pointer font-medium/g,
  'className={`px-3 py-1 rounded text-[10px] transition cursor-pointer font-medium md:flex-1 md:py-2'
);

code = code.replace(
  /className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200 shrink-0 md:w-full md:justify-between"/g,
  'className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200 shrink-0 md:w-full md:justify-between md:flex-row"'
);

fs.writeFileSync('src/App.tsx', code);
console.log("Done");
