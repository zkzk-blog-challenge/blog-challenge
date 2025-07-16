const fs = require('fs');
const path = require('path');

const submissionsDir = 'public/submissions';

function toUnixTimestamp(date) {
  return Math.floor(date.getTime() / 1000);
}

function processFile(filePath) {
  const stat = fs.statSync(filePath);
  const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  content.cDate = toUnixTimestamp(stat.birthtime);
  content.uDate = toUnixTimestamp(stat.mtime);

  fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
  console.log(`✅ Updated: ${filePath}`);
}

function walk(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
    const entryPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(entryPath);
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      processFile(entryPath);
    }
  });
}

walk(submissionsDir);
