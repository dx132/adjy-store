/**
 * theme.js
 * ADJY Store - Dark/Light Theme Toggle
 *
 * @author ADJY Store
 * @version 2.0
 */

// ============================================
// THEME TOGGLE
// ============================================
function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('adjy_theme', next);
    
    const settingTheme = document.getElementById('settingTheme');
    if (settingTheme) settingTheme.value = next;
}

function applyThemeSetting(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('adjy_theme', theme);
}

// Load saved theme
(function() {
    const savedTheme = localStorage.getItem('adjy_theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
})();