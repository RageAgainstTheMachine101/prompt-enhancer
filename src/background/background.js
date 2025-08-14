// PromptEnhancer Background Service Worker

// Initialize extension
chrome.runtime.onInstalled.addListener((details) => {
  console.log('PromptEnhancer installed/updated', details);

  if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    // Set default settings
    chrome.storage.sync.set({
      webhookUrl: 'http://localhost:5678/webhook-test/n8n/prompt/enhance',
      enabled: true,
      showNotifications: true
    });
  }
});

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  console.log('Extension icon clicked for tab:', tab.id);
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Message received in background:', request);

  switch (request.action) {
    case 'enhance-prompt':
      handlePromptEnhancement(request, sender, sendResponse);
      return true; // Will respond asynchronously

    case 'get-settings':
      chrome.storage.sync.get(['webhookUrl', 'enabled', 'showNotifications'], (result) => {
        sendResponse(result);
      });
      return true;

    case 'save-settings':
      chrome.storage.sync.set(request.settings, () => {
        sendResponse({ success: true });
      });
      return true;

    default:
      sendResponse({ error: 'Unknown action' });
  }
});

// Handle prompt enhancement via webhook
async function handlePromptEnhancement(request, sender, sendResponse) {
  try {
    // Get webhook URL from settings
    const settings = await chrome.storage.sync.get(['webhookUrl', 'enabled']);

    if (!settings.enabled) {
      sendResponse({ error: 'Extension is disabled' });
      return;
    }

    const webhookUrl = settings.webhookUrl || 'http://localhost:5678/webhook-test/n8n/prompt/enhance';

    // Make request to n8n webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: request.text,
        timestamp: new Date().toISOString(),
        url: sender.tab?.url,
        tabId: sender.tab?.id
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    sendResponse({ success: true, result });

  } catch (error) {
    console.error('Enhancement error:', error);
    sendResponse({ error: error.message });
  }
}

// Monitor tab updates to refresh content scripts if needed
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url && !tab.url.startsWith('chrome://')) {
    console.log('Tab updated:', tabId, tab.url);
  }
});

// Handle extension startup
chrome.runtime.onStartup.addListener(() => {
  console.log('PromptEnhancer extension started');
});

// Utility function to show notifications
function showNotification(title, message, type = 'basic') {
  chrome.storage.sync.get(['showNotifications'], (result) => {
    if (result.showNotifications !== false) {
      chrome.notifications.create({
        type: type,
        iconUrl: '../icons/icon48.png',
        title: title,
        message: message
      });
    }
  });
}
