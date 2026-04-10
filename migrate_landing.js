const fs = require('fs');
const path = require('path');

const landingCompDir = path.join(__dirname, 'src/components/landing');

// 1. Rename landing component imports
const files = fs.readdirSync(landingCompDir).filter(f => f.endsWith('.tsx'));
const compNames = files.map(f => f.replace('.tsx', ''));

for (const file of files) {
  const p = path.join(landingCompDir, file);
  let content = fs.readFileSync(p, 'utf-8');

  compNames.forEach(comp => {
    const rgx = new RegExp(`from\\s+["']@/components/${comp}["']`, 'g');
    content = content.replace(rgx, `from "@/components/landing/${comp}"`);
  });
  
  if (!content.includes('"use client"')) {
    content = '"use client";\n' + content;
  }

  content = content.replace(/import\s*{\s*Link\s*(?:,\s*useNavigate\s*)?}\s*from\s*"react-router-dom";/g, 'import Link from "next/link";\nimport { useRouter } from "next/navigation";');
  content = content.replace(/import\s*{\s*useNavigate\s*}\s*from\s*"react-router-dom";/g, 'import { useRouter } from "next/navigation";');
  content = content.replace(/useNavigate\(\)/g, 'useRouter()');

  // Replace links like <Link to="...">
  content = content.replace(/<Link\s+to=/g, '<Link href=');

  fs.writeFileSync(p, content);
}

// 2. Migrate pages
const srcPagesDir = path.join(__dirname, 'src/components/templates/user/medicare-soft-design/src/pages');
const targetPages = {
  'Index.tsx': 'src/app/(landing)/page.tsx',
  'BookingPage.tsx': 'src/app/(landing)/booking/page.tsx',
};

for (const [inFile, outPath] of Object.entries(targetPages)) {
  const srcPath = path.join(srcPagesDir, inFile);
  if (!fs.existsSync(srcPath)) continue;
  
  let content = fs.readFileSync(srcPath, 'utf-8');
  
  compNames.forEach(comp => {
    const rgx = new RegExp(`from\\s+["']@/components/${comp}["']`, 'g');
    content = content.replace(rgx, `from "@/components/landing/${comp}"`);
  });
  
  if (!content.includes('"use client"')) {
    content = '"use client";\n' + content;
  }

  content = content.replace(/import\s*{\s*Link\s*(?:,\s*useNavigate\s*)?}\s*from\s*"react-router-dom";/g, 'import Link from "next/link";\nimport { useRouter } from "next/navigation";');
  content = content.replace(/import\s*{\s*useNavigate\s*}\s*from\s*"react-router-dom";/g, 'import { useRouter } from "next/navigation";');
  content = content.replace(/useNavigate\(\)/g, 'useRouter()');

  content = content.replace(/<Link\s+to=/g, '<Link href=');

  const fullOutDir = path.dirname(path.join(__dirname, outPath));
  if (!fs.existsSync(fullOutDir)) fs.mkdirSync(fullOutDir, { recursive: true });
  
  fs.writeFileSync(path.join(__dirname, outPath), content);
}

// 3. Remove landing/NavLink.tsx
const navLinkPath = path.join(landingCompDir, 'NavLink.tsx');
if (fs.existsSync(navLinkPath)) fs.unlinkSync(navLinkPath);
