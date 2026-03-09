const CONTENT_URL = 'content.json';
const DEFAULT_LANG = 'en';

const DEFAULT_LIGHTMODE = 'light';
const LIGHTMODE_CONTENT = {
  "light": {
    "css": {
      "--bg-color": "rgb(242, 242, 242)",
      "--secondary-bg-color": "rgb(230, 230, 230)",
      "--taskbar-bg-color": "rgb(101, 101, 111)",
      "--hero-bg-color": "rgb(250, 250, 250)",
      
      "--primary-text-color": "rgb(0, 0, 0)",
      "--secondary-text-color": "rgb(60, 60, 60)"
    },
    "buttonIcon": "images\\sunicon.svg",
    "buttonalt": "light mode switch (a sun)"
  },

  "dark": {
    "css": {
      "--bg-color": "rgb(38, 38, 38)",
      "--secondary-bg-color": "rgb(46, 46, 46)",
      "--taskbar-bg-color": "rgb(50, 50, 65)",
      "--hero-bg-color": "rgb(32, 32, 32)",

      "--primary-text-color": "rgb(200, 200, 200)",
      "--secondary-text-color": "rgb(160, 160, 160)"
    },
    "buttonIcon": "images\\moonicon.svg",
    "buttonalt": "light mode switch (a moon)"
  }
};

let translations = {}; // hold the parsed JSON translations
let currentLang = DEFAULT_LANG;

let currentLightmode = DEFAULT_LIGHTMODE;

/**
 * setElementContentOrAttributes(el, value)
 * - If value is a string -> set el.innerHTML
 * - If value is a object -> set attributes
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

function toggleLight() {
  currentLightmode = (currentLightmode === 'light') ? 'dark' : 'light';

  Object.keys(LIGHTMODE_CONTENT[currentLightmode]["css"]).forEach((key) => {
  const value = LIGHTMODE_CONTENT[currentLightmode]["css"][key];
  document.documentElement.style.setProperty(key, value);
  });

  document.getElementById("lightIcon").src = LIGHTMODE_CONTENT[currentLightmode]["buttonIcon"]
  document.getElementById("lightIcon").alt = LIGHTMODE_CONTENT[currentLightmode]["buttonalt"]
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

  const lightBtn = document.getElementById('lightSwitcher');
  if (lightBtn) {
    lightBtn.addEventListener('click', toggleLight);
  } else {
    console.warn('Language toggle button not found (id="lightSwitcher").');
  }
}

init();