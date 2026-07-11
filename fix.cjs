const fs = require('fs');
const glob = require('glob');
const files = glob.sync('src/features/deliveryStats/**/*.{ts,tsx}');
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  let changed = false;
  
  // Replace weird chars
  const replacements = [
    ['Ã\xad', 'í'],
    ['Ã³', 'ó'],
    ['Ã©', 'é'],
    ['Ã¡', 'á'],
    ['├│', 'ó'],
    ['├í', 'á'],
    ['â€¦', '…']
  ];
  
  replacements.forEach(([bad, good]) => {
    if (content.includes(bad)) {
      content = content.split(bad).join(good);
      changed = true;
    }
  });

  if (f.endsWith('theme.ts')) {
    if (content.includes('return `$${n.toLocaleString')) {
      content = content.replace('return `$${n.toLocaleString', 'return `$${(n / 100).toLocaleString');
      changed = true;
    }
  }

  if (changed) {
    fs.writeFileSync(f, content, 'utf8');
    console.log('Fixed', f);
  }
});
