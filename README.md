# PromptEnhancer Chrome Extension 🚀

> Transform your text with AI-powered enhancement directly in your browser. Select, enhance, and elevate your writing instantly.

[![CI/CD Pipeline](https://github.com/your-username/prompt-enhancer-extension/actions/workflows/ci.yml/badge.svg)](https://github.com/your-username/prompt-enhancer-extension/actions/workflows/ci.yml)
[![Test Coverage](https://codecov.io/gh/your-username/prompt-enhancer-extension/branch/main/graph/badge.svg)](https://codecov.io/gh/your-username/prompt-enhancer-extension)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) workflows. Simply select text on any webpage, click "Enhance", and watch as your content is improved by AI.

## 📁 Project Structure

```
prompt-enhancer/
├── src/                      # Source code
│   ├── background/           # Background service worker
│   ├── content/              # Content scripts
│   ├── popup/                # Extension popup UI
│   ├── options/              # Options page (future)
│   ├── modules/              # Shared utility modules
│   └── assets/               # Icons and static resources
├── tests/                    # Test suites
│   ├── unit/                 # Unit tests
│   ├── integration/          # Integration tests
│   └── __mocks__/            # Test mocks
├── config/                   # Configuration files
│   ├── jest.config.js        # Jest testing config
│   └── .eslintrc.js          # ESLint rules
├── scripts/                  # Build and utility scripts
│   └── build.js              # Build script
├── dist/                     # Build output (gitignored)
├── .github/                  # GitHub Actions workflows
├── docs/                     # Additional documentation
├── manifest.json             # Extension manifest (v3)
├── package.json              # Dependencies and scripts
├── CHANGELOG.md              # Version history
└── README.md                 # This file
```

## 🎯 Features

### Currently Implemented ✅
- **Text Selection Enhancement**: Select any text on a webpage and enhance it with AI
- **Smart Button Positioning**: Enhancement button appears intelligently positioned near selected text
- **n8n Webhook Integration**: Seamless integration with n8n workflows
{{ ... }}
2. **Enhancement Button** → "Enhance" button appears with extension icon
3. **AI Processing** → Click triggers n8n webhook with selected text
4. **Text Replacement** → Enhanced text replaces original selection
5. **Visual Confirmation** → Success notification and highlighted result

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- Google Chrome (version 88 or higher)
- n8n workflow automation platform running locally or accessible via URL

### Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/prompt-enhancer-extension.git
   cd prompt-enhancer-extension
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run tests**
   ```bash
   npm test              # Run all tests
   npm run test:watch    # Run tests in watch mode
   npm run test:coverage # Generate coverage report
   ```

4. **Build the extension**
   ```bash
   npm run build         # Build to dist/
   npm run build:watch   # Build with file watching
   ```

5. **Load in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist/` folderendpoint
- Basic understanding of Chrome extensions

### Steps
1. **Download/Clone** this repository
2. **Generate Icons** (optional):
   - Open `icons/generate-icons.html` in browser
   - Download the generated PNG files
   -## 📦 Available Scripts

```bash
# Testing
npm test                 # Run tests once
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage report

# Code Quality
npm run lint             # Check code with ESLint
npm run lint:fix         # Auto-fix linting issues

# Building
npm run build            # Build extension to dist/
npm run build:watch      # Build with auto-rebuild on changes
npm run clean            # Clean dist/ directory

# Development
npm run dev              # Show development instructions
npm run validate         # Run lint and tests
npm run precommit        # Pre-commit validation
```ick the PromptEnhancer icon in Chrome toolbar
   - Set your n8n webhook URL
   - Test connection
   - Save settings

## ⚙️ Configuration
{{ ... }}
- Extension version
- Webhook URL (without sensitive data)
- Console error messages
- Steps to reproduce

## 🚀 CI/CD Pipeline

The project uses GitHub Actions for continuous integration:

- **Linting**: Checks code style on every push/PR
- **Testing**: Runs full test suite with coverage
- **Building**: Validates build output
- **Artifacts**: Generates extension package for releases

View the workflow status and details in the [Actions tab](https://github.com/your-username/prompt-enhancer-extension/actions).

## 📚 API Documentation

### Utility Modules

#### URL Helper (`src/modules/urlHelper.js`)
```javascript
isValidUrl(url)           // Validate URL format
extractDomain(url)        // Extract domain from URL
isAllowedDomain(url, domains)  // Check against whitelist
addQueryParam(url, key, value) // Add URL parameter
removeQueryParam(url, key)     // Remove URL parameter
```

#### Storage Helper (`src/modules/storageHelper.js`)
```javascript
getStorageData(keys, type)     // Get from Chrome storage
setStorageData(data, type)     // Save to Chrome storage
removeStorageData(keys, type)  // Remove from storage
clearStorage(type)             // Clear all storage
getOrDefault(key, default, type) // Get with fallback
```

## 🐛 Troubleshooting

### Common Issues

**Extension not loading:**
- Ensure you're loading from `dist/` not the root directory
- Run `npm run build` first
- Check Chrome console for errors

**Tests failing:**
- Run `npm install` to ensure all dependencies are installed
- Clear Jest cache: `npx jest --clearCache`
- Check Node.js version (16+ required)

**Build errors:**
- Delete `dist/` and rebuild: `npm run clean && npm run build`
- Check for syntax errors: `npm run lint`

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.tribute according to your needs.

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation as needed
4. **Run validation**
   ```bash
   npm run validate  # Runs lint and tests
   ```
5. **Commit your changes**
   ```bash
   git commit -m "feat: add awesome feature"
   ```
6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
7. **Open a Pull Request**

### Code Style Guidelines

- Use ES6+ features where appropriate
- Follow ESLint rules (run `npm run lint`)
- Use meaningful variable and function names
- Add JSDoc comments for public functions
- Keep functions small and focused

### Commit Message Format

```
<type>: <description>

Types:
- feat: New feature
- fix: Bug fix
- docs: Documentation changes
- style: Code style changes
- refactor: Code refactoring
- test: Test additions/changes
- chore: Build/tooling changes
```e feature branch
3. Make changes with tests
4. Submit pull request with description

## 📞 Support
- Check existing issues first
- Create detailed bug reports
- Include debug information
- Test on multiple sites before reporting

---

**PromptEnhancer v1.0.0** - Enhance your text with AI, one selection at a time! ✨