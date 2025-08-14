# PromptEnhancer Browser Extension 🚀

A powerful Chrome extension that enhances your text prompts using AI through n8n workflows. Simply select text on any webpage, click "Enhance", and watch as your content is improved by AI.

## ✨ Features

### Currently Implemented ✅
- **Text Selection Enhancement**: Select any text on a webpage and enhance it with AI
- **Smart Button Positioning**: Enhancement button appears intelligently positioned near selected text
- **n8n Webhook Integration**: Seamless integration with n8n workflows
- **Real-time Status Monitoring**: Connection status and health checks
- **Customizable Settings**: Configure webhook URL and extension preferences
- **Error Handling**: Comprehensive error handling with user-friendly notifications
- **Loading States**: Visual feedback during enhancement process
- **Toast Notifications**: Success/error notifications with auto-dismiss
- **Responsive UI**: Works across all screen sizes and devices
- **Keyboard Shortcuts**: ESC key to hide enhancement button

### Core Functionality
- **Text Replacement**: Enhanced text automatically replaces selected content
- **Visual Feedback**: Highlighted text shows successful replacements
- **Connection Testing**: Built-in webhook connection testing
- **Settings Persistence**: Extension settings saved to Chrome storage
- **Cross-site Compatibility**: Works on all websites (respects CSP policies)

## 🎯 User Flow

1. **Text Selection** → User highlights text on any webpage
2. **Enhancement Button** → "Enhance" button appears with extension icon
3. **AI Processing** → Click triggers n8n webhook with selected text
4. **Text Replacement** → Enhanced text replaces original selection
5. **Visual Confirmation** → Success notification and highlighted result

## 🔧 Installation

### Prerequisites
- Google Chrome browser (version 88+)
- n8n instance running with webhook endpoint
- Basic understanding of Chrome extensions

### Steps
1. **Download/Clone** this repository
2. **Generate Icons** (optional):
   - Open `icons/generate-icons.html` in browser
   - Download the generated PNG files
   - Place in `/icons/` directory as `icon16.png`, `icon48.png`, `icon128.png`
3. **Load Extension**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (top right)
   - Click "Load unpacked"
   - Select the extension directory
4. **Configure Settings**:
   - Click the PromptEnhancer icon in Chrome toolbar
   - Set your n8n webhook URL
   - Test connection
   - Save settings

## ⚙️ Configuration

### n8n Webhook Setup
Your n8n workflow should:
- Accept POST requests at your webhook URL
- Expect JSON payload with `text` field
- Return JSON response with enhanced text

**Expected Request Format:**
```json
{
  "text": "Original text to enhance",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "url": "https://example.com",
  "test": false
}
```

**Expected Response Format:**
```json
{
  "enhancedText": "Your enhanced text here"
}
```

Alternative response formats supported:
- `{ "enhanced_text": "..." }`
- `{ "text": "..." }`
- `{ "result": "..." }`
- Plain string response

### Default Webhook URL
```
http://localhost:5678/webhook-test/n8n/prompt/enhance
```

> **Note**: This URL can be changed in the extension settings to point to your own n8n webhook endpoint.

## 📁 Project Structure

```
prompt-enhancer/
├── manifest.json              # Extension manifest (v3)
├── background/
│   └── background.js         # Service worker
├── content/
│   ├── content.js           # Content script (main logic)
│   └── content.css          # Styles for enhancement UI
├── popup/
│   ├── popup.html           # Extension popup interface
│   ├── popup.css            # Popup styles
│   └── popup.js             # Popup functionality
├── icons/
│   ├── icon.svg             # Source SVG icon
│   ├── generate-icons.html  # Icon generator tool
│   ├── create-icons.js      # Icon creation script
│   ├── icon16.png           # 16x16 icon
│   ├── icon48.png           # 48x48 icon
│   └── icon128.png          # 128x128 icon
└── README.md                # This file
```

## 🔌 API Integration

### Webhook Endpoint Requirements
- **Method**: POST
- **Content-Type**: application/json
- **CORS**: Configure for extension origins if needed
- **Response Time**: < 30 seconds (recommended < 10s)

### Error Handling
The extension handles various error scenarios:
- Network connection failures
- Invalid webhook responses
- Timeout errors (5-second timeout for health checks)
- CORS issues
- Invalid JSON responses

## 🎨 UI Components

### Enhancement Button
- Gradient background (#667eea to #764ba2)
- Star icon with "Enhance" text
- Smooth animations and hover effects
- Loading spinner during processing
- Auto-positioning to avoid viewport edges

### Popup Interface
- Status indicator with real-time connection monitoring
- Toggle switches for settings
- Webhook URL configuration
- Connection testing functionality
- Usage instructions
- Error/success messaging

## 🔒 Permissions

### Required Permissions
- `activeTab`: Access current tab content
- `storage`: Save extension settings

### Host Permissions
- `http://localhost:5678/*`: Default n8n webhook access
- `https://*/*`: HTTPS website access

## 🛠️ Development

### Local Development
1. Make changes to source files
2. Go to `chrome://extensions/`
3. Click "Reload" on PromptEnhancer extension
4. Test changes on various websites

### Debugging
- **Content Script**: Use browser DevTools console
- **Background Script**: Go to extension details → "Inspect views: service worker"
- **Popup**: Right-click extension icon → "Inspect popup"

### Testing Checklist
- [ ] Text selection on different websites
- [ ] Enhancement button positioning
- [ ] Webhook communication
- [ ] Error handling scenarios
- [ ] Settings persistence
- [ ] Cross-browser compatibility (Chrome focus)

## 🚀 Features Not Yet Implemented

### Planned Enhancements
- **Multiple AI Providers**: Support for OpenAI, Anthropic, etc.
- **Context Awareness**: Use page context for better enhancements
- **Enhancement History**: Track and revert previous enhancements
- **Batch Processing**: Enhance multiple selections simultaneously
- **Custom Templates**: Predefined enhancement templates
- **Keyboard Shortcuts**: Global hotkeys for quick enhancement
- **Analytics Dashboard**: Usage statistics and insights
- **Cloud Sync**: Settings sync across devices
- **Rate Limiting**: Prevent API abuse with smart queuing

### Technical Improvements
- **Offline Mode**: Cache common enhancements
- **Performance Optimization**: Lazy loading and code splitting
- **Security Enhancements**: Request signing and validation
- **Accessibility**: Screen reader support and ARIA labels
- **Internationalization**: Multi-language support
- **Testing Suite**: Automated unit and integration tests

## 🔧 Recommended Next Steps

1. **Setup n8n Workflow**: Create your AI enhancement workflow
2. **Test Connection**: Use the built-in connection tester
3. **Customize Prompts**: Optimize your n8n workflow for specific use cases
4. **Monitor Performance**: Check extension performance on heavy pages
5. **Gather Feedback**: Test with real users and iterate
6. **Scale Infrastructure**: Prepare n8n for production usage

## 🐛 Troubleshooting

### Common Issues

**Extension not loading:**
- Check Chrome version compatibility
- Ensure all files are present
- Check for console errors

**Enhancement button not appearing:**
- Verify text selection (minimum 3 characters)
- Check if extension is enabled
- Look for CSP restrictions

**Webhook connection fails:**
- Verify n8n is running
- Check webhook URL format
- Test with CORS disabled for development
- Confirm network connectivity

**Text replacement not working:**
- Check webhook response format
- Verify page allows content modification
- Try on different websites

### Debug Information
When reporting issues, include:
- Chrome version
- Extension version
- Webhook URL (without sensitive data)
- Console error messages
- Steps to reproduce

## 📄 License

This project is open source. Feel free to modify and distribute according to your needs.

## 🤝 Contributing

Contributions welcome! Please:
1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request with description

## 📞 Support

For support and feature requests:
- Check existing issues first
- Create detailed bug reports
- Include debug information
- Test on multiple sites before reporting

---

**PromptEnhancer v1.0.0** - Enhance your text with AI, one selection at a time! ✨