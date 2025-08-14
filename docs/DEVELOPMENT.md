# Development Guide

## Table of Contents
- [Environment Setup](#environment-setup)
- [Development Workflow](#development-workflow)
- [Debugging](#debugging)
- [Testing](#testing)
- [Code Style](#code-style)
- [Performance Optimization](#performance-optimization)
- [Troubleshooting](#troubleshooting)

## Environment Setup

### Prerequisites

#### Required Software
- **Node.js**: v16.0.0 or higher
- **npm**: v7.0.0 or higher
- **Chrome Browser**: v88 or higher
- **Git**: v2.0.0 or higher
- **VS Code** (recommended) or your preferred IDE

#### Recommended VS Code Extensions
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "orta.vscode-jest",
    "chrome-devtools-team.vscode-edge-devtools",
    "ritwickdey.liveserver",
    "christian-kohler.npm-intellisense",
    "eg2.vscode-npm-script"
  ]
}
```

### Initial Setup

1. **Clone the Repository**
```bash
git clone https://github.com/your-username/prompt-enhancer.git
cd prompt-enhancer
```

2. **Install Dependencies**
```bash
npm install
```

3. **Set Up Git Hooks**
```bash
npm run setup:hooks
```

4. **Verify Installation**
```bash
npm run validate
```

### Environment Variables

Create a `.env` file in the project root:
```env
# Development
NODE_ENV=development
DEBUG=true

# n8n Configuration
N8N_WEBHOOK_URL=http://localhost:5678/webhook/enhancement
N8N_API_KEY=your-api-key-here

# Testing
TEST_TIMEOUT=30000
COVERAGE_THRESHOLD=80
```

## Development Workflow

### Starting Development

1. **Build in Watch Mode**
```bash
npm run build:watch
```

2. **Load Extension in Chrome**
- Navigate to `chrome://extensions/`
- Enable "Developer mode"
- Click "Load unpacked"
- Select the `dist/` directory

3. **Start n8n Webhook** (if testing with backend)
```bash
# In separate terminal
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

### Hot Reload Setup

The extension supports hot reload for faster development:

```javascript
// In background.js
if (process.env.NODE_ENV === 'development') {
  chrome.runtime.onInstalled.addListener(() => {
    chrome.runtime.reload();
  });
}
```

### Development Commands

```bash
# Core Development
npm run dev              # Start development mode
npm run build:watch      # Auto-rebuild on changes
npm run test:watch       # Run tests in watch mode

# Code Quality
npm run lint             # Check code style
npm run lint:fix         # Auto-fix issues
npm run format           # Format with Prettier

# Testing
npm test                 # Run all tests
npm run test:unit        # Unit tests only
npm run test:integration # Integration tests only
npm run test:coverage    # Generate coverage report
```

## Debugging

### Chrome DevTools

#### Background Service Worker
1. Open `chrome://extensions/`
2. Find PromptEnhancer
3. Click "Inspect views: service worker"
4. Use DevTools Console, Network, and Sources tabs

#### Content Scripts
1. Right-click on any webpage
2. Select "Inspect"
3. Go to Sources → Content Scripts → prompt-enhancer
4. Set breakpoints in content.js

#### Popup Debugging
1. Right-click extension icon
2. Select "Inspect popup"
3. Debug like a regular web page

### Debugging Techniques

#### Console Logging
```javascript
// Development-only logging
if (process.env.NODE_ENV === 'development') {
  console.group('Enhancement Request');
  console.log('Text:', text);
  console.log('URL:', webhookUrl);
  console.time('API Call');
  // ... code ...
  console.timeEnd('API Call');
  console.groupEnd();
}
```

#### Chrome Runtime Error Handling
```javascript
// Global error handler
chrome.runtime.onError.addListener((error) => {
  console.error('Runtime error:', error);
  // Send to error tracking service
});
```

#### Network Debugging
```javascript
// Intercept and log API calls
if (DEBUG) {
  const originalFetch = fetch;
  window.fetch = async (...args) => {
    console.log('Fetch:', args);
    const response = await originalFetch(...args);
    console.log('Response:', response.status);
    return response;
  };
}
```

### VS Code Debugging

Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Launch Chrome Extension",
      "url": "http://localhost:8080",
      "webRoot": "${workspaceFolder}",
      "pathMapping": {
        "/dist": "${workspaceFolder}/dist"
      }
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Jest Tests",
      "program": "${workspaceFolder}/node_modules/.bin/jest",
      "args": ["--runInBand"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

## Testing

### Test Structure

```
tests/
├── unit/                    # Unit tests
│   ├── modules/            # Module tests
│   ├── background/         # Background tests
│   └── content/           # Content script tests
├── integration/            # Integration tests
│   ├── api/              # API integration
│   └── chrome/           # Chrome API tests
├── e2e/                   # End-to-end tests
│   └── scenarios/        # User scenarios
└── __mocks__/            # Mock implementations
    └── chrome.js         # Chrome API mocks
```

### Writing Tests

#### Unit Test Example
```javascript
// tests/unit/modules/urlHelper.test.js
import { isValidUrl, extractDomain } from '../../../src/modules/urlHelper';

describe('URL Helper', () => {
  describe('isValidUrl', () => {
    it('should validate correct URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://localhost:3000')).toBe(true);
    });

    it('should reject invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('')).toBe(false);
    });
  });
});
```

#### Integration Test Example
```javascript
// tests/integration/api/webhook.test.js
describe('Webhook Integration', () => {
  let mockServer;

  beforeAll(() => {
    mockServer = setupMockServer();
  });

  afterAll(() => {
    mockServer.close();
  });

  it('should enhance text via webhook', async () => {
    const result = await callWebhook('Hello', mockServer.url);
    expect(result.enhanced_text).toBeDefined();
    expect(result.success).toBe(true);
  });
});
```

### Test Coverage

Maintain minimum coverage thresholds:
```javascript
// jest.config.js
module.exports = {
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
};
```

Generate coverage reports:
```bash
npm run test:coverage
open coverage/lcov-report/index.html
```

## Code Style

### ESLint Configuration

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended'
  ],
  env: {
    browser: true,
    es2021: true,
    webextensions: true
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'prefer-const': 'error',
    'no-var': 'error'
  }
};
```

### Prettier Configuration

```javascript
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "arrowParens": "always"
}
```

### Naming Conventions

```javascript
// Files and folders
content-script.js    // Kebab case for files
UserProfile.js       // PascalCase for components
urlHelper.js         // camelCase for utilities

// Variables and functions
const MAX_RETRIES = 3;           // UPPER_SNAKE_CASE for constants
let isLoading = false;           // camelCase for variables
function enhanceText() {}        // camelCase for functions
class TextEnhancer {}           // PascalCase for classes

// Chrome message actions
const MESSAGE_ACTIONS = {
  ENHANCE_TEXT: 'enhanceText',
  GET_SETTINGS: 'getSettings',
  UPDATE_STATS: 'updateStats'
};
```

### Code Comments

```javascript
/**
 * Enhances the selected text using AI processing
 * @param {string} text - The text to enhance
 * @param {Object} options - Enhancement options
 * @param {string} options.style - Style preference
 * @param {number} options.maxLength - Maximum length
 * @returns {Promise<string>} Enhanced text
 * @throws {Error} If enhancement fails
 */
async function enhanceText(text, options = {}) {
  // Validate input
  if (!text || text.trim().length === 0) {
    throw new Error('Text cannot be empty');
  }

  // TODO: Add rate limiting
  // FIXME: Handle special characters properly
  // NOTE: This uses the v2 API endpoint

  try {
    const response = await callWebhookAPI(text, options);
    return response.enhanced_text;
  } catch (error) {
    // Log error for debugging
    console.error('Enhancement failed:', error);
    throw error;
  }
}
```

## Performance Optimization

### Bundle Size Optimization

```javascript
// webpack.config.js
module.exports = {
  optimization: {
    usedExports: true,
    minimize: true,
    sideEffects: false,
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10
        }
      }
    }
  }
};
```

### Lazy Loading

```javascript
// Lazy load heavy modules
const loadAnalytics = () => import('./analytics');

// Use when needed
if (userConsent) {
  const analytics = await loadAnalytics();
  analytics.track('enhancement', data);
}
```

### Memory Management

```javascript
// Clean up event listeners
class EnhancementButton {
  constructor() {
    this.handleClick = this.handleClick.bind(this);
  }

  attach() {
    this.element.addEventListener('click', this.handleClick);
  }

  destroy() {
    this.element.removeEventListener('click', this.handleClick);
    this.element.remove();
    this.element = null;
  }
}
```

### Performance Monitoring

```javascript
// Monitor performance metrics
const observer = new PerformanceObserver((list) => {
  for (const entry of list.getEntries()) {
    console.log(`${entry.name}: ${entry.duration}ms`);
    
    // Send to analytics
    if (entry.duration > 1000) {
      reportSlowOperation(entry);
    }
  }
});

observer.observe({ entryTypes: ['measure'] });
```

## Troubleshooting

### Common Issues and Solutions

#### Extension Not Loading
```bash
# Check for build errors
npm run build

# Verify manifest.json
npx chrome-manifest-validator manifest.json

# Check console for errors
# Open chrome://extensions/ → Details → Errors
```

#### Content Script Not Injecting
```javascript
// Check manifest permissions
{
  "content_scripts": [{
    "matches": ["<all_urls>"],  // Or specific patterns
    "run_at": "document_end"    // Try different timings
  }]
}

// Verify in DevTools
// Console → Check for content script errors
// Sources → Content Scripts → Should list your script
```

#### API Calls Failing
```javascript
// Add detailed logging
fetch(url, {
  method: 'POST',
  body: JSON.stringify(data)
})
.then(response => {
  if (!response.ok) {
    console.error('API Error:', response.status, response.statusText);
  }
  return response.json();
})
.catch(error => {
  console.error('Network Error:', error);
  // Check CORS, check webhook URL, check network
});
```

#### Storage Not Persisting
```javascript
// Verify storage permissions
chrome.storage.local.set({ key: value }, () => {
  if (chrome.runtime.lastError) {
    console.error('Storage error:', chrome.runtime.lastError);
  }
});

// Check quota
chrome.storage.local.getBytesInUse(null, (bytes) => {
  console.log('Storage used:', bytes);
});
```

### Debug Checklist

- [ ] Check Chrome version compatibility
- [ ] Verify all permissions in manifest.json
- [ ] Check for console errors in all contexts
- [ ] Verify n8n webhook is accessible
- [ ] Test with minimal reproducible example
- [ ] Check for conflicting extensions
- [ ] Clear extension storage and reload
- [ ] Test in incognito mode
- [ ] Check CSP headers on target sites

### Getting Help

1. **Check Documentation**
   - Read through API.md
   - Review ARCHITECTURE.md
   - Check inline code comments

2. **Debug Logs**
   ```javascript
   // Enable verbose logging
   localStorage.setItem('debug', 'true');
   ```

3. **Community Support**
   - GitHub Issues
   - Stack Overflow tag: `chrome-extension`
   - Chrome Extension Discord

4. **Report Issues**
   ```markdown
   ## Bug Report Template
   **Environment:**
   - Chrome Version: 
   - OS: 
   - Extension Version: 
   
   **Steps to Reproduce:**
   1. 
   2. 
   
   **Expected Behavior:**
   
   **Actual Behavior:**
   
   **Console Errors:**
   ```

## Best Practices Summary

### Do's ✅
- Use TypeScript for better type safety
- Write tests for new features
- Document complex logic
- Use async/await over callbacks
- Handle errors gracefully
- Validate user input
- Use Chrome storage API properly
- Follow semantic versioning

### Don'ts ❌
- Don't use eval() or innerHTML with user content
- Don't store sensitive data in plain text
- Don't make synchronous XHR requests
- Don't ignore Chrome API errors
- Don't use deprecated APIs
- Don't hardcode URLs or credentials
- Don't skip code reviews
- Don't deploy without testing
