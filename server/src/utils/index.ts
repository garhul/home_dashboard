
export function timedPromise<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      const err = new Error('Timed out');
      reject(err);
    }, ms);

    promise.then((res) => {
      resolve(res);
    })
      .catch((err) => {
        reject(err);
      })
      .finally(() => clearTimeout(timeoutId));
  });
}

export const wait = (ms: number) => new Promise(resolve => {
  setTimeout(resolve, ms);
});