/**
 * Storage Helper for Chrome Extension
 * Provides utility functions for chrome.storage API
 */

/**
 * Get data from Chrome storage
 * @param {string|string[]} keys - Storage keys to retrieve
 * @param {string} storageType - 'local' or 'sync'
 * @returns {Promise<Object>} - Retrieved data
 */
async function getStorageData(keys, storageType = 'local') {
  if (!chrome?.storage?.[storageType]) {
    throw new Error('Chrome storage API not available');
  }

  return new Promise((resolve, reject) => {
    chrome.storage[storageType].get(keys, (result) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve(result);
      }
    });
  });
}

/**
 * Set data in Chrome storage
 * @param {Object} data - Data to store
 * @param {string} storageType - 'local' or 'sync'
 * @returns {Promise<void>}
 */
async function setStorageData(data, storageType = 'local') {
  if (!chrome?.storage?.[storageType]) {
    throw new Error('Chrome storage API not available');
  }

  return new Promise((resolve, reject) => {
    chrome.storage[storageType].set(data, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve();
      }
    });
  });
}

/**
 * Remove data from Chrome storage
 * @param {string|string[]} keys - Storage keys to remove
 * @param {string} storageType - 'local' or 'sync'
 * @returns {Promise<void>}
 */
async function removeStorageData(keys, storageType = 'local') {
  if (!chrome?.storage?.[storageType]) {
    throw new Error('Chrome storage API not available');
  }

  return new Promise((resolve, reject) => {
    chrome.storage[storageType].remove(keys, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve();
      }
    });
  });
}

/**
 * Clear all data from Chrome storage
 * @param {string} storageType - 'local' or 'sync'
 * @returns {Promise<void>}
 */
async function clearStorage(storageType = 'local') {
  if (!chrome?.storage?.[storageType]) {
    throw new Error('Chrome storage API not available');
  }

  return new Promise((resolve, reject) => {
    chrome.storage[storageType].clear(() => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve();
      }
    });
  });
}

/**
 * Get or set default value if key doesn't exist
 * @param {string} key - Storage key
 * @param {any} defaultValue - Default value if key doesn't exist
 * @param {string} storageType - 'local' or 'sync'
 * @returns {Promise<any>} - Existing or default value
 */
async function getOrDefault(key, defaultValue, storageType = 'local') {
  try {
    const result = await getStorageData(key, storageType);
    if (result[key] === undefined) {
      await setStorageData({ [key]: defaultValue }, storageType);
      return defaultValue;
    }
    return result[key];
  } catch (error) {
    console.error('Error in getOrDefault:', error);
    return defaultValue;
  }
}

module.exports = {
  getStorageData,
  setStorageData,
  removeStorageData,
  clearStorage,
  getOrDefault
};
