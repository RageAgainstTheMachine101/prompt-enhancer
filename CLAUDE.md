# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build/Lint/Test Commands

```bash
# Build extension (ready to load in Chrome)
npm run build

# Load extension in Chrome for development
npm run dev

# Generate/update extension icons
npm run icons
```

**Testing Approach**: This Chrome extension has no traditional test suite. Testing involves:
1. Loading extension in Chrome via `chrome://extensions/` in Developer Mode
2. Manual testing on various websites with different text selection scenarios
3. Using Chrome DevTools for debugging (content script console, background service worker inspector, popup inspector)
4. Testing webhook connectivity and n8n workflow integration

## Architecture Overview

This is a **Chrome Extension v3** that enhances selected text on web pages using AI via n8n webhook integration. The extension follows a three-component architecture:

### Core Components

1. **Content Script** (`content/content.js`): 
   - Manages text selection detection and UI rendering on web pages
   - Shows enhancement button near selected text with intelligent positioning
   - Handles text replacement after AI enhancement
   - Communicates with background script via message passing

2. **Background Service Worker** (`background/background.js`):
   - Handles webhook requests to n8n to avoid CORS/mixed-content issues
   - Manages extension settings via Chrome Storage API
   - Processes enhancement requests from content scripts

3. **Popup Interface** (`popup/popup.js`):
   - Provides settings management and connection testing
   - Real-time webhook connectivity monitoring with caching
   - User-friendly configuration interface

### Key Technical Patterns

- **Message Passing**: Content scripts communicate with background worker via `chrome.runtime.sendMessage()`
- **Storage Management**: Settings persisted using `chrome.storage.sync` API
- **Event-Driven UI**: Text selection triggers enhancement button via DOM event listeners
- **Error Handling**: Comprehensive error handling with user-friendly toast notifications
- **Async/Await**: Consistent use of modern JavaScript async patterns

### n8n Integration

The extension integrates with n8n workflows via webhook:
- **Default URL**: `http://localhost:5678/webhook-test/n8n/prompt/enhance`
- **Request Format**: JSON payload with `text`, `timestamp`, `url`, and `tabId`
- **Response Format**: Flexible parsing supports `enhancedText`, `enhanced_text`, `text`, `result`, or plain string responses

## Code Style and Conventions

- **Language**: Vanilla JavaScript (ES6+), no TypeScript or build system
- **Formatting**: 2-space indentation, semicolons required, single quotes for strings
- **Classes**: ES6 class syntax for main components (`PromptEnhancer`, `PopupManager`)
- **Error Handling**: Try/catch blocks with user-friendly error messages
- **DOM Manipulation**: Direct DOM API usage, no frameworks
- **Async Operations**: Async/await preferred over callbacks and promises

## Development Workflow

1. Make changes to source files
2. Go to `chrome://extensions/` and reload the extension
3. Test on various websites (Gmail, Google Docs, social media, etc.)
4. Use browser DevTools for debugging different extension contexts
5. Test webhook connectivity and n8n workflow integration

## Extension Permissions

- `activeTab`: Access current tab content for text selection
- `storage`: Persist extension settings
- `host_permissions`: Access to localhost:5678 (n8n) and all HTTPS sites

## Common Development Tasks

When adding new features, follow these patterns:
- Content script modifications require understanding DOM event handling and text selection APIs
- Background script changes involve Chrome Extension APIs and webhook communication
- Popup changes require Chrome Storage API integration and UI state management
- Always test cross-site compatibility and CSP restrictions