import { resizeFont, debounceResize } from './resize.js';

resizeFont();
window.addEventListener('resize', debounceResize);
