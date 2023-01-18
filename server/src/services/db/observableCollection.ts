export default class ObservableCollection<T> {
  #data: Map<string, T>;
  #listeners: Array<(data: Array<[string, T]>) => void>;
  name: string;

  constructor(name: string, initialData: Array<[key: string, value: T]> | null) {
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

  del(key: string) {
    this.#data.delete(key);
    this.#notifyListeners();
  }

  add(key: string, value: T): T {
    this.#data.set(key, value);
    this.#notifyListeners();
    return value;
  }

  getAll(): [string, T][] {
    return Array.from(this.#data);
  }

  addBatch(batch: [string, T][]) {
    batch.forEach(dic => {
      this.#data.set(dic[0], dic[1]);
    });
    this.#notifyListeners();
  }

  get(key: string): T {
    const d = this.#data.get(key);
    if (d !== undefined) return d as T;

    throw new Error(`key ${key} doesn't exist in collection ${this.name}`);
  }

  exists(key: string): boolean {
    return this.#data.has(key);
  }

  onChange(fn: (data: Array<[string, T]>) => void) {
    this.#listeners.push(fn);
  };
}