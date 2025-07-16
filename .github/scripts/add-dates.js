const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function toUnixTimestamp(date) {
  return Math.floor(date.getTime() / 1000);
}

function getChangedJsonFiles() {
  try {
    execSync('git fetch origin main'); // 이전 커밋 보장
    const diffOutput = execSync('git diff --name-only origin/main HEAD').toString();
    return diffOutput
      .split('\n')
      .filter(f => f.startsWith('public/submissions/') && f.endsWith('.json'));
  } catch (err) {
    console.warn('⚠️ git diff failed, skipping file update.');
    return [];
  }
}

function processFile(filePath) {
  const stat = fs.statSync(filePath);
  const content = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  content.cDate = toUnixTimestamp(stat.birthtime);
  content.uDate = toUnixTimestamp(stat.mtime);

  fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
  console.log(`✅ Updated: ${filePath}`);
}

const files = getChangedJsonFiles();
if (files.length === 0) {
  console.log('ℹ️ No changed JSON files found.');
} else {
  files.forEach(processFile);
}
