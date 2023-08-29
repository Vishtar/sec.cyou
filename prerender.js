import fs from 'fs';

const template = fs.readFileSync('./dist/static/index.html', 'utf-8');
const render = (await import('./dist/server/entry-server.js')).SSRRender;

(async () => {
    const appHtml = render();
    const html = template.replace('<!--app-html-->', appHtml);
    fs.writeFileSync('./dist/static/index.html', html);
})();
