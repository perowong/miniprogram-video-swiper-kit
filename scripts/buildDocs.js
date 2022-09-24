const path = require('path');
const { exec } = require('child_process');

const cwd = process.cwd();
const root = path.join(cwd, 'docs');

exec(`cd ${root} && npm i`);
exec(`cd ${root} && npm run build`);
