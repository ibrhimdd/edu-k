const fs = require("fs");
const path = require("path");

function walk(dir) {
  let results = [];
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== "node_modules" && file !== ".git") results = results.concat(walk(fullPath));
    } else if (file.endsWith(".tsx")) {
      results.push(fullPath);
    }
  });
  return results;
}

const files = walk("./src");
let totalFixed = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, "utf8");
  let original = content;

  // If a container has bg-white, replace any text-white inside it or in the same line/element with text-[#006D77]
  // Let's do targeted replacements for bg-white cards
  content = content.replace(/bg-white([^>]*)\btext-white\b/g, "bg-white$1text-[#006D77]");
  content = content.replace(/bg-\[#EDF6F9\]([^>]*)\btext-white\b/g, "bg-[#EDF6F9]$1text-[#1F2937]");
  
  // Also fix text-white on light cards where bg-white is present
  if (content.includes("bg-white")) {
    // Replace text-white with text-[#006D77] when near bg-white
    content = content.replace(/class="([^"]*)\bbg-white\b([^"]*)\btext-white\b([^"]*)"/g, 'class="$1bg-white$2text-[#006D77]$3"');
  }

  if (content !== original) {
    fs.writeFileSync(file, content, "utf8");
    totalFixed++;
    console.log("Fixed white-on-white text in:", file);
  }
});

console.log("Total files fixed:", totalFixed);
