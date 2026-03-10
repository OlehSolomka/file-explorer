import type { LOCALSTORAGE_KEYS } from '../constants';
import type { ObjectValues } from '../types';

type LocalstorageKeys = ObjectValues<typeof LOCALSTORAGE_KEYS>;

export class LocalstorageHelper {
  static set<T>(key: LocalstorageKeys, value: T): boolean {
    const trimmedValue = typeof value === 'string' ? value.trim() : value;
    if (!trimmedValue) {
      return false;
    }
    try {
      localStorage.setItem(key, JSON.stringify(trimmedValue));
      return true;
    } catch (e) {
      console.error(`LocalStorageHelper: Error setting item for key "${key}":`, e);
      return false;
    }
  }

  static get<T>(key: LocalstorageKeys): T | null {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        return JSON.parse(item) as T;
      }
    } catch (e) {
      console.error(`LocalStorageHelper: Error parsing item for key "${key}":`, e);
      LocalstorageHelper.remove(key);
    }
    return null;
  }

  static remove(key: LocalstorageKeys): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error(`LocalStorageHelper: Error removing item for key "${key}":`, e);
      return false;
    }
  }

  static clear(): boolean {
    try {
      localStorage.clear();
      return true;
    } catch (e) {
      console.error('LocalStorageHelper: Error clearing localStorage:', e);
      return false;
    }
  }
}
