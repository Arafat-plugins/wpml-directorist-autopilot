// ========= POPUP SCRIPT =========

// API Presets
const API_PRESETS = {
  deepl: {
    apiUrl: 'https://api-free.deepl.com/v2/translate',
    apiType: 'deepl',
    region: ''
  },
  google: {
    apiUrl: 'https://translation.googleapis.com/language/translate/v2',
    apiType: 'google',
    region: ''
  },
  azure: {
    apiUrl: 'https://api.cognitive.microsofttranslator.com/translate?api-version=3.0',
    apiType: 'azure',
    region: 'global'
  }
};

// Load saved configuration
function loadSettings() {
  try {
    const saved = localStorage.getItem('wpml_autopilot_paid_api_config');
    if (saved) {
      const config = JSON.parse(saved);
      
      document.getElementById('enablePaidApi').checked = config.enabled || false;
      document.getElementById('apiType').value = config.apiType || 'custom';
      document.getElementById('apiUrl').value = config.apiUrl || '';
      document.getElementById('apiKey').value = config.apiKey || '';
      document.getElementById('apiRegion').value = config.region || '';
      
      updateUI();
    }
  } catch (err) {
    console.error('Failed to load settings:', err);
  }
}

// Save configuration
function saveSettings() {
  const enabled = document.getElementById('enablePaidApi').checked;
  const apiType = document.getElementById('apiType').value;
  const apiUrl = document.getElementById('apiUrl').value.trim();
  const apiKey = document.getElementById('apiKey').value.trim();
  const region = document.getElementById('apiRegion').value.trim();
  
  // Validation
  if (enabled) {
    if (!apiUrl) {
      showStatus('Please enter an API URL', 'error');
      return;
    }
    if (!apiKey) {
      showStatus('Please enter an API Key', 'error');
      return;
    }
    if (apiType === 'azure' && !region) {
      showStatus('Please enter a region for Azure Translator', 'error');
      return;
    }
  }
  
  const config = {
    enabled: enabled,
    apiUrl: apiUrl,
    apiKey: apiKey,
    apiType: apiType,
    region: region
  };
  
  try {
    localStorage.setItem('wpml_autopilot_paid_api_config', JSON.stringify(config));
    showStatus('Settings saved successfully!', 'success');
    
    // Clear status after 3 seconds
    setTimeout(() => {
      hideStatus();
    }, 3000);
  } catch (err) {
    showStatus('Failed to save settings: ' + err.message, 'error');
  }
}

// Update UI based on enabled state
function updateUI() {
  const enabled = document.getElementById('enablePaidApi').checked;
  const paidApiSettings = document.getElementById('paidApiSettings');
  const apiType = document.getElementById('apiType').value;
  const regionGroup = document.getElementById('regionGroup');
  
  if (enabled) {
    paidApiSettings.classList.remove('disabled-section');
  } else {
    paidApiSettings.classList.add('disabled-section');
  }
  
  // Show/hide region field for Azure
  if (apiType === 'azure') {
    regionGroup.style.display = 'block';
  } else {
    regionGroup.style.display = 'none';
  }
}

// Apply API preset
function applyPreset(presetName) {
  if (presetName === 'clear') {
    document.getElementById('enablePaidApi').checked = false;
    document.getElementById('apiType').value = 'custom';
    document.getElementById('apiUrl').value = '';
    document.getElementById('apiKey').value = '';
    document.getElementById('apiRegion').value = '';
    updateUI();
    return;
  }
  
  const preset = API_PRESETS[presetName];
  if (preset) {
    document.getElementById('enablePaidApi').checked = true;
    document.getElementById('apiType').value = preset.apiType;
    document.getElementById('apiUrl').value = preset.apiUrl;
    document.getElementById('apiRegion').value = preset.region || '';
    updateUI();
    
    // Focus on API key input
    document.getElementById('apiKey').focus();
    showStatus('Preset applied! Please enter your API key.', 'success');
    setTimeout(hideStatus, 3000);
  }
}

// Show status message
function showStatus(message, type) {
  const statusEl = document.getElementById('statusMessage');
  statusEl.textContent = message;
  statusEl.className = 'status-message ' + type;
}

// Hide status message
function hideStatus() {
  const statusEl = document.getElementById('statusMessage');
  statusEl.className = 'status-message';
  statusEl.textContent = '';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
  loadSettings();
  
  // Toggle enable/disable
  document.getElementById('enablePaidApi').addEventListener('change', updateUI);
  
  // API type change
  document.getElementById('apiType').addEventListener('change', updateUI);
  
  // Save button
  document.getElementById('saveBtn').addEventListener('click', saveSettings);
  
  // Preset buttons
  document.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const preset = btn.getAttribute('data-preset');
      applyPreset(preset);
    });
  });
  
  // Allow Enter key to save
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      saveSettings();
    }
  });
});
