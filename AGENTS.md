# AGENTS.md

This file provides guidance to coding agents when working with code in this repository.

## Build/Lint/Test Commands

```bash
# Build extension (ready to load in Chrome)
npm run build

# Load extension in Chrome for development
npm run dev

# Generate/update extension icons
npm run icons
```

Note: This is a Chrome extension with no traditional test suite. Testing involves:
1. Loading extension in Chrome (`npm run dev`)
2. Manual testing on various websites
3. Using Chrome DevTools for debugging

## Code Style Guidelines

### Imports and Dependencies
- No build system; pure JavaScript with Chrome Extension APIs
- No external dependencies in package.json
- Use Chrome's built-in APIs via `chrome.*` namespace
- Content scripts use standard DOM APIs

### Formatting
- 2-space indentation
- Semicolons at end of statements
- Single quotes for strings
- Consistent spacing around operators
- Curly braces on same line as statements

### Types
- Vanilla JavaScript (no TypeScript)
- Use JSDoc comments for function documentation
- Async/await preferred over callbacks
- Promises for asynchronous operations

### Naming Conventions
- camelCase for variables and functions
- PascalCase for classes
- Constants in UPPER_SNAKE_CASE
- Descriptive function/variable names
- Boolean variables prefixed with `is`, `has`, `should`

### Error Handling
- Try/catch blocks for async operations
- User-friendly error messages
- Console logging for debugging
- Graceful degradation when features fail

### UI/UX Patterns
- CSS animations for smooth transitions
- Responsive design principles
- Accessible color contrast
- User feedback for all actions
- Toast notifications for status updates

### Chrome Extension Best Practices
- Minimal permissions
- Content scripts injected at document_end
- Storage API for settings persistence
- Service worker for background tasks
- Message passing between components
