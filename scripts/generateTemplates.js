const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, '..', 'src', 'components', 'builder', 'templates');
const previewSectionPath = path.join(__dirname, '..', 'src', 'components', 'builder', 'PreviewSection.tsx');
const templatesPagePath = path.join(__dirname, '..', 'src', 'app', 'templates', 'page.tsx');

const baseTemplates = [
    'InternshipPlacement',
    'ModernClean',
    'ExecutiveProfessional',
    'TechMinimal',
    'CreativeAccent',
    'AcademicCV',
    'SplitColumn',
    'BoldHeader',
    'ElegantSerif',
    'StartupDynamic'
]; // Exactly 10 bases

const themes = [
    {
        name: 'Midnight',
        suffix: 'Midnight',
        replacements: {
            'indigo': 'blue',
            'bg-white': 'bg-slate-50',
            'zinc': 'sky'
        }
    }
];

function generateTemplates() {
    console.log('Generating templates...');
    
    let generatedCount = 0;
    const generatedNames = [];

    baseTemplates.forEach(baseName => {
        const baseFilePath = path.join(templatesDir, `${baseName}.tsx`);
        if (!fs.existsSync(baseFilePath)) {
            console.error(`Base template ${baseName} not found!`);
            return;
        }

        const baseContent = fs.readFileSync(baseFilePath, 'utf8');

        themes.forEach(theme => {
            const newName = `${baseName}${theme.suffix}`;
            const newFilePath = path.join(templatesDir, `${newName}.tsx`);
            
            let newContent = baseContent.replace(new RegExp(`export default function ${baseName}`, 'g'), `export default function ${newName}`);
            
            // Apply theme replacements
            for (const [search, replace] of Object.entries(theme.replacements)) {
                // Be careful to only replace entire tailwind classes
                newContent = newContent.replace(new RegExp(`${search}`, 'g'), replace);
            }
            
            fs.writeFileSync(newFilePath, newContent, 'utf8');
            generatedNames.push(newName);
            generatedCount++;
        });
    });

    console.log(`Successfully generated ${generatedCount} templates.`);
    return generatedNames;
}

const newTemplates = generateTemplates();

// We need to print out the import statements so we can manually update PreviewSection and page.tsx
console.log('\n--- imports for PreviewSection.tsx ---');
newTemplates.forEach(name => {
    console.log(`const ${name} = dynamic(() => import('./templates/${name}'));`);
});

console.log('\n--- switch cases for page.tsx / PreviewSection ---');
newTemplates.forEach(name => {
    const id = name.replace(/([A-Z])/g, '-$1').toLowerCase().substring(1);
    console.log(`case '${id}': return <${name} previewData={previewData} />;`);
});

console.log('\n--- array items for templates.ts / page.tsx ---');
newTemplates.forEach(name => {
    const id = name.replace(/([A-Z])/g, '-$1').toLowerCase().substring(1);
    console.log(`{ id: '${id}', name: '${name.replace(/([A-Z])/g, ' $1').trim()}', description: 'A themed variation of professional templates.' },`);
});
