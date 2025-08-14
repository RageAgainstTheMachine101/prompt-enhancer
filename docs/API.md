# PromptEnhancer API Documentation

## Table of Contents
- [Content Script API](#content-script-api)
- [Background Service Worker API](#background-service-worker-api)
- [Popup API](#popup-api)
- [Utility Modules](#utility-modules)
- [Chrome Extension APIs](#chrome-extension-apis)
- [n8n Webhook Integration](#n8n-webhook-integration)

## Content Script API

### Core Functions

#### `initContentScript()`
Initializes the content script on page load.

```javascript
initContentScript()
```

**Returns**: `void`  
**Side Effects**: 
- Attaches event listeners to document
- Initializes message listeners
- Sets up mutation observers

---

#### `handleTextSelection(event)`
Handles text selection events on the page.

```javascript
handleTextSelection(event: MouseEvent)
```

**Parameters**:
- `event` - Mouse event from text selection

**Returns**: `void`  
**Behavior**:
- Checks if text is selected
- Creates enhancement button if valid selection
- Positions button near selection

---

#### `createEnhanceButton(selection)`
Creates the enhancement button UI element.

```javascript
createEnhanceButton(selection: Selection): HTMLElement
```

**Parameters**:
- `selection` - Browser Selection object

**Returns**: `HTMLElement` - The created button element  
**DOM Structure**:
```html
<div class="prompt-enhancer-button">
  <img src="icon.png" />
  <span>Enhance</span>
</div>
```

---

#### `enhanceSelectedText(text, element)`
Sends text to background for enhancement.

```javascript
enhanceSelectedText(text: string, element: HTMLElement): Promise<string>
```

**Parameters**:
- `text` - Selected text to enhance
- `element` - DOM element containing the text

**Returns**: `Promise<string>` - Enhanced text  
**Throws**: `Error` if enhancement fails

---

#### `replaceText(element, originalText, enhancedText)`
Replaces original text with enhanced version.

```javascript
replaceText(
  element: HTMLElement, 
  originalText: string, 
  enhancedText: string
): void
```

**Parameters**:
- `element` - Target DOM element
- `originalText` - Text to replace
- `enhancedText` - Replacement text

**Side Effects**:
- Modifies DOM content
- Adds highlight animation
- Shows success notification

---

## Background Service Worker API

### Message Handlers

#### `handleEnhanceText(message, sender, sendResponse)`
Processes text enhancement requests.

```javascript
chrome.runtime.onMessage.addListener(
  function handleEnhanceText(message, sender, sendResponse)
)
```

**Message Format**:
```javascript
{
  action: "enhanceText",
  text: string,
  url?: string,
  metadata?: object
}
```

**Response Format**:
```javascript
{
  success: boolean,
  enhancedText?: string,
  error?: string,
  processingTime?: number
}
```

---

#### `callWebhook(text, webhookUrl)`
Makes API call to n8n webhook.

```javascript
async callWebhook(text: string, webhookUrl: string): Promise<WebhookResponse>
```

**Parameters**:
- `text` - Text to send for processing
- `webhookUrl` - n8n webhook endpoint

**Returns**:
```typescript
interface WebhookResponse {
  enhanced_text: string;
  confidence?: number;
  processing_time?: number;
  model_used?: string;
}
```

**HTTP Details**:
- Method: `POST`
- Headers: `Content-Type: application/json`
- Timeout: 30 seconds
- Retry: 3 attempts with exponential backoff

---

### Storage Operations

#### `saveSettings(settings)`
Saves user settings to Chrome storage.

```javascript
async saveSettings(settings: ExtensionSettings): Promise<void>
```

**Settings Interface**:
```typescript
interface ExtensionSettings {
  webhookUrl: string;
  enabled: boolean;
  autoReplace: boolean;
  highlightDuration: number;
  theme: 'light' | 'dark' | 'auto';
  shortcuts: {
    enhance: string;
    toggle: string;
  };
}
```

---

## Popup API

### Configuration Functions

#### `loadSettings()`
Loads and displays current settings.

```javascript
async loadSettings(): Promise<ExtensionSettings>
```

**Returns**: Current extension settings  
**UI Updates**: Populates form fields with loaded values

---

#### `testConnection(webhookUrl)`
Tests webhook connectivity.

```javascript
async testConnection(webhookUrl: string): Promise<ConnectionTestResult>
```

**Returns**:
```typescript
interface ConnectionTestResult {
  success: boolean;
  responseTime: number;
  error?: string;
  serverVersion?: string;
}
```

**UI Feedback**:
- Success: Green checkmark with response time
- Failure: Red X with error message

---

#### `updateStatistics()`
Updates usage statistics display.

```javascript
async updateStatistics(): Promise<void>
```

**Statistics Displayed**:
- Total enhancements
- Today's usage
- Average response time
- Success rate
- Most enhanced domains

---

## Utility Modules

### URL Helper Module

#### `isValidUrl(url)`
Validates URL format.

```javascript
isValidUrl(url: string): boolean
```

**Examples**:
```javascript
isValidUrl('https://example.com') // true
isValidUrl('not-a-url') // false
isValidUrl('http://localhost:5678/webhook') // true
```

---

#### `extractDomain(url)`
Extracts domain from URL.

```javascript
extractDomain(url: string): string
```

**Examples**:
```javascript
extractDomain('https://sub.example.com/path') // 'sub.example.com'
extractDomain('http://localhost:3000') // 'localhost'
```

---

#### `addQueryParam(url, key, value)`
Adds query parameter to URL.

```javascript
addQueryParam(url: string, key: string, value: string): string
```

**Examples**:
```javascript
addQueryParam('https://api.com', 'token', '123') 
// 'https://api.com?token=123'

addQueryParam('https://api.com?user=1', 'token', '123') 
// 'https://api.com?user=1&token=123'
```

---

### Storage Helper Module

#### `getStorageData(keys, type)`
Retrieves data from Chrome storage.

```javascript
async getStorageData(
  keys: string | string[], 
  type: 'local' | 'sync' = 'local'
): Promise<any>
```

**Examples**:
```javascript
// Single key
const url = await getStorageData('webhookUrl');

// Multiple keys
const data = await getStorageData(['webhookUrl', 'enabled']);

// Sync storage
const syncData = await getStorageData('theme', 'sync');
```

---

#### `setStorageData(data, type)`
Saves data to Chrome storage.

```javascript
async setStorageData(
  data: object, 
  type: 'local' | 'sync' = 'local'
): Promise<void>
```

**Examples**:
```javascript
// Save single value
await setStorageData({ webhookUrl: 'https://...' });

// Save multiple values
await setStorageData({
  webhookUrl: 'https://...',
  enabled: true,
  theme: 'dark'
});
```

---

#### `getOrDefault(key, defaultValue, type)`
Gets value with fallback default.

```javascript
async getOrDefault(
  key: string, 
  defaultValue: any, 
  type: 'local' | 'sync' = 'local'
): Promise<any>
```

**Example**:
```javascript
const theme = await getOrDefault('theme', 'light');
// Returns 'light' if theme not set
```

---

## Chrome Extension APIs

### Runtime API Usage

#### Message Passing
```javascript
// Send message from content to background
chrome.runtime.sendMessage(
  { action: 'enhance', text: 'Hello' },
  response => console.log(response)
);

// Listen for messages in background
chrome.runtime.onMessage.addListener(
  (message, sender, sendResponse) => {
    if (message.action === 'enhance') {
      // Process and respond
      sendResponse({ success: true });
    }
    return true; // Keep channel open for async
  }
);
```

#### Tab Communication
```javascript
// Send to specific tab
chrome.tabs.sendMessage(
  tabId,
  { action: 'highlight' },
  response => console.log(response)
);

// Query active tab
chrome.tabs.query(
  { active: true, currentWindow: true },
  tabs => {
    const activeTab = tabs[0];
    // Use activeTab
  }
);
```

### Storage API Usage

#### Event Listeners
```javascript
// Listen for storage changes
chrome.storage.onChanged.addListener(
  (changes, namespace) => {
    for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
      console.log(`${key}: ${oldValue} → ${newValue}`);
    }
  }
);
```

#### Quota Management
```javascript
// Check storage quota
chrome.storage.local.getBytesInUse(null, bytesInUse => {
  const quotaUsed = bytesInUse / chrome.storage.local.QUOTA_BYTES;
  console.log(`Storage used: ${(quotaUsed * 100).toFixed(2)}%`);
});
```

## n8n Webhook Integration

### Request Format

#### Endpoint
```
POST https://your-n8n-instance.com/webhook/enhancement
```

#### Headers
```http
Content-Type: application/json
X-Extension-Version: 1.0.0
X-Request-ID: uuid-v4
```

#### Request Body
```json
{
  "text": "Original text to enhance",
  "context": {
    "url": "https://current-page.com",
    "domain": "current-page.com",
    "timestamp": 1234567890,
    "language": "en"
  },
  "options": {
    "style": "professional",
    "length": "similar",
    "tone": "neutral"
  }
}
```

### Response Format

#### Success Response (200 OK)
```json
{
  "success": true,
  "data": {
    "enhanced_text": "Enhanced version of the text",
    "confidence": 0.95,
    "model": "gpt-4",
    "processing_time": 1234,
    "tokens_used": 150
  },
  "metadata": {
    "request_id": "uuid-v4",
    "timestamp": 1234567890
  }
}
```

#### Error Response (4xx/5xx)
```json
{
  "success": false,
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests",
    "details": {
      "limit": 100,
      "reset_at": 1234567890
    }
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `INVALID_TEXT` | 400 | Text is empty or too long |
| `UNAUTHORIZED` | 401 | Invalid API key |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `PROCESSING_ERROR` | 500 | Server processing error |
| `SERVICE_UNAVAILABLE` | 503 | n8n service down |

### Rate Limiting

- **Requests per minute**: 60
- **Requests per hour**: 1000
- **Max text length**: 5000 characters
- **Concurrent requests**: 5

### Retry Strategy

```javascript
const retryConfig = {
  maxAttempts: 3,
  backoff: 'exponential',
  initialDelay: 1000,
  maxDelay: 10000,
  retryableErrors: [408, 429, 502, 503, 504]
};
```

## Event System

### Custom Events

#### Enhancement Complete
```javascript
document.dispatchEvent(new CustomEvent('promptEnhanced', {
  detail: {
    originalText: 'Hello',
    enhancedText: 'Greetings',
    element: targetElement,
    timestamp: Date.now()
  }
}));
```

#### Error Event
```javascript
document.dispatchEvent(new CustomEvent('promptError', {
  detail: {
    error: 'Enhancement failed',
    code: 'NETWORK_ERROR',
    retriable: true
  }
}));
```

### Event Listeners

```javascript
// Listen for enhancement events
document.addEventListener('promptEnhanced', (event) => {
  console.log('Text enhanced:', event.detail);
});

// Listen for errors
document.addEventListener('promptError', (event) => {
  console.error('Enhancement error:', event.detail);
});
```

## Performance Metrics

### Tracking Functions

```javascript
// Start performance measurement
const perfMark = performance.mark('enhance-start');

// End measurement
performance.mark('enhance-end');
performance.measure(
  'enhancement-duration',
  'enhance-start',
  'enhance-end'
);

// Get measurements
const measures = performance.getEntriesByType('measure');
const duration = measures[0].duration;
```

### Metrics Collected

- **Response Time**: API call duration
- **Processing Time**: Total enhancement time
- **DOM Operations**: Text replacement time
- **Memory Usage**: Extension memory footprint
- **Cache Hit Rate**: Cached response usage

## Security Best Practices

### Input Validation
```javascript
function sanitizeInput(text) {
  // Remove script tags
  text = text.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  
  // Escape HTML entities
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
```

### XSS Prevention
```javascript
// Safe DOM manipulation
element.textContent = enhancedText; // Safe
// element.innerHTML = enhancedText; // Unsafe
```

### CSP Headers
```javascript
// Content Security Policy
const csp = {
  'default-src': ["'self'"],
  'script-src': ["'self'"],
  'style-src': ["'self'", "'unsafe-inline'"],
  'connect-src': ["'self'", "https://*.n8n.io"]
};
```
