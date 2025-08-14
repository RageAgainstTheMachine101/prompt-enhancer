# PromptEnhancer User Guide

## Welcome!

Thank you for installing PromptEnhancer! This guide will help you get the most out of your AI-powered text enhancement extension.

## Table of Contents
- [Getting Started](#getting-started)
- [Basic Usage](#basic-usage)
- [Features](#features)
- [Configuration](#configuration)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Tips & Tricks](#tips-tricks)
- [FAQ](#faq)
- [Troubleshooting](#troubleshooting)

## Getting Started

### Installation

1. **From Chrome Web Store** (Recommended)
   - Visit the [PromptEnhancer page](https://chrome.google.com/webstore/detail/promptenhancer)
   - Click "Add to Chrome"
   - Click "Add Extension" in the popup

2. **Manual Installation** (For developers)
   - Download the latest release
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked" and select the extension folder

### First-Time Setup

1. **Click the PromptEnhancer icon** in your browser toolbar
   
2. **Configure your webhook URL**:
   - Enter your n8n webhook URL
   - Click "Test Connection"
   - Save your settings

3. **Grant necessary permissions** when prompted

## Basic Usage

### Enhancing Text

1. **Select Text**: Highlight any text on a webpage
   
2. **Click Enhance**: A small button appears near your selection
   ![Enhance Button](./images/enhance-button.png)
   
3. **Wait for Magic**: The text is processed and replaced automatically
   
4. **Review Result**: Enhanced text appears with a subtle highlight

### Visual Walkthrough

```
Step 1: Select text
┌─────────────────────────┐
│ This is some text that  │
│ [needs enhancement].    │◄── Select this
└─────────────────────────┘

Step 2: Enhancement button appears
┌─────────────────────────┐
│ This is some text that  │
│ needs enhancement.      │
└─────────────────────────┘
        [✨ Enhance]◄── Click here

Step 3: Text is enhanced
┌─────────────────────────┐
│ This is some text that  │
│ requires improvement.   │◄── Enhanced!
└─────────────────────────┘
```

## Features

### Core Features

#### 🎯 Smart Text Selection
- Works on any website
- Preserves formatting
- Handles multiple paragraphs
- Respects original structure

#### ⚡ Instant Enhancement
- One-click operation
- Real-time processing
- Visual feedback
- Success notifications

#### 🎨 Enhancement Styles

| Style | Description | Best For |
|-------|-------------|----------|
| **Professional** | Formal, business-appropriate | Emails, reports |
| **Casual** | Friendly, conversational | Social media, blogs |
| **Creative** | Imaginative, engaging | Stories, descriptions |
| **Concise** | Brief, to-the-point | Summaries, tweets |
| **Detailed** | Comprehensive, thorough | Documentation, guides |

### Advanced Features

#### 🔄 Undo/Redo
- **Undo**: Ctrl/Cmd + Z after enhancement
- **Redo**: Ctrl/Cmd + Shift + Z
- History preserved for session

#### 📊 Usage Statistics
View your enhancement statistics:
- Total enhancements
- Daily/weekly/monthly usage
- Average processing time
- Most enhanced websites

#### 🌙 Dark Mode
Automatically adapts to your system theme or manually toggle in settings.

## Configuration

### Accessing Settings

1. Click the PromptEnhancer icon
2. Click the gear (⚙️) icon
3. Adjust your preferences

### Settings Options

#### General Settings

```
✓ Enable extension
✓ Auto-replace text
✓ Show notifications
✓ Play sound on completion
```

#### Enhancement Preferences

```
Default Style: [Professional ▼]
Max Length: [Same as original ▼]
Language: [Auto-detect ▼]
Tone: [Neutral ▼]
```

#### API Configuration

```
Webhook URL: [https://your-n8n-instance.com/webhook/...]
API Key: [••••••••••••]
Timeout: [30 seconds ▼]
Max Retries: [3 ▼]
```

#### Privacy Settings

```
✓ Don't track usage
□ Send anonymous analytics
✓ Clear history on close
□ Save enhancement history
```

### Customization

#### Custom Styles

Create your own enhancement style:

1. Go to Settings → Custom Styles
2. Click "Add New Style"
3. Configure parameters:
   ```
   Name: "My Style"
   Prompt: "Make text more..."
   Temperature: 0.7
   Max Tokens: 500
   ```
4. Save and use

#### Blacklist/Whitelist Sites

Control where the extension works:

**Blacklist Mode** (works everywhere except):
```
facebook.com
twitter.com
banking-site.com
```

**Whitelist Mode** (only works on):
```
docs.google.com
notion.so
medium.com
```

## Keyboard Shortcuts

### Default Shortcuts

| Action | Windows/Linux | Mac |
|--------|--------------|-----|
| Enhance selected | `Alt+E` | `Option+E` |
| Toggle extension | `Alt+Shift+E` | `Option+Shift+E` |
| Open popup | `Ctrl+Shift+E` | `Cmd+Shift+E` |
| Undo enhancement | `Ctrl+Z` | `Cmd+Z` |
| Redo enhancement | `Ctrl+Shift+Z` | `Cmd+Shift+Z` |
| Cancel enhancement | `Esc` | `Esc` |

### Customizing Shortcuts

1. Go to `chrome://extensions/shortcuts`
2. Find PromptEnhancer
3. Click the pencil icon
4. Press your desired key combination
5. Click OK

## Tips & Tricks

### Best Practices

#### ✅ DO:
- Select complete sentences for best results
- Review enhanced text before submitting forms
- Use appropriate styles for context
- Keep selections under 500 words for speed

#### ❌ DON'T:
- Enhance passwords or sensitive data
- Use on banking or secure sites
- Enhance already-enhanced text
- Select incomplete sentences

### Pro Tips

1. **Batch Enhancement**
   - Select multiple paragraphs
   - Enhancement applies to entire selection
   
2. **Quick Style Switch**
   - Right-click enhanced text
   - Select "Re-enhance with..." → Choose style
   
3. **Smart Selection**
   - Double-click: Select word
   - Triple-click: Select paragraph
   - Ctrl+A: Select all (then refine)
   
4. **Preview Mode**
   - Hold Shift while clicking Enhance
   - Shows preview without replacing
   
5. **History Navigation**
   - Access enhancement history in popup
   - Re-apply previous enhancements

## FAQ

### General Questions

**Q: Is my text data stored anywhere?**
A: No, text is processed in real-time and not stored unless you enable history in settings.

**Q: Can I use this offline?**
A: No, the extension requires an internet connection to communicate with the AI service.

**Q: Does it work on all websites?**
A: It works on most websites, but some with strict security policies may block it.

**Q: Is there a limit to enhancements?**
A: Depends on your n8n webhook configuration. The extension itself has no limits.

### Technical Questions

**Q: What AI model is used?**
A: This depends on your n8n workflow configuration. You can use GPT, Claude, or other models.

**Q: Can I use my own API?**
A: Yes, configure your webhook URL in settings to point to your API endpoint.

**Q: How fast is the enhancement?**
A: Typically 1-3 seconds, depending on text length and API response time.

**Q: What's the maximum text length?**
A: Default is 5000 characters, configurable in your n8n workflow.

### Troubleshooting Questions

**Q: The enhance button doesn't appear**
A: 
- Check if extension is enabled
- Verify site isn't blacklisted
- Try refreshing the page
- Check for JavaScript errors

**Q: Enhancement fails with error**
A:
- Verify webhook URL is correct
- Check internet connection
- Test webhook independently
- Review error message details

**Q: Text formatting is lost**
A:
- This is expected for complex formatting
- Use on plain text for best results
- Report specific issues on GitHub

## Troubleshooting

### Common Issues

#### Enhancement Button Not Appearing

**Symptoms**: No button shows after text selection

**Solutions**:
1. Refresh the page (F5)
2. Check extension is enabled
3. Verify site permissions
4. Clear browser cache
5. Reinstall extension

#### Enhancement Fails

**Error: "Network Error"**
```
Solutions:
✓ Check internet connection
✓ Verify webhook URL
✓ Test webhook with curl/Postman
✓ Check firewall settings
```

**Error: "Timeout"**
```
Solutions:
✓ Increase timeout in settings
✓ Try shorter text selection
✓ Check API server status
✓ Retry enhancement
```

**Error: "Invalid Response"**
```
Solutions:
✓ Check webhook configuration
✓ Verify API response format
✓ Review n8n workflow logs
✓ Contact support
```

#### Performance Issues

**Slow Enhancement**:
- Reduce text selection size
- Check network speed
- Optimize n8n workflow
- Use faster AI model

**High Memory Usage**:
- Clear enhancement history
- Disable unused features
- Restart browser
- Report issue if persistent

### Getting Help

#### Self-Help Resources
- 📚 Read this guide thoroughly
- 🔍 Search [GitHub Issues](https://github.com/your-username/prompt-enhancer/issues)
- 💬 Join our [Discord Community](https://discord.gg/promptenhancer)
- 📺 Watch [video tutorials](https://youtube.com/promptenhancer)

#### Contact Support

**For Bugs**:
1. Reproduce the issue
2. Collect error details
3. Create GitHub issue with:
   - Browser version
   - Extension version
   - Steps to reproduce
   - Error messages
   - Screenshots

**For Features**:
- Submit feature request on GitHub
- Vote on existing requests
- Join community discussions

**For Security Issues**:
- Email: security@promptenhancer.com
- Don't post publicly
- Include detailed description

### Debug Mode

Enable debug mode for detailed logging:

1. Open extension popup
2. Click 5 times on version number
3. Debug console appears
4. Copy logs for support

```javascript
// In console:
PromptEnhancer.debug = true;
PromptEnhancer.logs.export();
```

## Privacy & Security

### Data Handling

**What we collect**:
- ❌ Never: Passwords, credit cards, personal info
- ✅ Optional: Anonymous usage statistics
- ✅ Temporary: Selected text (for processing only)

**Data transmission**:
- All data encrypted (HTTPS)
- Direct to your configured webhook
- No third-party services
- No data retention

### Security Tips

1. **Use trusted webhooks only**
2. **Don't enhance sensitive information**
3. **Review enhanced text before using**
4. **Keep extension updated**
5. **Report suspicious behavior**

## Updates

### Automatic Updates

Chrome automatically updates extensions. To check manually:
1. Go to `chrome://extensions/`
2. Enable Developer mode
3. Click "Update"

### Update Notifications

Stay informed about updates:
- 📧 Subscribe to newsletter
- 🐦 Follow @PromptEnhancer
- ⭐ Star GitHub repository
- 📢 Join Discord server

### Changelog

View recent changes:
- In extension: Click version number
- Online: [CHANGELOG.md](https://github.com/your-username/prompt-enhancer/blob/main/CHANGELOG.md)

---

## Quick Reference Card

### Essential Shortcuts
- **Enhance**: Select text → Click button
- **Settings**: Click extension icon → Gear icon
- **Undo**: Ctrl/Cmd + Z
- **Toggle**: Alt/Option + Shift + E

### Status Indicators
- 🟢 Green: Ready
- 🟡 Yellow: Processing
- 🔴 Red: Error
- 🔵 Blue: Success

### Need Help?
- Documentation: [docs.promptenhancer.com](https://docs.promptenhancer.com)
- Support: [support@promptenhancer.com](mailto:support@promptenhancer.com)
- Community: [discord.gg/promptenhancer](https://discord.gg/promptenhancer)

---

**Thank you for using PromptEnhancer!** 🚀

*Version 1.0.0 | Last updated: January 2024*
