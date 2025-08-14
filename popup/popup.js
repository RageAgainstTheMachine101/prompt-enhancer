// PromptEnhancer Popup JavaScript
class PopupManager {
  constructor() {
    this.settings = {
      enabled: true,
      showNotifications: true,
      webhookUrl: 'http://localhost:5678/webhook-test/n8n/prompt/enhance'
    };
    
    this.init();
  }

  async init() {
    console.log('Popup initialized');
    await this.loadSettings();
    this.setupEventListeners();
    this.updateUI();
    this.checkConnectionStatus();
  }

  setupEventListeners() {
    // Save settings button
    document.getElementById('saveSettings').addEventListener('click', () => {
      this.saveSettings();
    });

    // Test connection button
    document.getElementById('testConnection').addEventListener('click', () => {
      this.testConnection();
    });

    // Toggle switches
    document.getElementById('enabledToggle').addEventListener('change', (e) => {
      this.settings.enabled = e.target.checked;
      this.updateStatusIndicator();
    });

    document.getElementById('notificationsToggle').addEventListener('change', (e) => {
      this.settings.showNotifications = e.target.checked;
    });

    // Webhook URL input
    document.getElementById('webhookUrl').addEventListener('input', (e) => {
      this.settings.webhookUrl = e.target.value.trim();
      this.updateStatusIndicator();
    });

    // Footer links
    document.getElementById('viewLogs').addEventListener('click', (e) => {
      e.preventDefault();
      this.viewLogs();
    });

    document.getElementById('reportIssue').addEventListener('click', (e) => {
      e.preventDefault();
      this.reportIssue();
    });
  }

  async loadSettings() {
    try {
      const result = await chrome.storage.sync.get(['enabled', 'showNotifications', 'webhookUrl']);
      
      this.settings = {
        enabled: result.enabled !== undefined ? result.enabled : true,
        showNotifications: result.showNotifications !== undefined ? result.showNotifications : true,
        webhookUrl: result.webhookUrl || 'http://localhost:5678/webhook-test/n8n/prompt/enhance'
      };
      
      console.log('Settings loaded:', this.settings);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }

  updateUI() {
    // Update toggles
    document.getElementById('enabledToggle').checked = this.settings.enabled;
    document.getElementById('notificationsToggle').checked = this.settings.showNotifications;
    
    // Update webhook URL
    document.getElementById('webhookUrl').value = this.settings.webhookUrl;
    
    // Update status
    this.updateStatusIndicator();
  }

  updateStatusIndicator() {
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.getElementById('statusText');
    
    if (!this.settings.enabled) {
      statusDot.className = 'status-dot';
      statusText.textContent = 'Disabled';
    } else if (!this.settings.webhookUrl) {
      statusDot.className = 'status-dot';
      statusText.textContent = 'No webhook URL';
    } else {
      statusDot.className = 'status-dot checking';
      statusText.textContent = 'Ready';
    }
  }

  async saveSettings() {
    const saveBtn = document.getElementById('saveSettings');
    const originalText = saveBtn.innerHTML;
    
    try {
      // Show loading state
      saveBtn.innerHTML = `
        <svg class="btn-icon animate-spin" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z"/>
        </svg>
        Saving...
      `;
      saveBtn.disabled = true;

      // Save to storage
      await chrome.storage.sync.set({
        enabled: this.settings.enabled,
        showNotifications: this.settings.showNotifications,
        webhookUrl: this.settings.webhookUrl
      });

      // Show success
      saveBtn.innerHTML = `
        <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
        Saved!
      `;

      setTimeout(() => {
        saveBtn.innerHTML = originalText;
        saveBtn.disabled = false;
      }, 2000);

      this.showMessage('Settings saved successfully!', 'success');

    } catch (error) {
      console.error('Error saving settings:', error);
      saveBtn.innerHTML = originalText;
      saveBtn.disabled = false;
      this.showMessage('Error saving settings: ' + error.message, 'error');
    }
  }

  async testConnection() {
    const testBtn = document.getElementById('testConnection');
    const originalText = testBtn.innerHTML;
    const statusDot = document.querySelector('.status-dot');
    const statusText = document.getElementById('statusText');

    try {
      // Show loading state
      testBtn.innerHTML = `
        <svg class="btn-icon animate-spin" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 4V2A10 10 0 0 0 2 12h2a8 8 0 0 1 8-8z"/>
        </svg>
        Testing...
      `;
      testBtn.disabled = true;

      statusDot.className = 'status-dot checking';
      statusText.textContent = 'Testing connection...';

      // Test the webhook
      const response = await fetch(this.settings.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: 'Test connection from PromptEnhancer',
          timestamp: new Date().toISOString(),
          test: true
        })
      });

      if (response.ok) {
        statusDot.className = 'status-dot connected';
        statusText.textContent = 'Connected';
        this.showMessage('Connection successful! ✅', 'success');
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

    } catch (error) {
      console.error('Connection test failed:', error);
      statusDot.className = 'status-dot';
      statusText.textContent = 'Connection failed';
      this.showMessage('Connection failed: ' + error.message, 'error');
    } finally {
      testBtn.innerHTML = originalText;
      testBtn.disabled = false;
    }
  }

  async checkConnectionStatus() {
    if (!this.settings.enabled || !this.settings.webhookUrl) {
      return;
    }

    const statusDot = document.querySelector('.status-dot');
    const statusText = document.getElementById('statusText');

    try {
      statusDot.className = 'status-dot checking';
      statusText.textContent = 'Checking...';

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(this.settings.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: 'Health check',
          timestamp: new Date().toISOString(),
          healthCheck: true
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        statusDot.className = 'status-dot connected';
        statusText.textContent = 'Connected';
      } else {
        statusDot.className = 'status-dot';
        statusText.textContent = 'Connection issues';
      }

    } catch (error) {
      if (error.name === 'AbortError') {
        statusDot.className = 'status-dot';
        statusText.textContent = 'Connection timeout';
      } else {
        statusDot.className = 'status-dot';
        statusText.textContent = 'Connection failed';
      }
    }
  }

  showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.success-message, .error-message');
    existingMessages.forEach(msg => msg.remove());

    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'error' ? 'error-message' : 'success-message';
    messageDiv.textContent = message;

    // Add to actions section
    const actionsSection = document.querySelector('.actions-section');
    actionsSection.appendChild(messageDiv);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      if (messageDiv.parentNode) {
        messageDiv.remove();
      }
    }, 4000);
  }

  viewLogs() {
    // Open Chrome extension logs
    chrome.tabs.create({
      url: 'chrome://extensions/?id=' + chrome.runtime.id
    });
  }

  reportIssue() {
    // Create GitHub issue URL with pre-filled template
    const issueUrl = 'https://github.com/your-username/prompt-enhancer/issues/new' +
      '?template=bug_report.md' +
      '&title=' + encodeURIComponent('[Bug Report] ') +
      '&body=' + encodeURIComponent(`
**Extension Version:** 1.0.0
**Browser:** ${navigator.userAgent}
**Webhook URL:** ${this.settings.webhookUrl}
**Settings:** ${JSON.stringify(this.settings, null, 2)}

**Describe the bug:**
A clear and concise description of what the bug is.

**To Reproduce:**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior:**
A clear and concise description of what you expected to happen.

**Additional context:**
Add any other context about the problem here.
      `);

    chrome.tabs.create({ url: issueUrl });
  }
}

// Add CSS animation for loading spinner
const style = document.createElement('style');
style.textContent = `
  .animate-spin {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

// Initialize popup when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new PopupManager();
  });
} else {
  new PopupManager();
}