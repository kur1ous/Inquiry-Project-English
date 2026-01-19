/* ============================================
   STORAGE.JS — localStorage Read/Write Helpers
   ============================================ */

const STORAGE_PREFIX = 'conscience_inquiry_';

/**
 * Save a value to localStorage with the app prefix
 * @param {string} key - The key to store under
 * @param {any} value - The value to store (will be JSON stringified)
 */
function saveToStorage(key, value) {
  try {
    const prefixedKey = STORAGE_PREFIX + key;
    const serialized = JSON.stringify(value);
    localStorage.setItem(prefixedKey, serialized);
    return true;
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
    return false;
  }
}

/**
 * Load a value from localStorage
 * @param {string} key - The key to retrieve
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {any} The stored value or defaultValue
 */
function loadFromStorage(key, defaultValue = null) {
  try {
    const prefixedKey = STORAGE_PREFIX + key;
    const serialized = localStorage.getItem(prefixedKey);
    if (serialized === null) {
      return defaultValue;
    }
    return JSON.parse(serialized);
  } catch (e) {
    console.warn('Failed to load from localStorage:', e);
    return defaultValue;
  }
}

/**
 * Remove a value from localStorage
 * @param {string} key - The key to remove
 */
function removeFromStorage(key) {
  try {
    const prefixedKey = STORAGE_PREFIX + key;
    localStorage.removeItem(prefixedKey);
    return true;
  } catch (e) {
    console.warn('Failed to remove from localStorage:', e);
    return false;
  }
}

/**
 * Clear all app-related storage
 */
function clearAllStorage() {
  try {
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    return true;
  } catch (e) {
    console.warn('Failed to clear localStorage:', e);
    return false;
  }
}

/**
 * Get all stored user responses
 * @returns {Object} Object containing all user responses
 */
function getAllResponses() {
  return {
    initialSlider: loadFromStorage('initial_slider', 50),
    initialReason: loadFromStorage('initial_reason', ''),
    biologyReflection: loadFromStorage('biology_reflection', ''),
    infantsReflection: loadFromStorage('infants_reflection', ''),
    traumaReflection: loadFromStorage('trauma_reflection', ''),
    familyReflection: loadFromStorage('family_reflection', ''),
    starvationReflection: loadFromStorage('starvation_reflection', ''),
    philosophyReflection: loadFromStorage('philosophy_reflection', ''),
    synthesisStatement: loadFromStorage('synthesis_statement', ''),
    finalSlider: loadFromStorage('final_slider', null),
    completedPages: loadFromStorage('completed_pages', [])
  };
}

/**
 * Mark a page as completed
 * @param {string} pageName - The name of the completed page
 */
function markPageCompleted(pageName) {
  const completed = loadFromStorage('completed_pages', []);
  if (!completed.includes(pageName)) {
    completed.push(pageName);
    saveToStorage('completed_pages', completed);
  }
}

/**
 * Check if a page has been completed
 * @param {string} pageName - The name of the page to check
 * @returns {boolean}
 */
function isPageCompleted(pageName) {
  const completed = loadFromStorage('completed_pages', []);
  return completed.includes(pageName);
}

/**
 * Calculate progress percentage
 * @returns {number} Progress from 0-100
 */
function getProgressPercentage() {
  const allPages = [
    'index',
    'biology',
    'infants',
    'trauma',
    'family',
    'starvation',
    'philosophy',
    'synthesis'
  ];
  const completed = loadFromStorage('completed_pages', []);
  const completedCount = allPages.filter(p => completed.includes(p)).length;
  return Math.round((completedCount / allPages.length) * 100);
}
