"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = __importStar(require("react"));
var useSharedElementContext_1 = __importDefault(require("./useSharedElementContext"));
function SharedElement(_a) {
    var children = _a.children, id = _a.id, pathname = _a.pathname, animationOptions = _a.animationOptions;
    var mountSharedElement = (0, useSharedElementContext_1.default)().mountSharedElement;
    var ref = (0, react_1.useRef)(null);
    (0, react_1.useEffect)(function () {
        var node = ref.current;
        if (!node)
            return;
        var sharedElement = {
            animationOptions: animationOptions,
            ref: node,
            id: id,
        };
        mountSharedElement(sharedElement, pathname);
    }, [id, mountSharedElement, ref, pathname]);
    return react_1.default.createElement("div", { ref: ref }, children);
}
exports.default = SharedElement;
