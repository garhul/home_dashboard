"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wait = exports.timedPromise = void 0;
function timedPromise(promise, ms) {
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
exports.timedPromise = timedPromise;
const wait = (ms) => new Promise(resolve => {
    setTimeout(resolve, ms);
});
exports.wait = wait;
