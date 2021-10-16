export const GHOST_LAYER_STYLE = {
  pointerEvents: 'none' as React.CSSProperties['pointerEvents'],
  position: 'fixed' as React.CSSProperties['position'],
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'transparent',
  opacity: 1,
};
export const GHOST_LAYER_CLEAR_TIMEOUT = 200;
export const DEBOUNCE_TIMEOUT = 100;

export const DEFAULT_DURATION = 200;

export const DEFAULT_ANIMATION_OPTIONS = {
  duration: DEFAULT_DURATION,
  fill: 'forwards',
  easing: 'ease-out',
} as KeyframeAnimationOptions;
