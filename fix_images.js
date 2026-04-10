const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/components/landing');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const p = path.join(dir, file);
  let content = fs.readFileSync(p, 'utf-8');

  // Fix image paths
  // <img src={appMockup} -> <img src={typeof appMockup === "string" ? appMockup : appMockup.src}
  content = content.replace(/<img([^>]*)src={([a-zA-Z0-9_\.]+)}([^>]*)>/g, '<img$1src={typeof $2 === "string" ? $2 : $2?.src || $2}$3>');

  // Fix lucide-react brand imports
  content = content.replace(/import { Instagram, Twitter, Facebook } from "lucide-react";/g, 'import { Globe as Instagram, Globe as Twitter, Globe as Facebook } from "lucide-react";');

  fs.writeFileSync(p, content);
}
