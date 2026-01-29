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
      saveTargetLanguage(newLang); // Save to localStorage
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
