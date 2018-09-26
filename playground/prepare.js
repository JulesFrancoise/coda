const fs = require('fs');

const userExamples = fs.readdirSync('examples')
  .filter(x => x.slice(x.length - 3, x.length) === '.js')
  .map(x => x.slice(0, x.length - 3));
const defaultExamples = fs.readdirSync('examples/_default')
  .filter(x => x.slice(x.length - 3, x.length) === '.js')
  .map(x => x.slice(0, x.length - 3));

let envVars = `VUE_APP_USER_EXAMPLES=${userExamples.join(':')}\n`;
envVars += `VUE_APP_DEFAULT_EXAMPLES=${defaultExamples.join(':')}\n`;

fs.writeFileSync('.env', envVars);
