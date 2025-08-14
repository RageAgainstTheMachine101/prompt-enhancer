# PromptEnhancer Documentation

Welcome to the comprehensive documentation for the PromptEnhancer Chrome Extension. This documentation covers everything from user guides to technical architecture and deployment procedures.

## 📚 Documentation Structure

### For Users
- **[User Guide](./USER_GUIDE.md)** - Complete guide for using the extension
  - Installation and setup
  - Features and usage
  - Tips and troubleshooting
  - FAQ

### For Developers
- **[Development Guide](./DEVELOPMENT.md)** - Setting up and developing the extension
  - Environment setup
  - Development workflow
  - Debugging techniques
  - Code style guidelines

- **[API Documentation](./API.md)** - Complete API reference
  - Content Script API
  - Background Service Worker API
  - Utility modules
  - Chrome Extension APIs
  - n8n Webhook integration

- **[Architecture](./ARCHITECTURE.md)** - System design and architecture
  - Component overview
  - Data flow
  - Security considerations
  - Performance optimization

- **[Testing Guide](./TESTING.md)** - Comprehensive testing documentation
  - Test structure and organization
  - Writing and running tests
  - Chrome API mocking
  - CI/CD integration

- **[Deployment Guide](./DEPLOYMENT.md)** - Release and deployment procedures
  - Build process
  - Chrome Web Store submission
  - Version management
  - Monitoring and rollback

## 🚀 Quick Start

### For Users
1. Install the extension from Chrome Web Store
2. Configure your n8n webhook URL
3. Start enhancing text on any webpage!

→ See [User Guide](./USER_GUIDE.md) for detailed instructions

### For Developers
```bash
# Clone repository
git clone https://github.com/your-username/prompt-enhancer.git
cd prompt-enhancer

# Install dependencies
npm install

# Run tests
npm test

# Build extension
npm run build

# Load in Chrome
# 1. Navigate to chrome://extensions/
# 2. Enable Developer mode
# 3. Load unpacked → Select dist/ folder
```

→ See [Development Guide](./DEVELOPMENT.md) for complete setup

## 📖 Documentation Navigation

### By Role

#### 👤 End Users
Start with:
1. [User Guide](./USER_GUIDE.md) - Learn how to use the extension
2. [FAQ section](./USER_GUIDE.md#faq) - Common questions answered

#### 👨‍💻 Developers
Essential reading:
1. [Architecture](./ARCHITECTURE.md) - Understand the system
2. [Development Guide](./DEVELOPMENT.md) - Set up environment
3. [API Documentation](./API.md) - API reference
4. [Testing Guide](./TESTING.md) - Write and run tests

#### 🚀 DevOps/Release Managers
Focus on:
1. [Deployment Guide](./DEPLOYMENT.md) - Release procedures
2. [CI/CD section](./TESTING.md#cicd-integration) - Automation setup
3. [Monitoring section](./DEPLOYMENT.md#monitoring) - Production monitoring

### By Task

#### Setting Up Development Environment
1. [Prerequisites](./DEVELOPMENT.md#prerequisites)
2. [Initial Setup](./DEVELOPMENT.md#initial-setup)
3. [Environment Variables](./DEVELOPMENT.md#environment-variables)

#### Making Code Changes
1. [Development Workflow](./DEVELOPMENT.md#development-workflow)
2. [Code Style](./DEVELOPMENT.md#code-style)
3. [Testing](./TESTING.md#writing-tests)
4. [Debugging](./DEVELOPMENT.md#debugging)

#### Releasing New Version
1. [Pre-deployment Checklist](./DEPLOYMENT.md#pre-deployment-checklist)
2. [Build Process](./DEPLOYMENT.md#build-process)
3. [Release Process](./DEPLOYMENT.md#release-process)
4. [Chrome Web Store Deployment](./DEPLOYMENT.md#chrome-web-store-deployment)

#### Troubleshooting Issues
1. [User Troubleshooting](./USER_GUIDE.md#troubleshooting)
2. [Development Issues](./DEVELOPMENT.md#troubleshooting)
3. [Deployment Issues](./DEPLOYMENT.md#troubleshooting-deployment)
4. [Test Failures](./TESTING.md#debugging-tests)

## 🛠️ Technology Stack

### Frontend
- **Chrome Extension Manifest V3**
- **Vanilla JavaScript** (ES6+)
- **HTML5/CSS3**
- **Chrome Extension APIs**

### Development
- **Node.js** - Development environment
- **Jest** - Testing framework
- **Webpack** - Build tool
- **ESLint** - Code linting
- **Prettier** - Code formatting

### CI/CD
- **GitHub Actions** - CI/CD pipeline
- **Codecov** - Coverage reporting
- **Chrome Web Store API** - Automated deployment

## 📄 License

This project is licensed under the MIT License.

---

**Documentation Version**: 1.0.0 | Last Updated: January 2024
