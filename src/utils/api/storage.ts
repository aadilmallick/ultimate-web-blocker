// export class SyncStorage<T extends Record<string, any>> {
//   constructor(private data: T) {}

//   async setup() {
//     const data = await chrome.storage.sync.get(this.data);
//     this.data = { ...this.data, ...data };
//   }

//   async isEmpty() {
//     const data = await chrome.storage.sync.get(this.data);
//     return Object.keys(data).length === 0;
//   }

//   async set<K extends keyof T>(key: K, value: T[K]) {
//     this.data[key] = value;
//     await chrome.storage.sync.set({ [key]: value });
//   }

//   async setMultiple(data: Partial<T>) {
//     this.data = { ...this.data, ...data };
//     await chrome.storage.sync.set(data);
//   }

//   async remove<K extends keyof T>(key: K) {
//     delete this.data[key];
//     await chrome.storage.sync.remove(key as string);
//   }

//   async get<K extends keyof T>(key: K) {
//     return this.data[key];
//   }

//   async getMultiple<K extends keyof T>(keys: K[]) {
//     return keys.reduce((acc, key) => {
//       acc[key] = this.data[key];
//       return acc;
//     }, {} as Partial<T>);
//   }
// }

export abstract class ChromeStorage<
  T extends Record<string, any> = Record<string, any>
> {
  constructor(
    protected storage:
      | chrome.storage.SyncStorageArea
      | chrome.storage.LocalStorageArea,
    protected defaultData?: T
  ) {
    this.storage = storage;
  }

  async setup() {
    if (!this.defaultData) return;
    console.info("Setting up storage...");
    const data = await this.getAll();
    // if storage is completely empty, set the default data
    if (!data || Object.keys(data).length === 0) {
      await this.storage.set(this.defaultData);
    }
    console.info("Storage setup complete");
  }

  async getAll() {
    const data = await this.storage.get(await this.getKeys());
    return data as T;
  }

  async getKeys() {
    if (!this.defaultData) {
      const data = await this.storage.get(null);
      return Object.keys(data) as (keyof T)[];
    }
    return Object.keys(this.defaultData) as (keyof T)[];
  }

  async set<K extends keyof T>(key: K, value: T[K]) {
    await this.storage.set({ [key]: value });
  }

  async setMultiple(data: Partial<T>) {
    await this.storage.set(data);
  }

  async remove<K extends keyof T>(key: K) {
    await this.storage.remove(key as string);
  }

  async removeMultiple<K extends keyof T>(keys: K[]) {
    await this.storage.remove(keys as string[]);
  }

  async clear() {
    await this.storage.clear();
  }

  async get<K extends keyof T>(key: K) {
    const data = (await this.storage.get([key])) as Record<K, T[K]>;
    return data[key] as T[K];
  }

  async getMultiple<K extends keyof T>(keys: K[]) {
    return (await this.storage.get(keys)) as Extract<T, Record<K, any>>;
  }

  /**
   * gets the storage percentage used
   */
  async getStoragePercentageUsed() {
    const data = await this.storage.getBytesInUse(null);
    return (data / this.storage.QUOTA_BYTES) * 100;
  }

  onChanged(
    callback: (
      changes: { [key: string]: chrome.storage.StorageChange },
      namespace: "sync" | "local" | "managed" | "session"
    ) => void
  ) {
    chrome.storage.onChanged.addListener(callback);
  }
}

export class SyncStorage<
  T extends Record<string, any> = Record<string, any>
> extends ChromeStorage<T> {
  constructor(defaultData?: T) {
    super(chrome.storage.sync, defaultData);
  }
}

export class LocalStorage<
  T extends Record<string, any> = Record<string, any>
> extends ChromeStorage<T> {
  constructor(defaultData?: T) {
    super(chrome.storage.local, defaultData);
  }
}
