/**
 * Chrome Extension API Mocks for Testing
 * This file mocks the Chrome Extension APIs used in the extension
 */

// Storage API Mock
const storage = {
  local: {
    get: jest.fn((keys, callback) => {
      if (callback) callback({});
      return Promise.resolve({});
    }),
    set: jest.fn((items, callback) => {
      if (callback) callback();
      return Promise.resolve();
    }),
    remove: jest.fn((keys, callback) => {
      if (callback) callback();
      return Promise.resolve();
    }),
    clear: jest.fn((callback) => {
      if (callback) callback();
      return Promise.resolve();
    })
  },
  sync: {
    get: jest.fn((keys, callback) => {
      if (callback) callback({});
      return Promise.resolve({});
    }),
    set: jest.fn((items, callback) => {
      if (callback) callback();
      return Promise.resolve();
    }),
    remove: jest.fn((keys, callback) => {
      if (callback) callback();
      return Promise.resolve();
    }),
    clear: jest.fn((callback) => {
      if (callback) callback();
      return Promise.resolve();
    })
  }
};

// Runtime API Mock
const runtime = {
  onMessage: {
    addListener: jest.fn(),
    removeListener: jest.fn(),
    hasListener: jest.fn()
  },
  onInstalled: {
    addListener: jest.fn(),
    removeListener: jest.fn(),
    hasListener: jest.fn()
  },
  sendMessage: jest.fn((message, callback) => {
    if (callback) callback({});
    return Promise.resolve({});
  }),
  getURL: jest.fn((path) => `chrome-extension://mock-extension-id/${path}`),
  getManifest: jest.fn(() => ({
    version: '1.0.0',
    name: 'PromptEnhancer',
    manifest_version: 3
  })),
  id: 'mock-extension-id',
  lastError: null
};

// Tabs API Mock
const tabs = {
  query: jest.fn((queryInfo, callback) => {
    const mockTab = {
      id: 1,
      url: 'https://example.com',
      title: 'Example Page',
      active: true,
      windowId: 1
    };
    if (callback) callback([mockTab]);
    return Promise.resolve([mockTab]);
  }),
  sendMessage: jest.fn((tabId, message, callback) => {
    if (callback) callback({});
    return Promise.resolve({});
  }),
  create: jest.fn((createProperties, callback) => {
    const mockTab = { id: 2, ...createProperties };
    if (callback) callback(mockTab);
    return Promise.resolve(mockTab);
  }),
  update: jest.fn((tabId, updateProperties, callback) => {
    const mockTab = { id: tabId, ...updateProperties };
    if (callback) callback(mockTab);
    return Promise.resolve(mockTab);
  }),
  remove: jest.fn((tabIds, callback) => {
    if (callback) callback();
    return Promise.resolve();
  })
};

// Action API Mock (for Manifest V3)
const action = {
  setBadgeText: jest.fn((details, callback) => {
    if (callback) callback();
    return Promise.resolve();
  }),
  setBadgeBackgroundColor: jest.fn((details, callback) => {
    if (callback) callback();
    return Promise.resolve();
  }),
  setIcon: jest.fn((details, callback) => {
    if (callback) callback();
    return Promise.resolve();
  }),
  setTitle: jest.fn((details, callback) => {
    if (callback) callback();
    return Promise.resolve();
  }),
  onClicked: {
    addListener: jest.fn(),
    removeListener: jest.fn(),
    hasListener: jest.fn()
  }
};

// Scripting API Mock (for Manifest V3)
const scripting = {
  executeScript: jest.fn((injection) => {
    return Promise.resolve([{ result: 'mock result' }]);
  }),
  insertCSS: jest.fn((injection) => {
    return Promise.resolve();
  }),
  removeCSS: jest.fn((injection) => {
    return Promise.resolve();
  })
};

// Windows API Mock
const windows = {
  create: jest.fn((createData, callback) => {
    const mockWindow = { id: 1, ...createData };
    if (callback) callback(mockWindow);
    return Promise.resolve(mockWindow);
  }),
  get: jest.fn((windowId, getInfo, callback) => {
    const mockWindow = { id: windowId };
    if (callback) callback(mockWindow);
    return Promise.resolve(mockWindow);
  }),
  getCurrent: jest.fn((callback) => {
    const mockWindow = { id: 1 };
    if (callback) callback(mockWindow);
    return Promise.resolve(mockWindow);
  })
};

// Context Menus API Mock
const contextMenus = {
  create: jest.fn((createProperties, callback) => {
    if (callback) callback();
    return 'menu-id';
  }),
  update: jest.fn((id, updateProperties, callback) => {
    if (callback) callback();
    return Promise.resolve();
  }),
  remove: jest.fn((menuItemId, callback) => {
    if (callback) callback();
    return Promise.resolve();
  }),
  removeAll: jest.fn((callback) => {
    if (callback) callback();
    return Promise.resolve();
  }),
  onClicked: {
    addListener: jest.fn(),
    removeListener: jest.fn(),
    hasListener: jest.fn()
  }
};

// Assemble the global chrome object
global.chrome = {
  storage,
  runtime,
  tabs,
  action,
  scripting,
  windows,
  contextMenus
};

// Export for use in tests
module.exports = global.chrome;
