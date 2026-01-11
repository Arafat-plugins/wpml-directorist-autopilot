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
      saveTargetLanguage(TARGET_LANGUAGE); // Save to localStorage
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
