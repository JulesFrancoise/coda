const fs = require('fs');
const config = require('./coda.config');

const projects = (config.projects || []).concat(['Examples']);

let envVars = `VUE_APP_DEFAULT_SCRIPT=${config.default}\n`;
envVars += `VUE_APP_PROJECTS=${projects.join(':')}\n`;
projects.forEach((proj) => {
  const ex = fs.readdirSync(`projects/${proj}/scripts`)
    .filter(x => x.slice(x.length - 3, x.length) === '.js')
    .map(x => x.slice(0, x.length - 3));
  envVars += `VUE_APP_EXAMPLES_${proj.toUpperCase()}=${ex.join(':')}\n`;
});

fs.writeFileSync('.env', envVars);
