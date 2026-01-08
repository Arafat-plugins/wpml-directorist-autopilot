console.log('✅ WPML Inline Translator Loaded');

// ========= LANGUAGE OPTIONS =========
const LANGUAGES = [
  { code: 'bn', name: 'Bengali (বাংলা)' },
  { code: 'hi', name: 'Hindi (हिन्दी)' },
  { code: 'ar', name: 'Arabic (العربية)' },
  { code: 'es', name: 'Spanish (Español)' },
  { code: 'fr', name: 'French (Français)' },
  { code: 'de', name: 'German (Deutsch)' },
  { code: 'it', name: 'Italian (Italiano)' },
  { code: 'pt', name: 'Portuguese (Português)' },
  { code: 'ru', name: 'Russian (Русский)' },
  { code: 'ja', name: 'Japanese (日本語)' },
  { code: 'ko', name: 'Korean (한국어)' },
  { code: 'zh', name: 'Chinese (中文)' },
  { code: 'th', name: 'Thai (ไทย)' },
  { code: 'vi', name: 'Vietnamese (Tiếng Việt)' },
  { code: 'tr', name: 'Turkish (Türkçe)' },
  { code: 'pl', name: 'Polish (Polski)' },
  { code: 'nl', name: 'Dutch (Nederlands)' },
  { code: 'sv', name: 'Swedish (Svenska)' },
  { code: 'da', name: 'Danish (Dansk)' },
  { code: 'no', name: 'Norwegian (Norsk)' },
  { code: 'fi', name: 'Finnish (Suomi)' },
  { code: 'el', name: 'Greek (Ελληνικά)' },
  { code: 'he', name: 'Hebrew (עברית)' },
  { code: 'id', name: 'Indonesian (Bahasa Indonesia)' },
  { code: 'ms', name: 'Malay (Bahasa Melayu)' },
  { code: 'ta', name: 'Tamil (தமிழ்)' },
  { code: 'te', name: 'Telugu (తెలుగు)' },
  { code: 'mr', name: 'Marathi (मराठी)' },
  { code: 'gu', name: 'Gujarati (ગુજરાતી)' },
  { code: 'kn', name: 'Kannada (ಕನ್ನಡ)' },
  { code: 'ml', name: 'Malayalam (മലയാളം)' },
  { code: 'pa', name: 'Punjabi (ਪੰਜਾਬੀ)' },
  { code: 'ur', name: 'Urdu (اردو)' },
  { code: 'fa', name: 'Persian (فارسی)' },
  { code: 'uk', name: 'Ukrainian (Українська)' },
  { code: 'cs', name: 'Czech (Čeština)' },
  { code: 'ro', name: 'Romanian (Română)' },
  { code: 'hu', name: 'Hungarian (Magyar)' },
  { code: 'bg', name: 'Bulgarian (Български)' },
  { code: 'hr', name: 'Croatian (Hrvatski)' },
  { code: 'sk', name: 'Slovak (Slovenčina)' },
  { code: 'sr', name: 'Serbian (Српски)' },
  { code: 'sl', name: 'Slovenian (Slovenščina)' }
];

// ========= LANGUAGE SELECTION UI =========
function showLanguageSelector() {
  return new Promise((resolve, reject) => {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999999;
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    `;

    // Create modal box
    const modal = document.createElement('div');
    modal.style.cssText = `
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.3);
      max-width: 500px;
      width: 90%;
      max-height: 80vh;
      overflow-y: auto;
    `;

    // Title
    const title = document.createElement('h2');
    title.textContent = 'Select Target Language';
    title.style.cssText = 'margin: 0 0 20px 0; font-size: 24px; color: #333;';

    // Select dropdown
    const select = document.createElement('select');
    select.style.cssText = `
      width: 100%;
      font-size: 16px;
      border: 2px solid #ddd;
      border-radius: 4px;
      margin-bottom: 20px;
      cursor: pointer;
      background-color: white;
      color: #333;
    `;

    // Determine default language (use previously selected or Bengali)
    const defaultLanguage = TARGET_LANGUAGE || 'bn';

    // Add options
    LANGUAGES.forEach(lang => {
      const option = document.createElement('option');
      option.value = lang.code;
      option.textContent = lang.name;
      if (lang.code === defaultLanguage) {
        option.selected = true;
      }
      select.appendChild(option);
    });

    // Explicitly set the value to ensure it displays
    select.value = defaultLanguage;
    
    // Force update display (for browser compatibility)
    const defaultIndex = Array.from(select.options).findIndex(opt => opt.value === defaultLanguage);
    if (defaultIndex >= 0) {
      select.selectedIndex = defaultIndex;
    }
    
    // Ensure the select field shows the selected value visually
    select.addEventListener('change', function() {
      // Force visual update
      this.style.color = '#333';
      console.log('Language changed to:', this.value, this.options[this.selectedIndex].textContent);
    });
    
    // Initial visual update
    setTimeout(() => {
      select.style.color = '#333';
      if (select.selectedIndex >= 0) {
        console.log('Selected language displayed:', select.options[select.selectedIndex].textContent);
      }
    }, 10);

    // Buttons container
    const buttons = document.createElement('div');
    buttons.style.cssText = 'display: flex; gap: 10px; justify-content: flex-end;';

    // Cancel button
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.cssText = `
      padding: 10px 20px;
      background: #f0f0f0;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    `;
    cancelBtn.onmouseover = () => cancelBtn.style.background = '#e0e0e0';
    cancelBtn.onmouseout = () => cancelBtn.style.background = '#f0f0f0';

    // OK button
    const okBtn = document.createElement('button');
    okBtn.textContent = 'OK';
    okBtn.style.cssText = `
      padding: 10px 20px;
      background: #0073aa;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
    `;
    okBtn.onmouseover = () => okBtn.style.background = '#005a87';
    okBtn.onmouseout = () => okBtn.style.background = '#0073aa';

    // Event handlers
    const cleanup = () => {
      document.body.removeChild(overlay);
    };

    cancelBtn.onclick = () => {
      cleanup();
      reject(new Error('Language selection cancelled'));
    };

    okBtn.onclick = () => {
      const selectedCode = select.value;
      cleanup();
      resolve(selectedCode);
    };

    // Close on overlay click
    overlay.onclick = (e) => {
      if (e.target === overlay) {
        cleanup();
        reject(new Error('Language selection cancelled'));
      }
    };

    // Assemble modal
    buttons.appendChild(cancelBtn);
    buttons.appendChild(okBtn);
    modal.appendChild(title);
    modal.appendChild(select);
    modal.appendChild(buttons);
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Focus select
    select.focus();
  });
}

// ========= INITIALIZE LANGUAGE =========
let TARGET_LANGUAGE = null;

// Show language selector on page load
(async () => {
  try {
    TARGET_LANGUAGE = await showLanguageSelector();
    console.log('🌐 Target language selected:', TARGET_LANGUAGE);
  } catch (err) {
    console.log('ℹ️ Language selection will be shown when you click the plus button');
    // Don't show alert, just let user select when they click plus button
  }
})();

// ========= FREE API - Alternative 1: MyMemory =========
async function translateWithMyMemory(text) {
  const res = await fetch(
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${TARGET_LANGUAGE}`
  );
  
  if (!res.ok) {
    throw new Error(`MyMemory API Error: ${res.status}`);
  }
  
  const data = await res.json();
  
  if (data.responseStatus !== 200) {
    throw new Error(`MyMemory Error: ${data.responseData?.errorMessage || 'Unknown error'}`);
  }
  
  return data.responseData.translatedText || '';
}

// ========= FREE API - Main Function =========
async function translateText(text) {
  // Limit text length for free APIs
  if (text.length > 500) {
    console.warn('⚠️ Text too long, truncating to 500 chars');
    text = text.substring(0, 500);
  }

  // Try libretranslate.com first
  try {
    console.log('🔄 Trying LibreTranslate API...');
    const res = await fetch('https://libretranslate.com/translate', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        q: text,
        source: 'en',
        target: TARGET_LANGUAGE,
        format: 'text'
      })
    });

    if (res.ok) {
      const data = await res.json();
      if (data.translatedText) {
        console.log('✅ LibreTranslate success');
        return data.translatedText;
      }
    }

    // Get error details
    let errorDetails = '';
    try {
      const errorData = await res.json();
      errorDetails = errorData.error || JSON.stringify(errorData);
    } catch (e) {
      errorDetails = await res.text();
    }
    
    console.warn('⚠️ LibreTranslate failed:', res.status, errorDetails);
    
  } catch (err) {
    console.warn('⚠️ LibreTranslate error:', err.message);
  }

  // Fallback to MyMemory API
  try {
    console.log('🔄 Trying MyMemory API as fallback...');
    const translated = await translateWithMyMemory(text);
    console.log('✅ MyMemory success');
    return translated;
  } catch (err) {
    console.error('❌ MyMemory also failed:', err.message);
    throw new Error(`All translation APIs failed. Last error: ${err.message}`);
  }
}

// ========= WAIT FOR ELEMENT =========
function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) {
      resolve(element);
      return;
    }

    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    setTimeout(() => {
      observer.disconnect();
      reject(new Error(`Timeout waiting for ${selector}`));
    }, timeout);
  });
}

// ========= FIND TEXTAREAS NEAR CLICKED ELEMENT =========
function findTextareasNearElement(element) {
  // Strategy 1: Find in closest container (row, div, etc.)
  let container = element.closest('tr, .row, [class*="row"], [class*="string"], [class*="translation"], tbody, table');
  
  if (!container) {
    // If no container, search from parent
    container = element.parentElement;
  }

  // Strategy 2: Search in container and nearby elements
  let allTextareas = [];
  
  if (container) {
    // Get all textareas in container
    allTextareas = Array.from(container.querySelectorAll('textarea'));
    
    // Also check siblings
    const siblings = [
      container.previousElementSibling,
      container.nextElementSibling,
      container.parentElement?.previousElementSibling,
      container.parentElement?.nextElementSibling
    ].filter(Boolean);
    
    siblings.forEach(sibling => {
      const siblingTextareas = sibling.querySelectorAll('textarea');
      allTextareas = allTextareas.concat(Array.from(siblingTextareas));
    });
  }

  // Strategy 3: If still not found, search entire page but prioritize nearby
  if (allTextareas.length < 2) {
    const pageTextareas = Array.from(document.querySelectorAll('textarea'));
    
    // Find textareas near the clicked element (within same section/container)
    const clickedRect = element.getBoundingClientRect();
    const nearbyTextareas = pageTextareas.filter(ta => {
      const taRect = ta.getBoundingClientRect();
      // Check if textarea is in similar vertical position (within 500px)
      return Math.abs(taRect.top - clickedRect.top) < 500;
    });
    
    if (nearbyTextareas.length >= 2) {
      allTextareas = nearbyTextareas;
    } else if (pageTextareas.length >= 2) {
      // Fallback: use all textareas on page
      allTextareas = pageTextareas;
    }
  }

  return allTextareas;
}

// ========= TRIGGER WPML EVENTS =========
function triggerWPMLChange(textarea) {
  // Trigger multiple events to ensure WPML detects the change
  ['input', 'change', 'keyup', 'blur'].forEach(eventType => {
    textarea.dispatchEvent(new Event(eventType, { bubbles: true, cancelable: true }));
  });
  
  // Also try React synthetic events if WPML uses React
  if (textarea._valueTracker) {
    textarea._valueTracker.setValue('');
  }
  textarea.value = textarea.value; // Force update
}

// ========= CORE =========
document.addEventListener('click', async (e) => {
  
  // Better plus button detection - check for icons, classes, aria-labels
  const plus = e.target.closest('button, a, .button, [class*="add"], [class*="plus"], [aria-label*="add"], [aria-label*="plus"]');
  
  if (!plus) return;
  
  // Check if it's a plus button (text, icon, or aria-label)
  const hasPlus = 
    plus.innerText.includes('+') || 
    plus.textContent.includes('+') ||
    plus.innerHTML.includes('plus') ||
    plus.innerHTML.includes('add') ||
    plus.getAttribute('aria-label')?.toLowerCase().includes('add') ||
    plus.getAttribute('aria-label')?.toLowerCase().includes('plus') ||
    plus.classList.toString().toLowerCase().includes('add') ||
    plus.classList.toString().toLowerCase().includes('plus');

  if (!hasPlus) return;

  // Check if language is selected
  if (!TARGET_LANGUAGE) {
    console.log('⚠️ Language not selected, showing selector...');
    try {
      TARGET_LANGUAGE = await showLanguageSelector();
      console.log('🌐 Target language selected:', TARGET_LANGUAGE);
    } catch (err) {
      console.warn('⚠️ Language selection cancelled');
      return;
    }
  }

  console.log('🔍 Plus button clicked, waiting for WPML UI...');

  // Wait for WPML to inject UI with retry mechanism
  let attempts = 0;
  const maxAttempts = 10;
  const delay = 200;

  const tryTranslate = async () => {
    attempts++;
    
    console.log(`🔄 Attempt ${attempts}/${maxAttempts} - Searching for textareas...`);
    
    // Find textareas near the clicked element
    const textareas = findTextareasNearElement(plus);
    
    console.log(`📝 Found ${textareas.length} textarea(s)`);
    
    if (textareas.length < 1) {
      if (attempts < maxAttempts) {
        setTimeout(tryTranslate, delay);
      } else {
        console.error('❌ Could not find any textareas');
        console.log('💡 Debug: Plus element:', plus);
        console.log('💡 Debug: Plus parent:', plus.parentElement);
      }
      return;
    }

    // Find original (has value) - usually the first one or one with content
    const original = textareas.find(ta => ta.value.trim()) || textareas[0];
    
    // Find target (empty) - usually the last one or one without content
    // WPML typically shows original first, then translation textarea appears after plus click
    const target = textareas.find(ta => !ta.value.trim() && ta !== original) || 
                   (textareas.length > 1 ? textareas[textareas.length - 1] : null);

    if (!original) {
      if (attempts < maxAttempts) {
        setTimeout(tryTranslate, delay);
      } else {
        console.error('❌ Could not find original textarea');
      }
      return;
    }

    if (!target) {
      if (attempts < maxAttempts) {
        setTimeout(tryTranslate, delay);
      } else {
        console.error('❌ Could not find target textarea');
        console.log('💡 Debug: Available textareas:', textareas.map((ta, i) => ({
          index: i,
          hasValue: !!ta.value.trim(),
          value: ta.value.substring(0, 30)
        })));
      }
      return;
    }

    const originalText = original.value.trim();
    if (!originalText) {
      console.warn('⚠️ Original text is empty');
      return;
    }

    if (target.value.trim()) {
      console.log('ℹ️ Target already has text, skipping');
      return;
    }

    console.log('🔄 Translating:', originalText.substring(0, 50) + '...');

    try {
      const translated = await translateText(originalText);
      
      if (!translated) {
        console.error('❌ Translation returned empty');
        return;
      }

      target.value = translated;
      triggerWPMLChange(target);
      
      console.log('✅ Translation complete!');
      
      // Visual feedback
      target.style.backgroundColor = '#e8f5e9';
      setTimeout(() => {
        target.style.backgroundColor = '';
      }, 2000);
      
    } catch (err) {
      console.error('❌ Translation failed', err);
      alert(`Translation failed: ${err.message}`);
    }
  };

  // Use MutationObserver to watch for textarea injection
  const observer = new MutationObserver((mutations) => {
    // Check if new textareas were added
    const hasNewTextareas = mutations.some(mutation => {
      return Array.from(mutation.addedNodes).some(node => {
        if (node.nodeType === 1) { // Element node
          return node.tagName === 'TEXTAREA' || node.querySelector('textarea');
        }
        return false;
      });
    });
    
    if (hasNewTextareas) {
      console.log('👀 New textarea detected, retrying...');
      tryTranslate();
    }
  });

  // Observe the document for changes
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Start trying immediately
  setTimeout(() => {
    tryTranslate();
    
    // Stop observing after max attempts
    setTimeout(() => {
      observer.disconnect();
    }, maxAttempts * delay + 1000);
  }, 100);

});
