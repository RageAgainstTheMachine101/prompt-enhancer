/**
 * Integration tests for Storage Helper with Chrome API mocks
 */

const storageHelper = require('../../src/modules/storageHelper');

describe('Storage Helper Integration Tests', () => {

  beforeEach(() => {
    // Clear all mock function calls before each test
    jest.clearAllMocks();

    // Reset chrome.runtime.lastError
    chrome.runtime.lastError = null;
  });

  describe('getStorageData', () => {
    test('should retrieve data from local storage', async () => {
      const mockData = { key1: 'value1', key2: 'value2' };
      chrome.storage.local.get.mockImplementation((keys, callback) => {
        callback(mockData);
      });

      const result = await storageHelper.getStorageData(['key1', 'key2'], 'local');

      expect(chrome.storage.local.get).toHaveBeenCalledWith(['key1', 'key2'], expect.any(Function));
      expect(result).toEqual(mockData);
    });

    test('should retrieve data from sync storage', async () => {
      const mockData = { setting: true };
      chrome.storage.sync.get.mockImplementation((keys, callback) => {
        callback(mockData);
      });

      const result = await storageHelper.getStorageData('setting', 'sync');

      expect(chrome.storage.sync.get).toHaveBeenCalledWith('setting', expect.any(Function));
      expect(result).toEqual(mockData);
    });

    test('should handle chrome.runtime.lastError', async () => {
      chrome.runtime.lastError = { message: 'Storage error' };
      chrome.storage.local.get.mockImplementation((keys, callback) => {
        callback({});
      });

      await expect(storageHelper.getStorageData('key', 'local')).rejects.toThrow('Storage error');
    });
  });

  describe('setStorageData', () => {
    test('should set data in local storage', async () => {
      chrome.storage.local.set.mockImplementation((data, callback) => {
        callback();
      });

      const dataToStore = { key1: 'value1', key2: 'value2' };
      await storageHelper.setStorageData(dataToStore, 'local');

      expect(chrome.storage.local.set).toHaveBeenCalledWith(dataToStore, expect.any(Function));
    });

    test('should set data in sync storage', async () => {
      chrome.storage.sync.set.mockImplementation((data, callback) => {
        callback();
      });

      const dataToStore = { setting: true };
      await storageHelper.setStorageData(dataToStore, 'sync');

      expect(chrome.storage.sync.set).toHaveBeenCalledWith(dataToStore, expect.any(Function));
    });

    test('should handle storage quota exceeded error', async () => {
      chrome.runtime.lastError = { message: 'QUOTA_BYTES_EXCEEDED' };
      chrome.storage.sync.set.mockImplementation((data, callback) => {
        callback();
      });

      await expect(storageHelper.setStorageData({ large: 'data' }, 'sync'))
        .rejects.toThrow('QUOTA_BYTES_EXCEEDED');
    });
  });

  describe('removeStorageData', () => {
    test('should remove single key from storage', async () => {
      chrome.storage.local.remove.mockImplementation((keys, callback) => {
        callback();
      });

      await storageHelper.removeStorageData('keyToRemove', 'local');

      expect(chrome.storage.local.remove).toHaveBeenCalledWith('keyToRemove', expect.any(Function));
    });

    test('should remove multiple keys from storage', async () => {
      chrome.storage.local.remove.mockImplementation((keys, callback) => {
        callback();
      });

      const keysToRemove = ['key1', 'key2', 'key3'];
      await storageHelper.removeStorageData(keysToRemove, 'local');

      expect(chrome.storage.local.remove).toHaveBeenCalledWith(keysToRemove, expect.any(Function));
    });
  });

  describe('clearStorage', () => {
    test('should clear all data from local storage', async () => {
      chrome.storage.local.clear.mockImplementation((callback) => {
        callback();
      });

      await storageHelper.clearStorage('local');

      expect(chrome.storage.local.clear).toHaveBeenCalledWith(expect.any(Function));
    });

    test('should clear all data from sync storage', async () => {
      chrome.storage.sync.clear.mockImplementation((callback) => {
        callback();
      });

      await storageHelper.clearStorage('sync');

      expect(chrome.storage.sync.clear).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  describe('getOrDefault', () => {
    test('should return existing value if key exists', async () => {
      const existingValue = 'existing';
      chrome.storage.local.get.mockImplementation((keys, callback) => {
        callback({ testKey: existingValue });
      });

      const result = await storageHelper.getOrDefault('testKey', 'default', 'local');

      expect(result).toBe(existingValue);
      expect(chrome.storage.local.set).not.toHaveBeenCalled();
    });

    test('should set and return default value if key does not exist', async () => {
      chrome.storage.local.get.mockImplementation((keys, callback) => {
        callback({}); // Key doesn't exist
      });
      chrome.storage.local.set.mockImplementation((data, callback) => {
        callback();
      });

      const defaultValue = 'default';
      const result = await storageHelper.getOrDefault('newKey', defaultValue, 'local');

      expect(result).toBe(defaultValue);
      expect(chrome.storage.local.set).toHaveBeenCalledWith({ newKey: defaultValue }, expect.any(Function));
    });

    test('should handle errors gracefully and return default', async () => {
      chrome.runtime.lastError = { message: 'Storage error' };
      chrome.storage.local.get.mockImplementation((keys, callback) => {
        callback({});
      });

      const defaultValue = 'fallback';
      const result = await storageHelper.getOrDefault('errorKey', defaultValue, 'local');

      expect(result).toBe(defaultValue);
    });
  });

  describe('Error handling', () => {
    test('should throw error when Chrome storage API is not available', async () => {
      // Temporarily remove chrome.storage
      const originalStorage = chrome.storage;
      delete chrome.storage;

      await expect(storageHelper.getStorageData('key', 'local'))
        .rejects.toThrow('Chrome storage API not available');

      // Restore chrome.storage
      chrome.storage = originalStorage;
    });
  });
});
