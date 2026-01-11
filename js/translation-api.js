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
