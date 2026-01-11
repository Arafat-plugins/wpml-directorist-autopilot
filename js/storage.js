// ========= STORAGE UTILITIES =========
const STORAGE_KEY = 'wpml_autopilot_target_language';

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
