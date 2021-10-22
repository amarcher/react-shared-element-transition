import type { GetNodeInput, GetKeyframesInput } from './types';

function getDeltaFromRects({ firstBoundingClientRect: first, lastBoundingClientRect: last }: GetKeyframesInput) {
  return {
    verticalTravelDistance: first.top + first.height / 2 - last.top - last.height / 2,
    horizontalTravelDistance: first.left + first.width / 2 - last.left - last.width / 2,
    scaleX: first.width / last.width,
    scaleY: first.height / last.height,
  };
}

export function getKeyframes(rects: GetKeyframesInput): Keyframe[] {
  const { verticalTravelDistance, horizontalTravelDistance, scaleX, scaleY } = getDeltaFromRects(rects);
  return [
    {
      transform: `matrix(${scaleX}, 0, 0, ${scaleY}, ${horizontalTravelDistance}, ${verticalTravelDistance})`,
    },
    { transform: 'none' },
  ];
}

export function getFlipKeyframes(rects: GetKeyframesInput): Keyframe[] {
  const { verticalTravelDistance, horizontalTravelDistance, scaleX, scaleY } = getDeltaFromRects(rects);
  return [
    {
      transform: `matrix3d(${-scaleX},0,0.00,0,0.00,${scaleY},0.00,0,0,0,-1,0,${horizontalTravelDistance},${verticalTravelDistance},0,1)`,
    },
    { transform: 'none' },
  ];
}

export function getNode({
  lastNode,
  lastBoundingClientRect,
}: Partial<GetNodeInput> & { lastNode: HTMLDivElement; lastBoundingClientRect: DOMRect }) {
  const node = lastNode.cloneNode(true) as HTMLDivElement;
  node.classList.add('SharedElement');
  node.style.position = 'fixed';
  node.style.setProperty('contain', 'strict');
  node.style.willChange = 'transform';
  node.style.top = `${lastBoundingClientRect.top}px`;
  node.style.left = `${lastBoundingClientRect.left}px`;
  node.style.height = `${lastBoundingClientRect.height}px`;
  node.style.width = `${lastBoundingClientRect.width}px`;
  node.style.transformOrigin = 'center center';
  return node;
}

export function getFlipNode({
  firstNode,
  lastNode: lastFace,
  firstBoundingClientRect,
  lastBoundingClientRect,
}: GetNodeInput): HTMLDivElement {
  const container = getNode({ lastNode: document.createElement('DIV') as HTMLDivElement, lastBoundingClientRect });
  const firstFace = document.createElement('DIV');
  firstNode.style.transform = 'scaleX(-1)';
  firstFace.appendChild(firstNode);

  container.style.backgroundColor = 'transparent';
  container.style.perspective = '300px';
  container.style.perspectiveOrigin = 'center';
  container.style.transformStyle = 'preserve-3d';

  [firstFace, lastFace].forEach((face) => {
    face.style.backfaceVisibility = 'hidden';
    face.style.position = 'absolute';
    face.style.top = '0';
    face.style.left = '0';
  });

  const scaleX = lastBoundingClientRect.width / firstBoundingClientRect.width;
  const scaleY = lastBoundingClientRect.height / firstBoundingClientRect.height;

  lastFace.style.width = '100%';
  lastFace.style.height = '100%';

  firstFace.style.width = `${100 / scaleX}%`;
  firstFace.style.height = `${100 / scaleY}%`;
  firstFace.style.transformOrigin = 'top left';
  firstFace.style.transform = `rotateY(180deg) scaleX(${-scaleX}) scaleY(${scaleY})`;

  container.appendChild(firstFace);
  container.appendChild(lastFace);
  return container as HTMLDivElement;
}

export function getCrossfadeNode({
  firstNode,
  lastNode,
  firstBoundingClientRect,
  lastBoundingClientRect,
  animationOptions,
}: GetNodeInput): HTMLDivElement {
  const container = getNode({ lastNode: document.createElement('DIV') as HTMLDivElement, lastBoundingClientRect });
  container.style.backgroundColor = 'transparent';

  [firstNode, lastNode].forEach((face) => {
    face.style.position = 'absolute';
    face.style.top = '0';
    face.style.left = '0';
  });

  const scaleX = lastBoundingClientRect.width / firstBoundingClientRect.width;
  const scaleY = lastBoundingClientRect.height / firstBoundingClientRect.height;

  lastNode.style.width = '100%';
  lastNode.style.height = '100%';

  firstNode.style.width = `${100 / scaleX}%`;
  firstNode.style.height = `${100 / scaleY}%`;
  firstNode.style.transformOrigin = 'top left';
  firstNode.style.transform = `scaleX(${scaleX}) scaleY(${scaleY})`;

  container.appendChild(firstNode);
  container.appendChild(lastNode);
  const firstNodeKeyframes = [
    {
      opacity: 1,
    },
    {
      opacity: 0,
    },
  ];

  firstNode.animate(firstNodeKeyframes, animationOptions);
  lastNode.animate(firstNodeKeyframes.reverse(), animationOptions);

  return container as HTMLDivElement;
}
