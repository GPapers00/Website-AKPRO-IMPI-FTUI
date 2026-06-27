// js/main.js
import { initNavigation } from './navigation.js';
import { initExchange } from './exchange.js';
import { initDiktat } from './diktat.js';
import { initSyllabi } from './syllabi.js';
import { initHome } from './home.js';

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initExchange();
  initDiktat();
  initSyllabi();
  initHome();
});
