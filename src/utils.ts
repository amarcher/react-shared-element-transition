export function getKeyFrames(first: DOMRect, last: DOMRect): Keyframe[] {
  const verticalTravelDistance = first.top - last.top;
  const horizontalTravelDistance = first.left - last.left;
  const scaleX = first.width / last.width;
  const scaleY = first.height / last.height;
  return [
    {
      transform: `matrix(${scaleX}, 0, 0, ${scaleY}, ${horizontalTravelDistance}, ${verticalTravelDistance})`,
    },
    { transform: 'none' },
  ];
}

export function getNodeForTransition(originalNode: HTMLDivElement, clientRect: DOMRect) {
  const node = originalNode.cloneNode(true) as HTMLDivElement;
  node.classList.add('SharedElement');
  node.style.position = 'fixed';
  node.style.contain = 'strict';
  node.style.willChange = 'transform';
  node.style.animationFillMode = 'both';
  node.style.top = `${clientRect.top}px`;
  node.style.left = `${clientRect.left}px`;
  node.style.height = `${clientRect.height}px`;
  node.style.width = `${clientRect.width}px`;
  node.style.transformOrigin = 'top left';
  return node;
}
