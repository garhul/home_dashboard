const config = require('../../config');
const sfl = require('simple-fancy-logger')({ logString: '[TSTAMP] [LEVEL] [TAG] [TEXT]',  of: config.logger.path});
const { inspect } = require('util');


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
  d: (...args) => {
    sfl.d(parseArgs(...args), TAG);
  },
  i: (...args) => {
    sfl.i(parseArgs(...args), TAG);
  },
  w: (...args) => {
    sfl.w(parseArgs(...args), TAG);
  },
  e: (...args) => {
    sfl.e(parseArgs(...args), TAG);
  },
  n: (...args) => {
    sfl.n(parseArgs(...args), TAG);
  },
  t: (...args) => {
    sfl.t(parseArgs(...args), TAG);
  }  
});
