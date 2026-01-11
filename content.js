console.log('✅ WPML Inline Translator Loaded');

// ========= INITIALIZE LANGUAGE =========
// Load saved language from storage (don't show modal automatically)
TARGET_LANGUAGE = loadTargetLanguage();
if (TARGET_LANGUAGE) {
  console.log('🌐 Loaded saved language:', TARGET_LANGUAGE);
} else {
  console.log('ℹ️ No saved language found. Click the language button to select.');
}

// Create language button (always show it)
createLanguageChangeButton();
