import { initUI } from './modules/ui.js';
import { initCoffeeMenu } from './modules/catalog.js';
import { initModal } from './modules/modal.js';
import { initForms } from './modules/forms.js';

// ==========================================================
// LA FILOMENA — Main Bootstrapper
// ==========================================================

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize User Interface rules (navbars, reveals, scrolling logs)
  initUI();
  
  // 2. Initialize Coffee Menu / Catalog logic
  initCoffeeMenu();
  
  // 3. Initialize Shared Modal Logic
  initModal();
  
  // 4. Initialize Forms
  initForms();
});