import fs from "fs";
import path from "path";

function findFiles(dir: string, pattern: RegExp, depth = 0, maxDepth = 6) {
  if (depth > maxDepth) return;
  try {
    const list = fs.readdirSync(dir);
    for (const file of list) {
      const fullPath = path.join(dir, file);
      try {
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
          findFiles(fullPath, pattern, depth + 1, maxDepth);
        } else if (pattern.test(file)) {
          console.log(`Found: ${fullPath} (${stat.size} bytes)`);
        }
      } catch (err) {}
    }
  } catch (err) {}
}

console.log("Searching for .jsonl and transcript files...");
findFiles("/", /transcript|jsonl/i);
console.log("Search complete.");
