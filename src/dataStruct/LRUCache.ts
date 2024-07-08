import { cloneDeep } from 'lodash';

class LRUCache {
  private MAX_SIZE: number;

  private cacheMap: Map<number | string, unknown>;

  constructor(MAX_SIZE: number) {
    this.MAX_SIZE = MAX_SIZE;
    this.cacheMap = new Map();
  }

  get(key: number | string) {
    if (!this.cacheMap.has(key)) {
      return null;
    }
    const useCache = cloneDeep(this.cacheMap.get(key));
    this.cacheMap.delete(key);
    this.cacheMap.set(key, useCache);

    return useCache;
  }

  set(key: number | string, data: unknown) {
    if (this.cacheMap.has(key)) {
      this.cacheMap.delete(key);
    }
    this.cacheMap.set(key, data);

    if (this.cacheMap.size > this.MAX_SIZE) {
      const deletedKey = this.cacheMap.keys().next().value;
      this.cacheMap.delete(deletedKey);
    }
  }

  clear() {
    this.cacheMap.clear();
  }
}

export default LRUCache;
