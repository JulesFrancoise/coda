/* eslint-disable no-console */
import Benchmark from 'benchmark';
import fs from 'fs';
import { iterations } from './options';

let suite = new Benchmark.Suite();

fs.readdirSync('./benchmark/circularbuffer')
  .filter(fname => fname.slice(-9) === '.bench.js')
  .forEach((testFileName) => {
    const addTest = require(`./${testFileName}`).default; // eslint-disable-line
    suite = addTest(suite);
  });

function padl(n, s) {
  while (s.length < n) {
    s += ' '; // eslint-disable-line no-param-reassign
  }
  return s;
}

function padr(n, s) {
  while (s.length < n) {
    s = ` ${s}`; // eslint-disable-line no-param-reassign
  }
  return s;
}

let log = '';

suite
  .on('start', () => {
    log += '# Benchmark / Circular Buffer\n\n';
    log += `Updated: ${new Date().toLocaleString()}\n\n`;
    log += '| optimisation                 ';
    log += '| op/s                    ';
    log += '| Samples      ';
    log += '| ms / frame          |\n';
    log += '|------------------------------|-------------------------';
    log += '|--------------|---------------------';
    console.log(log);
    log += '\n';
  })
  .on('cycle', (event) => {
    // console.log(String(event.target));
    const t = event.target;
    let result = padl(30, `| ${t.name}`);
    result += ' | ';
    result += padr(14, ` ${(t.hz).toFixed(2)} op/s`);
    result += ' \xb1';
    result += padr(7, `${t.stats.rme.toFixed(2)}%`);
    result += ' | ';
    result += padr(12, `(${t.stats.sample.length} samples)`);
    result += ' | ';
    result += padr(21, `${((t.stats.mean * 1000) / iterations).toFixed(4)} ms / frame |`);
    console.log(result);
    log += `${result}\n`;
  })
  .on('complete', () => {
    fs.writeFileSync('./benchmark/circularbuffer/README.md', log);
  })
  .run({ async: true, defer: true });
