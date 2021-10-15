"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GHOST_LAYER_MASK_TRANSITIONING_STYLE = exports.GHOST_LAYER_MASK_STYLE = exports.GHOST_LAYER_STYLE = void 0;
exports.GHOST_LAYER_STYLE = {
    pointerEvents: 'none',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    opacity: 1,
    zIndex: 2,
};
exports.GHOST_LAYER_MASK_STYLE = {
    pointerEvents: 'none',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white',
    opacity: 0,
    zIndex: 1,
};
exports.GHOST_LAYER_MASK_TRANSITIONING_STYLE = {
    opacity: 1,
};
