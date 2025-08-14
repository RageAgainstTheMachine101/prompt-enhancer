# Deployment Guide

## Overview

This guide covers the complete deployment process for the PromptEnhancer Chrome Extension, from local development to production release on the Chrome Web Store.

## Table of Contents
- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Build Process](#build-process)
- [Chrome Web Store Deployment](#chrome-web-store-deployment)
- [Version Management](#version-management)
- [Release Process](#release-process)
- [Rollback Procedures](#rollback-procedures)
- [Monitoring](#monitoring)

## Pre-Deployment Checklist

### Code Quality
- [ ] All tests passing (`npm test`)
- [ ] Code coverage meets threshold (>80%)
- [ ] No linting errors (`npm run lint`)
- [ ] Security audit passed (`npm audit`)
- [ ] Performance benchmarks met
- [ ] Cross-browser compatibility tested

### Documentation
- [ ] README.md updated
- [ ] CHANGELOG.md updated with version notes
- [ ] API documentation current
- [ ] User guide updated
- [ ] Migration guide (if breaking changes)

### Legal & Compliance
- [ ] Privacy policy updated
- [ ] Terms of service current
- [ ] GDPR compliance verified
- [ ] Required permissions justified
- [ ] Third-party licenses documented

## Build Process

### Development Build
```bash
# Clean previous builds
npm run clean

# Install dependencies
npm ci

# Run validation
npm run validate

# Build for development
npm run build:dev
```

### Production Build
```bash
# Set environment
export NODE_ENV=production

# Clean and install
npm run clean
npm ci --production

# Run full test suite
npm run test:all

# Build for production
npm run build:prod

# Verify build
npm run verify:build
```

### Build Configuration

#### webpack.config.prod.js
```javascript
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    background: './src/background/background.js',
    content: './src/content/content.js',
    popup: './src/popup/popup.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }
    })]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        { from: 'manifest.json' },
        { from: 'src/assets', to: 'assets' },
        { from: 'src/popup/popup.html', to: 'popup.html' },
        { from: 'src/content/content.css', to: 'content.css' }
      ]
    })
  ]
};
```

### Build Artifacts

#### Package Structure
```
dist/
├── manifest.json           # Extension manifest
├── background.js          # Background service worker
├── content.js            # Content script
├── content.css          # Content styles
├── popup.html          # Popup interface
├── popup.js           # Popup logic
├── assets/           # Static assets
│   └── icons/       # Extension icons
│       ├── icon16.png
│       ├── icon48.png
│       └── icon128.png
└── _metadata/      # Chrome Web Store metadata
    └── verified_contents.json
```

## Chrome Web Store Deployment

### Initial Setup

1. **Create Developer Account**
   - Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/developer/dashboard)
   - Pay one-time $5 registration fee
   - Verify account via phone

2. **Prepare Store Assets**
   ```
   store-assets/
   ├── screenshots/
   │   ├── screenshot1-1280x800.png
   │   ├── screenshot2-1280x800.png
   │   └── screenshot3-640x400.png
   ├── promotional/
   │   ├── small-tile-440x280.png
   │   ├── large-tile-920x680.png
   │   └── marquee-1400x560.png
   └── icons/
       └── store-icon-128x128.png
   ```

### Store Listing

#### Basic Information
```yaml
Name: PromptEnhancer
Short Description: (132 chars max)
  "Enhance your text with AI - Select, click, and watch your writing transform instantly with intelligent improvements."

Category: Productivity
Language: English

Detailed Description: |
  PromptEnhancer transforms your writing with the power of AI, directly in your browser.
  
  ✨ KEY FEATURES:
  • One-click text enhancement
  • Works on any website
  • Preserves formatting
  • Instant results
  • Customizable AI models
  
  🚀 HOW IT WORKS:
  1. Select any text on a webpage
  2. Click the enhance button
  3. Get improved text instantly
  
  🔒 PRIVACY FIRST:
  • No data collection
  • Local processing option
  • Secure API connections
  • Open source code
```

### Submission Process

1. **Package Extension**
   ```bash
   # Create zip file for upload
   cd dist
   zip -r ../prompt-enhancer-v1.0.0.zip . -x "*.DS_Store" -x "__MACOSX/*"
   cd ..
   
   # Verify zip contents
   unzip -l prompt-enhancer-v1.0.0.zip
   ```

2. **Upload to Store**
   ```bash
   # Using Chrome Web Store API
   npm run deploy:store
   
   # Or manual upload via dashboard
   # https://chrome.google.com/webstore/developer/dashboard
   ```

3. **Review Process**
   - Initial review: 1-3 business days
   - Updates: Usually within 24 hours
   - Common rejection reasons:
     - Missing privacy policy
     - Excessive permissions
     - Misleading description
     - Policy violations

## Version Management

### Semantic Versioning

```
MAJOR.MINOR.PATCH

1.0.0 - Initial release
1.1.0 - New feature added
1.1.1 - Bug fix
2.0.0 - Breaking changes
```

### Version Update Script

```javascript
// scripts/version.js
const fs = require('fs');
const path = require('path');

function updateVersion(type = 'patch') {
  // Update manifest.json
  const manifestPath = path.join(__dirname, '../manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  const [major, minor, patch] = manifest.version.split('.').map(Number);
  
  switch(type) {
    case 'major':
      manifest.version = `${major + 1}.0.0`;
      break;
    case 'minor':
      manifest.version = `${major}.${minor + 1}.0`;
      break;
    case 'patch':
      manifest.version = `${major}.${minor}.${patch + 1}`;
      break;
  }
  
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  
  // Update package.json
  const packagePath = path.join(__dirname, '../package.json');
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  packageJson.version = manifest.version;
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
  
  console.log(`Version updated to ${manifest.version}`);
  return manifest.version;
}
```

### Changelog Generation

```bash
# Generate changelog from commits
npm run changelog

# Manual changelog update
echo "## [1.1.0] - 2024-01-15

### Added
- New enhancement algorithms
- Dark mode support
- Keyboard shortcuts

### Fixed
- Memory leak in content script
- API timeout issues

### Changed
- Improved UI responsiveness
- Updated dependencies" >> CHANGELOG.md
```

## Release Process

### Automated Release Pipeline

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    tags:
      - 'v*'

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build extension
        run: npm run build:prod
        
      - name: Package extension
        run: |
          cd dist
          zip -r ../extension.zip .
          cd ..
          
      - name: Create GitHub Release
        uses: softprops/action-gh-release@v1
        with:
          files: extension.zip
          generate_release_notes: true
          
      - name: Publish to Chrome Web Store
        uses: trmcnvn/chrome-addon-upload@v1
        with:
          extension-id: ${{ secrets.EXTENSION_ID }}
          client-id: ${{ secrets.CLIENT_ID }}
          client-secret: ${{ secrets.CLIENT_SECRET }}
          refresh-token: ${{ secrets.REFRESH_TOKEN }}
          file-path: extension.zip
```

### Manual Release Steps

1. **Pre-Release**
   ```bash
   # Update version
   npm run version:minor
   
   # Update changelog
   npm run changelog
   
   # Commit changes
   git add .
   git commit -m "chore: release v1.1.0"
   
   # Create tag
   git tag -a v1.1.0 -m "Release version 1.1.0"
   ```

2. **Build & Test**
   ```bash
   # Full test suite
   npm run test:all
   
   # Security audit
   npm audit
   
   # Build production
   npm run build:prod
   
   # Test built extension
   npm run test:built
   ```

3. **Deploy**
   ```bash
   # Push to repository
   git push origin main --tags
   
   # Deploy to store
   npm run deploy:store
   
   # Verify deployment
   npm run verify:deployment
   ```

## Rollback Procedures

### Emergency Rollback

1. **Immediate Actions**
   ```bash
   # Revert to previous version in Chrome Web Store
   # Dashboard > Version > Rollback to previous
   
   # Or unpublish if critical
   # Dashboard > Visibility > Unpublish
   ```

2. **Fix and Redeploy**
   ```bash
   # Checkout previous stable version
   git checkout v1.0.0
   
   # Create hotfix branch
   git checkout -b hotfix/critical-bug
   
   # Apply fix
   # ... make changes ...
   
   # Test thoroughly
   npm run test:all
   
   # Build and deploy
   npm run build:prod
   npm run deploy:store
   ```

### Rollback Checklist
- [ ] Identify issue severity
- [ ] Notify users if needed
- [ ] Rollback in Chrome Web Store
- [ ] Create incident report
- [ ] Fix issue
- [ ] Test fix thoroughly
- [ ] Deploy patch version
- [ ] Post-mortem analysis

## Monitoring

### Analytics Setup

```javascript
// src/analytics/analytics.js
class Analytics {
  constructor() {
    this.GA_TRACKING_ID = 'UA-XXXXXXXX-X';
  }

  track(event, params) {
    if (process.env.NODE_ENV === 'production') {
      // Google Analytics
      gtag('event', event, params);
      
      // Custom telemetry
      this.sendTelemetry({
        event,
        params,
        timestamp: Date.now(),
        version: chrome.runtime.getManifest().version
      });
    }
  }

  sendTelemetry(data) {
    fetch('https://telemetry.yourapp.com/collect', {
      method: 'POST',
      body: JSON.stringify(data)
    }).catch(() => {
      // Fail silently
    });
  }
}
```

### Key Metrics

```javascript
// Track important events
analytics.track('enhancement_completed', {
  text_length: text.length,
  processing_time: endTime - startTime,
  success: true
});

analytics.track('error_occurred', {
  error_type: error.name,
  error_message: error.message,
  context: 'enhancement'
});
```

### Error Monitoring

```javascript
// Sentry integration
import * as Sentry from '@sentry/browser';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: process.env.NODE_ENV,
  release: chrome.runtime.getManifest().version,
  beforeSend(event) {
    // Filter sensitive data
    if (event.request) {
      delete event.request.cookies;
    }
    return event;
  }
});

// Catch and report errors
window.addEventListener('error', (event) => {
  Sentry.captureException(event.error);
});
```

### Health Checks

```javascript
// Regular health checks
setInterval(async () => {
  try {
    const health = await checkSystemHealth();
    
    if (!health.ok) {
      analytics.track('health_check_failed', health);
      notifyDevelopers(health);
    }
  } catch (error) {
    console.error('Health check error:', error);
  }
}, 60000); // Every minute

async function checkSystemHealth() {
  return {
    ok: true,
    api_responsive: await checkAPI(),
    storage_available: await checkStorage(),
    memory_usage: performance.memory.usedJSHeapSize,
    version: chrome.runtime.getManifest().version
  };
}
```

## Post-Deployment

### User Communication

1. **Release Notes**
   - Post on website/blog
   - Update in-extension changelog
   - Email subscribers (if applicable)

2. **Social Media**
   - Tweet major updates
   - LinkedIn post for professional features
   - Reddit (relevant subreddits)

3. **Support Preparation**
   - Update FAQ
   - Prepare support templates
   - Brief support team

### Success Metrics

Monitor after deployment:
- Installation rate
- Uninstall rate
- User reviews/ratings
- Error rates
- Performance metrics
- Feature adoption

### Continuous Improvement

```bash
# Weekly metrics review
npm run metrics:weekly

# User feedback analysis
npm run feedback:analyze

# Performance regression check
npm run perf:check

# Security audit
npm audit

# Dependency updates
npm outdated
npm update
```

## Troubleshooting Deployment

### Common Issues

#### Build Failures
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm cache clean --force
npm install
npm run build:prod
```

#### Store Rejection
- Check [Chrome Web Store policies](https://developer.chrome.com/docs/webstore/program_policies/)
- Review rejection email carefully
- Common fixes:
  - Add privacy policy
  - Justify permissions
  - Remove unused permissions
  - Fix description accuracy

#### Version Conflicts
```bash
# Force version sync
npm run version:sync

# Verify versions match
grep version manifest.json package.json
```

#### Upload Errors
```bash
# Verify zip structure
unzip -l extension.zip

# Check file size (<10MB)
du -h extension.zip

# Validate manifest
npx chrome-manifest-validator manifest.json
```
