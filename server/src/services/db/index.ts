// TODO:: add persistance to file
import { deviceData, groupData } from '../../types';
import { getTaggedLogger } from '../logger';
import { inspect } from 'util';
const logger = getTaggedLogger('DB');

class ObservableCollection<T> {
  #data: Map<string, T>;
  #listeners: Array<(data: Array<T>) => void>;
  name: string;

  constructor(name: string) {
    this.#data = new Map();
    this.#listeners = [];
    this.name = name;
  }

  #notifyListeners() {
    this.#listeners.forEach(fn => {
      fn.call(null, Array.from(this.#data) as T[]);
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

  onChange(fn: (data: Array<T>) => void) {
    this.#listeners.push(fn);
  };
}

export const Devices = new ObservableCollection<deviceData>('Devices');

//debugging shit, remove later
Devices.onChange((d) => {
  // logger.info(`Device store changed ${inspect(d)}`);
});

export const Groups = new ObservableCollection<groupData>('Groups');

//debugging shit, remove later
Groups.onChange((d) => console.dir(d));