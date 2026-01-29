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
