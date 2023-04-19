"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ObservableCollection_instances, _ObservableCollection_data, _ObservableCollection_listeners, _ObservableCollection_notifyListeners;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Groups = exports.Devices = void 0;
const logger_1 = require("../logger");
const logger = (0, logger_1.getTaggedLogger)('DB');
class ObservableCollection {
    constructor(name) {
        _ObservableCollection_instances.add(this);
        _ObservableCollection_data.set(this, void 0);
        _ObservableCollection_listeners.set(this, void 0);
        __classPrivateFieldSet(this, _ObservableCollection_data, new Map(), "f");
        __classPrivateFieldSet(this, _ObservableCollection_listeners, [], "f");
        this.name = name;
    }
    del(key) {
        __classPrivateFieldGet(this, _ObservableCollection_data, "f").delete(key);
        __classPrivateFieldGet(this, _ObservableCollection_instances, "m", _ObservableCollection_notifyListeners).call(this);
    }
    add(key, value) {
        __classPrivateFieldGet(this, _ObservableCollection_data, "f").set(key, value);
        __classPrivateFieldGet(this, _ObservableCollection_instances, "m", _ObservableCollection_notifyListeners).call(this);
        return value;
    }
    getAll() {
        return Array.from(__classPrivateFieldGet(this, _ObservableCollection_data, "f"));
    }
    addBatch(batch) {
        batch.forEach(dic => {
            __classPrivateFieldGet(this, _ObservableCollection_data, "f").set(dic[0], dic[1]);
        });
        __classPrivateFieldGet(this, _ObservableCollection_instances, "m", _ObservableCollection_notifyListeners).call(this);
    }
    get(key) {
        const d = __classPrivateFieldGet(this, _ObservableCollection_data, "f").get(key);
        if (d !== undefined)
            return d;
        throw new Error(`key ${key} doesn't exist in collection ${this.name}`);
    }
    exists(key) {
        return __classPrivateFieldGet(this, _ObservableCollection_data, "f").has(key);
    }
    onChange(fn) {
        __classPrivateFieldGet(this, _ObservableCollection_listeners, "f").push(fn);
    }
    ;
}
_ObservableCollection_data = new WeakMap(), _ObservableCollection_listeners = new WeakMap(), _ObservableCollection_instances = new WeakSet(), _ObservableCollection_notifyListeners = function _ObservableCollection_notifyListeners() {
    __classPrivateFieldGet(this, _ObservableCollection_listeners, "f").forEach(fn => {
        fn.call(null, Array.from(__classPrivateFieldGet(this, _ObservableCollection_data, "f")));
    });
};
exports.Devices = new ObservableCollection('Devices');
//debugging shit, remove later
exports.Devices.onChange((d) => {
    // logger.info(`Device store changed ${inspect(d)}`);
});
exports.Groups = new ObservableCollection('Groups');
//debugging shit, remove later
exports.Groups.onChange((d) => console.dir(d));
