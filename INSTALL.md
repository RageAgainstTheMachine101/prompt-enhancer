# Quick Installation Guide

## 🚀 Get Started in 5 Minutes

### Step 1: Download the Extension
- Clone or download this repository to your computer
- Ensure all files are present in the project folder

### Step 2: Load in Chrome
1. Open Google Chrome
2. Go to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top-right corner)
4. Click "Load unpacked" button
5. Select the PromptEnhancer folder
6. Extension should now appear in your extensions list

### Step 3: Configure Your n8n Webhook
1. Click the PromptEnhancer icon in Chrome toolbar
2. Set your webhook URL (default: `http://localhost:5678/webhook-test/n8n/prompt/enhance`)
   > You can change this to your own n8n webhook endpoint in the extension settings
3. Click "Test Connection" to verify it works
4. Click "Save Settings"

### Step 4: Create n8n Workflow
Your n8n workflow needs:
- **Webhook Trigger**: Listen for POST requests
- **AI Processing**: Use OpenAI, Claude, or any AI service
- **Response**: Return JSON with enhanced text

Example n8n workflow:
```
Webhook → OpenAI Node → Response Node
```

Response format:
```json
{
  "enhancedText": "Your improved text here"
}
```

### Step 5: Test It Out!
1. Go to any website (try a Google Doc or Gmail)
2. Select some text you want to enhance
3. Click the "Enhance" button that appears
4. Watch your text get improved by AI!

## 🔧 Troubleshooting

**Button not appearing?**
- Make sure you selected at least 3 characters of text
- Check that extension is enabled in chrome://extensions/

**Connection failing?**
- Verify n8n is running on localhost:5678
- Check your webhook URL in extension settings
- Try with a simple n8n workflow first

**Text not replacing?**
- Check your n8n workflow returns the right JSON format
- Try on different websites (some have stricter security)

## 🎯 Ready to Go!

You're all set! Start enhancing your text with AI across any website. The extension works on:
- Gmail and email clients
- Google Docs and Office apps
- Social media platforms
- Content management systems
- Any text input fields

---

Need help? Check the full README.md for detailed documentation and troubleshooting.