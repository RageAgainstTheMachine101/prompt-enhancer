# Testing Guide

## Overview

This guide covers the comprehensive testing strategy for the PromptEnhancer Chrome Extension, including unit tests, integration tests, end-to-end tests, and performance testing.

## Table of Contents
- [Test Architecture](#test-architecture)
- [Running Tests](#running-tests)
- [Writing Tests](#writing-tests)
- [Chrome API Mocking](#chrome-api-mocking)
- [Test Coverage](#test-coverage)
- [CI/CD Integration](#cicd-integration)
- [Best Practices](#best-practices)

## Test Architecture

### Test Structure
```
tests/
├── unit/                       # Isolated unit tests
│   ├── modules/               # Utility module tests
│   │   ├── urlHelper.test.js
│   │   └── storageHelper.test.js
│   ├── background/            # Background script tests
│   │   └── background.test.js
│   └── content/               # Content script tests
│       └── content.test.js
├── integration/               # Component integration tests
│   ├── api/                  # API integration tests
│   │   └── webhook.test.js
│   ├── storage/              # Storage integration tests
│   │   └── persistence.test.js
│   └── messaging/            # Message passing tests
│       └── runtime.test.js
├── e2e/                      # End-to-end tests
│   ├── scenarios/            # User journey tests
│   │   ├── enhancement.test.js
│   │   └── configuration.test.js
│   └── fixtures/             # Test data
│       └── testData.js
├── performance/              # Performance tests
│   └── loadTest.js
└── __mocks__/               # Mock implementations
    ├── chrome.js            # Chrome API mocks
    ├── fetch.js             # Network mocks
    └── dom.js               # DOM mocks
```

### Test Framework Stack
- **Jest**: Primary testing framework
- **Puppeteer**: E2E browser automation
- **Chrome Extension Testing**: Custom test utilities
- **Coverage**: Istanbul/nyc for coverage reports

## Running Tests

### Quick Start
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch

# Run specific test suite
npm run test:unit
npm run test:integration
npm run test:e2e
```

### Test Commands

#### Basic Testing
```bash
# Run all tests with default reporter
npm test

# Run tests in watch mode for development
npm run test:watch

# Run tests with verbose output
npm test -- --verbose

# Run tests matching pattern
npm test -- --testNamePattern="enhancement"

# Run specific test file
npm test -- tests/unit/modules/urlHelper.test.js
```

#### Coverage Testing
```bash
# Generate coverage report
npm run test:coverage

# Generate HTML coverage report
npm run test:coverage -- --coverageReporters=html

# Open coverage report in browser
open coverage/lcov-report/index.html

# Check coverage thresholds
npm run test:coverage -- --coverageThreshold='{"global":{"branches":80}}'
```

#### Debugging Tests
```bash
# Run tests with debugger
node --inspect-brk node_modules/.bin/jest --runInBand

# Run single test with console output
npm test -- --verbose --runInBand tests/unit/specific.test.js

# Run with extended timeout for debugging
npm test -- --testTimeout=50000
```

## Writing Tests

### Unit Tests

#### Basic Unit Test Structure
```javascript
// tests/unit/modules/urlHelper.test.js
import { isValidUrl, extractDomain, addQueryParam } from '../../../src/modules/urlHelper';

describe('URL Helper Module', () => {
  describe('isValidUrl', () => {
    it('should validate correct URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://localhost:3000')).toBe(true);
      expect(isValidUrl('ftp://files.com')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('')).toBe(false);
      expect(isValidUrl(null)).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(isValidUrl('https://sub.domain.co.uk')).toBe(true);
      expect(isValidUrl('http://192.168.1.1')).toBe(true);
      expect(isValidUrl('https://example.com:8080/path')).toBe(true);
    });
  });

  describe('extractDomain', () => {
    it('should extract domain from URL', () => {
      expect(extractDomain('https://www.example.com/path')).toBe('www.example.com');
      expect(extractDomain('http://subdomain.site.org')).toBe('subdomain.site.org');
    });

    it('should handle URLs with ports', () => {
      expect(extractDomain('http://localhost:3000')).toBe('localhost');
      expect(extractDomain('https://api.com:8443/v1')).toBe('api.com');
    });
  });
});
```

#### Testing Async Functions
```javascript
// tests/unit/modules/storageHelper.test.js
import { getStorageData, setStorageData } from '../../../src/modules/storageHelper';

describe('Storage Helper', () => {
  beforeEach(() => {
    // Clear mock storage before each test
    chrome.storage.local.clear();
  });

  describe('getStorageData', () => {
    it('should retrieve stored data', async () => {
      // Arrange
      const testData = { webhookUrl: 'https://test.com' };
      await chrome.storage.local.set(testData);

      // Act
      const result = await getStorageData('webhookUrl');

      // Assert
      expect(result).toBe('https://test.com');
    });

    it('should return undefined for missing keys', async () => {
      const result = await getStorageData('nonexistent');
      expect(result).toBeUndefined();
    });

    it('should handle multiple keys', async () => {
      await chrome.storage.local.set({
        key1: 'value1',
        key2: 'value2'
      });

      const result = await getStorageData(['key1', 'key2']);
      expect(result).toEqual({
        key1: 'value1',
        key2: 'value2'
      });
    });
  });
});
```

### Integration Tests

#### API Integration Test
```javascript
// tests/integration/api/webhook.test.js
import { callWebhook } from '../../../src/background/api';
import { mockServer } from '../../__mocks__/server';

describe('Webhook API Integration', () => {
  beforeAll(() => mockServer.listen());
  afterEach(() => mockServer.resetHandlers());
  afterAll(() => mockServer.close());

  it('should successfully enhance text', async () => {
    // Arrange
    const originalText = 'Hello world';
    const webhookUrl = 'http://localhost:5678/webhook';

    // Act
    const result = await callWebhook(originalText, webhookUrl);

    // Assert
    expect(result).toMatchObject({
      success: true,
      enhanced_text: expect.any(String),
      processing_time: expect.any(Number)
    });
  });

  it('should handle API errors gracefully', async () => {
    // Simulate server error
    mockServer.use(
      rest.post('*/webhook', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Server error' }));
      })
    );

    await expect(callWebhook('text', 'http://localhost:5678/webhook'))
      .rejects
      .toThrow('Enhancement failed');
  });

  it('should retry on network failures', async () => {
    let attempts = 0;
    mockServer.use(
      rest.post('*/webhook', (req, res, ctx) => {
        attempts++;
        if (attempts < 3) {
          return res.networkError('Network failure');
        }
        return res(ctx.json({ enhanced_text: 'Success after retry' }));
      })
    );

    const result = await callWebhook('text', 'http://localhost:5678/webhook');
    expect(attempts).toBe(3);
    expect(result.enhanced_text).toBe('Success after retry');
  });
});
```

#### Message Passing Test
```javascript
// tests/integration/messaging/runtime.test.js
describe('Chrome Runtime Messaging', () => {
  let backgroundScript;
  let contentScript;

  beforeEach(() => {
    // Setup message channels
    backgroundScript = require('../../../src/background/background');
    contentScript = require('../../../src/content/content');
  });

  it('should pass messages from content to background', async () => {
    // Simulate content script sending message
    const response = await chrome.runtime.sendMessage({
      action: 'enhanceText',
      text: 'Test text'
    });

    expect(response).toMatchObject({
      success: true,
      enhancedText: expect.any(String)
    });
  });

  it('should handle invalid message format', async () => {
    const response = await chrome.runtime.sendMessage({
      invalidAction: 'test'
    });

    expect(response).toMatchObject({
      success: false,
      error: 'Invalid message format'
    });
  });
});
```

### End-to-End Tests

#### E2E Test Setup
```javascript
// tests/e2e/setup.js
const puppeteer = require('puppeteer');
const path = require('path');

export async function setupBrowser() {
  const pathToExtension = path.join(__dirname, '../../dist');
  
  const browser = await puppeteer.launch({
    headless: false, // Set to true for CI
    args: [
      `--disable-extensions-except=${pathToExtension}`,
      `--load-extension=${pathToExtension}`,
      '--no-sandbox'
    ]
  });

  const targets = await browser.targets();
  const backgroundPageTarget = targets.find(
    target => target.type() === 'background_page'
  );
  const backgroundPage = await backgroundPageTarget.page();

  return { browser, backgroundPage };
}
```

#### E2E Scenario Test
```javascript
// tests/e2e/scenarios/enhancement.test.js
import { setupBrowser } from '../setup';

describe('Text Enhancement E2E', () => {
  let browser;
  let page;

  beforeAll(async () => {
    ({ browser } = await setupBrowser());
  });

  beforeEach(async () => {
    page = await browser.newPage();
    await page.goto('https://example.com');
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    await browser.close();
  });

  it('should enhance selected text on webpage', async () => {
    // Create text to select
    await page.evaluate(() => {
      document.body.innerHTML = '<p id="test">Enhance this text</p>';
    });

    // Select text
    await page.evaluate(() => {
      const element = document.getElementById('test');
      const range = document.createRange();
      range.selectNodeContents(element);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    });

    // Wait for enhancement button
    await page.waitForSelector('.prompt-enhancer-button', { timeout: 5000 });

    // Click enhance button
    await page.click('.prompt-enhancer-button');

    // Wait for enhancement to complete
    await page.waitForFunction(
      () => document.querySelector('.enhancement-success'),
      { timeout: 10000 }
    );

    // Verify text was replaced
    const enhancedText = await page.$eval('#test', el => el.textContent);
    expect(enhancedText).not.toBe('Enhance this text');
    expect(enhancedText.length).toBeGreaterThan(0);
  });
});
```

## Chrome API Mocking

### Chrome Storage Mock
```javascript
// tests/__mocks__/chrome.js
global.chrome = {
  storage: {
    local: {
      data: {},
      get: jest.fn((keys, callback) => {
        const result = {};
        if (typeof keys === 'string') {
          result[keys] = global.chrome.storage.local.data[keys];
        } else if (Array.isArray(keys)) {
          keys.forEach(key => {
            result[key] = global.chrome.storage.local.data[key];
          });
        }
        callback(result);
        return Promise.resolve(result);
      }),
      set: jest.fn((items, callback) => {
        Object.assign(global.chrome.storage.local.data, items);
        if (callback) callback();
        return Promise.resolve();
      }),
      clear: jest.fn((callback) => {
        global.chrome.storage.local.data = {};
        if (callback) callback();
        return Promise.resolve();
      })
    }
  },
  runtime: {
    onMessage: {
      addListener: jest.fn(),
      removeListener: jest.fn()
    },
    sendMessage: jest.fn(),
    lastError: null,
    getManifest: jest.fn(() => ({
      version: '1.0.0',
      name: 'PromptEnhancer'
    }))
  },
  tabs: {
    query: jest.fn(),
    sendMessage: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  }
};
```

### DOM Mock for Content Scripts
```javascript
// tests/__mocks__/dom.js
export function setupDOM() {
  document.body.innerHTML = `
    <div id="content">
      <p id="text1">Sample text for testing</p>
      <p id="text2">Another paragraph</p>
    </div>
  `;

  // Mock selection API
  global.getSelection = jest.fn(() => ({
    toString: jest.fn(() => 'Selected text'),
    getRangeAt: jest.fn(() => ({
      getBoundingClientRect: jest.fn(() => ({
        top: 100,
        left: 200,
        bottom: 120,
        right: 400
      }))
    })),
    removeAllRanges: jest.fn(),
    addRange: jest.fn()
  }));
}
```

## Test Coverage

### Coverage Configuration
```javascript
// jest.config.js
module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/**/*.test.js',
    '!src/__mocks__/**'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    },
    './src/modules/': {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },
  coverageReporters: ['text', 'lcov', 'html'],
  coverageDirectory: 'coverage'
};
```

### Coverage Report Analysis
```bash
# Generate detailed coverage report
npm run test:coverage

# Coverage output example:
# -------------------------|---------|----------|---------|---------|
# File                     | % Stmts | % Branch | % Funcs | % Lines |
# -------------------------|---------|----------|---------|---------|
# All files               |   85.42 |    82.35 |   88.46 |   85.71 |
#  src/modules            |   92.31 |    90.00 |   95.00 |   92.31 |
#   urlHelper.js          |   93.75 |    91.67 |     100 |   93.75 |
#   storageHelper.js      |   90.91 |    88.89 |   90.00 |   90.91 |
#  src/background         |   82.50 |    78.57 |   85.71 |   82.50 |
#   background.js         |   82.50 |    78.57 |   85.71 |   82.50 |
# -------------------------|---------|----------|---------|---------|
```

## CI/CD Integration

### GitHub Actions Workflow
```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [16.x, 18.x, 20.x]
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: ${{ matrix.node-version }}
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run linter
      run: npm run lint
    
    - name: Run unit tests
      run: npm run test:unit
    
    - name: Run integration tests
      run: npm run test:integration
    
    - name: Generate coverage report
      run: npm run test:coverage
    
    - name: Upload coverage to Codecov
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info
        flags: unittests
        name: codecov-umbrella
    
    - name: Archive test results
      if: always()
      uses: actions/upload-artifact@v3
      with:
        name: test-results
        path: |
          coverage/
          test-results/
```

### Pre-commit Hooks
```json
// package.json
{
  "husky": {
    "hooks": {
      "pre-commit": "npm run lint && npm run test:unit",
      "pre-push": "npm run test"
    }
  }
}
```

## Best Practices

### Test Organization

#### AAA Pattern (Arrange, Act, Assert)
```javascript
it('should enhance text successfully', async () => {
  // Arrange - Set up test data and conditions
  const originalText = 'Hello world';
  const expectedEnhancement = 'Greetings, world';
  mockAPI.setResponse(expectedEnhancement);

  // Act - Execute the function being tested
  const result = await enhanceText(originalText);

  // Assert - Verify the results
  expect(result).toBe(expectedEnhancement);
  expect(mockAPI.calls).toHaveLength(1);
});
```

#### Test Isolation
```javascript
describe('Feature Suite', () => {
  let testContext;

  beforeEach(() => {
    // Fresh context for each test
    testContext = createTestContext();
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Cleanup after each test
    testContext.cleanup();
  });

  it('test 1', () => {
    // Isolated test
  });

  it('test 2', () => {
    // Another isolated test
  });
});
```

### Test Data Management

#### Fixtures
```javascript
// tests/fixtures/testData.js
export const testUrls = {
  valid: [
    'https://example.com',
    'http://localhost:3000',
    'https://sub.domain.co.uk/path?query=1'
  ],
  invalid: [
    'not-a-url',
    '',
    'javascript:alert(1)'
  ]
};

export const testTexts = {
  short: 'Hello',
  medium: 'This is a medium length text for testing purposes.',
  long: 'Lorem ipsum...'.repeat(100)
};
```

#### Factories
```javascript
// tests/factories/messageFactory.js
export function createMessage(overrides = {}) {
  return {
    action: 'enhanceText',
    text: 'Default text',
    timestamp: Date.now(),
    ...overrides
  };
}

// Usage in tests
const message = createMessage({ text: 'Custom text' });
```

### Assertion Best Practices

```javascript
// Good - Specific assertions
expect(result.enhancedText).toBe('Expected enhanced text');
expect(result.processingTime).toBeLessThan(5000);

// Bad - Too generic
expect(result).toBeTruthy();
expect(result).toBeDefined();

// Good - Multiple related assertions
expect(response).toMatchObject({
  success: true,
  data: expect.objectContaining({
    id: expect.any(String),
    timestamp: expect.any(Number)
  })
});

// Good - Custom matchers for complex assertions
expect.extend({
  toBeValidUrl(received) {
    const pass = isValidUrl(received);
    return {
      pass,
      message: () => `Expected ${received} to be a valid URL`
    };
  }
});

expect('https://example.com').toBeValidUrl();
```

### Performance Testing

```javascript
// tests/performance/loadTest.js
describe('Performance Tests', () => {
  it('should enhance text within 3 seconds', async () => {
    const start = performance.now();
    await enhanceText('Test text');
    const end = performance.now();
    
    expect(end - start).toBeLessThan(3000);
  });

  it('should handle 100 concurrent requests', async () => {
    const requests = Array(100).fill(null).map((_, i) => 
      enhanceText(`Text ${i}`)
    );
    
    const start = performance.now();
    const results = await Promise.all(requests);
    const end = performance.now();
    
    expect(results).toHaveLength(100);
    expect(results.every(r => r.success)).toBe(true);
    expect(end - start).toBeLessThan(10000);
  });
});
```

## Debugging Tests

### VS Code Debug Configuration
```json
{
  "type": "node",
  "request": "launch",
  "name": "Debug Jest Tests",
  "program": "${workspaceFolder}/node_modules/.bin/jest",
  "args": [
    "--runInBand",
    "--no-cache",
    "--watchAll=false"
  ],
  "console": "integratedTerminal",
  "internalConsoleOptions": "neverOpen",
  "disableOptimisticBPs": true
}
```

### Debugging Tips

```javascript
// Add debug output
it('should process data correctly', () => {
  const data = processData(input);
  
  // Debug output
  console.log('Input:', input);
  console.log('Output:', data);
  console.log('Type:', typeof data);
  
  expect(data).toEqual(expected);
});

// Use debugger statement
it('should handle edge case', () => {
  debugger; // Breakpoint here
  const result = complexFunction();
  expect(result).toBeDefined();
});

// Increase timeout for debugging
it('complex async operation', async () => {
  jest.setTimeout(50000); // 50 seconds
  const result = await longRunningOperation();
  expect(result).toBeTruthy();
});
```

## Common Testing Patterns

### Testing Error Scenarios
```javascript
describe('Error Handling', () => {
  it('should throw on invalid input', () => {
    expect(() => processText(null)).toThrow('Invalid input');
    expect(() => processText('')).toThrow('Text cannot be empty');
  });

  it('should handle async errors', async () => {
    await expect(fetchData('invalid-url')).rejects.toThrow('Network error');
  });
});
```

### Testing State Changes
```javascript
describe('State Management', () => {
  it('should update state correctly', () => {
    const initialState = { count: 0 };
    const newState = reducer(initialState, { type: 'INCREMENT' });
    
    expect(newState).not.toBe(initialState); // Immutability check
    expect(newState.count).toBe(1);
  });
});
```

### Testing Side Effects
```javascript
describe('Side Effects', () => {
  it('should call external API', async () => {
    const apiSpy = jest.spyOn(api, 'call');
    
    await processWithAPI('data');
    
    expect(apiSpy).toHaveBeenCalledWith('data');
    expect(apiSpy).toHaveBeenCalledTimes(1);
  });
});
```
