exports.timedPromise = (promise, ms) => new Promise((resolve, reject) => {
  const timeoutId = setTimeout(() => {
    const err = new Error('Timed out');
    err.code = 'TIMEOUT';
    reject(err);
  }, ms);

  promise.then((res) => {
    clearTimeout(timeoutId);
    resolve(res);
  },
  (err) => {
    clearTimeout(timeoutId);
    reject(err);
  });
});

exports.wait = (ms) => new Promise(resolve => {
  setTimeout(resolve, ms);
});

exports.TimeSeries = require('./timeSeries');
