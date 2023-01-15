// TODO:: add persistance to file
import { deviceData, groupData } from '../../types';
import { getTaggedLogger } from '../logger';
import { inspect } from 'util';
import config from '../../../config';
import fs from 'fs';
const logger = getTaggedLogger('DB');

class ObservableCollection<T> {
  #data: Map<string, T>;
  #listeners: Array<(data: Array<[string, T]>) => void>;
  #file_path: string;
  #allow_persistance: boolean;
  name: string;

  constructor(name: string, filePath = '') {
    this.#data = new Map();
    this.#listeners = [];
    this.name = name;
    this.#file_path = filePath;
    this.#allow_persistance = true;
    if (this.#file_path !== '') {
      this.onChange(() => this.persistToFile());
    }
  }

  loadFromFile(file: string | null = null) {
    if (file === null) file = this.#file_path;
    this.#allow_persistance = false; // Prevent saving immediately after loading

    try {
      JSON.parse(fs.readFileSync(file).toString()).forEach(([key, val]: [string, T]) => {
        this.#data.set(key, val);
      });

    } catch (err: any) {
      logger.error(`Unable to load ${this.name} from file: ${file} ${err}`);
    }

    this.#notifyListeners();
    this.#allow_persistance = true;
  }

  persistToFile() {
    if (!this.#allow_persistance) return;
    try {
      const parseableData = Array.from(this.#data);
      fs.writeFileSync(this.#file_path, JSON.stringify(parseableData));
    } catch (err) {
      logger.error(`Unable to persist ${this.name} to ${this.#file_path}`);
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

export const Devices = new ObservableCollection<deviceData>('Devices', config.db.devicesFile);
// Devices.loadFromFile()

//debugging shit, remove later
Devices.onChange((d) => {
  // logger.info(`Device store changed ${inspect(d)}`);
});

export const Groups = new ObservableCollection<groupData>('Groups');
Groups.loadFromFile(config.db.groupsFile);

//debugging shit, remove later
Groups.onChange((d) => console.dir(d));