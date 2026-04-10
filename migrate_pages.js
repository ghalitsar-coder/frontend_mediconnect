const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src/components/templates/cms/mediconnect-health-hub/src/pages');
const targetPages = {
  'Index.tsx': 'src/app/dashboard/page.tsx',
  'AntrianPasien.tsx': 'src/app/dashboard/antrian/page.tsx',
  'RekamMedis.tsx': 'src/app/dashboard/rekam-medis/page.tsx',
  'SurveilansPenyakit.tsx': 'src/app/dashboard/surveilans/page.tsx',
  'PetaHeatmap.tsx': 'src/app/dashboard/peta-heatmap/page.tsx',
  'LaporanLab.tsx': 'src/app/dashboard/laporan-lab/page.tsx',
  'KinerjaSistem.tsx': 'src/app/dashboard/kinerja-sistem/page.tsx'
};

for (const [inFile, outPath] of Object.entries(targetPages)) {
  const srcPath = path.join(srcDir, inFile);
  if (!fs.existsSync(srcPath)) {
    console.log(`Skipping ${srcPath}, not found`);
    continue;
  }
  
  let content = fs.readFileSync(srcPath, 'utf-8');
  
  // Remove sidebar/header imports
  content = content.replace(/import\s+DashboardSidebar[^\n]+;\n/, '');
  content = content.replace(/import\s+DashboardHeader[^\n]+;\n/, '');
  
  // Add "use client" for all of them to be safe
  content = '"use client";\n\n' + content;
  
  // Replace wrapper start
  const wrapperStartRegex = /<div className="flex min-h-screen w-full">\s*<DashboardSidebar[^>]*\/>\s*<div className="flex flex-1 flex-col min-w-0">\s*<DashboardHeader \/>\s*<main className="flex-1 p-6 space-y-6 overflow-y-auto">/g;
  content = content.replace(wrapperStartRegex, '<>');
  
  // Replace wrapper end
  const wrapperEndRegex = /<\/main>\s*<\/div>\s*<\/div>/g;
  content = content.replace(wrapperEndRegex, '</>');
  
  // Ensure directories exist
  const fullOutDir = path.dirname(path.join(__dirname, outPath));
  if (!fs.existsSync(fullOutDir)) {
    fs.mkdirSync(fullOutDir, { recursive: true });
  }
  
  fs.writeFileSync(path.join(__dirname, outPath), content);
  console.log(`Migrated ${inFile} to ${outPath}`);
}
