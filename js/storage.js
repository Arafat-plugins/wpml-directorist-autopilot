// ========= STORAGE UTILITIES =========
const STORAGE_KEY = 'wpml_autopilot_target_language';
const PAID_API_STORAGE_KEY = 'wpml_autopilot_paid_api_config';

function saveTargetLanguage(languageCode) {
  try {
    localStorage.setItem(STORAGE_KEY, languageCode);
    console.log('💾 Language saved:', languageCode);
  } catch (err) {
    console.warn('⚠️ Failed to save language:', err);
  }
}

function loadTargetLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      console.log('📂 Language loaded from storage:', saved);
      return saved;
    }
  } catch (err) {
    console.warn('⚠️ Failed to load language:', err);
  }
  return null;
}

// ========= PAID API CONFIGURATION STORAGE =========
function savePaidApiConfig(config) {
  try {
    const configData = {
      enabled: config.enabled || false,
      apiUrl: config.apiUrl || '',
      apiKey: config.apiKey || '',
      apiType: config.apiType || 'custom',
      region: config.region || ''
    };
    localStorage.setItem(PAID_API_STORAGE_KEY, JSON.stringify(configData));
    console.log('💾 Paid API configuration saved');
    return true;
  } catch (err) {
    console.warn('⚠️ Failed to save paid API config:', err);
    return false;
  }
}

function loadPaidApiConfig() {
  try {
    const saved = localStorage.getItem(PAID_API_STORAGE_KEY);
    if (saved) {
      const config = JSON.parse(saved);
      console.log('📂 Paid API configuration loaded');
      return config;
    }
  } catch (err) {
    console.warn('⚠️ Failed to load paid API config:', err);
  }
  return null;
}
