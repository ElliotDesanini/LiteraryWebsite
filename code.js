const CONTENT_URL = 'content.json';
const DEFAULT_LANG = 'en';

let translations = {}; // will hold the parsed JSON translations
let currentLang = DEFAULT_LANG;

/**
 * setElementContentOrAttributes(el, value)
 * - If value is a string -> set el.innerHTML (inserts HTML content)
 * - If value is an object -> set attributes and/or inner HTML depending on keys
 */

function setElementContentOrAttributes(el, value) {
  if (!el) return; // safety

  if (typeof value === 'string') {
    el.innerHTML = value;
    return;
  }

  if (typeof value === 'object' && value !== null) {

    // text
    if ('text' in value) {
      el.innerHTML = value.text;
    }

    // attributes
    if ('placeholder' in value && 'placeholder' in el) {
      el.placeholder = value.placeholder;
    }
    if ('src' in value && 'src' in el) {
      el.src = value.src;
    }
    if ('title' in value) {
      el.title = value.title;
    }
    if ('alt' in value && 'alt' in el) {
      el.alt = value.alt;
    }
    if ('class' in value) {
      el.className = value.class;
    }
    
  }
}

/**
 * applyTranslations(lang)
 * - reads translations[lang] and applies each entry to the element with the same id
 */
function applyTranslations(lang) {
  const languagePack = translations[lang];
  if (!languagePack) {
    console.warn('No translations available for', lang);
    return;
  }

  Object.keys(languagePack).forEach(key => {
    const el = document.getElementById(key);
    const value = languagePack[key];

    if (el) {
      setElementContentOrAttributes(el, value);
    } else {
      // debugging
      console.warn(`No element found with id="${key}" to apply translation.`);
    }
  });

  document.documentElement.lang = lang;
}

/**
 * toggleLanguage()
 * - switches between 'en' and 'sv'
 * - updates currentLang and reapplies translations
 */
function toggleLanguage() {
  currentLang = (currentLang === 'en') ? 'sv' : 'en';
  applyTranslations(currentLang);
}

/**
 * init()
 * - loads the JSON, chooses an initial language, applies translations,
 *   and wires the toggle button.
 */

async function init() {
  // Fetch the JSON file containing translations
  try {
    const resp = await fetch(CONTENT_URL);
    if (!resp.ok) {
      throw new Error('Failed to fetch translations: ' + resp.status);
    }
    translations = await resp.json();
  } catch (err) {
    console.error('Error loading translations:', err);
    return;
  }

  // Choose initial language.
  currentLang = DEFAULT_LANG;

  // Apply translations and wire the toggle button
  applyTranslations(currentLang);

  const toggleBtn = document.getElementById('langSwitcher');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', toggleLanguage);
  } else {
    console.warn('Language toggle button not found (id="langSwitcher").');
  }
}

init();