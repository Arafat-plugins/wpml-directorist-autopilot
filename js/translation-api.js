// ========= FREE API OPTIONS =========

// API 1: MyMemory
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

// API 2: LibreTranslate
async function translateWithLibreTranslate(text) {
  const apiUrl = 'https://libretranslate.de/translate';
  
  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      q: text,
      source: 'en',
      target: TARGET_LANGUAGE,
      format: 'text'
    })
  });
  
  if (!res.ok) {
    throw new Error(`LibreTranslate API Error: ${res.status}`);
  }
  
  const data = await res.json();
  
  if (!data.translatedText) {
    throw new Error('LibreTranslate returned empty translation');
  }
  
  return data.translatedText;
}

// API 3: Google Translate
async function translateWithGoogleTranslate(text) {
  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${TARGET_LANGUAGE}&dt=t&q=${encodeURIComponent(text)}`;
  
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  
  if (!res.ok) {
    throw new Error(`Google Translate API Error: ${res.status}`);
  }
  
  const data = await res.json();
  if (data && data[0] && data[0][0] && data[0][0][0]) {
    return data[0].map(item => item[0]).join('');
  }
  
  throw new Error('Google Translate returned invalid format');
}

// API 4: MyMemory Backup
async function translateWithMyMemoryBackup(text) {
  const res = await fetch(
    `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${TARGET_LANGUAGE}&de=wpml-autopilot@ventro.com`
  );
  
  if (!res.ok) {
    throw new Error(`MyMemory Backup API Error: ${res.status}`);
  }
  
  const data = await res.json();
  
  if (data.responseStatus !== 200) {
    throw new Error(`MyMemory Backup Error: ${data.responseData?.errorMessage || 'Unknown error'}`);
  }
  
  return data.responseData.translatedText || '';
}

// ========= PAID API - Generic Support =========
async function translateWithPaidAPI(text, apiConfig) {
  const { apiUrl, apiKey, apiType } = apiConfig;
  
  if (!apiUrl || !apiKey) {
    throw new Error('Paid API configuration is incomplete');
  }

  let requestBody = {};
  let headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  };

  // Build request body based on API type
  switch (apiType) {
    case 'deepl':
      requestBody = {
        text: [text],
        target_lang: TARGET_LANGUAGE.toUpperCase(),
        source_lang: 'EN'
      };
      headers['Authorization'] = `DeepL-Auth-Key ${apiKey}`;
      break;
    
    case 'google':
      requestBody = {
        q: [text],
        target: TARGET_LANGUAGE,
        source: 'en',
        format: 'text'
      };
      headers['X-Goog-Api-Key'] = apiKey;
      break;
    
    case 'azure':
      requestBody = [{
        text: text
      }];
      headers['Ocp-Apim-Subscription-Key'] = apiKey;
      headers['Ocp-Apim-Subscription-Region'] = apiConfig.region || 'global';
      break;
    
    case 'custom':
    default:
      requestBody = {
        text: text,
        source: 'en',
        target: TARGET_LANGUAGE,
        q: text
      };
      headers['Authorization'] = `Bearer ${apiKey}`;
      break;
  }

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(requestBody)
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Paid API Error (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  let translatedText = '';
  switch (apiType) {
    case 'deepl':
      translatedText = data.translations?.[0]?.text || '';
      break;
    case 'google':
      translatedText = data.data?.translations?.[0]?.translatedText || '';
      break;
    case 'azure':
      translatedText = data[0]?.translations?.[0]?.text || '';
      break;
    case 'custom':
    default:
      translatedText = data.translatedText || data.translation || data.text || data.result || '';
      break;
  }

  if (!translatedText) {
    throw new Error('Paid API returned empty translation');
  }

  return translatedText;
}

// ========= MAIN TRANSLATION FUNCTION WITH SMART FALLBACK =========
async function translateText(text) {
  // Limit text length for free APIs
  if (text.length > 500) {
    console.warn('⚠️ Text too long, truncating to 500 chars');
    text = text.substring(0, 500);
  }
  
  // Get paid API configuration
  const paidApiConfig = loadPaidApiConfig();
  
  // Try paid API first if configured
  if (paidApiConfig && paidApiConfig.enabled && paidApiConfig.apiUrl && paidApiConfig.apiKey) {
    try {
      console.log('🔄 Trying Paid API...');
      const translated = await translateWithPaidAPI(text, paidApiConfig);
      console.log('✅ Paid API success');
      return translated;
    } catch (err) {
      console.warn('⚠️ Paid API failed:', err.message);
      console.log('🔄 Falling back to free APIs...');
    }
  }

  const freeApiProviders = [
    { name: 'MyMemory', fn: translateWithMyMemory, delay: 0 },
    { name: 'Google Translate', fn: translateWithGoogleTranslate, delay: 500 },
    { name: 'LibreTranslate', fn: translateWithLibreTranslate, delay: 500 },
    { name: 'MyMemory Backup', fn: translateWithMyMemoryBackup, delay: 1000 }
  ];

  let lastError = null;
  for (let i = 0; i < freeApiProviders.length; i++) {
    const provider = freeApiProviders[i];
    if (i > 0 && provider.delay > 0) {
      await new Promise(resolve => setTimeout(resolve, provider.delay));
    }
    
    try {
      console.log(`🔄 Trying ${provider.name} (${i + 1}/${freeApiProviders.length})...`);
      const translated = await provider.fn(text);
      
      if (translated && translated.trim()) {
        console.log(`✅ ${provider.name} success`);
        return translated;
      } else {
        throw new Error('Empty translation result');
      }
    } catch (err) {
      const isRateLimit = err.message && (
        err.message.includes('429') || 
        err.message.includes('Too Many Requests') ||
        err.message.includes('rate limit')
      );
      
      if (isRateLimit) {
        console.warn(`⚠️ ${provider.name} rate limited, trying next API...`);
      } else {
        console.warn(`⚠️ ${provider.name} failed: ${err.message}`);
      }
      lastError = err;
      continue;
    }
  }

  console.error('❌ All translation APIs failed');
  throw new Error(`Translation failed. Last error: ${lastError?.message || 'Unknown error'}`);
}
