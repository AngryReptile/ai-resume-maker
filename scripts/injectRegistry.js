const fs = require('fs');
const path = require('path');

const previewSectionPath = path.join(__dirname, '..', 'src', 'components', 'builder', 'PreviewSection.tsx');
const templatesPagePath = path.join(__dirname, '..', 'src', 'app', 'templates', 'page.tsx');
const templatesDir = path.join(__dirname, '..', 'src', 'components', 'builder', 'templates');

// Gather the 44 generated templates (all that aren't the base 11)
const baseTemplates = [
    'InternshipPlacement', 'ModernClean', 'ExecutiveProfessional', 'TechMinimal',
    'CreativeAccent', 'AcademicCV', 'SplitColumn', 'BoldHeader', 'ElegantSerif',
    'StartupDynamic', 'ClassicCentered'
];

let generatedNames = fs.readdirSync(templatesDir)
    .filter(f => f.endsWith('.tsx'))
    .map(f => f.replace('.tsx', ''))
    .filter(name => !baseTemplates.includes(name));

let importsStr = '';
let switchStr = '';
let arrayItemsStr = '';

generatedNames.forEach(name => {
    const id = name.replace(/([A-Z])/g, '-$1').toLowerCase().substring(1);
    const friendlyName = name.replace(/([A-Z])/g, ' $1').trim().replace(/C V/g, 'CV');

    importsStr += `const ${name} = dynamic(() => import('./templates/${name}'));\n`;
    switchStr += `            case '${id}': return <${name} previewData={previewData} />;\n`;
    arrayItemsStr += `    { id: '${id}', name: '${friendlyName}', description: 'A themed variation of professional templates.' },\n`;
});

// Update PreviewSection.tsx
let previewContent = fs.readFileSync(previewSectionPath, 'utf8');
// Insert imports after the last dynamic import
previewContent = previewContent.replace(
    /(const ClassicCentered = dynamic\(\(\) => import\('\.\/templates\/ClassicCentered'\)\);\n)/,
    `$1${importsStr}`
);
// Insert switch cases just before default
previewContent = previewContent.replace(
    /(default: return <ModernClean)/,
    `${switchStr}            $1`
);
fs.writeFileSync(previewSectionPath, previewContent);

// Update page.tsx
let pageContent = fs.readFileSync(templatesPagePath, 'utf8');
pageContent = pageContent.replace(
    /(const templates = \[\n(?:.*\n)*?)(] as const;)/,
    `$1${arrayItemsStr}$2`
);
// Also insert imports in page.tsx if there is a switch case there. Wait, page.tsx uses a switch case too!
pageContent = pageContent.replace(
    /(case 'classic-centered': return <ClassicCentered previewData={dummyResumeData} \/>;\n)/,
    `$1${switchStr.replace(/previewData={previewData}/g, 'previewData={dummyResumeData}')}`
);

// We need to inject the imports into page.tsx as well!
let pageImports = '';
generatedNames.forEach(name => {
    pageImports += `import ${name} from '@/components/builder/templates/${name}';\n`;
});
pageContent = pageContent.replace(
    /(import ClassicCentered from '@\/components\/builder\/templates\/ClassicCentered';\n)/,
    `$1${pageImports}`
);

fs.writeFileSync(templatesPagePath, pageContent);

console.log('Injection complete.');
