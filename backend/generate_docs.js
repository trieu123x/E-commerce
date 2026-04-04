const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, 'src', 'routes');
let results = [];

function parseFile(filePath, basePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');
    let group = path.basename(filePath, '.js').replace('.routes', '');
    
    // Custom mapping for base paths based on app.js
    if (filePath.includes('admin')) {
        group = 'admin/' + group;
    }
    
    // Regular expression to match router.METHOD('/path', ...)
    const regex = /router\.(get|post|put|delete|patch|use)\s*\(\s*['"]([^'"]+)['"]/ig;
    let match;
    while ((match = regex.exec(content)) !== null) {
        const method = match[1].toUpperCase();
        const routePath = match[2];
        
        if (method === 'USE' && routePath === '/') continue;
        
        let fullPath = `/api/${group}${routePath === '/' ? '' : routePath}`;
        // cleanup double slashes
        fullPath = fullPath.replace(/\/\//g, '/');
        
        results.push({
            group: group,
            method: method,
            path: fullPath
        });
    }
}

function traverse(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverse(fullPath);
        } else if (fullPath.endsWith('.js')) {
            parseFile(fullPath, '');
        }
    }
}

traverse(routesDir);

// Generate markdown table
let md = `# API Documentation\n\n`;
md += `| Category | Method | Endpoint |\n`;
md += `| -------- | ------ | -------- |\n`;

// Group by category, then sort by method and path
results.sort((a, b) => {
    if (a.group !== b.group) return a.group.localeCompare(b.group);
    return a.path.localeCompare(b.path);
});

results.forEach(r => {
    if (r.method === 'USE') return; // skip wildcard uses in md
    md += `| ${r.group} | \`${r.method}\` | \`${r.path}\` |\n`;
});

fs.writeFileSync(path.join(__dirname, 'api_docs.md'), md);
console.log('Successfully generated api_docs.md');
