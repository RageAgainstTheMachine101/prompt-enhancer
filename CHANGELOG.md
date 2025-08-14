# Changelog

All notable changes to the PromptEnhancer Chrome Extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- **Project Restructuring** - Complete reorganization for scalability
  - Implemented modular architecture with `src/` directory structure
  - Separated concerns: `background/`, `content/`, `popup/`, `modules/`
  - Added `assets/` directory for icons and static resources
  - Created `config/` directory for centralized configuration
  - Established `scripts/` directory for build and utility scripts
  - Set up `tests/` directory with unit and integration test structure
  - Added `docs/` directory for additional documentation

- **Testing Infrastructure**
  - Integrated Jest testing framework with 70% coverage threshold
  - Added comprehensive Chrome API mocks for testing
  - Created unit tests for utility modules
  - Implemented integration tests for storage operations
  - Added test coverage reporting (text, lcov, html formats)

- **Development Tools**
  - ESLint configuration for code quality enforcement
  - Babel configuration for modern JavaScript support
  - Custom build script for extension packaging
  - Watch mode for development builds
  - NPM scripts for common development tasks

- **CI/CD Pipeline**
  - GitHub Actions workflow for continuous integration
  - Automated linting, testing, and building on PR/push
  - Code coverage reporting with Codecov integration
  - Build artifact generation for releases
  - Manifest validation checks

- **Documentation**
  - Comprehensive README with setup and contribution guidelines
  - API documentation for utility modules
  - Test writing guidelines
  - Development workflow documentation

### Changed
- **File Structure**
  - Moved `background/background.js` to `src/background/background.js`
  - Moved `content/` files to `src/content/`
  - Moved `popup/` files to `src/popup/`
  - Relocated `icons/` to `src/assets/icons/`
  - Updated all paths in `manifest.json` to reflect new structure

- **Build Process**
  - Extension now builds to `dist/` directory
  - Source files remain in `src/` for development
  - Clean separation between source and build output

### Technical Improvements
- Added error handling patterns in utility modules
- Implemented Promise-based Chrome API wrappers
- Created reusable helper functions for common operations
- Established consistent code style with ESLint

## [1.0.0] - Previous Release

### Features
- Text enhancement through AI workflows
- Integration with n8n automation platform
- Chrome extension popup interface
- Content script for text selection
- Background service worker for API communication
- Local storage for user preferences
- Support for multiple enhancement styles
- Real-time text processing

### Core Functionality
- Select text on any webpage
- Click enhance button in popup
- Receive AI-enhanced version
- Copy enhanced text to clipboard
- Configurable API endpoint
- Error handling and user feedback

---

## Migration Guide

### For Developers

When updating from v1.0.0 to the new structure:

1. **Install dependencies**: Run `npm install` to get all new dev dependencies
2. **Update file imports**: All source files are now under `src/`
3. **Run tests**: Execute `npm test` to ensure everything works
4. **Build extension**: Use `npm run build` to create the `dist/` folder
5. **Load in Chrome**: Load the unpacked extension from `dist/` directory

### For Users

No action required - the extension functionality remains unchanged. Simply update through Chrome's extension management when the new version is available.

---

## Contributing

Please see [README.md](README.md) for contribution guidelines and development setup instructions.
