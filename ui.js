// ui.js now composes smaller modules and exports a single initUI
import { initSidebar } from './ui/sidebar.js';
import { initGames } from './ui/games.js';

export function initUI() {
    initSidebar();
    initGames();
}
