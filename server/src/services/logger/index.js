
const config = require('../../../config');
const fs = require('fs');
const chalk = require('chalk');
const { inspect } = require('util');

const levels = {
  'DEBUG': { weight: 0, text:chalk.green('  DEBUG  ')},  
  'INFO': { weight: 1, text: chalk.blue(        '  INFO   ')},
  'WARN': { weight: 2, text: chalk.magenta.bold('  WARN   ' )},
  'ERROR': { weight: 3, text: chalk.bgRed.bold( '  ERROR  ' )} 
};

const min_weight = levels[config.logger.level].weight;

const log = (level, text, tag = 'GENERAL') => {
  const l = levels[level];
  
  if (l.weight < min_weight) return;

  let output = config.logger.logString.replace('[TSTAMP]', chalk.gray(new Date().toISOString()));
  // if (config.log.of === null)  {
    output = output.replace('[LEVEL]', l.text);
    output = output.replace('[TAG]', chalk.gray(`[ ${tag} ]`));
    output = output.replace('[TEXT]', chalk.white(`  ${text}`));
  // } else {
  //   output = output.replace('[LEVEL]',LEVEL_TEXTS[level]);
  //   output = output.replace('[TAG]', `[${tag}]`);
  //   output = output.replace('[TEXT]', `  ${text}`);
  // }

  if (config.logger.of === null) {
    console.log(output);
  } else {
    fs.writeFile(config.logger.of , output + "\n", {encoding:'utf8', flag:"a"}, (err) => { if (err) throw err });
  }
}

function parseArgs(...args) {
  const d = args.map(v => {
    if (typeof v !== 'string' && typeof v !== 'number') {
      return `${inspect(v)}`;
    } 
    return `${v}`;
  });

  return d.join(' ');
}

module.exports = (TAG = 'GENERAL') => ({
  d: (...args) => log('DEBUG', parseArgs(...args), TAG),
  i: (...args) => log('INFO', parseArgs(...args), TAG),
  w: (...args) => log('WARN', parseArgs(...args), TAG),
  e: (...args) => log('ERROR', parseArgs(...args), TAG)
});
