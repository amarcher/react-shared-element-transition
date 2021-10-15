"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var SharedElementContextProvider_1 = require("./SharedElementContextProvider");
function useSharedElementContext() {
    return (0, react_1.useContext)(SharedElementContextProvider_1.SharedElementContext);
}
exports.default = useSharedElementContext;
