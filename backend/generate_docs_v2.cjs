const fs = require('fs');
const path = require('path');

const routesDir = path.join(__dirname, 'src', 'routes');
const controllersDir = path.join(__dirname, 'src', 'controllers');

const controllersCache = {};

function readController(funcName) {
    if (!funcName) return '-';
    
    if (Object.keys(controllersCache).length === 0) {
        try {
            fs.readdirSync(controllersDir).forEach(f => {
                if (f.endsWith('.js')) {
                    controllersCache[f] = fs.readFileSync(path.join(controllersDir, f), 'utf-8');
                }
            });
            if (fs.existsSync(path.join(controllersDir, 'admin'))) {
                fs.readdirSync(path.join(controllersDir, 'admin')).forEach(f => {
                    if (f.endsWith('.js')) {
                        controllersCache['admin/' + f] = fs.readFileSync(path.join(controllersDir, 'admin', f), 'utf-8');
                    }
                });
            }
        } catch(e) {}
    }
    
    for (let f in controllersCache) {
        let content = controllersCache[f];
        let idx = content.indexOf(`export const ${funcName} =`);
        if (idx === -1) idx = content.indexOf(`export const ${funcName}=`);
        if (idx === -1) idx = content.indexOf(`export function ${funcName}`);
        if (idx !== -1) {
            let block = content.substring(idx, idx + 2000); // look at first 2000 chars of func
            return extractParams(block);
        }
    }
    return '-';
}

function extractParams(blockContent) {
    let params = [];
    let query = [];
    let body = [];
    
    let re = /const\s+\{([^}]+)\}\s*=\s*req\.(body|params|query)/g;
    let match;
    while ((match = re.exec(blockContent)) !== null) {
        let vars = match[1].split(',').map(s => s.split('=')[0].trim().split(':')[0].trim()).filter(s => s);
        if (match[2] === 'body') body.push(...vars);
        if (match[2] === 'params') params.push(...vars);
        if (match[2] === 'query') query.push(...vars);
    }
    
    let re2 = /req\.(body|params|query)\.([a-zA-Z0-9_]+)/g;
    while ((match = re2.exec(blockContent)) !== null) {
        if (match[1] === 'body') body.push(match[2]);
        if (match[1] === 'params') params.push(match[2]);
        if (match[1] === 'query') query.push(match[2]);
    }
    
    let summary = [];
    if (params.length) summary.push(`**Params:** ${[...new Set(params)].join(', ')}`);
    if (query.length) summary.push(`**Query:** ${[...new Set(query)].join(', ')}`);
    if (body.length) summary.push(`**Body:** ${[...new Set(body)].join(', ')}`);
    
    return summary.join('<br>') || '-';
}

function processRouteContent(lineStart, lineEnd, content) {
    let match = content.substring(lineStart, lineEnd).match(/router\.(get|post|put|delete|patch)\s*\(\s*['"]([^'"]+)['"]\s*,/i);
    if (!match) return null;
    let method = match[1].toUpperCase();
    let url = match[2];

    let startSearchIndex = lineStart + match[0].length;
    let rawArgs = '';
    let openParens = 1; // We matched the first parenthesis in the regex conceptually
    
    // actually, let's just find the corresponding end of router.(...);
    let firstParenIndex = content.indexOf('(', lineStart);
    startSearchIndex = firstParenIndex + 1;
    openParens = 1;
    
    for (let i = startSearchIndex; i < content.length; i++) {
        if (content[i] === '(') openParens++;
        if (content[i] === ')') openParens--;
        
        if (openParens === 0) {
            rawArgs = content.substring(startSearchIndex, i);
            break;
        }
    }
    
    // rawArgs is `"path", middleware, async (req, res) => ...`
    // Skip the first arg
    let firstComma = rawArgs.indexOf(',');
    if (firstComma !== -1) {
        rawArgs = rawArgs.substring(firstComma + 1).trim();
    }

    let argsList = [];
    let currentArg = '';
    let nestLevel = 0;
    for (let char of rawArgs) {
        if (char === '(' || char === '{' || char === '[') nestLevel++;
        if (char === ')' || char === '}' || char === ']') nestLevel--;
        if (char === ',' && nestLevel === 0) {
            argsList.push(currentArg.trim());
            currentArg = '';
        } else {
            currentArg += char;
        }
    }
    if (currentArg) argsList.push(currentArg.trim());

    let inlineIo = '-';
    let middlewares = [];

    if (argsList.length > 0) {
        let handler = argsList.pop();
        if (handler.includes('req') || handler.includes('res') || handler.includes('=>')) {
            inlineIo = extractParams(handler);
        } else {
            let funcNameParts = handler.split('.');
            let funcName = funcNameParts[funcNameParts.length - 1];
            inlineIo = readController(funcName);
        }
        
        middlewares = argsList.map(a => a.replace(/express\.raw\([^)]+\)/g, 'express.raw'));
    }

    return { method, url, middlewares, io: inlineIo };
}

let results = [];

function traverse(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            traverse(fullPath);
        } else if (fullPath.endsWith('.js')) {
            let content = fs.readFileSync(fullPath, 'utf-8');
            let group = path.basename(fullPath, '.js').replace('.routes', '');
            if (fullPath.replace(/\\/g, '/').includes('/routes/admin/')) {
                group = 'admin/' + group;
            }

            let prefixMws = [];
            let prefixMwMatch;
            let mRegex = /router\.use\(([^)]+)\)/g;
            while ((prefixMwMatch = mRegex.exec(content)) !== null) {
                // Ignore nested router uses if any
                if (!prefixMwMatch[1].includes('{') && !prefixMwMatch[1].includes('=>')) {
                    prefixMws.push(prefixMwMatch[1].replace(/['"]/g, ''));
                }
            }
            // Remove 'authorize(...)' complexity for simple reading
            let globalMw = prefixMws.join(', ').replace(/\n/g, '').replace(/\s+/g, ' ');

            let regex = /router\.(get|post|put|delete|patch)\s*\(/ig;
            let match;
            while ((match = regex.exec(content)) !== null) {
                let lineStart = content.lastIndexOf('\n', match.index) + 1;
                let lineEnd = content.indexOf('\n', match.index);
                if(lineEnd === -1) lineEnd = content.length;
                
                let res = processRouteContent(lineStart, lineEnd, content);
                if (res) {
                    let fullPath = `/api/${group}${res.url === '/' ? '' : res.url}`.replace(/\/\//g, '/');
                    let allMws = [];
                    if(globalMw) allMws.push(globalMw);
                    if(res.middlewares.length > 0) allMws.push(...res.middlewares);
                    
                    results.push({
                        group,
                        method: res.method,
                        path: fullPath,
                        middlewares: allMws.join(', ') || '-',
                        io: res.io
                    });
                }
            }
        }
    }
}

traverse(routesDir);

results.sort((a, b) => {
    if (a.group !== b.group) return a.group.localeCompare(b.group);
    return a.path.localeCompare(b.path);
});

let md = `# API Documentation (Enriched)\n\n`;
md += `This document contains an automatically generated list of all API routes found in the backend, including middlewares and inputs.\n\n`;
md += `| Category | Method | Endpoint | Middlewares | Inputs (req.body/params/query) |\n`;
md += `| -------- | ------ | -------- | ----------- | ------------------------------ |\n`;
results.forEach(r => {
    md += `| ${r.group} | \`${r.method}\` | \`${r.path}\` | ${r.middlewares} | ${r.io} |\n`;
});

const artifactPath = "C:\\Users\\admin\\.gemini\\antigravity\\brain\\04846b3e-77e8-47ef-a393-91574aaaecf8\\api_docs_detailed.md";
fs.writeFileSync(artifactPath, md);
console.log('Successfully generated api_docs_detailed.md at ' + artifactPath);
