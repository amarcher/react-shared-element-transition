"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SharedElementContext = void 0;
var react_1 = __importStar(require("react"));
var constants_1 = require("./constants");
var utils_1 = require("./utils");
exports.SharedElementContext = react_1.default.createContext({
    mountSharedElement: function () { },
    isTransitioning: false,
    activePathname: undefined,
});
function isSharedElementToTransition(sharedElement) {
    return !!(sharedElement.firstBoundingClientRect &&
        sharedElement.lastBoundingClientRect &&
        sharedElement.node &&
        typeof sharedElement.id !== 'undefined');
}
function ShareElementContextProvider(_a) {
    var _this = this;
    var children = _a.children, pathname = _a.pathname;
    // Only require the polyfill on the client. If loaded on the server, a "document is not defined" error is thrown.
    (0, react_1.useEffect)(function () {
        require('web-animations-js');
    }, []);
    var ghostLayerRef = (0, react_1.useRef)(null);
    var prevPathname = (0, react_1.useRef)(pathname);
    var timeout = (0, react_1.useRef)();
    var _b = (0, react_1.useState)(false), isTransitioning = _b[0], setIsTransitioning = _b[1];
    var _c = (0, react_1.useState)({}), sharedElements = _c[0], setSharedElements = _c[1];
    var clearGhostLayer = (0, react_1.useCallback)(function () {
        if (!ghostLayerRef.current)
            return;
        while (ghostLayerRef.current.firstChild) {
            ghostLayerRef.current.removeChild(ghostLayerRef.current.firstChild);
        }
        ghostLayerRef.current.style.pointerEvents = 'none';
    }, [ghostLayerRef]);
    var updateSharedElement = (0, react_1.useCallback)(function (_a, lastSeenAtPathname) {
        var id = _a.id, ref = _a.ref, providedAnimationOptions = _a.animationOptions, _b = _a.getNode, getNode = _b === void 0 ? utils_1.getNode : _b, _c = _a.getKeyframes, getKeyframes = _c === void 0 ? utils_1.getKeyframes : _c;
        var animationOptions = __assign(__assign({}, constants_1.DEFAULT_ANIMATION_OPTIONS), providedAnimationOptions);
        setSharedElements(function (prevSharedElements) {
            var _a;
            var lastBoundingClientRect = ref.getBoundingClientRect();
            var getNodeInput = {
                firstNode: prevSharedElements[id].node.cloneNode(true),
                lastNode: ref.cloneNode(true),
                firstBoundingClientRect: prevSharedElements[id].firstBoundingClientRect,
                lastBoundingClientRect: lastBoundingClientRect,
                animationOptions: animationOptions,
            };
            var node = getNode(getNodeInput);
            var animation = node.animate(getKeyframes({
                firstBoundingClientRect: prevSharedElements[id].firstBoundingClientRect,
                lastBoundingClientRect: lastBoundingClientRect,
            }), animationOptions);
            if (ghostLayerRef.current) {
                ghostLayerRef.current.appendChild(node);
                ghostLayerRef.current.style.pointerEvents = 'all';
            }
            var element = __assign(__assign({}, prevSharedElements[id]), { lastBoundingClientRect: lastBoundingClientRect, node: node, animation: animation, lastSeenAtPathname: lastSeenAtPathname });
            return __assign(__assign({}, prevSharedElements), (_a = {}, _a[id] = element, _a));
        });
    }, []);
    var addSharedElement = (0, react_1.useCallback)(function (_a, lastSeenAtPathname) {
        var id = _a.id, ref = _a.ref;
        return setSharedElements(function (prevSharedElements) {
            var _a;
            return __assign(__assign({}, prevSharedElements), (_a = {}, _a[id] = {
                lastSeenAtPathname: lastSeenAtPathname,
                firstBoundingClientRect: ref.getBoundingClientRect(),
                node: ref,
                id: id,
            }, _a));
        });
    }, []);
    // Recalculate the bounding boxes of all shared elements on resize or scroll
    var onResizeOrScroll = (0, react_1.useCallback)(function () {
        setSharedElements(function (prevSharedElements) {
            return Object.keys(prevSharedElements).reduce(function (sharedElements, id) {
                var _a;
                sharedElements[id] = __assign(__assign({}, prevSharedElements[id]), { firstBoundingClientRect: ((_a = prevSharedElements[id].node) === null || _a === void 0 ? void 0 : _a.getBoundingClientRect()) || prevSharedElements[id].firstBoundingClientRect });
                return sharedElements;
            }, {});
        });
    }, []);
    var debouncedOnResizeOrScroll = (0, react_1.useCallback)(function () {
        if (timeout.current)
            clearTimeout(timeout.current);
        timeout.current = setTimeout(onResizeOrScroll, constants_1.DEBOUNCE_TIMEOUT);
    }, [onResizeOrScroll]);
    (0, react_1.useEffect)(function () {
        window.addEventListener('resize', debouncedOnResizeOrScroll);
        document.addEventListener('scroll', debouncedOnResizeOrScroll);
        return function () {
            window.removeEventListener('resize', debouncedOnResizeOrScroll);
            document.addEventListener('scroll', debouncedOnResizeOrScroll);
        };
    }, [debouncedOnResizeOrScroll]);
    var endTransition = (0, react_1.useCallback)(function () {
        setSharedElements({});
        setIsTransitioning(false);
        setTimeout(clearGhostLayer, constants_1.GHOST_LAYER_CLEAR_TIMEOUT);
    }, [clearGhostLayer]);
    var maybeTransition = (0, react_1.useCallback)(function () { return __awaiter(_this, void 0, void 0, function () {
        var sharedElementsToTransition;
        return __generator(this, function (_a) {
            sharedElementsToTransition = Object.values(sharedElements).filter(isSharedElementToTransition);
            if (sharedElementsToTransition.length) {
                return [2 /*return*/, Promise.all(sharedElementsToTransition.map(function (_a) {
                        var animation = _a.animation;
                        return animation.finished;
                    })).finally(endTransition)];
            }
            setIsTransitioning(false);
            return [2 /*return*/, Promise.resolve().then(function () { return setIsTransitioning(false); })];
        });
    }); }, [endTransition, sharedElements]);
    /*
     * Transition now that the setState stack is clear
     */
    (0, react_1.useEffect)(function () {
        if (!isTransitioning && pathname !== prevPathname.current) {
            maybeTransition().then(function () {
                prevPathname.current = pathname;
            });
        }
    }, [pathname, isTransitioning, maybeTransition]);
    var mountSharedElement = (0, react_1.useCallback)(function (sharedElement, pathnameOfSharedElement) {
        var _a;
        if (!sharedElements[sharedElement.id]) {
            addSharedElement(sharedElement, pathnameOfSharedElement);
        }
        else if (((_a = sharedElements[sharedElement.id]) === null || _a === void 0 ? void 0 : _a.lastSeenAtPathname) !== pathnameOfSharedElement) {
            updateSharedElement(sharedElement, pathnameOfSharedElement);
            setIsTransitioning(true);
        }
    }, [addSharedElement, updateSharedElement, sharedElements]);
    return (react_1.default.createElement(exports.SharedElementContext.Provider, { value: {
            mountSharedElement: mountSharedElement,
            isTransitioning: isTransitioning,
            activePathname: prevPathname.current,
        } },
        react_1.default.createElement(react_1.default.Fragment, null,
            children,
            react_1.default.createElement("div", { className: "GhostLayer", style: constants_1.GHOST_LAYER_STYLE, ref: ghostLayerRef }))));
}
exports.default = ShareElementContextProvider;
