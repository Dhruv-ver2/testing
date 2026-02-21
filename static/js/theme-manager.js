/*
==========================================================================
ADVANCED THEME MANAGER - SIMPLIFIED VERSION
==========================================================================
Handles all theme operations with cache busting and sessionStorage backup
No page hiding to prevent blank page issues
*/

class ThemeManager {
  constructor() {
    this.STORAGE_KEY = 'theme';
    this.SESSION_BACKUP_KEY = 'themeSessionBackup';
    this.DEFAULT_THEME = 'theme-lucid-blue';
    this.AVAILABLE_THEMES = ['theme-lucid-blue', 'theme-metallic-sky'];
    this.VERSION = '2.0';
    
    this.init();
  }

  // Initialize theme on page load
  init() {
    // Apply saved theme immediately (synchronously)
    const theme = this.getTheme();
    this.applyTheme(theme, true); // true = initial load, no transition
  }

  // Get theme from storage with fallback
  getTheme() {
    // Check localStorage first
    const localTheme = localStorage.getItem(this.STORAGE_KEY);
    if (localTheme && this.AVAILABLE_THEMES.includes(localTheme)) {
      // Backup to sessionStorage
      sessionStorage.setItem(this.SESSION_BACKUP_KEY, localTheme);
      return localTheme;
    }

    // Check sessionStorage as backup (useful if localStorage cleared)
    const sessionTheme = sessionStorage.getItem(this.SESSION_BACKUP_KEY);
    if (sessionTheme && this.AVAILABLE_THEMES.includes(sessionTheme)) {
      localStorage.setItem(this.STORAGE_KEY, sessionTheme);
      return sessionTheme;
    }

    // Return default theme
    return this.DEFAULT_THEME;
  }

  // Apply theme to document
  applyTheme(themeName, isInitial = false) {
    // Validate theme
    if (!this.AVAILABLE_THEMES.includes(themeName)) {
      console.warn(`Invalid theme: ${themeName}. Using default.`);
      themeName = this.DEFAULT_THEME;
    }

    // Remove all theme classes from html
    document.documentElement.className = document.documentElement.className
      .split(' ')
      .filter(cls => !cls.startsWith('theme-'))
      .join(' ')
      .trim();

    // Remove all theme classes from body
    document.body.className = document.body.className
      .split(' ')
      .filter(cls => !cls.startsWith('theme-'))
      .join(' ')
      .trim();

    // Add new theme class to both elements
    document.documentElement.classList.add(themeName);
    document.body.classList.add(themeName);

    // Store in both storages for redundancy
    localStorage.setItem(this.STORAGE_KEY, themeName);
    sessionStorage.setItem(this.SESSION_BACKUP_KEY, themeName);

    // Store version
    localStorage.setItem('themeVersion', this.VERSION);

    // Dispatch custom event for other scripts to listen
    window.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: themeName } }));

    // Trigger particle system re-initialization if available
    if (!isInitial && typeof initParticleSystem === 'function') {
      setTimeout(() => initParticleSystem(), 100);
    }
    if (!isInitial && typeof setupAnimation === 'function') {
      setTimeout(() => setupAnimation(), 100);
    }
  }

  // Save theme and apply
  setTheme(themeName) {
    this.applyTheme(themeName, false);
  }

  // Get current theme
  getCurrentTheme() {
    return localStorage.getItem(this.STORAGE_KEY) || this.DEFAULT_THEME;
  }

  // Check if dark theme is active
  isDarkTheme() {
    return this.getCurrentTheme() === 'theme-metallic-sky';
  }

  // Clear all theme data (for debugging)
  clearThemeData() {
    localStorage.removeItem(this.STORAGE_KEY);
    sessionStorage.removeItem(this.SESSION_BACKUP_KEY);
    localStorage.removeItem('themeVersion');
    console.log('Theme data cleared');
  }
}

// Initialize immediately on script load
const themeManager = new ThemeManager();
