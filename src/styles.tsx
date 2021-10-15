export const GHOST_LAYER_STYLE = {
  pointerEvents: 'none' as React.CSSProperties['pointerEvents'],
  position: 'fixed' as React.CSSProperties['position'],
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'transparent',
  opacity: 1,
  zIndex: 2,
};

export const GHOST_LAYER_MASK_STYLE = {
  pointerEvents: 'none' as React.CSSProperties['pointerEvents'],
  position: 'fixed' as React.CSSProperties['position'],
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'white',
  opacity: 0,
  zIndex: 1,
};

export const GHOST_LAYER_MASK_TRANSITIONING_STYLE = {
  opacity: 1,
};
