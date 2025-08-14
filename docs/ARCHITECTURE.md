# PromptEnhancer Extension Architecture

## Overview

PromptEnhancer is a Chrome browser extension built with Manifest V3 that enables users to enhance text selections on any webpage using AI-powered processing through n8n workflow integration.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Chrome Browser                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────┐     ┌─────────────────┐                │
│  │   Web Page       │────▶│  Content Script │                │
│  │ (User Selection) │     │   (content.js)  │                │
│  └─────────────────┘     └────────┬────────┘                │
│                                    │                         │
│                          Message Passing                     │
│                                    │                         │
│  ┌─────────────────┐     ┌────────▼────────┐                │
│  │   Popup UI      │────▶│ Service Worker  │                │
│  │  (popup.html)   │     │ (background.js) │                │
│  └─────────────────┘     └────────┬────────┘                │
│                                    │                         │
└────────────────────────────────────┼─────────────────────────┘
                                     │
                            External API Call
                                     │
                          ┌──────────▼──────────┐
                          │   n8n Webhook       │
                          │  (AI Processing)    │
                          └─────────────────────┘
```

## Core Components

### 1. Content Script (`src/content/`)
**Purpose**: Injected into web pages to interact with DOM elements

**Responsibilities**:
- Monitor text selection events
- Create and position enhancement button UI
- Replace selected text with enhanced version
- Handle visual feedback (highlights, notifications)

**Key Files**:
- `content.js`: Main content script logic
- `content.css`: Styling for injected UI elements

**Communication**: 
- Sends messages to background service worker
- Receives enhanced text responses

### 2. Background Service Worker (`src/background/`)
**Purpose**: Central hub for extension logic and external communications

**Responsibilities**:
- Handle messages from content scripts
- Make API calls to n8n webhook
- Manage extension state
- Handle cross-origin requests

**Key Features**:
- Persistent connection management
- Error handling and retry logic
- Request queuing for rate limiting

### 3. Popup Interface (`src/popup/`)
**Purpose**: User interface for extension configuration

**Components**:
- `popup.html`: UI structure
- `popup.js`: Configuration logic
- `popup.css`: Styling

**Features**:
- Webhook URL configuration
- Connection testing
- Usage statistics display
- Quick settings toggle

### 4. Shared Modules (`src/modules/`)
**Purpose**: Reusable utility functions

**Modules**:
- `urlHelper.js`: URL validation and manipulation
- `storageHelper.js`: Chrome storage API wrapper

## Data Flow

### Enhancement Process
1. **Text Selection**: User selects text on webpage
2. **Button Creation**: Content script creates enhancement button
3. **Enhancement Request**: User clicks button
4. **Message Passing**: Content script sends message to background
5. **API Call**: Background worker calls n8n webhook
6. **AI Processing**: n8n workflow processes text
7. **Response Handling**: Enhanced text returned to background
8. **Text Replacement**: Content script replaces original text

### Message Protocol

```javascript
// Content → Background
{
  action: "enhanceText",
  text: "selected text",
  url: "current page URL",
  timestamp: Date.now()
}

// Background → Content
{
  action: "textEnhanced",
  originalText: "selected text",
  enhancedText: "improved text",
  success: true
}
```

## Storage Architecture

### Chrome Storage Areas
- **Local Storage**: Persistent user settings
  - Webhook URL
  - User preferences
  - Usage statistics
  
- **Session Storage**: Temporary data
  - Active enhancement requests
  - Rate limit counters

### Data Schema

```javascript
// Settings Schema
{
  webhookUrl: "https://...",
  enabled: true,
  autoReplace: false,
  highlightDuration: 3000,
  statistics: {
    totalEnhancements: 0,
    dailyUsage: {},
    averageResponseTime: 0
  }
}
```

## Security Considerations

### Content Security Policy
- Strict CSP headers in manifest
- No inline scripts or styles
- Only trusted external resources

### Permission Model
- Minimal permissions requested
- Host permissions for webhook only
- ActiveTab for current page access

### Data Protection
- No sensitive data stored locally
- Webhook URL encrypted in storage
- User text not logged or cached

## Performance Optimization

### Lazy Loading
- Content scripts injected on-demand
- UI elements created when needed
- Resources loaded asynchronously

### Memory Management
- Event listeners properly cleaned up
- DOM references released after use
- Periodic garbage collection triggers

### Network Optimization
- Request debouncing (500ms)
- Retry with exponential backoff
- Response caching for duplicates

## Error Handling

### Error Categories
1. **Network Errors**: Webhook unreachable
2. **API Errors**: Invalid response format
3. **DOM Errors**: Element not found
4. **Permission Errors**: Access denied

### Recovery Strategies
- Automatic retry with backoff
- Fallback to original text
- User-friendly error messages
- Debug logging for developers

## Testing Architecture

### Test Layers
1. **Unit Tests**: Individual functions
2. **Integration Tests**: Component interaction
3. **E2E Tests**: Full user workflows
4. **Performance Tests**: Load and response times

### Mock Strategy
- Chrome API mocks for testing
- Network request interception
- DOM simulation for content scripts

## Build Pipeline

### Development Build
```
src/ → babel → webpack → dist/
```

### Production Build
```
src/ → babel → webpack → minify → dist/
```

### Asset Processing
- Icon generation and optimization
- CSS minification
- Dead code elimination

## Deployment Architecture

### CI/CD Pipeline
1. **Source Control**: GitHub repository
2. **CI**: GitHub Actions workflow
3. **Testing**: Automated test suite
4. **Build**: Production bundle creation
5. **Release**: Chrome Web Store publishing

### Version Management
- Semantic versioning (MAJOR.MINOR.PATCH)
- Automatic changelog generation
- Git tags for releases

## Future Architecture Considerations

### Planned Enhancements
- WebAssembly for heavy processing
- IndexedDB for larger data storage
- Web Workers for background processing
- Support for Firefox/Edge browsers

### Scalability Plan
- Microservice architecture for backend
- CDN for static resources
- Load balancing for API endpoints
- Caching layer for common requests
