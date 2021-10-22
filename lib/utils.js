"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCrossfadeNode = exports.getFlipNode = exports.getNode = exports.getFlipKeyframes = exports.getKeyframes = void 0;
function getDeltaFromRects(_a) {
    var first = _a.firstBoundingClientRect, last = _a.lastBoundingClientRect;
    return {
        verticalTravelDistance: first.top + first.height / 2 - last.top - last.height / 2,
        horizontalTravelDistance: first.left + first.width / 2 - last.left - last.width / 2,
        scaleX: first.width / last.width,
        scaleY: first.height / last.height,
    };
}
function getKeyframes(rects) {
    var _a = getDeltaFromRects(rects), verticalTravelDistance = _a.verticalTravelDistance, horizontalTravelDistance = _a.horizontalTravelDistance, scaleX = _a.scaleX, scaleY = _a.scaleY;
    return [
        {
            transform: "matrix(" + scaleX + ", 0, 0, " + scaleY + ", " + horizontalTravelDistance + ", " + verticalTravelDistance + ")",
        },
        { transform: 'none' },
    ];
}
exports.getKeyframes = getKeyframes;
function getFlipKeyframes(rects) {
    var _a = getDeltaFromRects(rects), verticalTravelDistance = _a.verticalTravelDistance, horizontalTravelDistance = _a.horizontalTravelDistance, scaleX = _a.scaleX, scaleY = _a.scaleY;
    return [
        {
            transform: "matrix3d(" + -scaleX + ",0,0.00,0,0.00," + scaleY + ",0.00,0,0,0,-1,0," + horizontalTravelDistance + "," + verticalTravelDistance + ",0,1)",
        },
        { transform: 'none' },
    ];
}
exports.getFlipKeyframes = getFlipKeyframes;
function getNode(_a) {
    var lastNode = _a.lastNode, lastBoundingClientRect = _a.lastBoundingClientRect;
    var node = lastNode.cloneNode(true);
    node.classList.add('SharedElement');
    node.style.position = 'fixed';
    node.style.setProperty('contain', 'strict');
    node.style.willChange = 'transform';
    node.style.top = lastBoundingClientRect.top + "px";
    node.style.left = lastBoundingClientRect.left + "px";
    node.style.height = lastBoundingClientRect.height + "px";
    node.style.width = lastBoundingClientRect.width + "px";
    node.style.transformOrigin = 'center center';
    return node;
}
exports.getNode = getNode;
function getFlipNode(_a) {
    var firstNode = _a.firstNode, lastFace = _a.lastNode, firstBoundingClientRect = _a.firstBoundingClientRect, lastBoundingClientRect = _a.lastBoundingClientRect;
    var container = getNode({ lastNode: document.createElement('DIV'), lastBoundingClientRect: lastBoundingClientRect });
    var firstFace = document.createElement('DIV');
    firstNode.style.transform = 'scaleX(-1)';
    firstFace.appendChild(firstNode);
    container.style.backgroundColor = 'transparent';
    container.style.perspective = '300px';
    container.style.perspectiveOrigin = 'center';
    container.style.transformStyle = 'preserve-3d';
    [firstFace, lastFace].forEach(function (face) {
        face.style.backfaceVisibility = 'hidden';
        face.style.position = 'absolute';
        face.style.top = '0';
        face.style.left = '0';
    });
    var scaleX = lastBoundingClientRect.width / firstBoundingClientRect.width;
    var scaleY = lastBoundingClientRect.height / firstBoundingClientRect.height;
    lastFace.style.width = '100%';
    lastFace.style.height = '100%';
    firstFace.style.width = 100 / scaleX + "%";
    firstFace.style.height = 100 / scaleY + "%";
    firstFace.style.transformOrigin = 'top left';
    firstFace.style.transform = "rotateY(180deg) scaleX(" + -scaleX + ") scaleY(" + scaleY + ")";
    container.appendChild(firstFace);
    container.appendChild(lastFace);
    return container;
}
exports.getFlipNode = getFlipNode;
function getCrossfadeNode(_a) {
    var firstNode = _a.firstNode, lastNode = _a.lastNode, firstBoundingClientRect = _a.firstBoundingClientRect, lastBoundingClientRect = _a.lastBoundingClientRect, animationOptions = _a.animationOptions;
    var container = getNode({ lastNode: document.createElement('DIV'), lastBoundingClientRect: lastBoundingClientRect });
    container.style.backgroundColor = 'transparent';
    [firstNode, lastNode].forEach(function (face) {
        face.style.position = 'absolute';
        face.style.top = '0';
        face.style.left = '0';
    });
    var scaleX = lastBoundingClientRect.width / firstBoundingClientRect.width;
    var scaleY = lastBoundingClientRect.height / firstBoundingClientRect.height;
    lastNode.style.width = '100%';
    lastNode.style.height = '100%';
    firstNode.style.width = 100 / scaleX + "%";
    firstNode.style.height = 100 / scaleY + "%";
    firstNode.style.transformOrigin = 'top left';
    firstNode.style.transform = "scaleX(" + scaleX + ") scaleY(" + scaleY + ")";
    container.appendChild(firstNode);
    container.appendChild(lastNode);
    var firstNodeKeyframes = [
        {
            opacity: 1,
        },
        {
            opacity: 0,
        },
    ];
    firstNode.animate(firstNodeKeyframes, animationOptions);
    lastNode.animate(firstNodeKeyframes.reverse(), animationOptions);
    return container;
}
exports.getCrossfadeNode = getCrossfadeNode;
