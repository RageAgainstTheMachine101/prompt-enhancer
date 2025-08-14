#!/usr/bin/env node

/**
 * Build script for PromptEnhancer Chrome Extension
 * Copies source files to dist/ directory for production use
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..', 'src');
const DIST_DIR = path.join(__dirname, '..', 'dist');
const ROOT_DIR = path.join(__dirname, '..');

// Files to copy from root
const ROOT_FILES = ['manifest.json'];

// Directories to copy from src
const SRC_DIRS = ['background', 'content', 'popup', 'options', 'modules', 'assets'];

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m'
};

/**
 * Recursively copy directory
 */
function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      // Skip .gitkeep files
      if (entry.name === '.gitkeep') continue;

      fs.copyFileSync(srcPath, destPath);
      console.log(`  ${colors.green}✓${colors.reset} Copied: ${path.relative(ROOT_DIR, srcPath)}`);
    }
  }
}

/**
 * Build the extension
 */
function build() {
  console.log(`${colors.blue}Building PromptEnhancer Extension...${colors.reset}\n`);

  // Clean dist directory
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
    console.log(`${colors.yellow}Cleaned dist/ directory${colors.reset}\n`);
  }

  // Create dist directory
  fs.mkdirSync(DIST_DIR, { recursive: true });

  // Copy root files
  console.log(`${colors.blue}Copying root files...${colors.reset}`);
  ROOT_FILES.forEach(file => {
    const srcPath = path.join(ROOT_DIR, file);
    const destPath = path.join(DIST_DIR, file);

    if (fs.existsSync(srcPath)) {
      fs.copyFileSync(srcPath, destPath);
      console.log(`  ${colors.green}✓${colors.reset} Copied: ${file}`);
    }
  });

  // Copy src directories
  console.log(`\n${colors.blue}Copying source directories...${colors.reset}`);
  SRC_DIRS.forEach(dir => {
    const srcPath = path.join(SRC_DIR, dir);
    const destPath = path.join(DIST_DIR, 'src', dir);

    if (fs.existsSync(srcPath)) {
      copyDirectory(srcPath, destPath);
    }
  });

  console.log(`\n${colors.green}✅ Build complete!${colors.reset}`);
  console.log(`${colors.blue}Extension ready in:${colors.reset} ${path.relative(ROOT_DIR, DIST_DIR)}/`);
  console.log(`\n${colors.yellow}To install:${colors.reset}`);
  console.log('1. Open Chrome and navigate to chrome://extensions/');
  console.log('2. Enable "Developer mode"');
  console.log('3. Click "Load unpacked"');
  console.log(`4. Select the ${colors.green}dist/${colors.reset} folder\n`);
}

/**
 * Watch mode (if --watch flag is provided)
 */
function watch() {
  console.log(`${colors.yellow}Watch mode: Rebuilding on file changes...${colors.reset}\n`);

  const watchDirs = [
    SRC_DIR,
    ...ROOT_FILES.map(f => path.join(ROOT_DIR, f))
  ];

  watchDirs.forEach(dir => {
    if (fs.existsSync(dir)) {
      fs.watch(dir, { recursive: true }, (eventType, filename) => {
        if (filename && !filename.includes('.git')) {
          console.log(`\n${colors.yellow}File changed:${colors.reset} ${filename}`);
          build();
        }
      });
    }
  });

  // Initial build
  build();
}

// Run build
if (process.argv.includes('--watch')) {
  watch();
} else {
  build();
}
