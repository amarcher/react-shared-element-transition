"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_ANIMATION_OPTIONS = exports.DEFAULT_DURATION = exports.DEBOUNCE_TIMEOUT = exports.GHOST_LAYER_CLEAR_TIMEOUT = exports.GHOST_LAYER_STYLE = void 0;
exports.GHOST_LAYER_STYLE = {
    pointerEvents: 'none',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    opacity: 1,
};
exports.GHOST_LAYER_CLEAR_TIMEOUT = 200;
exports.DEBOUNCE_TIMEOUT = 100;
exports.DEFAULT_DURATION = 200;
exports.DEFAULT_ANIMATION_OPTIONS = {
    duration: exports.DEFAULT_DURATION,
    fill: 'forwards',
    easing: 'ease-out',
};
