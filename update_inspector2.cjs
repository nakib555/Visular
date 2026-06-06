const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const searchStr = `<div id="inspector_panel" className={\`fixed z-40 bottom-24 left-1/2 -translate-x-1/2 w-[98vw] md:w-[96vw] max-w-4xl transition-all duration-300 pointer-events-none \${mobileActiveView === "inspector" ? "flex flex-col items-center" : "hidden md:flex md:flex-col md:items-center"} \${selectedElement ? "opacity-100 scale-100" : "opacity-0 scale-95"}\`}>\n          {selectedElement && (`;

const replaceStr = `<div id="inspector_panel" className={\`z-40 transition-all duration-300 \${mobileActiveView === "inspector" ? "fixed bottom-24 left-1/2 -translate-x-1/2 w-[98vw] max-w-4xl flex flex-col items-center pointer-events-none" : "hidden md:flex md:w-[320px] md:flex-shrink-0 md:border-l md:border-stone-200 md:bg-white/95 md:backdrop-blur-md md:h-[calc(100vh-64px)] md:flex-col md:relative md:pointer-events-auto md:z-10"} \${selectedElement ? "opacity-100 scale-100 md:scale-100" : "opacity-0 scale-95 md:scale-100 hidden md:flex"}\`}>\n          {selectedElement ? (`

code = code.replace(searchStr, replaceStr);

const endSearchStr = `            </div>\n          )}\n        </div>`;
const endReplaceStr = `            </div>\n          ) : (\n            <div className="hidden md:flex flex-col items-center justify-center h-full w-full text-stone-400 p-6 text-center">\n              <Settings size={32} className="mb-4 opacity-50" />\n              <p className="text-xs font-medium">Select an element on the canvas to inspect and edit its properties.</p>\n            </div>\n          )}\n        </div>`;

code = code.replace(endSearchStr, endReplaceStr);

fs.writeFileSync('src/App.tsx', code);
console.log("Done phase 2.");
