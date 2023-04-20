"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ObservableCollection {
    #data;
    #listeners;
    name;
    constructor(name, initialData) {
        this.#data = new Map();
        this.#listeners = [];
        this.name = name;
        if (initialData !== null) {
            initialData.forEach(([key, T]) => {
                this.#data.set(key, T);
            });
        }
    }
    #notifyListeners() {
        this.#listeners.forEach(fn => {
            fn.call(null, (Array.from(this.#data)));
        });
    }
    del(key) {
        this.#data.delete(key);
        this.#notifyListeners();
    }
    add(key, value) {
        this.#data.set(key, value);
        this.#notifyListeners();
        return value;
    }
    getAll() {
        return Array.from(this.#data);
    }
    addBatch(batch) {
        batch.forEach(dic => {
            this.#data.set(dic[0], dic[1]);
        });
        this.#notifyListeners();
    }
    get(key) {
        const d = this.#data.get(key);
        if (d !== undefined)
            return d;
        throw new Error(`key ${key} doesn't exist in collection ${this.name}`);
    }
    exists(key) {
        return this.#data.has(key);
    }
    onChange(fn) {
        this.#listeners.push(fn);
    }
    ;
}
exports.default = ObservableCollection;
