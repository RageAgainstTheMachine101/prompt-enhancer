// PromptEnhancer Content Script
class PromptEnhancer {
  constructor() {
    this.selectedText = '';
    this.selectedRange = null;
    this.enhanceButton = null;
    this.isProcessing = false;
    this.webhookUrl = '';
    this.loadWebhookUrl();
    
    this.init();
  }

  async loadWebhookUrl() {
    try {
      const result = await chrome.storage.sync.get(['webhookUrl']);
      this.webhookUrl = result.webhookUrl || 'http://localhost:5678/webhook-test/n8n/prompt/enhance';
    } catch (error) {
      console.error('Error loading webhook URL:', error);
      this.webhookUrl = 'http://localhost:5678/webhook-test/n8n/prompt/enhance';
    }
  }

  init() {
    console.log('PromptEnhancer initialized');
    this.setupEventListeners();
    this.createEnhanceButton();
  }

  setupEventListeners() {
    // Listen for text selection
    document.addEventListener('mouseup', (e) => this.handleTextSelection(e));
    document.addEventListener('selectionchange', () => this.handleSelectionChange());
    
    // Hide button when clicking elsewhere
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.prompt-enhancer-button')) {
        this.hideEnhanceButton();
      }
    });

    // Handle keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hideEnhanceButton();
      } else if ((e.metaKey || e.ctrlKey) && e.key && e.key.toLowerCase() === 'a') {
        // Cmd/Ctrl + A: Select All — show the Enhance button near the selection
        // Delay to allow the selection to update
        setTimeout(() => {
          let selectedText = '';
          const selection = window.getSelection();
          try {
            selectedText = selection.toString().trim();
          } catch (_) {}

          // Fallback for inputs/textareas where window selection may not capture text
          if (!selectedText) {
            const active = document.activeElement;
            if (active && (active.tagName === 'TEXTAREA' || (active.tagName === 'INPUT' && active.type === 'text'))) {
              const start = active.selectionStart;
              const end = active.selectionEnd;
              if (start != null && end != null && end > start) {
                try { selectedText = active.value.substring(start, end).trim(); } catch (_) {}
              }
            }
          }

          if (selectedText && selectedText.length > 3) {
            this.selectedText = selectedText;

            // Try to preserve the DOM Range if available
            let placed = false;
            try {
              if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                this.selectedRange = range.cloneRange();
                const rect = range.getBoundingClientRect();
                if (rect && rect.width >= 0 && rect.height >= 0) {
                  const x = rect.left + rect.width / 2 + window.scrollX;
                  const y = rect.top + window.scrollY;
                  this.showEnhanceButton(x, y);
                  placed = true;
                }
              }
            } catch (_) {}

            // Fallback: position near the active element or viewport center
            if (!placed) {
              const target = document.activeElement || document.body;
              const rect = (target && target.getBoundingClientRect) ? target.getBoundingClientRect() : { left: window.innerWidth / 2, top: window.innerHeight / 2, width: 0 };
              const x = rect.left + (rect.width || 0) / 2 + window.scrollX;
              const y = rect.top + window.scrollY;
              this.showEnhanceButton(x, y);
            }
          } else {
            this.hideEnhanceButton();
          }
        }, 0);
      }
    });
  }

  handleTextSelection(e) {
    setTimeout(() => {
      const selection = window.getSelection();
      const selectedText = selection.toString().trim();

      if (selectedText && selectedText.length > 3) {
        this.selectedText = selectedText;
        this.selectedRange = selection.getRangeAt(0).cloneRange();
        this.showEnhanceButton(e.pageX, e.pageY);
      } else {
        this.hideEnhanceButton();
      }
    }, 10);
  }

  handleSelectionChange() {
    const selection = window.getSelection();
    if (!selection.toString().trim()) {
      this.hideEnhanceButton();
    }
  }

  createEnhanceButton() {
    this.enhanceButton = document.createElement('button');
    this.enhanceButton.className = 'prompt-enhancer-button';
    this.enhanceButton.innerHTML = `
      <svg class="prompt-enhancer-icon" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
        <path d="M19 15L20.09 18.26L24 19L20.09 19.74L19 23L17.91 19.74L14 19L17.91 18.26L19 15Z"/>
        <path d="M6 15L7.09 18.26L11 19L7.09 19.74L6 23L4.91 19.74L1 19L4.91 18.26L6 15Z"/>
      </svg>
      <span>Enhance</span>
    `;
    
    this.enhanceButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.enhancePrompt();
    });

    document.body.appendChild(this.enhanceButton);
    this.enhanceButton.style.display = 'none';
  }

  showEnhanceButton(x, y) {
    if (!this.enhanceButton) return;

    // Position the button near the selection
    const buttonWidth = 120;
    const buttonHeight = 36;
    const padding = 10;

    let left = x - buttonWidth / 2;
    let top = y - buttonHeight - padding;

    // Keep button within viewport
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
      scrollX: window.pageXOffset,
      scrollY: window.pageYOffset
    };

    if (left < viewport.scrollX + padding) {
      left = viewport.scrollX + padding;
    } else if (left + buttonWidth > viewport.scrollX + viewport.width - padding) {
      left = viewport.scrollX + viewport.width - buttonWidth - padding;
    }

    if (top < viewport.scrollY + padding) {
      top = y + padding; // Show below selection if no space above
    }

    this.enhanceButton.style.left = `${left}px`;
    this.enhanceButton.style.top = `${top}px`;
    this.enhanceButton.style.display = 'flex';
    
    // Reset animation
    this.enhanceButton.style.animation = 'none';
    this.enhanceButton.offsetHeight; // Trigger reflow
    this.enhanceButton.style.animation = 'promptEnhancerFadeIn 0.3s ease forwards';
  }

  hideEnhanceButton() {
    if (this.enhanceButton && !this.isProcessing) {
      this.enhanceButton.style.display = 'none';
    }
  }

  async enhancePrompt() {
    if (this.isProcessing || !this.selectedText) return;

    this.isProcessing = true;
    this.enhanceButton.classList.add('loading');

    try {
      this.showToast('Enhancing prompt...', 'info');
      // Send request to background service worker to avoid mixed-content/CORS issues
      const result = await new Promise((resolve, reject) => {
        try {
          chrome.runtime.sendMessage(
            {
              action: 'enhance-prompt',
              text: this.selectedText
            },
            (response) => {
              if (chrome.runtime.lastError) {
                return reject(new Error(chrome.runtime.lastError.message));
              }
              if (!response) {
                return reject(new Error('No response from background'));
              }
              if (response.error) {
                return reject(new Error(response.error));
              }
              resolve(response.result);
            }
          );
        } catch (err) {
          reject(err);
        }
      });
      
      // Extract enhanced text from response
      let enhancedText = result.enhancedText || result.enhanced_text || result.text || result.result;
      
      if (!enhancedText) {
        // If the response structure is different, try to find text in the response
        if (typeof result === 'string') {
          enhancedText = result;
        } else {
          // Look for common property names that might contain the enhanced text
          const possibleKeys = ['enhanced', 'improved', 'output', 'response', 'content'];
          for (const key of possibleKeys) {
            if (result[key]) {
              enhancedText = result[key];
              break;
            }
          }
        }
      }

      if (enhancedText && enhancedText !== this.selectedText) {
        this.replaceSelectedText(enhancedText);
        this.showToast('Prompt enhanced successfully!', 'success');
      } else {
        this.showToast('No enhancement received. Check your n8n workflow.', 'error');
      }

    } catch (error) {
      console.error('PromptEnhancer error:', error);
      this.showToast(`Enhancement failed: ${error.message}`, 'error');
    } finally {
      this.isProcessing = false;
      this.enhanceButton.classList.remove('loading');
      this.hideEnhanceButton();
    }
  }

  replaceSelectedText(newText) {
    if (!this.selectedRange) return;

    try {
      // Clear current selection
      const selection = window.getSelection();
      selection.removeAllRanges();
      
      // Add our saved range back
      selection.addRange(this.selectedRange);
      
      // Replace the selected text
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        range.deleteContents();
        
        // Create text node with enhanced content
        const textNode = document.createTextNode(newText);
        range.insertNode(textNode);
        
        // Clear selection
        selection.removeAllRanges();
        
        // Highlight the new text briefly
        this.highlightText(textNode);
      }
    } catch (error) {
      console.error('Error replacing text:', error);
      
      // Fallback: try to use document.execCommand (deprecated but still works in many browsers)
      try {
        document.execCommand('insertText', false, newText);
      } catch (fallbackError) {
        console.error('Fallback text replacement also failed:', fallbackError);
        this.showToast('Text replacement failed. Please try copying manually.', 'error');
      }
    }
  }

  highlightText(textNode) {
    // Create a temporary highlight around the new text
    const span = document.createElement('span');
    span.className = 'prompt-enhancer-selected-text';
    
    try {
      textNode.parentNode.insertBefore(span, textNode);
      span.appendChild(textNode);
      
      // Remove highlight after 2 seconds
      setTimeout(() => {
        if (span.parentNode) {
          span.parentNode.insertBefore(textNode, span);
          span.parentNode.removeChild(span);
        }
      }, 2000);
    } catch (error) {
      console.error('Error highlighting text:', error);
    }
  }

  showToast(message, type = 'info') {
    // Remove existing toasts
    const existingToasts = document.querySelectorAll('.prompt-enhancer-toast');
    existingToasts.forEach(toast => toast.remove());

    const toast = document.createElement('div');
    toast.className = `prompt-enhancer-toast ${type}`;
    toast.textContent = message;

    document.body.appendChild(toast);

    // Auto-remove toast after 4 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.animation = 'promptEnhancerSlideIn 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
      }
    }, 4000);
  }
}

// Initialize the PromptEnhancer when the page is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new PromptEnhancer();
  });
} else {
  new PromptEnhancer();
}