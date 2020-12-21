const sfl = require('simple-fancy-logger')({ logString: '[TSTAMP] [LEVEL] [TAG] [TEXT]' });
const { inspect } = require('util');

function parseArgs(...args) {
  return args.reduce((acc, v) => {
    if (typeof v !== String && typeof v !== Number) {
      return acc + `${inspect(v)}`;
    } 
    return acc + `${v}`;
  });
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
