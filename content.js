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

    // Set the selected value
    select.value = defaultLanguage;

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

// ========= LANGUAGE CHANGE BUTTON =========
let languageChangeBtn = null;

function createLanguageChangeButton() {
  // Remove existing button if any
  if (languageChangeBtn) {
    languageChangeBtn.remove();
  }

  // Create floating button
  languageChangeBtn = document.createElement('div');
  languageChangeBtn.id = 'wpml-language-changer';
  languageChangeBtn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: linear-gradient(135deg, #0073aa 0%, #005a87 100%);
    color: white;
    padding: 12px 20px;
    border-radius: 25px;
    box-shadow: 0 4px 12px rgba(0, 115, 170, 0.4);
    z-index: 999998;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 14px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    animation: slideUp 0.3s ease;
  `;

  // Add animation
  if (!document.getElementById('wpml-language-changer-styles')) {
    const style = document.createElement('style');
    style.id = 'wpml-language-changer-styles';
    style.textContent = `
      @keyframes slideUp {
        from {
          transform: translateY(100%);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
      #wpml-language-changer:hover {
        transform: scale(1.05) translateY(-2px);
        box-shadow: 0 6px 16px rgba(0, 115, 170, 0.5);
      }
    `;
    document.head.appendChild(style);
  }

  // Get current language name
  const currentLang = TARGET_LANGUAGE 
    ? LANGUAGES.find(l => l.code === TARGET_LANGUAGE)?.name || TARGET_LANGUAGE.toUpperCase()
    : 'Select Language';

  // Icon
  const icon = document.createElement('span');
  icon.textContent = '🌐';
  icon.style.fontSize = '18px';

  // Text
  const text = document.createElement('span');
  text.textContent = currentLang;

  // Click handler
  languageChangeBtn.onclick = async () => {
    try {
      const newLang = await showLanguageSelector();
      TARGET_LANGUAGE = newLang;
      updateLanguageChangeButton();
      console.log('🌐 Language changed to:', newLang);
  } catch (err) {
    // User cancelled
  }
  };

  languageChangeBtn.appendChild(icon);
  languageChangeBtn.appendChild(text);
  document.body.appendChild(languageChangeBtn);
}

function updateLanguageChangeButton() {
  if (languageChangeBtn && TARGET_LANGUAGE) {
    const currentLang = LANGUAGES.find(l => l.code === TARGET_LANGUAGE)?.name || TARGET_LANGUAGE.toUpperCase();
    const textSpan = languageChangeBtn.querySelector('span:last-child');
    if (textSpan) {
      textSpan.textContent = currentLang;
    }
  }
}

// ========= INITIALIZE LANGUAGE =========
let TARGET_LANGUAGE = null;

// Show language selector on page load
(async () => {
  try {
    TARGET_LANGUAGE = await showLanguageSelector();
    console.log('🌐 Target language selected:', TARGET_LANGUAGE);
    createLanguageChangeButton();
  } catch (err) {
    // User cancelled, will show on plus button click
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
  
  const translated = data.responseData.translatedText || '';
  if (!translated.trim()) {
    throw new Error('MyMemory returned empty translation');
  }
  
  return translated.trim();
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
      if (data.translatedText && data.translatedText.trim()) {
        const translated = data.translatedText.trim();
        console.log('✅ LibreTranslate success');
        return translated;
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
    if (translated && translated.trim()) {
      console.log('✅ MyMemory success');
      return translated.trim();
    } else {
      throw new Error('MyMemory returned empty translation');
    }
  } catch (err) {
    console.error('❌ MyMemory also failed:', err.message);
    throw new Error(`All translation APIs failed. Last error: ${err.message}`);
  }
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

// ========= SIMILARITY CALCULATION =========
function calculateSimilarity(str1, str2) {
  if (str1 === str2) return 1.0;
  if (str1.length === 0 || str2.length === 0) return 0.0;

  // Simple Levenshtein distance based similarity
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  // Calculate edit distance
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(str1, str2) {
  const matrix = [];
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[str2.length][str1.length];
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

// ========= GLOBAL OBSERVER MANAGEMENT =========
let activeObserver = null;

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
      createLanguageChangeButton();
    } catch (err) {
      console.warn('⚠️ Language selection cancelled');
      return;
    }
  }

  // Cleanup any existing observer from previous click
  if (activeObserver) {
    activeObserver.disconnect();
    activeObserver = null;
  }

  console.log('🔍 Plus button clicked, waiting for WPML UI...');

  // Store the clicked plus button for this specific translation attempt
  const clickedPlus = plus;
  
  // Wait for WPML to inject UI with retry mechanism
  let attempts = 0;
  const maxAttempts = 15; // Increased attempts
  const delay = 200;
  let observer = null; // Store observer reference
  let isTranslationComplete = false; // Track if translation completed

  const tryTranslate = async () => {
    attempts++;
    
    console.log(`🔄 Attempt ${attempts}/${maxAttempts} - Searching for textareas...`);
    
    // Find textareas near the clicked element (use stored reference)
    const textareas = findTextareasNearElement(clickedPlus);
    
    console.log(`📝 Found ${textareas.length} textarea(s)`);
    
    if (textareas.length < 1) {
      if (attempts < maxAttempts) {
        setTimeout(tryTranslate, delay);
      } else {
        console.error('❌ Could not find any textareas');
      }
      return;
    }

    // Find original (has value) - usually the first one or one with content
    const original = textareas.find(ta => ta.value.trim()) || textareas[0];
    
    // Find target (MUST be empty) - prioritize empty textareas in the same row/container
    // WPML typically shows original first, then translation textarea appears after plus click
    // IMPORTANT: Only use EMPTY textareas as target
    let target = textareas.find(ta => {
      const isEmpty = !ta.value.trim();
      const isNotOriginal = ta !== original;
      return isEmpty && isNotOriginal;
    });
    
    // If no empty textarea found, try to find the last textarea if it's empty
    if (!target && textareas.length > 1) {
      const lastTextarea = textareas[textareas.length - 1];
      // ONLY use if it's empty AND different from original
      if (!lastTextarea.value.trim() && lastTextarea !== original) {
        target = lastTextarea;
      }
    }
    
    // Debug log
    if (!target) {
      console.log('⚠️ No empty target textarea found');
    }

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
      }
      return;
    }

    const originalText = original.value.trim();
    if (!originalText) {
      console.warn('⚠️ Original text is empty');
      return;
    }

    // Skip if target already has text
    if (target.value.trim()) {
      return;
    }

    console.log('🔄 Translating:', originalText.substring(0, 50) + '...');

    try {
      const translated = await translateText(originalText);
      
      // Validate translation
      if (!translated || !translated.trim()) {
        console.error('❌ Translation returned empty');
        return;
      }

      const translatedText = translated.trim();
      const originalTextLower = originalText.toLowerCase().trim();
      const translatedTextLower = translatedText.toLowerCase().trim();

      // Check if translation is same as original (case-insensitive)
      if (originalTextLower === translatedTextLower) {
        console.warn('⚠️ Translation is same as original text, skipping paste');
        console.log('Original:', originalText);
        console.log('Translated:', translatedText);
        return;
      }

      // Check if translation is too similar (more than 90% same)
      if (translatedTextLower.length > 0 && originalTextLower.length > 0) {
        const similarity = calculateSimilarity(originalTextLower, translatedTextLower);
        if (similarity > 0.9) {
          console.warn('⚠️ Translation too similar to original, skipping paste');
          console.log('Similarity:', (similarity * 100).toFixed(1) + '%');
          return;
        }
      }

      target.value = translatedText;
      triggerWPMLChange(target);
      
      console.log('✅ Translation complete!');
      
      // Visual feedback
      target.style.backgroundColor = '#e8f5e9';
      setTimeout(() => {
        target.style.backgroundColor = '';
      }, 2000);
      
      // Mark translation as complete and cleanup
      isTranslationComplete = true;
      if (observer) {
        observer.disconnect();
        observer = null;
        activeObserver = null;
      }
      return;
      
    } catch (err) {
      if (attempts >= maxAttempts) {
        alert(`Translation failed: ${err.message}`);
        if (observer) {
          observer.disconnect();
          observer = null;
        }
      }
    }
  };

  // Use MutationObserver to watch for textarea injection
  observer = new MutationObserver((mutations) => {
    // Don't process if translation already completed or exceeded max attempts
    if (isTranslationComplete || attempts >= maxAttempts) {
      return;
    }
    
    // Check if new textareas were added near the clicked element
    const hasNewTextareas = mutations.some(mutation => {
      return Array.from(mutation.addedNodes).some(node => {
        if (node.nodeType === 1) { // Element node
          const isTextarea = node.tagName === 'TEXTAREA';
          const hasTextarea = node.querySelector && node.querySelector('textarea');
          
          // Check if new textarea is near the clicked plus button
          if (isTextarea || hasTextarea) {
            const row = clickedPlus.closest('tr, .row, [class*="row"], [class*="string"], [class*="translation"], tbody, table');
            if (row) {
              // Check if new textarea is in same row or adjacent
              const isInRow = row.contains(node);
              const isInNextRow = row.nextElementSibling?.contains(node);
              const isInParent = row.parentElement?.contains(node);
              
              if (isInRow || isInNextRow || isInParent) {
                return true;
              }
            }
          }
        }
        return false;
      });
    });
    
    if (hasNewTextareas && !isTranslationComplete) {
      setTimeout(() => {
        if (attempts < maxAttempts && !isTranslationComplete) {
          tryTranslate();
        }
      }, 50);
    }
  });

  // Store observer globally for cleanup
  activeObserver = observer;
  
  // Observe the document for changes
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  // Start trying immediately
  setTimeout(() => {
    if (!isTranslationComplete) {
      tryTranslate();
    }
  }, 100);
  
  // Cleanup observer after max attempts
  setTimeout(() => {
    if (observer && !isTranslationComplete) {
      observer.disconnect();
      observer = null;
      activeObserver = null;
    }
  }, maxAttempts * delay + 3000);

});
