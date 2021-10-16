"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNodeForTransition = exports.getKeyFrames = void 0;
function getKeyFrames(first, last) {
    var verticalTravelDistance = first.top - last.top;
    var horizontalTravelDistance = first.left - last.left;
    var scaleX = first.width / last.width;
    var scaleY = first.height / last.height;
    return [
        {
            transform: "matrix(" + scaleX + ", 0, 0, " + scaleY + ", " + horizontalTravelDistance + ", " + verticalTravelDistance + ")",
        },
        { transform: 'none' },
    ];
}
exports.getKeyFrames = getKeyFrames;
function getNodeForTransition(originalNode, clientRect) {
    var node = originalNode.cloneNode(true);
    node.classList.add('SharedElement');
    node.style.position = 'fixed';
    node.style.contain = 'strict';
    node.style.willChange = 'transform';
    node.style.animationFillMode = 'both';
    node.style.top = clientRect.top + "px";
    node.style.left = clientRect.left + "px";
    node.style.height = clientRect.height + "px";
    node.style.width = clientRect.width + "px";
    node.style.transformOrigin = 'top left';
    return node;
}
exports.getNodeForTransition = getNodeForTransition;
