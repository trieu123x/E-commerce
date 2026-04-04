const fs = require('fs');
const path = require('path');

function extractIO(content, funcName) {
    // try to find: export const funcName = async (req, res) => { ... };
    let blockStart = content.indexOf(`export const ${funcName}`);
    if (blockStart === -1) {
        blockStart = content.indexOf(`export function ${funcName}`);
    }
    if (blockStart === -1) return { request: 'unknown', response: 'unknown' };

    let blockContent = content.substring(blockStart, blockStart + 2000); // 2000 chars should be enough
    let params = [];
    let body = [];
    let query = [];

    // regex for req.body
    let re = /const\s+\{([^}]+)\}\s*=\s*req\.(body|params|query)/g;
    let match;
    while ((match = re.exec(blockContent)) !== null) {
        let vars = match[1].split(',').map(s => s.split('=')[0].trim()).filter(s => s);
        if (match[2] === 'body') body.push(...vars);
        if (match[2] === 'params') params.push(...vars);
        if (match[2] === 'query') query.push(...vars);
    }
    
    // what if it's req.body.foo ?
    let re2 = /req\.(body|params|query)\.(\w+)/g;
    while ((match = re2.exec(blockContent)) !== null) {
        let v = match[2];
        if (match[1] === 'body') body.push(v);
        if (match[1] === 'params') params.push(v);
        if (match[1] === 'query') query.push(v);
    }

    let requestSummary = [];
    if (params.length) requestSummary.push(`Params: ${[...new Set(params)].join(', ')}`);
    if (query.length) requestSummary.push(`Query: ${[...new Set(query)].join(', ')}`);
    if (body.length) requestSummary.push(`Body: ${[...new Set(body)].join(', ')}`);

    return {
        request: requestSummary.length ? requestSummary.join(' | ') : 'None',
        response: 'JSON'
    };
}

let addressCtrl = fs.readFileSync(path.join(__dirname, 'src/controllers/address.controller.js'), 'utf-8');
console.log(extractIO(addressCtrl, 'createAddress'));
console.log(extractIO(addressCtrl, 'updateAddress'));
