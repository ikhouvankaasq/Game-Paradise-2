import { initSettings } from './settings.js';
import { initUI } from './ui.js';

// entry: wire modules once DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initSettings(); // sets up theme, accent, cookies modal, settings page
    initUI();       // sets up sidebar, collapsible, filtering, game page, fullscreen, etc.
});
