const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const replacements = [
  {
    search: /<div id="inspector_panel" className={`fixed z-40 bottom-24 left-1\/2 -translate-x-1\/2 w-\[98vw\] md:w-\[96vw\] max-w-4xl transition-all duration-300 pointer-events-none \$\{mobileActiveView === "inspector" \? "flex flex-col items-center" : "hidden md:flex md:flex-col md:items-center"\} \$\{selectedElement \? "opacity-100 scale-100" : "opacity-0 scale-95"\} `}>\s*?\{selectedElement && \(/g,
    replace: `<div id="inspector_panel" className={\`z-40 transition-all duration-300 \${mobileActiveView === "inspector" ? "fixed bottom-24 left-1/2 -translate-x-1/2 w-[98vw] max-w-4xl flex flex-col items-center pointer-events-none" : "hidden md:flex md:w-[320px] md:flex-shrink-0 md:border-l md:border-stone-200 md:bg-white/95 md:backdrop-blur-md md:h-[calc(100vh-64px)] md:flex-col md:relative md:pointer-events-auto md:z-10"} \${selectedElement ? "opacity-100 scale-100 md:scale-100" : "opacity-0 scale-95 md:scale-100 hidden md:flex"}\`}>\n          {selectedElement ? (`
  },
  {
    search: /<div className="flex flex-col gap-2 w-full max-w-full items-center">/g,
    replace: `<div className="flex flex-col gap-2 w-full max-w-full items-center md:h-full md:gap-0 md:bg-stone-50/30">`
  },
  {
    search: /<div \s*className="bg-white\/95 backdrop-blur-xl border border-stone-200\/60 shadow-\[0_8px_30px_rgba\(0,0,0,0.12\)\] p-2 rounded-2xl pointer-events-auto w-full max-w-fit mx-auto overflow-x-auto overflow-y-hidden scrollbar-hide flex items-center min-w-0 transition-all duration-300"\s*onWheel=\{\(e\) => \{\s*if \(e.deltaY !== 0 && e.deltaX === 0\) \{\s*e.currentTarget.scrollLeft \+= e.deltaY;\s*\}\s*\}\}\s*>/g,
    replace: `<div \n                className="bg-white/95 backdrop-blur-xl border border-stone-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.12)] p-2 rounded-2xl pointer-events-auto w-full max-w-fit mx-auto overflow-x-auto overflow-y-hidden scrollbar-hide flex items-center min-w-0 transition-all duration-300 md:w-full md:max-w-full md:rounded-none md:border-none md:shadow-none md:bg-transparent md:h-full md:flex-col md:overflow-y-auto md:overflow-x-hidden md:p-6"\n                onWheel={(e) => {\n                  if (window.innerWidth < 768 && e.deltaY !== 0 && e.deltaX === 0) {\n                    e.currentTarget.scrollLeft += e.deltaY;\n                  }\n                }}\n              >`
  },
  {
    search: /<div className="flex items-center gap-4 sm:gap-6 whitespace-nowrap min-w-max px-2 py-1 h-12">/g,
    replace: `<div className="flex items-center gap-4 sm:gap-6 whitespace-nowrap min-w-max px-2 py-1 h-12 md:flex-col md:items-stretch md:gap-6 md:whitespace-normal md:min-w-0 md:px-0 md:py-0 md:h-auto md:w-full">`
  },
  {
    search: /border-r border-stone-200 pr-4 sm:pr-5 shrink-0/g,
    replace: `border-r border-stone-200 pr-4 sm:pr-5 shrink-0 md:border-none md:pr-0 md:pb-2 md:border-b md:mb-2`
  },
  {
    search: /border-r border-stone-200 pr-5 shrink-0/g,
    replace: `border-r border-stone-200 pr-5 shrink-0 md:border-none md:pr-0 md:pb-2 md:border-b md:mb-2`
  },
  {
    search: /<div className="flex items-center gap-3 shrink-0">/g,
    replace: `<div className="flex items-center gap-3 shrink-0 md:flex-col md:items-stretch md:w-full">`
  },
  {
    search: /<div className="flex items-center gap-2 bg-stone-100 p-1 rounded-lg border border-stone-200 shrink-0">/g,
    replace: `<div className="flex items-center gap-2 bg-stone-100 p-1 rounded-lg border border-stone-200 shrink-0 md:flex-wrap md:justify-center md:gap-1.5 md:p-1.5">`
  },
  {
    search: /<div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200 shrink-0">/g,
    replace: `<div className="flex items-center gap-1 bg-stone-100 p-1 rounded-lg border border-stone-200 shrink-0 md:w-full md:justify-between">`
  },
  {
    search: /<div className="w-px h-6 bg-stone-200 shrink-0 mx-1" \/>/g,
    replace: `<div className="w-px h-6 bg-stone-200 shrink-0 mx-1 md:w-full md:h-px md:my-3 lg:my-4" />`
  },
  {
    search: /<div className="w-px h-6 bg-stone-200 shrink-0 ml-2 mr-1" \/>/g,
    replace: `<div className="w-px h-6 bg-stone-200 shrink-0 ml-2 mr-1 md:w-full md:h-px md:my-3 lg:my-4 md:ml-0 md:mr-0" />`
  },
  {
    search: /<div \s*role="tablist" \s*className="bg-stone-900 border border-stone-800 p-1.5 rounded-3xl flex items-center gap-1 shadow-\[0_8px_30px_rgba\(0,0,0,0.2\)\] pointer-events-auto w-max max-w-full overflow-x-auto scrollbar-hide"\s*onWheel=\{\(e\) => \{\s*if \(e.deltaY !== 0 && e.deltaX === 0\) \{\s*e.currentTarget.scrollLeft \+= e.deltaY;\s*\}\s*\}\}\s*>/g,
    replace: `<div \n                role="tablist" \n                className="bg-stone-900 border border-stone-800 p-1.5 rounded-3xl flex items-center gap-1 shadow-[0_8px_30px_rgba(0,0,0,0.2)] pointer-events-auto w-max max-w-full overflow-x-auto scrollbar-hide md:w-full md:rounded-none md:border-none md:border-b md:border-stone-200 md:bg-white md:shadow-none md:p-0 md:gap-0 md:order-first md:overflow-x-auto md:scrollbar-hide"\n                onWheel={(e) => {\n                  if (window.innerWidth < 768 && e.deltaY !== 0 && e.deltaX === 0) {\n                    e.currentTarget.scrollLeft += e.deltaY;\n                  }\n                }}\n              >`
  },
  {
    search: /className=\{\`relative px-3 py-1.5 rounded-2xl flex items-center justify-center gap-1.5 transition-colors duration-200 cursor-pointer shrink-0 \$\{\s*inspectorSection === tab.id\s*\? "text-stone-950 scale-\[1.02\]"\s*: "text-stone-400 hover:text-stone-200 hover:bg-stone-800"\s*\}\`\}/g,
    replace: `className={\`relative px-3 py-1.5 md:py-3.5 rounded-2xl md:rounded-none flex items-center justify-center gap-1.5 transition-colors duration-200 cursor-pointer shrink-0 md:flex-col md:gap-1 \${inspectorSection === tab.id ? "text-stone-950 scale-[1.02] md:scale-100 md:text-purple-600 md:border-b-2 md:border-purple-600" : "text-stone-400 hover:text-stone-200 hover:bg-stone-800 md:hover:bg-stone-50 md:hover:text-stone-600"}\`}`
  },
  {
    search: /<motion\.div\s*layoutId="inspectorTabIndicator"\s*className="absolute inset-0 bg-white rounded-2xl shadow-md pointer-events-none"/g,
    replace: `<motion.div\n                        layoutId="inspectorTabIndicator"\n                        className="absolute inset-0 bg-white rounded-2xl shadow-md pointer-events-none md:hidden"`
  },
  {
    search: /<div className="flex flex-col gap-2 w-full max-w-full items-center">\s*\{\/\* Properties Single-Line Scrolling Toolbar \*\/\}/g,
    replace: `<div className="flex flex-col gap-2 w-full max-w-full items-center md:h-full md:gap-0 md:bg-stone-50/30">\n              \n              {/* Properties Single-Line Scrolling Toolbar / Desktop Sidebar Content */}`
  },
  {
    search: /\{\/\* \}\n          \)\}\n        <\/div> \*\//g, // Just to make sure we close the ternary properly
    replace: ``
  }
];

let modified = code;
for (const r of replacements) {
    if(!modified.match(r.search)) {
      console.log("Failed to match:", r.search);
    }
    modified = modified.replace(r.search, r.replace);
}

// Fix the end of inspector panel ternary
const endSearch = /<\/div>\s*\}\s*<\/div>\s*\{\/\* EXPORT COMPLETED DIALOG SCREEN MODAL \*\/\}/g;
if (modified.match(endSearch)) {
  modified = modified.replace(endSearch, `</div>\n            ) : (\n              <div className="hidden md:flex flex-col items-center justify-center h-full w-full text-stone-400 p-6 text-center">\n                <Settings size={32} className="mb-4 opacity-50" />\n                <p className="text-xs font-medium">Select an element on the canvas to inspect and edit its properties.</p>\n              </div>\n            )}\n        </div>\n\n      {/* EXPORT COMPLETED DIALOG SCREEN MODAL */}`);
}


fs.writeFileSync('src/App.tsx', modified);
console.log("Done.");
