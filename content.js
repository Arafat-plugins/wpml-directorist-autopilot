console.log('✅ WPML Inline Translator Loaded');

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
