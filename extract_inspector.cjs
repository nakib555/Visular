const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// The AI Assist block: from {activeTab === "ai_assist" && ( to )}
// We simply delete the AI Assist block completely.
code = code.replace(/\{\/\* TAB CONTENT: GEMINI AI ASSISTANT PANEL \*\/\}[\s\S]*?(?=\s*<\/div>\s*<\/div>\s*\{\/\* INTERACTIVE CENTER VIEWPORT CANVAS \*\/})/g, 
`{/* TAB CONTENT: STYLES PANEL */}
            {activeTab === "styles" && (
              <div className="space-y-4 text-left transition-all h-full">
                {renderInspectorTools()}
              </div>
            )}`);

// Now extract the content of inspector_panel into a function `renderInspectorTools()`
// And replace inspector_panel's internal children with a call to that function if selectedElement is present.

const inspectorStartString = `<div id="inspector_panel" className={\`z-40 transition-all duration-300 \${mobileActiveView === "inspector" ? "fixed bottom-24 left-1/2 -translate-x-1/2 w-[98vw] max-w-4xl flex flex-col items-center pointer-events-none" : "hidden md:flex md:w-[320px] md:flex-shrink-0 md:border-l md:border-stone-200 md:bg-white/95 md:backdrop-blur-md md:h-[calc(100vh-64px)] md:flex-col md:relative md:pointer-events-auto md:z-10"} \${selectedElement ? "opacity-100 scale-100 md:scale-100" : "opacity-0 scale-95 md:scale-100 hidden md:flex"}\`}>\n          {selectedElement ? (`

const inspectorEndString = `            </div>\n          ) : (\n            <div className="hidden md:flex flex-col items-center justify-center h-full w-full text-stone-400 p-6 text-center">\n              <Settings size={32} className="mb-4 opacity-50" />\n              <p className="text-xs font-medium">Select an element on the canvas to inspect and edit its properties.</p>\n            </div>\n          )}\n        </div>`;

const startIndex = code.indexOf(inspectorStartString);
const endIndex = code.indexOf(inspectorEndString);

if (startIndex !== -1 && endIndex !== -1) {
  const contentToExtract = code.substring(startIndex + inspectorStartString.length, endIndex);
  
  // Create function
  const functionCode = `  const renderInspectorTools = () => {\n    if (!selectedElement) return (\n      <div className="flex flex-col items-center justify-center h-full w-full text-stone-400 p-6 text-center">\n        <Settings size={32} className="mb-4 opacity-50" />\n        <p className="text-xs font-medium">Select an element on the canvas to inspect and edit its properties.</p>\n      </div>\n    );\n    return (\n${contentToExtract.replace(/^/gm, '    ')}\n    );\n  };\n\n`;

  // Insert function before return ( <div id="builder_root"... )
  const returnIndex = code.lastIndexOf('return (', code.indexOf('<div id="builder_root"'));
  code = code.slice(0, returnIndex) + functionCode + code.slice(returnIndex);

  // Re-read startIndex and endIndex as their positions might have shifted!
  const newStartIndex = code.indexOf(inspectorStartString);
  const newEndIndex = code.indexOf(inspectorEndString) + inspectorEndString.length;
  
  // Replace the old inspector panel container to only show on mobile
  const newInspectorPanel = `<div id="inspector_panel" className={\`z-40 transition-all duration-300 \${mobileActiveView === "inspector" ? "fixed bottom-24 left-1/2 -translate-x-1/2 w-[98vw] max-w-4xl flex flex-col items-center pointer-events-none md:hidden" : "hidden"} \${selectedElement ? "opacity-100 scale-100" : "opacity-0 scale-95"}\`}>\n          {renderInspectorTools()}\n        </div>`;
  
  code = code.slice(0, newStartIndex) + newInspectorPanel + code.slice(newEndIndex);
  
  fs.writeFileSync('src/App.tsx', code);
  console.log("Success extracting");
} else {
  console.log("Could not find start or end index", startIndex, endIndex);
  console.log("start:", inspectorStartString);
  console.log("end:", inspectorEndString);
}
