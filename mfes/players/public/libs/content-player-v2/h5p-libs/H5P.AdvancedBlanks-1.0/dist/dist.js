/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/dist/cjs.js!./src/styles/style.css":
/*!**************************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/dist/cjs.js!./src/styles/style.css ***!
  \**************************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, ".h5p-advanced-blanks {\n    position: relative;\n}\n\n\n/* Text */\n\n.h5p-advanced-blanks #h5p-cloze-container p,\n.h5p-advanced-blanks #h5p-cloze-container div {\n    line-height: 1.8em;\n    margin: 0 0 1em;\n    text-align: justify;\n}\n\n@media only screen and (min-width: 480px) {\n    .h5p-advanced-blanks #h5p-cloze-container p,\n    .h5p-advanced-blanks #h5p-cloze-container div {\n        text-align: unset;\n    }\n}\n\n\n/* Input */\n\n.h5p-advanced-blanks .h5p-input-wrapper {\n    display: inline-block;\n    position: relative;\n}\n\n.h5p-advanced-blanks .blank .h5p-text-input {\n    font-family: H5PDroidSans, sans-serif;\n    font-size: 1em;\n    border-radius: 0.25em;\n    border: 1px solid #a0a0a0;\n    padding: 0.1875em 1.5em 0.1875em 0.5em;\n    text-overflow: ellipsis;\n    overflow: hidden;\n}\n\n.h5p-advanced-blanks .blank input.h5p-text-input {\n  max-width: calc(100vw - 64px);\n}\n\n.h5p-advanced-blanks .blank select.h5p-text-input {\n  max-width: calc(100vw - 36px);\n}\n\n/* IE + Chrome specific fixes */\n\n.h5p-text-input::-ms-clear {\n    display: none;\n}\n\n:not(.correct).blank.has-tip button {\n    cursor: pointer;\n}\n\n\n/* Select mode */\n\nselect.h5p-text-input {\n    appearance: button;\n    -moz-appearance: none;\n    -webkit-appearance: button;\n}\n\n\n/* Showing solution input */\n\n.h5p-advanced-blanks .blank.showing-solution .h5p-text-input {\n    border: 1px dashed #9dd8bb;\n    color: #255c41;\n    background: #FFFFFF;\n}\n\n\n/* Focussed input */\n\n.h5p-advanced-blanks .blank .h5p-text-input:focus {\n    outline: none;\n    box-shadow: 0 0 0.5em 0 #7fb8ff;\n    border-color: #7fb8ff;\n}\n\n\n/* Correctly answered input */\n\n.h5p-advanced-blanks .blank.correct .h5p-text-input {\n    background: #9dd8bb;\n    border: 1px solid #9dd8bb;\n    color: #255c41;\n}\n\n.h5p-advanced-blanks .blank.correct .h5p-input-wrapper:after {\n    position: absolute;\n    right: 0.5em;    \n    top: 50%;\n    transform: translateY(-50%);\n    text-decoration: none;\n    content: \"\\f00c\";\n    font-family: 'H5PFontAwesome4';\n    color: #255c41;\n}\n\n\n/* Incorrect answers */\n\n.h5p-advanced-blanks .blank.error .h5p-text-input {\n    background-color: #f7d0d0;\n    border: 1px solid #f7d0d0;\n    color: #b71c1c;\n    text-decoration: line-through;\n}\n\n.h5p-advanced-blanks .blank.error .h5p-input-wrapper:after {\n    position: absolute;\n    right: 0.5em;\n    top: 50%;\n    transform: translateY(-50%);\n    font-family: 'H5PFontAwesome4';\n    text-decoration: none;\n    content: \"\\f00d\";\n    color: #b71c1c;\n}\n\n\n/* Spelling errors */\n\n.h5p-advanced-blanks .blank.retry .h5p-text-input {\n    background-color: #ffff99;\n    border: 1px solid #ffff99;\n    color: black;\n}\n\n.h5p-advanced-blanks .blank.retry .h5p-input-wrapper:after {\n    position: absolute;\n    right: 0.5em;\n    top: 50%;\n    transform: translateY(-50%);\n    font-family: 'H5PFontAwesome4';\n    text-decoration: none;\n    content: \"\\f00d\";\n    color: #b71c1c;\n}\n\n\n/* Buttons */\n\n.h5p-advanced-blanks .blank button {\n    padding-left: 5px;\n    padding-right: 5px;\n    border: none;\n    background: none;\n}\n\n\n/* Highlight in spelling mistake marker */\n\n.spelling-mistake .missing-character,\n.spelling-mistake .mistaken-character {\n    color: red;\n    font-weight: bold;\n    -webkit-animation-duration: 500ms;\n            animation-duration: 500ms;\n    -webkit-animation-name: blink-color;\n            animation-name: blink-color;\n    -webkit-animation-iteration-count: 13;\n            animation-iteration-count: 13;\n    -webkit-animation-direction: alternate;\n            animation-direction: alternate;\n}\n\n@-webkit-keyframes blink-color {\n    from {\n        color: initial;\n    }\n    to {\n        color: red;\n    }\n}\n\n@keyframes blink-color {\n    from {\n        color: initial;\n    }\n    to {\n        color: red;\n    }\n}\n\n.spelling-mistake .mistaken-character {\n    text-decoration: line-through;\n}\n\n\n/* Highlights in text */\n\n.h5p-advanced-blanks .highlighted {\n    background-color: rgba(255, 0, 0, 0.2);\n    padding: 0.4em;\n    margin: -0.4em;\n    -webkit-animation-duration: 1000ms;\n            animation-duration: 1000ms;\n    -webkit-animation-name: blink-background-color;\n            animation-name: blink-background-color;\n    -webkit-animation-iteration-count: 3;\n            animation-iteration-count: 3;\n    -webkit-animation-direction: alternate;\n            animation-direction: alternate;\n}\n\n@-webkit-keyframes blink-background-color {\n    from {\n        background-color: initial;\n    }\n    to {\n        background-color: rgba(255, 0, 0, 0.2);\n    }\n}\n\n@keyframes blink-background-color {\n    from {\n        background-color: initial;\n    }\n    to {\n        background-color: rgba(255, 0, 0, 0.2);\n    }\n}\n\n\n/* Others */\n\n.h5p-advanced-blanks .invisible {\n    visibility: collapse;\n}\n\n\n/* Tips */\n\n.h5p-advanced-blanks .h5p-tip-container {\n  position: absolute;\n  top: 50%;\n  transform: translateY(-50%);\n  right: 0.4em;\n  font-size: 1em;\n}\n\n.h5p-advanced-blanks .blank.has-tip:not(.correct):not(.error):not(.retry) .h5p-text-input {\n    padding-right: 2.25em;\n}\n\n.h5p-advanced-blanks .blank.has-tip.correct .h5p-input-wrapper:after,\n.h5p-advanced-blanks .blank.has-tip.error .h5p-input-wrapper:after,\n.h5p-advanced-blanks .blank.has-tip.retry .h5p-input-wrapper:after {\n    right: 2.25em;\n}\n\n.h5p-advanced-blanks .blank.correct.has-tip .h5p-text-input,\n.h5p-advanced-blanks .blank.error.has-tip .h5p-text-input,\n.h5p-advanced-blanks .blank.retry.has-tip .h5p-text-input {\n    padding-right: 3.5em;\n}\n\n/* improves appearance of h5p tip shadows */\n.h5p-advanced-blanks .joubel-icon-tip-normal .h5p-icon-shadow:before {\n  color: black;\n  opacity: 0.13;\n}\n\n/* pending feedback marker */\n\n.h5p-advanced-blanks .h5p-advanced-blanks-select-mode .blank:not(.has-pending-feedback) button.h5p-notification {\n    display: none;\n}\n\n.h5p-advanced-blanks .h5p-advanced-blanks-select-mode .blank.has-pending-feedback button.h5p-notification {\n    font-size: large;    \n}\n\n.h5p-advanced-blanks .h5p-advanced-blanks-select-mode .blank.has-pending-feedback button.h5p-notification,\n.h5p-advanced-blanks .h5p-advanced-blanks-type-mode .blank.has-pending-feedback .h5p-input-wrapper:before {\n    font-family: 'H5PFontAwesome4';\n    text-decoration: none;\n    animation: shake 3s cubic-bezier(.36, .07, .19, .97) reverse;\n    -webkit-animation-iteration-count: 2;\n            animation-iteration-count: 2;\n    transform: translate3d(0, 0, 0);\n    -webkit-backface-visibility: hidden;\n            backface-visibility: hidden;\n    perspective: 1000px;\n}\n\n.h5p-advanced-blanks .h5p-advanced-blanks-type-mode .blank.has-pending-feedback .h5p-input-wrapper:before {\n    position: absolute;\n    left: -0.4em;\n    top: -0.7em;\n    content: \"\\f05a\";\n}\n\n.h5p-advanced-blanks .h5p-advanced-blanks-select-mode .blank.error.has-pending-feedback button.h5p-notification,\n.h5p-advanced-blanks .h5p-advanced-blanks-type-mode .blank.error.has-pending-feedback .h5p-input-wrapper:before {\n    color: #b71c1c;\n}\n\n.h5p-advanced-blanks .h5p-advanced-blanks-select-mode .blank.retry.has-pending-feedback button.h5p-notification,\n.h5p-advanced-blanks .h5p-advanced-blanks-type-mode .blank.retry.has-pending-feedback .h5p-input-wrapper:before {\n    color: #ffff00;\n    text-shadow: 0px 0px 0.5em black;\n}\n\n@-webkit-keyframes shake {\n    2%,\n    20% {\n        transform: translate3d(-0.5px, 0, 0);\n    }\n    4%,\n    17% {\n        transform: translate3d(1px, 0, 0);\n    }\n    6%,\n    10%,\n    15% {\n        transform: translate3d(-2px, 0, 0);\n    }\n    9%,\n    13% {\n        transform: translate3d(2px, 0, 0);\n    }\n}\n\n@keyframes shake {\n    2%,\n    20% {\n        transform: translate3d(-0.5px, 0, 0);\n    }\n    4%,\n    17% {\n        transform: translate3d(1px, 0, 0);\n    }\n    6%,\n    10%,\n    15% {\n        transform: translate3d(-2px, 0, 0);\n    }\n    9%,\n    13% {\n        transform: translate3d(2px, 0, 0);\n    }\n}", "",{"version":3,"sources":["webpack://./src/styles/style.css"],"names":[],"mappings":"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","sourcesContent":[".h5p-advanced-blanks {\n    position: relative;\n}\n\n\n/* Text */\n\n.h5p-advanced-blanks #h5p-cloze-container p,\n.h5p-advanced-blanks #h5p-cloze-container div {\n    line-height: 1.8em;\n    margin: 0 0 1em;\n    text-align: justify;\n}\n\n@media only screen and (min-width: 480px) {\n    .h5p-advanced-blanks #h5p-cloze-container p,\n    .h5p-advanced-blanks #h5p-cloze-container div {\n        text-align: unset;\n    }\n}\n\n\n/* Input */\n\n.h5p-advanced-blanks .h5p-input-wrapper {\n    display: inline-block;\n    position: relative;\n}\n\n.h5p-advanced-blanks .blank .h5p-text-input {\n    font-family: H5PDroidSans, sans-serif;\n    font-size: 1em;\n    border-radius: 0.25em;\n    border: 1px solid #a0a0a0;\n    padding: 0.1875em 1.5em 0.1875em 0.5em;\n    text-overflow: ellipsis;\n    overflow: hidden;\n}\n\n.h5p-advanced-blanks .blank input.h5p-text-input {\n  max-width: calc(100vw - 64px);\n}\n\n.h5p-advanced-blanks .blank select.h5p-text-input {\n  max-width: calc(100vw - 36px);\n}\n\n/* IE + Chrome specific fixes */\n\n.h5p-text-input::-ms-clear {\n    display: none;\n}\n\n:not(.correct).blank.has-tip button {\n    cursor: pointer;\n}\n\n\n/* Select mode */\n\nselect.h5p-text-input {\n    appearance: button;\n    -moz-appearance: none;\n    -webkit-appearance: button;\n}\n\n\n/* Showing solution input */\n\n.h5p-advanced-blanks .blank.showing-solution .h5p-text-input {\n    border: 1px dashed #9dd8bb;\n    color: #255c41;\n    background: #FFFFFF;\n}\n\n\n/* Focussed input */\n\n.h5p-advanced-blanks .blank .h5p-text-input:focus {\n    outline: none;\n    box-shadow: 0 0 0.5em 0 #7fb8ff;\n    border-color: #7fb8ff;\n}\n\n\n/* Correctly answered input */\n\n.h5p-advanced-blanks .blank.correct .h5p-text-input {\n    background: #9dd8bb;\n    border: 1px solid #9dd8bb;\n    color: #255c41;\n}\n\n.h5p-advanced-blanks .blank.correct .h5p-input-wrapper:after {\n    position: absolute;\n    right: 0.5em;    \n    top: 50%;\n    transform: translateY(-50%);\n    text-decoration: none;\n    content: \"\\f00c\";\n    font-family: 'H5PFontAwesome4';\n    color: #255c41;\n}\n\n\n/* Incorrect answers */\n\n.h5p-advanced-blanks .blank.error .h5p-text-input {\n    background-color: #f7d0d0;\n    border: 1px solid #f7d0d0;\n    color: #b71c1c;\n    text-decoration: line-through;\n}\n\n.h5p-advanced-blanks .blank.error .h5p-input-wrapper:after {\n    position: absolute;\n    right: 0.5em;\n    top: 50%;\n    transform: translateY(-50%);\n    font-family: 'H5PFontAwesome4';\n    text-decoration: none;\n    content: \"\\f00d\";\n    color: #b71c1c;\n}\n\n\n/* Spelling errors */\n\n.h5p-advanced-blanks .blank.retry .h5p-text-input {\n    background-color: #ffff99;\n    border: 1px solid #ffff99;\n    color: black;\n}\n\n.h5p-advanced-blanks .blank.retry .h5p-input-wrapper:after {\n    position: absolute;\n    right: 0.5em;\n    top: 50%;\n    transform: translateY(-50%);\n    font-family: 'H5PFontAwesome4';\n    text-decoration: none;\n    content: \"\\f00d\";\n    color: #b71c1c;\n}\n\n\n/* Buttons */\n\n.h5p-advanced-blanks .blank button {\n    padding-left: 5px;\n    padding-right: 5px;\n    border: none;\n    background: none;\n}\n\n\n/* Highlight in spelling mistake marker */\n\n.spelling-mistake .missing-character,\n.spelling-mistake .mistaken-character {\n    color: red;\n    font-weight: bold;\n    animation-duration: 500ms;\n    animation-name: blink-color;\n    animation-iteration-count: 13;\n    animation-direction: alternate;\n}\n\n@keyframes blink-color {\n    from {\n        color: initial;\n    }\n    to {\n        color: red;\n    }\n}\n\n.spelling-mistake .mistaken-character {\n    text-decoration: line-through;\n}\n\n\n/* Highlights in text */\n\n.h5p-advanced-blanks .highlighted {\n    background-color: rgba(255, 0, 0, 0.2);\n    padding: 0.4em;\n    margin: -0.4em;\n    animation-duration: 1000ms;\n    animation-name: blink-background-color;\n    animation-iteration-count: 3;\n    animation-direction: alternate;\n}\n\n@keyframes blink-background-color {\n    from {\n        background-color: initial;\n    }\n    to {\n        background-color: rgba(255, 0, 0, 0.2);\n    }\n}\n\n\n/* Others */\n\n.h5p-advanced-blanks .invisible {\n    visibility: collapse;\n}\n\n\n/* Tips */\n\n.h5p-advanced-blanks .h5p-tip-container {\n  position: absolute;\n  top: 50%;\n  transform: translateY(-50%);\n  right: 0.4em;\n  font-size: 1em;\n}\n\n.h5p-advanced-blanks .blank.has-tip:not(.correct):not(.error):not(.retry) .h5p-text-input {\n    padding-right: 2.25em;\n}\n\n.h5p-advanced-blanks .blank.has-tip.correct .h5p-input-wrapper:after,\n.h5p-advanced-blanks .blank.has-tip.error .h5p-input-wrapper:after,\n.h5p-advanced-blanks .blank.has-tip.retry .h5p-input-wrapper:after {\n    right: 2.25em;\n}\n\n.h5p-advanced-blanks .blank.correct.has-tip .h5p-text-input,\n.h5p-advanced-blanks .blank.error.has-tip .h5p-text-input,\n.h5p-advanced-blanks .blank.retry.has-tip .h5p-text-input {\n    padding-right: 3.5em;\n}\n\n/* improves appearance of h5p tip shadows */\n.h5p-advanced-blanks .joubel-icon-tip-normal .h5p-icon-shadow:before {\n  color: black;\n  opacity: 0.13;\n}\n\n/* pending feedback marker */\n\n.h5p-advanced-blanks .h5p-advanced-blanks-select-mode .blank:not(.has-pending-feedback) button.h5p-notification {\n    display: none;\n}\n\n.h5p-advanced-blanks .h5p-advanced-blanks-select-mode .blank.has-pending-feedback button.h5p-notification {\n    font-size: large;    \n}\n\n.h5p-advanced-blanks .h5p-advanced-blanks-select-mode .blank.has-pending-feedback button.h5p-notification,\n.h5p-advanced-blanks .h5p-advanced-blanks-type-mode .blank.has-pending-feedback .h5p-input-wrapper:before {\n    font-family: 'H5PFontAwesome4';\n    text-decoration: none;\n    animation: shake 3s cubic-bezier(.36, .07, .19, .97) reverse;\n    animation-iteration-count: 2;\n    transform: translate3d(0, 0, 0);\n    backface-visibility: hidden;\n    perspective: 1000px;\n}\n\n.h5p-advanced-blanks .h5p-advanced-blanks-type-mode .blank.has-pending-feedback .h5p-input-wrapper:before {\n    position: absolute;\n    left: -0.4em;\n    top: -0.7em;\n    content: \"\\f05a\";\n}\n\n.h5p-advanced-blanks .h5p-advanced-blanks-select-mode .blank.error.has-pending-feedback button.h5p-notification,\n.h5p-advanced-blanks .h5p-advanced-blanks-type-mode .blank.error.has-pending-feedback .h5p-input-wrapper:before {\n    color: #b71c1c;\n}\n\n.h5p-advanced-blanks .h5p-advanced-blanks-select-mode .blank.retry.has-pending-feedback button.h5p-notification,\n.h5p-advanced-blanks .h5p-advanced-blanks-type-mode .blank.retry.has-pending-feedback .h5p-input-wrapper:before {\n    color: #ffff00;\n    text-shadow: 0px 0px 0.5em black;\n}\n\n@keyframes shake {\n    2%,\n    20% {\n        transform: translate3d(-0.5px, 0, 0);\n    }\n    4%,\n    17% {\n        transform: translate3d(1px, 0, 0);\n    }\n    6%,\n    10%,\n    15% {\n        transform: translate3d(-2px, 0, 0);\n    }\n    9%,\n    13% {\n        transform: translate3d(2px, 0, 0);\n    }\n}"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";


/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {

"use strict";


module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    return [content].concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./node_modules/diff/lib/convert/dmp.js":
/*!**********************************************!*\
  !*** ./node_modules/diff/lib/convert/dmp.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
/*istanbul ignore start*/


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.convertChangesToDMP = convertChangesToDMP;

/*istanbul ignore end*/
// See: http://code.google.com/p/google-diff-match-patch/wiki/API
function convertChangesToDMP(changes) {
  var ret = [],
      change,
      operation;

  for (var i = 0; i < changes.length; i++) {
    change = changes[i];

    if (change.added) {
      operation = 1;
    } else if (change.removed) {
      operation = -1;
    } else {
      operation = 0;
    }

    ret.push([operation, change.value]);
  }

  return ret;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb252ZXJ0L2RtcC5qcyJdLCJuYW1lcyI6WyJjb252ZXJ0Q2hhbmdlc1RvRE1QIiwiY2hhbmdlcyIsInJldCIsImNoYW5nZSIsIm9wZXJhdGlvbiIsImkiLCJsZW5ndGgiLCJhZGRlZCIsInJlbW92ZWQiLCJwdXNoIiwidmFsdWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ08sU0FBU0EsbUJBQVQsQ0FBNkJDLE9BQTdCLEVBQXNDO0FBQzNDLE1BQUlDLEdBQUcsR0FBRyxFQUFWO0FBQUEsTUFDSUMsTUFESjtBQUFBLE1BRUlDLFNBRko7O0FBR0EsT0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHSixPQUFPLENBQUNLLE1BQTVCLEVBQW9DRCxDQUFDLEVBQXJDLEVBQXlDO0FBQ3ZDRixJQUFBQSxNQUFNLEdBQUdGLE9BQU8sQ0FBQ0ksQ0FBRCxDQUFoQjs7QUFDQSxRQUFJRixNQUFNLENBQUNJLEtBQVgsRUFBa0I7QUFDaEJILE1BQUFBLFNBQVMsR0FBRyxDQUFaO0FBQ0QsS0FGRCxNQUVPLElBQUlELE1BQU0sQ0FBQ0ssT0FBWCxFQUFvQjtBQUN6QkosTUFBQUEsU0FBUyxHQUFHLENBQUMsQ0FBYjtBQUNELEtBRk0sTUFFQTtBQUNMQSxNQUFBQSxTQUFTLEdBQUcsQ0FBWjtBQUNEOztBQUVERixJQUFBQSxHQUFHLENBQUNPLElBQUosQ0FBUyxDQUFDTCxTQUFELEVBQVlELE1BQU0sQ0FBQ08sS0FBbkIsQ0FBVDtBQUNEOztBQUNELFNBQU9SLEdBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbIi8vIFNlZTogaHR0cDovL2NvZGUuZ29vZ2xlLmNvbS9wL2dvb2dsZS1kaWZmLW1hdGNoLXBhdGNoL3dpa2kvQVBJXG5leHBvcnQgZnVuY3Rpb24gY29udmVydENoYW5nZXNUb0RNUChjaGFuZ2VzKSB7XG4gIGxldCByZXQgPSBbXSxcbiAgICAgIGNoYW5nZSxcbiAgICAgIG9wZXJhdGlvbjtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGFuZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgY2hhbmdlID0gY2hhbmdlc1tpXTtcbiAgICBpZiAoY2hhbmdlLmFkZGVkKSB7XG4gICAgICBvcGVyYXRpb24gPSAxO1xuICAgIH0gZWxzZSBpZiAoY2hhbmdlLnJlbW92ZWQpIHtcbiAgICAgIG9wZXJhdGlvbiA9IC0xO1xuICAgIH0gZWxzZSB7XG4gICAgICBvcGVyYXRpb24gPSAwO1xuICAgIH1cblxuICAgIHJldC5wdXNoKFtvcGVyYXRpb24sIGNoYW5nZS52YWx1ZV0pO1xuICB9XG4gIHJldHVybiByZXQ7XG59XG4iXX0=


/***/ }),

/***/ "./node_modules/diff/lib/convert/xml.js":
/*!**********************************************!*\
  !*** ./node_modules/diff/lib/convert/xml.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
/*istanbul ignore start*/


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.convertChangesToXML = convertChangesToXML;

/*istanbul ignore end*/
function convertChangesToXML(changes) {
  var ret = [];

  for (var i = 0; i < changes.length; i++) {
    var change = changes[i];

    if (change.added) {
      ret.push('<ins>');
    } else if (change.removed) {
      ret.push('<del>');
    }

    ret.push(escapeHTML(change.value));

    if (change.added) {
      ret.push('</ins>');
    } else if (change.removed) {
      ret.push('</del>');
    }
  }

  return ret.join('');
}

function escapeHTML(s) {
  var n = s;
  n = n.replace(/&/g, '&amp;');
  n = n.replace(/</g, '&lt;');
  n = n.replace(/>/g, '&gt;');
  n = n.replace(/"/g, '&quot;');
  return n;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9jb252ZXJ0L3htbC5qcyJdLCJuYW1lcyI6WyJjb252ZXJ0Q2hhbmdlc1RvWE1MIiwiY2hhbmdlcyIsInJldCIsImkiLCJsZW5ndGgiLCJjaGFuZ2UiLCJhZGRlZCIsInB1c2giLCJyZW1vdmVkIiwiZXNjYXBlSFRNTCIsInZhbHVlIiwiam9pbiIsInMiLCJuIiwicmVwbGFjZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQU8sU0FBU0EsbUJBQVQsQ0FBNkJDLE9BQTdCLEVBQXNDO0FBQzNDLE1BQUlDLEdBQUcsR0FBRyxFQUFWOztBQUNBLE9BQUssSUFBSUMsQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0YsT0FBTyxDQUFDRyxNQUE1QixFQUFvQ0QsQ0FBQyxFQUFyQyxFQUF5QztBQUN2QyxRQUFJRSxNQUFNLEdBQUdKLE9BQU8sQ0FBQ0UsQ0FBRCxDQUFwQjs7QUFDQSxRQUFJRSxNQUFNLENBQUNDLEtBQVgsRUFBa0I7QUFDaEJKLE1BQUFBLEdBQUcsQ0FBQ0ssSUFBSixDQUFTLE9BQVQ7QUFDRCxLQUZELE1BRU8sSUFBSUYsTUFBTSxDQUFDRyxPQUFYLEVBQW9CO0FBQ3pCTixNQUFBQSxHQUFHLENBQUNLLElBQUosQ0FBUyxPQUFUO0FBQ0Q7O0FBRURMLElBQUFBLEdBQUcsQ0FBQ0ssSUFBSixDQUFTRSxVQUFVLENBQUNKLE1BQU0sQ0FBQ0ssS0FBUixDQUFuQjs7QUFFQSxRQUFJTCxNQUFNLENBQUNDLEtBQVgsRUFBa0I7QUFDaEJKLE1BQUFBLEdBQUcsQ0FBQ0ssSUFBSixDQUFTLFFBQVQ7QUFDRCxLQUZELE1BRU8sSUFBSUYsTUFBTSxDQUFDRyxPQUFYLEVBQW9CO0FBQ3pCTixNQUFBQSxHQUFHLENBQUNLLElBQUosQ0FBUyxRQUFUO0FBQ0Q7QUFDRjs7QUFDRCxTQUFPTCxHQUFHLENBQUNTLElBQUosQ0FBUyxFQUFULENBQVA7QUFDRDs7QUFFRCxTQUFTRixVQUFULENBQW9CRyxDQUFwQixFQUF1QjtBQUNyQixNQUFJQyxDQUFDLEdBQUdELENBQVI7QUFDQUMsRUFBQUEsQ0FBQyxHQUFHQSxDQUFDLENBQUNDLE9BQUYsQ0FBVSxJQUFWLEVBQWdCLE9BQWhCLENBQUo7QUFDQUQsRUFBQUEsQ0FBQyxHQUFHQSxDQUFDLENBQUNDLE9BQUYsQ0FBVSxJQUFWLEVBQWdCLE1BQWhCLENBQUo7QUFDQUQsRUFBQUEsQ0FBQyxHQUFHQSxDQUFDLENBQUNDLE9BQUYsQ0FBVSxJQUFWLEVBQWdCLE1BQWhCLENBQUo7QUFDQUQsRUFBQUEsQ0FBQyxHQUFHQSxDQUFDLENBQUNDLE9BQUYsQ0FBVSxJQUFWLEVBQWdCLFFBQWhCLENBQUo7QUFFQSxTQUFPRCxDQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gY29udmVydENoYW5nZXNUb1hNTChjaGFuZ2VzKSB7XG4gIGxldCByZXQgPSBbXTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGFuZ2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IGNoYW5nZSA9IGNoYW5nZXNbaV07XG4gICAgaWYgKGNoYW5nZS5hZGRlZCkge1xuICAgICAgcmV0LnB1c2goJzxpbnM+Jyk7XG4gICAgfSBlbHNlIGlmIChjaGFuZ2UucmVtb3ZlZCkge1xuICAgICAgcmV0LnB1c2goJzxkZWw+Jyk7XG4gICAgfVxuXG4gICAgcmV0LnB1c2goZXNjYXBlSFRNTChjaGFuZ2UudmFsdWUpKTtcblxuICAgIGlmIChjaGFuZ2UuYWRkZWQpIHtcbiAgICAgIHJldC5wdXNoKCc8L2lucz4nKTtcbiAgICB9IGVsc2UgaWYgKGNoYW5nZS5yZW1vdmVkKSB7XG4gICAgICByZXQucHVzaCgnPC9kZWw+Jyk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXQuam9pbignJyk7XG59XG5cbmZ1bmN0aW9uIGVzY2FwZUhUTUwocykge1xuICBsZXQgbiA9IHM7XG4gIG4gPSBuLnJlcGxhY2UoLyYvZywgJyZhbXA7Jyk7XG4gIG4gPSBuLnJlcGxhY2UoLzwvZywgJyZsdDsnKTtcbiAgbiA9IG4ucmVwbGFjZSgvPi9nLCAnJmd0OycpO1xuICBuID0gbi5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7Jyk7XG5cbiAgcmV0dXJuIG47XG59XG4iXX0=


/***/ }),

/***/ "./node_modules/diff/lib/diff/array.js":
/*!*********************************************!*\
  !*** ./node_modules/diff/lib/diff/array.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/*istanbul ignore start*/


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.diffArrays = diffArrays;
exports.arrayDiff = void 0;

/*istanbul ignore end*/
var
/*istanbul ignore start*/
_base = _interopRequireDefault(__webpack_require__(/*! ./base */ "./node_modules/diff/lib/diff/base.js"))
/*istanbul ignore end*/
;

/*istanbul ignore start*/ function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/*istanbul ignore end*/
var arrayDiff = new
/*istanbul ignore start*/
_base
/*istanbul ignore end*/
[
/*istanbul ignore start*/
"default"
/*istanbul ignore end*/
]();

/*istanbul ignore start*/
exports.arrayDiff = arrayDiff;

/*istanbul ignore end*/
arrayDiff.tokenize = function (value) {
  return value.slice();
};

arrayDiff.join = arrayDiff.removeEmpty = function (value) {
  return value;
};

function diffArrays(oldArr, newArr, callback) {
  return arrayDiff.diff(oldArr, newArr, callback);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaWZmL2FycmF5LmpzIl0sIm5hbWVzIjpbImFycmF5RGlmZiIsIkRpZmYiLCJ0b2tlbml6ZSIsInZhbHVlIiwic2xpY2UiLCJqb2luIiwicmVtb3ZlRW1wdHkiLCJkaWZmQXJyYXlzIiwib2xkQXJyIiwibmV3QXJyIiwiY2FsbGJhY2siLCJkaWZmIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7QUFFTyxJQUFNQSxTQUFTLEdBQUc7QUFBSUM7QUFBQUE7QUFBQUE7QUFBQUE7QUFBQUE7QUFBQUE7QUFBQUE7QUFBQUEsQ0FBSixFQUFsQjs7Ozs7O0FBQ1BELFNBQVMsQ0FBQ0UsUUFBVixHQUFxQixVQUFTQyxLQUFULEVBQWdCO0FBQ25DLFNBQU9BLEtBQUssQ0FBQ0MsS0FBTixFQUFQO0FBQ0QsQ0FGRDs7QUFHQUosU0FBUyxDQUFDSyxJQUFWLEdBQWlCTCxTQUFTLENBQUNNLFdBQVYsR0FBd0IsVUFBU0gsS0FBVCxFQUFnQjtBQUN2RCxTQUFPQSxLQUFQO0FBQ0QsQ0FGRDs7QUFJTyxTQUFTSSxVQUFULENBQW9CQyxNQUFwQixFQUE0QkMsTUFBNUIsRUFBb0NDLFFBQXBDLEVBQThDO0FBQUUsU0FBT1YsU0FBUyxDQUFDVyxJQUFWLENBQWVILE1BQWYsRUFBdUJDLE1BQXZCLEVBQStCQyxRQUEvQixDQUFQO0FBQWtEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERpZmYgZnJvbSAnLi9iYXNlJztcblxuZXhwb3J0IGNvbnN0IGFycmF5RGlmZiA9IG5ldyBEaWZmKCk7XG5hcnJheURpZmYudG9rZW5pemUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUuc2xpY2UoKTtcbn07XG5hcnJheURpZmYuam9pbiA9IGFycmF5RGlmZi5yZW1vdmVFbXB0eSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBkaWZmQXJyYXlzKG9sZEFyciwgbmV3QXJyLCBjYWxsYmFjaykgeyByZXR1cm4gYXJyYXlEaWZmLmRpZmYob2xkQXJyLCBuZXdBcnIsIGNhbGxiYWNrKTsgfVxuIl19


/***/ }),

/***/ "./node_modules/diff/lib/diff/base.js":
/*!********************************************!*\
  !*** ./node_modules/diff/lib/diff/base.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
/*istanbul ignore start*/


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = Diff;

/*istanbul ignore end*/
function Diff() {}

Diff.prototype = {
  /*istanbul ignore start*/

  /*istanbul ignore end*/
  diff: function diff(oldString, newString) {
    /*istanbul ignore start*/
    var
    /*istanbul ignore end*/
    options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    var callback = options.callback;

    if (typeof options === 'function') {
      callback = options;
      options = {};
    }

    this.options = options;
    var self = this;

    function done(value) {
      if (callback) {
        setTimeout(function () {
          callback(undefined, value);
        }, 0);
        return true;
      } else {
        return value;
      }
    } // Allow subclasses to massage the input prior to running


    oldString = this.castInput(oldString);
    newString = this.castInput(newString);
    oldString = this.removeEmpty(this.tokenize(oldString));
    newString = this.removeEmpty(this.tokenize(newString));
    var newLen = newString.length,
        oldLen = oldString.length;
    var editLength = 1;
    var maxEditLength = newLen + oldLen;
    var bestPath = [{
      newPos: -1,
      components: []
    }]; // Seed editLength = 0, i.e. the content starts with the same values

    var oldPos = this.extractCommon(bestPath[0], newString, oldString, 0);

    if (bestPath[0].newPos + 1 >= newLen && oldPos + 1 >= oldLen) {
      // Identity per the equality and tokenizer
      return done([{
        value: this.join(newString),
        count: newString.length
      }]);
    } // Main worker method. checks all permutations of a given edit length for acceptance.


    function execEditLength() {
      for (var diagonalPath = -1 * editLength; diagonalPath <= editLength; diagonalPath += 2) {
        var basePath =
        /*istanbul ignore start*/
        void 0
        /*istanbul ignore end*/
        ;

        var addPath = bestPath[diagonalPath - 1],
            removePath = bestPath[diagonalPath + 1],
            _oldPos = (removePath ? removePath.newPos : 0) - diagonalPath;

        if (addPath) {
          // No one else is going to attempt to use this value, clear it
          bestPath[diagonalPath - 1] = undefined;
        }

        var canAdd = addPath && addPath.newPos + 1 < newLen,
            canRemove = removePath && 0 <= _oldPos && _oldPos < oldLen;

        if (!canAdd && !canRemove) {
          // If this path is a terminal then prune
          bestPath[diagonalPath] = undefined;
          continue;
        } // Select the diagonal that we want to branch from. We select the prior
        // path whose position in the new string is the farthest from the origin
        // and does not pass the bounds of the diff graph


        if (!canAdd || canRemove && addPath.newPos < removePath.newPos) {
          basePath = clonePath(removePath);
          self.pushComponent(basePath.components, undefined, true);
        } else {
          basePath = addPath; // No need to clone, we've pulled it from the list

          basePath.newPos++;
          self.pushComponent(basePath.components, true, undefined);
        }

        _oldPos = self.extractCommon(basePath, newString, oldString, diagonalPath); // If we have hit the end of both strings, then we are done

        if (basePath.newPos + 1 >= newLen && _oldPos + 1 >= oldLen) {
          return done(buildValues(self, basePath.components, newString, oldString, self.useLongestToken));
        } else {
          // Otherwise track this path as a potential candidate and continue.
          bestPath[diagonalPath] = basePath;
        }
      }

      editLength++;
    } // Performs the length of edit iteration. Is a bit fugly as this has to support the
    // sync and async mode which is never fun. Loops over execEditLength until a value
    // is produced.


    if (callback) {
      (function exec() {
        setTimeout(function () {
          // This should not happen, but we want to be safe.

          /* istanbul ignore next */
          if (editLength > maxEditLength) {
            return callback();
          }

          if (!execEditLength()) {
            exec();
          }
        }, 0);
      })();
    } else {
      while (editLength <= maxEditLength) {
        var ret = execEditLength();

        if (ret) {
          return ret;
        }
      }
    }
  },

  /*istanbul ignore start*/

  /*istanbul ignore end*/
  pushComponent: function pushComponent(components, added, removed) {
    var last = components[components.length - 1];

    if (last && last.added === added && last.removed === removed) {
      // We need to clone here as the component clone operation is just
      // as shallow array clone
      components[components.length - 1] = {
        count: last.count + 1,
        added: added,
        removed: removed
      };
    } else {
      components.push({
        count: 1,
        added: added,
        removed: removed
      });
    }
  },

  /*istanbul ignore start*/

  /*istanbul ignore end*/
  extractCommon: function extractCommon(basePath, newString, oldString, diagonalPath) {
    var newLen = newString.length,
        oldLen = oldString.length,
        newPos = basePath.newPos,
        oldPos = newPos - diagonalPath,
        commonCount = 0;

    while (newPos + 1 < newLen && oldPos + 1 < oldLen && this.equals(newString[newPos + 1], oldString[oldPos + 1])) {
      newPos++;
      oldPos++;
      commonCount++;
    }

    if (commonCount) {
      basePath.components.push({
        count: commonCount
      });
    }

    basePath.newPos = newPos;
    return oldPos;
  },

  /*istanbul ignore start*/

  /*istanbul ignore end*/
  equals: function equals(left, right) {
    if (this.options.comparator) {
      return this.options.comparator(left, right);
    } else {
      return left === right || this.options.ignoreCase && left.toLowerCase() === right.toLowerCase();
    }
  },

  /*istanbul ignore start*/

  /*istanbul ignore end*/
  removeEmpty: function removeEmpty(array) {
    var ret = [];

    for (var i = 0; i < array.length; i++) {
      if (array[i]) {
        ret.push(array[i]);
      }
    }

    return ret;
  },

  /*istanbul ignore start*/

  /*istanbul ignore end*/
  castInput: function castInput(value) {
    return value;
  },

  /*istanbul ignore start*/

  /*istanbul ignore end*/
  tokenize: function tokenize(value) {
    return value.split('');
  },

  /*istanbul ignore start*/

  /*istanbul ignore end*/
  join: function join(chars) {
    return chars.join('');
  }
};

function buildValues(diff, components, newString, oldString, useLongestToken) {
  var componentPos = 0,
      componentLen = components.length,
      newPos = 0,
      oldPos = 0;

  for (; componentPos < componentLen; componentPos++) {
    var component = components[componentPos];

    if (!component.removed) {
      if (!component.added && useLongestToken) {
        var value = newString.slice(newPos, newPos + component.count);
        value = value.map(function (value, i) {
          var oldValue = oldString[oldPos + i];
          return oldValue.length > value.length ? oldValue : value;
        });
        component.value = diff.join(value);
      } else {
        component.value = diff.join(newString.slice(newPos, newPos + component.count));
      }

      newPos += component.count; // Common case

      if (!component.added) {
        oldPos += component.count;
      }
    } else {
      component.value = diff.join(oldString.slice(oldPos, oldPos + component.count));
      oldPos += component.count; // Reverse add and remove so removes are output first to match common convention
      // The diffing algorithm is tied to add then remove output and this is the simplest
      // route to get the desired output with minimal overhead.

      if (componentPos && components[componentPos - 1].added) {
        var tmp = components[componentPos - 1];
        components[componentPos - 1] = components[componentPos];
        components[componentPos] = tmp;
      }
    }
  } // Special case handle for when one terminal is ignored (i.e. whitespace).
  // For this case we merge the terminal into the prior string and drop the change.
  // This is only available for string mode.


  var lastComponent = components[componentLen - 1];

  if (componentLen > 1 && typeof lastComponent.value === 'string' && (lastComponent.added || lastComponent.removed) && diff.equals('', lastComponent.value)) {
    components[componentLen - 2].value += lastComponent.value;
    components.pop();
  }

  return components;
}

function clonePath(path) {
  return {
    newPos: path.newPos,
    components: path.components.slice(0)
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaWZmL2Jhc2UuanMiXSwibmFtZXMiOlsiRGlmZiIsInByb3RvdHlwZSIsImRpZmYiLCJvbGRTdHJpbmciLCJuZXdTdHJpbmciLCJvcHRpb25zIiwiY2FsbGJhY2siLCJzZWxmIiwiZG9uZSIsInZhbHVlIiwic2V0VGltZW91dCIsInVuZGVmaW5lZCIsImNhc3RJbnB1dCIsInJlbW92ZUVtcHR5IiwidG9rZW5pemUiLCJuZXdMZW4iLCJsZW5ndGgiLCJvbGRMZW4iLCJlZGl0TGVuZ3RoIiwibWF4RWRpdExlbmd0aCIsImJlc3RQYXRoIiwibmV3UG9zIiwiY29tcG9uZW50cyIsIm9sZFBvcyIsImV4dHJhY3RDb21tb24iLCJqb2luIiwiY291bnQiLCJleGVjRWRpdExlbmd0aCIsImRpYWdvbmFsUGF0aCIsImJhc2VQYXRoIiwiYWRkUGF0aCIsInJlbW92ZVBhdGgiLCJjYW5BZGQiLCJjYW5SZW1vdmUiLCJjbG9uZVBhdGgiLCJwdXNoQ29tcG9uZW50IiwiYnVpbGRWYWx1ZXMiLCJ1c2VMb25nZXN0VG9rZW4iLCJleGVjIiwicmV0IiwiYWRkZWQiLCJyZW1vdmVkIiwibGFzdCIsInB1c2giLCJjb21tb25Db3VudCIsImVxdWFscyIsImxlZnQiLCJyaWdodCIsImNvbXBhcmF0b3IiLCJpZ25vcmVDYXNlIiwidG9Mb3dlckNhc2UiLCJhcnJheSIsImkiLCJzcGxpdCIsImNoYXJzIiwiY29tcG9uZW50UG9zIiwiY29tcG9uZW50TGVuIiwiY29tcG9uZW50Iiwic2xpY2UiLCJtYXAiLCJvbGRWYWx1ZSIsInRtcCIsImxhc3RDb21wb25lbnQiLCJwb3AiLCJwYXRoIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBZSxTQUFTQSxJQUFULEdBQWdCLENBQUU7O0FBRWpDQSxJQUFJLENBQUNDLFNBQUwsR0FBaUI7QUFBQTs7QUFBQTtBQUNmQyxFQUFBQSxJQURlLGdCQUNWQyxTQURVLEVBQ0NDLFNBREQsRUFDMEI7QUFBQTtBQUFBO0FBQUE7QUFBZEMs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QUcsQ0FBZixJQUNHLE9BQU9NLGFBQWEsQ0FBQ3JELEtBQXJCLEtBQStCLFFBRGxDLEtBRUlxRCxhQUFhLENBQUN0QixLQUFkLElBQXVCc0IsYUFBYSxDQUFDckIsT0FGekMsS0FHR3ZDLElBQUksQ0FBQzJDLE1BQUwsQ0FBWSxFQUFaLEVBQWdCaUIsYUFBYSxDQUFDckQsS0FBOUIsQ0FIUCxFQUc2QztBQUMzQ2EsSUFBQUEsVUFBVSxDQUFDa0MsWUFBWSxHQUFHLENBQWhCLENBQVYsQ0FBNkIvQyxLQUE3QixJQUFzQ3FELGFBQWEsQ0FBQ3JELEtBQXBEO0FBQ0FhLElBQUFBLFVBQVUsQ0FBQ3lDLEdBQVg7QUFDRDs7QUFFRCxTQUFPekMsVUFBUDtBQUNEOztBQUVELFNBQVNZLFNBQVQsQ0FBbUI4QixJQUFuQixFQUF5QjtBQUN2QixTQUFPO0FBQUUzQyxJQUFBQSxNQUFNLEVBQUUyQyxJQUFJLENBQUMzQyxNQUFmO0FBQXVCQyxJQUFBQSxVQUFVLEVBQUUwQyxJQUFJLENBQUMxQyxVQUFMLENBQWdCb0MsS0FBaEIsQ0FBc0IsQ0FBdEI7QUFBbkMsR0FBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRGlmZigpIHt9XG5cbkRpZmYucHJvdG90eXBlID0ge1xuICBkaWZmKG9sZFN0cmluZywgbmV3U3RyaW5nLCBvcHRpb25zID0ge30pIHtcbiAgICBsZXQgY2FsbGJhY2sgPSBvcHRpb25zLmNhbGxiYWNrO1xuICAgIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgY2FsbGJhY2sgPSBvcHRpb25zO1xuICAgICAgb3B0aW9ucyA9IHt9O1xuICAgIH1cbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuXG4gICAgbGV0IHNlbGYgPSB0aGlzO1xuXG4gICAgZnVuY3Rpb24gZG9uZSh2YWx1ZSkge1xuICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7IGNhbGxiYWNrKHVuZGVmaW5lZCwgdmFsdWUpOyB9LCAwKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8gQWxsb3cgc3ViY2xhc3NlcyB0byBtYXNzYWdlIHRoZSBpbnB1dCBwcmlvciB0byBydW5uaW5nXG4gICAgb2xkU3RyaW5nID0gdGhpcy5jYXN0SW5wdXQob2xkU3RyaW5nKTtcbiAgICBuZXdTdHJpbmcgPSB0aGlzLmNhc3RJbnB1dChuZXdTdHJpbmcpO1xuXG4gICAgb2xkU3RyaW5nID0gdGhpcy5yZW1vdmVFbXB0eSh0aGlzLnRva2VuaXplKG9sZFN0cmluZykpO1xuICAgIG5ld1N0cmluZyA9IHRoaXMucmVtb3ZlRW1wdHkodGhpcy50b2tlbml6ZShuZXdTdHJpbmcpKTtcblxuICAgIGxldCBuZXdMZW4gPSBuZXdTdHJpbmcubGVuZ3RoLCBvbGRMZW4gPSBvbGRTdHJpbmcubGVuZ3RoO1xuICAgIGxldCBlZGl0TGVuZ3RoID0gMTtcbiAgICBsZXQgbWF4RWRpdExlbmd0aCA9IG5ld0xlbiArIG9sZExlbjtcbiAgICBsZXQgYmVzdFBhdGggPSBbeyBuZXdQb3M6IC0xLCBjb21wb25lbnRzOiBbXSB9XTtcblxuICAgIC8vIFNlZWQgZWRpdExlbmd0aCA9IDAsIGkuZS4gdGhlIGNvbnRlbnQgc3RhcnRzIHdpdGggdGhlIHNhbWUgdmFsdWVzXG4gICAgbGV0IG9sZFBvcyA9IHRoaXMuZXh0cmFjdENvbW1vbihiZXN0UGF0aFswXSwgbmV3U3RyaW5nLCBvbGRTdHJpbmcsIDApO1xuICAgIGlmIChiZXN0UGF0aFswXS5uZXdQb3MgKyAxID49IG5ld0xlbiAmJiBvbGRQb3MgKyAxID49IG9sZExlbikge1xuICAgICAgLy8gSWRlbnRpdHkgcGVyIHRoZSBlcXVhbGl0eSBhbmQgdG9rZW5pemVyXG4gICAgICByZXR1cm4gZG9uZShbe3ZhbHVlOiB0aGlzLmpvaW4obmV3U3RyaW5nKSwgY291bnQ6IG5ld1N0cmluZy5sZW5ndGh9XSk7XG4gICAgfVxuXG4gICAgLy8gTWFpbiB3b3JrZXIgbWV0aG9kLiBjaGVja3MgYWxsIHBlcm11dGF0aW9ucyBvZiBhIGdpdmVuIGVkaXQgbGVuZ3RoIGZvciBhY2NlcHRhbmNlLlxuICAgIGZ1bmN0aW9uIGV4ZWNFZGl0TGVuZ3RoKCkge1xuICAgICAgZm9yIChsZXQgZGlhZ29uYWxQYXRoID0gLTEgKiBlZGl0TGVuZ3RoOyBkaWFnb25hbFBhdGggPD0gZWRpdExlbmd0aDsgZGlhZ29uYWxQYXRoICs9IDIpIHtcbiAgICAgICAgbGV0IGJhc2VQYXRoO1xuICAgICAgICBsZXQgYWRkUGF0aCA9IGJlc3RQYXRoW2RpYWdvbmFsUGF0aCAtIDFdLFxuICAgICAgICAgICAgcmVtb3ZlUGF0aCA9IGJlc3RQYXRoW2RpYWdvbmFsUGF0aCArIDFdLFxuICAgICAgICAgICAgb2xkUG9zID0gKHJlbW92ZVBhdGggPyByZW1vdmVQYXRoLm5ld1BvcyA6IDApIC0gZGlhZ29uYWxQYXRoO1xuICAgICAgICBpZiAoYWRkUGF0aCkge1xuICAgICAgICAgIC8vIE5vIG9uZSBlbHNlIGlzIGdvaW5nIHRvIGF0dGVtcHQgdG8gdXNlIHRoaXMgdmFsdWUsIGNsZWFyIGl0XG4gICAgICAgICAgYmVzdFBhdGhbZGlhZ29uYWxQYXRoIC0gMV0gPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY2FuQWRkID0gYWRkUGF0aCAmJiBhZGRQYXRoLm5ld1BvcyArIDEgPCBuZXdMZW4sXG4gICAgICAgICAgICBjYW5SZW1vdmUgPSByZW1vdmVQYXRoICYmIDAgPD0gb2xkUG9zICYmIG9sZFBvcyA8IG9sZExlbjtcbiAgICAgICAgaWYgKCFjYW5BZGQgJiYgIWNhblJlbW92ZSkge1xuICAgICAgICAgIC8vIElmIHRoaXMgcGF0aCBpcyBhIHRlcm1pbmFsIHRoZW4gcHJ1bmVcbiAgICAgICAgICBiZXN0UGF0aFtkaWFnb25hbFBhdGhdID0gdW5kZWZpbmVkO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gU2VsZWN0IHRoZSBkaWFnb25hbCB0aGF0IHdlIHdhbnQgdG8gYnJhbmNoIGZyb20uIFdlIHNlbGVjdCB0aGUgcHJpb3JcbiAgICAgICAgLy8gcGF0aCB3aG9zZSBwb3NpdGlvbiBpbiB0aGUgbmV3IHN0cmluZyBpcyB0aGUgZmFydGhlc3QgZnJvbSB0aGUgb3JpZ2luXG4gICAgICAgIC8vIGFuZCBkb2VzIG5vdCBwYXNzIHRoZSBib3VuZHMgb2YgdGhlIGRpZmYgZ3JhcGhcbiAgICAgICAgaWYgKCFjYW5BZGQgfHwgKGNhblJlbW92ZSAmJiBhZGRQYXRoLm5ld1BvcyA8IHJlbW92ZVBhdGgubmV3UG9zKSkge1xuICAgICAgICAgIGJhc2VQYXRoID0gY2xvbmVQYXRoKHJlbW92ZVBhdGgpO1xuICAgICAgICAgIHNlbGYucHVzaENvbXBvbmVudChiYXNlUGF0aC5jb21wb25lbnRzLCB1bmRlZmluZWQsIHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGJhc2VQYXRoID0gYWRkUGF0aDsgLy8gTm8gbmVlZCB0byBjbG9uZSwgd2UndmUgcHVsbGVkIGl0IGZyb20gdGhlIGxpc3RcbiAgICAgICAgICBiYXNlUGF0aC5uZXdQb3MrKztcbiAgICAgICAgICBzZWxmLnB1c2hDb21wb25lbnQoYmFzZVBhdGguY29tcG9uZW50cywgdHJ1ZSwgdW5kZWZpbmVkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIG9sZFBvcyA9IHNlbGYuZXh0cmFjdENvbW1vbihiYXNlUGF0aCwgbmV3U3RyaW5nLCBvbGRTdHJpbmcsIGRpYWdvbmFsUGF0aCk7XG5cbiAgICAgICAgLy8gSWYgd2UgaGF2ZSBoaXQgdGhlIGVuZCBvZiBib3RoIHN0cmluZ3MsIHRoZW4gd2UgYXJlIGRvbmVcbiAgICAgICAgaWYgKGJhc2VQYXRoLm5ld1BvcyArIDEgPj0gbmV3TGVuICYmIG9sZFBvcyArIDEgPj0gb2xkTGVuKSB7XG4gICAgICAgICAgcmV0dXJuIGRvbmUoYnVpbGRWYWx1ZXMoc2VsZiwgYmFzZVBhdGguY29tcG9uZW50cywgbmV3U3RyaW5nLCBvbGRTdHJpbmcsIHNlbGYudXNlTG9uZ2VzdFRva2VuKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gT3RoZXJ3aXNlIHRyYWNrIHRoaXMgcGF0aCBhcyBhIHBvdGVudGlhbCBjYW5kaWRhdGUgYW5kIGNvbnRpbnVlLlxuICAgICAgICAgIGJlc3RQYXRoW2RpYWdvbmFsUGF0aF0gPSBiYXNlUGF0aDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBlZGl0TGVuZ3RoKys7XG4gICAgfVxuXG4gICAgLy8gUGVyZm9ybXMgdGhlIGxlbmd0aCBvZiBlZGl0IGl0ZXJhdGlvbi4gSXMgYSBiaXQgZnVnbHkgYXMgdGhpcyBoYXMgdG8gc3VwcG9ydCB0aGVcbiAgICAvLyBzeW5jIGFuZCBhc3luYyBtb2RlIHdoaWNoIGlzIG5ldmVyIGZ1bi4gTG9vcHMgb3ZlciBleGVjRWRpdExlbmd0aCB1bnRpbCBhIHZhbHVlXG4gICAgLy8gaXMgcHJvZHVjZWQuXG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAoZnVuY3Rpb24gZXhlYygpIHtcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAvLyBUaGlzIHNob3VsZCBub3QgaGFwcGVuLCBidXQgd2Ugd2FudCB0byBiZSBzYWZlLlxuICAgICAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gICAgICAgICAgaWYgKGVkaXRMZW5ndGggPiBtYXhFZGl0TGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoIWV4ZWNFZGl0TGVuZ3RoKCkpIHtcbiAgICAgICAgICAgIGV4ZWMoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIDApO1xuICAgICAgfSgpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgd2hpbGUgKGVkaXRMZW5ndGggPD0gbWF4RWRpdExlbmd0aCkge1xuICAgICAgICBsZXQgcmV0ID0gZXhlY0VkaXRMZW5ndGgoKTtcbiAgICAgICAgaWYgKHJldCkge1xuICAgICAgICAgIHJldHVybiByZXQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG5cbiAgcHVzaENvbXBvbmVudChjb21wb25lbnRzLCBhZGRlZCwgcmVtb3ZlZCkge1xuICAgIGxldCBsYXN0ID0gY29tcG9uZW50c1tjb21wb25lbnRzLmxlbmd0aCAtIDFdO1xuICAgIGlmIChsYXN0ICYmIGxhc3QuYWRkZWQgPT09IGFkZGVkICYmIGxhc3QucmVtb3ZlZCA9PT0gcmVtb3ZlZCkge1xuICAgICAgLy8gV2UgbmVlZCB0byBjbG9uZSBoZXJlIGFzIHRoZSBjb21wb25lbnQgY2xvbmUgb3BlcmF0aW9uIGlzIGp1c3RcbiAgICAgIC8vIGFzIHNoYWxsb3cgYXJyYXkgY2xvbmVcbiAgICAgIGNvbXBvbmVudHNbY29tcG9uZW50cy5sZW5ndGggLSAxXSA9IHtjb3VudDogbGFzdC5jb3VudCArIDEsIGFkZGVkOiBhZGRlZCwgcmVtb3ZlZDogcmVtb3ZlZCB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBjb21wb25lbnRzLnB1c2goe2NvdW50OiAxLCBhZGRlZDogYWRkZWQsIHJlbW92ZWQ6IHJlbW92ZWQgfSk7XG4gICAgfVxuICB9LFxuICBleHRyYWN0Q29tbW9uKGJhc2VQYXRoLCBuZXdTdHJpbmcsIG9sZFN0cmluZywgZGlhZ29uYWxQYXRoKSB7XG4gICAgbGV0IG5ld0xlbiA9IG5ld1N0cmluZy5sZW5ndGgsXG4gICAgICAgIG9sZExlbiA9IG9sZFN0cmluZy5sZW5ndGgsXG4gICAgICAgIG5ld1BvcyA9IGJhc2VQYXRoLm5ld1BvcyxcbiAgICAgICAgb2xkUG9zID0gbmV3UG9zIC0gZGlhZ29uYWxQYXRoLFxuXG4gICAgICAgIGNvbW1vbkNvdW50ID0gMDtcbiAgICB3aGlsZSAobmV3UG9zICsgMSA8IG5ld0xlbiAmJiBvbGRQb3MgKyAxIDwgb2xkTGVuICYmIHRoaXMuZXF1YWxzKG5ld1N0cmluZ1tuZXdQb3MgKyAxXSwgb2xkU3RyaW5nW29sZFBvcyArIDFdKSkge1xuICAgICAgbmV3UG9zKys7XG4gICAgICBvbGRQb3MrKztcbiAgICAgIGNvbW1vbkNvdW50Kys7XG4gICAgfVxuXG4gICAgaWYgKGNvbW1vbkNvdW50KSB7XG4gICAgICBiYXNlUGF0aC5jb21wb25lbnRzLnB1c2goe2NvdW50OiBjb21tb25Db3VudH0pO1xuICAgIH1cblxuICAgIGJhc2VQYXRoLm5ld1BvcyA9IG5ld1BvcztcbiAgICByZXR1cm4gb2xkUG9zO1xuICB9LFxuXG4gIGVxdWFscyhsZWZ0LCByaWdodCkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuY29tcGFyYXRvcikge1xuICAgICAgcmV0dXJuIHRoaXMub3B0aW9ucy5jb21wYXJhdG9yKGxlZnQsIHJpZ2h0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGxlZnQgPT09IHJpZ2h0XG4gICAgICAgIHx8ICh0aGlzLm9wdGlvbnMuaWdub3JlQ2FzZSAmJiBsZWZ0LnRvTG93ZXJDYXNlKCkgPT09IHJpZ2h0LnRvTG93ZXJDYXNlKCkpO1xuICAgIH1cbiAgfSxcbiAgcmVtb3ZlRW1wdHkoYXJyYXkpIHtcbiAgICBsZXQgcmV0ID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGFycmF5W2ldKSB7XG4gICAgICAgIHJldC5wdXNoKGFycmF5W2ldKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHJldDtcbiAgfSxcbiAgY2FzdElucHV0KHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlO1xuICB9LFxuICB0b2tlbml6ZSh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZS5zcGxpdCgnJyk7XG4gIH0sXG4gIGpvaW4oY2hhcnMpIHtcbiAgICByZXR1cm4gY2hhcnMuam9pbignJyk7XG4gIH1cbn07XG5cbmZ1bmN0aW9uIGJ1aWxkVmFsdWVzKGRpZmYsIGNvbXBvbmVudHMsIG5ld1N0cmluZywgb2xkU3RyaW5nLCB1c2VMb25nZXN0VG9rZW4pIHtcbiAgbGV0IGNvbXBvbmVudFBvcyA9IDAsXG4gICAgICBjb21wb25lbnRMZW4gPSBjb21wb25lbnRzLmxlbmd0aCxcbiAgICAgIG5ld1BvcyA9IDAsXG4gICAgICBvbGRQb3MgPSAwO1xuXG4gIGZvciAoOyBjb21wb25lbnRQb3MgPCBjb21wb25lbnRMZW47IGNvbXBvbmVudFBvcysrKSB7XG4gICAgbGV0IGNvbXBvbmVudCA9IGNvbXBvbmVudHNbY29tcG9uZW50UG9zXTtcbiAgICBpZiAoIWNvbXBvbmVudC5yZW1vdmVkKSB7XG4gICAgICBpZiAoIWNvbXBvbmVudC5hZGRlZCAmJiB1c2VMb25nZXN0VG9rZW4pIHtcbiAgICAgICAgbGV0IHZhbHVlID0gbmV3U3RyaW5nLnNsaWNlKG5ld1BvcywgbmV3UG9zICsgY29tcG9uZW50LmNvdW50KTtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZS5tYXAoZnVuY3Rpb24odmFsdWUsIGkpIHtcbiAgICAgICAgICBsZXQgb2xkVmFsdWUgPSBvbGRTdHJpbmdbb2xkUG9zICsgaV07XG4gICAgICAgICAgcmV0dXJuIG9sZFZhbHVlLmxlbmd0aCA+IHZhbHVlLmxlbmd0aCA/IG9sZFZhbHVlIDogdmFsdWU7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNvbXBvbmVudC52YWx1ZSA9IGRpZmYuam9pbih2YWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb21wb25lbnQudmFsdWUgPSBkaWZmLmpvaW4obmV3U3RyaW5nLnNsaWNlKG5ld1BvcywgbmV3UG9zICsgY29tcG9uZW50LmNvdW50KSk7XG4gICAgICB9XG4gICAgICBuZXdQb3MgKz0gY29tcG9uZW50LmNvdW50O1xuXG4gICAgICAvLyBDb21tb24gY2FzZVxuICAgICAgaWYgKCFjb21wb25lbnQuYWRkZWQpIHtcbiAgICAgICAgb2xkUG9zICs9IGNvbXBvbmVudC5jb3VudDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgY29tcG9uZW50LnZhbHVlID0gZGlmZi5qb2luKG9sZFN0cmluZy5zbGljZShvbGRQb3MsIG9sZFBvcyArIGNvbXBvbmVudC5jb3VudCkpO1xuICAgICAgb2xkUG9zICs9IGNvbXBvbmVudC5jb3VudDtcblxuICAgICAgLy8gUmV2ZXJzZSBhZGQgYW5kIHJlbW92ZSBzbyByZW1vdmVzIGFyZSBvdXRwdXQgZmlyc3QgdG8gbWF0Y2ggY29tbW9uIGNvbnZlbnRpb25cbiAgICAgIC8vIFRoZSBkaWZmaW5nIGFsZ29yaXRobSBpcyB0aWVkIHRvIGFkZCB0aGVuIHJlbW92ZSBvdXRwdXQgYW5kIHRoaXMgaXMgdGhlIHNpbXBsZXN0XG4gICAgICAvLyByb3V0ZSB0byBnZXQgdGhlIGRlc2lyZWQgb3V0cHV0IHdpdGggbWluaW1hbCBvdmVyaGVhZC5cbiAgICAgIGlmIChjb21wb25lbnRQb3MgJiYgY29tcG9uZW50c1tjb21wb25lbnRQb3MgLSAxXS5hZGRlZCkge1xuICAgICAgICBsZXQgdG1wID0gY29tcG9uZW50c1tjb21wb25lbnRQb3MgLSAxXTtcbiAgICAgICAgY29tcG9uZW50c1tjb21wb25lbnRQb3MgLSAxXSA9IGNvbXBvbmVudHNbY29tcG9uZW50UG9zXTtcbiAgICAgICAgY29tcG9uZW50c1tjb21wb25lbnRQb3NdID0gdG1wO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIFNwZWNpYWwgY2FzZSBoYW5kbGUgZm9yIHdoZW4gb25lIHRlcm1pbmFsIGlzIGlnbm9yZWQgKGkuZS4gd2hpdGVzcGFjZSkuXG4gIC8vIEZvciB0aGlzIGNhc2Ugd2UgbWVyZ2UgdGhlIHRlcm1pbmFsIGludG8gdGhlIHByaW9yIHN0cmluZyBhbmQgZHJvcCB0aGUgY2hhbmdlLlxuICAvLyBUaGlzIGlzIG9ubHkgYXZhaWxhYmxlIGZvciBzdHJpbmcgbW9kZS5cbiAgbGV0IGxhc3RDb21wb25lbnQgPSBjb21wb25lbnRzW2NvbXBvbmVudExlbiAtIDFdO1xuICBpZiAoY29tcG9uZW50TGVuID4gMVxuICAgICAgJiYgdHlwZW9mIGxhc3RDb21wb25lbnQudmFsdWUgPT09ICdzdHJpbmcnXG4gICAgICAmJiAobGFzdENvbXBvbmVudC5hZGRlZCB8fCBsYXN0Q29tcG9uZW50LnJlbW92ZWQpXG4gICAgICAmJiBkaWZmLmVxdWFscygnJywgbGFzdENvbXBvbmVudC52YWx1ZSkpIHtcbiAgICBjb21wb25lbnRzW2NvbXBvbmVudExlbiAtIDJdLnZhbHVlICs9IGxhc3RDb21wb25lbnQudmFsdWU7XG4gICAgY29tcG9uZW50cy5wb3AoKTtcbiAgfVxuXG4gIHJldHVybiBjb21wb25lbnRzO1xufVxuXG5mdW5jdGlvbiBjbG9uZVBhdGgocGF0aCkge1xuICByZXR1cm4geyBuZXdQb3M6IHBhdGgubmV3UG9zLCBjb21wb25lbnRzOiBwYXRoLmNvbXBvbmVudHMuc2xpY2UoMCkgfTtcbn1cbiJdfQ==


/***/ }),

/***/ "./node_modules/diff/lib/diff/character.js":
/*!*************************************************!*\
  !*** ./node_modules/diff/lib/diff/character.js ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/*istanbul ignore start*/


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.diffChars = diffChars;
exports.characterDiff = void 0;

/*istanbul ignore end*/
var
/*istanbul ignore start*/
_base = _interopRequireDefault(__webpack_require__(/*! ./base */ "./node_modules/diff/lib/diff/base.js"))
/*istanbul ignore end*/
;

/*istanbul ignore start*/ function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/*istanbul ignore end*/
var characterDiff = new
/*istanbul ignore start*/
_base
/*istanbul ignore end*/
[
/*istanbul ignore start*/
"default"
/*istanbul ignore end*/
]();

/*istanbul ignore start*/
exports.characterDiff = characterDiff;

/*istanbul ignore end*/
function diffChars(oldStr, newStr, options) {
  return characterDiff.diff(oldStr, newStr, options);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaWZmL2NoYXJhY3Rlci5qcyJdLCJuYW1lcyI6WyJjaGFyYWN0ZXJEaWZmIiwiRGlmZiIsImRpZmZDaGFycyIsIm9sZFN0ciIsIm5ld1N0ciIsIm9wdGlvbnMiLCJkaWZmIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7QUFFTyxJQUFNQSxhQUFhLEdBQUc7QUFBSUM7QUFBQUE7QUFBQUE7QUFBQUE7QUFBQUE7QUFBQUE7QUFBQUE7QUFBQUEsQ0FBSixFQUF0Qjs7Ozs7O0FBQ0EsU0FBU0MsU0FBVCxDQUFtQkMsTUFBbkIsRUFBMkJDLE1BQTNCLEVBQW1DQyxPQUFuQyxFQUE0QztBQUFFLFNBQU9MLGFBQWEsQ0FBQ00sSUFBZCxDQUFtQkgsTUFBbkIsRUFBMkJDLE1BQTNCLEVBQW1DQyxPQUFuQyxDQUFQO0FBQXFEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERpZmYgZnJvbSAnLi9iYXNlJztcblxuZXhwb3J0IGNvbnN0IGNoYXJhY3RlckRpZmYgPSBuZXcgRGlmZigpO1xuZXhwb3J0IGZ1bmN0aW9uIGRpZmZDaGFycyhvbGRTdHIsIG5ld1N0ciwgb3B0aW9ucykgeyByZXR1cm4gY2hhcmFjdGVyRGlmZi5kaWZmKG9sZFN0ciwgbmV3U3RyLCBvcHRpb25zKTsgfVxuIl19


/***/ }),

/***/ "./node_modules/diff/lib/diff/css.js":
/*!*******************************************!*\
  !*** ./node_modules/diff/lib/diff/css.js ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/*istanbul ignore start*/


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.diffCss = diffCss;
exports.cssDiff = void 0;

/*istanbul ignore end*/
var
/*istanbul ignore start*/
_base = _interopRequireDefault(__webpack_require__(/*! ./base */ "./node_modules/diff/lib/diff/base.js"))
/*istanbul ignore end*/
;

/*istanbul ignore start*/ function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/*istanbul ignore end*/
var cssDiff = new
/*istanbul ignore start*/
_base
/*istanbul ignore end*/
[
/*istanbul ignore start*/
"default"
/*istanbul ignore end*/
]();

/*istanbul ignore start*/
exports.cssDiff = cssDiff;

/*istanbul ignore end*/
cssDiff.tokenize = function (value) {
  return value.split(/([{}:;,]|\s+)/);
};

function diffCss(oldStr, newStr, callback) {
  return cssDiff.diff(oldStr, newStr, callback);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaWZmL2Nzcy5qcyJdLCJuYW1lcyI6WyJjc3NEaWZmIiwiRGlmZiIsInRva2VuaXplIiwidmFsdWUiLCJzcGxpdCIsImRpZmZDc3MiLCJvbGRTdHIiLCJuZXdTdHIiLCJjYWxsYmFjayIsImRpZmYiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7OztBQUVPLElBQU1BLE9BQU8sR0FBRztBQUFJQztBQUFBQTtBQUFBQTtBQUFBQTtBQUFBQTtBQUFBQTtBQUFBQTtBQUFBQSxDQUFKLEVBQWhCOzs7Ozs7QUFDUEQsT0FBTyxDQUFDRSxRQUFSLEdBQW1CLFVBQVNDLEtBQVQsRUFBZ0I7QUFDakMsU0FBT0EsS0FBSyxDQUFDQyxLQUFOLENBQVksZUFBWixDQUFQO0FBQ0QsQ0FGRDs7QUFJTyxTQUFTQyxPQUFULENBQWlCQyxNQUFqQixFQUF5QkMsTUFBekIsRUFBaUNDLFFBQWpDLEVBQTJDO0FBQUUsU0FBT1IsT0FBTyxDQUFDUyxJQUFSLENBQWFILE1BQWIsRUFBcUJDLE1BQXJCLEVBQTZCQyxRQUE3QixDQUFQO0FBQWdEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERpZmYgZnJvbSAnLi9iYXNlJztcblxuZXhwb3J0IGNvbnN0IGNzc0RpZmYgPSBuZXcgRGlmZigpO1xuY3NzRGlmZi50b2tlbml6ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZS5zcGxpdCgvKFt7fTo7LF18XFxzKykvKTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBkaWZmQ3NzKG9sZFN0ciwgbmV3U3RyLCBjYWxsYmFjaykgeyByZXR1cm4gY3NzRGlmZi5kaWZmKG9sZFN0ciwgbmV3U3RyLCBjYWxsYmFjayk7IH1cbiJdfQ==


/***/ }),

/***/ "./node_modules/diff/lib/diff/json.js":
/*!********************************************!*\
  !*** ./node_modules/diff/lib/diff/json.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/*istanbul ignore start*/


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.diffJson = diffJson;
exports.canonicalize = canonicalize;
exports.jsonDiff = void 0;

/*istanbul ignore end*/
var
/*istanbul ignore start*/
_base = _interopRequireDefault(__webpack_require__(/*! ./base */ "./node_modules/diff/lib/diff/base.js"))
/*istanbul ignore end*/
;

var
/*istanbul ignore start*/
_line = __webpack_require__(/*! ./line */ "./node_modules/diff/lib/diff/line.js")
/*istanbul ignore end*/
;

/*istanbul ignore start*/ function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*istanbul ignore end*/
var objectPrototypeToString = Object.prototype.toString;
var jsonDiff = new
/*istanbul ignore start*/
_base
/*istanbul ignore end*/
[
/*istanbul ignore start*/
"default"
/*istanbul ignore end*/
](); // Discriminate between two lines of pretty-printed, serialized JSON where one of them has a
// dangling comma and the other doesn't. Turns out including the dangling comma yields the nicest output:

/*istanbul ignore start*/
exports.jsonDiff = jsonDiff;

/*istanbul ignore end*/
jsonDiff.useLongestToken = true;
jsonDiff.tokenize =
/*istanbul ignore start*/
_line
/*istanbul ignore end*/
.
/*istanbul ignore start*/
lineDiff
/*istanbul ignore end*/
.tokenize;

jsonDiff.castInput = function (value) {
  /*istanbul ignore start*/
  var _this$options =
  /*istanbul ignore end*/
  this.options,
      undefinedReplacement = _this$options.undefinedReplacement,
      _this$options$stringi = _this$options.stringifyReplacer,
      stringifyReplacer = _this$options$stringi === void 0 ? function (k, v)
  /*istanbul ignore start*/
  {
    return (
      /*istanbul ignore end*/
      typeof v === 'undefined' ? undefinedReplacement : v
    );
  } : _this$options$stringi;
  return typeof value === 'string' ? value : JSON.stringify(canonicalize(value, null, null, stringifyReplacer), stringifyReplacer, '  ');
};

jsonDiff.equals = function (left, right) {
  return (
    /*istanbul ignore start*/
    _base
    /*istanbul ignore end*/
    [
    /*istanbul ignore start*/
    "default"
    /*istanbul ignore end*/
    ].prototype.equals.call(jsonDiff, left.replace(/,([\r\n])/g, '$1'), right.replace(/,([\r\n])/g, '$1'))
  );
};

function diffJson(oldObj, newObj, options) {
  return jsonDiff.diff(oldObj, newObj, options);
} // This function handles the presence of circular references by bailing out when encountering an
// object that is already on the "stack" of items being processed. Accepts an optional replacer


function canonicalize(obj, stack, replacementStack, replacer, key) {
  stack = stack || [];
  replacementStack = replacementStack || [];

  if (replacer) {
    obj = replacer(key, obj);
  }

  var i;

  for (i = 0; i < stack.length; i += 1) {
    if (stack[i] === obj) {
      return replacementStack[i];
    }
  }

  var canonicalizedObj;

  if ('[object Array]' === objectPrototypeToString.call(obj)) {
    stack.push(obj);
    canonicalizedObj = new Array(obj.length);
    replacementStack.push(canonicalizedObj);

    for (i = 0; i < obj.length; i += 1) {
      canonicalizedObj[i] = canonicalize(obj[i], stack, replacementStack, replacer, key);
    }

    stack.pop();
    replacementStack.pop();
    return canonicalizedObj;
  }

  if (obj && obj.toJSON) {
    obj = obj.toJSON();
  }

  if (
  /*istanbul ignore start*/
  _typeof(
  /*istanbul ignore end*/
  obj) === 'object' && obj !== null) {
    stack.push(obj);
    canonicalizedObj = {};
    replacementStack.push(canonicalizedObj);

    var sortedKeys = [],
        _key;

    for (_key in obj) {
      /* istanbul ignore else */
      if (obj.hasOwnProperty(_key)) {
        sortedKeys.push(_key);
      }
    }

    sortedKeys.sort();

    for (i = 0; i < sortedKeys.length; i += 1) {
      _key = sortedKeys[i];
      canonicalizedObj[_key] = canonicalize(obj[_key], stack, replacementStack, replacer, _key);
    }

    stack.pop();
    replacementStack.pop();
  } else {
    canonicalizedObj = obj;
  }

  return canonicalizedObj;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaWZmL2pzb24uanMiXSwibmFtZXMiOlsib2JqZWN0UHJvdG90eXBlVG9TdHJpbmciLCJPYmplY3QiLCJwcm90b3R5cGUiLCJ0b1N0cmluZyIsImpzb25EaWZmIiwiRGlmZiIsInVzZUxvbmdlc3RUb2tlbiIsInRva2VuaXplIiwibGluZURpZmYiLCJjYXN0SW5wdXQiLCJ2YWx1ZSIsIm9wdGlvbnMiLCJ1bmRlZmluZWRSZXBsYWNlbWVudCIsInN0cmluZ2lmeVJlcGxhY2VyIiwiayIsInYiLCJKU09OIiwic3RyaW5naWZ5IiwiY2Fub25pY2FsaXplIiwiZXF1YWxzIiwibGVmdCIsInJpZ2h0IiwiY2FsbCIsInJlcGxhY2UiLCJkaWZmSnNvbiIsIm9sZE9iaiIsIm5ld09iaiIsImRpZmYiLCJvYmoiLCJzdGFjayIsInJlcGxhY2VtZW50U3RhY2siLCJyZXBsYWNlciIsImtleSIsImkiLCJsZW5ndGgiLCJjYW5vbmljYWxpemVkT2JqIiwicHVzaCIsIkFycmF5IiwicG9wIiwidG9KU09OIiwic29ydGVkS2V5cyIsImhhc093blByb3BlcnR5Iiwic29ydCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7Ozs7Ozs7QUFFQSxJQUFNQSx1QkFBdUIsR0FBR0MsTUFBTSxDQUFDQyxTQUFQLENBQWlCQyxRQUFqRDtBQUdPLElBQU1DLFFBQVEsR0FBRztBQUFJQztBQUFBQTtBQUFBQTtBQUFBQTtBQUFBQTtBQUFBQTtBQUFBQTtBQUFBQSxDQUFKLEVBQWpCLEMsQ0FDUDtBQUNBOzs7Ozs7QUFDQUQsUUFBUSxDQUFDRSxlQUFULEdBQTJCLElBQTNCO0FBRUFGLFFBQVEsQ0FBQ0csUUFBVDtBQUFvQkM7QUFBQUE7QUFBQUE7QUFBQUE7QUFBQUE7QUFBQUE7QUFBQTtBQUFBLENBQVNELFFBQTdCOztBQUNBSCxRQUFRLENBQUNLLFNBQVQsR0FBcUIsVUFBU0MsS0FB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Z0IsR0FBR1AsR0FBbkI7QUFDRDs7QUFDRCxTQUFPTyxnQkFBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERpZmYgZnJvbSAnLi9iYXNlJztcbmltcG9ydCB7bGluZURpZmZ9IGZyb20gJy4vbGluZSc7XG5cbmNvbnN0IG9iamVjdFByb3RvdHlwZVRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuXG5leHBvcnQgY29uc3QganNvbkRpZmYgPSBuZXcgRGlmZigpO1xuLy8gRGlzY3JpbWluYXRlIGJldHdlZW4gdHdvIGxpbmVzIG9mIHByZXR0eS1wcmludGVkLCBzZXJpYWxpemVkIEpTT04gd2hlcmUgb25lIG9mIHRoZW0gaGFzIGFcbi8vIGRhbmdsaW5nIGNvbW1hIGFuZCB0aGUgb3RoZXIgZG9lc24ndC4gVHVybnMgb3V0IGluY2x1ZGluZyB0aGUgZGFuZ2xpbmcgY29tbWEgeWllbGRzIHRoZSBuaWNlc3Qgb3V0cHV0OlxuanNvbkRpZmYudXNlTG9uZ2VzdFRva2VuID0gdHJ1ZTtcblxuanNvbkRpZmYudG9rZW5pemUgPSBsaW5lRGlmZi50b2tlbml6ZTtcbmpzb25EaWZmLmNhc3RJbnB1dCA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIGNvbnN0IHt1bmRlZmluZWRSZXBsYWNlbWVudCwgc3RyaW5naWZ5UmVwbGFjZXIgPSAoaywgdikgPT4gdHlwZW9mIHYgPT09ICd1bmRlZmluZWQnID8gdW5kZWZpbmVkUmVwbGFjZW1lbnQgOiB2fSA9IHRoaXMub3B0aW9ucztcblxuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJyA/IHZhbHVlIDogSlNPTi5zdHJpbmdpZnkoY2Fub25pY2FsaXplKHZhbHVlLCBudWxsLCBudWxsLCBzdHJpbmdpZnlSZXBsYWNlciksIHN0cmluZ2lmeVJlcGxhY2VyLCAnICAnKTtcbn07XG5qc29uRGlmZi5lcXVhbHMgPSBmdW5jdGlvbihsZWZ0LCByaWdodCkge1xuICByZXR1cm4gRGlmZi5wcm90b3R5cGUuZXF1YWxzLmNhbGwoanNvbkRpZmYsIGxlZnQucmVwbGFjZSgvLChbXFxyXFxuXSkvZywgJyQxJyksIHJpZ2h0LnJlcGxhY2UoLywoW1xcclxcbl0pL2csICckMScpKTtcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBkaWZmSnNvbihvbGRPYmosIG5ld09iaiwgb3B0aW9ucykgeyByZXR1cm4ganNvbkRpZmYuZGlmZihvbGRPYmosIG5ld09iaiwgb3B0aW9ucyk7IH1cblxuLy8gVGhpcyBmdW5jdGlvbiBoYW5kbGVzIHRoZSBwcmVzZW5jZSBvZiBjaXJjdWxhciByZWZlcmVuY2VzIGJ5IGJhaWxpbmcgb3V0IHdoZW4gZW5jb3VudGVyaW5nIGFuXG4vLyBvYmplY3QgdGhhdCBpcyBhbHJlYWR5IG9uIHRoZSBcInN0YWNrXCIgb2YgaXRlbXMgYmVpbmcgcHJvY2Vzc2VkLiBBY2NlcHRzIGFuIG9wdGlvbmFsIHJlcGxhY2VyXG5leHBvcnQgZnVuY3Rpb24gY2Fub25pY2FsaXplKG9iaiwgc3RhY2ssIHJlcGxhY2VtZW50U3RhY2ssIHJlcGxhY2VyLCBrZXkpIHtcbiAgc3RhY2sgPSBzdGFjayB8fCBbXTtcbiAgcmVwbGFjZW1lbnRTdGFjayA9IHJlcGxhY2VtZW50U3RhY2sgfHwgW107XG5cbiAgaWYgKHJlcGxhY2VyKSB7XG4gICAgb2JqID0gcmVwbGFjZXIoa2V5LCBvYmopO1xuICB9XG5cbiAgbGV0IGk7XG5cbiAgZm9yIChpID0gMDsgaSA8IHN0YWNrLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgaWYgKHN0YWNrW2ldID09PSBvYmopIHtcbiAgICAgIHJldHVybiByZXBsYWNlbWVudFN0YWNrW2ldO1xuICAgIH1cbiAgfVxuXG4gIGxldCBjYW5vbmljYWxpemVkT2JqO1xuXG4gIGlmICgnW29iamVjdCBBcnJheV0nID09PSBvYmplY3RQcm90b3R5cGVUb1N0cmluZy5jYWxsKG9iaikpIHtcbiAgICBzdGFjay5wdXNoKG9iaik7XG4gICAgY2Fub25pY2FsaXplZE9iaiA9IG5ldyBBcnJheShvYmoubGVuZ3RoKTtcbiAgICByZXBsYWNlbWVudFN0YWNrLnB1c2goY2Fub25pY2FsaXplZE9iaik7XG4gICAgZm9yIChpID0gMDsgaSA8IG9iai5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgY2Fub25pY2FsaXplZE9ialtpXSA9IGNhbm9uaWNhbGl6ZShvYmpbaV0sIHN0YWNrLCByZXBsYWNlbWVudFN0YWNrLCByZXBsYWNlciwga2V5KTtcbiAgICB9XG4gICAgc3RhY2sucG9wKCk7XG4gICAgcmVwbGFjZW1lbnRTdGFjay5wb3AoKTtcbiAgICByZXR1cm4gY2Fub25pY2FsaXplZE9iajtcbiAgfVxuXG4gIGlmIChvYmogJiYgb2JqLnRvSlNPTikge1xuICAgIG9iaiA9IG9iai50b0pTT04oKTtcbiAgfVxuXG4gIGlmICh0eXBlb2Ygb2JqID09PSAnb2JqZWN0JyAmJiBvYmogIT09IG51bGwpIHtcbiAgICBzdGFjay5wdXNoKG9iaik7XG4gICAgY2Fub25pY2FsaXplZE9iaiA9IHt9O1xuICAgIHJlcGxhY2VtZW50U3RhY2sucHVzaChjYW5vbmljYWxpemVkT2JqKTtcbiAgICBsZXQgc29ydGVkS2V5cyA9IFtdLFxuICAgICAgICBrZXk7XG4gICAgZm9yIChrZXkgaW4gb2JqKSB7XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgaWYgKG9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgIHNvcnRlZEtleXMucHVzaChrZXkpO1xuICAgICAgfVxuICAgIH1cbiAgICBzb3J0ZWRLZXlzLnNvcnQoKTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgc29ydGVkS2V5cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAga2V5ID0gc29ydGVkS2V5c1tpXTtcbiAgICAgIGNhbm9uaWNhbGl6ZWRPYmpba2V5XSA9IGNhbm9uaWNhbGl6ZShvYmpba2V5XSwgc3RhY2ssIHJlcGxhY2VtZW50U3RhY2ssIHJlcGxhY2VyLCBrZXkpO1xuICAgIH1cbiAgICBzdGFjay5wb3AoKTtcbiAgICByZXBsYWNlbWVudFN0YWNrLnBvcCgpO1xuICB9IGVsc2Uge1xuICAgIGNhbm9uaWNhbGl6ZWRPYmogPSBvYmo7XG4gIH1cbiAgcmV0dXJuIGNhbm9uaWNhbGl6ZWRPYmo7XG59XG4iXX0=


/***/ }),

/***/ "./node_modules/diff/lib/diff/line.js":
/*!********************************************!*\
  !*** ./node_modules/diff/lib/diff/line.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/*istanbul ignore start*/


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.diffLines = diffLines;
exports.diffTrimmedLines = diffTrimmedLines;
exports.lineDiff = void 0;

/*istanbul ignore end*/
var
/*istanbul ignore start*/
_base = _interopRequireDefault(__webpack_require__(/*! ./base */ "./node_modules/diff/lib/diff/base.js"))
/*istanbul ignore end*/
;

var
/*istanbul ignore start*/
_params = __webpack_require__(/*! ../util/params */ "./node_modules/diff/lib/util/params.js")
/*istanbul ignore end*/
;

/*istanbul ignore start*/ function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/*istanbul ignore end*/
var lineDiff = new
/*istanbul ignore start*/
_base
/*istanbul ignore end*/
[
/*istanbul ignore start*/
"default"
/*istanbul ignore end*/
]();

/*istanbul ignore start*/
exports.lineDiff = lineDiff;

/*istanbul ignore end*/
lineDiff.tokenize = function (value) {
  var retLines = [],
      linesAndNewlines = value.split(/(\n|\r\n)/); // Ignore the final empty token that occurs if the string ends with a new line

  if (!linesAndNewlines[linesAndNewlines.length - 1]) {
    linesAndNewlines.pop();
  } // Merge the content and line separators into single tokens


  for (var i = 0; i < linesAndNewlines.length; i++) {
    var line = linesAndNewlines[i];

    if (i % 2 && !this.options.newlineIsToken) {
      retLines[retLines.length - 1] += line;
    } else {
      if (this.options.ignoreWhitespace) {
        line = line.trim();
      }

      retLines.push(line);
    }
  }

  return retLines;
};

function diffLines(oldStr, newStr, callback) {
  return lineDiff.diff(oldStr, newStr, callback);
}

function diffTrimmedLines(oldStr, newStr, callback) {
  var options =
  /*istanbul ignore start*/
  (0,
  /*istanbul ignore end*/

  /*istanbul ignore start*/
  _params
  /*istanbul ignore end*/
  .
  /*istanbul ignore start*/
  generateOptions)
  /*istanbul ignore end*/
  (callback, {
    ignoreWhitespace: true
  });
  return lineDiff.diff(oldStr, newStr, options);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaWZmL2xpbmUuanMiXSwibmFtZXMiOlsibGluZURpZmYiLCJEaWZmIiwidG9rZW5pemUiLCJ2YWx1ZSIsInJldExpbmVzIiwibGluZXNBbmROZXdsaW5lcyIsInNwbGl0IiwibGVuZ3RoIiwicG9wIiwiaSIsImxpbmUiLCJvcHRpb25zIiwibmV3bGluZUlzVG9rZW4iLCJpZ25vcmVXaGl0ZXNwYWNlIiwidHJpbSIsInB1c2giLCJkaWZmTGluZXMiLCJvbGRTdHIiLCJuZXdTdHIiLCJjYWxsYmFjayIsImRpZmYiLCJkaWZmVHJpbW1lZExpbmVzIiwiZ2VuZXJhdGVPcHRpb25zIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7QUFFTyxJQUFNQSxRQUFRLEdBQUc7QUFBSUM7QUFBQUE7QUFBQUE7QUFBQUE7QUFBQUE7QUFBQUE7QUFBQUE7QUFBQUEsQ0FBSixFQUFqQjs7Ozs7O0FBQ1BELFFBQVEsQ0FBQ0UsUUFBVCxHQUFvQixVQUFTQyxLQUFULEVBQWdCO0FBQ2xDLE1BQUlDLFFBQVEsR0FBRyxFQUFmO0FBQUEsTUFDSUMsZ0JBQWdCLEdBQUdGLEtBQUssQ0FBQ0csS0FBTixDQUFZLFdBQVosQ0FEdkIsQ0FEa0MsQ0FJbEM7O0FBQ0EsTUFBSSxDQUFDRCxnQkFBZ0IsQ0FBQ0EsZ0JBQWdCLENBQUNFLE1BQWpCLEdBQTBCLENBQTNCLENBQXJCLEVBQW9EO0FBQ2xERixJQUFBQSxnQkFBZ0IsQ0FBQ0csR0FBakI7QUFDRCxHQVBpQyxDQVNsQzs7O0FBQ0EsT0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHSixnQkFBZ0IsQ0FBQ0UsTUFBckMsRUFBNkNFLENBQUMsRUFBOUMsRUFBa0Q7QUFDaEQsUUFBSUMsSUFBSSxHQUFHTCxnQkFBZ0IsQ0FBQ0ksQ0FBRCxDQUEzQjs7QUFFQSxRQUFJQSxDQUFDLEdBQUcsQ0FBSixJQUFTLENBQUMsS0FBS0UsT0FBTCxDQUFhQyxjQUEzQixFQUEyQztBQUN6Q1IsTUFBQUEsUUFBUSxDQUFDQSxRQUFRLENBQUNHLE1BQVQsR0FBa0IsQ0FBbkIsQ0FBUixJQUFpQ0csSUFBakM7QUFDRCxLQUZELE1BRU87QUFDTCxVQUFJLEtBQUtDLE9BQUwsQ0FBYUUsZ0JBQWpCLEVBQW1DO0FBQ2pDSCxRQUFBQSxJQUFJLEdBQUdBLElBQUksQ0FBQ0ksSUFBTCxFQUFQO0FBQ0Q7O0FBQ0RWLE1BQUFBLFFBQVEsQ0FBQ1csSUFBVCxDQUFjTCxJQUFkO0FBQ0Q7QUFDRjs7QUFFRCxTQUFPTixRQUFQO0FBQ0QsQ0F4QkQ7O0FBMEJPLFNBQVNZLFNBQVQsQ0FBbUJDLE1BQW5CLEVBQTJCQyxNQUEzQixFQUFtQ0MsUUFBbkMsRUFBNkM7QUFBRSxTQUFPbkIsUUFBUSxDQUFDb0IsSUFBVCxDQUFjSCxNQUFkLEVBQXNCQyxNQUF0QixFQUE4QkMsUUFBOUIsQ0FBUDtBQUFpRDs7QUFDaEcsU0FBU0UsZ0JBQVQsQ0FBMEJKLE1BQTFCLEVBQWtDQyxNQUFsQyxFQUEwQ0MsUUFBMUMsRUFBb0Q7QUFDekQsTUFBSVIsT0FBTztBQUFHO0FBQUE7QUFBQTs7QUFBQVc7QUFBQUE7QUFBQUE7QUFBQUE7QUFBQUE7QUFBQUE7QUFBQTtBQUFBLEdBQWdCSCxRQUFoQixFQUEwQjtBQUFDTixJQUFBQSxnQkFBZ0IsRUFBRTtBQUFuQixHQUExQixDQUFkO0FBQ0EsU0FBT2IsUUFBUSxDQUFDb0IsSUFBVCxDQUFjSCxNQUFkLEVBQXNCQyxNQUF0QixFQUE4QlAsT0FBOUIsQ0FBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERpZmYgZnJvbSAnLi9iYXNlJztcbmltcG9ydCB7Z2VuZXJhdGVPcHRpb25zfSBmcm9tICcuLi91dGlsL3BhcmFtcyc7XG5cbmV4cG9ydCBjb25zdCBsaW5lRGlmZiA9IG5ldyBEaWZmKCk7XG5saW5lRGlmZi50b2tlbml6ZSA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gIGxldCByZXRMaW5lcyA9IFtdLFxuICAgICAgbGluZXNBbmROZXdsaW5lcyA9IHZhbHVlLnNwbGl0KC8oXFxufFxcclxcbikvKTtcblxuICAvLyBJZ25vcmUgdGhlIGZpbmFsIGVtcHR5IHRva2VuIHRoYXQgb2NjdXJzIGlmIHRoZSBzdHJpbmcgZW5kcyB3aXRoIGEgbmV3IGxpbmVcbiAgaWYgKCFsaW5lc0FuZE5ld2xpbmVzW2xpbmVzQW5kTmV3bGluZXMubGVuZ3RoIC0gMV0pIHtcbiAgICBsaW5lc0FuZE5ld2xpbmVzLnBvcCgpO1xuICB9XG5cbiAgLy8gTWVyZ2UgdGhlIGNvbnRlbnQgYW5kIGxpbmUgc2VwYXJhdG9ycyBpbnRvIHNpbmdsZSB0b2tlbnNcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBsaW5lc0FuZE5ld2xpbmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IGxpbmUgPSBsaW5lc0FuZE5ld2xpbmVzW2ldO1xuXG4gICAgaWYgKGkgJSAyICYmICF0aGlzLm9wdGlvbnMubmV3bGluZUlzVG9rZW4pIHtcbiAgICAgIHJldExpbmVzW3JldExpbmVzLmxlbmd0aCAtIDFdICs9IGxpbmU7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuaWdub3JlV2hpdGVzcGFjZSkge1xuICAgICAgICBsaW5lID0gbGluZS50cmltKCk7XG4gICAgICB9XG4gICAgICByZXRMaW5lcy5wdXNoKGxpbmUpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXRMaW5lcztcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBkaWZmTGluZXMob2xkU3RyLCBuZXdTdHIsIGNhbGxiYWNrKSB7IHJldHVybiBsaW5lRGlmZi5kaWZmKG9sZFN0ciwgbmV3U3RyLCBjYWxsYmFjayk7IH1cbmV4cG9ydCBmdW5jdGlvbiBkaWZmVHJpbW1lZExpbmVzKG9sZFN0ciwgbmV3U3RyLCBjYWxsYmFjaykge1xuICBsZXQgb3B0aW9ucyA9IGdlbmVyYXRlT3B0aW9ucyhjYWxsYmFjaywge2lnbm9yZVdoaXRlc3BhY2U6IHRydWV9KTtcbiAgcmV0dXJuIGxpbmVEaWZmLmRpZmYob2xkU3RyLCBuZXdTdHIsIG9wdGlvbnMpO1xufVxuIl19


/***/ }),

/***/ "./node_modules/diff/lib/diff/sentence.js":
/*!************************************************!*\
  !*** ./node_modules/diff/lib/diff/sentence.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/*istanbul ignore start*/


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.diffSentences = diffSentences;
exports.sentenceDiff = void 0;

/*istanbul ignore end*/
var
/*istanbul ignore start*/
_base = _interopRequireDefault(__webpack_require__(/*! ./base */ "./node_modules/diff/lib/diff/base.js"))
/*istanbul ignore end*/
;

/*istanbul ignore start*/ function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/*istanbul ignore end*/
var sentenceDiff = new
/*istanbul ignore start*/
_base
/*istanbul ignore end*/
[
/*istanbul ignore start*/
"default"
/*istanbul ignore end*/
]();

/*istanbul ignore start*/
exports.sentenceDiff = sentenceDiff;

/*istanbul ignore end*/
sentenceDiff.tokenize = function (value) {
  return value.split(/(\S.+?[.!?])(?=\s+|$)/);
};

function diffSentences(oldStr, newStr, callback) {
  return sentenceDiff.diff(oldStr, newStr, callback);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaWZmL3NlbnRlbmNlLmpzIl0sIm5hbWVzIjpbInNlbnRlbmNlRGlmZiIsIkRpZmYiLCJ0b2tlbml6ZSIsInZhbHVlIiwic3BsaXQiLCJkaWZmU2VudGVuY2VzIiwib2xkU3RyIiwibmV3U3RyIiwiY2FsbGJhY2siLCJkaWZmIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7QUFHTyxJQUFNQSxZQUFZLEdBQUc7QUFBSUM7QUFBQUE7QUFBQUE7QUFBQUE7QUFBQUE7QUFBQUE7QUFBQUE7QUFBQUEsQ0FBSixFQUFyQjs7Ozs7O0FBQ1BELFlBQVksQ0FBQ0UsUUFBYixHQUF3QixVQUFTQyxLQUFULEVBQWdCO0FBQ3RDLFNBQU9BLEtBQUssQ0FBQ0MsS0FBTixDQUFZLHVCQUFaLENBQVA7QUFDRCxDQUZEOztBQUlPLFNBQVNDLGFBQVQsQ0FBdUJDLE1BQXZCLEVBQStCQyxNQUEvQixFQUF1Q0MsUUFBdkMsRUFBaUQ7QUFBRSxTQUFPUixZQUFZLENBQUNTLElBQWIsQ0FBa0JILE1BQWxCLEVBQTBCQyxNQUExQixFQUFrQ0MsUUFBbEMsQ0FBUDtBQUFxRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBEaWZmIGZyb20gJy4vYmFzZSc7XG5cblxuZXhwb3J0IGNvbnN0IHNlbnRlbmNlRGlmZiA9IG5ldyBEaWZmKCk7XG5zZW50ZW5jZURpZmYudG9rZW5pemUgPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUuc3BsaXQoLyhcXFMuKz9bLiE/XSkoPz1cXHMrfCQpLyk7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZGlmZlNlbnRlbmNlcyhvbGRTdHIsIG5ld1N0ciwgY2FsbGJhY2spIHsgcmV0dXJuIHNlbnRlbmNlRGlmZi5kaWZmKG9sZFN0ciwgbmV3U3RyLCBjYWxsYmFjayk7IH1cbiJdfQ==


/***/ }),

/***/ "./node_modules/diff/lib/diff/word.js":
/*!********************************************!*\
  !*** ./node_modules/diff/lib/diff/word.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/*istanbul ignore start*/


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.diffWords = diffWords;
exports.diffWordsWithSpace = diffWordsWithSpace;
exports.wordDiff = void 0;

/*istanbul ignore end*/
var
/*istanbul ignore start*/
_base = _interopRequireDefault(__webpack_require__(/*! ./base */ "./node_modules/diff/lib/diff/base.js"))
/*istanbul ignore end*/
;

var
/*istanbul ignore start*/
_params = __webpack_require__(/*! ../util/params */ "./node_modules/diff/lib/util/params.js")
/*istanbul ignore end*/
;

/*istanbul ignore start*/ function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/*istanbul ignore end*/
// Based on https://en.wikipedia.org/wiki/Latin_script_in_Unicode
//
// Ranges and exceptions:
// Latin-1 Supplement, 0080–00FF
//  - U+00D7  × Multiplication sign
//  - U+00F7  ÷ Division sign
// Latin Extended-A, 0100–017F
// Latin Extended-B, 0180–024F
// IPA Extensions, 0250–02AF
// Spacing Modifier Letters, 02B0–02FF
//  - U+02C7  ˇ &#711;  Caron
//  - U+02D8  ˘ &#728;  Breve
//  - U+02D9  ˙ &#729;  Dot Above
//  - U+02DA  ˚ &#730;  Ring Above
//  - U+02DB  ˛ &#731;  Ogonek
//  - U+02DC  ˜ &#732;  Small Tilde
//  - U+02DD  ˝ &#733;  Double Acute Accent
// Latin Extended Additional, 1E00–1EFF
var extendedWordChars = /^[A-Za-z\xC0-\u02C6\u02C8-\u02D7\u02DE-\u02FF\u1E00-\u1EFF]+$/;
var reWhitespace = /\S/;
var wordDiff = new
/*istanbul ignore start*/
_base
/*istanbul ignore end*/
[
/*istanbul ignore start*/
"default"
/*istanbul ignore end*/
]();

/*istanbul ignore start*/
exports.wordDiff = wordDiff;

/*istanbul ignore end*/
wordDiff.equals = function (left, right) {
  if (this.options.ignoreCase) {
    left = left.toLowerCase();
    right = right.toLowerCase();
  }

  return left === right || this.options.ignoreWhitespace && !reWhitespace.test(left) && !reWhitespace.test(right);
};

wordDiff.tokenize = function (value) {
  // All whitespace symbols except newline group into one token, each newline - in separate token
  var tokens = value.split(/([^\S\r\n]+|[()[\]{}'"\r\n]|\b)/); // Join the boundary splits that we do not consider to be boundaries. This is primarily the extended Latin character set.

  for (var i = 0; i < tokens.length - 1; i++) {
    // If we have an empty string in the next field and we have only word chars before and after, merge
    if (!tokens[i + 1] && tokens[i + 2] && extendedWordChars.test(tokens[i]) && extendedWordChars.test(tokens[i + 2])) {
      tokens[i] += tokens[i + 2];
      tokens.splice(i + 1, 2);
      i--;
    }
  }

  return tokens;
};

function diffWords(oldStr, newStr, options) {
  options =
  /*istanbul ignore start*/
  (0,
  /*istanbul ignore end*/

  /*istanbul ignore start*/
  _params
  /*istanbul ignore end*/
  .
  /*istanbul ignore start*/
  generateOptions)
  /*istanbul ignore end*/
  (options, {
    ignoreWhitespace: true
  });
  return wordDiff.diff(oldStr, newStr, options);
}

function diffWordsWithSpace(oldStr, newStr, options) {
  return wordDiff.diff(oldStr, newStr, options);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9kaWZmL3dvcmQuanMiXSwibmFtZXMiOlsiZXh0ZW5kZWRXb3JkQ2hhcnMiLCJyZVdoaXRlc3BhY2UiLCJ3b3JkRGlmZiIsIkRpZmYiLCJlcXVhbHMiLCJsZWZ0IiwicmlnaHQiLCJvcHRpb25zIiwiaWdub3JlQ2FzZSIsInRvTG93ZXJDYXNlIiwiaWdub3JlV2hpdGVzcGFjZSIsInRlc3QiLCJ0b2tlbml6ZSIsInZhbHVlIiwidG9rZW5zIiwic3BsaXQiLCJpIiwibGVuZ3RoIiwic3BsaWNlIiwiZGlmZldvcmRzIiwib2xkU3RyIiwibmV3U3RyIiwiZ2VuZXJhdGVPcHRpb25zIiwiZGlmZiIsImRpZmZXb3Jkc1dpdGhTcGFjZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7Ozs7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBTUEsaUJBQWlCLEdBQUcsK0RBQTFCO0FBRUEsSUFBTUMsWUFBWSxHQUFHLElBQXJCO0FBRU8sSUFBTUMsUUFBUSxHQUFHO0FBQUlDO0FBQUFBO0FBQUFBO0FBQUFBO0FBQUFBO0FBQUFBO0FBQUFBO0FBQUFBLENBQUosRUFBakI7Ozs7OztBQUNQRCxRQUFRLENBQUNFLE1BQVQsR0FBa0IsVUFBU0MsSUFBVCxFQUFlQyxLQUFmLEVBQXNCO0FBQ3RDLE1BQUksS0FBS0MsT0FBTCxDQUFhQyxVQUFqQixFQUE2QjtBQUMzQkgsSUFBQUEsSUFBSSxHQUFHQSxJQUFJLENBQUNJLFdBQUwsRUFBUDtBQUNBSCxJQUFBQSxLQUFLLEdBQUdBLEtBQUssQ0FBQ0csV0FBTixFQUFSO0FBQ0Q7O0FBQ0QsU0FBT0osSUFBSSxLQUFLQyxLQUFULElBQW1CLEtBQUtDLE9BQUwsQ0FBYUcsZ0JBQWIsSUFBaUMsQ0FBQ1QsWUFBWSxDQUFDVSxJQUFiLENBQWtCTixJQUFsQixDQUFsQyxJQUE2RCxDQUFDSixZQUFZLENBQUNVLElBQWIsQ0FBa0JMLEtBQWxCLENBQXhGO0FBQ0QsQ0FORDs7QUFPQUosUUFBUSxDQUFDVSxRQUFULEdBQW9CLFVBQVNDLEtBQVQsRUFBZ0I7QUFDbEM7QUFDQSxNQUFJQyxNQUFNLEdBQUdELEtBQUssQ0FBQ0UsS0FBTixDQUFZLGlDQUFaLENBQWIsQ0FGa0MsQ0FJbEM7O0FBQ0EsT0FBSyxJQUFJQyxDQUFDLEdBQUcsQ0FBYixFQUFnQkEsQ0FBQyxHQUFHRixNQUFNLENBQUNHLE1BQVAsR0FBZ0IsQ0FBcEMsRUFBdUNELENBQUMsRUFBeEMsRUFBNEM7QUFDMUM7QUFDQSxRQUFJLENBQUNGLE1BQU0sQ0FBQ0UsQ0FBQyxHQUFHLENBQUwsQ0FBUCxJQUFrQkYsTUFBTSxDQUFDRSxDQUFDLEdBQUcsQ0FBTCxDQUF4QixJQUNLaEIsaUJBQWlCLENBQUNXLElBQWxCLENBQXVCRyxNQUFNLENBQUNFLENBQUQsQ0FBN0IsQ0FETCxJQUVLaEIsaUJBQWlCLENBQUNXLElBQWxCLENBQXVCRyxNQUFNLENBQUNFLENBQUMsR0FBRyxDQUFMLENBQTdCLENBRlQsRUFFZ0Q7QUFDOUNGLE1BQUFBLE1BQU0sQ0FBQ0UsQ0FBRCxDQUFOLElBQWFGLE1BQU0sQ0FBQ0UsQ0FBQyxHQUFHLENBQUwsQ0FBbkI7QUFDQUYsTUFBQUEsTUFBTSxDQUFDSSxNQUFQLENBQWNGLENBQUMsR0FBRyxDQUFsQixFQUFxQixDQUFyQjtBQUNBQSxNQUFBQSxDQUFDO0FBQ0Y7QUFDRjs7QUFFRCxTQUFPRixNQUFQO0FBQ0QsQ0FqQkQ7O0FBbUJPLFNBQVNLLFNBQVQsQ0FBbUJDLE1BQW5CLEVBQTJCQyxNQUEzQixFQUFtQ2QsT0FBbkMsRUFBNEM7QUFDakRBLEVBQUFBLE9BQU87QUFBRztBQUFBO0FBQUE7O0FBQUFlO0FBQUFBO0FBQUFBO0FBQUFBO0FBQUFBO0FBQUFBO0FBQUE7QUFBQSxHQUFnQmYsT0FBaEIsRUFBeUI7QUFBQ0csSUFBQUEsZ0JBQWdCLEVBQUU7QUFBbkIsR0FBekIsQ0FBVjtBQUNBLFNBQU9SLFFBQVEsQ0FBQ3FCLElBQVQsQ0FBY0gsTUFBZCxFQUFzQkMsTUFBdEIsRUFBOEJkLE9BQTlCLENBQVA7QUFDRDs7QUFFTSxTQUFTaUIsa0JBQVQsQ0FBNEJKLE1BQTVCLEVBQW9DQyxNQUFwQyxFQUE0Q2QsT0FBNUMsRUFBcUQ7QUFDMUQsU0FBT0wsUUFBUSxDQUFDcUIsSUFBVCxDQUFjSCxNQUFkLEVBQXNCQyxNQUF0QixFQUE4QmQsT0FBOUIsQ0FBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERpZmYgZnJvbSAnLi9iYXNlJztcbmltcG9ydCB7Z2VuZXJhdGVPcHRpb25zfSBmcm9tICcuLi91dGlsL3BhcmFtcyc7XG5cbi8vIEJhc2VkIG9uIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0xhdGluX3NjcmlwdF9pbl9Vbmljb2RlXG4vL1xuLy8gUmFuZ2VzIGFuZCBleGNlcHRpb25zOlxuLy8gTGF0aW4tMSBTdXBwbGVtZW50LCAwMDgw4oCTMDBGRlxuLy8gIC0gVSswMEQ3ICDDlyBNdWx0aXBsaWNhdGlvbiBzaWduXG4vLyAgLSBVKzAwRjcgIMO3IERpdmlzaW9uIHNpZ25cbi8vIExhdGluIEV4dGVuZGVkLUEsIDAxMDDigJMwMTdGXG4vLyBMYXRpbiBFeHRlbmRlZC1CLCAwMTgw4oCTMDI0RlxuLy8gSVBBIEV4dGVuc2lvbnMsIDAyNTDigJMwMkFGXG4vLyBTcGFjaW5nIE1vZGlmaWVyIExldHRlcnMsIDAyQjDigJMwMkZGXG4vLyAgLSBVKzAyQzcgIMuHICYjNzExOyAgQ2Fyb25cbi8vICAtIFUrMDJEOCAgy5ggJiM3Mjg7ICBCcmV2ZVxuLy8gIC0gVSswMkQ5ICDLmSAmIzcyOTsgIERvdCBBYm92ZVxuLy8gIC0gVSswMkRBICDLmiAmIzczMDsgIFJpbmcgQWJvdmVcbi8vICAtIFUrMDJEQiAgy5sgJiM3MzE7ICBPZ29uZWtcbi8vICAtIFUrMDJEQyAgy5wgJiM3MzI7ICBTbWFsbCBUaWxkZVxuLy8gIC0gVSswMkREICDLnSAmIzczMzsgIERvdWJsZSBBY3V0ZSBBY2NlbnRcbi8vIExhdGluIEV4dGVuZGVkIEFkZGl0aW9uYWwsIDFFMDDigJMxRUZGXG5jb25zdCBleHRlbmRlZFdvcmRDaGFycyA9IC9eW2EtekEtWlxcdXtDMH0tXFx1e0ZGfVxcdXtEOH0tXFx1e0Y2fVxcdXtGOH0tXFx1ezJDNn1cXHV7MkM4fS1cXHV7MkQ3fVxcdXsyREV9LVxcdXsyRkZ9XFx1ezFFMDB9LVxcdXsxRUZGfV0rJC91O1xuXG5jb25zdCByZVdoaXRlc3BhY2UgPSAvXFxTLztcblxuZXhwb3J0IGNvbnN0IHdvcmREaWZmID0gbmV3IERpZmYoKTtcbndvcmREaWZmLmVxdWFscyA9IGZ1bmN0aW9uKGxlZnQsIHJpZ2h0KSB7XG4gIGlmICh0aGlzLm9wdGlvbnMuaWdub3JlQ2FzZSkge1xuICAgIGxlZnQgPSBsZWZ0LnRvTG93ZXJDYXNlKCk7XG4gICAgcmlnaHQgPSByaWdodC50b0xvd2VyQ2FzZSgpO1xuICB9XG4gIHJldHVybiBsZWZ0ID09PSByaWdodCB8fCAodGhpcy5vcHRpb25zLmlnbm9yZVdoaXRlc3BhY2UgJiYgIXJlV2hpdGVzcGFjZS50ZXN0KGxlZnQpICYmICFyZVdoaXRlc3BhY2UudGVzdChyaWdodCkpO1xufTtcbndvcmREaWZmLnRva2VuaXplID0gZnVuY3Rpb24odmFsdWUpIHtcbiAgLy8gQWxsIHdoaXRlc3BhY2Ugc3ltYm9scyBleGNlcHQgbmV3bGluZSBncm91cCBpbnRvIG9uZSB0b2tlbiwgZWFjaCBuZXdsaW5lIC0gaW4gc2VwYXJhdGUgdG9rZW5cbiAgbGV0IHRva2VucyA9IHZhbHVlLnNwbGl0KC8oW15cXFNcXHJcXG5dK3xbKClbXFxde30nXCJcXHJcXG5dfFxcYikvKTtcblxuICAvLyBKb2luIHRoZSBib3VuZGFyeSBzcGxpdHMgdGhhdCB3ZSBkbyBub3QgY29uc2lkZXIgdG8gYmUgYm91bmRhcmllcy4gVGhpcyBpcyBwcmltYXJpbHkgdGhlIGV4dGVuZGVkIExhdGluIGNoYXJhY3RlciBzZXQuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdG9rZW5zLmxlbmd0aCAtIDE7IGkrKykge1xuICAgIC8vIElmIHdlIGhhdmUgYW4gZW1wdHkgc3RyaW5nIGluIHRoZSBuZXh0IGZpZWxkIGFuZCB3ZSBoYXZlIG9ubHkgd29yZCBjaGFycyBiZWZvcmUgYW5kIGFmdGVyLCBtZXJnZVxuICAgIGlmICghdG9rZW5zW2kgKyAxXSAmJiB0b2tlbnNbaSArIDJdXG4gICAgICAgICAgJiYgZXh0ZW5kZWRXb3JkQ2hhcnMudGVzdCh0b2tlbnNbaV0pXG4gICAgICAgICAgJiYgZXh0ZW5kZWRXb3JkQ2hhcnMudGVzdCh0b2tlbnNbaSArIDJdKSkge1xuICAgICAgdG9rZW5zW2ldICs9IHRva2Vuc1tpICsgMl07XG4gICAgICB0b2tlbnMuc3BsaWNlKGkgKyAxLCAyKTtcbiAgICAgIGktLTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdG9rZW5zO1xufTtcblxuZXhwb3J0IGZ1bmN0aW9uIGRpZmZXb3JkcyhvbGRTdHIsIG5ld1N0ciwgb3B0aW9ucykge1xuICBvcHRpb25zID0gZ2VuZXJhdGVPcHRpb25zKG9wdGlvbnMsIHtpZ25vcmVXaGl0ZXNwYWNlOiB0cnVlfSk7XG4gIHJldHVybiB3b3JkRGlmZi5kaWZmKG9sZFN0ciwgbmV3U3RyLCBvcHRpb25zKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRpZmZXb3Jkc1dpdGhTcGFjZShvbGRTdHIsIG5ld1N0ciwgb3B0aW9ucykge1xuICByZXR1cm4gd29yZERpZmYuZGlmZihvbGRTdHIsIG5ld1N0ciwgb3B0aW9ucyk7XG59XG4iXX0=


/***/ }),

/***/ "./node_modules/diff/lib/index.js":
/*!****************************************!*\
  !*** ./node_modules/diff/lib/index.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/*istanbul ignore start*/


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "Diff", ({
  enumerable: true,
  get: function get() {
    return _base["default"];
  }
}));
Object.defineProperty(exports, "diffChars", ({
  enumerable: true,
  get: function get() {
    return _character.diffChars;
  }
}));
Object.defineProperty(exports, "diffWords", ({
  enumerable: true,
  get: function get() {
    return _word.diffWords;
  }
}));
Object.defineProperty(exports, "diffWordsWithSpace", ({
  enumerable: true,
  get: function get() {
    return _word.diffWordsWithSpace;
  }
}));
Object.defineProperty(exports, "diffLines", ({
  enumerable: true,
  get: function get() {
    return _line.diffLines;
  }
}));
Object.defineProperty(exports, "diffTrimmedLines", ({
  enumerable: true,
  get: function get() {
    return _line.diffTrimmedLines;
  }
}));
Object.defineProperty(exports, "diffSentences", ({
  enumerable: true,
  get: function get() {
    return _sentence.diffSentences;
  }
}));
Object.defineProperty(exports, "diffCss", ({
  enumerable: true,
  get: function get() {
    return _css.diffCss;
  }
}));
Object.defineProperty(exports, "diffJson", ({
  enumerable: true,
  get: function get() {
    return _json.diffJson;
  }
}));
Object.defineProperty(exports, "canonicalize", ({
  enumerable: true,
  get: function get() {
    return _json.canonicalize;
  }
}));
Object.defineProperty(exports, "diffArrays", ({
  enumerable: true,
  get: function get() {
    return _array.diffArrays;
  }
}));
Object.defineProperty(exports, "applyPatch", ({
  enumerable: true,
  get: function get() {
    return _apply.applyPatch;
  }
}));
Object.defineProperty(exports, "applyPatches", ({
  enumerable: true,
  get: function get() {
    return _apply.applyPatches;
  }
}));
Object.defineProperty(exports, "parsePatch", ({
  enumerable: true,
  get: function get() {
    return _parse.parsePatch;
  }
}));
Object.defineProperty(exports, "merge", ({
  enumerable: true,
  get: function get() {
    return _merge.merge;
  }
}));
Object.defineProperty(exports, "structuredPatch", ({
  enumerable: true,
  get: function get() {
    return _create.structuredPatch;
  }
}));
Object.defineProperty(exports, "createTwoFilesPatch", ({
  enumerable: true,
  get: function get() {
    return _create.createTwoFilesPatch;
  }
}));
Object.defineProperty(exports, "createPatch", ({
  enumerable: true,
  get: function get() {
    return _create.createPatch;
  }
}));
Object.defineProperty(exports, "convertChangesToDMP", ({
  enumerable: true,
  get: function get() {
    return _dmp.convertChangesToDMP;
  }
}));
Object.defineProperty(exports, "convertChangesToXML", ({
  enumerable: true,
  get: function get() {
    return _xml.convertChangesToXML;
  }
}));

/*istanbul ignore end*/
var
/*istanbul ignore start*/
_base = _interopRequireDefault(__webpack_require__(/*! ./diff/base */ "./node_modules/diff/lib/diff/base.js"))
/*istanbul ignore end*/
;

var
/*istanbul ignore start*/
_character = __webpack_require__(/*! ./diff/character */ "./node_modules/diff/lib/diff/character.js")
/*istanbul ignore end*/
;

var
/*istanbul ignore start*/
_word = __webpack_require__(/*! ./diff/word */ "./node_modules/diff/lib/diff/word.js")
/*istanbul ignore end*/
;

var
/*istanbul ignore start*/
_line = __webpack_require__(/*! ./diff/line */ "./node_modules/diff/lib/diff/line.js")
/*istanbul ignore end*/
;

var
/*istanbul ignore start*/
_sentence = __webpack_require__(/*! ./diff/sentence */ "./node_modules/diff/lib/diff/sentence.js")
/*istanbul ignore end*/
;

var
/*istanbul ignore start*/
_css = __webpack_require__(/*! ./diff/css */ "./node_modules/diff/lib/diff/css.js")
/*istanbul ignore end*/
;

var
/*istanbul ignore start*/
_json = __webpack_require__(/*! ./diff/json */ "./node_modules/diff/lib/diff/json.js")
/*istanbul ignore end*/
;

var
/*istanbul ignore start*/
_array = __webpack_require__(/*! ./diff/array */ "./node_modules/diff/lib/diff/array.js")
/*istanbul ignore end*/
;

var
/*istanbul ignore start*/
_apply = __webpack_require__(/*! ./patch/apply */ "./node_modules/diff/lib/patch/apply.js")
/*istanbul ignore end*/
;

var
/*istanbul ignore start*/
_parse = __webpack_require__(/*! ./patch/parse */ "./node_modules/diff/lib/patch/parse.js")
/*istanbul ignore end*/
;

var
/*istanbul ignore start*/
_merge = __webpack_require__(/*! ./patch/merge */ "./node_modules/diff/lib/patch/merge.js")
/*istanbul ignore end*/
;

var
/*istanbul ignore start*/
_create = __webpack_require__(/*! ./patch/create */ "./node_modules/diff/lib/patch/create.js")
/*istanbul ignore end*/
;

var
/*istanbul ignore start*/
_dmp = __webpack_require__(/*! ./convert/dmp */ "./node_modules/diff/lib/convert/dmp.js")
/*istanbul ignore end*/
;

var
/*istanbul ignore start*/
_xml = __webpack_require__(/*! ./convert/xml */ "./node_modules/diff/lib/convert/xml.js")
/*istanbul ignore end*/
;

/*istanbul ignore start*/ function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/*istanbul ignore end*/
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWdCQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBRUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUVBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBRUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFDQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFFQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQUNBO0FBQUE7QUFBQTtBQUFBO0FBQUEiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBTZWUgTElDRU5TRSBmaWxlIGZvciB0ZXJtcyBvZiB1c2UgKi9cblxuLypcbiAqIFRleHQgZGlmZiBpbXBsZW1lbnRhdGlvbi5cbiAqXG4gKiBUaGlzIGxpYnJhcnkgc3VwcG9ydHMgdGhlIGZvbGxvd2luZyBBUElTOlxuICogSnNEaWZmLmRpZmZDaGFyczogQ2hhcmFjdGVyIGJ5IGNoYXJhY3RlciBkaWZmXG4gKiBKc0RpZmYuZGlmZldvcmRzOiBXb3JkIChhcyBkZWZpbmVkIGJ5IFxcYiByZWdleCkgZGlmZiB3aGljaCBpZ25vcmVzIHdoaXRlc3BhY2VcbiAqIEpzRGlmZi5kaWZmTGluZXM6IExpbmUgYmFzZWQgZGlmZlxuICpcbiAqIEpzRGlmZi5kaWZmQ3NzOiBEaWZmIHRhcmdldGVkIGF0IENTUyBjb250ZW50XG4gKlxuICogVGhlc2UgbWV0aG9kcyBhcmUgYmFzZWQgb24gdGhlIGltcGxlbWVudGF0aW9uIHByb3Bvc2VkIGluXG4gKiBcIkFuIE8oTkQpIERpZmZlcmVuY2UgQWxnb3JpdGhtIGFuZCBpdHMgVmFyaWF0aW9uc1wiIChNeWVycywgMTk4NikuXG4gKiBodHRwOi8vY2l0ZXNlZXJ4LmlzdC5wc3UuZWR1L3ZpZXdkb2Mvc3VtbWFyeT9kb2k9MTAuMS4xLjQuNjkyN1xuICovXG5pbXBvcnQgRGlmZiBmcm9tICcuL2RpZmYvYmFzZSc7XG5pbXBvcnQge2RpZmZDaGFyc30gZnJvbSAnLi9kaWZmL2NoYXJhY3Rlcic7XG5pbXBvcnQge2RpZmZXb3JkcywgZGlmZldvcmRzV2l0aFNwYWNlfSBmcm9tICcuL2RpZmYvd29yZCc7XG5pbXBvcnQge2RpZmZMaW5lcywgZGlmZlRyaW1tZWRMaW5lc30gZnJvbSAnLi9kaWZmL2xpbmUnO1xuaW1wb3J0IHtkaWZmU2VudGVuY2VzfSBmcm9tICcuL2RpZmYvc2VudGVuY2UnO1xuXG5pbXBvcnQge2RpZmZDc3N9IGZyb20gJy4vZGlmZi9jc3MnO1xuaW1wb3J0IHtkaWZmSnNvbiwgY2Fub25pY2FsaXplfSBmcm9tICcuL2RpZmYvanNvbic7XG5cbmltcG9ydCB7ZGlmZkFycmF5c30gZnJvbSAnLi9kaWZmL2FycmF5JztcblxuaW1wb3J0IHthcHBseVBhdGNoLCBhcHBseVBhdGNoZXN9IGZyb20gJy4vcGF0Y2gvYXBwbHknO1xuaW1wb3J0IHtwYXJzZVBhdGNofSBmcm9tICcuL3BhdGNoL3BhcnNlJztcbmltcG9ydCB7bWVyZ2V9IGZyb20gJy4vcGF0Y2gvbWVyZ2UnO1xuaW1wb3J0IHtzdHJ1Y3R1cmVkUGF0Y2gsIGNyZWF0ZVR3b0ZpbGVzUGF0Y2gsIGNyZWF0ZVBhdGNofSBmcm9tICcuL3BhdGNoL2NyZWF0ZSc7XG5cbmltcG9ydCB7Y29udmVydENoYW5nZXNUb0RNUH0gZnJvbSAnLi9jb252ZXJ0L2RtcCc7XG5pbXBvcnQge2NvbnZlcnRDaGFuZ2VzVG9YTUx9IGZyb20gJy4vY29udmVydC94bWwnO1xuXG5leHBvcnQge1xuICBEaWZmLFxuXG4gIGRpZmZDaGFycyxcbiAgZGlmZldvcmRzLFxuICBkaWZmV29yZHNXaXRoU3BhY2UsXG4gIGRpZmZMaW5lcyxcbiAgZGlmZlRyaW1tZWRMaW5lcyxcbiAgZGlmZlNlbnRlbmNlcyxcblxuICBkaWZmQ3NzLFxuICBkaWZmSnNvbixcblxuICBkaWZmQXJyYXlzLFxuXG4gIHN0cnVjdHVyZWRQYXRjaCxcbiAgY3JlYXRlVHdvRmlsZXNQYXRjaCxcbiAgY3JlYXRlUGF0Y2gsXG4gIGFwcGx5UGF0Y2gsXG4gIGFwcGx5UGF0Y2hlcyxcbiAgcGFyc2VQYXRjaCxcbiAgbWVyZ2UsXG4gIGNvbnZlcnRDaGFuZ2VzVG9ETVAsXG4gIGNvbnZlcnRDaGFuZ2VzVG9YTUwsXG4gIGNhbm9uaWNhbGl6ZVxufTtcbiJdfQ==


/***/ }),

/***/ "./node_modules/diff/lib/patch/apply.js":
/*!**********************************************!*\
  !*** ./node_modules/diff/lib/patch/apply.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/*istanbul ignore start*/


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.applyPatch = applyPatch;
exports.applyPatches = applyPatches;

/*istanbul ignore end*/
var
/*istanbul ignore start*/
_parse = __webpack_require__(/*! ./parse */ "./node_modules/diff/lib/patch/parse.js")
/*istanbul ignore end*/
;

var
/*istanbul ignore start*/
_distanceIterator = _interopRequireDefault(__webpack_require__(/*! ../util/distance-iterator */ "./node_modules/diff/lib/util/distance-iterator.js"))
/*istanbul ignore end*/
;

/*istanbul ignore start*/ function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/*istanbul ignore end*/
function applyPatch(source, uniDiff) {
  /*istanbul ignore start*/
  var
  /*istanbul ignore end*/
  options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  if (typeof uniDiff === 'string') {
    uniDiff =
    /*istanbul ignore start*/
    (0,
    /*istanbul ignore end*/

    /*istanbul ignore start*/
    _parse
    /*istanbul ignore end*/
    .
    /*istanbul ignore start*/
    parsePatch)
    /*istanbul ignore end*/
    (uniDiff);
  }

  if (Array.isArray(uniDiff)) {
    if (uniDiff.length > 1) {
      throw new Error('applyPatch only works with a single input.');
    }

    uniDiff = uniDiff[0];
  } // Apply the diff to the input


  var lines = source.split(/\r\n|[\n\v\f\r\x85]/),
      delimiters = source.match(/\r\n|[\n\v\f\r\x85]/g) || [],
      hunks = uniDiff.hunks,
      compareLine = options.compareLine || function (lineNumber, line, operation, patchContent)
  /*istanbul ignore start*/
  {
    return (
      /*istanbul ignore end*/
      line === patchContent
    );
  },
      errorCount = 0,
      fuzzFactor = options.fuzzFactor || 0,
      minLine = 0,
      offset = 0,
      removeEOFNL,
      addEOFNL;
  /**
   * Checks if the hunk exactly fits on the provided location
   */


  function hunkFits(hunk, toPos) {
    for (var j = 0; j < hunk.lines.length; j++) {
      var line = hunk.lines[j],
          operation = line.length > 0 ? line[0] : ' ',
          content = line.length > 0 ? line.substr(1) : line;

      if (operation === ' ' || operation === '-') {
        // Context sanity check
        if (!compareLine(toPos + 1, lines[toPos], operation, content)) {
          errorCount++;

          if (errorCount > fuzzFactor) {
            return false;
          }
        }

        toPos++;
      }
    }

    return true;
  } // Search best fit offsets for each hunk based on the previous ones


  for (var i = 0; i < hunks.length; i++) {
    var hunk = hunks[i],
        maxLine = lines.length - hunk.oldLines,
        localOffset = 0,
        toPos = offset + hunk.oldStart - 1;
    var iterator =
    /*istanbul ignore start*/
    (0,
    /*istanbul ignore end*/

    /*istanbul ignore start*/
    _distanceIterator
    /*istanbul ignore end*/
    [
    /*istanbul ignore start*/
    "default"
    /*istanbul ignore end*/
    ])(toPos, minLine, maxLine);

    for (; localOffset !== undefined; localOffset = iterator()) {
      if (hunkFits(hunk, toPos + localOffset)) {
        hunk.offset = offset += localOffset;
        break;
      }
    }

    if (localOffset === undefined) {
      return false;
    } // Set lower text limit to end of the current hunk, so next ones don't try
    // to fit over already patched text


    minLine = hunk.offset + hunk.oldStart + hunk.oldLines;
  } // Apply patch hunks


  var diffOffset = 0;

  for (var _i = 0; _i < hunks.length; _i++) {
    var _hunk = hunks[_i],
        _toPos = _hunk.oldStart + _hunk.offset + diffOffset - 1;

    diffOffset += _hunk.newLines - _hunk.oldLines;

    for (var j = 0; j < _hunk.lines.length; j++) {
      var line = _hunk.lines[j],
          operation = line.length > 0 ? line[0] : ' ',
          content = line.length > 0 ? line.substr(1) : line,
          delimiter = _hunk.linedelimiters[j];

      if (operation === ' ') {
        _toPos++;
      } else if (operation === '-') {
        lines.splice(_toPos, 1);
        delimiters.splice(_toPos, 1);
        /* istanbul ignore else */
      } else if (operation === '+') {
        lines.splice(_toPos, 0, content);
        delimiters.splice(_toPos, 0, delimiter);
        _toPos++;
      } else if (operation === '\\') {
        var previousOperation = _hunk.lines[j - 1] ? _hunk.lines[j - 1][0] : null;

        if (previousOperation === '+') {
          removeEOFNL = true;
        } else if (previousOperation === '-') {
          addEOFNL = true;
        }
      }
    }
  } // Handle EOFNL insertion/removal


  if (removeEOFNL) {
    while (!lines[lines.length - 1]) {
      lines.pop();
      delimiters.pop();
    }
  } else if (addEOFNL) {
    lines.push('');
    delimiters.push('\n');
  }

  for (var _k = 0; _k < lines.length - 1; _k++) {
    lines[_k] = lines[_k] + delimiters[_k];
  }

  return lines.join('');
} // Wrapper that supports multiple file patches via callbacks.


function applyPatches(uniDiff, options) {
  if (typeof uniDiff === 'string') {
    uniDiff =
    /*istanbul ignore start*/
    (0,
    /*istanbul ignore end*/

    /*istanbul ignore start*/
    _parse
    /*istanbul ignore end*/
    .
    /*istanbul ignore start*/
    parsePatch)
    /*istanbul ignore end*/
    (uniDiff);
  }

  var currentIndex = 0;

  function processIndex() {
    var index = uniDiff[currentIndex++];

    if (!index) {
      return options.complete();
    }

    options.loadFile(index, function (err, data) {
      if (err) {
        return options.complete(err);
      }

      var updatedContent = applyPatch(data, index, options);
      options.patched(index, updatedContent, function (err) {
        if (err) {
          return options.complete(err);
        }

        processIndex();
      });
    });
  }

  processIndex();
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wYXRjaC9hcHBseS5qcyJdLCJuYW1lcyI6WyJhcHBseVBhdGNoIiwic291cmNlIiwidW5pRGlmZiIsIm9wdGlvbnMiLCJwYXJzZVBhdGNoIiwiQXJyYXkiLCJpc0FycmF5IiwibGVuZ3RoIiwiRXJyb3IiLCJsaW5lcyIsInNwbGl0IiwiZGVsaW1pdGVycyIsIm1hdGNoIiwiaHVua3MiLCJjb21wYXJlTGluZSIsImxpbmVOdW1iZXIiLCJsaW5lIiwib3BlcmF0aW9uIiwicGF0Y2hDb250ZW50IiwiZXJyb3JDb3VudCIsImZ1enpGYWN0b3IiLCJtaW5MaW5lIiwib2Zmc2V0IiwicmVtb3ZlRU9GTkwiLCJhZGRFT0ZOTCIsImh1bmtGaXRzIiwiaHVuayIsInRvUG9zIiwiaiIsImNvbnRlbnQiLCJzdWJzdHIiLCJpIiwibWF4TGluZSIsIm9sZExpbmVzIiwibG9jYWxPZmZzZXQiLCJvbGRTdGFydCIsIml0ZXJhdG9yIiwiZGlzdGFuY2VJdGVyYXRvciIsInVuZGVmaW5lZCIsImRpZmZPZmZzZXQiLCJuZXdMaW5lcyIsImRlbGltaXRlciIsImxpbmVkZWxpbWl0ZXJzIiwic3BsaWNlIiwicHJldmlvdXNPcGVyYXRpb24iLCJwb3AiLCJwdXNoIiwiX2siLCJqb2luIiwiYXBwbHlQYXRjaGVzIiwiY3VycmVudEluZGV4IiwicHJvY2Vzc0luZGV4IiwiaW5kZXgiLCJjb21wbGV0ZSIsImxvYWRGaWxlIiwiZXJyIiwiZGF0YSIsInVwZGF0ZWRDb250ZW50IiwicGF0Y2hlZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTs7Ozs7QUFFTyxTQUFTQSxVQUFULENBQW9CQyxNQUFwQixFQUE0QkMsT0FBNUIsRUFBbUQ7QUFBQTtBQUFBO0FBQUE7QUFBZEMsRUFBQUEsT0FBYyx1RUFBSixFQUFJOztBQUN4RCxNQUFJLE9BQU9ELE9BQVAsS0FBbUIsUUFBdkIsRUFBaUM7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QUNEOztBQUVELE1BQUlnRCxZQUFZLEdBQUcsQ0FBbkI7O0FBQ0EsV0FBU0MsWUFBVCxHQUF3QjtBQUN0QixRQUFJQyxLQUFLLEdBQUdsRCxPQUFPLENBQUNnRCxZQUFZLEVBQWIsQ0FBbkI7O0FBQ0EsUUFBSSxDQUFDRSxLQUFMLEVBQVk7QUFDVixhQUFPakQsT0FBTyxDQUFDa0QsUUFBUixFQUFQO0FBQ0Q7O0FBRURsRCxJQUFBQSxPQUFPLENBQUNtRCxRQUFSLENBQWlCRixLQUFqQixFQUF3QixVQUFTRyxHQUFULEVBQWNDLElBQWQsRUFBb0I7QUFDMUMsVUFBSUQsR0FBSixFQUFTO0FBQ1AsZUFBT3BELE9BQU8sQ0FBQ2tELFFBQVIsQ0FBaUJFLEdBQWpCLENBQVA7QUFDRDs7QUFFRCxVQUFJRSxjQUFjLEdBQUd6RCxVQUFVLENBQUN3RCxJQUFELEVBQU9KLEtBQVAsRUFBY2pELE9BQWQsQ0FBL0I7QUFDQUEsTUFBQUEsT0FBTyxDQUFDdUQsT0FBUixDQUFnQk4sS0FBaEIsRUFBdUJLLGNBQXZCLEVBQXVDLFVBQVNGLEdBQVQsRUFBYztBQUNuRCxZQUFJQSxHQUFKLEVBQVM7QUFDUCxpQkFBT3BELE9BQU8sQ0FBQ2tELFFBQVIsQ0FBaUJFLEdBQWpCLENBQVA7QUFDRDs7QUFFREosUUFBQUEsWUFBWTtBQUNiLE9BTkQ7QUFPRCxLQWJEO0FBY0Q7O0FBQ0RBLEVBQUFBLFlBQVk7QUFDYiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7cGFyc2VQYXRjaH0gZnJvbSAnLi9wYXJzZSc7XG5pbXBvcnQgZGlzdGFuY2VJdGVyYXRvciBmcm9tICcuLi91dGlsL2Rpc3RhbmNlLWl0ZXJhdG9yJztcblxuZXhwb3J0IGZ1bmN0aW9uIGFwcGx5UGF0Y2goc291cmNlLCB1bmlEaWZmLCBvcHRpb25zID0ge30pIHtcbiAgaWYgKHR5cGVvZiB1bmlEaWZmID09PSAnc3RyaW5nJykge1xuICAgIHVuaURpZmYgPSBwYXJzZVBhdGNoKHVuaURpZmYpO1xuICB9XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkodW5pRGlmZikpIHtcbiAgICBpZiAodW5pRGlmZi5sZW5ndGggPiAxKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2FwcGx5UGF0Y2ggb25seSB3b3JrcyB3aXRoIGEgc2luZ2xlIGlucHV0LicpO1xuICAgIH1cblxuICAgIHVuaURpZmYgPSB1bmlEaWZmWzBdO1xuICB9XG5cbiAgLy8gQXBwbHkgdGhlIGRpZmYgdG8gdGhlIGlucHV0XG4gIGxldCBsaW5lcyA9IHNvdXJjZS5zcGxpdCgvXFxyXFxufFtcXG5cXHZcXGZcXHJcXHg4NV0vKSxcbiAgICAgIGRlbGltaXRlcnMgPSBzb3VyY2UubWF0Y2goL1xcclxcbnxbXFxuXFx2XFxmXFxyXFx4ODVdL2cpIHx8IFtdLFxuICAgICAgaHVua3MgPSB1bmlEaWZmLmh1bmtzLFxuXG4gICAgICBjb21wYXJlTGluZSA9IG9wdGlvbnMuY29tcGFyZUxpbmUgfHwgKChsaW5lTnVtYmVyLCBsaW5lLCBvcGVyYXRpb24sIHBhdGNoQ29udGVudCkgPT4gbGluZSA9PT0gcGF0Y2hDb250ZW50KSxcbiAgICAgIGVycm9yQ291bnQgPSAwLFxuICAgICAgZnV6ekZhY3RvciA9IG9wdGlvbnMuZnV6ekZhY3RvciB8fCAwLFxuICAgICAgbWluTGluZSA9IDAsXG4gICAgICBvZmZzZXQgPSAwLFxuXG4gICAgICByZW1vdmVFT0ZOTCxcbiAgICAgIGFkZEVPRk5MO1xuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIGh1bmsgZXhhY3RseSBmaXRzIG9uIHRoZSBwcm92aWRlZCBsb2NhdGlvblxuICAgKi9cbiAgZnVuY3Rpb24gaHVua0ZpdHMoaHVuaywgdG9Qb3MpIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IGh1bmsubGluZXMubGVuZ3RoOyBqKyspIHtcbiAgICAgIGxldCBsaW5lID0gaHVuay5saW5lc1tqXSxcbiAgICAgICAgICBvcGVyYXRpb24gPSAobGluZS5sZW5ndGggPiAwID8gbGluZVswXSA6ICcgJyksXG4gICAgICAgICAgY29udGVudCA9IChsaW5lLmxlbmd0aCA+IDAgPyBsaW5lLnN1YnN0cigxKSA6IGxpbmUpO1xuXG4gICAgICBpZiAob3BlcmF0aW9uID09PSAnICcgfHwgb3BlcmF0aW9uID09PSAnLScpIHtcbiAgICAgICAgLy8gQ29udGV4dCBzYW5pdHkgY2hlY2tcbiAgICAgICAgaWYgKCFjb21wYXJlTGluZSh0b1BvcyArIDEsIGxpbmVzW3RvUG9zXSwgb3BlcmF0aW9uLCBjb250ZW50KSkge1xuICAgICAgICAgIGVycm9yQ291bnQrKztcblxuICAgICAgICAgIGlmIChlcnJvckNvdW50ID4gZnV6ekZhY3Rvcikge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0b1BvcysrO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgLy8gU2VhcmNoIGJlc3QgZml0IG9mZnNldHMgZm9yIGVhY2ggaHVuayBiYXNlZCBvbiB0aGUgcHJldmlvdXMgb25lc1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGh1bmtzLmxlbmd0aDsgaSsrKSB7XG4gICAgbGV0IGh1bmsgPSBodW5rc1tpXSxcbiAgICAgICAgbWF4TGluZSA9IGxpbmVzLmxlbmd0aCAtIGh1bmsub2xkTGluZXMsXG4gICAgICAgIGxvY2FsT2Zmc2V0ID0gMCxcbiAgICAgICAgdG9Qb3MgPSBvZmZzZXQgKyBodW5rLm9sZFN0YXJ0IC0gMTtcblxuICAgIGxldCBpdGVyYXRvciA9IGRpc3RhbmNlSXRlcmF0b3IodG9Qb3MsIG1pbkxpbmUsIG1heExpbmUpO1xuXG4gICAgZm9yICg7IGxvY2FsT2Zmc2V0ICE9PSB1bmRlZmluZWQ7IGxvY2FsT2Zmc2V0ID0gaXRlcmF0b3IoKSkge1xuICAgICAgaWYgKGh1bmtGaXRzKGh1bmssIHRvUG9zICsgbG9jYWxPZmZzZXQpKSB7XG4gICAgICAgIGh1bmsub2Zmc2V0ID0gb2Zmc2V0ICs9IGxvY2FsT2Zmc2V0O1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobG9jYWxPZmZzZXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vIFNldCBsb3dlciB0ZXh0IGxpbWl0IHRvIGVuZCBvZiB0aGUgY3VycmVudCBodW5rLCBzbyBuZXh0IG9uZXMgZG9uJ3QgdHJ5XG4gICAgLy8gdG8gZml0IG92ZXIgYWxyZWFkeSBwYXRjaGVkIHRleHRcbiAgICBtaW5MaW5lID0gaHVuay5vZmZzZXQgKyBodW5rLm9sZFN0YXJ0ICsgaHVuay5vbGRMaW5lcztcbiAgfVxuXG4gIC8vIEFwcGx5IHBhdGNoIGh1bmtzXG4gIGxldCBkaWZmT2Zmc2V0ID0gMDtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBodW5rcy5sZW5ndGg7IGkrKykge1xuICAgIGxldCBodW5rID0gaHVua3NbaV0sXG4gICAgICAgIHRvUG9zID0gaHVuay5vbGRTdGFydCArIGh1bmsub2Zmc2V0ICsgZGlmZk9mZnNldCAtIDE7XG4gICAgZGlmZk9mZnNldCArPSBodW5rLm5ld0xpbmVzIC0gaHVuay5vbGRMaW5lcztcblxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgaHVuay5saW5lcy5sZW5ndGg7IGorKykge1xuICAgICAgbGV0IGxpbmUgPSBodW5rLmxpbmVzW2pdLFxuICAgICAgICAgIG9wZXJhdGlvbiA9IChsaW5lLmxlbmd0aCA+IDAgPyBsaW5lWzBdIDogJyAnKSxcbiAgICAgICAgICBjb250ZW50ID0gKGxpbmUubGVuZ3RoID4gMCA/IGxpbmUuc3Vic3RyKDEpIDogbGluZSksXG4gICAgICAgICAgZGVsaW1pdGVyID0gaHVuay5saW5lZGVsaW1pdGVyc1tqXTtcblxuICAgICAgaWYgKG9wZXJhdGlvbiA9PT0gJyAnKSB7XG4gICAgICAgIHRvUG9zKys7XG4gICAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PT0gJy0nKSB7XG4gICAgICAgIGxpbmVzLnNwbGljZSh0b1BvcywgMSk7XG4gICAgICAgIGRlbGltaXRlcnMuc3BsaWNlKHRvUG9zLCAxKTtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PT0gJysnKSB7XG4gICAgICAgIGxpbmVzLnNwbGljZSh0b1BvcywgMCwgY29udGVudCk7XG4gICAgICAgIGRlbGltaXRlcnMuc3BsaWNlKHRvUG9zLCAwLCBkZWxpbWl0ZXIpO1xuICAgICAgICB0b1BvcysrO1xuICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09ICdcXFxcJykge1xuICAgICAgICBsZXQgcHJldmlvdXNPcGVyYXRpb24gPSBodW5rLmxpbmVzW2ogLSAxXSA/IGh1bmsubGluZXNbaiAtIDFdWzBdIDogbnVsbDtcbiAgICAgICAgaWYgKHByZXZpb3VzT3BlcmF0aW9uID09PSAnKycpIHtcbiAgICAgICAgICByZW1vdmVFT0ZOTCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAocHJldmlvdXNPcGVyYXRpb24gPT09ICctJykge1xuICAgICAgICAgIGFkZEVPRk5MID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC8vIEhhbmRsZSBFT0ZOTCBpbnNlcnRpb24vcmVtb3ZhbFxuICBpZiAocmVtb3ZlRU9GTkwpIHtcbiAgICB3aGlsZSAoIWxpbmVzW2xpbmVzLmxlbmd0aCAtIDFdKSB7XG4gICAgICBsaW5lcy5wb3AoKTtcbiAgICAgIGRlbGltaXRlcnMucG9wKCk7XG4gICAgfVxuICB9IGVsc2UgaWYgKGFkZEVPRk5MKSB7XG4gICAgbGluZXMucHVzaCgnJyk7XG4gICAgZGVsaW1pdGVycy5wdXNoKCdcXG4nKTtcbiAgfVxuICBmb3IgKGxldCBfayA9IDA7IF9rIDwgbGluZXMubGVuZ3RoIC0gMTsgX2srKykge1xuICAgIGxpbmVzW19rXSA9IGxpbmVzW19rXSArIGRlbGltaXRlcnNbX2tdO1xuICB9XG4gIHJldHVybiBsaW5lcy5qb2luKCcnKTtcbn1cblxuLy8gV3JhcHBlciB0aGF0IHN1cHBvcnRzIG11bHRpcGxlIGZpbGUgcGF0Y2hlcyB2aWEgY2FsbGJhY2tzLlxuZXhwb3J0IGZ1bmN0aW9uIGFwcGx5UGF0Y2hlcyh1bmlEaWZmLCBvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgdW5pRGlmZiA9PT0gJ3N0cmluZycpIHtcbiAgICB1bmlEaWZmID0gcGFyc2VQYXRjaCh1bmlEaWZmKTtcbiAgfVxuXG4gIGxldCBjdXJyZW50SW5kZXggPSAwO1xuICBmdW5jdGlvbiBwcm9jZXNzSW5kZXgoKSB7XG4gICAgbGV0IGluZGV4ID0gdW5pRGlmZltjdXJyZW50SW5kZXgrK107XG4gICAgaWYgKCFpbmRleCkge1xuICAgICAgcmV0dXJuIG9wdGlvbnMuY29tcGxldGUoKTtcbiAgICB9XG5cbiAgICBvcHRpb25zLmxvYWRGaWxlKGluZGV4LCBmdW5jdGlvbihlcnIsIGRhdGEpIHtcbiAgICAgIGlmIChlcnIpIHtcbiAgICAgICAgcmV0dXJuIG9wdGlvbnMuY29tcGxldGUoZXJyKTtcbiAgICAgIH1cblxuICAgICAgbGV0IHVwZGF0ZWRDb250ZW50ID0gYXBwbHlQYXRjaChkYXRhLCBpbmRleCwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLnBhdGNoZWQoaW5kZXgsIHVwZGF0ZWRDb250ZW50LCBmdW5jdGlvbihlcnIpIHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHJldHVybiBvcHRpb25zLmNvbXBsZXRlKGVycik7XG4gICAgICAgIH1cblxuICAgICAgICBwcm9jZXNzSW5kZXgoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG4gIHByb2Nlc3NJbmRleCgpO1xufVxuIl19


/***/ }),

/***/ "./node_modules/diff/lib/patch/create.js":
/*!***********************************************!*\
  !*** ./node_modules/diff/lib/patch/create.js ***!
  \***********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/*istanbul ignore start*/


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.structuredPatch = structuredPatch;
exports.formatPatch = formatPatch;
exports.createTwoFilesPatch = createTwoFilesPatch;
exports.createPatch = createPatch;

/*istanbul ignore end*/
var
/*istanbul ignore start*/
_line = __webpack_require__(/*! ../diff/line */ "./node_modules/diff/lib/diff/line.js")
/*istanbul ignore end*/
;

/*istanbul ignore start*/ function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/*istanbul ignore end*/
function structuredPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options) {
  if (!options) {
    options = {};
  }

  if (typeof options.context === 'undefined') {
    options.context = 4;
  }

  var diff =
  /*istanbul ignore start*/
  (0,
  /*istanbul ignore end*/

  /*istanbul ignore start*/
  _line
  /*istanbul ignore end*/
  .
  /*istanbul ignore start*/
  diffLines)
  /*istanbul ignore end*/
  (oldStr, newStr, options);
  diff.push({
    value: '',
    lines: []
  }); // Append an empty value to make cleanup easier

  function contextLines(lines) {
    return lines.map(function (entry) {
      return ' ' + entry;
    });
  }

  var hunks = [];
  var oldRangeStart = 0,
      newRangeStart = 0,
      curRange = [],
      oldLine = 1,
      newLine = 1;

  /*istanbul ignore start*/
  var _loop = function _loop(
  /*istanbul ignore end*/
  i) {
    var current = diff[i],
        lines = current.lines || current.value.replace(/\n$/, '').split('\n');
    current.lines = lines;

    if (current.added || current.removed) {
      /*istanbul ignore start*/
      var _curRange;

      /*istanbul ignore end*/
      // If we have previous context, start with that
      if (!oldRangeStart) {
        var prev = diff[i - 1];
        oldRangeStart = oldLine;
        newRangeStart = newLine;

        if (prev) {
          curRange = options.context > 0 ? contextLines(prev.lines.slice(-options.context)) : [];
          oldRangeStart -= curRange.length;
          newRangeStart -= curRange.length;
        }
      } // Output our changes


      /*istanbul ignore start*/

      /*istanbul ignore end*/

      /*istanbul ignore start*/
      (_curRange =
      /*istanbul ignore end*/
      curRange).push.apply(
      /*istanbul ignore start*/
      _curRange
      /*istanbul ignore end*/
      ,
      /*istanbul ignore start*/
      _toConsumableArray(
      /*istanbul ignore end*/
      lines.map(function (entry) {
        return (current.added ? '+' : '-') + entry;
      }))); // Track the updated file position


      if (current.added) {
        newLine += lines.length;
      } else {
        oldLine += lines.length;
      }
    } else {
      // Identical context lines. Track line changes
      if (oldRangeStart) {
        // Close out any changes that have been output (or join overlapping)
        if (lines.length <= options.context * 2 && i < diff.length - 2) {
          /*istanbul ignore start*/
          var _curRange2;

          /*istanbul ignore end*/
          // Overlapping

          /*istanbul ignore start*/

          /*istanbul ignore end*/

          /*istanbul ignore start*/
          (_curRange2 =
          /*istanbul ignore end*/
          curRange).push.apply(
          /*istanbul ignore start*/
          _curRange2
          /*istanbul ignore end*/
          ,
          /*istanbul ignore start*/
          _toConsumableArray(
          /*istanbul ignore end*/
          contextLines(lines)));
        } else {
          /*istanbul ignore start*/
          var _curRange3;

          /*istanbul ignore end*/
          // end the range and output
          var contextSize = Math.min(lines.length, options.context);

          /*istanbul ignore start*/

          /*istanbul ignore end*/

          /*istanbul ignore start*/
          (_curRange3 =
          /*istanbul ignore end*/
          curRange).push.apply(
          /*istanbul ignore start*/
          _curRange3
          /*istanbul ignore end*/
          ,
          /*istanbul ignore start*/
          _toConsumableArray(
          /*istanbul ignore end*/
          contextLines(lines.slice(0, contextSize))));

          var hunk = {
            oldStart: oldRangeStart,
            oldLines: oldLine - oldRangeStart + contextSize,
            newStart: newRangeStart,
            newLines: newLine - newRangeStart + contextSize,
            lines: curRange
          };

          if (i >= diff.length - 2 && lines.length <= options.context) {
            // EOF is inside this hunk
            var oldEOFNewline = /\n$/.test(oldStr);
            var newEOFNewline = /\n$/.test(newStr);
            var noNlBeforeAdds = lines.length == 0 && curRange.length > hunk.oldLines;

            if (!oldEOFNewline && noNlBeforeAdds && oldStr.length > 0) {
              // special case: old has no eol and no trailing context; no-nl can end up before adds
              // however, if the old file is empty, do not output the no-nl line
              curRange.splice(hunk.oldLines, 0, '\\ No newline at end of file');
            }

            if (!oldEOFNewline && !noNlBeforeAdds || !newEOFNewline) {
              curRange.push('\\ No newline at end of file');
            }
          }

          hunks.push(hunk);
          oldRangeStart = 0;
          newRangeStart = 0;
          curRange = [];
        }
      }

      oldLine += lines.length;
      newLine += lines.length;
    }
  };

  for (var i = 0; i < diff.length; i++) {
    /*istanbul ignore start*/
    _loop(
    /*istanbul ignore end*/
    i);
  }

  return {
    oldFileName: oldFileName,
    newFileName: newFileName,
    oldHeader: oldHeader,
    newHeader: newHeader,
    hunks: hunks
  };
}

function formatPatch(diff) {
  var ret = [];

  if (diff.oldFileName == diff.newFileName) {
    ret.push('Index: ' + diff.oldFileName);
  }

  ret.push('===================================================================');
  ret.push('--- ' + diff.oldFileName + (typeof diff.oldHeader === 'undefined' ? '' : '\t' + diff.oldHeader));
  ret.push('+++ ' + diff.newFileName + (typeof diff.newHeader === 'undefined' ? '' : '\t' + diff.newHeader));

  for (var i = 0; i < diff.hunks.length; i++) {
    var hunk = diff.hunks[i]; // Unified Diff Format quirk: If the chunk size is 0,
    // the first number is one lower than one would expect.
    // https://www.artima.com/weblogs/viewpost.jsp?thread=164293

    if (hunk.oldLines === 0) {
      hunk.oldStart -= 1;
    }

    if (hunk.newLines === 0) {
      hunk.newStart -= 1;
    }

    ret.push('@@ -' + hunk.oldStart + ',' + hunk.oldLines + ' +' + hunk.newStart + ',' + hunk.newLines + ' @@');
    ret.push.apply(ret, hunk.lines);
  }

  return ret.join('\n') + '\n';
}

function createTwoFilesPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options) {
  return formatPatch(structuredPatch(oldFileName, newFileName, oldStr, newStr, oldHeader, newHeader, options));
}

function createPatch(fileName, oldStr, newStr, oldHeader, newHeader, options) {
  return createTwoFilesPatch(fileName, fileName, oldStr, newStr, oldHeader, newHeader, options);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wYXRjaC9jcmVhdGUuanMiXSwibmFtZXMiOlsic3RydWN0dXJlZFBhdGNoIiwib2xkRmlsZU5hbWUiLCJuZXdGaWxlTmFtZSIsIm9sZFN0ciIsIm5ld1N0ciIsIm9sZEhlYWRlciIsIm5ld0hlYWRlciIsIm9wdGlvbnMiLCJjb250ZXh0IiwiZGlmZiIsImRpZmZMaW5lcyIsInB1c2giLCJ2YWx1ZSIsImxpbmVzIiwiY29udGV4dExpbmVzIiwibWFwIiwiZW50cnkiLCJodW5rcyIsIm9sZFJhbmdlU3RhcnQiLCJuZXdSYW5nZVN0YXJ0IiwiY3VyUmFuZ2UiLCJvbGRMaW5lIiwibmV3TGluZSIsImkiLCJjdXJyZW50IiwicmVwbGFjZSIsInNwbGl0IiwiYWRkZWQiLCJyZW1vdmVkIiwicHJldiIsInNsaWNlIiwibGVuZ3RoIiwiY29udGV4dFNpemUiLCJNYXRoIiwibWluIiwiaHVuayIsIm9sZFN0YXJ0Iiwib2xkTGluZXMiLCJuZXdTdGFydCIsIm5ld0xpbmVzIiwib2xkRU9GTmV3bGluZSIsInRlc3QiLCJuZXdFT0ZOZXdsaW5lIiwibm9ObEJlZm9yZUFkZHMiLCJzcGxpY2UiLCJmb3JtYXRQYXRjaCIsInJldCIsImFwcGx5Iiwiam9pbiIsImNyZWF0ZVR3b0ZpbGVzUGF0Y2giLCJjcmVhdGVQYXRjaCIsImZpbGVOYW1lIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7QUFFTyxTQUFTQSxlQUFULENBQXlCQyxXQUF6QixFQUFzQ0MsV0FBdEMsRUFBbURDLE1BQW5ELEVBQTJEQyxNQUEzRCxFQUFtRUMsU0FBbkUsRUFBOEVDLFNBQTlFLEVBQXlGQyxPQUF6RixFQUFrRztBQUN2RyxNQUFJLENBQUNBLE9BQUwsRUFBYztBQUNaQSxJQUFBQSxPQUFPLEdBQUcsRUFBVjtBQUNEOztBQUNELE1BQUksT0FBT0EsT0FBTyxDQUFDQyxPQUFmLEtBQTJCLFdBQS9CLEVBQTRDO0FB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eHBvcnQgZnVuY3Rpb24gc3RydWN0dXJlZFBhdGNoKG9sZEZpbGVOYW1lLCBuZXdGaWxlTmFtZSwgb2xkU3RyLCBuZXdTdHIsIG9sZEhlYWRlciwgbmV3SGVhZGVyLCBvcHRpb25zKSB7XG4gIGlmICghb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfVxuICBpZiAodHlwZW9mIG9wdGlvbnMuY29udGV4dCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBvcHRpb25zLmNvbnRleHQgPSA0O1xuICB9XG5cbiAgY29uc3QgZGlmZiA9IGRpZmZMaW5lcyhvbGRTdHIsIG5ld1N0ciwgb3B0aW9ucyk7XG4gIGRpZmYucHVzaCh7dmFsdWU6ICcnLCBsaW5lczogW119KTsgLy8gQXBwZW5kIGFuIGVtcHR5IHZhbHVlIHRvIG1ha2UgY2xlYW51cCBlYXNpZXJcblxuICBmdW5jdGlvbiBjb250ZXh0TGluZXMobGluZXMpIHtcbiAgICByZXR1cm4gbGluZXMubWFwKGZ1bmN0aW9uKGVudHJ5KSB7IHJldHVybiAnICcgKyBlbnRyeTsgfSk7XG4gIH1cblxuICBsZXQgaHVua3MgPSBbXTtcbiAgbGV0IG9sZFJhbmdlU3RhcnQgPSAwLCBuZXdSYW5nZVN0YXJ0ID0gMCwgY3VyUmFuZ2UgPSBbXSxcbiAgICAgIG9sZExpbmUgPSAxLCBuZXdMaW5lID0gMTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaWZmLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgY3VycmVudCA9IGRpZmZbaV0sXG4gICAgICAgICAgbGluZXMgPSBjdXJyZW50LmxpbmVzIHx8IGN1cnJlbnQudmFsdWUucmVwbGFjZSgvXFxuJC8sICcnKS5zcGxpdCgnXFxuJyk7XG4gICAgY3VycmVudC5saW5lcyA9IGxpbmVzO1xuXG4gICAgaWYgKGN1cnJlbnQuYWRkZWQgfHwgY3VycmVudC5yZW1vdmVkKSB7XG4gICAgICAvLyBJZiB3ZSBoYXZlIHByZXZpb3VzIGNvbnRleHQsIHN0YXJ0IHdpdGggdGhhdFxuICAgICAgaWYgKCFvbGRSYW5nZVN0YXJ0KSB7XG4gICAgICAgIGNvbnN0IHByZXYgPSBkaWZmW2kgLSAxXTtcbiAgICAgICAgb2xkUmFuZ2VTdGFydCA9IG9sZExpbmU7XG4gICAgICAgIG5ld1JhbmdlU3RhcnQgPSBuZXdMaW5lO1xuXG4gICAgICAgIGlmIChwcmV2KSB7XG4gICAgICAgICAgY3VyUmFuZ2UgPSBvcHRpb25zLmNvbnRleHQgPiAwID8gY29udGV4dExpbmVzKHByZXYubGluZXMuc2xpY2UoLW9wdGlvbnMuY29udGV4dCkpIDogW107XG4gICAgICAgICAgb2xkUmFuZ2VTdGFydCAtPSBjdXJSYW5nZS5sZW5ndGg7XG4gICAgICAgICAgbmV3UmFuZ2VTdGFydCAtPSBjdXJSYW5nZS5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gT3V0cHV0IG91ciBjaGFuZ2VzXG4gICAgICBjdXJSYW5nZS5wdXNoKC4uLiBsaW5lcy5tYXAoZnVuY3Rpb24oZW50cnkpIHtcbiAgICAgICAgcmV0dXJuIChjdXJyZW50LmFkZGVkID8gJysnIDogJy0nKSArIGVudHJ5O1xuICAgICAgfSkpO1xuXG4gICAgICAvLyBUcmFjayB0aGUgdXBkYXRlZCBmaWxlIHBvc2l0aW9uXG4gICAgICBpZiAoY3VycmVudC5hZGRlZCkge1xuICAgICAgICBuZXdMaW5lICs9IGxpbmVzLmxlbmd0aDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9sZExpbmUgKz0gbGluZXMubGVuZ3RoO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJZGVudGljYWwgY29udGV4dCBsaW5lcy4gVHJhY2sgbGluZSBjaGFuZ2VzXG4gICAgICBpZiAob2xkUmFuZ2VTdGFydCkge1xuICAgICAgICAvLyBDbG9zZSBvdXQgYW55IGNoYW5nZXMgdGhhdCBoYXZlIGJlZW4gb3V0cHV0IChvciBqb2luIG92ZXJsYXBwaW5nKVxuICAgICAgICBpZiAobGluZXMubGVuZ3RoIDw9IG9wdGlvbnMuY29udGV4dCAqIDIgJiYgaSA8IGRpZmYubGVuZ3RoIC0gMikge1xuICAgICAgICAgIC8vIE92ZXJsYXBwaW5nXG4gICAgICAgICAgY3VyUmFuZ2UucHVzaCguLi4gY29udGV4dExpbmVzKGxpbmVzKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgLy8gZW5kIHRoZSByYW5nZSBhbmQgb3V0cHV0XG4gICAgICAgICAgbGV0IGNvbnRleHRTaXplID0gTWF0aC5taW4obGluZXMubGVuZ3RoLCBvcHRpb25zLmNvbnRleHQpO1xuICAgICAgICAgIGN1clJhbmdlLnB1c2goLi4uIGNvbnRleHRMaW5lcyhsaW5lcy5zbGljZSgwLCBjb250ZXh0U2l6ZSkpKTtcblxuICAgICAgICAgIGxldCBodW5rID0ge1xuICAgICAgICAgICAgb2xkU3RhcnQ6IG9sZFJhbmdlU3RhcnQsXG4gICAgICAgICAgICBvbGRMaW5lczogKG9sZExpbmUgLSBvbGRSYW5nZVN0YXJ0ICsgY29udGV4dFNpemUpLFxuICAgICAgICAgICAgbmV3U3RhcnQ6IG5ld1JhbmdlU3RhcnQsXG4gICAgICAgICAgICBuZXdMaW5lczogKG5ld0xpbmUgLSBuZXdSYW5nZVN0YXJ0ICsgY29udGV4dFNpemUpLFxuICAgICAgICAgICAgbGluZXM6IGN1clJhbmdlXG4gICAgICAgICAgfTtcbiAgICAgICAgICBpZiAoaSA+PSBkaWZmLmxlbmd0aCAtIDIgJiYgbGluZXMubGVuZ3RoIDw9IG9wdGlvbnMuY29udGV4dCkge1xuICAgICAgICAgICAgLy8gRU9GIGlzIGluc2lkZSB0aGlzIGh1bmtcbiAgICAgICAgICAgIGxldCBvbGRFT0ZOZXdsaW5lID0gKCgvXFxuJC8pLnRlc3Qob2xkU3RyKSk7XG4gICAgICAgICAgICBsZXQgbmV3RU9GTmV3bGluZSA9ICgoL1xcbiQvKS50ZXN0KG5ld1N0cikpO1xuICAgICAgICAgICAgbGV0IG5vTmxCZWZvcmVBZGRzID0gbGluZXMubGVuZ3RoID09IDAgJiYgY3VyUmFuZ2UubGVuZ3RoID4gaHVuay5vbGRMaW5lcztcbiAgICAgICAgICAgIGlmICghb2xkRU9GTmV3bGluZSAmJiBub05sQmVmb3JlQWRkcyAmJiBvbGRTdHIubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAvLyBzcGVjaWFsIGNhc2U6IG9sZCBoYXMgbm8gZW9sIGFuZCBubyB0cmFpbGluZyBjb250ZXh0OyBuby1ubCBjYW4gZW5kIHVwIGJlZm9yZSBhZGRzXG4gICAgICAgICAgICAgIC8vIGhvd2V2ZXIsIGlmIHRoZSBvbGQgZmlsZSBpcyBlbXB0eSwgZG8gbm90IG91dHB1dCB0aGUgbm8tbmwgbGluZVxuICAgICAgICAgICAgICBjdXJSYW5nZS5zcGxpY2UoaHVuay5vbGRMaW5lcywgMCwgJ1xcXFwgTm8gbmV3bGluZSBhdCBlbmQgb2YgZmlsZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCghb2xkRU9GTmV3bGluZSAmJiAhbm9ObEJlZm9yZUFkZHMpIHx8ICFuZXdFT0ZOZXdsaW5lKSB7XG4gICAgICAgICAgICAgIGN1clJhbmdlLnB1c2goJ1xcXFwgTm8gbmV3bGluZSBhdCBlbmQgb2YgZmlsZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgICBodW5rcy5wdXNoKGh1bmspO1xuXG4gICAgICAgICAgb2xkUmFuZ2VTdGFydCA9IDA7XG4gICAgICAgICAgbmV3UmFuZ2VTdGFydCA9IDA7XG4gICAgICAgICAgY3VyUmFuZ2UgPSBbXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgb2xkTGluZSArPSBsaW5lcy5sZW5ndGg7XG4gICAgICBuZXdMaW5lICs9IGxpbmVzLmxlbmd0aDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge1xuICAgIG9sZEZpbGVOYW1lOiBvbGRGaWxlTmFtZSwgbmV3RmlsZU5hbWU6IG5ld0ZpbGVOYW1lLFxuICAgIG9sZEhlYWRlcjogb2xkSGVhZGVyLCBuZXdIZWFkZXI6IG5ld0hlYWRlcixcbiAgICBodW5rczogaHVua3NcbiAgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdFBhdGNoKGRpZmYpIHtcbiAgY29uc3QgcmV0ID0gW107XG4gIGlmIChkaWZmLm9sZEZpbGVOYW1lID09IGRpZmYubmV3RmlsZU5hbWUpIHtcbiAgICByZXQucHVzaCgnSW5kZXg6ICcgKyBkaWZmLm9sZEZpbGVOYW1lKTtcbiAgfVxuICByZXQucHVzaCgnPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PScpO1xuICByZXQucHVzaCgnLS0tICcgKyBkaWZmLm9sZEZpbGVOYW1lICsgKHR5cGVvZiBkaWZmLm9sZEhlYWRlciA9PT0gJ3VuZGVmaW5lZCcgPyAnJyA6ICdcXHQnICsgZGlmZi5vbGRIZWFkZXIpKTtcbiAgcmV0LnB1c2goJysrKyAnICsgZGlmZi5uZXdGaWxlTmFtZSArICh0eXBlb2YgZGlmZi5uZXdIZWFkZXIgPT09ICd1bmRlZmluZWQnID8gJycgOiAnXFx0JyArIGRpZmYubmV3SGVhZGVyKSk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaWZmLmh1bmtzLmxlbmd0aDsgaSsrKSB7XG4gICAgY29uc3QgaHVuayA9IGRpZmYuaHVua3NbaV07XG4gICAgLy8gVW5pZmllZCBEaWZmIEZvcm1hdCBxdWlyazogSWYgdGhlIGNodW5rIHNpemUgaXMgMCxcbiAgICAvLyB0aGUgZmlyc3QgbnVtYmVyIGlzIG9uZSBsb3dlciB0aGFuIG9uZSB3b3VsZCBleHBlY3QuXG4gICAgLy8gaHR0cHM6Ly93d3cuYXJ0aW1hLmNvbS93ZWJsb2dzL3ZpZXdwb3N0LmpzcD90aHJlYWQ9MTY0MjkzXG4gICAgaWYgKGh1bmsub2xkTGluZXMgPT09IDApIHtcbiAgICAgIGh1bmsub2xkU3RhcnQgLT0gMTtcbiAgICB9XG4gICAgaWYgKGh1bmsubmV3TGluZXMgPT09IDApIHtcbiAgICAgIGh1bmsubmV3U3RhcnQgLT0gMTtcbiAgICB9XG4gICAgcmV0LnB1c2goXG4gICAgICAnQEAgLScgKyBodW5rLm9sZFN0YXJ0ICsgJywnICsgaHVuay5vbGRMaW5lc1xuICAgICAgKyAnICsnICsgaHVuay5uZXdTdGFydCArICcsJyArIGh1bmsubmV3TGluZXNcbiAgICAgICsgJyBAQCdcbiAgICApO1xuICAgIHJldC5wdXNoLmFwcGx5KHJldCwgaHVuay5saW5lcyk7XG4gIH1cblxuICByZXR1cm4gcmV0LmpvaW4oJ1xcbicpICsgJ1xcbic7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVUd29GaWxlc1BhdGNoKG9sZEZpbGVOYW1lLCBuZXdGaWxlTmFtZSwgb2xkU3RyLCBuZXdTdHIsIG9sZEhlYWRlciwgbmV3SGVhZGVyLCBvcHRpb25zKSB7XG4gIHJldHVybiBmb3JtYXRQYXRjaChzdHJ1Y3R1cmVkUGF0Y2gob2xkRmlsZU5hbWUsIG5ld0ZpbGVOYW1lLCBvbGRTdHIsIG5ld1N0ciwgb2xkSGVhZGVyLCBuZXdIZWFkZXIsIG9wdGlvbnMpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVBhdGNoKGZpbGVOYW1lLCBvbGRTdHIsIG5ld1N0ciwgb2xkSGVhZGVyLCBuZXdIZWFkZXIsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIGNyZWF0ZVR3b0ZpbGVzUGF0Y2goZmlsZU5hbWUsIGZpbGVOYW1lLCBvbGRTdHIsIG5ld1N0ciwgb2xkSGVhZGVyLCBuZXdIZWFkZXIsIG9wdGlvbnMpO1xufVxuIl19


/***/ }),

/***/ "./node_modules/diff/lib/patch/merge.js":
/*!**********************************************!*\
  !*** ./node_modules/diff/lib/patch/merge.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/*istanbul ignore start*/


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.calcLineCount = calcLineCount;
exports.merge = merge;

/*istanbul ignore end*/
var
/*istanbul ignore start*/
_create = __webpack_require__(/*! ./create */ "./node_modules/diff/lib/patch/create.js")
/*istanbul ignore end*/
;

var
/*istanbul ignore start*/
_parse = __webpack_require__(/*! ./parse */ "./node_modules/diff/lib/patch/parse.js")
/*istanbul ignore end*/
;

var
/*istanbul ignore start*/
_array = __webpack_require__(/*! ../util/array */ "./node_modules/diff/lib/util/array.js")
/*istanbul ignore end*/
;

/*istanbul ignore start*/ function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

/*istanbul ignore end*/
function calcLineCount(hunk) {
  /*istanbul ignore start*/
  var _calcOldNewLineCount =
  /*istanbul ignore end*/
  calcOldNewLineCount(hunk.lines),
      oldLines = _calcOldNewLineCount.oldLines,
      newLines = _calcOldNewLineCount.newLines;

  if (oldLines !== undefined) {
    hunk.oldLines = oldLines;
  } else {
    delete hunk.oldLines;
  }

  if (newLines !== undefined) {
    hunk.newLines = newLines;
  } else {
    delete hunk.newLines;
  }
}

function merge(mine, theirs, base) {
  mine = loadPatch(mine, base);
  theirs = loadPatch(theirs, base);
  var ret = {}; // For index we just let it pass through as it doesn't have any necessary meaning.
  // Leaving sanity checks on this to the API consumer that may know more about the
  // meaning in their own context.

  if (mine.index || theirs.index) {
    ret.index = mine.index || theirs.index;
  }

  if (mine.newFileName || theirs.newFileName) {
    if (!fileNameChanged(mine)) {
      // No header or no change in ours, use theirs (and ours if theirs does not exist)
      ret.oldFileName = theirs.oldFileName || mine.oldFileName;
      ret.newFileName = theirs.newFileName || mine.newFileName;
      ret.oldHeader = theirs.oldHeader || mine.oldHeader;
      ret.newHeader = theirs.newHeader || mine.newHeader;
    } else if (!fileNameChanged(theirs)) {
      // No header or no change in theirs, use ours
      ret.oldFileName = mine.oldFileName;
      ret.newFileName = mine.newFileName;
      ret.oldHeader = mine.oldHeader;
      ret.newHeader = mine.newHeader;
    } else {
      // Both changed... figure it out
      ret.oldFileName = selectField(ret, mine.oldFileName, theirs.oldFileName);
      ret.newFileName = selectField(ret, mine.newFileName, theirs.newFileName);
      ret.oldHeader = selectField(ret, mine.oldHeader, theirs.oldHeader);
      ret.newHeader = selectField(ret, mine.newHeader, theirs.newHeader);
    }
  }

  ret.hunks = [];
  var mineIndex = 0,
      theirsIndex = 0,
      mineOffset = 0,
      theirsOffset = 0;

  while (mineIndex < mine.hunks.length || theirsIndex < theirs.hunks.length) {
    var mineCurrent = mine.hunks[mineIndex] || {
      oldStart: Infinity
    },
        theirsCurrent = theirs.hunks[theirsIndex] || {
      oldStart: Infinity
    };

    if (hunkBefore(mineCurrent, theirsCurrent)) {
      // This patch does not overlap with any of the others, yay.
      ret.hunks.push(cloneHunk(mineCurrent, mineOffset));
      mineIndex++;
      theirsOffset += mineCurrent.newLines - mineCurrent.oldLines;
    } else if (hunkBefore(theirsCurrent, mineCurrent)) {
      // This patch does not overlap with any of the others, yay.
      ret.hunks.push(cloneHunk(theirsCurrent, theirsOffset));
      theirsIndex++;
      mineOffset += theirsCurrent.newLines - theirsCurrent.oldLines;
    } else {
      // Overlap, merge as best we can
      var mergedHunk = {
        oldStart: Math.min(mineCurrent.oldStart, theirsCurrent.oldStart),
        oldLines: 0,
        newStart: Math.min(mineCurrent.newStart + mineOffset, theirsCurrent.oldStart + theirsOffset),
        newLines: 0,
        lines: []
      };
      mergeLines(mergedHunk, mineCurrent.oldStart, mineCurrent.lines, theirsCurrent.oldStart, theirsCurrent.lines);
      theirsIndex++;
      mineIndex++;
      ret.hunks.push(mergedHunk);
    }
  }

  return ret;
}

function loadPatch(param, base) {
  if (typeof param === 'string') {
    if (/^@@/m.test(param) || /^Index:/m.test(param)) {
      return (
        /*istanbul ignore start*/
        (0,
        /*istanbul ignore end*/

        /*istanbul ignore start*/
        _parse
        /*istanbul ignore end*/
        .
        /*istanbul ignore start*/
        parsePatch)
        /*istanbul ignore end*/
        (param)[0]
      );
    }

    if (!base) {
      throw new Error('Must provide a base reference or pass in a patch');
    }

    return (
      /*istanbul ignore start*/
      (0,
      /*istanbul ignore end*/

      /*istanbul ignore start*/
      _create
      /*istanbul ignore end*/
      .
      /*istanbul ignore start*/
      structuredPatch)
      /*istanbul ignore end*/
      (undefined, undefined, base, param)
    );
  }

  return param;
}

function fileNameChanged(patch) {
  return patch.newFileName && patch.newFileName !== patch.oldFileName;
}

function selectField(index, mine, theirs) {
  if (mine === theirs) {
    return mine;
  } else {
    index.conflict = true;
    return {
      mine: mine,
      theirs: theirs
    };
  }
}

function hunkBefore(test, check) {
  return test.oldStart < check.oldStart && test.oldStart + test.oldLines < check.oldStart;
}

function cloneHunk(hunk, offset) {
  return {
    oldStart: hunk.oldStart,
    oldLines: hunk.oldLines,
    newStart: hunk.newStart + offset,
    newLines: hunk.newLines,
    lines: hunk.lines
  };
}

function mergeLines(hunk, mineOffset, mineLines, theirOffset, theirLines) {
  // This will generally result in a conflicted hunk, but there are cases where the context
  // is the only overlap where we can successfully merge the content here.
  var mine = {
    offset: mineOffset,
    lines: mineLines,
    index: 0
  },
      their = {
    offset: theirOffset,
    lines: theirLines,
    index: 0
  }; // Handle any leading content

  insertLeading(hunk, mine, their);
  insertLeading(hunk, their, mine); // Now in the overlap content. Scan through and select the best changes from each.

  while (mine.index < mine.lines.length && their.index < their.lines.length) {
    var mineCurrent = mine.lines[mine.index],
        theirCurrent = their.lines[their.index];

    if ((mineCurrent[0] === '-' || mineCurrent[0] === '+') && (theirCurrent[0] === '-' || theirCurrent[0] === '+')) {
      // Both modified ...
      mutualChange(hunk, mine, their);
    } else if (mineCurrent[0] === '+' && theirCurrent[0] === ' ') {
      /*istanbul ignore start*/
      var _hunk$lines;

      /*istanbul ignore end*/
      // Mine inserted

      /*istanbul ignore start*/

      /*istanbul ignore end*/

      /*istanbul ignore start*/
      (_hunk$lines =
      /*istanbul ignore end*/
      hunk.lines).push.apply(
      /*istanbul ignore start*/
      _hunk$lines
      /*istanbul ignore end*/
      ,
      /*istanbul ignore start*/
      _toConsumableArray(
      /*istanbul ignore end*/
      collectChange(mine)));
    } else if (theirCurrent[0] === '+' && mineCurrent[0] === ' ') {
      /*istanbul ignore start*/
      var _hunk$lines2;

      /*istanbul ignore end*/
      // Theirs inserted

      /*istanbul ignore start*/

      /*istanbul ignore end*/

      /*istanbul ignore start*/
      (_hunk$lines2 =
      /*istanbul ignore end*/
      hunk.lines).push.apply(
      /*istanbul ignore start*/
      _hunk$lines2
      /*istanbul ignore end*/
      ,
      /*istanbul ignore start*/
      _toConsumableArray(
      /*istanbul ignore end*/
      collectChange(their)));
    } else if (mineCurrent[0] === '-' && theirCurrent[0] === ' ') {
      // Mine removed or edited
      removal(hunk, mine, their);
    } else if (theirCurrent[0] === '-' && mineCurrent[0] === ' ') {
      // Their removed or edited
      removal(hunk, their, mine, true);
    } else if (mineCurrent === theirCurrent) {
      // Context identity
      hunk.lines.push(mineCurrent);
      mine.index++;
      their.index++;
    } else {
      // Context mismatch
      conflict(hunk, collectChange(mine), collectChange(their));
    }
  } // Now push anything that may be remaining


  insertTrailing(hunk, mine);
  insertTrailing(hunk, their);
  calcLineCount(hunk);
}

function mutualChange(hunk, mine, their) {
  var myChanges = collectChange(mine),
      theirChanges = collectChange(their);

  if (allRemoves(myChanges) && allRemoves(theirChanges)) {
    // Special case for remove changes that are supersets of one another
    if (
    /*istanbul ignore start*/
    (0,
    /*istanbul ignore end*/

    /*istanbul ignore start*/
    _array
    /*istanbul ignore end*/
    .
    /*istanbul ignore start*/
    arrayStartsWith)
    /*istanbul ignore end*/
    (myChanges, theirChanges) && skipRemoveSuperset(their, myChanges, myChanges.length - theirChanges.length)) {
      /*istanbul ignore start*/
      var _hunk$lines3;

      /*istanbul ignore end*/

      /*istanbul ignore start*/

      /*istanbul ignore end*/

      /*istanbul ignore start*/
      (_hunk$lines3 =
      /*istanbul ignore end*/
      hunk.lines).push.apply(
      /*istanbul ignore start*/
      _hunk$lines3
      /*istanbul ignore end*/
      ,
      /*istanbul ignore start*/
      _toConsumableArray(
      /*istanbul ignore end*/
      myChanges));

      return;
    } else if (
    /*istanbul ignore start*/
    (0,
    /*istanbul ignore end*/

    /*istanbul ignore start*/
    _array
    /*istanbul ignore end*/
    .
    /*istanbul ignore start*/
    arrayStartsWith)
    /*istanbul ignore end*/
    (theirChanges, myChanges) && skipRemoveSuperset(mine, theirChanges, theirChanges.length - myChanges.length)) {
      /*istanbul ignore start*/
      var _hunk$lines4;

      /*istanbul ignore end*/

      /*istanbul ignore start*/

      /*istanbul ignore end*/

      /*istanbul ignore start*/
      (_hunk$lines4 =
      /*istanbul ignore end*/
      hunk.lines).push.apply(
      /*istanbul ignore start*/
      _hunk$lines4
      /*istanbul ignore end*/
      ,
      /*istanbul ignore start*/
      _toConsumableArray(
      /*istanbul ignore end*/
      theirChanges));

      return;
    }
  } else if (
  /*istanbul ignore start*/
  (0,
  /*istanbul ignore end*/

  /*istanbul ignore start*/
  _array
  /*istanbul ignore end*/
  .
  /*istanbul ignore start*/
  arrayEqual)
  /*istanbul ignore end*/
  (myChanges, theirChanges)) {
    /*istanbul ignore start*/
    var _hunk$lines5;

    /*istanbul ignore end*/

    /*istanbul ignore start*/

    /*istanbul ignore end*/

    /*istanbul ignore start*/
    (_hunk$lines5 =
    /*istanbul ignore end*/
    hunk.lines).push.apply(
    /*istanbul ignore start*/
    _hunk$lines5
    /*istanbul ignore end*/
    ,
    /*istanbul ignore start*/
    _toConsumableArray(
    /*istanbul ignore end*/
    myChanges));

    return;
  }

  conflict(hunk, myChanges, theirChanges);
}

function removal(hunk, mine, their, swap) {
  var myChanges = collectChange(mine),
      theirChanges = collectContext(their, myChanges);

  if (theirChanges.merged) {
    /*istanbul ignore start*/
    var _hunk$lines6;

    /*istanbul ignore end*/

    /*istanbul ignore start*/

    /*istanbul ignore end*/

    /*istanbul ignore start*/
    (_hunk$lines6 =
    /*istanbul ignore end*/
    hunk.lines).push.apply(
    /*istanbul ignore start*/
    _hunk$lines6
    /*istanbul ignore end*/
    ,
    /*istanbul ignore start*/
    _toConsumableArray(
    /*istanbul ignore end*/
    theirChanges.merged));
  } else {
    conflict(hunk, swap ? theirChanges : myChanges, swap ? myChanges : theirChanges);
  }
}

function conflict(hunk, mine, their) {
  hunk.conflict = true;
  hunk.lines.push({
    conflict: true,
    mine: mine,
    theirs: their
  });
}

function insertLeading(hunk, insert, their) {
  while (insert.offset < their.offset && insert.index < insert.lines.length) {
    var line = insert.lines[insert.index++];
    hunk.lines.push(line);
    insert.offset++;
  }
}

function insertTrailing(hunk, insert) {
  while (insert.index < insert.lines.length) {
    var line = insert.lines[insert.index++];
    hunk.lines.push(line);
  }
}

function collectChange(state) {
  var ret = [],
      operation = state.lines[state.index][0];

  while (state.index < state.lines.length) {
    var line = state.lines[state.index]; // Group additions that are immediately after subtractions and treat them as one "atomic" modify change.

    if (operation === '-' && line[0] === '+') {
      operation = '+';
    }

    if (operation === line[0]) {
      ret.push(line);
      state.index++;
    } else {
      break;
    }
  }

  return ret;
}

function collectContext(state, matchChanges) {
  var changes = [],
      merged = [],
      matchIndex = 0,
      contextChanges = false,
      conflicted = false;

  while (matchIndex < matchChanges.length && state.index < state.lines.length) {
    var change = state.lines[state.index],
        match = matchChanges[matchIndex]; // Once we've hit our add, then we are done

    if (match[0] === '+') {
      break;
    }

    contextChanges = contextChanges || change[0] !== ' ';
    merged.push(match);
    matchIndex++; // Consume any additions in the other block as a conflict to attempt
    // to pull in the remaining context after this

    if (change[0] === '+') {
      conflicted = true;

      while (change[0] === '+') {
        changes.push(change);
        change = state.lines[++state.index];
      }
    }

    if (match.substr(1) === change.substr(1)) {
      changes.push(change);
      state.index++;
    } else {
      conflicted = true;
    }
  }

  if ((matchChanges[matchIndex] || '')[0] === '+' && contextChanges) {
    conflicted = true;
  }

  if (conflicted) {
    return changes;
  }

  while (matchIndex < matchChanges.length) {
    merged.push(matchChanges[matchIndex++]);
  }

  return {
    merged: merged,
    changes: changes
  };
}

function allRemoves(changes) {
  return changes.reduce(function (prev, change) {
    return prev && change[0] === '-';
  }, true);
}

function skipRemoveSuperset(state, removeChanges, delta) {
  for (var i = 0; i < delta; i++) {
    var changeContent = removeChanges[removeChanges.length - delta + i].substr(1);

    if (state.lines[state.index + i] !== ' ' + changeContent) {
      return false;
    }
  }

  state.index += delta;
  return true;
}

function calcOldNewLineCount(lines) {
  var oldLines = 0;
  var newLines = 0;
  lines.forEach(function (line) {
    if (typeof line !== 'string') {
      var myCount = calcOldNewLineCount(line.mine);
      var theirCount = calcOldNewLineCount(line.theirs);

      if (oldLines !== undefined) {
        if (myCount.oldLines === theirCount.oldLines) {
          oldLines += myCount.oldLines;
        } else {
          oldLines = undefined;
        }
      }

      if (newLines !== undefined) {
        if (myCount.newLines === theirCount.newLines) {
          newLines += myCount.newLines;
        } else {
          newLines = undefined;
        }
      }
    } else {
      if (newLines !== undefined && (line[0] === '+' || line[0] === ' ')) {
        newLines++;
      }

      if (oldLines !== undefined && (line[0] === '-' || line[0] === ' ')) {
        oldLines++;
      }
    }
  });
  return {
    oldLines: oldLines,
    newLines: newLines
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wYXRjaC9tZXJnZS5qcyJdLCJuYW1lcyI6WyJjYWxjTGluZUNvdW50IiwiaHVuayIsImNhbGNPbGROZXdMaW5lQ291bnQiLCJsaW5lcyIsIm9sZExpbmVzIiwibmV3TGluZXMiLCJ1bmRlZmluZWQiLCJtZXJnZSIsIm1pbmUiLCJ0aGVpcnMiLCJiYXNlIiwibG9hZFBhdGNoIiwicmV0IiwiaW5kZXgiLCJuZXdGaWxlTmFtZSIsImZpbGVOYW1lQ2hhbmdlZCIsIm9sZEZpbGVOYW1lIiwib2xkSGVhZGVyIiwibmV3SGVhZGVyIiwic2VsZWN0RmllbGQiLCJodW5rcyIsIm1pbmVJbmRleCIsInRoZWlyc0luZGV4IiwibWluZU9mZnNldCIsInRoZWlyc09mZnNldCIsImxlbmd0aCIsIm1pbmVDdXJyZW50Iiwib2xkU3RhcnQiLCJJbmZpbml0eSIsInRoZWlyc0N1cnJlbnQiLCJodW5rQmVmb3JlIiwicHVzaCIsImNsb25lSHVuayIsIm1lcmdlZEh1bmsiLCJNYXRoIiwibWluIiwibmV3U3RhcnQiLCJtZXJnZUxpbmVzIiwicGFyYW0iLCJ0ZXN0IiwicGFyc2VQYXRjaCIsIkVycm9yIiwic3RydWN0dXJlZFBhdGNoIiwicGF0Y2giLCJjb25mbGljdCIsImNoZWNrIiwib2Zmc2V0IiwibWluZUxpbmVzIiwidGhlaXJPZmZzZXQiLCJ0aGVpckxpbmVzIiwidGhlaXIiLCJpbnNlcnRMZWFkaW5nIiwidGhlaXJDdXJyZW50IiwibXV0dWFsQ2hhbmdlIiwiY29sbGVjdENoYW5nZSIsInJlbW92YWwiLCJpbnNlcnRUcmFpbGluZyIsIm15Q2hhbmdlcyIsInRoZWlyQ2hhbmdlcyIsImFsbFJlbW92ZXMiLCJhcnJheVN0YXJ0c1dpdGgiLCJza2lwUmVtb3ZlU3VwZXJzZXQiLCJhcnJheUVxdWFsIiwic3dhcCIsImNvbGxlY3RDb250ZXh0IiwibWVyZ2VkIiwiaW5zZXJ0IiwibGluZSIsInN0YXRlIiwib3BlcmF0aW9uIiwibWF0Y2hDaGFuZ2VzIiwiY2hhbmdlcyIsIm1hdGNoSW5kZXgiLCJjb250ZXh0Q2hhbmdlcyIsImNvbmZsaWN0ZWQiLCJjaGFuZ2UiLCJtYXRjaCIsInN1YnN0ciIsInJlZHVjZSIsInByZXYiLCJyZW1vdmVDaGFuZ2VzIiwiZGVsdGEiLCJpIiwiY2hhbmdlQ29udGVudCIsImZvckVhY2giLCJteUNvdW50IiwidGhlaXJDb3VudCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQ0E7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFFQTtBQUFBO0FBQUE7QUFBQTtBQUFBOzs7Ozs7Ozs7Ozs7Ozs7QUFFTyxTQUFTQSxhQUFULENBQXVCQyxJQUF2QixFQUE2QjtBQUFBO0FBQUE7QUFBQTtBQUNMQyxFQUFBQSxtQkFBbUIsQ0FBQ0QsSUFBSSxDQUFDRSxLQUFOLENBRGQ7QUFBQSxNQUMzQkMsUUFEMkIsd0JBQzNCQSxRQUQyQjtBQUFBLE1BQ2pCQyxRQURpQix3QkFDakJBLFFBRGlCOztBQUdsQyxNQUFJRCxRQUFRLEtBQUtFLFNBQWpCLEVBQTRCO0FBQzFCTCxJQUFBQSxJQUFJLENBQUNHLFFBQUwsR0FBZ0JBLFFBQWhCO0FBQ0QsR0FGRCxNQUVPO0FBQ0wsV0FBT0gsSUFBSSxDQUFDRyxRQUFaO0FBQ0Q7O0FBRUQsTUFBSUMsUUFBUSxLQUFLQyxTQUFqQixFQUE0QjtBQUMxQkwsSUFBQUEsSUFBSSxDQUFDSSxRQUFMLEdBQWdCQSxRQUFoQjtBQUNELEdBRkQsTUFFTztBQUNMLFdBQU9KLElBQUksQ0FBQ0ksUUFBWjtBQUNEO0FBQ0Y7O0FBRU0sU0FBU0UsS0FBVCxDQUFlQyxJQUFmLEVBQXFCQyxNQUFyQixFQUE2QkMsSUFBN0IsRUFBbUM7QUFDeENGLEVBQUFBLElBQUksR0FBR0csU0FBUyxDQUFDSCxJQUFELEVBQU9FLElBQVAsQ0FBaEI7QUFDQUQsRUFBQUEsTUFBTSxHQUFHRSxTQUFTLENBQUNGLE1BQUQsRUFBU0MsSUFBVCxDQUFsQjtBQUVBLE1BQUlFLEdBQUcsR0FBRyxFQUFWLENBSndD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QUFKLEVBQW9FO0FBQ2xFL0QsUUFBQUEsUUFBUTtBQUNUO0FBQ0Y7QUFDRixHQTVCRDtBQThCQSxTQUFPO0FBQUNBLElBQUFBLFFBQVEsRUFBUkEsUUFBRDtBQUFXQyxJQUFBQSxRQUFRLEVBQVJBO0FBQVgsR0FBUDtBQUNEIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtzdHJ1Y3R1cmVkUGF0Y2h9IGZyb20gJy4vY3JlYXRlJztcbmltcG9ydCB7cGFyc2VQYXRjaH0gZnJvbSAnLi9wYXJzZSc7XG5cbmltcG9ydCB7YXJyYXlFcXVhbCwgYXJyYXlTdGFydHNXaXRofSBmcm9tICcuLi91dGlsL2FycmF5JztcblxuZXhwb3J0IGZ1bmN0aW9uIGNhbGNMaW5lQ291bnQoaHVuaykge1xuICBjb25zdCB7b2xkTGluZXMsIG5ld0xpbmVzfSA9IGNhbGNPbGROZXdMaW5lQ291bnQoaHVuay5saW5lcyk7XG5cbiAgaWYgKG9sZExpbmVzICE9PSB1bmRlZmluZWQpIHtcbiAgICBodW5rLm9sZExpbmVzID0gb2xkTGluZXM7XG4gIH0gZWxzZSB7XG4gICAgZGVsZXRlIGh1bmsub2xkTGluZXM7XG4gIH1cblxuICBpZiAobmV3TGluZXMgIT09IHVuZGVmaW5lZCkge1xuICAgIGh1bmsubmV3TGluZXMgPSBuZXdMaW5lcztcbiAgfSBlbHNlIHtcbiAgICBkZWxldGUgaHVuay5uZXdMaW5lcztcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbWVyZ2UobWluZSwgdGhlaXJzLCBiYXNlKSB7XG4gIG1pbmUgPSBsb2FkUGF0Y2gobWluZSwgYmFzZSk7XG4gIHRoZWlycyA9IGxvYWRQYXRjaCh0aGVpcnMsIGJhc2UpO1xuXG4gIGxldCByZXQgPSB7fTtcblxuICAvLyBGb3IgaW5kZXggd2UganVzdCBsZXQgaXQgcGFzcyB0aHJvdWdoIGFzIGl0IGRvZXNuJ3QgaGF2ZSBhbnkgbmVjZXNzYXJ5IG1lYW5pbmcuXG4gIC8vIExlYXZpbmcgc2FuaXR5IGNoZWNrcyBvbiB0aGlzIHRvIHRoZSBBUEkgY29uc3VtZXIgdGhhdCBtYXkga25vdyBtb3JlIGFib3V0IHRoZVxuICAvLyBtZWFuaW5nIGluIHRoZWlyIG93biBjb250ZXh0LlxuICBpZiAobWluZS5pbmRleCB8fCB0aGVpcnMuaW5kZXgpIHtcbiAgICByZXQuaW5kZXggPSBtaW5lLmluZGV4IHx8IHRoZWlycy5pbmRleDtcbiAgfVxuXG4gIGlmIChtaW5lLm5ld0ZpbGVOYW1lIHx8IHRoZWlycy5uZXdGaWxlTmFtZSkge1xuICAgIGlmICghZmlsZU5hbWVDaGFuZ2VkKG1pbmUpKSB7XG4gICAgICAvLyBObyBoZWFkZXIgb3Igbm8gY2hhbmdlIGluIG91cnMsIHVzZSB0aGVpcnMgKGFuZCBvdXJzIGlmIHRoZWlycyBkb2VzIG5vdCBleGlzdClcbiAgICAgIHJldC5vbGRGaWxlTmFtZSA9IHRoZWlycy5vbGRGaWxlTmFtZSB8fCBtaW5lLm9sZEZpbGVOYW1lO1xuICAgICAgcmV0Lm5ld0ZpbGVOYW1lID0gdGhlaXJzLm5ld0ZpbGVOYW1lIHx8IG1pbmUubmV3RmlsZU5hbWU7XG4gICAgICByZXQub2xkSGVhZGVyID0gdGhlaXJzLm9sZEhlYWRlciB8fCBtaW5lLm9sZEhlYWRlcjtcbiAgICAgIHJldC5uZXdIZWFkZXIgPSB0aGVpcnMubmV3SGVhZGVyIHx8IG1pbmUubmV3SGVhZGVyO1xuICAgIH0gZWxzZSBpZiAoIWZpbGVOYW1lQ2hhbmdlZCh0aGVpcnMpKSB7XG4gICAgICAvLyBObyBoZWFkZXIgb3Igbm8gY2hhbmdlIGluIHRoZWlycywgdXNlIG91cnNcbiAgICAgIHJldC5vbGRGaWxlTmFtZSA9IG1pbmUub2xkRmlsZU5hbWU7XG4gICAgICByZXQubmV3RmlsZU5hbWUgPSBtaW5lLm5ld0ZpbGVOYW1lO1xuICAgICAgcmV0Lm9sZEhlYWRlciA9IG1pbmUub2xkSGVhZGVyO1xuICAgICAgcmV0Lm5ld0hlYWRlciA9IG1pbmUubmV3SGVhZGVyO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBCb3RoIGNoYW5nZWQuLi4gZmlndXJlIGl0IG91dFxuICAgICAgcmV0Lm9sZEZpbGVOYW1lID0gc2VsZWN0RmllbGQocmV0LCBtaW5lLm9sZEZpbGVOYW1lLCB0aGVpcnMub2xkRmlsZU5hbWUpO1xuICAgICAgcmV0Lm5ld0ZpbGVOYW1lID0gc2VsZWN0RmllbGQocmV0LCBtaW5lLm5ld0ZpbGVOYW1lLCB0aGVpcnMubmV3RmlsZU5hbWUpO1xuICAgICAgcmV0Lm9sZEhlYWRlciA9IHNlbGVjdEZpZWxkKHJldCwgbWluZS5vbGRIZWFkZXIsIHRoZWlycy5vbGRIZWFkZXIpO1xuICAgICAgcmV0Lm5ld0hlYWRlciA9IHNlbGVjdEZpZWxkKHJldCwgbWluZS5uZXdIZWFkZXIsIHRoZWlycy5uZXdIZWFkZXIpO1xuICAgIH1cbiAgfVxuXG4gIHJldC5odW5rcyA9IFtdO1xuXG4gIGxldCBtaW5lSW5kZXggPSAwLFxuICAgICAgdGhlaXJzSW5kZXggPSAwLFxuICAgICAgbWluZU9mZnNldCA9IDAsXG4gICAgICB0aGVpcnNPZmZzZXQgPSAwO1xuXG4gIHdoaWxlIChtaW5lSW5kZXggPCBtaW5lLmh1bmtzLmxlbmd0aCB8fCB0aGVpcnNJbmRleCA8IHRoZWlycy5odW5rcy5sZW5ndGgpIHtcbiAgICBsZXQgbWluZUN1cnJlbnQgPSBtaW5lLmh1bmtzW21pbmVJbmRleF0gfHwge29sZFN0YXJ0OiBJbmZpbml0eX0sXG4gICAgICAgIHRoZWlyc0N1cnJlbnQgPSB0aGVpcnMuaHVua3NbdGhlaXJzSW5kZXhdIHx8IHtvbGRTdGFydDogSW5maW5pdHl9O1xuXG4gICAgaWYgKGh1bmtCZWZvcmUobWluZUN1cnJlbnQsIHRoZWlyc0N1cnJlbnQpKSB7XG4gICAgICAvLyBUaGlzIHBhdGNoIGRvZXMgbm90IG92ZXJsYXAgd2l0aCBhbnkgb2YgdGhlIG90aGVycywgeWF5LlxuICAgICAgcmV0Lmh1bmtzLnB1c2goY2xvbmVIdW5rKG1pbmVDdXJyZW50LCBtaW5lT2Zmc2V0KSk7XG4gICAgICBtaW5lSW5kZXgrKztcbiAgICAgIHRoZWlyc09mZnNldCArPSBtaW5lQ3VycmVudC5uZXdMaW5lcyAtIG1pbmVDdXJyZW50Lm9sZExpbmVzO1xuICAgIH0gZWxzZSBpZiAoaHVua0JlZm9yZSh0aGVpcnNDdXJyZW50LCBtaW5lQ3VycmVudCkpIHtcbiAgICAgIC8vIFRoaXMgcGF0Y2ggZG9lcyBub3Qgb3ZlcmxhcCB3aXRoIGFueSBvZiB0aGUgb3RoZXJzLCB5YXkuXG4gICAgICByZXQuaHVua3MucHVzaChjbG9uZUh1bmsodGhlaXJzQ3VycmVudCwgdGhlaXJzT2Zmc2V0KSk7XG4gICAgICB0aGVpcnNJbmRleCsrO1xuICAgICAgbWluZU9mZnNldCArPSB0aGVpcnNDdXJyZW50Lm5ld0xpbmVzIC0gdGhlaXJzQ3VycmVudC5vbGRMaW5lcztcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gT3ZlcmxhcCwgbWVyZ2UgYXMgYmVzdCB3ZSBjYW5cbiAgICAgIGxldCBtZXJnZWRIdW5rID0ge1xuICAgICAgICBvbGRTdGFydDogTWF0aC5taW4obWluZUN1cnJlbnQub2xkU3RhcnQsIHRoZWlyc0N1cnJlbnQub2xkU3RhcnQpLFxuICAgICAgICBvbGRMaW5lczogMCxcbiAgICAgICAgbmV3U3RhcnQ6IE1hdGgubWluKG1pbmVDdXJyZW50Lm5ld1N0YXJ0ICsgbWluZU9mZnNldCwgdGhlaXJzQ3VycmVudC5vbGRTdGFydCArIHRoZWlyc09mZnNldCksXG4gICAgICAgIG5ld0xpbmVzOiAwLFxuICAgICAgICBsaW5lczogW11cbiAgICAgIH07XG4gICAgICBtZXJnZUxpbmVzKG1lcmdlZEh1bmssIG1pbmVDdXJyZW50Lm9sZFN0YXJ0LCBtaW5lQ3VycmVudC5saW5lcywgdGhlaXJzQ3VycmVudC5vbGRTdGFydCwgdGhlaXJzQ3VycmVudC5saW5lcyk7XG4gICAgICB0aGVpcnNJbmRleCsrO1xuICAgICAgbWluZUluZGV4Kys7XG5cbiAgICAgIHJldC5odW5rcy5wdXNoKG1lcmdlZEh1bmspO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXQ7XG59XG5cbmZ1bmN0aW9uIGxvYWRQYXRjaChwYXJhbSwgYmFzZSkge1xuICBpZiAodHlwZW9mIHBhcmFtID09PSAnc3RyaW5nJykge1xuICAgIGlmICgoL15AQC9tKS50ZXN0KHBhcmFtKSB8fCAoKC9eSW5kZXg6L20pLnRlc3QocGFyYW0pKSkge1xuICAgICAgcmV0dXJuIHBhcnNlUGF0Y2gocGFyYW0pWzBdO1xuICAgIH1cblxuICAgIGlmICghYmFzZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNdXN0IHByb3ZpZGUgYSBiYXNlIHJlZmVyZW5jZSBvciBwYXNzIGluIGEgcGF0Y2gnKTtcbiAgICB9XG4gICAgcmV0dXJuIHN0cnVjdHVyZWRQYXRjaCh1bmRlZmluZWQsIHVuZGVmaW5lZCwgYmFzZSwgcGFyYW0pO1xuICB9XG5cbiAgcmV0dXJuIHBhcmFtO1xufVxuXG5mdW5jdGlvbiBmaWxlTmFtZUNoYW5nZWQocGF0Y2gpIHtcbiAgcmV0dXJuIHBhdGNoLm5ld0ZpbGVOYW1lICYmIHBhdGNoLm5ld0ZpbGVOYW1lICE9PSBwYXRjaC5vbGRGaWxlTmFtZTtcbn1cblxuZnVuY3Rpb24gc2VsZWN0RmllbGQoaW5kZXgsIG1pbmUsIHRoZWlycykge1xuICBpZiAobWluZSA9PT0gdGhlaXJzKSB7XG4gICAgcmV0dXJuIG1pbmU7XG4gIH0gZWxzZSB7XG4gICAgaW5kZXguY29uZmxpY3QgPSB0cnVlO1xuICAgIHJldHVybiB7bWluZSwgdGhlaXJzfTtcbiAgfVxufVxuXG5mdW5jdGlvbiBodW5rQmVmb3JlKHRlc3QsIGNoZWNrKSB7XG4gIHJldHVybiB0ZXN0Lm9sZFN0YXJ0IDwgY2hlY2sub2xkU3RhcnRcbiAgICAmJiAodGVzdC5vbGRTdGFydCArIHRlc3Qub2xkTGluZXMpIDwgY2hlY2sub2xkU3RhcnQ7XG59XG5cbmZ1bmN0aW9uIGNsb25lSHVuayhodW5rLCBvZmZzZXQpIHtcbiAgcmV0dXJuIHtcbiAgICBvbGRTdGFydDogaHVuay5vbGRTdGFydCwgb2xkTGluZXM6IGh1bmsub2xkTGluZXMsXG4gICAgbmV3U3RhcnQ6IGh1bmsubmV3U3RhcnQgKyBvZmZzZXQsIG5ld0xpbmVzOiBodW5rLm5ld0xpbmVzLFxuICAgIGxpbmVzOiBodW5rLmxpbmVzXG4gIH07XG59XG5cbmZ1bmN0aW9uIG1lcmdlTGluZXMoaHVuaywgbWluZU9mZnNldCwgbWluZUxpbmVzLCB0aGVpck9mZnNldCwgdGhlaXJMaW5lcykge1xuICAvLyBUaGlzIHdpbGwgZ2VuZXJhbGx5IHJlc3VsdCBpbiBhIGNvbmZsaWN0ZWQgaHVuaywgYnV0IHRoZXJlIGFyZSBjYXNlcyB3aGVyZSB0aGUgY29udGV4dFxuICAvLyBpcyB0aGUgb25seSBvdmVybGFwIHdoZXJlIHdlIGNhbiBzdWNjZXNzZnVsbHkgbWVyZ2UgdGhlIGNvbnRlbnQgaGVyZS5cbiAgbGV0IG1pbmUgPSB7b2Zmc2V0OiBtaW5lT2Zmc2V0LCBsaW5lczogbWluZUxpbmVzLCBpbmRleDogMH0sXG4gICAgICB0aGVpciA9IHtvZmZzZXQ6IHRoZWlyT2Zmc2V0LCBsaW5lczogdGhlaXJMaW5lcywgaW5kZXg6IDB9O1xuXG4gIC8vIEhhbmRsZSBhbnkgbGVhZGluZyBjb250ZW50XG4gIGluc2VydExlYWRpbmcoaHVuaywgbWluZSwgdGhlaXIpO1xuICBpbnNlcnRMZWFkaW5nKGh1bmssIHRoZWlyLCBtaW5lKTtcblxuICAvLyBOb3cgaW4gdGhlIG92ZXJsYXAgY29udGVudC4gU2NhbiB0aHJvdWdoIGFuZCBzZWxlY3QgdGhlIGJlc3QgY2hhbmdlcyBmcm9tIGVhY2guXG4gIHdoaWxlIChtaW5lLmluZGV4IDwgbWluZS5saW5lcy5sZW5ndGggJiYgdGhlaXIuaW5kZXggPCB0aGVpci5saW5lcy5sZW5ndGgpIHtcbiAgICBsZXQgbWluZUN1cnJlbnQgPSBtaW5lLmxpbmVzW21pbmUuaW5kZXhdLFxuICAgICAgICB0aGVpckN1cnJlbnQgPSB0aGVpci5saW5lc1t0aGVpci5pbmRleF07XG5cbiAgICBpZiAoKG1pbmVDdXJyZW50WzBdID09PSAnLScgfHwgbWluZUN1cnJlbnRbMF0gPT09ICcrJylcbiAgICAgICAgJiYgKHRoZWlyQ3VycmVudFswXSA9PT0gJy0nIHx8IHRoZWlyQ3VycmVudFswXSA9PT0gJysnKSkge1xuICAgICAgLy8gQm90aCBtb2RpZmllZCAuLi5cbiAgICAgIG11dHVhbENoYW5nZShodW5rLCBtaW5lLCB0aGVpcik7XG4gICAgfSBlbHNlIGlmIChtaW5lQ3VycmVudFswXSA9PT0gJysnICYmIHRoZWlyQ3VycmVudFswXSA9PT0gJyAnKSB7XG4gICAgICAvLyBNaW5lIGluc2VydGVkXG4gICAgICBodW5rLmxpbmVzLnB1c2goLi4uIGNvbGxlY3RDaGFuZ2UobWluZSkpO1xuICAgIH0gZWxzZSBpZiAodGhlaXJDdXJyZW50WzBdID09PSAnKycgJiYgbWluZUN1cnJlbnRbMF0gPT09ICcgJykge1xuICAgICAgLy8gVGhlaXJzIGluc2VydGVkXG4gICAgICBodW5rLmxpbmVzLnB1c2goLi4uIGNvbGxlY3RDaGFuZ2UodGhlaXIpKTtcbiAgICB9IGVsc2UgaWYgKG1pbmVDdXJyZW50WzBdID09PSAnLScgJiYgdGhlaXJDdXJyZW50WzBdID09PSAnICcpIHtcbiAgICAgIC8vIE1pbmUgcmVtb3ZlZCBvciBlZGl0ZWRcbiAgICAgIHJlbW92YWwoaHVuaywgbWluZSwgdGhlaXIpO1xuICAgIH0gZWxzZSBpZiAodGhlaXJDdXJyZW50WzBdID09PSAnLScgJiYgbWluZUN1cnJlbnRbMF0gPT09ICcgJykge1xuICAgICAgLy8gVGhlaXIgcmVtb3ZlZCBvciBlZGl0ZWRcbiAgICAgIHJlbW92YWwoaHVuaywgdGhlaXIsIG1pbmUsIHRydWUpO1xuICAgIH0gZWxzZSBpZiAobWluZUN1cnJlbnQgPT09IHRoZWlyQ3VycmVudCkge1xuICAgICAgLy8gQ29udGV4dCBpZGVudGl0eVxuICAgICAgaHVuay5saW5lcy5wdXNoKG1pbmVDdXJyZW50KTtcbiAgICAgIG1pbmUuaW5kZXgrKztcbiAgICAgIHRoZWlyLmluZGV4Kys7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIENvbnRleHQgbWlzbWF0Y2hcbiAgICAgIGNvbmZsaWN0KGh1bmssIGNvbGxlY3RDaGFuZ2UobWluZSksIGNvbGxlY3RDaGFuZ2UodGhlaXIpKTtcbiAgICB9XG4gIH1cblxuICAvLyBOb3cgcHVzaCBhbnl0aGluZyB0aGF0IG1heSBiZSByZW1haW5pbmdcbiAgaW5zZXJ0VHJhaWxpbmcoaHVuaywgbWluZSk7XG4gIGluc2VydFRyYWlsaW5nKGh1bmssIHRoZWlyKTtcblxuICBjYWxjTGluZUNvdW50KGh1bmspO1xufVxuXG5mdW5jdGlvbiBtdXR1YWxDaGFuZ2UoaHVuaywgbWluZSwgdGhlaXIpIHtcbiAgbGV0IG15Q2hhbmdlcyA9IGNvbGxlY3RDaGFuZ2UobWluZSksXG4gICAgICB0aGVpckNoYW5nZXMgPSBjb2xsZWN0Q2hhbmdlKHRoZWlyKTtcblxuICBpZiAoYWxsUmVtb3ZlcyhteUNoYW5nZXMpICYmIGFsbFJlbW92ZXModGhlaXJDaGFuZ2VzKSkge1xuICAgIC8vIFNwZWNpYWwgY2FzZSBmb3IgcmVtb3ZlIGNoYW5nZXMgdGhhdCBhcmUgc3VwZXJzZXRzIG9mIG9uZSBhbm90aGVyXG4gICAgaWYgKGFycmF5U3RhcnRzV2l0aChteUNoYW5nZXMsIHRoZWlyQ2hhbmdlcylcbiAgICAgICAgJiYgc2tpcFJlbW92ZVN1cGVyc2V0KHRoZWlyLCBteUNoYW5nZXMsIG15Q2hhbmdlcy5sZW5ndGggLSB0aGVpckNoYW5nZXMubGVuZ3RoKSkge1xuICAgICAgaHVuay5saW5lcy5wdXNoKC4uLiBteUNoYW5nZXMpO1xuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSBpZiAoYXJyYXlTdGFydHNXaXRoKHRoZWlyQ2hhbmdlcywgbXlDaGFuZ2VzKVxuICAgICAgICAmJiBza2lwUmVtb3ZlU3VwZXJzZXQobWluZSwgdGhlaXJDaGFuZ2VzLCB0aGVpckNoYW5nZXMubGVuZ3RoIC0gbXlDaGFuZ2VzLmxlbmd0aCkpIHtcbiAgICAgIGh1bmsubGluZXMucHVzaCguLi4gdGhlaXJDaGFuZ2VzKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gIH0gZWxzZSBpZiAoYXJyYXlFcXVhbChteUNoYW5nZXMsIHRoZWlyQ2hhbmdlcykpIHtcbiAgICBodW5rLmxpbmVzLnB1c2goLi4uIG15Q2hhbmdlcyk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uZmxpY3QoaHVuaywgbXlDaGFuZ2VzLCB0aGVpckNoYW5nZXMpO1xufVxuXG5mdW5jdGlvbiByZW1vdmFsKGh1bmssIG1pbmUsIHRoZWlyLCBzd2FwKSB7XG4gIGxldCBteUNoYW5nZXMgPSBjb2xsZWN0Q2hhbmdlKG1pbmUpLFxuICAgICAgdGhlaXJDaGFuZ2VzID0gY29sbGVjdENvbnRleHQodGhlaXIsIG15Q2hhbmdlcyk7XG4gIGlmICh0aGVpckNoYW5nZXMubWVyZ2VkKSB7XG4gICAgaHVuay5saW5lcy5wdXNoKC4uLiB0aGVpckNoYW5nZXMubWVyZ2VkKTtcbiAgfSBlbHNlIHtcbiAgICBjb25mbGljdChodW5rLCBzd2FwID8gdGhlaXJDaGFuZ2VzIDogbXlDaGFuZ2VzLCBzd2FwID8gbXlDaGFuZ2VzIDogdGhlaXJDaGFuZ2VzKTtcbiAgfVxufVxuXG5mdW5jdGlvbiBjb25mbGljdChodW5rLCBtaW5lLCB0aGVpcikge1xuICBodW5rLmNvbmZsaWN0ID0gdHJ1ZTtcbiAgaHVuay5saW5lcy5wdXNoKHtcbiAgICBjb25mbGljdDogdHJ1ZSxcbiAgICBtaW5lOiBtaW5lLFxuICAgIHRoZWlyczogdGhlaXJcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGluc2VydExlYWRpbmcoaHVuaywgaW5zZXJ0LCB0aGVpcikge1xuICB3aGlsZSAoaW5zZXJ0Lm9mZnNldCA8IHRoZWlyLm9mZnNldCAmJiBpbnNlcnQuaW5kZXggPCBpbnNlcnQubGluZXMubGVuZ3RoKSB7XG4gICAgbGV0IGxpbmUgPSBpbnNlcnQubGluZXNbaW5zZXJ0LmluZGV4KytdO1xuICAgIGh1bmsubGluZXMucHVzaChsaW5lKTtcbiAgICBpbnNlcnQub2Zmc2V0Kys7XG4gIH1cbn1cbmZ1bmN0aW9uIGluc2VydFRyYWlsaW5nKGh1bmssIGluc2VydCkge1xuICB3aGlsZSAoaW5zZXJ0LmluZGV4IDwgaW5zZXJ0LmxpbmVzLmxlbmd0aCkge1xuICAgIGxldCBsaW5lID0gaW5zZXJ0LmxpbmVzW2luc2VydC5pbmRleCsrXTtcbiAgICBodW5rLmxpbmVzLnB1c2gobGluZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY29sbGVjdENoYW5nZShzdGF0ZSkge1xuICBsZXQgcmV0ID0gW10sXG4gICAgICBvcGVyYXRpb24gPSBzdGF0ZS5saW5lc1tzdGF0ZS5pbmRleF1bMF07XG4gIHdoaWxlIChzdGF0ZS5pbmRleCA8IHN0YXRlLmxpbmVzLmxlbmd0aCkge1xuICAgIGxldCBsaW5lID0gc3RhdGUubGluZXNbc3RhdGUuaW5kZXhdO1xuXG4gICAgLy8gR3JvdXAgYWRkaXRpb25zIHRoYXQgYXJlIGltbWVkaWF0ZWx5IGFmdGVyIHN1YnRyYWN0aW9ucyBhbmQgdHJlYXQgdGhlbSBhcyBvbmUgXCJhdG9taWNcIiBtb2RpZnkgY2hhbmdlLlxuICAgIGlmIChvcGVyYXRpb24gPT09ICctJyAmJiBsaW5lWzBdID09PSAnKycpIHtcbiAgICAgIG9wZXJhdGlvbiA9ICcrJztcbiAgICB9XG5cbiAgICBpZiAob3BlcmF0aW9uID09PSBsaW5lWzBdKSB7XG4gICAgICByZXQucHVzaChsaW5lKTtcbiAgICAgIHN0YXRlLmluZGV4Kys7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXQ7XG59XG5mdW5jdGlvbiBjb2xsZWN0Q29udGV4dChzdGF0ZSwgbWF0Y2hDaGFuZ2VzKSB7XG4gIGxldCBjaGFuZ2VzID0gW10sXG4gICAgICBtZXJnZWQgPSBbXSxcbiAgICAgIG1hdGNoSW5kZXggPSAwLFxuICAgICAgY29udGV4dENoYW5nZXMgPSBmYWxzZSxcbiAgICAgIGNvbmZsaWN0ZWQgPSBmYWxzZTtcbiAgd2hpbGUgKG1hdGNoSW5kZXggPCBtYXRjaENoYW5nZXMubGVuZ3RoXG4gICAgICAgICYmIHN0YXRlLmluZGV4IDwgc3RhdGUubGluZXMubGVuZ3RoKSB7XG4gICAgbGV0IGNoYW5nZSA9IHN0YXRlLmxpbmVzW3N0YXRlLmluZGV4XSxcbiAgICAgICAgbWF0Y2ggPSBtYXRjaENoYW5nZXNbbWF0Y2hJbmRleF07XG5cbiAgICAvLyBPbmNlIHdlJ3ZlIGhpdCBvdXIgYWRkLCB0aGVuIHdlIGFyZSBkb25lXG4gICAgaWYgKG1hdGNoWzBdID09PSAnKycpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGNvbnRleHRDaGFuZ2VzID0gY29udGV4dENoYW5nZXMgfHwgY2hhbmdlWzBdICE9PSAnICc7XG5cbiAgICBtZXJnZWQucHVzaChtYXRjaCk7XG4gICAgbWF0Y2hJbmRleCsrO1xuXG4gICAgLy8gQ29uc3VtZSBhbnkgYWRkaXRpb25zIGluIHRoZSBvdGhlciBibG9jayBhcyBhIGNvbmZsaWN0IHRvIGF0dGVtcHRcbiAgICAvLyB0byBwdWxsIGluIHRoZSByZW1haW5pbmcgY29udGV4dCBhZnRlciB0aGlzXG4gICAgaWYgKGNoYW5nZVswXSA9PT0gJysnKSB7XG4gICAgICBjb25mbGljdGVkID0gdHJ1ZTtcblxuICAgICAgd2hpbGUgKGNoYW5nZVswXSA9PT0gJysnKSB7XG4gICAgICAgIGNoYW5nZXMucHVzaChjaGFuZ2UpO1xuICAgICAgICBjaGFuZ2UgPSBzdGF0ZS5saW5lc1srK3N0YXRlLmluZGV4XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobWF0Y2guc3Vic3RyKDEpID09PSBjaGFuZ2Uuc3Vic3RyKDEpKSB7XG4gICAgICBjaGFuZ2VzLnB1c2goY2hhbmdlKTtcbiAgICAgIHN0YXRlLmluZGV4Kys7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbmZsaWN0ZWQgPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIGlmICgobWF0Y2hDaGFuZ2VzW21hdGNoSW5kZXhdIHx8ICcnKVswXSA9PT0gJysnXG4gICAgICAmJiBjb250ZXh0Q2hhbmdlcykge1xuICAgIGNvbmZsaWN0ZWQgPSB0cnVlO1xuICB9XG5cbiAgaWYgKGNvbmZsaWN0ZWQpIHtcbiAgICByZXR1cm4gY2hhbmdlcztcbiAgfVxuXG4gIHdoaWxlIChtYXRjaEluZGV4IDwgbWF0Y2hDaGFuZ2VzLmxlbmd0aCkge1xuICAgIG1lcmdlZC5wdXNoKG1hdGNoQ2hhbmdlc1ttYXRjaEluZGV4KytdKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbWVyZ2VkLFxuICAgIGNoYW5nZXNcbiAgfTtcbn1cblxuZnVuY3Rpb24gYWxsUmVtb3ZlcyhjaGFuZ2VzKSB7XG4gIHJldHVybiBjaGFuZ2VzLnJlZHVjZShmdW5jdGlvbihwcmV2LCBjaGFuZ2UpIHtcbiAgICByZXR1cm4gcHJldiAmJiBjaGFuZ2VbMF0gPT09ICctJztcbiAgfSwgdHJ1ZSk7XG59XG5mdW5jdGlvbiBza2lwUmVtb3ZlU3VwZXJzZXQoc3RhdGUsIHJlbW92ZUNoYW5nZXMsIGRlbHRhKSB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZGVsdGE7IGkrKykge1xuICAgIGxldCBjaGFuZ2VDb250ZW50ID0gcmVtb3ZlQ2hhbmdlc1tyZW1vdmVDaGFuZ2VzLmxlbmd0aCAtIGRlbHRhICsgaV0uc3Vic3RyKDEpO1xuICAgIGlmIChzdGF0ZS5saW5lc1tzdGF0ZS5pbmRleCArIGldICE9PSAnICcgKyBjaGFuZ2VDb250ZW50KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgc3RhdGUuaW5kZXggKz0gZGVsdGE7XG4gIHJldHVybiB0cnVlO1xufVxuXG5mdW5jdGlvbiBjYWxjT2xkTmV3TGluZUNvdW50KGxpbmVzKSB7XG4gIGxldCBvbGRMaW5lcyA9IDA7XG4gIGxldCBuZXdMaW5lcyA9IDA7XG5cbiAgbGluZXMuZm9yRWFjaChmdW5jdGlvbihsaW5lKSB7XG4gICAgaWYgKHR5cGVvZiBsaW5lICE9PSAnc3RyaW5nJykge1xuICAgICAgbGV0IG15Q291bnQgPSBjYWxjT2xkTmV3TGluZUNvdW50KGxpbmUubWluZSk7XG4gICAgICBsZXQgdGhlaXJDb3VudCA9IGNhbGNPbGROZXdMaW5lQ291bnQobGluZS50aGVpcnMpO1xuXG4gICAgICBpZiAob2xkTGluZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAobXlDb3VudC5vbGRMaW5lcyA9PT0gdGhlaXJDb3VudC5vbGRMaW5lcykge1xuICAgICAgICAgIG9sZExpbmVzICs9IG15Q291bnQub2xkTGluZXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb2xkTGluZXMgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKG5ld0xpbmVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKG15Q291bnQubmV3TGluZXMgPT09IHRoZWlyQ291bnQubmV3TGluZXMpIHtcbiAgICAgICAgICBuZXdMaW5lcyArPSBteUNvdW50Lm5ld0xpbmVzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5ld0xpbmVzID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChuZXdMaW5lcyAhPT0gdW5kZWZpbmVkICYmIChsaW5lWzBdID09PSAnKycgfHwgbGluZVswXSA9PT0gJyAnKSkge1xuICAgICAgICBuZXdMaW5lcysrO1xuICAgICAgfVxuICAgICAgaWYgKG9sZExpbmVzICE9PSB1bmRlZmluZWQgJiYgKGxpbmVbMF0gPT09ICctJyB8fCBsaW5lWzBdID09PSAnICcpKSB7XG4gICAgICAgIG9sZExpbmVzKys7XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICByZXR1cm4ge29sZExpbmVzLCBuZXdMaW5lc307XG59XG4iXX0=


/***/ }),

/***/ "./node_modules/diff/lib/patch/parse.js":
/*!**********************************************!*\
  !*** ./node_modules/diff/lib/patch/parse.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
/*istanbul ignore start*/


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.parsePatch = parsePatch;

/*istanbul ignore end*/
function parsePatch(uniDiff) {
  /*istanbul ignore start*/
  var
  /*istanbul ignore end*/
  options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var diffstr = uniDiff.split(/\r\n|[\n\v\f\r\x85]/),
      delimiters = uniDiff.match(/\r\n|[\n\v\f\r\x85]/g) || [],
      list = [],
      i = 0;

  function parseIndex() {
    var index = {};
    list.push(index); // Parse diff metadata

    while (i < diffstr.length) {
      var line = diffstr[i]; // File header found, end parsing diff metadata

      if (/^(\-\-\-|\+\+\+|@@)\s/.test(line)) {
        break;
      } // Diff index


      var header = /^(?:Index:|diff(?: -r \w+)+)\s+(.+?)\s*$/.exec(line);

      if (header) {
        index.index = header[1];
      }

      i++;
    } // Parse file headers if they are defined. Unified diff requires them, but
    // there's no technical issues to have an isolated hunk without file header


    parseFileHeader(index);
    parseFileHeader(index); // Parse hunks

    index.hunks = [];

    while (i < diffstr.length) {
      var _line = diffstr[i];

      if (/^(Index:|diff|\-\-\-|\+\+\+)\s/.test(_line)) {
        break;
      } else if (/^@@/.test(_line)) {
        index.hunks.push(parseHunk());
      } else if (_line && options.strict) {
        // Ignore unexpected content unless in strict mode
        throw new Error('Unknown line ' + (i + 1) + ' ' + JSON.stringify(_line));
      } else {
        i++;
      }
    }
  } // Parses the --- and +++ headers, if none are found, no lines
  // are consumed.


  function parseFileHeader(index) {
    var fileHeader = /^(---|\+\+\+)\s+(.*)$/.exec(diffstr[i]);

    if (fileHeader) {
      var keyPrefix = fileHeader[1] === '---' ? 'old' : 'new';
      var data = fileHeader[2].split('\t', 2);
      var fileName = data[0].replace(/\\\\/g, '\\');

      if (/^".*"$/.test(fileName)) {
        fileName = fileName.substr(1, fileName.length - 2);
      }

      index[keyPrefix + 'FileName'] = fileName;
      index[keyPrefix + 'Header'] = (data[1] || '').trim();
      i++;
    }
  } // Parses a hunk
  // This assumes that we are at the start of a hunk.


  function parseHunk() {
    var chunkHeaderIndex = i,
        chunkHeaderLine = diffstr[i++],
        chunkHeader = chunkHeaderLine.split(/@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/);
    var hunk = {
      oldStart: +chunkHeader[1],
      oldLines: typeof chunkHeader[2] === 'undefined' ? 1 : +chunkHeader[2],
      newStart: +chunkHeader[3],
      newLines: typeof chunkHeader[4] === 'undefined' ? 1 : +chunkHeader[4],
      lines: [],
      linedelimiters: []
    }; // Unified Diff Format quirk: If the chunk size is 0,
    // the first number is one lower than one would expect.
    // https://www.artima.com/weblogs/viewpost.jsp?thread=164293

    if (hunk.oldLines === 0) {
      hunk.oldStart += 1;
    }

    if (hunk.newLines === 0) {
      hunk.newStart += 1;
    }

    var addCount = 0,
        removeCount = 0;

    for (; i < diffstr.length; i++) {
      // Lines starting with '---' could be mistaken for the "remove line" operation
      // But they could be the header for the next file. Therefore prune such cases out.
      if (diffstr[i].indexOf('--- ') === 0 && i + 2 < diffstr.length && diffstr[i + 1].indexOf('+++ ') === 0 && diffstr[i + 2].indexOf('@@') === 0) {
        break;
      }

      var operation = diffstr[i].length == 0 && i != diffstr.length - 1 ? ' ' : diffstr[i][0];

      if (operation === '+' || operation === '-' || operation === ' ' || operation === '\\') {
        hunk.lines.push(diffstr[i]);
        hunk.linedelimiters.push(delimiters[i] || '\n');

        if (operation === '+') {
          addCount++;
        } else if (operation === '-') {
          removeCount++;
        } else if (operation === ' ') {
          addCount++;
          removeCount++;
        }
      } else {
        break;
      }
    } // Handle the empty block count case


    if (!addCount && hunk.newLines === 1) {
      hunk.newLines = 0;
    }

    if (!removeCount && hunk.oldLines === 1) {
      hunk.oldLines = 0;
    } // Perform optional sanity checking


    if (options.strict) {
      if (addCount !== hunk.newLines) {
        throw new Error('Added line count did not match for hunk at line ' + (chunkHeaderIndex + 1));
      }

      if (removeCount !== hunk.oldLines) {
        throw new Error('Removed line count did not match for hunk at line ' + (chunkHeaderIndex + 1));
      }
    }

    return hunk;
  }

  while (i < diffstr.length) {
    parseIndex();
  }

  return list;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9wYXRjaC9wYXJzZS5qcyJdLCJuYW1lcyI6WyJwYXJzZVBhdGNoIiwidW5pRGlmZiIsIm9wdGlvbnMiLCJkaWZmc3RyIiwic3BsaXQiLCJkZWxpbWl0ZXJzIiwibWF0Y2giLCJsaXN0IiwiaSIsInBhcnNlSW5kZXgiLCJpbmRleCIsInB1c2giLCJsZW5ndGgiLCJsaW5lIiwidGVzdCIsImhlYWRlciIsImV4ZWMiLCJwYXJzZUZpbGVIZWFkZXIiLCJodW5rcyIsInBhcnNlSHVuayIsInN0cmljdCIsIkVycm9yIiwiSlNPTiIsInN0cmluZ2lmeSIsImZpbGVIZWFkZXIiLCJrZXlQcmVmaXgiLCJkYXRhIiwiZmlsZU5hbWUiLCJyZXBsYWNlIiwic3Vic3RyIiwidHJpbSIsImNodW5rSGVhZGVySW5kZXgiLCJjaHVua0hlYWRlckxpbmUiLCJjaHVua0hlYWRlciIsImh1bmsiLCJvbGRTdGFydCIsIm9sZExpbmVzIiwibmV3U3RhcnQiLCJuZXdMaW5lcyIsImxpbmVzIiwibGluZWRlbGltaXRlcnMiLCJhZGRDb3VudCIsInJlbW92ZUNvdW50IiwiaW5kZXhPZiIsIm9wZXJhdGlvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQU8sU0FBU0EsVUFBVCxDQUFvQkMsT0FBcEIsRUFBMkM7QUFBQTtBQUFBO0FBQUE7QUFBZEMsRUFBQUEsT0FBYyx1RUFBSixFQUFJO0FBQ2hELE1BQUlDLE9BQU8sR0FBR0YsT0FBTyxDQUFDRyxLQUFSLENBQWMscUJBQWQsQ0FBZDtBQUFBLE1BQ0lDLFVBQVUsR0FBR0osT0FBTyxDQUFDSyxLQUFSLENBQWMsc0JBQWQsS0FBeUMsRUFEMUQ7QUFBQSxNQUVJQyxJQUFJLEdBQUcsRUFGWDtBQUFBLE1BR0lDLENBQUMsR0FBRyxDQUhSOztBQUtBLFdBQVNDLFVBQVQsR0FBc0I7QUFDcEIsUUFBSUMsS0FBSyxHQUFHLEVBQVo7QUFDQUgsSUFBQUEsSUFBSSxDQUFDSSxJQUFMLENBQVVELEtBQVYsRUFGb0IsQ0FJcEI7O0FB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QUwsS0FBa0IsQ0FBbkMsRUFBc0M7QUFDcENKLE1BQUFBLElBQUksQ0FBQ0ksUUFBTCxHQUFnQixDQUFoQjtBQUNEOztBQUNELFFBQUksQ0FBQ0ksV0FBRCxJQUFnQlIsSUFBSSxDQUFDRSxRQUFMLEtBQWtCLENBQXRDLEVBQXlDO0FBQ3ZDRixNQUFBQSxJQUFJLENBQUNFLFFBQUwsR0FBZ0IsQ0FBaEI7QUFDRCxLQTVEa0IsQ0E4RG5COzs7QUFDQSxRQUFJbEMsT0FBTyxDQUFDa0IsTUFBWixFQUFvQjtBQUNsQixVQUFJcUIsUUFBUSxLQUFLUCxJQUFJLENBQUNJLFFBQXRCLEVBQWdDO0FBQzlCLGNBQU0sSUFBSWpCLEtBQUosQ0FBVSxzREFBc0RVLGdCQUFnQixHQUFHLENBQXpFLENBQVYsQ0FBTjtBQUNEOztBQUNELFVBQUlXLFdBQVcsS0FBS1IsSUFBSSxDQUFDRSxRQUF6QixFQUFtQztBQUNqQyxjQUFNLElBQUlmLEtBQUosQ0FBVSx3REFBd0RVLGdCQUFnQixHQUFHLENBQTNFLENBQVYsQ0FBTjtBQUNEO0FBQ0Y7O0FBRUQsV0FBT0csSUFBUDtBQUNEOztBQUVELFNBQU8xQixDQUFDLEdBQUdMLE9BQU8sQ0FBQ1MsTUFBbkIsRUFBMkI7QUFDekJILElBQUFBLFVBQVU7QUFDWDs7QUFFRCxTQUFPRixJQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gcGFyc2VQYXRjaCh1bmlEaWZmLCBvcHRpb25zID0ge30pIHtcbiAgbGV0IGRpZmZzdHIgPSB1bmlEaWZmLnNwbGl0KC9cXHJcXG58W1xcblxcdlxcZlxcclxceDg1XS8pLFxuICAgICAgZGVsaW1pdGVycyA9IHVuaURpZmYubWF0Y2goL1xcclxcbnxbXFxuXFx2XFxmXFxyXFx4ODVdL2cpIHx8IFtdLFxuICAgICAgbGlzdCA9IFtdLFxuICAgICAgaSA9IDA7XG5cbiAgZnVuY3Rpb24gcGFyc2VJbmRleCgpIHtcbiAgICBsZXQgaW5kZXggPSB7fTtcbiAgICBsaXN0LnB1c2goaW5kZXgpO1xuXG4gICAgLy8gUGFyc2UgZGlmZiBtZXRhZGF0YVxuICAgIHdoaWxlIChpIDwgZGlmZnN0ci5sZW5ndGgpIHtcbiAgICAgIGxldCBsaW5lID0gZGlmZnN0cltpXTtcblxuICAgICAgLy8gRmlsZSBoZWFkZXIgZm91bmQsIGVuZCBwYXJzaW5nIGRpZmYgbWV0YWRhdGFcbiAgICAgIGlmICgoL14oXFwtXFwtXFwtfFxcK1xcK1xcK3xAQClcXHMvKS50ZXN0KGxpbmUpKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICAvLyBEaWZmIGluZGV4XG4gICAgICBsZXQgaGVhZGVyID0gKC9eKD86SW5kZXg6fGRpZmYoPzogLXIgXFx3KykrKVxccysoLis/KVxccyokLykuZXhlYyhsaW5lKTtcbiAgICAgIGlmIChoZWFkZXIpIHtcbiAgICAgICAgaW5kZXguaW5kZXggPSBoZWFkZXJbMV07XG4gICAgICB9XG5cbiAgICAgIGkrKztcbiAgICB9XG5cbiAgICAvLyBQYXJzZSBmaWxlIGhlYWRlcnMgaWYgdGhleSBhcmUgZGVmaW5lZC4gVW5pZmllZCBkaWZmIHJlcXVpcmVzIHRoZW0sIGJ1dFxuICAgIC8vIHRoZXJlJ3Mgbm8gdGVjaG5pY2FsIGlzc3VlcyB0byBoYXZlIGFuIGlzb2xhdGVkIGh1bmsgd2l0aG91dCBmaWxlIGhlYWRlclxuICAgIHBhcnNlRmlsZUhlYWRlcihpbmRleCk7XG4gICAgcGFyc2VGaWxlSGVhZGVyKGluZGV4KTtcblxuICAgIC8vIFBhcnNlIGh1bmtzXG4gICAgaW5kZXguaHVua3MgPSBbXTtcblxuICAgIHdoaWxlIChpIDwgZGlmZnN0ci5sZW5ndGgpIHtcbiAgICAgIGxldCBsaW5lID0gZGlmZnN0cltpXTtcblxuICAgICAgaWYgKCgvXihJbmRleDp8ZGlmZnxcXC1cXC1cXC18XFwrXFwrXFwrKVxccy8pLnRlc3QobGluZSkpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9IGVsc2UgaWYgKCgvXkBALykudGVzdChsaW5lKSkge1xuICAgICAgICBpbmRleC5odW5rcy5wdXNoKHBhcnNlSHVuaygpKTtcbiAgICAgIH0gZWxzZSBpZiAobGluZSAmJiBvcHRpb25zLnN0cmljdCkge1xuICAgICAgICAvLyBJZ25vcmUgdW5leHBlY3RlZCBjb250ZW50IHVubGVzcyBpbiBzdHJpY3QgbW9kZVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gbGluZSAnICsgKGkgKyAxKSArICcgJyArIEpTT04uc3RyaW5naWZ5KGxpbmUpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGkrKztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBQYXJzZXMgdGhlIC0tLSBhbmQgKysrIGhlYWRlcnMsIGlmIG5vbmUgYXJlIGZvdW5kLCBubyBsaW5lc1xuICAvLyBhcmUgY29uc3VtZWQuXG4gIGZ1bmN0aW9uIHBhcnNlRmlsZUhlYWRlcihpbmRleCkge1xuICAgIGNvbnN0IGZpbGVIZWFkZXIgPSAoL14oLS0tfFxcK1xcK1xcKylcXHMrKC4qKSQvKS5leGVjKGRpZmZzdHJbaV0pO1xuICAgIGlmIChmaWxlSGVhZGVyKSB7XG4gICAgICBsZXQga2V5UHJlZml4ID0gZmlsZUhlYWRlclsxXSA9PT0gJy0tLScgPyAnb2xkJyA6ICduZXcnO1xuICAgICAgY29uc3QgZGF0YSA9IGZpbGVIZWFkZXJbMl0uc3BsaXQoJ1xcdCcsIDIpO1xuICAgICAgbGV0IGZpbGVOYW1lID0gZGF0YVswXS5yZXBsYWNlKC9cXFxcXFxcXC9nLCAnXFxcXCcpO1xuICAgICAgaWYgKCgvXlwiLipcIiQvKS50ZXN0KGZpbGVOYW1lKSkge1xuICAgICAgICBmaWxlTmFtZSA9IGZpbGVOYW1lLnN1YnN0cigxLCBmaWxlTmFtZS5sZW5ndGggLSAyKTtcbiAgICAgIH1cbiAgICAgIGluZGV4W2tleVByZWZpeCArICdGaWxlTmFtZSddID0gZmlsZU5hbWU7XG4gICAgICBpbmRleFtrZXlQcmVmaXggKyAnSGVhZGVyJ10gPSAoZGF0YVsxXSB8fCAnJykudHJpbSgpO1xuXG4gICAgICBpKys7XG4gICAgfVxuICB9XG5cbiAgLy8gUGFyc2VzIGEgaHVua1xuICAvLyBUaGlzIGFzc3VtZXMgdGhhdCB3ZSBhcmUgYXQgdGhlIHN0YXJ0IG9mIGEgaHVuay5cbiAgZnVuY3Rpb24gcGFyc2VIdW5rKCkge1xuICAgIGxldCBjaHVua0hlYWRlckluZGV4ID0gaSxcbiAgICAgICAgY2h1bmtIZWFkZXJMaW5lID0gZGlmZnN0cltpKytdLFxuICAgICAgICBjaHVua0hlYWRlciA9IGNodW5rSGVhZGVyTGluZS5zcGxpdCgvQEAgLShcXGQrKSg/OiwoXFxkKykpPyBcXCsoXFxkKykoPzosKFxcZCspKT8gQEAvKTtcblxuICAgIGxldCBodW5rID0ge1xuICAgICAgb2xkU3RhcnQ6ICtjaHVua0hlYWRlclsxXSxcbiAgICAgIG9sZExpbmVzOiB0eXBlb2YgY2h1bmtIZWFkZXJbMl0gPT09ICd1bmRlZmluZWQnID8gMSA6ICtjaHVua0hlYWRlclsyXSxcbiAgICAgIG5ld1N0YXJ0OiArY2h1bmtIZWFkZXJbM10sXG4gICAgICBuZXdMaW5lczogdHlwZW9mIGNodW5rSGVhZGVyWzRdID09PSAndW5kZWZpbmVkJyA/IDEgOiArY2h1bmtIZWFkZXJbNF0sXG4gICAgICBsaW5lczogW10sXG4gICAgICBsaW5lZGVsaW1pdGVyczogW11cbiAgICB9O1xuXG4gICAgLy8gVW5pZmllZCBEaWZmIEZvcm1hdCBxdWlyazogSWYgdGhlIGNodW5rIHNpemUgaXMgMCxcbiAgICAvLyB0aGUgZmlyc3QgbnVtYmVyIGlzIG9uZSBsb3dlciB0aGFuIG9uZSB3b3VsZCBleHBlY3QuXG4gICAgLy8gaHR0cHM6Ly93d3cuYXJ0aW1hLmNvbS93ZWJsb2dzL3ZpZXdwb3N0LmpzcD90aHJlYWQ9MTY0MjkzXG4gICAgaWYgKGh1bmsub2xkTGluZXMgPT09IDApIHtcbiAgICAgIGh1bmsub2xkU3RhcnQgKz0gMTtcbiAgICB9XG4gICAgaWYgKGh1bmsubmV3TGluZXMgPT09IDApIHtcbiAgICAgIGh1bmsubmV3U3RhcnQgKz0gMTtcbiAgICB9XG5cbiAgICBsZXQgYWRkQ291bnQgPSAwLFxuICAgICAgICByZW1vdmVDb3VudCA9IDA7XG4gICAgZm9yICg7IGkgPCBkaWZmc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgICAvLyBMaW5lcyBzdGFydGluZyB3aXRoICctLS0nIGNvdWxkIGJlIG1pc3Rha2VuIGZvciB0aGUgXCJyZW1vdmUgbGluZVwiIG9wZXJhdGlvblxuICAgICAgLy8gQnV0IHRoZXkgY291bGQgYmUgdGhlIGhlYWRlciBmb3IgdGhlIG5leHQgZmlsZS4gVGhlcmVmb3JlIHBydW5lIHN1Y2ggY2FzZXMgb3V0LlxuICAgICAgaWYgKGRpZmZzdHJbaV0uaW5kZXhPZignLS0tICcpID09PSAwXG4gICAgICAgICAgICAmJiAoaSArIDIgPCBkaWZmc3RyLmxlbmd0aClcbiAgICAgICAgICAgICYmIGRpZmZzdHJbaSArIDFdLmluZGV4T2YoJysrKyAnKSA9PT0gMFxuICAgICAgICAgICAgJiYgZGlmZnN0cltpICsgMl0uaW5kZXhPZignQEAnKSA9PT0gMCkge1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgbGV0IG9wZXJhdGlvbiA9IChkaWZmc3RyW2ldLmxlbmd0aCA9PSAwICYmIGkgIT0gKGRpZmZzdHIubGVuZ3RoIC0gMSkpID8gJyAnIDogZGlmZnN0cltpXVswXTtcblxuICAgICAgaWYgKG9wZXJhdGlvbiA9PT0gJysnIHx8IG9wZXJhdGlvbiA9PT0gJy0nIHx8IG9wZXJhdGlvbiA9PT0gJyAnIHx8IG9wZXJhdGlvbiA9PT0gJ1xcXFwnKSB7XG4gICAgICAgIGh1bmsubGluZXMucHVzaChkaWZmc3RyW2ldKTtcbiAgICAgICAgaHVuay5saW5lZGVsaW1pdGVycy5wdXNoKGRlbGltaXRlcnNbaV0gfHwgJ1xcbicpO1xuXG4gICAgICAgIGlmIChvcGVyYXRpb24gPT09ICcrJykge1xuICAgICAgICAgIGFkZENvdW50Kys7XG4gICAgICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uID09PSAnLScpIHtcbiAgICAgICAgICByZW1vdmVDb3VudCsrO1xuICAgICAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PT0gJyAnKSB7XG4gICAgICAgICAgYWRkQ291bnQrKztcbiAgICAgICAgICByZW1vdmVDb3VudCsrO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBIYW5kbGUgdGhlIGVtcHR5IGJsb2NrIGNvdW50IGNhc2VcbiAgICBpZiAoIWFkZENvdW50ICYmIGh1bmsubmV3TGluZXMgPT09IDEpIHtcbiAgICAgIGh1bmsubmV3TGluZXMgPSAwO1xuICAgIH1cbiAgICBpZiAoIXJlbW92ZUNvdW50ICYmIGh1bmsub2xkTGluZXMgPT09IDEpIHtcbiAgICAgIGh1bmsub2xkTGluZXMgPSAwO1xuICAgIH1cblxuICAgIC8vIFBlcmZvcm0gb3B0aW9uYWwgc2FuaXR5IGNoZWNraW5nXG4gICAgaWYgKG9wdGlvbnMuc3RyaWN0KSB7XG4gICAgICBpZiAoYWRkQ291bnQgIT09IGh1bmsubmV3TGluZXMpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBZGRlZCBsaW5lIGNvdW50IGRpZCBub3QgbWF0Y2ggZm9yIGh1bmsgYXQgbGluZSAnICsgKGNodW5rSGVhZGVySW5kZXggKyAxKSk7XG4gICAgICB9XG4gICAgICBpZiAocmVtb3ZlQ291bnQgIT09IGh1bmsub2xkTGluZXMpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZW1vdmVkIGxpbmUgY291bnQgZGlkIG5vdCBtYXRjaCBmb3IgaHVuayBhdCBsaW5lICcgKyAoY2h1bmtIZWFkZXJJbmRleCArIDEpKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gaHVuaztcbiAgfVxuXG4gIHdoaWxlIChpIDwgZGlmZnN0ci5sZW5ndGgpIHtcbiAgICBwYXJzZUluZGV4KCk7XG4gIH1cblxuICByZXR1cm4gbGlzdDtcbn1cbiJdfQ==


/***/ }),

/***/ "./node_modules/diff/lib/util/array.js":
/*!*********************************************!*\
  !*** ./node_modules/diff/lib/util/array.js ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
/*istanbul ignore start*/


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.arrayEqual = arrayEqual;
exports.arrayStartsWith = arrayStartsWith;

/*istanbul ignore end*/
function arrayEqual(a, b) {
  if (a.length !== b.length) {
    return false;
  }

  return arrayStartsWith(a, b);
}

function arrayStartsWith(array, start) {
  if (start.length > array.length) {
    return false;
  }

  for (var i = 0; i < start.length; i++) {
    if (start[i] !== array[i]) {
      return false;
    }
  }

  return true;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL2FycmF5LmpzIl0sIm5hbWVzIjpbImFycmF5RXF1YWwiLCJhIiwiYiIsImxlbmd0aCIsImFycmF5U3RhcnRzV2l0aCIsImFycmF5Iiwic3RhcnQiLCJpIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQU8sU0FBU0EsVUFBVCxDQUFvQkMsQ0FBcEIsRUFBdUJDLENBQXZCLEVBQTBCO0FBQy9CLE1BQUlELENBQUMsQ0FBQ0UsTUFBRixLQUFhRCxDQUFDLENBQUNDLE1BQW5CLEVBQTJCO0FBQ3pCLFdBQU8sS0FBUDtBQUNEOztBQUVELFNBQU9DLGVBQWUsQ0FBQ0gsQ0FBRCxFQUFJQyxDQUFKLENBQXRCO0FBQ0Q7O0FBRU0sU0FBU0UsZUFBVCxDQUF5QkMsS0FBekIsRUFBZ0NDLEtBQWhDLEVBQXVDO0FBQzVDLE1BQUlBLEtBQUssQ0FBQ0gsTUFBTixHQUFlRSxLQUFLLENBQUNGLE1BQXpCLEVBQWlDO0FBQy9CLFdBQU8sS0FBUDtBQUNEOztBQUVELE9BQUssSUFBSUksQ0FBQyxHQUFHLENBQWIsRUFBZ0JBLENBQUMsR0FBR0QsS0FBSyxDQUFDSCxNQUExQixFQUFrQ0ksQ0FBQyxFQUFuQyxFQUF1QztBQUNyQyxRQUFJRCxLQUFLLENBQUNDLENBQUQsQ0FBTCxLQUFhRixLQUFLLENBQUNFLENBQUQsQ0FBdEIsRUFBMkI7QUFDekIsYUFBTyxLQUFQO0FBQ0Q7QUFDRjs7QUFFRCxTQUFPLElBQVA7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBmdW5jdGlvbiBhcnJheUVxdWFsKGEsIGIpIHtcbiAgaWYgKGEubGVuZ3RoICE9PSBiLmxlbmd0aCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHJldHVybiBhcnJheVN0YXJ0c1dpdGgoYSwgYik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhcnJheVN0YXJ0c1dpdGgoYXJyYXksIHN0YXJ0KSB7XG4gIGlmIChzdGFydC5sZW5ndGggPiBhcnJheS5sZW5ndGgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmb3IgKGxldCBpID0gMDsgaSA8IHN0YXJ0Lmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0YXJ0W2ldICE9PSBhcnJheVtpXSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuIl19


/***/ }),

/***/ "./node_modules/diff/lib/util/distance-iterator.js":
/*!*********************************************************!*\
  !*** ./node_modules/diff/lib/util/distance-iterator.js ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
/*istanbul ignore start*/


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.default = _default;

/*istanbul ignore end*/
// Iterator that traverses in the range of [min, max], stepping
// by distance from a given start position. I.e. for [0, 4], with
// start of 2, this will iterate 2, 3, 1, 4, 0.
function
/*istanbul ignore start*/
_default
/*istanbul ignore end*/
(start, minLine, maxLine) {
  var wantForward = true,
      backwardExhausted = false,
      forwardExhausted = false,
      localOffset = 1;
  return function iterator() {
    if (wantForward && !forwardExhausted) {
      if (backwardExhausted) {
        localOffset++;
      } else {
        wantForward = false;
      } // Check if trying to fit beyond text length, and if not, check it fits
      // after offset location (or desired location on first iteration)


      if (start + localOffset <= maxLine) {
        return localOffset;
      }

      forwardExhausted = true;
    }

    if (!backwardExhausted) {
      if (!forwardExhausted) {
        wantForward = true;
      } // Check if trying to fit before text beginning, and if not, check it fits
      // before offset location


      if (minLine <= start - localOffset) {
        return -localOffset++;
      }

      backwardExhausted = true;
      return iterator();
    } // We tried to fit hunk before text beginning and beyond text length, then
    // hunk can't fit on the text. Return undefined

  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL2Rpc3RhbmNlLWl0ZXJhdG9yLmpzIl0sIm5hbWVzIjpbInN0YXJ0IiwibWluTGluZSIsIm1heExpbmUiLCJ3YW50Rm9yd2FyZCIsImJhY2t3YXJkRXhoYXVzdGVkIiwiZm9yd2FyZEV4aGF1c3RlZCIsImxvY2FsT2Zmc2V0IiwiaXRlcmF0b3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNlO0FBQUE7QUFBQTtBQUFBO0FBQUEsQ0FBU0EsS0FBVCxFQUFnQkMsT0FBaEIsRUFBeUJDLE9BQXpCLEVBQWtDO0FBQy9DLE1BQUlDLFdBQVcsR0FBRyxJQUFsQjtBQUFBLE1BQ0lDLGlCQUFpQixHQUFHLEtBRHhCO0FBQUEsTUFFSUMsZ0JBQWdCLEdBQUcsS0FGdkI7QUFBQSxNQUdJQyxXQUFXLEdBQUcsQ0FIbEI7QUFLQSxTQUFPLFNBQVNDLFFBQVQsR0FBb0I7QUFDekIsUUFBSUosV0FBVyxJQUFJLENBQUNFLGdCQUFwQixFQUFzQztBQUNwQyxVQUFJRCxpQkFBSixFQUF1QjtBQUNyQkUsUUFBQUEsV0FBVztBQUNaLE9BRkQsTUFFTztBQUNMSCxRQUFBQSxXQUFXLEdBQUcsS0FBZDtBQUNELE9BTG1DLENBT3BDO0FBQ0E7OztBQUNBLFVBQUlILEtBQUssR0FBR00sV0FBUixJQUF1QkosT0FBM0IsRUFBb0M7QUFDbEMsZUFBT0ksV0FBUDtBQUNEOztBQUVERCxNQUFBQSxnQkFBZ0IsR0FBRyxJQUFuQjtBQUNEOztBQUVELFFBQUksQ0FBQ0QsaUJBQUwsRUFBd0I7QUFDdEIsVUFBSSxDQUFDQyxnQkFBTCxFQUF1QjtBQUNyQkYsUUFBQUEsV0FBVyxHQUFHLElBQWQ7QUFDRCxPQUhxQixDQUt0QjtBQUNBOzs7QUFDQSxVQUFJRixPQUFPLElBQUlELEtBQUssR0FBR00sV0FBdkIsRUFBb0M7QUFDbEMsZUFBTyxDQUFDQSxXQUFXLEVBQW5CO0FBQ0Q7O0FBRURGLE1BQUFBLGlCQUFpQixHQUFHLElBQXBCO0FBQ0EsYUFBT0csUUFBUSxFQUFmO0FBQ0QsS0E5QndCLENBZ0N6QjtBQUNBOztBQUNELEdBbENEO0FBbUNEIiwic291cmNlc0NvbnRlbnQiOlsiLy8gSXRlcmF0b3IgdGhhdCB0cmF2ZXJzZXMgaW4gdGhlIHJhbmdlIG9mIFttaW4sIG1heF0sIHN0ZXBwaW5nXG4vLyBieSBkaXN0YW5jZSBmcm9tIGEgZ2l2ZW4gc3RhcnQgcG9zaXRpb24uIEkuZS4gZm9yIFswLCA0XSwgd2l0aFxuLy8gc3RhcnQgb2YgMiwgdGhpcyB3aWxsIGl0ZXJhdGUgMiwgMywgMSwgNCwgMC5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHN0YXJ0LCBtaW5MaW5lLCBtYXhMaW5lKSB7XG4gIGxldCB3YW50Rm9yd2FyZCA9IHRydWUsXG4gICAgICBiYWNrd2FyZEV4aGF1c3RlZCA9IGZhbHNlLFxuICAgICAgZm9yd2FyZEV4aGF1c3RlZCA9IGZhbHNlLFxuICAgICAgbG9jYWxPZmZzZXQgPSAxO1xuXG4gIHJldHVybiBmdW5jdGlvbiBpdGVyYXRvcigpIHtcbiAgICBpZiAod2FudEZvcndhcmQgJiYgIWZvcndhcmRFeGhhdXN0ZWQpIHtcbiAgICAgIGlmIChiYWNrd2FyZEV4aGF1c3RlZCkge1xuICAgICAgICBsb2NhbE9mZnNldCsrO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgd2FudEZvcndhcmQgPSBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgLy8gQ2hlY2sgaWYgdHJ5aW5nIHRvIGZpdCBiZXlvbmQgdGV4dCBsZW5ndGgsIGFuZCBpZiBub3QsIGNoZWNrIGl0IGZpdHNcbiAgICAgIC8vIGFmdGVyIG9mZnNldCBsb2NhdGlvbiAob3IgZGVzaXJlZCBsb2NhdGlvbiBvbiBmaXJzdCBpdGVyYXRpb24pXG4gICAgICBpZiAoc3RhcnQgKyBsb2NhbE9mZnNldCA8PSBtYXhMaW5lKSB7XG4gICAgICAgIHJldHVybiBsb2NhbE9mZnNldDtcbiAgICAgIH1cblxuICAgICAgZm9yd2FyZEV4aGF1c3RlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKCFiYWNrd2FyZEV4aGF1c3RlZCkge1xuICAgICAgaWYgKCFmb3J3YXJkRXhoYXVzdGVkKSB7XG4gICAgICAgIHdhbnRGb3J3YXJkID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgLy8gQ2hlY2sgaWYgdHJ5aW5nIHRvIGZpdCBiZWZvcmUgdGV4dCBiZWdpbm5pbmcsIGFuZCBpZiBub3QsIGNoZWNrIGl0IGZpdHNcbiAgICAgIC8vIGJlZm9yZSBvZmZzZXQgbG9jYXRpb25cbiAgICAgIGlmIChtaW5MaW5lIDw9IHN0YXJ0IC0gbG9jYWxPZmZzZXQpIHtcbiAgICAgICAgcmV0dXJuIC1sb2NhbE9mZnNldCsrO1xuICAgICAgfVxuXG4gICAgICBiYWNrd2FyZEV4aGF1c3RlZCA9IHRydWU7XG4gICAgICByZXR1cm4gaXRlcmF0b3IoKTtcbiAgICB9XG5cbiAgICAvLyBXZSB0cmllZCB0byBmaXQgaHVuayBiZWZvcmUgdGV4dCBiZWdpbm5pbmcgYW5kIGJleW9uZCB0ZXh0IGxlbmd0aCwgdGhlblxuICAgIC8vIGh1bmsgY2FuJ3QgZml0IG9uIHRoZSB0ZXh0LiBSZXR1cm4gdW5kZWZpbmVkXG4gIH07XG59XG4iXX0=


/***/ }),

/***/ "./node_modules/diff/lib/util/params.js":
/*!**********************************************!*\
  !*** ./node_modules/diff/lib/util/params.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
/*istanbul ignore start*/


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.generateOptions = generateOptions;

/*istanbul ignore end*/
function generateOptions(options, defaults) {
  if (typeof options === 'function') {
    defaults.callback = options;
  } else if (options) {
    for (var name in options) {
      /* istanbul ignore else */
      if (options.hasOwnProperty(name)) {
        defaults[name] = options[name];
      }
    }
  }

  return defaults;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlsL3BhcmFtcy5qcyJdLCJuYW1lcyI6WyJnZW5lcmF0ZU9wdGlvbnMiLCJvcHRpb25zIiwiZGVmYXVsdHMiLCJjYWxsYmFjayIsIm5hbWUiLCJoYXNPd25Qcm9wZXJ0eSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7O0FBQU8sU0FBU0EsZUFBVCxDQUF5QkMsT0FBekIsRUFBa0NDLFFBQWxDLEVBQTRDO0FBQ2pELE1BQUksT0FBT0QsT0FBUCxLQUFtQixVQUF2QixFQUFtQztBQUNqQ0MsSUFBQUEsUUFBUSxDQUFDQyxRQUFULEdBQW9CRixPQUFwQjtBQUNELEdBRkQsTUFFTyxJQUFJQSxPQUFKLEVBQWE7QUFDbEIsU0FBSyxJQUFJRyxJQUFULElBQWlCSCxPQUFqQixFQUEwQjtBQUN4QjtBQUNBLFVBQUlBLE9BQU8sQ0FBQ0ksY0FBUixDQUF1QkQsSUFBdkIsQ0FBSixFQUFrQztBQUNoQ0YsUUFBQUEsUUFBUSxDQUFDRSxJQUFELENBQVIsR0FBaUJILE9BQU8sQ0FBQ0csSUFBRCxDQUF4QjtBQUNEO0FBQ0Y7QUFDRjs7QUFDRCxTQUFPRixRQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZnVuY3Rpb24gZ2VuZXJhdGVPcHRpb25zKG9wdGlvbnMsIGRlZmF1bHRzKSB7XG4gIGlmICh0eXBlb2Ygb3B0aW9ucyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGRlZmF1bHRzLmNhbGxiYWNrID0gb3B0aW9ucztcbiAgfSBlbHNlIGlmIChvcHRpb25zKSB7XG4gICAgZm9yIChsZXQgbmFtZSBpbiBvcHRpb25zKSB7XG4gICAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICAgICAgaWYgKG9wdGlvbnMuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgICAgZGVmYXVsdHNbbmFtZV0gPSBvcHRpb25zW25hbWVdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gZGVmYXVsdHM7XG59XG4iXX0=


/***/ }),

/***/ "./src/scripts/views/blank.ractive.html":
/*!**********************************************!*\
  !*** ./src/scripts/views/blank.ractive.html ***!
  \**********************************************/
/***/ ((module) => {

// Module
var code = "<span id=\"container{{id}}\" class=\"blank {{#blank.hasPendingFeedback}}has-pending-feedback{{/if}} {{#blank.hasHint}}has-tip{{/if}} {{#blank.isCorrect}}correct{{/if}} {{#blank.isError}}error{{/if}} {{#blank.isRetry}}retry{{/if}} {{#blank.isShowingSolution}}showing-solution{{/if}}\">\n  {{#unless isSelectCloze}}\n    <span class=\"h5p-input-wrapper\">\n      <input id=\"{{blank.id}}\" type=\"text\" value=\"{{blank.enteredText}}\" \n             size=\"{{blank.minTextLength}}\" on-escape=\"@this.fire('closeMessage', blank)\" \n             on-enter=\"@this.fire('checkBlank', blank, 'enter')\" \n             on-blur=\"@this.fire('checkBlank', blank, 'blur')\" \n             on-focus=\"@this.fire('focus', blank)\"\n             on-anykey=\"@this.fire('textTyped', blank)\"\n             {{#(blank.isCorrect || blank.isShowingSolution)}}disabled=\"disabled\"{{/if}}\n             class=\"h5p-text-input\"\n             autocomplete=\"off\"\n             autocapitalize=\"off\"/>\n      {{#blank.hasHint}}\n        <span class=\"h5p-tip-container\">\n          <button on-click=\"@this.fire('showHint', blank)\" {{#(blank.isCorrect || blank.isShowingSolution)}}disabled=\"disabled\" {{/if}}>\n            <span class=\"joubel-tip-container\" title=\"Tip\" aria-label=\"Tip\" aria-expanded=\"true\" role=\"button\" tabindex=\"0\"><span class=\"joubel-icon-tip-normal \"><span class=\"h5p-icon-shadow\"></span><span class=\"h5p-icon-speech-bubble\"></span><span class=\"h5p-icon-info\"></span></span></span>\n          </button>\n        </span>\n        {{/if}}\n    </span>    \n  {{/unless}}\n  {{#if isSelectCloze}}\n      <button class=\"h5p-notification\" on-click=\"@this.fire('displayFeedback', blank)\">\n        &#xf05a;\n      </button>\n      <span class=\"h5p-input-wrapper\">      \n      <select id=\"{{blank.id}}\" type=\"text\" value=\"{{blank.enteredText}}\"\n              on-enter=\"@this.fire('checkBlank', blank, 'enter')\" \n              on-change=\"@this.fire('checkBlank', blank, 'change')\"\n              on-focus=\"@this.fire('focus', blank)\"              \n              {{#(blank.isCorrect || blank.isShowingSolution)}}disabled=\"disabled\"{{/if}} \n              size=\"1\"\n              class=\"h5p-text-input\">\n        {{#each blank.choices}}\n          <option>{{this}}</option>\n        {{/each}}\n      </select>                     \n      {{#blank.hasHint}}\n        <span class=\"h5p-tip-container\">\n          <button on-click=\"@this.fire('showHint', blank)\" {{#(blank.isCorrect || blank.isShowingSolution)}}disabled=\"disabled\"{{/if}}>\n            <span class=\"joubel-tip-container\" title=\"Tip\" aria-label=\"Tip\" aria-expanded=\"true\" role=\"button\" tabindex=\"0\"><span class=\"joubel-icon-tip-normal \"><span class=\"h5p-icon-shadow\"></span><span class=\"h5p-icon-speech-bubble\"></span><span class=\"h5p-icon-info\"></span></span></span>\n          </button>\n        </span>\n      {{/if}}     \n    </span>\n  {{/if}}\n</span>";
// Exports
module.exports = code;

/***/ }),

/***/ "./src/scripts/views/highlight.ractive.html":
/*!**************************************************!*\
  !*** ./src/scripts/views/highlight.ractive.html ***!
  \**************************************************/
/***/ ((module) => {

// Module
var code = "<span {{#object.isHighlighted}}class=\"highlighted\"{{/if}} id=\"{{object.id}}\">{{{object.text}}}</span>";
// Exports
module.exports = code;

/***/ }),

/***/ "./src/styles/style.css":
/*!******************************!*\
  !*** ./src/styles/style.css ***!
  \******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => __WEBPACK_DEFAULT_EXPORT__
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/postcss-loader/dist/cjs.js!./style.css */ "./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/dist/cjs.js!./src/styles/style.css");

            

var options = {};

options.insert = "head";
options.singleton = false;

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_1__.default, options);



/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_postcss_loader_dist_cjs_js_style_css__WEBPACK_IMPORTED_MODULE_1__.default.locals || {});

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


var isOldIE = function isOldIE() {
  var memo;
  return function memorize() {
    if (typeof memo === 'undefined') {
      // Test for IE <= 9 as proposed by Browserhacks
      // @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
      // Tests for existence of standard globals is to allow style-loader
      // to operate correctly into non-standard environments
      // @see https://github.com/webpack-contrib/style-loader/issues/177
      memo = Boolean(window && document && document.all && !window.atob);
    }

    return memo;
  };
}();

var getTarget = function getTarget() {
  var memo = {};
  return function memorize(target) {
    if (typeof memo[target] === 'undefined') {
      var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

      if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
        try {
          // This will throw an exception if access to iframe is blocked
          // due to cross-origin restrictions
          styleTarget = styleTarget.contentDocument.head;
        } catch (e) {
          // istanbul ignore next
          styleTarget = null;
        }
      }

      memo[target] = styleTarget;
    }

    return memo[target];
  };
}();

var stylesInDom = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDom.length; i++) {
    if (stylesInDom[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var index = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3]
    };

    if (index !== -1) {
      stylesInDom[index].references++;
      stylesInDom[index].updater(obj);
    } else {
      stylesInDom.push({
        identifier: identifier,
        updater: addStyle(obj, options),
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function insertStyleElement(options) {
  var style = document.createElement('style');
  var attributes = options.attributes || {};

  if (typeof attributes.nonce === 'undefined') {
    var nonce =  true ? __webpack_require__.nc : 0;

    if (nonce) {
      attributes.nonce = nonce;
    }
  }

  Object.keys(attributes).forEach(function (key) {
    style.setAttribute(key, attributes[key]);
  });

  if (typeof options.insert === 'function') {
    options.insert(style);
  } else {
    var target = getTarget(options.insert || 'head');

    if (!target) {
      throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
    }

    target.appendChild(style);
  }

  return style;
}

function removeStyleElement(style) {
  // istanbul ignore if
  if (style.parentNode === null) {
    return false;
  }

  style.parentNode.removeChild(style);
}
/* istanbul ignore next  */


var replaceText = function replaceText() {
  var textStore = [];
  return function replace(index, replacement) {
    textStore[index] = replacement;
    return textStore.filter(Boolean).join('\n');
  };
}();

function applyToSingletonTag(style, index, remove, obj) {
  var css = remove ? '' : obj.media ? "@media ".concat(obj.media, " {").concat(obj.css, "}") : obj.css; // For old IE

  /* istanbul ignore if  */

  if (style.styleSheet) {
    style.styleSheet.cssText = replaceText(index, css);
  } else {
    var cssNode = document.createTextNode(css);
    var childNodes = style.childNodes;

    if (childNodes[index]) {
      style.removeChild(childNodes[index]);
    }

    if (childNodes.length) {
      style.insertBefore(cssNode, childNodes[index]);
    } else {
      style.appendChild(cssNode);
    }
  }
}

function applyToTag(style, options, obj) {
  var css = obj.css;
  var media = obj.media;
  var sourceMap = obj.sourceMap;

  if (media) {
    style.setAttribute('media', media);
  } else {
    style.removeAttribute('media');
  }

  if (sourceMap && typeof btoa !== 'undefined') {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    while (style.firstChild) {
      style.removeChild(style.firstChild);
    }

    style.appendChild(document.createTextNode(css));
  }
}

var singleton = null;
var singletonCounter = 0;

function addStyle(obj, options) {
  var style;
  var update;
  var remove;

  if (options.singleton) {
    var styleIndex = singletonCounter++;
    style = singleton || (singleton = insertStyleElement(options));
    update = applyToSingletonTag.bind(null, style, styleIndex, false);
    remove = applyToSingletonTag.bind(null, style, styleIndex, true);
  } else {
    style = insertStyleElement(options);
    update = applyToTag.bind(null, style, options);

    remove = function remove() {
      removeStyleElement(style);
    };
  }

  update(obj);
  return function updateStyle(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap) {
        return;
      }

      update(obj = newObj);
    } else {
      remove();
    }
  };
}

module.exports = function (list, options) {
  options = options || {}; // Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
  // tags it will allow on a page

  if (!options.singleton && typeof options.singleton !== 'boolean') {
    options.singleton = isOldIE();
  }

  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    if (Object.prototype.toString.call(newList) !== '[object Array]') {
      return;
    }

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDom[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDom[_index].references === 0) {
        stylesInDom[_index].updater();

        stylesInDom.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./src/entries/dist.ts":
/*!*****************************!*\
  !*** ./src/entries/dist.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
__webpack_require__(/*! ../styles/style.css */ "./src/styles/style.css");
var app_1 = __webpack_require__(/*! ../scripts/app */ "./src/scripts/app.ts");
// Load library
H5P = H5P || {};
H5P.AdvancedBlanks = app_1.default;


/***/ }),

/***/ "./src/lib/helpers.ts":
/*!****************************!*\
  !*** ./src/lib/helpers.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.shuffleArray = exports.getLongestString = void 0;
function getLongestString(strings) {
    return strings.reduce(function (prev, current) { return current.length > prev.length ? current : prev; }, "");
}
exports.getLongestString = getLongestString;
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
exports.shuffleArray = shuffleArray;


/***/ }),

/***/ "./src/lib/ractive-events-keys.ts":
/*!****************************************!*\
  !*** ./src/lib/ractive-events-keys.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.anykey = exports.uparrow = exports.downarrow = exports.rightarrow = exports.leftarrow = exports.space = exports.escape = exports.tab = exports.enter = void 0;
// TODO can we just declare the keydownHandler once? using `this`?
function makeKeyDefinition(code) {
    return function (node, fire) {
        function keydownHandler(event) {
            var which = event.which || event.keyCode;
            if (code && which === code) {
                event.preventDefault();
                fire({
                    node: node,
                    original: event
                });
            }
            else if (!code && [16, 17, 18, 35, 36, 13, 9, 27, 32, 37, 39, 40, 38].filter(function (c) { return c === which; }).length === 0) {
                fire({
                    node: node,
                    original: event
                });
            }
        }
        node.addEventListener('keydown', keydownHandler, false);
        return {
            teardown: function () {
                node.removeEventListener('keydown', keydownHandler, false);
            }
        };
    };
}
exports.enter = makeKeyDefinition(13);
exports.tab = makeKeyDefinition(9);
exports.escape = makeKeyDefinition(27);
exports.space = makeKeyDefinition(32);
exports.leftarrow = makeKeyDefinition(37);
exports.rightarrow = makeKeyDefinition(39);
exports.downarrow = makeKeyDefinition(40);
exports.uparrow = makeKeyDefinition(38);
exports.anykey = makeKeyDefinition();


/***/ }),

/***/ "./src/scripts/app.ts":
/*!****************************!*\
  !*** ./src/scripts/app.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var blank_loader_1 = __webpack_require__(/*! ./content-loaders/blank-loader */ "./src/scripts/content-loaders/blank-loader.ts");
var data_repository_1 = __webpack_require__(/*! ./services/data-repository */ "./src/scripts/services/data-repository.ts");
var cloze_controller_1 = __webpack_require__(/*! ./controllers/cloze-controller */ "./src/scripts/controllers/cloze-controller.ts");
var localization_1 = __webpack_require__(/*! ./services/localization */ "./src/scripts/services/localization.ts");
var settings_1 = __webpack_require__(/*! ./services/settings */ "./src/scripts/services/settings.ts");
var message_service_1 = __webpack_require__(/*! ./services/message-service */ "./src/scripts/services/message-service.ts");
var unwrapper_1 = __webpack_require__(/*! ./helpers/unwrapper */ "./src/scripts/helpers/unwrapper.ts");
var xapi_1 = __webpack_require__(/*! ./models/xapi */ "./src/scripts/models/xapi.ts");
var permutations_1 = __webpack_require__(/*! ./helpers/permutations */ "./src/scripts/helpers/permutations.ts");
var States;
(function (States) {
    States["ongoing"] = "ongoing";
    States["checking"] = "checking";
    States["showingSolutions"] = "showing-solution";
    States["finished"] = "finished";
    States["showingSolutionsEmbedded"] = "showing-solution-embedded";
})(States || (States = {}));
var AdvancedBlanks = /** @class */ (function (_super) {
    __extends(AdvancedBlanks, _super);
    /**
     * @constructor
     *
     * @param {object} config
     * @param {string} contentId
     * @param {object} contentData
     */
    function AdvancedBlanks(config, contentId, contentData) {
        if (contentData === void 0) { contentData = {}; }
        var _this = _super.call(this) || this;
        /**
         * Indicates if user has entered any answer so far.
         */
        _this.answered = false;
        /**
         * Called from outside when the score of the cloze has changed.
         */
        _this.onScoreChanged = function (score, maxScore) {
            if (_this.clozeController.isFullyFilledOut) {
                _this.transitionState();
                if (_this.state !== States.finished)
                    _this.state = States.checking;
                _this.showFeedback();
            }
            else {
                _this.setFeedback("", score, maxScore);
            }
            _this.transitionState();
            _this.toggleButtonVisibility(_this.state);
        };
        _this.onTyped = function () {
            if (_this.state === States.checking) {
                _this.state = States.ongoing;
                _this.toggleButtonVisibility(_this.state);
            }
            _this.triggerXAPI('interacted');
            _this.answered = true;
        };
        _this.onAutoChecked = function () {
            _this.triggerXAPI('interacted');
            _this.triggerXAPIAnswered();
        };
        /**
         * Called by H5P.Question.attach(). Creates all content elements and registers them
         * with H5P.Question.
         */
        _this.registerDomElements = function () {
            this.registerMedia();
            this.setIntroduction(this.repository.getTaskDescription());
            this.container = this.jQuery("<div/>", { "class": "h5p-advanced-blanks" });
            this.setContent(this.container);
            this.registerButtons();
            this.moveToState(States.ongoing);
        };
        _this.onCheckAnswer = function () {
            _this.clozeController.checkAll();
            _this.triggerXAPI('interacted');
            _this.triggerXAPIAnswered();
            _this.transitionState();
            if (_this.state !== States.finished)
                _this.state = States.checking;
            _this.showFeedback();
            _this.toggleButtonVisibility(_this.state);
        };
        _this.transitionState = function () {
            if (_this.clozeController.isSolved) {
                _this.moveToState(States.finished);
            }
        };
        _this.onShowSolution = function () {
            _this.moveToState(States.showingSolutions);
            _this.clozeController.showSolutions();
            _this.showFeedback();
        };
        _this.onRetry = function () {
            _this.removeFeedback();
            _this.clozeController.reset();
            _this.answered = false;
            _this.moveToState(States.ongoing);
        };
        _this.getCurrentState = function () {
            return _this.clozeController.serializeCloze();
        };
        /****************************************
         * Implementation of Question contract  *
         ****************************************/
        _this.getAnswerGiven = function () {
            return _this.answered || _this.clozeController.maxScore === 0;
        };
        _this.getScore = function () {
            _this.onCheckAnswer();
            return _this.clozeController.currentScore;
        };
        _this.getMaxScore = function () {
            return _this.clozeController.maxScore;
        };
        _this.showSolutions = function () {
            _this.onCheckAnswer();
            _this.onShowSolution();
            _this.moveToState(States.showingSolutionsEmbedded);
        };
        _this.resetTask = function () {
            _this.onRetry();
        };
        /***
         * XApi implementation
         */
        /**
         * Trigger xAPI answered event
         */
        _this.triggerXAPIAnswered = function () {
            _this.answered = true;
            var xAPIEvent = _this.createXAPIEventTemplate('answered');
            _this.addQuestionToXAPI(xAPIEvent);
            _this.addResponseToXAPI(xAPIEvent);
            _this.trigger(xAPIEvent);
        };
        /**
         * Get xAPI data.
         * Contract used by report rendering engine.
         *
         * @see contract at {@link https://h5p.org/documentation/developers/contracts#guides-header-6}
         */
        _this.getXAPIData = function () {
            var xAPIEvent = _this.createXAPIEventTemplate('answered');
            _this.addQuestionToXAPI(xAPIEvent);
            _this.addResponseToXAPI(xAPIEvent);
            return {
                statement: xAPIEvent.data.statement
            };
        };
        /**
         * Generate xAPI object definition used in xAPI statements.
         * @return {Object}
         */
        _this.getxAPIDefinition = function () {
            var definition = new xapi_1.XAPIActivityDefinition();
            definition.description = {
                'en-US': '<p>' + _this.repository.getTaskDescription() + '</p>' + _this.repository.getClozeText()
            };
            definition.type = 'http://adlnet.gov/expapi/activities/cmi.interaction';
            definition.interactionType = 'fill-in'; // We use the 'fill-in' type even in select mode, as the xAPI format for selections doesn't really cater for sequences.
            definition.correctResponsesPattern = [];
            var correctResponsesPatternPrefix = '{case_matters=' + _this.settings.caseSensitive + '}';
            // xAPI forces us to create solution patterns for all possible solution combinations
            var correctAnswerPermutations = permutations_1.createPermutations(_this.clozeController.getCorrectAnswerList());
            for (var _i = 0, correctAnswerPermutations_1 = correctAnswerPermutations; _i < correctAnswerPermutations_1.length; _i++) {
                var permutation = correctAnswerPermutations_1[_i];
                definition.correctResponsesPattern.push(correctResponsesPatternPrefix + permutation.join('[,]'));
            }
            return definition;
        };
        /**
         * Add the question itself to the definition part of an xAPIEvent
         */
        _this.addQuestionToXAPI = function (xAPIEvent) {
            var definition = xAPIEvent.getVerifiedStatementValue(['object', 'definition']);
            _this.jQuery.extend(definition, _this.getxAPIDefinition());
        };
        /**
         * Add the response part to an xAPI event
         *
         * @param {H5P.XAPIEvent} xAPIEvent
         *  The xAPI event we will add a response to
         */
        _this.addResponseToXAPI = function (xAPIEvent) {
            xAPIEvent.setScoredResult(_this.clozeController.currentScore, _this.clozeController.maxScore, _this);
            xAPIEvent.data.statement.result.response = _this.getxAPIResponse();
        };
        /**
         * Generate xAPI user response, used in xAPI statements.
         * @return {string} User answers separated by the "[,]" pattern
         */
        _this.getxAPIResponse = function () {
            var usersAnswers = _this.getCurrentState();
            return usersAnswers.join('[,]');
        };
        _this.jQuery = H5P.jQuery;
        _this.contentId = contentId;
        var unwrapper = new unwrapper_1.Unrwapper(_this.jQuery);
        _this.settings = new settings_1.H5PSettings(config);
        _this.localization = new localization_1.H5PLocalization(config);
        _this.repository = new data_repository_1.H5PDataRepository(config, _this.settings, _this.localization, _this.jQuery, unwrapper);
        _this.messageService = new message_service_1.MessageService(_this.jQuery);
        blank_loader_1.BlankLoader.initialize(_this.settings, _this.localization, _this.jQuery, _this.messageService);
        _this.clozeController = new cloze_controller_1.ClozeController(_this.repository, _this.settings, _this.localization, _this.messageService);
        _this.clozeController.onScoreChanged = _this.onScoreChanged;
        _this.clozeController.onSolved = _this.onSolved;
        _this.clozeController.onAutoChecked = _this.onAutoChecked;
        _this.clozeController.onTyped = _this.onTyped;
        if (contentData && contentData.previousState)
            _this.previousState = contentData.previousState;
        /**
        * Overrides the attach method of the superclass (H5P.Question) and calls it
        * at the same time. (equivalent to super.attach($container)).
        * This is necessary, as Ractive needs to be initialized with an existing DOM
        * element. DOM elements are created in H5P.Question.attach, so initializing
        * Ractive in registerDomElements doesn't work.
        */
        _this.attach = (function (original) {
            return function ($container) {
                original($container);
                _this.clozeController.initialize(_this.container.get(0), $container);
                if (_this.clozeController.deserializeCloze(_this.previousState)) {
                    _this.answered = _this.clozeController.isFilledOut;
                    if (_this.settings.autoCheck)
                        _this.onCheckAnswer();
                    _this.toggleButtonVisibility(_this.state);
                }
            };
        })(_this.attach);
        return _this;
    }
    AdvancedBlanks.prototype.onSolved = function () {
    };
    /**
     * @returns JQuery - The outer h5p container. The library can add dialogues to this
     * element.
     */
    AdvancedBlanks.prototype.getH5pContainer = function () {
        var $content = this.jQuery('[data-content-id="' + this.contentId + '"].h5p-content');
        var $containerParents = $content.parents('.h5p-container');
        // select find container to attach dialogs to
        var $container;
        if ($containerParents.length !== 0) {
            // use parent highest up if any
            $container = $containerParents.last();
        }
        else if ($content.length !== 0) {
            $container = $content;
        }
        else {
            $container = this.jQuery(document.body);
        }
        return $container;
    };
    AdvancedBlanks.prototype.registerMedia = function () {
        var media = this.repository.getMedia();
        if (!media || !media.library)
            return;
        var type = media.library.split(' ')[0];
        if (type === 'H5P.Image') {
            if (media.params.file) {
                this.setImage(media.params.file.path, {
                    disableImageZooming: this.settings.disableImageZooming,
                    alt: media.params.alt
                });
            }
        }
        else if (type === 'H5P.Video') {
            if (media.params.sources) {
                this.setVideo(media);
            }
        }
    };
    AdvancedBlanks.prototype.registerButtons = function () {
        var $container = this.getH5pContainer();
        if (!this.settings.autoCheck) {
            // Check answer button
            this.addButton('check-answer', this.localization.getTextFromLabel(localization_1.LocalizationLabels.checkAllButton), this.onCheckAnswer, true, {}, {
                confirmationDialog: {
                    enable: this.settings.confirmCheckDialog,
                    l10n: this.localization.getObjectForStructure(localization_1.LocalizationStructures.confirmCheck),
                    instance: this,
                    $parentElement: $container
                }
            });
        }
        // Show solution button
        this.addButton('show-solution', this.localization.getTextFromLabel(localization_1.LocalizationLabels.showSolutionButton), this.onShowSolution, this.settings.enableSolutionsButton);
        // Try again button
        if (this.settings.enableRetry === true) {
            this.addButton('try-again', this.localization.getTextFromLabel(localization_1.LocalizationLabels.retryButton), this.onRetry, true, {}, {
                confirmationDialog: {
                    enable: this.settings.confirmRetryDialog,
                    l10n: this.localization.getObjectForStructure(localization_1.LocalizationStructures.confirmRetry),
                    instance: this,
                    $parentElement: $container
                }
            });
        }
    };
    AdvancedBlanks.prototype.showFeedback = function () {
        var scoreText = H5P.Question.determineOverallFeedback(this.localization.getObjectForStructure(localization_1.LocalizationStructures.overallFeedback), this.clozeController.currentScore / this.clozeController.maxScore).replace('@score', this.clozeController.currentScore).replace('@total', this.clozeController.maxScore);
        this.setFeedback(scoreText, this.clozeController.currentScore, this.clozeController.maxScore, this.localization.getTextFromLabel(localization_1.LocalizationLabels.scoreBarLabel));
    };
    /**
     * Shows are hides buttons depending on the current state and settings made
     * by the content creator.
     * @param  {States} state
     */
    AdvancedBlanks.prototype.moveToState = function (state) {
        this.state = state;
        this.toggleButtonVisibility(state);
    };
    AdvancedBlanks.prototype.toggleButtonVisibility = function (state) {
        if (this.settings.enableSolutionsButton) {
            if (((state === States.checking)
                || (this.settings.autoCheck && state === States.ongoing))
                && (!this.settings.showSolutionsRequiresInput || this.clozeController.allBlanksEntered)) {
                this.showButton('show-solution');
            }
            else {
                this.hideButton('show-solution');
            }
        }
        if (this.settings.enableRetry && (state === States.checking || state === States.finished || state === States.showingSolutions)) {
            this.showButton('try-again');
        }
        else {
            this.hideButton('try-again');
        }
        if (state === States.ongoing && this.settings.enableCheckButton) {
            this.showButton('check-answer');
        }
        else {
            this.hideButton('check-answer');
        }
        if (state === States.showingSolutionsEmbedded) {
            this.hideButton('check-answer');
            this.hideButton('try-again');
            this.hideButton('show-solution');
        }
        this.trigger('resize');
    };
    return AdvancedBlanks;
}(H5P.Question));
exports.default = AdvancedBlanks;


/***/ }),

/***/ "./src/scripts/content-loaders/blank-loader.ts":
/*!*****************************************************!*\
  !*** ./src/scripts/content-loaders/blank-loader.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.BlankLoader = void 0;
var answer_1 = __webpack_require__(/*! ../models/answer */ "./src/scripts/models/answer.ts");
var blank_1 = __webpack_require__(/*! ../models/blank */ "./src/scripts/models/blank.ts");
var message_1 = __webpack_require__(/*! ../models/message */ "./src/scripts/models/message.ts");
var BlankLoader = /** @class */ (function () {
    function BlankLoader(settings, localization, jquery, messageService) {
        this.settings = settings;
        this.localization = localization;
        this.jquery = jquery;
        this.messageService = messageService;
    }
    BlankLoader.initialize = function (settings, localization, jquery, messageService) {
        this._instance = new BlankLoader(settings, localization, jquery, messageService);
        return this._instance;
    };
    Object.defineProperty(BlankLoader, "instance", {
        get: function () {
            if (this._instance)
                return this._instance;
            throw "BlankLoader must be initialized before use.";
        },
        enumerable: false,
        configurable: true
    });
    BlankLoader.prototype.decodeHtml = function (html) {
        var elem = document.createElement('textarea');
        elem.innerHTML = html;
        return elem.value;
    };
    BlankLoader.prototype.createBlank = function (id, correctText, hintText, incorrectAnswers) {
        var blank = new blank_1.Blank(this.settings, this.localization, this.jquery, this.messageService, id);
        if (correctText) {
            correctText = this.decodeHtml(correctText);
            blank.addCorrectAnswer(new answer_1.Answer(correctText, "", false, 0, this.settings));
        }
        blank.setHint(new message_1.Message(hintText ? hintText : "", false, 0));
        if (incorrectAnswers) {
            for (var _i = 0, incorrectAnswers_1 = incorrectAnswers; _i < incorrectAnswers_1.length; _i++) {
                var h5pIncorrectAnswer = incorrectAnswers_1[_i];
                blank.addIncorrectAnswer(this.decodeHtml(h5pIncorrectAnswer.incorrectAnswerText), h5pIncorrectAnswer.incorrectAnswerFeedback, h5pIncorrectAnswer.showHighlight, h5pIncorrectAnswer.highlight);
            }
        }
        return blank;
    };
    BlankLoader.prototype.replaceSnippets = function (blank, snippets) {
        var _this = this;
        blank.correctAnswers.concat(blank.incorrectAnswers)
            .forEach(function (answer) { return answer.message.text = _this.getStringWithSnippets(answer.message.text, snippets); });
        blank.hint.text = this.getStringWithSnippets(blank.hint.text, snippets);
    };
    BlankLoader.prototype.getStringWithSnippets = function (text, snippets) {
        if (!text || text === undefined)
            return "";
        if (!snippets)
            return text;
        for (var _i = 0, snippets_1 = snippets; _i < snippets_1.length; _i++) {
            var snippet = snippets_1[_i];
            if (snippet.name === undefined || snippet.name === "" || snippet.text === undefined || snippet.text === "")
                continue;
            text = text.replace("@" + snippet.name, snippet.text);
        }
        return text;
    };
    /**
     * Adds the highlight objects to the answers in the correct and incorrect answer list.
     * @param  {Highlight[]} highlightsBefore - All highlights coming before the blank.
     * @param  {Highlight[]} highlightsAfter - All highlights coming after the blank.
     */
    BlankLoader.prototype.linkHighlightIdToObject = function (blank, highlightsBefore, highlightsAfter) {
        for (var _i = 0, _a = blank.correctAnswers; _i < _a.length; _i++) {
            var answer = _a[_i];
            answer.linkHighlightIdToObject(highlightsBefore, highlightsAfter);
        }
        for (var _b = 0, _c = blank.incorrectAnswers; _b < _c.length; _b++) {
            var answer = _c[_b];
            answer.linkHighlightIdToObject(highlightsBefore, highlightsAfter);
        }
        blank.hint.linkHighlight(highlightsBefore, highlightsAfter);
    };
    return BlankLoader;
}());
exports.BlankLoader = BlankLoader;


/***/ }),

/***/ "./src/scripts/content-loaders/cloze-loader.ts":
/*!*****************************************************!*\
  !*** ./src/scripts/content-loaders/cloze-loader.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClozeLoader = void 0;
var blank_loader_1 = __webpack_require__(/*! ./blank-loader */ "./src/scripts/content-loaders/blank-loader.ts");
var cloze_element_1 = __webpack_require__(/*! ../models/cloze-element */ "./src/scripts/models/cloze-element.ts");
var highlight_1 = __webpack_require__(/*! ../models/highlight */ "./src/scripts/models/highlight.ts");
var cloze_1 = __webpack_require__(/*! ../models/cloze */ "./src/scripts/models/cloze.ts");
/**
 * Loads a cloze object.
 */
var ClozeLoader = /** @class */ (function () {
    function ClozeLoader() {
    }
    /**
     * @param  {string} html - The html string that contains the cloze with blanks marking and highlight markings.
     * @param  {Blank[]} blanks - All blanks as entered by the content author.
     * @returns Cloze
     */
    ClozeLoader.createCloze = function (html, blanks) {
        var orderedAllElementsList = new Array();
        var highlightInstances = new Array();
        var blanksInstances = new Array();
        html = ClozeLoader.normalizeBlankMarkings(html);
        var conversionResult = ClozeLoader.convertMarkupToSpans(html, blanks);
        html = conversionResult.html;
        orderedAllElementsList = conversionResult.orderedAllElementsList;
        highlightInstances = conversionResult.highlightInstances;
        blanksInstances = conversionResult.blanksInstances;
        ClozeLoader.linkHighlightsObjects(orderedAllElementsList, highlightInstances, blanksInstances);
        var cloze = new cloze_1.Cloze();
        cloze.html = html;
        cloze.blanks = blanksInstances;
        cloze.highlights = highlightInstances;
        return cloze;
    };
    /**
    * Converts !!signal!! highlight markup and ___  blank markup into <span>...</span>.
    * Returns the resulting html string and three lists of all active elements used in the cloze:
    *    orderedAllElements: highlights and blanks in the order of appearance in the html.
    *    highlightInstances: only highlights in the order of appearance
    *    blanksInstances: only blanks in the order of appearance
    * @param  {string} html
    * @param  {Blank[]} blanks
    * @returns Lists of active elements (see description).
    */
    ClozeLoader.convertMarkupToSpans = function (html, blanks) {
        var orderedAllElementsList = new Array();
        var highlightInstances = new Array();
        var blanksInstances = new Array();
        var exclamationMarkRegExp = /!!(.{1,40}?)!!/i;
        var highlightCounter = 0;
        var blankCounter = 0;
        // Searches the html string for highlights and blanks and inserts spans. 
        do {
            var nextHighlightMatch = html.match(exclamationMarkRegExp);
            var nextBlankIndex = html.indexOf(ClozeLoader.normalizedBlankMarker);
            if (nextHighlightMatch && ((nextHighlightMatch.index < nextBlankIndex) || (nextBlankIndex < 0))) {
                // next active element is a highlight
                var highlight = new highlight_1.Highlight(nextHighlightMatch[1], "highlight_" + highlightCounter);
                highlightInstances.push(highlight);
                orderedAllElementsList.push(highlight);
                html = html.replace(exclamationMarkRegExp, "<span id='container_highlight_" + highlightCounter + "'></span>");
                highlightCounter++;
            }
            else if (nextBlankIndex >= 0) {
                // next active element is a blank
                if (blankCounter >= blanks.length) {
                    // if the blank is not in the repository (The content author has marked too many blanks in the text, but not entered correct answers.)
                    html = html.replace(ClozeLoader.normalizedBlankMarker, "<span></span>");
                }
                else {
                    var blank = blanks[blankCounter];
                    blanksInstances.push(blank);
                    orderedAllElementsList.push(blank);
                    html = html.replace(ClozeLoader.normalizedBlankMarker, "<span id='container_" + blank.id + "'></span>");
                    blankCounter++;
                }
            }
        } while (nextHighlightMatch || (nextBlankIndex >= 0));
        return {
            html: html,
            orderedAllElementsList: orderedAllElementsList,
            highlightInstances: highlightInstances,
            blanksInstances: blanksInstances
        };
    };
    /**
     * Looks for all instances of marked blanks and replaces them with ___.
     * @param  {string} html
     * @returns string
     */
    ClozeLoader.normalizeBlankMarkings = function (html) {
        var underlineBlankRegEx = /_{3,}/g;
        html = html.replace(underlineBlankRegEx, ClozeLoader.normalizedBlankMarker);
        return html;
    };
    /**
    * Iterates through all blanks and calls their linkHighlightIdsToObjects(...).
    * @param orderedAllElementsList
    * @param highlightInstances
    * @param blanksInstances
    */
    ClozeLoader.linkHighlightsObjects = function (orderedAllElementsList, highlightInstances, blanksInstances) {
        for (var _i = 0, blanksInstances_1 = blanksInstances; _i < blanksInstances_1.length; _i++) {
            var blank = blanksInstances_1[_i];
            var nextBlankIndexInArray = orderedAllElementsList.indexOf(blank);
            var highlightsBeforeBlank = orderedAllElementsList
                .slice(0, nextBlankIndexInArray)
                .filter(function (e) { return e.type === cloze_element_1.ClozeElementType.Highlight; })
                .map(function (e) { return e; })
                .reverse();
            var highlightsAfterBlank = orderedAllElementsList
                .slice(nextBlankIndexInArray + 1)
                .filter(function (e) { return e.type === cloze_element_1.ClozeElementType.Highlight; })
                .map(function (e) { return e; });
            blank_loader_1.BlankLoader.instance.linkHighlightIdToObject(blank, highlightsBeforeBlank, highlightsAfterBlank);
        }
    };
    ClozeLoader.normalizedBlankMarker = '___';
    return ClozeLoader;
}());
exports.ClozeLoader = ClozeLoader;


/***/ }),

/***/ "./src/scripts/controllers/cloze-controller.ts":
/*!*****************************************************!*\
  !*** ./src/scripts/controllers/cloze-controller.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClozeController = void 0;
var blank_loader_1 = __webpack_require__(/*! ../content-loaders/blank-loader */ "./src/scripts/content-loaders/blank-loader.ts");
var cloze_loader_1 = __webpack_require__(/*! ../content-loaders/cloze-loader */ "./src/scripts/content-loaders/cloze-loader.ts");
var enums_1 = __webpack_require__(/*! ../models/enums */ "./src/scripts/models/enums.ts");
var RactiveEventsKeys = __webpack_require__(/*! ../../lib/ractive-events-keys */ "./src/lib/ractive-events-keys.ts");
var ClozeController = /** @class */ (function () {
    function ClozeController(repository, settings, localization, MessageService) {
        var _this = this;
        this.repository = repository;
        this.settings = settings;
        this.localization = localization;
        this.MessageService = MessageService;
        // Storage of the ractive objects that link models and views
        this.highlightRactives = {};
        this.blankRactives = {};
        this.checkAll = function () {
            _this.cloze.hideAllHighlights();
            for (var _i = 0, _a = _this.cloze.blanks; _i < _a.length; _i++) {
                var blank = _a[_i];
                if ((!blank.isCorrect) && blank.enteredText !== "")
                    blank.evaluateAttempt(true, true);
            }
            _this.refreshCloze();
            _this.checkAndNotifyCompleteness();
        };
        this.textTyped = function (blank) {
            blank.onTyped();
            if (_this.onTyped)
                _this.onTyped();
            _this.refreshCloze();
        };
        this.focus = function (blank) {
            blank.onFocussed();
            _this.refreshCloze();
        };
        this.displayFeedback = function (blank) {
            blank.onDisplayFeedback();
            _this.refreshCloze();
        };
        this.showHint = function (blank) {
            _this.cloze.hideAllHighlights();
            blank.showHint();
            _this.refreshCloze();
        };
        this.requestCloseTooltip = function (blank) {
            blank.removeTooltip();
            _this.refreshCloze();
            _this.jquery.find("#" + blank.id).focus();
        };
        this.checkBlank = function (blank, cause) {
            if ((cause === 'blur' || cause === 'change')) {
                blank.lostFocus();
            }
            if (cause === 'change' && _this.onTyped) {
                _this.onTyped();
            }
            if (_this.settings.autoCheck) {
                if (!blank.enteredText || blank.enteredText === "")
                    return;
                _this.cloze.hideAllHighlights();
                blank.evaluateAttempt(false);
                _this.checkAndNotifyCompleteness();
                _this.refreshCloze();
                _this.onAutoChecked();
            }
            if ((cause === 'enter')
                && ((_this.settings.autoCheck && blank.isCorrect && !_this.isSolved)
                    || !_this.settings.autoCheck)) {
                // move to next blank
                var index = _this.cloze.blanks.indexOf(blank);
                var nextId;
                while (index < _this.cloze.blanks.length - 1 && !nextId) {
                    index++;
                    if (!_this.cloze.blanks[index].isCorrect)
                        nextId = _this.cloze.blanks[index].id;
                }
                if (nextId)
                    _this.jquery.find("#" + nextId).focus();
            }
        };
        this.reset = function () {
            _this.cloze.reset();
            _this.refreshCloze();
        };
        this.showSolutions = function () {
            _this.cloze.showSolutions();
            _this.refreshCloze();
        };
        this.checkAndNotifyCompleteness = function () {
            if (_this.onScoreChanged)
                _this.onScoreChanged(_this.currentScore, _this.maxScore);
            if (_this.cloze.isSolved) {
                if (_this.onSolved)
                    _this.onSolved();
                return true;
            }
            return false;
        };
    }
    Object.defineProperty(ClozeController.prototype, "maxScore", {
        get: function () {
            return this.cloze.blanks.length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ClozeController.prototype, "currentScore", {
        get: function () {
            var score = this.cloze.blanks.filter(function (b) { return b.isCorrect; }).length;
            return Math.max(0, score);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ClozeController.prototype, "allBlanksEntered", {
        get: function () {
            if (this.cloze)
                return this.cloze.blanks.every(function (blank) { return blank.isError || blank.isCorrect || blank.isRetry; });
            return false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ClozeController.prototype, "isSolved", {
        get: function () {
            return this.cloze.isSolved;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ClozeController.prototype, "isFilledOut", {
        get: function () {
            if (!this.cloze || this.cloze.blanks.length === 0)
                return true;
            return this.cloze.blanks.some(function (b) { return b.enteredText !== ''; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ClozeController.prototype, "isFullyFilledOut", {
        get: function () {
            if (!this.cloze || this.cloze.blanks.length === 0)
                return true;
            return this.cloze.blanks.every(function (b) { return b.enteredText !== ''; });
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Sets up all blanks, the cloze itself and the ractive bindings.
     * @param  {HTMLElement} root
     */
    ClozeController.prototype.initialize = function (root, jquery) {
        this.jquery = jquery;
        this.isSelectCloze = this.settings.clozeType === enums_1.ClozeType.Select ? true : false;
        var blanks = this.repository.getBlanks();
        if (this.isSelectCloze && this.settings.selectAlternatives === enums_1.SelectAlternatives.All) {
            for (var _i = 0, blanks_1 = blanks; _i < blanks_1.length; _i++) {
                var blank = blanks_1[_i];
                var otherBlanks = blanks.filter(function (v) { return v !== blank; });
                blank.loadChoicesFromOtherBlanks(otherBlanks);
            }
        }
        var snippets = this.repository.getSnippets();
        blanks.forEach(function (blank) { return blank_loader_1.BlankLoader.instance.replaceSnippets(blank, snippets); });
        this.cloze = cloze_loader_1.ClozeLoader.createCloze(this.repository.getClozeText(), blanks);
        var containers = this.createAndAddContainers(root);
        containers.cloze.innerHTML = this.cloze.html;
        this.createRactiveBindings();
    };
    ClozeController.prototype.createAndAddContainers = function (addTo) {
        var clozeContainerElement = document.createElement('div');
        clozeContainerElement.id = 'h5p-cloze-container';
        if (this.settings.clozeType === enums_1.ClozeType.Select) {
            clozeContainerElement.className = 'h5p-advanced-blanks-select-mode';
        }
        else {
            clozeContainerElement.className = 'h5p-advanced-blanks-type-mode';
        }
        addTo.appendChild(clozeContainerElement);
        return {
            cloze: clozeContainerElement
        };
    };
    ClozeController.prototype.createHighlightBinding = function (highlight) {
        this.highlightRactives[highlight.id] = new Ractive({
            el: '#container_' + highlight.id,
            template: __webpack_require__(/*! ../views/highlight.ractive.html */ "./src/scripts/views/highlight.ractive.html"),
            data: {
                object: highlight
            }
        });
    };
    ClozeController.prototype.createBlankBinding = function (blank) {
        var ractive = new Ractive({
            el: '#container_' + blank.id,
            template: __webpack_require__(/*! ../views/blank.ractive.html */ "./src/scripts/views/blank.ractive.html"),
            data: {
                isSelectCloze: this.isSelectCloze,
                blank: blank
            },
            events: {
                enter: RactiveEventsKeys.enter,
                escape: RactiveEventsKeys.escape,
                anykey: RactiveEventsKeys.anykey
            }
        });
        ractive.on("checkBlank", this.checkBlank);
        ractive.on("showHint", this.showHint);
        ractive.on("textTyped", this.textTyped);
        ractive.on("closeMessage", this.requestCloseTooltip);
        ractive.on("focus", this.focus);
        ractive.on("displayFeedback", this.displayFeedback);
        this.blankRactives[blank.id] = ractive;
    };
    ClozeController.prototype.createRactiveBindings = function () {
        for (var _i = 0, _a = this.cloze.highlights; _i < _a.length; _i++) {
            var highlight = _a[_i];
            this.createHighlightBinding(highlight);
        }
        for (var _b = 0, _c = this.cloze.blanks; _b < _c.length; _b++) {
            var blank = _c[_b];
            this.createBlankBinding(blank);
        }
    };
    /**
     * Updates all views of highlights and blanks. Can be called when a model
     * was changed
     */
    ClozeController.prototype.refreshCloze = function () {
        for (var _i = 0, _a = this.cloze.highlights; _i < _a.length; _i++) {
            var highlight = _a[_i];
            var highlightRactive = this.highlightRactives[highlight.id];
            highlightRactive.set("object", highlight);
        }
        for (var _b = 0, _c = this.cloze.blanks; _b < _c.length; _b++) {
            var blank = _c[_b];
            var blankRactive = this.blankRactives[blank.id];
            blankRactive.set("blank", blank);
        }
    };
    ClozeController.prototype.serializeCloze = function () {
        return this.cloze.serialize();
    };
    ClozeController.prototype.deserializeCloze = function (data) {
        if (!this.cloze || !data)
            return false;
        this.cloze.deserialize(data);
        this.refreshCloze();
        return true;
    };
    ClozeController.prototype.getCorrectAnswerList = function () {
        if (!this.cloze || this.cloze.blanks.length === 0)
            return [[]];
        var result = [];
        for (var _i = 0, _a = this.cloze.blanks; _i < _a.length; _i++) {
            var blank = _a[_i];
            result.push(blank.getCorrectAnswers());
        }
        return result;
    };
    return ClozeController;
}());
exports.ClozeController = ClozeController;


/***/ }),

/***/ "./src/scripts/helpers/permutations.ts":
/*!*********************************************!*\
  !*** ./src/scripts/helpers/permutations.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.createPermutations = void 0;
/**
 * Creates a list of all possible permutations of a list of lists.
 * @param list The list to permute over.
 */
function createPermutations(list) {
    var output = [[]];
    for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
        var currentSublist = list_1[_i];
        var newOutput = [];
        for (var _a = 0, currentSublist_1 = currentSublist; _a < currentSublist_1.length; _a++) {
            var sublistObject = currentSublist_1[_a];
            for (var _b = 0, output_1 = output; _b < output_1.length; _b++) {
                var o = output_1[_b];
                var newList = o.slice();
                newList.push(sublistObject);
                newOutput.push(newList);
            }
        }
        output = newOutput;
    }
    return output;
}
exports.createPermutations = createPermutations;


/***/ }),

/***/ "./src/scripts/helpers/unwrapper.ts":
/*!******************************************!*\
  !*** ./src/scripts/helpers/unwrapper.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Unrwapper = void 0;
/**
 * This class cleans html strings.
 */
var Unrwapper = /** @class */ (function () {
    function Unrwapper(jquery) {
        this.jquery = jquery;
    }
    /**
     * Cleans html strings by removing the outmost html tag of the string if there is only one tag.
     * Examples:  "<p>my text</p>"" becomes "my text"
     *            "<p>text 1</p><p>text 2</p2>" stays
     * @param html The html string
     * @returns the cleaned html string
     */
    Unrwapper.prototype.unwrap = function (html) {
        var parsed = this.jquery(html);
        if (parsed.length !== 1) {
            return html;
        }
        var unwrapped = parsed.unwrap().html();
        return unwrapped;
    };
    return Unrwapper;
}());
exports.Unrwapper = Unrwapper;


/***/ }),

/***/ "./src/scripts/models/answer.ts":
/*!**************************************!*\
  !*** ./src/scripts/models/answer.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Answer = exports.Evaluation = exports.Correctness = void 0;
var message_1 = __webpack_require__(/*! ./message */ "./src/scripts/models/message.ts");
var jsdiff = __webpack_require__(/*! diff */ "./node_modules/diff/lib/index.js");
var Correctness;
(function (Correctness) {
    Correctness[Correctness["ExactMatch"] = 0] = "ExactMatch";
    Correctness[Correctness["CloseMatch"] = 1] = "CloseMatch";
    Correctness[Correctness["NoMatch"] = 2] = "NoMatch";
})(Correctness = exports.Correctness || (exports.Correctness = {}));
var Evaluation = /** @class */ (function () {
    function Evaluation(usedAnswer) {
        this.usedAnswer = usedAnswer;
        this.correctness = Correctness.NoMatch;
        this.characterDifferenceCount = 0;
        this.usedAlternative = "";
    }
    return Evaluation;
}());
exports.Evaluation = Evaluation;
/**
 * Represents a possible answer the content author enters for a blank, e.g. the correct or an incorrect answer.
 */
var Answer = /** @class */ (function () {
    /**
     * @param  {string} answerText - The expected answer. Alternatives are separated by | or ; . (e.g. "Alternative 1|Alternative 2|Alternative 3|..."  -or- "Alternative 1;Alternative 2;Alternative 3")
     * @param  {string} reaction - The tooltip that should be displayed. Format: Tooltip Text;!!-1!! !!+1!!
     */
    function Answer(answerText, reaction, showHighlight, highlight, settings) {
        this.settings = settings;
        this.alternatives = answerText.split(/\//).map(function (s) { return s.trim(); });
        this.message = new message_1.Message(reaction, showHighlight, highlight);
        if (answerText.trim() === "") {
            this.appliesAlways = true;
        }
        else {
            this.appliesAlways = false;
        }
    }
    /**
     * Looks through the object's message ids and stores the references to the highlight object for these ids.
     * @param  {Highlight[]} highlightsBefore
     * @param  {Highlight[]} highlightsAfter
     */
    Answer.prototype.linkHighlightIdToObject = function (highlightsBefore, highlightsAfter) {
        this.message.linkHighlight(highlightsBefore, highlightsAfter);
    };
    /**
     * Turns on the highlights set by the content author for this answer.
     */
    Answer.prototype.activateHighlight = function () {
        if (this.message.highlightedElement)
            this.message.highlightedElement.isHighlighted = true;
    };
    Answer.prototype.cleanString = function (text) {
        text = text.trim();
        return text.replace(/\s{2,}/g, " ");
    };
    /**
     * Looks through the diff and checks how many character change operations are needed to turn one string into the other. Should return the same results as the Levensthein distance.
     * @param  {[{added?:boolean, boolean: removed?, string: value}]} diff - as returned by jsdiff
     * @returns number - the count of changes (replace, add, delete) needed to change the text from one string to the other
     */
    Answer.prototype.getChangesCountFromDiff = function (diff) {
        var totalChangesCount = 0;
        var lastType = "";
        var lastCount = 0;
        for (var _i = 0, diff_1 = diff; _i < diff_1.length; _i++) {
            var element = diff_1[_i];
            if (element.removed) {
                totalChangesCount += element.value.length;
                lastType = "removed";
            }
            else if (element.added) {
                if (lastType === "removed") {
                    if (lastCount < element.value.length) {
                        totalChangesCount += element.value.length - lastCount;
                    }
                }
                else {
                    totalChangesCount += element.value.length;
                }
                lastType = "added";
            }
            else {
                lastType = "same";
            }
            lastCount = element.value.length;
        }
        return totalChangesCount;
    };
    /**
     * Returns how many characters can be wrong to still be counted as a spelling mistake.
     * If spelling mistakes are turned off through the settings, it will return 0.
     * @param  {string} text
     * @returns number
     */
    Answer.prototype.getAcceptableSpellingMistakes = function (text) {
        var acceptableTypoCount;
        if (this.settings.warnSpellingErrors || this.settings.acceptSpellingErrors) // TODO: consider removal
            acceptableTypoCount = Math.floor(text.length / 10) + 1;
        else
            acceptableTypoCount = 0;
        return acceptableTypoCount;
    };
    /**
     * Checks if the text entered by the user in an ettempt is matched by the answer,
     * @param  {string} attempt The text entered by the user.
     * @returns Evaluation indicates if the entered text is matched by the answer.
     */
    Answer.prototype.evaluateAttempt = function (attempt) {
        var cleanedAttempt = this.cleanString(attempt);
        var evaluation = new Evaluation(this);
        for (var _i = 0, _a = this.alternatives; _i < _a.length; _i++) {
            var alternative = _a[_i];
            var cleanedAlternative = this.cleanString(alternative);
            var diff = jsdiff.diffChars(cleanedAlternative, cleanedAttempt, { ignoreCase: !this.settings.caseSensitive });
            var changeCount = this.getChangesCountFromDiff(diff);
            if (changeCount === 0) {
                evaluation.usedAlternative = cleanedAlternative;
                evaluation.correctness = Correctness.ExactMatch;
                return evaluation;
            }
            if (changeCount <= this.getAcceptableSpellingMistakes(alternative)
                && (evaluation.characterDifferenceCount === 0 || changeCount < evaluation.characterDifferenceCount)) {
                evaluation.usedAlternative = cleanedAlternative;
                evaluation.correctness = Correctness.CloseMatch;
                evaluation.characterDifferenceCount = changeCount;
            }
        }
        return evaluation;
    };
    return Answer;
}());
exports.Answer = Answer;


/***/ }),

/***/ "./src/scripts/models/blank.ts":
/*!*************************************!*\
  !*** ./src/scripts/models/blank.ts ***!
  \*************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Blank = void 0;
var cloze_element_1 = __webpack_require__(/*! ./cloze-element */ "./src/scripts/models/cloze-element.ts");
var answer_1 = __webpack_require__(/*! ./answer */ "./src/scripts/models/answer.ts");
var enums_1 = __webpack_require__(/*! ./enums */ "./src/scripts/models/enums.ts");
var localization_1 = __webpack_require__(/*! ../services/localization */ "./src/scripts/services/localization.ts");
var helpers_1 = __webpack_require__(/*! ../../lib/helpers */ "./src/lib/helpers.ts");
var jsdiff = __webpack_require__(/*! diff */ "./node_modules/diff/lib/index.js");
var Blank = /** @class */ (function (_super) {
    __extends(Blank, _super);
    /**
     * Add incorrect answers after initializing the object. Call finishInitialization()
     * when done.
     * @param  {ISettings} settings
     * @param  {string} id
     * @param  {string} correctText?
     * @param  {string} hintText?
     */
    function Blank(settings, localization, jquery, messageService, id) {
        var _this = _super.call(this) || this;
        _this.settings = settings;
        _this.localization = localization;
        _this.jquery = jquery;
        _this.messageService = messageService;
        _this.enteredText = "";
        _this.correctAnswers = new Array();
        _this.incorrectAnswers = new Array();
        _this.choices = new Array();
        _this.type = cloze_element_1.ClozeElementType.Blank;
        _this.id = id;
        return _this;
    }
    /**
    * Call this method when all incorrect answers have been added.
    */
    Blank.prototype.finishInitialization = function () {
        if (this.settings.clozeType === enums_1.ClozeType.Select && this.settings.selectAlternatives === enums_1.SelectAlternatives.Alternatives) {
            this.loadChoicesFromOwnAlternatives();
        }
        this.calculateMinTextLength();
    };
    Blank.prototype.addCorrectAnswer = function (answer) {
        this.correctAnswers.push(answer);
    };
    Blank.prototype.getCorrectAnswers = function () {
        var result = [];
        for (var _i = 0, _a = this.correctAnswers; _i < _a.length; _i++) {
            var answer = _a[_i];
            result = result.concat(answer.alternatives);
        }
        return result;
    };
    Blank.prototype.setHint = function (message) {
        this.hint = message;
        this.hasHint = this.hint.text !== "";
    };
    /**
     * Adds the incorrect answer to the list.
     * @param text - What the user must enter.
     * @param reaction  - What the user gets displayed when he enteres the text.
     */
    Blank.prototype.addIncorrectAnswer = function (text, reaction, showHighlight, highlight) {
        this.incorrectAnswers.push(new answer_1.Answer(text, reaction, showHighlight, highlight, this.settings));
    };
    /**
     * Returns how many characters the input box must have be to allow for all correct answers.
     */
    // TODO: refactor
    Blank.prototype.calculateMinTextLength = function () {
        var answers = new Array();
        for (var _i = 0, _a = this.correctAnswers; _i < _a.length; _i++) {
            var correctAnswer = _a[_i];
            answers.push(helpers_1.getLongestString(correctAnswer.alternatives));
        }
        if (this.settings.clozeType === enums_1.ClozeType.Select) {
            for (var _b = 0, _c = this.incorrectAnswers; _b < _c.length; _b++) {
                var incorrectAnswer = _c[_b];
                answers.push(helpers_1.getLongestString(incorrectAnswer.alternatives));
            }
        }
        var longestAnswer = helpers_1.getLongestString(answers);
        var l = longestAnswer.length;
        this.minTextLength = Math.max(10, l - (l % 10) + 10);
    };
    /**
     * Creates a list of choices from all alternatives provided by
     * the correct and incorrect answers.
     */
    Blank.prototype.loadChoicesFromOwnAlternatives = function () {
        this.choices = new Array();
        for (var _i = 0, _a = this.correctAnswers; _i < _a.length; _i++) {
            var answer = _a[_i];
            for (var _b = 0, _c = answer.alternatives; _b < _c.length; _b++) {
                var alternative = _c[_b];
                this.choices.push(alternative);
            }
        }
        for (var _d = 0, _e = this.incorrectAnswers; _d < _e.length; _d++) {
            var answer = _e[_d];
            for (var _f = 0, _g = answer.alternatives; _f < _g.length; _f++) {
                var alternative = _g[_f];
                this.choices.push(alternative);
            }
        }
        this.choices = helpers_1.shuffleArray(this.choices);
        this.choices.unshift("");
        return this.choices;
    };
    /**
     * Creates a list of choices from all correct answers of the cloze.
     * @param otherBlanks All OTHER blanks in the cloze. (excludes the current one!)
     */
    Blank.prototype.loadChoicesFromOtherBlanks = function (otherBlanks) {
        var ownChoices = new Array();
        for (var _i = 0, _a = this.correctAnswers; _i < _a.length; _i++) {
            var answer = _a[_i];
            for (var _b = 0, _c = answer.alternatives; _b < _c.length; _b++) {
                var alternative = _c[_b];
                ownChoices.push(alternative);
            }
        }
        var otherChoices = new Array();
        for (var _d = 0, otherBlanks_1 = otherBlanks; _d < otherBlanks_1.length; _d++) {
            var otherBlank = otherBlanks_1[_d];
            for (var _e = 0, _f = otherBlank.correctAnswers; _e < _f.length; _e++) {
                var answer = _f[_e];
                for (var _g = 0, _h = answer.alternatives; _g < _h.length; _g++) {
                    var alternative = _h[_g];
                    otherChoices.push(alternative);
                }
            }
        }
        otherChoices = helpers_1.shuffleArray(otherChoices);
        var maxChoices = this.settings.selectAlternativeRestriction;
        if (maxChoices === undefined || maxChoices === 0)
            maxChoices = ownChoices.length + otherChoices.length;
        var leftOverChoices = maxChoices - ownChoices.length;
        for (var x = 0; x < leftOverChoices && x < otherChoices.length; x++) {
            if (ownChoices.indexOf(otherChoices[x]) >= 0) {
                leftOverChoices++;
            }
            else {
                ownChoices.push(otherChoices[x]);
            }
        }
        this.choices = helpers_1.shuffleArray(ownChoices);
        this.choices.unshift("");
        return this.choices;
    };
    /**
    * Clears the blank from all entered text and hides popups.
    */
    Blank.prototype.reset = function () {
        this.enteredText = "";
        this.lastCheckedText = "";
        this.removeTooltip();
        this.setAnswerState(enums_1.MessageType.None);
        this.hasPendingFeedback = false;
    };
    /**
     * Sets the blank to a state in which the correct solution if shown if the user
     * hasn't entered a correct one so far.
     */
    Blank.prototype.showSolution = function () {
        this.evaluateAttempt(true);
        this.removeTooltip();
        if (this.isCorrect)
            return;
        this.enteredText = this.correctAnswers[0].alternatives[0];
        this.setAnswerState(enums_1.MessageType.ShowSolution);
    };
    Blank.prototype.onFocussed = function () {
        if (this.hasPendingFeedback) {
            this.evaluateAttempt(false);
        }
        if (this.settings.clozeType === enums_1.ClozeType.Select) {
            this.setAnswerState(enums_1.MessageType.None);
            this.lastCheckedText = "";
        }
    };
    Blank.prototype.onDisplayFeedback = function () {
        if (this.hasPendingFeedback) {
            this.evaluateAttempt(false);
        }
    };
    Blank.prototype.displayTooltip = function (message, type, surpressTooltip, id) {
        if (!surpressTooltip)
            this.messageService.show(id ? id : this.id, message, this, type);
        else {
            this.hasPendingFeedback = true;
        }
    };
    Blank.prototype.removeTooltip = function () {
        this.messageService.hide();
    };
    Blank.prototype.setTooltipErrorText = function (message, surpressTooltip) {
        if (message.highlightedElement) {
            this.displayTooltip(message.text, enums_1.MessageType.Error, surpressTooltip, message.highlightedElement.id);
        }
        else {
            this.displayTooltip(message.text, enums_1.MessageType.Error, surpressTooltip);
        }
    };
    Blank.prototype.getSpellingMistakeMessage = function (expectedText, enteredText) {
        var message = this.localization.getTextFromLabel(localization_1.LocalizationLabels.typoMessage);
        var diff = jsdiff.diffChars(expectedText, enteredText, { ignoreCase: !this.settings.caseSensitive });
        var mistakeSpan = this.jquery("<span/>", { "class": "spelling-mistake" });
        for (var index = 0; index < diff.length; index++) {
            var part = diff[index];
            var spanClass = '';
            if (part.removed) {
                if (index === diff.length - 1 || !diff[index + 1].added) {
                    part.value = part.value.replace(/./g, "_");
                    spanClass = 'missing-character';
                }
                else {
                    continue;
                }
            }
            if (part.added) {
                spanClass = 'mistaken-character';
            }
            var span = this.jquery("<span/>", { "class": spanClass, "html": part.value.replace(" ", "&nbsp;") });
            mistakeSpan.append(span);
        }
        message = message.replace("@mistake", this.jquery("<span/>").append(mistakeSpan).html());
        return message;
    };
    /**
     * Checks if the entered text is the correct answer or one of the
     * incorrect ones and gives the user feedback accordingly.
     */
    Blank.prototype.evaluateAttempt = function (surpressTooltips, forceCheck) {
        var _this = this;
        if (!this.hasPendingFeedback && this.lastCheckedText === this.enteredText && !forceCheck)
            return;
        this.lastCheckedText = this.enteredText.toString();
        this.hasPendingFeedback = false;
        this.removeTooltip();
        var exactCorrectMatches = this.correctAnswers.map(function (answer) { return answer.evaluateAttempt(_this.enteredText); }).filter(function (evaluation) { return evaluation.correctness === answer_1.Correctness.ExactMatch; }).sort(function (evaluation) { return evaluation.characterDifferenceCount; });
        var closeCorrectMatches = this.correctAnswers.map(function (answer) { return answer.evaluateAttempt(_this.enteredText); }).filter(function (evaluation) { return evaluation.correctness === answer_1.Correctness.CloseMatch; }).sort(function (evaluation) { return evaluation.characterDifferenceCount; });
        var exactIncorrectMatches = this.incorrectAnswers.map(function (answer) { return answer.evaluateAttempt(_this.enteredText); }).filter(function (evaluation) { return evaluation.correctness === answer_1.Correctness.ExactMatch; }).sort(function (evaluation) { return evaluation.characterDifferenceCount; });
        var closeIncorrectMatches = this.incorrectAnswers.map(function (answer) { return answer.evaluateAttempt(_this.enteredText); }).filter(function (evaluation) { return evaluation.correctness === answer_1.Correctness.CloseMatch; }).sort(function (evaluation) { return evaluation.characterDifferenceCount; });
        if (exactCorrectMatches.length > 0) {
            this.setAnswerState(enums_1.MessageType.Correct);
            if (!this.settings.caseSensitive) {
                this.enteredText = exactCorrectMatches[0].usedAlternative;
            }
            return;
        }
        if (exactIncorrectMatches.length > 0) {
            this.setAnswerState(enums_1.MessageType.Error);
            this.showErrorTooltip(exactIncorrectMatches[0].usedAnswer, surpressTooltips);
            return;
        }
        if (closeCorrectMatches.length > 0) {
            if (this.settings.warnSpellingErrors) {
                this.displayTooltip(this.getSpellingMistakeMessage(closeCorrectMatches[0].usedAlternative, this.enteredText), enums_1.MessageType.Retry, surpressTooltips);
                this.setAnswerState(enums_1.MessageType.Retry);
                return;
            }
            if (this.settings.acceptSpellingErrors) {
                this.setAnswerState(enums_1.MessageType.Correct);
                this.enteredText = closeCorrectMatches[0].usedAlternative;
                return;
            }
        }
        if (closeIncorrectMatches.length > 0) {
            this.setAnswerState(enums_1.MessageType.Error);
            this.showErrorTooltip(closeIncorrectMatches[0].usedAnswer, surpressTooltips);
            return;
        }
        var alwaysApplyingAnswers = this.incorrectAnswers.filter(function (a) { return a.appliesAlways; });
        if (alwaysApplyingAnswers && alwaysApplyingAnswers.length > 0) {
            this.showErrorTooltip(alwaysApplyingAnswers[0], surpressTooltips);
        }
        this.setAnswerState(enums_1.MessageType.Error);
    };
    Blank.prototype.onTyped = function () {
        this.setAnswerState(enums_1.MessageType.None);
        this.lastCheckedText = "";
        this.removeTooltip();
    };
    Blank.prototype.lostFocus = function () {
        if (this.messageService.isActive(this)) {
            this.messageService.hide();
        }
    };
    /**
     * Sets the boolean properties isCorrect, is Error and isRetry according to thepassed  messageType.
     * @param messageType
     */
    Blank.prototype.setAnswerState = function (messageType) {
        this.isCorrect = false;
        this.isError = false;
        this.isRetry = false;
        this.isShowingSolution = false;
        switch (messageType) {
            case enums_1.MessageType.Correct:
                this.isCorrect = true;
                break;
            case enums_1.MessageType.Error:
                this.isError = true;
                break;
            case enums_1.MessageType.Retry:
                this.isRetry = true;
                break;
            case enums_1.MessageType.ShowSolution:
                this.isShowingSolution = true;
                break;
        }
    };
    Blank.prototype.showErrorTooltip = function (answer, surpressTooltip) {
        if (answer.message && answer.message.text) {
            this.setTooltipErrorText(answer.message, surpressTooltip);
        }
        if (!surpressTooltip) {
            answer.activateHighlight();
        }
    };
    /**
     * Displays the hint in the tooltip.
     */
    Blank.prototype.showHint = function () {
        if (this.isShowingSolution || this.isCorrect)
            return;
        this.removeTooltip();
        if (this.hint && this.hint.text !== "") {
            this.displayTooltip(this.hint.text, enums_1.MessageType.Retry, false);
            if (this.hint.highlightedElement) {
                this.hint.highlightedElement.isHighlighted = true;
            }
        }
    };
    Blank.prototype.serialize = function () {
        return this.enteredText;
    };
    Blank.prototype.deserialize = function (data) {
        this.enteredText = data;
    };
    return Blank;
}(cloze_element_1.ClozeElement));
exports.Blank = Blank;


/***/ }),

/***/ "./src/scripts/models/cloze-element.ts":
/*!*********************************************!*\
  !*** ./src/scripts/models/cloze-element.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ClozeElement = exports.ClozeElementType = void 0;
var ClozeElementType;
(function (ClozeElementType) {
    ClozeElementType[ClozeElementType["Blank"] = 0] = "Blank";
    ClozeElementType[ClozeElementType["Highlight"] = 1] = "Highlight";
})(ClozeElementType = exports.ClozeElementType || (exports.ClozeElementType = {}));
var ClozeElement = /** @class */ (function () {
    function ClozeElement() {
    }
    return ClozeElement;
}());
exports.ClozeElement = ClozeElement;


/***/ }),

/***/ "./src/scripts/models/cloze.ts":
/*!*************************************!*\
  !*** ./src/scripts/models/cloze.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Cloze = void 0;
/**
 * Represents the cloze. Instantiate with static createCloze().
 */
var Cloze = /** @class */ (function () {
    function Cloze() {
    }
    Object.defineProperty(Cloze.prototype, "isSolved", {
        /**
         * Returns true if all blanks were entered correctly.
         * @returns boolean
         */
        get: function () {
            return this.blanks.every(function (b) { return b.isCorrect === true; });
        },
        enumerable: false,
        configurable: true
    });
    Cloze.prototype.hideAllHighlights = function () {
        for (var _i = 0, _a = this.highlights; _i < _a.length; _i++) {
            var highlight = _a[_i];
            highlight.isHighlighted = false;
        }
    };
    Cloze.prototype.reset = function () {
        this.hideAllHighlights();
        for (var _i = 0, _a = this.blanks; _i < _a.length; _i++) {
            var blank = _a[_i];
            blank.reset();
        }
    };
    Cloze.prototype.showSolutions = function () {
        for (var _i = 0, _a = this.blanks; _i < _a.length; _i++) {
            var blank = _a[_i];
            blank.showSolution();
        }
        this.hideAllHighlights();
    };
    Cloze.prototype.serialize = function () {
        var cloze = [];
        for (var _i = 0, _a = this.blanks; _i < _a.length; _i++) {
            var blank = _a[_i];
            cloze.push(blank.serialize());
        }
        return cloze;
    };
    Cloze.prototype.deserialize = function (data) {
        for (var index = 0; index < data.length; index++) {
            if (index >= this.blanks.length)
                return;
            var blank = this.blanks[index];
            blank.deserialize(data[index]);
        }
    };
    return Cloze;
}());
exports.Cloze = Cloze;


/***/ }),

/***/ "./src/scripts/models/enums.ts":
/*!*************************************!*\
  !*** ./src/scripts/models/enums.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SelectAlternatives = exports.ClozeType = exports.MessageType = void 0;
var MessageType;
(function (MessageType) {
    MessageType[MessageType["Error"] = 0] = "Error";
    MessageType[MessageType["Correct"] = 1] = "Correct";
    MessageType[MessageType["Retry"] = 2] = "Retry";
    MessageType[MessageType["ShowSolution"] = 3] = "ShowSolution";
    MessageType[MessageType["None"] = 4] = "None";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
var ClozeType;
(function (ClozeType) {
    ClozeType[ClozeType["Type"] = 0] = "Type";
    ClozeType[ClozeType["Select"] = 1] = "Select";
})(ClozeType = exports.ClozeType || (exports.ClozeType = {}));
var SelectAlternatives;
(function (SelectAlternatives) {
    SelectAlternatives[SelectAlternatives["Alternatives"] = 0] = "Alternatives";
    SelectAlternatives[SelectAlternatives["All"] = 1] = "All";
})(SelectAlternatives = exports.SelectAlternatives || (exports.SelectAlternatives = {}));


/***/ }),

/***/ "./src/scripts/models/highlight.ts":
/*!*****************************************!*\
  !*** ./src/scripts/models/highlight.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Highlight = void 0;
var cloze_element_1 = __webpack_require__(/*! ./cloze-element */ "./src/scripts/models/cloze-element.ts");
/**
 * Represents a highlight in the cloze.
 */
var Highlight = /** @class */ (function (_super) {
    __extends(Highlight, _super);
    function Highlight(text, id) {
        var _this = _super.call(this) || this;
        _this.type = cloze_element_1.ClozeElementType.Highlight;
        _this.text = text;
        _this.id = id;
        _this.isHighlighted = false;
        return _this;
    }
    return Highlight;
}(cloze_element_1.ClozeElement));
exports.Highlight = Highlight;


/***/ }),

/***/ "./src/scripts/models/message.ts":
/*!***************************************!*\
  !*** ./src/scripts/models/message.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Message = void 0;
/**
 * Represents a message that the content author has specified to be a reaction
 * to an user's answer.
 */
var Message = /** @class */ (function () {
    function Message(text, showHighlight, relativeHighlightPosition) {
        var _this = this;
        this.text = text;
        this.relativeHighlightPosition = relativeHighlightPosition;
        this.linkHighlight = function (highlightsBefore, highlightsAfter) {
            if (!_this.relativeHighlightPosition)
                return;
            if (_this.relativeHighlightPosition < 0 && (0 - _this.relativeHighlightPosition - 1) < highlightsBefore.length) {
                _this.highlightedElement = highlightsBefore[0 - _this.relativeHighlightPosition - 1];
            }
            else if (_this.relativeHighlightPosition > 0 && (_this.relativeHighlightPosition - 1 < highlightsAfter.length)) {
                _this.highlightedElement = highlightsAfter[_this.relativeHighlightPosition - 1];
            }
        };
        if (!showHighlight)
            this.relativeHighlightPosition = undefined;
    }
    return Message;
}());
exports.Message = Message;


/***/ }),

/***/ "./src/scripts/models/snippet.ts":
/*!***************************************!*\
  !*** ./src/scripts/models/snippet.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Snippet = void 0;
/**
 * A snippet is a text block that is put into placed marked in feedback texts or hints.
 */
var Snippet = /** @class */ (function () {
    /**
     * Constructs the snippet.
     * @param name The name of the snippet that is used when it is referenced in a feedbacktext (without the snippet marker @)
     * @param text The snippet itself (html)
     */
    function Snippet(name, text) {
        this.name = name;
        this.text = text;
    }
    return Snippet;
}());
exports.Snippet = Snippet;


/***/ }),

/***/ "./src/scripts/models/xapi.ts":
/*!************************************!*\
  !*** ./src/scripts/models/xapi.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.XAPIActivityDefinition = void 0;
var XAPIActivityDefinition = /** @class */ (function () {
    function XAPIActivityDefinition() {
    }
    return XAPIActivityDefinition;
}());
exports.XAPIActivityDefinition = XAPIActivityDefinition;


/***/ }),

/***/ "./src/scripts/services/data-repository.ts":
/*!*************************************************!*\
  !*** ./src/scripts/services/data-repository.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.H5PDataRepository = void 0;
var blank_loader_1 = __webpack_require__(/*! ../content-loaders/blank-loader */ "./src/scripts/content-loaders/blank-loader.ts");
var snippet_1 = __webpack_require__(/*! ../models/snippet */ "./src/scripts/models/snippet.ts");
/**
 * Wraps around the h5p config object and provides access to the content.
 */
var H5PDataRepository = /** @class */ (function () {
    function H5PDataRepository(h5pConfigData, settings, localization, jquery, unwrapper) {
        this.h5pConfigData = h5pConfigData;
        this.settings = settings;
        this.localization = localization;
        this.jquery = jquery;
        this.unwrapper = unwrapper;
    }
    /**
     * Returns the blank text of the cloze (as HTML markup).
     */
    H5PDataRepository.prototype.getClozeText = function () {
        return this.h5pConfigData.content.blanksText;
    };
    // TODO: remove or implement
    H5PDataRepository.prototype.getFeedbackText = function () {
        return "";
    };
    H5PDataRepository.prototype.getMedia = function () {
        return this.h5pConfigData.media;
    };
    H5PDataRepository.prototype.getTaskDescription = function () {
        return this.h5pConfigData.content.task;
    };
    H5PDataRepository.prototype.getBlanks = function () {
        var blanks = new Array();
        if (!this.h5pConfigData.content.blanksList)
            return blanks;
        for (var i = 0; i < this.h5pConfigData.content.blanksList.length; i++) {
            var h5pBlank = this.h5pConfigData.content.blanksList[i];
            var correctText = h5pBlank.correctAnswerText;
            if (correctText === "" || correctText === undefined)
                continue;
            var blank = blank_loader_1.BlankLoader.instance.createBlank("cloze" + i, correctText, h5pBlank.hint, h5pBlank.incorrectAnswersList);
            blank.finishInitialization();
            blanks.push(blank);
        }
        return blanks;
    };
    H5PDataRepository.prototype.getSnippets = function () {
        var snippets = new Array();
        if (!this.h5pConfigData.snippets)
            return snippets;
        for (var i = 0; i < this.h5pConfigData.snippets.length; i++) {
            var raw_snippet = this.h5pConfigData.snippets[i];
            var snippet = new snippet_1.Snippet(raw_snippet.snippetName, this.unwrapper.unwrap(raw_snippet.snippetText));
            snippets.push(snippet);
        }
        return snippets;
    };
    return H5PDataRepository;
}());
exports.H5PDataRepository = H5PDataRepository;


/***/ }),

/***/ "./src/scripts/services/localization.ts":
/*!**********************************************!*\
  !*** ./src/scripts/services/localization.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.H5PLocalization = exports.LocalizationStructures = exports.LocalizationLabels = void 0;
var LocalizationLabels;
(function (LocalizationLabels) {
    LocalizationLabels["showSolutionButton"] = "showSolutions";
    LocalizationLabels["retryButton"] = "tryAgain";
    LocalizationLabels["checkAllButton"] = "checkAnswer";
    LocalizationLabels["notFilledOutWarning"] = "notFilledOut";
    LocalizationLabels["tipButton"] = "tipLabel";
    LocalizationLabels["typoMessage"] = "spellingMistakeWarning";
    LocalizationLabels["scoreBarLabel"] = "scoreBarLabel";
})(LocalizationLabels = exports.LocalizationLabels || (exports.LocalizationLabels = {}));
var LocalizationStructures;
(function (LocalizationStructures) {
    LocalizationStructures["confirmCheck"] = "confirmCheck";
    LocalizationStructures["confirmRetry"] = "confirmRetry";
    LocalizationStructures["overallFeedback"] = "overallFeedback";
})(LocalizationStructures = exports.LocalizationStructures || (exports.LocalizationStructures = {}));
/**
 * Provides localization services.
 */
var H5PLocalization = /** @class */ (function () {
    function H5PLocalization(h5pConfiguration) {
        this.h5pConfiguration = h5pConfiguration;
    }
    /**
     * Returns the localized string that is represented by the identifier.
     * @param  {string} localizableStringIdentifier
     * @returns string
     */
    H5PLocalization.prototype.getText = function (localizableStringIdentifier) {
        return this.h5pConfiguration[localizableStringIdentifier];
    };
    H5PLocalization.prototype.labelToString = function (label) {
        return label.toString();
    };
    /**
     * Returns the localized string for the label.
     * @param  {LocalizationLabels} label
     * @returns string
     */
    H5PLocalization.prototype.getTextFromLabel = function (label) {
        return this.getText(this.labelToString(label));
    };
    H5PLocalization.prototype.getObjectForStructure = function (structure) {
        return this.h5pConfiguration[structure.toString()];
    };
    return H5PLocalization;
}());
exports.H5PLocalization = H5PLocalization;


/***/ }),

/***/ "./src/scripts/services/message-service.ts":
/*!*************************************************!*\
  !*** ./src/scripts/services/message-service.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MessageService = void 0;
var enums_1 = __webpack_require__(/*! ../models/enums */ "./src/scripts/models/enums.ts");
var MessageService = /** @class */ (function () {
    function MessageService(jQuery) {
        this.jQuery = jQuery;
    }
    MessageService.prototype.show = function (elementId, message, blank, type) {
        if (!type)
            type = enums_1.MessageType.None;
        var elements = this.jQuery("#" + elementId);
        if (elements.length > 0) {
            this.speechBubble = new H5P.JoubelSpeechBubble(elements, message);
            this.associatedBlank = blank;
        }
    };
    MessageService.prototype.hide = function () {
        if (this.speechBubble) {
            try {
                this.speechBubble.remove();
            }
            catch (exception) {
            }
        }
        this.speechBubble = undefined;
        this.associatedBlank = undefined;
    };
    MessageService.prototype.isActive = function (blank) {
        return this.associatedBlank === blank;
    };
    return MessageService;
}());
exports.MessageService = MessageService;


/***/ }),

/***/ "./src/scripts/services/settings.ts":
/*!******************************************!*\
  !*** ./src/scripts/services/settings.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.H5PSettings = void 0;
var enums_1 = __webpack_require__(/*! ../models/enums */ "./src/scripts/models/enums.ts");
var H5PSettings = /** @class */ (function () {
    function H5PSettings(h5pConfigData) {
        this.clozeType = enums_1.ClozeType.Type;
        this.selectAlternatives = enums_1.SelectAlternatives.Alternatives;
        this.selectAlternativeRestriction = 5;
        this.enableRetry = true;
        this.enableSolutionsButton = true;
        this.enableCheckButton = true;
        this.autoCheck = false;
        this.caseSensitive = false;
        this.warnSpellingErrors = true;
        this.acceptSpellingErrors = false;
        this.showSolutionsRequiresInput = true;
        this.confirmCheckDialog = false;
        this.confirmRetryDialog = false;
        this.disableImageZooming = false;
        if (h5pConfigData.behaviour.mode === 'selection') {
            this.clozeType = enums_1.ClozeType.Select;
        }
        else {
            this.clozeType = enums_1.ClozeType.Type;
        }
        if (h5pConfigData.behaviour.selectAlternatives === 'all') {
            this.selectAlternatives = enums_1.SelectAlternatives.All;
        }
        else if (h5pConfigData.behaviour.selectAlternatives === 'alternatives') {
            this.selectAlternatives = enums_1.SelectAlternatives.Alternatives;
        }
        else {
            this.selectAlternatives = enums_1.SelectAlternatives.All;
        }
        this.selectAlternativeRestriction = h5pConfigData.behaviour.selectAlternativeRestriction;
        this.enableRetry = h5pConfigData.behaviour.enableRetry;
        this.enableSolutionsButton = h5pConfigData.behaviour.enableSolutionsButton;
        this.enableCheckButton = h5pConfigData.behaviour.enableCheckButton;
        this.autoCheck = h5pConfigData.behaviour.autoCheck;
        this.caseSensitive = h5pConfigData.behaviour.caseSensitive;
        this.warnSpellingErrors = h5pConfigData.behaviour.spellingErrorBehaviour === "warn";
        this.acceptSpellingErrors = h5pConfigData.behaviour.spellingErrorBehaviour === "accept";
        this.showSolutionsRequiresInput = h5pConfigData.behaviour.showSolutionsRequiresInput;
        this.confirmCheckDialog = h5pConfigData.behaviour.confirmCheckDialog;
        this.confirmRetryDialog = h5pConfigData.behaviour.confirmRetryDialog;
        this.disableImageZooming = h5pConfigData.behaviour.disableImageZooming;
        this.enforceLogic();
    }
    /**
     * This method sets sensible default values for settings hidden with showWhen
     */
    H5PSettings.prototype.enforceLogic = function () {
        if (this.clozeType === enums_1.ClozeType.Type) {
            this.selectAlternatives = enums_1.SelectAlternatives.All;
            this.selectAlternativeRestriction = 0;
        }
        else {
            if (this.selectAlternativeRestriction === enums_1.SelectAlternatives.Alternatives) {
                this.selectAlternativeRestriction = 0;
            }
            this.warnSpellingErrors = false;
            this.acceptSpellingErrors = false;
            this.caseSensitive = false;
        }
    };
    return H5PSettings;
}());
exports.H5PSettings = H5PSettings;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => module['default'] :
/******/ 				() => module;
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// startup
/******/ 	// Load entry module
/******/ 	__webpack_require__("./src/entries/dist.ts");
/******/ 	// This entry module used 'exports' so it can't be inlined
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9oNXAtYWR2YW5jZWQtYmxhbmtzLy4vc3JjL3N0eWxlcy9zdHlsZS5jc3MiLCJ3ZWJwYWNrOi8vaDVwLWFkdmFuY2VkLWJsYW5rcy8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vaDVwLWFkdmFuY2VkLWJsYW5rcy8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL2g1cC1hZHZhbmNlZC1ibGFua3MvLi9ub2RlX21vZHVsZXMvZGlmZi9saWIvY29udmVydC9kbXAuanMiLCJ3ZWJwYWNrOi8vaDVwLWFkdmFuY2VkLWJsYW5rcy8uL25vZGVfbW9kdWxlcy9kaWZmL2xpYi9jb252ZXJ0L3htbC5qcyIsIndlYnBhY2s6Ly9oNXAtYWR2YW5jZWQtYmxhbmtzLy4vbm9kZV9tb2R1bGVzL2RpZmYvbGliL2RpZmYvYXJyYXkuanMiLCJ3ZWJwYWNrOi8vaDVwLWFkdmFuY2VkLWJsYW5rcy8uL25vZGVfbW9kdWxlcy9kaWZmL2xpYi9kaWZmL2Jhc2UuanMiLCJ3ZWJwYWNrOi8vaDVwLWFkdmFuY2VkLWJsYW5rcy8uL25vZGVfbW9kdWxlcy9kaWZmL2xpYi9kaWZmL2NoYXJhY3Rlci5qcyIsIndlYnBhY2s6Ly9oNXAtYWR2YW5jZWQtYmxhbmtzLy4vbm9kZV9tb2R1bGVzL2RpZmYvbGliL2RpZmYvY3NzLmpzIiwid2VicGFjazovL2g1cC1hZHZhbmNlZC1ibGFua3MvLi9ub2RlX21vZHVsZXMvZGlmZi9saWIvZGlmZi9qc29uLmpzIiwid2VicGFjazovL2g1cC1hZHZhbmNlZC1ibGFua3MvLi9ub2RlX21vZHVsZXMvZGlmZi9saWIvZGlmZi9saW5lLmpzIiwid2VicGFjazovL2g1cC1hZHZhbmNlZC1ibGFua3MvLi9ub2RlX21vZHVsZXMvZGlmZi9saWIvZGlmZi9zZW50ZW5jZS5qcyIsIndlYnBhY2s6Ly9oNXAtYWR2YW5jZWQtYmxhbmtzLy4vbm9kZV9tb2R1bGVzL2RpZmYvbGliL2RpZmYvd29yZC5qcyIsIndlYnBhY2s6Ly9oNXAtYWR2YW5jZWQtYmxhbmtzLy4vbm9kZV9tb2R1bGVzL2RpZmYvbGliL2luZGV4LmpzIiwid2VicGFjazovL2g1cC1hZHZhbmNlZC1ibGFua3MvLi9ub2RlX21vZHVsZXMvZGlmZi9saWIvcGF0Y2gvYXBwbHkuanMiLCJ3ZWJwYWNrOi8vaDVwLWFkdmFuY2VkLWJsYW5rcy8uL25vZGVfbW9kdWxlcy9kaWZmL2xpYi9wYXRjaC9jcmVhdGUuanMiLCJ3ZWJwYWNrOi8vaDVwLWFkdmFuY2VkLWJsYW5rcy8uL25vZGVfbW9kdWxlcy9kaWZmL2xpYi9wYXRjaC9tZXJnZS5qcyIsIndlYnBhY2s6Ly9oNXAtYWR2YW5jZWQtYmxhbmtzLy4vbm9kZV9tb2R1bGVzL2RpZmYvbGliL3BhdGNoL3BhcnNlLmpzIiwid2VicGFjazovL2g1cC1hZHZhbmNlZC1ibGFua3MvLi9ub2RlX21vZHVsZXMvZGlmZi9saWIvdXRpbC9hcnJheS5qcyIsIndlYnBhY2s6Ly9oNXAtYWR2YW5jZWQtYmxhbmtzLy4vbm9kZV9tb2R1bGVzL2RpZmYvbGliL3V0aWwvZGlzdGFuY2UtaXRlcmF0b3IuanMiLCJ3ZWJwYWNrOi8vaDVwLWFkdmFuY2VkLWJsYW5rcy8uL25vZGVfbW9kdWxlcy9kaWZmL2xpYi91dGlsL3BhcmFtcy5qcyIsIndlYnBhY2s6Ly9oNXAtYWR2YW5jZWQtYmxhbmtzLy4vc3JjL3NjcmlwdHMvdmlld3MvYmxhbmsucmFjdGl2ZS5odG1sIiwid2VicGFjazovL2g1cC1hZHZhbmNlZC1ibGFua3MvLi9zcmMvc2NyaXB0cy92aWV3cy9oaWdobGlnaHQucmFjdGl2ZS5odG1sIiwid2VicGFjazovL2g1cC1hZHZhbmNlZC1ibGFua3MvLi9zcmMvc3R5bGVzL3N0eWxlLmNzcz80MDQ5Iiwid2VicGFjazovL2g1cC1hZHZhbmNlZC1ibGFua3MvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vaDVwLWFkdmFuY2VkLWJsYW5rcy8uL3NyYy9lbnRyaWVzL2Rpc3QudHMiLCJ3ZWJwYWNrOi8vaDVwLWFkdmFuY2VkLWJsYW5rcy8uL3NyYy9saWIvaGVscGVycy50cyIsIndlYnBhY2s6Ly9oNXAtYWR2YW5jZWQtYmxhbmtzLy4vc3JjL2xpYi9yYWN0aXZlLWV2ZW50cy1rZXlzLnRzIiwid2VicGFjazovL2g1cC1hZHZhbmNlZC1ibGFua3MvLi9zcmMvc2NyaXB0cy9hcHAudHMiLCJ3ZWJwYWNrOi8vaDVwLWFkdmFuY2VkLWJsYW5rcy8uL3NyYy9zY3JpcHRzL2NvbnRlbnQtbG9hZGVycy9ibGFuay1sb2FkZXIudHMiLCJ3ZWJwYWNrOi8vaDVwLWFkdmFuY2VkLWJsYW5rcy8uL3NyYy9zY3JpcHRzL2NvbnRlbnQtbG9hZGVycy9jbG96ZS1sb2FkZXIudHMiLCJ3ZWJwYWNrOi8vaDVwLWFkdmFuY2VkLWJsYW5rcy8uL3NyYy9zY3JpcHRzL2NvbnRyb2xsZXJzL2Nsb3plLWNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vaDVwLWFkdmFuY2VkLWJsYW5rcy8uL3NyYy9zY3JpcHRzL2hlbHBlcnMvcGVybXV0YXRpb25zLnRzIiwid2VicGFjazovL2g1cC1hZHZhbmNlZC1ibGFua3MvLi9zcmMvc2NyaXB0cy9oZWxwZXJzL3Vud3JhcHBlci50cyIsIndlYnBhY2s6Ly9oNXAtYWR2YW5jZWQtYmxhbmtzLy4vc3JjL3NjcmlwdHMvbW9kZWxzL2Fuc3dlci50cyIsIndlYnBhY2s6Ly9oNXAtYWR2YW5jZWQtYmxhbmtzLy4vc3JjL3NjcmlwdHMvbW9kZWxzL2JsYW5rLnRzIiwid2VicGFjazovL2g1cC1hZHZhbmNlZC1ibGFua3MvLi9zcmMvc2NyaXB0cy9tb2RlbHMvY2xvemUtZWxlbWVudC50cyIsIndlYnBhY2s6Ly9oNXAtYWR2YW5jZWQtYmxhbmtzLy4vc3JjL3NjcmlwdHMvbW9kZWxzL2Nsb3plLnRzIiwid2VicGFjazovL2g1cC1hZHZhbmNlZC1ibGFua3MvLi9zcmMvc2NyaXB0cy9tb2RlbHMvZW51bXMudHMiLCJ3ZWJwYWNrOi8vaDVwLWFkdmFuY2VkLWJsYW5rcy8uL3NyYy9zY3JpcHRzL21vZGVscy9oaWdobGlnaHQudHMiLCJ3ZWJwYWNrOi8vaDVwLWFkdmFuY2VkLWJsYW5rcy8uL3NyYy9zY3JpcHRzL21vZGVscy9tZXNzYWdlLnRzIiwid2VicGFjazovL2g1cC1hZHZhbmNlZC1ibGFua3MvLi9zcmMvc2NyaXB0cy9tb2RlbHMvc25pcHBldC50cyIsIndlYnBhY2s6Ly9oNXAtYWR2YW5jZWQtYmxhbmtzLy4vc3JjL3NjcmlwdHMvbW9kZWxzL3hhcGkudHMiLCJ3ZWJwYWNrOi8vaDVwLWFkdmFuY2VkLWJsYW5rcy8uL3NyYy9zY3JpcHRzL3NlcnZpY2VzL2RhdGEtcmVwb3NpdG9yeS50cyIsIndlYnBhY2s6Ly9oNXAtYWR2YW5jZWQtYmxhbmtzLy4vc3JjL3NjcmlwdHMvc2VydmljZXMvbG9jYWxpemF0aW9uLnRzIiwid2VicGFjazovL2g1cC1hZHZhbmNlZC1ibGFua3MvLi9zcmMvc2NyaXB0cy9zZXJ2aWNlcy9tZXNzYWdlLXNlcnZpY2UudHMiLCJ3ZWJwYWNrOi8vaDVwLWFkdmFuY2VkLWJsYW5rcy8uL3NyYy9zY3JpcHRzL3NlcnZpY2VzL3NldHRpbmdzLnRzIiwid2VicGFjazovL2g1cC1hZHZhbmNlZC1ibGFua3Mvd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vaDVwLWFkdmFuY2VkLWJsYW5rcy93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9oNXAtYWR2YW5jZWQtYmxhbmtzL3dlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyIsIndlYnBhY2s6Ly9oNXAtYWR2YW5jZWQtYmxhbmtzL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vaDVwLWFkdmFuY2VkLWJsYW5rcy93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL2g1cC1hZHZhbmNlZC1ibGFua3Mvd2VicGFjay9zdGFydHVwIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQzZHO0FBQ2pCO0FBQzVGLDhCQUE4QixtRkFBMkIsQ0FBQyw0RkFBcUM7QUFDL0Y7QUFDQSxnRUFBZ0UseUJBQXlCLEdBQUcsaUhBQWlILHlCQUF5QixzQkFBc0IsMEJBQTBCLEdBQUcsK0NBQStDLHVHQUF1Ryw0QkFBNEIsT0FBTyxHQUFHLDhEQUE4RCw0QkFBNEIseUJBQXlCLEdBQUcsaURBQWlELDRDQUE0QyxxQkFBcUIsNEJBQTRCLGdDQUFnQyw2Q0FBNkMsOEJBQThCLHVCQUF1QixHQUFHLHNEQUFzRCxrQ0FBa0MsR0FBRyx1REFBdUQsa0NBQWtDLEdBQUcsb0VBQW9FLG9CQUFvQixHQUFHLHlDQUF5QyxzQkFBc0IsR0FBRyxrREFBa0QseUJBQXlCLDRCQUE0QixpQ0FBaUMsR0FBRyxvR0FBb0csaUNBQWlDLHFCQUFxQiwwQkFBMEIsR0FBRyxpRkFBaUYsb0JBQW9CLHNDQUFzQyw0QkFBNEIsR0FBRyw2RkFBNkYsMEJBQTBCLGdDQUFnQyxxQkFBcUIsR0FBRyxrRUFBa0UseUJBQXlCLG1CQUFtQixtQkFBbUIsa0NBQWtDLDRCQUE0QiwwQkFBMEIscUNBQXFDLHFCQUFxQixHQUFHLG9GQUFvRixnQ0FBZ0MsZ0NBQWdDLHFCQUFxQixvQ0FBb0MsR0FBRyxnRUFBZ0UseUJBQXlCLG1CQUFtQixlQUFlLGtDQUFrQyxxQ0FBcUMsNEJBQTRCLDBCQUEwQixxQkFBcUIsR0FBRyxrRkFBa0YsZ0NBQWdDLGdDQUFnQyxtQkFBbUIsR0FBRyxnRUFBZ0UseUJBQXlCLG1CQUFtQixlQUFlLGtDQUFrQyxxQ0FBcUMsNEJBQTRCLDBCQUEwQixxQkFBcUIsR0FBRywyREFBMkQsd0JBQXdCLHlCQUF5QixtQkFBbUIsdUJBQXVCLEdBQUcsa0lBQWtJLGlCQUFpQix3QkFBd0Isd0NBQXdDLHdDQUF3QywwQ0FBMEMsMENBQTBDLDRDQUE0Qyw0Q0FBNEMsNkNBQTZDLDZDQUE2QyxHQUFHLG9DQUFvQyxZQUFZLHlCQUF5QixPQUFPLFVBQVUscUJBQXFCLE9BQU8sR0FBRyw0QkFBNEIsWUFBWSx5QkFBeUIsT0FBTyxVQUFVLHFCQUFxQixPQUFPLEdBQUcsMkNBQTJDLG9DQUFvQyxHQUFHLHFFQUFxRSw2Q0FBNkMscUJBQXFCLHFCQUFxQix5Q0FBeUMseUNBQXlDLHFEQUFxRCxxREFBcUQsMkNBQTJDLDJDQUEyQyw2Q0FBNkMsNkNBQTZDLEdBQUcsK0NBQStDLFlBQVksb0NBQW9DLE9BQU8sVUFBVSxpREFBaUQsT0FBTyxHQUFHLHVDQUF1QyxZQUFZLG9DQUFvQyxPQUFPLFVBQVUsaURBQWlELE9BQU8sR0FBRyx1REFBdUQsMkJBQTJCLEdBQUcsNkRBQTZELHVCQUF1QixhQUFhLGdDQUFnQyxpQkFBaUIsbUJBQW1CLEdBQUcsK0ZBQStGLDRCQUE0QixHQUFHLG9OQUFvTixvQkFBb0IsR0FBRyx5TEFBeUwsMkJBQTJCLEdBQUcsd0hBQXdILGlCQUFpQixrQkFBa0IsR0FBRyxzSkFBc0osb0JBQW9CLEdBQUcsK0dBQStHLHVCQUF1QixPQUFPLDJOQUEyTixxQ0FBcUMsNEJBQTRCLG1FQUFtRSwyQ0FBMkMsMkNBQTJDLHNDQUFzQywwQ0FBMEMsMENBQTBDLDBCQUEwQixHQUFHLCtHQUErRyx5QkFBeUIsbUJBQW1CLGtCQUFrQiwwQkFBMEIsR0FBRyx1T0FBdU8scUJBQXFCLEdBQUcsdU9BQXVPLHFCQUFxQix1Q0FBdUMsR0FBRyw4QkFBOEIsb0JBQW9CLCtDQUErQyxPQUFPLG9CQUFvQiw0Q0FBNEMsT0FBTyw4QkFBOEIsNkNBQTZDLE9BQU8sb0JBQW9CLDRDQUE0QyxPQUFPLEdBQUcsc0JBQXNCLG9CQUFvQiwrQ0FBK0MsT0FBTyxvQkFBb0IsNENBQTRDLE9BQU8sOEJBQThCLDZDQUE2QyxPQUFPLG9CQUFvQiw0Q0FBNEMsT0FBTyxHQUFHLE9BQU8sdUZBQXVGLFlBQVksUUFBUSxXQUFXLE1BQU0sWUFBWSxXQUFXLFlBQVksT0FBTyxLQUFLLE1BQU0sWUFBWSxNQUFNLE9BQU8sV0FBVyxLQUFLLFlBQVksYUFBYSxPQUFPLEtBQUssWUFBWSxXQUFXLFlBQVksYUFBYSxhQUFhLGFBQWEsYUFBYSxPQUFPLEtBQUssWUFBWSxPQUFPLEtBQUssWUFBWSxPQUFPLGFBQWEsTUFBTSxVQUFVLE9BQU8sS0FBSyxVQUFVLFFBQVEsYUFBYSxNQUFNLFlBQVksYUFBYSxhQUFhLFFBQVEsYUFBYSxNQUFNLFlBQVksV0FBVyxZQUFZLFFBQVEsYUFBYSxNQUFNLFVBQVUsWUFBWSxhQUFhLFFBQVEsYUFBYSxNQUFNLFlBQVksYUFBYSxXQUFXLE9BQU8sS0FBSyxZQUFZLFdBQVcsVUFBVSxZQUFZLGFBQWEsYUFBYSxhQUFhLFdBQVcsUUFBUSxhQUFhLE1BQU0sWUFBWSxhQUFhLFdBQVcsWUFBWSxPQUFPLEtBQUssWUFBWSxXQUFXLFVBQVUsWUFBWSxhQUFhLGFBQWEsYUFBYSxXQUFXLFFBQVEsYUFBYSxNQUFNLFlBQVksYUFBYSxXQUFXLE9BQU8sS0FBSyxZQUFZLFdBQVcsVUFBVSxZQUFZLGFBQWEsYUFBYSxhQUFhLFdBQVcsUUFBUSxXQUFXLEtBQUssWUFBWSxhQUFhLFdBQVcsWUFBWSxRQUFRLGFBQWEsT0FBTyxVQUFVLFlBQVksYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLE9BQU8sS0FBSyxLQUFLLFVBQVUsTUFBTSxLQUFLLFVBQVUsS0FBSyxNQUFNLEtBQUssS0FBSyxVQUFVLE1BQU0sS0FBSyxVQUFVLEtBQUssTUFBTSxLQUFLLFlBQVksUUFBUSxhQUFhLE1BQU0sWUFBWSxXQUFXLFVBQVUsWUFBWSxhQUFhLGFBQWEsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLE9BQU8sS0FBSyxLQUFLLFlBQVksTUFBTSxLQUFLLFlBQVksTUFBTSxNQUFNLEtBQUssS0FBSyxZQUFZLE1BQU0sS0FBSyxZQUFZLE1BQU0sT0FBTyxXQUFXLEtBQUssWUFBWSxRQUFRLFdBQVcsS0FBSyxZQUFZLFdBQVcsWUFBWSxXQUFXLFVB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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBLElBQUk7O0FBRUo7QUFDQSxtQ0FBbUM7O0FBRW5DO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxHQUFHOzs7QUFHSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0Esd0NBQXdDOztBQUV4QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EseUNBQXlDOztBQUV6QztBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtB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QTtXQUNBO1dBQ0E7V0FDQSx3Q0FBd0MseUNBQXlDO1dBQ2pGO1dBQ0E7V0FDQSxFOzs7OztXQ1BBLHNGOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHNEQUFzRCxrQkFBa0I7V0FDeEU7V0FDQSwrQ0FBK0MsY0FBYztXQUM3RCxFOzs7O1VDTkE7VUFDQTtVQUNBO1VBQ0EiLCJmaWxlIjoiZGlzdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIFwiLmg1cC1hZHZhbmNlZC1ibGFua3Mge1xcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XFxufVxcblxcblxcbi8qIFRleHQgKi9cXG5cXG4uaDVwLWFkdmFuY2VkLWJsYW5rcyAjaDVwLWNsb3plLWNvbnRhaW5lciBwLFxcbi5oNXAtYWR2YW5jZWQtYmxhbmtzICNoNXAtY2xvemUtY29udGFpbmVyIGRpdiB7XFxuICAgIGxpbmUtaGVpZ2h0OiAxLjhlbTtcXG4gICAgbWFyZ2luOiAwIDAgMWVtO1xcbiAgICB0ZXh0LWFsaWduOiBqdXN0aWZ5O1xcbn1cXG5cXG5AbWVkaWEgb25seSBzY3JlZW4gYW5kIChtaW4td2lkdGg6IDQ4MHB4KSB7XFxuICAgIC5oNXAtYWR2YW5jZWQtYmxhbmtzICNoNXAtY2xvemUtY29udGFpbmVyIHAsXFxuICAgIC5oNXAtYWR2YW5jZWQtYmxhbmtzICNoNXAtY2xvemUtY29udGFpbmVyIGRpdiB7XFxuICAgICAgICB0ZXh0LWFsaWduOiB1bnNldDtcXG4gICAgfVxcbn1cXG5cXG5cXG4vKiBJbnB1dCAqL1xcblxcbi5oNXAtYWR2YW5jZWQtYmxhbmtzIC5oNXAtaW5wdXQtd3JhcHBlciB7XFxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xcbn1cXG5cXG4uaDVwLWFkdmFuY2VkLWJsYW5rcyAuYmxhbmsgLmg1cC10ZXh0LWlucHV0IHtcXG4gICAgZm9udC1mYW1pbHk6IEg1UERyb2lkU2Fucywgc2Fucy1zZXJpZjtcXG4gICAgZm9udC1zaXplOiAxZW07XFxuICAgIGJvcmRlci1yYWRpdXM6IDAuMjVlbTtcXG4gICAgYm9yZGVyOiAxcHggc29saWQgI2EwYTBhMDtcXG4gICAgcGFkZGluZzogMC4xODc1ZW0gMS41ZW0gMC4xODc1ZW0gMC41ZW07XFxuICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xcbn1cXG5cXG4uaDVwLWFkdmFuY2VkLWJsYW5rcyAuYmxhbmsgaW5wdXQuaDVwLXRleHQtaW5wdXQge1xcbiAgbWF4LXdpZHRoOiBjYWxjKDEwMHZ3IC0gNjRweCk7XFxufVxcblxcbi5oNXAtYWR2YW5jZWQtYmxhbmtzIC5ibGFuayBzZWxlY3QuaDVwLXRleHQtaW5wdXQge1xcbiAgbWF4LXdpZHRoOiBjYWxjKDEwMHZ3IC0gMzZweCk7XFxufVxcblxcbi8qIElFICsgQ2hyb21lIHNwZWNpZmljIGZpeGVzICovXFxuXFxuLmg1cC10ZXh0LWlucHV0OjotbXMtY2xlYXIge1xcbiAgICBkaXNwbGF5OiBub25lO1xcbn1cXG5cXG46bm90KC5jb3JyZWN0KS5ibGFuay5oYXMtdGlwIGJ1dHRvbiB7XFxuICAgIGN1cnNvcjogcG9pbnRlcjtcXG59XFxuXFxuXFxuLyogU2VsZWN0IG1vZGUgKi9cXG5cXG5zZWxlY3QuaDVwLXRleHQtaW5wdXQge1xcbiAgICBhcHBlYXJhbmNlOiBidXR0b247XFxuICAgIC1tb3otYXBwZWFyYW5jZTogbm9uZTtcXG4gICAgLXdlYmtpdC1hcHBlYXJhbmNlOiBidXR0b247XFxufVxcblxcblxcbi8qIFNob3dpbmcgc29sdXRpb24gaW5wdXQgKi9cXG5cXG4uaDVwLWFkdmFuY2VkLWJsYW5rcyAuYmxhbmsuc2hvd2luZy1zb2x1dGlvbiAuaDVwLXRleHQtaW5wdXQge1xcbiAgICBib3JkZXI6IDFweCBkYXNoZWQgIzlkZDhiYjtcXG4gICAgY29sb3I6ICMyNTVjNDE7XFxuICAgIGJhY2tncm91bmQ6ICNGRkZGRkY7XFxufVxcblxcblxcbi8qIEZvY3Vzc2VkIGlucHV0ICovXFxuXFxuLmg1cC1hZHZhbmNlZC1ibGFua3MgLmJsYW5rIC5oNXAtdGV4dC1pbnB1dDpmb2N1cyB7XFxuICAgIG91dGxpbmU6IG5vbmU7XFxuICAgIGJveC1zaGFkb3c6IDAgMCAwLjVlbSAwICM3ZmI4ZmY7XFxuICAgIGJvcmRlci1jb2xvcjogIzdmYjhmZjtcXG59XFxuXFxuXFxuLyogQ29ycmVjdGx5IGFuc3dlcmVkIGlucHV0ICovXFxuXFxuLmg1cC1hZHZhbmNlZC1ibGFua3MgLmJsYW5rLmNvcnJlY3QgLmg1cC10ZXh0LWlucHV0IHtcXG4gICAgYmFja2dyb3VuZDogIzlkZDhiYjtcXG4gICAgYm9yZGVyOiAxcHggc29saWQgIzlkZDhiYjtcXG4gICAgY29sb3I6ICMyNTVjNDE7XFxufVxcblxcbi5oNXAtYWR2YW5jZWQtYmxhbmtzIC5ibGFuay5jb3JyZWN0IC5oNXAtaW5wdXQtd3JhcHBlcjphZnRlciB7XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgcmlnaHQ6IDAuNWVtOyAgICBcXG4gICAgdG9wOiA1MCU7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNTAlKTtcXG4gICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcbiAgICBjb250ZW50OiBcXFwiXFxcXGYwMGNcXFwiO1xcbiAgICBmb250LWZhbWlseTogJ0g1UEZvbnRBd2Vzb21lNCc7XFxuICAgIGNvbG9yOiAjMjU1YzQxO1xcbn1cXG5cXG5cXG4vKiBJbmNvcnJlY3QgYW5zd2VycyAqL1xcblxcbi5oNXAtYWR2YW5jZWQtYmxhbmtzIC5ibGFuay5lcnJvciAuaDVwLXRleHQtaW5wdXQge1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZjdkMGQwO1xcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjZjdkMGQwO1xcbiAgICBjb2xvcjogI2I3MWMxYztcXG4gICAgdGV4dC1kZWNvcmF0aW9uOiBsaW5lLXRocm91Z2g7XFxufVxcblxcbi5oNXAtYWR2YW5jZWQtYmxhbmtzIC5ibGFuay5lcnJvciAuaDVwLWlucHV0LXdyYXBwZXI6YWZ0ZXIge1xcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgIHJpZ2h0OiAwLjVlbTtcXG4gICAgdG9wOiA1MCU7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNTAlKTtcXG4gICAgZm9udC1mYW1pbHk6ICdINVBGb250QXdlc29tZTQnO1xcbiAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxuICAgIGNvbnRlbnQ6IFxcXCJcXFxcZjAwZFxcXCI7XFxuICAgIGNvbG9yOiAjYjcxYzFjO1xcbn1cXG5cXG5cXG4vKiBTcGVsbGluZyBlcnJvcnMgKi9cXG5cXG4uaDVwLWFkdmFuY2VkLWJsYW5rcyAuYmxhbmsucmV0cnkgLmg1cC10ZXh0LWlucHV0IHtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogI2ZmZmY5OTtcXG4gICAgYm9yZGVyOiAxcHggc29saWQgI2ZmZmY5OTtcXG4gICAgY29sb3I6IGJsYWNrO1xcbn1cXG5cXG4uaDVwLWFkdmFuY2VkLWJsYW5rcyAuYmxhbmsucmV0cnkgLmg1cC1pbnB1dC13cmFwcGVyOmFmdGVyIHtcXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgICByaWdodDogMC41ZW07XFxuICAgIHRvcDogNTAlO1xcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTUwJSk7XFxuICAgIGZvbnQtZmFtaWx5OiAnSDVQRm9udEF3ZXNvbWU0JztcXG4gICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcbiAgICBjb250ZW50OiBcXFwiXFxcXGYwMGRcXFwiO1xcbiAgICBjb2xvcjogI2I3MWMxYztcXG59XFxuXFxuXFxuLyogQnV0dG9ucyAqL1xcblxcbi5oNXAtYWR2YW5jZWQtYmxhbmtzIC5ibGFuayBidXR0b24ge1xcbiAgICBwYWRkaW5nLWxlZnQ6IDVweDtcXG4gICAgcGFkZGluZy1yaWdodDogNXB4O1xcbiAgICBib3JkZXI6IG5vbmU7XFxuICAgIGJhY2tncm91bmQ6IG5vbmU7XFxufVxcblxcblxcbi8qIEhpZ2hsaWdodCBpbiBzcGVsbGluZyBtaXN0YWtlIG1hcmtlciAqL1xcblxcbi5zcGVsbGluZy1taXN0YWtlIC5taXNzaW5nLWNoYXJhY3RlcixcXG4uc3BlbGxpbmctbWlzdGFrZSAubWlzdGFrZW4tY2hhcmFjdGVyIHtcXG4gICAgY29sb3I6IHJlZDtcXG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxuICAgIC13ZWJraXQtYW5pbWF0aW9uLWR1cmF0aW9uOiA1MDBtcztcXG4gICAgICAgICAgICBhbmltYXRpb24tZHVyYXRpb246IDUwMG1zO1xcbiAgICAtd2Via2l0LWFuaW1hdGlvbi1uYW1lOiBibGluay1jb2xvcjtcXG4gICAgICAgICAgICBhbmltYXRpb24tbmFtZTogYmxpbmstY29sb3I7XFxuICAgIC13ZWJraXQtYW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudDogMTM7XFxuICAgICAgICAgICAgYW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudDogMTM7XFxuICAgIC13ZWJraXQtYW5pbWF0aW9uLWRpcmVjdGlvbjogYWx0ZXJuYXRlO1xcbiAgICAgICAgICAgIGFuaW1hdGlvbi1kaXJlY3Rpb246IGFsdGVybmF0ZTtcXG59XFxuXFxuQC13ZWJraXQta2V5ZnJhbWVzIGJsaW5rLWNvbG9yIHtcXG4gICAgZnJvbSB7XFxuICAgICAgICBjb2xvcjogaW5pdGlhbDtcXG4gICAgfVxcbiAgICB0byB7XFxuICAgICAgICBjb2xvcjogcmVkO1xcbiAgICB9XFxufVxcblxcbkBrZXlmcmFtZXMgYmxpbmstY29sb3Ige1xcbiAgICBmcm9tIHtcXG4gICAgICAgIGNvbG9yOiBpbml0aWFsO1xcbiAgICB9XFxuICAgIHRvIHtcXG4gICAgICAgIGNvbG9yOiByZWQ7XFxuICAgIH1cXG59XFxuXFxuLnNwZWxsaW5nLW1pc3Rha2UgLm1pc3Rha2VuLWNoYXJhY3RlciB7XFxuICAgIHRleHQtZGVjb3JhdGlvbjogbGluZS10aHJvdWdoO1xcbn1cXG5cXG5cXG4vKiBIaWdobGlnaHRzIGluIHRleHQgKi9cXG5cXG4uaDVwLWFkdmFuY2VkLWJsYW5rcyAuaGlnaGxpZ2h0ZWQge1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMCwgMCwgMC4yKTtcXG4gICAgcGFkZGluZzogMC40ZW07XFxuICAgIG1hcmdpbjogLTAuNGVtO1xcbiAgICAtd2Via2l0LWFuaW1hdGlvbi1kdXJhdGlvbjogMTAwMG1zO1xcbiAgICAgICAgICAgIGFuaW1hdGlvbi1kdXJhdGlvbjogMTAwMG1zO1xcbiAgICAtd2Via2l0LWFuaW1hdGlvbi1uYW1lOiBibGluay1iYWNrZ3JvdW5kLWNvbG9yO1xcbiAgICAgICAgICAgIGFuaW1hdGlvbi1uYW1lOiBibGluay1iYWNrZ3JvdW5kLWNvbG9yO1xcbiAgICAtd2Via2l0LWFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IDM7XFxuICAgICAgICAgICAgYW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudDogMztcXG4gICAgLXdlYmtpdC1hbmltYXRpb24tZGlyZWN0aW9uOiBhbHRlcm5hdGU7XFxuICAgICAgICAgICAgYW5pbWF0aW9uLWRpcmVjdGlvbjogYWx0ZXJuYXRlO1xcbn1cXG5cXG5ALXdlYmtpdC1rZXlmcmFtZXMgYmxpbmstYmFja2dyb3VuZC1jb2xvciB7XFxuICAgIGZyb20ge1xcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogaW5pdGlhbDtcXG4gICAgfVxcbiAgICB0byB7XFxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMCwgMCwgMC4yKTtcXG4gICAgfVxcbn1cXG5cXG5Aa2V5ZnJhbWVzIGJsaW5rLWJhY2tncm91bmQtY29sb3Ige1xcbiAgICBmcm9tIHtcXG4gICAgICAgIGJhY2tncm91bmQtY29sb3I6IGluaXRpYWw7XFxuICAgIH1cXG4gICAgdG8ge1xcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDAsIDAsIDAuMik7XFxuICAgIH1cXG59XFxuXFxuXFxuLyogT3RoZXJzICovXFxuXFxuLmg1cC1hZHZhbmNlZC1ibGFua3MgLmludmlzaWJsZSB7XFxuICAgIHZpc2liaWxpdHk6IGNvbGxhcHNlO1xcbn1cXG5cXG5cXG4vKiBUaXBzICovXFxuXFxuLmg1cC1hZHZhbmNlZC1ibGFua3MgLmg1cC10aXAtY29udGFpbmVyIHtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIHRvcDogNTAlO1xcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC01MCUpO1xcbiAgcmlnaHQ6IDAuNGVtO1xcbiAgZm9udC1zaXplOiAxZW07XFxufVxcblxcbi5oNXAtYWR2YW5jZWQtYmxhbmtzIC5ibGFuay5oYXMtdGlwOm5vdCguY29ycmVjdCk6bm90KC5lcnJvcik6bm90KC5yZXRyeSkgLmg1cC10ZXh0LWlucHV0IHtcXG4gICAgcGFkZGluZy1yaWdodDogMi4yNWVtO1xcbn1cXG5cXG4uaDVwLWFkdmFuY2VkLWJsYW5rcyAuYmxhbmsuaGFzLXRpcC5jb3JyZWN0IC5oNXAtaW5wdXQtd3JhcHBlcjphZnRlcixcXG4uaDVwLWFkdmFuY2VkLWJsYW5rcyAuYmxhbmsuaGFzLXRpcC5lcnJvciAuaDVwLWlucHV0LXdyYXBwZXI6YWZ0ZXIsXFxuLmg1cC1hZHZhbmNlZC1ibGFua3MgLmJsYW5rLmhhcy10aXAucmV0cnkgLmg1cC1pbnB1dC13cmFwcGVyOmFmdGVyIHtcXG4gICAgcmlnaHQ6IDIuMjVlbTtcXG59XFxuXFxuLmg1cC1hZHZhbmNlZC1ibGFua3MgLmJsYW5rLmNvcnJlY3QuaGFzLXRpcCAuaDVwLXRleHQtaW5wdXQsXFxuLmg1cC1hZHZhbmNlZC1ibGFua3MgLmJsYW5rLmVycm9yLmhhcy10aXAgLmg1cC10ZXh0LWlucHV0LFxcbi5oNXAtYWR2YW5jZWQtYmxhbmtzIC5ibGFuay5yZXRyeS5oYXMtdGlwIC5oNXAtdGV4dC1pbnB1dCB7XFxuICAgIHBhZGRpbmctcmlnaHQ6IDMuNWVtO1xcbn1cXG5cXG4vKiBpbXByb3ZlcyBhcHBlYXJhbmNlIG9mIGg1cCB0aXAgc2hhZG93cyAqL1xcbi5oNXAtYWR2YW5jZWQtYmxhbmtzIC5qb3ViZWwtaWNvbi10aXAtbm9ybWFsIC5oNXAtaWNvbi1zaGFkb3c6YmVmb3JlIHtcXG4gIGNvbG9yOiBibGFjaztcXG4gIG9wYWNpdHk6IDAuMTM7XFxufVxcblxcbi8qIHBlbmRpbmcgZmVlZGJhY2sgbWFya2VyICovXFxuXFxuLmg1cC1hZHZhbmNlZC1ibGFua3MgLmg1cC1hZHZhbmNlZC1ibGFua3Mtc2VsZWN0LW1vZGUgLmJsYW5rOm5vdCguaGFzLXBlbmRpbmctZmVlZGJhY2spIGJ1dHRvbi5oNXAtbm90aWZpY2F0aW9uIHtcXG4gICAgZGlzcGxheTogbm9uZTtcXG59XFxuXFxuLmg1cC1hZHZhbmNlZC1ibGFua3MgLmg1cC1hZHZhbmNlZC1ibGFua3Mtc2VsZWN0LW1vZGUgLmJsYW5rLmhhcy1wZW5kaW5nLWZlZWRiYWNrIGJ1dHRvbi5oNXAtbm90aWZpY2F0aW9uIHtcXG4gICAgZm9udC1zaXplOiBsYXJnZTsgICAgXFxufVxcblxcbi5oNXAtYWR2YW5jZWQtYmxhbmtzIC5oNXAtYWR2YW5jZWQtYmxhbmtzLXNlbGVjdC1tb2RlIC5ibGFuay5oYXMtcGVuZGluZy1mZWVkYmFjayBidXR0b24uaDVwLW5vdGlmaWNhdGlvbixcXG4uaDVwLWFkdmFuY2VkLWJsYW5rcyAuaDVwLWFkdmFuY2VkLWJsYW5rcy10eXBlLW1vZGUgLmJsYW5rLmhhcy1wZW5kaW5nLWZlZWRiYWNrIC5oNXAtaW5wdXQtd3JhcHBlcjpiZWZvcmUge1xcbiAgICBmb250LWZhbWlseTogJ0g1UEZvbnRBd2Vzb21lNCc7XFxuICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXG4gICAgYW5pbWF0aW9uOiBzaGFrZSAzcyBjdWJpYy1iZXppZXIoLjM2LCAuMDcsIC4xOSwgLjk3KSByZXZlcnNlO1xcbiAgICAtd2Via2l0LWFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IDI7XFxuICAgICAgICAgICAgYW5pbWF0aW9uLWl0ZXJhdGlvbi1jb3VudDogMjtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUzZCgwLCAwLCAwKTtcXG4gICAgLXdlYmtpdC1iYWNrZmFjZS12aXNpYmlsaXR5OiBoaWRkZW47XFxuICAgICAgICAgICAgYmFja2ZhY2UtdmlzaWJpbGl0eTogaGlkZGVuO1xcbiAgICBwZXJzcGVjdGl2ZTogMTAwMHB4O1xcbn1cXG5cXG4uaDVwLWFkdmFuY2VkLWJsYW5rcyAuaDVwLWFkdmFuY2VkLWJsYW5rcy10eXBlLW1vZGUgLmJsYW5rLmhhcy1wZW5kaW5nLWZlZWRiYWNrIC5oNXAtaW5wdXQtd3JhcHBlcjpiZWZvcmUge1xcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgIGxlZnQ6IC0wLjRlbTtcXG4gICAgdG9wOiAtMC43ZW07XFxuICAgIGNvbnRlbnQ6IFxcXCJcXFxcZjA1YVxcXCI7XFxufVxcblxcbi5oNXAtYWR2YW5jZWQtYmxhbmtzIC5oNXAtYWR2YW5jZWQtYmxhbmtzLXNlbGVjdC1tb2RlIC5ibGFuay5lcnJvci5oYXMtcGVuZGluZy1mZWVkYmFjayBidXR0b24uaDVwLW5vdGlmaWNhdGlvbixcXG4uaDVwLWFkdmFuY2VkLWJsYW5rcyAuaDVwLWFkdmFuY2VkLWJsYW5rcy10eXBlLW1vZGUgLmJsYW5rLmVycm9yLmhhcy1wZW5kaW5nLWZlZWRiYWNrIC5oNXAtaW5wdXQtd3JhcHBlcjpiZWZvcmUge1xcbiAgICBjb2xvcjogI2I3MWMxYztcXG59XFxuXFxuLmg1cC1hZHZhbmNlZC1ibGFua3MgLmg1cC1hZHZhbmNlZC1ibGFua3Mtc2VsZWN0LW1vZGUgLmJsYW5rLnJldHJ5Lmhhcy1wZW5kaW5nLWZlZWRiYWNrIGJ1dHRvbi5oNXAtbm90aWZpY2F0aW9uLFxcbi5oNXAtYWR2YW5jZWQtYmxhbmtzIC5oNXAtYWR2YW5jZWQtYmxhbmtzLXR5cGUtbW9kZSAuYmxhbmsucmV0cnkuaGFzLXBlbmRpbmctZmVlZGJhY2sgLmg1cC1pbnB1dC13cmFwcGVyOmJlZm9yZSB7XFxuICAgIGNvbG9yOiAjZmZmZjAwO1xcbiAgICB0ZXh0LXNoYWRvdzogMHB4IDBweCAwLjVlbSBibGFjaztcXG59XFxuXFxuQC13ZWJraXQta2V5ZnJhbWVzIHNoYWtlIHtcXG4gICAgMiUsXFxuICAgIDIwJSB7XFxuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZTNkKC0wLjVweCwgMCwgMCk7XFxuICAgIH1cXG4gICAgNCUsXFxuICAgIDE3JSB7XFxuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZTNkKDFweCwgMCwgMCk7XFxuICAgIH1cXG4gICAgNiUsXFxuICAgIDEwJSxcXG4gICAgMTUlIHtcXG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlM2QoLTJweCwgMCwgMCk7XFxuICAgIH1cXG4gICAgOSUsXFxuICAgIDEzJSB7XFxuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZTNkKDJweCwgMCwgMCk7XFxuICAgIH1cXG59XFxuXFxuQGtleWZyYW1lcyBzaGFrZSB7XFxuICAgIDIlLFxcbiAgICAyMCUge1xcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUzZCgtMC41cHgsIDAsIDApO1xcbiAgICB9XFxuICAgIDQlLFxcbiAgICAxNyUge1xcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUzZCgxcHgsIDAsIDApO1xcbiAgICB9XFxuICAgIDYlLFxcbiAgICAxMCUsXFxuICAgIDE1JSB7XFxuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZTNkKC0ycHgsIDAsIDApO1xcbiAgICB9XFxuICAgIDklLFxcbiAgICAxMyUge1xcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUzZCgycHgsIDAsIDApO1xcbiAgICB9XFxufVwiLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9zdHlsZXMvc3R5bGUuY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBO0lBQ0ksa0JBQWtCO0FBQ3RCOzs7QUFHQSxTQUFTOztBQUVUOztJQUVJLGtCQUFrQjtJQUNsQixlQUFlO0lBQ2YsbUJBQW1CO0FBQ3ZCOztBQUVBO0lBQ0k7O1FBRUksaUJBQWlCO0lBQ3JCO0FBQ0o7OztBQUdBLFVBQVU7O0FBRVY7SUFDSSxxQkFBcUI7SUFDckIsa0JBQWtCO0FBQ3RCOztBQUVBO0lBQ0kscUNBQXFDO0lBQ3JDLGNBQWM7SUFDZCxxQkFBcUI7SUFDckIseUJBQXlCO0lBQ3pCLHNDQUFzQztJQUN0Qyx1QkFBdUI7SUFDdkIsZ0JBQWdCO0FBQ3BCOztBQUVBO0VBQ0UsNkJBQTZCO0FBQy9COztBQUVBO0VBQ0UsNkJBQTZCO0FBQy9COztBQUVBLCtCQUErQjs7QUFFL0I7SUFDSSxhQUFhO0FBQ2pCOztBQUVBO0lBQ0ksZUFBZTtBQUNuQjs7O0FBR0EsZ0JBQWdCOztBQUVoQjtJQUNJLGtCQUFrQjtJQUNsQixxQkFBcUI7SUFDckIsMEJBQTBCO0FBQzlCOzs7QUFHQSwyQkFBMkI7O0FBRTNCO0lBQ0ksMEJBQTBCO0lBQzFCLGNBQWM7SUFDZCxtQkFBbUI7QUFDdkI7OztBQUdBLG1CQUFtQjs7QUFFbkI7SUFDSSxhQUFhO0lBQ2IsK0JBQStCO0lBQy9CLHFCQUFxQjtBQUN6Qjs7O0FBR0EsNkJBQTZCOztBQUU3QjtJQUNJLG1CQUFtQjtJQUNuQix5QkFBeUI7SUFDekIsY0FBYztBQUNsQjs7QUFFQTtJQUNJLGtCQUFrQjtJQUNsQixZQUFZO0lBQ1osUUFBUTtJQUNSLDJCQUEyQjtJQUMzQixxQkFBcUI7SUFDckIsZ0JBQWdCO0lBQ2hCLDhCQUE4QjtJQUM5QixjQUFjO0FBQ2xCOzs7QUFHQSxzQkFBc0I7O0FBRXRCO0lBQ0kseUJBQXlCO0lBQ3pCLHlCQUF5QjtJQUN6QixjQUFjO0lBQ2QsNkJBQTZCO0FBQ2pDOztBQUVBO0lBQ0ksa0JBQWtCO0lBQ2xCLFlBQVk7SUFDWixRQUFRO0lBQ1IsMkJBQTJCO0lBQzNCLDhCQUE4QjtJQUM5QixxQkFBcUI7SUFDckIsZ0JBQWdCO0lBQ2hCLGNBQWM7QUFDbEI7OztBQUdBLG9CQUFvQjs7QUFFcEI7SUFDSSx5QkFBeUI7SUFDekIseUJBQXlCO0lBQ3pCLFlBQVk7QUFDaEI7O0FBRUE7SUFDSSxrQkFBa0I7SUFDbEIsWUFBWTtJQUNaLFFBQVE7SUFDUiwyQkFBMkI7SUFDM0IsOEJBQThCO0lBQzlCLHFCQUFxQjtJQUNyQixnQkFBZ0I7SUFDaEIsY0FBYztBQUNsQjs7O0FBR0EsWUFBWTs7QUFFWjtJQUNJLGlCQUFpQjtJQUNqQixrQkFBa0I7SUFDbEIsWUFBWTtJQUNaLGdCQUFnQjtBQUNwQjs7O0FBR0EseUNBQXlDOztBQUV6Qzs7SUFFSSxVQUFVO0lBQ1YsaUJBQWlCO0lBQ2pCLGlDQUF5QjtZQUF6Qix5QkFBeUI7SUFDekIsbUNBQTJCO1lBQTNCLDJCQUEyQjtJQUMzQixxQ0FBNkI7WUFBN0IsNkJBQTZCO0lBQzdCLHNDQUE4QjtZQUE5Qiw4QkFBOEI7QUFDbEM7O0FBRUE7SUFDSTtRQUNJLGNBQWM7SUFDbEI7SUFDQTtRQUNJLFVBQVU7SUFDZDtBQUNKOztBQVBBO0lBQ0k7UUFDSSxjQUFjO0lBQ2xCO0lBQ0E7UUFDSSxVQUFVO0lBQ2Q7QUFDSjs7QUFFQTtJQUNJLDZCQUE2QjtBQUNqQzs7O0FBR0EsdUJBQXVCOztBQUV2QjtJQUNJLHNDQUFzQztJQUN0QyxjQUFjO0lBQ2QsY0FBYztJQUNkLGtDQUEwQjtZQUExQiwwQkFBMEI7SUFDMUIsOENBQXNDO1lBQXRDLHNDQUFzQztJQUN0QyxvQ0FBNEI7WUFBNUIsNEJBQTRCO0lBQzVCLHNDQUE4QjtZQUE5Qiw4QkFBOEI7QUFDbEM7O0FBRUE7SUFDSTtRQUNJLHlCQUF5QjtJQUM3QjtJQUNBO1FBQ0ksc0NBQXNDO0lBQzFDO0FBQ0o7O0FBUEE7SUFDSTtRQUNJLHlCQUF5QjtJQUM3QjtJQUNBO1FBQ0ksc0NBQXNDO0lBQzFDO0FBQ0o7OztBQUdBLFdBQVc7O0FBRVg7SUFDSSxvQkFBb0I7QUFDeEI7OztBQUdBLFNBQVM7O0FBRVQ7RUFDRSxrQkFBa0I7RUFDbEIsUUFBUTtFQUNSLDJCQUEyQjtFQUMzQixZQUFZO0VBQ1osY0FBYztBQUNoQjs7QUFFQTtJQUNJLHFCQUFxQjtBQUN6Qjs7QUFFQTs7O0lBR0ksYUFBYTtBQUNqQjs7QUFFQTs7O0lBR0ksb0JBQW9CO0FBQ3hCOztBQUVBLDJDQUEyQztBQUMzQztFQUNFLFlBQVk7RUFDWixhQUFhO0FBQ2Y7O0FBRUEsNEJBQTRCOztBQUU1QjtJQUNJLGFBQWE7QUFDakI7O0FBRUE7SUFDSSxnQkFBZ0I7QUFDcEI7O0FBRUE7O0lBRUksOEJBQThCO0lBQzlCLHFCQUFxQjtJQUNyQiw0REFBNEQ7SUFDNUQsb0NBQTRCO1lBQTVCLDRCQUE0QjtJQUM1QiwrQkFBK0I7SUFDL0IsbUNBQTJCO1lBQTNCLDJCQUEyQjtJQUMzQixtQkFBbUI7QUFDdkI7O0FBRUE7SUFDSSxrQkFBa0I7SUFDbEIsWUFBWTtJQUNaLFdBQVc7SUFDWCxnQkFBZ0I7QUFDcEI7O0FBRUE7O0lBRUksY0FBYztBQUNsQjs7QUFFQTs7SUFFSSxjQUFjO0lBQ2QsZ0NBQWdDO0FBQ3BDOztBQUVBO0lBQ0k7O1FBRUksb0NBQW9DO0lBQ3hDO0lBQ0E7O1FBRUksaUNBQWlDO0lBQ3JDO0lBQ0E7OztRQUdJLGtDQUFrQztJQUN0QztJQUNBOztRQUVJLGlDQUFpQztJQUNyQztBQUNKOztBQWxCQTtJQUNJOztRQUVJLG9DQUFvQztJQUN4QztJQUNBOztRQUVJLGlDQUFpQztJQUNyQztJQUNBOzs7UUFHSSxrQ0FBa0M7SUFDdEM7SUFDQTs7UUFFSSxpQ0FBaUM7SUFDckM7QUFDSlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIuaDVwLWFkdmFuY2VkLWJsYW5rcyB7XFxuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG59XFxuXFxuXFxuLyogVGV4dCAqL1xcblxcbi5oNXAtYWR2YW5jZWQtYmxhbmtzICNoNXAtY2xvemUtY29udGFpbmVyIHAsXFxuLmg1cC1hZHZhbmNlZC1ibGFua3MgI2g1cC1jbG96ZS1jb250YWluZXIgZGl2IHtcXG4gICAgbGluZS1oZWlnaHQ6IDEuOGVtO1xcbiAgICBtYXJnaW46IDAgMCAxZW07XFxuICAgIHRleHQtYWxpZ246IGp1c3RpZnk7XFxufVxcblxcbkBtZWRpYSBvbmx5IHNjcmVlbiBhbmQgKG1pbi13aWR0aDogNDgwcHgpIHtcXG4gICAgLmg1cC1hZHZhbmNlZC1ibGFua3MgI2g1cC1jbG96ZS1jb250YWluZXIgcCxcXG4gICAgLmg1cC1hZHZhbmNlZC1ibGFua3MgI2g1cC1jbG96ZS1jb250YWluZXIgZGl2IHtcXG4gICAgICAgIHRleHQtYWxpZ246IHVuc2V0O1xcbiAgICB9XFxufVxcblxcblxcbi8qIElucHV0ICovXFxuXFxuLmg1cC1hZHZhbmNlZC1ibGFua3MgLmg1cC1pbnB1dC13cmFwcGVyIHtcXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XFxufVxcblxcbi5oNXAtYWR2YW5jZWQtYmxhbmtzIC5ibGFuayAuaDVwLXRleHQtaW5wdXQge1xcbiAgICBmb250LWZhbWlseTogSDVQRHJvaWRTYW5zLCBzYW5zLXNlcmlmO1xcbiAgICBmb250LXNpemU6IDFlbTtcXG4gICAgYm9yZGVyLXJhZGl1czogMC4yNWVtO1xcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjYTBhMGEwO1xcbiAgICBwYWRkaW5nOiAwLjE4NzVlbSAxLjVlbSAwLjE4NzVlbSAwLjVlbTtcXG4gICAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XFxuICAgIG92ZXJmbG93OiBoaWRkZW47XFxufVxcblxcbi5oNXAtYWR2YW5jZWQtYmxhbmtzIC5ibGFuayBpbnB1dC5oNXAtdGV4dC1pbnB1dCB7XFxuICBtYXgtd2lkdGg6IGNhbGMoMTAwdncgLSA2NHB4KTtcXG59XFxuXFxuLmg1cC1hZHZhbmNlZC1ibGFua3MgLmJsYW5rIHNlbGVjdC5oNXAtdGV4dC1pbnB1dCB7XFxuICBtYXgtd2lkdGg6IGNhbGMoMTAwdncgLSAzNnB4KTtcXG59XFxuXFxuLyogSUUgKyBDaHJvbWUgc3BlY2lmaWMgZml4ZXMgKi9cXG5cXG4uaDVwLXRleHQtaW5wdXQ6Oi1tcy1jbGVhciB7XFxuICAgIGRpc3BsYXk6IG5vbmU7XFxufVxcblxcbjpub3QoLmNvcnJlY3QpLmJsYW5rLmhhcy10aXAgYnV0dG9uIHtcXG4gICAgY3Vyc29yOiBwb2ludGVyO1xcbn1cXG5cXG5cXG4vKiBTZWxlY3QgbW9kZSAqL1xcblxcbnNlbGVjdC5oNXAtdGV4dC1pbnB1dCB7XFxuICAgIGFwcGVhcmFuY2U6IGJ1dHRvbjtcXG4gICAgLW1vei1hcHBlYXJhbmNlOiBub25lO1xcbiAgICAtd2Via2l0LWFwcGVhcmFuY2U6IGJ1dHRvbjtcXG59XFxuXFxuXFxuLyogU2hvd2luZyBzb2x1dGlvbiBpbnB1dCAqL1xcblxcbi5oNXAtYWR2YW5jZWQtYmxhbmtzIC5ibGFuay5zaG93aW5nLXNvbHV0aW9uIC5oNXAtdGV4dC1pbnB1dCB7XFxuICAgIGJvcmRlcjogMXB4IGRhc2hlZCAjOWRkOGJiO1xcbiAgICBjb2xvcjogIzI1NWM0MTtcXG4gICAgYmFja2dyb3VuZDogI0ZGRkZGRjtcXG59XFxuXFxuXFxuLyogRm9jdXNzZWQgaW5wdXQgKi9cXG5cXG4uaDVwLWFkdmFuY2VkLWJsYW5rcyAuYmxhbmsgLmg1cC10ZXh0LWlucHV0OmZvY3VzIHtcXG4gICAgb3V0bGluZTogbm9uZTtcXG4gICAgYm94LXNoYWRvdzogMCAwIDAuNWVtIDAgIzdmYjhmZjtcXG4gICAgYm9yZGVyLWNvbG9yOiAjN2ZiOGZmO1xcbn1cXG5cXG5cXG4vKiBDb3JyZWN0bHkgYW5zd2VyZWQgaW5wdXQgKi9cXG5cXG4uaDVwLWFkdmFuY2VkLWJsYW5rcyAuYmxhbmsuY29ycmVjdCAuaDVwLXRleHQtaW5wdXQge1xcbiAgICBiYWNrZ3JvdW5kOiAjOWRkOGJiO1xcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjOWRkOGJiO1xcbiAgICBjb2xvcjogIzI1NWM0MTtcXG59XFxuXFxuLmg1cC1hZHZhbmNlZC1ibGFua3MgLmJsYW5rLmNvcnJlY3QgLmg1cC1pbnB1dC13cmFwcGVyOmFmdGVyIHtcXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgICByaWdodDogMC41ZW07ICAgIFxcbiAgICB0b3A6IDUwJTtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC01MCUpO1xcbiAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxuICAgIGNvbnRlbnQ6IFxcXCJcXFxcZjAwY1xcXCI7XFxuICAgIGZvbnQtZmFtaWx5OiAnSDVQRm9udEF3ZXNvbWU0JztcXG4gICAgY29sb3I6ICMyNTVjNDE7XFxufVxcblxcblxcbi8qIEluY29ycmVjdCBhbnN3ZXJzICovXFxuXFxuLmg1cC1hZHZhbmNlZC1ibGFua3MgLmJsYW5rLmVycm9yIC5oNXAtdGV4dC1pbnB1dCB7XFxuICAgIGJhY2tncm91bmQtY29sb3I6ICNmN2QwZDA7XFxuICAgIGJvcmRlcjogMXB4IHNvbGlkICNmN2QwZDA7XFxuICAgIGNvbG9yOiAjYjcxYzFjO1xcbiAgICB0ZXh0LWRlY29yYXRpb246IGxpbmUtdGhyb3VnaDtcXG59XFxuXFxuLmg1cC1hZHZhbmNlZC1ibGFua3MgLmJsYW5rLmVycm9yIC5oNXAtaW5wdXQtd3JhcHBlcjphZnRlciB7XFxuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gICAgcmlnaHQ6IDAuNWVtO1xcbiAgICB0b3A6IDUwJTtcXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC01MCUpO1xcbiAgICBmb250LWZhbWlseTogJ0g1UEZvbnRBd2Vzb21lNCc7XFxuICAgIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXG4gICAgY29udGVudDogXFxcIlxcXFxmMDBkXFxcIjtcXG4gICAgY29sb3I6ICNiNzFjMWM7XFxufVxcblxcblxcbi8qIFNwZWxsaW5nIGVycm9ycyAqL1xcblxcbi5oNXAtYWR2YW5jZWQtYmxhbmtzIC5ibGFuay5yZXRyeSAuaDVwLXRleHQtaW5wdXQge1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiAjZmZmZjk5O1xcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjZmZmZjk5O1xcbiAgICBjb2xvcjogYmxhY2s7XFxufVxcblxcbi5oNXAtYWR2YW5jZWQtYmxhbmtzIC5ibGFuay5yZXRyeSAuaDVwLWlucHV0LXdyYXBwZXI6YWZ0ZXIge1xcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICAgIHJpZ2h0OiAwLjVlbTtcXG4gICAgdG9wOiA1MCU7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNTAlKTtcXG4gICAgZm9udC1mYW1pbHk6ICdINVBGb250QXdlc29tZTQnO1xcbiAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxuICAgIGNvbnRlbnQ6IFxcXCJcXFxcZjAwZFxcXCI7XFxuICAgIGNvbG9yOiAjYjcxYzFjO1xcbn1cXG5cXG5cXG4vKiBCdXR0b25zICovXFxuXFxuLmg1cC1hZHZhbmNlZC1ibGFua3MgLmJsYW5rIGJ1dHRvbiB7XFxuICAgIHBhZGRpbmctbGVmdDogNXB4O1xcbiAgICBwYWRkaW5nLXJpZ2h0OiA1cHg7XFxuICAgIGJvcmRlcjogbm9uZTtcXG4gICAgYmFja2dyb3VuZDogbm9uZTtcXG59XFxuXFxuXFxuLyogSGlnaGxpZ2h0IGluIHNwZWxsaW5nIG1pc3Rha2UgbWFya2VyICovXFxuXFxuLnNwZWxsaW5nLW1pc3Rha2UgLm1pc3NpbmctY2hhcmFjdGVyLFxcbi5zcGVsbGluZy1taXN0YWtlIC5taXN0YWtlbi1jaGFyYWN0ZXIge1xcbiAgICBjb2xvcjogcmVkO1xcbiAgICBmb250LXdlaWdodDogYm9sZDtcXG4gICAgYW5pbWF0aW9uLWR1cmF0aW9uOiA1MDBtcztcXG4gICAgYW5pbWF0aW9uLW5hbWU6IGJsaW5rLWNvbG9yO1xcbiAgICBhbmltYXRpb24taXRlcmF0aW9uLWNvdW50OiAxMztcXG4gICAgYW5pbWF0aW9uLWRpcmVjdGlvbjogYWx0ZXJuYXRlO1xcbn1cXG5cXG5Aa2V5ZnJhbWVzIGJsaW5rLWNvbG9yIHtcXG4gICAgZnJvbSB7XFxuICAgICAgICBjb2xvcjogaW5pdGlhbDtcXG4gICAgfVxcbiAgICB0byB7XFxuICAgICAgICBjb2xvcjogcmVkO1xcbiAgICB9XFxufVxcblxcbi5zcGVsbGluZy1taXN0YWtlIC5taXN0YWtlbi1jaGFyYWN0ZXIge1xcbiAgICB0ZXh0LWRlY29yYXRpb246IGxpbmUtdGhyb3VnaDtcXG59XFxuXFxuXFxuLyogSGlnaGxpZ2h0cyBpbiB0ZXh0ICovXFxuXFxuLmg1cC1hZHZhbmNlZC1ibGFua3MgLmhpZ2hsaWdodGVkIHtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDAsIDAsIDAuMik7XFxuICAgIHBhZGRpbmc6IDAuNGVtO1xcbiAgICBtYXJnaW46IC0wLjRlbTtcXG4gICAgYW5pbWF0aW9uLWR1cmF0aW9uOiAxMDAwbXM7XFxuICAgIGFuaW1hdGlvbi1uYW1lOiBibGluay1iYWNrZ3JvdW5kLWNvbG9yO1xcbiAgICBhbmltYXRpb24taXRlcmF0aW9uLWNvdW50OiAzO1xcbiAgICBhbmltYXRpb24tZGlyZWN0aW9uOiBhbHRlcm5hdGU7XFxufVxcblxcbkBrZXlmcmFtZXMgYmxpbmstYmFja2dyb3VuZC1jb2xvciB7XFxuICAgIGZyb20ge1xcbiAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogaW5pdGlhbDtcXG4gICAgfVxcbiAgICB0byB7XFxuICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMCwgMCwgMC4yKTtcXG4gICAgfVxcbn1cXG5cXG5cXG4vKiBPdGhlcnMgKi9cXG5cXG4uaDVwLWFkdmFuY2VkLWJsYW5rcyAuaW52aXNpYmxlIHtcXG4gICAgdmlzaWJpbGl0eTogY29sbGFwc2U7XFxufVxcblxcblxcbi8qIFRpcHMgKi9cXG5cXG4uaDVwLWFkdmFuY2VkLWJsYW5rcyAuaDVwLXRpcC1jb250YWluZXIge1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgdG9wOiA1MCU7XFxuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTUwJSk7XFxuICByaWdodDogMC40ZW07XFxuICBmb250LXNpemU6IDFlbTtcXG59XFxuXFxuLmg1cC1hZHZhbmNlZC1ibGFua3MgLmJsYW5rLmhhcy10aXA6bm90KC5jb3JyZWN0KTpub3QoLmVycm9yKTpub3QoLnJldHJ5KSAuaDVwLXRleHQtaW5wdXQge1xcbiAgICBwYWRkaW5nLXJpZ2h0OiAyLjI1ZW07XFxufVxcblxcbi5oNXAtYWR2YW5jZWQtYmxhbmtzIC5ibGFuay5oYXMtdGlwLmNvcnJlY3QgLmg1cC1pbnB1dC13cmFwcGVyOmFmdGVyLFxcbi5oNXAtYWR2YW5jZWQtYmxhbmtzIC5ibGFuay5oYXMtdGlwLmVycm9yIC5oNXAtaW5wdXQtd3JhcHBlcjphZnRlcixcXG4uaDVwLWFkdmFuY2VkLWJsYW5rcyAuYmxhbmsuaGFzLXRpcC5yZXRyeSAuaDVwLWlucHV0LXdyYXBwZXI6YWZ0ZXIge1xcbiAgICByaWdodDogMi4yNWVtO1xcbn1cXG5cXG4uaDVwLWFkdmFuY2VkLWJsYW5rcyAuYmxhbmsuY29ycmVjdC5oYXMtdGlwIC5oNXAtdGV4dC1pbnB1dCxcXG4uaDVwLWFkdmFuY2VkLWJsYW5rcyAuYmxhbmsuZXJyb3IuaGFzLXRpcCAuaDVwLXRleHQtaW5wdXQsXFxuLmg1cC1hZHZhbmNlZC1ibGFua3MgLmJsYW5rLnJldHJ5Lmhhcy10aXAgLmg1cC10ZXh0LWlucHV0IHtcXG4gICAgcGFkZGluZy1yaWdodDogMy41ZW07XFxufVxcblxcbi8qIGltcHJvdmVzIGFwcGVhcmFuY2Ugb2YgaDVwIHRpcCBzaGFkb3dzICovXFxuLmg1cC1hZHZhbmNlZC1ibGFua3MgLmpvdWJlbC1pY29uLXRpcC1ub3JtYWwgLmg1cC1pY29uLXNoYWRvdzpiZWZvcmUge1xcbiAgY29sb3I6IGJsYWNrO1xcbiAgb3BhY2l0eTogMC4xMztcXG59XFxuXFxuLyogcGVuZGluZyBmZWVkYmFjayBtYXJrZXIgKi9cXG5cXG4uaDVwLWFkdmFuY2VkLWJsYW5rcyAuaDVwLWFkdmFuY2VkLWJsYW5rcy1zZWxlY3QtbW9kZSAuYmxhbms6bm90KC5oYXMtcGVuZGluZy1mZWVkYmFjaykgYnV0dG9uLmg1cC1ub3RpZmljYXRpb24ge1xcbiAgICBkaXNwbGF5OiBub25lO1xcbn1cXG5cXG4uaDVwLWFkdmFuY2VkLWJsYW5rcyAuaDVwLWFkdmFuY2VkLWJsYW5rcy1zZWxlY3QtbW9kZSAuYmxhbmsuaGFzLXBlbmRpbmctZmVlZGJhY2sgYnV0dG9uLmg1cC1ub3RpZmljYXRpb24ge1xcbiAgICBmb250LXNpemU6IGxhcmdlOyAgICBcXG59XFxuXFxuLmg1cC1hZHZhbmNlZC1ibGFua3MgLmg1cC1hZHZhbmNlZC1ibGFua3Mtc2VsZWN0LW1vZGUgLmJsYW5rLmhhcy1wZW5kaW5nLWZlZWRiYWNrIGJ1dHRvbi5oNXAtbm90aWZpY2F0aW9uLFxcbi5oNXAtYWR2YW5jZWQtYmxhbmtzIC5oNXAtYWR2YW5jZWQtYmxhbmtzLXR5cGUtbW9kZSAuYmxhbmsuaGFzLXBlbmRpbmctZmVlZGJhY2sgLmg1cC1pbnB1dC13cmFwcGVyOmJlZm9yZSB7XFxuICAgIGZvbnQtZmFtaWx5OiAnSDVQRm9udEF3ZXNvbWU0JztcXG4gICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcbiAgICBhbmltYXRpb246IHNoYWtlIDNzIGN1YmljLWJlemllciguMzYsIC4wNywgLjE5LCAuOTcpIHJldmVyc2U7XFxuICAgIGFuaW1hdGlvbi1pdGVyYXRpb24tY291bnQ6IDI7XFxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlM2QoMCwgMCwgMCk7XFxuICAgIGJhY2tmYWNlLXZpc2liaWxpdHk6IGhpZGRlbjtcXG4gICAgcGVyc3BlY3RpdmU6IDEwMDBweDtcXG59XFxuXFxuLmg1cC1hZHZhbmNlZC1ibGFua3MgLmg1cC1hZHZhbmNlZC1ibGFua3MtdHlwZS1tb2RlIC5ibGFuay5oYXMtcGVuZGluZy1mZWVkYmFjayAuaDVwLWlucHV0LXdyYXBwZXI6YmVmb3JlIHtcXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgICBsZWZ0OiAtMC40ZW07XFxuICAgIHRvcDogLTAuN2VtO1xcbiAgICBjb250ZW50OiBcXFwiXFxcXGYwNWFcXFwiO1xcbn1cXG5cXG4uaDVwLWFkdmFuY2VkLWJsYW5rcyAuaDVwLWFkdmFuY2VkLWJsYW5rcy1zZWxlY3QtbW9kZSAuYmxhbmsuZXJyb3IuaGFzLXBlbmRpbmctZmVlZGJhY2sgYnV0dG9uLmg1cC1ub3RpZmljYXRpb24sXFxuLmg1cC1hZHZhbmNlZC1ibGFua3MgLmg1cC1hZHZhbmNlZC1ibGFua3MtdHlwZS1tb2RlIC5ibGFuay5lcnJvci5oYXMtcGVuZGluZy1mZWVkYmFjayAuaDVwLWlucHV0LXdyYXBwZXI6YmVmb3JlIHtcXG4gICAgY29sb3I6ICNiNzFjMWM7XFxufVxcblxcbi5oNXAtYWR2YW5jZWQtYmxhbmtzIC5oNXAtYWR2YW5jZWQtYmxhbmtzLXNlbGVjdC1tb2RlIC5ibGFuay5yZXRyeS5oYXMtcGVuZGluZy1mZWVkYmFjayBidXR0b24uaDVwLW5vdGlmaWNhdGlvbixcXG4uaDVwLWFkdmFuY2VkLWJsYW5rcyAuaDVwLWFkdmFuY2VkLWJsYW5rcy10eXBlLW1vZGUgLmJsYW5rLnJldHJ5Lmhhcy1wZW5kaW5nLWZlZWRiYWNrIC5oNXAtaW5wdXQtd3JhcHBlcjpiZWZvcmUge1xcbiAgICBjb2xvcjogI2ZmZmYwMDtcXG4gICAgdGV4dC1zaGFkb3c6IDBweCAwcHggMC41ZW0gYmxhY2s7XFxufVxcblxcbkBrZXlmcmFtZXMgc2hha2Uge1xcbiAgICAyJSxcXG4gICAgMjAlIHtcXG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlM2QoLTAuNXB4LCAwLCAwKTtcXG4gICAgfVxcbiAgICA0JSxcXG4gICAgMTclIHtcXG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlM2QoMXB4LCAwLCAwKTtcXG4gICAgfVxcbiAgICA2JSxcXG4gICAgMTAlLFxcbiAgICAxNSUge1xcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGUzZCgtMnB4LCAwLCAwKTtcXG4gICAgfVxcbiAgICA5JSxcXG4gICAgMTMlIHtcXG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlM2QoMnB4LCAwLCAwKTtcXG4gICAgfVxcbn1cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gIEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKSB7XG4gIHZhciBsaXN0ID0gW107XG5cbiAgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuICBsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICB2YXIgY29udGVudCA9IFwiXCI7XG4gICAgICB2YXIgbmVlZExheWVyID0gdHlwZW9mIGl0ZW1bNV0gIT09IFwidW5kZWZpbmVkXCI7XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBjb250ZW50ICs9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSk7XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pLmpvaW4oXCJcIik7XG4gIH07XG5cbiAgLy8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcbiAgbGlzdC5pID0gZnVuY3Rpb24gaShtb2R1bGVzLCBtZWRpYSwgZGVkdXBlLCBzdXBwb3J0cywgbGF5ZXIpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIHVuZGVmaW5lZF1dO1xuICAgIH1cbiAgICB2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuICAgIGlmIChkZWR1cGUpIHtcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGhpcy5sZW5ndGg7IGsrKykge1xuICAgICAgICB2YXIgaWQgPSB0aGlzW2tdWzBdO1xuICAgICAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgICAgIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBfayA9IDA7IF9rIDwgbW9kdWxlcy5sZW5ndGg7IF9rKyspIHtcbiAgICAgIHZhciBpdGVtID0gW10uY29uY2F0KG1vZHVsZXNbX2tdKTtcbiAgICAgIGlmIChkZWR1cGUgJiYgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgbGF5ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtWzVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobWVkaWEpIHtcbiAgICAgICAgaWYgKCFpdGVtWzJdKSB7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHN1cHBvcnRzKSB7XG4gICAgICAgIGlmICghaXRlbVs0XSkge1xuICAgICAgICAgIGl0ZW1bNF0gPSBcIlwiLmNvbmNhdChzdXBwb3J0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzRdID0gc3VwcG9ydHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxpc3QucHVzaChpdGVtKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBsaXN0O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY3NzTWFwcGluZykpKSk7XG4gICAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbihcIlxcblwiKTtcbiAgfVxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsIi8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cblwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5jb252ZXJ0Q2hhbmdlc1RvRE1QID0gY29udmVydENoYW5nZXNUb0RNUDtcblxuLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbi8vIFNlZTogaHR0cDovL2NvZGUuZ29vZ2xlLmNvbS9wL2dvb2dsZS1kaWZmLW1hdGNoLXBhdGNoL3dpa2kvQVBJXG5mdW5jdGlvbiBjb252ZXJ0Q2hhbmdlc1RvRE1QKGNoYW5nZXMpIHtcbiAgdmFyIHJldCA9IFtdLFxuICAgICAgY2hhbmdlLFxuICAgICAgb3BlcmF0aW9uO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgY2hhbmdlcy5sZW5ndGg7IGkrKykge1xuICAgIGNoYW5nZSA9IGNoYW5nZXNbaV07XG5cbiAgICBpZiAoY2hhbmdlLmFkZGVkKSB7XG4gICAgICBvcGVyYXRpb24gPSAxO1xuICAgIH0gZWxzZSBpZiAoY2hhbmdlLnJlbW92ZWQpIHtcbiAgICAgIG9wZXJhdGlvbiA9IC0xO1xuICAgIH0gZWxzZSB7XG4gICAgICBvcGVyYXRpb24gPSAwO1xuICAgIH1cblxuICAgIHJldC5wdXNoKFtvcGVyYXRpb24sIGNoYW5nZS52YWx1ZV0pO1xuICB9XG5cbiAgcmV0dXJuIHJldDtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OWpiMjUyWlhKMEwyUnRjQzVxY3lKZExDSnVZVzFsY3lJNld5SmpiMjUyWlhKMFEyaGhibWRsYzFSdlJFMVFJaXdpWTJoaGJtZGxjeUlzSW5KbGRDSXNJbU5vWVc1blpTSXNJbTl3WlhKaGRHbHZiaUlzSW1raUxDSnNaVzVuZEdnaUxDSmhaR1JsWkNJc0luSmxiVzkyWldRaUxDSndkWE5vSWl3aWRtRnNkV1VpWFN3aWJXRndjR2x1WjNNaU9pSTdPenM3T3pzN096dEJRVUZCTzBGQlEwOHNVMEZCVTBFc2JVSkJRVlFzUTBGQk5rSkRMRTlCUVRkQ0xFVkJRWE5ETzBGQlF6TkRMRTFCUVVsRExFZEJRVWNzUjBGQlJ5eEZRVUZXTzBGQlFVRXNUVUZEU1VNc1RVRkVTanRCUVVGQkxFMUJSVWxETEZOQlJrbzdPMEZCUjBFc1QwRkJTeXhKUVVGSlF5eERRVUZETEVkQlFVY3NRMEZCWWl4RlFVRm5Ra0VzUTBGQlF5eEhRVUZIU2l4UFFVRlBMRU5CUVVOTExFMUJRVFZDTEVWQlFXOURSQ3hEUVVGRExFVkJRWEpETEVWQlFYbERPMEZCUTNaRFJpeEpRVUZCUVN4TlFVRk5MRWRCUVVkR0xFOUJRVThzUTBGQlEwa3NRMEZCUkN4RFFVRm9RanM3UVVGRFFTeFJRVUZKUml4TlFVRk5MRU5CUVVOSkxFdEJRVmdzUlVGQmEwSTdRVUZEYUVKSUxFMUJRVUZCTEZOQlFWTXNSMEZCUnl4RFFVRmFPMEZCUTBRc1MwRkdSQ3hOUVVWUExFbEJRVWxFTEUxQlFVMHNRMEZCUTBzc1QwRkJXQ3hGUVVGdlFqdEJRVU42UWtvc1RVRkJRVUVzVTBGQlV5eEhRVUZITEVOQlFVTXNRMEZCWWp0QlFVTkVMRXRCUmswc1RVRkZRVHRCUVVOTVFTeE5RVUZCUVN4VFFVRlRMRWRCUVVjc1EwRkJXanRCUVVORU96dEJRVVZFUml4SlFVRkJRU3hIUVVGSExFTkJRVU5QTEVsQlFVb3NRMEZCVXl4RFFVRkRUQ3hUUVVGRUxFVkJRVmxFTEUxQlFVMHNRMEZCUTA4c1MwRkJia0lzUTBGQlZEdEJRVU5FT3p0QlFVTkVMRk5CUVU5U0xFZEJRVkE3UVVGRFJDSXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJaTh2SUZObFpUb2dhSFIwY0RvdkwyTnZaR1V1WjI5dloyeGxMbU52YlM5d0wyZHZiMmRzWlMxa2FXWm1MVzFoZEdOb0xYQmhkR05vTDNkcGEya3ZRVkJKWEc1bGVIQnZjblFnWm5WdVkzUnBiMjRnWTI5dWRtVnlkRU5vWVc1blpYTlViMFJOVUNoamFHRnVaMlZ6S1NCN1hHNGdJR3hsZENCeVpYUWdQU0JiWFN4Y2JpQWdJQ0FnSUdOb1lXNW5aU3hjYmlBZ0lDQWdJRzl3WlhKaGRHbHZianRjYmlBZ1ptOXlJQ2hzWlhRZ2FTQTlJREE3SUdrZ1BDQmphR0Z1WjJWekxteGxibWQwYURzZ2FTc3JLU0I3WEc0Z0lDQWdZMmhoYm1kbElEMGdZMmhoYm1kbGMxdHBYVHRjYmlBZ0lDQnBaaUFvWTJoaGJtZGxMbUZrWkdWa0tTQjdYRzRnSUNBZ0lDQnZjR1Z5WVhScGIyNGdQU0F4TzF4dUlDQWdJSDBnWld4elpTQnBaaUFvWTJoaGJtZGxMbkpsYlc5MlpXUXBJSHRjYmlBZ0lDQWdJRzl3WlhKaGRHbHZiaUE5SUMweE8xeHVJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0J2Y0dWeVlYUnBiMjRnUFNBd08xeHVJQ0FnSUgxY2JseHVJQ0FnSUhKbGRDNXdkWE5vS0Z0dmNHVnlZWFJwYjI0c0lHTm9ZVzVuWlM1MllXeDFaVjBwTzF4dUlDQjlYRzRnSUhKbGRIVnliaUJ5WlhRN1hHNTlYRzRpWFgwPVxuIiwiLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmNvbnZlcnRDaGFuZ2VzVG9YTUwgPSBjb252ZXJ0Q2hhbmdlc1RvWE1MO1xuXG4vKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuZnVuY3Rpb24gY29udmVydENoYW5nZXNUb1hNTChjaGFuZ2VzKSB7XG4gIHZhciByZXQgPSBbXTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGNoYW5nZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgY2hhbmdlID0gY2hhbmdlc1tpXTtcblxuICAgIGlmIChjaGFuZ2UuYWRkZWQpIHtcbiAgICAgIHJldC5wdXNoKCc8aW5zPicpO1xuICAgIH0gZWxzZSBpZiAoY2hhbmdlLnJlbW92ZWQpIHtcbiAgICAgIHJldC5wdXNoKCc8ZGVsPicpO1xuICAgIH1cblxuICAgIHJldC5wdXNoKGVzY2FwZUhUTUwoY2hhbmdlLnZhbHVlKSk7XG5cbiAgICBpZiAoY2hhbmdlLmFkZGVkKSB7XG4gICAgICByZXQucHVzaCgnPC9pbnM+Jyk7XG4gICAgfSBlbHNlIGlmIChjaGFuZ2UucmVtb3ZlZCkge1xuICAgICAgcmV0LnB1c2goJzwvZGVsPicpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXQuam9pbignJyk7XG59XG5cbmZ1bmN0aW9uIGVzY2FwZUhUTUwocykge1xuICB2YXIgbiA9IHM7XG4gIG4gPSBuLnJlcGxhY2UoLyYvZywgJyZhbXA7Jyk7XG4gIG4gPSBuLnJlcGxhY2UoLzwvZywgJyZsdDsnKTtcbiAgbiA9IG4ucmVwbGFjZSgvPi9nLCAnJmd0OycpO1xuICBuID0gbi5yZXBsYWNlKC9cIi9nLCAnJnF1b3Q7Jyk7XG4gIHJldHVybiBuO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5amIyNTJaWEowTDNodGJDNXFjeUpkTENKdVlXMWxjeUk2V3lKamIyNTJaWEowUTJoaGJtZGxjMVJ2V0UxTUlpd2lZMmhoYm1kbGN5SXNJbkpsZENJc0lta2lMQ0pzWlc1bmRHZ2lMQ0pqYUdGdVoyVWlMQ0poWkdSbFpDSXNJbkIxYzJnaUxDSnlaVzF2ZG1Wa0lpd2laWE5qWVhCbFNGUk5UQ0lzSW5aaGJIVmxJaXdpYW05cGJpSXNJbk1pTENKdUlpd2ljbVZ3YkdGalpTSmRMQ0p0WVhCd2FXNW5jeUk2SWpzN096czdPenM3TzBGQlFVOHNVMEZCVTBFc2JVSkJRVlFzUTBGQk5rSkRMRTlCUVRkQ0xFVkJRWE5ETzBGQlF6TkRMRTFCUVVsRExFZEJRVWNzUjBGQlJ5eEZRVUZXT3p0QlFVTkJMRTlCUVVzc1NVRkJTVU1zUTBGQlF5eEhRVUZITEVOQlFXSXNSVUZCWjBKQkxFTkJRVU1zUjBGQlIwWXNUMEZCVHl4RFFVRkRSeXhOUVVFMVFpeEZRVUZ2UTBRc1EwRkJReXhGUVVGeVF5eEZRVUY1UXp0QlFVTjJReXhSUVVGSlJTeE5RVUZOTEVkQlFVZEtMRTlCUVU4c1EwRkJRMFVzUTBGQlJDeERRVUZ3UWpzN1FVRkRRU3hSUVVGSlJTeE5RVUZOTEVOQlFVTkRMRXRCUVZnc1JVRkJhMEk3UVVGRGFFSktMRTFCUVVGQkxFZEJRVWNzUTBGQlEwc3NTVUZCU2l4RFFVRlRMRTlCUVZRN1FVRkRSQ3hMUVVaRUxFMUJSVThzU1VGQlNVWXNUVUZCVFN4RFFVRkRSeXhQUVVGWUxFVkJRVzlDTzBGQlEzcENUaXhOUVVGQlFTeEhRVUZITEVOQlFVTkxMRWxCUVVvc1EwRkJVeXhQUVVGVU8wRkJRMFE3TzBGQlJVUk1MRWxCUVVGQkxFZEJRVWNzUTBGQlEwc3NTVUZCU2l4RFFVRlRSU3hWUVVGVkxFTkJRVU5LTEUxQlFVMHNRMEZCUTBzc1MwRkJVaXhEUVVGdVFqczdRVUZGUVN4UlFVRkpUQ3hOUVVGTkxFTkJRVU5ETEV0QlFWZ3NSVUZCYTBJN1FVRkRhRUpLTEUxQlFVRkJMRWRCUVVjc1EwRkJRMHNzU1VGQlNpeERRVUZUTEZGQlFWUTdRVUZEUkN4TFFVWkVMRTFCUlU4c1NVRkJTVVlzVFVGQlRTeERRVUZEUnl4UFFVRllMRVZCUVc5Q08wRkJRM3BDVGl4TlFVRkJRU3hIUVVGSExFTkJRVU5MTEVsQlFVb3NRMEZCVXl4UlFVRlVPMEZCUTBRN1FVRkRSanM3UVVGRFJDeFRRVUZQVEN4SFFVRkhMRU5CUVVOVExFbEJRVW9zUTBGQlV5eEZRVUZVTEVOQlFWQTdRVUZEUkRzN1FVRkZSQ3hUUVVGVFJpeFZRVUZVTEVOQlFXOUNSeXhEUVVGd1FpeEZRVUYxUWp0QlFVTnlRaXhOUVVGSlF5eERRVUZETEVkQlFVZEVMRU5CUVZJN1FVRkRRVU1zUlVGQlFVRXNRMEZCUXl4SFFVRkhRU3hEUVVGRExFTkJRVU5ETEU5QlFVWXNRMEZCVlN4SlFVRldMRVZCUVdkQ0xFOUJRV2hDTEVOQlFVbzdRVUZEUVVRc1JVRkJRVUVzUTBGQlF5eEhRVUZIUVN4RFFVRkRMRU5CUVVORExFOUJRVVlzUTBGQlZTeEpRVUZXTEVWQlFXZENMRTFCUVdoQ0xFTkJRVW83UVVGRFFVUXNSVUZCUVVFc1EwRkJReXhIUVVGSFFTeERRVUZETEVOQlFVTkRMRTlCUVVZc1EwRkJWU3hKUVVGV0xFVkJRV2RDTEUxQlFXaENMRU5CUVVvN1FVRkRRVVFzUlVGQlFVRXNRMEZCUXl4SFFVRkhRU3hEUVVGRExFTkJRVU5ETEU5QlFVWXNRMEZCVlN4SlFVRldMRVZCUVdkQ0xGRkJRV2hDTEVOQlFVbzdRVUZGUVN4VFFVRlBSQ3hEUVVGUU8wRkJRMFFpTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lKbGVIQnZjblFnWm5WdVkzUnBiMjRnWTI5dWRtVnlkRU5vWVc1blpYTlViMWhOVENoamFHRnVaMlZ6S1NCN1hHNGdJR3hsZENCeVpYUWdQU0JiWFR0Y2JpQWdabTl5SUNoc1pYUWdhU0E5SURBN0lHa2dQQ0JqYUdGdVoyVnpMbXhsYm1kMGFEc2dhU3NyS1NCN1hHNGdJQ0FnYkdWMElHTm9ZVzVuWlNBOUlHTm9ZVzVuWlhOYmFWMDdYRzRnSUNBZ2FXWWdLR05vWVc1blpTNWhaR1JsWkNrZ2UxeHVJQ0FnSUNBZ2NtVjBMbkIxYzJnb0p6eHBibk0rSnlrN1hHNGdJQ0FnZlNCbGJITmxJR2xtSUNoamFHRnVaMlV1Y21WdGIzWmxaQ2tnZTF4dUlDQWdJQ0FnY21WMExuQjFjMmdvSnp4a1pXdytKeWs3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdjbVYwTG5CMWMyZ29aWE5qWVhCbFNGUk5UQ2hqYUdGdVoyVXVkbUZzZFdVcEtUdGNibHh1SUNBZ0lHbG1JQ2hqYUdGdVoyVXVZV1JrWldRcElIdGNiaUFnSUNBZ0lISmxkQzV3ZFhOb0tDYzhMMmx1Y3o0bktUdGNiaUFnSUNCOUlHVnNjMlVnYVdZZ0tHTm9ZVzVuWlM1eVpXMXZkbVZrS1NCN1hHNGdJQ0FnSUNCeVpYUXVjSFZ6YUNnblBDOWtaV3crSnlrN1hHNGdJQ0FnZlZ4dUlDQjlYRzRnSUhKbGRIVnliaUJ5WlhRdWFtOXBiaWduSnlrN1hHNTlYRzVjYm1aMWJtTjBhVzl1SUdWelkyRndaVWhVVFV3b2N5a2dlMXh1SUNCc1pYUWdiaUE5SUhNN1hHNGdJRzRnUFNCdUxuSmxjR3hoWTJVb0x5WXZaeXdnSnlaaGJYQTdKeWs3WEc0Z0lHNGdQU0J1TG5KbGNHeGhZMlVvTHp3dlp5d2dKeVpzZERzbktUdGNiaUFnYmlBOUlHNHVjbVZ3YkdGalpTZ3ZQaTluTENBbkptZDBPeWNwTzF4dUlDQnVJRDBnYmk1eVpYQnNZV05sS0M5Y0lpOW5MQ0FuSm5GMWIzUTdKeWs3WEc1Y2JpQWdjbVYwZFhKdUlHNDdYRzU5WEc0aVhYMD1cbiIsIi8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cblwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kaWZmQXJyYXlzID0gZGlmZkFycmF5cztcbmV4cG9ydHMuYXJyYXlEaWZmID0gdm9pZCAwO1xuXG4vKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xudmFyXG4vKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG5fYmFzZSA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vYmFzZVwiKSlcbi8qaXN0YW5idWwgaWdub3JlIGVuZCovXG47XG5cbi8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki8gZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbi8qaXN0YW5idWwgaWdub3JlIGVuZCovXG52YXIgYXJyYXlEaWZmID0gbmV3XG4vKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG5fYmFzZVxuLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbltcbi8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cblwiZGVmYXVsdFwiXG4vKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuXSgpO1xuXG4vKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG5leHBvcnRzLmFycmF5RGlmZiA9IGFycmF5RGlmZjtcblxuLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbmFycmF5RGlmZi50b2tlbml6ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUuc2xpY2UoKTtcbn07XG5cbmFycmF5RGlmZi5qb2luID0gYXJyYXlEaWZmLnJlbW92ZUVtcHR5ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZTtcbn07XG5cbmZ1bmN0aW9uIGRpZmZBcnJheXMob2xkQXJyLCBuZXdBcnIsIGNhbGxiYWNrKSB7XG4gIHJldHVybiBhcnJheURpZmYuZGlmZihvbGRBcnIsIG5ld0FyciwgY2FsbGJhY2spO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5a2FXWm1MMkZ5Y21GNUxtcHpJbDBzSW01aGJXVnpJanBiSW1GeWNtRjVSR2xtWmlJc0lrUnBabVlpTENKMGIydGxibWw2WlNJc0luWmhiSFZsSWl3aWMyeHBZMlVpTENKcWIybHVJaXdpY21WdGIzWmxSVzF3ZEhraUxDSmthV1ptUVhKeVlYbHpJaXdpYjJ4a1FYSnlJaXdpYm1WM1FYSnlJaXdpWTJGc2JHSmhZMnNpTENKa2FXWm1JbDBzSW0xaGNIQnBibWR6SWpvaU96czdPenM3T3pzN08wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZCUVRzN096czdRVUZGVHl4SlFVRk5RU3hUUVVGVExFZEJRVWM3UVVGQlNVTTdRVUZCUVVFN1FVRkJRVUU3UVVGQlFVRTdRVUZCUVVFN1FVRkJRVUU3UVVGQlFVRTdRVUZCUVVFc1EwRkJTaXhGUVVGc1FqczdPenM3TzBGQlExQkVMRk5CUVZNc1EwRkJRMFVzVVVGQlZpeEhRVUZ4UWl4VlFVRlRReXhMUVVGVUxFVkJRV2RDTzBGQlEyNURMRk5CUVU5QkxFdEJRVXNzUTBGQlEwTXNTMEZCVGl4RlFVRlFPMEZCUTBRc1EwRkdSRHM3UVVGSFFVb3NVMEZCVXl4RFFVRkRTeXhKUVVGV0xFZEJRV2xDVEN4VFFVRlRMRU5CUVVOTkxGZEJRVllzUjBGQmQwSXNWVUZCVTBnc1MwRkJWQ3hGUVVGblFqdEJRVU4yUkN4VFFVRlBRU3hMUVVGUU8wRkJRMFFzUTBGR1JEczdRVUZKVHl4VFFVRlRTU3hWUVVGVUxFTkJRVzlDUXl4TlFVRndRaXhGUVVFMFFrTXNUVUZCTlVJc1JVRkJiME5ETEZGQlFYQkRMRVZCUVRoRE8wRkJRVVVzVTBGQlQxWXNVMEZCVXl4RFFVRkRWeXhKUVVGV0xFTkJRV1ZJTEUxQlFXWXNSVUZCZFVKRExFMUJRWFpDTEVWQlFTdENReXhSUVVFdlFpeERRVUZRTzBGQlFXdEVJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpYVcxd2IzSjBJRVJwWm1ZZ1puSnZiU0FuTGk5aVlYTmxKenRjYmx4dVpYaHdiM0owSUdOdmJuTjBJR0Z5Y21GNVJHbG1aaUE5SUc1bGR5QkVhV1ptS0NrN1hHNWhjbkpoZVVScFptWXVkRzlyWlc1cGVtVWdQU0JtZFc1amRHbHZiaWgyWVd4MVpTa2dlMXh1SUNCeVpYUjFjbTRnZG1Gc2RXVXVjMnhwWTJVb0tUdGNibjA3WEc1aGNuSmhlVVJwWm1ZdWFtOXBiaUE5SUdGeWNtRjVSR2xtWmk1eVpXMXZkbVZGYlhCMGVTQTlJR1oxYm1OMGFXOXVLSFpoYkhWbEtTQjdYRzRnSUhKbGRIVnliaUIyWVd4MVpUdGNibjA3WEc1Y2JtVjRjRzl5ZENCbWRXNWpkR2x2YmlCa2FXWm1RWEp5WVhsektHOXNaRUZ5Y2l3Z2JtVjNRWEp5TENCallXeHNZbUZqYXlrZ2V5QnlaWFIxY200Z1lYSnlZWGxFYVdabUxtUnBabVlvYjJ4a1FYSnlMQ0J1WlhkQmNuSXNJR05oYkd4aVlXTnJLVHNnZlZ4dUlsMTlcbiIsIi8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cblwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0c1tcImRlZmF1bHRcIl0gPSBEaWZmO1xuXG4vKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuZnVuY3Rpb24gRGlmZigpIHt9XG5cbkRpZmYucHJvdG90eXBlID0ge1xuICAvKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG5cbiAgLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbiAgZGlmZjogZnVuY3Rpb24gZGlmZihvbGRTdHJpbmcsIG5ld1N0cmluZykge1xuICAgIC8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cbiAgICB2YXJcbiAgICAvKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuICAgIG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IHt9O1xuICAgIHZhciBjYWxsYmFjayA9IG9wdGlvbnMuY2FsbGJhY2s7XG5cbiAgICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNhbGxiYWNrID0gb3B0aW9ucztcbiAgICAgIG9wdGlvbnMgPSB7fTtcbiAgICB9XG5cbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zO1xuICAgIHZhciBzZWxmID0gdGhpcztcblxuICAgIGZ1bmN0aW9uIGRvbmUodmFsdWUpIHtcbiAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICBjYWxsYmFjayh1bmRlZmluZWQsIHZhbHVlKTtcbiAgICAgICAgfSwgMCk7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfVxuICAgIH0gLy8gQWxsb3cgc3ViY2xhc3NlcyB0byBtYXNzYWdlIHRoZSBpbnB1dCBwcmlvciB0byBydW5uaW5nXG5cblxuICAgIG9sZFN0cmluZyA9IHRoaXMuY2FzdElucHV0KG9sZFN0cmluZyk7XG4gICAgbmV3U3RyaW5nID0gdGhpcy5jYXN0SW5wdXQobmV3U3RyaW5nKTtcbiAgICBvbGRTdHJpbmcgPSB0aGlzLnJlbW92ZUVtcHR5KHRoaXMudG9rZW5pemUob2xkU3RyaW5nKSk7XG4gICAgbmV3U3RyaW5nID0gdGhpcy5yZW1vdmVFbXB0eSh0aGlzLnRva2VuaXplKG5ld1N0cmluZykpO1xuICAgIHZhciBuZXdMZW4gPSBuZXdTdHJpbmcubGVuZ3RoLFxuICAgICAgICBvbGRMZW4gPSBvbGRTdHJpbmcubGVuZ3RoO1xuICAgIHZhciBlZGl0TGVuZ3RoID0gMTtcbiAgICB2YXIgbWF4RWRpdExlbmd0aCA9IG5ld0xlbiArIG9sZExlbjtcbiAgICB2YXIgYmVzdFBhdGggPSBbe1xuICAgICAgbmV3UG9zOiAtMSxcbiAgICAgIGNvbXBvbmVudHM6IFtdXG4gICAgfV07IC8vIFNlZWQgZWRpdExlbmd0aCA9IDAsIGkuZS4gdGhlIGNvbnRlbnQgc3RhcnRzIHdpdGggdGhlIHNhbWUgdmFsdWVzXG5cbiAgICB2YXIgb2xkUG9zID0gdGhpcy5leHRyYWN0Q29tbW9uKGJlc3RQYXRoWzBdLCBuZXdTdHJpbmcsIG9sZFN0cmluZywgMCk7XG5cbiAgICBpZiAoYmVzdFBhdGhbMF0ubmV3UG9zICsgMSA+PSBuZXdMZW4gJiYgb2xkUG9zICsgMSA+PSBvbGRMZW4pIHtcbiAgICAgIC8vIElkZW50aXR5IHBlciB0aGUgZXF1YWxpdHkgYW5kIHRva2VuaXplclxuICAgICAgcmV0dXJuIGRvbmUoW3tcbiAgICAgICAgdmFsdWU6IHRoaXMuam9pbihuZXdTdHJpbmcpLFxuICAgICAgICBjb3VudDogbmV3U3RyaW5nLmxlbmd0aFxuICAgICAgfV0pO1xuICAgIH0gLy8gTWFpbiB3b3JrZXIgbWV0aG9kLiBjaGVja3MgYWxsIHBlcm11dGF0aW9ucyBvZiBhIGdpdmVuIGVkaXQgbGVuZ3RoIGZvciBhY2NlcHRhbmNlLlxuXG5cbiAgICBmdW5jdGlvbiBleGVjRWRpdExlbmd0aCgpIHtcbiAgICAgIGZvciAodmFyIGRpYWdvbmFsUGF0aCA9IC0xICogZWRpdExlbmd0aDsgZGlhZ29uYWxQYXRoIDw9IGVkaXRMZW5ndGg7IGRpYWdvbmFsUGF0aCArPSAyKSB7XG4gICAgICAgIHZhciBiYXNlUGF0aCA9XG4gICAgICAgIC8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cbiAgICAgICAgdm9pZCAwXG4gICAgICAgIC8qaXN0YW5idWwgaWdub3JlIGVuZCovXG4gICAgICAgIDtcblxuICAgICAgICB2YXIgYWRkUGF0aCA9IGJlc3RQYXRoW2RpYWdvbmFsUGF0aCAtIDFdLFxuICAgICAgICAgICAgcmVtb3ZlUGF0aCA9IGJlc3RQYXRoW2RpYWdvbmFsUGF0aCArIDFdLFxuICAgICAgICAgICAgX29sZFBvcyA9IChyZW1vdmVQYXRoID8gcmVtb3ZlUGF0aC5uZXdQb3MgOiAwKSAtIGRpYWdvbmFsUGF0aDtcblxuICAgICAgICBpZiAoYWRkUGF0aCkge1xuICAgICAgICAgIC8vIE5vIG9uZSBlbHNlIGlzIGdvaW5nIHRvIGF0dGVtcHQgdG8gdXNlIHRoaXMgdmFsdWUsIGNsZWFyIGl0XG4gICAgICAgICAgYmVzdFBhdGhbZGlhZ29uYWxQYXRoIC0gMV0gPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY2FuQWRkID0gYWRkUGF0aCAmJiBhZGRQYXRoLm5ld1BvcyArIDEgPCBuZXdMZW4sXG4gICAgICAgICAgICBjYW5SZW1vdmUgPSByZW1vdmVQYXRoICYmIDAgPD0gX29sZFBvcyAmJiBfb2xkUG9zIDwgb2xkTGVuO1xuXG4gICAgICAgIGlmICghY2FuQWRkICYmICFjYW5SZW1vdmUpIHtcbiAgICAgICAgICAvLyBJZiB0aGlzIHBhdGggaXMgYSB0ZXJtaW5hbCB0aGVuIHBydW5lXG4gICAgICAgICAgYmVzdFBhdGhbZGlhZ29uYWxQYXRoXSA9IHVuZGVmaW5lZDtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfSAvLyBTZWxlY3QgdGhlIGRpYWdvbmFsIHRoYXQgd2Ugd2FudCB0byBicmFuY2ggZnJvbS4gV2Ugc2VsZWN0IHRoZSBwcmlvclxuICAgICAgICAvLyBwYXRoIHdob3NlIHBvc2l0aW9uIGluIHRoZSBuZXcgc3RyaW5nIGlzIHRoZSBmYXJ0aGVzdCBmcm9tIHRoZSBvcmlnaW5cbiAgICAgICAgLy8gYW5kIGRvZXMgbm90IHBhc3MgdGhlIGJvdW5kcyBvZiB0aGUgZGlmZiBncmFwaFxuXG5cbiAgICAgICAgaWYgKCFjYW5BZGQgfHwgY2FuUmVtb3ZlICYmIGFkZFBhdGgubmV3UG9zIDwgcmVtb3ZlUGF0aC5uZXdQb3MpIHtcbiAgICAgICAgICBiYXNlUGF0aCA9IGNsb25lUGF0aChyZW1vdmVQYXRoKTtcbiAgICAgICAgICBzZWxmLnB1c2hDb21wb25lbnQoYmFzZVBhdGguY29tcG9uZW50cywgdW5kZWZpbmVkLCB0cnVlKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBiYXNlUGF0aCA9IGFkZFBhdGg7IC8vIE5vIG5lZWQgdG8gY2xvbmUsIHdlJ3ZlIHB1bGxlZCBpdCBmcm9tIHRoZSBsaXN0XG5cbiAgICAgICAgICBiYXNlUGF0aC5uZXdQb3MrKztcbiAgICAgICAgICBzZWxmLnB1c2hDb21wb25lbnQoYmFzZVBhdGguY29tcG9uZW50cywgdHJ1ZSwgdW5kZWZpbmVkKTtcbiAgICAgICAgfVxuXG4gICAgICAgIF9vbGRQb3MgPSBzZWxmLmV4dHJhY3RDb21tb24oYmFzZVBhdGgsIG5ld1N0cmluZywgb2xkU3RyaW5nLCBkaWFnb25hbFBhdGgpOyAvLyBJZiB3ZSBoYXZlIGhpdCB0aGUgZW5kIG9mIGJvdGggc3RyaW5ncywgdGhlbiB3ZSBhcmUgZG9uZVxuXG4gICAgICAgIGlmIChiYXNlUGF0aC5uZXdQb3MgKyAxID49IG5ld0xlbiAmJiBfb2xkUG9zICsgMSA+PSBvbGRMZW4pIHtcbiAgICAgICAgICByZXR1cm4gZG9uZShidWlsZFZhbHVlcyhzZWxmLCBiYXNlUGF0aC5jb21wb25lbnRzLCBuZXdTdHJpbmcsIG9sZFN0cmluZywgc2VsZi51c2VMb25nZXN0VG9rZW4pKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBPdGhlcndpc2UgdHJhY2sgdGhpcyBwYXRoIGFzIGEgcG90ZW50aWFsIGNhbmRpZGF0ZSBhbmQgY29udGludWUuXG4gICAgICAgICAgYmVzdFBhdGhbZGlhZ29uYWxQYXRoXSA9IGJhc2VQYXRoO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGVkaXRMZW5ndGgrKztcbiAgICB9IC8vIFBlcmZvcm1zIHRoZSBsZW5ndGggb2YgZWRpdCBpdGVyYXRpb24uIElzIGEgYml0IGZ1Z2x5IGFzIHRoaXMgaGFzIHRvIHN1cHBvcnQgdGhlXG4gICAgLy8gc3luYyBhbmQgYXN5bmMgbW9kZSB3aGljaCBpcyBuZXZlciBmdW4uIExvb3BzIG92ZXIgZXhlY0VkaXRMZW5ndGggdW50aWwgYSB2YWx1ZVxuICAgIC8vIGlzIHByb2R1Y2VkLlxuXG5cbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIChmdW5jdGlvbiBleGVjKCkge1xuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAvLyBUaGlzIHNob3VsZCBub3QgaGFwcGVuLCBidXQgd2Ugd2FudCB0byBiZSBzYWZlLlxuXG4gICAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgICAgICAgICBpZiAoZWRpdExlbmd0aCA+IG1heEVkaXRMZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBjYWxsYmFjaygpO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmICghZXhlY0VkaXRMZW5ndGgoKSkge1xuICAgICAgICAgICAgZXhlYygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgMCk7XG4gICAgICB9KSgpO1xuICAgIH0gZWxzZSB7XG4gICAgICB3aGlsZSAoZWRpdExlbmd0aCA8PSBtYXhFZGl0TGVuZ3RoKSB7XG4gICAgICAgIHZhciByZXQgPSBleGVjRWRpdExlbmd0aCgpO1xuXG4gICAgICAgIGlmIChyZXQpIHtcbiAgICAgICAgICByZXR1cm4gcmV0O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LFxuXG4gIC8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cblxuICAvKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuICBwdXNoQ29tcG9uZW50OiBmdW5jdGlvbiBwdXNoQ29tcG9uZW50KGNvbXBvbmVudHMsIGFkZGVkLCByZW1vdmVkKSB7XG4gICAgdmFyIGxhc3QgPSBjb21wb25lbnRzW2NvbXBvbmVudHMubGVuZ3RoIC0gMV07XG5cbiAgICBpZiAobGFzdCAmJiBsYXN0LmFkZGVkID09PSBhZGRlZCAmJiBsYXN0LnJlbW92ZWQgPT09IHJlbW92ZWQpIHtcbiAgICAgIC8vIFdlIG5lZWQgdG8gY2xvbmUgaGVyZSBhcyB0aGUgY29tcG9uZW50IGNsb25lIG9wZXJhdGlvbiBpcyBqdXN0XG4gICAgICAvLyBhcyBzaGFsbG93IGFycmF5IGNsb25lXG4gICAgICBjb21wb25lbnRzW2NvbXBvbmVudHMubGVuZ3RoIC0gMV0gPSB7XG4gICAgICAgIGNvdW50OiBsYXN0LmNvdW50ICsgMSxcbiAgICAgICAgYWRkZWQ6IGFkZGVkLFxuICAgICAgICByZW1vdmVkOiByZW1vdmVkXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBjb21wb25lbnRzLnB1c2goe1xuICAgICAgICBjb3VudDogMSxcbiAgICAgICAgYWRkZWQ6IGFkZGVkLFxuICAgICAgICByZW1vdmVkOiByZW1vdmVkXG4gICAgICB9KTtcbiAgICB9XG4gIH0sXG5cbiAgLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuXG4gIC8qaXN0YW5idWwgaWdub3JlIGVuZCovXG4gIGV4dHJhY3RDb21tb246IGZ1bmN0aW9uIGV4dHJhY3RDb21tb24oYmFzZVBhdGgsIG5ld1N0cmluZywgb2xkU3RyaW5nLCBkaWFnb25hbFBhdGgpIHtcbiAgICB2YXIgbmV3TGVuID0gbmV3U3RyaW5nLmxlbmd0aCxcbiAgICAgICAgb2xkTGVuID0gb2xkU3RyaW5nLmxlbmd0aCxcbiAgICAgICAgbmV3UG9zID0gYmFzZVBhdGgubmV3UG9zLFxuICAgICAgICBvbGRQb3MgPSBuZXdQb3MgLSBkaWFnb25hbFBhdGgsXG4gICAgICAgIGNvbW1vbkNvdW50ID0gMDtcblxuICAgIHdoaWxlIChuZXdQb3MgKyAxIDwgbmV3TGVuICYmIG9sZFBvcyArIDEgPCBvbGRMZW4gJiYgdGhpcy5lcXVhbHMobmV3U3RyaW5nW25ld1BvcyArIDFdLCBvbGRTdHJpbmdbb2xkUG9zICsgMV0pKSB7XG4gICAgICBuZXdQb3MrKztcbiAgICAgIG9sZFBvcysrO1xuICAgICAgY29tbW9uQ291bnQrKztcbiAgICB9XG5cbiAgICBpZiAoY29tbW9uQ291bnQpIHtcbiAgICAgIGJhc2VQYXRoLmNvbXBvbmVudHMucHVzaCh7XG4gICAgICAgIGNvdW50OiBjb21tb25Db3VudFxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgYmFzZVBhdGgubmV3UG9zID0gbmV3UG9zO1xuICAgIHJldHVybiBvbGRQb3M7XG4gIH0sXG5cbiAgLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuXG4gIC8qaXN0YW5idWwgaWdub3JlIGVuZCovXG4gIGVxdWFsczogZnVuY3Rpb24gZXF1YWxzKGxlZnQsIHJpZ2h0KSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5jb21wYXJhdG9yKSB7XG4gICAgICByZXR1cm4gdGhpcy5vcHRpb25zLmNvbXBhcmF0b3IobGVmdCwgcmlnaHQpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbGVmdCA9PT0gcmlnaHQgfHwgdGhpcy5vcHRpb25zLmlnbm9yZUNhc2UgJiYgbGVmdC50b0xvd2VyQ2FzZSgpID09PSByaWdodC50b0xvd2VyQ2FzZSgpO1xuICAgIH1cbiAgfSxcblxuICAvKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG5cbiAgLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbiAgcmVtb3ZlRW1wdHk6IGZ1bmN0aW9uIHJlbW92ZUVtcHR5KGFycmF5KSB7XG4gICAgdmFyIHJldCA9IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgaWYgKGFycmF5W2ldKSB7XG4gICAgICAgIHJldC5wdXNoKGFycmF5W2ldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xuICB9LFxuXG4gIC8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cblxuICAvKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuICBjYXN0SW5wdXQ6IGZ1bmN0aW9uIGNhc3RJbnB1dCh2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZTtcbiAgfSxcblxuICAvKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG5cbiAgLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbiAgdG9rZW5pemU6IGZ1bmN0aW9uIHRva2VuaXplKHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlLnNwbGl0KCcnKTtcbiAgfSxcblxuICAvKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG5cbiAgLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbiAgam9pbjogZnVuY3Rpb24gam9pbihjaGFycykge1xuICAgIHJldHVybiBjaGFycy5qb2luKCcnKTtcbiAgfVxufTtcblxuZnVuY3Rpb24gYnVpbGRWYWx1ZXMoZGlmZiwgY29tcG9uZW50cywgbmV3U3RyaW5nLCBvbGRTdHJpbmcsIHVzZUxvbmdlc3RUb2tlbikge1xuICB2YXIgY29tcG9uZW50UG9zID0gMCxcbiAgICAgIGNvbXBvbmVudExlbiA9IGNvbXBvbmVudHMubGVuZ3RoLFxuICAgICAgbmV3UG9zID0gMCxcbiAgICAgIG9sZFBvcyA9IDA7XG5cbiAgZm9yICg7IGNvbXBvbmVudFBvcyA8IGNvbXBvbmVudExlbjsgY29tcG9uZW50UG9zKyspIHtcbiAgICB2YXIgY29tcG9uZW50ID0gY29tcG9uZW50c1tjb21wb25lbnRQb3NdO1xuXG4gICAgaWYgKCFjb21wb25lbnQucmVtb3ZlZCkge1xuICAgICAgaWYgKCFjb21wb25lbnQuYWRkZWQgJiYgdXNlTG9uZ2VzdFRva2VuKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IG5ld1N0cmluZy5zbGljZShuZXdQb3MsIG5ld1BvcyArIGNvbXBvbmVudC5jb3VudCk7XG4gICAgICAgIHZhbHVlID0gdmFsdWUubWFwKGZ1bmN0aW9uICh2YWx1ZSwgaSkge1xuICAgICAgICAgIHZhciBvbGRWYWx1ZSA9IG9sZFN0cmluZ1tvbGRQb3MgKyBpXTtcbiAgICAgICAgICByZXR1cm4gb2xkVmFsdWUubGVuZ3RoID4gdmFsdWUubGVuZ3RoID8gb2xkVmFsdWUgOiB2YWx1ZTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbXBvbmVudC52YWx1ZSA9IGRpZmYuam9pbih2YWx1ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb21wb25lbnQudmFsdWUgPSBkaWZmLmpvaW4obmV3U3RyaW5nLnNsaWNlKG5ld1BvcywgbmV3UG9zICsgY29tcG9uZW50LmNvdW50KSk7XG4gICAgICB9XG5cbiAgICAgIG5ld1BvcyArPSBjb21wb25lbnQuY291bnQ7IC8vIENvbW1vbiBjYXNlXG5cbiAgICAgIGlmICghY29tcG9uZW50LmFkZGVkKSB7XG4gICAgICAgIG9sZFBvcyArPSBjb21wb25lbnQuY291bnQ7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbXBvbmVudC52YWx1ZSA9IGRpZmYuam9pbihvbGRTdHJpbmcuc2xpY2Uob2xkUG9zLCBvbGRQb3MgKyBjb21wb25lbnQuY291bnQpKTtcbiAgICAgIG9sZFBvcyArPSBjb21wb25lbnQuY291bnQ7IC8vIFJldmVyc2UgYWRkIGFuZCByZW1vdmUgc28gcmVtb3ZlcyBhcmUgb3V0cHV0IGZpcnN0IHRvIG1hdGNoIGNvbW1vbiBjb252ZW50aW9uXG4gICAgICAvLyBUaGUgZGlmZmluZyBhbGdvcml0aG0gaXMgdGllZCB0byBhZGQgdGhlbiByZW1vdmUgb3V0cHV0IGFuZCB0aGlzIGlzIHRoZSBzaW1wbGVzdFxuICAgICAgLy8gcm91dGUgdG8gZ2V0IHRoZSBkZXNpcmVkIG91dHB1dCB3aXRoIG1pbmltYWwgb3ZlcmhlYWQuXG5cbiAgICAgIGlmIChjb21wb25lbnRQb3MgJiYgY29tcG9uZW50c1tjb21wb25lbnRQb3MgLSAxXS5hZGRlZCkge1xuICAgICAgICB2YXIgdG1wID0gY29tcG9uZW50c1tjb21wb25lbnRQb3MgLSAxXTtcbiAgICAgICAgY29tcG9uZW50c1tjb21wb25lbnRQb3MgLSAxXSA9IGNvbXBvbmVudHNbY29tcG9uZW50UG9zXTtcbiAgICAgICAgY29tcG9uZW50c1tjb21wb25lbnRQb3NdID0gdG1wO1xuICAgICAgfVxuICAgIH1cbiAgfSAvLyBTcGVjaWFsIGNhc2UgaGFuZGxlIGZvciB3aGVuIG9uZSB0ZXJtaW5hbCBpcyBpZ25vcmVkIChpLmUuIHdoaXRlc3BhY2UpLlxuICAvLyBGb3IgdGhpcyBjYXNlIHdlIG1lcmdlIHRoZSB0ZXJtaW5hbCBpbnRvIHRoZSBwcmlvciBzdHJpbmcgYW5kIGRyb3AgdGhlIGNoYW5nZS5cbiAgLy8gVGhpcyBpcyBvbmx5IGF2YWlsYWJsZSBmb3Igc3RyaW5nIG1vZGUuXG5cblxuICB2YXIgbGFzdENvbXBvbmVudCA9IGNvbXBvbmVudHNbY29tcG9uZW50TGVuIC0gMV07XG5cbiAgaWYgKGNvbXBvbmVudExlbiA+IDEgJiYgdHlwZW9mIGxhc3RDb21wb25lbnQudmFsdWUgPT09ICdzdHJpbmcnICYmIChsYXN0Q29tcG9uZW50LmFkZGVkIHx8IGxhc3RDb21wb25lbnQucmVtb3ZlZCkgJiYgZGlmZi5lcXVhbHMoJycsIGxhc3RDb21wb25lbnQudmFsdWUpKSB7XG4gICAgY29tcG9uZW50c1tjb21wb25lbnRMZW4gLSAyXS52YWx1ZSArPSBsYXN0Q29tcG9uZW50LnZhbHVlO1xuICAgIGNvbXBvbmVudHMucG9wKCk7XG4gIH1cblxuICByZXR1cm4gY29tcG9uZW50cztcbn1cblxuZnVuY3Rpb24gY2xvbmVQYXRoKHBhdGgpIHtcbiAgcmV0dXJuIHtcbiAgICBuZXdQb3M6IHBhdGgubmV3UG9zLFxuICAgIGNvbXBvbmVudHM6IHBhdGguY29tcG9uZW50cy5zbGljZSgwKVxuICB9O1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5a2FXWm1MMkpoYzJVdWFuTWlYU3dpYm1GdFpYTWlPbHNpUkdsbVppSXNJbkJ5YjNSdmRIbHdaU0lzSW1ScFptWWlMQ0p2YkdSVGRISnBibWNpTENKdVpYZFRkSEpwYm1jaUxDSnZjSFJwYjI1eklpd2lZMkZzYkdKaFkyc2lMQ0p6Wld4bUlpd2laRzl1WlNJc0luWmhiSFZsSWl3aWMyVjBWR2x0Wlc5MWRDSXNJblZ1WkdWbWFXNWxaQ0lzSW1OaGMzUkpibkIxZENJc0luSmxiVzkyWlVWdGNIUjVJaXdpZEc5clpXNXBlbVVpTENKdVpYZE1aVzRpTENKc1pXNW5kR2dpTENKdmJHUk1aVzRpTENKbFpHbDBUR1Z1WjNSb0lpd2liV0Y0UldScGRFeGxibWQwYUNJc0ltSmxjM1JRWVhSb0lpd2libVYzVUc5eklpd2lZMjl0Y0c5dVpXNTBjeUlzSW05c1pGQnZjeUlzSW1WNGRISmhZM1JEYjIxdGIyNGlMQ0pxYjJsdUlpd2lZMjkxYm5RaUxDSmxlR1ZqUldScGRFeGxibWQwYUNJc0ltUnBZV2R2Ym1Gc1VHRjBhQ0lzSW1KaGMyVlFZWFJvSWl3aVlXUmtVR0YwYUNJc0luSmxiVzkyWlZCaGRHZ2lMQ0pqWVc1QlpHUWlMQ0pqWVc1U1pXMXZkbVVpTENKamJHOXVaVkJoZEdnaUxDSndkWE5vUTI5dGNHOXVaVzUwSWl3aVluVnBiR1JXWVd4MVpYTWlMQ0oxYzJWTWIyNW5aWE4wVkc5clpXNGlMQ0psZUdWaklpd2ljbVYwSWl3aVlXUmtaV1FpTENKeVpXMXZkbVZrSWl3aWJHRnpkQ0lzSW5CMWMyZ2lMQ0pqYjIxdGIyNURiM1Z1ZENJc0ltVnhkV0ZzY3lJc0lteGxablFpTENKeWFXZG9kQ0lzSW1OdmJYQmhjbUYwYjNJaUxDSnBaMjV2Y21WRFlYTmxJaXdpZEc5TWIzZGxja05oYzJVaUxDSmhjbkpoZVNJc0lta2lMQ0p6Y0d4cGRDSXNJbU5vWVhKeklpd2lZMjl0Y0c5dVpXNTBVRzl6SWl3aVkyOXRjRzl1Wlc1MFRHVnVJaXdpWTI5dGNHOXVaVzUwSWl3aWMyeHBZMlVpTENKdFlYQWlMQ0p2YkdSV1lXeDFaU0lzSW5SdGNDSXNJbXhoYzNSRGIyMXdiMjVsYm5RaUxDSndiM0FpTENKd1lYUm9JbDBzSW0xaGNIQnBibWR6SWpvaU96czdPenM3T3pzN1FVRkJaU3hUUVVGVFFTeEpRVUZVTEVkQlFXZENMRU5CUVVVN08wRkJSV3BEUVN4SlFVRkpMRU5CUVVORExGTkJRVXdzUjBGQmFVSTdRVUZCUVRzN1FVRkJRVHRCUVVObVF5eEZRVUZCUVN4SlFVUmxMR2RDUVVOV1F5eFRRVVJWTEVWQlEwTkRMRk5CUkVRc1JVRkRNRUk3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZCWkVNc1NVRkJRVUVzVDBGQll5eDFSVUZCU2l4RlFVRkpPMEZCUTNaRExGRkJRVWxETEZGQlFWRXNSMEZCUjBRc1QwRkJUeXhEUVVGRFF5eFJRVUYyUWpzN1FVRkRRU3hSUVVGSkxFOUJRVTlFTEU5QlFWQXNTMEZCYlVJc1ZVRkJka0lzUlVGQmJVTTdRVUZEYWtORExFMUJRVUZCTEZGQlFWRXNSMEZCUjBRc1QwRkJXRHRCUVVOQlFTeE5RVUZCUVN4UFFVRlBMRWRCUVVjc1JVRkJWanRCUVVORU96dEJRVU5FTEZOQlFVdEJMRTlCUVV3c1IwRkJaVUVzVDBGQlpqdEJRVVZCTEZGQlFVbEZMRWxCUVVrc1IwRkJSeXhKUVVGWU96dEJRVVZCTEdGQlFWTkRMRWxCUVZRc1EwRkJZME1zUzBGQlpDeEZRVUZ4UWp0QlFVTnVRaXhWUVVGSlNDeFJRVUZLTEVWQlFXTTdRVUZEV2trc1VVRkJRVUVzVlVGQlZTeERRVUZETEZsQlFWYzdRVUZCUlVvc1ZVRkJRVUVzVVVGQlVTeERRVUZEU3l4VFFVRkVMRVZCUVZsR0xFdEJRVm9zUTBGQlVqdEJRVUUyUWl4VFFVRXpReXhGUVVFMlF5eERRVUUzUXl4RFFVRldPMEZCUTBFc1pVRkJUeXhKUVVGUU8wRkJRMFFzVDBGSVJDeE5RVWRQTzBGQlEwd3NaVUZCVDBFc1MwRkJVRHRCUVVORU8wRkJRMFlzUzBGcVFuTkRMRU5CYlVKMlF6czdPMEZCUTBGT0xFbEJRVUZCTEZOQlFWTXNSMEZCUnl4TFFVRkxVeXhUUVVGTUxFTkJRV1ZVTEZOQlFXWXNRMEZCV2p0QlFVTkJReXhKUVVGQlFTeFRRVUZUTEVkQlFVY3NTMEZCUzFFc1UwRkJUQ3hEUVVGbFVpeFRRVUZtTEVOQlFWbzdRVUZGUVVRc1NVRkJRVUVzVTBGQlV5eEhRVUZITEV0QlFVdFZMRmRCUVV3c1EwRkJhVUlzUzBGQlMwTXNVVUZCVEN4RFFVRmpXQ3hUUVVGa0xFTkJRV3BDTEVOQlFWbzdRVUZEUVVNc1NVRkJRVUVzVTBGQlV5eEhRVUZITEV0QlFVdFRMRmRCUVV3c1EwRkJhVUlzUzBGQlMwTXNVVUZCVEN4RFFVRmpWaXhUUVVGa0xFTkJRV3BDTEVOQlFWbzdRVUZGUVN4UlFVRkpWeXhOUVVGTkxFZEJRVWRZTEZOQlFWTXNRMEZCUTFrc1RVRkJka0k3UVVGQlFTeFJRVUVyUWtNc1RVRkJUU3hIUVVGSFpDeFRRVUZUTEVOQlFVTmhMRTFCUVd4RU8wRkJRMEVzVVVGQlNVVXNWVUZCVlN4SFFVRkhMRU5CUVdwQ08wRkJRMEVzVVVGQlNVTXNZVUZCWVN4SFFVRkhTaXhOUVVGTkxFZEJRVWRGTEUxQlFUZENPMEZCUTBFc1VVRkJTVWNzVVVGQlVTeEhRVUZITEVOQlFVTTdRVUZCUlVNc1RVRkJRVUVzVFVGQlRTeEZRVUZGTEVOQlFVTXNRMEZCV0R0QlFVRmpReXhOUVVGQlFTeFZRVUZWTEVWQlFVVTdRVUZCTVVJc1MwRkJSQ3hEUVVGbUxFTkJOMEoxUXl4RFFTdENka003TzBGQlEwRXNVVUZCU1VNc1RVRkJUU3hIUVVGSExFdEJRVXRETEdGQlFVd3NRMEZCYlVKS0xGRkJRVkVzUTBGQlF5eERRVUZFTEVOQlFUTkNMRVZCUVdkRGFFSXNVMEZCYUVNc1JVRkJNa05FTEZOQlFUTkRMRVZCUVhORUxFTkJRWFJFTEVOQlFXSTdPMEZCUTBFc1VVRkJTV2xDTEZGQlFWRXNRMEZCUXl4RFFVRkVMRU5CUVZJc1EwRkJXVU1zVFVGQldpeEhRVUZ4UWl4RFFVRnlRaXhKUVVFd1FrNHNUVUZCTVVJc1NVRkJiME5STEUxQlFVMHNSMEZCUnl4RFFVRlVMRWxCUVdOT0xFMUJRWFJFTEVWQlFUaEVPMEZCUXpWRU8wRkJRMEVzWVVGQlQxUXNTVUZCU1N4RFFVRkRMRU5CUVVNN1FVRkJRME1zVVVGQlFVRXNTMEZCU3l4RlFVRkZMRXRCUVV0blFpeEpRVUZNTEVOQlFWVnlRaXhUUVVGV0xFTkJRVkk3UVVGQk9FSnpRaXhSUVVGQlFTeExRVUZMTEVWQlFVVjBRaXhUUVVGVExFTkJRVU5aTzBGQlFTOURMRTlCUVVRc1EwRkJSQ3hEUVVGWU8wRkJRMFFzUzBGd1EzTkRMRU5CYzBOMlF6czdPMEZCUTBFc1lVRkJVMWNzWTBGQlZDeEhRVUV3UWp0QlFVTjRRaXhYUVVGTExFbEJRVWxETEZsQlFWa3NSMEZCUnl4RFFVRkRMRU5CUVVRc1IwRkJTMVlzVlVGQk4wSXNSVUZCZVVOVkxGbEJRVmtzU1VGQlNWWXNWVUZCZWtRc1JVRkJjVVZWTEZsQlFWa3NTVUZCU1N4RFFVRnlSaXhGUVVGM1JqdEJRVU4wUml4WlFVRkpReXhSUVVGUk8wRkJRVUU3UVVGQlFUdEJRVUZhTzBGQlFVRTdPMEZCUTBFc1dVRkJTVU1zVDBGQlR5eEhRVUZIVml4UlFVRlJMRU5CUVVOUkxGbEJRVmtzUjBGQlJ5eERRVUZvUWl4RFFVRjBRanRCUVVGQkxGbEJRMGxITEZWQlFWVXNSMEZCUjFnc1VVRkJVU3hEUVVGRFVTeFpRVUZaTEVkQlFVY3NRMEZCYUVJc1EwRkVla0k3UVVGQlFTeFpRVVZKVEN4UFFVRk5MRWRCUVVjc1EwRkJRMUVzVlVGQlZTeEhRVUZIUVN4VlFVRlZMRU5CUVVOV0xFMUJRV1FzUjBGQmRVSXNRMEZCYkVNc1NVRkJkVU5QTEZsQlJuQkVPenRCUVVkQkxGbEJRVWxGTEU5QlFVb3NSVUZCWVR0QlFVTllPMEZCUTBGV0xGVkJRVUZCTEZGQlFWRXNRMEZCUTFFc1dVRkJXU3hIUVVGSExFTkJRV2hDTEVOQlFWSXNSMEZCTmtKcVFpeFRRVUUzUWp0QlFVTkVPenRCUVVWRUxGbEJRVWx4UWl4TlFVRk5MRWRCUVVkR0xFOUJRVThzU1VGQlNVRXNUMEZCVHl4RFFVRkRWQ3hOUVVGU0xFZEJRV2xDTEVOQlFXcENMRWRCUVhGQ1RpeE5RVUUzUXp0QlFVRkJMRmxCUTBsclFpeFRRVUZUTEVkQlFVZEdMRlZCUVZVc1NVRkJTU3hMUVVGTFVpeFBRVUZ1UWl4SlFVRTJRa0VzVDBGQlRTeEhRVUZIVGl4TlFVUjBSRHM3UVVGRlFTeFpRVUZKTEVOQlFVTmxMRTFCUVVRc1NVRkJWeXhEUVVGRFF5eFRRVUZvUWl4RlFVRXlRanRCUVVONlFqdEJRVU5CWWl4VlFVRkJRU3hSUVVGUkxFTkJRVU5STEZsQlFVUXNRMEZCVWl4SFFVRjVRbXBDTEZOQlFYcENPMEZCUTBFN1FVRkRSQ3hUUVdoQ2NVWXNRMEZyUW5SR08wRkJRMEU3UVVGRFFUczdPMEZCUTBFc1dVRkJTU3hEUVVGRGNVSXNUVUZCUkN4SlFVRlpReXhUUVVGVExFbEJRVWxJTEU5QlFVOHNRMEZCUTFRc1RVRkJVaXhIUVVGcFFsVXNWVUZCVlN4RFFVRkRWaXhOUVVGNlJDeEZRVUZyUlR0QlFVTm9SVkVzVlVGQlFVRXNVVUZCVVN4SFFVRkhTeXhUUVVGVExFTkJRVU5JTEZWQlFVUXNRMEZCY0VJN1FVRkRRWGhDTEZWQlFVRkJMRWxCUVVrc1EwRkJRelJDTEdGQlFVd3NRMEZCYlVKT0xGRkJRVkVzUTBGQlExQXNWVUZCTlVJc1JVRkJkME5ZTEZOQlFYaERMRVZCUVcxRUxFbEJRVzVFTzBGQlEwUXNVMEZJUkN4TlFVZFBPMEZCUTB4clFpeFZRVUZCUVN4UlFVRlJMRWRCUVVkRExFOUJRVmdzUTBGRVN5eERRVU5sT3p0QlFVTndRa1FzVlVGQlFVRXNVVUZCVVN4RFFVRkRVaXhOUVVGVU8wRkJRMEZrTEZWQlFVRkJMRWxCUVVrc1EwRkJRelJDTEdGQlFVd3NRMEZCYlVKT0xGRkJRVkVzUTBGQlExQXNWVUZCTlVJc1JVRkJkME1zU1VGQmVFTXNSVUZCT0VOWUxGTkJRVGxETzBGQlEwUTdPMEZCUlVSWkxGRkJRVUZCTEU5QlFVMHNSMEZCUjJoQ0xFbEJRVWtzUTBGQlEybENMR0ZCUVV3c1EwRkJiVUpMTEZGQlFXNUNMRVZCUVRaQ2VrSXNVMEZCTjBJc1JVRkJkME5FTEZOQlFYaERMRVZCUVcxRWVVSXNXVUZCYmtRc1EwRkJWQ3hEUVRsQ2MwWXNRMEZuUTNSR096dEJRVU5CTEZsQlFVbERMRkZCUVZFc1EwRkJRMUlzVFVGQlZDeEhRVUZyUWl4RFFVRnNRaXhKUVVGMVFrNHNUVUZCZGtJc1NVRkJhVU5STEU5QlFVMHNSMEZCUnl4RFFVRlVMRWxCUVdOT0xFMUJRVzVFTEVWQlFUSkVPMEZCUTNwRUxHbENRVUZQVkN4SlFVRkpMRU5CUVVNMFFpeFhRVUZYTEVOQlFVTTNRaXhKUVVGRUxFVkJRVTl6UWl4UlFVRlJMRU5CUVVOUUxGVkJRV2hDTEVWQlFUUkNiRUlzVTBGQk5VSXNSVUZCZFVORUxGTkJRWFpETEVWQlFXdEVTU3hKUVVGSkxFTkJRVU00UWl4bFFVRjJSQ3hEUVVGYUxFTkJRVmc3UVVGRFJDeFRRVVpFTEUxQlJVODdRVUZEVER0QlFVTkJha0lzVlVGQlFVRXNVVUZCVVN4RFFVRkRVU3haUVVGRUxFTkJRVklzUjBGQmVVSkRMRkZCUVhwQ08wRkJRMFE3UVVGRFJqczdRVUZGUkZnc1RVRkJRVUVzVlVGQlZUdEJRVU5ZTEV0QmJFWnpReXhEUVc5R2RrTTdRVUZEUVR0QlFVTkJPenM3UVVGRFFTeFJRVUZKV2l4UlFVRktMRVZCUVdNN1FVRkRXQ3huUWtGQlUyZERMRWxCUVZRc1IwRkJaMEk3UVVGRFpqVkNMRkZCUVVGQkxGVkJRVlVzUTBGQlF5eFpRVUZYTzBGQlEzQkNPenRCUVVOQk8wRkJRMEVzWTBGQlNWRXNWVUZCVlN4SFFVRkhReXhoUVVGcVFpeEZRVUZuUXp0QlFVTTVRaXh0UWtGQlQySXNVVUZCVVN4RlFVRm1PMEZCUTBRN08wRkJSVVFzWTBGQlNTeERRVUZEY1VJc1kwRkJZeXhGUVVGdVFpeEZRVUYxUWp0QlFVTnlRbGNzV1VGQlFVRXNTVUZCU1R0QlFVTk1PMEZCUTBZc1UwRldVeXhGUVZWUUxFTkJWazhzUTBGQlZqdEJRVmRFTEU5QldrRXNSMEZCUkR0QlFXRkVMRXRCWkVRc1RVRmpUenRCUVVOTUxHRkJRVTl3UWl4VlFVRlZMRWxCUVVsRExHRkJRWEpDTEVWQlFXOURPMEZCUTJ4RExGbEJRVWx2UWl4SFFVRkhMRWRCUVVkYUxHTkJRV01zUlVGQmVFSTdPMEZCUTBFc1dVRkJTVmtzUjBGQlNpeEZRVUZUTzBGQlExQXNhVUpCUVU5QkxFZEJRVkE3UVVGRFJEdEJRVU5HTzBGQlEwWTdRVUZEUml4SFFUbEhZenM3UVVGQlFUczdRVUZCUVR0QlFXZElaa29zUlVGQlFVRXNZVUZvU0dVc2VVSkJaMGhFWWl4VlFXaElReXhGUVdkSVYydENMRXRCYUVoWUxFVkJaMGhyUWtNc1QwRm9TR3hDTEVWQlowZ3lRanRCUVVONFF5eFJRVUZKUXl4SlFVRkpMRWRCUVVkd1FpeFZRVUZWTEVOQlFVTkJMRlZCUVZVc1EwRkJRMDRzVFVGQldDeEhRVUZ2UWl4RFFVRnlRaXhEUVVGeVFqczdRVUZEUVN4UlFVRkpNRUlzU1VGQlNTeEpRVUZKUVN4SlFVRkpMRU5CUVVOR0xFdEJRVXdzUzBGQlpVRXNTMEZCZGtJc1NVRkJaME5GTEVsQlFVa3NRMEZCUTBRc1QwRkJUQ3hMUVVGcFFrRXNUMEZCY2tRc1JVRkJPRVE3UVVGRE5VUTdRVUZEUVR0QlFVTkJia0lzVFVGQlFVRXNWVUZCVlN4RFFVRkRRU3hWUVVGVkxFTkJRVU5PTEUxQlFWZ3NSMEZCYjBJc1EwRkJja0lzUTBGQlZpeEhRVUZ2UXp0QlFVRkRWU3hSUVVGQlFTeExRVUZMTEVWQlFVVm5RaXhKUVVGSkxFTkJRVU5vUWl4TFFVRk1MRWRCUVdFc1EwRkJja0k3UVVGQmQwSmpMRkZCUVVGQkxFdEJRVXNzUlVGQlJVRXNTMEZCTDBJN1FVRkJjME5ETEZGQlFVRkJMRTlCUVU4c1JVRkJSVUU3UVVGQkwwTXNUMEZCY0VNN1FVRkRSQ3hMUVVwRUxFMUJTVTg3UVVGRFRHNUNMRTFCUVVGQkxGVkJRVlVzUTBGQlEzRkNMRWxCUVZnc1EwRkJaMEk3UVVGQlEycENMRkZCUVVGQkxFdEJRVXNzUlVGQlJTeERRVUZTTzBGQlFWZGpMRkZCUVVGQkxFdEJRVXNzUlVGQlJVRXNTMEZCYkVJN1FVRkJlVUpETEZGQlFVRkJMRTlCUVU4c1JVRkJSVUU3UVVGQmJFTXNUMEZCYUVJN1FVRkRSRHRCUVVOR0xFZEJla2hqT3p0QlFVRkJPenRCUVVGQk8wRkJNRWhtYWtJc1JVRkJRVUVzWVVFeFNHVXNlVUpCTUVoRVN5eFJRVEZJUXl4RlFUQklVM3BDTEZOQk1VaFVMRVZCTUVodlFrUXNVMEV4U0hCQ0xFVkJNRWdyUW5sQ0xGbEJNVWd2UWl4RlFUQklOa003UVVGRE1VUXNVVUZCU1dJc1RVRkJUU3hIUVVGSFdDeFRRVUZUTEVOQlFVTlpMRTFCUVhaQ08wRkJRVUVzVVVGRFNVTXNUVUZCVFN4SFFVRkhaQ3hUUVVGVExFTkJRVU5oTEUxQlJIWkNPMEZCUVVFc1VVRkZTVXNzVFVGQlRTeEhRVUZIVVN4UlFVRlJMRU5CUVVOU0xFMUJSblJDTzBGQlFVRXNVVUZIU1VVc1RVRkJUU3hIUVVGSFJpeE5RVUZOTEVkQlFVZFBMRmxCU0hSQ08wRkJRVUVzVVVGTFNXZENMRmRCUVZjc1IwRkJSeXhEUVV4c1FqczdRVUZOUVN4WFFVRlBka0lzVFVGQlRTeEhRVUZITEVOQlFWUXNSMEZCWVU0c1RVRkJZaXhKUVVGMVFsRXNUVUZCVFN4SFFVRkhMRU5CUVZRc1IwRkJZVTRzVFVGQmNFTXNTVUZCT0VNc1MwRkJTelJDTEUxQlFVd3NRMEZCV1hwRExGTkJRVk1zUTBGQlEybENMRTFCUVUwc1IwRkJSeXhEUVVGV0xFTkJRWEpDTEVWQlFXMURiRUlzVTBGQlV5eERRVUZEYjBJc1RVRkJUU3hIUVVGSExFTkJRVllzUTBGQk5VTXNRMEZCY2tRc1JVRkJaMGc3UVVGRE9VZEdMRTFCUVVGQkxFMUJRVTA3UVVGRFRrVXNUVUZCUVVFc1RVRkJUVHRCUVVOT2NVSXNUVUZCUVVFc1YwRkJWenRCUVVOYU96dEJRVVZFTEZGQlFVbEJMRmRCUVVvc1JVRkJhVUk3UVVGRFptWXNUVUZCUVVFc1VVRkJVU3hEUVVGRFVDeFZRVUZVTEVOQlFXOUNjVUlzU1VGQmNFSXNRMEZCZVVJN1FVRkJRMnBDTEZGQlFVRkJMRXRCUVVzc1JVRkJSV3RDTzBGQlFWSXNUMEZCZWtJN1FVRkRSRHM3UVVGRlJHWXNTVUZCUVVFc1VVRkJVU3hEUVVGRFVpeE5RVUZVTEVkQlFXdENRU3hOUVVGc1FqdEJRVU5CTEZkQlFVOUZMRTFCUVZBN1FVRkRSQ3hIUVRkSll6czdRVUZCUVRzN1FVRkJRVHRCUVN0SlpuTkNMRVZCUVVGQkxFMUJMMGxsTEd0Q1FTdEpVa01zU1VFdlNWRXNSVUVyU1VaRExFdEJMMGxGTEVWQkswbExPMEZCUTJ4Q0xGRkJRVWtzUzBGQlN6RkRMRTlCUVV3c1EwRkJZVEpETEZWQlFXcENMRVZCUVRaQ08wRkJRek5DTEdGQlFVOHNTMEZCU3pORExFOUJRVXdzUTBGQllUSkRMRlZCUVdJc1EwRkJkMEpHTEVsQlFYaENMRVZCUVRoQ1F5eExRVUU1UWl4RFFVRlFPMEZCUTBRc1MwRkdSQ3hOUVVWUE8wRkJRMHdzWVVGQlQwUXNTVUZCU1N4TFFVRkxReXhMUVVGVUxFbEJRMFFzUzBGQlN6RkRMRTlCUVV3c1EwRkJZVFJETEZWQlFXSXNTVUZCTWtKSUxFbEJRVWtzUTBGQlEwa3NWMEZCVEN4UFFVRjFRa2dzUzBGQlN5eERRVUZEUnl4WFFVRk9MRVZCUkhoRU8wRkJSVVE3UVVGRFJpeEhRWFJLWXpzN1FVRkJRVHM3UVVGQlFUdEJRWFZLWm5KRExFVkJRVUZCTEZkQmRrcGxMSFZDUVhWS1NITkRMRXRCZGtwSExFVkJkVXBKTzBGQlEycENMRkZCUVVsYUxFZEJRVWNzUjBGQlJ5eEZRVUZXT3p0QlFVTkJMRk5CUVVzc1NVRkJTV0VzUTBGQlF5eEhRVUZITEVOQlFXSXNSVUZCWjBKQkxFTkJRVU1zUjBGQlIwUXNTMEZCU3l4RFFVRkRia01zVFVGQk1VSXNSVUZCYTBOdlF5eERRVUZETEVWQlFXNURMRVZCUVhWRE8wRkJRM0pETEZWQlFVbEVMRXRCUVVzc1EwRkJRME1zUTBGQlJDeERRVUZVTEVWQlFXTTdRVUZEV21Jc1VVRkJRVUVzUjBGQlJ5eERRVUZEU1N4SlFVRktMRU5CUVZOUkxFdEJRVXNzUTBGQlEwTXNRMEZCUkN4RFFVRmtPMEZCUTBRN1FVRkRSanM3UVVGRFJDeFhRVUZQWWl4SFFVRlFPMEZCUTBRc1IwRXZTbU03TzBGQlFVRTdPMEZCUVVFN1FVRm5TMll6UWl4RlFVRkJRU3hUUVdoTFpTeHhRa0ZuUzB4SUxFdEJhRXRMTEVWQlowdEZPMEZCUTJZc1YwRkJUMEVzUzBGQlVEdEJRVU5FTEVkQmJFdGpPenRCUVVGQk96dEJRVUZCTzBGQmJVdG1TeXhGUVVGQlFTeFJRVzVMWlN4dlFrRnRTMDVNTEV0QmJrdE5MRVZCYlV0RE8wRkJRMlFzVjBGQlQwRXNTMEZCU3l4RFFVRkRORU1zUzBGQlRpeERRVUZaTEVWQlFWb3NRMEZCVUR0QlFVTkVMRWRCY2t0ak96dEJRVUZCT3p0QlFVRkJPMEZCYzB0bU5VSXNSVUZCUVVFc1NVRjBTMlVzWjBKQmMwdFdOa0lzUzBGMFMxVXNSVUZ6UzBnN1FVRkRWaXhYUVVGUFFTeExRVUZMTEVOQlFVTTNRaXhKUVVGT0xFTkJRVmNzUlVGQldDeERRVUZRTzBGQlEwUTdRVUY0UzJNc1EwRkJha0k3TzBGQk1rdEJMRk5CUVZOWExGZEJRVlFzUTBGQmNVSnNReXhKUVVGeVFpeEZRVUV5UW05Q0xGVkJRVE5DTEVWQlFYVkRiRUlzVTBGQmRrTXNSVUZCYTBSRUxGTkJRV3hFTEVWQlFUWkVhME1zWlVGQk4wUXNSVUZCT0VVN1FVRkROVVVzVFVGQlNXdENMRmxCUVZrc1IwRkJSeXhEUVVGdVFqdEJRVUZCTEUxQlEwbERMRmxCUVZrc1IwRkJSMnhETEZWQlFWVXNRMEZCUTA0c1RVRkVPVUk3UVVGQlFTeE5RVVZKU3l4TlFVRk5MRWRCUVVjc1EwRkdZanRCUVVGQkxFMUJSMGxGTEUxQlFVMHNSMEZCUnl4RFFVaGlPenRCUVV0QkxGTkJRVTluUXl4WlFVRlpMRWRCUVVkRExGbEJRWFJDTEVWQlFXOURSQ3haUVVGWkxFVkJRV2hFTEVWQlFXOUVPMEZCUTJ4RUxGRkJRVWxGTEZOQlFWTXNSMEZCUjI1RExGVkJRVlVzUTBGQlEybERMRmxCUVVRc1EwRkJNVUk3TzBGQlEwRXNVVUZCU1N4RFFVRkRSU3hUUVVGVExFTkJRVU5vUWl4UFFVRm1MRVZCUVhkQ08wRkJRM1JDTEZWQlFVa3NRMEZCUTJkQ0xGTkJRVk1zUTBGQlEycENMRXRCUVZnc1NVRkJiMEpJTEdWQlFYaENMRVZCUVhsRE8wRkJRM1pETEZsQlFVazFRaXhMUVVGTExFZEJRVWRNTEZOQlFWTXNRMEZCUTNORUxFdEJRVllzUTBGQlowSnlReXhOUVVGb1FpeEZRVUYzUWtFc1RVRkJUU3hIUVVGSGIwTXNVMEZCVXl4RFFVRkRMMElzUzBGQk0wTXNRMEZCV2p0QlFVTkJha0lzVVVGQlFVRXNTMEZCU3l4SFFVRkhRU3hMUVVGTExFTkJRVU5yUkN4SFFVRk9MRU5CUVZVc1ZVRkJVMnhFTEV0QlFWUXNSVUZCWjBJeVF5eERRVUZvUWl4RlFVRnRRanRCUVVOdVF5eGpRVUZKVVN4UlFVRlJMRWRCUVVkNlJDeFRRVUZUTEVOQlFVTnZRaXhOUVVGTkxFZEJRVWMyUWl4RFFVRldMRU5CUVhoQ08wRkJRMEVzYVVKQlFVOVJMRkZCUVZFc1EwRkJRelZETEUxQlFWUXNSMEZCYTBKUUxFdEJRVXNzUTBGQlEwOHNUVUZCZUVJc1IwRkJhVU0wUXl4UlFVRnFReXhIUVVFMFEyNUVMRXRCUVc1RU8wRkJRMFFzVTBGSVR5eERRVUZTTzBGQlMwRm5SQ3hSUVVGQlFTeFRRVUZUTEVOQlFVTm9SQ3hMUVVGV0xFZEJRV3RDVUN4SlFVRkpMRU5CUVVOMVFpeEpRVUZNTEVOQlFWVm9RaXhMUVVGV0xFTkJRV3hDTzBGQlEwUXNUMEZTUkN4TlFWRlBPMEZCUTB4blJDeFJRVUZCUVN4VFFVRlRMRU5CUVVOb1JDeExRVUZXTEVkQlFXdENVQ3hKUVVGSkxFTkJRVU4xUWl4SlFVRk1MRU5CUVZWeVFpeFRRVUZUTEVOQlFVTnpSQ3hMUVVGV0xFTkJRV2RDY2tNc1RVRkJhRUlzUlVGQmQwSkJMRTFCUVUwc1IwRkJSMjlETEZOQlFWTXNRMEZCUXk5Q0xFdEJRVE5ETEVOQlFWWXNRMEZCYkVJN1FVRkRSRHM3UVVGRFJFd3NUVUZCUVVFc1RVRkJUU3hKUVVGSmIwTXNVMEZCVXl4RFFVRkRMMElzUzBGQmNFSXNRMEZhYzBJc1EwRmpkRUk3TzBGQlEwRXNWVUZCU1N4RFFVRkRLMElzVTBGQlV5eERRVUZEYWtJc1MwRkJaaXhGUVVGelFqdEJRVU53UW1wQ0xGRkJRVUZCTEUxQlFVMHNTVUZCU1d0RExGTkJRVk1zUTBGQlF5OUNMRXRCUVhCQ08wRkJRMFE3UVVGRFJpeExRV3hDUkN4TlFXdENUenRCUVVOTUswSXNUVUZCUVVFc1UwRkJVeXhEUVVGRGFFUXNTMEZCVml4SFFVRnJRbEFzU1VGQlNTeERRVUZEZFVJc1NVRkJUQ3hEUVVGVmRFSXNVMEZCVXl4RFFVRkRkVVFzUzBGQlZpeERRVUZuUW01RExFMUJRV2hDTEVWQlFYZENRU3hOUVVGTkxFZEJRVWRyUXl4VFFVRlRMRU5CUVVNdlFpeExRVUV6UXl4RFFVRldMRU5CUVd4Q08wRkJRMEZJTEUxQlFVRkJMRTFCUVUwc1NVRkJTV3RETEZOQlFWTXNRMEZCUXk5Q0xFdEJRWEJDTEVOQlJrc3NRMEZKVER0QlFVTkJPMEZCUTBFN08wRkJRMEVzVlVGQlNUWkNMRmxCUVZrc1NVRkJTV3BETEZWQlFWVXNRMEZCUTJsRExGbEJRVmtzUjBGQlJ5eERRVUZvUWl4RFFVRldMRU5CUVRaQ1ppeExRVUZxUkN4RlFVRjNSRHRCUVVOMFJDeFpRVUZKY1VJc1IwRkJSeXhIUVVGSGRrTXNWVUZCVlN4RFFVRkRhVU1zV1VGQldTeEhRVUZITEVOQlFXaENMRU5CUVhCQ08wRkJRMEZxUXl4UlFVRkJRU3hWUVVGVkxFTkJRVU5wUXl4WlFVRlpMRWRCUVVjc1EwRkJhRUlzUTBGQlZpeEhRVUVyUW1wRExGVkJRVlVzUTBGQlEybERMRmxCUVVRc1EwRkJla003UVVGRFFXcERMRkZCUVVGQkxGVkJRVlVzUTBGQlEybERMRmxCUVVRc1EwRkJWaXhIUVVFeVFrMHNSMEZCTTBJN1FVRkRSRHRCUVVOR08wRkJRMFlzUjBGMlF6SkZMRU5CZVVNMVJUdEJRVU5CTzBGQlEwRTdPenRCUVVOQkxFMUJRVWxETEdGQlFXRXNSMEZCUjNoRExGVkJRVlVzUTBGQlEydERMRmxCUVZrc1IwRkJSeXhEUVVGb1FpeERRVUU1UWpzN1FVRkRRU3hOUVVGSlFTeFpRVUZaTEVkQlFVY3NRMEZCWml4SlFVTkhMRTlCUVU5TkxHRkJRV0VzUTBGQlEzSkVMRXRCUVhKQ0xFdEJRU3RDTEZGQlJHeERMRXRCUlVseFJDeGhRVUZoTEVOQlFVTjBRaXhMUVVGa0xFbEJRWFZDYzBJc1lVRkJZU3hEUVVGRGNrSXNUMEZHZWtNc1MwRkhSM1pETEVsQlFVa3NRMEZCUXpKRExFMUJRVXdzUTBGQldTeEZRVUZhTEVWQlFXZENhVUlzWVVGQllTeERRVUZEY2tRc1MwRkJPVUlzUTBGSVVDeEZRVWMyUXp0QlFVTXpRMkVzU1VGQlFVRXNWVUZCVlN4RFFVRkRhME1zV1VGQldTeEhRVUZITEVOQlFXaENMRU5CUVZZc1EwRkJOa0l2UXl4TFFVRTNRaXhKUVVGelEzRkVMR0ZCUVdFc1EwRkJRM0pFTEV0QlFYQkVPMEZCUTBGaExFbEJRVUZCTEZWQlFWVXNRMEZCUTNsRExFZEJRVmc3UVVGRFJEczdRVUZGUkN4VFFVRlBla01zVlVGQlVEdEJRVU5FT3p0QlFVVkVMRk5CUVZOWkxGTkJRVlFzUTBGQmJVSTRRaXhKUVVGdVFpeEZRVUY1UWp0QlFVTjJRaXhUUVVGUE8wRkJRVVV6UXl4SlFVRkJRU3hOUVVGTkxFVkJRVVV5UXl4SlFVRkpMRU5CUVVNelF5eE5RVUZtTzBGQlFYVkNReXhKUVVGQlFTeFZRVUZWTEVWQlFVVXdReXhKUVVGSkxFTkJRVU14UXl4VlFVRk1MRU5CUVdkQ2IwTXNTMEZCYUVJc1EwRkJjMElzUTBGQmRFSTdRVUZCYmtNc1IwRkJVRHRCUVVORUlpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2laWGh3YjNKMElHUmxabUYxYkhRZ1puVnVZM1JwYjI0Z1JHbG1aaWdwSUh0OVhHNWNia1JwWm1ZdWNISnZkRzkwZVhCbElEMGdlMXh1SUNCa2FXWm1LRzlzWkZOMGNtbHVaeXdnYm1WM1UzUnlhVzVuTENCdmNIUnBiMjV6SUQwZ2UzMHBJSHRjYmlBZ0lDQnNaWFFnWTJGc2JHSmhZMnNnUFNCdmNIUnBiMjV6TG1OaGJHeGlZV05yTzF4dUlDQWdJR2xtSUNoMGVYQmxiMllnYjNCMGFXOXVjeUE5UFQwZ0oyWjFibU4wYVc5dUp5a2dlMXh1SUNBZ0lDQWdZMkZzYkdKaFkyc2dQU0J2Y0hScGIyNXpPMXh1SUNBZ0lDQWdiM0IwYVc5dWN5QTlJSHQ5TzF4dUlDQWdJSDFjYmlBZ0lDQjBhR2x6TG05d2RHbHZibk1nUFNCdmNIUnBiMjV6TzF4dVhHNGdJQ0FnYkdWMElITmxiR1lnUFNCMGFHbHpPMXh1WEc0Z0lDQWdablZ1WTNScGIyNGdaRzl1WlNoMllXeDFaU2tnZTF4dUlDQWdJQ0FnYVdZZ0tHTmhiR3hpWVdOcktTQjdYRzRnSUNBZ0lDQWdJSE5sZEZScGJXVnZkWFFvWm5WdVkzUnBiMjRvS1NCN0lHTmhiR3hpWVdOcktIVnVaR1ZtYVc1bFpDd2dkbUZzZFdVcE95QjlMQ0F3S1R0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUhSeWRXVTdYRzRnSUNBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ0lDQnlaWFIxY200Z2RtRnNkV1U3WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmVnh1WEc0Z0lDQWdMeThnUVd4c2IzY2djM1ZpWTJ4aGMzTmxjeUIwYnlCdFlYTnpZV2RsSUhSb1pTQnBibkIxZENCd2NtbHZjaUIwYnlCeWRXNXVhVzVuWEc0Z0lDQWdiMnhrVTNSeWFXNW5JRDBnZEdocGN5NWpZWE4wU1c1d2RYUW9iMnhrVTNSeWFXNW5LVHRjYmlBZ0lDQnVaWGRUZEhKcGJtY2dQU0IwYUdsekxtTmhjM1JKYm5CMWRDaHVaWGRUZEhKcGJtY3BPMXh1WEc0Z0lDQWdiMnhrVTNSeWFXNW5JRDBnZEdocGN5NXlaVzF2ZG1WRmJYQjBlU2gwYUdsekxuUnZhMlZ1YVhwbEtHOXNaRk4wY21sdVp5a3BPMXh1SUNBZ0lHNWxkMU4wY21sdVp5QTlJSFJvYVhNdWNtVnRiM1psUlcxd2RIa29kR2hwY3k1MGIydGxibWw2WlNodVpYZFRkSEpwYm1jcEtUdGNibHh1SUNBZ0lHeGxkQ0J1WlhkTVpXNGdQU0J1WlhkVGRISnBibWN1YkdWdVozUm9MQ0J2YkdSTVpXNGdQU0J2YkdSVGRISnBibWN1YkdWdVozUm9PMXh1SUNBZ0lHeGxkQ0JsWkdsMFRHVnVaM1JvSUQwZ01UdGNiaUFnSUNCc1pYUWdiV0Y0UldScGRFeGxibWQwYUNBOUlHNWxkMHhsYmlBcklHOXNaRXhsYmp0Y2JpQWdJQ0JzWlhRZ1ltVnpkRkJoZEdnZ1BTQmJleUJ1WlhkUWIzTTZJQzB4TENCamIyMXdiMjVsYm5Sek9pQmJYU0I5WFR0Y2JseHVJQ0FnSUM4dklGTmxaV1FnWldScGRFeGxibWQwYUNBOUlEQXNJR2t1WlM0Z2RHaGxJR052Ym5SbGJuUWdjM1JoY25SeklIZHBkR2dnZEdobElITmhiV1VnZG1Gc2RXVnpYRzRnSUNBZ2JHVjBJRzlzWkZCdmN5QTlJSFJvYVhNdVpYaDBjbUZqZEVOdmJXMXZiaWhpWlhOMFVHRjBhRnN3WFN3Z2JtVjNVM1J5YVc1bkxDQnZiR1JUZEhKcGJtY3NJREFwTzF4dUlDQWdJR2xtSUNoaVpYTjBVR0YwYUZzd1hTNXVaWGRRYjNNZ0t5QXhJRDQ5SUc1bGQweGxiaUFtSmlCdmJHUlFiM01nS3lBeElENDlJRzlzWkV4bGJpa2dlMXh1SUNBZ0lDQWdMeThnU1dSbGJuUnBkSGtnY0dWeUlIUm9aU0JsY1hWaGJHbDBlU0JoYm1RZ2RHOXJaVzVwZW1WeVhHNGdJQ0FnSUNCeVpYUjFjbTRnWkc5dVpTaGJlM1poYkhWbE9pQjBhR2x6TG1wdmFXNG9ibVYzVTNSeWFXNW5LU3dnWTI5MWJuUTZJRzVsZDFOMGNtbHVaeTVzWlc1bmRHaDlYU2s3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdMeThnVFdGcGJpQjNiM0pyWlhJZ2JXVjBhRzlrTGlCamFHVmphM01nWVd4c0lIQmxjbTExZEdGMGFXOXVjeUJ2WmlCaElHZHBkbVZ1SUdWa2FYUWdiR1Z1WjNSb0lHWnZjaUJoWTJObGNIUmhibU5sTGx4dUlDQWdJR1oxYm1OMGFXOXVJR1Y0WldORlpHbDBUR1Z1WjNSb0tDa2dlMXh1SUNBZ0lDQWdabTl5SUNoc1pYUWdaR2xoWjI5dVlXeFFZWFJvSUQwZ0xURWdLaUJsWkdsMFRHVnVaM1JvT3lCa2FXRm5iMjVoYkZCaGRHZ2dQRDBnWldScGRFeGxibWQwYURzZ1pHbGhaMjl1WVd4UVlYUm9JQ3M5SURJcElIdGNiaUFnSUNBZ0lDQWdiR1YwSUdKaGMyVlFZWFJvTzF4dUlDQWdJQ0FnSUNCc1pYUWdZV1JrVUdGMGFDQTlJR0psYzNSUVlYUm9XMlJwWVdkdmJtRnNVR0YwYUNBdElERmRMRnh1SUNBZ0lDQWdJQ0FnSUNBZ2NtVnRiM1psVUdGMGFDQTlJR0psYzNSUVlYUm9XMlJwWVdkdmJtRnNVR0YwYUNBcklERmRMRnh1SUNBZ0lDQWdJQ0FnSUNBZ2IyeGtVRzl6SUQwZ0tISmxiVzkyWlZCaGRHZ2dQeUJ5WlcxdmRtVlFZWFJvTG01bGQxQnZjeUE2SURBcElDMGdaR2xoWjI5dVlXeFFZWFJvTzF4dUlDQWdJQ0FnSUNCcFppQW9ZV1JrVUdGMGFDa2dlMXh1SUNBZ0lDQWdJQ0FnSUM4dklFNXZJRzl1WlNCbGJITmxJR2x6SUdkdmFXNW5JSFJ2SUdGMGRHVnRjSFFnZEc4Z2RYTmxJSFJvYVhNZ2RtRnNkV1VzSUdOc1pXRnlJR2wwWEc0Z0lDQWdJQ0FnSUNBZ1ltVnpkRkJoZEdoYlpHbGhaMjl1WVd4UVlYUm9JQzBnTVYwZ1BTQjFibVJsWm1sdVpXUTdYRzRnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNCc1pYUWdZMkZ1UVdSa0lEMGdZV1JrVUdGMGFDQW1KaUJoWkdSUVlYUm9MbTVsZDFCdmN5QXJJREVnUENCdVpYZE1aVzRzWEc0Z0lDQWdJQ0FnSUNBZ0lDQmpZVzVTWlcxdmRtVWdQU0J5WlcxdmRtVlFZWFJvSUNZbUlEQWdQRDBnYjJ4a1VHOXpJQ1ltSUc5c1pGQnZjeUE4SUc5c1pFeGxianRjYmlBZ0lDQWdJQ0FnYVdZZ0tDRmpZVzVCWkdRZ0ppWWdJV05oYmxKbGJXOTJaU2tnZTF4dUlDQWdJQ0FnSUNBZ0lDOHZJRWxtSUhSb2FYTWdjR0YwYUNCcGN5QmhJSFJsY20xcGJtRnNJSFJvWlc0Z2NISjFibVZjYmlBZ0lDQWdJQ0FnSUNCaVpYTjBVR0YwYUZ0a2FXRm5iMjVoYkZCaGRHaGRJRDBnZFc1a1pXWnBibVZrTzF4dUlDQWdJQ0FnSUNBZ0lHTnZiblJwYm5WbE8xeHVJQ0FnSUNBZ0lDQjlYRzVjYmlBZ0lDQWdJQ0FnTHk4Z1UyVnNaV04wSUhSb1pTQmthV0ZuYjI1aGJDQjBhR0YwSUhkbElIZGhiblFnZEc4Z1luSmhibU5vSUdaeWIyMHVJRmRsSUhObGJHVmpkQ0IwYUdVZ2NISnBiM0pjYmlBZ0lDQWdJQ0FnTHk4Z2NHRjBhQ0IzYUc5elpTQndiM05wZEdsdmJpQnBiaUIwYUdVZ2JtVjNJSE4wY21sdVp5QnBjeUIwYUdVZ1ptRnlkR2hsYzNRZ1puSnZiU0IwYUdVZ2IzSnBaMmx1WEc0Z0lDQWdJQ0FnSUM4dklHRnVaQ0JrYjJWeklHNXZkQ0J3WVhOeklIUm9aU0JpYjNWdVpITWdiMllnZEdobElHUnBabVlnWjNKaGNHaGNiaUFnSUNBZ0lDQWdhV1lnS0NGallXNUJaR1FnZkh3Z0tHTmhibEpsYlc5MlpTQW1KaUJoWkdSUVlYUm9MbTVsZDFCdmN5QThJSEpsYlc5MlpWQmhkR2d1Ym1WM1VHOXpLU2tnZTF4dUlDQWdJQ0FnSUNBZ0lHSmhjMlZRWVhSb0lEMGdZMnh2Ym1WUVlYUm9LSEpsYlc5MlpWQmhkR2dwTzF4dUlDQWdJQ0FnSUNBZ0lITmxiR1l1Y0hWemFFTnZiWEJ2Ym1WdWRDaGlZWE5sVUdGMGFDNWpiMjF3YjI1bGJuUnpMQ0IxYm1SbFptbHVaV1FzSUhSeWRXVXBPMXh1SUNBZ0lDQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdJQ0FnSUdKaGMyVlFZWFJvSUQwZ1lXUmtVR0YwYURzZ0x5OGdUbThnYm1WbFpDQjBieUJqYkc5dVpTd2dkMlVuZG1VZ2NIVnNiR1ZrSUdsMElHWnliMjBnZEdobElHeHBjM1JjYmlBZ0lDQWdJQ0FnSUNCaVlYTmxVR0YwYUM1dVpYZFFiM01yS3p0Y2JpQWdJQ0FnSUNBZ0lDQnpaV3htTG5CMWMyaERiMjF3YjI1bGJuUW9ZbUZ6WlZCaGRHZ3VZMjl0Y0c5dVpXNTBjeXdnZEhKMVpTd2dkVzVrWldacGJtVmtLVHRjYmlBZ0lDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNBZ0lHOXNaRkJ2Y3lBOUlITmxiR1l1WlhoMGNtRmpkRU52YlcxdmJpaGlZWE5sVUdGMGFDd2dibVYzVTNSeWFXNW5MQ0J2YkdSVGRISnBibWNzSUdScFlXZHZibUZzVUdGMGFDazdYRzVjYmlBZ0lDQWdJQ0FnTHk4Z1NXWWdkMlVnYUdGMlpTQm9hWFFnZEdobElHVnVaQ0J2WmlCaWIzUm9JSE4wY21sdVozTXNJSFJvWlc0Z2QyVWdZWEpsSUdSdmJtVmNiaUFnSUNBZ0lDQWdhV1lnS0dKaGMyVlFZWFJvTG01bGQxQnZjeUFySURFZ1BqMGdibVYzVEdWdUlDWW1JRzlzWkZCdmN5QXJJREVnUGowZ2IyeGtUR1Z1S1NCN1hHNGdJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlHUnZibVVvWW5WcGJHUldZV3gxWlhNb2MyVnNaaXdnWW1GelpWQmhkR2d1WTI5dGNHOXVaVzUwY3l3Z2JtVjNVM1J5YVc1bkxDQnZiR1JUZEhKcGJtY3NJSE5sYkdZdWRYTmxURzl1WjJWemRGUnZhMlZ1S1NrN1hHNGdJQ0FnSUNBZ0lIMGdaV3h6WlNCN1hHNGdJQ0FnSUNBZ0lDQWdMeThnVDNSb1pYSjNhWE5sSUhSeVlXTnJJSFJvYVhNZ2NHRjBhQ0JoY3lCaElIQnZkR1Z1ZEdsaGJDQmpZVzVrYVdSaGRHVWdZVzVrSUdOdmJuUnBiblZsTGx4dUlDQWdJQ0FnSUNBZ0lHSmxjM1JRWVhSb1cyUnBZV2R2Ym1Gc1VHRjBhRjBnUFNCaVlYTmxVR0YwYUR0Y2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2ZWeHVYRzRnSUNBZ0lDQmxaR2wwVEdWdVozUm9LeXM3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdMeThnVUdWeVptOXliWE1nZEdobElHeGxibWQwYUNCdlppQmxaR2wwSUdsMFpYSmhkR2x2Ymk0Z1NYTWdZU0JpYVhRZ1puVm5iSGtnWVhNZ2RHaHBjeUJvWVhNZ2RHOGdjM1Z3Y0c5eWRDQjBhR1ZjYmlBZ0lDQXZMeUJ6ZVc1aklHRnVaQ0JoYzNsdVl5QnRiMlJsSUhkb2FXTm9JR2x6SUc1bGRtVnlJR1oxYmk0Z1RHOXZjSE1nYjNabGNpQmxlR1ZqUldScGRFeGxibWQwYUNCMWJuUnBiQ0JoSUhaaGJIVmxYRzRnSUNBZ0x5OGdhWE1nY0hKdlpIVmpaV1F1WEc0Z0lDQWdhV1lnS0dOaGJHeGlZV05yS1NCN1hHNGdJQ0FnSUNBb1puVnVZM1JwYjI0Z1pYaGxZeWdwSUh0Y2JpQWdJQ0FnSUNBZ2MyVjBWR2x0Wlc5MWRDaG1kVzVqZEdsdmJpZ3BJSHRjYmlBZ0lDQWdJQ0FnSUNBdkx5QlVhR2x6SUhOb2IzVnNaQ0J1YjNRZ2FHRndjR1Z1TENCaWRYUWdkMlVnZDJGdWRDQjBieUJpWlNCellXWmxMbHh1SUNBZ0lDQWdJQ0FnSUM4cUlHbHpkR0Z1WW5Wc0lHbG5ibTl5WlNCdVpYaDBJQ292WEc0Z0lDQWdJQ0FnSUNBZ2FXWWdLR1ZrYVhSTVpXNW5kR2dnUGlCdFlYaEZaR2wwVEdWdVozUm9LU0I3WEc0Z0lDQWdJQ0FnSUNBZ0lDQnlaWFIxY200Z1kyRnNiR0poWTJzb0tUdGNiaUFnSUNBZ0lDQWdJQ0I5WEc1Y2JpQWdJQ0FnSUNBZ0lDQnBaaUFvSVdWNFpXTkZaR2wwVEdWdVozUm9LQ2twSUh0Y2JpQWdJQ0FnSUNBZ0lDQWdJR1Y0WldNb0tUdGNiaUFnSUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0FnSUgwc0lEQXBPMXh1SUNBZ0lDQWdmU2dwS1R0Y2JpQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdkMmhwYkdVZ0tHVmthWFJNWlc1bmRHZ2dQRDBnYldGNFJXUnBkRXhsYm1kMGFDa2dlMXh1SUNBZ0lDQWdJQ0JzWlhRZ2NtVjBJRDBnWlhobFkwVmthWFJNWlc1bmRHZ29LVHRjYmlBZ0lDQWdJQ0FnYVdZZ0tISmxkQ2tnZTF4dUlDQWdJQ0FnSUNBZ0lISmxkSFZ5YmlCeVpYUTdYRzRnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzRnSUgwc1hHNWNiaUFnY0hWemFFTnZiWEJ2Ym1WdWRDaGpiMjF3YjI1bGJuUnpMQ0JoWkdSbFpDd2djbVZ0YjNabFpDa2dlMXh1SUNBZ0lHeGxkQ0JzWVhOMElEMGdZMjl0Y0c5dVpXNTBjMXRqYjIxd2IyNWxiblJ6TG14bGJtZDBhQ0F0SURGZE8xeHVJQ0FnSUdsbUlDaHNZWE4wSUNZbUlHeGhjM1F1WVdSa1pXUWdQVDA5SUdGa1pHVmtJQ1ltSUd4aGMzUXVjbVZ0YjNabFpDQTlQVDBnY21WdGIzWmxaQ2tnZTF4dUlDQWdJQ0FnTHk4Z1YyVWdibVZsWkNCMGJ5QmpiRzl1WlNCb1pYSmxJR0Z6SUhSb1pTQmpiMjF3YjI1bGJuUWdZMnh2Ym1VZ2IzQmxjbUYwYVc5dUlHbHpJR3AxYzNSY2JpQWdJQ0FnSUM4dklHRnpJSE5vWVd4c2IzY2dZWEp5WVhrZ1kyeHZibVZjYmlBZ0lDQWdJR052YlhCdmJtVnVkSE5iWTI5dGNHOXVaVzUwY3k1c1pXNW5kR2dnTFNBeFhTQTlJSHRqYjNWdWREb2diR0Z6ZEM1amIzVnVkQ0FySURFc0lHRmtaR1ZrT2lCaFpHUmxaQ3dnY21WdGIzWmxaRG9nY21WdGIzWmxaQ0I5TzF4dUlDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQmpiMjF3YjI1bGJuUnpMbkIxYzJnb2UyTnZkVzUwT2lBeExDQmhaR1JsWkRvZ1lXUmtaV1FzSUhKbGJXOTJaV1E2SUhKbGJXOTJaV1FnZlNrN1hHNGdJQ0FnZlZ4dUlDQjlMRnh1SUNCbGVIUnlZV04wUTI5dGJXOXVLR0poYzJWUVlYUm9MQ0J1WlhkVGRISnBibWNzSUc5c1pGTjBjbWx1Wnl3Z1pHbGhaMjl1WVd4UVlYUm9LU0I3WEc0Z0lDQWdiR1YwSUc1bGQweGxiaUE5SUc1bGQxTjBjbWx1Wnk1c1pXNW5kR2dzWEc0Z0lDQWdJQ0FnSUc5c1pFeGxiaUE5SUc5c1pGTjBjbWx1Wnk1c1pXNW5kR2dzWEc0Z0lDQWdJQ0FnSUc1bGQxQnZjeUE5SUdKaGMyVlFZWFJvTG01bGQxQnZjeXhjYmlBZ0lDQWdJQ0FnYjJ4a1VHOXpJRDBnYm1WM1VHOXpJQzBnWkdsaFoyOXVZV3hRWVhSb0xGeHVYRzRnSUNBZ0lDQWdJR052YlcxdmJrTnZkVzUwSUQwZ01EdGNiaUFnSUNCM2FHbHNaU0FvYm1WM1VHOXpJQ3NnTVNBOElHNWxkMHhsYmlBbUppQnZiR1JRYjNNZ0t5QXhJRHdnYjJ4a1RHVnVJQ1ltSUhSb2FYTXVaWEYxWVd4ektHNWxkMU4wY21sdVoxdHVaWGRRYjNNZ0t5QXhYU3dnYjJ4a1UzUnlhVzVuVzI5c1pGQnZjeUFySURGZEtTa2dlMXh1SUNBZ0lDQWdibVYzVUc5ekt5czdYRzRnSUNBZ0lDQnZiR1JRYjNNckt6dGNiaUFnSUNBZ0lHTnZiVzF2YmtOdmRXNTBLeXM3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdhV1lnS0dOdmJXMXZia052ZFc1MEtTQjdYRzRnSUNBZ0lDQmlZWE5sVUdGMGFDNWpiMjF3YjI1bGJuUnpMbkIxYzJnb2UyTnZkVzUwT2lCamIyMXRiMjVEYjNWdWRIMHBPMXh1SUNBZ0lIMWNibHh1SUNBZ0lHSmhjMlZRWVhSb0xtNWxkMUJ2Y3lBOUlHNWxkMUJ2Y3p0Y2JpQWdJQ0J5WlhSMWNtNGdiMnhrVUc5ek8xeHVJQ0I5TEZ4dVhHNGdJR1Z4ZFdGc2N5aHNaV1owTENCeWFXZG9kQ2tnZTF4dUlDQWdJR2xtSUNoMGFHbHpMbTl3ZEdsdmJuTXVZMjl0Y0dGeVlYUnZjaWtnZTF4dUlDQWdJQ0FnY21WMGRYSnVJSFJvYVhNdWIzQjBhVzl1Y3k1amIyMXdZWEpoZEc5eUtHeGxablFzSUhKcFoyaDBLVHRjYmlBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUd4bFpuUWdQVDA5SUhKcFoyaDBYRzRnSUNBZ0lDQWdJSHg4SUNoMGFHbHpMbTl3ZEdsdmJuTXVhV2R1YjNKbFEyRnpaU0FtSmlCc1pXWjBMblJ2VEc5M1pYSkRZWE5sS0NrZ1BUMDlJSEpwWjJoMExuUnZURzkzWlhKRFlYTmxLQ2twTzF4dUlDQWdJSDFjYmlBZ2ZTeGNiaUFnY21WdGIzWmxSVzF3ZEhrb1lYSnlZWGtwSUh0Y2JpQWdJQ0JzWlhRZ2NtVjBJRDBnVzEwN1hHNGdJQ0FnWm05eUlDaHNaWFFnYVNBOUlEQTdJR2tnUENCaGNuSmhlUzVzWlc1bmRHZzdJR2tyS3lrZ2UxeHVJQ0FnSUNBZ2FXWWdLR0Z5Y21GNVcybGRLU0I3WEc0Z0lDQWdJQ0FnSUhKbGRDNXdkWE5vS0dGeWNtRjVXMmxkS1R0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0I5WEc0Z0lDQWdjbVYwZFhKdUlISmxkRHRjYmlBZ2ZTeGNiaUFnWTJGemRFbHVjSFYwS0haaGJIVmxLU0I3WEc0Z0lDQWdjbVYwZFhKdUlIWmhiSFZsTzF4dUlDQjlMRnh1SUNCMGIydGxibWw2WlNoMllXeDFaU2tnZTF4dUlDQWdJSEpsZEhWeWJpQjJZV3gxWlM1emNHeHBkQ2duSnlrN1hHNGdJSDBzWEc0Z0lHcHZhVzRvWTJoaGNuTXBJSHRjYmlBZ0lDQnlaWFIxY200Z1kyaGhjbk11YW05cGJpZ25KeWs3WEc0Z0lIMWNibjA3WEc1Y2JtWjFibU4wYVc5dUlHSjFhV3hrVm1Gc2RXVnpLR1JwWm1Zc0lHTnZiWEJ2Ym1WdWRITXNJRzVsZDFOMGNtbHVaeXdnYjJ4a1UzUnlhVzVuTENCMWMyVk1iMjVuWlhOMFZHOXJaVzRwSUh0Y2JpQWdiR1YwSUdOdmJYQnZibVZ1ZEZCdmN5QTlJREFzWEc0Z0lDQWdJQ0JqYjIxd2IyNWxiblJNWlc0Z1BTQmpiMjF3YjI1bGJuUnpMbXhsYm1kMGFDeGNiaUFnSUNBZ0lHNWxkMUJ2Y3lBOUlEQXNYRzRnSUNBZ0lDQnZiR1JRYjNNZ1BTQXdPMXh1WEc0Z0lHWnZjaUFvT3lCamIyMXdiMjVsYm5SUWIzTWdQQ0JqYjIxd2IyNWxiblJNWlc0N0lHTnZiWEJ2Ym1WdWRGQnZjeXNyS1NCN1hHNGdJQ0FnYkdWMElHTnZiWEJ2Ym1WdWRDQTlJR052YlhCdmJtVnVkSE5iWTI5dGNHOXVaVzUwVUc5elhUdGNiaUFnSUNCcFppQW9JV052YlhCdmJtVnVkQzV5WlcxdmRtVmtLU0I3WEc0Z0lDQWdJQ0JwWmlBb0lXTnZiWEJ2Ym1WdWRDNWhaR1JsWkNBbUppQjFjMlZNYjI1blpYTjBWRzlyWlc0cElIdGNiaUFnSUNBZ0lDQWdiR1YwSUhaaGJIVmxJRDBnYm1WM1UzUnlhVzVuTG5Oc2FXTmxLRzVsZDFCdmN5d2dibVYzVUc5eklDc2dZMjl0Y0c5dVpXNTBMbU52ZFc1MEtUdGNiaUFnSUNBZ0lDQWdkbUZzZFdVZ1BTQjJZV3gxWlM1dFlYQW9ablZ1WTNScGIyNG9kbUZzZFdVc0lHa3BJSHRjYmlBZ0lDQWdJQ0FnSUNCc1pYUWdiMnhrVm1Gc2RXVWdQU0J2YkdSVGRISnBibWRiYjJ4a1VHOXpJQ3NnYVYwN1hHNGdJQ0FnSUNBZ0lDQWdjbVYwZFhKdUlHOXNaRlpoYkhWbExteGxibWQwYUNBK0lIWmhiSFZsTG14bGJtZDBhQ0EvSUc5c1pGWmhiSFZsSURvZ2RtRnNkV1U3WEc0Z0lDQWdJQ0FnSUgwcE8xeHVYRzRnSUNBZ0lDQWdJR052YlhCdmJtVnVkQzUyWVd4MVpTQTlJR1JwWm1ZdWFtOXBiaWgyWVd4MVpTazdYRzRnSUNBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ0lDQmpiMjF3YjI1bGJuUXVkbUZzZFdVZ1BTQmthV1ptTG1wdmFXNG9ibVYzVTNSeWFXNW5Mbk5zYVdObEtHNWxkMUJ2Y3l3Z2JtVjNVRzl6SUNzZ1kyOXRjRzl1Wlc1MExtTnZkVzUwS1NrN1hHNGdJQ0FnSUNCOVhHNGdJQ0FnSUNCdVpYZFFiM01nS3owZ1kyOXRjRzl1Wlc1MExtTnZkVzUwTzF4dVhHNGdJQ0FnSUNBdkx5QkRiMjF0YjI0Z1kyRnpaVnh1SUNBZ0lDQWdhV1lnS0NGamIyMXdiMjVsYm5RdVlXUmtaV1FwSUh0Y2JpQWdJQ0FnSUNBZ2IyeGtVRzl6SUNzOUlHTnZiWEJ2Ym1WdWRDNWpiM1Z1ZER0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdZMjl0Y0c5dVpXNTBMblpoYkhWbElEMGdaR2xtWmk1cWIybHVLRzlzWkZOMGNtbHVaeTV6YkdsalpTaHZiR1JRYjNNc0lHOXNaRkJ2Y3lBcklHTnZiWEJ2Ym1WdWRDNWpiM1Z1ZENrcE8xeHVJQ0FnSUNBZ2IyeGtVRzl6SUNzOUlHTnZiWEJ2Ym1WdWRDNWpiM1Z1ZER0Y2JseHVJQ0FnSUNBZ0x5OGdVbVYyWlhKelpTQmhaR1FnWVc1a0lISmxiVzkyWlNCemJ5QnlaVzF2ZG1WeklHRnlaU0J2ZFhSd2RYUWdabWx5YzNRZ2RHOGdiV0YwWTJnZ1kyOXRiVzl1SUdOdmJuWmxiblJwYjI1Y2JpQWdJQ0FnSUM4dklGUm9aU0JrYVdabWFXNW5JR0ZzWjI5eWFYUm9iU0JwY3lCMGFXVmtJSFJ2SUdGa1pDQjBhR1Z1SUhKbGJXOTJaU0J2ZFhSd2RYUWdZVzVrSUhSb2FYTWdhWE1nZEdobElITnBiWEJzWlhOMFhHNGdJQ0FnSUNBdkx5QnliM1YwWlNCMGJ5Qm5aWFFnZEdobElHUmxjMmx5WldRZ2IzVjBjSFYwSUhkcGRHZ2diV2x1YVcxaGJDQnZkbVZ5YUdWaFpDNWNiaUFnSUNBZ0lHbG1JQ2hqYjIxd2IyNWxiblJRYjNNZ0ppWWdZMjl0Y0c5dVpXNTBjMXRqYjIxd2IyNWxiblJRYjNNZ0xTQXhYUzVoWkdSbFpDa2dlMXh1SUNBZ0lDQWdJQ0JzWlhRZ2RHMXdJRDBnWTI5dGNHOXVaVzUwYzF0amIyMXdiMjVsYm5SUWIzTWdMU0F4WFR0Y2JpQWdJQ0FnSUNBZ1kyOXRjRzl1Wlc1MGMxdGpiMjF3YjI1bGJuUlFiM01nTFNBeFhTQTlJR052YlhCdmJtVnVkSE5iWTI5dGNHOXVaVzUwVUc5elhUdGNiaUFnSUNBZ0lDQWdZMjl0Y0c5dVpXNTBjMXRqYjIxd2IyNWxiblJRYjNOZElEMGdkRzF3TzF4dUlDQWdJQ0FnZlZ4dUlDQWdJSDFjYmlBZ2ZWeHVYRzRnSUM4dklGTndaV05wWVd3Z1kyRnpaU0JvWVc1a2JHVWdabTl5SUhkb1pXNGdiMjVsSUhSbGNtMXBibUZzSUdseklHbG5ibTl5WldRZ0tHa3VaUzRnZDJocGRHVnpjR0ZqWlNrdVhHNGdJQzh2SUVadmNpQjBhR2x6SUdOaGMyVWdkMlVnYldWeVoyVWdkR2hsSUhSbGNtMXBibUZzSUdsdWRHOGdkR2hsSUhCeWFXOXlJSE4wY21sdVp5QmhibVFnWkhKdmNDQjBhR1VnWTJoaGJtZGxMbHh1SUNBdkx5QlVhR2x6SUdseklHOXViSGtnWVhaaGFXeGhZbXhsSUdadmNpQnpkSEpwYm1jZ2JXOWtaUzVjYmlBZ2JHVjBJR3hoYzNSRGIyMXdiMjVsYm5RZ1BTQmpiMjF3YjI1bGJuUnpXMk52YlhCdmJtVnVkRXhsYmlBdElERmRPMXh1SUNCcFppQW9ZMjl0Y0c5dVpXNTBUR1Z1SUQ0Z01WeHVJQ0FnSUNBZ0ppWWdkSGx3Wlc5bUlHeGhjM1JEYjIxd2IyNWxiblF1ZG1Gc2RXVWdQVDA5SUNkemRISnBibWNuWEc0Z0lDQWdJQ0FtSmlBb2JHRnpkRU52YlhCdmJtVnVkQzVoWkdSbFpDQjhmQ0JzWVhOMFEyOXRjRzl1Wlc1MExuSmxiVzkyWldRcFhHNGdJQ0FnSUNBbUppQmthV1ptTG1WeGRXRnNjeWduSnl3Z2JHRnpkRU52YlhCdmJtVnVkQzUyWVd4MVpTa3BJSHRjYmlBZ0lDQmpiMjF3YjI1bGJuUnpXMk52YlhCdmJtVnVkRXhsYmlBdElESmRMblpoYkhWbElDczlJR3hoYzNSRGIyMXdiMjVsYm5RdWRtRnNkV1U3WEc0Z0lDQWdZMjl0Y0c5dVpXNTBjeTV3YjNBb0tUdGNiaUFnZlZ4dVhHNGdJSEpsZEhWeWJpQmpiMjF3YjI1bGJuUnpPMXh1ZlZ4dVhHNW1kVzVqZEdsdmJpQmpiRzl1WlZCaGRHZ29jR0YwYUNrZ2UxeHVJQ0J5WlhSMWNtNGdleUJ1WlhkUWIzTTZJSEJoZEdndWJtVjNVRzl6TENCamIyMXdiMjVsYm5Sek9pQndZWFJvTG1OdmJYQnZibVZ1ZEhNdWMyeHBZMlVvTUNrZ2ZUdGNibjFjYmlKZGZRPT1cbiIsIi8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cblwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kaWZmQ2hhcnMgPSBkaWZmQ2hhcnM7XG5leHBvcnRzLmNoYXJhY3RlckRpZmYgPSB2b2lkIDA7XG5cbi8qaXN0YW5idWwgaWdub3JlIGVuZCovXG52YXJcbi8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cbl9iYXNlID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChyZXF1aXJlKFwiLi9iYXNlXCIpKVxuLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbjtcblxuLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqLyBmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxuLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbnZhciBjaGFyYWN0ZXJEaWZmID0gbmV3XG4vKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG5fYmFzZVxuLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbltcbi8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cblwiZGVmYXVsdFwiXG4vKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuXSgpO1xuXG4vKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG5leHBvcnRzLmNoYXJhY3RlckRpZmYgPSBjaGFyYWN0ZXJEaWZmO1xuXG4vKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuZnVuY3Rpb24gZGlmZkNoYXJzKG9sZFN0ciwgbmV3U3RyLCBvcHRpb25zKSB7XG4gIHJldHVybiBjaGFyYWN0ZXJEaWZmLmRpZmYob2xkU3RyLCBuZXdTdHIsIG9wdGlvbnMpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5a2FXWm1MMk5vWVhKaFkzUmxjaTVxY3lKZExDSnVZVzFsY3lJNld5SmphR0Z5WVdOMFpYSkVhV1ptSWl3aVJHbG1aaUlzSW1ScFptWkRhR0Z5Y3lJc0ltOXNaRk4wY2lJc0ltNWxkMU4wY2lJc0ltOXdkR2x2Ym5NaUxDSmthV1ptSWwwc0ltMWhjSEJwYm1keklqb2lPenM3T3pzN096czdPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGQlFUczdPenM3UVVGRlR5eEpRVUZOUVN4aFFVRmhMRWRCUVVjN1FVRkJTVU03UVVGQlFVRTdRVUZCUVVFN1FVRkJRVUU3UVVGQlFVRTdRVUZCUVVFN1FVRkJRVUU3UVVGQlFVRXNRMEZCU2l4RlFVRjBRanM3T3pzN08wRkJRMEVzVTBGQlUwTXNVMEZCVkN4RFFVRnRRa01zVFVGQmJrSXNSVUZCTWtKRExFMUJRVE5DTEVWQlFXMURReXhQUVVGdVF5eEZRVUUwUXp0QlFVRkZMRk5CUVU5TUxHRkJRV0VzUTBGQlEwMHNTVUZCWkN4RFFVRnRRa2dzVFVGQmJrSXNSVUZCTWtKRExFMUJRVE5DTEVWQlFXMURReXhQUVVGdVF5eERRVUZRTzBGQlFYRkVJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpYVcxd2IzSjBJRVJwWm1ZZ1puSnZiU0FuTGk5aVlYTmxKenRjYmx4dVpYaHdiM0owSUdOdmJuTjBJR05vWVhKaFkzUmxja1JwWm1ZZ1BTQnVaWGNnUkdsbVppZ3BPMXh1Wlhod2IzSjBJR1oxYm1OMGFXOXVJR1JwWm1aRGFHRnljeWh2YkdSVGRISXNJRzVsZDFOMGNpd2diM0IwYVc5dWN5a2dleUJ5WlhSMWNtNGdZMmhoY21GamRHVnlSR2xtWmk1a2FXWm1LRzlzWkZOMGNpd2dibVYzVTNSeUxDQnZjSFJwYjI1ektUc2dmVnh1SWwxOVxuIiwiLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmRpZmZDc3MgPSBkaWZmQ3NzO1xuZXhwb3J0cy5jc3NEaWZmID0gdm9pZCAwO1xuXG4vKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xudmFyXG4vKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG5fYmFzZSA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vYmFzZVwiKSlcbi8qaXN0YW5idWwgaWdub3JlIGVuZCovXG47XG5cbi8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki8gZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbi8qaXN0YW5idWwgaWdub3JlIGVuZCovXG52YXIgY3NzRGlmZiA9IG5ld1xuLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuX2Jhc2Vcbi8qaXN0YW5idWwgaWdub3JlIGVuZCovXG5bXG4vKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG5cImRlZmF1bHRcIlxuLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbl0oKTtcblxuLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuZXhwb3J0cy5jc3NEaWZmID0gY3NzRGlmZjtcblxuLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbmNzc0RpZmYudG9rZW5pemUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlLnNwbGl0KC8oW3t9OjssXXxcXHMrKS8pO1xufTtcblxuZnVuY3Rpb24gZGlmZkNzcyhvbGRTdHIsIG5ld1N0ciwgY2FsbGJhY2spIHtcbiAgcmV0dXJuIGNzc0RpZmYuZGlmZihvbGRTdHIsIG5ld1N0ciwgY2FsbGJhY2spO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5a2FXWm1MMk56Y3k1cWN5SmRMQ0p1WVcxbGN5STZXeUpqYzNORWFXWm1JaXdpUkdsbVppSXNJblJ2YTJWdWFYcGxJaXdpZG1Gc2RXVWlMQ0p6Y0d4cGRDSXNJbVJwWm1aRGMzTWlMQ0p2YkdSVGRISWlMQ0p1WlhkVGRISWlMQ0pqWVd4c1ltRmpheUlzSW1ScFptWWlYU3dpYldGd2NHbHVaM01pT2lJN096czdPenM3T3pzN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVUZCT3pzN096dEJRVVZQTEVsQlFVMUJMRTlCUVU4c1IwRkJSenRCUVVGSlF6dEJRVUZCUVR0QlFVRkJRVHRCUVVGQlFUdEJRVUZCUVR0QlFVRkJRVHRCUVVGQlFUdEJRVUZCUVN4RFFVRktMRVZCUVdoQ096czdPenM3UVVGRFVFUXNUMEZCVHl4RFFVRkRSU3hSUVVGU0xFZEJRVzFDTEZWQlFWTkRMRXRCUVZRc1JVRkJaMEk3UVVGRGFrTXNVMEZCVDBFc1MwRkJTeXhEUVVGRFF5eExRVUZPTEVOQlFWa3NaVUZCV2l4RFFVRlFPMEZCUTBRc1EwRkdSRHM3UVVGSlR5eFRRVUZUUXl4UFFVRlVMRU5CUVdsQ1F5eE5RVUZxUWl4RlFVRjVRa01zVFVGQmVrSXNSVUZCYVVORExGRkJRV3BETEVWQlFUSkRPMEZCUVVVc1UwRkJUMUlzVDBGQlR5eERRVUZEVXl4SlFVRlNMRU5CUVdGSUxFMUJRV0lzUlVGQmNVSkRMRTFCUVhKQ0xFVkJRVFpDUXl4UlFVRTNRaXhEUVVGUU8wRkJRV2RFSWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaWFXMXdiM0owSUVScFptWWdabkp2YlNBbkxpOWlZWE5sSnp0Y2JseHVaWGh3YjNKMElHTnZibk4wSUdOemMwUnBabVlnUFNCdVpYY2dSR2xtWmlncE8xeHVZM056UkdsbVppNTBiMnRsYm1sNlpTQTlJR1oxYm1OMGFXOXVLSFpoYkhWbEtTQjdYRzRnSUhKbGRIVnliaUIyWVd4MVpTNXpjR3hwZENndktGdDdmVG83TEYxOFhGeHpLeWt2S1R0Y2JuMDdYRzVjYm1WNGNHOXlkQ0JtZFc1amRHbHZiaUJrYVdabVEzTnpLRzlzWkZOMGNpd2dibVYzVTNSeUxDQmpZV3hzWW1GamF5a2dleUJ5WlhSMWNtNGdZM056UkdsbVppNWthV1ptS0c5c1pGTjBjaXdnYm1WM1UzUnlMQ0JqWVd4c1ltRmpheWs3SUgxY2JpSmRmUT09XG4iLCIvKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG5cInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGlmZkpzb24gPSBkaWZmSnNvbjtcbmV4cG9ydHMuY2Fub25pY2FsaXplID0gY2Fub25pY2FsaXplO1xuZXhwb3J0cy5qc29uRGlmZiA9IHZvaWQgMDtcblxuLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbnZhclxuLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuX2Jhc2UgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL2Jhc2VcIikpXG4vKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuO1xuXG52YXJcbi8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cbl9saW5lID0gcmVxdWlyZShcIi4vbGluZVwiKVxuLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbjtcblxuLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqLyBmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxuZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgXCJAYmFiZWwvaGVscGVycyAtIHR5cGVvZlwiOyBpZiAodHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIpIHsgX3R5cGVvZiA9IGZ1bmN0aW9uIF90eXBlb2Yob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9OyB9IGVsc2UgeyBfdHlwZW9mID0gZnVuY3Rpb24gX3R5cGVvZihvYmopIHsgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07IH0gcmV0dXJuIF90eXBlb2Yob2JqKTsgfVxuXG4vKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xudmFyIG9iamVjdFByb3RvdHlwZVRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcbnZhciBqc29uRGlmZiA9IG5ld1xuLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuX2Jhc2Vcbi8qaXN0YW5idWwgaWdub3JlIGVuZCovXG5bXG4vKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG5cImRlZmF1bHRcIlxuLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbl0oKTsgLy8gRGlzY3JpbWluYXRlIGJldHdlZW4gdHdvIGxpbmVzIG9mIHByZXR0eS1wcmludGVkLCBzZXJpYWxpemVkIEpTT04gd2hlcmUgb25lIG9mIHRoZW0gaGFzIGFcbi8vIGRhbmdsaW5nIGNvbW1hIGFuZCB0aGUgb3RoZXIgZG9lc24ndC4gVHVybnMgb3V0IGluY2x1ZGluZyB0aGUgZGFuZ2xpbmcgY29tbWEgeWllbGRzIHRoZSBuaWNlc3Qgb3V0cHV0OlxuXG4vKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG5leHBvcnRzLmpzb25EaWZmID0ganNvbkRpZmY7XG5cbi8qaXN0YW5idWwgaWdub3JlIGVuZCovXG5qc29uRGlmZi51c2VMb25nZXN0VG9rZW4gPSB0cnVlO1xuanNvbkRpZmYudG9rZW5pemUgPVxuLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuX2xpbmVcbi8qaXN0YW5idWwgaWdub3JlIGVuZCovXG4uXG4vKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG5saW5lRGlmZlxuLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbi50b2tlbml6ZTtcblxuanNvbkRpZmYuY2FzdElucHV0ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIC8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cbiAgdmFyIF90aGlzJG9wdGlvbnMgPVxuICAvKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuICB0aGlzLm9wdGlvbnMsXG4gICAgICB1bmRlZmluZWRSZXBsYWNlbWVudCA9IF90aGlzJG9wdGlvbnMudW5kZWZpbmVkUmVwbGFjZW1lbnQsXG4gICAgICBfdGhpcyRvcHRpb25zJHN0cmluZ2kgPSBfdGhpcyRvcHRpb25zLnN0cmluZ2lmeVJlcGxhY2VyLFxuICAgICAgc3RyaW5naWZ5UmVwbGFjZXIgPSBfdGhpcyRvcHRpb25zJHN0cmluZ2kgPT09IHZvaWQgMCA/IGZ1bmN0aW9uIChrLCB2KVxuICAvKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG4gIHtcbiAgICByZXR1cm4gKFxuICAgICAgLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbiAgICAgIHR5cGVvZiB2ID09PSAndW5kZWZpbmVkJyA/IHVuZGVmaW5lZFJlcGxhY2VtZW50IDogdlxuICAgICk7XG4gIH0gOiBfdGhpcyRvcHRpb25zJHN0cmluZ2k7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnID8gdmFsdWUgOiBKU09OLnN0cmluZ2lmeShjYW5vbmljYWxpemUodmFsdWUsIG51bGwsIG51bGwsIHN0cmluZ2lmeVJlcGxhY2VyKSwgc3RyaW5naWZ5UmVwbGFjZXIsICcgICcpO1xufTtcblxuanNvbkRpZmYuZXF1YWxzID0gZnVuY3Rpb24gKGxlZnQsIHJpZ2h0KSB7XG4gIHJldHVybiAoXG4gICAgLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuICAgIF9iYXNlXG4gICAgLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbiAgICBbXG4gICAgLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuICAgIFwiZGVmYXVsdFwiXG4gICAgLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbiAgICBdLnByb3RvdHlwZS5lcXVhbHMuY2FsbChqc29uRGlmZiwgbGVmdC5yZXBsYWNlKC8sKFtcXHJcXG5dKS9nLCAnJDEnKSwgcmlnaHQucmVwbGFjZSgvLChbXFxyXFxuXSkvZywgJyQxJykpXG4gICk7XG59O1xuXG5mdW5jdGlvbiBkaWZmSnNvbihvbGRPYmosIG5ld09iaiwgb3B0aW9ucykge1xuICByZXR1cm4ganNvbkRpZmYuZGlmZihvbGRPYmosIG5ld09iaiwgb3B0aW9ucyk7XG59IC8vIFRoaXMgZnVuY3Rpb24gaGFuZGxlcyB0aGUgcHJlc2VuY2Ugb2YgY2lyY3VsYXIgcmVmZXJlbmNlcyBieSBiYWlsaW5nIG91dCB3aGVuIGVuY291bnRlcmluZyBhblxuLy8gb2JqZWN0IHRoYXQgaXMgYWxyZWFkeSBvbiB0aGUgXCJzdGFja1wiIG9mIGl0ZW1zIGJlaW5nIHByb2Nlc3NlZC4gQWNjZXB0cyBhbiBvcHRpb25hbCByZXBsYWNlclxuXG5cbmZ1bmN0aW9uIGNhbm9uaWNhbGl6ZShvYmosIHN0YWNrLCByZXBsYWNlbWVudFN0YWNrLCByZXBsYWNlciwga2V5KSB7XG4gIHN0YWNrID0gc3RhY2sgfHwgW107XG4gIHJlcGxhY2VtZW50U3RhY2sgPSByZXBsYWNlbWVudFN0YWNrIHx8IFtdO1xuXG4gIGlmIChyZXBsYWNlcikge1xuICAgIG9iaiA9IHJlcGxhY2VyKGtleSwgb2JqKTtcbiAgfVxuXG4gIHZhciBpO1xuXG4gIGZvciAoaSA9IDA7IGkgPCBzdGFjay5sZW5ndGg7IGkgKz0gMSkge1xuICAgIGlmIChzdGFja1tpXSA9PT0gb2JqKSB7XG4gICAgICByZXR1cm4gcmVwbGFjZW1lbnRTdGFja1tpXTtcbiAgICB9XG4gIH1cblxuICB2YXIgY2Fub25pY2FsaXplZE9iajtcblxuICBpZiAoJ1tvYmplY3QgQXJyYXldJyA9PT0gb2JqZWN0UHJvdG90eXBlVG9TdHJpbmcuY2FsbChvYmopKSB7XG4gICAgc3RhY2sucHVzaChvYmopO1xuICAgIGNhbm9uaWNhbGl6ZWRPYmogPSBuZXcgQXJyYXkob2JqLmxlbmd0aCk7XG4gICAgcmVwbGFjZW1lbnRTdGFjay5wdXNoKGNhbm9uaWNhbGl6ZWRPYmopO1xuXG4gICAgZm9yIChpID0gMDsgaSA8IG9iai5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgY2Fub25pY2FsaXplZE9ialtpXSA9IGNhbm9uaWNhbGl6ZShvYmpbaV0sIHN0YWNrLCByZXBsYWNlbWVudFN0YWNrLCByZXBsYWNlciwga2V5KTtcbiAgICB9XG5cbiAgICBzdGFjay5wb3AoKTtcbiAgICByZXBsYWNlbWVudFN0YWNrLnBvcCgpO1xuICAgIHJldHVybiBjYW5vbmljYWxpemVkT2JqO1xuICB9XG5cbiAgaWYgKG9iaiAmJiBvYmoudG9KU09OKSB7XG4gICAgb2JqID0gb2JqLnRvSlNPTigpO1xuICB9XG5cbiAgaWYgKFxuICAvKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG4gIF90eXBlb2YoXG4gIC8qaXN0YW5idWwgaWdub3JlIGVuZCovXG4gIG9iaikgPT09ICdvYmplY3QnICYmIG9iaiAhPT0gbnVsbCkge1xuICAgIHN0YWNrLnB1c2gob2JqKTtcbiAgICBjYW5vbmljYWxpemVkT2JqID0ge307XG4gICAgcmVwbGFjZW1lbnRTdGFjay5wdXNoKGNhbm9uaWNhbGl6ZWRPYmopO1xuXG4gICAgdmFyIHNvcnRlZEtleXMgPSBbXSxcbiAgICAgICAgX2tleTtcblxuICAgIGZvciAoX2tleSBpbiBvYmopIHtcbiAgICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBlbHNlICovXG4gICAgICBpZiAob2JqLmhhc093blByb3BlcnR5KF9rZXkpKSB7XG4gICAgICAgIHNvcnRlZEtleXMucHVzaChfa2V5KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBzb3J0ZWRLZXlzLnNvcnQoKTtcblxuICAgIGZvciAoaSA9IDA7IGkgPCBzb3J0ZWRLZXlzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICBfa2V5ID0gc29ydGVkS2V5c1tpXTtcbiAgICAgIGNhbm9uaWNhbGl6ZWRPYmpbX2tleV0gPSBjYW5vbmljYWxpemUob2JqW19rZXldLCBzdGFjaywgcmVwbGFjZW1lbnRTdGFjaywgcmVwbGFjZXIsIF9rZXkpO1xuICAgIH1cblxuICAgIHN0YWNrLnBvcCgpO1xuICAgIHJlcGxhY2VtZW50U3RhY2sucG9wKCk7XG4gIH0gZWxzZSB7XG4gICAgY2Fub25pY2FsaXplZE9iaiA9IG9iajtcbiAgfVxuXG4gIHJldHVybiBjYW5vbmljYWxpemVkT2JqO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5a2FXWm1MMnB6YjI0dWFuTWlYU3dpYm1GdFpYTWlPbHNpYjJKcVpXTjBVSEp2ZEc5MGVYQmxWRzlUZEhKcGJtY2lMQ0pQWW1wbFkzUWlMQ0p3Y205MGIzUjVjR1VpTENKMGIxTjBjbWx1WnlJc0ltcHpiMjVFYVdabUlpd2lSR2xtWmlJc0luVnpaVXh2Ym1kbGMzUlViMnRsYmlJc0luUnZhMlZ1YVhwbElpd2liR2x1WlVScFptWWlMQ0pqWVhOMFNXNXdkWFFpTENKMllXeDFaU0lzSW05d2RHbHZibk1pTENKMWJtUmxabWx1WldSU1pYQnNZV05sYldWdWRDSXNJbk4wY21sdVoybG1lVkpsY0d4aFkyVnlJaXdpYXlJc0luWWlMQ0pLVTA5T0lpd2ljM1J5YVc1bmFXWjVJaXdpWTJGdWIyNXBZMkZzYVhwbElpd2laWEYxWVd4eklpd2liR1ZtZENJc0luSnBaMmgwSWl3aVkyRnNiQ0lzSW5KbGNHeGhZMlVpTENKa2FXWm1Tbk52YmlJc0ltOXNaRTlpYWlJc0ltNWxkMDlpYWlJc0ltUnBabVlpTENKdlltb2lMQ0p6ZEdGamF5SXNJbkpsY0d4aFkyVnRaVzUwVTNSaFkyc2lMQ0p5WlhCc1lXTmxjaUlzSW10bGVTSXNJbWtpTENKc1pXNW5kR2dpTENKallXNXZibWxqWVd4cGVtVmtUMkpxSWl3aWNIVnphQ0lzSWtGeWNtRjVJaXdpY0c5d0lpd2lkRzlLVTA5T0lpd2ljMjl5ZEdWa1MyVjVjeUlzSW1oaGMwOTNibEJ5YjNCbGNuUjVJaXdpYzI5eWRDSmRMQ0p0WVhCd2FXNW5jeUk2SWpzN096czdPenM3T3pzN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVUZCT3p0QlFVTkJPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJRVUU3T3pzN096czdRVUZGUVN4SlFVRk5RU3gxUWtGQmRVSXNSMEZCUjBNc1RVRkJUU3hEUVVGRFF5eFRRVUZRTEVOQlFXbENReXhSUVVGcVJEdEJRVWRQTEVsQlFVMURMRkZCUVZFc1IwRkJSenRCUVVGSlF6dEJRVUZCUVR0QlFVRkJRVHRCUVVGQlFUdEJRVUZCUVR0QlFVRkJRVHRCUVVGQlFUdEJRVUZCUVN4RFFVRktMRVZCUVdwQ0xFTXNRMEZEVUR0QlFVTkJPenM3T3pzN1FVRkRRVVFzVVVGQlVTeERRVUZEUlN4bFFVRlVMRWRCUVRKQ0xFbEJRVE5DTzBGQlJVRkdMRkZCUVZFc1EwRkJRMGNzVVVGQlZEdEJRVUZ2UWtNN1FVRkJRVUU3UVVGQlFVRTdRVUZCUVVFN1FVRkJRVUU3UVVGQlFVRTdRVUZCUVR0QlFVRkJMRU5CUVZORUxGRkJRVGRDT3p0QlFVTkJTQ3hSUVVGUkxFTkJRVU5MTEZOQlFWUXNSMEZCY1VJc1ZVRkJVME1zUzBGQlZDeEZRVUZuUWp0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVNclJTeFBRVUZMUXl4UFFVUndSanRCUVVGQkxFMUJRelZDUXl4dlFrRkVORUlzYVVKQlF6VkNRU3h2UWtGRU5FSTdRVUZCUVN3MFEwRkRUa01zYVVKQlJFMDdRVUZCUVN4TlFVTk9RU3hwUWtGRVRTeHpRMEZEWXl4VlFVRkRReXhEUVVGRUxFVkJRVWxETEVOQlFVbzdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVGVkxHRkJRVTlCTEVOQlFWQXNTMEZCWVN4WFFVRmlMRWRCUVRKQ1NDeHZRa0ZCTTBJc1IwRkJhMFJITzBGQlFUVkVPMEZCUVVFc1IwRkVaRHRCUVVkdVF5eFRRVUZQTEU5QlFVOU1MRXRCUVZBc1MwRkJhVUlzVVVGQmFrSXNSMEZCTkVKQkxFdEJRVFZDTEVkQlFXOURUU3hKUVVGSkxFTkJRVU5ETEZOQlFVd3NRMEZCWlVNc1dVRkJXU3hEUVVGRFVpeExRVUZFTEVWQlFWRXNTVUZCVWl4RlFVRmpMRWxCUVdRc1JVRkJiMEpITEdsQ1FVRndRaXhEUVVFelFpeEZRVUZ0UlVFc2FVSkJRVzVGTEVWQlFYTkdMRWxCUVhSR0xFTkJRVE5ETzBGQlEwUXNRMEZLUkRzN1FVRkxRVlFzVVVGQlVTeERRVUZEWlN4TlFVRlVMRWRCUVd0Q0xGVkJRVk5ETEVsQlFWUXNSVUZCWlVNc1MwRkJaaXhGUVVGelFqdEJRVU4wUXl4VFFVRlBhRUk3UVVGQlFVRTdRVUZCUVVFN1FVRkJRVUU3UVVGQlFVRTdRVUZCUVVFN1FVRkJRVUU3UVVGQlFVRTdRVUZCUVVFc1RVRkJTMGdzVTBGQlRDeERRVUZsYVVJc1RVRkJaaXhEUVVGelFrY3NTVUZCZEVJc1EwRkJNa0pzUWl4UlFVRXpRaXhGUVVGeFEyZENMRWxCUVVrc1EwRkJRMGNzVDBGQlRDeERRVUZoTEZsQlFXSXNSVUZCTWtJc1NVRkJNMElzUTBGQmNrTXNSVUZCZFVWR0xFdEJRVXNzUTBGQlEwVXNUMEZCVGl4RFFVRmpMRmxCUVdRc1JVRkJORUlzU1VGQk5VSXNRMEZCZGtVN1FVRkJVRHRCUVVORUxFTkJSa1E3TzBGQlNVOHNVMEZCVTBNc1VVRkJWQ3hEUVVGclFrTXNUVUZCYkVJc1JVRkJNRUpETEUxQlFURkNMRVZCUVd0RFppeFBRVUZzUXl4RlFVRXlRenRCUVVGRkxGTkJRVTlRTEZGQlFWRXNRMEZCUTNWQ0xFbEJRVlFzUTBGQlkwWXNUVUZCWkN4RlFVRnpRa01zVFVGQmRFSXNSVUZCT0VKbUxFOUJRVGxDTEVOQlFWQTdRVUZCWjBRc1F5eERRVVZ3Unp0QlFVTkJPenM3UVVGRFR5eFRRVUZUVHl4WlFVRlVMRU5CUVhOQ1ZTeEhRVUYwUWl4RlFVRXlRa01zUzBGQk0wSXNSVUZCYTBORExHZENRVUZzUXl4RlFVRnZSRU1zVVVGQmNFUXNSVUZCT0VSRExFZEJRVGxFTEVWQlFXMUZPMEZCUTNoRlNDeEZRVUZCUVN4TFFVRkxMRWRCUVVkQkxFdEJRVXNzU1VGQlNTeEZRVUZxUWp0QlFVTkJReXhGUVVGQlFTeG5Ra0ZCWjBJc1IwRkJSMEVzWjBKQlFXZENMRWxCUVVrc1JVRkJka003TzBGQlJVRXNUVUZCU1VNc1VVRkJTaXhGUVVGak8wRkJRMXBJTEVsQlFVRkJMRWRCUVVjc1IwRkJSMGNzVVVGQlVTeERRVUZEUXl4SFFVRkVMRVZCUVUxS0xFZEJRVTRzUTBGQlpEdEJRVU5FT3p0QlFVVkVMRTFCUVVsTExFTkJRVW83TzBGQlJVRXNUMEZCUzBFc1EwRkJReXhIUVVGSExFTkJRVlFzUlVGQldVRXNRMEZCUXl4SFFVRkhTaXhMUVVGTExFTkJRVU5MTEUxQlFYUkNMRVZCUVRoQ1JDeERRVUZETEVsQlFVa3NRMEZCYmtNc1JVRkJjME03UVVGRGNFTXNVVUZCU1Vvc1MwRkJTeXhEUVVGRFNTeERRVUZFTEVOQlFVd3NTMEZCWVV3c1IwRkJha0lzUlVGQmMwSTdRVUZEY0VJc1lVRkJUMFVzWjBKQlFXZENMRU5CUVVOSExFTkJRVVFzUTBGQmRrSTdRVUZEUkR0QlFVTkdPenRCUVVWRUxFMUJRVWxGTEdkQ1FVRktPenRCUVVWQkxFMUJRVWtzY1VKQlFYRkNia01zZFVKQlFYVkNMRU5CUVVOelFpeEpRVUY0UWl4RFFVRTJRazBzUjBGQk4wSXNRMEZCZWtJc1JVRkJORVE3UVVGRE1VUkRMRWxCUVVGQkxFdEJRVXNzUTBGQlEwOHNTVUZCVGl4RFFVRlhVaXhIUVVGWU8wRkJRMEZQTEVsQlFVRkJMR2RDUVVGblFpeEhRVUZITEVsQlFVbEZMRXRCUVVvc1EwRkJWVlFzUjBGQlJ5eERRVUZEVFN4TlFVRmtMRU5CUVc1Q08wRkJRMEZLTEVsQlFVRkJMR2RDUVVGblFpeERRVUZEVFN4SlFVRnFRaXhEUVVGelFrUXNaMEpCUVhSQ096dEJRVU5CTEZOQlFVdEdMRU5CUVVNc1IwRkJSeXhEUVVGVUxFVkJRVmxCTEVOQlFVTXNSMEZCUjB3c1IwRkJSeXhEUVVGRFRTeE5RVUZ3UWl4RlFVRTBRa1FzUTBGQlF5eEpRVUZKTEVOQlFXcERMRVZCUVc5RE8wRkJRMnhEUlN4TlFVRkJRU3huUWtGQlowSXNRMEZCUTBZc1EwRkJSQ3hEUVVGb1FpeEhRVUZ6UW1Zc1dVRkJXU3hEUVVGRFZTeEhRVUZITEVOQlFVTkxMRU5CUVVRc1EwRkJTaXhGUVVGVFNpeExRVUZVTEVWQlFXZENReXhuUWtGQmFFSXNSVUZCYTBORExGRkJRV3hETEVWQlFUUkRReXhIUVVFMVF5eERRVUZzUXp0QlFVTkVPenRCUVVORVNDeEpRVUZCUVN4TFFVRkxMRU5CUVVOVExFZEJRVTQ3UVVGRFFWSXNTVUZCUVVFc1owSkJRV2RDTEVOQlFVTlJMRWRCUVdwQ08wRkJRMEVzVjBGQlQwZ3NaMEpCUVZBN1FVRkRSRHM3UVVGRlJDeE5RVUZKVUN4SFFVRkhMRWxCUVVsQkxFZEJRVWNzUTBGQlExY3NUVUZCWml4RlFVRjFRanRCUVVOeVFsZ3NTVUZCUVVFc1IwRkJSeXhIUVVGSFFTeEhRVUZITEVOQlFVTlhMRTFCUVVvc1JVRkJUanRCUVVORU96dEJRVVZFTzBGQlFVazdRVUZCUVR0QlFVRkJPMEZCUVU5WUxFVkJRVUZCTEVkQlFWQXNUVUZCWlN4UlFVRm1MRWxCUVRKQ1FTeEhRVUZITEV0QlFVc3NTVUZCZGtNc1JVRkJOa003UVVGRE0wTkRMRWxCUVVGQkxFdEJRVXNzUTBGQlEwOHNTVUZCVGl4RFFVRlhVaXhIUVVGWU8wRkJRMEZQTEVsQlFVRkJMR2RDUVVGblFpeEhRVUZITEVWQlFXNUNPMEZCUTBGTUxFbEJRVUZCTEdkQ1FVRm5RaXhEUVVGRFRTeEpRVUZxUWl4RFFVRnpRa1FzWjBKQlFYUkNPenRCUVVOQkxGRkJRVWxMTEZWQlFWVXNSMEZCUnl4RlFVRnFRanRCUVVGQkxGRkJRMGxTTEVsQlJFbzdPMEZCUlVFc1UwRkJTMEVzU1VGQlRDeEpRVUZaU2l4SFFVRmFMRVZCUVdsQ08wRkJRMlk3UVVGRFFTeFZRVUZKUVN4SFFVRkhMRU5CUVVOaExHTkJRVW9zUTBGQmJVSlVMRWxCUVc1Q0xFTkJRVW9zUlVGQk5rSTdRVUZETTBKUkxGRkJRVUZCTEZWQlFWVXNRMEZCUTBvc1NVRkJXQ3hEUVVGblFrb3NTVUZCYUVJN1FVRkRSRHRCUVVOR096dEJRVU5FVVN4SlFVRkJRU3hWUVVGVkxFTkJRVU5GTEVsQlFWZzdPMEZCUTBFc1UwRkJTMVFzUTBGQlF5eEhRVUZITEVOQlFWUXNSVUZCV1VFc1EwRkJReXhIUVVGSFR5eFZRVUZWTEVOQlFVTk9MRTFCUVROQ0xFVkJRVzFEUkN4RFFVRkRMRWxCUVVrc1EwRkJlRU1zUlVGQk1rTTdRVUZEZWtORUxFMUJRVUZCTEVsQlFVY3NSMEZCUjFFc1ZVRkJWU3hEUVVGRFVDeERRVUZFTEVOQlFXaENPMEZCUTBGRkxFMUJRVUZCTEdkQ1FVRm5RaXhEUVVGRFNDeEpRVUZFTEVOQlFXaENMRWRCUVhkQ1pDeFpRVUZaTEVOQlFVTlZMRWRCUVVjc1EwRkJRMGtzU1VGQlJDeERRVUZLTEVWQlFWZElMRXRCUVZnc1JVRkJhMEpETEdkQ1FVRnNRaXhGUVVGdlEwTXNVVUZCY0VNc1JVRkJPRU5ETEVsQlFUbERMRU5CUVhCRE8wRkJRMFE3TzBGQlEwUklMRWxCUVVGQkxFdEJRVXNzUTBGQlExTXNSMEZCVGp0QlFVTkJVaXhKUVVGQlFTeG5Ra0ZCWjBJc1EwRkJRMUVzUjBGQmFrSTdRVUZEUkN4SFFXNUNSQ3hOUVcxQ1R6dEJRVU5NU0N4SlFVRkJRU3huUWtGQlowSXNSMEZCUjFBc1IwRkJia0k3UVVGRFJEczdRVUZEUkN4VFFVRlBUeXhuUWtGQlVEdEJRVU5FSWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaWFXMXdiM0owSUVScFptWWdabkp2YlNBbkxpOWlZWE5sSnp0Y2JtbHRjRzl5ZENCN2JHbHVaVVJwWm1aOUlHWnliMjBnSnk0dmJHbHVaU2M3WEc1Y2JtTnZibk4wSUc5aWFtVmpkRkJ5YjNSdmRIbHdaVlJ2VTNSeWFXNW5JRDBnVDJKcVpXTjBMbkJ5YjNSdmRIbHdaUzUwYjFOMGNtbHVaenRjYmx4dVhHNWxlSEJ2Y25RZ1kyOXVjM1FnYW5OdmJrUnBabVlnUFNCdVpYY2dSR2xtWmlncE8xeHVMeThnUkdselkzSnBiV2x1WVhSbElHSmxkSGRsWlc0Z2RIZHZJR3hwYm1WeklHOW1JSEJ5WlhSMGVTMXdjbWx1ZEdWa0xDQnpaWEpwWVd4cGVtVmtJRXBUVDA0Z2QyaGxjbVVnYjI1bElHOW1JSFJvWlcwZ2FHRnpJR0ZjYmk4dklHUmhibWRzYVc1bklHTnZiVzFoSUdGdVpDQjBhR1VnYjNSb1pYSWdaRzlsYzI0bmRDNGdWSFZ5Ym5NZ2IzVjBJR2x1WTJ4MVpHbHVaeUIwYUdVZ1pHRnVaMnhwYm1jZ1kyOXRiV0VnZVdsbGJHUnpJSFJvWlNCdWFXTmxjM1FnYjNWMGNIVjBPbHh1YW5OdmJrUnBabVl1ZFhObFRHOXVaMlZ6ZEZSdmEyVnVJRDBnZEhKMVpUdGNibHh1YW5OdmJrUnBabVl1ZEc5clpXNXBlbVVnUFNCc2FXNWxSR2xtWmk1MGIydGxibWw2WlR0Y2JtcHpiMjVFYVdabUxtTmhjM1JKYm5CMWRDQTlJR1oxYm1OMGFXOXVLSFpoYkhWbEtTQjdYRzRnSUdOdmJuTjBJSHQxYm1SbFptbHVaV1JTWlhCc1lXTmxiV1Z1ZEN3Z2MzUnlhVzVuYVdaNVVtVndiR0ZqWlhJZ1BTQW9heXdnZGlrZ1BUNGdkSGx3Wlc5bUlIWWdQVDA5SUNkMWJtUmxabWx1WldRbklEOGdkVzVrWldacGJtVmtVbVZ3YkdGalpXMWxiblFnT2lCMmZTQTlJSFJvYVhNdWIzQjBhVzl1Y3p0Y2JseHVJQ0J5WlhSMWNtNGdkSGx3Wlc5bUlIWmhiSFZsSUQwOVBTQW5jM1J5YVc1bkp5QS9JSFpoYkhWbElEb2dTbE5QVGk1emRISnBibWRwWm5rb1kyRnViMjVwWTJGc2FYcGxLSFpoYkhWbExDQnVkV3hzTENCdWRXeHNMQ0J6ZEhKcGJtZHBabmxTWlhCc1lXTmxjaWtzSUhOMGNtbHVaMmxtZVZKbGNHeGhZMlZ5TENBbklDQW5LVHRjYm4wN1hHNXFjMjl1UkdsbVppNWxjWFZoYkhNZ1BTQm1kVzVqZEdsdmJpaHNaV1owTENCeWFXZG9kQ2tnZTF4dUlDQnlaWFIxY200Z1JHbG1aaTV3Y205MGIzUjVjR1V1WlhGMVlXeHpMbU5oYkd3b2FuTnZia1JwWm1Zc0lHeGxablF1Y21Wd2JHRmpaU2d2TENoYlhGeHlYRnh1WFNrdlp5d2dKeVF4Snlrc0lISnBaMmgwTG5KbGNHeGhZMlVvTHl3b1cxeGNjbHhjYmwwcEwyY3NJQ2NrTVNjcEtUdGNibjA3WEc1Y2JtVjRjRzl5ZENCbWRXNWpkR2x2YmlCa2FXWm1Tbk52YmlodmJHUlBZbW9zSUc1bGQwOWlhaXdnYjNCMGFXOXVjeWtnZXlCeVpYUjFjbTRnYW5OdmJrUnBabVl1WkdsbVppaHZiR1JQWW1vc0lHNWxkMDlpYWl3Z2IzQjBhVzl1Y3lrN0lIMWNibHh1THk4Z1ZHaHBjeUJtZFc1amRHbHZiaUJvWVc1a2JHVnpJSFJvWlNCd2NtVnpaVzVqWlNCdlppQmphWEpqZFd4aGNpQnlaV1psY21WdVkyVnpJR0o1SUdKaGFXeHBibWNnYjNWMElIZG9aVzRnWlc1amIzVnVkR1Z5YVc1bklHRnVYRzR2THlCdlltcGxZM1FnZEdoaGRDQnBjeUJoYkhKbFlXUjVJRzl1SUhSb1pTQmNJbk4wWVdOclhDSWdiMllnYVhSbGJYTWdZbVZwYm1jZ2NISnZZMlZ6YzJWa0xpQkJZMk5sY0hSeklHRnVJRzl3ZEdsdmJtRnNJSEpsY0d4aFkyVnlYRzVsZUhCdmNuUWdablZ1WTNScGIyNGdZMkZ1YjI1cFkyRnNhWHBsS0c5aWFpd2djM1JoWTJzc0lISmxjR3hoWTJWdFpXNTBVM1JoWTJzc0lISmxjR3hoWTJWeUxDQnJaWGtwSUh0Y2JpQWdjM1JoWTJzZ1BTQnpkR0ZqYXlCOGZDQmJYVHRjYmlBZ2NtVndiR0ZqWlcxbGJuUlRkR0ZqYXlBOUlISmxjR3hoWTJWdFpXNTBVM1JoWTJzZ2ZId2dXMTA3WEc1Y2JpQWdhV1lnS0hKbGNHeGhZMlZ5S1NCN1hHNGdJQ0FnYjJKcUlEMGdjbVZ3YkdGalpYSW9hMlY1TENCdlltb3BPMXh1SUNCOVhHNWNiaUFnYkdWMElHazdYRzVjYmlBZ1ptOXlJQ2hwSUQwZ01Ec2dhU0E4SUhOMFlXTnJMbXhsYm1kMGFEc2dhU0FyUFNBeEtTQjdYRzRnSUNBZ2FXWWdLSE4wWVdOclcybGRJRDA5UFNCdlltb3BJSHRjYmlBZ0lDQWdJSEpsZEhWeWJpQnlaWEJzWVdObGJXVnVkRk4wWVdOclcybGRPMXh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJR3hsZENCallXNXZibWxqWVd4cGVtVmtUMkpxTzF4dVhHNGdJR2xtSUNnblcyOWlhbVZqZENCQmNuSmhlVjBuSUQwOVBTQnZZbXBsWTNSUWNtOTBiM1I1Y0dWVWIxTjBjbWx1Wnk1allXeHNLRzlpYWlrcElIdGNiaUFnSUNCemRHRmpheTV3ZFhOb0tHOWlhaWs3WEc0Z0lDQWdZMkZ1YjI1cFkyRnNhWHBsWkU5aWFpQTlJRzVsZHlCQmNuSmhlU2h2WW1vdWJHVnVaM1JvS1R0Y2JpQWdJQ0J5WlhCc1lXTmxiV1Z1ZEZOMFlXTnJMbkIxYzJnb1kyRnViMjVwWTJGc2FYcGxaRTlpYWlrN1hHNGdJQ0FnWm05eUlDaHBJRDBnTURzZ2FTQThJRzlpYWk1c1pXNW5kR2c3SUdrZ0t6MGdNU2tnZTF4dUlDQWdJQ0FnWTJGdWIyNXBZMkZzYVhwbFpFOWlhbHRwWFNBOUlHTmhibTl1YVdOaGJHbDZaU2h2WW1wYmFWMHNJSE4wWVdOckxDQnlaWEJzWVdObGJXVnVkRk4wWVdOckxDQnlaWEJzWVdObGNpd2dhMlY1S1R0Y2JpQWdJQ0I5WEc0Z0lDQWdjM1JoWTJzdWNHOXdLQ2s3WEc0Z0lDQWdjbVZ3YkdGalpXMWxiblJUZEdGamF5NXdiM0FvS1R0Y2JpQWdJQ0J5WlhSMWNtNGdZMkZ1YjI1cFkyRnNhWHBsWkU5aWFqdGNiaUFnZlZ4dVhHNGdJR2xtSUNodlltb2dKaVlnYjJKcUxuUnZTbE5QVGlrZ2UxeHVJQ0FnSUc5aWFpQTlJRzlpYWk1MGIwcFRUMDRvS1R0Y2JpQWdmVnh1WEc0Z0lHbG1JQ2gwZVhCbGIyWWdiMkpxSUQwOVBTQW5iMkpxWldOMEp5QW1KaUJ2WW1vZ0lUMDlJRzUxYkd3cElIdGNiaUFnSUNCemRHRmpheTV3ZFhOb0tHOWlhaWs3WEc0Z0lDQWdZMkZ1YjI1cFkyRnNhWHBsWkU5aWFpQTlJSHQ5TzF4dUlDQWdJSEpsY0d4aFkyVnRaVzUwVTNSaFkyc3VjSFZ6YUNoallXNXZibWxqWVd4cGVtVmtUMkpxS1R0Y2JpQWdJQ0JzWlhRZ2MyOXlkR1ZrUzJWNWN5QTlJRnRkTEZ4dUlDQWdJQ0FnSUNCclpYazdYRzRnSUNBZ1ptOXlJQ2hyWlhrZ2FXNGdiMkpxS1NCN1hHNGdJQ0FnSUNBdktpQnBjM1JoYm1KMWJDQnBaMjV2Y21VZ1pXeHpaU0FxTDF4dUlDQWdJQ0FnYVdZZ0tHOWlhaTVvWVhOUGQyNVFjbTl3WlhKMGVTaHJaWGtwS1NCN1hHNGdJQ0FnSUNBZ0lITnZjblJsWkV0bGVYTXVjSFZ6YUNoclpYa3BPMXh1SUNBZ0lDQWdmVnh1SUNBZ0lIMWNiaUFnSUNCemIzSjBaV1JMWlhsekxuTnZjblFvS1R0Y2JpQWdJQ0JtYjNJZ0tHa2dQU0F3T3lCcElEd2djMjl5ZEdWa1MyVjVjeTVzWlc1bmRHZzdJR2tnS3owZ01Ta2dlMXh1SUNBZ0lDQWdhMlY1SUQwZ2MyOXlkR1ZrUzJWNWMxdHBYVHRjYmlBZ0lDQWdJR05oYm05dWFXTmhiR2w2WldSUFltcGJhMlY1WFNBOUlHTmhibTl1YVdOaGJHbDZaU2h2WW1wYmEyVjVYU3dnYzNSaFkyc3NJSEpsY0d4aFkyVnRaVzUwVTNSaFkyc3NJSEpsY0d4aFkyVnlMQ0JyWlhrcE8xeHVJQ0FnSUgxY2JpQWdJQ0J6ZEdGamF5NXdiM0FvS1R0Y2JpQWdJQ0J5WlhCc1lXTmxiV1Z1ZEZOMFlXTnJMbkJ2Y0NncE8xeHVJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lHTmhibTl1YVdOaGJHbDZaV1JQWW1vZ1BTQnZZbW83WEc0Z0lIMWNiaUFnY21WMGRYSnVJR05oYm05dWFXTmhiR2w2WldSUFltbzdYRzU5WEc0aVhYMD1cbiIsIi8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cblwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kaWZmTGluZXMgPSBkaWZmTGluZXM7XG5leHBvcnRzLmRpZmZUcmltbWVkTGluZXMgPSBkaWZmVHJpbW1lZExpbmVzO1xuZXhwb3J0cy5saW5lRGlmZiA9IHZvaWQgMDtcblxuLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbnZhclxuLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuX2Jhc2UgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KHJlcXVpcmUoXCIuL2Jhc2VcIikpXG4vKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuO1xuXG52YXJcbi8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cbl9wYXJhbXMgPSByZXF1aXJlKFwiLi4vdXRpbC9wYXJhbXNcIilcbi8qaXN0YW5idWwgaWdub3JlIGVuZCovXG47XG5cbi8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki8gZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbi8qaXN0YW5idWwgaWdub3JlIGVuZCovXG52YXIgbGluZURpZmYgPSBuZXdcbi8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cbl9iYXNlXG4vKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuW1xuLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuXCJkZWZhdWx0XCJcbi8qaXN0YW5idWwgaWdub3JlIGVuZCovXG5dKCk7XG5cbi8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cbmV4cG9ydHMubGluZURpZmYgPSBsaW5lRGlmZjtcblxuLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbmxpbmVEaWZmLnRva2VuaXplID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gIHZhciByZXRMaW5lcyA9IFtdLFxuICAgICAgbGluZXNBbmROZXdsaW5lcyA9IHZhbHVlLnNwbGl0KC8oXFxufFxcclxcbikvKTsgLy8gSWdub3JlIHRoZSBmaW5hbCBlbXB0eSB0b2tlbiB0aGF0IG9jY3VycyBpZiB0aGUgc3RyaW5nIGVuZHMgd2l0aCBhIG5ldyBsaW5lXG5cbiAgaWYgKCFsaW5lc0FuZE5ld2xpbmVzW2xpbmVzQW5kTmV3bGluZXMubGVuZ3RoIC0gMV0pIHtcbiAgICBsaW5lc0FuZE5ld2xpbmVzLnBvcCgpO1xuICB9IC8vIE1lcmdlIHRoZSBjb250ZW50IGFuZCBsaW5lIHNlcGFyYXRvcnMgaW50byBzaW5nbGUgdG9rZW5zXG5cblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpbmVzQW5kTmV3bGluZXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgbGluZSA9IGxpbmVzQW5kTmV3bGluZXNbaV07XG5cbiAgICBpZiAoaSAlIDIgJiYgIXRoaXMub3B0aW9ucy5uZXdsaW5lSXNUb2tlbikge1xuICAgICAgcmV0TGluZXNbcmV0TGluZXMubGVuZ3RoIC0gMV0gKz0gbGluZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKHRoaXMub3B0aW9ucy5pZ25vcmVXaGl0ZXNwYWNlKSB7XG4gICAgICAgIGxpbmUgPSBsaW5lLnRyaW0oKTtcbiAgICAgIH1cblxuICAgICAgcmV0TGluZXMucHVzaChsaW5lKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmV0TGluZXM7XG59O1xuXG5mdW5jdGlvbiBkaWZmTGluZXMob2xkU3RyLCBuZXdTdHIsIGNhbGxiYWNrKSB7XG4gIHJldHVybiBsaW5lRGlmZi5kaWZmKG9sZFN0ciwgbmV3U3RyLCBjYWxsYmFjayk7XG59XG5cbmZ1bmN0aW9uIGRpZmZUcmltbWVkTGluZXMob2xkU3RyLCBuZXdTdHIsIGNhbGxiYWNrKSB7XG4gIHZhciBvcHRpb25zID1cbiAgLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuICAoMCxcbiAgLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cblxuICAvKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG4gIF9wYXJhbXNcbiAgLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbiAgLlxuICAvKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG4gIGdlbmVyYXRlT3B0aW9ucylcbiAgLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbiAgKGNhbGxiYWNrLCB7XG4gICAgaWdub3JlV2hpdGVzcGFjZTogdHJ1ZVxuICB9KTtcbiAgcmV0dXJuIGxpbmVEaWZmLmRpZmYob2xkU3RyLCBuZXdTdHIsIG9wdGlvbnMpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5a2FXWm1MMnhwYm1VdWFuTWlYU3dpYm1GdFpYTWlPbHNpYkdsdVpVUnBabVlpTENKRWFXWm1JaXdpZEc5clpXNXBlbVVpTENKMllXeDFaU0lzSW5KbGRFeHBibVZ6SWl3aWJHbHVaWE5CYm1ST1pYZHNhVzVsY3lJc0luTndiR2wwSWl3aWJHVnVaM1JvSWl3aWNHOXdJaXdpYVNJc0lteHBibVVpTENKdmNIUnBiMjV6SWl3aWJtVjNiR2x1WlVselZHOXJaVzRpTENKcFoyNXZjbVZYYUdsMFpYTndZV05sSWl3aWRISnBiU0lzSW5CMWMyZ2lMQ0prYVdabVRHbHVaWE1pTENKdmJHUlRkSElpTENKdVpYZFRkSElpTENKallXeHNZbUZqYXlJc0ltUnBabVlpTENKa2FXWm1WSEpwYlcxbFpFeHBibVZ6SWl3aVoyVnVaWEpoZEdWUGNIUnBiMjV6SWwwc0ltMWhjSEJwYm1keklqb2lPenM3T3pzN096czdPenRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlFVRTdPMEZCUTBFN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGQlFUczdPenM3UVVGRlR5eEpRVUZOUVN4UlFVRlJMRWRCUVVjN1FVRkJTVU03UVVGQlFVRTdRVUZCUVVFN1FVRkJRVUU3UVVGQlFVRTdRVUZCUVVFN1FVRkJRVUU3UVVGQlFVRXNRMEZCU2l4RlFVRnFRanM3T3pzN08wRkJRMUJFTEZGQlFWRXNRMEZCUTBVc1VVRkJWQ3hIUVVGdlFpeFZRVUZUUXl4TFFVRlVMRVZCUVdkQ08wRkJRMnhETEUxQlFVbERMRkZCUVZFc1IwRkJSeXhGUVVGbU8wRkJRVUVzVFVGRFNVTXNaMEpCUVdkQ0xFZEJRVWRHTEV0QlFVc3NRMEZCUTBjc1MwRkJUaXhEUVVGWkxGZEJRVm9zUTBGRWRrSXNRMEZFYTBNc1EwRkpiRU03TzBGQlEwRXNUVUZCU1N4RFFVRkRSQ3huUWtGQlowSXNRMEZCUTBFc1owSkJRV2RDTEVOQlFVTkZMRTFCUVdwQ0xFZEJRVEJDTEVOQlFUTkNMRU5CUVhKQ0xFVkJRVzlFTzBGQlEyeEVSaXhKUVVGQlFTeG5Ra0ZCWjBJc1EwRkJRMGNzUjBGQmFrSTdRVUZEUkN4SFFWQnBReXhEUVZOc1F6czdPMEZCUTBFc1QwRkJTeXhKUVVGSlF5eERRVUZETEVkQlFVY3NRMEZCWWl4RlFVRm5Ra0VzUTBGQlF5eEhRVUZIU2l4blFrRkJaMElzUTBGQlEwVXNUVUZCY2tNc1JVRkJOa05GTEVOQlFVTXNSVUZCT1VNc1JVRkJhMFE3UVVGRGFFUXNVVUZCU1VNc1NVRkJTU3hIUVVGSFRDeG5Ra0ZCWjBJc1EwRkJRMGtzUTBGQlJDeERRVUV6UWpzN1FVRkZRU3hSUVVGSlFTeERRVUZETEVkQlFVY3NRMEZCU2l4SlFVRlRMRU5CUVVNc1MwRkJTMFVzVDBGQlRDeERRVUZoUXl4alFVRXpRaXhGUVVFeVF6dEJRVU42UTFJc1RVRkJRVUVzVVVGQlVTeERRVUZEUVN4UlFVRlJMRU5CUVVOSExFMUJRVlFzUjBGQmEwSXNRMEZCYmtJc1EwRkJVaXhKUVVGcFEwY3NTVUZCYWtNN1FVRkRSQ3hMUVVaRUxFMUJSVTg3UVVGRFRDeFZRVUZKTEV0QlFVdERMRTlCUVV3c1EwRkJZVVVzWjBKQlFXcENMRVZCUVcxRE8wRkJRMnBEU0N4UlFVRkJRU3hKUVVGSkxFZEJRVWRCTEVsQlFVa3NRMEZCUTBrc1NVRkJUQ3hGUVVGUU8wRkJRMFE3TzBGQlEwUldMRTFCUVVGQkxGRkJRVkVzUTBGQlExY3NTVUZCVkN4RFFVRmpUQ3hKUVVGa08wRkJRMFE3UVVGRFJqczdRVUZGUkN4VFFVRlBUaXhSUVVGUU8wRkJRMFFzUTBGNFFrUTdPMEZCTUVKUExGTkJRVk5aTEZOQlFWUXNRMEZCYlVKRExFMUJRVzVDTEVWQlFUSkNReXhOUVVFelFpeEZRVUZ0UTBNc1VVRkJia01zUlVGQk5rTTdRVUZCUlN4VFFVRlBia0lzVVVGQlVTeERRVUZEYjBJc1NVRkJWQ3hEUVVGalNDeE5RVUZrTEVWQlFYTkNReXhOUVVGMFFpeEZRVUU0UWtNc1VVRkJPVUlzUTBGQlVEdEJRVUZwUkRzN1FVRkRhRWNzVTBGQlUwVXNaMEpCUVZRc1EwRkJNRUpLTEUxQlFURkNMRVZCUVd0RFF5eE5RVUZzUXl4RlFVRXdRME1zVVVGQk1VTXNSVUZCYjBRN1FVRkRla1FzVFVGQlNWSXNUMEZCVHp0QlFVRkhPMEZCUVVFN1FVRkJRVHM3UVVGQlFWYzdRVUZCUVVFN1FVRkJRVUU3UVVGQlFVRTdRVUZCUVVFN1FVRkJRVUU3UVVGQlFUdEJRVUZCTEVkQlFXZENTQ3hSUVVGb1FpeEZRVUV3UWp0QlFVRkRUaXhKUVVGQlFTeG5Ra0ZCWjBJc1JVRkJSVHRCUVVGdVFpeEhRVUV4UWl4RFFVRmtPMEZCUTBFc1UwRkJUMklzVVVGQlVTeERRVUZEYjBJc1NVRkJWQ3hEUVVGalNDeE5RVUZrTEVWQlFYTkNReXhOUVVGMFFpeEZRVUU0UWxBc1QwRkJPVUlzUTBGQlVEdEJRVU5FSWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaWFXMXdiM0owSUVScFptWWdabkp2YlNBbkxpOWlZWE5sSnp0Y2JtbHRjRzl5ZENCN1oyVnVaWEpoZEdWUGNIUnBiMjV6ZlNCbWNtOXRJQ2N1TGk5MWRHbHNMM0JoY21GdGN5YzdYRzVjYm1WNGNHOXlkQ0JqYjI1emRDQnNhVzVsUkdsbVppQTlJRzVsZHlCRWFXWm1LQ2s3WEc1c2FXNWxSR2xtWmk1MGIydGxibWw2WlNBOUlHWjFibU4wYVc5dUtIWmhiSFZsS1NCN1hHNGdJR3hsZENCeVpYUk1hVzVsY3lBOUlGdGRMRnh1SUNBZ0lDQWdiR2x1WlhOQmJtUk9aWGRzYVc1bGN5QTlJSFpoYkhWbExuTndiR2wwS0M4b1hGeHVmRnhjY2x4Y2Jpa3ZLVHRjYmx4dUlDQXZMeUJKWjI1dmNtVWdkR2hsSUdacGJtRnNJR1Z0Y0hSNUlIUnZhMlZ1SUhSb1lYUWdiMk5qZFhKeklHbG1JSFJvWlNCemRISnBibWNnWlc1a2N5QjNhWFJvSUdFZ2JtVjNJR3hwYm1WY2JpQWdhV1lnS0NGc2FXNWxjMEZ1WkU1bGQyeHBibVZ6VzJ4cGJtVnpRVzVrVG1WM2JHbHVaWE11YkdWdVozUm9JQzBnTVYwcElIdGNiaUFnSUNCc2FXNWxjMEZ1WkU1bGQyeHBibVZ6TG5CdmNDZ3BPMXh1SUNCOVhHNWNiaUFnTHk4Z1RXVnlaMlVnZEdobElHTnZiblJsYm5RZ1lXNWtJR3hwYm1VZ2MyVndZWEpoZEc5eWN5QnBiblJ2SUhOcGJtZHNaU0IwYjJ0bGJuTmNiaUFnWm05eUlDaHNaWFFnYVNBOUlEQTdJR2tnUENCc2FXNWxjMEZ1WkU1bGQyeHBibVZ6TG14bGJtZDBhRHNnYVNzcktTQjdYRzRnSUNBZ2JHVjBJR3hwYm1VZ1BTQnNhVzVsYzBGdVpFNWxkMnhwYm1WelcybGRPMXh1WEc0Z0lDQWdhV1lnS0drZ0pTQXlJQ1ltSUNGMGFHbHpMbTl3ZEdsdmJuTXVibVYzYkdsdVpVbHpWRzlyWlc0cElIdGNiaUFnSUNBZ0lISmxkRXhwYm1WelczSmxkRXhwYm1WekxteGxibWQwYUNBdElERmRJQ3M5SUd4cGJtVTdYRzRnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUdsbUlDaDBhR2x6TG05d2RHbHZibk11YVdkdWIzSmxWMmhwZEdWemNHRmpaU2tnZTF4dUlDQWdJQ0FnSUNCc2FXNWxJRDBnYkdsdVpTNTBjbWx0S0NrN1hHNGdJQ0FnSUNCOVhHNGdJQ0FnSUNCeVpYUk1hVzVsY3k1d2RYTm9LR3hwYm1VcE8xeHVJQ0FnSUgxY2JpQWdmVnh1WEc0Z0lISmxkSFZ5YmlCeVpYUk1hVzVsY3p0Y2JuMDdYRzVjYm1WNGNHOXlkQ0JtZFc1amRHbHZiaUJrYVdabVRHbHVaWE1vYjJ4a1UzUnlMQ0J1WlhkVGRISXNJR05oYkd4aVlXTnJLU0I3SUhKbGRIVnliaUJzYVc1bFJHbG1aaTVrYVdabUtHOXNaRk4wY2l3Z2JtVjNVM1J5TENCallXeHNZbUZqYXlrN0lIMWNibVY0Y0c5eWRDQm1kVzVqZEdsdmJpQmthV1ptVkhKcGJXMWxaRXhwYm1WektHOXNaRk4wY2l3Z2JtVjNVM1J5TENCallXeHNZbUZqYXlrZ2UxeHVJQ0JzWlhRZ2IzQjBhVzl1Y3lBOUlHZGxibVZ5WVhSbFQzQjBhVzl1Y3loallXeHNZbUZqYXl3Z2UybG5ibTl5WlZkb2FYUmxjM0JoWTJVNklIUnlkV1Y5S1R0Y2JpQWdjbVYwZFhKdUlHeHBibVZFYVdabUxtUnBabVlvYjJ4a1UzUnlMQ0J1WlhkVGRISXNJRzl3ZEdsdmJuTXBPMXh1ZlZ4dUlsMTlcbiIsIi8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cblwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5kaWZmU2VudGVuY2VzID0gZGlmZlNlbnRlbmNlcztcbmV4cG9ydHMuc2VudGVuY2VEaWZmID0gdm9pZCAwO1xuXG4vKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xudmFyXG4vKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG5fYmFzZSA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vYmFzZVwiKSlcbi8qaXN0YW5idWwgaWdub3JlIGVuZCovXG47XG5cbi8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki8gZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbi8qaXN0YW5idWwgaWdub3JlIGVuZCovXG52YXIgc2VudGVuY2VEaWZmID0gbmV3XG4vKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG5fYmFzZVxuLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbltcbi8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cblwiZGVmYXVsdFwiXG4vKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuXSgpO1xuXG4vKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG5leHBvcnRzLnNlbnRlbmNlRGlmZiA9IHNlbnRlbmNlRGlmZjtcblxuLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbnNlbnRlbmNlRGlmZi50b2tlbml6ZSA9IGZ1bmN0aW9uICh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUuc3BsaXQoLyhcXFMuKz9bLiE/XSkoPz1cXHMrfCQpLyk7XG59O1xuXG5mdW5jdGlvbiBkaWZmU2VudGVuY2VzKG9sZFN0ciwgbmV3U3RyLCBjYWxsYmFjaykge1xuICByZXR1cm4gc2VudGVuY2VEaWZmLmRpZmYob2xkU3RyLCBuZXdTdHIsIGNhbGxiYWNrKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OWthV1ptTDNObGJuUmxibU5sTG1weklsMHNJbTVoYldWeklqcGJJbk5sYm5SbGJtTmxSR2xtWmlJc0lrUnBabVlpTENKMGIydGxibWw2WlNJc0luWmhiSFZsSWl3aWMzQnNhWFFpTENKa2FXWm1VMlZ1ZEdWdVkyVnpJaXdpYjJ4a1UzUnlJaXdpYm1WM1UzUnlJaXdpWTJGc2JHSmhZMnNpTENKa2FXWm1JbDBzSW0xaGNIQnBibWR6SWpvaU96czdPenM3T3pzN08wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZCUVRzN096czdRVUZIVHl4SlFVRk5RU3haUVVGWkxFZEJRVWM3UVVGQlNVTTdRVUZCUVVFN1FVRkJRVUU3UVVGQlFVRTdRVUZCUVVFN1FVRkJRVUU3UVVGQlFVRTdRVUZCUVVFc1EwRkJTaXhGUVVGeVFqczdPenM3TzBGQlExQkVMRmxCUVZrc1EwRkJRMFVzVVVGQllpeEhRVUYzUWl4VlFVRlRReXhMUVVGVUxFVkJRV2RDTzBGQlEzUkRMRk5CUVU5QkxFdEJRVXNzUTBGQlEwTXNTMEZCVGl4RFFVRlpMSFZDUVVGYUxFTkJRVkE3UVVGRFJDeERRVVpFT3p0QlFVbFBMRk5CUVZORExHRkJRVlFzUTBGQmRVSkRMRTFCUVhaQ0xFVkJRU3RDUXl4TlFVRXZRaXhGUVVGMVEwTXNVVUZCZGtNc1JVRkJhVVE3UVVGQlJTeFRRVUZQVWl4WlFVRlpMRU5CUVVOVExFbEJRV0lzUTBGQmEwSklMRTFCUVd4Q0xFVkJRVEJDUXl4TlFVRXhRaXhGUVVGclEwTXNVVUZCYkVNc1EwRkJVRHRCUVVGeFJDSXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJbWx0Y0c5eWRDQkVhV1ptSUdaeWIyMGdKeTR2WW1GelpTYzdYRzVjYmx4dVpYaHdiM0owSUdOdmJuTjBJSE5sYm5SbGJtTmxSR2xtWmlBOUlHNWxkeUJFYVdabUtDazdYRzV6Wlc1MFpXNWpaVVJwWm1ZdWRHOXJaVzVwZW1VZ1BTQm1kVzVqZEdsdmJpaDJZV3gxWlNrZ2UxeHVJQ0J5WlhSMWNtNGdkbUZzZFdVdWMzQnNhWFFvTHloY1hGTXVLejliTGlFL1hTa29QejFjWEhNcmZDUXBMeWs3WEc1OU8xeHVYRzVsZUhCdmNuUWdablZ1WTNScGIyNGdaR2xtWmxObGJuUmxibU5sY3lodmJHUlRkSElzSUc1bGQxTjBjaXdnWTJGc2JHSmhZMnNwSUhzZ2NtVjBkWEp1SUhObGJuUmxibU5sUkdsbVppNWthV1ptS0c5c1pGTjBjaXdnYm1WM1UzUnlMQ0JqWVd4c1ltRmpheWs3SUgxY2JpSmRmUT09XG4iLCIvKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG5cInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuZGlmZldvcmRzID0gZGlmZldvcmRzO1xuZXhwb3J0cy5kaWZmV29yZHNXaXRoU3BhY2UgPSBkaWZmV29yZHNXaXRoU3BhY2U7XG5leHBvcnRzLndvcmREaWZmID0gdm9pZCAwO1xuXG4vKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xudmFyXG4vKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG5fYmFzZSA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vYmFzZVwiKSlcbi8qaXN0YW5idWwgaWdub3JlIGVuZCovXG47XG5cbnZhclxuLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuX3BhcmFtcyA9IHJlcXVpcmUoXCIuLi91dGlsL3BhcmFtc1wiKVxuLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbjtcblxuLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqLyBmdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBcImRlZmF1bHRcIjogb2JqIH07IH1cblxuLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbi8vIEJhc2VkIG9uIGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0xhdGluX3NjcmlwdF9pbl9Vbmljb2RlXG4vL1xuLy8gUmFuZ2VzIGFuZCBleGNlcHRpb25zOlxuLy8gTGF0aW4tMSBTdXBwbGVtZW50LCAwMDgw4oCTMDBGRlxuLy8gIC0gVSswMEQ3ICDDlyBNdWx0aXBsaWNhdGlvbiBzaWduXG4vLyAgLSBVKzAwRjcgIMO3IERpdmlzaW9uIHNpZ25cbi8vIExhdGluIEV4dGVuZGVkLUEsIDAxMDDigJMwMTdGXG4vLyBMYXRpbiBFeHRlbmRlZC1CLCAwMTgw4oCTMDI0RlxuLy8gSVBBIEV4dGVuc2lvbnMsIDAyNTDigJMwMkFGXG4vLyBTcGFjaW5nIE1vZGlmaWVyIExldHRlcnMsIDAyQjDigJMwMkZGXG4vLyAgLSBVKzAyQzcgIMuHICYjNzExOyAgQ2Fyb25cbi8vICAtIFUrMDJEOCAgy5ggJiM3Mjg7ICBCcmV2ZVxuLy8gIC0gVSswMkQ5ICDLmSAmIzcyOTsgIERvdCBBYm92ZVxuLy8gIC0gVSswMkRBICDLmiAmIzczMDsgIFJpbmcgQWJvdmVcbi8vICAtIFUrMDJEQiAgy5sgJiM3MzE7ICBPZ29uZWtcbi8vICAtIFUrMDJEQyAgy5wgJiM3MzI7ICBTbWFsbCBUaWxkZVxuLy8gIC0gVSswMkREICDLnSAmIzczMzsgIERvdWJsZSBBY3V0ZSBBY2NlbnRcbi8vIExhdGluIEV4dGVuZGVkIEFkZGl0aW9uYWwsIDFFMDDigJMxRUZGXG52YXIgZXh0ZW5kZWRXb3JkQ2hhcnMgPSAvXltBLVphLXpcXHhDMC1cXHUwMkM2XFx1MDJDOC1cXHUwMkQ3XFx1MDJERS1cXHUwMkZGXFx1MUUwMC1cXHUxRUZGXSskLztcbnZhciByZVdoaXRlc3BhY2UgPSAvXFxTLztcbnZhciB3b3JkRGlmZiA9IG5ld1xuLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuX2Jhc2Vcbi8qaXN0YW5idWwgaWdub3JlIGVuZCovXG5bXG4vKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG5cImRlZmF1bHRcIlxuLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbl0oKTtcblxuLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuZXhwb3J0cy53b3JkRGlmZiA9IHdvcmREaWZmO1xuXG4vKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xud29yZERpZmYuZXF1YWxzID0gZnVuY3Rpb24gKGxlZnQsIHJpZ2h0KSB7XG4gIGlmICh0aGlzLm9wdGlvbnMuaWdub3JlQ2FzZSkge1xuICAgIGxlZnQgPSBsZWZ0LnRvTG93ZXJDYXNlKCk7XG4gICAgcmlnaHQgPSByaWdodC50b0xvd2VyQ2FzZSgpO1xuICB9XG5cbiAgcmV0dXJuIGxlZnQgPT09IHJpZ2h0IHx8IHRoaXMub3B0aW9ucy5pZ25vcmVXaGl0ZXNwYWNlICYmICFyZVdoaXRlc3BhY2UudGVzdChsZWZ0KSAmJiAhcmVXaGl0ZXNwYWNlLnRlc3QocmlnaHQpO1xufTtcblxud29yZERpZmYudG9rZW5pemUgPSBmdW5jdGlvbiAodmFsdWUpIHtcbiAgLy8gQWxsIHdoaXRlc3BhY2Ugc3ltYm9scyBleGNlcHQgbmV3bGluZSBncm91cCBpbnRvIG9uZSB0b2tlbiwgZWFjaCBuZXdsaW5lIC0gaW4gc2VwYXJhdGUgdG9rZW5cbiAgdmFyIHRva2VucyA9IHZhbHVlLnNwbGl0KC8oW15cXFNcXHJcXG5dK3xbKClbXFxde30nXCJcXHJcXG5dfFxcYikvKTsgLy8gSm9pbiB0aGUgYm91bmRhcnkgc3BsaXRzIHRoYXQgd2UgZG8gbm90IGNvbnNpZGVyIHRvIGJlIGJvdW5kYXJpZXMuIFRoaXMgaXMgcHJpbWFyaWx5IHRoZSBleHRlbmRlZCBMYXRpbiBjaGFyYWN0ZXIgc2V0LlxuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdG9rZW5zLmxlbmd0aCAtIDE7IGkrKykge1xuICAgIC8vIElmIHdlIGhhdmUgYW4gZW1wdHkgc3RyaW5nIGluIHRoZSBuZXh0IGZpZWxkIGFuZCB3ZSBoYXZlIG9ubHkgd29yZCBjaGFycyBiZWZvcmUgYW5kIGFmdGVyLCBtZXJnZVxuICAgIGlmICghdG9rZW5zW2kgKyAxXSAmJiB0b2tlbnNbaSArIDJdICYmIGV4dGVuZGVkV29yZENoYXJzLnRlc3QodG9rZW5zW2ldKSAmJiBleHRlbmRlZFdvcmRDaGFycy50ZXN0KHRva2Vuc1tpICsgMl0pKSB7XG4gICAgICB0b2tlbnNbaV0gKz0gdG9rZW5zW2kgKyAyXTtcbiAgICAgIHRva2Vucy5zcGxpY2UoaSArIDEsIDIpO1xuICAgICAgaS0tO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0b2tlbnM7XG59O1xuXG5mdW5jdGlvbiBkaWZmV29yZHMob2xkU3RyLCBuZXdTdHIsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9XG4gIC8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cbiAgKDAsXG4gIC8qaXN0YW5idWwgaWdub3JlIGVuZCovXG5cbiAgLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuICBfcGFyYW1zXG4gIC8qaXN0YW5idWwgaWdub3JlIGVuZCovXG4gIC5cbiAgLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuICBnZW5lcmF0ZU9wdGlvbnMpXG4gIC8qaXN0YW5idWwgaWdub3JlIGVuZCovXG4gIChvcHRpb25zLCB7XG4gICAgaWdub3JlV2hpdGVzcGFjZTogdHJ1ZVxuICB9KTtcbiAgcmV0dXJuIHdvcmREaWZmLmRpZmYob2xkU3RyLCBuZXdTdHIsIG9wdGlvbnMpO1xufVxuXG5mdW5jdGlvbiBkaWZmV29yZHNXaXRoU3BhY2Uob2xkU3RyLCBuZXdTdHIsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIHdvcmREaWZmLmRpZmYob2xkU3RyLCBuZXdTdHIsIG9wdGlvbnMpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5a2FXWm1MM2R2Y21RdWFuTWlYU3dpYm1GdFpYTWlPbHNpWlhoMFpXNWtaV1JYYjNKa1EyaGhjbk1pTENKeVpWZG9hWFJsYzNCaFkyVWlMQ0ozYjNKa1JHbG1aaUlzSWtScFptWWlMQ0psY1hWaGJITWlMQ0pzWldaMElpd2ljbWxuYUhRaUxDSnZjSFJwYjI1eklpd2lhV2R1YjNKbFEyRnpaU0lzSW5SdlRHOTNaWEpEWVhObElpd2lhV2R1YjNKbFYyaHBkR1Z6Y0dGalpTSXNJblJsYzNRaUxDSjBiMnRsYm1sNlpTSXNJblpoYkhWbElpd2lkRzlyWlc1eklpd2ljM0JzYVhRaUxDSnBJaXdpYkdWdVozUm9JaXdpYzNCc2FXTmxJaXdpWkdsbVpsZHZjbVJ6SWl3aWIyeGtVM1J5SWl3aWJtVjNVM1J5SWl3aVoyVnVaWEpoZEdWUGNIUnBiMjV6SWl3aVpHbG1aaUlzSW1ScFptWlhiM0prYzFkcGRHaFRjR0ZqWlNKZExDSnRZWEJ3YVc1bmN5STZJanM3T3pzN096czdPenM3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVRkJPenRCUVVOQk8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlFVRTdPenM3TzBGQlJVRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRXNTVUZCVFVFc2FVSkJRV2xDTEVkQlFVY3NLMFJCUVRGQ08wRkJSVUVzU1VGQlRVTXNXVUZCV1N4SFFVRkhMRWxCUVhKQ08wRkJSVThzU1VGQlRVTXNVVUZCVVN4SFFVRkhPMEZCUVVsRE8wRkJRVUZCTzBGQlFVRkJPMEZCUVVGQk8wRkJRVUZCTzBGQlFVRkJPMEZCUVVGQk8wRkJRVUZCTEVOQlFVb3NSVUZCYWtJN096czdPenRCUVVOUVJDeFJRVUZSTEVOQlFVTkZMRTFCUVZRc1IwRkJhMElzVlVGQlUwTXNTVUZCVkN4RlFVRmxReXhMUVVGbUxFVkJRWE5DTzBGQlEzUkRMRTFCUVVrc1MwRkJTME1zVDBGQlRDeERRVUZoUXl4VlFVRnFRaXhGUVVFMlFqdEJRVU16UWtnc1NVRkJRVUVzU1VGQlNTeEhRVUZIUVN4SlFVRkpMRU5CUVVOSkxGZEJRVXdzUlVGQlVEdEJRVU5CU0N4SlFVRkJRU3hMUVVGTExFZEJRVWRCTEV0QlFVc3NRMEZCUTBjc1YwRkJUaXhGUVVGU08wRkJRMFE3TzBGQlEwUXNVMEZCVDBvc1NVRkJTU3hMUVVGTFF5eExRVUZVTEVsQlFXMUNMRXRCUVV0RExFOUJRVXdzUTBGQllVY3NaMEpCUVdJc1NVRkJhVU1zUTBGQlExUXNXVUZCV1N4RFFVRkRWU3hKUVVGaUxFTkJRV3RDVGl4SlFVRnNRaXhEUVVGc1F5eEpRVUUyUkN4RFFVRkRTaXhaUVVGWkxFTkJRVU5WTEVsQlFXSXNRMEZCYTBKTUxFdEJRV3hDTEVOQlFYaEdPMEZCUTBRc1EwRk9SRHM3UVVGUFFVb3NVVUZCVVN4RFFVRkRWU3hSUVVGVUxFZEJRVzlDTEZWQlFWTkRMRXRCUVZRc1JVRkJaMEk3UVVGRGJFTTdRVUZEUVN4TlFVRkpReXhOUVVGTkxFZEJRVWRFTEV0QlFVc3NRMEZCUTBVc1MwRkJUaXhEUVVGWkxHbERRVUZhTEVOQlFXSXNRMEZHYTBNc1EwRkpiRU03TzBGQlEwRXNUMEZCU3l4SlFVRkpReXhEUVVGRExFZEJRVWNzUTBGQllpeEZRVUZuUWtFc1EwRkJReXhIUVVGSFJpeE5RVUZOTEVOQlFVTkhMRTFCUVZBc1IwRkJaMElzUTBGQmNFTXNSVUZCZFVORUxFTkJRVU1zUlVGQmVFTXNSVUZCTkVNN1FVRkRNVU03UVVGRFFTeFJRVUZKTEVOQlFVTkdMRTFCUVUwc1EwRkJRMFVzUTBGQlF5eEhRVUZITEVOQlFVd3NRMEZCVUN4SlFVRnJRa1lzVFVGQlRTeERRVUZEUlN4RFFVRkRMRWRCUVVjc1EwRkJUQ3hEUVVGNFFpeEpRVU5MYUVJc2FVSkJRV2xDTEVOQlFVTlhMRWxCUVd4Q0xFTkJRWFZDUnl4TlFVRk5MRU5CUVVORkxFTkJRVVFzUTBGQk4wSXNRMEZFVEN4SlFVVkxhRUlzYVVKQlFXbENMRU5CUVVOWExFbEJRV3hDTEVOQlFYVkNSeXhOUVVGTkxFTkJRVU5GTEVOQlFVTXNSMEZCUnl4RFFVRk1MRU5CUVRkQ0xFTkJSbFFzUlVGRlowUTdRVUZET1VOR0xFMUJRVUZCTEUxQlFVMHNRMEZCUTBVc1EwRkJSQ3hEUVVGT0xFbEJRV0ZHTEUxQlFVMHNRMEZCUTBVc1EwRkJReXhIUVVGSExFTkJRVXdzUTBGQmJrSTdRVUZEUVVZc1RVRkJRVUVzVFVGQlRTeERRVUZEU1N4TlFVRlFMRU5CUVdOR0xFTkJRVU1zUjBGQlJ5eERRVUZzUWl4RlFVRnhRaXhEUVVGeVFqdEJRVU5CUVN4TlFVRkJRU3hEUVVGRE8wRkJRMFk3UVVGRFJqczdRVUZGUkN4VFFVRlBSaXhOUVVGUU8wRkJRMFFzUTBGcVFrUTdPMEZCYlVKUExGTkJRVk5MTEZOQlFWUXNRMEZCYlVKRExFMUJRVzVDTEVWQlFUSkNReXhOUVVFelFpeEZRVUZ0UTJRc1QwRkJia01zUlVGQk5FTTdRVUZEYWtSQkxFVkJRVUZCTEU5QlFVODdRVUZCUnp0QlFVRkJPMEZCUVVFN08wRkJRVUZsTzBGQlFVRkJPMEZCUVVGQk8wRkJRVUZCTzBGQlFVRkJPMEZCUVVGQk8wRkJRVUU3UVVGQlFTeEhRVUZuUW1Zc1QwRkJhRUlzUlVGQmVVSTdRVUZCUTBjc1NVRkJRVUVzWjBKQlFXZENMRVZCUVVVN1FVRkJia0lzUjBGQmVrSXNRMEZCVmp0QlFVTkJMRk5CUVU5U0xGRkJRVkVzUTBGQlEzRkNMRWxCUVZRc1EwRkJZMGdzVFVGQlpDeEZRVUZ6UWtNc1RVRkJkRUlzUlVGQk9FSmtMRTlCUVRsQ0xFTkJRVkE3UVVGRFJEczdRVUZGVFN4VFFVRlRhVUlzYTBKQlFWUXNRMEZCTkVKS0xFMUJRVFZDTEVWQlFXOURReXhOUVVGd1F5eEZRVUUwUTJRc1QwRkJOVU1zUlVGQmNVUTdRVUZETVVRc1UwRkJUMHdzVVVGQlVTeERRVUZEY1VJc1NVRkJWQ3hEUVVGalNDeE5RVUZrTEVWQlFYTkNReXhOUVVGMFFpeEZRVUU0UW1Rc1QwRkJPVUlzUTBGQlVEdEJRVU5FSWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaWFXMXdiM0owSUVScFptWWdabkp2YlNBbkxpOWlZWE5sSnp0Y2JtbHRjRzl5ZENCN1oyVnVaWEpoZEdWUGNIUnBiMjV6ZlNCbWNtOXRJQ2N1TGk5MWRHbHNMM0JoY21GdGN5YzdYRzVjYmk4dklFSmhjMlZrSUc5dUlHaDBkSEJ6T2k4dlpXNHVkMmxyYVhCbFpHbGhMbTl5Wnk5M2FXdHBMMHhoZEdsdVgzTmpjbWx3ZEY5cGJsOVZibWxqYjJSbFhHNHZMMXh1THk4Z1VtRnVaMlZ6SUdGdVpDQmxlR05sY0hScGIyNXpPbHh1THk4Z1RHRjBhVzR0TVNCVGRYQndiR1Z0Wlc1MExDQXdNRGd3NG9DVE1EQkdSbHh1THk4Z0lDMGdWU3N3TUVRM0lDRERseUJOZFd4MGFYQnNhV05oZEdsdmJpQnphV2R1WEc0dkx5QWdMU0JWS3pBd1JqY2dJTU8zSUVScGRtbHphVzl1SUhOcFoyNWNiaTh2SUV4aGRHbHVJRVY0ZEdWdVpHVmtMVUVzSURBeE1ERGlnSk13TVRkR1hHNHZMeUJNWVhScGJpQkZlSFJsYm1SbFpDMUNMQ0F3TVRndzRvQ1RNREkwUmx4dUx5OGdTVkJCSUVWNGRHVnVjMmx2Ym5Nc0lEQXlOVERpZ0pNd01rRkdYRzR2THlCVGNHRmphVzVuSUUxdlpHbG1hV1Z5SUV4bGRIUmxjbk1zSURBeVFqRGlnSk13TWtaR1hHNHZMeUFnTFNCVkt6QXlRemNnSU11SElDWWpOekV4T3lBZ1EyRnliMjVjYmk4dklDQXRJRlVyTURKRU9DQWd5NWdnSmlNM01qZzdJQ0JDY21WMlpWeHVMeThnSUMwZ1ZTc3dNa1E1SUNETG1TQW1JemN5T1RzZ0lFUnZkQ0JCWW05MlpWeHVMeThnSUMwZ1ZTc3dNa1JCSUNETG1pQW1JemN6TURzZ0lGSnBibWNnUVdKdmRtVmNiaTh2SUNBdElGVXJNREpFUWlBZ3k1c2dKaU0zTXpFN0lDQlBaMjl1Wld0Y2JpOHZJQ0F0SUZVck1ESkVReUFneTV3Z0ppTTNNekk3SUNCVGJXRnNiQ0JVYVd4a1pWeHVMeThnSUMwZ1ZTc3dNa1JFSUNETG5TQW1JemN6TXpzZ0lFUnZkV0pzWlNCQlkzVjBaU0JCWTJObGJuUmNiaTh2SUV4aGRHbHVJRVY0ZEdWdVpHVmtJRUZrWkdsMGFXOXVZV3dzSURGRk1ERGlnSk14UlVaR1hHNWpiMjV6ZENCbGVIUmxibVJsWkZkdmNtUkRhR0Z5Y3lBOUlDOWVXMkV0ZWtFdFdseGNkWHRETUgwdFhGeDFlMFpHZlZ4Y2RYdEVPSDB0WEZ4MWUwWTJmVnhjZFh0R09IMHRYRngxZXpKRE5uMWNYSFY3TWtNNGZTMWNYSFY3TWtRM2ZWeGNkWHN5UkVWOUxWeGNkWHN5UmtaOVhGeDFlekZGTURCOUxWeGNkWHN4UlVaR2ZWMHJKQzkxTzF4dVhHNWpiMjV6ZENCeVpWZG9hWFJsYzNCaFkyVWdQU0F2WEZ4VEx6dGNibHh1Wlhod2IzSjBJR052Ym5OMElIZHZjbVJFYVdabUlEMGdibVYzSUVScFptWW9LVHRjYm5kdmNtUkVhV1ptTG1WeGRXRnNjeUE5SUdaMWJtTjBhVzl1S0d4bFpuUXNJSEpwWjJoMEtTQjdYRzRnSUdsbUlDaDBhR2x6TG05d2RHbHZibk11YVdkdWIzSmxRMkZ6WlNrZ2UxeHVJQ0FnSUd4bFpuUWdQU0JzWldaMExuUnZURzkzWlhKRFlYTmxLQ2s3WEc0Z0lDQWdjbWxuYUhRZ1BTQnlhV2RvZEM1MGIweHZkMlZ5UTJGelpTZ3BPMXh1SUNCOVhHNGdJSEpsZEhWeWJpQnNaV1owSUQwOVBTQnlhV2RvZENCOGZDQW9kR2hwY3k1dmNIUnBiMjV6TG1sbmJtOXlaVmRvYVhSbGMzQmhZMlVnSmlZZ0lYSmxWMmhwZEdWemNHRmpaUzUwWlhOMEtHeGxablFwSUNZbUlDRnlaVmRvYVhSbGMzQmhZMlV1ZEdWemRDaHlhV2RvZENrcE8xeHVmVHRjYm5kdmNtUkVhV1ptTG5SdmEyVnVhWHBsSUQwZ1puVnVZM1JwYjI0b2RtRnNkV1VwSUh0Y2JpQWdMeThnUVd4c0lIZG9hWFJsYzNCaFkyVWdjM2x0WW05c2N5QmxlR05sY0hRZ2JtVjNiR2x1WlNCbmNtOTFjQ0JwYm5SdklHOXVaU0IwYjJ0bGJpd2daV0ZqYUNCdVpYZHNhVzVsSUMwZ2FXNGdjMlZ3WVhKaGRHVWdkRzlyWlc1Y2JpQWdiR1YwSUhSdmEyVnVjeUE5SUhaaGJIVmxMbk53YkdsMEtDOG9XMTVjWEZOY1hISmNYRzVkSzN4YktDbGJYRnhkZTMwblhDSmNYSEpjWEc1ZGZGeGNZaWt2S1R0Y2JseHVJQ0F2THlCS2IybHVJSFJvWlNCaWIzVnVaR0Z5ZVNCemNHeHBkSE1nZEdoaGRDQjNaU0JrYnlCdWIzUWdZMjl1YzJsa1pYSWdkRzhnWW1VZ1ltOTFibVJoY21sbGN5NGdWR2hwY3lCcGN5QndjbWx0WVhKcGJIa2dkR2hsSUdWNGRHVnVaR1ZrSUV4aGRHbHVJR05vWVhKaFkzUmxjaUJ6WlhRdVhHNGdJR1p2Y2lBb2JHVjBJR2tnUFNBd095QnBJRHdnZEc5clpXNXpMbXhsYm1kMGFDQXRJREU3SUdrckt5a2dlMXh1SUNBZ0lDOHZJRWxtSUhkbElHaGhkbVVnWVc0Z1pXMXdkSGtnYzNSeWFXNW5JR2x1SUhSb1pTQnVaWGgwSUdacFpXeGtJR0Z1WkNCM1pTQm9ZWFpsSUc5dWJIa2dkMjl5WkNCamFHRnljeUJpWldadmNtVWdZVzVrSUdGbWRHVnlMQ0J0WlhKblpWeHVJQ0FnSUdsbUlDZ2hkRzlyWlc1elcya2dLeUF4WFNBbUppQjBiMnRsYm5OYmFTQXJJREpkWEc0Z0lDQWdJQ0FnSUNBZ0ppWWdaWGgwWlc1a1pXUlhiM0prUTJoaGNuTXVkR1Z6ZENoMGIydGxibk5iYVYwcFhHNGdJQ0FnSUNBZ0lDQWdKaVlnWlhoMFpXNWtaV1JYYjNKa1EyaGhjbk11ZEdWemRDaDBiMnRsYm5OYmFTQXJJREpkS1NrZ2UxeHVJQ0FnSUNBZ2RHOXJaVzV6VzJsZElDczlJSFJ2YTJWdWMxdHBJQ3NnTWwwN1hHNGdJQ0FnSUNCMGIydGxibk11YzNCc2FXTmxLR2tnS3lBeExDQXlLVHRjYmlBZ0lDQWdJR2t0TFR0Y2JpQWdJQ0I5WEc0Z0lIMWNibHh1SUNCeVpYUjFjbTRnZEc5clpXNXpPMXh1ZlR0Y2JseHVaWGh3YjNKMElHWjFibU4wYVc5dUlHUnBabVpYYjNKa2N5aHZiR1JUZEhJc0lHNWxkMU4wY2l3Z2IzQjBhVzl1Y3lrZ2UxeHVJQ0J2Y0hScGIyNXpJRDBnWjJWdVpYSmhkR1ZQY0hScGIyNXpLRzl3ZEdsdmJuTXNJSHRwWjI1dmNtVlhhR2wwWlhOd1lXTmxPaUIwY25WbGZTazdYRzRnSUhKbGRIVnliaUIzYjNKa1JHbG1aaTVrYVdabUtHOXNaRk4wY2l3Z2JtVjNVM1J5TENCdmNIUnBiMjV6S1R0Y2JuMWNibHh1Wlhod2IzSjBJR1oxYm1OMGFXOXVJR1JwWm1aWGIzSmtjMWRwZEdoVGNHRmpaU2h2YkdSVGRISXNJRzVsZDFOMGNpd2diM0IwYVc5dWN5a2dlMXh1SUNCeVpYUjFjbTRnZDI5eVpFUnBabVl1WkdsbVppaHZiR1JUZEhJc0lHNWxkMU4wY2l3Z2IzQjBhVzl1Y3lrN1hHNTlYRzRpWFgwPVxuIiwiLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJEaWZmXCIsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9iYXNlW1wiZGVmYXVsdFwiXTtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJkaWZmQ2hhcnNcIiwge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2NoYXJhY3Rlci5kaWZmQ2hhcnM7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiZGlmZldvcmRzXCIsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF93b3JkLmRpZmZXb3JkcztcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJkaWZmV29yZHNXaXRoU3BhY2VcIiwge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3dvcmQuZGlmZldvcmRzV2l0aFNwYWNlO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImRpZmZMaW5lc1wiLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfbGluZS5kaWZmTGluZXM7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiZGlmZlRyaW1tZWRMaW5lc1wiLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfbGluZS5kaWZmVHJpbW1lZExpbmVzO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImRpZmZTZW50ZW5jZXNcIiwge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX3NlbnRlbmNlLmRpZmZTZW50ZW5jZXM7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiZGlmZkNzc1wiLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfY3NzLmRpZmZDc3M7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiZGlmZkpzb25cIiwge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2pzb24uZGlmZkpzb247XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiY2Fub25pY2FsaXplXCIsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9qc29uLmNhbm9uaWNhbGl6ZTtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJkaWZmQXJyYXlzXCIsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9hcnJheS5kaWZmQXJyYXlzO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImFwcGx5UGF0Y2hcIiwge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2FwcGx5LmFwcGx5UGF0Y2g7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiYXBwbHlQYXRjaGVzXCIsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9hcHBseS5hcHBseVBhdGNoZXM7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwicGFyc2VQYXRjaFwiLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfcGFyc2UucGFyc2VQYXRjaDtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJtZXJnZVwiLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfbWVyZ2UubWVyZ2U7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwic3RydWN0dXJlZFBhdGNoXCIsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9jcmVhdGUuc3RydWN0dXJlZFBhdGNoO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImNyZWF0ZVR3b0ZpbGVzUGF0Y2hcIiwge1xuICBlbnVtZXJhYmxlOiB0cnVlLFxuICBnZXQ6IGZ1bmN0aW9uIGdldCgpIHtcbiAgICByZXR1cm4gX2NyZWF0ZS5jcmVhdGVUd29GaWxlc1BhdGNoO1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcImNyZWF0ZVBhdGNoXCIsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgcmV0dXJuIF9jcmVhdGUuY3JlYXRlUGF0Y2g7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiY29udmVydENoYW5nZXNUb0RNUFwiLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfZG1wLmNvbnZlcnRDaGFuZ2VzVG9ETVA7XG4gIH1cbn0pO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiY29udmVydENoYW5nZXNUb1hNTFwiLCB7XG4gIGVudW1lcmFibGU6IHRydWUsXG4gIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgIHJldHVybiBfeG1sLmNvbnZlcnRDaGFuZ2VzVG9YTUw7XG4gIH1cbn0pO1xuXG4vKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xudmFyXG4vKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG5fYmFzZSA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4vZGlmZi9iYXNlXCIpKVxuLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbjtcblxudmFyXG4vKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG5fY2hhcmFjdGVyID0gcmVxdWlyZShcIi4vZGlmZi9jaGFyYWN0ZXJcIilcbi8qaXN0YW5idWwgaWdub3JlIGVuZCovXG47XG5cbnZhclxuLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuX3dvcmQgPSByZXF1aXJlKFwiLi9kaWZmL3dvcmRcIilcbi8qaXN0YW5idWwgaWdub3JlIGVuZCovXG47XG5cbnZhclxuLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuX2xpbmUgPSByZXF1aXJlKFwiLi9kaWZmL2xpbmVcIilcbi8qaXN0YW5idWwgaWdub3JlIGVuZCovXG47XG5cbnZhclxuLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuX3NlbnRlbmNlID0gcmVxdWlyZShcIi4vZGlmZi9zZW50ZW5jZVwiKVxuLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbjtcblxudmFyXG4vKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG5fY3NzID0gcmVxdWlyZShcIi4vZGlmZi9jc3NcIilcbi8qaXN0YW5idWwgaWdub3JlIGVuZCovXG47XG5cbnZhclxuLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuX2pzb24gPSByZXF1aXJlKFwiLi9kaWZmL2pzb25cIilcbi8qaXN0YW5idWwgaWdub3JlIGVuZCovXG47XG5cbnZhclxuLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuX2FycmF5ID0gcmVxdWlyZShcIi4vZGlmZi9hcnJheVwiKVxuLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbjtcblxudmFyXG4vKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG5fYXBwbHkgPSByZXF1aXJlKFwiLi9wYXRjaC9hcHBseVwiKVxuLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbjtcblxudmFyXG4vKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG5fcGFyc2UgPSByZXF1aXJlKFwiLi9wYXRjaC9wYXJzZVwiKVxuLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbjtcblxudmFyXG4vKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG5fbWVyZ2UgPSByZXF1aXJlKFwiLi9wYXRjaC9tZXJnZVwiKVxuLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbjtcblxudmFyXG4vKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG5fY3JlYXRlID0gcmVxdWlyZShcIi4vcGF0Y2gvY3JlYXRlXCIpXG4vKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuO1xuXG52YXJcbi8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cbl9kbXAgPSByZXF1aXJlKFwiLi9jb252ZXJ0L2RtcFwiKVxuLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbjtcblxudmFyXG4vKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG5feG1sID0gcmVxdWlyZShcIi4vY29udmVydC94bWxcIilcbi8qaXN0YW5idWwgaWdub3JlIGVuZCovXG47XG5cbi8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki8gZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgXCJkZWZhdWx0XCI6IG9iaiB9OyB9XG5cbi8qaXN0YW5idWwgaWdub3JlIGVuZCovXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1TDNOeVl5OXBibVJsZUM1cWN5SmRMQ0p1WVcxbGN5STZXMTBzSW0xaGNIQnBibWR6SWpvaU96czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096czdPenM3T3pzN096dEJRV2RDUVR0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVGQk96dEJRVU5CTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCUVVFN08wRkJRMEU3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZCUVRzN1FVRkRRVHRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVUZCT3p0QlFVTkJPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJRVUU3TzBGQlJVRTdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkJRVHM3UVVGRFFUdEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVRkJPenRCUVVWQk8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlFVRTdPMEZCUlVFN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGQlFUczdRVUZEUVR0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVGQk96dEJRVU5CTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCUVVFN08wRkJRMEU3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZCUVRzN1FVRkZRVHRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVUZCT3p0QlFVTkJPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJRVUVpTENKemIzVnlZMlZ6UTI5dWRHVnVkQ0k2V3lJdktpQlRaV1VnVEVsRFJVNVRSU0JtYVd4bElHWnZjaUIwWlhKdGN5QnZaaUIxYzJVZ0tpOWNibHh1THlwY2JpQXFJRlJsZUhRZ1pHbG1aaUJwYlhCc1pXMWxiblJoZEdsdmJpNWNiaUFxWEc0Z0tpQlVhR2x6SUd4cFluSmhjbmtnYzNWd2NHOXlkSE1nZEdobElHWnZiR3h2ZDJsdVp5QkJVRWxUT2x4dUlDb2dTbk5FYVdabUxtUnBabVpEYUdGeWN6b2dRMmhoY21GamRHVnlJR0o1SUdOb1lYSmhZM1JsY2lCa2FXWm1YRzRnS2lCS2MwUnBabVl1WkdsbVpsZHZjbVJ6T2lCWGIzSmtJQ2hoY3lCa1pXWnBibVZrSUdKNUlGeGNZaUJ5WldkbGVDa2daR2xtWmlCM2FHbGphQ0JwWjI1dmNtVnpJSGRvYVhSbGMzQmhZMlZjYmlBcUlFcHpSR2xtWmk1a2FXWm1UR2x1WlhNNklFeHBibVVnWW1GelpXUWdaR2xtWmx4dUlDcGNiaUFxSUVwelJHbG1aaTVrYVdabVEzTnpPaUJFYVdabUlIUmhjbWRsZEdWa0lHRjBJRU5UVXlCamIyNTBaVzUwWEc0Z0tseHVJQ29nVkdobGMyVWdiV1YwYUc5a2N5QmhjbVVnWW1GelpXUWdiMjRnZEdobElHbHRjR3hsYldWdWRHRjBhVzl1SUhCeWIzQnZjMlZrSUdsdVhHNGdLaUJjSWtGdUlFOG9Ua1FwSUVScFptWmxjbVZ1WTJVZ1FXeG5iM0pwZEdodElHRnVaQ0JwZEhNZ1ZtRnlhV0YwYVc5dWMxd2lJQ2hOZVdWeWN5d2dNVGs0TmlrdVhHNGdLaUJvZEhSd09pOHZZMmwwWlhObFpYSjRMbWx6ZEM1d2MzVXVaV1IxTDNacFpYZGtiMk12YzNWdGJXRnllVDlrYjJrOU1UQXVNUzR4TGpRdU5qa3lOMXh1SUNvdlhHNXBiWEJ2Y25RZ1JHbG1aaUJtY205dElDY3VMMlJwWm1ZdlltRnpaU2M3WEc1cGJYQnZjblFnZTJScFptWkRhR0Z5YzMwZ1puSnZiU0FuTGk5a2FXWm1MMk5vWVhKaFkzUmxjaWM3WEc1cGJYQnZjblFnZTJScFptWlhiM0prY3l3Z1pHbG1abGR2Y21SelYybDBhRk53WVdObGZTQm1jbTl0SUNjdUwyUnBabVl2ZDI5eVpDYzdYRzVwYlhCdmNuUWdlMlJwWm1aTWFXNWxjeXdnWkdsbVpsUnlhVzF0WldSTWFXNWxjMzBnWm5KdmJTQW5MaTlrYVdabUwyeHBibVVuTzF4dWFXMXdiM0owSUh0a2FXWm1VMlZ1ZEdWdVkyVnpmU0JtY205dElDY3VMMlJwWm1ZdmMyVnVkR1Z1WTJVbk8xeHVYRzVwYlhCdmNuUWdlMlJwWm1aRGMzTjlJR1p5YjIwZ0p5NHZaR2xtWmk5amMzTW5PMXh1YVcxd2IzSjBJSHRrYVdabVNuTnZiaXdnWTJGdWIyNXBZMkZzYVhwbGZTQm1jbTl0SUNjdUwyUnBabVl2YW5OdmJpYzdYRzVjYm1sdGNHOXlkQ0I3WkdsbVprRnljbUY1YzMwZ1puSnZiU0FuTGk5a2FXWm1MMkZ5Y21GNUp6dGNibHh1YVcxd2IzSjBJSHRoY0hCc2VWQmhkR05vTENCaGNIQnNlVkJoZEdOb1pYTjlJR1p5YjIwZ0p5NHZjR0YwWTJndllYQndiSGtuTzF4dWFXMXdiM0owSUh0d1lYSnpaVkJoZEdOb2ZTQm1jbTl0SUNjdUwzQmhkR05vTDNCaGNuTmxKenRjYm1sdGNHOXlkQ0I3YldWeVoyVjlJR1p5YjIwZ0p5NHZjR0YwWTJndmJXVnlaMlVuTzF4dWFXMXdiM0owSUh0emRISjFZM1IxY21Wa1VHRjBZMmdzSUdOeVpXRjBaVlIzYjBacGJHVnpVR0YwWTJnc0lHTnlaV0YwWlZCaGRHTm9mU0JtY205dElDY3VMM0JoZEdOb0wyTnlaV0YwWlNjN1hHNWNibWx0Y0c5eWRDQjdZMjl1ZG1WeWRFTm9ZVzVuWlhOVWIwUk5VSDBnWm5KdmJTQW5MaTlqYjI1MlpYSjBMMlJ0Y0NjN1hHNXBiWEJ2Y25RZ2UyTnZiblpsY25SRGFHRnVaMlZ6Vkc5WVRVeDlJR1p5YjIwZ0p5NHZZMjl1ZG1WeWRDOTRiV3duTzF4dVhHNWxlSEJ2Y25RZ2UxeHVJQ0JFYVdabUxGeHVYRzRnSUdScFptWkRhR0Z5Y3l4Y2JpQWdaR2xtWmxkdmNtUnpMRnh1SUNCa2FXWm1WMjl5WkhOWGFYUm9VM0JoWTJVc1hHNGdJR1JwWm1aTWFXNWxjeXhjYmlBZ1pHbG1abFJ5YVcxdFpXUk1hVzVsY3l4Y2JpQWdaR2xtWmxObGJuUmxibU5sY3l4Y2JseHVJQ0JrYVdabVEzTnpMRnh1SUNCa2FXWm1Tbk52Yml4Y2JseHVJQ0JrYVdabVFYSnlZWGx6TEZ4dVhHNGdJSE4wY25WamRIVnlaV1JRWVhSamFDeGNiaUFnWTNKbFlYUmxWSGR2Um1sc1pYTlFZWFJqYUN4Y2JpQWdZM0psWVhSbFVHRjBZMmdzWEc0Z0lHRndjR3g1VUdGMFkyZ3NYRzRnSUdGd2NHeDVVR0YwWTJobGN5eGNiaUFnY0dGeWMyVlFZWFJqYUN4Y2JpQWdiV1Z5WjJVc1hHNGdJR052Ym5abGNuUkRhR0Z1WjJWelZHOUVUVkFzWEc0Z0lHTnZiblpsY25SRGFHRnVaMlZ6Vkc5WVRVd3NYRzRnSUdOaGJtOXVhV05oYkdsNlpWeHVmVHRjYmlKZGZRPT1cbiIsIi8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cblwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5hcHBseVBhdGNoID0gYXBwbHlQYXRjaDtcbmV4cG9ydHMuYXBwbHlQYXRjaGVzID0gYXBwbHlQYXRjaGVzO1xuXG4vKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xudmFyXG4vKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG5fcGFyc2UgPSByZXF1aXJlKFwiLi9wYXJzZVwiKVxuLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbjtcblxudmFyXG4vKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG5fZGlzdGFuY2VJdGVyYXRvciA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQocmVxdWlyZShcIi4uL3V0aWwvZGlzdGFuY2UtaXRlcmF0b3JcIikpXG4vKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuO1xuXG4vKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovIGZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IFwiZGVmYXVsdFwiOiBvYmogfTsgfVxuXG4vKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuZnVuY3Rpb24gYXBwbHlQYXRjaChzb3VyY2UsIHVuaURpZmYpIHtcbiAgLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuICB2YXJcbiAgLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbiAgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDoge307XG5cbiAgaWYgKHR5cGVvZiB1bmlEaWZmID09PSAnc3RyaW5nJykge1xuICAgIHVuaURpZmYgPVxuICAgIC8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cbiAgICAoMCxcbiAgICAvKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuXG4gICAgLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuICAgIF9wYXJzZVxuICAgIC8qaXN0YW5idWwgaWdub3JlIGVuZCovXG4gICAgLlxuICAgIC8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cbiAgICBwYXJzZVBhdGNoKVxuICAgIC8qaXN0YW5idWwgaWdub3JlIGVuZCovXG4gICAgKHVuaURpZmYpO1xuICB9XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkodW5pRGlmZikpIHtcbiAgICBpZiAodW5pRGlmZi5sZW5ndGggPiAxKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2FwcGx5UGF0Y2ggb25seSB3b3JrcyB3aXRoIGEgc2luZ2xlIGlucHV0LicpO1xuICAgIH1cblxuICAgIHVuaURpZmYgPSB1bmlEaWZmWzBdO1xuICB9IC8vIEFwcGx5IHRoZSBkaWZmIHRvIHRoZSBpbnB1dFxuXG5cbiAgdmFyIGxpbmVzID0gc291cmNlLnNwbGl0KC9cXHJcXG58W1xcblxcdlxcZlxcclxceDg1XS8pLFxuICAgICAgZGVsaW1pdGVycyA9IHNvdXJjZS5tYXRjaCgvXFxyXFxufFtcXG5cXHZcXGZcXHJcXHg4NV0vZykgfHwgW10sXG4gICAgICBodW5rcyA9IHVuaURpZmYuaHVua3MsXG4gICAgICBjb21wYXJlTGluZSA9IG9wdGlvbnMuY29tcGFyZUxpbmUgfHwgZnVuY3Rpb24gKGxpbmVOdW1iZXIsIGxpbmUsIG9wZXJhdGlvbiwgcGF0Y2hDb250ZW50KVxuICAvKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG4gIHtcbiAgICByZXR1cm4gKFxuICAgICAgLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbiAgICAgIGxpbmUgPT09IHBhdGNoQ29udGVudFxuICAgICk7XG4gIH0sXG4gICAgICBlcnJvckNvdW50ID0gMCxcbiAgICAgIGZ1enpGYWN0b3IgPSBvcHRpb25zLmZ1enpGYWN0b3IgfHwgMCxcbiAgICAgIG1pbkxpbmUgPSAwLFxuICAgICAgb2Zmc2V0ID0gMCxcbiAgICAgIHJlbW92ZUVPRk5MLFxuICAgICAgYWRkRU9GTkw7XG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIGh1bmsgZXhhY3RseSBmaXRzIG9uIHRoZSBwcm92aWRlZCBsb2NhdGlvblxuICAgKi9cblxuXG4gIGZ1bmN0aW9uIGh1bmtGaXRzKGh1bmssIHRvUG9zKSB7XG4gICAgZm9yICh2YXIgaiA9IDA7IGogPCBodW5rLmxpbmVzLmxlbmd0aDsgaisrKSB7XG4gICAgICB2YXIgbGluZSA9IGh1bmsubGluZXNbal0sXG4gICAgICAgICAgb3BlcmF0aW9uID0gbGluZS5sZW5ndGggPiAwID8gbGluZVswXSA6ICcgJyxcbiAgICAgICAgICBjb250ZW50ID0gbGluZS5sZW5ndGggPiAwID8gbGluZS5zdWJzdHIoMSkgOiBsaW5lO1xuXG4gICAgICBpZiAob3BlcmF0aW9uID09PSAnICcgfHwgb3BlcmF0aW9uID09PSAnLScpIHtcbiAgICAgICAgLy8gQ29udGV4dCBzYW5pdHkgY2hlY2tcbiAgICAgICAgaWYgKCFjb21wYXJlTGluZSh0b1BvcyArIDEsIGxpbmVzW3RvUG9zXSwgb3BlcmF0aW9uLCBjb250ZW50KSkge1xuICAgICAgICAgIGVycm9yQ291bnQrKztcblxuICAgICAgICAgIGlmIChlcnJvckNvdW50ID4gZnV6ekZhY3Rvcikge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRvUG9zKys7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH0gLy8gU2VhcmNoIGJlc3QgZml0IG9mZnNldHMgZm9yIGVhY2ggaHVuayBiYXNlZCBvbiB0aGUgcHJldmlvdXMgb25lc1xuXG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBodW5rcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBodW5rID0gaHVua3NbaV0sXG4gICAgICAgIG1heExpbmUgPSBsaW5lcy5sZW5ndGggLSBodW5rLm9sZExpbmVzLFxuICAgICAgICBsb2NhbE9mZnNldCA9IDAsXG4gICAgICAgIHRvUG9zID0gb2Zmc2V0ICsgaHVuay5vbGRTdGFydCAtIDE7XG4gICAgdmFyIGl0ZXJhdG9yID1cbiAgICAvKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG4gICAgKDAsXG4gICAgLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cblxuICAgIC8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cbiAgICBfZGlzdGFuY2VJdGVyYXRvclxuICAgIC8qaXN0YW5idWwgaWdub3JlIGVuZCovXG4gICAgW1xuICAgIC8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cbiAgICBcImRlZmF1bHRcIlxuICAgIC8qaXN0YW5idWwgaWdub3JlIGVuZCovXG4gICAgXSkodG9Qb3MsIG1pbkxpbmUsIG1heExpbmUpO1xuXG4gICAgZm9yICg7IGxvY2FsT2Zmc2V0ICE9PSB1bmRlZmluZWQ7IGxvY2FsT2Zmc2V0ID0gaXRlcmF0b3IoKSkge1xuICAgICAgaWYgKGh1bmtGaXRzKGh1bmssIHRvUG9zICsgbG9jYWxPZmZzZXQpKSB7XG4gICAgICAgIGh1bmsub2Zmc2V0ID0gb2Zmc2V0ICs9IGxvY2FsT2Zmc2V0O1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAobG9jYWxPZmZzZXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0gLy8gU2V0IGxvd2VyIHRleHQgbGltaXQgdG8gZW5kIG9mIHRoZSBjdXJyZW50IGh1bmssIHNvIG5leHQgb25lcyBkb24ndCB0cnlcbiAgICAvLyB0byBmaXQgb3ZlciBhbHJlYWR5IHBhdGNoZWQgdGV4dFxuXG5cbiAgICBtaW5MaW5lID0gaHVuay5vZmZzZXQgKyBodW5rLm9sZFN0YXJ0ICsgaHVuay5vbGRMaW5lcztcbiAgfSAvLyBBcHBseSBwYXRjaCBodW5rc1xuXG5cbiAgdmFyIGRpZmZPZmZzZXQgPSAwO1xuXG4gIGZvciAodmFyIF9pID0gMDsgX2kgPCBodW5rcy5sZW5ndGg7IF9pKyspIHtcbiAgICB2YXIgX2h1bmsgPSBodW5rc1tfaV0sXG4gICAgICAgIF90b1BvcyA9IF9odW5rLm9sZFN0YXJ0ICsgX2h1bmsub2Zmc2V0ICsgZGlmZk9mZnNldCAtIDE7XG5cbiAgICBkaWZmT2Zmc2V0ICs9IF9odW5rLm5ld0xpbmVzIC0gX2h1bmsub2xkTGluZXM7XG5cbiAgICBmb3IgKHZhciBqID0gMDsgaiA8IF9odW5rLmxpbmVzLmxlbmd0aDsgaisrKSB7XG4gICAgICB2YXIgbGluZSA9IF9odW5rLmxpbmVzW2pdLFxuICAgICAgICAgIG9wZXJhdGlvbiA9IGxpbmUubGVuZ3RoID4gMCA/IGxpbmVbMF0gOiAnICcsXG4gICAgICAgICAgY29udGVudCA9IGxpbmUubGVuZ3RoID4gMCA/IGxpbmUuc3Vic3RyKDEpIDogbGluZSxcbiAgICAgICAgICBkZWxpbWl0ZXIgPSBfaHVuay5saW5lZGVsaW1pdGVyc1tqXTtcblxuICAgICAgaWYgKG9wZXJhdGlvbiA9PT0gJyAnKSB7XG4gICAgICAgIF90b1BvcysrO1xuICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09ICctJykge1xuICAgICAgICBsaW5lcy5zcGxpY2UoX3RvUG9zLCAxKTtcbiAgICAgICAgZGVsaW1pdGVycy5zcGxpY2UoX3RvUG9zLCAxKTtcbiAgICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uID09PSAnKycpIHtcbiAgICAgICAgbGluZXMuc3BsaWNlKF90b1BvcywgMCwgY29udGVudCk7XG4gICAgICAgIGRlbGltaXRlcnMuc3BsaWNlKF90b1BvcywgMCwgZGVsaW1pdGVyKTtcbiAgICAgICAgX3RvUG9zKys7XG4gICAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PT0gJ1xcXFwnKSB7XG4gICAgICAgIHZhciBwcmV2aW91c09wZXJhdGlvbiA9IF9odW5rLmxpbmVzW2ogLSAxXSA/IF9odW5rLmxpbmVzW2ogLSAxXVswXSA6IG51bGw7XG5cbiAgICAgICAgaWYgKHByZXZpb3VzT3BlcmF0aW9uID09PSAnKycpIHtcbiAgICAgICAgICByZW1vdmVFT0ZOTCA9IHRydWU7XG4gICAgICAgIH0gZWxzZSBpZiAocHJldmlvdXNPcGVyYXRpb24gPT09ICctJykge1xuICAgICAgICAgIGFkZEVPRk5MID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSAvLyBIYW5kbGUgRU9GTkwgaW5zZXJ0aW9uL3JlbW92YWxcblxuXG4gIGlmIChyZW1vdmVFT0ZOTCkge1xuICAgIHdoaWxlICghbGluZXNbbGluZXMubGVuZ3RoIC0gMV0pIHtcbiAgICAgIGxpbmVzLnBvcCgpO1xuICAgICAgZGVsaW1pdGVycy5wb3AoKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoYWRkRU9GTkwpIHtcbiAgICBsaW5lcy5wdXNoKCcnKTtcbiAgICBkZWxpbWl0ZXJzLnB1c2goJ1xcbicpO1xuICB9XG5cbiAgZm9yICh2YXIgX2sgPSAwOyBfayA8IGxpbmVzLmxlbmd0aCAtIDE7IF9rKyspIHtcbiAgICBsaW5lc1tfa10gPSBsaW5lc1tfa10gKyBkZWxpbWl0ZXJzW19rXTtcbiAgfVxuXG4gIHJldHVybiBsaW5lcy5qb2luKCcnKTtcbn0gLy8gV3JhcHBlciB0aGF0IHN1cHBvcnRzIG11bHRpcGxlIGZpbGUgcGF0Y2hlcyB2aWEgY2FsbGJhY2tzLlxuXG5cbmZ1bmN0aW9uIGFwcGx5UGF0Y2hlcyh1bmlEaWZmLCBvcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgdW5pRGlmZiA9PT0gJ3N0cmluZycpIHtcbiAgICB1bmlEaWZmID1cbiAgICAvKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG4gICAgKDAsXG4gICAgLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cblxuICAgIC8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cbiAgICBfcGFyc2VcbiAgICAvKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuICAgIC5cbiAgICAvKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG4gICAgcGFyc2VQYXRjaClcbiAgICAvKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuICAgICh1bmlEaWZmKTtcbiAgfVxuXG4gIHZhciBjdXJyZW50SW5kZXggPSAwO1xuXG4gIGZ1bmN0aW9uIHByb2Nlc3NJbmRleCgpIHtcbiAgICB2YXIgaW5kZXggPSB1bmlEaWZmW2N1cnJlbnRJbmRleCsrXTtcblxuICAgIGlmICghaW5kZXgpIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmNvbXBsZXRlKCk7XG4gICAgfVxuXG4gICAgb3B0aW9ucy5sb2FkRmlsZShpbmRleCwgZnVuY3Rpb24gKGVyciwgZGF0YSkge1xuICAgICAgaWYgKGVycikge1xuICAgICAgICByZXR1cm4gb3B0aW9ucy5jb21wbGV0ZShlcnIpO1xuICAgICAgfVxuXG4gICAgICB2YXIgdXBkYXRlZENvbnRlbnQgPSBhcHBseVBhdGNoKGRhdGEsIGluZGV4LCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMucGF0Y2hlZChpbmRleCwgdXBkYXRlZENvbnRlbnQsIGZ1bmN0aW9uIChlcnIpIHtcbiAgICAgICAgaWYgKGVycikge1xuICAgICAgICAgIHJldHVybiBvcHRpb25zLmNvbXBsZXRlKGVycik7XG4gICAgICAgIH1cblxuICAgICAgICBwcm9jZXNzSW5kZXgoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJvY2Vzc0luZGV4KCk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTl3WVhSamFDOWhjSEJzZVM1cWN5SmRMQ0p1WVcxbGN5STZXeUpoY0hCc2VWQmhkR05vSWl3aWMyOTFjbU5sSWl3aWRXNXBSR2xtWmlJc0ltOXdkR2x2Ym5NaUxDSndZWEp6WlZCaGRHTm9JaXdpUVhKeVlYa2lMQ0pwYzBGeWNtRjVJaXdpYkdWdVozUm9JaXdpUlhKeWIzSWlMQ0pzYVc1bGN5SXNJbk53YkdsMElpd2laR1ZzYVcxcGRHVnljeUlzSW0xaGRHTm9JaXdpYUhWdWEzTWlMQ0pqYjIxd1lYSmxUR2x1WlNJc0lteHBibVZPZFcxaVpYSWlMQ0pzYVc1bElpd2liM0JsY21GMGFXOXVJaXdpY0dGMFkyaERiMjUwWlc1MElpd2laWEp5YjNKRGIzVnVkQ0lzSW1aMWVucEdZV04wYjNJaUxDSnRhVzVNYVc1bElpd2liMlptYzJWMElpd2ljbVZ0YjNabFJVOUdUa3dpTENKaFpHUkZUMFpPVENJc0ltaDFibXRHYVhSeklpd2lhSFZ1YXlJc0luUnZVRzl6SWl3aWFpSXNJbU52Ym5SbGJuUWlMQ0p6ZFdKemRISWlMQ0pwSWl3aWJXRjRUR2x1WlNJc0ltOXNaRXhwYm1Weklpd2liRzlqWVd4UFptWnpaWFFpTENKdmJHUlRkR0Z5ZENJc0ltbDBaWEpoZEc5eUlpd2laR2x6ZEdGdVkyVkpkR1Z5WVhSdmNpSXNJblZ1WkdWbWFXNWxaQ0lzSW1ScFptWlBabVp6WlhRaUxDSnVaWGRNYVc1bGN5SXNJbVJsYkdsdGFYUmxjaUlzSW14cGJtVmtaV3hwYldsMFpYSnpJaXdpYzNCc2FXTmxJaXdpY0hKbGRtbHZkWE5QY0dWeVlYUnBiMjRpTENKd2IzQWlMQ0p3ZFhOb0lpd2lYMnNpTENKcWIybHVJaXdpWVhCd2JIbFFZWFJqYUdWeklpd2lZM1Z5Y21WdWRFbHVaR1Y0SWl3aWNISnZZMlZ6YzBsdVpHVjRJaXdpYVc1a1pYZ2lMQ0pqYjIxd2JHVjBaU0lzSW14dllXUkdhV3hsSWl3aVpYSnlJaXdpWkdGMFlTSXNJblZ3WkdGMFpXUkRiMjUwWlc1MElpd2ljR0YwWTJobFpDSmRMQ0p0WVhCd2FXNW5jeUk2SWpzN096czdPenM3T3p0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJRVUU3TzBGQlEwRTdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkJRVHM3T3pzN1FVRkZUeXhUUVVGVFFTeFZRVUZVTEVOQlFXOUNReXhOUVVGd1FpeEZRVUUwUWtNc1QwRkJOVUlzUlVGQmJVUTdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkJaRU1zUlVGQlFVRXNUMEZCWXl4MVJVRkJTaXhGUVVGSk96dEJRVU40UkN4TlFVRkpMRTlCUVU5RUxFOUJRVkFzUzBGQmJVSXNVVUZCZGtJc1JVRkJhVU03UVVGREwwSkJMRWxCUVVGQkxFOUJRVTg3UVVGQlJ6dEJRVUZCTzBGQlFVRTdPMEZCUVVGRk8wRkJRVUZCTzBGQlFVRkJPMEZCUVVGQk8wRkJRVUZCTzBGQlFVRkJPMEZCUVVFN1FVRkJRU3hMUVVGWFJpeFBRVUZZTEVOQlFWWTdRVUZEUkRzN1FVRkZSQ3hOUVVGSlJ5eExRVUZMTEVOQlFVTkRMRTlCUVU0c1EwRkJZMG9zVDBGQlpDeERRVUZLTEVWQlFUUkNPMEZCUXpGQ0xGRkJRVWxCTEU5QlFVOHNRMEZCUTBzc1RVRkJVaXhIUVVGcFFpeERRVUZ5UWl4RlFVRjNRanRCUVVOMFFpeFpRVUZOTEVsQlFVbERMRXRCUVVvc1EwRkJWU3cwUTBGQlZpeERRVUZPTzBGQlEwUTdPMEZCUlVST0xFbEJRVUZCTEU5QlFVOHNSMEZCUjBFc1QwRkJUeXhEUVVGRExFTkJRVVFzUTBGQmFrSTdRVUZEUkN4SFFWaDFSQ3hEUVdGNFJEczdPMEZCUTBFc1RVRkJTVThzUzBGQlN5eEhRVUZIVWl4TlFVRk5MRU5CUVVOVExFdEJRVkFzUTBGQllTeHhRa0ZCWWl4RFFVRmFPMEZCUVVFc1RVRkRTVU1zVlVGQlZTeEhRVUZIVml4TlFVRk5MRU5CUVVOWExFdEJRVkFzUTBGQllTeHpRa0ZCWWl4TFFVRjNReXhGUVVSNlJEdEJRVUZCTEUxQlJVbERMRXRCUVVzc1IwRkJSMWdzVDBGQlR5eERRVUZEVnl4TFFVWndRanRCUVVGQkxFMUJTVWxETEZkQlFWY3NSMEZCUjFnc1QwRkJUeXhEUVVGRFZ5eFhRVUZTTEVsQlFYZENMRlZCUVVORExGVkJRVVFzUlVGQllVTXNTVUZCWWl4RlFVRnRRa01zVTBGQmJrSXNSVUZCT0VKRExGbEJRVGxDTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkJLME5HTEUxQlFVRkJMRWxCUVVrc1MwRkJTMFU3UVVGQmVFUTdRVUZCUVN4SFFVb3hRenRCUVVGQkxFMUJTMGxETEZWQlFWVXNSMEZCUnl4RFFVeHFRanRCUVVGQkxFMUJUVWxETEZWQlFWVXNSMEZCUjJwQ0xFOUJRVThzUTBGQlEybENMRlZCUVZJc1NVRkJjMElzUTBGT2RrTTdRVUZCUVN4TlFVOUpReXhQUVVGUExFZEJRVWNzUTBGUVpEdEJRVUZCTEUxQlVVbERMRTFCUVUwc1IwRkJSeXhEUVZKaU8wRkJRVUVzVFVGVlNVTXNWMEZXU2p0QlFVRkJMRTFCVjBsRExGRkJXRW83UVVGaFFUczdPenM3UVVGSFFTeFhRVUZUUXl4UlFVRlVMRU5CUVd0Q1F5eEpRVUZzUWl4RlFVRjNRa01zUzBGQmVFSXNSVUZCSzBJN1FVRkROMElzVTBGQlN5eEpRVUZKUXl4RFFVRkRMRWRCUVVjc1EwRkJZaXhGUVVGblFrRXNRMEZCUXl4SFFVRkhSaXhKUVVGSkxFTkJRVU5xUWl4TFFVRk1MRU5CUVZkR0xFMUJRUzlDTEVWQlFYVkRjVUlzUTBGQlF5eEZRVUY0UXl4RlFVRTBRenRCUVVNeFF5eFZRVUZKV2l4SlFVRkpMRWRCUVVkVkxFbEJRVWtzUTBGQlEycENMRXRCUVV3c1EwRkJWMjFDTEVOQlFWZ3NRMEZCV0R0QlFVRkJMRlZCUTBsWUxGTkJRVk1zUjBGQlNVUXNTVUZCU1N4RFFVRkRWQ3hOUVVGTUxFZEJRV01zUTBGQlpDeEhRVUZyUWxNc1NVRkJTU3hEUVVGRExFTkJRVVFzUTBGQmRFSXNSMEZCTkVJc1IwRkVOME03UVVGQlFTeFZRVVZKWVN4UFFVRlBMRWRCUVVsaUxFbEJRVWtzUTBGQlExUXNUVUZCVEN4SFFVRmpMRU5CUVdRc1IwRkJhMEpUTEVsQlFVa3NRMEZCUTJNc1RVRkJUQ3hEUVVGWkxFTkJRVm9zUTBGQmJFSXNSMEZCYlVOa0xFbEJSbXhFT3p0QlFVbEJMRlZCUVVsRExGTkJRVk1zUzBGQlN5eEhRVUZrTEVsQlFYRkNRU3hUUVVGVExFdEJRVXNzUjBGQmRrTXNSVUZCTkVNN1FVRkRNVU03UVVGRFFTeFpRVUZKTEVOQlFVTklMRmRCUVZjc1EwRkJRMkVzUzBGQlN5eEhRVUZITEVOQlFWUXNSVUZCV1d4Q0xFdEJRVXNzUTBGQlEydENMRXRCUVVRc1EwRkJha0lzUlVGQk1FSldMRk5CUVRGQ0xFVkJRWEZEV1N4UFFVRnlReXhEUVVGb1FpeEZRVUVyUkR0QlFVTTNSRllzVlVGQlFVRXNWVUZCVlRzN1FVRkZWaXhqUVVGSlFTeFZRVUZWTEVkQlFVZERMRlZCUVdwQ0xFVkJRVFpDTzBGQlF6TkNMRzFDUVVGUExFdEJRVkE3UVVGRFJEdEJRVU5HT3p0QlFVTkVUeXhSUVVGQlFTeExRVUZMTzBGQlEwNDdRVUZEUmpzN1FVRkZSQ3hYUVVGUExFbEJRVkE3UVVGRFJDeEhRV3hFZFVRc1EwRnZSSGhFT3pzN1FVRkRRU3hQUVVGTExFbEJRVWxKTEVOQlFVTXNSMEZCUnl4RFFVRmlMRVZCUVdkQ1FTeERRVUZETEVkQlFVZHNRaXhMUVVGTExFTkJRVU5PTEUxQlFURkNMRVZCUVd0RGQwSXNRMEZCUXl4RlFVRnVReXhGUVVGMVF6dEJRVU55UXl4UlFVRkpUQ3hKUVVGSkxFZEJRVWRpTEV0QlFVc3NRMEZCUTJ0Q0xFTkJRVVFzUTBGQmFFSTdRVUZCUVN4UlFVTkpReXhQUVVGUExFZEJRVWQyUWl4TFFVRkxMRU5CUVVOR0xFMUJRVTRzUjBGQlpXMUNMRWxCUVVrc1EwRkJRMDhzVVVGRWJFTTdRVUZCUVN4UlFVVkpReXhYUVVGWExFZEJRVWNzUTBGR2JFSTdRVUZCUVN4UlFVZEpVQ3hMUVVGTExFZEJRVWRNTEUxQlFVMHNSMEZCUjBrc1NVRkJTU3hEUVVGRFV5eFJRVUZrTEVkQlFYbENMRU5CU0hKRE8wRkJTMEVzVVVGQlNVTXNVVUZCVVR0QlFVRkhPMEZCUVVFN1FVRkJRVHM3UVVGQlFVTTdRVUZCUVVFN1FVRkJRVUU3UVVGQlFVRTdRVUZCUVVFN1FVRkJRVUU3UVVGQlFVRTdRVUZCUVVFc1QwRkJhVUpXTEV0QlFXcENMRVZCUVhkQ1RpeFBRVUY0UWl4RlFVRnBRMWNzVDBGQmFrTXNRMEZCWmpzN1FVRkZRU3hYUVVGUFJTeFhRVUZYTEV0QlFVdEpMRk5CUVhaQ0xFVkJRV3REU2l4WFFVRlhMRWRCUVVkRkxGRkJRVkVzUlVGQmVFUXNSVUZCTkVRN1FVRkRNVVFzVlVGQlNWZ3NVVUZCVVN4RFFVRkRReXhKUVVGRUxFVkJRVTlETEV0QlFVc3NSMEZCUjA4c1YwRkJaaXhEUVVGYUxFVkJRWGxETzBGQlEzWkRVaXhSUVVGQlFTeEpRVUZKTEVOQlFVTktMRTFCUVV3c1IwRkJZMEVzVFVGQlRTeEpRVUZKV1N4WFFVRjRRanRCUVVOQk8wRkJRMFE3UVVGRFJqczdRVUZGUkN4UlFVRkpRU3hYUVVGWExFdEJRVXRKTEZOQlFYQkNMRVZCUVN0Q08wRkJRemRDTEdGQlFVOHNTMEZCVUR0QlFVTkVMRXRCYWtKdlF5eERRVzFDY2tNN1FVRkRRVHM3TzBGQlEwRnFRaXhKUVVGQlFTeFBRVUZQTEVkQlFVZExMRWxCUVVrc1EwRkJRMG9zVFVGQlRDeEhRVUZqU1N4SlFVRkpMRU5CUVVOVExGRkJRVzVDTEVkQlFUaENWQ3hKUVVGSkxFTkJRVU5QTEZGQlFUZERPMEZCUTBRc1IwRXpSWFZFTEVOQk5rVjRSRHM3TzBGQlEwRXNUVUZCU1Uwc1ZVRkJWU3hIUVVGSExFTkJRV3BDT3p0QlFVTkJMRTlCUVVzc1NVRkJTVklzUlVGQlF5eEhRVUZITEVOQlFXSXNSVUZCWjBKQkxFVkJRVU1zUjBGQlIyeENMRXRCUVVzc1EwRkJRMDRzVFVGQk1VSXNSVUZCYTBOM1FpeEZRVUZETEVWQlFXNURMRVZCUVhWRE8wRkJRM0pETEZGQlFVbE1MRXRCUVVrc1IwRkJSMklzUzBGQlN5eERRVUZEYTBJc1JVRkJSQ3hEUVVGb1FqdEJRVUZCTEZGQlEwbEtMRTFCUVVzc1IwRkJSMFFzUzBGQlNTeERRVUZEVXl4UlFVRk1MRWRCUVdkQ1ZDeExRVUZKTEVOQlFVTktMRTFCUVhKQ0xFZEJRVGhDYVVJc1ZVRkJPVUlzUjBGQk1rTXNRMEZFZGtRN08wRkJSVUZCTEVsQlFVRkJMRlZCUVZVc1NVRkJTV0lzUzBGQlNTeERRVUZEWXl4UlFVRk1MRWRCUVdkQ1pDeExRVUZKTEVOQlFVTlBMRkZCUVc1RE96dEJRVVZCTEZOQlFVc3NTVUZCU1V3c1EwRkJReXhIUVVGSExFTkJRV0lzUlVGQlowSkJMRU5CUVVNc1IwRkJSMFlzUzBGQlNTeERRVUZEYWtJc1MwRkJUQ3hEUVVGWFJpeE5RVUV2UWl4RlFVRjFRM0ZDTEVOQlFVTXNSVUZCZUVNc1JVRkJORU03UVVGRE1VTXNWVUZCU1Zvc1NVRkJTU3hIUVVGSFZTeExRVUZKTEVOQlFVTnFRaXhMUVVGTUxFTkJRVmR0UWl4RFFVRllMRU5CUVZnN1FVRkJRU3hWUVVOSldDeFRRVUZUTEVkQlFVbEVMRWxCUVVrc1EwRkJRMVFzVFVGQlRDeEhRVUZqTEVOQlFXUXNSMEZCYTBKVExFbEJRVWtzUTBGQlF5eERRVUZFTEVOQlFYUkNMRWRCUVRSQ0xFZEJSRGRETzBGQlFVRXNWVUZGU1dFc1QwRkJUeXhIUVVGSllpeEpRVUZKTEVOQlFVTlVMRTFCUVV3c1IwRkJZeXhEUVVGa0xFZEJRV3RDVXl4SlFVRkpMRU5CUVVOakxFMUJRVXdzUTBGQldTeERRVUZhTEVOQlFXeENMRWRCUVcxRFpDeEpRVVpzUkR0QlFVRkJMRlZCUjBsNVFpeFRRVUZUTEVkQlFVZG1MRXRCUVVrc1EwRkJRMmRDTEdOQlFVd3NRMEZCYjBKa0xFTkJRWEJDTEVOQlNHaENPenRCUVV0QkxGVkJRVWxZTEZOQlFWTXNTMEZCU3l4SFFVRnNRaXhGUVVGMVFqdEJRVU55UWxVc1VVRkJRVUVzVFVGQlN6dEJRVU5PTEU5QlJrUXNUVUZGVHl4SlFVRkpWaXhUUVVGVExFdEJRVXNzUjBGQmJFSXNSVUZCZFVJN1FVRkROVUpTTEZGQlFVRkJMRXRCUVVzc1EwRkJRMnRETEUxQlFVNHNRMEZCWVdoQ0xFMUJRV0lzUlVGQmIwSXNRMEZCY0VJN1FVRkRRV2hDTEZGQlFVRkJMRlZCUVZVc1EwRkJRMmRETEUxQlFWZ3NRMEZCYTBKb1FpeE5RVUZzUWl4RlFVRjVRaXhEUVVGNlFqdEJRVU5HTzBGQlEwTXNUMEZLVFN4TlFVbEJMRWxCUVVsV0xGTkJRVk1zUzBGQlN5eEhRVUZzUWl4RlFVRjFRanRCUVVNMVFsSXNVVUZCUVVFc1MwRkJTeXhEUVVGRGEwTXNUVUZCVGl4RFFVRmhhRUlzVFVGQllpeEZRVUZ2UWl4RFFVRndRaXhGUVVGMVFrVXNUMEZCZGtJN1FVRkRRV3hDTEZGQlFVRkJMRlZCUVZVc1EwRkJRMmRETEUxQlFWZ3NRMEZCYTBKb1FpeE5RVUZzUWl4RlFVRjVRaXhEUVVGNlFpeEZRVUUwUW1Nc1UwRkJOVUk3UVVGRFFXUXNVVUZCUVVFc1RVRkJTenRCUVVOT0xFOUJTazBzVFVGSlFTeEpRVUZKVml4VFFVRlRMRXRCUVVzc1NVRkJiRUlzUlVGQmQwSTdRVUZETjBJc1dVRkJTVEpDTEdsQ1FVRnBRaXhIUVVGSGJFSXNTMEZCU1N4RFFVRkRha0lzUzBGQlRDeERRVUZYYlVJc1EwRkJReXhIUVVGSExFTkJRV1lzU1VGQmIwSkdMRXRCUVVrc1EwRkJRMnBDTEV0QlFVd3NRMEZCVjIxQ0xFTkJRVU1zUjBGQlJ5eERRVUZtTEVWQlFXdENMRU5CUVd4Q0xFTkJRWEJDTEVkQlFUSkRMRWxCUVc1Rk96dEJRVU5CTEZsQlFVbG5RaXhwUWtGQmFVSXNTMEZCU3l4SFFVRXhRaXhGUVVFclFqdEJRVU0zUW5KQ0xGVkJRVUZCTEZkQlFWY3NSMEZCUnl4SlFVRmtPMEZCUTBRc1UwRkdSQ3hOUVVWUExFbEJRVWx4UWl4cFFrRkJhVUlzUzBGQlN5eEhRVUV4UWl4RlFVRXJRanRCUVVOd1EzQkNMRlZCUVVGQkxGRkJRVkVzUjBGQlJ5eEpRVUZZTzBGQlEwUTdRVUZEUmp0QlFVTkdPMEZCUTBZc1IwRTNSM1ZFTEVOQkswZDRSRHM3TzBGQlEwRXNUVUZCU1VRc1YwRkJTaXhGUVVGcFFqdEJRVU5tTEZkQlFVOHNRMEZCUTJRc1MwRkJTeXhEUVVGRFFTeExRVUZMTEVOQlFVTkdMRTFCUVU0c1IwRkJaU3hEUVVGb1FpeERRVUZpTEVWQlFXbERPMEZCUXk5Q1JTeE5RVUZCUVN4TFFVRkxMRU5CUVVOdlF5eEhRVUZPTzBGQlEwRnNReXhOUVVGQlFTeFZRVUZWTEVOQlFVTnJReXhIUVVGWU8wRkJRMFE3UVVGRFJpeEhRVXhFTEUxQlMwOHNTVUZCU1hKQ0xGRkJRVW9zUlVGQll6dEJRVU51UW1Zc1NVRkJRVUVzUzBGQlN5eERRVUZEY1VNc1NVRkJUaXhEUVVGWExFVkJRVmc3UVVGRFFXNURMRWxCUVVGQkxGVkJRVlVzUTBGQlEyMURMRWxCUVZnc1EwRkJaMElzU1VGQmFFSTdRVUZEUkRzN1FVRkRSQ3hQUVVGTExFbEJRVWxETEVWQlFVVXNSMEZCUnl4RFFVRmtMRVZCUVdsQ1FTeEZRVUZGTEVkQlFVZDBReXhMUVVGTExFTkJRVU5HTEUxQlFVNHNSMEZCWlN4RFFVRnlReXhGUVVGM1EzZERMRVZCUVVVc1JVRkJNVU1zUlVGQk9FTTdRVUZETlVOMFF5eEpRVUZCUVN4TFFVRkxMRU5CUVVOelF5eEZRVUZFTEVOQlFVd3NSMEZCV1hSRExFdEJRVXNzUTBGQlEzTkRMRVZCUVVRc1EwRkJUQ3hIUVVGWmNFTXNWVUZCVlN4RFFVRkRiME1zUlVGQlJDeERRVUZzUXp0QlFVTkVPenRCUVVORUxGTkJRVTkwUXl4TFFVRkxMRU5CUVVOMVF5eEpRVUZPTEVOQlFWY3NSVUZCV0N4RFFVRlFPMEZCUTBRc1F5eERRVVZFT3pzN1FVRkRUeXhUUVVGVFF5eFpRVUZVTEVOQlFYTkNMME1zVDBGQmRFSXNSVUZCSzBKRExFOUJRUzlDTEVWQlFYZERPMEZCUXpkRExFMUJRVWtzVDBGQlQwUXNUMEZCVUN4TFFVRnRRaXhSUVVGMlFpeEZRVUZwUXp0QlFVTXZRa0VzU1VGQlFVRXNUMEZCVHp0QlFVRkhPMEZCUVVFN1FVRkJRVHM3UVVGQlFVVTdRVUZCUVVFN1FVRkJRVUU3UVVGQlFVRTdRVUZCUVVFN1FVRkJRVUU3UVVGQlFUdEJRVUZCTEV0QlFWZEdMRTlCUVZnc1EwRkJWanRCUVVORU96dEJRVVZFTEUxQlFVbG5SQ3haUVVGWkxFZEJRVWNzUTBGQmJrSTdPMEZCUTBFc1YwRkJVME1zV1VGQlZDeEhRVUYzUWp0QlFVTjBRaXhSUVVGSlF5eExRVUZMTEVkQlFVZHNSQ3hQUVVGUExFTkJRVU5uUkN4WlFVRlpMRVZCUVdJc1EwRkJia0k3TzBGQlEwRXNVVUZCU1N4RFFVRkRSU3hMUVVGTUxFVkJRVms3UVVGRFZpeGhRVUZQYWtRc1QwRkJUeXhEUVVGRGEwUXNVVUZCVWl4RlFVRlFPMEZCUTBRN08wRkJSVVJzUkN4SlFVRkJRU3hQUVVGUExFTkJRVU50UkN4UlFVRlNMRU5CUVdsQ1JpeExRVUZxUWl4RlFVRjNRaXhWUVVGVFJ5eEhRVUZVTEVWQlFXTkRMRWxCUVdRc1JVRkJiMEk3UVVGRE1VTXNWVUZCU1VRc1IwRkJTaXhGUVVGVE8wRkJRMUFzWlVGQlQzQkVMRTlCUVU4c1EwRkJRMnRFTEZGQlFWSXNRMEZCYVVKRkxFZEJRV3BDTEVOQlFWQTdRVUZEUkRzN1FVRkZSQ3hWUVVGSlJTeGpRVUZqTEVkQlFVZDZSQ3hWUVVGVkxFTkJRVU4zUkN4SlFVRkVMRVZCUVU5S0xFdEJRVkFzUlVGQlkycEVMRTlCUVdRc1EwRkJMMEk3UVVGRFFVRXNUVUZCUVVFc1QwRkJUeXhEUVVGRGRVUXNUMEZCVWl4RFFVRm5RazRzUzBGQmFFSXNSVUZCZFVKTExHTkJRWFpDTEVWQlFYVkRMRlZCUVZOR0xFZEJRVlFzUlVGQll6dEJRVU51UkN4WlFVRkpRU3hIUVVGS0xFVkJRVk03UVVGRFVDeHBRa0ZCVDNCRUxFOUJRVThzUTBGQlEydEVMRkZCUVZJc1EwRkJhVUpGTEVkQlFXcENMRU5CUVZBN1FVRkRSRHM3UVVGRlJFb3NVVUZCUVVFc1dVRkJXVHRCUVVOaUxFOUJUa1E3UVVGUFJDeExRV0pFTzBGQlkwUTdPMEZCUTBSQkxFVkJRVUZCTEZsQlFWazdRVUZEWWlJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYkltbHRjRzl5ZENCN2NHRnljMlZRWVhSamFIMGdabkp2YlNBbkxpOXdZWEp6WlNjN1hHNXBiWEJ2Y25RZ1pHbHpkR0Z1WTJWSmRHVnlZWFJ2Y2lCbWNtOXRJQ2N1TGk5MWRHbHNMMlJwYzNSaGJtTmxMV2wwWlhKaGRHOXlKenRjYmx4dVpYaHdiM0owSUdaMWJtTjBhVzl1SUdGd2NHeDVVR0YwWTJnb2MyOTFjbU5sTENCMWJtbEVhV1ptTENCdmNIUnBiMjV6SUQwZ2UzMHBJSHRjYmlBZ2FXWWdLSFI1Y0dWdlppQjFibWxFYVdabUlEMDlQU0FuYzNSeWFXNW5KeWtnZTF4dUlDQWdJSFZ1YVVScFptWWdQU0J3WVhKelpWQmhkR05vS0hWdWFVUnBabVlwTzF4dUlDQjlYRzVjYmlBZ2FXWWdLRUZ5Y21GNUxtbHpRWEp5WVhrb2RXNXBSR2xtWmlrcElIdGNiaUFnSUNCcFppQW9kVzVwUkdsbVppNXNaVzVuZEdnZ1BpQXhLU0I3WEc0Z0lDQWdJQ0IwYUhKdmR5QnVaWGNnUlhKeWIzSW9KMkZ3Y0d4NVVHRjBZMmdnYjI1c2VTQjNiM0pyY3lCM2FYUm9JR0VnYzJsdVoyeGxJR2x1Y0hWMExpY3BPMXh1SUNBZ0lIMWNibHh1SUNBZ0lIVnVhVVJwWm1ZZ1BTQjFibWxFYVdabVd6QmRPMXh1SUNCOVhHNWNiaUFnTHk4Z1FYQndiSGtnZEdobElHUnBabVlnZEc4Z2RHaGxJR2x1Y0hWMFhHNGdJR3hsZENCc2FXNWxjeUE5SUhOdmRYSmpaUzV6Y0d4cGRDZ3ZYRnh5WEZ4dWZGdGNYRzVjWEhaY1hHWmNYSEpjWEhnNE5WMHZLU3hjYmlBZ0lDQWdJR1JsYkdsdGFYUmxjbk1nUFNCemIzVnlZMlV1YldGMFkyZ29MMXhjY2x4Y2JueGJYRnh1WEZ4MlhGeG1YRnh5WEZ4NE9EVmRMMmNwSUh4OElGdGRMRnh1SUNBZ0lDQWdhSFZ1YTNNZ1BTQjFibWxFYVdabUxtaDFibXR6TEZ4dVhHNGdJQ0FnSUNCamIyMXdZWEpsVEdsdVpTQTlJRzl3ZEdsdmJuTXVZMjl0Y0dGeVpVeHBibVVnZkh3Z0tDaHNhVzVsVG5WdFltVnlMQ0JzYVc1bExDQnZjR1Z5WVhScGIyNHNJSEJoZEdOb1EyOXVkR1Z1ZENrZ1BUNGdiR2x1WlNBOVBUMGdjR0YwWTJoRGIyNTBaVzUwS1N4Y2JpQWdJQ0FnSUdWeWNtOXlRMjkxYm5RZ1BTQXdMRnh1SUNBZ0lDQWdablY2ZWtaaFkzUnZjaUE5SUc5d2RHbHZibk11Wm5WNmVrWmhZM1J2Y2lCOGZDQXdMRnh1SUNBZ0lDQWdiV2x1VEdsdVpTQTlJREFzWEc0Z0lDQWdJQ0J2Wm1aelpYUWdQU0F3TEZ4dVhHNGdJQ0FnSUNCeVpXMXZkbVZGVDBaT1RDeGNiaUFnSUNBZ0lHRmtaRVZQUms1TU8xeHVYRzRnSUM4cUtseHVJQ0FnS2lCRGFHVmphM01nYVdZZ2RHaGxJR2gxYm1zZ1pYaGhZM1JzZVNCbWFYUnpJRzl1SUhSb1pTQndjbTkyYVdSbFpDQnNiMk5oZEdsdmJseHVJQ0FnS2k5Y2JpQWdablZ1WTNScGIyNGdhSFZ1YTBacGRITW9hSFZ1YXl3Z2RHOVFiM01wSUh0Y2JpQWdJQ0JtYjNJZ0tHeGxkQ0JxSUQwZ01Ec2dhaUE4SUdoMWJtc3ViR2x1WlhNdWJHVnVaM1JvT3lCcUt5c3BJSHRjYmlBZ0lDQWdJR3hsZENCc2FXNWxJRDBnYUhWdWF5NXNhVzVsYzF0cVhTeGNiaUFnSUNBZ0lDQWdJQ0J2Y0dWeVlYUnBiMjRnUFNBb2JHbHVaUzVzWlc1bmRHZ2dQaUF3SUQ4Z2JHbHVaVnN3WFNBNklDY2dKeWtzWEc0Z0lDQWdJQ0FnSUNBZ1kyOXVkR1Z1ZENBOUlDaHNhVzVsTG14bGJtZDBhQ0ErSURBZ1B5QnNhVzVsTG5OMVluTjBjaWd4S1NBNklHeHBibVVwTzF4dVhHNGdJQ0FnSUNCcFppQW9iM0JsY21GMGFXOXVJRDA5UFNBbklDY2dmSHdnYjNCbGNtRjBhVzl1SUQwOVBTQW5MU2NwSUh0Y2JpQWdJQ0FnSUNBZ0x5OGdRMjl1ZEdWNGRDQnpZVzVwZEhrZ1kyaGxZMnRjYmlBZ0lDQWdJQ0FnYVdZZ0tDRmpiMjF3WVhKbFRHbHVaU2gwYjFCdmN5QXJJREVzSUd4cGJtVnpXM1J2VUc5elhTd2diM0JsY21GMGFXOXVMQ0JqYjI1MFpXNTBLU2tnZTF4dUlDQWdJQ0FnSUNBZ0lHVnljbTl5UTI5MWJuUXJLenRjYmx4dUlDQWdJQ0FnSUNBZ0lHbG1JQ2hsY25KdmNrTnZkVzUwSUQ0Z1puVjZla1poWTNSdmNpa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ2NtVjBkWEp1SUdaaGJITmxPMXh1SUNBZ0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQjBiMUJ2Y3lzck8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUgxY2JseHVJQ0FnSUhKbGRIVnliaUIwY25WbE8xeHVJQ0I5WEc1Y2JpQWdMeThnVTJWaGNtTm9JR0psYzNRZ1ptbDBJRzltWm5ObGRITWdabTl5SUdWaFkyZ2dhSFZ1YXlCaVlYTmxaQ0J2YmlCMGFHVWdjSEpsZG1sdmRYTWdiMjVsYzF4dUlDQm1iM0lnS0d4bGRDQnBJRDBnTURzZ2FTQThJR2gxYm10ekxteGxibWQwYURzZ2FTc3JLU0I3WEc0Z0lDQWdiR1YwSUdoMWJtc2dQU0JvZFc1cmMxdHBYU3hjYmlBZ0lDQWdJQ0FnYldGNFRHbHVaU0E5SUd4cGJtVnpMbXhsYm1kMGFDQXRJR2gxYm1zdWIyeGtUR2x1WlhNc1hHNGdJQ0FnSUNBZ0lHeHZZMkZzVDJabWMyVjBJRDBnTUN4Y2JpQWdJQ0FnSUNBZ2RHOVFiM01nUFNCdlptWnpaWFFnS3lCb2RXNXJMbTlzWkZOMFlYSjBJQzBnTVR0Y2JseHVJQ0FnSUd4bGRDQnBkR1Z5WVhSdmNpQTlJR1JwYzNSaGJtTmxTWFJsY21GMGIzSW9kRzlRYjNNc0lHMXBia3hwYm1Vc0lHMWhlRXhwYm1VcE8xeHVYRzRnSUNBZ1ptOXlJQ2c3SUd4dlkyRnNUMlptYzJWMElDRTlQU0IxYm1SbFptbHVaV1E3SUd4dlkyRnNUMlptYzJWMElEMGdhWFJsY21GMGIzSW9LU2tnZTF4dUlDQWdJQ0FnYVdZZ0tHaDFibXRHYVhSektHaDFibXNzSUhSdlVHOXpJQ3NnYkc5allXeFBabVp6WlhRcEtTQjdYRzRnSUNBZ0lDQWdJR2gxYm1zdWIyWm1jMlYwSUQwZ2IyWm1jMlYwSUNzOUlHeHZZMkZzVDJabWMyVjBPMXh1SUNBZ0lDQWdJQ0JpY21WaGF6dGNiaUFnSUNBZ0lIMWNiaUFnSUNCOVhHNWNiaUFnSUNCcFppQW9iRzlqWVd4UFptWnpaWFFnUFQwOUlIVnVaR1ZtYVc1bFpDa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlHWmhiSE5sTzF4dUlDQWdJSDFjYmx4dUlDQWdJQzh2SUZObGRDQnNiM2RsY2lCMFpYaDBJR3hwYldsMElIUnZJR1Z1WkNCdlppQjBhR1VnWTNWeWNtVnVkQ0JvZFc1ckxDQnpieUJ1WlhoMElHOXVaWE1nWkc5dUozUWdkSEo1WEc0Z0lDQWdMeThnZEc4Z1ptbDBJRzkyWlhJZ1lXeHlaV0ZrZVNCd1lYUmphR1ZrSUhSbGVIUmNiaUFnSUNCdGFXNU1hVzVsSUQwZ2FIVnVheTV2Wm1aelpYUWdLeUJvZFc1ckxtOXNaRk4wWVhKMElDc2dhSFZ1YXk1dmJHUk1hVzVsY3p0Y2JpQWdmVnh1WEc0Z0lDOHZJRUZ3Y0d4NUlIQmhkR05vSUdoMWJtdHpYRzRnSUd4bGRDQmthV1ptVDJabWMyVjBJRDBnTUR0Y2JpQWdabTl5SUNoc1pYUWdhU0E5SURBN0lHa2dQQ0JvZFc1cmN5NXNaVzVuZEdnN0lHa3JLeWtnZTF4dUlDQWdJR3hsZENCb2RXNXJJRDBnYUhWdWEzTmJhVjBzWEc0Z0lDQWdJQ0FnSUhSdlVHOXpJRDBnYUhWdWF5NXZiR1JUZEdGeWRDQXJJR2gxYm1zdWIyWm1jMlYwSUNzZ1pHbG1aazltWm5ObGRDQXRJREU3WEc0Z0lDQWdaR2xtWms5bVpuTmxkQ0FyUFNCb2RXNXJMbTVsZDB4cGJtVnpJQzBnYUhWdWF5NXZiR1JNYVc1bGN6dGNibHh1SUNBZ0lHWnZjaUFvYkdWMElHb2dQU0F3T3lCcUlEd2dhSFZ1YXk1c2FXNWxjeTVzWlc1bmRHZzdJR29yS3lrZ2UxeHVJQ0FnSUNBZ2JHVjBJR3hwYm1VZ1BTQm9kVzVyTG14cGJtVnpXMnBkTEZ4dUlDQWdJQ0FnSUNBZ0lHOXdaWEpoZEdsdmJpQTlJQ2hzYVc1bExteGxibWQwYUNBK0lEQWdQeUJzYVc1bFd6QmRJRG9nSnlBbktTeGNiaUFnSUNBZ0lDQWdJQ0JqYjI1MFpXNTBJRDBnS0d4cGJtVXViR1Z1WjNSb0lENGdNQ0EvSUd4cGJtVXVjM1ZpYzNSeUtERXBJRG9nYkdsdVpTa3NYRzRnSUNBZ0lDQWdJQ0FnWkdWc2FXMXBkR1Z5SUQwZ2FIVnVheTVzYVc1bFpHVnNhVzFwZEdWeWMxdHFYVHRjYmx4dUlDQWdJQ0FnYVdZZ0tHOXdaWEpoZEdsdmJpQTlQVDBnSnlBbktTQjdYRzRnSUNBZ0lDQWdJSFJ2VUc5ekt5czdYRzRnSUNBZ0lDQjlJR1ZzYzJVZ2FXWWdLRzl3WlhKaGRHbHZiaUE5UFQwZ0p5MG5LU0I3WEc0Z0lDQWdJQ0FnSUd4cGJtVnpMbk53YkdsalpTaDBiMUJ2Y3l3Z01TazdYRzRnSUNBZ0lDQWdJR1JsYkdsdGFYUmxjbk11YzNCc2FXTmxLSFJ2VUc5ekxDQXhLVHRjYmlBZ0lDQWdJQzhxSUdsemRHRnVZblZzSUdsbmJtOXlaU0JsYkhObElDb3ZYRzRnSUNBZ0lDQjlJR1ZzYzJVZ2FXWWdLRzl3WlhKaGRHbHZiaUE5UFQwZ0p5c25LU0I3WEc0Z0lDQWdJQ0FnSUd4cGJtVnpMbk53YkdsalpTaDBiMUJ2Y3l3Z01Dd2dZMjl1ZEdWdWRDazdYRzRnSUNBZ0lDQWdJR1JsYkdsdGFYUmxjbk11YzNCc2FXTmxLSFJ2VUc5ekxDQXdMQ0JrWld4cGJXbDBaWElwTzF4dUlDQWdJQ0FnSUNCMGIxQnZjeXNyTzF4dUlDQWdJQ0FnZlNCbGJITmxJR2xtSUNodmNHVnlZWFJwYjI0Z1BUMDlJQ2RjWEZ4Y0p5a2dlMXh1SUNBZ0lDQWdJQ0JzWlhRZ2NISmxkbWx2ZFhOUGNHVnlZWFJwYjI0Z1BTQm9kVzVyTG14cGJtVnpXMm9nTFNBeFhTQS9JR2gxYm1zdWJHbHVaWE5iYWlBdElERmRXekJkSURvZ2JuVnNiRHRjYmlBZ0lDQWdJQ0FnYVdZZ0tIQnlaWFpwYjNWelQzQmxjbUYwYVc5dUlEMDlQU0FuS3ljcElIdGNiaUFnSUNBZ0lDQWdJQ0J5WlcxdmRtVkZUMFpPVENBOUlIUnlkV1U3WEc0Z0lDQWdJQ0FnSUgwZ1pXeHpaU0JwWmlBb2NISmxkbWx2ZFhOUGNHVnlZWFJwYjI0Z1BUMDlJQ2N0SnlrZ2UxeHVJQ0FnSUNBZ0lDQWdJR0ZrWkVWUFJrNU1JRDBnZEhKMVpUdGNiaUFnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdmVnh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJQzh2SUVoaGJtUnNaU0JGVDBaT1RDQnBibk5sY25ScGIyNHZjbVZ0YjNaaGJGeHVJQ0JwWmlBb2NtVnRiM1psUlU5R1Rrd3BJSHRjYmlBZ0lDQjNhR2xzWlNBb0lXeHBibVZ6VzJ4cGJtVnpMbXhsYm1kMGFDQXRJREZkS1NCN1hHNGdJQ0FnSUNCc2FXNWxjeTV3YjNBb0tUdGNiaUFnSUNBZ0lHUmxiR2x0YVhSbGNuTXVjRzl3S0NrN1hHNGdJQ0FnZlZ4dUlDQjlJR1ZzYzJVZ2FXWWdLR0ZrWkVWUFJrNU1LU0I3WEc0Z0lDQWdiR2x1WlhNdWNIVnphQ2duSnlrN1hHNGdJQ0FnWkdWc2FXMXBkR1Z5Y3k1d2RYTm9LQ2RjWEc0bktUdGNiaUFnZlZ4dUlDQm1iM0lnS0d4bGRDQmZheUE5SURBN0lGOXJJRHdnYkdsdVpYTXViR1Z1WjNSb0lDMGdNVHNnWDJzckt5a2dlMXh1SUNBZ0lHeHBibVZ6VzE5clhTQTlJR3hwYm1WelcxOXJYU0FySUdSbGJHbHRhWFJsY25OYlgydGRPMXh1SUNCOVhHNGdJSEpsZEhWeWJpQnNhVzVsY3k1cWIybHVLQ2NuS1R0Y2JuMWNibHh1THk4Z1YzSmhjSEJsY2lCMGFHRjBJSE4xY0hCdmNuUnpJRzExYkhScGNHeGxJR1pwYkdVZ2NHRjBZMmhsY3lCMmFXRWdZMkZzYkdKaFkydHpMbHh1Wlhod2IzSjBJR1oxYm1OMGFXOXVJR0Z3Y0d4NVVHRjBZMmhsY3loMWJtbEVhV1ptTENCdmNIUnBiMjV6S1NCN1hHNGdJR2xtSUNoMGVYQmxiMllnZFc1cFJHbG1aaUE5UFQwZ0ozTjBjbWx1WnljcElIdGNiaUFnSUNCMWJtbEVhV1ptSUQwZ2NHRnljMlZRWVhSamFDaDFibWxFYVdabUtUdGNiaUFnZlZ4dVhHNGdJR3hsZENCamRYSnlaVzUwU1c1a1pYZ2dQU0F3TzF4dUlDQm1kVzVqZEdsdmJpQndjbTlqWlhOelNXNWtaWGdvS1NCN1hHNGdJQ0FnYkdWMElHbHVaR1Y0SUQwZ2RXNXBSR2xtWmx0amRYSnlaVzUwU1c1a1pYZ3JLMTA3WEc0Z0lDQWdhV1lnS0NGcGJtUmxlQ2tnZTF4dUlDQWdJQ0FnY21WMGRYSnVJRzl3ZEdsdmJuTXVZMjl0Y0d4bGRHVW9LVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQnZjSFJwYjI1ekxteHZZV1JHYVd4bEtHbHVaR1Y0TENCbWRXNWpkR2x2YmlobGNuSXNJR1JoZEdFcElIdGNiaUFnSUNBZ0lHbG1JQ2hsY25JcElIdGNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlHOXdkR2x2Ym5NdVkyOXRjR3hsZEdVb1pYSnlLVHRjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnYkdWMElIVndaR0YwWldSRGIyNTBaVzUwSUQwZ1lYQndiSGxRWVhSamFDaGtZWFJoTENCcGJtUmxlQ3dnYjNCMGFXOXVjeWs3WEc0Z0lDQWdJQ0J2Y0hScGIyNXpMbkJoZEdOb1pXUW9hVzVrWlhnc0lIVndaR0YwWldSRGIyNTBaVzUwTENCbWRXNWpkR2x2YmlobGNuSXBJSHRjYmlBZ0lDQWdJQ0FnYVdZZ0tHVnljaWtnZTF4dUlDQWdJQ0FnSUNBZ0lISmxkSFZ5YmlCdmNIUnBiMjV6TG1OdmJYQnNaWFJsS0dWeWNpazdYRzRnSUNBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnSUNCd2NtOWpaWE56U1c1a1pYZ29LVHRjYmlBZ0lDQWdJSDBwTzF4dUlDQWdJSDBwTzF4dUlDQjlYRzRnSUhCeWIyTmxjM05KYm1SbGVDZ3BPMXh1ZlZ4dUlsMTlcbiIsIi8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cblwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5zdHJ1Y3R1cmVkUGF0Y2ggPSBzdHJ1Y3R1cmVkUGF0Y2g7XG5leHBvcnRzLmZvcm1hdFBhdGNoID0gZm9ybWF0UGF0Y2g7XG5leHBvcnRzLmNyZWF0ZVR3b0ZpbGVzUGF0Y2ggPSBjcmVhdGVUd29GaWxlc1BhdGNoO1xuZXhwb3J0cy5jcmVhdGVQYXRjaCA9IGNyZWF0ZVBhdGNoO1xuXG4vKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xudmFyXG4vKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG5fbGluZSA9IHJlcXVpcmUoXCIuLi9kaWZmL2xpbmVcIilcbi8qaXN0YW5idWwgaWdub3JlIGVuZCovXG47XG5cbi8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki8gZnVuY3Rpb24gX3RvQ29uc3VtYWJsZUFycmF5KGFycikgeyByZXR1cm4gX2FycmF5V2l0aG91dEhvbGVzKGFycikgfHwgX2l0ZXJhYmxlVG9BcnJheShhcnIpIHx8IF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShhcnIpIHx8IF9ub25JdGVyYWJsZVNwcmVhZCgpOyB9XG5cbmZ1bmN0aW9uIF9ub25JdGVyYWJsZVNwcmVhZCgpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBzcHJlYWQgbm9uLWl0ZXJhYmxlIGluc3RhbmNlLlxcbkluIG9yZGVyIHRvIGJlIGl0ZXJhYmxlLCBub24tYXJyYXkgb2JqZWN0cyBtdXN0IGhhdmUgYSBbU3ltYm9sLml0ZXJhdG9yXSgpIG1ldGhvZC5cIik7IH1cblxuZnVuY3Rpb24gX3Vuc3VwcG9ydGVkSXRlcmFibGVUb0FycmF5KG8sIG1pbkxlbikgeyBpZiAoIW8pIHJldHVybjsgaWYgKHR5cGVvZiBvID09PSBcInN0cmluZ1wiKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTsgdmFyIG4gPSBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobykuc2xpY2UoOCwgLTEpOyBpZiAobiA9PT0gXCJPYmplY3RcIiAmJiBvLmNvbnN0cnVjdG9yKSBuID0gby5jb25zdHJ1Y3Rvci5uYW1lOyBpZiAobiA9PT0gXCJNYXBcIiB8fCBuID09PSBcIlNldFwiKSByZXR1cm4gQXJyYXkuZnJvbShvKTsgaWYgKG4gPT09IFwiQXJndW1lbnRzXCIgfHwgL14oPzpVaXxJKW50KD86OHwxNnwzMikoPzpDbGFtcGVkKT9BcnJheSQvLnRlc3QobikpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pOyB9XG5cbmZ1bmN0aW9uIF9pdGVyYWJsZVRvQXJyYXkoaXRlcikgeyBpZiAodHlwZW9mIFN5bWJvbCAhPT0gXCJ1bmRlZmluZWRcIiAmJiBTeW1ib2wuaXRlcmF0b3IgaW4gT2JqZWN0KGl0ZXIpKSByZXR1cm4gQXJyYXkuZnJvbShpdGVyKTsgfVxuXG5mdW5jdGlvbiBfYXJyYXlXaXRob3V0SG9sZXMoYXJyKSB7IGlmIChBcnJheS5pc0FycmF5KGFycikpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShhcnIpOyB9XG5cbmZ1bmN0aW9uIF9hcnJheUxpa2VUb0FycmF5KGFyciwgbGVuKSB7IGlmIChsZW4gPT0gbnVsbCB8fCBsZW4gPiBhcnIubGVuZ3RoKSBsZW4gPSBhcnIubGVuZ3RoOyBmb3IgKHZhciBpID0gMCwgYXJyMiA9IG5ldyBBcnJheShsZW4pOyBpIDwgbGVuOyBpKyspIHsgYXJyMltpXSA9IGFycltpXTsgfSByZXR1cm4gYXJyMjsgfVxuXG4vKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuZnVuY3Rpb24gc3RydWN0dXJlZFBhdGNoKG9sZEZpbGVOYW1lLCBuZXdGaWxlTmFtZSwgb2xkU3RyLCBuZXdTdHIsIG9sZEhlYWRlciwgbmV3SGVhZGVyLCBvcHRpb25zKSB7XG4gIGlmICghb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfVxuXG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5jb250ZXh0ID09PSAndW5kZWZpbmVkJykge1xuICAgIG9wdGlvbnMuY29udGV4dCA9IDQ7XG4gIH1cblxuICB2YXIgZGlmZiA9XG4gIC8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cbiAgKDAsXG4gIC8qaXN0YW5idWwgaWdub3JlIGVuZCovXG5cbiAgLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuICBfbGluZVxuICAvKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuICAuXG4gIC8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cbiAgZGlmZkxpbmVzKVxuICAvKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuICAob2xkU3RyLCBuZXdTdHIsIG9wdGlvbnMpO1xuICBkaWZmLnB1c2goe1xuICAgIHZhbHVlOiAnJyxcbiAgICBsaW5lczogW11cbiAgfSk7IC8vIEFwcGVuZCBhbiBlbXB0eSB2YWx1ZSB0byBtYWtlIGNsZWFudXAgZWFzaWVyXG5cbiAgZnVuY3Rpb24gY29udGV4dExpbmVzKGxpbmVzKSB7XG4gICAgcmV0dXJuIGxpbmVzLm1hcChmdW5jdGlvbiAoZW50cnkpIHtcbiAgICAgIHJldHVybiAnICcgKyBlbnRyeTtcbiAgICB9KTtcbiAgfVxuXG4gIHZhciBodW5rcyA9IFtdO1xuICB2YXIgb2xkUmFuZ2VTdGFydCA9IDAsXG4gICAgICBuZXdSYW5nZVN0YXJ0ID0gMCxcbiAgICAgIGN1clJhbmdlID0gW10sXG4gICAgICBvbGRMaW5lID0gMSxcbiAgICAgIG5ld0xpbmUgPSAxO1xuXG4gIC8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cbiAgdmFyIF9sb29wID0gZnVuY3Rpb24gX2xvb3AoXG4gIC8qaXN0YW5idWwgaWdub3JlIGVuZCovXG4gIGkpIHtcbiAgICB2YXIgY3VycmVudCA9IGRpZmZbaV0sXG4gICAgICAgIGxpbmVzID0gY3VycmVudC5saW5lcyB8fCBjdXJyZW50LnZhbHVlLnJlcGxhY2UoL1xcbiQvLCAnJykuc3BsaXQoJ1xcbicpO1xuICAgIGN1cnJlbnQubGluZXMgPSBsaW5lcztcblxuICAgIGlmIChjdXJyZW50LmFkZGVkIHx8IGN1cnJlbnQucmVtb3ZlZCkge1xuICAgICAgLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuICAgICAgdmFyIF9jdXJSYW5nZTtcblxuICAgICAgLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbiAgICAgIC8vIElmIHdlIGhhdmUgcHJldmlvdXMgY29udGV4dCwgc3RhcnQgd2l0aCB0aGF0XG4gICAgICBpZiAoIW9sZFJhbmdlU3RhcnQpIHtcbiAgICAgICAgdmFyIHByZXYgPSBkaWZmW2kgLSAxXTtcbiAgICAgICAgb2xkUmFuZ2VTdGFydCA9IG9sZExpbmU7XG4gICAgICAgIG5ld1JhbmdlU3RhcnQgPSBuZXdMaW5lO1xuXG4gICAgICAgIGlmIChwcmV2KSB7XG4gICAgICAgICAgY3VyUmFuZ2UgPSBvcHRpb25zLmNvbnRleHQgPiAwID8gY29udGV4dExpbmVzKHByZXYubGluZXMuc2xpY2UoLW9wdGlvbnMuY29udGV4dCkpIDogW107XG4gICAgICAgICAgb2xkUmFuZ2VTdGFydCAtPSBjdXJSYW5nZS5sZW5ndGg7XG4gICAgICAgICAgbmV3UmFuZ2VTdGFydCAtPSBjdXJSYW5nZS5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgIH0gLy8gT3V0cHV0IG91ciBjaGFuZ2VzXG5cblxuICAgICAgLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuXG4gICAgICAvKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuXG4gICAgICAvKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG4gICAgICAoX2N1clJhbmdlID1cbiAgICAgIC8qaXN0YW5idWwgaWdub3JlIGVuZCovXG4gICAgICBjdXJSYW5nZSkucHVzaC5hcHBseShcbiAgICAgIC8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cbiAgICAgIF9jdXJSYW5nZVxuICAgICAgLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbiAgICAgICxcbiAgICAgIC8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cbiAgICAgIF90b0NvbnN1bWFibGVBcnJheShcbiAgICAgIC8qaXN0YW5idWwgaWdub3JlIGVuZCovXG4gICAgICBsaW5lcy5tYXAoZnVuY3Rpb24gKGVudHJ5KSB7XG4gICAgICAgIHJldHVybiAoY3VycmVudC5hZGRlZCA/ICcrJyA6ICctJykgKyBlbnRyeTtcbiAgICAgIH0pKSk7IC8vIFRyYWNrIHRoZSB1cGRhdGVkIGZpbGUgcG9zaXRpb25cblxuXG4gICAgICBpZiAoY3VycmVudC5hZGRlZCkge1xuICAgICAgICBuZXdMaW5lICs9IGxpbmVzLmxlbmd0aDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG9sZExpbmUgKz0gbGluZXMubGVuZ3RoO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJZGVudGljYWwgY29udGV4dCBsaW5lcy4gVHJhY2sgbGluZSBjaGFuZ2VzXG4gICAgICBpZiAob2xkUmFuZ2VTdGFydCkge1xuICAgICAgICAvLyBDbG9zZSBvdXQgYW55IGNoYW5nZXMgdGhhdCBoYXZlIGJlZW4gb3V0cHV0IChvciBqb2luIG92ZXJsYXBwaW5nKVxuICAgICAgICBpZiAobGluZXMubGVuZ3RoIDw9IG9wdGlvbnMuY29udGV4dCAqIDIgJiYgaSA8IGRpZmYubGVuZ3RoIC0gMikge1xuICAgICAgICAgIC8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cbiAgICAgICAgICB2YXIgX2N1clJhbmdlMjtcblxuICAgICAgICAgIC8qaXN0YW5idWwgaWdub3JlIGVuZCovXG4gICAgICAgICAgLy8gT3ZlcmxhcHBpbmdcblxuICAgICAgICAgIC8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cblxuICAgICAgICAgIC8qaXN0YW5idWwgaWdub3JlIGVuZCovXG5cbiAgICAgICAgICAvKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG4gICAgICAgICAgKF9jdXJSYW5nZTIgPVxuICAgICAgICAgIC8qaXN0YW5idWwgaWdub3JlIGVuZCovXG4gICAgICAgICAgY3VyUmFuZ2UpLnB1c2guYXBwbHkoXG4gICAgICAgICAgLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuICAgICAgICAgIF9jdXJSYW5nZTJcbiAgICAgICAgICAvKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuICAgICAgICAgICxcbiAgICAgICAgICAvKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG4gICAgICAgICAgX3RvQ29uc3VtYWJsZUFycmF5KFxuICAgICAgICAgIC8qaXN0YW5idWwgaWdub3JlIGVuZCovXG4gICAgICAgICAgY29udGV4dExpbmVzKGxpbmVzKSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cbiAgICAgICAgICB2YXIgX2N1clJhbmdlMztcblxuICAgICAgICAgIC8qaXN0YW5idWwgaWdub3JlIGVuZCovXG4gICAgICAgICAgLy8gZW5kIHRoZSByYW5nZSBhbmQgb3V0cHV0XG4gICAgICAgICAgdmFyIGNvbnRleHRTaXplID0gTWF0aC5taW4obGluZXMubGVuZ3RoLCBvcHRpb25zLmNvbnRleHQpO1xuXG4gICAgICAgICAgLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuXG4gICAgICAgICAgLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cblxuICAgICAgICAgIC8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cbiAgICAgICAgICAoX2N1clJhbmdlMyA9XG4gICAgICAgICAgLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbiAgICAgICAgICBjdXJSYW5nZSkucHVzaC5hcHBseShcbiAgICAgICAgICAvKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG4gICAgICAgICAgX2N1clJhbmdlM1xuICAgICAgICAgIC8qaXN0YW5idWwgaWdub3JlIGVuZCovXG4gICAgICAgICAgLFxuICAgICAgICAgIC8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cbiAgICAgICAgICBfdG9Db25zdW1hYmxlQXJyYXkoXG4gICAgICAgICAgLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbiAgICAgICAgICBjb250ZXh0TGluZXMobGluZXMuc2xpY2UoMCwgY29udGV4dFNpemUpKSkpO1xuXG4gICAgICAgICAgdmFyIGh1bmsgPSB7XG4gICAgICAgICAgICBvbGRTdGFydDogb2xkUmFuZ2VTdGFydCxcbiAgICAgICAgICAgIG9sZExpbmVzOiBvbGRMaW5lIC0gb2xkUmFuZ2VTdGFydCArIGNvbnRleHRTaXplLFxuICAgICAgICAgICAgbmV3U3RhcnQ6IG5ld1JhbmdlU3RhcnQsXG4gICAgICAgICAgICBuZXdMaW5lczogbmV3TGluZSAtIG5ld1JhbmdlU3RhcnQgKyBjb250ZXh0U2l6ZSxcbiAgICAgICAgICAgIGxpbmVzOiBjdXJSYW5nZVxuICAgICAgICAgIH07XG5cbiAgICAgICAgICBpZiAoaSA+PSBkaWZmLmxlbmd0aCAtIDIgJiYgbGluZXMubGVuZ3RoIDw9IG9wdGlvbnMuY29udGV4dCkge1xuICAgICAgICAgICAgLy8gRU9GIGlzIGluc2lkZSB0aGlzIGh1bmtcbiAgICAgICAgICAgIHZhciBvbGRFT0ZOZXdsaW5lID0gL1xcbiQvLnRlc3Qob2xkU3RyKTtcbiAgICAgICAgICAgIHZhciBuZXdFT0ZOZXdsaW5lID0gL1xcbiQvLnRlc3QobmV3U3RyKTtcbiAgICAgICAgICAgIHZhciBub05sQmVmb3JlQWRkcyA9IGxpbmVzLmxlbmd0aCA9PSAwICYmIGN1clJhbmdlLmxlbmd0aCA+IGh1bmsub2xkTGluZXM7XG5cbiAgICAgICAgICAgIGlmICghb2xkRU9GTmV3bGluZSAmJiBub05sQmVmb3JlQWRkcyAmJiBvbGRTdHIubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAvLyBzcGVjaWFsIGNhc2U6IG9sZCBoYXMgbm8gZW9sIGFuZCBubyB0cmFpbGluZyBjb250ZXh0OyBuby1ubCBjYW4gZW5kIHVwIGJlZm9yZSBhZGRzXG4gICAgICAgICAgICAgIC8vIGhvd2V2ZXIsIGlmIHRoZSBvbGQgZmlsZSBpcyBlbXB0eSwgZG8gbm90IG91dHB1dCB0aGUgbm8tbmwgbGluZVxuICAgICAgICAgICAgICBjdXJSYW5nZS5zcGxpY2UoaHVuay5vbGRMaW5lcywgMCwgJ1xcXFwgTm8gbmV3bGluZSBhdCBlbmQgb2YgZmlsZScpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoIW9sZEVPRk5ld2xpbmUgJiYgIW5vTmxCZWZvcmVBZGRzIHx8ICFuZXdFT0ZOZXdsaW5lKSB7XG4gICAgICAgICAgICAgIGN1clJhbmdlLnB1c2goJ1xcXFwgTm8gbmV3bGluZSBhdCBlbmQgb2YgZmlsZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cblxuICAgICAgICAgIGh1bmtzLnB1c2goaHVuayk7XG4gICAgICAgICAgb2xkUmFuZ2VTdGFydCA9IDA7XG4gICAgICAgICAgbmV3UmFuZ2VTdGFydCA9IDA7XG4gICAgICAgICAgY3VyUmFuZ2UgPSBbXTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBvbGRMaW5lICs9IGxpbmVzLmxlbmd0aDtcbiAgICAgIG5ld0xpbmUgKz0gbGluZXMubGVuZ3RoO1xuICAgIH1cbiAgfTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGRpZmYubGVuZ3RoOyBpKyspIHtcbiAgICAvKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG4gICAgX2xvb3AoXG4gICAgLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbiAgICBpKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgb2xkRmlsZU5hbWU6IG9sZEZpbGVOYW1lLFxuICAgIG5ld0ZpbGVOYW1lOiBuZXdGaWxlTmFtZSxcbiAgICBvbGRIZWFkZXI6IG9sZEhlYWRlcixcbiAgICBuZXdIZWFkZXI6IG5ld0hlYWRlcixcbiAgICBodW5rczogaHVua3NcbiAgfTtcbn1cblxuZnVuY3Rpb24gZm9ybWF0UGF0Y2goZGlmZikge1xuICB2YXIgcmV0ID0gW107XG5cbiAgaWYgKGRpZmYub2xkRmlsZU5hbWUgPT0gZGlmZi5uZXdGaWxlTmFtZSkge1xuICAgIHJldC5wdXNoKCdJbmRleDogJyArIGRpZmYub2xkRmlsZU5hbWUpO1xuICB9XG5cbiAgcmV0LnB1c2goJz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0nKTtcbiAgcmV0LnB1c2goJy0tLSAnICsgZGlmZi5vbGRGaWxlTmFtZSArICh0eXBlb2YgZGlmZi5vbGRIZWFkZXIgPT09ICd1bmRlZmluZWQnID8gJycgOiAnXFx0JyArIGRpZmYub2xkSGVhZGVyKSk7XG4gIHJldC5wdXNoKCcrKysgJyArIGRpZmYubmV3RmlsZU5hbWUgKyAodHlwZW9mIGRpZmYubmV3SGVhZGVyID09PSAndW5kZWZpbmVkJyA/ICcnIDogJ1xcdCcgKyBkaWZmLm5ld0hlYWRlcikpO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgZGlmZi5odW5rcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBodW5rID0gZGlmZi5odW5rc1tpXTsgLy8gVW5pZmllZCBEaWZmIEZvcm1hdCBxdWlyazogSWYgdGhlIGNodW5rIHNpemUgaXMgMCxcbiAgICAvLyB0aGUgZmlyc3QgbnVtYmVyIGlzIG9uZSBsb3dlciB0aGFuIG9uZSB3b3VsZCBleHBlY3QuXG4gICAgLy8gaHR0cHM6Ly93d3cuYXJ0aW1hLmNvbS93ZWJsb2dzL3ZpZXdwb3N0LmpzcD90aHJlYWQ9MTY0MjkzXG5cbiAgICBpZiAoaHVuay5vbGRMaW5lcyA9PT0gMCkge1xuICAgICAgaHVuay5vbGRTdGFydCAtPSAxO1xuICAgIH1cblxuICAgIGlmIChodW5rLm5ld0xpbmVzID09PSAwKSB7XG4gICAgICBodW5rLm5ld1N0YXJ0IC09IDE7XG4gICAgfVxuXG4gICAgcmV0LnB1c2goJ0BAIC0nICsgaHVuay5vbGRTdGFydCArICcsJyArIGh1bmsub2xkTGluZXMgKyAnICsnICsgaHVuay5uZXdTdGFydCArICcsJyArIGh1bmsubmV3TGluZXMgKyAnIEBAJyk7XG4gICAgcmV0LnB1c2guYXBwbHkocmV0LCBodW5rLmxpbmVzKTtcbiAgfVxuXG4gIHJldHVybiByZXQuam9pbignXFxuJykgKyAnXFxuJztcbn1cblxuZnVuY3Rpb24gY3JlYXRlVHdvRmlsZXNQYXRjaChvbGRGaWxlTmFtZSwgbmV3RmlsZU5hbWUsIG9sZFN0ciwgbmV3U3RyLCBvbGRIZWFkZXIsIG5ld0hlYWRlciwgb3B0aW9ucykge1xuICByZXR1cm4gZm9ybWF0UGF0Y2goc3RydWN0dXJlZFBhdGNoKG9sZEZpbGVOYW1lLCBuZXdGaWxlTmFtZSwgb2xkU3RyLCBuZXdTdHIsIG9sZEhlYWRlciwgbmV3SGVhZGVyLCBvcHRpb25zKSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVBhdGNoKGZpbGVOYW1lLCBvbGRTdHIsIG5ld1N0ciwgb2xkSGVhZGVyLCBuZXdIZWFkZXIsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIGNyZWF0ZVR3b0ZpbGVzUGF0Y2goZmlsZU5hbWUsIGZpbGVOYW1lLCBvbGRTdHIsIG5ld1N0ciwgb2xkSGVhZGVyLCBuZXdIZWFkZXIsIG9wdGlvbnMpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5d1lYUmphQzlqY21WaGRHVXVhbk1pWFN3aWJtRnRaWE1pT2xzaWMzUnlkV04wZFhKbFpGQmhkR05vSWl3aWIyeGtSbWxzWlU1aGJXVWlMQ0p1WlhkR2FXeGxUbUZ0WlNJc0ltOXNaRk4wY2lJc0ltNWxkMU4wY2lJc0ltOXNaRWhsWVdSbGNpSXNJbTVsZDBobFlXUmxjaUlzSW05d2RHbHZibk1pTENKamIyNTBaWGgwSWl3aVpHbG1aaUlzSW1ScFptWk1hVzVsY3lJc0luQjFjMmdpTENKMllXeDFaU0lzSW14cGJtVnpJaXdpWTI5dWRHVjRkRXhwYm1Weklpd2liV0Z3SWl3aVpXNTBjbmtpTENKb2RXNXJjeUlzSW05c1pGSmhibWRsVTNSaGNuUWlMQ0p1WlhkU1lXNW5aVk4wWVhKMElpd2lZM1Z5VW1GdVoyVWlMQ0p2YkdSTWFXNWxJaXdpYm1WM1RHbHVaU0lzSW1raUxDSmpkWEp5Wlc1MElpd2ljbVZ3YkdGalpTSXNJbk53YkdsMElpd2lZV1JrWldRaUxDSnlaVzF2ZG1Wa0lpd2ljSEpsZGlJc0luTnNhV05sSWl3aWJHVnVaM1JvSWl3aVkyOXVkR1Y0ZEZOcGVtVWlMQ0pOWVhSb0lpd2liV2x1SWl3aWFIVnVheUlzSW05c1pGTjBZWEowSWl3aWIyeGtUR2x1WlhNaUxDSnVaWGRUZEdGeWRDSXNJbTVsZDB4cGJtVnpJaXdpYjJ4a1JVOUdUbVYzYkdsdVpTSXNJblJsYzNRaUxDSnVaWGRGVDBaT1pYZHNhVzVsSWl3aWJtOU9iRUpsWm05eVpVRmtaSE1pTENKemNHeHBZMlVpTENKbWIzSnRZWFJRWVhSamFDSXNJbkpsZENJc0ltRndjR3g1SWl3aWFtOXBiaUlzSW1OeVpXRjBaVlIzYjBacGJHVnpVR0YwWTJnaUxDSmpjbVZoZEdWUVlYUmphQ0lzSW1acGJHVk9ZVzFsSWwwc0ltMWhjSEJwYm1keklqb2lPenM3T3pzN096czdPenM3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVRkJPenM3T3pzN096czdPenM3T3pzN1FVRkZUeXhUUVVGVFFTeGxRVUZVTEVOQlFYbENReXhYUVVGNlFpeEZRVUZ6UTBNc1YwRkJkRU1zUlVGQmJVUkRMRTFCUVc1RUxFVkJRVEpFUXl4TlFVRXpSQ3hGUVVGdFJVTXNVMEZCYmtVc1JVRkJPRVZETEZOQlFUbEZMRVZCUVhsR1F5eFBRVUY2Uml4RlFVRnJSenRCUVVOMlJ5eE5RVUZKTEVOQlFVTkJMRTlCUVV3c1JVRkJZenRCUVVOYVFTeEpRVUZCUVN4UFFVRlBMRWRCUVVjc1JVRkJWanRCUVVORU96dEJRVU5FTEUxQlFVa3NUMEZCVDBFc1QwRkJUeXhEUVVGRFF5eFBRVUZtTEV0QlFUSkNMRmRCUVM5Q0xFVkJRVFJETzBGQlF6RkRSQ3hKUVVGQlFTeFBRVUZQTEVOQlFVTkRMRTlCUVZJc1IwRkJhMElzUTBGQmJFSTdRVUZEUkRzN1FVRkZSQ3hOUVVGTlF5eEpRVUZKTzBGQlFVYzdRVUZCUVR0QlFVRkJPenRCUVVGQlF6dEJRVUZCUVR0QlFVRkJRVHRCUVVGQlFUdEJRVUZCUVR0QlFVRkJRVHRCUVVGQk8wRkJRVUVzUjBGQlZWQXNUVUZCVml4RlFVRnJRa01zVFVGQmJFSXNSVUZCTUVKSExFOUJRVEZDTEVOQlFXSTdRVUZEUVVVc1JVRkJRVUVzU1VGQlNTeERRVUZEUlN4SlFVRk1MRU5CUVZVN1FVRkJRME1zU1VGQlFVRXNTMEZCU3l4RlFVRkZMRVZCUVZJN1FVRkJXVU1zU1VGQlFVRXNTMEZCU3l4RlFVRkZPMEZCUVc1Q0xFZEJRVllzUlVGVWRVY3NRMEZUY0VVN08wRkJSVzVETEZkQlFWTkRMRmxCUVZRc1EwRkJjMEpFTEV0QlFYUkNMRVZCUVRaQ08wRkJRek5DTEZkQlFVOUJMRXRCUVVzc1EwRkJRMFVzUjBGQlRpeERRVUZWTEZWQlFWTkRMRXRCUVZRc1JVRkJaMEk3UVVGQlJTeGhRVUZQTEUxQlFVMUJMRXRCUVdJN1FVRkJjVUlzUzBGQmFrUXNRMEZCVUR0QlFVTkVPenRCUVVWRUxFMUJRVWxETEV0QlFVc3NSMEZCUnl4RlFVRmFPMEZCUTBFc1RVRkJTVU1zWVVGQllTeEhRVUZITEVOQlFYQkNPMEZCUVVFc1RVRkJkVUpETEdGQlFXRXNSMEZCUnl4RFFVRjJRenRCUVVGQkxFMUJRVEJEUXl4UlFVRlJMRWRCUVVjc1JVRkJja1E3UVVGQlFTeE5RVU5KUXl4UFFVRlBMRWRCUVVjc1EwRkVaRHRCUVVGQkxFMUJRMmxDUXl4UFFVRlBMRWRCUVVjc1EwRkVNMEk3TzBGQmFFSjFSenRCUVVGQk8wRkJRVUU3UVVGclFqbEdReXhGUVVGQlFTeERRV3hDT0VZN1FVRnRRbkpITEZGQlFVMURMRTlCUVU4c1IwRkJSMllzU1VGQlNTeERRVUZEWXl4RFFVRkVMRU5CUVhCQ08wRkJRVUVzVVVGRFRWWXNTMEZCU3l4SFFVRkhWeXhQUVVGUExFTkJRVU5ZTEV0QlFWSXNTVUZCYVVKWExFOUJRVThzUTBGQlExb3NTMEZCVWl4RFFVRmpZU3hQUVVGa0xFTkJRWE5DTEV0QlFYUkNMRVZCUVRaQ0xFVkJRVGRDTEVWQlFXbERReXhMUVVGcVF5eERRVUYxUXl4SlFVRjJReXhEUVVRdlFqdEJRVVZCUml4SlFVRkJRU3hQUVVGUExFTkJRVU5ZTEV0QlFWSXNSMEZCWjBKQkxFdEJRV2hDT3p0QlFVVkJMRkZCUVVsWExFOUJRVThzUTBGQlEwY3NTMEZCVWl4SlFVRnBRa2dzVDBGQlR5eERRVUZEU1N4UFFVRTNRaXhGUVVGelF6dEJRVUZCTzBGQlFVRTdPMEZCUVVFN1FVRkRjRU03UVVGRFFTeFZRVUZKTEVOQlFVTldMR0ZCUVV3c1JVRkJiMEk3UVVGRGJFSXNXVUZCVFZjc1NVRkJTU3hIUVVGSGNFSXNTVUZCU1N4RFFVRkRZeXhEUVVGRExFZEJRVWNzUTBGQlRDeERRVUZxUWp0QlFVTkJUQ3hSUVVGQlFTeGhRVUZoTEVkQlFVZEhMRTlCUVdoQ08wRkJRMEZHTEZGQlFVRkJMR0ZCUVdFc1IwRkJSMGNzVDBGQmFFSTdPMEZCUlVFc1dVRkJTVThzU1VGQlNpeEZRVUZWTzBGQlExSlVMRlZCUVVGQkxGRkJRVkVzUjBGQlIySXNUMEZCVHl4RFFVRkRReXhQUVVGU0xFZEJRV3RDTEVOQlFXeENMRWRCUVhOQ1RTeFpRVUZaTEVOQlFVTmxMRWxCUVVrc1EwRkJRMmhDTEV0QlFVd3NRMEZCVjJsQ0xFdEJRVmdzUTBGQmFVSXNRMEZCUTNaQ0xFOUJRVThzUTBGQlEwTXNUMEZCTVVJc1EwRkJSQ3hEUVVGc1F5eEhRVUY1UlN4RlFVRndSanRCUVVOQlZTeFZRVUZCUVN4aFFVRmhMRWxCUVVsRkxGRkJRVkVzUTBGQlExY3NUVUZCTVVJN1FVRkRRVm9zVlVGQlFVRXNZVUZCWVN4SlFVRkpReXhSUVVGUkxFTkJRVU5YTEUxQlFURkNPMEZCUTBRN1FVRkRSaXhQUVZwdFF5eERRV053UXpzN08wRkJRMEU3TzBGQlFVRTdPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJRVUZZTEUxQlFVRkJMRkZCUVZFc1JVRkJRMVFzU1VGQlZEdEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJRV3RDUlN4TlFVRkJRU3hMUVVGTExFTkJRVU5GTEVkQlFVNHNRMEZCVlN4VlFVRlRReXhMUVVGVUxFVkJRV2RDTzBGQlF6RkRMR1ZCUVU4c1EwRkJRMUVzVDBGQlR5eERRVUZEUnl4TFFVRlNMRWRCUVdkQ0xFZEJRV2hDTEVkQlFYTkNMRWRCUVhaQ0xFbEJRVGhDV0N4TFFVRnlRenRCUVVORUxFOUJSbWxDTEVOQlFXeENMRWRCWm05RExFTkJiVUp3UXpzN08wRkJRMEVzVlVGQlNWRXNUMEZCVHl4RFFVRkRSeXhMUVVGYUxFVkJRVzFDTzBGQlEycENUQ3hSUVVGQlFTeFBRVUZQTEVsQlFVbFVMRXRCUVVzc1EwRkJRMnRDTEUxQlFXcENPMEZCUTBRc1QwRkdSQ3hOUVVWUE8wRkJRMHhXTEZGQlFVRkJMRTlCUVU4c1NVRkJTVklzUzBGQlN5eERRVUZEYTBJc1RVRkJha0k3UVVGRFJEdEJRVU5HTEV0QmVrSkVMRTFCZVVKUE8wRkJRMHc3UVVGRFFTeFZRVUZKWWl4aFFVRktMRVZCUVcxQ08wRkJRMnBDTzBGQlEwRXNXVUZCU1V3c1MwRkJTeXhEUVVGRGEwSXNUVUZCVGl4SlFVRm5RbmhDTEU5QlFVOHNRMEZCUTBNc1QwRkJVaXhIUVVGclFpeERRVUZzUXl4SlFVRjFRMlVzUTBGQlF5eEhRVUZIWkN4SlFVRkpMRU5CUVVOelFpeE5RVUZNTEVkQlFXTXNRMEZCTjBRc1JVRkJaMFU3UVVGQlFUdEJRVUZCT3p0QlFVRkJPMEZCUXpsRU96dEJRVU5CT3p0QlFVRkJPenRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVUZCV0N4VlFVRkJRU3hSUVVGUkxFVkJRVU5VTEVsQlFWUTdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVUZyUWtjc1ZVRkJRVUVzV1VGQldTeERRVUZEUkN4TFFVRkVMRU5CUVRsQ08wRkJRMFFzVTBGSVJDeE5RVWRQTzBGQlFVRTdRVUZCUVRzN1FVRkJRVHRCUVVOTU8wRkJRMEVzWTBGQlNXMUNMRmRCUVZjc1IwRkJSME1zU1VGQlNTeERRVUZEUXl4SFFVRk1MRU5CUVZOeVFpeExRVUZMTEVOQlFVTnJRaXhOUVVGbUxFVkJRWFZDZUVJc1QwRkJUeXhEUVVGRFF5eFBRVUV2UWl4RFFVRnNRanM3UVVGRFFUczdRVUZCUVRzN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGQlFWa3NWVUZCUVVFc1VVRkJVU3hGUVVGRFZDeEpRVUZVTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGQmEwSkhMRlZCUVVGQkxGbEJRVmtzUTBGQlEwUXNTMEZCU3l4RFFVRkRhVUlzUzBGQlRpeERRVUZaTEVOQlFWb3NSVUZCWlVVc1YwRkJaaXhEUVVGRUxFTkJRVGxDT3p0QlFVVkJMR05CUVVsSExFbEJRVWtzUjBGQlJ6dEJRVU5VUXl4WlFVRkJRU3hSUVVGUkxFVkJRVVZzUWl4aFFVUkVPMEZCUlZSdFFpeFpRVUZCUVN4UlFVRlJMRVZCUVVkb1FpeFBRVUZQTEVkQlFVZElMR0ZCUVZZc1IwRkJNRUpqTEZkQlJqVkNPMEZCUjFSTkxGbEJRVUZCTEZGQlFWRXNSVUZCUlc1Q0xHRkJTRVE3UVVGSlZHOUNMRmxCUVVGQkxGRkJRVkVzUlVGQlIycENMRTlCUVU4c1IwRkJSMGdzWVVGQlZpeEhRVUV3UW1Fc1YwRktOVUk3UVVGTFZHNUNMRmxCUVVGQkxFdEJRVXNzUlVGQlJVODdRVUZNUlN4WFFVRllPenRCUVU5QkxHTkJRVWxITEVOQlFVTXNTVUZCU1dRc1NVRkJTU3hEUVVGRGMwSXNUVUZCVEN4SFFVRmpMRU5CUVc1Q0xFbEJRWGRDYkVJc1MwRkJTeXhEUVVGRGEwSXNUVUZCVGl4SlFVRm5RbmhDTEU5QlFVOHNRMEZCUTBNc1QwRkJjRVFzUlVGQk5rUTdRVUZETTBRN1FVRkRRU3huUWtGQlNXZERMR0ZCUVdFc1IwRkJTeXhMUVVGRUxFTkJRVkZETEVsQlFWSXNRMEZCWVhSRExFMUJRV0lzUTBGQmNrSTdRVUZEUVN4blFrRkJTWFZETEdGQlFXRXNSMEZCU3l4TFFVRkVMRU5CUVZGRUxFbEJRVklzUTBGQllYSkRMRTFCUVdJc1EwRkJja0k3UVVGRFFTeG5Ra0ZCU1hWRExHTkJRV01zUjBGQlJ6bENMRXRCUVVzc1EwRkJRMnRDTEUxQlFVNHNTVUZCWjBJc1EwRkJhRUlzU1VGQmNVSllMRkZCUVZFc1EwRkJRMWNzVFVGQlZDeEhRVUZyUWtrc1NVRkJTU3hEUVVGRFJTeFJRVUZxUlRzN1FVRkRRU3huUWtGQlNTeERRVUZEUnl4aFFVRkVMRWxCUVd0Q1J5eGpRVUZzUWl4SlFVRnZRM2hETEUxQlFVMHNRMEZCUXpSQ0xFMUJRVkFzUjBGQlowSXNRMEZCZUVRc1JVRkJNa1E3UVVGRGVrUTdRVUZEUVR0QlFVTkJXQ3hqUVVGQlFTeFJRVUZSTEVOQlFVTjNRaXhOUVVGVUxFTkJRV2RDVkN4SlFVRkpMRU5CUVVORkxGRkJRWEpDTEVWQlFTdENMRU5CUVM5Q0xFVkJRV3RETERoQ1FVRnNRenRCUVVORU96dEJRVU5FTEdkQ1FVRkxMRU5CUVVOSExHRkJRVVFzU1VGQmEwSXNRMEZCUTBjc1kwRkJjRUlzU1VGQmRVTXNRMEZCUTBRc1lVRkJOVU1zUlVGQk1rUTdRVUZEZWtSMFFpeGpRVUZCUVN4UlFVRlJMRU5CUVVOVUxFbEJRVlFzUTBGQll5dzRRa0ZCWkR0QlFVTkVPMEZCUTBZN08wRkJRMFJOTEZWQlFVRkJMRXRCUVVzc1EwRkJRMDRzU1VGQlRpeERRVUZYZDBJc1NVRkJXRHRCUVVWQmFrSXNWVUZCUVVFc1lVRkJZU3hIUVVGSExFTkJRV2hDTzBGQlEwRkRMRlZCUVVGQkxHRkJRV0VzUjBGQlJ5eERRVUZvUWp0QlFVTkJReXhWUVVGQlFTeFJRVUZSTEVkQlFVY3NSVUZCV0R0QlFVTkVPMEZCUTBZN08wRkJRMFJETEUxQlFVRkJMRTlCUVU4c1NVRkJTVklzUzBGQlN5eERRVUZEYTBJc1RVRkJha0k3UVVGRFFWUXNUVUZCUVVFc1QwRkJUeXhKUVVGSlZDeExRVUZMTEVOQlFVTnJRaXhOUVVGcVFqdEJRVU5FTzBGQk1VWnZSenM3UVVGclFuWkhMRTlCUVVzc1NVRkJTVklzUTBGQlF5eEhRVUZITEVOQlFXSXNSVUZCWjBKQkxFTkJRVU1zUjBGQlIyUXNTVUZCU1N4RFFVRkRjMElzVFVGQmVrSXNSVUZCYVVOU0xFTkJRVU1zUlVGQmJFTXNSVUZCYzBNN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGQk4wSkJMRWxCUVVGQkxFTkJRVFpDTzBGQmVVVnlRenM3UVVGRlJDeFRRVUZQTzBGQlEweDBRaXhKUVVGQlFTeFhRVUZYTEVWQlFVVkJMRmRCUkZJN1FVRkRjVUpETEVsQlFVRkJMRmRCUVZjc1JVRkJSVUVzVjBGRWJFTTdRVUZGVEVjc1NVRkJRVUVzVTBGQlV5eEZRVUZGUVN4VFFVWk9PMEZCUldsQ1F5eEpRVUZCUVN4VFFVRlRMRVZCUVVWQkxGTkJSalZDTzBGQlIweFhMRWxCUVVGQkxFdEJRVXNzUlVGQlJVRTdRVUZJUml4SFFVRlFPMEZCUzBRN08wRkJSVTBzVTBGQlV6UkNMRmRCUVZRc1EwRkJjVUp3UXl4SlFVRnlRaXhGUVVFeVFqdEJRVU5vUXl4TlFVRk5jVU1zUjBGQlJ5eEhRVUZITEVWQlFWbzdPMEZCUTBFc1RVRkJTWEpETEVsQlFVa3NRMEZCUTFJc1YwRkJUQ3hKUVVGdlFsRXNTVUZCU1N4RFFVRkRVQ3hYUVVFM1FpeEZRVUV3UXp0QlFVTjRRelJETEVsQlFVRkJMRWRCUVVjc1EwRkJRMjVETEVsQlFVb3NRMEZCVXl4WlFVRlpSaXhKUVVGSkxFTkJRVU5TTEZkQlFURkNPMEZCUTBRN08wRkJRMFEyUXl4RlFVRkJRU3hIUVVGSExFTkJRVU51UXl4SlFVRktMRU5CUVZNc2NVVkJRVlE3UVVGRFFXMURMRVZCUVVGQkxFZEJRVWNzUTBGQlEyNURMRWxCUVVvc1EwRkJVeXhUUVVGVFJpeEpRVUZKTEVOQlFVTlNMRmRCUVdRc1NVRkJOa0lzVDBGQlQxRXNTVUZCU1N4RFFVRkRTaXhUUVVGYUxFdEJRVEJDTEZkQlFURkNMRWRCUVhkRExFVkJRWGhETEVkQlFUWkRMRTlCUVU5SkxFbEJRVWtzUTBGQlEwb3NVMEZCZEVZc1EwRkJWRHRCUVVOQmVVTXNSVUZCUVVFc1IwRkJSeXhEUVVGRGJrTXNTVUZCU2l4RFFVRlRMRk5CUVZOR0xFbEJRVWtzUTBGQlExQXNWMEZCWkN4SlFVRTJRaXhQUVVGUFR5eEpRVUZKTEVOQlFVTklMRk5CUVZvc1MwRkJNRUlzVjBGQk1VSXNSMEZCZDBNc1JVRkJlRU1zUjBGQk5rTXNUMEZCVDBjc1NVRkJTU3hEUVVGRFNDeFRRVUYwUml4RFFVRlVPenRCUVVWQkxFOUJRVXNzU1VGQlNXbENMRU5CUVVNc1IwRkJSeXhEUVVGaUxFVkJRV2RDUVN4RFFVRkRMRWRCUVVka0xFbEJRVWtzUTBGQlExRXNTMEZCVEN4RFFVRlhZeXhOUVVFdlFpeEZRVUYxUTFJc1EwRkJReXhGUVVGNFF5eEZRVUUwUXp0QlFVTXhReXhSUVVGTldTeEpRVUZKTEVkQlFVY3hRaXhKUVVGSkxFTkJRVU5STEV0QlFVd3NRMEZCVjAwc1EwRkJXQ3hEUVVGaUxFTkJSREJETEVOQlJURkRPMEZCUTBFN1FVRkRRVHM3UVVGRFFTeFJRVUZKV1N4SlFVRkpMRU5CUVVORkxGRkJRVXdzUzBGQmEwSXNRMEZCZEVJc1JVRkJlVUk3UVVGRGRrSkdMRTFCUVVGQkxFbEJRVWtzUTBGQlEwTXNVVUZCVEN4SlFVRnBRaXhEUVVGcVFqdEJRVU5FT3p0QlFVTkVMRkZCUVVsRUxFbEJRVWtzUTBGQlEwa3NVVUZCVEN4TFFVRnJRaXhEUVVGMFFpeEZRVUY1UWp0QlFVTjJRa29zVFVGQlFVRXNTVUZCU1N4RFFVRkRSeXhSUVVGTUxFbEJRV2xDTEVOQlFXcENPMEZCUTBRN08wRkJRMFJSTEVsQlFVRkJMRWRCUVVjc1EwRkJRMjVETEVsQlFVb3NRMEZEUlN4VFFVRlRkMElzU1VGQlNTeERRVUZEUXl4UlFVRmtMRWRCUVhsQ0xFZEJRWHBDTEVkQlFTdENSQ3hKUVVGSkxFTkJRVU5GTEZGQlFYQkRMRWRCUTBVc1NVRkVSaXhIUVVOVFJpeEpRVUZKTEVOQlFVTkhMRkZCUkdRc1IwRkRlVUlzUjBGRWVrSXNSMEZESzBKSUxFbEJRVWtzUTBGQlEwa3NVVUZFY0VNc1IwRkZSU3hMUVVoS08wRkJTMEZQTEVsQlFVRkJMRWRCUVVjc1EwRkJRMjVETEVsQlFVb3NRMEZCVTI5RExFdEJRVlFzUTBGQlpVUXNSMEZCWml4RlFVRnZRbGdzU1VGQlNTeERRVUZEZEVJc1MwRkJla0k3UVVGRFJEczdRVUZGUkN4VFFVRlBhVU1zUjBGQlJ5eERRVUZEUlN4SlFVRktMRU5CUVZNc1NVRkJWQ3hKUVVGcFFpeEpRVUY0UWp0QlFVTkVPenRCUVVWTkxGTkJRVk5ETEcxQ1FVRlVMRU5CUVRaQ2FFUXNWMEZCTjBJc1JVRkJNRU5ETEZkQlFURkRMRVZCUVhWRVF5eE5RVUYyUkN4RlFVRXJSRU1zVFVGQkwwUXNSVUZCZFVWRExGTkJRWFpGTEVWQlFXdEdReXhUUVVGc1JpeEZRVUUyUmtNc1QwRkJOMFlzUlVGQmMwYzdRVUZETTBjc1UwRkJUM05ETEZkQlFWY3NRMEZCUXpkRExHVkJRV1VzUTBGQlEwTXNWMEZCUkN4RlFVRmpReXhYUVVGa0xFVkJRVEpDUXl4TlFVRXpRaXhGUVVGdFEwTXNUVUZCYmtNc1JVRkJNa05ETEZOQlFUTkRMRVZCUVhORVF5eFRRVUYwUkN4RlFVRnBSVU1zVDBGQmFrVXNRMEZCYUVJc1EwRkJiRUk3UVVGRFJEczdRVUZGVFN4VFFVRlRNa01zVjBGQlZDeERRVUZ4UWtNc1VVRkJja0lzUlVGQkswSm9SQ3hOUVVFdlFpeEZRVUYxUTBNc1RVRkJka01zUlVGQkswTkRMRk5CUVM5RExFVkJRVEJFUXl4VFFVRXhSQ3hGUVVGeFJVTXNUMEZCY2tVc1JVRkJPRVU3UVVGRGJrWXNVMEZCVHpCRExHMUNRVUZ0UWl4RFFVRkRSU3hSUVVGRUxFVkJRVmRCTEZGQlFWZ3NSVUZCY1VKb1JDeE5RVUZ5UWl4RlFVRTJRa01zVFVGQk4wSXNSVUZCY1VORExGTkJRWEpETEVWQlFXZEVReXhUUVVGb1JDeEZRVUV5UkVNc1QwRkJNMFFzUTBGQk1VSTdRVUZEUkNJc0luTnZkWEpqWlhORGIyNTBaVzUwSWpwYkltbHRjRzl5ZENCN1pHbG1aa3hwYm1WemZTQm1jbTl0SUNjdUxpOWthV1ptTDJ4cGJtVW5PMXh1WEc1bGVIQnZjblFnWm5WdVkzUnBiMjRnYzNSeWRXTjBkWEpsWkZCaGRHTm9LRzlzWkVacGJHVk9ZVzFsTENCdVpYZEdhV3hsVG1GdFpTd2diMnhrVTNSeUxDQnVaWGRUZEhJc0lHOXNaRWhsWVdSbGNpd2dibVYzU0dWaFpHVnlMQ0J2Y0hScGIyNXpLU0I3WEc0Z0lHbG1JQ2doYjNCMGFXOXVjeWtnZTF4dUlDQWdJRzl3ZEdsdmJuTWdQU0I3ZlR0Y2JpQWdmVnh1SUNCcFppQW9kSGx3Wlc5bUlHOXdkR2x2Ym5NdVkyOXVkR1Y0ZENBOVBUMGdKM1Z1WkdWbWFXNWxaQ2NwSUh0Y2JpQWdJQ0J2Y0hScGIyNXpMbU52Ym5SbGVIUWdQU0EwTzF4dUlDQjlYRzVjYmlBZ1kyOXVjM1FnWkdsbVppQTlJR1JwWm1aTWFXNWxjeWh2YkdSVGRISXNJRzVsZDFOMGNpd2diM0IwYVc5dWN5azdYRzRnSUdScFptWXVjSFZ6YUNoN2RtRnNkV1U2SUNjbkxDQnNhVzVsY3pvZ1cxMTlLVHNnTHk4Z1FYQndaVzVrSUdGdUlHVnRjSFI1SUhaaGJIVmxJSFJ2SUcxaGEyVWdZMnhsWVc1MWNDQmxZWE5wWlhKY2JseHVJQ0JtZFc1amRHbHZiaUJqYjI1MFpYaDBUR2x1WlhNb2JHbHVaWE1wSUh0Y2JpQWdJQ0J5WlhSMWNtNGdiR2x1WlhNdWJXRndLR1oxYm1OMGFXOXVLR1Z1ZEhKNUtTQjdJSEpsZEhWeWJpQW5JQ2NnS3lCbGJuUnllVHNnZlNrN1hHNGdJSDFjYmx4dUlDQnNaWFFnYUhWdWEzTWdQU0JiWFR0Y2JpQWdiR1YwSUc5c1pGSmhibWRsVTNSaGNuUWdQU0F3TENCdVpYZFNZVzVuWlZOMFlYSjBJRDBnTUN3Z1kzVnlVbUZ1WjJVZ1BTQmJYU3hjYmlBZ0lDQWdJRzlzWkV4cGJtVWdQU0F4TENCdVpYZE1hVzVsSUQwZ01UdGNiaUFnWm05eUlDaHNaWFFnYVNBOUlEQTdJR2tnUENCa2FXWm1MbXhsYm1kMGFEc2dhU3NyS1NCN1hHNGdJQ0FnWTI5dWMzUWdZM1Z5Y21WdWRDQTlJR1JwWm1aYmFWMHNYRzRnSUNBZ0lDQWdJQ0FnYkdsdVpYTWdQU0JqZFhKeVpXNTBMbXhwYm1WeklIeDhJR04xY25KbGJuUXVkbUZzZFdVdWNtVndiR0ZqWlNndlhGeHVKQzhzSUNjbktTNXpjR3hwZENnblhGeHVKeWs3WEc0Z0lDQWdZM1Z5Y21WdWRDNXNhVzVsY3lBOUlHeHBibVZ6TzF4dVhHNGdJQ0FnYVdZZ0tHTjFjbkpsYm5RdVlXUmtaV1FnZkh3Z1kzVnljbVZ1ZEM1eVpXMXZkbVZrS1NCN1hHNGdJQ0FnSUNBdkx5QkpaaUIzWlNCb1lYWmxJSEJ5WlhacGIzVnpJR052Ym5SbGVIUXNJSE4wWVhKMElIZHBkR2dnZEdoaGRGeHVJQ0FnSUNBZ2FXWWdLQ0Z2YkdSU1lXNW5aVk4wWVhKMEtTQjdYRzRnSUNBZ0lDQWdJR052Ym5OMElIQnlaWFlnUFNCa2FXWm1XMmtnTFNBeFhUdGNiaUFnSUNBZ0lDQWdiMnhrVW1GdVoyVlRkR0Z5ZENBOUlHOXNaRXhwYm1VN1hHNGdJQ0FnSUNBZ0lHNWxkMUpoYm1kbFUzUmhjblFnUFNCdVpYZE1hVzVsTzF4dVhHNGdJQ0FnSUNBZ0lHbG1JQ2h3Y21WMktTQjdYRzRnSUNBZ0lDQWdJQ0FnWTNWeVVtRnVaMlVnUFNCdmNIUnBiMjV6TG1OdmJuUmxlSFFnUGlBd0lEOGdZMjl1ZEdWNGRFeHBibVZ6S0hCeVpYWXViR2x1WlhNdWMyeHBZMlVvTFc5d2RHbHZibk11WTI5dWRHVjRkQ2twSURvZ1cxMDdYRzRnSUNBZ0lDQWdJQ0FnYjJ4a1VtRnVaMlZUZEdGeWRDQXRQU0JqZFhKU1lXNW5aUzVzWlc1bmRHZzdYRzRnSUNBZ0lDQWdJQ0FnYm1WM1VtRnVaMlZUZEdGeWRDQXRQU0JqZFhKU1lXNW5aUzVzWlc1bmRHZzdYRzRnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnTHk4Z1QzVjBjSFYwSUc5MWNpQmphR0Z1WjJWelhHNGdJQ0FnSUNCamRYSlNZVzVuWlM1d2RYTm9LQzR1TGlCc2FXNWxjeTV0WVhBb1puVnVZM1JwYjI0b1pXNTBjbmtwSUh0Y2JpQWdJQ0FnSUNBZ2NtVjBkWEp1SUNoamRYSnlaVzUwTG1Ga1pHVmtJRDhnSnlzbklEb2dKeTBuS1NBcklHVnVkSEo1TzF4dUlDQWdJQ0FnZlNrcE8xeHVYRzRnSUNBZ0lDQXZMeUJVY21GamF5QjBhR1VnZFhCa1lYUmxaQ0JtYVd4bElIQnZjMmwwYVc5dVhHNGdJQ0FnSUNCcFppQW9ZM1Z5Y21WdWRDNWhaR1JsWkNrZ2UxeHVJQ0FnSUNBZ0lDQnVaWGRNYVc1bElDczlJR3hwYm1WekxteGxibWQwYUR0Y2JpQWdJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0FnSUc5c1pFeHBibVVnS3owZ2JHbHVaWE11YkdWdVozUm9PMXh1SUNBZ0lDQWdmVnh1SUNBZ0lIMGdaV3h6WlNCN1hHNGdJQ0FnSUNBdkx5QkpaR1Z1ZEdsallXd2dZMjl1ZEdWNGRDQnNhVzVsY3k0Z1ZISmhZMnNnYkdsdVpTQmphR0Z1WjJWelhHNGdJQ0FnSUNCcFppQW9iMnhrVW1GdVoyVlRkR0Z5ZENrZ2UxeHVJQ0FnSUNBZ0lDQXZMeUJEYkc5elpTQnZkWFFnWVc1NUlHTm9ZVzVuWlhNZ2RHaGhkQ0JvWVhabElHSmxaVzRnYjNWMGNIVjBJQ2h2Y2lCcWIybHVJRzkyWlhKc1lYQndhVzVuS1Z4dUlDQWdJQ0FnSUNCcFppQW9iR2x1WlhNdWJHVnVaM1JvSUR3OUlHOXdkR2x2Ym5NdVkyOXVkR1Y0ZENBcUlESWdKaVlnYVNBOElHUnBabVl1YkdWdVozUm9JQzBnTWlrZ2UxeHVJQ0FnSUNBZ0lDQWdJQzh2SUU5MlpYSnNZWEJ3YVc1blhHNGdJQ0FnSUNBZ0lDQWdZM1Z5VW1GdVoyVXVjSFZ6YUNndUxpNGdZMjl1ZEdWNGRFeHBibVZ6S0d4cGJtVnpLU2s3WEc0Z0lDQWdJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0FnSUNBZ0x5OGdaVzVrSUhSb1pTQnlZVzVuWlNCaGJtUWdiM1YwY0hWMFhHNGdJQ0FnSUNBZ0lDQWdiR1YwSUdOdmJuUmxlSFJUYVhwbElEMGdUV0YwYUM1dGFXNG9iR2x1WlhNdWJHVnVaM1JvTENCdmNIUnBiMjV6TG1OdmJuUmxlSFFwTzF4dUlDQWdJQ0FnSUNBZ0lHTjFjbEpoYm1kbExuQjFjMmdvTGk0dUlHTnZiblJsZUhSTWFXNWxjeWhzYVc1bGN5NXpiR2xqWlNnd0xDQmpiMjUwWlhoMFUybDZaU2twS1R0Y2JseHVJQ0FnSUNBZ0lDQWdJR3hsZENCb2RXNXJJRDBnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdiMnhrVTNSaGNuUTZJRzlzWkZKaGJtZGxVM1JoY25Rc1hHNGdJQ0FnSUNBZ0lDQWdJQ0J2YkdSTWFXNWxjem9nS0c5c1pFeHBibVVnTFNCdmJHUlNZVzVuWlZOMFlYSjBJQ3NnWTI5dWRHVjRkRk5wZW1VcExGeHVJQ0FnSUNBZ0lDQWdJQ0FnYm1WM1UzUmhjblE2SUc1bGQxSmhibWRsVTNSaGNuUXNYRzRnSUNBZ0lDQWdJQ0FnSUNCdVpYZE1hVzVsY3pvZ0tHNWxkMHhwYm1VZ0xTQnVaWGRTWVc1blpWTjBZWEowSUNzZ1kyOXVkR1Y0ZEZOcGVtVXBMRnh1SUNBZ0lDQWdJQ0FnSUNBZ2JHbHVaWE02SUdOMWNsSmhibWRsWEc0Z0lDQWdJQ0FnSUNBZ2ZUdGNiaUFnSUNBZ0lDQWdJQ0JwWmlBb2FTQStQU0JrYVdabUxteGxibWQwYUNBdElESWdKaVlnYkdsdVpYTXViR1Z1WjNSb0lEdzlJRzl3ZEdsdmJuTXVZMjl1ZEdWNGRDa2dlMXh1SUNBZ0lDQWdJQ0FnSUNBZ0x5OGdSVTlHSUdseklHbHVjMmxrWlNCMGFHbHpJR2gxYm10Y2JpQWdJQ0FnSUNBZ0lDQWdJR3hsZENCdmJHUkZUMFpPWlhkc2FXNWxJRDBnS0NndlhGeHVKQzhwTG5SbGMzUW9iMnhrVTNSeUtTazdYRzRnSUNBZ0lDQWdJQ0FnSUNCc1pYUWdibVYzUlU5R1RtVjNiR2x1WlNBOUlDZ29MMXhjYmlRdktTNTBaWE4wS0c1bGQxTjBjaWtwTzF4dUlDQWdJQ0FnSUNBZ0lDQWdiR1YwSUc1dlRteENaV1p2Y21WQlpHUnpJRDBnYkdsdVpYTXViR1Z1WjNSb0lEMDlJREFnSmlZZ1kzVnlVbUZ1WjJVdWJHVnVaM1JvSUQ0Z2FIVnVheTV2YkdSTWFXNWxjenRjYmlBZ0lDQWdJQ0FnSUNBZ0lHbG1JQ2doYjJ4a1JVOUdUbVYzYkdsdVpTQW1KaUJ1YjA1c1FtVm1iM0psUVdSa2N5QW1KaUJ2YkdSVGRISXViR1Z1WjNSb0lENGdNQ2tnZTF4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0F2THlCemNHVmphV0ZzSUdOaGMyVTZJRzlzWkNCb1lYTWdibThnWlc5c0lHRnVaQ0J1YnlCMGNtRnBiR2x1WnlCamIyNTBaWGgwT3lCdWJ5MXViQ0JqWVc0Z1pXNWtJSFZ3SUdKbFptOXlaU0JoWkdSelhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUM4dklHaHZkMlYyWlhJc0lHbG1JSFJvWlNCdmJHUWdabWxzWlNCcGN5QmxiWEIwZVN3Z1pHOGdibTkwSUc5MWRIQjFkQ0IwYUdVZ2JtOHRibXdnYkdsdVpWeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNCamRYSlNZVzVuWlM1emNHeHBZMlVvYUhWdWF5NXZiR1JNYVc1bGN5d2dNQ3dnSjF4Y1hGd2dUbThnYm1WM2JHbHVaU0JoZENCbGJtUWdiMllnWm1sc1pTY3BPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQWdJQ0FnYVdZZ0tDZ2hiMnhrUlU5R1RtVjNiR2x1WlNBbUppQWhibTlPYkVKbFptOXlaVUZrWkhNcElIeDhJQ0Z1WlhkRlQwWk9aWGRzYVc1bEtTQjdYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lHTjFjbEpoYm1kbExuQjFjMmdvSjF4Y1hGd2dUbThnYm1WM2JHbHVaU0JoZENCbGJtUWdiMllnWm1sc1pTY3BPMXh1SUNBZ0lDQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJQ0FnSUNCb2RXNXJjeTV3ZFhOb0tHaDFibXNwTzF4dVhHNGdJQ0FnSUNBZ0lDQWdiMnhrVW1GdVoyVlRkR0Z5ZENBOUlEQTdYRzRnSUNBZ0lDQWdJQ0FnYm1WM1VtRnVaMlZUZEdGeWRDQTlJREE3WEc0Z0lDQWdJQ0FnSUNBZ1kzVnlVbUZ1WjJVZ1BTQmJYVHRjYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnZlZ4dUlDQWdJQ0FnYjJ4a1RHbHVaU0FyUFNCc2FXNWxjeTVzWlc1bmRHZzdYRzRnSUNBZ0lDQnVaWGRNYVc1bElDczlJR3hwYm1WekxteGxibWQwYUR0Y2JpQWdJQ0I5WEc0Z0lIMWNibHh1SUNCeVpYUjFjbTRnZTF4dUlDQWdJRzlzWkVacGJHVk9ZVzFsT2lCdmJHUkdhV3hsVG1GdFpTd2dibVYzUm1sc1pVNWhiV1U2SUc1bGQwWnBiR1ZPWVcxbExGeHVJQ0FnSUc5c1pFaGxZV1JsY2pvZ2IyeGtTR1ZoWkdWeUxDQnVaWGRJWldGa1pYSTZJRzVsZDBobFlXUmxjaXhjYmlBZ0lDQm9kVzVyY3pvZ2FIVnVhM05jYmlBZ2ZUdGNibjFjYmx4dVpYaHdiM0owSUdaMWJtTjBhVzl1SUdadmNtMWhkRkJoZEdOb0tHUnBabVlwSUh0Y2JpQWdZMjl1YzNRZ2NtVjBJRDBnVzEwN1hHNGdJR2xtSUNoa2FXWm1MbTlzWkVacGJHVk9ZVzFsSUQwOUlHUnBabVl1Ym1WM1JtbHNaVTVoYldVcElIdGNiaUFnSUNCeVpYUXVjSFZ6YUNnblNXNWtaWGc2SUNjZ0t5QmthV1ptTG05c1pFWnBiR1ZPWVcxbEtUdGNiaUFnZlZ4dUlDQnlaWFF1Y0hWemFDZ25QVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFQwOVBUMDlQVDA5UFNjcE8xeHVJQ0J5WlhRdWNIVnphQ2duTFMwdElDY2dLeUJrYVdabUxtOXNaRVpwYkdWT1lXMWxJQ3NnS0hSNWNHVnZaaUJrYVdabUxtOXNaRWhsWVdSbGNpQTlQVDBnSjNWdVpHVm1hVzVsWkNjZ1B5QW5KeUE2SUNkY1hIUW5JQ3NnWkdsbVppNXZiR1JJWldGa1pYSXBLVHRjYmlBZ2NtVjBMbkIxYzJnb0p5c3JLeUFuSUNzZ1pHbG1aaTV1WlhkR2FXeGxUbUZ0WlNBcklDaDBlWEJsYjJZZ1pHbG1aaTV1WlhkSVpXRmtaWElnUFQwOUlDZDFibVJsWm1sdVpXUW5JRDhnSnljZ09pQW5YRngwSnlBcklHUnBabVl1Ym1WM1NHVmhaR1Z5S1NrN1hHNWNiaUFnWm05eUlDaHNaWFFnYVNBOUlEQTdJR2tnUENCa2FXWm1MbWgxYm10ekxteGxibWQwYURzZ2FTc3JLU0I3WEc0Z0lDQWdZMjl1YzNRZ2FIVnVheUE5SUdScFptWXVhSFZ1YTNOYmFWMDdYRzRnSUNBZ0x5OGdWVzVwWm1sbFpDQkVhV1ptSUVadmNtMWhkQ0J4ZFdseWF6b2dTV1lnZEdobElHTm9kVzVySUhOcGVtVWdhWE1nTUN4Y2JpQWdJQ0F2THlCMGFHVWdabWx5YzNRZ2JuVnRZbVZ5SUdseklHOXVaU0JzYjNkbGNpQjBhR0Z1SUc5dVpTQjNiM1ZzWkNCbGVIQmxZM1F1WEc0Z0lDQWdMeThnYUhSMGNITTZMeTkzZDNjdVlYSjBhVzFoTG1OdmJTOTNaV0pzYjJkekwzWnBaWGR3YjNOMExtcHpjRDkwYUhKbFlXUTlNVFkwTWprelhHNGdJQ0FnYVdZZ0tHaDFibXN1YjJ4a1RHbHVaWE1nUFQwOUlEQXBJSHRjYmlBZ0lDQWdJR2gxYm1zdWIyeGtVM1JoY25RZ0xUMGdNVHRjYmlBZ0lDQjlYRzRnSUNBZ2FXWWdLR2gxYm1zdWJtVjNUR2x1WlhNZ1BUMDlJREFwSUh0Y2JpQWdJQ0FnSUdoMWJtc3VibVYzVTNSaGNuUWdMVDBnTVR0Y2JpQWdJQ0I5WEc0Z0lDQWdjbVYwTG5CMWMyZ29YRzRnSUNBZ0lDQW5RRUFnTFNjZ0t5Qm9kVzVyTG05c1pGTjBZWEowSUNzZ0p5d25JQ3NnYUhWdWF5NXZiR1JNYVc1bGMxeHVJQ0FnSUNBZ0t5QW5JQ3NuSUNzZ2FIVnVheTV1WlhkVGRHRnlkQ0FySUNjc0p5QXJJR2gxYm1zdWJtVjNUR2x1WlhOY2JpQWdJQ0FnSUNzZ0p5QkFRQ2RjYmlBZ0lDQXBPMXh1SUNBZ0lISmxkQzV3ZFhOb0xtRndjR3g1S0hKbGRDd2dhSFZ1YXk1c2FXNWxjeWs3WEc0Z0lIMWNibHh1SUNCeVpYUjFjbTRnY21WMExtcHZhVzRvSjF4Y2JpY3BJQ3NnSjF4Y2JpYzdYRzU5WEc1Y2JtVjRjRzl5ZENCbWRXNWpkR2x2YmlCamNtVmhkR1ZVZDI5R2FXeGxjMUJoZEdOb0tHOXNaRVpwYkdWT1lXMWxMQ0J1WlhkR2FXeGxUbUZ0WlN3Z2IyeGtVM1J5TENCdVpYZFRkSElzSUc5c1pFaGxZV1JsY2l3Z2JtVjNTR1ZoWkdWeUxDQnZjSFJwYjI1ektTQjdYRzRnSUhKbGRIVnliaUJtYjNKdFlYUlFZWFJqYUNoemRISjFZM1IxY21Wa1VHRjBZMmdvYjJ4a1JtbHNaVTVoYldVc0lHNWxkMFpwYkdWT1lXMWxMQ0J2YkdSVGRISXNJRzVsZDFOMGNpd2diMnhrU0dWaFpHVnlMQ0J1WlhkSVpXRmtaWElzSUc5d2RHbHZibk1wS1R0Y2JuMWNibHh1Wlhod2IzSjBJR1oxYm1OMGFXOXVJR055WldGMFpWQmhkR05vS0dacGJHVk9ZVzFsTENCdmJHUlRkSElzSUc1bGQxTjBjaXdnYjJ4a1NHVmhaR1Z5TENCdVpYZElaV0ZrWlhJc0lHOXdkR2x2Ym5NcElIdGNiaUFnY21WMGRYSnVJR055WldGMFpWUjNiMFpwYkdWelVHRjBZMmdvWm1sc1pVNWhiV1VzSUdacGJHVk9ZVzFsTENCdmJHUlRkSElzSUc1bGQxTjBjaXdnYjJ4a1NHVmhaR1Z5TENCdVpYZElaV0ZrWlhJc0lHOXdkR2x2Ym5NcE8xeHVmVnh1SWwxOVxuIiwiLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmNhbGNMaW5lQ291bnQgPSBjYWxjTGluZUNvdW50O1xuZXhwb3J0cy5tZXJnZSA9IG1lcmdlO1xuXG4vKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xudmFyXG4vKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG5fY3JlYXRlID0gcmVxdWlyZShcIi4vY3JlYXRlXCIpXG4vKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuO1xuXG52YXJcbi8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cbl9wYXJzZSA9IHJlcXVpcmUoXCIuL3BhcnNlXCIpXG4vKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuO1xuXG52YXJcbi8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cbl9hcnJheSA9IHJlcXVpcmUoXCIuLi91dGlsL2FycmF5XCIpXG4vKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuO1xuXG4vKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovIGZ1bmN0aW9uIF90b0NvbnN1bWFibGVBcnJheShhcnIpIHsgcmV0dXJuIF9hcnJheVdpdGhvdXRIb2xlcyhhcnIpIHx8IF9pdGVyYWJsZVRvQXJyYXkoYXJyKSB8fCBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkoYXJyKSB8fCBfbm9uSXRlcmFibGVTcHJlYWQoKTsgfVxuXG5mdW5jdGlvbiBfbm9uSXRlcmFibGVTcHJlYWQoKSB7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gc3ByZWFkIG5vbi1pdGVyYWJsZSBpbnN0YW5jZS5cXG5JbiBvcmRlciB0byBiZSBpdGVyYWJsZSwgbm9uLWFycmF5IG9iamVjdHMgbXVzdCBoYXZlIGEgW1N5bWJvbC5pdGVyYXRvcl0oKSBtZXRob2QuXCIpOyB9XG5cbmZ1bmN0aW9uIF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShvLCBtaW5MZW4pIHsgaWYgKCFvKSByZXR1cm47IGlmICh0eXBlb2YgbyA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7IHZhciBuID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pLnNsaWNlKDgsIC0xKTsgaWYgKG4gPT09IFwiT2JqZWN0XCIgJiYgby5jb25zdHJ1Y3RvcikgbiA9IG8uY29uc3RydWN0b3IubmFtZTsgaWYgKG4gPT09IFwiTWFwXCIgfHwgbiA9PT0gXCJTZXRcIikgcmV0dXJuIEFycmF5LmZyb20obyk7IGlmIChuID09PSBcIkFyZ3VtZW50c1wiIHx8IC9eKD86VWl8SSludCg/Ojh8MTZ8MzIpKD86Q2xhbXBlZCk/QXJyYXkkLy50ZXN0KG4pKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTsgfVxuXG5mdW5jdGlvbiBfaXRlcmFibGVUb0FycmF5KGl0ZXIpIHsgaWYgKHR5cGVvZiBTeW1ib2wgIT09IFwidW5kZWZpbmVkXCIgJiYgU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdChpdGVyKSkgcmV0dXJuIEFycmF5LmZyb20oaXRlcik7IH1cblxuZnVuY3Rpb24gX2FycmF5V2l0aG91dEhvbGVzKGFycikgeyBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkoYXJyKTsgfVxuXG5mdW5jdGlvbiBfYXJyYXlMaWtlVG9BcnJheShhcnIsIGxlbikgeyBpZiAobGVuID09IG51bGwgfHwgbGVuID4gYXJyLmxlbmd0aCkgbGVuID0gYXJyLmxlbmd0aDsgZm9yICh2YXIgaSA9IDAsIGFycjIgPSBuZXcgQXJyYXkobGVuKTsgaSA8IGxlbjsgaSsrKSB7IGFycjJbaV0gPSBhcnJbaV07IH0gcmV0dXJuIGFycjI7IH1cblxuLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbmZ1bmN0aW9uIGNhbGNMaW5lQ291bnQoaHVuaykge1xuICAvKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG4gIHZhciBfY2FsY09sZE5ld0xpbmVDb3VudCA9XG4gIC8qaXN0YW5idWwgaWdub3JlIGVuZCovXG4gIGNhbGNPbGROZXdMaW5lQ291bnQoaHVuay5saW5lcyksXG4gICAgICBvbGRMaW5lcyA9IF9jYWxjT2xkTmV3TGluZUNvdW50Lm9sZExpbmVzLFxuICAgICAgbmV3TGluZXMgPSBfY2FsY09sZE5ld0xpbmVDb3VudC5uZXdMaW5lcztcblxuICBpZiAob2xkTGluZXMgIT09IHVuZGVmaW5lZCkge1xuICAgIGh1bmsub2xkTGluZXMgPSBvbGRMaW5lcztcbiAgfSBlbHNlIHtcbiAgICBkZWxldGUgaHVuay5vbGRMaW5lcztcbiAgfVxuXG4gIGlmIChuZXdMaW5lcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgaHVuay5uZXdMaW5lcyA9IG5ld0xpbmVzO1xuICB9IGVsc2Uge1xuICAgIGRlbGV0ZSBodW5rLm5ld0xpbmVzO1xuICB9XG59XG5cbmZ1bmN0aW9uIG1lcmdlKG1pbmUsIHRoZWlycywgYmFzZSkge1xuICBtaW5lID0gbG9hZFBhdGNoKG1pbmUsIGJhc2UpO1xuICB0aGVpcnMgPSBsb2FkUGF0Y2godGhlaXJzLCBiYXNlKTtcbiAgdmFyIHJldCA9IHt9OyAvLyBGb3IgaW5kZXggd2UganVzdCBsZXQgaXQgcGFzcyB0aHJvdWdoIGFzIGl0IGRvZXNuJ3QgaGF2ZSBhbnkgbmVjZXNzYXJ5IG1lYW5pbmcuXG4gIC8vIExlYXZpbmcgc2FuaXR5IGNoZWNrcyBvbiB0aGlzIHRvIHRoZSBBUEkgY29uc3VtZXIgdGhhdCBtYXkga25vdyBtb3JlIGFib3V0IHRoZVxuICAvLyBtZWFuaW5nIGluIHRoZWlyIG93biBjb250ZXh0LlxuXG4gIGlmIChtaW5lLmluZGV4IHx8IHRoZWlycy5pbmRleCkge1xuICAgIHJldC5pbmRleCA9IG1pbmUuaW5kZXggfHwgdGhlaXJzLmluZGV4O1xuICB9XG5cbiAgaWYgKG1pbmUubmV3RmlsZU5hbWUgfHwgdGhlaXJzLm5ld0ZpbGVOYW1lKSB7XG4gICAgaWYgKCFmaWxlTmFtZUNoYW5nZWQobWluZSkpIHtcbiAgICAgIC8vIE5vIGhlYWRlciBvciBubyBjaGFuZ2UgaW4gb3VycywgdXNlIHRoZWlycyAoYW5kIG91cnMgaWYgdGhlaXJzIGRvZXMgbm90IGV4aXN0KVxuICAgICAgcmV0Lm9sZEZpbGVOYW1lID0gdGhlaXJzLm9sZEZpbGVOYW1lIHx8IG1pbmUub2xkRmlsZU5hbWU7XG4gICAgICByZXQubmV3RmlsZU5hbWUgPSB0aGVpcnMubmV3RmlsZU5hbWUgfHwgbWluZS5uZXdGaWxlTmFtZTtcbiAgICAgIHJldC5vbGRIZWFkZXIgPSB0aGVpcnMub2xkSGVhZGVyIHx8IG1pbmUub2xkSGVhZGVyO1xuICAgICAgcmV0Lm5ld0hlYWRlciA9IHRoZWlycy5uZXdIZWFkZXIgfHwgbWluZS5uZXdIZWFkZXI7XG4gICAgfSBlbHNlIGlmICghZmlsZU5hbWVDaGFuZ2VkKHRoZWlycykpIHtcbiAgICAgIC8vIE5vIGhlYWRlciBvciBubyBjaGFuZ2UgaW4gdGhlaXJzLCB1c2Ugb3Vyc1xuICAgICAgcmV0Lm9sZEZpbGVOYW1lID0gbWluZS5vbGRGaWxlTmFtZTtcbiAgICAgIHJldC5uZXdGaWxlTmFtZSA9IG1pbmUubmV3RmlsZU5hbWU7XG4gICAgICByZXQub2xkSGVhZGVyID0gbWluZS5vbGRIZWFkZXI7XG4gICAgICByZXQubmV3SGVhZGVyID0gbWluZS5uZXdIZWFkZXI7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEJvdGggY2hhbmdlZC4uLiBmaWd1cmUgaXQgb3V0XG4gICAgICByZXQub2xkRmlsZU5hbWUgPSBzZWxlY3RGaWVsZChyZXQsIG1pbmUub2xkRmlsZU5hbWUsIHRoZWlycy5vbGRGaWxlTmFtZSk7XG4gICAgICByZXQubmV3RmlsZU5hbWUgPSBzZWxlY3RGaWVsZChyZXQsIG1pbmUubmV3RmlsZU5hbWUsIHRoZWlycy5uZXdGaWxlTmFtZSk7XG4gICAgICByZXQub2xkSGVhZGVyID0gc2VsZWN0RmllbGQocmV0LCBtaW5lLm9sZEhlYWRlciwgdGhlaXJzLm9sZEhlYWRlcik7XG4gICAgICByZXQubmV3SGVhZGVyID0gc2VsZWN0RmllbGQocmV0LCBtaW5lLm5ld0hlYWRlciwgdGhlaXJzLm5ld0hlYWRlcik7XG4gICAgfVxuICB9XG5cbiAgcmV0Lmh1bmtzID0gW107XG4gIHZhciBtaW5lSW5kZXggPSAwLFxuICAgICAgdGhlaXJzSW5kZXggPSAwLFxuICAgICAgbWluZU9mZnNldCA9IDAsXG4gICAgICB0aGVpcnNPZmZzZXQgPSAwO1xuXG4gIHdoaWxlIChtaW5lSW5kZXggPCBtaW5lLmh1bmtzLmxlbmd0aCB8fCB0aGVpcnNJbmRleCA8IHRoZWlycy5odW5rcy5sZW5ndGgpIHtcbiAgICB2YXIgbWluZUN1cnJlbnQgPSBtaW5lLmh1bmtzW21pbmVJbmRleF0gfHwge1xuICAgICAgb2xkU3RhcnQ6IEluZmluaXR5XG4gICAgfSxcbiAgICAgICAgdGhlaXJzQ3VycmVudCA9IHRoZWlycy5odW5rc1t0aGVpcnNJbmRleF0gfHwge1xuICAgICAgb2xkU3RhcnQ6IEluZmluaXR5XG4gICAgfTtcblxuICAgIGlmIChodW5rQmVmb3JlKG1pbmVDdXJyZW50LCB0aGVpcnNDdXJyZW50KSkge1xuICAgICAgLy8gVGhpcyBwYXRjaCBkb2VzIG5vdCBvdmVybGFwIHdpdGggYW55IG9mIHRoZSBvdGhlcnMsIHlheS5cbiAgICAgIHJldC5odW5rcy5wdXNoKGNsb25lSHVuayhtaW5lQ3VycmVudCwgbWluZU9mZnNldCkpO1xuICAgICAgbWluZUluZGV4Kys7XG4gICAgICB0aGVpcnNPZmZzZXQgKz0gbWluZUN1cnJlbnQubmV3TGluZXMgLSBtaW5lQ3VycmVudC5vbGRMaW5lcztcbiAgICB9IGVsc2UgaWYgKGh1bmtCZWZvcmUodGhlaXJzQ3VycmVudCwgbWluZUN1cnJlbnQpKSB7XG4gICAgICAvLyBUaGlzIHBhdGNoIGRvZXMgbm90IG92ZXJsYXAgd2l0aCBhbnkgb2YgdGhlIG90aGVycywgeWF5LlxuICAgICAgcmV0Lmh1bmtzLnB1c2goY2xvbmVIdW5rKHRoZWlyc0N1cnJlbnQsIHRoZWlyc09mZnNldCkpO1xuICAgICAgdGhlaXJzSW5kZXgrKztcbiAgICAgIG1pbmVPZmZzZXQgKz0gdGhlaXJzQ3VycmVudC5uZXdMaW5lcyAtIHRoZWlyc0N1cnJlbnQub2xkTGluZXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIE92ZXJsYXAsIG1lcmdlIGFzIGJlc3Qgd2UgY2FuXG4gICAgICB2YXIgbWVyZ2VkSHVuayA9IHtcbiAgICAgICAgb2xkU3RhcnQ6IE1hdGgubWluKG1pbmVDdXJyZW50Lm9sZFN0YXJ0LCB0aGVpcnNDdXJyZW50Lm9sZFN0YXJ0KSxcbiAgICAgICAgb2xkTGluZXM6IDAsXG4gICAgICAgIG5ld1N0YXJ0OiBNYXRoLm1pbihtaW5lQ3VycmVudC5uZXdTdGFydCArIG1pbmVPZmZzZXQsIHRoZWlyc0N1cnJlbnQub2xkU3RhcnQgKyB0aGVpcnNPZmZzZXQpLFxuICAgICAgICBuZXdMaW5lczogMCxcbiAgICAgICAgbGluZXM6IFtdXG4gICAgICB9O1xuICAgICAgbWVyZ2VMaW5lcyhtZXJnZWRIdW5rLCBtaW5lQ3VycmVudC5vbGRTdGFydCwgbWluZUN1cnJlbnQubGluZXMsIHRoZWlyc0N1cnJlbnQub2xkU3RhcnQsIHRoZWlyc0N1cnJlbnQubGluZXMpO1xuICAgICAgdGhlaXJzSW5kZXgrKztcbiAgICAgIG1pbmVJbmRleCsrO1xuICAgICAgcmV0Lmh1bmtzLnB1c2gobWVyZ2VkSHVuayk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJldDtcbn1cblxuZnVuY3Rpb24gbG9hZFBhdGNoKHBhcmFtLCBiYXNlKSB7XG4gIGlmICh0eXBlb2YgcGFyYW0gPT09ICdzdHJpbmcnKSB7XG4gICAgaWYgKC9eQEAvbS50ZXN0KHBhcmFtKSB8fCAvXkluZGV4Oi9tLnRlc3QocGFyYW0pKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICAvKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG4gICAgICAgICgwLFxuICAgICAgICAvKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuXG4gICAgICAgIC8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cbiAgICAgICAgX3BhcnNlXG4gICAgICAgIC8qaXN0YW5idWwgaWdub3JlIGVuZCovXG4gICAgICAgIC5cbiAgICAgICAgLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuICAgICAgICBwYXJzZVBhdGNoKVxuICAgICAgICAvKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuICAgICAgICAocGFyYW0pWzBdXG4gICAgICApO1xuICAgIH1cblxuICAgIGlmICghYmFzZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdNdXN0IHByb3ZpZGUgYSBiYXNlIHJlZmVyZW5jZSBvciBwYXNzIGluIGEgcGF0Y2gnKTtcbiAgICB9XG5cbiAgICByZXR1cm4gKFxuICAgICAgLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuICAgICAgKDAsXG4gICAgICAvKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuXG4gICAgICAvKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG4gICAgICBfY3JlYXRlXG4gICAgICAvKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuICAgICAgLlxuICAgICAgLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuICAgICAgc3RydWN0dXJlZFBhdGNoKVxuICAgICAgLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbiAgICAgICh1bmRlZmluZWQsIHVuZGVmaW5lZCwgYmFzZSwgcGFyYW0pXG4gICAgKTtcbiAgfVxuXG4gIHJldHVybiBwYXJhbTtcbn1cblxuZnVuY3Rpb24gZmlsZU5hbWVDaGFuZ2VkKHBhdGNoKSB7XG4gIHJldHVybiBwYXRjaC5uZXdGaWxlTmFtZSAmJiBwYXRjaC5uZXdGaWxlTmFtZSAhPT0gcGF0Y2gub2xkRmlsZU5hbWU7XG59XG5cbmZ1bmN0aW9uIHNlbGVjdEZpZWxkKGluZGV4LCBtaW5lLCB0aGVpcnMpIHtcbiAgaWYgKG1pbmUgPT09IHRoZWlycykge1xuICAgIHJldHVybiBtaW5lO1xuICB9IGVsc2Uge1xuICAgIGluZGV4LmNvbmZsaWN0ID0gdHJ1ZTtcbiAgICByZXR1cm4ge1xuICAgICAgbWluZTogbWluZSxcbiAgICAgIHRoZWlyczogdGhlaXJzXG4gICAgfTtcbiAgfVxufVxuXG5mdW5jdGlvbiBodW5rQmVmb3JlKHRlc3QsIGNoZWNrKSB7XG4gIHJldHVybiB0ZXN0Lm9sZFN0YXJ0IDwgY2hlY2sub2xkU3RhcnQgJiYgdGVzdC5vbGRTdGFydCArIHRlc3Qub2xkTGluZXMgPCBjaGVjay5vbGRTdGFydDtcbn1cblxuZnVuY3Rpb24gY2xvbmVIdW5rKGh1bmssIG9mZnNldCkge1xuICByZXR1cm4ge1xuICAgIG9sZFN0YXJ0OiBodW5rLm9sZFN0YXJ0LFxuICAgIG9sZExpbmVzOiBodW5rLm9sZExpbmVzLFxuICAgIG5ld1N0YXJ0OiBodW5rLm5ld1N0YXJ0ICsgb2Zmc2V0LFxuICAgIG5ld0xpbmVzOiBodW5rLm5ld0xpbmVzLFxuICAgIGxpbmVzOiBodW5rLmxpbmVzXG4gIH07XG59XG5cbmZ1bmN0aW9uIG1lcmdlTGluZXMoaHVuaywgbWluZU9mZnNldCwgbWluZUxpbmVzLCB0aGVpck9mZnNldCwgdGhlaXJMaW5lcykge1xuICAvLyBUaGlzIHdpbGwgZ2VuZXJhbGx5IHJlc3VsdCBpbiBhIGNvbmZsaWN0ZWQgaHVuaywgYnV0IHRoZXJlIGFyZSBjYXNlcyB3aGVyZSB0aGUgY29udGV4dFxuICAvLyBpcyB0aGUgb25seSBvdmVybGFwIHdoZXJlIHdlIGNhbiBzdWNjZXNzZnVsbHkgbWVyZ2UgdGhlIGNvbnRlbnQgaGVyZS5cbiAgdmFyIG1pbmUgPSB7XG4gICAgb2Zmc2V0OiBtaW5lT2Zmc2V0LFxuICAgIGxpbmVzOiBtaW5lTGluZXMsXG4gICAgaW5kZXg6IDBcbiAgfSxcbiAgICAgIHRoZWlyID0ge1xuICAgIG9mZnNldDogdGhlaXJPZmZzZXQsXG4gICAgbGluZXM6IHRoZWlyTGluZXMsXG4gICAgaW5kZXg6IDBcbiAgfTsgLy8gSGFuZGxlIGFueSBsZWFkaW5nIGNvbnRlbnRcblxuICBpbnNlcnRMZWFkaW5nKGh1bmssIG1pbmUsIHRoZWlyKTtcbiAgaW5zZXJ0TGVhZGluZyhodW5rLCB0aGVpciwgbWluZSk7IC8vIE5vdyBpbiB0aGUgb3ZlcmxhcCBjb250ZW50LiBTY2FuIHRocm91Z2ggYW5kIHNlbGVjdCB0aGUgYmVzdCBjaGFuZ2VzIGZyb20gZWFjaC5cblxuICB3aGlsZSAobWluZS5pbmRleCA8IG1pbmUubGluZXMubGVuZ3RoICYmIHRoZWlyLmluZGV4IDwgdGhlaXIubGluZXMubGVuZ3RoKSB7XG4gICAgdmFyIG1pbmVDdXJyZW50ID0gbWluZS5saW5lc1ttaW5lLmluZGV4XSxcbiAgICAgICAgdGhlaXJDdXJyZW50ID0gdGhlaXIubGluZXNbdGhlaXIuaW5kZXhdO1xuXG4gICAgaWYgKChtaW5lQ3VycmVudFswXSA9PT0gJy0nIHx8IG1pbmVDdXJyZW50WzBdID09PSAnKycpICYmICh0aGVpckN1cnJlbnRbMF0gPT09ICctJyB8fCB0aGVpckN1cnJlbnRbMF0gPT09ICcrJykpIHtcbiAgICAgIC8vIEJvdGggbW9kaWZpZWQgLi4uXG4gICAgICBtdXR1YWxDaGFuZ2UoaHVuaywgbWluZSwgdGhlaXIpO1xuICAgIH0gZWxzZSBpZiAobWluZUN1cnJlbnRbMF0gPT09ICcrJyAmJiB0aGVpckN1cnJlbnRbMF0gPT09ICcgJykge1xuICAgICAgLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuICAgICAgdmFyIF9odW5rJGxpbmVzO1xuXG4gICAgICAvKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuICAgICAgLy8gTWluZSBpbnNlcnRlZFxuXG4gICAgICAvKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG5cbiAgICAgIC8qaXN0YW5idWwgaWdub3JlIGVuZCovXG5cbiAgICAgIC8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cbiAgICAgIChfaHVuayRsaW5lcyA9XG4gICAgICAvKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuICAgICAgaHVuay5saW5lcykucHVzaC5hcHBseShcbiAgICAgIC8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cbiAgICAgIF9odW5rJGxpbmVzXG4gICAgICAvKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuICAgICAgLFxuICAgICAgLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuICAgICAgX3RvQ29uc3VtYWJsZUFycmF5KFxuICAgICAgLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbiAgICAgIGNvbGxlY3RDaGFuZ2UobWluZSkpKTtcbiAgICB9IGVsc2UgaWYgKHRoZWlyQ3VycmVudFswXSA9PT0gJysnICYmIG1pbmVDdXJyZW50WzBdID09PSAnICcpIHtcbiAgICAgIC8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cbiAgICAgIHZhciBfaHVuayRsaW5lczI7XG5cbiAgICAgIC8qaXN0YW5idWwgaWdub3JlIGVuZCovXG4gICAgICAvLyBUaGVpcnMgaW5zZXJ0ZWRcblxuICAgICAgLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuXG4gICAgICAvKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuXG4gICAgICAvKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG4gICAgICAoX2h1bmskbGluZXMyID1cbiAgICAgIC8qaXN0YW5idWwgaWdub3JlIGVuZCovXG4gICAgICBodW5rLmxpbmVzKS5wdXNoLmFwcGx5KFxuICAgICAgLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuICAgICAgX2h1bmskbGluZXMyXG4gICAgICAvKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuICAgICAgLFxuICAgICAgLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuICAgICAgX3RvQ29uc3VtYWJsZUFycmF5KFxuICAgICAgLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbiAgICAgIGNvbGxlY3RDaGFuZ2UodGhlaXIpKSk7XG4gICAgfSBlbHNlIGlmIChtaW5lQ3VycmVudFswXSA9PT0gJy0nICYmIHRoZWlyQ3VycmVudFswXSA9PT0gJyAnKSB7XG4gICAgICAvLyBNaW5lIHJlbW92ZWQgb3IgZWRpdGVkXG4gICAgICByZW1vdmFsKGh1bmssIG1pbmUsIHRoZWlyKTtcbiAgICB9IGVsc2UgaWYgKHRoZWlyQ3VycmVudFswXSA9PT0gJy0nICYmIG1pbmVDdXJyZW50WzBdID09PSAnICcpIHtcbiAgICAgIC8vIFRoZWlyIHJlbW92ZWQgb3IgZWRpdGVkXG4gICAgICByZW1vdmFsKGh1bmssIHRoZWlyLCBtaW5lLCB0cnVlKTtcbiAgICB9IGVsc2UgaWYgKG1pbmVDdXJyZW50ID09PSB0aGVpckN1cnJlbnQpIHtcbiAgICAgIC8vIENvbnRleHQgaWRlbnRpdHlcbiAgICAgIGh1bmsubGluZXMucHVzaChtaW5lQ3VycmVudCk7XG4gICAgICBtaW5lLmluZGV4Kys7XG4gICAgICB0aGVpci5pbmRleCsrO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBDb250ZXh0IG1pc21hdGNoXG4gICAgICBjb25mbGljdChodW5rLCBjb2xsZWN0Q2hhbmdlKG1pbmUpLCBjb2xsZWN0Q2hhbmdlKHRoZWlyKSk7XG4gICAgfVxuICB9IC8vIE5vdyBwdXNoIGFueXRoaW5nIHRoYXQgbWF5IGJlIHJlbWFpbmluZ1xuXG5cbiAgaW5zZXJ0VHJhaWxpbmcoaHVuaywgbWluZSk7XG4gIGluc2VydFRyYWlsaW5nKGh1bmssIHRoZWlyKTtcbiAgY2FsY0xpbmVDb3VudChodW5rKTtcbn1cblxuZnVuY3Rpb24gbXV0dWFsQ2hhbmdlKGh1bmssIG1pbmUsIHRoZWlyKSB7XG4gIHZhciBteUNoYW5nZXMgPSBjb2xsZWN0Q2hhbmdlKG1pbmUpLFxuICAgICAgdGhlaXJDaGFuZ2VzID0gY29sbGVjdENoYW5nZSh0aGVpcik7XG5cbiAgaWYgKGFsbFJlbW92ZXMobXlDaGFuZ2VzKSAmJiBhbGxSZW1vdmVzKHRoZWlyQ2hhbmdlcykpIHtcbiAgICAvLyBTcGVjaWFsIGNhc2UgZm9yIHJlbW92ZSBjaGFuZ2VzIHRoYXQgYXJlIHN1cGVyc2V0cyBvZiBvbmUgYW5vdGhlclxuICAgIGlmIChcbiAgICAvKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG4gICAgKDAsXG4gICAgLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cblxuICAgIC8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cbiAgICBfYXJyYXlcbiAgICAvKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuICAgIC5cbiAgICAvKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG4gICAgYXJyYXlTdGFydHNXaXRoKVxuICAgIC8qaXN0YW5idWwgaWdub3JlIGVuZCovXG4gICAgKG15Q2hhbmdlcywgdGhlaXJDaGFuZ2VzKSAmJiBza2lwUmVtb3ZlU3VwZXJzZXQodGhlaXIsIG15Q2hhbmdlcywgbXlDaGFuZ2VzLmxlbmd0aCAtIHRoZWlyQ2hhbmdlcy5sZW5ndGgpKSB7XG4gICAgICAvKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG4gICAgICB2YXIgX2h1bmskbGluZXMzO1xuXG4gICAgICAvKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuXG4gICAgICAvKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG5cbiAgICAgIC8qaXN0YW5idWwgaWdub3JlIGVuZCovXG5cbiAgICAgIC8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cbiAgICAgIChfaHVuayRsaW5lczMgPVxuICAgICAgLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbiAgICAgIGh1bmsubGluZXMpLnB1c2guYXBwbHkoXG4gICAgICAvKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG4gICAgICBfaHVuayRsaW5lczNcbiAgICAgIC8qaXN0YW5idWwgaWdub3JlIGVuZCovXG4gICAgICAsXG4gICAgICAvKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG4gICAgICBfdG9Db25zdW1hYmxlQXJyYXkoXG4gICAgICAvKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuICAgICAgbXlDaGFuZ2VzKSk7XG5cbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2UgaWYgKFxuICAgIC8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cbiAgICAoMCxcbiAgICAvKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuXG4gICAgLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuICAgIF9hcnJheVxuICAgIC8qaXN0YW5idWwgaWdub3JlIGVuZCovXG4gICAgLlxuICAgIC8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cbiAgICBhcnJheVN0YXJ0c1dpdGgpXG4gICAgLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbiAgICAodGhlaXJDaGFuZ2VzLCBteUNoYW5nZXMpICYmIHNraXBSZW1vdmVTdXBlcnNldChtaW5lLCB0aGVpckNoYW5nZXMsIHRoZWlyQ2hhbmdlcy5sZW5ndGggLSBteUNoYW5nZXMubGVuZ3RoKSkge1xuICAgICAgLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuICAgICAgdmFyIF9odW5rJGxpbmVzNDtcblxuICAgICAgLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cblxuICAgICAgLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuXG4gICAgICAvKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuXG4gICAgICAvKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG4gICAgICAoX2h1bmskbGluZXM0ID1cbiAgICAgIC8qaXN0YW5idWwgaWdub3JlIGVuZCovXG4gICAgICBodW5rLmxpbmVzKS5wdXNoLmFwcGx5KFxuICAgICAgLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuICAgICAgX2h1bmskbGluZXM0XG4gICAgICAvKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuICAgICAgLFxuICAgICAgLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuICAgICAgX3RvQ29uc3VtYWJsZUFycmF5KFxuICAgICAgLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbiAgICAgIHRoZWlyQ2hhbmdlcykpO1xuXG4gICAgICByZXR1cm47XG4gICAgfVxuICB9IGVsc2UgaWYgKFxuICAvKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG4gICgwLFxuICAvKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuXG4gIC8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cbiAgX2FycmF5XG4gIC8qaXN0YW5idWwgaWdub3JlIGVuZCovXG4gIC5cbiAgLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuICBhcnJheUVxdWFsKVxuICAvKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuICAobXlDaGFuZ2VzLCB0aGVpckNoYW5nZXMpKSB7XG4gICAgLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuICAgIHZhciBfaHVuayRsaW5lczU7XG5cbiAgICAvKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuXG4gICAgLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuXG4gICAgLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cblxuICAgIC8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cbiAgICAoX2h1bmskbGluZXM1ID1cbiAgICAvKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuICAgIGh1bmsubGluZXMpLnB1c2guYXBwbHkoXG4gICAgLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuICAgIF9odW5rJGxpbmVzNVxuICAgIC8qaXN0YW5idWwgaWdub3JlIGVuZCovXG4gICAgLFxuICAgIC8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cbiAgICBfdG9Db25zdW1hYmxlQXJyYXkoXG4gICAgLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbiAgICBteUNoYW5nZXMpKTtcblxuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbmZsaWN0KGh1bmssIG15Q2hhbmdlcywgdGhlaXJDaGFuZ2VzKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZhbChodW5rLCBtaW5lLCB0aGVpciwgc3dhcCkge1xuICB2YXIgbXlDaGFuZ2VzID0gY29sbGVjdENoYW5nZShtaW5lKSxcbiAgICAgIHRoZWlyQ2hhbmdlcyA9IGNvbGxlY3RDb250ZXh0KHRoZWlyLCBteUNoYW5nZXMpO1xuXG4gIGlmICh0aGVpckNoYW5nZXMubWVyZ2VkKSB7XG4gICAgLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuICAgIHZhciBfaHVuayRsaW5lczY7XG5cbiAgICAvKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuXG4gICAgLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuXG4gICAgLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cblxuICAgIC8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cbiAgICAoX2h1bmskbGluZXM2ID1cbiAgICAvKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuICAgIGh1bmsubGluZXMpLnB1c2guYXBwbHkoXG4gICAgLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuICAgIF9odW5rJGxpbmVzNlxuICAgIC8qaXN0YW5idWwgaWdub3JlIGVuZCovXG4gICAgLFxuICAgIC8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cbiAgICBfdG9Db25zdW1hYmxlQXJyYXkoXG4gICAgLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbiAgICB0aGVpckNoYW5nZXMubWVyZ2VkKSk7XG4gIH0gZWxzZSB7XG4gICAgY29uZmxpY3QoaHVuaywgc3dhcCA/IHRoZWlyQ2hhbmdlcyA6IG15Q2hhbmdlcywgc3dhcCA/IG15Q2hhbmdlcyA6IHRoZWlyQ2hhbmdlcyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY29uZmxpY3QoaHVuaywgbWluZSwgdGhlaXIpIHtcbiAgaHVuay5jb25mbGljdCA9IHRydWU7XG4gIGh1bmsubGluZXMucHVzaCh7XG4gICAgY29uZmxpY3Q6IHRydWUsXG4gICAgbWluZTogbWluZSxcbiAgICB0aGVpcnM6IHRoZWlyXG4gIH0pO1xufVxuXG5mdW5jdGlvbiBpbnNlcnRMZWFkaW5nKGh1bmssIGluc2VydCwgdGhlaXIpIHtcbiAgd2hpbGUgKGluc2VydC5vZmZzZXQgPCB0aGVpci5vZmZzZXQgJiYgaW5zZXJ0LmluZGV4IDwgaW5zZXJ0LmxpbmVzLmxlbmd0aCkge1xuICAgIHZhciBsaW5lID0gaW5zZXJ0LmxpbmVzW2luc2VydC5pbmRleCsrXTtcbiAgICBodW5rLmxpbmVzLnB1c2gobGluZSk7XG4gICAgaW5zZXJ0Lm9mZnNldCsrO1xuICB9XG59XG5cbmZ1bmN0aW9uIGluc2VydFRyYWlsaW5nKGh1bmssIGluc2VydCkge1xuICB3aGlsZSAoaW5zZXJ0LmluZGV4IDwgaW5zZXJ0LmxpbmVzLmxlbmd0aCkge1xuICAgIHZhciBsaW5lID0gaW5zZXJ0LmxpbmVzW2luc2VydC5pbmRleCsrXTtcbiAgICBodW5rLmxpbmVzLnB1c2gobGluZSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gY29sbGVjdENoYW5nZShzdGF0ZSkge1xuICB2YXIgcmV0ID0gW10sXG4gICAgICBvcGVyYXRpb24gPSBzdGF0ZS5saW5lc1tzdGF0ZS5pbmRleF1bMF07XG5cbiAgd2hpbGUgKHN0YXRlLmluZGV4IDwgc3RhdGUubGluZXMubGVuZ3RoKSB7XG4gICAgdmFyIGxpbmUgPSBzdGF0ZS5saW5lc1tzdGF0ZS5pbmRleF07IC8vIEdyb3VwIGFkZGl0aW9ucyB0aGF0IGFyZSBpbW1lZGlhdGVseSBhZnRlciBzdWJ0cmFjdGlvbnMgYW5kIHRyZWF0IHRoZW0gYXMgb25lIFwiYXRvbWljXCIgbW9kaWZ5IGNoYW5nZS5cblxuICAgIGlmIChvcGVyYXRpb24gPT09ICctJyAmJiBsaW5lWzBdID09PSAnKycpIHtcbiAgICAgIG9wZXJhdGlvbiA9ICcrJztcbiAgICB9XG5cbiAgICBpZiAob3BlcmF0aW9uID09PSBsaW5lWzBdKSB7XG4gICAgICByZXQucHVzaChsaW5lKTtcbiAgICAgIHN0YXRlLmluZGV4Kys7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXQ7XG59XG5cbmZ1bmN0aW9uIGNvbGxlY3RDb250ZXh0KHN0YXRlLCBtYXRjaENoYW5nZXMpIHtcbiAgdmFyIGNoYW5nZXMgPSBbXSxcbiAgICAgIG1lcmdlZCA9IFtdLFxuICAgICAgbWF0Y2hJbmRleCA9IDAsXG4gICAgICBjb250ZXh0Q2hhbmdlcyA9IGZhbHNlLFxuICAgICAgY29uZmxpY3RlZCA9IGZhbHNlO1xuXG4gIHdoaWxlIChtYXRjaEluZGV4IDwgbWF0Y2hDaGFuZ2VzLmxlbmd0aCAmJiBzdGF0ZS5pbmRleCA8IHN0YXRlLmxpbmVzLmxlbmd0aCkge1xuICAgIHZhciBjaGFuZ2UgPSBzdGF0ZS5saW5lc1tzdGF0ZS5pbmRleF0sXG4gICAgICAgIG1hdGNoID0gbWF0Y2hDaGFuZ2VzW21hdGNoSW5kZXhdOyAvLyBPbmNlIHdlJ3ZlIGhpdCBvdXIgYWRkLCB0aGVuIHdlIGFyZSBkb25lXG5cbiAgICBpZiAobWF0Y2hbMF0gPT09ICcrJykge1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgY29udGV4dENoYW5nZXMgPSBjb250ZXh0Q2hhbmdlcyB8fCBjaGFuZ2VbMF0gIT09ICcgJztcbiAgICBtZXJnZWQucHVzaChtYXRjaCk7XG4gICAgbWF0Y2hJbmRleCsrOyAvLyBDb25zdW1lIGFueSBhZGRpdGlvbnMgaW4gdGhlIG90aGVyIGJsb2NrIGFzIGEgY29uZmxpY3QgdG8gYXR0ZW1wdFxuICAgIC8vIHRvIHB1bGwgaW4gdGhlIHJlbWFpbmluZyBjb250ZXh0IGFmdGVyIHRoaXNcblxuICAgIGlmIChjaGFuZ2VbMF0gPT09ICcrJykge1xuICAgICAgY29uZmxpY3RlZCA9IHRydWU7XG5cbiAgICAgIHdoaWxlIChjaGFuZ2VbMF0gPT09ICcrJykge1xuICAgICAgICBjaGFuZ2VzLnB1c2goY2hhbmdlKTtcbiAgICAgICAgY2hhbmdlID0gc3RhdGUubGluZXNbKytzdGF0ZS5pbmRleF07XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG1hdGNoLnN1YnN0cigxKSA9PT0gY2hhbmdlLnN1YnN0cigxKSkge1xuICAgICAgY2hhbmdlcy5wdXNoKGNoYW5nZSk7XG4gICAgICBzdGF0ZS5pbmRleCsrO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25mbGljdGVkID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBpZiAoKG1hdGNoQ2hhbmdlc1ttYXRjaEluZGV4XSB8fCAnJylbMF0gPT09ICcrJyAmJiBjb250ZXh0Q2hhbmdlcykge1xuICAgIGNvbmZsaWN0ZWQgPSB0cnVlO1xuICB9XG5cbiAgaWYgKGNvbmZsaWN0ZWQpIHtcbiAgICByZXR1cm4gY2hhbmdlcztcbiAgfVxuXG4gIHdoaWxlIChtYXRjaEluZGV4IDwgbWF0Y2hDaGFuZ2VzLmxlbmd0aCkge1xuICAgIG1lcmdlZC5wdXNoKG1hdGNoQ2hhbmdlc1ttYXRjaEluZGV4KytdKTtcbiAgfVxuXG4gIHJldHVybiB7XG4gICAgbWVyZ2VkOiBtZXJnZWQsXG4gICAgY2hhbmdlczogY2hhbmdlc1xuICB9O1xufVxuXG5mdW5jdGlvbiBhbGxSZW1vdmVzKGNoYW5nZXMpIHtcbiAgcmV0dXJuIGNoYW5nZXMucmVkdWNlKGZ1bmN0aW9uIChwcmV2LCBjaGFuZ2UpIHtcbiAgICByZXR1cm4gcHJldiAmJiBjaGFuZ2VbMF0gPT09ICctJztcbiAgfSwgdHJ1ZSk7XG59XG5cbmZ1bmN0aW9uIHNraXBSZW1vdmVTdXBlcnNldChzdGF0ZSwgcmVtb3ZlQ2hhbmdlcywgZGVsdGEpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBkZWx0YTsgaSsrKSB7XG4gICAgdmFyIGNoYW5nZUNvbnRlbnQgPSByZW1vdmVDaGFuZ2VzW3JlbW92ZUNoYW5nZXMubGVuZ3RoIC0gZGVsdGEgKyBpXS5zdWJzdHIoMSk7XG5cbiAgICBpZiAoc3RhdGUubGluZXNbc3RhdGUuaW5kZXggKyBpXSAhPT0gJyAnICsgY2hhbmdlQ29udGVudCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRlLmluZGV4ICs9IGRlbHRhO1xuICByZXR1cm4gdHJ1ZTtcbn1cblxuZnVuY3Rpb24gY2FsY09sZE5ld0xpbmVDb3VudChsaW5lcykge1xuICB2YXIgb2xkTGluZXMgPSAwO1xuICB2YXIgbmV3TGluZXMgPSAwO1xuICBsaW5lcy5mb3JFYWNoKGZ1bmN0aW9uIChsaW5lKSB7XG4gICAgaWYgKHR5cGVvZiBsaW5lICE9PSAnc3RyaW5nJykge1xuICAgICAgdmFyIG15Q291bnQgPSBjYWxjT2xkTmV3TGluZUNvdW50KGxpbmUubWluZSk7XG4gICAgICB2YXIgdGhlaXJDb3VudCA9IGNhbGNPbGROZXdMaW5lQ291bnQobGluZS50aGVpcnMpO1xuXG4gICAgICBpZiAob2xkTGluZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAobXlDb3VudC5vbGRMaW5lcyA9PT0gdGhlaXJDb3VudC5vbGRMaW5lcykge1xuICAgICAgICAgIG9sZExpbmVzICs9IG15Q291bnQub2xkTGluZXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgb2xkTGluZXMgPSB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKG5ld0xpbmVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgaWYgKG15Q291bnQubmV3TGluZXMgPT09IHRoZWlyQ291bnQubmV3TGluZXMpIHtcbiAgICAgICAgICBuZXdMaW5lcyArPSBteUNvdW50Lm5ld0xpbmVzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG5ld0xpbmVzID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChuZXdMaW5lcyAhPT0gdW5kZWZpbmVkICYmIChsaW5lWzBdID09PSAnKycgfHwgbGluZVswXSA9PT0gJyAnKSkge1xuICAgICAgICBuZXdMaW5lcysrO1xuICAgICAgfVxuXG4gICAgICBpZiAob2xkTGluZXMgIT09IHVuZGVmaW5lZCAmJiAobGluZVswXSA9PT0gJy0nIHx8IGxpbmVbMF0gPT09ICcgJykpIHtcbiAgICAgICAgb2xkTGluZXMrKztcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuICByZXR1cm4ge1xuICAgIG9sZExpbmVzOiBvbGRMaW5lcyxcbiAgICBuZXdMaW5lczogbmV3TGluZXNcbiAgfTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OXdZWFJqYUM5dFpYSm5aUzVxY3lKZExDSnVZVzFsY3lJNld5SmpZV3hqVEdsdVpVTnZkVzUwSWl3aWFIVnVheUlzSW1OaGJHTlBiR1JPWlhkTWFXNWxRMjkxYm5RaUxDSnNhVzVsY3lJc0ltOXNaRXhwYm1Weklpd2libVYzVEdsdVpYTWlMQ0oxYm1SbFptbHVaV1FpTENKdFpYSm5aU0lzSW0xcGJtVWlMQ0owYUdWcGNuTWlMQ0ppWVhObElpd2liRzloWkZCaGRHTm9JaXdpY21WMElpd2lhVzVrWlhnaUxDSnVaWGRHYVd4bFRtRnRaU0lzSW1acGJHVk9ZVzFsUTJoaGJtZGxaQ0lzSW05c1pFWnBiR1ZPWVcxbElpd2liMnhrU0dWaFpHVnlJaXdpYm1WM1NHVmhaR1Z5SWl3aWMyVnNaV04wUm1sbGJHUWlMQ0pvZFc1cmN5SXNJbTFwYm1WSmJtUmxlQ0lzSW5Sb1pXbHljMGx1WkdWNElpd2liV2x1WlU5bVpuTmxkQ0lzSW5Sb1pXbHljMDltWm5ObGRDSXNJbXhsYm1kMGFDSXNJbTFwYm1WRGRYSnlaVzUwSWl3aWIyeGtVM1JoY25RaUxDSkpibVpwYm1sMGVTSXNJblJvWldseWMwTjFjbkpsYm5RaUxDSm9kVzVyUW1WbWIzSmxJaXdpY0hWemFDSXNJbU5zYjI1bFNIVnVheUlzSW0xbGNtZGxaRWgxYm1zaUxDSk5ZWFJvSWl3aWJXbHVJaXdpYm1WM1UzUmhjblFpTENKdFpYSm5aVXhwYm1Weklpd2ljR0Z5WVcwaUxDSjBaWE4wSWl3aWNHRnljMlZRWVhSamFDSXNJa1Z5Y205eUlpd2ljM1J5ZFdOMGRYSmxaRkJoZEdOb0lpd2ljR0YwWTJnaUxDSmpiMjVtYkdsamRDSXNJbU5vWldOcklpd2liMlptYzJWMElpd2liV2x1WlV4cGJtVnpJaXdpZEdobGFYSlBabVp6WlhRaUxDSjBhR1ZwY2t4cGJtVnpJaXdpZEdobGFYSWlMQ0pwYm5ObGNuUk1aV0ZrYVc1bklpd2lkR2hsYVhKRGRYSnlaVzUwSWl3aWJYVjBkV0ZzUTJoaGJtZGxJaXdpWTI5c2JHVmpkRU5vWVc1blpTSXNJbkpsYlc5MllXd2lMQ0pwYm5ObGNuUlVjbUZwYkdsdVp5SXNJbTE1UTJoaGJtZGxjeUlzSW5Sb1pXbHlRMmhoYm1kbGN5SXNJbUZzYkZKbGJXOTJaWE1pTENKaGNuSmhlVk4wWVhKMGMxZHBkR2dpTENKemEybHdVbVZ0YjNabFUzVndaWEp6WlhRaUxDSmhjbkpoZVVWeGRXRnNJaXdpYzNkaGNDSXNJbU52Ykd4bFkzUkRiMjUwWlhoMElpd2liV1Z5WjJWa0lpd2lhVzV6WlhKMElpd2liR2x1WlNJc0luTjBZWFJsSWl3aWIzQmxjbUYwYVc5dUlpd2liV0YwWTJoRGFHRnVaMlZ6SWl3aVkyaGhibWRsY3lJc0ltMWhkR05vU1c1a1pYZ2lMQ0pqYjI1MFpYaDBRMmhoYm1kbGN5SXNJbU52Ym1ac2FXTjBaV1FpTENKamFHRnVaMlVpTENKdFlYUmphQ0lzSW5OMVluTjBjaUlzSW5KbFpIVmpaU0lzSW5CeVpYWWlMQ0p5WlcxdmRtVkRhR0Z1WjJWeklpd2laR1ZzZEdFaUxDSnBJaXdpWTJoaGJtZGxRMjl1ZEdWdWRDSXNJbVp2Y2tWaFkyZ2lMQ0p0ZVVOdmRXNTBJaXdpZEdobGFYSkRiM1Z1ZENKZExDSnRZWEJ3YVc1bmN5STZJanM3T3pzN096czdPenRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlFVRTdPMEZCUTBFN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGQlFUczdRVUZGUVR0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVGQk96czdPenM3T3pzN096czdPenM3UVVGRlR5eFRRVUZUUVN4aFFVRlVMRU5CUVhWQ1F5eEpRVUYyUWl4RlFVRTJRanRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVU5NUXl4RlFVRkJRU3h0UWtGQmJVSXNRMEZCUTBRc1NVRkJTU3hEUVVGRFJTeExRVUZPTEVOQlJHUTdRVUZCUVN4TlFVTXpRa01zVVVGRU1rSXNkMEpCUXpOQ1FTeFJRVVF5UWp0QlFVRkJMRTFCUTJwQ1F5eFJRVVJwUWl4M1FrRkRha0pCTEZGQlJHbENPenRCUVVkc1F5eE5RVUZKUkN4UlFVRlJMRXRCUVV0RkxGTkJRV3BDTEVWQlFUUkNPMEZCUXpGQ1RDeEpRVUZCUVN4SlFVRkpMRU5CUVVOSExGRkJRVXdzUjBGQlowSkJMRkZCUVdoQ08wRkJRMFFzUjBGR1JDeE5RVVZQTzBGQlEwd3NWMEZCVDBnc1NVRkJTU3hEUVVGRFJ5eFJRVUZhTzBGQlEwUTdPMEZCUlVRc1RVRkJTVU1zVVVGQlVTeExRVUZMUXl4VFFVRnFRaXhGUVVFMFFqdEJRVU14UWt3c1NVRkJRVUVzU1VGQlNTeERRVUZEU1N4UlFVRk1MRWRCUVdkQ1FTeFJRVUZvUWp0QlFVTkVMRWRCUmtRc1RVRkZUenRCUVVOTUxGZEJRVTlLTEVsQlFVa3NRMEZCUTBrc1VVRkJXanRCUVVORU8wRkJRMFk3TzBGQlJVMHNVMEZCVTBVc1MwRkJWQ3hEUVVGbFF5eEpRVUZtTEVWQlFYRkNReXhOUVVGeVFpeEZRVUUyUWtNc1NVRkJOMElzUlVGQmJVTTdRVUZEZUVOR0xFVkJRVUZCTEVsQlFVa3NSMEZCUjBjc1UwRkJVeXhEUVVGRFNDeEpRVUZFTEVWQlFVOUZMRWxCUVZBc1EwRkJhRUk3UVVGRFFVUXNSVUZCUVVFc1RVRkJUU3hIUVVGSFJTeFRRVUZUTEVOQlFVTkdMRTFCUVVRc1JVRkJVME1zU1VGQlZDeERRVUZzUWp0QlFVVkJMRTFCUVVsRkxFZEJRVWNzUjBGQlJ5eEZRVUZXTEVOQlNuZERMRU5CVFhoRE8wRkJRMEU3UVVGRFFUczdRVUZEUVN4TlFVRkpTaXhKUVVGSkxFTkJRVU5MTEV0QlFVd3NTVUZCWTBvc1RVRkJUU3hEUVVGRFNTeExRVUY2UWl4RlFVRm5RenRCUVVNNVFrUXNTVUZCUVVFc1IwRkJSeXhEUVVGRFF5eExRVUZLTEVkQlFWbE1MRWxCUVVrc1EwRkJRMHNzUzBGQlRDeEpRVUZqU2l4TlFVRk5MRU5CUVVOSkxFdEJRV3BETzBGQlEwUTdPMEZCUlVRc1RVRkJTVXdzU1VGQlNTeERRVUZEVFN4WFFVRk1MRWxCUVc5Q1RDeE5RVUZOTEVOQlFVTkxMRmRCUVM5Q0xFVkJRVFJETzBGQlF6RkRMRkZCUVVrc1EwRkJRME1zWlVGQlpTeERRVUZEVUN4SlFVRkVMRU5CUVhCQ0xFVkJRVFJDTzBGQlF6RkNPMEZCUTBGSkxFMUJRVUZCTEVkQlFVY3NRMEZCUTBrc1YwRkJTaXhIUVVGclFsQXNUVUZCVFN4RFFVRkRUeXhYUVVGUUxFbEJRWE5DVWl4SlFVRkpMRU5CUVVOUkxGZEJRVGRETzBGQlEwRktMRTFCUVVGQkxFZEJRVWNzUTBGQlEwVXNWMEZCU2l4SFFVRnJRa3dzVFVGQlRTeERRVUZEU3l4WFFVRlFMRWxCUVhOQ1RpeEpRVUZKTEVOQlFVTk5MRmRCUVRkRE8wRkJRMEZHTEUxQlFVRkJMRWRCUVVjc1EwRkJRMHNzVTBGQlNpeEhRVUZuUWxJc1RVRkJUU3hEUVVGRFVTeFRRVUZRTEVsQlFXOUNWQ3hKUVVGSkxFTkJRVU5UTEZOQlFYcERPMEZCUTBGTUxFMUJRVUZCTEVkQlFVY3NRMEZCUTAwc1UwRkJTaXhIUVVGblFsUXNUVUZCVFN4RFFVRkRVeXhUUVVGUUxFbEJRVzlDVml4SlFVRkpMRU5CUVVOVkxGTkJRWHBETzBGQlEwUXNTMEZPUkN4TlFVMVBMRWxCUVVrc1EwRkJRMGdzWlVGQlpTeERRVUZEVGl4TlFVRkVMRU5CUVhCQ0xFVkJRVGhDTzBGQlEyNURPMEZCUTBGSExFMUJRVUZCTEVkQlFVY3NRMEZCUTBrc1YwRkJTaXhIUVVGclFsSXNTVUZCU1N4RFFVRkRVU3hYUVVGMlFqdEJRVU5CU2l4TlFVRkJRU3hIUVVGSExFTkJRVU5GTEZkQlFVb3NSMEZCYTBKT0xFbEJRVWtzUTBGQlEwMHNWMEZCZGtJN1FVRkRRVVlzVFVGQlFVRXNSMEZCUnl4RFFVRkRTeXhUUVVGS0xFZEJRV2RDVkN4SlFVRkpMRU5CUVVOVExGTkJRWEpDTzBGQlEwRk1MRTFCUVVGQkxFZEJRVWNzUTBGQlEwMHNVMEZCU2l4SFFVRm5RbFlzU1VGQlNTeERRVUZEVlN4VFFVRnlRanRCUVVORUxFdEJUazBzVFVGTlFUdEJRVU5NTzBGQlEwRk9MRTFCUVVGQkxFZEJRVWNzUTBGQlEwa3NWMEZCU2l4SFFVRnJRa2NzVjBGQlZ5eERRVUZEVUN4SFFVRkVMRVZCUVUxS0xFbEJRVWtzUTBGQlExRXNWMEZCV0N4RlFVRjNRbEFzVFVGQlRTeERRVUZEVHl4WFFVRXZRaXhEUVVFM1FqdEJRVU5CU2l4TlFVRkJRU3hIUVVGSExFTkJRVU5GTEZkQlFVb3NSMEZCYTBKTExGZEJRVmNzUTBGQlExQXNSMEZCUkN4RlFVRk5TaXhKUVVGSkxFTkJRVU5OTEZkQlFWZ3NSVUZCZDBKTUxFMUJRVTBzUTBGQlEwc3NWMEZCTDBJc1EwRkJOMEk3UVVGRFFVWXNUVUZCUVVFc1IwRkJSeXhEUVVGRFN5eFRRVUZLTEVkQlFXZENSU3hYUVVGWExFTkJRVU5RTEVkQlFVUXNSVUZCVFVvc1NVRkJTU3hEUVVGRFV5eFRRVUZZTEVWQlFYTkNVaXhOUVVGTkxFTkJRVU5STEZOQlFUZENMRU5CUVROQ08wRkJRMEZNTEUxQlFVRkJMRWRCUVVjc1EwRkJRMDBzVTBGQlNpeEhRVUZuUWtNc1YwRkJWeXhEUVVGRFVDeEhRVUZFTEVWQlFVMUtMRWxCUVVrc1EwRkJRMVVzVTBGQldDeEZRVUZ6UWxRc1RVRkJUU3hEUVVGRFV5eFRRVUUzUWl4RFFVRXpRanRCUVVORU8wRkJRMFk3TzBGQlJVUk9MRVZCUVVGQkxFZEJRVWNzUTBGQlExRXNTMEZCU2l4SFFVRlpMRVZCUVZvN1FVRkZRU3hOUVVGSlF5eFRRVUZUTEVkQlFVY3NRMEZCYUVJN1FVRkJRU3hOUVVOSlF5eFhRVUZYTEVkQlFVY3NRMEZFYkVJN1FVRkJRU3hOUVVWSlF5eFZRVUZWTEVkQlFVY3NRMEZHYWtJN1FVRkJRU3hOUVVkSlF5eFpRVUZaTEVkQlFVY3NRMEZJYmtJN08wRkJTMEVzVTBGQlQwZ3NVMEZCVXl4SFFVRkhZaXhKUVVGSkxFTkJRVU5aTEV0QlFVd3NRMEZCVjBzc1RVRkJka0lzU1VGQmFVTklMRmRCUVZjc1IwRkJSMklzVFVGQlRTeERRVUZEVnl4TFFVRlFMRU5CUVdGTExFMUJRVzVGTEVWQlFUSkZPMEZCUTNwRkxGRkJRVWxETEZkQlFWY3NSMEZCUjJ4Q0xFbEJRVWtzUTBGQlExa3NTMEZCVEN4RFFVRlhReXhUUVVGWUxFdEJRWGxDTzBGQlFVTk5MRTFCUVVGQkxGRkJRVkVzUlVGQlJVTTdRVUZCV0N4TFFVRXpRenRCUVVGQkxGRkJRMGxETEdGQlFXRXNSMEZCUjNCQ0xFMUJRVTBzUTBGQlExY3NTMEZCVUN4RFFVRmhSU3hYUVVGaUxFdEJRVFpDTzBGQlFVTkxMRTFCUVVGQkxGRkJRVkVzUlVGQlJVTTdRVUZCV0N4TFFVUnFSRHM3UVVGSFFTeFJRVUZKUlN4VlFVRlZMRU5CUVVOS0xGZEJRVVFzUlVGQlkwY3NZVUZCWkN4RFFVRmtMRVZCUVRSRE8wRkJRekZETzBGQlEwRnFRaXhOUVVGQlFTeEhRVUZITEVOQlFVTlJMRXRCUVVvc1EwRkJWVmNzU1VGQlZpeERRVUZsUXl4VFFVRlRMRU5CUVVOT0xGZEJRVVFzUlVGQlkwZ3NWVUZCWkN4RFFVRjRRanRCUVVOQlJpeE5RVUZCUVN4VFFVRlRPMEZCUTFSSExFMUJRVUZCTEZsQlFWa3NTVUZCU1VVc1YwRkJWeXhEUVVGRGNrSXNVVUZCV2l4SFFVRjFRbkZDTEZkQlFWY3NRMEZCUTNSQ0xGRkJRVzVFTzBGQlEwUXNTMEZNUkN4TlFVdFBMRWxCUVVrd1FpeFZRVUZWTEVOQlFVTkVMR0ZCUVVRc1JVRkJaMEpJTEZkQlFXaENMRU5CUVdRc1JVRkJORU03UVVGRGFrUTdRVUZEUVdRc1RVRkJRVUVzUjBGQlJ5eERRVUZEVVN4TFFVRktMRU5CUVZWWExFbEJRVllzUTBGQlpVTXNVMEZCVXl4RFFVRkRTQ3hoUVVGRUxFVkJRV2RDVEN4WlFVRm9RaXhEUVVGNFFqdEJRVU5CUml4TlFVRkJRU3hYUVVGWE8wRkJRMWhETEUxQlFVRkJMRlZCUVZVc1NVRkJTVTBzWVVGQllTeERRVUZEZUVJc1VVRkJaQ3hIUVVGNVFuZENMR0ZCUVdFc1EwRkJRM3BDTEZGQlFYSkVPMEZCUTBRc1MwRk1UU3hOUVV0Qk8wRkJRMHc3UVVGRFFTeFZRVUZKTmtJc1ZVRkJWU3hIUVVGSE8wRkJRMlpPTEZGQlFVRkJMRkZCUVZFc1JVRkJSVThzU1VGQlNTeERRVUZEUXl4SFFVRk1MRU5CUVZOVUxGZEJRVmNzUTBGQlEwTXNVVUZCY2tJc1JVRkJLMEpGTEdGQlFXRXNRMEZCUTBZc1VVRkJOME1zUTBGRVN6dEJRVVZtZGtJc1VVRkJRVUVzVVVGQlVTeEZRVUZGTEVOQlJrczdRVUZIWm1kRExGRkJRVUZCTEZGQlFWRXNSVUZCUlVZc1NVRkJTU3hEUVVGRFF5eEhRVUZNTEVOQlFWTlVMRmRCUVZjc1EwRkJRMVVzVVVGQldpeEhRVUYxUW1Jc1ZVRkJhRU1zUlVGQk5FTk5MR0ZCUVdFc1EwRkJRMFlzVVVGQlpDeEhRVUY1UWtnc1dVRkJja1VzUTBGSVN6dEJRVWxtYmtJc1VVRkJRVUVzVVVGQlVTeEZRVUZGTEVOQlNrczdRVUZMWmtZc1VVRkJRVUVzUzBGQlN5eEZRVUZGTzBGQlRGRXNUMEZCYWtJN1FVRlBRV3RETEUxQlFVRkJMRlZCUVZVc1EwRkJRMG9zVlVGQlJDeEZRVUZoVUN4WFFVRlhMRU5CUVVORExGRkJRWHBDTEVWQlFXMURSQ3hYUVVGWExFTkJRVU4yUWl4TFFVRXZReXhGUVVGelJEQkNMR0ZCUVdFc1EwRkJRMFlzVVVGQmNFVXNSVUZCT0VWRkxHRkJRV0VzUTBGQlF6RkNMRXRCUVRWR0xFTkJRVlk3UVVGRFFXMUNMRTFCUVVGQkxGZEJRVmM3UVVGRFdFUXNUVUZCUVVFc1UwRkJVenRCUVVWVVZDeE5RVUZCUVN4SFFVRkhMRU5CUVVOUkxFdEJRVW9zUTBGQlZWY3NTVUZCVml4RFFVRmxSU3hWUVVGbU8wRkJRMFE3UVVGRFJqczdRVUZGUkN4VFFVRlBja0lzUjBGQlVEdEJRVU5FT3p0QlFVVkVMRk5CUVZORUxGTkJRVlFzUTBGQmJVSXlRaXhMUVVGdVFpeEZRVUV3UWpWQ0xFbEJRVEZDTEVWQlFXZERPMEZCUXpsQ0xFMUJRVWtzVDBGQlR6UkNMRXRCUVZBc1MwRkJhVUlzVVVGQmNrSXNSVUZCSzBJN1FVRkROMElzVVVGQlN5eE5RVUZFTEVOQlFWTkRMRWxCUVZRc1EwRkJZMFFzUzBGQlpDeExRVUV3UWl4VlFVRkVMRU5CUVdGRExFbEJRV0lzUTBGQmEwSkVMRXRCUVd4Q0xFTkJRVGRDTEVWQlFYZEVPMEZCUTNSRUxHRkJRVTg3UVVGQlFUdEJRVUZCTzBGQlFVRTdPMEZCUVVGRk8wRkJRVUZCTzBGQlFVRkJPMEZCUVVGQk8wRkJRVUZCTzBGQlFVRkJPMEZCUVVFN1FVRkJRU3hUUVVGWFJpeExRVUZZTEVWQlFXdENMRU5CUVd4Q08wRkJRVkE3UVVGRFJEczdRVUZGUkN4UlFVRkpMRU5CUVVNMVFpeEpRVUZNTEVWQlFWYzdRVUZEVkN4WlFVRk5MRWxCUVVrclFpeExRVUZLTEVOQlFWVXNhMFJCUVZZc1EwRkJUanRCUVVORU96dEJRVU5FTEZkQlFVODdRVUZCUVR0QlFVRkJPMEZCUVVFN08wRkJRVUZETzBGQlFVRkJPMEZCUVVGQk8wRkJRVUZCTzBGQlFVRkJPMEZCUVVGQk8wRkJRVUU3UVVGQlFTeFBRVUZuUW5CRExGTkJRV2hDTEVWQlFUSkNRU3hUUVVFelFpeEZRVUZ6UTBrc1NVRkJkRU1zUlVGQk5FTTBRaXhMUVVFMVF6dEJRVUZRTzBGQlEwUTdPMEZCUlVRc1UwRkJUMEVzUzBGQlVEdEJRVU5FT3p0QlFVVkVMRk5CUVZOMlFpeGxRVUZVTEVOQlFYbENORUlzUzBGQmVrSXNSVUZCWjBNN1FVRkRPVUlzVTBGQlQwRXNTMEZCU3l4RFFVRkROMElzVjBGQlRpeEpRVUZ4UWpaQ0xFdEJRVXNzUTBGQlF6ZENMRmRCUVU0c1MwRkJjMEkyUWl4TFFVRkxMRU5CUVVNelFpeFhRVUY0UkR0QlFVTkVPenRCUVVWRUxGTkJRVk5ITEZkQlFWUXNRMEZCY1VKT0xFdEJRWEpDTEVWQlFUUkNUQ3hKUVVFMVFpeEZRVUZyUTBNc1RVRkJiRU1zUlVGQk1FTTdRVUZEZUVNc1RVRkJTVVFzU1VGQlNTeExRVUZMUXl4TlFVRmlMRVZCUVhGQ08wRkJRMjVDTEZkQlFVOUVMRWxCUVZBN1FVRkRSQ3hIUVVaRUxFMUJSVTg3UVVGRFRFc3NTVUZCUVVFc1MwRkJTeXhEUVVGREswSXNVVUZCVGl4SFFVRnBRaXhKUVVGcVFqdEJRVU5CTEZkQlFVODdRVUZCUTNCRExFMUJRVUZCTEVsQlFVa3NSVUZCU2tFc1NVRkJSRHRCUVVGUFF5eE5RVUZCUVN4TlFVRk5MRVZCUVU1Qk8wRkJRVkFzUzBGQlVEdEJRVU5FTzBGQlEwWTdPMEZCUlVRc1UwRkJVM0ZDTEZWQlFWUXNRMEZCYjBKVExFbEJRWEJDTEVWQlFUQkNUU3hMUVVFeFFpeEZRVUZwUXp0QlFVTXZRaXhUUVVGUFRpeEpRVUZKTEVOQlFVTmFMRkZCUVV3c1IwRkJaMEpyUWl4TFFVRkxMRU5CUVVOc1FpeFJRVUYwUWl4SlFVTkVXU3hKUVVGSkxFTkJRVU5hTEZGQlFVd3NSMEZCWjBKWkxFbEJRVWtzUTBGQlEyNURMRkZCUVhSQ0xFZEJRV3REZVVNc1MwRkJTeXhEUVVGRGJFSXNVVUZFTjBNN1FVRkZSRHM3UVVGRlJDeFRRVUZUU3l4VFFVRlVMRU5CUVcxQ0wwSXNTVUZCYmtJc1JVRkJlVUkyUXl4TlFVRjZRaXhGUVVGcFF6dEJRVU12UWl4VFFVRlBPMEZCUTB4dVFpeEpRVUZCUVN4UlFVRlJMRVZCUVVVeFFpeEpRVUZKTEVOQlFVTXdRaXhSUVVSV08wRkJRMjlDZGtJc1NVRkJRVUVzVVVGQlVTeEZRVUZGU0N4SlFVRkpMRU5CUVVOSExGRkJSRzVETzBGQlJVeG5ReXhKUVVGQlFTeFJRVUZSTEVWQlFVVnVReXhKUVVGSkxFTkJRVU50UXl4UlFVRk1MRWRCUVdkQ1ZTeE5RVVp5UWp0QlFVVTJRbnBETEVsQlFVRkJMRkZCUVZFc1JVRkJSVW9zU1VGQlNTeERRVUZEU1N4UlFVWTFRenRCUVVkTVJpeEpRVUZCUVN4TFFVRkxMRVZCUVVWR0xFbEJRVWtzUTBGQlEwVTdRVUZJVUN4SFFVRlFPMEZCUzBRN08wRkJSVVFzVTBGQlUydERMRlZCUVZRc1EwRkJiMEp3UXl4SlFVRndRaXhGUVVFd1FuTkNMRlZCUVRGQ0xFVkJRWE5EZDBJc1UwRkJkRU1zUlVGQmFVUkRMRmRCUVdwRUxFVkJRVGhFUXl4VlFVRTVSQ3hGUVVFd1JUdEJRVU40UlR0QlFVTkJPMEZCUTBFc1RVRkJTWHBETEVsQlFVa3NSMEZCUnp0QlFVRkRjME1zU1VGQlFVRXNUVUZCVFN4RlFVRkZka0lzVlVGQlZEdEJRVUZ4UW5CQ0xFbEJRVUZCTEV0QlFVc3NSVUZCUlRSRExGTkJRVFZDTzBGQlFYVkRiRU1zU1VGQlFVRXNTMEZCU3l4RlFVRkZPMEZCUVRsRExFZEJRVmc3UVVGQlFTeE5RVU5KY1VNc1MwRkJTeXhIUVVGSE8wRkJRVU5LTEVsQlFVRkJMRTFCUVUwc1JVRkJSVVVzVjBGQlZEdEJRVUZ6UWpkRExFbEJRVUZCTEV0QlFVc3NSVUZCUlRoRExGVkJRVGRDTzBGQlFYbERjRU1zU1VGQlFVRXNTMEZCU3l4RlFVRkZPMEZCUVdoRUxFZEJSRm9zUTBGSWQwVXNRMEZOZUVVN08wRkJRMEZ6UXl4RlFVRkJRU3hoUVVGaExFTkJRVU5zUkN4SlFVRkVMRVZCUVU5UExFbEJRVkFzUlVGQllUQkRMRXRCUVdJc1EwRkJZanRCUVVOQlF5eEZRVUZCUVN4aFFVRmhMRU5CUVVOc1JDeEpRVUZFTEVWQlFVOXBSQ3hMUVVGUUxFVkJRV014UXl4SlFVRmtMRU5CUVdJc1EwRlNkMFVzUTBGVmVFVTdPMEZCUTBFc1UwRkJUMEVzU1VGQlNTeERRVUZEU3l4TFFVRk1MRWRCUVdGTUxFbEJRVWtzUTBGQlEwd3NTMEZCVEN4RFFVRlhjMElzVFVGQmVFSXNTVUZCYTBONVFpeExRVUZMTEVOQlFVTnlReXhMUVVGT0xFZEJRV054UXl4TFFVRkxMRU5CUVVNdlF5eExRVUZPTEVOQlFWbHpRaXhOUVVGdVJTeEZRVUV5UlR0QlFVTjZSU3hSUVVGSlF5eFhRVUZYTEVkQlFVZHNRaXhKUVVGSkxFTkJRVU5NTEV0QlFVd3NRMEZCVjBzc1NVRkJTU3hEUVVGRFN5eExRVUZvUWl4RFFVRnNRanRCUVVGQkxGRkJRMGwxUXl4WlFVRlpMRWRCUVVkR0xFdEJRVXNzUTBGQlF5OURMRXRCUVU0c1EwRkJXU3RETEV0QlFVc3NRMEZCUTNKRExFdEJRV3hDTEVOQlJHNUNPenRCUVVkQkxGRkJRVWtzUTBGQlEyRXNWMEZCVnl4RFFVRkRMRU5CUVVRc1EwRkJXQ3hMUVVGdFFpeEhRVUZ1UWl4SlFVRXdRa0VzVjBGQlZ5eERRVUZETEVOQlFVUXNRMEZCV0N4TFFVRnRRaXhIUVVFNVF5eE5RVU5KTUVJc1dVRkJXU3hEUVVGRExFTkJRVVFzUTBGQldpeExRVUZ2UWl4SFFVRndRaXhKUVVFeVFrRXNXVUZCV1N4RFFVRkRMRU5CUVVRc1EwRkJXaXhMUVVGdlFpeEhRVVJ1UkN4RFFVRktMRVZCUXpaRU8wRkJRek5FTzBGQlEwRkRMRTFCUVVGQkxGbEJRVmtzUTBGQlEzQkVMRWxCUVVRc1JVRkJUMDhzU1VGQlVDeEZRVUZoTUVNc1MwRkJZaXhEUVVGYU8wRkJRMFFzUzBGS1JDeE5RVWxQTEVsQlFVbDRRaXhYUVVGWExFTkJRVU1zUTBGQlJDeERRVUZZTEV0QlFXMUNMRWRCUVc1Q0xFbEJRVEJDTUVJc1dVRkJXU3hEUVVGRExFTkJRVVFzUTBGQldpeExRVUZ2UWl4SFFVRnNSQ3hGUVVGMVJEdEJRVUZCTzBGQlFVRTdPMEZCUVVFN1FVRkROVVE3TzBGQlEwRTdPMEZCUVVFN08wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlFVRnVSQ3hOUVVGQlFTeEpRVUZKTEVOQlFVTkZMRXRCUVV3c1JVRkJWelJDTEVsQlFWZzdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVUZ2UW5WQ0xFMUJRVUZCTEdGQlFXRXNRMEZCUXpsRExFbEJRVVFzUTBGQmFrTTdRVUZEUkN4TFFVaE5MRTFCUjBFc1NVRkJTVFJETEZsQlFWa3NRMEZCUXl4RFFVRkVMRU5CUVZvc1MwRkJiMElzUjBGQmNFSXNTVUZCTWtJeFFpeFhRVUZYTEVOQlFVTXNRMEZCUkN4RFFVRllMRXRCUVcxQ0xFZEJRV3hFTEVWQlFYVkVPMEZCUVVFN1FVRkJRVHM3UVVGQlFUdEJRVU0xUkRzN1FVRkRRVHM3UVVGQlFUczdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkJRWHBDTEUxQlFVRkJMRWxCUVVrc1EwRkJRMFVzUzBGQlRDeEZRVUZYTkVJc1NVRkJXRHRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCUVc5Q2RVSXNUVUZCUVVFc1lVRkJZU3hEUVVGRFNpeExRVUZFTEVOQlFXcERPMEZCUTBRc1MwRklUU3hOUVVkQkxFbEJRVWw0UWl4WFFVRlhMRU5CUVVNc1EwRkJSQ3hEUVVGWUxFdEJRVzFDTEVkQlFXNUNMRWxCUVRCQ01FSXNXVUZCV1N4RFFVRkRMRU5CUVVRc1EwRkJXaXhMUVVGdlFpeEhRVUZzUkN4RlFVRjFSRHRCUVVNMVJEdEJRVU5CUnl4TlFVRkJRU3hQUVVGUExFTkJRVU4wUkN4SlFVRkVMRVZCUVU5UExFbEJRVkFzUlVGQllUQkRMRXRCUVdJc1EwRkJVRHRCUVVORUxFdEJTRTBzVFVGSFFTeEpRVUZKUlN4WlFVRlpMRU5CUVVNc1EwRkJSQ3hEUVVGYUxFdEJRVzlDTEVkQlFYQkNMRWxCUVRKQ01VSXNWMEZCVnl4RFFVRkRMRU5CUVVRc1EwRkJXQ3hMUVVGdFFpeEhRVUZzUkN4RlFVRjFSRHRCUVVNMVJEdEJRVU5CTmtJc1RVRkJRVUVzVDBGQlR5eERRVUZEZEVRc1NVRkJSQ3hGUVVGUGFVUXNTMEZCVUN4RlFVRmpNVU1zU1VGQlpDeEZRVUZ2UWl4SlFVRndRaXhEUVVGUU8wRkJRMFFzUzBGSVRTeE5RVWRCTEVsQlFVbHJRaXhYUVVGWExFdEJRVXN3UWl4WlFVRndRaXhGUVVGclF6dEJRVU4yUXp0QlFVTkJia1FzVFVGQlFVRXNTVUZCU1N4RFFVRkRSU3hMUVVGTUxFTkJRVmMwUWl4SlFVRllMRU5CUVdkQ1RDeFhRVUZvUWp0QlFVTkJiRUlzVFVGQlFVRXNTVUZCU1N4RFFVRkRTeXhMUVVGTU8wRkJRMEZ4UXl4TlFVRkJRU3hMUVVGTExFTkJRVU55UXl4TFFVRk9PMEZCUTBRc1MwRk1UU3hOUVV0Qk8wRkJRMHc3UVVGRFFTdENMRTFCUVVGQkxGRkJRVkVzUTBGQlF6TkRMRWxCUVVRc1JVRkJUM0ZFTEdGQlFXRXNRMEZCUXpsRExFbEJRVVFzUTBGQmNFSXNSVUZCTkVJNFF5eGhRVUZoTEVOQlFVTktMRXRCUVVRc1EwRkJla01zUTBGQlVqdEJRVU5FTzBGQlEwWXNSMEY0UTNWRkxFTkJNRU40UlRzN08wRkJRMEZOTEVWQlFVRkJMR05CUVdNc1EwRkJRM1pFTEVsQlFVUXNSVUZCVDA4c1NVRkJVQ3hEUVVGa08wRkJRMEZuUkN4RlFVRkJRU3hqUVVGakxFTkJRVU4yUkN4SlFVRkVMRVZCUVU5cFJDeExRVUZRTEVOQlFXUTdRVUZGUVd4RUxFVkJRVUZCTEdGQlFXRXNRMEZCUTBNc1NVRkJSQ3hEUVVGaU8wRkJRMFE3TzBGQlJVUXNVMEZCVTI5RUxGbEJRVlFzUTBGQmMwSndSQ3hKUVVGMFFpeEZRVUUwUWs4c1NVRkJOVUlzUlVGQmEwTXdReXhMUVVGc1F5eEZRVUY1UXp0QlFVTjJReXhOUVVGSlR5eFRRVUZUTEVkQlFVZElMR0ZCUVdFc1EwRkJRemxETEVsQlFVUXNRMEZCTjBJN1FVRkJRU3hOUVVOSmEwUXNXVUZCV1N4SFFVRkhTaXhoUVVGaExFTkJRVU5LTEV0QlFVUXNRMEZFYUVNN08wRkJSMEVzVFVGQlNWTXNWVUZCVlN4RFFVRkRSaXhUUVVGRUxFTkJRVllzU1VGQmVVSkZMRlZCUVZVc1EwRkJRMFFzV1VGQlJDeERRVUYyUXl4RlFVRjFSRHRCUVVOeVJEdEJRVU5CTzBGQlFVazdRVUZCUVR0QlFVRkJPenRCUVVGQlJUdEJRVUZCUVR0QlFVRkJRVHRCUVVGQlFUdEJRVUZCUVR0QlFVRkJRVHRCUVVGQk8wRkJRVUVzUzBGQlowSklMRk5CUVdoQ0xFVkJRVEpDUXl4WlFVRXpRaXhMUVVOSFJ5eHJRa0ZCYTBJc1EwRkJRMWdzUzBGQlJDeEZRVUZSVHl4VFFVRlNMRVZCUVcxQ1FTeFRRVUZUTEVOQlFVTm9ReXhOUVVGV0xFZEJRVzFDYVVNc1dVRkJXU3hEUVVGRGFrTXNUVUZCYmtRc1EwRkVla0lzUlVGRGNVWTdRVUZCUVR0QlFVRkJPenRCUVVGQk96dEJRVU51UmpzN1FVRkJRVHM3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZCUVhoQ0xFMUJRVUZCTEVsQlFVa3NRMEZCUTBVc1MwRkJUQ3hGUVVGWE5FSXNTVUZCV0R0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlFXOUNNRUlzVFVGQlFVRXNVMEZCY0VJN08wRkJRMEU3UVVGRFJDeExRVXBFTEUxQlNVODdRVUZCU1R0QlFVRkJPMEZCUVVFN08wRkJRVUZITzBGQlFVRkJPMEZCUVVGQk8wRkJRVUZCTzBGQlFVRkJPMEZCUVVGQk8wRkJRVUU3UVVGQlFTeExRVUZuUWtZc1dVRkJhRUlzUlVGQk9FSkVMRk5CUVRsQ0xFdEJRMHBKTEd0Q1FVRnJRaXhEUVVGRGNrUXNTVUZCUkN4RlFVRlBhMFFzV1VGQlVDeEZRVUZ4UWtFc1dVRkJXU3hEUVVGRGFrTXNUVUZCWWl4SFFVRnpRbWRETEZOQlFWTXNRMEZCUTJoRExFMUJRWEpFTEVOQlJHeENMRVZCUTJkR08wRkJRVUU3UVVGQlFUczdRVUZCUVRzN1FVRkRja1k3TzBGQlFVRTdPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJRVUY0UWl4TlFVRkJRU3hKUVVGSkxFTkJRVU5GTEV0QlFVd3NSVUZCVnpSQ0xFbEJRVmc3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVGdlFqSkNMRTFCUVVGQkxGbEJRWEJDT3p0QlFVTkJPMEZCUTBRN1FVRkRSaXhIUVZoRUxFMUJWMDg3UVVGQlNUdEJRVUZCTzBGQlFVRTdPMEZCUVVGSk8wRkJRVUZCTzBGQlFVRkJPMEZCUVVGQk8wRkJRVUZCTzBGQlFVRkJPMEZCUVVFN1FVRkJRU3hIUVVGWFRDeFRRVUZZTEVWQlFYTkNReXhaUVVGMFFpeERRVUZLTEVWQlFYbERPMEZCUVVFN1FVRkJRVHM3UVVGQlFUczdRVUZET1VNN08wRkJRVUU3TzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCUVVGNlJDeEpRVUZCUVN4SlFVRkpMRU5CUVVORkxFdEJRVXdzUlVGQlZ6UkNMRWxCUVZnN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZCUVR0QlFVRnZRakJDTEVsQlFVRkJMRk5CUVhCQ096dEJRVU5CTzBGQlEwUTdPMEZCUlVSaUxFVkJRVUZCTEZGQlFWRXNRMEZCUXpORExFbEJRVVFzUlVGQlQzZEVMRk5CUVZBc1JVRkJhMEpETEZsQlFXeENMRU5CUVZJN1FVRkRSRHM3UVVGRlJDeFRRVUZUU0N4UFFVRlVMRU5CUVdsQ2RFUXNTVUZCYWtJc1JVRkJkVUpQTEVsQlFYWkNMRVZCUVRaQ01FTXNTMEZCTjBJc1JVRkJiME5oTEVsQlFYQkRMRVZCUVRCRE8wRkJRM2hETEUxQlFVbE9MRk5CUVZNc1IwRkJSMGdzWVVGQllTeERRVUZET1VNc1NVRkJSQ3hEUVVFM1FqdEJRVUZCTEUxQlEwbHJSQ3haUVVGWkxFZEJRVWROTEdOQlFXTXNRMEZCUTJRc1MwRkJSQ3hGUVVGUlR5eFRRVUZTTEVOQlJHcERPenRCUVVWQkxFMUJRVWxETEZsQlFWa3NRMEZCUTA4c1RVRkJha0lzUlVGQmVVSTdRVUZCUVR0QlFVRkJPenRCUVVGQk96dEJRVU4yUWpzN1FVRkJRVHM3UVVGQlFUdEJRVUZCTzBGQlFVRTdRVUZCUVdoRkxFbEJRVUZCTEVsQlFVa3NRMEZCUTBVc1MwRkJUQ3hGUVVGWE5FSXNTVUZCV0R0QlFVRkJPMEZCUVVFN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGQlFUdEJRVUZCTzBGQlFXOUNNa0lzU1VGQlFVRXNXVUZCV1N4RFFVRkRUeXhOUVVGcVF6dEJRVU5FTEVkQlJrUXNUVUZGVHp0QlFVTk1ja0lzU1VGQlFVRXNVVUZCVVN4RFFVRkRNME1zU1VGQlJDeEZRVUZQT0VRc1NVRkJTU3hIUVVGSFRDeFpRVUZJTEVkQlFXdENSQ3hUUVVFM1FpeEZRVUYzUTAwc1NVRkJTU3hIUVVGSFRpeFRRVUZJTEVkQlFXVkRMRmxCUVRORUxFTkJRVkk3UVVGRFJEdEJRVU5HT3p0QlFVVkVMRk5CUVZOa0xGRkJRVlFzUTBGQmEwSXpReXhKUVVGc1FpeEZRVUYzUWs4c1NVRkJlRUlzUlVGQk9FSXdReXhMUVVFNVFpeEZRVUZ4UXp0QlFVTnVRMnBFTEVWQlFVRkJMRWxCUVVrc1EwRkJRekpETEZGQlFVd3NSMEZCWjBJc1NVRkJhRUk3UVVGRFFUTkRMRVZCUVVGQkxFbEJRVWtzUTBGQlEwVXNTMEZCVEN4RFFVRlhORUlzU1VGQldDeERRVUZuUWp0QlFVTmtZU3hKUVVGQlFTeFJRVUZSTEVWQlFVVXNTVUZFU1R0QlFVVmtjRU1zU1VGQlFVRXNTVUZCU1N4RlFVRkZRU3hKUVVaUk8wRkJSMlJETEVsQlFVRkJMRTFCUVUwc1JVRkJSWGxETzBGQlNFMHNSMEZCYUVJN1FVRkxSRHM3UVVGRlJDeFRRVUZUUXl4aFFVRlVMRU5CUVhWQ2JFUXNTVUZCZGtJc1JVRkJOa0pwUlN4TlFVRTNRaXhGUVVGeFEyaENMRXRCUVhKRExFVkJRVFJETzBGQlF6RkRMRk5CUVU5blFpeE5RVUZOTEVOQlFVTndRaXhOUVVGUUxFZEJRV2RDU1N4TFFVRkxMRU5CUVVOS0xFMUJRWFJDTEVsQlFXZERiMElzVFVGQlRTeERRVUZEY2tRc1MwRkJVQ3hIUVVGbGNVUXNUVUZCVFN4RFFVRkRMMFFzUzBGQlVDeERRVUZoYzBJc1RVRkJia1VzUlVGQk1rVTdRVUZEZWtVc1VVRkJTVEJETEVsQlFVa3NSMEZCUjBRc1RVRkJUU3hEUVVGREwwUXNTMEZCVUN4RFFVRmhLMFFzVFVGQlRTeERRVUZEY2tRc1MwRkJVQ3hGUVVGaUxFTkJRVmc3UVVGRFFWb3NTVUZCUVVFc1NVRkJTU3hEUVVGRFJTeExRVUZNTEVOQlFWYzBRaXhKUVVGWUxFTkJRV2RDYjBNc1NVRkJhRUk3UVVGRFFVUXNTVUZCUVVFc1RVRkJUU3hEUVVGRGNFSXNUVUZCVUR0QlFVTkVPMEZCUTBZN08wRkJRMFFzVTBGQlUxVXNZMEZCVkN4RFFVRjNRblpFTEVsQlFYaENMRVZCUVRoQ2FVVXNUVUZCT1VJc1JVRkJjME03UVVGRGNFTXNVMEZCVDBFc1RVRkJUU3hEUVVGRGNrUXNTMEZCVUN4SFFVRmxjVVFzVFVGQlRTeERRVUZETDBRc1MwRkJVQ3hEUVVGaGMwSXNUVUZCYmtNc1JVRkJNa003UVVGRGVrTXNVVUZCU1RCRExFbEJRVWtzUjBGQlIwUXNUVUZCVFN4RFFVRkRMMFFzUzBGQlVDeERRVUZoSzBRc1RVRkJUU3hEUVVGRGNrUXNTMEZCVUN4RlFVRmlMRU5CUVZnN1FVRkRRVm9zU1VGQlFVRXNTVUZCU1N4RFFVRkRSU3hMUVVGTUxFTkJRVmMwUWl4SlFVRllMRU5CUVdkQ2IwTXNTVUZCYUVJN1FVRkRSRHRCUVVOR096dEJRVVZFTEZOQlFWTmlMR0ZCUVZRc1EwRkJkVUpqTEV0QlFYWkNMRVZCUVRoQ08wRkJRelZDTEUxQlFVbDRSQ3hIUVVGSExFZEJRVWNzUlVGQlZqdEJRVUZCTEUxQlEwbDVSQ3hUUVVGVExFZEJRVWRFTEV0QlFVc3NRMEZCUTJwRkxFdEJRVTRzUTBGQldXbEZMRXRCUVVzc1EwRkJRM1pFTEV0QlFXeENMRVZCUVhsQ0xFTkJRWHBDTEVOQlJHaENPenRCUVVWQkxGTkJRVTkxUkN4TFFVRkxMRU5CUVVOMlJDeExRVUZPTEVkQlFXTjFSQ3hMUVVGTExFTkJRVU5xUlN4TFFVRk9MRU5CUVZselFpeE5RVUZxUXl4RlFVRjVRenRCUVVOMlF5eFJRVUZKTUVNc1NVRkJTU3hIUVVGSFF5eExRVUZMTEVOQlFVTnFSU3hMUVVGT0xFTkJRVmxwUlN4TFFVRkxMRU5CUVVOMlJDeExRVUZzUWl4RFFVRllMRU5CUkhWRExFTkJSM1pET3p0QlFVTkJMRkZCUVVsM1JDeFRRVUZUTEV0QlFVc3NSMEZCWkN4SlFVRnhRa1lzU1VGQlNTeERRVUZETEVOQlFVUXNRMEZCU2l4TFFVRlpMRWRCUVhKRExFVkJRVEJETzBGQlEzaERSU3hOUVVGQlFTeFRRVUZUTEVkQlFVY3NSMEZCV2p0QlFVTkVPenRCUVVWRUxGRkJRVWxCTEZOQlFWTXNTMEZCUzBZc1NVRkJTU3hEUVVGRExFTkJRVVFzUTBGQmRFSXNSVUZCTWtJN1FVRkRla0oyUkN4TlFVRkJRU3hIUVVGSExFTkJRVU50UWl4SlFVRktMRU5CUVZOdlF5eEpRVUZVTzBGQlEwRkRMRTFCUVVGQkxFdEJRVXNzUTBGQlEzWkVMRXRCUVU0N1FVRkRSQ3hMUVVoRUxFMUJSMDg3UVVGRFREdEJRVU5FTzBGQlEwWTdPMEZCUlVRc1UwRkJUMFFzUjBGQlVEdEJRVU5FT3p0QlFVTkVMRk5CUVZOdlJDeGpRVUZVTEVOQlFYZENTU3hMUVVGNFFpeEZRVUVyUWtVc1dVRkJMMElzUlVGQk5rTTdRVUZETTBNc1RVRkJTVU1zVDBGQlR5eEhRVUZITEVWQlFXUTdRVUZCUVN4TlFVTkpUaXhOUVVGTkxFZEJRVWNzUlVGRVlqdEJRVUZCTEUxQlJVbFBMRlZCUVZVc1IwRkJSeXhEUVVacVFqdEJRVUZCTEUxQlIwbERMR05CUVdNc1IwRkJSeXhMUVVoeVFqdEJRVUZCTEUxQlNVbERMRlZCUVZVc1IwRkJSeXhMUVVwcVFqczdRVUZMUVN4VFFVRlBSaXhWUVVGVkxFZEJRVWRHTEZsQlFWa3NRMEZCUXpkRExFMUJRVEZDTEVsQlEwVXlReXhMUVVGTExFTkJRVU4yUkN4TFFVRk9MRWRCUVdOMVJDeExRVUZMTEVOQlFVTnFSU3hMUVVGT0xFTkJRVmx6UWl4TlFVUnVReXhGUVVNeVF6dEJRVU42UXl4UlFVRkphMFFzVFVGQlRTeEhRVUZIVUN4TFFVRkxMRU5CUVVOcVJTeExRVUZPTEVOQlFWbHBSU3hMUVVGTExFTkJRVU4yUkN4TFFVRnNRaXhEUVVGaU8wRkJRVUVzVVVGRFNTdEVMRXRCUVVzc1IwRkJSMDRzV1VGQldTeERRVUZEUlN4VlFVRkVMRU5CUkhoQ0xFTkJSSGxETEVOQlNYcERPenRCUVVOQkxGRkJRVWxKTEV0QlFVc3NRMEZCUXl4RFFVRkVMRU5CUVV3c1MwRkJZU3hIUVVGcVFpeEZRVUZ6UWp0QlFVTndRanRCUVVORU96dEJRVVZFU0N4SlFVRkJRU3hqUVVGakxFZEJRVWRCTEdOQlFXTXNTVUZCU1VVc1RVRkJUU3hEUVVGRExFTkJRVVFzUTBGQlRpeExRVUZqTEVkQlFXcEVPMEZCUlVGV0xFbEJRVUZCTEUxQlFVMHNRMEZCUTJ4RExFbEJRVkFzUTBGQldUWkRMRXRCUVZvN1FVRkRRVW9zU1VGQlFVRXNWVUZCVlN4SFFWb3JRaXhEUVdONlF6dEJRVU5CT3p0QlFVTkJMRkZCUVVsSExFMUJRVTBzUTBGQlF5eERRVUZFTEVOQlFVNHNTMEZCWXl4SFFVRnNRaXhGUVVGMVFqdEJRVU55UWtRc1RVRkJRVUVzVlVGQlZTeEhRVUZITEVsQlFXSTdPMEZCUlVFc1lVRkJUME1zVFVGQlRTeERRVUZETEVOQlFVUXNRMEZCVGl4TFFVRmpMRWRCUVhKQ0xFVkJRVEJDTzBGQlEzaENTaXhSUVVGQlFTeFBRVUZQTEVOQlFVTjRReXhKUVVGU0xFTkJRV0UwUXl4TlFVRmlPMEZCUTBGQkxGRkJRVUZCTEUxQlFVMHNSMEZCUjFBc1MwRkJTeXhEUVVGRGFrVXNTMEZCVGl4RFFVRlpMRVZCUVVWcFJTeExRVUZMTEVOQlFVTjJSQ3hMUVVGd1FpeERRVUZVTzBGQlEwUTdRVUZEUmpzN1FVRkZSQ3hSUVVGSkswUXNTMEZCU3l4RFFVRkRReXhOUVVGT0xFTkJRV0VzUTBGQllpeE5RVUZ2UWtZc1RVRkJUU3hEUVVGRFJTeE5RVUZRTEVOQlFXTXNRMEZCWkN4RFFVRjRRaXhGUVVFd1F6dEJRVU40UTA0c1RVRkJRVUVzVDBGQlR5eERRVUZEZUVNc1NVRkJVaXhEUVVGaE5FTXNUVUZCWWp0QlFVTkJVQ3hOUVVGQlFTeExRVUZMTEVOQlFVTjJSQ3hMUVVGT08wRkJRMFFzUzBGSVJDeE5RVWRQTzBGQlEwdzJSQ3hOUVVGQlFTeFZRVUZWTEVkQlFVY3NTVUZCWWp0QlFVTkVPMEZCUTBZN08wRkJSVVFzVFVGQlNTeERRVUZEU2l4WlFVRlpMRU5CUVVORkxGVkJRVVFzUTBGQldpeEpRVUUwUWl4RlFVRTNRaXhGUVVGcFF5eERRVUZxUXl4TlFVRjNReXhIUVVGNFF5eEpRVU5IUXl4alFVUlFMRVZCUTNWQ08wRkJRM0pDUXl4SlFVRkJRU3hWUVVGVkxFZEJRVWNzU1VGQllqdEJRVU5FT3p0QlFVVkVMRTFCUVVsQkxGVkJRVW9zUlVGQlowSTdRVUZEWkN4WFFVRlBTQ3hQUVVGUU8wRkJRMFE3TzBGQlJVUXNVMEZCVDBNc1ZVRkJWU3hIUVVGSFJpeFpRVUZaTEVOQlFVTTNReXhOUVVGcVF5eEZRVUY1UXp0QlFVTjJRM2RETEVsQlFVRkJMRTFCUVUwc1EwRkJRMnhETEVsQlFWQXNRMEZCV1hWRExGbEJRVmtzUTBGQlEwVXNWVUZCVlN4RlFVRllMRU5CUVhoQ08wRkJRMFE3TzBGQlJVUXNVMEZCVHp0QlFVTk1VQ3hKUVVGQlFTeE5RVUZOTEVWQlFVNUJMRTFCUkVzN1FVRkZURTBzU1VGQlFVRXNUMEZCVHl4RlFVRlFRVHRCUVVaTExFZEJRVkE3UVVGSlJEczdRVUZGUkN4VFFVRlRXaXhWUVVGVUxFTkJRVzlDV1N4UFFVRndRaXhGUVVFMlFqdEJRVU16UWl4VFFVRlBRU3hQUVVGUExFTkJRVU5QTEUxQlFWSXNRMEZCWlN4VlFVRlRReXhKUVVGVUxFVkJRV1ZLTEUxQlFXWXNSVUZCZFVJN1FVRkRNME1zVjBGQlQwa3NTVUZCU1N4SlFVRkpTaXhOUVVGTkxFTkJRVU1zUTBGQlJDeERRVUZPTEV0QlFXTXNSMEZCTjBJN1FVRkRSQ3hIUVVaTkxFVkJSVW9zU1VGR1NTeERRVUZRTzBGQlIwUTdPMEZCUTBRc1UwRkJVMlFzYTBKQlFWUXNRMEZCTkVKUExFdEJRVFZDTEVWQlFXMURXU3hoUVVGdVF5eEZRVUZyUkVNc1MwRkJiRVFzUlVGQmVVUTdRVUZEZGtRc1QwRkJTeXhKUVVGSlF5eERRVUZETEVkQlFVY3NRMEZCWWl4RlFVRm5Ra0VzUTBGQlF5eEhRVUZIUkN4TFFVRndRaXhGUVVFeVFrTXNRMEZCUXl4RlFVRTFRaXhGUVVGblF6dEJRVU01UWl4UlFVRkpReXhoUVVGaExFZEJRVWRJTEdGQlFXRXNRMEZCUTBFc1lVRkJZU3hEUVVGRGRrUXNUVUZCWkN4SFFVRjFRbmRFTEV0QlFYWkNMRWRCUVN0Q1F5eERRVUZvUXl4RFFVRmlMRU5CUVdkRVRDeE5RVUZvUkN4RFFVRjFSQ3hEUVVGMlJDeERRVUZ3UWpzN1FVRkRRU3hSUVVGSlZDeExRVUZMTEVOQlFVTnFSU3hMUVVGT0xFTkJRVmxwUlN4TFFVRkxMRU5CUVVOMlJDeExRVUZPTEVkQlFXTnhSU3hEUVVFeFFpeE5RVUZwUXl4TlFVRk5ReXhoUVVFelF5eEZRVUV3UkR0QlFVTjRSQ3hoUVVGUExFdEJRVkE3UVVGRFJEdEJRVU5HT3p0QlFVVkVaaXhGUVVGQlFTeExRVUZMTEVOQlFVTjJSQ3hMUVVGT0xFbEJRV1Z2UlN4TFFVRm1PMEZCUTBFc1UwRkJUeXhKUVVGUU8wRkJRMFE3TzBGQlJVUXNVMEZCVXk5RkxHMUNRVUZVTEVOQlFUWkNReXhMUVVFM1FpeEZRVUZ2UXp0QlFVTnNReXhOUVVGSlF5eFJRVUZSTEVkQlFVY3NRMEZCWmp0QlFVTkJMRTFCUVVsRExGRkJRVkVzUjBGQlJ5eERRVUZtTzBGQlJVRkdMRVZCUVVGQkxFdEJRVXNzUTBGQlEybEdMRTlCUVU0c1EwRkJZeXhWUVVGVGFrSXNTVUZCVkN4RlFVRmxPMEZCUXpOQ0xGRkJRVWtzVDBGQlQwRXNTVUZCVUN4TFFVRm5RaXhSUVVGd1FpeEZRVUU0UWp0QlFVTTFRaXhWUVVGSmEwSXNUMEZCVHl4SFFVRkhia1lzYlVKQlFXMUNMRU5CUVVOcFJTeEpRVUZKTEVOQlFVTXpSQ3hKUVVGT0xFTkJRV3BETzBGQlEwRXNWVUZCU1RoRkxGVkJRVlVzUjBGQlIzQkdMRzFDUVVGdFFpeERRVUZEYVVVc1NVRkJTU3hEUVVGRE1VUXNUVUZCVGl4RFFVRndRenM3UVVGRlFTeFZRVUZKVEN4UlFVRlJMRXRCUVV0RkxGTkJRV3BDTEVWQlFUUkNPMEZCUXpGQ0xGbEJRVWtyUlN4UFFVRlBMRU5CUVVOcVJpeFJRVUZTTEV0QlFYRkNhMFlzVlVGQlZTeERRVUZEYkVZc1VVRkJjRU1zUlVGQk9FTTdRVUZETlVOQkxGVkJRVUZCTEZGQlFWRXNTVUZCU1dsR0xFOUJRVThzUTBGQlEycEdMRkZCUVhCQ08wRkJRMFFzVTBGR1JDeE5RVVZQTzBGQlEweEJMRlZCUVVGQkxGRkJRVkVzUjBGQlIwVXNVMEZCV0R0QlFVTkVPMEZCUTBZN08wRkJSVVFzVlVGQlNVUXNVVUZCVVN4TFFVRkxReXhUUVVGcVFpeEZRVUUwUWp0QlFVTXhRaXhaUVVGSkswVXNUMEZCVHl4RFFVRkRhRVlzVVVGQlVpeExRVUZ4UW1sR0xGVkJRVlVzUTBGQlEycEdMRkZCUVhCRExFVkJRVGhETzBGQlF6VkRRU3hWUVVGQlFTeFJRVUZSTEVsQlFVbG5SaXhQUVVGUExFTkJRVU5vUml4UlFVRndRanRCUVVORUxGTkJSa1FzVFVGRlR6dEJRVU5NUVN4VlFVRkJRU3hSUVVGUkxFZEJRVWRETEZOQlFWZzdRVUZEUkR0QlFVTkdPMEZCUTBZc1MwRnVRa1FzVFVGdFFrODdRVUZEVEN4VlFVRkpSQ3hSUVVGUkxFdEJRVXRETEZOQlFXSXNTMEZCTWtJMlJDeEpRVUZKTEVOQlFVTXNRMEZCUkN4RFFVRktMRXRCUVZrc1IwRkJXaXhKUVVGdFFrRXNTVUZCU1N4RFFVRkRMRU5CUVVRc1EwRkJTaXhMUVVGWkxFZEJRVEZFTEVOQlFVb3NSVUZCYjBVN1FVRkRiRVU1UkN4UlFVRkJRU3hSUVVGUk8wRkJRMVE3TzBGQlEwUXNWVUZCU1VRc1VVRkJVU3hMUVVGTFJTeFRRVUZpTEV0QlFUSkNOa1FzU1VGQlNTeERRVUZETEVOQlFVUXNRMEZCU2l4TFFVRlpMRWRCUVZvc1NVRkJiVUpCTEVsQlFVa3NRMEZCUXl4RFFVRkVMRU5CUVVvc1MwRkJXU3hIUVVFeFJDeERRVUZLTEVWQlFXOUZPMEZCUTJ4RkwwUXNVVUZCUVVFc1VVRkJVVHRCUVVOVU8wRkJRMFk3UVVGRFJpeEhRVFZDUkR0QlFUaENRU3hUUVVGUE8wRkJRVU5CTEVsQlFVRkJMRkZCUVZFc1JVRkJVa0VzVVVGQlJEdEJRVUZYUXl4SlFVRkJRU3hSUVVGUkxFVkJRVkpCTzBGQlFWZ3NSMEZCVUR0QlFVTkVJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpYVcxd2IzSjBJSHR6ZEhKMVkzUjFjbVZrVUdGMFkyaDlJR1p5YjIwZ0p5NHZZM0psWVhSbEp6dGNibWx0Y0c5eWRDQjdjR0Z5YzJWUVlYUmphSDBnWm5KdmJTQW5MaTl3WVhKelpTYzdYRzVjYm1sdGNHOXlkQ0I3WVhKeVlYbEZjWFZoYkN3Z1lYSnlZWGxUZEdGeWRITlhhWFJvZlNCbWNtOXRJQ2N1TGk5MWRHbHNMMkZ5Y21GNUp6dGNibHh1Wlhod2IzSjBJR1oxYm1OMGFXOXVJR05oYkdOTWFXNWxRMjkxYm5Rb2FIVnVheWtnZTF4dUlDQmpiMjV6ZENCN2IyeGtUR2x1WlhNc0lHNWxkMHhwYm1WemZTQTlJR05oYkdOUGJHUk9aWGRNYVc1bFEyOTFiblFvYUhWdWF5NXNhVzVsY3lrN1hHNWNiaUFnYVdZZ0tHOXNaRXhwYm1WeklDRTlQU0IxYm1SbFptbHVaV1FwSUh0Y2JpQWdJQ0JvZFc1ckxtOXNaRXhwYm1WeklEMGdiMnhrVEdsdVpYTTdYRzRnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdaR1ZzWlhSbElHaDFibXN1YjJ4a1RHbHVaWE03WEc0Z0lIMWNibHh1SUNCcFppQW9ibVYzVEdsdVpYTWdJVDA5SUhWdVpHVm1hVzVsWkNrZ2UxeHVJQ0FnSUdoMWJtc3VibVYzVEdsdVpYTWdQU0J1WlhkTWFXNWxjenRjYmlBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0JrWld4bGRHVWdhSFZ1YXk1dVpYZE1hVzVsY3p0Y2JpQWdmVnh1ZlZ4dVhHNWxlSEJ2Y25RZ1puVnVZM1JwYjI0Z2JXVnlaMlVvYldsdVpTd2dkR2hsYVhKekxDQmlZWE5sS1NCN1hHNGdJRzFwYm1VZ1BTQnNiMkZrVUdGMFkyZ29iV2x1WlN3Z1ltRnpaU2s3WEc0Z0lIUm9aV2x5Y3lBOUlHeHZZV1JRWVhSamFDaDBhR1ZwY25Nc0lHSmhjMlVwTzF4dVhHNGdJR3hsZENCeVpYUWdQU0I3ZlR0Y2JseHVJQ0F2THlCR2IzSWdhVzVrWlhnZ2QyVWdhblZ6ZENCc1pYUWdhWFFnY0dGemN5QjBhSEp2ZFdkb0lHRnpJR2wwSUdSdlpYTnVKM1FnYUdGMlpTQmhibmtnYm1WalpYTnpZWEo1SUcxbFlXNXBibWN1WEc0Z0lDOHZJRXhsWVhacGJtY2djMkZ1YVhSNUlHTm9aV05yY3lCdmJpQjBhR2x6SUhSdklIUm9aU0JCVUVrZ1kyOXVjM1Z0WlhJZ2RHaGhkQ0J0WVhrZ2EyNXZkeUJ0YjNKbElHRmliM1YwSUhSb1pWeHVJQ0F2THlCdFpXRnVhVzVuSUdsdUlIUm9aV2x5SUc5M2JpQmpiMjUwWlhoMExseHVJQ0JwWmlBb2JXbHVaUzVwYm1SbGVDQjhmQ0IwYUdWcGNuTXVhVzVrWlhncElIdGNiaUFnSUNCeVpYUXVhVzVrWlhnZ1BTQnRhVzVsTG1sdVpHVjRJSHg4SUhSb1pXbHljeTVwYm1SbGVEdGNiaUFnZlZ4dVhHNGdJR2xtSUNodGFXNWxMbTVsZDBacGJHVk9ZVzFsSUh4OElIUm9aV2x5Y3k1dVpYZEdhV3hsVG1GdFpTa2dlMXh1SUNBZ0lHbG1JQ2doWm1sc1pVNWhiV1ZEYUdGdVoyVmtLRzFwYm1VcEtTQjdYRzRnSUNBZ0lDQXZMeUJPYnlCb1pXRmtaWElnYjNJZ2JtOGdZMmhoYm1kbElHbHVJRzkxY25Nc0lIVnpaU0IwYUdWcGNuTWdLR0Z1WkNCdmRYSnpJR2xtSUhSb1pXbHljeUJrYjJWeklHNXZkQ0JsZUdsemRDbGNiaUFnSUNBZ0lISmxkQzV2YkdSR2FXeGxUbUZ0WlNBOUlIUm9aV2x5Y3k1dmJHUkdhV3hsVG1GdFpTQjhmQ0J0YVc1bExtOXNaRVpwYkdWT1lXMWxPMXh1SUNBZ0lDQWdjbVYwTG01bGQwWnBiR1ZPWVcxbElEMGdkR2hsYVhKekxtNWxkMFpwYkdWT1lXMWxJSHg4SUcxcGJtVXVibVYzUm1sc1pVNWhiV1U3WEc0Z0lDQWdJQ0J5WlhRdWIyeGtTR1ZoWkdWeUlEMGdkR2hsYVhKekxtOXNaRWhsWVdSbGNpQjhmQ0J0YVc1bExtOXNaRWhsWVdSbGNqdGNiaUFnSUNBZ0lISmxkQzV1WlhkSVpXRmtaWElnUFNCMGFHVnBjbk11Ym1WM1NHVmhaR1Z5SUh4OElHMXBibVV1Ym1WM1NHVmhaR1Z5TzF4dUlDQWdJSDBnWld4elpTQnBaaUFvSVdacGJHVk9ZVzFsUTJoaGJtZGxaQ2gwYUdWcGNuTXBLU0I3WEc0Z0lDQWdJQ0F2THlCT2J5Qm9aV0ZrWlhJZ2IzSWdibThnWTJoaGJtZGxJR2x1SUhSb1pXbHljeXdnZFhObElHOTFjbk5jYmlBZ0lDQWdJSEpsZEM1dmJHUkdhV3hsVG1GdFpTQTlJRzFwYm1VdWIyeGtSbWxzWlU1aGJXVTdYRzRnSUNBZ0lDQnlaWFF1Ym1WM1JtbHNaVTVoYldVZ1BTQnRhVzVsTG01bGQwWnBiR1ZPWVcxbE8xeHVJQ0FnSUNBZ2NtVjBMbTlzWkVobFlXUmxjaUE5SUcxcGJtVXViMnhrU0dWaFpHVnlPMXh1SUNBZ0lDQWdjbVYwTG01bGQwaGxZV1JsY2lBOUlHMXBibVV1Ym1WM1NHVmhaR1Z5TzF4dUlDQWdJSDBnWld4elpTQjdYRzRnSUNBZ0lDQXZMeUJDYjNSb0lHTm9ZVzVuWldRdUxpNGdabWxuZFhKbElHbDBJRzkxZEZ4dUlDQWdJQ0FnY21WMExtOXNaRVpwYkdWT1lXMWxJRDBnYzJWc1pXTjBSbWxsYkdRb2NtVjBMQ0J0YVc1bExtOXNaRVpwYkdWT1lXMWxMQ0IwYUdWcGNuTXViMnhrUm1sc1pVNWhiV1VwTzF4dUlDQWdJQ0FnY21WMExtNWxkMFpwYkdWT1lXMWxJRDBnYzJWc1pXTjBSbWxsYkdRb2NtVjBMQ0J0YVc1bExtNWxkMFpwYkdWT1lXMWxMQ0IwYUdWcGNuTXVibVYzUm1sc1pVNWhiV1VwTzF4dUlDQWdJQ0FnY21WMExtOXNaRWhsWVdSbGNpQTlJSE5sYkdWamRFWnBaV3hrS0hKbGRDd2diV2x1WlM1dmJHUklaV0ZrWlhJc0lIUm9aV2x5Y3k1dmJHUklaV0ZrWlhJcE8xeHVJQ0FnSUNBZ2NtVjBMbTVsZDBobFlXUmxjaUE5SUhObGJHVmpkRVpwWld4a0tISmxkQ3dnYldsdVpTNXVaWGRJWldGa1pYSXNJSFJvWldseWN5NXVaWGRJWldGa1pYSXBPMXh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJSEpsZEM1b2RXNXJjeUE5SUZ0ZE8xeHVYRzRnSUd4bGRDQnRhVzVsU1c1a1pYZ2dQU0F3TEZ4dUlDQWdJQ0FnZEdobGFYSnpTVzVrWlhnZ1BTQXdMRnh1SUNBZ0lDQWdiV2x1WlU5bVpuTmxkQ0E5SURBc1hHNGdJQ0FnSUNCMGFHVnBjbk5QWm1aelpYUWdQU0F3TzF4dVhHNGdJSGRvYVd4bElDaHRhVzVsU1c1a1pYZ2dQQ0J0YVc1bExtaDFibXR6TG14bGJtZDBhQ0I4ZkNCMGFHVnBjbk5KYm1SbGVDQThJSFJvWldseWN5NW9kVzVyY3k1c1pXNW5kR2dwSUh0Y2JpQWdJQ0JzWlhRZ2JXbHVaVU4xY25KbGJuUWdQU0J0YVc1bExtaDFibXR6VzIxcGJtVkpibVJsZUYwZ2ZId2dlMjlzWkZOMFlYSjBPaUJKYm1acGJtbDBlWDBzWEc0Z0lDQWdJQ0FnSUhSb1pXbHljME4xY25KbGJuUWdQU0IwYUdWcGNuTXVhSFZ1YTNOYmRHaGxhWEp6U1c1a1pYaGRJSHg4SUh0dmJHUlRkR0Z5ZERvZ1NXNW1hVzVwZEhsOU8xeHVYRzRnSUNBZ2FXWWdLR2gxYm10Q1pXWnZjbVVvYldsdVpVTjFjbkpsYm5Rc0lIUm9aV2x5YzBOMWNuSmxiblFwS1NCN1hHNGdJQ0FnSUNBdkx5QlVhR2x6SUhCaGRHTm9JR1J2WlhNZ2JtOTBJRzkyWlhKc1lYQWdkMmwwYUNCaGJua2diMllnZEdobElHOTBhR1Z5Y3l3Z2VXRjVMbHh1SUNBZ0lDQWdjbVYwTG1oMWJtdHpMbkIxYzJnb1kyeHZibVZJZFc1cktHMXBibVZEZFhKeVpXNTBMQ0J0YVc1bFQyWm1jMlYwS1NrN1hHNGdJQ0FnSUNCdGFXNWxTVzVrWlhnckt6dGNiaUFnSUNBZ0lIUm9aV2x5YzA5bVpuTmxkQ0FyUFNCdGFXNWxRM1Z5Y21WdWRDNXVaWGRNYVc1bGN5QXRJRzFwYm1WRGRYSnlaVzUwTG05c1pFeHBibVZ6TzF4dUlDQWdJSDBnWld4elpTQnBaaUFvYUhWdWEwSmxabTl5WlNoMGFHVnBjbk5EZFhKeVpXNTBMQ0J0YVc1bFEzVnljbVZ1ZENrcElIdGNiaUFnSUNBZ0lDOHZJRlJvYVhNZ2NHRjBZMmdnWkc5bGN5QnViM1FnYjNabGNteGhjQ0IzYVhSb0lHRnVlU0J2WmlCMGFHVWdiM1JvWlhKekxDQjVZWGt1WEc0Z0lDQWdJQ0J5WlhRdWFIVnVhM011Y0hWemFDaGpiRzl1WlVoMWJtc29kR2hsYVhKelEzVnljbVZ1ZEN3Z2RHaGxhWEp6VDJabWMyVjBLU2s3WEc0Z0lDQWdJQ0IwYUdWcGNuTkpibVJsZUNzck8xeHVJQ0FnSUNBZ2JXbHVaVTltWm5ObGRDQXJQU0IwYUdWcGNuTkRkWEp5Wlc1MExtNWxkMHhwYm1WeklDMGdkR2hsYVhKelEzVnljbVZ1ZEM1dmJHUk1hVzVsY3p0Y2JpQWdJQ0I5SUdWc2MyVWdlMXh1SUNBZ0lDQWdMeThnVDNabGNteGhjQ3dnYldWeVoyVWdZWE1nWW1WemRDQjNaU0JqWVc1Y2JpQWdJQ0FnSUd4bGRDQnRaWEpuWldSSWRXNXJJRDBnZTF4dUlDQWdJQ0FnSUNCdmJHUlRkR0Z5ZERvZ1RXRjBhQzV0YVc0b2JXbHVaVU4xY25KbGJuUXViMnhrVTNSaGNuUXNJSFJvWldseWMwTjFjbkpsYm5RdWIyeGtVM1JoY25RcExGeHVJQ0FnSUNBZ0lDQnZiR1JNYVc1bGN6b2dNQ3hjYmlBZ0lDQWdJQ0FnYm1WM1UzUmhjblE2SUUxaGRHZ3ViV2x1S0cxcGJtVkRkWEp5Wlc1MExtNWxkMU4wWVhKMElDc2diV2x1WlU5bVpuTmxkQ3dnZEdobGFYSnpRM1Z5Y21WdWRDNXZiR1JUZEdGeWRDQXJJSFJvWldseWMwOW1abk5sZENrc1hHNGdJQ0FnSUNBZ0lHNWxkMHhwYm1Wek9pQXdMRnh1SUNBZ0lDQWdJQ0JzYVc1bGN6b2dXMTFjYmlBZ0lDQWdJSDA3WEc0Z0lDQWdJQ0J0WlhKblpVeHBibVZ6S0cxbGNtZGxaRWgxYm1zc0lHMXBibVZEZFhKeVpXNTBMbTlzWkZOMFlYSjBMQ0J0YVc1bFEzVnljbVZ1ZEM1c2FXNWxjeXdnZEdobGFYSnpRM1Z5Y21WdWRDNXZiR1JUZEdGeWRDd2dkR2hsYVhKelEzVnljbVZ1ZEM1c2FXNWxjeWs3WEc0Z0lDQWdJQ0IwYUdWcGNuTkpibVJsZUNzck8xeHVJQ0FnSUNBZ2JXbHVaVWx1WkdWNEt5czdYRzVjYmlBZ0lDQWdJSEpsZEM1b2RXNXJjeTV3ZFhOb0tHMWxjbWRsWkVoMWJtc3BPMXh1SUNBZ0lIMWNiaUFnZlZ4dVhHNGdJSEpsZEhWeWJpQnlaWFE3WEc1OVhHNWNibVoxYm1OMGFXOXVJR3h2WVdSUVlYUmphQ2h3WVhKaGJTd2dZbUZ6WlNrZ2UxeHVJQ0JwWmlBb2RIbHdaVzltSUhCaGNtRnRJRDA5UFNBbmMzUnlhVzVuSnlrZ2UxeHVJQ0FnSUdsbUlDZ29MMTVBUUM5dEtTNTBaWE4wS0hCaGNtRnRLU0I4ZkNBb0tDOWVTVzVrWlhnNkwyMHBMblJsYzNRb2NHRnlZVzBwS1NrZ2UxeHVJQ0FnSUNBZ2NtVjBkWEp1SUhCaGNuTmxVR0YwWTJnb2NHRnlZVzBwV3pCZE8xeHVJQ0FnSUgxY2JseHVJQ0FnSUdsbUlDZ2hZbUZ6WlNrZ2UxeHVJQ0FnSUNBZ2RHaHliM2NnYm1WM0lFVnljbTl5S0NkTmRYTjBJSEJ5YjNacFpHVWdZU0JpWVhObElISmxabVZ5Wlc1alpTQnZjaUJ3WVhOeklHbHVJR0VnY0dGMFkyZ25LVHRjYmlBZ0lDQjlYRzRnSUNBZ2NtVjBkWEp1SUhOMGNuVmpkSFZ5WldSUVlYUmphQ2gxYm1SbFptbHVaV1FzSUhWdVpHVm1hVzVsWkN3Z1ltRnpaU3dnY0dGeVlXMHBPMXh1SUNCOVhHNWNiaUFnY21WMGRYSnVJSEJoY21GdE8xeHVmVnh1WEc1bWRXNWpkR2x2YmlCbWFXeGxUbUZ0WlVOb1lXNW5aV1FvY0dGMFkyZ3BJSHRjYmlBZ2NtVjBkWEp1SUhCaGRHTm9MbTVsZDBacGJHVk9ZVzFsSUNZbUlIQmhkR05vTG01bGQwWnBiR1ZPWVcxbElDRTlQU0J3WVhSamFDNXZiR1JHYVd4bFRtRnRaVHRjYm4xY2JseHVablZ1WTNScGIyNGdjMlZzWldOMFJtbGxiR1FvYVc1a1pYZ3NJRzFwYm1Vc0lIUm9aV2x5Y3lrZ2UxeHVJQ0JwWmlBb2JXbHVaU0E5UFQwZ2RHaGxhWEp6S1NCN1hHNGdJQ0FnY21WMGRYSnVJRzFwYm1VN1hHNGdJSDBnWld4elpTQjdYRzRnSUNBZ2FXNWtaWGd1WTI5dVpteHBZM1FnUFNCMGNuVmxPMXh1SUNBZ0lISmxkSFZ5YmlCN2JXbHVaU3dnZEdobGFYSnpmVHRjYmlBZ2ZWeHVmVnh1WEc1bWRXNWpkR2x2YmlCb2RXNXJRbVZtYjNKbEtIUmxjM1FzSUdOb1pXTnJLU0I3WEc0Z0lISmxkSFZ5YmlCMFpYTjBMbTlzWkZOMFlYSjBJRHdnWTJobFkyc3ViMnhrVTNSaGNuUmNiaUFnSUNBbUppQW9kR1Z6ZEM1dmJHUlRkR0Z5ZENBcklIUmxjM1F1YjJ4a1RHbHVaWE1wSUR3Z1kyaGxZMnN1YjJ4a1UzUmhjblE3WEc1OVhHNWNibVoxYm1OMGFXOXVJR05zYjI1bFNIVnVheWhvZFc1ckxDQnZabVp6WlhRcElIdGNiaUFnY21WMGRYSnVJSHRjYmlBZ0lDQnZiR1JUZEdGeWREb2dhSFZ1YXk1dmJHUlRkR0Z5ZEN3Z2IyeGtUR2x1WlhNNklHaDFibXN1YjJ4a1RHbHVaWE1zWEc0Z0lDQWdibVYzVTNSaGNuUTZJR2gxYm1zdWJtVjNVM1JoY25RZ0t5QnZabVp6WlhRc0lHNWxkMHhwYm1Wek9pQm9kVzVyTG01bGQweHBibVZ6TEZ4dUlDQWdJR3hwYm1Wek9pQm9kVzVyTG14cGJtVnpYRzRnSUgwN1hHNTlYRzVjYm1aMWJtTjBhVzl1SUcxbGNtZGxUR2x1WlhNb2FIVnVheXdnYldsdVpVOW1abk5sZEN3Z2JXbHVaVXhwYm1WekxDQjBhR1ZwY2s5bVpuTmxkQ3dnZEdobGFYSk1hVzVsY3lrZ2UxeHVJQ0F2THlCVWFHbHpJSGRwYkd3Z1oyVnVaWEpoYkd4NUlISmxjM1ZzZENCcGJpQmhJR052Ym1ac2FXTjBaV1FnYUhWdWF5d2dZblYwSUhSb1pYSmxJR0Z5WlNCallYTmxjeUIzYUdWeVpTQjBhR1VnWTI5dWRHVjRkRnh1SUNBdkx5QnBjeUIwYUdVZ2IyNXNlU0J2ZG1WeWJHRndJSGRvWlhKbElIZGxJR05oYmlCemRXTmpaWE56Wm5Wc2JIa2diV1Z5WjJVZ2RHaGxJR052Ym5SbGJuUWdhR1Z5WlM1Y2JpQWdiR1YwSUcxcGJtVWdQU0I3YjJabWMyVjBPaUJ0YVc1bFQyWm1jMlYwTENCc2FXNWxjem9nYldsdVpVeHBibVZ6TENCcGJtUmxlRG9nTUgwc1hHNGdJQ0FnSUNCMGFHVnBjaUE5SUh0dlptWnpaWFE2SUhSb1pXbHlUMlptYzJWMExDQnNhVzVsY3pvZ2RHaGxhWEpNYVc1bGN5d2dhVzVrWlhnNklEQjlPMXh1WEc0Z0lDOHZJRWhoYm1Sc1pTQmhibmtnYkdWaFpHbHVaeUJqYjI1MFpXNTBYRzRnSUdsdWMyVnlkRXhsWVdScGJtY29hSFZ1YXl3Z2JXbHVaU3dnZEdobGFYSXBPMXh1SUNCcGJuTmxjblJNWldGa2FXNW5LR2gxYm1zc0lIUm9aV2x5TENCdGFXNWxLVHRjYmx4dUlDQXZMeUJPYjNjZ2FXNGdkR2hsSUc5MlpYSnNZWEFnWTI5dWRHVnVkQzRnVTJOaGJpQjBhSEp2ZFdkb0lHRnVaQ0J6Wld4bFkzUWdkR2hsSUdKbGMzUWdZMmhoYm1kbGN5Qm1jbTl0SUdWaFkyZ3VYRzRnSUhkb2FXeGxJQ2h0YVc1bExtbHVaR1Y0SUR3Z2JXbHVaUzVzYVc1bGN5NXNaVzVuZEdnZ0ppWWdkR2hsYVhJdWFXNWtaWGdnUENCMGFHVnBjaTVzYVc1bGN5NXNaVzVuZEdncElIdGNiaUFnSUNCc1pYUWdiV2x1WlVOMWNuSmxiblFnUFNCdGFXNWxMbXhwYm1WelcyMXBibVV1YVc1a1pYaGRMRnh1SUNBZ0lDQWdJQ0IwYUdWcGNrTjFjbkpsYm5RZ1BTQjBhR1ZwY2k1c2FXNWxjMXQwYUdWcGNpNXBibVJsZUYwN1hHNWNiaUFnSUNCcFppQW9LRzFwYm1WRGRYSnlaVzUwV3pCZElEMDlQU0FuTFNjZ2ZId2diV2x1WlVOMWNuSmxiblJiTUYwZ1BUMDlJQ2NySnlsY2JpQWdJQ0FnSUNBZ0ppWWdLSFJvWldseVEzVnljbVZ1ZEZzd1hTQTlQVDBnSnkwbklIeDhJSFJvWldseVEzVnljbVZ1ZEZzd1hTQTlQVDBnSnlzbktTa2dlMXh1SUNBZ0lDQWdMeThnUW05MGFDQnRiMlJwWm1sbFpDQXVMaTVjYmlBZ0lDQWdJRzExZEhWaGJFTm9ZVzVuWlNob2RXNXJMQ0J0YVc1bExDQjBhR1ZwY2lrN1hHNGdJQ0FnZlNCbGJITmxJR2xtSUNodGFXNWxRM1Z5Y21WdWRGc3dYU0E5UFQwZ0p5c25JQ1ltSUhSb1pXbHlRM1Z5Y21WdWRGc3dYU0E5UFQwZ0p5QW5LU0I3WEc0Z0lDQWdJQ0F2THlCTmFXNWxJR2x1YzJWeWRHVmtYRzRnSUNBZ0lDQm9kVzVyTG14cGJtVnpMbkIxYzJnb0xpNHVJR052Ykd4bFkzUkRhR0Z1WjJVb2JXbHVaU2twTzF4dUlDQWdJSDBnWld4elpTQnBaaUFvZEdobGFYSkRkWEp5Wlc1MFd6QmRJRDA5UFNBbkt5Y2dKaVlnYldsdVpVTjFjbkpsYm5SYk1GMGdQVDA5SUNjZ0p5a2dlMXh1SUNBZ0lDQWdMeThnVkdobGFYSnpJR2x1YzJWeWRHVmtYRzRnSUNBZ0lDQm9kVzVyTG14cGJtVnpMbkIxYzJnb0xpNHVJR052Ykd4bFkzUkRhR0Z1WjJVb2RHaGxhWElwS1R0Y2JpQWdJQ0I5SUdWc2MyVWdhV1lnS0cxcGJtVkRkWEp5Wlc1MFd6QmRJRDA5UFNBbkxTY2dKaVlnZEdobGFYSkRkWEp5Wlc1MFd6QmRJRDA5UFNBbklDY3BJSHRjYmlBZ0lDQWdJQzh2SUUxcGJtVWdjbVZ0YjNabFpDQnZjaUJsWkdsMFpXUmNiaUFnSUNBZ0lISmxiVzkyWVd3b2FIVnVheXdnYldsdVpTd2dkR2hsYVhJcE8xeHVJQ0FnSUgwZ1pXeHpaU0JwWmlBb2RHaGxhWEpEZFhKeVpXNTBXekJkSUQwOVBTQW5MU2NnSmlZZ2JXbHVaVU4xY25KbGJuUmJNRjBnUFQwOUlDY2dKeWtnZTF4dUlDQWdJQ0FnTHk4Z1ZHaGxhWElnY21WdGIzWmxaQ0J2Y2lCbFpHbDBaV1JjYmlBZ0lDQWdJSEpsYlc5MllXd29hSFZ1YXl3Z2RHaGxhWElzSUcxcGJtVXNJSFJ5ZFdVcE8xeHVJQ0FnSUgwZ1pXeHpaU0JwWmlBb2JXbHVaVU4xY25KbGJuUWdQVDA5SUhSb1pXbHlRM1Z5Y21WdWRDa2dlMXh1SUNBZ0lDQWdMeThnUTI5dWRHVjRkQ0JwWkdWdWRHbDBlVnh1SUNBZ0lDQWdhSFZ1YXk1c2FXNWxjeTV3ZFhOb0tHMXBibVZEZFhKeVpXNTBLVHRjYmlBZ0lDQWdJRzFwYm1VdWFXNWtaWGdyS3p0Y2JpQWdJQ0FnSUhSb1pXbHlMbWx1WkdWNEt5czdYRzRnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUM4dklFTnZiblJsZUhRZ2JXbHpiV0YwWTJoY2JpQWdJQ0FnSUdOdmJtWnNhV04wS0doMWJtc3NJR052Ykd4bFkzUkRhR0Z1WjJVb2JXbHVaU2tzSUdOdmJHeGxZM1JEYUdGdVoyVW9kR2hsYVhJcEtUdGNiaUFnSUNCOVhHNGdJSDFjYmx4dUlDQXZMeUJPYjNjZ2NIVnphQ0JoYm5sMGFHbHVaeUIwYUdGMElHMWhlU0JpWlNCeVpXMWhhVzVwYm1kY2JpQWdhVzV6WlhKMFZISmhhV3hwYm1jb2FIVnVheXdnYldsdVpTazdYRzRnSUdsdWMyVnlkRlJ5WVdsc2FXNW5LR2gxYm1zc0lIUm9aV2x5S1R0Y2JseHVJQ0JqWVd4alRHbHVaVU52ZFc1MEtHaDFibXNwTzF4dWZWeHVYRzVtZFc1amRHbHZiaUJ0ZFhSMVlXeERhR0Z1WjJVb2FIVnVheXdnYldsdVpTd2dkR2hsYVhJcElIdGNiaUFnYkdWMElHMTVRMmhoYm1kbGN5QTlJR052Ykd4bFkzUkRhR0Z1WjJVb2JXbHVaU2tzWEc0Z0lDQWdJQ0IwYUdWcGNrTm9ZVzVuWlhNZ1BTQmpiMnhzWldOMFEyaGhibWRsS0hSb1pXbHlLVHRjYmx4dUlDQnBaaUFvWVd4c1VtVnRiM1psY3lodGVVTm9ZVzVuWlhNcElDWW1JR0ZzYkZKbGJXOTJaWE1vZEdobGFYSkRhR0Z1WjJWektTa2dlMXh1SUNBZ0lDOHZJRk53WldOcFlXd2dZMkZ6WlNCbWIzSWdjbVZ0YjNabElHTm9ZVzVuWlhNZ2RHaGhkQ0JoY21VZ2MzVndaWEp6WlhSeklHOW1JRzl1WlNCaGJtOTBhR1Z5WEc0Z0lDQWdhV1lnS0dGeWNtRjVVM1JoY25SelYybDBhQ2h0ZVVOb1lXNW5aWE1zSUhSb1pXbHlRMmhoYm1kbGN5bGNiaUFnSUNBZ0lDQWdKaVlnYzJ0cGNGSmxiVzkyWlZOMWNHVnljMlYwS0hSb1pXbHlMQ0J0ZVVOb1lXNW5aWE1zSUcxNVEyaGhibWRsY3k1c1pXNW5kR2dnTFNCMGFHVnBja05vWVc1blpYTXViR1Z1WjNSb0tTa2dlMXh1SUNBZ0lDQWdhSFZ1YXk1c2FXNWxjeTV3ZFhOb0tDNHVMaUJ0ZVVOb1lXNW5aWE1wTzF4dUlDQWdJQ0FnY21WMGRYSnVPMXh1SUNBZ0lIMGdaV3h6WlNCcFppQW9ZWEp5WVhsVGRHRnlkSE5YYVhSb0tIUm9aV2x5UTJoaGJtZGxjeXdnYlhsRGFHRnVaMlZ6S1Z4dUlDQWdJQ0FnSUNBbUppQnphMmx3VW1WdGIzWmxVM1Z3WlhKelpYUW9iV2x1WlN3Z2RHaGxhWEpEYUdGdVoyVnpMQ0IwYUdWcGNrTm9ZVzVuWlhNdWJHVnVaM1JvSUMwZ2JYbERhR0Z1WjJWekxteGxibWQwYUNrcElIdGNiaUFnSUNBZ0lHaDFibXN1YkdsdVpYTXVjSFZ6YUNndUxpNGdkR2hsYVhKRGFHRnVaMlZ6S1R0Y2JpQWdJQ0FnSUhKbGRIVnlianRjYmlBZ0lDQjlYRzRnSUgwZ1pXeHpaU0JwWmlBb1lYSnlZWGxGY1hWaGJDaHRlVU5vWVc1blpYTXNJSFJvWldseVEyaGhibWRsY3lrcElIdGNiaUFnSUNCb2RXNXJMbXhwYm1WekxuQjFjMmdvTGk0dUlHMTVRMmhoYm1kbGN5azdYRzRnSUNBZ2NtVjBkWEp1TzF4dUlDQjlYRzVjYmlBZ1kyOXVabXhwWTNRb2FIVnVheXdnYlhsRGFHRnVaMlZ6TENCMGFHVnBja05vWVc1blpYTXBPMXh1ZlZ4dVhHNW1kVzVqZEdsdmJpQnlaVzF2ZG1Gc0tHaDFibXNzSUcxcGJtVXNJSFJvWldseUxDQnpkMkZ3S1NCN1hHNGdJR3hsZENCdGVVTm9ZVzVuWlhNZ1BTQmpiMnhzWldOMFEyaGhibWRsS0cxcGJtVXBMRnh1SUNBZ0lDQWdkR2hsYVhKRGFHRnVaMlZ6SUQwZ1kyOXNiR1ZqZEVOdmJuUmxlSFFvZEdobGFYSXNJRzE1UTJoaGJtZGxjeWs3WEc0Z0lHbG1JQ2gwYUdWcGNrTm9ZVzVuWlhNdWJXVnlaMlZrS1NCN1hHNGdJQ0FnYUhWdWF5NXNhVzVsY3k1d2RYTm9LQzR1TGlCMGFHVnBja05vWVc1blpYTXViV1Z5WjJWa0tUdGNiaUFnZlNCbGJITmxJSHRjYmlBZ0lDQmpiMjVtYkdsamRDaG9kVzVyTENCemQyRndJRDhnZEdobGFYSkRhR0Z1WjJWeklEb2diWGxEYUdGdVoyVnpMQ0J6ZDJGd0lEOGdiWGxEYUdGdVoyVnpJRG9nZEdobGFYSkRhR0Z1WjJWektUdGNiaUFnZlZ4dWZWeHVYRzVtZFc1amRHbHZiaUJqYjI1bWJHbGpkQ2hvZFc1ckxDQnRhVzVsTENCMGFHVnBjaWtnZTF4dUlDQm9kVzVyTG1OdmJtWnNhV04wSUQwZ2RISjFaVHRjYmlBZ2FIVnVheTVzYVc1bGN5NXdkWE5vS0h0Y2JpQWdJQ0JqYjI1bWJHbGpkRG9nZEhKMVpTeGNiaUFnSUNCdGFXNWxPaUJ0YVc1bExGeHVJQ0FnSUhSb1pXbHljem9nZEdobGFYSmNiaUFnZlNrN1hHNTlYRzVjYm1aMWJtTjBhVzl1SUdsdWMyVnlkRXhsWVdScGJtY29hSFZ1YXl3Z2FXNXpaWEowTENCMGFHVnBjaWtnZTF4dUlDQjNhR2xzWlNBb2FXNXpaWEowTG05bVpuTmxkQ0E4SUhSb1pXbHlMbTltWm5ObGRDQW1KaUJwYm5ObGNuUXVhVzVrWlhnZ1BDQnBibk5sY25RdWJHbHVaWE11YkdWdVozUm9LU0I3WEc0Z0lDQWdiR1YwSUd4cGJtVWdQU0JwYm5ObGNuUXViR2x1WlhOYmFXNXpaWEowTG1sdVpHVjRLeXRkTzF4dUlDQWdJR2gxYm1zdWJHbHVaWE11Y0hWemFDaHNhVzVsS1R0Y2JpQWdJQ0JwYm5ObGNuUXViMlptYzJWMEt5czdYRzRnSUgxY2JuMWNibVoxYm1OMGFXOXVJR2x1YzJWeWRGUnlZV2xzYVc1bktHaDFibXNzSUdsdWMyVnlkQ2tnZTF4dUlDQjNhR2xzWlNBb2FXNXpaWEowTG1sdVpHVjRJRHdnYVc1elpYSjBMbXhwYm1WekxteGxibWQwYUNrZ2UxeHVJQ0FnSUd4bGRDQnNhVzVsSUQwZ2FXNXpaWEowTG14cGJtVnpXMmx1YzJWeWRDNXBibVJsZUNzclhUdGNiaUFnSUNCb2RXNXJMbXhwYm1WekxuQjFjMmdvYkdsdVpTazdYRzRnSUgxY2JuMWNibHh1Wm5WdVkzUnBiMjRnWTI5c2JHVmpkRU5vWVc1blpTaHpkR0YwWlNrZ2UxeHVJQ0JzWlhRZ2NtVjBJRDBnVzEwc1hHNGdJQ0FnSUNCdmNHVnlZWFJwYjI0Z1BTQnpkR0YwWlM1c2FXNWxjMXR6ZEdGMFpTNXBibVJsZUYxYk1GMDdYRzRnSUhkb2FXeGxJQ2h6ZEdGMFpTNXBibVJsZUNBOElITjBZWFJsTG14cGJtVnpMbXhsYm1kMGFDa2dlMXh1SUNBZ0lHeGxkQ0JzYVc1bElEMGdjM1JoZEdVdWJHbHVaWE5iYzNSaGRHVXVhVzVrWlhoZE8xeHVYRzRnSUNBZ0x5OGdSM0p2ZFhBZ1lXUmthWFJwYjI1eklIUm9ZWFFnWVhKbElHbHRiV1ZrYVdGMFpXeDVJR0ZtZEdWeUlITjFZblJ5WVdOMGFXOXVjeUJoYm1RZ2RISmxZWFFnZEdobGJTQmhjeUJ2Ym1VZ1hDSmhkRzl0YVdOY0lpQnRiMlJwWm5rZ1kyaGhibWRsTGx4dUlDQWdJR2xtSUNodmNHVnlZWFJwYjI0Z1BUMDlJQ2N0SnlBbUppQnNhVzVsV3pCZElEMDlQU0FuS3ljcElIdGNiaUFnSUNBZ0lHOXdaWEpoZEdsdmJpQTlJQ2NySnp0Y2JpQWdJQ0I5WEc1Y2JpQWdJQ0JwWmlBb2IzQmxjbUYwYVc5dUlEMDlQU0JzYVc1bFd6QmRLU0I3WEc0Z0lDQWdJQ0J5WlhRdWNIVnphQ2hzYVc1bEtUdGNiaUFnSUNBZ0lITjBZWFJsTG1sdVpHVjRLeXM3WEc0Z0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lHSnlaV0ZyTzF4dUlDQWdJSDFjYmlBZ2ZWeHVYRzRnSUhKbGRIVnliaUJ5WlhRN1hHNTlYRzVtZFc1amRHbHZiaUJqYjJ4c1pXTjBRMjl1ZEdWNGRDaHpkR0YwWlN3Z2JXRjBZMmhEYUdGdVoyVnpLU0I3WEc0Z0lHeGxkQ0JqYUdGdVoyVnpJRDBnVzEwc1hHNGdJQ0FnSUNCdFpYSm5aV1FnUFNCYlhTeGNiaUFnSUNBZ0lHMWhkR05vU1c1a1pYZ2dQU0F3TEZ4dUlDQWdJQ0FnWTI5dWRHVjRkRU5vWVc1blpYTWdQU0JtWVd4elpTeGNiaUFnSUNBZ0lHTnZibVpzYVdOMFpXUWdQU0JtWVd4elpUdGNiaUFnZDJocGJHVWdLRzFoZEdOb1NXNWtaWGdnUENCdFlYUmphRU5vWVc1blpYTXViR1Z1WjNSb1hHNGdJQ0FnSUNBZ0lDWW1JSE4wWVhSbExtbHVaR1Y0SUR3Z2MzUmhkR1V1YkdsdVpYTXViR1Z1WjNSb0tTQjdYRzRnSUNBZ2JHVjBJR05vWVc1blpTQTlJSE4wWVhSbExteHBibVZ6VzNOMFlYUmxMbWx1WkdWNFhTeGNiaUFnSUNBZ0lDQWdiV0YwWTJnZ1BTQnRZWFJqYUVOb1lXNW5aWE5iYldGMFkyaEpibVJsZUYwN1hHNWNiaUFnSUNBdkx5QlBibU5sSUhkbEozWmxJR2hwZENCdmRYSWdZV1JrTENCMGFHVnVJSGRsSUdGeVpTQmtiMjVsWEc0Z0lDQWdhV1lnS0cxaGRHTm9XekJkSUQwOVBTQW5LeWNwSUh0Y2JpQWdJQ0FnSUdKeVpXRnJPMXh1SUNBZ0lIMWNibHh1SUNBZ0lHTnZiblJsZUhSRGFHRnVaMlZ6SUQwZ1kyOXVkR1Y0ZEVOb1lXNW5aWE1nZkh3Z1kyaGhibWRsV3pCZElDRTlQU0FuSUNjN1hHNWNiaUFnSUNCdFpYSm5aV1F1Y0hWemFDaHRZWFJqYUNrN1hHNGdJQ0FnYldGMFkyaEpibVJsZUNzck8xeHVYRzRnSUNBZ0x5OGdRMjl1YzNWdFpTQmhibmtnWVdSa2FYUnBiMjV6SUdsdUlIUm9aU0J2ZEdobGNpQmliRzlqYXlCaGN5QmhJR052Ym1ac2FXTjBJSFJ2SUdGMGRHVnRjSFJjYmlBZ0lDQXZMeUIwYnlCd2RXeHNJR2x1SUhSb1pTQnlaVzFoYVc1cGJtY2dZMjl1ZEdWNGRDQmhablJsY2lCMGFHbHpYRzRnSUNBZ2FXWWdLR05vWVc1blpWc3dYU0E5UFQwZ0p5c25LU0I3WEc0Z0lDQWdJQ0JqYjI1bWJHbGpkR1ZrSUQwZ2RISjFaVHRjYmx4dUlDQWdJQ0FnZDJocGJHVWdLR05vWVc1blpWc3dYU0E5UFQwZ0p5c25LU0I3WEc0Z0lDQWdJQ0FnSUdOb1lXNW5aWE11Y0hWemFDaGphR0Z1WjJVcE8xeHVJQ0FnSUNBZ0lDQmphR0Z1WjJVZ1BTQnpkR0YwWlM1c2FXNWxjMXNySzNOMFlYUmxMbWx1WkdWNFhUdGNiaUFnSUNBZ0lIMWNiaUFnSUNCOVhHNWNiaUFnSUNCcFppQW9iV0YwWTJndWMzVmljM1J5S0RFcElEMDlQU0JqYUdGdVoyVXVjM1ZpYzNSeUtERXBLU0I3WEc0Z0lDQWdJQ0JqYUdGdVoyVnpMbkIxYzJnb1kyaGhibWRsS1R0Y2JpQWdJQ0FnSUhOMFlYUmxMbWx1WkdWNEt5czdYRzRnSUNBZ2ZTQmxiSE5sSUh0Y2JpQWdJQ0FnSUdOdmJtWnNhV04wWldRZ1BTQjBjblZsTzF4dUlDQWdJSDFjYmlBZ2ZWeHVYRzRnSUdsbUlDZ29iV0YwWTJoRGFHRnVaMlZ6VzIxaGRHTm9TVzVrWlhoZElIeDhJQ2NuS1Zzd1hTQTlQVDBnSnlzblhHNGdJQ0FnSUNBbUppQmpiMjUwWlhoMFEyaGhibWRsY3lrZ2UxeHVJQ0FnSUdOdmJtWnNhV04wWldRZ1BTQjBjblZsTzF4dUlDQjlYRzVjYmlBZ2FXWWdLR052Ym1ac2FXTjBaV1FwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdZMmhoYm1kbGN6dGNiaUFnZlZ4dVhHNGdJSGRvYVd4bElDaHRZWFJqYUVsdVpHVjRJRHdnYldGMFkyaERhR0Z1WjJWekxteGxibWQwYUNrZ2UxeHVJQ0FnSUcxbGNtZGxaQzV3ZFhOb0tHMWhkR05vUTJoaGJtZGxjMXR0WVhSamFFbHVaR1Y0S3l0ZEtUdGNiaUFnZlZ4dVhHNGdJSEpsZEhWeWJpQjdYRzRnSUNBZ2JXVnlaMlZrTEZ4dUlDQWdJR05vWVc1blpYTmNiaUFnZlR0Y2JuMWNibHh1Wm5WdVkzUnBiMjRnWVd4c1VtVnRiM1psY3loamFHRnVaMlZ6S1NCN1hHNGdJSEpsZEhWeWJpQmphR0Z1WjJWekxuSmxaSFZqWlNobWRXNWpkR2x2Ymlod2NtVjJMQ0JqYUdGdVoyVXBJSHRjYmlBZ0lDQnlaWFIxY200Z2NISmxkaUFtSmlCamFHRnVaMlZiTUYwZ1BUMDlJQ2N0Snp0Y2JpQWdmU3dnZEhKMVpTazdYRzU5WEc1bWRXNWpkR2x2YmlCemEybHdVbVZ0YjNabFUzVndaWEp6WlhRb2MzUmhkR1VzSUhKbGJXOTJaVU5vWVc1blpYTXNJR1JsYkhSaEtTQjdYRzRnSUdadmNpQW9iR1YwSUdrZ1BTQXdPeUJwSUR3Z1pHVnNkR0U3SUdrckt5a2dlMXh1SUNBZ0lHeGxkQ0JqYUdGdVoyVkRiMjUwWlc1MElEMGdjbVZ0YjNabFEyaGhibWRsYzF0eVpXMXZkbVZEYUdGdVoyVnpMbXhsYm1kMGFDQXRJR1JsYkhSaElDc2dhVjB1YzNWaWMzUnlLREVwTzF4dUlDQWdJR2xtSUNoemRHRjBaUzVzYVc1bGMxdHpkR0YwWlM1cGJtUmxlQ0FySUdsZElDRTlQU0FuSUNjZ0t5QmphR0Z1WjJWRGIyNTBaVzUwS1NCN1hHNGdJQ0FnSUNCeVpYUjFjbTRnWm1Gc2MyVTdYRzRnSUNBZ2ZWeHVJQ0I5WEc1Y2JpQWdjM1JoZEdVdWFXNWtaWGdnS3owZ1pHVnNkR0U3WEc0Z0lISmxkSFZ5YmlCMGNuVmxPMXh1ZlZ4dVhHNW1kVzVqZEdsdmJpQmpZV3hqVDJ4a1RtVjNUR2x1WlVOdmRXNTBLR3hwYm1WektTQjdYRzRnSUd4bGRDQnZiR1JNYVc1bGN5QTlJREE3WEc0Z0lHeGxkQ0J1WlhkTWFXNWxjeUE5SURBN1hHNWNiaUFnYkdsdVpYTXVabTl5UldGamFDaG1kVzVqZEdsdmJpaHNhVzVsS1NCN1hHNGdJQ0FnYVdZZ0tIUjVjR1Z2WmlCc2FXNWxJQ0U5UFNBbmMzUnlhVzVuSnlrZ2UxeHVJQ0FnSUNBZ2JHVjBJRzE1UTI5MWJuUWdQU0JqWVd4alQyeGtUbVYzVEdsdVpVTnZkVzUwS0d4cGJtVXViV2x1WlNrN1hHNGdJQ0FnSUNCc1pYUWdkR2hsYVhKRGIzVnVkQ0E5SUdOaGJHTlBiR1JPWlhkTWFXNWxRMjkxYm5Rb2JHbHVaUzUwYUdWcGNuTXBPMXh1WEc0Z0lDQWdJQ0JwWmlBb2IyeGtUR2x1WlhNZ0lUMDlJSFZ1WkdWbWFXNWxaQ2tnZTF4dUlDQWdJQ0FnSUNCcFppQW9iWGxEYjNWdWRDNXZiR1JNYVc1bGN5QTlQVDBnZEdobGFYSkRiM1Z1ZEM1dmJHUk1hVzVsY3lrZ2UxeHVJQ0FnSUNBZ0lDQWdJRzlzWkV4cGJtVnpJQ3M5SUcxNVEyOTFiblF1YjJ4a1RHbHVaWE03WEc0Z0lDQWdJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0FnSUNBZ2IyeGtUR2x1WlhNZ1BTQjFibVJsWm1sdVpXUTdYRzRnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJSDFjYmx4dUlDQWdJQ0FnYVdZZ0tHNWxkMHhwYm1WeklDRTlQU0IxYm1SbFptbHVaV1FwSUh0Y2JpQWdJQ0FnSUNBZ2FXWWdLRzE1UTI5MWJuUXVibVYzVEdsdVpYTWdQVDA5SUhSb1pXbHlRMjkxYm5RdWJtVjNUR2x1WlhNcElIdGNiaUFnSUNBZ0lDQWdJQ0J1WlhkTWFXNWxjeUFyUFNCdGVVTnZkVzUwTG01bGQweHBibVZ6TzF4dUlDQWdJQ0FnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnSUNBZ0lHNWxkMHhwYm1WeklEMGdkVzVrWldacGJtVmtPMXh1SUNBZ0lDQWdJQ0I5WEc0Z0lDQWdJQ0I5WEc0Z0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lHbG1JQ2h1WlhkTWFXNWxjeUFoUFQwZ2RXNWtaV1pwYm1Wa0lDWW1JQ2hzYVc1bFd6QmRJRDA5UFNBbkt5Y2dmSHdnYkdsdVpWc3dYU0E5UFQwZ0p5QW5LU2tnZTF4dUlDQWdJQ0FnSUNCdVpYZE1hVzVsY3lzck8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2FXWWdLRzlzWkV4cGJtVnpJQ0U5UFNCMWJtUmxabWx1WldRZ0ppWWdLR3hwYm1WYk1GMGdQVDA5SUNjdEp5QjhmQ0JzYVc1bFd6QmRJRDA5UFNBbklDY3BLU0I3WEc0Z0lDQWdJQ0FnSUc5c1pFeHBibVZ6S3lzN1hHNGdJQ0FnSUNCOVhHNGdJQ0FnZlZ4dUlDQjlLVHRjYmx4dUlDQnlaWFIxY200Z2UyOXNaRXhwYm1WekxDQnVaWGRNYVc1bGMzMDdYRzU5WEc0aVhYMD1cbiIsIi8qaXN0YW5idWwgaWdub3JlIHN0YXJ0Ki9cblwidXNlIHN0cmljdFwiO1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHtcbiAgdmFsdWU6IHRydWVcbn0pO1xuZXhwb3J0cy5wYXJzZVBhdGNoID0gcGFyc2VQYXRjaDtcblxuLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbmZ1bmN0aW9uIHBhcnNlUGF0Y2godW5pRGlmZikge1xuICAvKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG4gIHZhclxuICAvKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuICBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcbiAgdmFyIGRpZmZzdHIgPSB1bmlEaWZmLnNwbGl0KC9cXHJcXG58W1xcblxcdlxcZlxcclxceDg1XS8pLFxuICAgICAgZGVsaW1pdGVycyA9IHVuaURpZmYubWF0Y2goL1xcclxcbnxbXFxuXFx2XFxmXFxyXFx4ODVdL2cpIHx8IFtdLFxuICAgICAgbGlzdCA9IFtdLFxuICAgICAgaSA9IDA7XG5cbiAgZnVuY3Rpb24gcGFyc2VJbmRleCgpIHtcbiAgICB2YXIgaW5kZXggPSB7fTtcbiAgICBsaXN0LnB1c2goaW5kZXgpOyAvLyBQYXJzZSBkaWZmIG1ldGFkYXRhXG5cbiAgICB3aGlsZSAoaSA8IGRpZmZzdHIubGVuZ3RoKSB7XG4gICAgICB2YXIgbGluZSA9IGRpZmZzdHJbaV07IC8vIEZpbGUgaGVhZGVyIGZvdW5kLCBlbmQgcGFyc2luZyBkaWZmIG1ldGFkYXRhXG5cbiAgICAgIGlmICgvXihcXC1cXC1cXC18XFwrXFwrXFwrfEBAKVxccy8udGVzdChsaW5lKSkge1xuICAgICAgICBicmVhaztcbiAgICAgIH0gLy8gRGlmZiBpbmRleFxuXG5cbiAgICAgIHZhciBoZWFkZXIgPSAvXig/OkluZGV4OnxkaWZmKD86IC1yIFxcdyspKylcXHMrKC4rPylcXHMqJC8uZXhlYyhsaW5lKTtcblxuICAgICAgaWYgKGhlYWRlcikge1xuICAgICAgICBpbmRleC5pbmRleCA9IGhlYWRlclsxXTtcbiAgICAgIH1cblxuICAgICAgaSsrO1xuICAgIH0gLy8gUGFyc2UgZmlsZSBoZWFkZXJzIGlmIHRoZXkgYXJlIGRlZmluZWQuIFVuaWZpZWQgZGlmZiByZXF1aXJlcyB0aGVtLCBidXRcbiAgICAvLyB0aGVyZSdzIG5vIHRlY2huaWNhbCBpc3N1ZXMgdG8gaGF2ZSBhbiBpc29sYXRlZCBodW5rIHdpdGhvdXQgZmlsZSBoZWFkZXJcblxuXG4gICAgcGFyc2VGaWxlSGVhZGVyKGluZGV4KTtcbiAgICBwYXJzZUZpbGVIZWFkZXIoaW5kZXgpOyAvLyBQYXJzZSBodW5rc1xuXG4gICAgaW5kZXguaHVua3MgPSBbXTtcblxuICAgIHdoaWxlIChpIDwgZGlmZnN0ci5sZW5ndGgpIHtcbiAgICAgIHZhciBfbGluZSA9IGRpZmZzdHJbaV07XG5cbiAgICAgIGlmICgvXihJbmRleDp8ZGlmZnxcXC1cXC1cXC18XFwrXFwrXFwrKVxccy8udGVzdChfbGluZSkpIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9IGVsc2UgaWYgKC9eQEAvLnRlc3QoX2xpbmUpKSB7XG4gICAgICAgIGluZGV4Lmh1bmtzLnB1c2gocGFyc2VIdW5rKCkpO1xuICAgICAgfSBlbHNlIGlmIChfbGluZSAmJiBvcHRpb25zLnN0cmljdCkge1xuICAgICAgICAvLyBJZ25vcmUgdW5leHBlY3RlZCBjb250ZW50IHVubGVzcyBpbiBzdHJpY3QgbW9kZVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gbGluZSAnICsgKGkgKyAxKSArICcgJyArIEpTT04uc3RyaW5naWZ5KF9saW5lKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpKys7XG4gICAgICB9XG4gICAgfVxuICB9IC8vIFBhcnNlcyB0aGUgLS0tIGFuZCArKysgaGVhZGVycywgaWYgbm9uZSBhcmUgZm91bmQsIG5vIGxpbmVzXG4gIC8vIGFyZSBjb25zdW1lZC5cblxuXG4gIGZ1bmN0aW9uIHBhcnNlRmlsZUhlYWRlcihpbmRleCkge1xuICAgIHZhciBmaWxlSGVhZGVyID0gL14oLS0tfFxcK1xcK1xcKylcXHMrKC4qKSQvLmV4ZWMoZGlmZnN0cltpXSk7XG5cbiAgICBpZiAoZmlsZUhlYWRlcikge1xuICAgICAgdmFyIGtleVByZWZpeCA9IGZpbGVIZWFkZXJbMV0gPT09ICctLS0nID8gJ29sZCcgOiAnbmV3JztcbiAgICAgIHZhciBkYXRhID0gZmlsZUhlYWRlclsyXS5zcGxpdCgnXFx0JywgMik7XG4gICAgICB2YXIgZmlsZU5hbWUgPSBkYXRhWzBdLnJlcGxhY2UoL1xcXFxcXFxcL2csICdcXFxcJyk7XG5cbiAgICAgIGlmICgvXlwiLipcIiQvLnRlc3QoZmlsZU5hbWUpKSB7XG4gICAgICAgIGZpbGVOYW1lID0gZmlsZU5hbWUuc3Vic3RyKDEsIGZpbGVOYW1lLmxlbmd0aCAtIDIpO1xuICAgICAgfVxuXG4gICAgICBpbmRleFtrZXlQcmVmaXggKyAnRmlsZU5hbWUnXSA9IGZpbGVOYW1lO1xuICAgICAgaW5kZXhba2V5UHJlZml4ICsgJ0hlYWRlciddID0gKGRhdGFbMV0gfHwgJycpLnRyaW0oKTtcbiAgICAgIGkrKztcbiAgICB9XG4gIH0gLy8gUGFyc2VzIGEgaHVua1xuICAvLyBUaGlzIGFzc3VtZXMgdGhhdCB3ZSBhcmUgYXQgdGhlIHN0YXJ0IG9mIGEgaHVuay5cblxuXG4gIGZ1bmN0aW9uIHBhcnNlSHVuaygpIHtcbiAgICB2YXIgY2h1bmtIZWFkZXJJbmRleCA9IGksXG4gICAgICAgIGNodW5rSGVhZGVyTGluZSA9IGRpZmZzdHJbaSsrXSxcbiAgICAgICAgY2h1bmtIZWFkZXIgPSBjaHVua0hlYWRlckxpbmUuc3BsaXQoL0BAIC0oXFxkKykoPzosKFxcZCspKT8gXFwrKFxcZCspKD86LChcXGQrKSk/IEBALyk7XG4gICAgdmFyIGh1bmsgPSB7XG4gICAgICBvbGRTdGFydDogK2NodW5rSGVhZGVyWzFdLFxuICAgICAgb2xkTGluZXM6IHR5cGVvZiBjaHVua0hlYWRlclsyXSA9PT0gJ3VuZGVmaW5lZCcgPyAxIDogK2NodW5rSGVhZGVyWzJdLFxuICAgICAgbmV3U3RhcnQ6ICtjaHVua0hlYWRlclszXSxcbiAgICAgIG5ld0xpbmVzOiB0eXBlb2YgY2h1bmtIZWFkZXJbNF0gPT09ICd1bmRlZmluZWQnID8gMSA6ICtjaHVua0hlYWRlcls0XSxcbiAgICAgIGxpbmVzOiBbXSxcbiAgICAgIGxpbmVkZWxpbWl0ZXJzOiBbXVxuICAgIH07IC8vIFVuaWZpZWQgRGlmZiBGb3JtYXQgcXVpcms6IElmIHRoZSBjaHVuayBzaXplIGlzIDAsXG4gICAgLy8gdGhlIGZpcnN0IG51bWJlciBpcyBvbmUgbG93ZXIgdGhhbiBvbmUgd291bGQgZXhwZWN0LlxuICAgIC8vIGh0dHBzOi8vd3d3LmFydGltYS5jb20vd2VibG9ncy92aWV3cG9zdC5qc3A/dGhyZWFkPTE2NDI5M1xuXG4gICAgaWYgKGh1bmsub2xkTGluZXMgPT09IDApIHtcbiAgICAgIGh1bmsub2xkU3RhcnQgKz0gMTtcbiAgICB9XG5cbiAgICBpZiAoaHVuay5uZXdMaW5lcyA9PT0gMCkge1xuICAgICAgaHVuay5uZXdTdGFydCArPSAxO1xuICAgIH1cblxuICAgIHZhciBhZGRDb3VudCA9IDAsXG4gICAgICAgIHJlbW92ZUNvdW50ID0gMDtcblxuICAgIGZvciAoOyBpIDwgZGlmZnN0ci5sZW5ndGg7IGkrKykge1xuICAgICAgLy8gTGluZXMgc3RhcnRpbmcgd2l0aCAnLS0tJyBjb3VsZCBiZSBtaXN0YWtlbiBmb3IgdGhlIFwicmVtb3ZlIGxpbmVcIiBvcGVyYXRpb25cbiAgICAgIC8vIEJ1dCB0aGV5IGNvdWxkIGJlIHRoZSBoZWFkZXIgZm9yIHRoZSBuZXh0IGZpbGUuIFRoZXJlZm9yZSBwcnVuZSBzdWNoIGNhc2VzIG91dC5cbiAgICAgIGlmIChkaWZmc3RyW2ldLmluZGV4T2YoJy0tLSAnKSA9PT0gMCAmJiBpICsgMiA8IGRpZmZzdHIubGVuZ3RoICYmIGRpZmZzdHJbaSArIDFdLmluZGV4T2YoJysrKyAnKSA9PT0gMCAmJiBkaWZmc3RyW2kgKyAyXS5pbmRleE9mKCdAQCcpID09PSAwKSB7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuXG4gICAgICB2YXIgb3BlcmF0aW9uID0gZGlmZnN0cltpXS5sZW5ndGggPT0gMCAmJiBpICE9IGRpZmZzdHIubGVuZ3RoIC0gMSA/ICcgJyA6IGRpZmZzdHJbaV1bMF07XG5cbiAgICAgIGlmIChvcGVyYXRpb24gPT09ICcrJyB8fCBvcGVyYXRpb24gPT09ICctJyB8fCBvcGVyYXRpb24gPT09ICcgJyB8fCBvcGVyYXRpb24gPT09ICdcXFxcJykge1xuICAgICAgICBodW5rLmxpbmVzLnB1c2goZGlmZnN0cltpXSk7XG4gICAgICAgIGh1bmsubGluZWRlbGltaXRlcnMucHVzaChkZWxpbWl0ZXJzW2ldIHx8ICdcXG4nKTtcblxuICAgICAgICBpZiAob3BlcmF0aW9uID09PSAnKycpIHtcbiAgICAgICAgICBhZGRDb3VudCsrO1xuICAgICAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PT0gJy0nKSB7XG4gICAgICAgICAgcmVtb3ZlQ291bnQrKztcbiAgICAgICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09ICcgJykge1xuICAgICAgICAgIGFkZENvdW50Kys7XG4gICAgICAgICAgcmVtb3ZlQ291bnQrKztcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgfSAvLyBIYW5kbGUgdGhlIGVtcHR5IGJsb2NrIGNvdW50IGNhc2VcblxuXG4gICAgaWYgKCFhZGRDb3VudCAmJiBodW5rLm5ld0xpbmVzID09PSAxKSB7XG4gICAgICBodW5rLm5ld0xpbmVzID0gMDtcbiAgICB9XG5cbiAgICBpZiAoIXJlbW92ZUNvdW50ICYmIGh1bmsub2xkTGluZXMgPT09IDEpIHtcbiAgICAgIGh1bmsub2xkTGluZXMgPSAwO1xuICAgIH0gLy8gUGVyZm9ybSBvcHRpb25hbCBzYW5pdHkgY2hlY2tpbmdcblxuXG4gICAgaWYgKG9wdGlvbnMuc3RyaWN0KSB7XG4gICAgICBpZiAoYWRkQ291bnQgIT09IGh1bmsubmV3TGluZXMpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBZGRlZCBsaW5lIGNvdW50IGRpZCBub3QgbWF0Y2ggZm9yIGh1bmsgYXQgbGluZSAnICsgKGNodW5rSGVhZGVySW5kZXggKyAxKSk7XG4gICAgICB9XG5cbiAgICAgIGlmIChyZW1vdmVDb3VudCAhPT0gaHVuay5vbGRMaW5lcykge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlbW92ZWQgbGluZSBjb3VudCBkaWQgbm90IG1hdGNoIGZvciBodW5rIGF0IGxpbmUgJyArIChjaHVua0hlYWRlckluZGV4ICsgMSkpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBodW5rO1xuICB9XG5cbiAgd2hpbGUgKGkgPCBkaWZmc3RyLmxlbmd0aCkge1xuICAgIHBhcnNlSW5kZXgoKTtcbiAgfVxuXG4gIHJldHVybiBsaXN0O1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSWk0dUx5NHVMM055WXk5d1lYUmphQzl3WVhKelpTNXFjeUpkTENKdVlXMWxjeUk2V3lKd1lYSnpaVkJoZEdOb0lpd2lkVzVwUkdsbVppSXNJbTl3ZEdsdmJuTWlMQ0prYVdabWMzUnlJaXdpYzNCc2FYUWlMQ0prWld4cGJXbDBaWEp6SWl3aWJXRjBZMmdpTENKc2FYTjBJaXdpYVNJc0luQmhjbk5sU1c1a1pYZ2lMQ0pwYm1SbGVDSXNJbkIxYzJnaUxDSnNaVzVuZEdnaUxDSnNhVzVsSWl3aWRHVnpkQ0lzSW1obFlXUmxjaUlzSW1WNFpXTWlMQ0p3WVhKelpVWnBiR1ZJWldGa1pYSWlMQ0pvZFc1cmN5SXNJbkJoY25ObFNIVnVheUlzSW5OMGNtbGpkQ0lzSWtWeWNtOXlJaXdpU2xOUFRpSXNJbk4wY21sdVoybG1lU0lzSW1acGJHVklaV0ZrWlhJaUxDSnJaWGxRY21WbWFYZ2lMQ0prWVhSaElpd2labWxzWlU1aGJXVWlMQ0p5WlhCc1lXTmxJaXdpYzNWaWMzUnlJaXdpZEhKcGJTSXNJbU5vZFc1clNHVmhaR1Z5U1c1a1pYZ2lMQ0pqYUhWdWEwaGxZV1JsY2t4cGJtVWlMQ0pqYUhWdWEwaGxZV1JsY2lJc0ltaDFibXNpTENKdmJHUlRkR0Z5ZENJc0ltOXNaRXhwYm1Weklpd2libVYzVTNSaGNuUWlMQ0p1WlhkTWFXNWxjeUlzSW14cGJtVnpJaXdpYkdsdVpXUmxiR2x0YVhSbGNuTWlMQ0poWkdSRGIzVnVkQ0lzSW5KbGJXOTJaVU52ZFc1MElpd2lhVzVrWlhoUFppSXNJbTl3WlhKaGRHbHZiaUpkTENKdFlYQndhVzVuY3lJNklqczdPenM3T3pzN08wRkJRVThzVTBGQlUwRXNWVUZCVkN4RFFVRnZRa01zVDBGQmNFSXNSVUZCTWtNN1FVRkJRVHRCUVVGQk8wRkJRVUU3UVVGQlpFTXNSVUZCUVVFc1QwRkJZeXgxUlVGQlNpeEZRVUZKTzBGQlEyaEVMRTFCUVVsRExFOUJRVThzUjBGQlIwWXNUMEZCVHl4RFFVRkRSeXhMUVVGU0xFTkJRV01zY1VKQlFXUXNRMEZCWkR0QlFVRkJMRTFCUTBsRExGVkJRVlVzUjBGQlIwb3NUMEZCVHl4RFFVRkRTeXhMUVVGU0xFTkJRV01zYzBKQlFXUXNTMEZCZVVNc1JVRkVNVVE3UVVGQlFTeE5RVVZKUXl4SlFVRkpMRWRCUVVjc1JVRkdXRHRCUVVGQkxFMUJSMGxETEVOQlFVTXNSMEZCUnl4RFFVaFNPenRCUVV0QkxGZEJRVk5ETEZWQlFWUXNSMEZCYzBJN1FVRkRjRUlzVVVGQlNVTXNTMEZCU3l4SFFVRkhMRVZCUVZvN1FVRkRRVWdzU1VGQlFVRXNTVUZCU1N4RFFVRkRTU3hKUVVGTUxFTkJRVlZFTEV0QlFWWXNSVUZHYjBJc1EwRkpjRUk3TzBGQlEwRXNWMEZCVDBZc1EwRkJReXhIUVVGSFRDeFBRVUZQTEVOQlFVTlRMRTFCUVc1Q0xFVkJRVEpDTzBGQlEzcENMRlZCUVVsRExFbEJRVWtzUjBGQlIxWXNUMEZCVHl4RFFVRkRTeXhEUVVGRUxFTkJRV3hDTEVOQlJIbENMRU5CUjNwQ096dEJRVU5CTEZWQlFVc3NkVUpCUVVRc1EwRkJNRUpOTEVsQlFURkNMRU5CUVN0Q1JDeEpRVUV2UWl4RFFVRktMRVZCUVRCRE8wRkJRM2hETzBGQlEwUXNUMEZPZDBJc1EwRlJla0k3T3p0QlFVTkJMRlZCUVVsRkxFMUJRVTBzUjBGQlNTd3dRMEZCUkN4RFFVRTJRME1zU1VGQk4wTXNRMEZCYTBSSUxFbEJRV3hFTEVOQlFXSTdPMEZCUTBFc1ZVRkJTVVVzVFVGQlNpeEZRVUZaTzBGQlExWk1MRkZCUVVGQkxFdEJRVXNzUTBGQlEwRXNTMEZCVGl4SFFVRmpTeXhOUVVGTkxFTkJRVU1zUTBGQlJDeERRVUZ3UWp0QlFVTkVPenRCUVVWRVVDeE5RVUZCUVN4RFFVRkRPMEZCUTBZc1MwRndRbTFDTEVOQmMwSndRanRCUVVOQk96czdRVUZEUVZNc1NVRkJRVUVzWlVGQlpTeERRVUZEVUN4TFFVRkVMRU5CUVdZN1FVRkRRVThzU1VGQlFVRXNaVUZCWlN4RFFVRkRVQ3hMUVVGRUxFTkJRV1lzUTBGNlFtOUNMRU5CTWtKd1FqczdRVUZEUVVFc1NVRkJRVUVzUzBGQlN5eERRVUZEVVN4TFFVRk9MRWRCUVdNc1JVRkJaRHM3UVVGRlFTeFhRVUZQVml4RFFVRkRMRWRCUVVkTUxFOUJRVThzUTBGQlExTXNUVUZCYmtJc1JVRkJNa0k3UVVGRGVrSXNWVUZCU1VNc1MwRkJTU3hIUVVGSFZpeFBRVUZQTEVOQlFVTkxMRU5CUVVRc1EwRkJiRUk3TzBGQlJVRXNWVUZCU3l4blEwRkJSQ3hEUVVGdFEwMHNTVUZCYmtNc1EwRkJkME5FTEV0QlFYaERMRU5CUVVvc1JVRkJiVVE3UVVGRGFrUTdRVUZEUkN4UFFVWkVMRTFCUlU4c1NVRkJTeXhMUVVGRUxFTkJRVkZETEVsQlFWSXNRMEZCWVVRc1MwRkJZaXhEUVVGS0xFVkJRWGRDTzBGQlF6ZENTQ3hSUVVGQlFTeExRVUZMTEVOQlFVTlJMRXRCUVU0c1EwRkJXVkFzU1VGQldpeERRVUZwUWxFc1UwRkJVeXhGUVVFeFFqdEJRVU5FTEU5QlJrMHNUVUZGUVN4SlFVRkpUaXhMUVVGSkxFbEJRVWxZTEU5QlFVOHNRMEZCUTJ0Q0xFMUJRWEJDTEVWQlFUUkNPMEZCUTJwRE8wRkJRMEVzWTBGQlRTeEpRVUZKUXl4TFFVRktMRU5CUVZVc2JVSkJRVzFDWWl4RFFVRkRMRWRCUVVjc1EwRkJka0lzU1VGQk5FSXNSMEZCTlVJc1IwRkJhME5qTEVsQlFVa3NRMEZCUTBNc1UwRkJUQ3hEUVVGbFZpeExRVUZtTEVOQlFUVkRMRU5CUVU0N1FVRkRSQ3hQUVVoTkxFMUJSMEU3UVVGRFRFd3NVVUZCUVVFc1EwRkJRenRCUVVOR08wRkJRMFk3UVVGRFJpeEhRV3hFSzBNc1EwRnZSR2hFTzBGQlEwRTdPenRCUVVOQkxGZEJRVk5UTEdWQlFWUXNRMEZCZVVKUUxFdEJRWHBDTEVWQlFXZERPMEZCUXpsQ0xGRkJRVTFqTEZWQlFWVXNSMEZCU1N4MVFrRkJSQ3hEUVVFd1FsSXNTVUZCTVVJc1EwRkJLMEppTEU5QlFVOHNRMEZCUTBzc1EwRkJSQ3hEUVVGMFF5eERRVUZ1UWpzN1FVRkRRU3hSUVVGSlowSXNWVUZCU2l4RlFVRm5RanRCUVVOa0xGVkJRVWxETEZOQlFWTXNSMEZCUjBRc1ZVRkJWU3hEUVVGRExFTkJRVVFzUTBGQlZpeExRVUZyUWl4TFFVRnNRaXhIUVVFd1FpeExRVUV4UWl4SFFVRnJReXhMUVVGc1JEdEJRVU5CTEZWQlFVMUZMRWxCUVVrc1IwRkJSMFlzVlVGQlZTeERRVUZETEVOQlFVUXNRMEZCVml4RFFVRmpjRUlzUzBGQlpDeERRVUZ2UWl4SlFVRndRaXhGUVVFd1FpeERRVUV4UWl4RFFVRmlPMEZCUTBFc1ZVRkJTWFZDTEZGQlFWRXNSMEZCUjBRc1NVRkJTU3hEUVVGRExFTkJRVVFzUTBGQlNpeERRVUZSUlN4UFFVRlNMRU5CUVdkQ0xFOUJRV2hDTEVWQlFYbENMRWxCUVhwQ0xFTkJRV1k3TzBGQlEwRXNWVUZCU3l4UlFVRkVMRU5CUVZka0xFbEJRVmdzUTBGQlowSmhMRkZCUVdoQ0xFTkJRVW9zUlVGQkswSTdRVUZETjBKQkxGRkJRVUZCTEZGQlFWRXNSMEZCUjBFc1VVRkJVU3hEUVVGRFJTeE5RVUZVTEVOQlFXZENMRU5CUVdoQ0xFVkJRVzFDUml4UlFVRlJMRU5CUVVObUxFMUJRVlFzUjBGQmEwSXNRMEZCY2tNc1EwRkJXRHRCUVVORU96dEJRVU5FUml4TlFVRkJRU3hMUVVGTExFTkJRVU5sTEZOQlFWTXNSMEZCUnl4VlFVRmlMRU5CUVV3c1IwRkJaME5GTEZGQlFXaERPMEZCUTBGcVFpeE5RVUZCUVN4TFFVRkxMRU5CUVVObExGTkJRVk1zUjBGQlJ5eFJRVUZpTEVOQlFVd3NSMEZCT0VJc1EwRkJRME1zU1VGQlNTeERRVUZETEVOQlFVUXNRMEZCU2l4SlFVRlhMRVZCUVZvc1JVRkJaMEpKTEVsQlFXaENMRVZCUVRsQ08wRkJSVUYwUWl4TlFVRkJRU3hEUVVGRE8wRkJRMFk3UVVGRFJpeEhRWEJGSzBNc1EwRnpSV2hFTzBGQlEwRTdPenRCUVVOQkxGZEJRVk5YTEZOQlFWUXNSMEZCY1VJN1FVRkRia0lzVVVGQlNWa3NaMEpCUVdkQ0xFZEJRVWQyUWl4RFFVRjJRanRCUVVGQkxGRkJRMGwzUWl4bFFVRmxMRWRCUVVjM1FpeFBRVUZQTEVOQlFVTkxMRU5CUVVNc1JVRkJSaXhEUVVRM1FqdEJRVUZCTEZGQlJVbDVRaXhYUVVGWExFZEJRVWRFTEdWQlFXVXNRMEZCUXpWQ0xFdEJRV2hDTEVOQlFYTkNMRFJEUVVGMFFpeERRVVpzUWp0QlFVbEJMRkZCUVVrNFFpeEpRVUZKTEVkQlFVYzdRVUZEVkVNc1RVRkJRVUVzVVVGQlVTeEZRVUZGTEVOQlFVTkdMRmRCUVZjc1EwRkJReXhEUVVGRUxFTkJSR0k3UVVGRlZFY3NUVUZCUVVFc1VVRkJVU3hGUVVGRkxFOUJRVTlJTEZkQlFWY3NRMEZCUXl4RFFVRkVMRU5CUVd4Q0xFdEJRVEJDTEZkQlFURkNMRWRCUVhkRExFTkJRWGhETEVkQlFUUkRMRU5CUVVOQkxGZEJRVmNzUTBGQlF5eERRVUZFTEVOQlJucEVPMEZCUjFSSkxFMUJRVUZCTEZGQlFWRXNSVUZCUlN4RFFVRkRTaXhYUVVGWExFTkJRVU1zUTBGQlJDeERRVWhpTzBGQlNWUkxMRTFCUVVGQkxGRkJRVkVzUlVGQlJTeFBRVUZQVEN4WFFVRlhMRU5CUVVNc1EwRkJSQ3hEUVVGc1FpeExRVUV3UWl4WFFVRXhRaXhIUVVGM1F5eERRVUY0UXl4SFFVRTBReXhEUVVGRFFTeFhRVUZYTEVOQlFVTXNRMEZCUkN4RFFVcDZSRHRCUVV0VVRTeE5RVUZCUVN4TFFVRkxMRVZCUVVVc1JVRk1SVHRCUVUxVVF5eE5RVUZCUVN4alFVRmpMRVZCUVVVN1FVRk9VQ3hMUVVGWUxFTkJURzFDTEVOQlkyNUNPMEZCUTBFN1FVRkRRVHM3UVVGRFFTeFJRVUZKVGl4SlFVRkpMRU5CUVVORkxGRkJRVXdzUzBGQmEwSXNRMEZCZEVJc1JVRkJlVUk3UVVGRGRrSkdMRTFCUVVGQkxFbEJRVWtzUTBGQlEwTXNVVUZCVEN4SlFVRnBRaXhEUVVGcVFqdEJRVU5FT3p0QlFVTkVMRkZCUVVsRUxFbEJRVWtzUTBGQlEwa3NVVUZCVEN4TFFVRnJRaXhEUVVGMFFpeEZRVUY1UWp0QlFVTjJRa29zVFVGQlFVRXNTVUZCU1N4RFFVRkRSeXhSUVVGTUxFbEJRV2xDTEVOQlFXcENPMEZCUTBRN08wRkJSVVFzVVVGQlNVa3NVVUZCVVN4SFFVRkhMRU5CUVdZN1FVRkJRU3hSUVVOSlF5eFhRVUZYTEVkQlFVY3NRMEZFYkVJN08wRkJSVUVzVjBGQlQyeERMRU5CUVVNc1IwRkJSMHdzVDBGQlR5eERRVUZEVXl4TlFVRnVRaXhGUVVFeVFrb3NRMEZCUXl4RlFVRTFRaXhGUVVGblF6dEJRVU01UWp0QlFVTkJPMEZCUTBFc1ZVRkJTVXdzVDBGQlR5eERRVUZEU3l4RFFVRkVMRU5CUVZBc1EwRkJWMjFETEU5QlFWZ3NRMEZCYlVJc1RVRkJia0lzVFVGQkswSXNRMEZCTDBJc1NVRkRUVzVETEVOQlFVTXNSMEZCUnl4RFFVRktMRWRCUVZGTUxFOUJRVThzUTBGQlExTXNUVUZFZEVJc1NVRkZTMVFzVDBGQlR5eERRVUZEU3l4RFFVRkRMRWRCUVVjc1EwRkJUQ3hEUVVGUUxFTkJRV1Z0UXl4UFFVRm1MRU5CUVhWQ0xFMUJRWFpDTEUxQlFXMURMRU5CUm5oRExFbEJSMHQ0UXl4UFFVRlBMRU5CUVVOTExFTkJRVU1zUjBGQlJ5eERRVUZNTEVOQlFWQXNRMEZCWlcxRExFOUJRV1lzUTBGQmRVSXNTVUZCZGtJc1RVRkJhVU1zUTBGSU1VTXNSVUZITmtNN1FVRkRla003UVVGRFNEczdRVUZEUkN4VlFVRkpReXhUUVVGVExFZEJRVWw2UXl4UFFVRlBMRU5CUVVOTExFTkJRVVFzUTBGQlVDeERRVUZYU1N4TlFVRllMRWxCUVhGQ0xFTkJRWEpDTEVsQlFUQkNTaXhEUVVGRExFbEJRVXRNTEU5QlFVOHNRMEZCUTFNc1RVRkJVaXhIUVVGcFFpeERRVUZzUkN4SFFVRjNSQ3hIUVVGNFJDeEhRVUU0UkZRc1QwRkJUeXhEUVVGRFN5eERRVUZFTEVOQlFWQXNRMEZCVnl4RFFVRllMRU5CUVRsRk96dEJRVVZCTEZWQlFVbHZReXhUUVVGVExFdEJRVXNzUjBGQlpDeEpRVUZ4UWtFc1UwRkJVeXhMUVVGTExFZEJRVzVETEVsQlFUQkRRU3hUUVVGVExFdEJRVXNzUjBGQmVFUXNTVUZCSzBSQkxGTkJRVk1zUzBGQlN5eEpRVUZxUml4RlFVRjFSanRCUVVOeVJsWXNVVUZCUVVFc1NVRkJTU3hEUVVGRFN5eExRVUZNTEVOQlFWYzFRaXhKUVVGWUxFTkJRV2RDVWl4UFFVRlBMRU5CUVVOTExFTkJRVVFzUTBGQmRrSTdRVUZEUVRCQ0xGRkJRVUZCTEVsQlFVa3NRMEZCUTAwc1kwRkJUQ3hEUVVGdlFqZENMRWxCUVhCQ0xFTkJRWGxDVGl4VlFVRlZMRU5CUVVOSExFTkJRVVFzUTBGQlZpeEpRVUZwUWl4SlFVRXhRenM3UVVGRlFTeFpRVUZKYjBNc1UwRkJVeXhMUVVGTExFZEJRV3hDTEVWQlFYVkNPMEZCUTNKQ1NDeFZRVUZCUVN4UlFVRlJPMEZCUTFRc1UwRkdSQ3hOUVVWUExFbEJRVWxITEZOQlFWTXNTMEZCU3l4SFFVRnNRaXhGUVVGMVFqdEJRVU0xUWtZc1ZVRkJRVUVzVjBGQlZ6dEJRVU5hTEZOQlJrMHNUVUZGUVN4SlFVRkpSU3hUUVVGVExFdEJRVXNzUjBGQmJFSXNSVUZCZFVJN1FVRkROVUpJTEZWQlFVRkJMRkZCUVZFN1FVRkRVa01zVlVGQlFVRXNWMEZCVnp0QlFVTmFPMEZCUTBZc1QwRmFSQ3hOUVZsUE8wRkJRMHc3UVVGRFJEdEJRVU5HTEV0QmNFUnJRaXhEUVhORWJrSTdPenRCUVVOQkxGRkJRVWtzUTBGQlEwUXNVVUZCUkN4SlFVRmhVQ3hKUVVGSkxFTkJRVU5KTEZGQlFVd3NTMEZCYTBJc1EwRkJia01zUlVGQmMwTTdRVUZEY0VOS0xFMUJRVUZCTEVsQlFVa3NRMEZCUTBrc1VVRkJUQ3hIUVVGblFpeERRVUZvUWp0QlFVTkVPenRCUVVORUxGRkJRVWtzUTBGQlEwa3NWMEZCUkN4SlFVRm5RbElzU1VGQlNTeERRVUZEUlN4UlFVRk1MRXRCUVd0Q0xFTkJRWFJETEVWQlFYbERPMEZCUTNaRFJpeE5RVUZCUVN4SlFVRkpMRU5CUVVORkxGRkJRVXdzUjBGQlowSXNRMEZCYUVJN1FVRkRSQ3hMUVRWRWEwSXNRMEU0Ukc1Q096czdRVUZEUVN4UlFVRkpiRU1zVDBGQlR5eERRVUZEYTBJc1RVRkJXaXhGUVVGdlFqdEJRVU5zUWl4VlFVRkpjVUlzVVVGQlVTeExRVUZMVUN4SlFVRkpMRU5CUVVOSkxGRkJRWFJDTEVWQlFXZERPMEZCUXpsQ0xHTkJRVTBzU1VGQlNXcENMRXRCUVVvc1EwRkJWU3h6UkVGQmMwUlZMR2RDUVVGblFpeEhRVUZITEVOQlFYcEZMRU5CUVZZc1EwRkJUanRCUVVORU96dEJRVU5FTEZWQlFVbFhMRmRCUVZjc1MwRkJTMUlzU1VGQlNTeERRVUZEUlN4UlFVRjZRaXhGUVVGdFF6dEJRVU5xUXl4alFVRk5MRWxCUVVsbUxFdEJRVW9zUTBGQlZTeDNSRUZCZDBSVkxHZENRVUZuUWl4SFFVRkhMRU5CUVRORkxFTkJRVllzUTBGQlRqdEJRVU5FTzBGQlEwWTdPMEZCUlVRc1YwRkJUMGNzU1VGQlVEdEJRVU5FT3p0QlFVVkVMRk5CUVU4eFFpeERRVUZETEVkQlFVZE1MRTlCUVU4c1EwRkJRMU1zVFVGQmJrSXNSVUZCTWtJN1FVRkRla0pJTEVsQlFVRkJMRlZCUVZVN1FVRkRXRHM3UVVGRlJDeFRRVUZQUml4SlFVRlFPMEZCUTBRaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SmxlSEJ2Y25RZ1puVnVZM1JwYjI0Z2NHRnljMlZRWVhSamFDaDFibWxFYVdabUxDQnZjSFJwYjI1eklEMGdlMzBwSUh0Y2JpQWdiR1YwSUdScFptWnpkSElnUFNCMWJtbEVhV1ptTG5Od2JHbDBLQzljWEhKY1hHNThXMXhjYmx4Y2RseGNabHhjY2x4Y2VEZzFYUzhwTEZ4dUlDQWdJQ0FnWkdWc2FXMXBkR1Z5Y3lBOUlIVnVhVVJwWm1ZdWJXRjBZMmdvTDF4Y2NseGNibnhiWEZ4dVhGeDJYRnhtWEZ4eVhGeDRPRFZkTDJjcElIeDhJRnRkTEZ4dUlDQWdJQ0FnYkdsemRDQTlJRnRkTEZ4dUlDQWdJQ0FnYVNBOUlEQTdYRzVjYmlBZ1puVnVZM1JwYjI0Z2NHRnljMlZKYm1SbGVDZ3BJSHRjYmlBZ0lDQnNaWFFnYVc1a1pYZ2dQU0I3ZlR0Y2JpQWdJQ0JzYVhOMExuQjFjMmdvYVc1a1pYZ3BPMXh1WEc0Z0lDQWdMeThnVUdGeWMyVWdaR2xtWmlCdFpYUmhaR0YwWVZ4dUlDQWdJSGRvYVd4bElDaHBJRHdnWkdsbVpuTjBjaTVzWlc1bmRHZ3BJSHRjYmlBZ0lDQWdJR3hsZENCc2FXNWxJRDBnWkdsbVpuTjBjbHRwWFR0Y2JseHVJQ0FnSUNBZ0x5OGdSbWxzWlNCb1pXRmtaWElnWm05MWJtUXNJR1Z1WkNCd1lYSnphVzVuSUdScFptWWdiV1YwWVdSaGRHRmNiaUFnSUNBZ0lHbG1JQ2dvTDE0b1hGd3RYRnd0WEZ3dGZGeGNLMXhjSzF4Y0szeEFRQ2xjWEhNdktTNTBaWE4wS0d4cGJtVXBLU0I3WEc0Z0lDQWdJQ0FnSUdKeVpXRnJPMXh1SUNBZ0lDQWdmVnh1WEc0Z0lDQWdJQ0F2THlCRWFXWm1JR2x1WkdWNFhHNGdJQ0FnSUNCc1pYUWdhR1ZoWkdWeUlEMGdLQzllS0Q4NlNXNWtaWGc2ZkdScFptWW9Qem9nTFhJZ1hGeDNLeWtyS1Z4Y2N5c29MaXMvS1Z4Y2N5b2tMeWt1WlhobFl5aHNhVzVsS1R0Y2JpQWdJQ0FnSUdsbUlDaG9aV0ZrWlhJcElIdGNiaUFnSUNBZ0lDQWdhVzVrWlhndWFXNWtaWGdnUFNCb1pXRmtaWEpiTVYwN1hHNGdJQ0FnSUNCOVhHNWNiaUFnSUNBZ0lHa3JLenRjYmlBZ0lDQjlYRzVjYmlBZ0lDQXZMeUJRWVhKelpTQm1hV3hsSUdobFlXUmxjbk1nYVdZZ2RHaGxlU0JoY21VZ1pHVm1hVzVsWkM0Z1ZXNXBabWxsWkNCa2FXWm1JSEpsY1hWcGNtVnpJSFJvWlcwc0lHSjFkRnh1SUNBZ0lDOHZJSFJvWlhKbEozTWdibThnZEdWamFHNXBZMkZzSUdsemMzVmxjeUIwYnlCb1lYWmxJR0Z1SUdsemIyeGhkR1ZrSUdoMWJtc2dkMmwwYUc5MWRDQm1hV3hsSUdobFlXUmxjbHh1SUNBZ0lIQmhjbk5sUm1sc1pVaGxZV1JsY2locGJtUmxlQ2s3WEc0Z0lDQWdjR0Z5YzJWR2FXeGxTR1ZoWkdWeUtHbHVaR1Y0S1R0Y2JseHVJQ0FnSUM4dklGQmhjbk5sSUdoMWJtdHpYRzRnSUNBZ2FXNWtaWGd1YUhWdWEzTWdQU0JiWFR0Y2JseHVJQ0FnSUhkb2FXeGxJQ2hwSUR3Z1pHbG1abk4wY2k1c1pXNW5kR2dwSUh0Y2JpQWdJQ0FnSUd4bGRDQnNhVzVsSUQwZ1pHbG1abk4wY2x0cFhUdGNibHh1SUNBZ0lDQWdhV1lnS0NndlhpaEpibVJsZURwOFpHbG1abnhjWEMxY1hDMWNYQzE4WEZ3clhGd3JYRndyS1Z4Y2N5OHBMblJsYzNRb2JHbHVaU2twSUh0Y2JpQWdJQ0FnSUNBZ1luSmxZV3M3WEc0Z0lDQWdJQ0I5SUdWc2MyVWdhV1lnS0NndlhrQkFMeWt1ZEdWemRDaHNhVzVsS1NrZ2UxeHVJQ0FnSUNBZ0lDQnBibVJsZUM1b2RXNXJjeTV3ZFhOb0tIQmhjbk5sU0hWdWF5Z3BLVHRjYmlBZ0lDQWdJSDBnWld4elpTQnBaaUFvYkdsdVpTQW1KaUJ2Y0hScGIyNXpMbk4wY21samRDa2dlMXh1SUNBZ0lDQWdJQ0F2THlCSloyNXZjbVVnZFc1bGVIQmxZM1JsWkNCamIyNTBaVzUwSUhWdWJHVnpjeUJwYmlCemRISnBZM1FnYlc5a1pWeHVJQ0FnSUNBZ0lDQjBhSEp2ZHlCdVpYY2dSWEp5YjNJb0oxVnVhMjV2ZDI0Z2JHbHVaU0FuSUNzZ0tHa2dLeUF4S1NBcklDY2dKeUFySUVwVFQwNHVjM1J5YVc1bmFXWjVLR3hwYm1VcEtUdGNiaUFnSUNBZ0lIMGdaV3h6WlNCN1hHNGdJQ0FnSUNBZ0lHa3JLenRjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzRnSUgxY2JseHVJQ0F2THlCUVlYSnpaWE1nZEdobElDMHRMU0JoYm1RZ0t5c3JJR2hsWVdSbGNuTXNJR2xtSUc1dmJtVWdZWEpsSUdadmRXNWtMQ0J1YnlCc2FXNWxjMXh1SUNBdkx5QmhjbVVnWTI5dWMzVnRaV1F1WEc0Z0lHWjFibU4wYVc5dUlIQmhjbk5sUm1sc1pVaGxZV1JsY2locGJtUmxlQ2tnZTF4dUlDQWdJR052Ym5OMElHWnBiR1ZJWldGa1pYSWdQU0FvTDE0b0xTMHRmRnhjSzF4Y0sxeGNLeWxjWEhNcktDNHFLU1F2S1M1bGVHVmpLR1JwWm1aemRISmJhVjBwTzF4dUlDQWdJR2xtSUNobWFXeGxTR1ZoWkdWeUtTQjdYRzRnSUNBZ0lDQnNaWFFnYTJWNVVISmxabWw0SUQwZ1ptbHNaVWhsWVdSbGNsc3hYU0E5UFQwZ0p5MHRMU2NnUHlBbmIyeGtKeUE2SUNkdVpYY25PMXh1SUNBZ0lDQWdZMjl1YzNRZ1pHRjBZU0E5SUdacGJHVklaV0ZrWlhKYk1sMHVjM0JzYVhRb0oxeGNkQ2NzSURJcE8xeHVJQ0FnSUNBZ2JHVjBJR1pwYkdWT1lXMWxJRDBnWkdGMFlWc3dYUzV5WlhCc1lXTmxLQzljWEZ4Y1hGeGNYQzluTENBblhGeGNYQ2NwTzF4dUlDQWdJQ0FnYVdZZ0tDZ3ZYbHdpTGlwY0lpUXZLUzUwWlhOMEtHWnBiR1ZPWVcxbEtTa2dlMXh1SUNBZ0lDQWdJQ0JtYVd4bFRtRnRaU0E5SUdacGJHVk9ZVzFsTG5OMVluTjBjaWd4TENCbWFXeGxUbUZ0WlM1c1pXNW5kR2dnTFNBeUtUdGNiaUFnSUNBZ0lIMWNiaUFnSUNBZ0lHbHVaR1Y0VzJ0bGVWQnlaV1pwZUNBcklDZEdhV3hsVG1GdFpTZGRJRDBnWm1sc1pVNWhiV1U3WEc0Z0lDQWdJQ0JwYm1SbGVGdHJaWGxRY21WbWFYZ2dLeUFuU0dWaFpHVnlKMTBnUFNBb1pHRjBZVnN4WFNCOGZDQW5KeWt1ZEhKcGJTZ3BPMXh1WEc0Z0lDQWdJQ0JwS3lzN1hHNGdJQ0FnZlZ4dUlDQjlYRzVjYmlBZ0x5OGdVR0Z5YzJWeklHRWdhSFZ1YTF4dUlDQXZMeUJVYUdseklHRnpjM1Z0WlhNZ2RHaGhkQ0IzWlNCaGNtVWdZWFFnZEdobElITjBZWEowSUc5bUlHRWdhSFZ1YXk1Y2JpQWdablZ1WTNScGIyNGdjR0Z5YzJWSWRXNXJLQ2tnZTF4dUlDQWdJR3hsZENCamFIVnVhMGhsWVdSbGNrbHVaR1Y0SUQwZ2FTeGNiaUFnSUNBZ0lDQWdZMmgxYm10SVpXRmtaWEpNYVc1bElEMGdaR2xtWm5OMGNsdHBLeXRkTEZ4dUlDQWdJQ0FnSUNCamFIVnVhMGhsWVdSbGNpQTlJR05vZFc1clNHVmhaR1Z5VEdsdVpTNXpjR3hwZENndlFFQWdMU2hjWEdRcktTZy9PaXdvWEZ4a0t5a3BQeUJjWENzb1hGeGtLeWtvUHpvc0tGeGNaQ3NwS1Q4Z1FFQXZLVHRjYmx4dUlDQWdJR3hsZENCb2RXNXJJRDBnZTF4dUlDQWdJQ0FnYjJ4a1UzUmhjblE2SUN0amFIVnVhMGhsWVdSbGNsc3hYU3hjYmlBZ0lDQWdJRzlzWkV4cGJtVnpPaUIwZVhCbGIyWWdZMmgxYm10SVpXRmtaWEpiTWwwZ1BUMDlJQ2QxYm1SbFptbHVaV1FuSUQ4Z01TQTZJQ3RqYUhWdWEwaGxZV1JsY2xzeVhTeGNiaUFnSUNBZ0lHNWxkMU4wWVhKME9pQXJZMmgxYm10SVpXRmtaWEpiTTEwc1hHNGdJQ0FnSUNCdVpYZE1hVzVsY3pvZ2RIbHdaVzltSUdOb2RXNXJTR1ZoWkdWeVd6UmRJRDA5UFNBbmRXNWtaV1pwYm1Wa0p5QS9JREVnT2lBclkyaDFibXRJWldGa1pYSmJORjBzWEc0Z0lDQWdJQ0JzYVc1bGN6b2dXMTBzWEc0Z0lDQWdJQ0JzYVc1bFpHVnNhVzFwZEdWeWN6b2dXMTFjYmlBZ0lDQjlPMXh1WEc0Z0lDQWdMeThnVlc1cFptbGxaQ0JFYVdabUlFWnZjbTFoZENCeGRXbHlhem9nU1dZZ2RHaGxJR05vZFc1cklITnBlbVVnYVhNZ01DeGNiaUFnSUNBdkx5QjBhR1VnWm1seWMzUWdiblZ0WW1WeUlHbHpJRzl1WlNCc2IzZGxjaUIwYUdGdUlHOXVaU0IzYjNWc1pDQmxlSEJsWTNRdVhHNGdJQ0FnTHk4Z2FIUjBjSE02THk5M2QzY3VZWEowYVcxaExtTnZiUzkzWldKc2IyZHpMM1pwWlhkd2IzTjBMbXB6Y0Q5MGFISmxZV1E5TVRZME1qa3pYRzRnSUNBZ2FXWWdLR2gxYm1zdWIyeGtUR2x1WlhNZ1BUMDlJREFwSUh0Y2JpQWdJQ0FnSUdoMWJtc3ViMnhrVTNSaGNuUWdLejBnTVR0Y2JpQWdJQ0I5WEc0Z0lDQWdhV1lnS0doMWJtc3VibVYzVEdsdVpYTWdQVDA5SURBcElIdGNiaUFnSUNBZ0lHaDFibXN1Ym1WM1UzUmhjblFnS3owZ01UdGNiaUFnSUNCOVhHNWNiaUFnSUNCc1pYUWdZV1JrUTI5MWJuUWdQU0F3TEZ4dUlDQWdJQ0FnSUNCeVpXMXZkbVZEYjNWdWRDQTlJREE3WEc0Z0lDQWdabTl5SUNnN0lHa2dQQ0JrYVdabWMzUnlMbXhsYm1kMGFEc2dhU3NyS1NCN1hHNGdJQ0FnSUNBdkx5Qk1hVzVsY3lCemRHRnlkR2x1WnlCM2FYUm9JQ2N0TFMwbklHTnZkV3hrSUdKbElHMXBjM1JoYTJWdUlHWnZjaUIwYUdVZ1hDSnlaVzF2ZG1VZ2JHbHVaVndpSUc5d1pYSmhkR2x2Ymx4dUlDQWdJQ0FnTHk4Z1FuVjBJSFJvWlhrZ1kyOTFiR1FnWW1VZ2RHaGxJR2hsWVdSbGNpQm1iM0lnZEdobElHNWxlSFFnWm1sc1pTNGdWR2hsY21WbWIzSmxJSEJ5ZFc1bElITjFZMmdnWTJGelpYTWdiM1YwTGx4dUlDQWdJQ0FnYVdZZ0tHUnBabVp6ZEhKYmFWMHVhVzVrWlhoUFppZ25MUzB0SUNjcElEMDlQU0F3WEc0Z0lDQWdJQ0FnSUNBZ0lDQW1KaUFvYVNBcklESWdQQ0JrYVdabWMzUnlMbXhsYm1kMGFDbGNiaUFnSUNBZ0lDQWdJQ0FnSUNZbUlHUnBabVp6ZEhKYmFTQXJJREZkTG1sdVpHVjRUMllvSnlzckt5QW5LU0E5UFQwZ01GeHVJQ0FnSUNBZ0lDQWdJQ0FnSmlZZ1pHbG1abk4wY2x0cElDc2dNbDB1YVc1a1pYaFBaaWduUUVBbktTQTlQVDBnTUNrZ2UxeHVJQ0FnSUNBZ0lDQWdJR0p5WldGck8xeHVJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2JHVjBJRzl3WlhKaGRHbHZiaUE5SUNoa2FXWm1jM1J5VzJsZExteGxibWQwYUNBOVBTQXdJQ1ltSUdrZ0lUMGdLR1JwWm1aemRISXViR1Z1WjNSb0lDMGdNU2twSUQ4Z0p5QW5JRG9nWkdsbVpuTjBjbHRwWFZzd1hUdGNibHh1SUNBZ0lDQWdhV1lnS0c5d1pYSmhkR2x2YmlBOVBUMGdKeXNuSUh4OElHOXdaWEpoZEdsdmJpQTlQVDBnSnkwbklIeDhJRzl3WlhKaGRHbHZiaUE5UFQwZ0p5QW5JSHg4SUc5d1pYSmhkR2x2YmlBOVBUMGdKMXhjWEZ3bktTQjdYRzRnSUNBZ0lDQWdJR2gxYm1zdWJHbHVaWE11Y0hWemFDaGthV1ptYzNSeVcybGRLVHRjYmlBZ0lDQWdJQ0FnYUhWdWF5NXNhVzVsWkdWc2FXMXBkR1Z5Y3k1d2RYTm9LR1JsYkdsdGFYUmxjbk5iYVYwZ2ZId2dKMXhjYmljcE8xeHVYRzRnSUNBZ0lDQWdJR2xtSUNodmNHVnlZWFJwYjI0Z1BUMDlJQ2NySnlrZ2UxeHVJQ0FnSUNBZ0lDQWdJR0ZrWkVOdmRXNTBLeXM3WEc0Z0lDQWdJQ0FnSUgwZ1pXeHpaU0JwWmlBb2IzQmxjbUYwYVc5dUlEMDlQU0FuTFNjcElIdGNiaUFnSUNBZ0lDQWdJQ0J5WlcxdmRtVkRiM1Z1ZENzck8xeHVJQ0FnSUNBZ0lDQjlJR1ZzYzJVZ2FXWWdLRzl3WlhKaGRHbHZiaUE5UFQwZ0p5QW5LU0I3WEc0Z0lDQWdJQ0FnSUNBZ1lXUmtRMjkxYm5Rckt6dGNiaUFnSUNBZ0lDQWdJQ0J5WlcxdmRtVkRiM1Z1ZENzck8xeHVJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ0lDQmljbVZoYXp0Y2JpQWdJQ0FnSUgxY2JpQWdJQ0I5WEc1Y2JpQWdJQ0F2THlCSVlXNWtiR1VnZEdobElHVnRjSFI1SUdKc2IyTnJJR052ZFc1MElHTmhjMlZjYmlBZ0lDQnBaaUFvSVdGa1pFTnZkVzUwSUNZbUlHaDFibXN1Ym1WM1RHbHVaWE1nUFQwOUlERXBJSHRjYmlBZ0lDQWdJR2gxYm1zdWJtVjNUR2x1WlhNZ1BTQXdPMXh1SUNBZ0lIMWNiaUFnSUNCcFppQW9JWEpsYlc5MlpVTnZkVzUwSUNZbUlHaDFibXN1YjJ4a1RHbHVaWE1nUFQwOUlERXBJSHRjYmlBZ0lDQWdJR2gxYm1zdWIyeGtUR2x1WlhNZ1BTQXdPMXh1SUNBZ0lIMWNibHh1SUNBZ0lDOHZJRkJsY21admNtMGdiM0IwYVc5dVlXd2djMkZ1YVhSNUlHTm9aV05yYVc1blhHNGdJQ0FnYVdZZ0tHOXdkR2x2Ym5NdWMzUnlhV04wS1NCN1hHNGdJQ0FnSUNCcFppQW9ZV1JrUTI5MWJuUWdJVDA5SUdoMWJtc3VibVYzVEdsdVpYTXBJSHRjYmlBZ0lDQWdJQ0FnZEdoeWIzY2dibVYzSUVWeWNtOXlLQ2RCWkdSbFpDQnNhVzVsSUdOdmRXNTBJR1JwWkNCdWIzUWdiV0YwWTJnZ1ptOXlJR2gxYm1zZ1lYUWdiR2x1WlNBbklDc2dLR05vZFc1clNHVmhaR1Z5U1c1a1pYZ2dLeUF4S1NrN1hHNGdJQ0FnSUNCOVhHNGdJQ0FnSUNCcFppQW9jbVZ0YjNabFEyOTFiblFnSVQwOUlHaDFibXN1YjJ4a1RHbHVaWE1wSUh0Y2JpQWdJQ0FnSUNBZ2RHaHliM2NnYm1WM0lFVnljbTl5S0NkU1pXMXZkbVZrSUd4cGJtVWdZMjkxYm5RZ1pHbGtJRzV2ZENCdFlYUmphQ0JtYjNJZ2FIVnVheUJoZENCc2FXNWxJQ2NnS3lBb1kyaDFibXRJWldGa1pYSkpibVJsZUNBcklERXBLVHRjYmlBZ0lDQWdJSDFjYmlBZ0lDQjlYRzVjYmlBZ0lDQnlaWFIxY200Z2FIVnVhenRjYmlBZ2ZWeHVYRzRnSUhkb2FXeGxJQ2hwSUR3Z1pHbG1abk4wY2k1c1pXNW5kR2dwSUh0Y2JpQWdJQ0J3WVhKelpVbHVaR1Y0S0NrN1hHNGdJSDFjYmx4dUlDQnlaWFIxY200Z2JHbHpkRHRjYm4xY2JpSmRmUT09XG4iLCIvKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG5cInVzZSBzdHJpY3RcIjtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7XG4gIHZhbHVlOiB0cnVlXG59KTtcbmV4cG9ydHMuYXJyYXlFcXVhbCA9IGFycmF5RXF1YWw7XG5leHBvcnRzLmFycmF5U3RhcnRzV2l0aCA9IGFycmF5U3RhcnRzV2l0aDtcblxuLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbmZ1bmN0aW9uIGFycmF5RXF1YWwoYSwgYikge1xuICBpZiAoYS5sZW5ndGggIT09IGIubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIGFycmF5U3RhcnRzV2l0aChhLCBiKTtcbn1cblxuZnVuY3Rpb24gYXJyYXlTdGFydHNXaXRoKGFycmF5LCBzdGFydCkge1xuICBpZiAoc3RhcnQubGVuZ3RoID4gYXJyYXkubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdGFydC5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdGFydFtpXSAhPT0gYXJyYXlbaV0pIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OTFkR2xzTDJGeWNtRjVMbXB6SWwwc0ltNWhiV1Z6SWpwYkltRnljbUY1UlhGMVlXd2lMQ0poSWl3aVlpSXNJbXhsYm1kMGFDSXNJbUZ5Y21GNVUzUmhjblJ6VjJsMGFDSXNJbUZ5Y21GNUlpd2ljM1JoY25RaUxDSnBJbDBzSW0xaGNIQnBibWR6SWpvaU96czdPenM3T3pzN08wRkJRVThzVTBGQlUwRXNWVUZCVkN4RFFVRnZRa01zUTBGQmNFSXNSVUZCZFVKRExFTkJRWFpDTEVWQlFUQkNPMEZCUXk5Q0xFMUJRVWxFTEVOQlFVTXNRMEZCUTBVc1RVRkJSaXhMUVVGaFJDeERRVUZETEVOQlFVTkRMRTFCUVc1Q0xFVkJRVEpDTzBGQlEzcENMRmRCUVU4c1MwRkJVRHRCUVVORU96dEJRVVZFTEZOQlFVOURMR1ZCUVdVc1EwRkJRMGdzUTBGQlJDeEZRVUZKUXl4RFFVRktMRU5CUVhSQ08wRkJRMFE3TzBGQlJVMHNVMEZCVTBVc1pVRkJWQ3hEUVVGNVFrTXNTMEZCZWtJc1JVRkJaME5ETEV0QlFXaERMRVZCUVhWRE8wRkJRelZETEUxQlFVbEJMRXRCUVVzc1EwRkJRMGdzVFVGQlRpeEhRVUZsUlN4TFFVRkxMRU5CUVVOR0xFMUJRWHBDTEVWQlFXbERPMEZCUXk5Q0xGZEJRVThzUzBGQlVEdEJRVU5FT3p0QlFVVkVMRTlCUVVzc1NVRkJTVWtzUTBGQlF5eEhRVUZITEVOQlFXSXNSVUZCWjBKQkxFTkJRVU1zUjBGQlIwUXNTMEZCU3l4RFFVRkRTQ3hOUVVFeFFpeEZRVUZyUTBrc1EwRkJReXhGUVVGdVF5eEZRVUYxUXp0QlFVTnlReXhSUVVGSlJDeExRVUZMTEVOQlFVTkRMRU5CUVVRc1EwRkJUQ3hMUVVGaFJpeExRVUZMTEVOQlFVTkZMRU5CUVVRc1EwRkJkRUlzUlVGQk1rSTdRVUZEZWtJc1lVRkJUeXhMUVVGUU8wRkJRMFE3UVVGRFJqczdRVUZGUkN4VFFVRlBMRWxCUVZBN1FVRkRSQ0lzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW1WNGNHOXlkQ0JtZFc1amRHbHZiaUJoY25KaGVVVnhkV0ZzS0dFc0lHSXBJSHRjYmlBZ2FXWWdLR0V1YkdWdVozUm9JQ0U5UFNCaUxteGxibWQwYUNrZ2UxeHVJQ0FnSUhKbGRIVnliaUJtWVd4elpUdGNiaUFnZlZ4dVhHNGdJSEpsZEhWeWJpQmhjbkpoZVZOMFlYSjBjMWRwZEdnb1lTd2dZaWs3WEc1OVhHNWNibVY0Y0c5eWRDQm1kVzVqZEdsdmJpQmhjbkpoZVZOMFlYSjBjMWRwZEdnb1lYSnlZWGtzSUhOMFlYSjBLU0I3WEc0Z0lHbG1JQ2h6ZEdGeWRDNXNaVzVuZEdnZ1BpQmhjbkpoZVM1c1pXNW5kR2dwSUh0Y2JpQWdJQ0J5WlhSMWNtNGdabUZzYzJVN1hHNGdJSDFjYmx4dUlDQm1iM0lnS0d4bGRDQnBJRDBnTURzZ2FTQThJSE4wWVhKMExteGxibWQwYURzZ2FTc3JLU0I3WEc0Z0lDQWdhV1lnS0hOMFlYSjBXMmxkSUNFOVBTQmhjbkpoZVZ0cFhTa2dlMXh1SUNBZ0lDQWdjbVYwZFhKdUlHWmhiSE5sTzF4dUlDQWdJSDFjYmlBZ2ZWeHVYRzRnSUhKbGRIVnliaUIwY25WbE8xeHVmVnh1SWwxOVxuIiwiLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzW1wiZGVmYXVsdFwiXSA9IF9kZWZhdWx0O1xuXG4vKmlzdGFuYnVsIGlnbm9yZSBlbmQqL1xuLy8gSXRlcmF0b3IgdGhhdCB0cmF2ZXJzZXMgaW4gdGhlIHJhbmdlIG9mIFttaW4sIG1heF0sIHN0ZXBwaW5nXG4vLyBieSBkaXN0YW5jZSBmcm9tIGEgZ2l2ZW4gc3RhcnQgcG9zaXRpb24uIEkuZS4gZm9yIFswLCA0XSwgd2l0aFxuLy8gc3RhcnQgb2YgMiwgdGhpcyB3aWxsIGl0ZXJhdGUgMiwgMywgMSwgNCwgMC5cbmZ1bmN0aW9uXG4vKmlzdGFuYnVsIGlnbm9yZSBzdGFydCovXG5fZGVmYXVsdFxuLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbihzdGFydCwgbWluTGluZSwgbWF4TGluZSkge1xuICB2YXIgd2FudEZvcndhcmQgPSB0cnVlLFxuICAgICAgYmFja3dhcmRFeGhhdXN0ZWQgPSBmYWxzZSxcbiAgICAgIGZvcndhcmRFeGhhdXN0ZWQgPSBmYWxzZSxcbiAgICAgIGxvY2FsT2Zmc2V0ID0gMTtcbiAgcmV0dXJuIGZ1bmN0aW9uIGl0ZXJhdG9yKCkge1xuICAgIGlmICh3YW50Rm9yd2FyZCAmJiAhZm9yd2FyZEV4aGF1c3RlZCkge1xuICAgICAgaWYgKGJhY2t3YXJkRXhoYXVzdGVkKSB7XG4gICAgICAgIGxvY2FsT2Zmc2V0Kys7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB3YW50Rm9yd2FyZCA9IGZhbHNlO1xuICAgICAgfSAvLyBDaGVjayBpZiB0cnlpbmcgdG8gZml0IGJleW9uZCB0ZXh0IGxlbmd0aCwgYW5kIGlmIG5vdCwgY2hlY2sgaXQgZml0c1xuICAgICAgLy8gYWZ0ZXIgb2Zmc2V0IGxvY2F0aW9uIChvciBkZXNpcmVkIGxvY2F0aW9uIG9uIGZpcnN0IGl0ZXJhdGlvbilcblxuXG4gICAgICBpZiAoc3RhcnQgKyBsb2NhbE9mZnNldCA8PSBtYXhMaW5lKSB7XG4gICAgICAgIHJldHVybiBsb2NhbE9mZnNldDtcbiAgICAgIH1cblxuICAgICAgZm9yd2FyZEV4aGF1c3RlZCA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYgKCFiYWNrd2FyZEV4aGF1c3RlZCkge1xuICAgICAgaWYgKCFmb3J3YXJkRXhoYXVzdGVkKSB7XG4gICAgICAgIHdhbnRGb3J3YXJkID0gdHJ1ZTtcbiAgICAgIH0gLy8gQ2hlY2sgaWYgdHJ5aW5nIHRvIGZpdCBiZWZvcmUgdGV4dCBiZWdpbm5pbmcsIGFuZCBpZiBub3QsIGNoZWNrIGl0IGZpdHNcbiAgICAgIC8vIGJlZm9yZSBvZmZzZXQgbG9jYXRpb25cblxuXG4gICAgICBpZiAobWluTGluZSA8PSBzdGFydCAtIGxvY2FsT2Zmc2V0KSB7XG4gICAgICAgIHJldHVybiAtbG9jYWxPZmZzZXQrKztcbiAgICAgIH1cblxuICAgICAgYmFja3dhcmRFeGhhdXN0ZWQgPSB0cnVlO1xuICAgICAgcmV0dXJuIGl0ZXJhdG9yKCk7XG4gICAgfSAvLyBXZSB0cmllZCB0byBmaXQgaHVuayBiZWZvcmUgdGV4dCBiZWdpbm5pbmcgYW5kIGJleW9uZCB0ZXh0IGxlbmd0aCwgdGhlblxuICAgIC8vIGh1bmsgY2FuJ3QgZml0IG9uIHRoZSB0ZXh0LiBSZXR1cm4gdW5kZWZpbmVkXG5cbiAgfTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYklpNHVMeTR1TDNOeVl5OTFkR2xzTDJScGMzUmhibU5sTFdsMFpYSmhkRzl5TG1weklsMHNJbTVoYldWeklqcGJJbk4wWVhKMElpd2liV2x1VEdsdVpTSXNJbTFoZUV4cGJtVWlMQ0ozWVc1MFJtOXlkMkZ5WkNJc0ltSmhZMnQzWVhKa1JYaG9ZWFZ6ZEdWa0lpd2labTl5ZDJGeVpFVjRhR0YxYzNSbFpDSXNJbXh2WTJGc1QyWm1jMlYwSWl3aWFYUmxjbUYwYjNJaVhTd2liV0Z3Y0dsdVozTWlPaUk3T3pzN096czdPenRCUVVGQk8wRkJRMEU3UVVGRFFUdEJRVU5sTzBGQlFVRTdRVUZCUVR0QlFVRkJPMEZCUVVFc1EwRkJVMEVzUzBGQlZDeEZRVUZuUWtNc1QwRkJhRUlzUlVGQmVVSkRMRTlCUVhwQ0xFVkJRV3RETzBGQlF5OURMRTFCUVVsRExGZEJRVmNzUjBGQlJ5eEpRVUZzUWp0QlFVRkJMRTFCUTBsRExHbENRVUZwUWl4SFFVRkhMRXRCUkhoQ08wRkJRVUVzVFVGRlNVTXNaMEpCUVdkQ0xFZEJRVWNzUzBGR2RrSTdRVUZCUVN4TlFVZEpReXhYUVVGWExFZEJRVWNzUTBGSWJFSTdRVUZMUVN4VFFVRlBMRk5CUVZORExGRkJRVlFzUjBGQmIwSTdRVUZEZWtJc1VVRkJTVW9zVjBGQlZ5eEpRVUZKTEVOQlFVTkZMR2RDUVVGd1FpeEZRVUZ6UXp0QlFVTndReXhWUVVGSlJDeHBRa0ZCU2l4RlFVRjFRanRCUVVOeVFrVXNVVUZCUVVFc1YwRkJWenRCUVVOYUxFOUJSa1FzVFVGRlR6dEJRVU5NU0N4UlFVRkJRU3hYUVVGWExFZEJRVWNzUzBGQlpEdEJRVU5FTEU5QlRHMURMRU5CVDNCRE8wRkJRMEU3T3p0QlFVTkJMRlZCUVVsSUxFdEJRVXNzUjBGQlIwMHNWMEZCVWl4SlFVRjFRa29zVDBGQk0wSXNSVUZCYjBNN1FVRkRiRU1zWlVGQlQwa3NWMEZCVUR0QlFVTkVPenRCUVVWRVJDeE5RVUZCUVN4blFrRkJaMElzUjBGQlJ5eEpRVUZ1UWp0QlFVTkVPenRCUVVWRUxGRkJRVWtzUTBGQlEwUXNhVUpCUVV3c1JVRkJkMEk3UVVGRGRFSXNWVUZCU1N4RFFVRkRReXhuUWtGQlRDeEZRVUYxUWp0QlFVTnlRa1lzVVVGQlFVRXNWMEZCVnl4SFFVRkhMRWxCUVdRN1FVRkRSQ3hQUVVoeFFpeERRVXQwUWp0QlFVTkJPenM3UVVGRFFTeFZRVUZKUml4UFFVRlBMRWxCUVVsRUxFdEJRVXNzUjBGQlIwMHNWMEZCZGtJc1JVRkJiME03UVVGRGJFTXNaVUZCVHl4RFFVRkRRU3hYUVVGWExFVkJRVzVDTzBGQlEwUTdPMEZCUlVSR0xFMUJRVUZCTEdsQ1FVRnBRaXhIUVVGSExFbEJRWEJDTzBGQlEwRXNZVUZCVDBjc1VVRkJVU3hGUVVGbU8wRkJRMFFzUzBFNVFuZENMRU5CWjBONlFqdEJRVU5CT3p0QlFVTkVMRWRCYkVORU8wRkJiVU5FSWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaUx5OGdTWFJsY21GMGIzSWdkR2hoZENCMGNtRjJaWEp6WlhNZ2FXNGdkR2hsSUhKaGJtZGxJRzltSUZ0dGFXNHNJRzFoZUYwc0lITjBaWEJ3YVc1blhHNHZMeUJpZVNCa2FYTjBZVzVqWlNCbWNtOXRJR0VnWjJsMlpXNGdjM1JoY25RZ2NHOXphWFJwYjI0dUlFa3VaUzRnWm05eUlGc3dMQ0EwWFN3Z2QybDBhRnh1THk4Z2MzUmhjblFnYjJZZ01pd2dkR2hwY3lCM2FXeHNJR2wwWlhKaGRHVWdNaXdnTXl3Z01Td2dOQ3dnTUM1Y2JtVjRjRzl5ZENCa1pXWmhkV3gwSUdaMWJtTjBhVzl1S0hOMFlYSjBMQ0J0YVc1TWFXNWxMQ0J0WVhoTWFXNWxLU0I3WEc0Z0lHeGxkQ0IzWVc1MFJtOXlkMkZ5WkNBOUlIUnlkV1VzWEc0Z0lDQWdJQ0JpWVdOcmQyRnlaRVY0YUdGMWMzUmxaQ0E5SUdaaGJITmxMRnh1SUNBZ0lDQWdabTl5ZDJGeVpFVjRhR0YxYzNSbFpDQTlJR1poYkhObExGeHVJQ0FnSUNBZ2JHOWpZV3hQWm1aelpYUWdQU0F4TzF4dVhHNGdJSEpsZEhWeWJpQm1kVzVqZEdsdmJpQnBkR1Z5WVhSdmNpZ3BJSHRjYmlBZ0lDQnBaaUFvZDJGdWRFWnZjbmRoY21RZ0ppWWdJV1p2Y25kaGNtUkZlR2hoZFhOMFpXUXBJSHRjYmlBZ0lDQWdJR2xtSUNoaVlXTnJkMkZ5WkVWNGFHRjFjM1JsWkNrZ2UxeHVJQ0FnSUNBZ0lDQnNiMk5oYkU5bVpuTmxkQ3NyTzF4dUlDQWdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJQ0FnZDJGdWRFWnZjbmRoY21RZ1BTQm1ZV3h6WlR0Y2JpQWdJQ0FnSUgxY2JseHVJQ0FnSUNBZ0x5OGdRMmhsWTJzZ2FXWWdkSEo1YVc1bklIUnZJR1pwZENCaVpYbHZibVFnZEdWNGRDQnNaVzVuZEdnc0lHRnVaQ0JwWmlCdWIzUXNJR05vWldOcklHbDBJR1pwZEhOY2JpQWdJQ0FnSUM4dklHRm1kR1Z5SUc5bVpuTmxkQ0JzYjJOaGRHbHZiaUFvYjNJZ1pHVnphWEpsWkNCc2IyTmhkR2x2YmlCdmJpQm1hWEp6ZENCcGRHVnlZWFJwYjI0cFhHNGdJQ0FnSUNCcFppQW9jM1JoY25RZ0t5QnNiMk5oYkU5bVpuTmxkQ0E4UFNCdFlYaE1hVzVsS1NCN1hHNGdJQ0FnSUNBZ0lISmxkSFZ5YmlCc2IyTmhiRTltWm5ObGREdGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdabTl5ZDJGeVpFVjRhR0YxYzNSbFpDQTlJSFJ5ZFdVN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnYVdZZ0tDRmlZV05yZDJGeVpFVjRhR0YxYzNSbFpDa2dlMXh1SUNBZ0lDQWdhV1lnS0NGbWIzSjNZWEprUlhob1lYVnpkR1ZrS1NCN1hHNGdJQ0FnSUNBZ0lIZGhiblJHYjNKM1lYSmtJRDBnZEhKMVpUdGNiaUFnSUNBZ0lIMWNibHh1SUNBZ0lDQWdMeThnUTJobFkyc2dhV1lnZEhKNWFXNW5JSFJ2SUdacGRDQmlaV1p2Y21VZ2RHVjRkQ0JpWldkcGJtNXBibWNzSUdGdVpDQnBaaUJ1YjNRc0lHTm9aV05ySUdsMElHWnBkSE5jYmlBZ0lDQWdJQzh2SUdKbFptOXlaU0J2Wm1aelpYUWdiRzlqWVhScGIyNWNiaUFnSUNBZ0lHbG1JQ2h0YVc1TWFXNWxJRHc5SUhOMFlYSjBJQzBnYkc5allXeFBabVp6WlhRcElIdGNiaUFnSUNBZ0lDQWdjbVYwZFhKdUlDMXNiMk5oYkU5bVpuTmxkQ3NyTzF4dUlDQWdJQ0FnZlZ4dVhHNGdJQ0FnSUNCaVlXTnJkMkZ5WkVWNGFHRjFjM1JsWkNBOUlIUnlkV1U3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdhWFJsY21GMGIzSW9LVHRjYmlBZ0lDQjlYRzVjYmlBZ0lDQXZMeUJYWlNCMGNtbGxaQ0IwYnlCbWFYUWdhSFZ1YXlCaVpXWnZjbVVnZEdWNGRDQmlaV2RwYm01cGJtY2dZVzVrSUdKbGVXOXVaQ0IwWlhoMElHeGxibWQwYUN3Z2RHaGxibHh1SUNBZ0lDOHZJR2gxYm1zZ1kyRnVKM1FnWm1sMElHOXVJSFJvWlNCMFpYaDBMaUJTWlhSMWNtNGdkVzVrWldacGJtVmtYRzRnSUgwN1hHNTlYRzRpWFgwPVxuIiwiLyppc3RhbmJ1bCBpZ25vcmUgc3RhcnQqL1xuXCJ1c2Ugc3RyaWN0XCI7XG5cbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwge1xuICB2YWx1ZTogdHJ1ZVxufSk7XG5leHBvcnRzLmdlbmVyYXRlT3B0aW9ucyA9IGdlbmVyYXRlT3B0aW9ucztcblxuLyppc3RhbmJ1bCBpZ25vcmUgZW5kKi9cbmZ1bmN0aW9uIGdlbmVyYXRlT3B0aW9ucyhvcHRpb25zLCBkZWZhdWx0cykge1xuICBpZiAodHlwZW9mIG9wdGlvbnMgPT09ICdmdW5jdGlvbicpIHtcbiAgICBkZWZhdWx0cy5jYWxsYmFjayA9IG9wdGlvbnM7XG4gIH0gZWxzZSBpZiAob3B0aW9ucykge1xuICAgIGZvciAodmFyIG5hbWUgaW4gb3B0aW9ucykge1xuICAgICAgLyogaXN0YW5idWwgaWdub3JlIGVsc2UgKi9cbiAgICAgIGlmIChvcHRpb25zLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICAgIGRlZmF1bHRzW25hbWVdID0gb3B0aW9uc1tuYW1lXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gZGVmYXVsdHM7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJaTR1THk0dUwzTnlZeTkxZEdsc0wzQmhjbUZ0Y3k1cWN5SmRMQ0p1WVcxbGN5STZXeUpuWlc1bGNtRjBaVTl3ZEdsdmJuTWlMQ0p2Y0hScGIyNXpJaXdpWkdWbVlYVnNkSE1pTENKallXeHNZbUZqYXlJc0ltNWhiV1VpTENKb1lYTlBkMjVRY205d1pYSjBlU0pkTENKdFlYQndhVzVuY3lJNklqczdPenM3T3pzN08wRkJRVThzVTBGQlUwRXNaVUZCVkN4RFFVRjVRa01zVDBGQmVrSXNSVUZCYTBORExGRkJRV3hETEVWQlFUUkRPMEZCUTJwRUxFMUJRVWtzVDBGQlQwUXNUMEZCVUN4TFFVRnRRaXhWUVVGMlFpeEZRVUZ0UXp0QlFVTnFRME1zU1VGQlFVRXNVVUZCVVN4RFFVRkRReXhSUVVGVUxFZEJRVzlDUml4UFFVRndRanRCUVVORUxFZEJSa1FzVFVGRlR5eEpRVUZKUVN4UFFVRktMRVZCUVdFN1FVRkRiRUlzVTBGQlN5eEpRVUZKUnl4SlFVRlVMRWxCUVdsQ1NDeFBRVUZxUWl4RlFVRXdRanRCUVVONFFqdEJRVU5CTEZWQlFVbEJMRTlCUVU4c1EwRkJRMGtzWTBGQlVpeERRVUYxUWtRc1NVRkJka0lzUTBGQlNpeEZRVUZyUXp0QlFVTm9RMFlzVVVGQlFVRXNVVUZCVVN4RFFVRkRSU3hKUVVGRUxFTkJRVklzUjBGQmFVSklMRTlCUVU4c1EwRkJRMGNzU1VGQlJDeERRVUY0UWp0QlFVTkVPMEZCUTBZN1FVRkRSanM3UVVGRFJDeFRRVUZQUml4UlFVRlFPMEZCUTBRaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SmxlSEJ2Y25RZ1puVnVZM1JwYjI0Z1oyVnVaWEpoZEdWUGNIUnBiMjV6S0c5d2RHbHZibk1zSUdSbFptRjFiSFJ6S1NCN1hHNGdJR2xtSUNoMGVYQmxiMllnYjNCMGFXOXVjeUE5UFQwZ0oyWjFibU4wYVc5dUp5a2dlMXh1SUNBZ0lHUmxabUYxYkhSekxtTmhiR3hpWVdOcklEMGdiM0IwYVc5dWN6dGNiaUFnZlNCbGJITmxJR2xtSUNodmNIUnBiMjV6S1NCN1hHNGdJQ0FnWm05eUlDaHNaWFFnYm1GdFpTQnBiaUJ2Y0hScGIyNXpLU0I3WEc0Z0lDQWdJQ0F2S2lCcGMzUmhibUoxYkNCcFoyNXZjbVVnWld4elpTQXFMMXh1SUNBZ0lDQWdhV1lnS0c5d2RHbHZibk11YUdGelQzZHVVSEp2Y0dWeWRIa29ibUZ0WlNrcElIdGNiaUFnSUNBZ0lDQWdaR1ZtWVhWc2RITmJibUZ0WlYwZ1BTQnZjSFJwYjI1elcyNWhiV1ZkTzF4dUlDQWdJQ0FnZlZ4dUlDQWdJSDFjYmlBZ2ZWeHVJQ0J5WlhSMWNtNGdaR1ZtWVhWc2RITTdYRzU5WEc0aVhYMD1cbiIsIi8vIE1vZHVsZVxudmFyIGNvZGUgPSBcIjxzcGFuIGlkPVxcXCJjb250YWluZXJ7e2lkfX1cXFwiIGNsYXNzPVxcXCJibGFuayB7eyNibGFuay5oYXNQZW5kaW5nRmVlZGJhY2t9fWhhcy1wZW5kaW5nLWZlZWRiYWNre3svaWZ9fSB7eyNibGFuay5oYXNIaW50fX1oYXMtdGlwe3svaWZ9fSB7eyNibGFuay5pc0NvcnJlY3R9fWNvcnJlY3R7ey9pZn19IHt7I2JsYW5rLmlzRXJyb3J9fWVycm9ye3svaWZ9fSB7eyNibGFuay5pc1JldHJ5fX1yZXRyeXt7L2lmfX0ge3sjYmxhbmsuaXNTaG93aW5nU29sdXRpb259fXNob3dpbmctc29sdXRpb257ey9pZn19XFxcIj5cXG4gIHt7I3VubGVzcyBpc1NlbGVjdENsb3plfX1cXG4gICAgPHNwYW4gY2xhc3M9XFxcImg1cC1pbnB1dC13cmFwcGVyXFxcIj5cXG4gICAgICA8aW5wdXQgaWQ9XFxcInt7YmxhbmsuaWR9fVxcXCIgdHlwZT1cXFwidGV4dFxcXCIgdmFsdWU9XFxcInt7YmxhbmsuZW50ZXJlZFRleHR9fVxcXCIgXFxuICAgICAgICAgICAgIHNpemU9XFxcInt7YmxhbmsubWluVGV4dExlbmd0aH19XFxcIiBvbi1lc2NhcGU9XFxcIkB0aGlzLmZpcmUoJ2Nsb3NlTWVzc2FnZScsIGJsYW5rKVxcXCIgXFxuICAgICAgICAgICAgIG9uLWVudGVyPVxcXCJAdGhpcy5maXJlKCdjaGVja0JsYW5rJywgYmxhbmssICdlbnRlcicpXFxcIiBcXG4gICAgICAgICAgICAgb24tYmx1cj1cXFwiQHRoaXMuZmlyZSgnY2hlY2tCbGFuaycsIGJsYW5rLCAnYmx1cicpXFxcIiBcXG4gICAgICAgICAgICAgb24tZm9jdXM9XFxcIkB0aGlzLmZpcmUoJ2ZvY3VzJywgYmxhbmspXFxcIlxcbiAgICAgICAgICAgICBvbi1hbnlrZXk9XFxcIkB0aGlzLmZpcmUoJ3RleHRUeXBlZCcsIGJsYW5rKVxcXCJcXG4gICAgICAgICAgICAge3sjKGJsYW5rLmlzQ29ycmVjdCB8fCBibGFuay5pc1Nob3dpbmdTb2x1dGlvbil9fWRpc2FibGVkPVxcXCJkaXNhYmxlZFxcXCJ7ey9pZn19XFxuICAgICAgICAgICAgIGNsYXNzPVxcXCJoNXAtdGV4dC1pbnB1dFxcXCJcXG4gICAgICAgICAgICAgYXV0b2NvbXBsZXRlPVxcXCJvZmZcXFwiXFxuICAgICAgICAgICAgIGF1dG9jYXBpdGFsaXplPVxcXCJvZmZcXFwiLz5cXG4gICAgICB7eyNibGFuay5oYXNIaW50fX1cXG4gICAgICAgIDxzcGFuIGNsYXNzPVxcXCJoNXAtdGlwLWNvbnRhaW5lclxcXCI+XFxuICAgICAgICAgIDxidXR0b24gb24tY2xpY2s9XFxcIkB0aGlzLmZpcmUoJ3Nob3dIaW50JywgYmxhbmspXFxcIiB7eyMoYmxhbmsuaXNDb3JyZWN0IHx8IGJsYW5rLmlzU2hvd2luZ1NvbHV0aW9uKX19ZGlzYWJsZWQ9XFxcImRpc2FibGVkXFxcIiB7ey9pZn19PlxcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVxcXCJqb3ViZWwtdGlwLWNvbnRhaW5lclxcXCIgdGl0bGU9XFxcIlRpcFxcXCIgYXJpYS1sYWJlbD1cXFwiVGlwXFxcIiBhcmlhLWV4cGFuZGVkPVxcXCJ0cnVlXFxcIiByb2xlPVxcXCJidXR0b25cXFwiIHRhYmluZGV4PVxcXCIwXFxcIj48c3BhbiBjbGFzcz1cXFwiam91YmVsLWljb24tdGlwLW5vcm1hbCBcXFwiPjxzcGFuIGNsYXNzPVxcXCJoNXAtaWNvbi1zaGFkb3dcXFwiPjwvc3Bhbj48c3BhbiBjbGFzcz1cXFwiaDVwLWljb24tc3BlZWNoLWJ1YmJsZVxcXCI+PC9zcGFuPjxzcGFuIGNsYXNzPVxcXCJoNXAtaWNvbi1pbmZvXFxcIj48L3NwYW4+PC9zcGFuPjwvc3Bhbj5cXG4gICAgICAgICAgPC9idXR0b24+XFxuICAgICAgICA8L3NwYW4+XFxuICAgICAgICB7ey9pZn19XFxuICAgIDwvc3Bhbj4gICAgXFxuICB7ey91bmxlc3N9fVxcbiAge3sjaWYgaXNTZWxlY3RDbG96ZX19XFxuICAgICAgPGJ1dHRvbiBjbGFzcz1cXFwiaDVwLW5vdGlmaWNhdGlvblxcXCIgb24tY2xpY2s9XFxcIkB0aGlzLmZpcmUoJ2Rpc3BsYXlGZWVkYmFjaycsIGJsYW5rKVxcXCI+XFxuICAgICAgICAmI3hmMDVhO1xcbiAgICAgIDwvYnV0dG9uPlxcbiAgICAgIDxzcGFuIGNsYXNzPVxcXCJoNXAtaW5wdXQtd3JhcHBlclxcXCI+ICAgICAgXFxuICAgICAgPHNlbGVjdCBpZD1cXFwie3tibGFuay5pZH19XFxcIiB0eXBlPVxcXCJ0ZXh0XFxcIiB2YWx1ZT1cXFwie3tibGFuay5lbnRlcmVkVGV4dH19XFxcIlxcbiAgICAgICAgICAgICAgb24tZW50ZXI9XFxcIkB0aGlzLmZpcmUoJ2NoZWNrQmxhbmsnLCBibGFuaywgJ2VudGVyJylcXFwiIFxcbiAgICAgICAgICAgICAgb24tY2hhbmdlPVxcXCJAdGhpcy5maXJlKCdjaGVja0JsYW5rJywgYmxhbmssICdjaGFuZ2UnKVxcXCJcXG4gICAgICAgICAgICAgIG9uLWZvY3VzPVxcXCJAdGhpcy5maXJlKCdmb2N1cycsIGJsYW5rKVxcXCIgICAgICAgICAgICAgIFxcbiAgICAgICAgICAgICAge3sjKGJsYW5rLmlzQ29ycmVjdCB8fCBibGFuay5pc1Nob3dpbmdTb2x1dGlvbil9fWRpc2FibGVkPVxcXCJkaXNhYmxlZFxcXCJ7ey9pZn19IFxcbiAgICAgICAgICAgICAgc2l6ZT1cXFwiMVxcXCJcXG4gICAgICAgICAgICAgIGNsYXNzPVxcXCJoNXAtdGV4dC1pbnB1dFxcXCI+XFxuICAgICAgICB7eyNlYWNoIGJsYW5rLmNob2ljZXN9fVxcbiAgICAgICAgICA8b3B0aW9uPnt7dGhpc319PC9vcHRpb24+XFxuICAgICAgICB7ey9lYWNofX1cXG4gICAgICA8L3NlbGVjdD4gICAgICAgICAgICAgICAgICAgICBcXG4gICAgICB7eyNibGFuay5oYXNIaW50fX1cXG4gICAgICAgIDxzcGFuIGNsYXNzPVxcXCJoNXAtdGlwLWNvbnRhaW5lclxcXCI+XFxuICAgICAgICAgIDxidXR0b24gb24tY2xpY2s9XFxcIkB0aGlzLmZpcmUoJ3Nob3dIaW50JywgYmxhbmspXFxcIiB7eyMoYmxhbmsuaXNDb3JyZWN0IHx8IGJsYW5rLmlzU2hvd2luZ1NvbHV0aW9uKX19ZGlzYWJsZWQ9XFxcImRpc2FibGVkXFxcInt7L2lmfX0+XFxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XFxcImpvdWJlbC10aXAtY29udGFpbmVyXFxcIiB0aXRsZT1cXFwiVGlwXFxcIiBhcmlhLWxhYmVsPVxcXCJUaXBcXFwiIGFyaWEtZXhwYW5kZWQ9XFxcInRydWVcXFwiIHJvbGU9XFxcImJ1dHRvblxcXCIgdGFiaW5kZXg9XFxcIjBcXFwiPjxzcGFuIGNsYXNzPVxcXCJqb3ViZWwtaWNvbi10aXAtbm9ybWFsIFxcXCI+PHNwYW4gY2xhc3M9XFxcImg1cC1pY29uLXNoYWRvd1xcXCI+PC9zcGFuPjxzcGFuIGNsYXNzPVxcXCJoNXAtaWNvbi1zcGVlY2gtYnViYmxlXFxcIj48L3NwYW4+PHNwYW4gY2xhc3M9XFxcImg1cC1pY29uLWluZm9cXFwiPjwvc3Bhbj48L3NwYW4+PC9zcGFuPlxcbiAgICAgICAgICA8L2J1dHRvbj5cXG4gICAgICAgIDwvc3Bhbj5cXG4gICAgICB7ey9pZn19ICAgICBcXG4gICAgPC9zcGFuPlxcbiAge3svaWZ9fVxcbjwvc3Bhbj5cIjtcbi8vIEV4cG9ydHNcbm1vZHVsZS5leHBvcnRzID0gY29kZTsiLCIvLyBNb2R1bGVcbnZhciBjb2RlID0gXCI8c3BhbiB7eyNvYmplY3QuaXNIaWdobGlnaHRlZH19Y2xhc3M9XFxcImhpZ2hsaWdodGVkXFxcInt7L2lmfX0gaWQ9XFxcInt7b2JqZWN0LmlkfX1cXFwiPnt7e29iamVjdC50ZXh0fX19PC9zcGFuPlwiO1xuLy8gRXhwb3J0c1xubW9kdWxlLmV4cG9ydHMgPSBjb2RlOyIsImltcG9ydCBhcGkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgICAgICAgIGltcG9ydCBjb250ZW50IGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlLmNzc1wiO1xuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLmluc2VydCA9IFwiaGVhZFwiO1xub3B0aW9ucy5zaW5nbGV0b24gPSBmYWxzZTtcblxudmFyIHVwZGF0ZSA9IGFwaShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCBkZWZhdWx0IGNvbnRlbnQubG9jYWxzIHx8IHt9OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgaXNPbGRJRSA9IGZ1bmN0aW9uIGlzT2xkSUUoKSB7XG4gIHZhciBtZW1vO1xuICByZXR1cm4gZnVuY3Rpb24gbWVtb3JpemUoKSB7XG4gICAgaWYgKHR5cGVvZiBtZW1vID09PSAndW5kZWZpbmVkJykge1xuICAgICAgLy8gVGVzdCBmb3IgSUUgPD0gOSBhcyBwcm9wb3NlZCBieSBCcm93c2VyaGFja3NcbiAgICAgIC8vIEBzZWUgaHR0cDovL2Jyb3dzZXJoYWNrcy5jb20vI2hhY2stZTcxZDg2OTJmNjUzMzQxNzNmZWU3MTVjMjIyY2I4MDVcbiAgICAgIC8vIFRlc3RzIGZvciBleGlzdGVuY2Ugb2Ygc3RhbmRhcmQgZ2xvYmFscyBpcyB0byBhbGxvdyBzdHlsZS1sb2FkZXJcbiAgICAgIC8vIHRvIG9wZXJhdGUgY29ycmVjdGx5IGludG8gbm9uLXN0YW5kYXJkIGVudmlyb25tZW50c1xuICAgICAgLy8gQHNlZSBodHRwczovL2dpdGh1Yi5jb20vd2VicGFjay1jb250cmliL3N0eWxlLWxvYWRlci9pc3N1ZXMvMTc3XG4gICAgICBtZW1vID0gQm9vbGVhbih3aW5kb3cgJiYgZG9jdW1lbnQgJiYgZG9jdW1lbnQuYWxsICYmICF3aW5kb3cuYXRvYik7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1lbW87XG4gIH07XG59KCk7XG5cbnZhciBnZXRUYXJnZXQgPSBmdW5jdGlvbiBnZXRUYXJnZXQoKSB7XG4gIHZhciBtZW1vID0ge307XG4gIHJldHVybiBmdW5jdGlvbiBtZW1vcml6ZSh0YXJnZXQpIHtcbiAgICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTsgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcblxuICAgICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgICB0cnkge1xuICAgICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbiAgfTtcbn0oKTtcblxudmFyIHN0eWxlc0luRG9tID0gW107XG5cbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5Eb20ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5Eb21baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXVxuICAgIH07XG5cbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRvbVtpbmRleF0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5Eb21baW5kZXhdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3R5bGVzSW5Eb20ucHVzaCh7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IGFkZFN0eWxlKG9iaiwgb3B0aW9ucyksXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cblxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBzdHlsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gIHZhciBhdHRyaWJ1dGVzID0gb3B0aW9ucy5hdHRyaWJ1dGVzIHx8IHt9O1xuXG4gIGlmICh0eXBlb2YgYXR0cmlidXRlcy5ub25jZSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09ICd1bmRlZmluZWQnID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuXG4gICAgaWYgKG5vbmNlKSB7XG4gICAgICBhdHRyaWJ1dGVzLm5vbmNlID0gbm9uY2U7XG4gICAgfVxuICB9XG5cbiAgT2JqZWN0LmtleXMoYXR0cmlidXRlcykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgc3R5bGUuc2V0QXR0cmlidXRlKGtleSwgYXR0cmlidXRlc1trZXldKTtcbiAgfSk7XG5cbiAgaWYgKHR5cGVvZiBvcHRpb25zLmluc2VydCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIG9wdGlvbnMuaW5zZXJ0KHN0eWxlKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KG9wdGlvbnMuaW5zZXJ0IHx8ICdoZWFkJyk7XG5cbiAgICBpZiAoIXRhcmdldCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgICB9XG5cbiAgICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuICB9XG5cbiAgcmV0dXJuIHN0eWxlO1xufVxuXG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGUpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZS5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc3R5bGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZSk7XG59XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cblxuXG52YXIgcmVwbGFjZVRleHQgPSBmdW5jdGlvbiByZXBsYWNlVGV4dCgpIHtcbiAgdmFyIHRleHRTdG9yZSA9IFtdO1xuICByZXR1cm4gZnVuY3Rpb24gcmVwbGFjZShpbmRleCwgcmVwbGFjZW1lbnQpIHtcbiAgICB0ZXh0U3RvcmVbaW5kZXhdID0gcmVwbGFjZW1lbnQ7XG4gICAgcmV0dXJuIHRleHRTdG9yZS5maWx0ZXIoQm9vbGVhbikuam9pbignXFxuJyk7XG4gIH07XG59KCk7XG5cbmZ1bmN0aW9uIGFwcGx5VG9TaW5nbGV0b25UYWcoc3R5bGUsIGluZGV4LCByZW1vdmUsIG9iaikge1xuICB2YXIgY3NzID0gcmVtb3ZlID8gJycgOiBvYmoubWVkaWEgPyBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpLmNvbmNhdChvYmouY3NzLCBcIn1cIikgOiBvYmouY3NzOyAvLyBGb3Igb2xkIElFXG5cbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuXG4gIGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gcmVwbGFjZVRleHQoaW5kZXgsIGNzcyk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGNzc05vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpO1xuICAgIHZhciBjaGlsZE5vZGVzID0gc3R5bGUuY2hpbGROb2RlcztcblxuICAgIGlmIChjaGlsZE5vZGVzW2luZGV4XSkge1xuICAgICAgc3R5bGUucmVtb3ZlQ2hpbGQoY2hpbGROb2Rlc1tpbmRleF0pO1xuICAgIH1cblxuICAgIGlmIChjaGlsZE5vZGVzLmxlbmd0aCkge1xuICAgICAgc3R5bGUuaW5zZXJ0QmVmb3JlKGNzc05vZGUsIGNoaWxkTm9kZXNbaW5kZXhdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgc3R5bGUuYXBwZW5kQ2hpbGQoY3NzTm9kZSk7XG4gICAgfVxuICB9XG59XG5cbmZ1bmN0aW9uIGFwcGx5VG9UYWcoc3R5bGUsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gb2JqLmNzcztcbiAgdmFyIG1lZGlhID0gb2JqLm1lZGlhO1xuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcblxuICBpZiAobWVkaWEpIHtcbiAgICBzdHlsZS5zZXRBdHRyaWJ1dGUoJ21lZGlhJywgbWVkaWEpO1xuICB9IGVsc2Uge1xuICAgIHN0eWxlLnJlbW92ZUF0dHJpYnV0ZSgnbWVkaWEnKTtcbiAgfVxuXG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH0gLy8gRm9yIG9sZCBJRVxuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cblxuXG4gIGlmIChzdHlsZS5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGUuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZS5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZS5yZW1vdmVDaGlsZChzdHlsZS5maXJzdENoaWxkKTtcbiAgICB9XG5cbiAgICBzdHlsZS5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxuXG52YXIgc2luZ2xldG9uID0gbnVsbDtcbnZhciBzaW5nbGV0b25Db3VudGVyID0gMDtcblxuZnVuY3Rpb24gYWRkU3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBzdHlsZTtcbiAgdmFyIHVwZGF0ZTtcbiAgdmFyIHJlbW92ZTtcblxuICBpZiAob3B0aW9ucy5zaW5nbGV0b24pIHtcbiAgICB2YXIgc3R5bGVJbmRleCA9IHNpbmdsZXRvbkNvdW50ZXIrKztcbiAgICBzdHlsZSA9IHNpbmdsZXRvbiB8fCAoc2luZ2xldG9uID0gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpKTtcbiAgICB1cGRhdGUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGUsIHN0eWxlSW5kZXgsIGZhbHNlKTtcbiAgICByZW1vdmUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGUsIHN0eWxlSW5kZXgsIHRydWUpO1xuICB9IGVsc2Uge1xuICAgIHN0eWxlID0gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuICAgIHVwZGF0ZSA9IGFwcGx5VG9UYWcuYmluZChudWxsLCBzdHlsZSwgb3B0aW9ucyk7XG5cbiAgICByZW1vdmUgPSBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGUpO1xuICAgIH07XG4gIH1cblxuICB1cGRhdGUob2JqKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZVN0eWxlKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICB1cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmVtb3ZlKCk7XG4gICAgfVxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9OyAvLyBGb3JjZSBzaW5nbGUtdGFnIHNvbHV0aW9uIG9uIElFNi05LCB3aGljaCBoYXMgYSBoYXJkIGxpbWl0IG9uIHRoZSAjIG9mIDxzdHlsZT5cbiAgLy8gdGFncyBpdCB3aWxsIGFsbG93IG9uIGEgcGFnZVxuXG4gIGlmICghb3B0aW9ucy5zaW5nbGV0b24gJiYgdHlwZW9mIG9wdGlvbnMuc2luZ2xldG9uICE9PSAnYm9vbGVhbicpIHtcbiAgICBvcHRpb25zLnNpbmdsZXRvbiA9IGlzT2xkSUUoKTtcbiAgfVxuXG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcblxuICAgIGlmIChPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwobmV3TGlzdCkgIT09ICdbb2JqZWN0IEFycmF5XScpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRG9tW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuXG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcblxuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuXG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuXG4gICAgICBpZiAoc3R5bGVzSW5Eb21bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRG9tW19pbmRleF0udXBkYXRlcigpO1xuXG4gICAgICAgIHN0eWxlc0luRG9tLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiaW1wb3J0IFwiLi4vc3R5bGVzL3N0eWxlLmNzc1wiO1xuaW1wb3J0IEFkdmFuY2VkQmxhbmtzIGZyb20gJy4uL3NjcmlwdHMvYXBwJztcblxuLy8gTG9hZCBsaWJyYXJ5XG5INVAgPSBINVAgfHwge307XG5INVAuQWR2YW5jZWRCbGFua3MgPSBBZHZhbmNlZEJsYW5rczsiLCJleHBvcnQgZnVuY3Rpb24gZ2V0TG9uZ2VzdFN0cmluZyhzdHJpbmdzOiBzdHJpbmdbXSk6IHN0cmluZyB7XG4gIHJldHVybiBzdHJpbmdzLnJlZHVjZSgocHJldiwgY3VycmVudCkgPT4gY3VycmVudC5sZW5ndGggPiBwcmV2Lmxlbmd0aCA/IGN1cnJlbnQgOiBwcmV2LCBcIlwiKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNodWZmbGVBcnJheShhcnJheTogYW55W10pIHtcbiAgZm9yICh2YXIgaSA9IGFycmF5Lmxlbmd0aCAtIDE7IGkgPiAwOyBpLS0pIHtcbiAgICB2YXIgaiA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIChpICsgMSkpO1xuICAgIHZhciB0ZW1wID0gYXJyYXlbaV07XG4gICAgYXJyYXlbaV0gPSBhcnJheVtqXTtcbiAgICBhcnJheVtqXSA9IHRlbXA7XG4gIH1cbiAgcmV0dXJuIGFycmF5O1xufSIsIi8vIFRPRE8gY2FuIHdlIGp1c3QgZGVjbGFyZSB0aGUga2V5ZG93bkhhbmRsZXIgb25jZT8gdXNpbmcgYHRoaXNgP1xuZnVuY3Rpb24gbWFrZUtleURlZmluaXRpb24oY29kZT86IG51bWJlcikge1xuICByZXR1cm4gKG5vZGUsIGZpcmUpID0+IHtcbiAgICBmdW5jdGlvbiBrZXlkb3duSGFuZGxlcihldmVudCkge1xuICAgICAgdmFyIHdoaWNoID0gZXZlbnQud2hpY2ggfHwgZXZlbnQua2V5Q29kZTtcblxuICAgICAgaWYgKGNvZGUgJiYgd2hpY2ggPT09IGNvZGUpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBmaXJlKHtcbiAgICAgICAgICBub2RlLFxuICAgICAgICAgIG9yaWdpbmFsOiBldmVudFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKCFjb2RlICYmIFsxNiwgMTcsIDE4LCAzNSwgMzYsIDEzLCA5LCAyNywgMzIsIDM3LCAzOSwgNDAsIDM4XS5maWx0ZXIoYyA9PiBjID09PSB3aGljaCkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGZpcmUoe1xuICAgICAgICAgIG5vZGUsXG4gICAgICAgICAgb3JpZ2luYWw6IGV2ZW50XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIG5vZGUuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGtleWRvd25IYW5kbGVyLCBmYWxzZSk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgdGVhcmRvd24oKSB7XG4gICAgICAgIG5vZGUucmVtb3ZlRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIGtleWRvd25IYW5kbGVyLCBmYWxzZSk7XG4gICAgICB9XG4gICAgfTtcbiAgfTtcbn1cblxuZXhwb3J0IGNvbnN0IGVudGVyID0gbWFrZUtleURlZmluaXRpb24oMTMpO1xuZXhwb3J0IGNvbnN0IHRhYiA9IG1ha2VLZXlEZWZpbml0aW9uKDkpO1xuZXhwb3J0IGNvbnN0IGVzY2FwZSA9IG1ha2VLZXlEZWZpbml0aW9uKDI3KTtcbmV4cG9ydCBjb25zdCBzcGFjZSA9IG1ha2VLZXlEZWZpbml0aW9uKDMyKTtcblxuZXhwb3J0IGNvbnN0IGxlZnRhcnJvdyA9IG1ha2VLZXlEZWZpbml0aW9uKDM3KTtcbmV4cG9ydCBjb25zdCByaWdodGFycm93ID0gbWFrZUtleURlZmluaXRpb24oMzkpO1xuZXhwb3J0IGNvbnN0IGRvd25hcnJvdyA9IG1ha2VLZXlEZWZpbml0aW9uKDQwKTtcbmV4cG9ydCBjb25zdCB1cGFycm93ID0gbWFrZUtleURlZmluaXRpb24oMzgpO1xuXG5leHBvcnQgY29uc3QgYW55a2V5ID0gbWFrZUtleURlZmluaXRpb24oKTsiLCJpbXBvcnQgeyBCbGFua0xvYWRlciB9IGZyb20gJy4vY29udGVudC1sb2FkZXJzL2JsYW5rLWxvYWRlcic7XG5pbXBvcnQgeyBINVBEYXRhUmVwb3NpdG9yeSwgSURhdGFSZXBvc2l0b3J5IH0gZnJvbSAnLi9zZXJ2aWNlcy9kYXRhLXJlcG9zaXRvcnknO1xuaW1wb3J0IHsgQ2xvemVDb250cm9sbGVyIH0gZnJvbSAnLi9jb250cm9sbGVycy9jbG96ZS1jb250cm9sbGVyJztcbmltcG9ydCB7IEg1UExvY2FsaXphdGlvbiwgTG9jYWxpemF0aW9uTGFiZWxzLCBMb2NhbGl6YXRpb25TdHJ1Y3R1cmVzIH0gZnJvbSBcIi4vc2VydmljZXMvbG9jYWxpemF0aW9uXCI7XG5pbXBvcnQgeyBJU2V0dGluZ3MsIEg1UFNldHRpbmdzIH0gZnJvbSBcIi4vc2VydmljZXMvc2V0dGluZ3NcIjtcbmltcG9ydCB7IE1lc3NhZ2VTZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlcy9tZXNzYWdlLXNlcnZpY2UnO1xuaW1wb3J0IHsgVW5yd2FwcGVyIH0gZnJvbSAnLi9oZWxwZXJzL3Vud3JhcHBlcic7XG5pbXBvcnQgeyBYQVBJQWN0aXZpdHlEZWZpbml0aW9uIH0gZnJvbSAnLi9tb2RlbHMveGFwaSc7XG5pbXBvcnQgeyBjcmVhdGVQZXJtdXRhdGlvbnMgfSBmcm9tICcuL2hlbHBlcnMvcGVybXV0YXRpb25zJztcblxuXG5lbnVtIFN0YXRlcyB7XG4gIG9uZ29pbmcgPSAnb25nb2luZycsXG4gIGNoZWNraW5nID0gJ2NoZWNraW5nJyxcbiAgc2hvd2luZ1NvbHV0aW9ucyA9ICdzaG93aW5nLXNvbHV0aW9uJyxcbiAgZmluaXNoZWQgPSAnZmluaXNoZWQnLFxuICBzaG93aW5nU29sdXRpb25zRW1iZWRkZWQgPSAnc2hvd2luZy1zb2x1dGlvbi1lbWJlZGRlZCdcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQWR2YW5jZWRCbGFua3MgZXh0ZW5kcyAoSDVQLlF1ZXN0aW9uIGFzIHsgbmV3KCk6IGFueTsgfSkge1xuXG4gIHByaXZhdGUgY2xvemVDb250cm9sbGVyOiBDbG96ZUNvbnRyb2xsZXI7XG4gIHByaXZhdGUgcmVwb3NpdG9yeTogSURhdGFSZXBvc2l0b3J5O1xuICBwcml2YXRlIHNldHRpbmdzOiBJU2V0dGluZ3M7XG4gIHByaXZhdGUgbG9jYWxpemF0aW9uOiBINVBMb2NhbGl6YXRpb247XG4gIHByaXZhdGUgbWVzc2FnZVNlcnZpY2U6IE1lc3NhZ2VTZXJ2aWNlO1xuXG4gIHByaXZhdGUgalF1ZXJ5O1xuXG4gIHByaXZhdGUgY29udGVudElkOiBzdHJpbmc7XG4gIHByaXZhdGUgcHJldmlvdXNTdGF0ZTogYW55O1xuICBwcml2YXRlIHN0YXRlOiBTdGF0ZXM7XG5cbiAgLyoqXG4gICAqIEluZGljYXRlcyBpZiB1c2VyIGhhcyBlbnRlcmVkIGFueSBhbnN3ZXIgc28gZmFyLlxuICAgKi9cbiAgcHJpdmF0ZSBhbnN3ZXJlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBAY29uc3RydWN0b3JcbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IGNvbmZpZ1xuICAgKiBAcGFyYW0ge3N0cmluZ30gY29udGVudElkXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBjb250ZW50RGF0YVxuICAgKi9cbiAgY29uc3RydWN0b3IoY29uZmlnOiBhbnksIGNvbnRlbnRJZDogc3RyaW5nLCBjb250ZW50RGF0YTogYW55ID0ge30pIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5qUXVlcnkgPSBINVAualF1ZXJ5O1xuICAgIHRoaXMuY29udGVudElkID0gY29udGVudElkO1xuXG4gICAgbGV0IHVud3JhcHBlciA9IG5ldyBVbnJ3YXBwZXIodGhpcy5qUXVlcnkpO1xuXG4gICAgdGhpcy5zZXR0aW5ncyA9IG5ldyBINVBTZXR0aW5ncyhjb25maWcpO1xuICAgIHRoaXMubG9jYWxpemF0aW9uID0gbmV3IEg1UExvY2FsaXphdGlvbihjb25maWcpO1xuICAgIHRoaXMucmVwb3NpdG9yeSA9IG5ldyBINVBEYXRhUmVwb3NpdG9yeShjb25maWcsIHRoaXMuc2V0dGluZ3MsIHRoaXMubG9jYWxpemF0aW9uLCA8SlF1ZXJ5U3RhdGljPnRoaXMualF1ZXJ5LCB1bndyYXBwZXIpO1xuICAgIHRoaXMubWVzc2FnZVNlcnZpY2UgPSBuZXcgTWVzc2FnZVNlcnZpY2UodGhpcy5qUXVlcnkpO1xuICAgIEJsYW5rTG9hZGVyLmluaXRpYWxpemUodGhpcy5zZXR0aW5ncywgdGhpcy5sb2NhbGl6YXRpb24sIHRoaXMualF1ZXJ5LCB0aGlzLm1lc3NhZ2VTZXJ2aWNlKTtcblxuICAgIHRoaXMuY2xvemVDb250cm9sbGVyID0gbmV3IENsb3plQ29udHJvbGxlcih0aGlzLnJlcG9zaXRvcnksIHRoaXMuc2V0dGluZ3MsIHRoaXMubG9jYWxpemF0aW9uLCB0aGlzLm1lc3NhZ2VTZXJ2aWNlKTtcblxuICAgIHRoaXMuY2xvemVDb250cm9sbGVyLm9uU2NvcmVDaGFuZ2VkID0gdGhpcy5vblNjb3JlQ2hhbmdlZDtcbiAgICB0aGlzLmNsb3plQ29udHJvbGxlci5vblNvbHZlZCA9IHRoaXMub25Tb2x2ZWQ7XG4gICAgdGhpcy5jbG96ZUNvbnRyb2xsZXIub25BdXRvQ2hlY2tlZCA9IHRoaXMub25BdXRvQ2hlY2tlZDtcbiAgICB0aGlzLmNsb3plQ29udHJvbGxlci5vblR5cGVkID0gdGhpcy5vblR5cGVkO1xuXG4gICAgaWYgKGNvbnRlbnREYXRhICYmIGNvbnRlbnREYXRhLnByZXZpb3VzU3RhdGUpXG4gICAgICB0aGlzLnByZXZpb3VzU3RhdGUgPSBjb250ZW50RGF0YS5wcmV2aW91c1N0YXRlO1xuXG4gICAgLyoqXG4gICAgKiBPdmVycmlkZXMgdGhlIGF0dGFjaCBtZXRob2Qgb2YgdGhlIHN1cGVyY2xhc3MgKEg1UC5RdWVzdGlvbikgYW5kIGNhbGxzIGl0XG4gICAgKiBhdCB0aGUgc2FtZSB0aW1lLiAoZXF1aXZhbGVudCB0byBzdXBlci5hdHRhY2goJGNvbnRhaW5lcikpLlxuICAgICogVGhpcyBpcyBuZWNlc3NhcnksIGFzIFJhY3RpdmUgbmVlZHMgdG8gYmUgaW5pdGlhbGl6ZWQgd2l0aCBhbiBleGlzdGluZyBET01cbiAgICAqIGVsZW1lbnQuIERPTSBlbGVtZW50cyBhcmUgY3JlYXRlZCBpbiBINVAuUXVlc3Rpb24uYXR0YWNoLCBzbyBpbml0aWFsaXppbmcgXG4gICAgKiBSYWN0aXZlIGluIHJlZ2lzdGVyRG9tRWxlbWVudHMgZG9lc24ndCB3b3JrLlxuICAgICovXG4gICAgdGhpcy5hdHRhY2ggPSAoKG9yaWdpbmFsKSA9PiB7XG4gICAgICByZXR1cm4gKCRjb250YWluZXIpID0+IHtcbiAgICAgICAgb3JpZ2luYWwoJGNvbnRhaW5lcik7XG4gICAgICAgIHRoaXMuY2xvemVDb250cm9sbGVyLmluaXRpYWxpemUodGhpcy5jb250YWluZXIuZ2V0KDApLCAkY29udGFpbmVyKTtcbiAgICAgICAgaWYgKHRoaXMuY2xvemVDb250cm9sbGVyLmRlc2VyaWFsaXplQ2xvemUodGhpcy5wcmV2aW91c1N0YXRlKSkge1xuICAgICAgICAgIHRoaXMuYW5zd2VyZWQgPSB0aGlzLmNsb3plQ29udHJvbGxlci5pc0ZpbGxlZE91dDtcbiAgICAgICAgICBpZiAodGhpcy5zZXR0aW5ncy5hdXRvQ2hlY2spXG4gICAgICAgICAgICB0aGlzLm9uQ2hlY2tBbnN3ZXIoKTtcbiAgICAgICAgICB0aGlzLnRvZ2dsZUJ1dHRvblZpc2liaWxpdHkodGhpcy5zdGF0ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KSh0aGlzLmF0dGFjaCk7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGVkIGZyb20gb3V0c2lkZSB3aGVuIHRoZSBzY29yZSBvZiB0aGUgY2xvemUgaGFzIGNoYW5nZWQuXG4gICAqL1xuICBwcml2YXRlIG9uU2NvcmVDaGFuZ2VkID0gKHNjb3JlOiBudW1iZXIsIG1heFNjb3JlOiBudW1iZXIpID0+IHtcbiAgICBpZiAodGhpcy5jbG96ZUNvbnRyb2xsZXIuaXNGdWxseUZpbGxlZE91dCkge1xuICAgICAgdGhpcy50cmFuc2l0aW9uU3RhdGUoKTtcbiAgICAgIGlmICh0aGlzLnN0YXRlICE9PSBTdGF0ZXMuZmluaXNoZWQpXG4gICAgICAgIHRoaXMuc3RhdGUgPSBTdGF0ZXMuY2hlY2tpbmc7XG4gICAgICB0aGlzLnNob3dGZWVkYmFjaygpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMuc2V0RmVlZGJhY2soXCJcIiwgc2NvcmUsIG1heFNjb3JlKTtcbiAgICB9XG4gICAgdGhpcy50cmFuc2l0aW9uU3RhdGUoKTtcbiAgICB0aGlzLnRvZ2dsZUJ1dHRvblZpc2liaWxpdHkodGhpcy5zdGF0ZSk7XG4gIH1cblxuICBwcml2YXRlIG9uU29sdmVkKCkge1xuXG4gIH1cblxuICBwcml2YXRlIG9uVHlwZWQgPSAoKSA9PiB7XG4gICAgaWYgKHRoaXMuc3RhdGUgPT09IFN0YXRlcy5jaGVja2luZykge1xuICAgICAgdGhpcy5zdGF0ZSA9IFN0YXRlcy5vbmdvaW5nO1xuICAgICAgdGhpcy50b2dnbGVCdXR0b25WaXNpYmlsaXR5KHRoaXMuc3RhdGUpO1xuICAgIH1cbiAgICB0aGlzLnRyaWdnZXJYQVBJKCdpbnRlcmFjdGVkJyk7XG4gICAgdGhpcy5hbnN3ZXJlZCA9IHRydWU7XG4gIH1cblxuICBwcml2YXRlIG9uQXV0b0NoZWNrZWQgPSAoKSA9PiB7XG4gICAgdGhpcy50cmlnZ2VyWEFQSSgnaW50ZXJhY3RlZCcpO1xuICAgIHRoaXMudHJpZ2dlclhBUElBbnN3ZXJlZCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxlZCBieSBINVAuUXVlc3Rpb24uYXR0YWNoKCkuIENyZWF0ZXMgYWxsIGNvbnRlbnQgZWxlbWVudHMgYW5kIHJlZ2lzdGVycyB0aGVtXG4gICAqIHdpdGggSDVQLlF1ZXN0aW9uLlxuICAgKi9cbiAgcmVnaXN0ZXJEb21FbGVtZW50cyA9IGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLnJlZ2lzdGVyTWVkaWEoKTtcbiAgICB0aGlzLnNldEludHJvZHVjdGlvbih0aGlzLnJlcG9zaXRvcnkuZ2V0VGFza0Rlc2NyaXB0aW9uKCkpO1xuXG4gICAgdGhpcy5jb250YWluZXIgPSB0aGlzLmpRdWVyeShcIjxkaXYvPlwiLCB7IFwiY2xhc3NcIjogXCJoNXAtYWR2YW5jZWQtYmxhbmtzXCIgfSk7XG4gICAgdGhpcy5zZXRDb250ZW50KHRoaXMuY29udGFpbmVyKTtcbiAgICB0aGlzLnJlZ2lzdGVyQnV0dG9ucygpO1xuXG4gICAgdGhpcy5tb3ZlVG9TdGF0ZShTdGF0ZXMub25nb2luZyk7XG4gIH1cblxuICAvKipcbiAgICogQHJldHVybnMgSlF1ZXJ5IC0gVGhlIG91dGVyIGg1cCBjb250YWluZXIuIFRoZSBsaWJyYXJ5IGNhbiBhZGQgZGlhbG9ndWVzIHRvIHRoaXNcbiAgICogZWxlbWVudC4gXG4gICAqL1xuICBwcml2YXRlIGdldEg1cENvbnRhaW5lcigpOiBKUXVlcnkge1xuICAgIHZhciAkY29udGVudCA9IHRoaXMualF1ZXJ5KCdbZGF0YS1jb250ZW50LWlkPVwiJyArIHRoaXMuY29udGVudElkICsgJ1wiXS5oNXAtY29udGVudCcpO1xuICAgIHZhciAkY29udGFpbmVyUGFyZW50cyA9ICRjb250ZW50LnBhcmVudHMoJy5oNXAtY29udGFpbmVyJyk7XG5cbiAgICAvLyBzZWxlY3QgZmluZCBjb250YWluZXIgdG8gYXR0YWNoIGRpYWxvZ3MgdG9cbiAgICB2YXIgJGNvbnRhaW5lcjtcbiAgICBpZiAoJGNvbnRhaW5lclBhcmVudHMubGVuZ3RoICE9PSAwKSB7XG4gICAgICAvLyB1c2UgcGFyZW50IGhpZ2hlc3QgdXAgaWYgYW55XG4gICAgICAkY29udGFpbmVyID0gJGNvbnRhaW5lclBhcmVudHMubGFzdCgpO1xuICAgIH1cbiAgICBlbHNlIGlmICgkY29udGVudC5sZW5ndGggIT09IDApIHtcbiAgICAgICRjb250YWluZXIgPSAkY29udGVudDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAkY29udGFpbmVyID0gdGhpcy5qUXVlcnkoZG9jdW1lbnQuYm9keSk7XG4gICAgfVxuXG4gICAgcmV0dXJuICRjb250YWluZXI7XG4gIH1cblxuICBwcml2YXRlIHJlZ2lzdGVyTWVkaWEoKSB7XG4gICAgdmFyIG1lZGlhID0gdGhpcy5yZXBvc2l0b3J5LmdldE1lZGlhKCk7XG4gICAgaWYgKCFtZWRpYSB8fCAhbWVkaWEubGlicmFyeSlcbiAgICAgIHJldHVybjtcblxuICAgIHZhciB0eXBlID0gbWVkaWEubGlicmFyeS5zcGxpdCgnICcpWzBdO1xuICAgIGlmICh0eXBlID09PSAnSDVQLkltYWdlJykge1xuICAgICAgaWYgKG1lZGlhLnBhcmFtcy5maWxlKSB7XG4gICAgICAgIHRoaXMuc2V0SW1hZ2UobWVkaWEucGFyYW1zLmZpbGUucGF0aCwge1xuICAgICAgICAgIGRpc2FibGVJbWFnZVpvb21pbmc6IHRoaXMuc2V0dGluZ3MuZGlzYWJsZUltYWdlWm9vbWluZyxcbiAgICAgICAgICBhbHQ6IG1lZGlhLnBhcmFtcy5hbHRcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuICAgIGVsc2UgaWYgKHR5cGUgPT09ICdINVAuVmlkZW8nKSB7XG4gICAgICBpZiAobWVkaWEucGFyYW1zLnNvdXJjZXMpIHtcbiAgICAgICAgdGhpcy5zZXRWaWRlbyhtZWRpYSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZWdpc3RlckJ1dHRvbnMoKSB7XG4gICAgdmFyICRjb250YWluZXIgPSB0aGlzLmdldEg1cENvbnRhaW5lcigpO1xuXG4gICAgaWYgKCF0aGlzLnNldHRpbmdzLmF1dG9DaGVjaykge1xuICAgICAgLy8gQ2hlY2sgYW5zd2VyIGJ1dHRvblxuICAgICAgdGhpcy5hZGRCdXR0b24oJ2NoZWNrLWFuc3dlcicsIHRoaXMubG9jYWxpemF0aW9uLmdldFRleHRGcm9tTGFiZWwoTG9jYWxpemF0aW9uTGFiZWxzLmNoZWNrQWxsQnV0dG9uKSxcbiAgICAgICAgdGhpcy5vbkNoZWNrQW5zd2VyLCB0cnVlLCB7fSwge1xuICAgICAgICBjb25maXJtYXRpb25EaWFsb2c6IHtcbiAgICAgICAgICBlbmFibGU6IHRoaXMuc2V0dGluZ3MuY29uZmlybUNoZWNrRGlhbG9nLFxuICAgICAgICAgIGwxMG46IHRoaXMubG9jYWxpemF0aW9uLmdldE9iamVjdEZvclN0cnVjdHVyZShMb2NhbGl6YXRpb25TdHJ1Y3R1cmVzLmNvbmZpcm1DaGVjayksXG4gICAgICAgICAgaW5zdGFuY2U6IHRoaXMsXG4gICAgICAgICAgJHBhcmVudEVsZW1lbnQ6ICRjb250YWluZXJcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy8gU2hvdyBzb2x1dGlvbiBidXR0b25cbiAgICB0aGlzLmFkZEJ1dHRvbignc2hvdy1zb2x1dGlvbicsIHRoaXMubG9jYWxpemF0aW9uLmdldFRleHRGcm9tTGFiZWwoTG9jYWxpemF0aW9uTGFiZWxzLnNob3dTb2x1dGlvbkJ1dHRvbiksXG4gICAgICB0aGlzLm9uU2hvd1NvbHV0aW9uLCB0aGlzLnNldHRpbmdzLmVuYWJsZVNvbHV0aW9uc0J1dHRvbik7XG5cbiAgICAvLyBUcnkgYWdhaW4gYnV0dG9uXG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuZW5hYmxlUmV0cnkgPT09IHRydWUpIHtcbiAgICAgIHRoaXMuYWRkQnV0dG9uKCd0cnktYWdhaW4nLCB0aGlzLmxvY2FsaXphdGlvbi5nZXRUZXh0RnJvbUxhYmVsKExvY2FsaXphdGlvbkxhYmVscy5yZXRyeUJ1dHRvbiksXG4gICAgICAgIHRoaXMub25SZXRyeSwgdHJ1ZSwge30sIHtcbiAgICAgICAgY29uZmlybWF0aW9uRGlhbG9nOiB7XG4gICAgICAgICAgZW5hYmxlOiB0aGlzLnNldHRpbmdzLmNvbmZpcm1SZXRyeURpYWxvZyxcbiAgICAgICAgICBsMTBuOiB0aGlzLmxvY2FsaXphdGlvbi5nZXRPYmplY3RGb3JTdHJ1Y3R1cmUoTG9jYWxpemF0aW9uU3RydWN0dXJlcy5jb25maXJtUmV0cnkpLFxuICAgICAgICAgIGluc3RhbmNlOiB0aGlzLFxuICAgICAgICAgICRwYXJlbnRFbGVtZW50OiAkY29udGFpbmVyXG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgb25DaGVja0Fuc3dlciA9ICgpID0+IHtcbiAgICB0aGlzLmNsb3plQ29udHJvbGxlci5jaGVja0FsbCgpO1xuXG4gICAgdGhpcy50cmlnZ2VyWEFQSSgnaW50ZXJhY3RlZCcpO1xuICAgIHRoaXMudHJpZ2dlclhBUElBbnN3ZXJlZCgpO1xuXG4gICAgdGhpcy50cmFuc2l0aW9uU3RhdGUoKTtcbiAgICBpZiAodGhpcy5zdGF0ZSAhPT0gU3RhdGVzLmZpbmlzaGVkKVxuICAgICAgdGhpcy5zdGF0ZSA9IFN0YXRlcy5jaGVja2luZztcblxuICAgIHRoaXMuc2hvd0ZlZWRiYWNrKCk7XG5cbiAgICB0aGlzLnRvZ2dsZUJ1dHRvblZpc2liaWxpdHkodGhpcy5zdGF0ZSk7XG4gIH1cblxuICBwcml2YXRlIHRyYW5zaXRpb25TdGF0ZSA9ICgpID0+IHtcbiAgICBpZiAodGhpcy5jbG96ZUNvbnRyb2xsZXIuaXNTb2x2ZWQpIHtcbiAgICAgIHRoaXMubW92ZVRvU3RhdGUoU3RhdGVzLmZpbmlzaGVkKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIG9uU2hvd1NvbHV0aW9uID0gKCkgPT4ge1xuICAgIHRoaXMubW92ZVRvU3RhdGUoU3RhdGVzLnNob3dpbmdTb2x1dGlvbnMpO1xuICAgIHRoaXMuY2xvemVDb250cm9sbGVyLnNob3dTb2x1dGlvbnMoKTtcbiAgICB0aGlzLnNob3dGZWVkYmFjaygpO1xuICB9XG5cbiAgcHJpdmF0ZSBvblJldHJ5ID0gKCkgPT4ge1xuICAgIHRoaXMucmVtb3ZlRmVlZGJhY2soKTtcbiAgICB0aGlzLmNsb3plQ29udHJvbGxlci5yZXNldCgpO1xuICAgIHRoaXMuYW5zd2VyZWQgPSBmYWxzZTtcbiAgICB0aGlzLm1vdmVUb1N0YXRlKFN0YXRlcy5vbmdvaW5nKTtcbiAgfVxuXG4gIHByaXZhdGUgc2hvd0ZlZWRiYWNrKCkge1xuICAgIHZhciBzY29yZVRleHQgPSBINVAuUXVlc3Rpb24uZGV0ZXJtaW5lT3ZlcmFsbEZlZWRiYWNrKHRoaXMubG9jYWxpemF0aW9uLmdldE9iamVjdEZvclN0cnVjdHVyZShMb2NhbGl6YXRpb25TdHJ1Y3R1cmVzLm92ZXJhbGxGZWVkYmFjayksIHRoaXMuY2xvemVDb250cm9sbGVyLmN1cnJlbnRTY29yZSAvIHRoaXMuY2xvemVDb250cm9sbGVyLm1heFNjb3JlKS5yZXBsYWNlKCdAc2NvcmUnLCB0aGlzLmNsb3plQ29udHJvbGxlci5jdXJyZW50U2NvcmUpLnJlcGxhY2UoJ0B0b3RhbCcsIHRoaXMuY2xvemVDb250cm9sbGVyLm1heFNjb3JlKTtcbiAgICB0aGlzLnNldEZlZWRiYWNrKHNjb3JlVGV4dCwgdGhpcy5jbG96ZUNvbnRyb2xsZXIuY3VycmVudFNjb3JlLCB0aGlzLmNsb3plQ29udHJvbGxlci5tYXhTY29yZSwgdGhpcy5sb2NhbGl6YXRpb24uZ2V0VGV4dEZyb21MYWJlbChMb2NhbGl6YXRpb25MYWJlbHMuc2NvcmVCYXJMYWJlbCkpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNob3dzIGFyZSBoaWRlcyBidXR0b25zIGRlcGVuZGluZyBvbiB0aGUgY3VycmVudCBzdGF0ZSBhbmQgc2V0dGluZ3MgbWFkZVxuICAgKiBieSB0aGUgY29udGVudCBjcmVhdG9yLlxuICAgKiBAcGFyYW0gIHtTdGF0ZXN9IHN0YXRlXG4gICAqL1xuICBwcml2YXRlIG1vdmVUb1N0YXRlKHN0YXRlOiBTdGF0ZXMpIHtcbiAgICB0aGlzLnN0YXRlID0gc3RhdGU7XG4gICAgdGhpcy50b2dnbGVCdXR0b25WaXNpYmlsaXR5KHN0YXRlKTtcbiAgfVxuXG4gIHByaXZhdGUgdG9nZ2xlQnV0dG9uVmlzaWJpbGl0eShzdGF0ZTogU3RhdGVzKSB7XG4gICAgaWYgKHRoaXMuc2V0dGluZ3MuZW5hYmxlU29sdXRpb25zQnV0dG9uKSB7XG4gICAgICBpZiAoKChzdGF0ZSA9PT0gU3RhdGVzLmNoZWNraW5nKVxuICAgICAgICB8fCAodGhpcy5zZXR0aW5ncy5hdXRvQ2hlY2sgJiYgc3RhdGUgPT09IFN0YXRlcy5vbmdvaW5nKSlcbiAgICAgICAgJiYgKCF0aGlzLnNldHRpbmdzLnNob3dTb2x1dGlvbnNSZXF1aXJlc0lucHV0IHx8IHRoaXMuY2xvemVDb250cm9sbGVyLmFsbEJsYW5rc0VudGVyZWQpKSB7XG4gICAgICAgIHRoaXMuc2hvd0J1dHRvbignc2hvdy1zb2x1dGlvbicpO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIHRoaXMuaGlkZUJ1dHRvbignc2hvdy1zb2x1dGlvbicpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmICh0aGlzLnNldHRpbmdzLmVuYWJsZVJldHJ5ICYmIChzdGF0ZSA9PT0gU3RhdGVzLmNoZWNraW5nIHx8IHN0YXRlID09PSBTdGF0ZXMuZmluaXNoZWQgfHwgc3RhdGUgPT09IFN0YXRlcy5zaG93aW5nU29sdXRpb25zKSkge1xuICAgICAgdGhpcy5zaG93QnV0dG9uKCd0cnktYWdhaW4nKTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLmhpZGVCdXR0b24oJ3RyeS1hZ2FpbicpO1xuICAgIH1cblxuXG4gICAgaWYgKHN0YXRlID09PSBTdGF0ZXMub25nb2luZyAmJiB0aGlzLnNldHRpbmdzLmVuYWJsZUNoZWNrQnV0dG9uKSB7XG4gICAgICB0aGlzLnNob3dCdXR0b24oJ2NoZWNrLWFuc3dlcicpO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgIHRoaXMuaGlkZUJ1dHRvbignY2hlY2stYW5zd2VyJyk7XG4gICAgfVxuXG4gICAgaWYgKHN0YXRlID09PSBTdGF0ZXMuc2hvd2luZ1NvbHV0aW9uc0VtYmVkZGVkKSB7XG4gICAgICB0aGlzLmhpZGVCdXR0b24oJ2NoZWNrLWFuc3dlcicpO1xuICAgICAgdGhpcy5oaWRlQnV0dG9uKCd0cnktYWdhaW4nKTtcbiAgICAgIHRoaXMuaGlkZUJ1dHRvbignc2hvdy1zb2x1dGlvbicpO1xuICAgIH1cblxuICAgIHRoaXMudHJpZ2dlcigncmVzaXplJyk7XG4gIH1cblxuICBwdWJsaWMgZ2V0Q3VycmVudFN0YXRlID0gKCk6IHN0cmluZ1tdID0+IHtcbiAgICByZXR1cm4gdGhpcy5jbG96ZUNvbnRyb2xsZXIuc2VyaWFsaXplQ2xvemUoKTtcbiAgfTtcblxuICAvKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgKiBJbXBsZW1lbnRhdGlvbiBvZiBRdWVzdGlvbiBjb250cmFjdCAgKlxuICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgcHVibGljIGdldEFuc3dlckdpdmVuID0gKCk6IGJvb2xlYW4gPT4ge1xuICAgIHJldHVybiB0aGlzLmFuc3dlcmVkIHx8IHRoaXMuY2xvemVDb250cm9sbGVyLm1heFNjb3JlID09PSAwO1xuICB9XG5cbiAgcHVibGljIGdldFNjb3JlID0gKCk6IG51bWJlciA9PiB7XG4gICAgdGhpcy5vbkNoZWNrQW5zd2VyKCk7XG4gICAgcmV0dXJuIHRoaXMuY2xvemVDb250cm9sbGVyLmN1cnJlbnRTY29yZTtcbiAgfVxuXG4gIHB1YmxpYyBnZXRNYXhTY29yZSA9ICgpOiBudW1iZXIgPT4ge1xuICAgIHJldHVybiB0aGlzLmNsb3plQ29udHJvbGxlci5tYXhTY29yZTtcbiAgfVxuXG4gIHB1YmxpYyBzaG93U29sdXRpb25zID0gKCkgPT4ge1xuICAgIHRoaXMub25DaGVja0Fuc3dlcigpO1xuICAgIHRoaXMub25TaG93U29sdXRpb24oKTtcbiAgICB0aGlzLm1vdmVUb1N0YXRlKFN0YXRlcy5zaG93aW5nU29sdXRpb25zRW1iZWRkZWQpO1xuICB9XG5cbiAgcHVibGljIHJlc2V0VGFzayA9ICgpID0+IHtcbiAgICB0aGlzLm9uUmV0cnkoKTtcbiAgfVxuXG4gIC8qKipcbiAgICogWEFwaSBpbXBsZW1lbnRhdGlvblxuICAgKi9cblxuXG4gIC8qKlxuICAgKiBUcmlnZ2VyIHhBUEkgYW5zd2VyZWQgZXZlbnRcbiAgICovXG4gIHB1YmxpYyB0cmlnZ2VyWEFQSUFuc3dlcmVkID0gKCk6IHZvaWQgPT4ge1xuICAgIHRoaXMuYW5zd2VyZWQgPSB0cnVlO1xuICAgIHZhciB4QVBJRXZlbnQgPSB0aGlzLmNyZWF0ZVhBUElFdmVudFRlbXBsYXRlKCdhbnN3ZXJlZCcpO1xuICAgIHRoaXMuYWRkUXVlc3Rpb25Ub1hBUEkoeEFQSUV2ZW50KTtcbiAgICB0aGlzLmFkZFJlc3BvbnNlVG9YQVBJKHhBUElFdmVudCk7XG4gICAgdGhpcy50cmlnZ2VyKHhBUElFdmVudCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEdldCB4QVBJIGRhdGEuXG4gICAqIENvbnRyYWN0IHVzZWQgYnkgcmVwb3J0IHJlbmRlcmluZyBlbmdpbmUuXG4gICAqXG4gICAqIEBzZWUgY29udHJhY3QgYXQge0BsaW5rIGh0dHBzOi8vaDVwLm9yZy9kb2N1bWVudGF0aW9uL2RldmVsb3BlcnMvY29udHJhY3RzI2d1aWRlcy1oZWFkZXItNn1cbiAgICovXG4gIHB1YmxpYyBnZXRYQVBJRGF0YSA9ICgpID0+IHtcbiAgICB2YXIgeEFQSUV2ZW50ID0gdGhpcy5jcmVhdGVYQVBJRXZlbnRUZW1wbGF0ZSgnYW5zd2VyZWQnKTtcbiAgICB0aGlzLmFkZFF1ZXN0aW9uVG9YQVBJKHhBUElFdmVudCk7XG4gICAgdGhpcy5hZGRSZXNwb25zZVRvWEFQSSh4QVBJRXZlbnQpO1xuICAgIHJldHVybiB7XG4gICAgICBzdGF0ZW1lbnQ6IHhBUElFdmVudC5kYXRhLnN0YXRlbWVudFxuICAgIH07XG4gIH07XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlIHhBUEkgb2JqZWN0IGRlZmluaXRpb24gdXNlZCBpbiB4QVBJIHN0YXRlbWVudHMuXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICovXG4gIHB1YmxpYyBnZXR4QVBJRGVmaW5pdGlvbiA9ICgpOiBYQVBJQWN0aXZpdHlEZWZpbml0aW9uID0+IHtcbiAgICB2YXIgZGVmaW5pdGlvbiA9IG5ldyBYQVBJQWN0aXZpdHlEZWZpbml0aW9uKCk7XG4gICAgZGVmaW5pdGlvbi5kZXNjcmlwdGlvbiA9IHtcbiAgICAgICdlbi1VUyc6ICc8cD4nICsgdGhpcy5yZXBvc2l0b3J5LmdldFRhc2tEZXNjcmlwdGlvbigpICsgJzwvcD4nICsgdGhpcy5yZXBvc2l0b3J5LmdldENsb3plVGV4dCgpXG4gICAgfTtcbiAgICBkZWZpbml0aW9uLnR5cGUgPSAnaHR0cDovL2FkbG5ldC5nb3YvZXhwYXBpL2FjdGl2aXRpZXMvY21pLmludGVyYWN0aW9uJztcbiAgICBkZWZpbml0aW9uLmludGVyYWN0aW9uVHlwZSA9ICdmaWxsLWluJzsgLy8gV2UgdXNlIHRoZSAnZmlsbC1pbicgdHlwZSBldmVuIGluIHNlbGVjdCBtb2RlLCBhcyB0aGUgeEFQSSBmb3JtYXQgZm9yIHNlbGVjdGlvbnMgZG9lc24ndCByZWFsbHkgY2F0ZXIgZm9yIHNlcXVlbmNlcy5cbiAgICBkZWZpbml0aW9uLmNvcnJlY3RSZXNwb25zZXNQYXR0ZXJuID0gW107XG4gICAgbGV0IGNvcnJlY3RSZXNwb25zZXNQYXR0ZXJuUHJlZml4ID0gJ3tjYXNlX21hdHRlcnM9JyArIHRoaXMuc2V0dGluZ3MuY2FzZVNlbnNpdGl2ZSArICd9JztcblxuICAgIC8vIHhBUEkgZm9yY2VzIHVzIHRvIGNyZWF0ZSBzb2x1dGlvbiBwYXR0ZXJucyBmb3IgYWxsIHBvc3NpYmxlIHNvbHV0aW9uIGNvbWJpbmF0aW9uc1xuICAgIGxldCBjb3JyZWN0QW5zd2VyUGVybXV0YXRpb25zID0gY3JlYXRlUGVybXV0YXRpb25zKHRoaXMuY2xvemVDb250cm9sbGVyLmdldENvcnJlY3RBbnN3ZXJMaXN0KCkpO1xuICAgIGZvciAobGV0IHBlcm11dGF0aW9uIG9mIGNvcnJlY3RBbnN3ZXJQZXJtdXRhdGlvbnMpIHtcbiAgICAgIGRlZmluaXRpb24uY29ycmVjdFJlc3BvbnNlc1BhdHRlcm4ucHVzaChjb3JyZWN0UmVzcG9uc2VzUGF0dGVyblByZWZpeCArIHBlcm11dGF0aW9uLmpvaW4oJ1ssXScpKTtcbiAgICB9XG4gICAgcmV0dXJuIGRlZmluaXRpb247XG4gIH07XG5cbiAgLyoqXG4gICAqIEFkZCB0aGUgcXVlc3Rpb24gaXRzZWxmIHRvIHRoZSBkZWZpbml0aW9uIHBhcnQgb2YgYW4geEFQSUV2ZW50XG4gICAqL1xuICBwdWJsaWMgYWRkUXVlc3Rpb25Ub1hBUEkgPSAoeEFQSUV2ZW50KSA9PiB7XG4gICAgdmFyIGRlZmluaXRpb24gPSB4QVBJRXZlbnQuZ2V0VmVyaWZpZWRTdGF0ZW1lbnRWYWx1ZShbJ29iamVjdCcsICdkZWZpbml0aW9uJ10pO1xuICAgIHRoaXMualF1ZXJ5LmV4dGVuZChkZWZpbml0aW9uLCB0aGlzLmdldHhBUElEZWZpbml0aW9uKCkpO1xuICB9O1xuXG4gIC8qKlxuICAgKiBBZGQgdGhlIHJlc3BvbnNlIHBhcnQgdG8gYW4geEFQSSBldmVudFxuICAgKlxuICAgKiBAcGFyYW0ge0g1UC5YQVBJRXZlbnR9IHhBUElFdmVudFxuICAgKiAgVGhlIHhBUEkgZXZlbnQgd2Ugd2lsbCBhZGQgYSByZXNwb25zZSB0b1xuICAgKi9cbiAgcHVibGljIGFkZFJlc3BvbnNlVG9YQVBJID0gKHhBUElFdmVudCkgPT4ge1xuICAgIHhBUElFdmVudC5zZXRTY29yZWRSZXN1bHQodGhpcy5jbG96ZUNvbnRyb2xsZXIuY3VycmVudFNjb3JlLCB0aGlzLmNsb3plQ29udHJvbGxlci5tYXhTY29yZSwgdGhpcyk7XG4gICAgeEFQSUV2ZW50LmRhdGEuc3RhdGVtZW50LnJlc3VsdC5yZXNwb25zZSA9IHRoaXMuZ2V0eEFQSVJlc3BvbnNlKCk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEdlbmVyYXRlIHhBUEkgdXNlciByZXNwb25zZSwgdXNlZCBpbiB4QVBJIHN0YXRlbWVudHMuXG4gICAqIEByZXR1cm4ge3N0cmluZ30gVXNlciBhbnN3ZXJzIHNlcGFyYXRlZCBieSB0aGUgXCJbLF1cIiBwYXR0ZXJuXG4gICAqL1xuICBwdWJsaWMgZ2V0eEFQSVJlc3BvbnNlID0gKCk6IHN0cmluZyA9PiB7XG4gICAgdmFyIHVzZXJzQW5zd2VycyA9IHRoaXMuZ2V0Q3VycmVudFN0YXRlKCk7XG4gICAgcmV0dXJuIHVzZXJzQW5zd2Vycy5qb2luKCdbLF0nKTtcbiAgfTtcbn0iLCJpbXBvcnQgeyBNZXNzYWdlU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL21lc3NhZ2Utc2VydmljZSc7XG5pbXBvcnQgeyBIaWdobGlnaHQgfSBmcm9tICcuLi9tb2RlbHMvaGlnaGxpZ2h0JztcbmltcG9ydCB7IEFuc3dlciB9IGZyb20gJy4uL21vZGVscy9hbnN3ZXInO1xuaW1wb3J0IHsgQmxhbmsgfSBmcm9tICcuLi9tb2RlbHMvYmxhbmsnO1xuaW1wb3J0IHsgSDVQTG9jYWxpemF0aW9uIH0gZnJvbSAnLi4vc2VydmljZXMvbG9jYWxpemF0aW9uJztcbmltcG9ydCB7IElTZXR0aW5ncyB9IGZyb20gJy4uL3NlcnZpY2VzL3NldHRpbmdzJztcbmltcG9ydCB7IE1lc3NhZ2UgfSBmcm9tIFwiLi4vbW9kZWxzL21lc3NhZ2VcIjtcbmltcG9ydCB7IFNuaXBwZXQgfSBmcm9tICcuLi9tb2RlbHMvc25pcHBldCc7XG5cbmV4cG9ydCBjbGFzcyBCbGFua0xvYWRlciB7XG5cbiAgcHJpdmF0ZSBjb25zdHJ1Y3Rvcihwcml2YXRlIHNldHRpbmdzOiBJU2V0dGluZ3MsIHByaXZhdGUgbG9jYWxpemF0aW9uOiBINVBMb2NhbGl6YXRpb24sIHByaXZhdGUganF1ZXJ5OiBKUXVlcnlTdGF0aWMsIHByaXZhdGUgbWVzc2FnZVNlcnZpY2U6IE1lc3NhZ2VTZXJ2aWNlKSB7IH1cblxuICBwcml2YXRlIHN0YXRpYyBfaW5zdGFuY2U6IEJsYW5rTG9hZGVyO1xuICBwdWJsaWMgc3RhdGljIGluaXRpYWxpemUoc2V0dGluZ3M6IElTZXR0aW5ncywgbG9jYWxpemF0aW9uOiBINVBMb2NhbGl6YXRpb24sIGpxdWVyeTogSlF1ZXJ5U3RhdGljLCBtZXNzYWdlU2VydmljZTogTWVzc2FnZVNlcnZpY2UpOiBCbGFua0xvYWRlciB7XG4gICAgdGhpcy5faW5zdGFuY2UgPSBuZXcgQmxhbmtMb2FkZXIoc2V0dGluZ3MsIGxvY2FsaXphdGlvbiwganF1ZXJ5LCBtZXNzYWdlU2VydmljZSk7XG4gICAgcmV0dXJuIHRoaXMuX2luc3RhbmNlO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBnZXQgaW5zdGFuY2UoKTogQmxhbmtMb2FkZXIge1xuICAgIGlmICh0aGlzLl9pbnN0YW5jZSlcbiAgICAgIHJldHVybiB0aGlzLl9pbnN0YW5jZTtcblxuICAgIHRocm93IFwiQmxhbmtMb2FkZXIgbXVzdCBiZSBpbml0aWFsaXplZCBiZWZvcmUgdXNlLlwiO1xuICB9XG5cbiAgcHJpdmF0ZSBkZWNvZGVIdG1sKGh0bWw6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgdmFyIGVsZW0gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd0ZXh0YXJlYScpO1xuICAgIGVsZW0uaW5uZXJIVE1MID0gaHRtbDtcbiAgICByZXR1cm4gZWxlbS52YWx1ZTtcbiAgfVxuXG4gIHB1YmxpYyBjcmVhdGVCbGFuayhpZDogc3RyaW5nLCBjb3JyZWN0VGV4dDogc3RyaW5nLCBoaW50VGV4dDogc3RyaW5nLCBpbmNvcnJlY3RBbnN3ZXJzOiBhbnlbXSk6IEJsYW5rIHtcbiAgICB2YXIgYmxhbmsgPSBuZXcgQmxhbmsodGhpcy5zZXR0aW5ncywgdGhpcy5sb2NhbGl6YXRpb24sIHRoaXMuanF1ZXJ5LCB0aGlzLm1lc3NhZ2VTZXJ2aWNlLCBpZClcbiAgICBpZiAoY29ycmVjdFRleHQpIHtcbiAgICAgIGNvcnJlY3RUZXh0ID0gdGhpcy5kZWNvZGVIdG1sKGNvcnJlY3RUZXh0KTtcbiAgICAgIGJsYW5rLmFkZENvcnJlY3RBbnN3ZXIobmV3IEFuc3dlcihjb3JyZWN0VGV4dCwgXCJcIiwgZmFsc2UsIDAsIHRoaXMuc2V0dGluZ3MpKTtcbiAgICB9XG4gICAgYmxhbmsuc2V0SGludChuZXcgTWVzc2FnZShoaW50VGV4dCA/IGhpbnRUZXh0IDogXCJcIiwgZmFsc2UsIDApKTtcblxuICAgIGlmIChpbmNvcnJlY3RBbnN3ZXJzKSB7XG4gICAgICBmb3IgKHZhciBoNXBJbmNvcnJlY3RBbnN3ZXIgb2YgaW5jb3JyZWN0QW5zd2Vycykge1xuICAgICAgICBibGFuay5hZGRJbmNvcnJlY3RBbnN3ZXIodGhpcy5kZWNvZGVIdG1sKGg1cEluY29ycmVjdEFuc3dlci5pbmNvcnJlY3RBbnN3ZXJUZXh0KSwgaDVwSW5jb3JyZWN0QW5zd2VyLmluY29ycmVjdEFuc3dlckZlZWRiYWNrLCBoNXBJbmNvcnJlY3RBbnN3ZXIuc2hvd0hpZ2hsaWdodCwgaDVwSW5jb3JyZWN0QW5zd2VyLmhpZ2hsaWdodCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIGJsYW5rO1xuICB9XG5cbiAgcHVibGljIHJlcGxhY2VTbmlwcGV0cyhibGFuazogQmxhbmssIHNuaXBwZXRzOiBTbmlwcGV0W10pIHtcbiAgICBibGFuay5jb3JyZWN0QW5zd2Vycy5jb25jYXQoYmxhbmsuaW5jb3JyZWN0QW5zd2VycylcbiAgICAgIC5mb3JFYWNoKGFuc3dlciA9PiBhbnN3ZXIubWVzc2FnZS50ZXh0ID0gdGhpcy5nZXRTdHJpbmdXaXRoU25pcHBldHMoYW5zd2VyLm1lc3NhZ2UudGV4dCwgc25pcHBldHMpKTtcbiAgICBibGFuay5oaW50LnRleHQgPSB0aGlzLmdldFN0cmluZ1dpdGhTbmlwcGV0cyhibGFuay5oaW50LnRleHQsIHNuaXBwZXRzKTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0U3RyaW5nV2l0aFNuaXBwZXRzKHRleHQ6IHN0cmluZywgc25pcHBldHM6IFNuaXBwZXRbXSk6IHN0cmluZyB7XG4gICAgaWYgKCF0ZXh0IHx8IHRleHQgPT09IHVuZGVmaW5lZClcbiAgICAgIHJldHVybiBcIlwiO1xuXG4gICAgaWYoIXNuaXBwZXRzKVxuICAgICAgcmV0dXJuIHRleHQ7ICAgIFxuXG4gICAgZm9yICh2YXIgc25pcHBldCBvZiBzbmlwcGV0cykge1xuICAgICAgaWYgKHNuaXBwZXQubmFtZSA9PT0gdW5kZWZpbmVkIHx8IHNuaXBwZXQubmFtZSA9PT0gXCJcIiB8fCBzbmlwcGV0LnRleHQgPT09IHVuZGVmaW5lZCB8fCBzbmlwcGV0LnRleHQgPT09IFwiXCIpXG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgdGV4dCA9IHRleHQucmVwbGFjZShcIkBcIiArIHNuaXBwZXQubmFtZSwgc25pcHBldC50ZXh0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gdGV4dDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIHRoZSBoaWdobGlnaHQgb2JqZWN0cyB0byB0aGUgYW5zd2VycyBpbiB0aGUgY29ycmVjdCBhbmQgaW5jb3JyZWN0IGFuc3dlciBsaXN0LlxuICAgKiBAcGFyYW0gIHtIaWdobGlnaHRbXX0gaGlnaGxpZ2h0c0JlZm9yZSAtIEFsbCBoaWdobGlnaHRzIGNvbWluZyBiZWZvcmUgdGhlIGJsYW5rLlxuICAgKiBAcGFyYW0gIHtIaWdobGlnaHRbXX0gaGlnaGxpZ2h0c0FmdGVyIC0gQWxsIGhpZ2hsaWdodHMgY29taW5nIGFmdGVyIHRoZSBibGFuay5cbiAgICovXG4gIHB1YmxpYyBsaW5rSGlnaGxpZ2h0SWRUb09iamVjdChibGFuazogQmxhbmssIGhpZ2hsaWdodHNCZWZvcmU6IEhpZ2hsaWdodFtdLCBoaWdobGlnaHRzQWZ0ZXI6IEhpZ2hsaWdodFtdKSB7XG4gICAgZm9yIChsZXQgYW5zd2VyIG9mIGJsYW5rLmNvcnJlY3RBbnN3ZXJzKSB7XG4gICAgICBhbnN3ZXIubGlua0hpZ2hsaWdodElkVG9PYmplY3QoaGlnaGxpZ2h0c0JlZm9yZSwgaGlnaGxpZ2h0c0FmdGVyKTtcbiAgICB9XG5cbiAgICBmb3IgKGxldCBhbnN3ZXIgb2YgYmxhbmsuaW5jb3JyZWN0QW5zd2Vycykge1xuICAgICAgYW5zd2VyLmxpbmtIaWdobGlnaHRJZFRvT2JqZWN0KGhpZ2hsaWdodHNCZWZvcmUsIGhpZ2hsaWdodHNBZnRlcik7XG4gICAgfVxuXG4gICAgYmxhbmsuaGludC5saW5rSGlnaGxpZ2h0KGhpZ2hsaWdodHNCZWZvcmUsIGhpZ2hsaWdodHNBZnRlcik7XG4gIH1cblxufSIsImltcG9ydCB7IEJsYW5rTG9hZGVyIH0gZnJvbSAnLi9ibGFuay1sb2FkZXInO1xuaW1wb3J0IHsgQ2xvemVFbGVtZW50LCBDbG96ZUVsZW1lbnRUeXBlIH0gZnJvbSAnLi4vbW9kZWxzL2Nsb3plLWVsZW1lbnQnO1xuaW1wb3J0IHsgQmxhbmsgfSBmcm9tICcuLi9tb2RlbHMvYmxhbmsnO1xuaW1wb3J0IHsgSGlnaGxpZ2h0IH0gZnJvbSAnLi4vbW9kZWxzL2hpZ2hsaWdodCc7XG5pbXBvcnQgeyBDbG96ZSB9IGZyb20gXCIuLi9tb2RlbHMvY2xvemVcIjtcblxuLyoqXG4gKiBMb2FkcyBhIGNsb3plIG9iamVjdC5cbiAqL1xuZXhwb3J0IGNsYXNzIENsb3plTG9hZGVyIHtcbiAgcHJpdmF0ZSBzdGF0aWMgbm9ybWFsaXplZEJsYW5rTWFya2VyID0gJ19fXyc7XG4gIFxuICAvKipcbiAgICogQHBhcmFtICB7c3RyaW5nfSBodG1sIC0gVGhlIGh0bWwgc3RyaW5nIHRoYXQgY29udGFpbnMgdGhlIGNsb3plIHdpdGggYmxhbmtzIG1hcmtpbmcgYW5kIGhpZ2hsaWdodCBtYXJraW5ncy5cbiAgICogQHBhcmFtICB7QmxhbmtbXX0gYmxhbmtzIC0gQWxsIGJsYW5rcyBhcyBlbnRlcmVkIGJ5IHRoZSBjb250ZW50IGF1dGhvci5cbiAgICogQHJldHVybnMgQ2xvemVcbiAgICovXG4gIHB1YmxpYyBzdGF0aWMgY3JlYXRlQ2xvemUoaHRtbDogc3RyaW5nLCBibGFua3M6IEJsYW5rW10pOiBDbG96ZSB7XG4gICAgdmFyIG9yZGVyZWRBbGxFbGVtZW50c0xpc3Q6IENsb3plRWxlbWVudFtdID0gbmV3IEFycmF5KCk7XG4gICAgdmFyIGhpZ2hsaWdodEluc3RhbmNlczogSGlnaGxpZ2h0W10gPSBuZXcgQXJyYXkoKTtcbiAgICB2YXIgYmxhbmtzSW5zdGFuY2VzOiBCbGFua1tdID0gbmV3IEFycmF5KCk7XG5cbiAgICBodG1sID0gQ2xvemVMb2FkZXIubm9ybWFsaXplQmxhbmtNYXJraW5ncyhodG1sKTtcblxuICAgIHZhciBjb252ZXJzaW9uUmVzdWx0ID0gQ2xvemVMb2FkZXIuY29udmVydE1hcmt1cFRvU3BhbnMoaHRtbCwgYmxhbmtzKTtcbiAgICBodG1sID0gY29udmVyc2lvblJlc3VsdC5odG1sO1xuICAgIG9yZGVyZWRBbGxFbGVtZW50c0xpc3QgPSBjb252ZXJzaW9uUmVzdWx0Lm9yZGVyZWRBbGxFbGVtZW50c0xpc3Q7XG4gICAgaGlnaGxpZ2h0SW5zdGFuY2VzID0gY29udmVyc2lvblJlc3VsdC5oaWdobGlnaHRJbnN0YW5jZXM7XG4gICAgYmxhbmtzSW5zdGFuY2VzID0gY29udmVyc2lvblJlc3VsdC5ibGFua3NJbnN0YW5jZXM7XG5cbiAgICBDbG96ZUxvYWRlci5saW5rSGlnaGxpZ2h0c09iamVjdHMob3JkZXJlZEFsbEVsZW1lbnRzTGlzdCwgaGlnaGxpZ2h0SW5zdGFuY2VzLCBibGFua3NJbnN0YW5jZXMpO1xuXG4gICAgdmFyIGNsb3plID0gbmV3IENsb3plKCk7XG4gICAgY2xvemUuaHRtbCA9IGh0bWw7XG4gICAgY2xvemUuYmxhbmtzID0gYmxhbmtzSW5zdGFuY2VzO1xuICAgIGNsb3plLmhpZ2hsaWdodHMgPSBoaWdobGlnaHRJbnN0YW5jZXM7XG5cbiAgICByZXR1cm4gY2xvemU7XG4gIH1cblxuICAgLyoqXG4gICAqIENvbnZlcnRzICEhc2lnbmFsISEgaGlnaGxpZ2h0IG1hcmt1cCBhbmQgX19fICBibGFuayBtYXJrdXAgaW50byA8c3Bhbj4uLi48L3NwYW4+LlxuICAgKiBSZXR1cm5zIHRoZSByZXN1bHRpbmcgaHRtbCBzdHJpbmcgYW5kIHRocmVlIGxpc3RzIG9mIGFsbCBhY3RpdmUgZWxlbWVudHMgdXNlZCBpbiB0aGUgY2xvemU6XG4gICAqICAgIG9yZGVyZWRBbGxFbGVtZW50czogaGlnaGxpZ2h0cyBhbmQgYmxhbmtzIGluIHRoZSBvcmRlciBvZiBhcHBlYXJhbmNlIGluIHRoZSBodG1sLlxuICAgKiAgICBoaWdobGlnaHRJbnN0YW5jZXM6IG9ubHkgaGlnaGxpZ2h0cyBpbiB0aGUgb3JkZXIgb2YgYXBwZWFyYW5jZVxuICAgKiAgICBibGFua3NJbnN0YW5jZXM6IG9ubHkgYmxhbmtzIGluIHRoZSBvcmRlciBvZiBhcHBlYXJhbmNlXG4gICAqIEBwYXJhbSAge3N0cmluZ30gaHRtbFxuICAgKiBAcGFyYW0gIHtCbGFua1tdfSBibGFua3NcbiAgICogQHJldHVybnMgTGlzdHMgb2YgYWN0aXZlIGVsZW1lbnRzIChzZWUgZGVzY3JpcHRpb24pLlxuICAgKi9cbiAgcHJpdmF0ZSBzdGF0aWMgY29udmVydE1hcmt1cFRvU3BhbnMoaHRtbDogc3RyaW5nLCBibGFua3M6IEJsYW5rW10pOiB7IGh0bWw6IHN0cmluZywgb3JkZXJlZEFsbEVsZW1lbnRzTGlzdDogQ2xvemVFbGVtZW50W10sIGhpZ2hsaWdodEluc3RhbmNlczogSGlnaGxpZ2h0W10sIGJsYW5rc0luc3RhbmNlczogQmxhbmtbXSB9IHtcbiAgICB2YXIgb3JkZXJlZEFsbEVsZW1lbnRzTGlzdDogQ2xvemVFbGVtZW50W10gPSBuZXcgQXJyYXkoKTtcbiAgICB2YXIgaGlnaGxpZ2h0SW5zdGFuY2VzOiBIaWdobGlnaHRbXSA9IG5ldyBBcnJheSgpO1xuICAgIHZhciBibGFua3NJbnN0YW5jZXM6IEJsYW5rW10gPSBuZXcgQXJyYXkoKTtcblxuICAgIHZhciBleGNsYW1hdGlvbk1hcmtSZWdFeHAgPSAvISEoLnsxLDQwfT8pISEvaTtcbiAgICB2YXIgaGlnaGxpZ2h0Q291bnRlciA9IDA7XG4gICAgbGV0IGJsYW5rQ291bnRlciA9IDA7XG5cbiAgICAvLyBTZWFyY2hlcyB0aGUgaHRtbCBzdHJpbmcgZm9yIGhpZ2hsaWdodHMgYW5kIGJsYW5rcyBhbmQgaW5zZXJ0cyBzcGFucy4gXG4gICAgZG8ge1xuICAgICAgdmFyIG5leHRIaWdobGlnaHRNYXRjaCA9IGh0bWwubWF0Y2goZXhjbGFtYXRpb25NYXJrUmVnRXhwKTtcbiAgICAgIHZhciBuZXh0QmxhbmtJbmRleCA9IGh0bWwuaW5kZXhPZihDbG96ZUxvYWRlci5ub3JtYWxpemVkQmxhbmtNYXJrZXIpO1xuXG4gICAgICBpZiAobmV4dEhpZ2hsaWdodE1hdGNoICYmICgobmV4dEhpZ2hsaWdodE1hdGNoLmluZGV4IDwgbmV4dEJsYW5rSW5kZXgpIHx8IChuZXh0QmxhbmtJbmRleCA8IDApKSkge1xuICAgICAgICAvLyBuZXh0IGFjdGl2ZSBlbGVtZW50IGlzIGEgaGlnaGxpZ2h0XG4gICAgICAgIHZhciBoaWdobGlnaHQgPSBuZXcgSGlnaGxpZ2h0KG5leHRIaWdobGlnaHRNYXRjaFsxXSwgYGhpZ2hsaWdodF8ke2hpZ2hsaWdodENvdW50ZXJ9YCk7XG4gICAgICAgIGhpZ2hsaWdodEluc3RhbmNlcy5wdXNoKGhpZ2hsaWdodCk7XG4gICAgICAgIG9yZGVyZWRBbGxFbGVtZW50c0xpc3QucHVzaChoaWdobGlnaHQpO1xuICAgICAgICBodG1sID0gaHRtbC5yZXBsYWNlKGV4Y2xhbWF0aW9uTWFya1JlZ0V4cCwgYDxzcGFuIGlkPSdjb250YWluZXJfaGlnaGxpZ2h0XyR7aGlnaGxpZ2h0Q291bnRlcn0nPjwvc3Bhbj5gKTtcbiAgICAgICAgaGlnaGxpZ2h0Q291bnRlcisrO1xuICAgICAgfSBlbHNlIGlmIChuZXh0QmxhbmtJbmRleCA+PSAwKSB7XG4gICAgICAgIC8vIG5leHQgYWN0aXZlIGVsZW1lbnQgaXMgYSBibGFua1xuICAgICAgICBpZiAoYmxhbmtDb3VudGVyID49IGJsYW5rcy5sZW5ndGgpIHtcbiAgICAgICAgICAvLyBpZiB0aGUgYmxhbmsgaXMgbm90IGluIHRoZSByZXBvc2l0b3J5IChUaGUgY29udGVudCBhdXRob3IgaGFzIG1hcmtlZCB0b28gbWFueSBibGFua3MgaW4gdGhlIHRleHQsIGJ1dCBub3QgZW50ZXJlZCBjb3JyZWN0IGFuc3dlcnMuKVxuICAgICAgICAgIGh0bWwgPSBodG1sLnJlcGxhY2UoQ2xvemVMb2FkZXIubm9ybWFsaXplZEJsYW5rTWFya2VyLCBcIjxzcGFuPjwvc3Bhbj5cIik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgdmFyIGJsYW5rID0gYmxhbmtzW2JsYW5rQ291bnRlcl07XG4gICAgICAgICAgYmxhbmtzSW5zdGFuY2VzLnB1c2goYmxhbmspO1xuICAgICAgICAgIG9yZGVyZWRBbGxFbGVtZW50c0xpc3QucHVzaChibGFuayk7XG4gICAgICAgICAgaHRtbCA9IGh0bWwucmVwbGFjZShDbG96ZUxvYWRlci5ub3JtYWxpemVkQmxhbmtNYXJrZXIsIGA8c3BhbiBpZD0nY29udGFpbmVyXyR7YmxhbmsuaWR9Jz48L3NwYW4+YCk7XG4gICAgICAgICAgYmxhbmtDb3VudGVyKys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgd2hpbGUgKG5leHRIaWdobGlnaHRNYXRjaCB8fCAobmV4dEJsYW5rSW5kZXggPj0gMCkpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGh0bWw6IGh0bWwsXG4gICAgICBvcmRlcmVkQWxsRWxlbWVudHNMaXN0OiBvcmRlcmVkQWxsRWxlbWVudHNMaXN0LFxuICAgICAgaGlnaGxpZ2h0SW5zdGFuY2VzOiBoaWdobGlnaHRJbnN0YW5jZXMsXG4gICAgICBibGFua3NJbnN0YW5jZXM6IGJsYW5rc0luc3RhbmNlc1xuICAgIH07XG4gIH1cblxuICAvKipcbiAgICogTG9va3MgZm9yIGFsbCBpbnN0YW5jZXMgb2YgbWFya2VkIGJsYW5rcyBhbmQgcmVwbGFjZXMgdGhlbSB3aXRoIF9fXy4gXG4gICAqIEBwYXJhbSAge3N0cmluZ30gaHRtbFxuICAgKiBAcmV0dXJucyBzdHJpbmdcbiAgICovXG4gIHByaXZhdGUgc3RhdGljIG5vcm1hbGl6ZUJsYW5rTWFya2luZ3MoaHRtbDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICB2YXIgdW5kZXJsaW5lQmxhbmtSZWdFeCA9IC9fezMsfS9nO1xuICAgIGh0bWwgPSBodG1sLnJlcGxhY2UodW5kZXJsaW5lQmxhbmtSZWdFeCwgQ2xvemVMb2FkZXIubm9ybWFsaXplZEJsYW5rTWFya2VyKTtcbiAgICByZXR1cm4gaHRtbDtcbiAgfVxuXG4gICAvKipcbiAgICogSXRlcmF0ZXMgdGhyb3VnaCBhbGwgYmxhbmtzIGFuZCBjYWxscyB0aGVpciBsaW5rSGlnaGxpZ2h0SWRzVG9PYmplY3RzKC4uLikuXG4gICAqIEBwYXJhbSBvcmRlcmVkQWxsRWxlbWVudHNMaXN0IFxuICAgKiBAcGFyYW0gaGlnaGxpZ2h0SW5zdGFuY2VzIFxuICAgKiBAcGFyYW0gYmxhbmtzSW5zdGFuY2VzIFxuICAgKi9cbiAgcHJpdmF0ZSBzdGF0aWMgbGlua0hpZ2hsaWdodHNPYmplY3RzKG9yZGVyZWRBbGxFbGVtZW50c0xpc3Q6IENsb3plRWxlbWVudFtdLCBoaWdobGlnaHRJbnN0YW5jZXM6IEhpZ2hsaWdodFtdLCBibGFua3NJbnN0YW5jZXM6IEJsYW5rW10pOiB2b2lkIHtcbiAgICBmb3IgKHZhciBibGFuayBvZiBibGFua3NJbnN0YW5jZXMpIHtcbiAgICAgIHZhciBuZXh0QmxhbmtJbmRleEluQXJyYXkgPSBvcmRlcmVkQWxsRWxlbWVudHNMaXN0LmluZGV4T2YoYmxhbmspO1xuICAgICAgdmFyIGhpZ2hsaWdodHNCZWZvcmVCbGFuayA9IG9yZGVyZWRBbGxFbGVtZW50c0xpc3RcbiAgICAgICAgLnNsaWNlKDAsIG5leHRCbGFua0luZGV4SW5BcnJheSlcbiAgICAgICAgLmZpbHRlcihlID0+IGUudHlwZSA9PT0gQ2xvemVFbGVtZW50VHlwZS5IaWdobGlnaHQpXG4gICAgICAgIC5tYXAoZSA9PiBlIGFzIEhpZ2hsaWdodClcbiAgICAgICAgLnJldmVyc2UoKTtcbiAgICAgIHZhciBoaWdobGlnaHRzQWZ0ZXJCbGFuayA9IG9yZGVyZWRBbGxFbGVtZW50c0xpc3RcbiAgICAgICAgLnNsaWNlKG5leHRCbGFua0luZGV4SW5BcnJheSArIDEpXG4gICAgICAgIC5maWx0ZXIoZSA9PiBlLnR5cGUgPT09IENsb3plRWxlbWVudFR5cGUuSGlnaGxpZ2h0KVxuICAgICAgICAubWFwKGUgPT4gZSBhcyBIaWdobGlnaHQpO1xuICAgICAgQmxhbmtMb2FkZXIuaW5zdGFuY2UubGlua0hpZ2hsaWdodElkVG9PYmplY3QoYmxhbmssIGhpZ2hsaWdodHNCZWZvcmVCbGFuaywgaGlnaGxpZ2h0c0FmdGVyQmxhbmspO1xuICAgIH1cbiAgfVxufSIsImltcG9ydCB7IE1lc3NhZ2VTZXJ2aWNlIH0gZnJvbSAnLi4vc2VydmljZXMvbWVzc2FnZS1zZXJ2aWNlJztcbmltcG9ydCB7IEJsYW5rTG9hZGVyIH0gZnJvbSAnLi4vY29udGVudC1sb2FkZXJzL2JsYW5rLWxvYWRlcic7XG5pbXBvcnQgeyBDbG96ZUxvYWRlciB9IGZyb20gJy4uL2NvbnRlbnQtbG9hZGVycy9jbG96ZS1sb2FkZXInO1xuaW1wb3J0IHsgQ2xvemUgfSBmcm9tIFwiLi4vbW9kZWxzL2Nsb3plXCI7XG5pbXBvcnQgeyBJRGF0YVJlcG9zaXRvcnkgfSBmcm9tIFwiLi4vc2VydmljZXMvZGF0YS1yZXBvc2l0b3J5XCI7XG5pbXBvcnQgeyBJU2V0dGluZ3MgfSBmcm9tIFwiLi4vc2VydmljZXMvc2V0dGluZ3NcIjtcbmltcG9ydCB7IEg1UExvY2FsaXphdGlvbiB9IGZyb20gXCIuLi9zZXJ2aWNlcy9sb2NhbGl6YXRpb25cIjtcbmltcG9ydCB7IENsb3plVHlwZSwgU2VsZWN0QWx0ZXJuYXRpdmVzIH0gZnJvbSBcIi4uL21vZGVscy9lbnVtc1wiO1xuaW1wb3J0IHsgSGlnaGxpZ2h0IH0gZnJvbSBcIi4uL21vZGVscy9oaWdobGlnaHRcIjtcbmltcG9ydCB7IEJsYW5rIH0gZnJvbSBcIi4uL21vZGVscy9ibGFua1wiO1xuXG5pbXBvcnQgKiBhcyBSYWN0aXZlRXZlbnRzS2V5cyBmcm9tICcuLi8uLi9saWIvcmFjdGl2ZS1ldmVudHMta2V5cyc7XG5cbmludGVyZmFjZSBTY29yZUNoYW5nZWQge1xuICAoc2NvcmU6IG51bWJlciwgbWF4U2NvcmU6IG51bWJlcik6IHZvaWQ7XG59XG5cbmludGVyZmFjZSBBdXRvQ2hlY2tlZCB7XG4gICgpOiB2b2lkO1xufVxuXG5pbnRlcmZhY2UgU29sdmVkIHtcbiAgKCk6IHZvaWQ7XG59XG5cbmludGVyZmFjZSBUeXBlZCB7XG4gICgpOiB2b2lkO1xufVxuXG5leHBvcnQgY2xhc3MgQ2xvemVDb250cm9sbGVyIHtcbiAgcHJpdmF0ZSBqcXVlcnk6IEpRdWVyeTtcblxuICBwcml2YXRlIGNsb3plOiBDbG96ZTtcbiAgcHJpdmF0ZSBpc1NlbGVjdENsb3plOiBib29sZWFuO1xuXG4gIHB1YmxpYyBvblNjb3JlQ2hhbmdlZDogU2NvcmVDaGFuZ2VkO1xuICBwdWJsaWMgb25BdXRvQ2hlY2tlZDogQXV0b0NoZWNrZWQ7XG4gIHB1YmxpYyBvblNvbHZlZDogU29sdmVkO1xuICBwdWJsaWMgb25UeXBlZDogVHlwZWQ7XG5cbiAgLy8gU3RvcmFnZSBvZiB0aGUgcmFjdGl2ZSBvYmplY3RzIHRoYXQgbGluayBtb2RlbHMgYW5kIHZpZXdzXG4gIHByaXZhdGUgaGlnaGxpZ2h0UmFjdGl2ZXM6IHsgW2lkOiBzdHJpbmddOiBSYWN0aXZlLlJhY3RpdmUgfSA9IHt9O1xuICBwcml2YXRlIGJsYW5rUmFjdGl2ZXM6IHsgW2lkOiBzdHJpbmddOiBSYWN0aXZlLlJhY3RpdmUgfSA9IHt9O1xuXG4gIHB1YmxpYyBnZXQgbWF4U2NvcmUoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5jbG96ZS5ibGFua3MubGVuZ3RoO1xuICB9XG5cbiAgcHVibGljIGdldCBjdXJyZW50U2NvcmUoKTogbnVtYmVyIHtcbiAgICB2YXIgc2NvcmUgPSB0aGlzLmNsb3plLmJsYW5rcy5maWx0ZXIoYiA9PiBiLmlzQ29ycmVjdCkubGVuZ3RoO1xuICAgIHJldHVybiBNYXRoLm1heCgwLCBzY29yZSk7XG4gIH1cblxuICBwdWJsaWMgZ2V0IGFsbEJsYW5rc0VudGVyZWQoKSB7XG4gICAgaWYgKHRoaXMuY2xvemUpXG4gICAgICByZXR1cm4gdGhpcy5jbG96ZS5ibGFua3MuZXZlcnkoYmxhbmsgPT4gYmxhbmsuaXNFcnJvciB8fCBibGFuay5pc0NvcnJlY3QgfHwgYmxhbmsuaXNSZXRyeSk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHVibGljIGdldCBpc1NvbHZlZCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5jbG96ZS5pc1NvbHZlZDtcbiAgfVxuXG4gIHB1YmxpYyBnZXQgaXNGaWxsZWRPdXQoKSB7XG4gICAgaWYgKCF0aGlzLmNsb3plIHx8IHRoaXMuY2xvemUuYmxhbmtzLmxlbmd0aCA9PT0gMClcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIHJldHVybiB0aGlzLmNsb3plLmJsYW5rcy5zb21lKGIgPT4gYi5lbnRlcmVkVGV4dCAhPT0gJycpO1xuICB9XG5cbiAgcHVibGljIGdldCBpc0Z1bGx5RmlsbGVkT3V0KCkge1xuICAgIGlmICghdGhpcy5jbG96ZSB8fCB0aGlzLmNsb3plLmJsYW5rcy5sZW5ndGggPT09IDApXG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICByZXR1cm4gdGhpcy5jbG96ZS5ibGFua3MuZXZlcnkoYiA9PiBiLmVudGVyZWRUZXh0ICE9PSAnJyk7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHJlcG9zaXRvcnk6IElEYXRhUmVwb3NpdG9yeSwgcHJpdmF0ZSBzZXR0aW5nczogSVNldHRpbmdzLCBwcml2YXRlIGxvY2FsaXphdGlvbjogSDVQTG9jYWxpemF0aW9uLCBwcml2YXRlIE1lc3NhZ2VTZXJ2aWNlOiBNZXNzYWdlU2VydmljZSkge1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdXAgYWxsIGJsYW5rcywgdGhlIGNsb3plIGl0c2VsZiBhbmQgdGhlIHJhY3RpdmUgYmluZGluZ3MuXG4gICAqIEBwYXJhbSAge0hUTUxFbGVtZW50fSByb290XG4gICAqL1xuICBpbml0aWFsaXplKHJvb3Q6IEhUTUxFbGVtZW50LCBqcXVlcnk6IEpRdWVyeSkge1xuICAgIHRoaXMuanF1ZXJ5ID0ganF1ZXJ5O1xuICAgIHRoaXMuaXNTZWxlY3RDbG96ZSA9IHRoaXMuc2V0dGluZ3MuY2xvemVUeXBlID09PSBDbG96ZVR5cGUuU2VsZWN0ID8gdHJ1ZSA6IGZhbHNlO1xuXG4gICAgdmFyIGJsYW5rcyA9IHRoaXMucmVwb3NpdG9yeS5nZXRCbGFua3MoKTtcblxuICAgIGlmICh0aGlzLmlzU2VsZWN0Q2xvemUgJiYgdGhpcy5zZXR0aW5ncy5zZWxlY3RBbHRlcm5hdGl2ZXMgPT09IFNlbGVjdEFsdGVybmF0aXZlcy5BbGwpIHtcbiAgICAgIGZvciAodmFyIGJsYW5rIG9mIGJsYW5rcykge1xuICAgICAgICBsZXQgb3RoZXJCbGFua3MgPSBibGFua3MuZmlsdGVyKHYgPT4gdiAhPT0gYmxhbmspO1xuICAgICAgICBibGFuay5sb2FkQ2hvaWNlc0Zyb21PdGhlckJsYW5rcyhvdGhlckJsYW5rcyk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHNuaXBwZXRzID0gdGhpcy5yZXBvc2l0b3J5LmdldFNuaXBwZXRzKCk7XG4gICAgYmxhbmtzLmZvckVhY2goYmxhbmsgPT4gQmxhbmtMb2FkZXIuaW5zdGFuY2UucmVwbGFjZVNuaXBwZXRzKGJsYW5rLCBzbmlwcGV0cykpO1xuXG4gICAgdGhpcy5jbG96ZSA9IENsb3plTG9hZGVyLmNyZWF0ZUNsb3plKHRoaXMucmVwb3NpdG9yeS5nZXRDbG96ZVRleHQoKSwgYmxhbmtzKTtcblxuICAgIHZhciBjb250YWluZXJzID0gdGhpcy5jcmVhdGVBbmRBZGRDb250YWluZXJzKHJvb3QpO1xuICAgIGNvbnRhaW5lcnMuY2xvemUuaW5uZXJIVE1MID0gdGhpcy5jbG96ZS5odG1sO1xuICAgIHRoaXMuY3JlYXRlUmFjdGl2ZUJpbmRpbmdzKCk7XG4gIH1cblxuICBjaGVja0FsbCA9ICgpID0+IHtcbiAgICB0aGlzLmNsb3plLmhpZGVBbGxIaWdobGlnaHRzKCk7XG4gICAgZm9yICh2YXIgYmxhbmsgb2YgdGhpcy5jbG96ZS5ibGFua3MpIHtcbiAgICAgIGlmICgoIWJsYW5rLmlzQ29ycmVjdCkgJiYgYmxhbmsuZW50ZXJlZFRleHQgIT09IFwiXCIpXG4gICAgICAgIGJsYW5rLmV2YWx1YXRlQXR0ZW1wdCh0cnVlLCB0cnVlKTtcbiAgICB9XG4gICAgdGhpcy5yZWZyZXNoQ2xvemUoKTtcbiAgICB0aGlzLmNoZWNrQW5kTm90aWZ5Q29tcGxldGVuZXNzKCk7XG4gIH1cblxuICB0ZXh0VHlwZWQgPSAoYmxhbms6IEJsYW5rKSA9PiB7XG4gICAgYmxhbmsub25UeXBlZCgpO1xuICAgIGlmICh0aGlzLm9uVHlwZWQpXG4gICAgICB0aGlzLm9uVHlwZWQoKTtcbiAgICB0aGlzLnJlZnJlc2hDbG96ZSgpO1xuICB9XG5cbiAgZm9jdXMgPSAoYmxhbms6IEJsYW5rKSA9PiB7XG4gICAgYmxhbmsub25Gb2N1c3NlZCgpO1xuICAgIHRoaXMucmVmcmVzaENsb3plKCk7XG4gIH1cblxuICBkaXNwbGF5RmVlZGJhY2sgPSAoYmxhbms6IEJsYW5rKSA9PiB7XG4gICAgYmxhbmsub25EaXNwbGF5RmVlZGJhY2soKTtcbiAgICB0aGlzLnJlZnJlc2hDbG96ZSgpO1xuICB9XG5cbiAgc2hvd0hpbnQgPSAoYmxhbms6IEJsYW5rKSA9PiB7XG4gICAgdGhpcy5jbG96ZS5oaWRlQWxsSGlnaGxpZ2h0cygpO1xuICAgIGJsYW5rLnNob3dIaW50KCk7XG4gICAgdGhpcy5yZWZyZXNoQ2xvemUoKTtcbiAgfVxuXG4gIHJlcXVlc3RDbG9zZVRvb2x0aXAgPSAoYmxhbms6IEJsYW5rKSA9PiB7XG4gICAgYmxhbmsucmVtb3ZlVG9vbHRpcCgpO1xuICAgIHRoaXMucmVmcmVzaENsb3plKCk7XG4gICAgdGhpcy5qcXVlcnkuZmluZChcIiNcIiArIGJsYW5rLmlkKS5mb2N1cygpO1xuICB9XG5cbiAgY2hlY2tCbGFuayA9IChibGFuazogQmxhbmssIGNhdXNlOiBzdHJpbmcpID0+IHtcbiAgICBpZiAoKGNhdXNlID09PSAnYmx1cicgfHwgY2F1c2UgPT09ICdjaGFuZ2UnKSkge1xuICAgICAgYmxhbmsubG9zdEZvY3VzKCk7XG4gICAgfVxuXG4gICAgaWYgKGNhdXNlID09PSAnY2hhbmdlJyAmJiB0aGlzLm9uVHlwZWQpIHtcbiAgICAgIHRoaXMub25UeXBlZCgpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNldHRpbmdzLmF1dG9DaGVjaykge1xuICAgICAgaWYgKCFibGFuay5lbnRlcmVkVGV4dCB8fCBibGFuay5lbnRlcmVkVGV4dCA9PT0gXCJcIilcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgICB0aGlzLmNsb3plLmhpZGVBbGxIaWdobGlnaHRzKCk7XG4gICAgICBibGFuay5ldmFsdWF0ZUF0dGVtcHQoZmFsc2UpO1xuICAgICAgdGhpcy5jaGVja0FuZE5vdGlmeUNvbXBsZXRlbmVzcygpO1xuICAgICAgdGhpcy5yZWZyZXNoQ2xvemUoKTtcbiAgICAgIHRoaXMub25BdXRvQ2hlY2tlZCgpO1xuICAgIH1cbiAgICBpZiAoKGNhdXNlID09PSAnZW50ZXInKVxuICAgICAgJiYgKCh0aGlzLnNldHRpbmdzLmF1dG9DaGVjayAmJiBibGFuay5pc0NvcnJlY3QgJiYgIXRoaXMuaXNTb2x2ZWQpXG4gICAgICAgIHx8ICF0aGlzLnNldHRpbmdzLmF1dG9DaGVjaykpIHtcbiAgICAgIC8vIG1vdmUgdG8gbmV4dCBibGFua1xuICAgICAgdmFyIGluZGV4ID0gdGhpcy5jbG96ZS5ibGFua3MuaW5kZXhPZihibGFuayk7XG4gICAgICB2YXIgbmV4dElkO1xuICAgICAgd2hpbGUgKGluZGV4IDwgdGhpcy5jbG96ZS5ibGFua3MubGVuZ3RoIC0gMSAmJiAhbmV4dElkKSB7XG4gICAgICAgIGluZGV4Kys7XG4gICAgICAgIGlmICghdGhpcy5jbG96ZS5ibGFua3NbaW5kZXhdLmlzQ29ycmVjdClcbiAgICAgICAgICBuZXh0SWQgPSB0aGlzLmNsb3plLmJsYW5rc1tpbmRleF0uaWQ7XG4gICAgICB9XG5cbiAgICAgIGlmIChuZXh0SWQpXG4gICAgICAgIHRoaXMuanF1ZXJ5LmZpbmQoXCIjXCIgKyBuZXh0SWQpLmZvY3VzKCk7XG4gICAgfVxuICB9XG5cbiAgcmVzZXQgPSAoKSA9PiB7XG4gICAgdGhpcy5jbG96ZS5yZXNldCgpO1xuICAgIHRoaXMucmVmcmVzaENsb3plKCk7XG4gIH1cblxuICBzaG93U29sdXRpb25zID0gKCkgPT4ge1xuICAgIHRoaXMuY2xvemUuc2hvd1NvbHV0aW9ucygpO1xuICAgIHRoaXMucmVmcmVzaENsb3plKCk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUFuZEFkZENvbnRhaW5lcnMoYWRkVG86IEhUTUxFbGVtZW50KTogeyBjbG96ZTogSFRNTERpdkVsZW1lbnQgfSB7XG4gICAgdmFyIGNsb3plQ29udGFpbmVyRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGNsb3plQ29udGFpbmVyRWxlbWVudC5pZCA9ICdoNXAtY2xvemUtY29udGFpbmVyJztcbiAgICBpZiAodGhpcy5zZXR0aW5ncy5jbG96ZVR5cGUgPT09IENsb3plVHlwZS5TZWxlY3QpIHtcbiAgICAgIGNsb3plQ29udGFpbmVyRWxlbWVudC5jbGFzc05hbWUgPSAnaDVwLWFkdmFuY2VkLWJsYW5rcy1zZWxlY3QtbW9kZSc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNsb3plQ29udGFpbmVyRWxlbWVudC5jbGFzc05hbWUgPSAnaDVwLWFkdmFuY2VkLWJsYW5rcy10eXBlLW1vZGUnO1xuICAgIH1cbiAgICBhZGRUby5hcHBlbmRDaGlsZChjbG96ZUNvbnRhaW5lckVsZW1lbnQpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIGNsb3plOiBjbG96ZUNvbnRhaW5lckVsZW1lbnRcbiAgICB9O1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVIaWdobGlnaHRCaW5kaW5nKGhpZ2hsaWdodDogSGlnaGxpZ2h0KSB7XG4gICAgdGhpcy5oaWdobGlnaHRSYWN0aXZlc1toaWdobGlnaHQuaWRdID0gbmV3IFJhY3RpdmUoe1xuICAgICAgZWw6ICcjY29udGFpbmVyXycgKyBoaWdobGlnaHQuaWQsXG4gICAgICB0ZW1wbGF0ZTogcmVxdWlyZSgnLi4vdmlld3MvaGlnaGxpZ2h0LnJhY3RpdmUuaHRtbCcpLFxuICAgICAgZGF0YToge1xuICAgICAgICBvYmplY3Q6IGhpZ2hsaWdodFxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBjcmVhdGVCbGFua0JpbmRpbmcoYmxhbms6IEJsYW5rKSB7XG4gICAgdmFyIHJhY3RpdmUgPSBuZXcgUmFjdGl2ZSh7XG4gICAgICBlbDogJyNjb250YWluZXJfJyArIGJsYW5rLmlkLFxuICAgICAgdGVtcGxhdGU6IHJlcXVpcmUoJy4uL3ZpZXdzL2JsYW5rLnJhY3RpdmUuaHRtbCcpLFxuICAgICAgZGF0YToge1xuICAgICAgICBpc1NlbGVjdENsb3plOiB0aGlzLmlzU2VsZWN0Q2xvemUsXG4gICAgICAgIGJsYW5rOiBibGFua1xuICAgICAgfSxcbiAgICAgIGV2ZW50czoge1xuICAgICAgICBlbnRlcjogUmFjdGl2ZUV2ZW50c0tleXMuZW50ZXIsXG4gICAgICAgIGVzY2FwZTogUmFjdGl2ZUV2ZW50c0tleXMuZXNjYXBlLFxuICAgICAgICBhbnlrZXk6IFJhY3RpdmVFdmVudHNLZXlzLmFueWtleVxuICAgICAgfVxuICAgIH0pO1xuICAgIHJhY3RpdmUub24oXCJjaGVja0JsYW5rXCIsIHRoaXMuY2hlY2tCbGFuayk7XG4gICAgcmFjdGl2ZS5vbihcInNob3dIaW50XCIsIHRoaXMuc2hvd0hpbnQpO1xuICAgIHJhY3RpdmUub24oXCJ0ZXh0VHlwZWRcIiwgdGhpcy50ZXh0VHlwZWQpO1xuICAgIHJhY3RpdmUub24oXCJjbG9zZU1lc3NhZ2VcIiwgdGhpcy5yZXF1ZXN0Q2xvc2VUb29sdGlwKTtcbiAgICByYWN0aXZlLm9uKFwiZm9jdXNcIiwgdGhpcy5mb2N1cyk7XG4gICAgcmFjdGl2ZS5vbihcImRpc3BsYXlGZWVkYmFja1wiLCB0aGlzLmRpc3BsYXlGZWVkYmFjayk7XG5cbiAgICB0aGlzLmJsYW5rUmFjdGl2ZXNbYmxhbmsuaWRdID0gcmFjdGl2ZTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlUmFjdGl2ZUJpbmRpbmdzKCkge1xuICAgIGZvciAodmFyIGhpZ2hsaWdodCBvZiB0aGlzLmNsb3plLmhpZ2hsaWdodHMpIHtcbiAgICAgIHRoaXMuY3JlYXRlSGlnaGxpZ2h0QmluZGluZyhoaWdobGlnaHQpO1xuICAgIH1cblxuICAgIGZvciAodmFyIGJsYW5rIG9mIHRoaXMuY2xvemUuYmxhbmtzKSB7XG4gICAgICB0aGlzLmNyZWF0ZUJsYW5rQmluZGluZyhibGFuayk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgYWxsIHZpZXdzIG9mIGhpZ2hsaWdodHMgYW5kIGJsYW5rcy4gQ2FuIGJlIGNhbGxlZCB3aGVuIGEgbW9kZWxcbiAgICogd2FzIGNoYW5nZWRcbiAgICovXG4gIHByaXZhdGUgcmVmcmVzaENsb3plKCkge1xuICAgIGZvciAodmFyIGhpZ2hsaWdodCBvZiB0aGlzLmNsb3plLmhpZ2hsaWdodHMpIHtcbiAgICAgIHZhciBoaWdobGlnaHRSYWN0aXZlID0gdGhpcy5oaWdobGlnaHRSYWN0aXZlc1toaWdobGlnaHQuaWRdO1xuICAgICAgaGlnaGxpZ2h0UmFjdGl2ZS5zZXQoXCJvYmplY3RcIiwgaGlnaGxpZ2h0KTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBibGFuayBvZiB0aGlzLmNsb3plLmJsYW5rcykge1xuICAgICAgdmFyIGJsYW5rUmFjdGl2ZSA9IHRoaXMuYmxhbmtSYWN0aXZlc1tibGFuay5pZF07XG4gICAgICBibGFua1JhY3RpdmUuc2V0KFwiYmxhbmtcIiwgYmxhbmspO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgY2hlY2tBbmROb3RpZnlDb21wbGV0ZW5lc3MgPSAoKTogYm9vbGVhbiA9PiB7XG4gICAgaWYgKHRoaXMub25TY29yZUNoYW5nZWQpXG4gICAgICB0aGlzLm9uU2NvcmVDaGFuZ2VkKHRoaXMuY3VycmVudFNjb3JlLCB0aGlzLm1heFNjb3JlKTtcblxuICAgIGlmICh0aGlzLmNsb3plLmlzU29sdmVkKSB7XG4gICAgICBpZiAodGhpcy5vblNvbHZlZClcbiAgICAgICAgdGhpcy5vblNvbHZlZCgpO1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcHVibGljIHNlcmlhbGl6ZUNsb3plKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5jbG96ZS5zZXJpYWxpemUoKTtcbiAgfVxuXG4gIHB1YmxpYyBkZXNlcmlhbGl6ZUNsb3plKGRhdGE6IGFueSk6IGJvb2xlYW4ge1xuICAgIGlmICghdGhpcy5jbG96ZSB8fCAhZGF0YSlcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB0aGlzLmNsb3plLmRlc2VyaWFsaXplKGRhdGEpO1xuICAgIHRoaXMucmVmcmVzaENsb3plKCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBwdWJsaWMgZ2V0Q29ycmVjdEFuc3dlckxpc3QoKTogc3RyaW5nW11bXSB7XG4gICAgaWYgKCF0aGlzLmNsb3plIHx8IHRoaXMuY2xvemUuYmxhbmtzLmxlbmd0aCA9PT0gMClcbiAgICAgIHJldHVybiBbW11dO1xuICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICBmb3IgKHZhciBibGFuayBvZiB0aGlzLmNsb3plLmJsYW5rcykge1xuICAgICAgcmVzdWx0LnB1c2goYmxhbmsuZ2V0Q29ycmVjdEFuc3dlcnMoKSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfSAgXG59IiwiLyoqXG4gKiBDcmVhdGVzIGEgbGlzdCBvZiBhbGwgcG9zc2libGUgcGVybXV0YXRpb25zIG9mIGEgbGlzdCBvZiBsaXN0cy5cbiAqIEBwYXJhbSBsaXN0IFRoZSBsaXN0IHRvIHBlcm11dGUgb3Zlci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVBlcm11dGF0aW9ucyhsaXN0OiBhbnlbXVtdKTogYW55W11bXSB7XG4gIGxldCBvdXRwdXQ6IGFueVtdW10gPSBbW11dO1xuICBmb3IgKGxldCBjdXJyZW50U3VibGlzdCBvZiBsaXN0KSB7XG4gICAgbGV0IG5ld091dHB1dCA9IFtdO1xuICAgIGZvciAobGV0IHN1Ymxpc3RPYmplY3Qgb2YgY3VycmVudFN1Ymxpc3QpIHtcbiAgICAgIGZvciAodmFyIG8gb2Ygb3V0cHV0KSB7XG4gICAgICAgIHZhciBuZXdMaXN0ID0gby5zbGljZSgpO1xuICAgICAgICBuZXdMaXN0LnB1c2goc3VibGlzdE9iamVjdClcbiAgICAgICAgbmV3T3V0cHV0LnB1c2gobmV3TGlzdCk7XG4gICAgICB9XG4gICAgfVxuICAgIG91dHB1dCA9IG5ld091dHB1dDtcbiAgfVxuICByZXR1cm4gb3V0cHV0O1xufSIsIi8qKlxuICogVGhpcyBjbGFzcyBjbGVhbnMgaHRtbCBzdHJpbmdzLlxuICovXG5leHBvcnQgY2xhc3MgVW5yd2FwcGVyIHtcbiAgcHVibGljIGNvbnN0cnVjdG9yKHByaXZhdGUganF1ZXJ5OiBKUXVlcnlTdGF0aWMpIHtcblxuICB9XG5cbiAgXG4gIC8qKlxuICAgKiBDbGVhbnMgaHRtbCBzdHJpbmdzIGJ5IHJlbW92aW5nIHRoZSBvdXRtb3N0IGh0bWwgdGFnIG9mIHRoZSBzdHJpbmcgaWYgdGhlcmUgaXMgb25seSBvbmUgdGFnLlxuICAgKiBFeGFtcGxlczogIFwiPHA+bXkgdGV4dDwvcD5cIlwiIGJlY29tZXMgXCJteSB0ZXh0XCJcbiAgICogICAgICAgICAgICBcIjxwPnRleHQgMTwvcD48cD50ZXh0IDI8L3AyPlwiIHN0YXlzXG4gICAqIEBwYXJhbSBodG1sIFRoZSBodG1sIHN0cmluZ1xuICAgKiBAcmV0dXJucyB0aGUgY2xlYW5lZCBodG1sIHN0cmluZ1xuICAgKi9cbiAgcHVibGljIHVud3JhcChodG1sOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHZhciBwYXJzZWQgPSB0aGlzLmpxdWVyeShodG1sKTtcbiAgICBpZiAocGFyc2VkLmxlbmd0aCAhPT0gMSkge1xuICAgICAgcmV0dXJuIGh0bWw7XG4gICAgfVxuICAgIGxldCB1bndyYXBwZWQgPSBwYXJzZWQudW53cmFwKCkuaHRtbCgpO1xuICAgIHJldHVybiB1bndyYXBwZWQ7XG4gIH1cbn0iLCJpbXBvcnQgeyBNZXNzYWdlIH0gZnJvbSAnLi9tZXNzYWdlJztcbmltcG9ydCB7IEhpZ2hsaWdodCB9IGZyb20gJy4vaGlnaGxpZ2h0JztcbmltcG9ydCB7IElTZXR0aW5ncyB9IGZyb20gJy4uL3NlcnZpY2VzL3NldHRpbmdzJztcbmltcG9ydCAqIGFzIGpzZGlmZiBmcm9tICdkaWZmJztcblxuZXhwb3J0IGVudW0gQ29ycmVjdG5lc3Mge1xuICBFeGFjdE1hdGNoLFxuICBDbG9zZU1hdGNoLFxuICBOb01hdGNoXG59XG5cbmV4cG9ydCBjbGFzcyBFdmFsdWF0aW9uIHtcbiAgcHVibGljIGNvcnJlY3RuZXNzOiBDb3JyZWN0bmVzcztcbiAgcHVibGljIGNoYXJhY3RlckRpZmZlcmVuY2VDb3VudDogbnVtYmVyO1xuICBwdWJsaWMgdXNlZEFsdGVybmF0aXZlOiBzdHJpbmc7XG5cbiAgY29uc3RydWN0b3IocHVibGljIHVzZWRBbnN3ZXI6IEFuc3dlcikge1xuICAgIHRoaXMuY29ycmVjdG5lc3MgPSBDb3JyZWN0bmVzcy5Ob01hdGNoO1xuICAgIHRoaXMuY2hhcmFjdGVyRGlmZmVyZW5jZUNvdW50ID0gMDtcbiAgICB0aGlzLnVzZWRBbHRlcm5hdGl2ZSA9IFwiXCI7XG4gIH1cbn1cblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgcG9zc2libGUgYW5zd2VyIHRoZSBjb250ZW50IGF1dGhvciBlbnRlcnMgZm9yIGEgYmxhbmssIGUuZy4gdGhlIGNvcnJlY3Qgb3IgYW4gaW5jb3JyZWN0IGFuc3dlci5cbiAqL1xuZXhwb3J0IGNsYXNzIEFuc3dlciB7XG4gIC8qKlxuICAgKiBUaGUgYWx0ZXJuYXRpdmVzIGFyZSBlcXVpdmFsZW50IHN0cmluZ3MgdGhhdCB0aGUgbGlicmFyeSBzaG91bGQgdHJlYXQgdGhlIHNhbWUgd2F5LCBlLmcuIHNob3cgdGhlIHNhbWUgZmVlZGJhY2suIFxuICAgKi9cbiAgYWx0ZXJuYXRpdmVzOiBzdHJpbmdbXTtcblxuICAvKipcbiAgICogVGhpcyBpcyB0aGUgbWVzc2FnZSB0aGF0IGlzIGRpc3BsYXllZCB3aGVuIHRoZSBhbnN3ZXIgd2FzIGVudGVyZWQgYnkgdGhlIHVzZXIuXG4gICAqL1xuICBtZXNzYWdlOiBNZXNzYWdlO1xuXG4gIC8qKlxuICAgKiBJcyB0cnVlIGlmIHRoZSBleHBlY3RlZCB0ZXh0IGZvciB0aGlzIGFuc3dlciBpcyBlbXB0eS5cbiAgICovXG4gIGFwcGxpZXNBbHdheXM6IGJvb2xlYW47XG5cbiAgLyoqXG4gICAqIEBwYXJhbSAge3N0cmluZ30gYW5zd2VyVGV4dCAtIFRoZSBleHBlY3RlZCBhbnN3ZXIuIEFsdGVybmF0aXZlcyBhcmUgc2VwYXJhdGVkIGJ5IHwgb3IgOyAuIChlLmcuIFwiQWx0ZXJuYXRpdmUgMXxBbHRlcm5hdGl2ZSAyfEFsdGVybmF0aXZlIDN8Li4uXCIgIC1vci0gXCJBbHRlcm5hdGl2ZSAxO0FsdGVybmF0aXZlIDI7QWx0ZXJuYXRpdmUgM1wiKVxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHJlYWN0aW9uIC0gVGhlIHRvb2x0aXAgdGhhdCBzaG91bGQgYmUgZGlzcGxheWVkLiBGb3JtYXQ6IFRvb2x0aXAgVGV4dDshIS0xISEgISErMSEhXG4gICAqL1xuICBjb25zdHJ1Y3RvcihhbnN3ZXJUZXh0OiBzdHJpbmcsIHJlYWN0aW9uOiBzdHJpbmcsIHNob3dIaWdobGlnaHQ6IGJvb2xlYW4sIGhpZ2hsaWdodDogbnVtYmVyLCBwcml2YXRlIHNldHRpbmdzOiBJU2V0dGluZ3MpIHtcbiAgICB0aGlzLmFsdGVybmF0aXZlcyA9IGFuc3dlclRleHQuc3BsaXQoL1xcLy8pLm1hcChzID0+IHMudHJpbSgpKTtcbiAgICB0aGlzLm1lc3NhZ2UgPSBuZXcgTWVzc2FnZShyZWFjdGlvbiwgc2hvd0hpZ2hsaWdodCwgaGlnaGxpZ2h0KTtcbiAgICBpZiAoYW5zd2VyVGV4dC50cmltKCkgPT09IFwiXCIpIHtcbiAgICAgIHRoaXMuYXBwbGllc0Fsd2F5cyA9IHRydWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuYXBwbGllc0Fsd2F5cyA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBMb29rcyB0aHJvdWdoIHRoZSBvYmplY3QncyBtZXNzYWdlIGlkcyBhbmQgc3RvcmVzIHRoZSByZWZlcmVuY2VzIHRvIHRoZSBoaWdobGlnaHQgb2JqZWN0IGZvciB0aGVzZSBpZHMuXG4gICAqIEBwYXJhbSAge0hpZ2hsaWdodFtdfSBoaWdobGlnaHRzQmVmb3JlXG4gICAqIEBwYXJhbSAge0hpZ2hsaWdodFtdfSBoaWdobGlnaHRzQWZ0ZXJcbiAgICovXG4gIHB1YmxpYyBsaW5rSGlnaGxpZ2h0SWRUb09iamVjdChoaWdobGlnaHRzQmVmb3JlOiBIaWdobGlnaHRbXSwgaGlnaGxpZ2h0c0FmdGVyOiBIaWdobGlnaHRbXSkge1xuICAgIHRoaXMubWVzc2FnZS5saW5rSGlnaGxpZ2h0KGhpZ2hsaWdodHNCZWZvcmUsIGhpZ2hsaWdodHNBZnRlcik7XG4gIH1cbiAgLyoqXG4gICAqIFR1cm5zIG9uIHRoZSBoaWdobGlnaHRzIHNldCBieSB0aGUgY29udGVudCBhdXRob3IgZm9yIHRoaXMgYW5zd2VyLlxuICAgKi9cbiAgcHVibGljIGFjdGl2YXRlSGlnaGxpZ2h0KCkge1xuICAgIGlmICh0aGlzLm1lc3NhZ2UuaGlnaGxpZ2h0ZWRFbGVtZW50KVxuICAgICAgdGhpcy5tZXNzYWdlLmhpZ2hsaWdodGVkRWxlbWVudC5pc0hpZ2hsaWdodGVkID0gdHJ1ZTtcbiAgfVxuXG4gIHByaXZhdGUgY2xlYW5TdHJpbmcodGV4dDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICB0ZXh0ID0gdGV4dC50cmltKCk7XG4gICAgcmV0dXJuIHRleHQucmVwbGFjZSgvXFxzezIsfS9nLCBcIiBcIik7XG4gIH1cbiAgLyoqXG4gICAqIExvb2tzIHRocm91Z2ggdGhlIGRpZmYgYW5kIGNoZWNrcyBob3cgbWFueSBjaGFyYWN0ZXIgY2hhbmdlIG9wZXJhdGlvbnMgYXJlIG5lZWRlZCB0byB0dXJuIG9uZSBzdHJpbmcgaW50byB0aGUgb3RoZXIuIFNob3VsZCByZXR1cm4gdGhlIHNhbWUgcmVzdWx0cyBhcyB0aGUgTGV2ZW5zdGhlaW4gZGlzdGFuY2UuIFxuICAgKiBAcGFyYW0gIHtbe2FkZGVkPzpib29sZWFuLCBib29sZWFuOiByZW1vdmVkPywgc3RyaW5nOiB2YWx1ZX1dfSBkaWZmIC0gYXMgcmV0dXJuZWQgYnkganNkaWZmXG4gICAqIEByZXR1cm5zIG51bWJlciAtIHRoZSBjb3VudCBvZiBjaGFuZ2VzIChyZXBsYWNlLCBhZGQsIGRlbGV0ZSkgbmVlZGVkIHRvIGNoYW5nZSB0aGUgdGV4dCBmcm9tIG9uZSBzdHJpbmcgdG8gdGhlIG90aGVyIFxuICAgKi9cbiAgcHJpdmF0ZSBnZXRDaGFuZ2VzQ291bnRGcm9tRGlmZihkaWZmOiBqc2RpZmYuQ2hhbmdlW10pOiBudW1iZXIge1xuICAgIHZhciB0b3RhbENoYW5nZXNDb3VudCA9IDA7XG4gICAgdmFyIGxhc3RUeXBlID0gXCJcIjtcbiAgICB2YXIgbGFzdENvdW50ID0gMDtcblxuICAgIGZvciAodmFyIGVsZW1lbnQgb2YgZGlmZikge1xuICAgICAgaWYgKGVsZW1lbnQucmVtb3ZlZCkge1xuICAgICAgICB0b3RhbENoYW5nZXNDb3VudCArPSBlbGVtZW50LnZhbHVlLmxlbmd0aDtcbiAgICAgICAgbGFzdFR5cGUgPSBcInJlbW92ZWRcIjtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKGVsZW1lbnQuYWRkZWQpIHtcbiAgICAgICAgaWYgKGxhc3RUeXBlID09PSBcInJlbW92ZWRcIikge1xuICAgICAgICAgIGlmIChsYXN0Q291bnQgPCBlbGVtZW50LnZhbHVlLmxlbmd0aCkge1xuICAgICAgICAgICAgdG90YWxDaGFuZ2VzQ291bnQgKz0gZWxlbWVudC52YWx1ZS5sZW5ndGggLSBsYXN0Q291bnQ7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRvdGFsQ2hhbmdlc0NvdW50ICs9IGVsZW1lbnQudmFsdWUubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIGxhc3RUeXBlID0gXCJhZGRlZFwiO1xuICAgICAgfVxuICAgICAgZWxzZSB7XG4gICAgICAgIGxhc3RUeXBlID0gXCJzYW1lXCI7XG4gICAgICB9XG4gICAgICBsYXN0Q291bnQgPSBlbGVtZW50LnZhbHVlLmxlbmd0aDtcbiAgICB9XG5cbiAgICByZXR1cm4gdG90YWxDaGFuZ2VzQ291bnQ7XG4gIH1cbiAgLyoqXG4gICAqIFJldHVybnMgaG93IG1hbnkgY2hhcmFjdGVycyBjYW4gYmUgd3JvbmcgdG8gc3RpbGwgYmUgY291bnRlZCBhcyBhIHNwZWxsaW5nIG1pc3Rha2UuXG4gICAqIElmIHNwZWxsaW5nIG1pc3Rha2VzIGFyZSB0dXJuZWQgb2ZmIHRocm91Z2ggdGhlIHNldHRpbmdzLCBpdCB3aWxsIHJldHVybiAwLlxuICAgKiBAcGFyYW0gIHtzdHJpbmd9IHRleHRcbiAgICogQHJldHVybnMgbnVtYmVyXG4gICAqL1xuXG4gIHByaXZhdGUgZ2V0QWNjZXB0YWJsZVNwZWxsaW5nTWlzdGFrZXModGV4dDogc3RyaW5nKTogbnVtYmVyIHtcbiAgICB2YXIgYWNjZXB0YWJsZVR5cG9Db3VudDogbnVtYmVyO1xuICAgIGlmICh0aGlzLnNldHRpbmdzLndhcm5TcGVsbGluZ0Vycm9ycyB8fCB0aGlzLnNldHRpbmdzLmFjY2VwdFNwZWxsaW5nRXJyb3JzKSAvLyBUT0RPOiBjb25zaWRlciByZW1vdmFsXG4gICAgICBhY2NlcHRhYmxlVHlwb0NvdW50ID0gTWF0aC5mbG9vcih0ZXh0Lmxlbmd0aCAvIDEwKSArIDE7XG4gICAgZWxzZVxuICAgICAgYWNjZXB0YWJsZVR5cG9Db3VudCA9IDA7XG5cbiAgICByZXR1cm4gYWNjZXB0YWJsZVR5cG9Db3VudDtcbiAgfVxuICAvKipcbiAgICogQ2hlY2tzIGlmIHRoZSB0ZXh0IGVudGVyZWQgYnkgdGhlIHVzZXIgaW4gYW4gZXR0ZW1wdCBpcyBtYXRjaGVkIGJ5IHRoZSBhbnN3ZXIsXG4gICAqIEBwYXJhbSAge3N0cmluZ30gYXR0ZW1wdCBUaGUgdGV4dCBlbnRlcmVkIGJ5IHRoZSB1c2VyLlxuICAgKiBAcmV0dXJucyBFdmFsdWF0aW9uIGluZGljYXRlcyBpZiB0aGUgZW50ZXJlZCB0ZXh0IGlzIG1hdGNoZWQgYnkgdGhlIGFuc3dlci5cbiAgICovXG4gIHB1YmxpYyBldmFsdWF0ZUF0dGVtcHQoYXR0ZW1wdDogc3RyaW5nKTogRXZhbHVhdGlvbiB7XG4gICAgdmFyIGNsZWFuZWRBdHRlbXB0ID0gdGhpcy5jbGVhblN0cmluZyhhdHRlbXB0KTtcbiAgICB2YXIgZXZhbHVhdGlvbiA9IG5ldyBFdmFsdWF0aW9uKHRoaXMpO1xuXG4gICAgZm9yICh2YXIgYWx0ZXJuYXRpdmUgb2YgdGhpcy5hbHRlcm5hdGl2ZXMpIHtcbiAgICAgIHZhciBjbGVhbmVkQWx0ZXJuYXRpdmUgPSB0aGlzLmNsZWFuU3RyaW5nKGFsdGVybmF0aXZlKTtcblxuICAgICAgdmFyIGRpZmYgPSBqc2RpZmYuZGlmZkNoYXJzKGNsZWFuZWRBbHRlcm5hdGl2ZSwgY2xlYW5lZEF0dGVtcHQsXG4gICAgICAgIHsgaWdub3JlQ2FzZTogIXRoaXMuc2V0dGluZ3MuY2FzZVNlbnNpdGl2ZSB9KTtcbiAgICAgIHZhciBjaGFuZ2VDb3VudCA9IHRoaXMuZ2V0Q2hhbmdlc0NvdW50RnJvbURpZmYoZGlmZik7XG5cbiAgICAgIGlmIChjaGFuZ2VDb3VudCA9PT0gMCkge1xuICAgICAgICBldmFsdWF0aW9uLnVzZWRBbHRlcm5hdGl2ZSA9IGNsZWFuZWRBbHRlcm5hdGl2ZTtcbiAgICAgICAgZXZhbHVhdGlvbi5jb3JyZWN0bmVzcyA9IENvcnJlY3RuZXNzLkV4YWN0TWF0Y2g7XG4gICAgICAgIHJldHVybiBldmFsdWF0aW9uO1xuICAgICAgfVxuXG4gICAgICBpZiAoY2hhbmdlQ291bnQgPD0gdGhpcy5nZXRBY2NlcHRhYmxlU3BlbGxpbmdNaXN0YWtlcyhhbHRlcm5hdGl2ZSlcbiAgICAgICAgJiYgKGV2YWx1YXRpb24uY2hhcmFjdGVyRGlmZmVyZW5jZUNvdW50ID09PSAwIHx8IGNoYW5nZUNvdW50IDwgZXZhbHVhdGlvbi5jaGFyYWN0ZXJEaWZmZXJlbmNlQ291bnQpKSB7XG4gICAgICAgIGV2YWx1YXRpb24udXNlZEFsdGVybmF0aXZlID0gY2xlYW5lZEFsdGVybmF0aXZlO1xuICAgICAgICBldmFsdWF0aW9uLmNvcnJlY3RuZXNzID0gQ29ycmVjdG5lc3MuQ2xvc2VNYXRjaDtcbiAgICAgICAgZXZhbHVhdGlvbi5jaGFyYWN0ZXJEaWZmZXJlbmNlQ291bnQgPSBjaGFuZ2VDb3VudDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGV2YWx1YXRpb247XG4gIH1cbn0iLCJpbXBvcnQgeyBNZXNzYWdlU2VydmljZSB9IGZyb20gJy4uL3NlcnZpY2VzL21lc3NhZ2Utc2VydmljZSc7XG5pbXBvcnQgeyBDbG96ZUVsZW1lbnQsIENsb3plRWxlbWVudFR5cGUgfSBmcm9tICcuL2Nsb3plLWVsZW1lbnQnO1xuaW1wb3J0IHsgQW5zd2VyLCBDb3JyZWN0bmVzcyB9IGZyb20gJy4vYW5zd2VyJztcbmltcG9ydCB7IE1lc3NhZ2UgfSBmcm9tICcuL21lc3NhZ2UnO1xuaW1wb3J0IHsgTWVzc2FnZVR5cGUsIENsb3plVHlwZSwgU2VsZWN0QWx0ZXJuYXRpdmVzIH0gZnJvbSAnLi9lbnVtcyc7XG5pbXBvcnQgeyBINVBMb2NhbGl6YXRpb24sIExvY2FsaXphdGlvbkxhYmVscyB9IGZyb20gJy4uL3NlcnZpY2VzL2xvY2FsaXphdGlvbic7XG5pbXBvcnQgeyBJU2V0dGluZ3MgfSBmcm9tIFwiLi4vc2VydmljZXMvc2V0dGluZ3NcIjtcbmltcG9ydCB7IGdldExvbmdlc3RTdHJpbmcsIHNodWZmbGVBcnJheSB9IGZyb20gXCIuLi8uLi9saWIvaGVscGVyc1wiO1xuaW1wb3J0ICogYXMganNkaWZmIGZyb20gJ2RpZmYnO1xuXG5leHBvcnQgY2xhc3MgQmxhbmsgZXh0ZW5kcyBDbG96ZUVsZW1lbnQge1xuICAvLyBjb250ZW50XG4gIGNvcnJlY3RBbnN3ZXJzOiBBbnN3ZXJbXTtcbiAgaW5jb3JyZWN0QW5zd2VyczogQW5zd2VyW107XG4gIGhpbnQ6IE1lc3NhZ2U7XG4gIGlkOiBzdHJpbmc7XG4gIGNob2ljZXM6IHN0cmluZ1tdO1xuICBoYXNIaW50OiBib29sZWFuO1xuXG4gIC8vIHZpZXdtb2RlbCBzdHVmZlxuXG4gIGxhc3RDaGVja2VkVGV4dDogc3RyaW5nO1xuICBlbnRlcmVkVGV4dDogc3RyaW5nO1xuICBpc0NvcnJlY3Q6IGJvb2xlYW47XG4gIGlzRXJyb3I6IGJvb2xlYW47XG4gIGlzUmV0cnk6IGJvb2xlYW47XG4gIGhhc1BlbmRpbmdGZWVkYmFjazogYm9vbGVhbjtcbiAgaXNTaG93aW5nU29sdXRpb246IGJvb2xlYW47XG4gIG1lc3NhZ2U6IHN0cmluZztcbiAgbWluVGV4dExlbmd0aDogbnVtYmVyO1xuICBzcGVlY2hCdWJibGU6IGFueTtcblxuICAvKipcbiAgICogQWRkIGluY29ycmVjdCBhbnN3ZXJzIGFmdGVyIGluaXRpYWxpemluZyB0aGUgb2JqZWN0LiBDYWxsIGZpbmlzaEluaXRpYWxpemF0aW9uKClcbiAgICogd2hlbiBkb25lLlxuICAgKiBAcGFyYW0gIHtJU2V0dGluZ3N9IHNldHRpbmdzXG4gICAqIEBwYXJhbSAge3N0cmluZ30gaWRcbiAgICogQHBhcmFtICB7c3RyaW5nfSBjb3JyZWN0VGV4dD9cbiAgICogQHBhcmFtICB7c3RyaW5nfSBoaW50VGV4dD9cbiAgICovXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgc2V0dGluZ3M6IElTZXR0aW5ncywgcHJpdmF0ZSBsb2NhbGl6YXRpb246IEg1UExvY2FsaXphdGlvbiwgcHJpdmF0ZSBqcXVlcnk6IEpRdWVyeVN0YXRpYywgcHJpdmF0ZSBtZXNzYWdlU2VydmljZTogTWVzc2FnZVNlcnZpY2UsIGlkOiBzdHJpbmcpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5lbnRlcmVkVGV4dCA9IFwiXCI7XG4gICAgdGhpcy5jb3JyZWN0QW5zd2VycyA9IG5ldyBBcnJheSgpO1xuICAgIHRoaXMuaW5jb3JyZWN0QW5zd2VycyA9IG5ldyBBcnJheSgpO1xuICAgIHRoaXMuY2hvaWNlcyA9IG5ldyBBcnJheSgpO1xuICAgIHRoaXMudHlwZSA9IENsb3plRWxlbWVudFR5cGUuQmxhbms7XG5cbiAgICB0aGlzLmlkID0gaWQ7XG4gIH1cblxuICAvKipcbiAgKiBDYWxsIHRoaXMgbWV0aG9kIHdoZW4gYWxsIGluY29ycmVjdCBhbnN3ZXJzIGhhdmUgYmVlbiBhZGRlZC5cbiAgKi9cbiAgcHVibGljIGZpbmlzaEluaXRpYWxpemF0aW9uKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnNldHRpbmdzLmNsb3plVHlwZSA9PT0gQ2xvemVUeXBlLlNlbGVjdCAmJiB0aGlzLnNldHRpbmdzLnNlbGVjdEFsdGVybmF0aXZlcyA9PT0gU2VsZWN0QWx0ZXJuYXRpdmVzLkFsdGVybmF0aXZlcykge1xuICAgICAgdGhpcy5sb2FkQ2hvaWNlc0Zyb21Pd25BbHRlcm5hdGl2ZXMoKTtcbiAgICB9XG4gICAgdGhpcy5jYWxjdWxhdGVNaW5UZXh0TGVuZ3RoKCk7XG4gIH1cblxuICBwdWJsaWMgYWRkQ29ycmVjdEFuc3dlcihhbnN3ZXI6IEFuc3dlcikge1xuICAgIHRoaXMuY29ycmVjdEFuc3dlcnMucHVzaChhbnN3ZXIpO1xuICB9XG5cbiAgcHVibGljIGdldENvcnJlY3RBbnN3ZXJzKCk6IHN0cmluZ1tdIHtcbiAgICBsZXQgcmVzdWx0ID0gW107XG4gICAgZm9yIChsZXQgYW5zd2VyIG9mIHRoaXMuY29ycmVjdEFuc3dlcnMpIHtcbiAgICAgIHJlc3VsdCA9IHJlc3VsdC5jb25jYXQoYW5zd2VyLmFsdGVybmF0aXZlcyk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBwdWJsaWMgc2V0SGludChtZXNzYWdlOiBNZXNzYWdlKSB7XG4gICAgdGhpcy5oaW50ID0gbWVzc2FnZTtcbiAgICB0aGlzLmhhc0hpbnQgPSB0aGlzLmhpbnQudGV4dCAhPT0gXCJcIjtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIHRoZSBpbmNvcnJlY3QgYW5zd2VyIHRvIHRoZSBsaXN0LlxuICAgKiBAcGFyYW0gdGV4dCAtIFdoYXQgdGhlIHVzZXIgbXVzdCBlbnRlci5cbiAgICogQHBhcmFtIHJlYWN0aW9uICAtIFdoYXQgdGhlIHVzZXIgZ2V0cyBkaXNwbGF5ZWQgd2hlbiBoZSBlbnRlcmVzIHRoZSB0ZXh0LlxuICAgKi9cbiAgcHVibGljIGFkZEluY29ycmVjdEFuc3dlcih0ZXh0OiBzdHJpbmcsIHJlYWN0aW9uOiBzdHJpbmcsIHNob3dIaWdobGlnaHQ6IGJvb2xlYW4sIGhpZ2hsaWdodDogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy5pbmNvcnJlY3RBbnN3ZXJzLnB1c2goXG4gICAgICBuZXcgQW5zd2VyKHRleHQsIHJlYWN0aW9uLCBzaG93SGlnaGxpZ2h0LCBoaWdobGlnaHQsIHRoaXMuc2V0dGluZ3MpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGhvdyBtYW55IGNoYXJhY3RlcnMgdGhlIGlucHV0IGJveCBtdXN0IGhhdmUgYmUgdG8gYWxsb3cgZm9yIGFsbCBjb3JyZWN0IGFuc3dlcnMuXG4gICAqL1xuICAvLyBUT0RPOiByZWZhY3RvclxuICBwcml2YXRlIGNhbGN1bGF0ZU1pblRleHRMZW5ndGgoKTogdm9pZCB7XG4gICAgdmFyIGFuc3dlcnM6IHN0cmluZ1tdID0gbmV3IEFycmF5KCk7XG4gICAgZm9yIChsZXQgY29ycmVjdEFuc3dlciBvZiB0aGlzLmNvcnJlY3RBbnN3ZXJzKSB7XG4gICAgICBhbnN3ZXJzLnB1c2goZ2V0TG9uZ2VzdFN0cmluZyhjb3JyZWN0QW5zd2VyLmFsdGVybmF0aXZlcykpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLnNldHRpbmdzLmNsb3plVHlwZSA9PT0gQ2xvemVUeXBlLlNlbGVjdCkge1xuICAgICAgZm9yIChsZXQgaW5jb3JyZWN0QW5zd2VyIG9mIHRoaXMuaW5jb3JyZWN0QW5zd2Vycykge1xuICAgICAgICBhbnN3ZXJzLnB1c2goZ2V0TG9uZ2VzdFN0cmluZyhpbmNvcnJlY3RBbnN3ZXIuYWx0ZXJuYXRpdmVzKSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIGxvbmdlc3RBbnN3ZXIgPSBnZXRMb25nZXN0U3RyaW5nKGFuc3dlcnMpO1xuICAgIHZhciBsID0gbG9uZ2VzdEFuc3dlci5sZW5ndGg7XG4gICAgdGhpcy5taW5UZXh0TGVuZ3RoID0gTWF0aC5tYXgoMTAsIGwgLSAobCAlIDEwKSArIDEwKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbGlzdCBvZiBjaG9pY2VzIGZyb20gYWxsIGFsdGVybmF0aXZlcyBwcm92aWRlZCBieVxuICAgKiB0aGUgY29ycmVjdCBhbmQgaW5jb3JyZWN0IGFuc3dlcnMuXG4gICAqL1xuICBwcml2YXRlIGxvYWRDaG9pY2VzRnJvbU93bkFsdGVybmF0aXZlcygpOiBzdHJpbmdbXSB7XG4gICAgdGhpcy5jaG9pY2VzID0gbmV3IEFycmF5KCk7XG4gICAgZm9yIChsZXQgYW5zd2VyIG9mIHRoaXMuY29ycmVjdEFuc3dlcnMpIHtcbiAgICAgIGZvciAobGV0IGFsdGVybmF0aXZlIG9mIGFuc3dlci5hbHRlcm5hdGl2ZXMpIHtcbiAgICAgICAgdGhpcy5jaG9pY2VzLnB1c2goYWx0ZXJuYXRpdmUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGZvciAobGV0IGFuc3dlciBvZiB0aGlzLmluY29ycmVjdEFuc3dlcnMpIHtcbiAgICAgIGZvciAobGV0IGFsdGVybmF0aXZlIG9mIGFuc3dlci5hbHRlcm5hdGl2ZXMpIHtcbiAgICAgICAgdGhpcy5jaG9pY2VzLnB1c2goYWx0ZXJuYXRpdmUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuY2hvaWNlcyA9IHNodWZmbGVBcnJheSh0aGlzLmNob2ljZXMpO1xuICAgIHRoaXMuY2hvaWNlcy51bnNoaWZ0KFwiXCIpO1xuXG4gICAgcmV0dXJuIHRoaXMuY2hvaWNlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGVzIGEgbGlzdCBvZiBjaG9pY2VzIGZyb20gYWxsIGNvcnJlY3QgYW5zd2VycyBvZiB0aGUgY2xvemUuXG4gICAqIEBwYXJhbSBvdGhlckJsYW5rcyBBbGwgT1RIRVIgYmxhbmtzIGluIHRoZSBjbG96ZS4gKGV4Y2x1ZGVzIHRoZSBjdXJyZW50IG9uZSEpXG4gICAqL1xuICBwdWJsaWMgbG9hZENob2ljZXNGcm9tT3RoZXJCbGFua3Mob3RoZXJCbGFua3M6IEJsYW5rW10pOiBzdHJpbmdbXSB7XG4gICAgbGV0IG93bkNob2ljZXMgPSBuZXcgQXJyYXkoKTtcbiAgICBmb3IgKGxldCBhbnN3ZXIgb2YgdGhpcy5jb3JyZWN0QW5zd2Vycykge1xuICAgICAgZm9yIChsZXQgYWx0ZXJuYXRpdmUgb2YgYW5zd2VyLmFsdGVybmF0aXZlcykge1xuICAgICAgICBvd25DaG9pY2VzLnB1c2goYWx0ZXJuYXRpdmUpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxldCBvdGhlckNob2ljZXMgPSBuZXcgQXJyYXkoKTtcbiAgICBmb3IgKGxldCBvdGhlckJsYW5rIG9mIG90aGVyQmxhbmtzKSB7XG4gICAgICBmb3IgKGxldCBhbnN3ZXIgb2Ygb3RoZXJCbGFuay5jb3JyZWN0QW5zd2Vycykge1xuICAgICAgICBmb3IgKGxldCBhbHRlcm5hdGl2ZSBvZiBhbnN3ZXIuYWx0ZXJuYXRpdmVzKSB7XG4gICAgICAgICAgb3RoZXJDaG9pY2VzLnB1c2goYWx0ZXJuYXRpdmUpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgb3RoZXJDaG9pY2VzID0gc2h1ZmZsZUFycmF5KG90aGVyQ2hvaWNlcyk7XG5cbiAgICBsZXQgbWF4Q2hvaWNlcyA9IHRoaXMuc2V0dGluZ3Muc2VsZWN0QWx0ZXJuYXRpdmVSZXN0cmljdGlvbjtcbiAgICBpZiAobWF4Q2hvaWNlcyA9PT0gdW5kZWZpbmVkIHx8IG1heENob2ljZXMgPT09IDApXG4gICAgICBtYXhDaG9pY2VzID0gb3duQ2hvaWNlcy5sZW5ndGggKyBvdGhlckNob2ljZXMubGVuZ3RoO1xuXG4gICAgbGV0IGxlZnRPdmVyQ2hvaWNlcyA9IG1heENob2ljZXMgLSBvd25DaG9pY2VzLmxlbmd0aDtcbiAgICBmb3IgKGxldCB4ID0gMDsgeCA8IGxlZnRPdmVyQ2hvaWNlcyAmJiB4IDwgb3RoZXJDaG9pY2VzLmxlbmd0aDsgeCsrKSB7XG4gICAgICBpZiAob3duQ2hvaWNlcy5pbmRleE9mKG90aGVyQ2hvaWNlc1t4XSkgPj0gMCkge1xuICAgICAgICBsZWZ0T3ZlckNob2ljZXMrKztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG93bkNob2ljZXMucHVzaChvdGhlckNob2ljZXNbeF0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuY2hvaWNlcyA9IHNodWZmbGVBcnJheShvd25DaG9pY2VzKTtcbiAgICB0aGlzLmNob2ljZXMudW5zaGlmdChcIlwiKTtcblxuICAgIHJldHVybiB0aGlzLmNob2ljZXM7XG4gIH1cblxuICAvKipcbiAgKiBDbGVhcnMgdGhlIGJsYW5rIGZyb20gYWxsIGVudGVyZWQgdGV4dCBhbmQgaGlkZXMgcG9wdXBzLlxuICAqL1xuICBwdWJsaWMgcmVzZXQoKSB7XG4gICAgdGhpcy5lbnRlcmVkVGV4dCA9IFwiXCI7XG4gICAgdGhpcy5sYXN0Q2hlY2tlZFRleHQgPSBcIlwiO1xuICAgIHRoaXMucmVtb3ZlVG9vbHRpcCgpO1xuICAgIHRoaXMuc2V0QW5zd2VyU3RhdGUoTWVzc2FnZVR5cGUuTm9uZSk7XG4gICAgdGhpcy5oYXNQZW5kaW5nRmVlZGJhY2sgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBibGFuayB0byBhIHN0YXRlIGluIHdoaWNoIHRoZSBjb3JyZWN0IHNvbHV0aW9uIGlmIHNob3duIGlmIHRoZSB1c2VyXG4gICAqIGhhc24ndCBlbnRlcmVkIGEgY29ycmVjdCBvbmUgc28gZmFyLlxuICAgKi9cbiAgcHVibGljIHNob3dTb2x1dGlvbigpIHtcbiAgICB0aGlzLmV2YWx1YXRlQXR0ZW1wdCh0cnVlKTtcbiAgICB0aGlzLnJlbW92ZVRvb2x0aXAoKTtcbiAgICBpZiAodGhpcy5pc0NvcnJlY3QpXG4gICAgICByZXR1cm47XG4gICAgdGhpcy5lbnRlcmVkVGV4dCA9IHRoaXMuY29ycmVjdEFuc3dlcnNbMF0uYWx0ZXJuYXRpdmVzWzBdO1xuICAgIHRoaXMuc2V0QW5zd2VyU3RhdGUoTWVzc2FnZVR5cGUuU2hvd1NvbHV0aW9uKTtcbiAgfVxuXG4gIHB1YmxpYyBvbkZvY3Vzc2VkKCkge1xuICAgIGlmICh0aGlzLmhhc1BlbmRpbmdGZWVkYmFjaykge1xuICAgICAgdGhpcy5ldmFsdWF0ZUF0dGVtcHQoZmFsc2UpO1xuICAgIH1cbiAgICBpZiAodGhpcy5zZXR0aW5ncy5jbG96ZVR5cGUgPT09IENsb3plVHlwZS5TZWxlY3QpIHtcbiAgICAgIHRoaXMuc2V0QW5zd2VyU3RhdGUoTWVzc2FnZVR5cGUuTm9uZSk7XG4gICAgICB0aGlzLmxhc3RDaGVja2VkVGV4dCA9IFwiXCI7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9uRGlzcGxheUZlZWRiYWNrKCkge1xuICAgIGlmICh0aGlzLmhhc1BlbmRpbmdGZWVkYmFjaykge1xuICAgICAgdGhpcy5ldmFsdWF0ZUF0dGVtcHQoZmFsc2UpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZGlzcGxheVRvb2x0aXAobWVzc2FnZTogc3RyaW5nLCB0eXBlOiBNZXNzYWdlVHlwZSwgc3VycHJlc3NUb29sdGlwOiBib29sZWFuLCBpZD86IHN0cmluZykge1xuICAgIGlmICghc3VycHJlc3NUb29sdGlwKVxuICAgICAgdGhpcy5tZXNzYWdlU2VydmljZS5zaG93KGlkID8gaWQgOiB0aGlzLmlkLCBtZXNzYWdlLCB0aGlzLCB0eXBlKTtcbiAgICBlbHNlIHtcbiAgICAgIHRoaXMuaGFzUGVuZGluZ0ZlZWRiYWNrID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcmVtb3ZlVG9vbHRpcCgpIHtcbiAgICB0aGlzLm1lc3NhZ2VTZXJ2aWNlLmhpZGUoKTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0VG9vbHRpcEVycm9yVGV4dChtZXNzYWdlOiBNZXNzYWdlLCBzdXJwcmVzc1Rvb2x0aXA6IGJvb2xlYW4pIHtcbiAgICBpZiAobWVzc2FnZS5oaWdobGlnaHRlZEVsZW1lbnQpIHtcbiAgICAgIHRoaXMuZGlzcGxheVRvb2x0aXAobWVzc2FnZS50ZXh0LCBNZXNzYWdlVHlwZS5FcnJvciwgc3VycHJlc3NUb29sdGlwLCBtZXNzYWdlLmhpZ2hsaWdodGVkRWxlbWVudC5pZCk7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhpcy5kaXNwbGF5VG9vbHRpcChtZXNzYWdlLnRleHQsIE1lc3NhZ2VUeXBlLkVycm9yLCBzdXJwcmVzc1Rvb2x0aXApO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0U3BlbGxpbmdNaXN0YWtlTWVzc2FnZShleHBlY3RlZFRleHQ6IHN0cmluZywgZW50ZXJlZFRleHQ6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgdmFyIG1lc3NhZ2UgPSB0aGlzLmxvY2FsaXphdGlvbi5nZXRUZXh0RnJvbUxhYmVsKExvY2FsaXphdGlvbkxhYmVscy50eXBvTWVzc2FnZSlcblxuICAgIHZhciBkaWZmID0ganNkaWZmLmRpZmZDaGFycyhleHBlY3RlZFRleHQsIGVudGVyZWRUZXh0LCB7IGlnbm9yZUNhc2U6ICF0aGlzLnNldHRpbmdzLmNhc2VTZW5zaXRpdmUgfSk7XG5cbiAgICB2YXIgbWlzdGFrZVNwYW4gPSB0aGlzLmpxdWVyeShcIjxzcGFuLz5cIiwgeyBcImNsYXNzXCI6IFwic3BlbGxpbmctbWlzdGFrZVwiIH0pO1xuICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBkaWZmLmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgdmFyIHBhcnQgPSBkaWZmW2luZGV4XTtcbiAgICAgIHZhciBzcGFuQ2xhc3MgPSAnJztcbiAgICAgIGlmIChwYXJ0LnJlbW92ZWQpIHtcbiAgICAgICAgaWYgKGluZGV4ID09PSBkaWZmLmxlbmd0aCAtIDEgfHwgIWRpZmZbaW5kZXggKyAxXS5hZGRlZCkge1xuICAgICAgICAgIHBhcnQudmFsdWUgPSBwYXJ0LnZhbHVlLnJlcGxhY2UoLy4vZywgXCJfXCIpO1xuICAgICAgICAgIHNwYW5DbGFzcyA9ICdtaXNzaW5nLWNoYXJhY3Rlcic7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChwYXJ0LmFkZGVkKSB7XG4gICAgICAgIHNwYW5DbGFzcyA9ICdtaXN0YWtlbi1jaGFyYWN0ZXInO1xuICAgICAgfVxuXG4gICAgICB2YXIgc3BhbiA9IHRoaXMuanF1ZXJ5KFwiPHNwYW4vPlwiLCB7IFwiY2xhc3NcIjogc3BhbkNsYXNzLCBcImh0bWxcIjogcGFydC52YWx1ZS5yZXBsYWNlKFwiIFwiLCBcIiZuYnNwO1wiKSB9KTtcbiAgICAgIG1pc3Rha2VTcGFuLmFwcGVuZChzcGFuKTtcbiAgICB9XG5cbiAgICBtZXNzYWdlID0gbWVzc2FnZS5yZXBsYWNlKFwiQG1pc3Rha2VcIiwgdGhpcy5qcXVlcnkoXCI8c3Bhbi8+XCIpLmFwcGVuZChtaXN0YWtlU3BhbikuaHRtbCgpKTtcbiAgICByZXR1cm4gbWVzc2FnZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVja3MgaWYgdGhlIGVudGVyZWQgdGV4dCBpcyB0aGUgY29ycmVjdCBhbnN3ZXIgb3Igb25lIG9mIHRoZSBcbiAgICogaW5jb3JyZWN0IG9uZXMgYW5kIGdpdmVzIHRoZSB1c2VyIGZlZWRiYWNrIGFjY29yZGluZ2x5LlxuICAgKi9cbiAgcHVibGljIGV2YWx1YXRlQXR0ZW1wdChzdXJwcmVzc1Rvb2x0aXBzOiBib29sZWFuLCBmb3JjZUNoZWNrPzogYm9vbGVhbikge1xuICAgIGlmICghdGhpcy5oYXNQZW5kaW5nRmVlZGJhY2sgJiYgdGhpcy5sYXN0Q2hlY2tlZFRleHQgPT09IHRoaXMuZW50ZXJlZFRleHQgJiYgIWZvcmNlQ2hlY2spXG4gICAgICByZXR1cm47XG5cbiAgICB0aGlzLmxhc3RDaGVja2VkVGV4dCA9IHRoaXMuZW50ZXJlZFRleHQudG9TdHJpbmcoKTtcbiAgICB0aGlzLmhhc1BlbmRpbmdGZWVkYmFjayA9IGZhbHNlO1xuICAgIHRoaXMucmVtb3ZlVG9vbHRpcCgpO1xuXG4gICAgdmFyIGV4YWN0Q29ycmVjdE1hdGNoZXMgPSB0aGlzLmNvcnJlY3RBbnN3ZXJzLm1hcChhbnN3ZXIgPT4gYW5zd2VyLmV2YWx1YXRlQXR0ZW1wdCh0aGlzLmVudGVyZWRUZXh0KSkuZmlsdGVyKGV2YWx1YXRpb24gPT4gZXZhbHVhdGlvbi5jb3JyZWN0bmVzcyA9PT0gQ29ycmVjdG5lc3MuRXhhY3RNYXRjaCkuc29ydChldmFsdWF0aW9uID0+IGV2YWx1YXRpb24uY2hhcmFjdGVyRGlmZmVyZW5jZUNvdW50KTtcbiAgICB2YXIgY2xvc2VDb3JyZWN0TWF0Y2hlcyA9IHRoaXMuY29ycmVjdEFuc3dlcnMubWFwKGFuc3dlciA9PiBhbnN3ZXIuZXZhbHVhdGVBdHRlbXB0KHRoaXMuZW50ZXJlZFRleHQpKS5maWx0ZXIoZXZhbHVhdGlvbiA9PiBldmFsdWF0aW9uLmNvcnJlY3RuZXNzID09PSBDb3JyZWN0bmVzcy5DbG9zZU1hdGNoKS5zb3J0KGV2YWx1YXRpb24gPT4gZXZhbHVhdGlvbi5jaGFyYWN0ZXJEaWZmZXJlbmNlQ291bnQpO1xuICAgIHZhciBleGFjdEluY29ycmVjdE1hdGNoZXMgPSB0aGlzLmluY29ycmVjdEFuc3dlcnMubWFwKGFuc3dlciA9PiBhbnN3ZXIuZXZhbHVhdGVBdHRlbXB0KHRoaXMuZW50ZXJlZFRleHQpKS5maWx0ZXIoZXZhbHVhdGlvbiA9PiBldmFsdWF0aW9uLmNvcnJlY3RuZXNzID09PSBDb3JyZWN0bmVzcy5FeGFjdE1hdGNoKS5zb3J0KGV2YWx1YXRpb24gPT4gZXZhbHVhdGlvbi5jaGFyYWN0ZXJEaWZmZXJlbmNlQ291bnQpO1xuICAgIHZhciBjbG9zZUluY29ycmVjdE1hdGNoZXMgPSB0aGlzLmluY29ycmVjdEFuc3dlcnMubWFwKGFuc3dlciA9PiBhbnN3ZXIuZXZhbHVhdGVBdHRlbXB0KHRoaXMuZW50ZXJlZFRleHQpKS5maWx0ZXIoZXZhbHVhdGlvbiA9PiBldmFsdWF0aW9uLmNvcnJlY3RuZXNzID09PSBDb3JyZWN0bmVzcy5DbG9zZU1hdGNoKS5zb3J0KGV2YWx1YXRpb24gPT4gZXZhbHVhdGlvbi5jaGFyYWN0ZXJEaWZmZXJlbmNlQ291bnQpO1xuXG4gICAgaWYgKGV4YWN0Q29ycmVjdE1hdGNoZXMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5zZXRBbnN3ZXJTdGF0ZShNZXNzYWdlVHlwZS5Db3JyZWN0KTtcbiAgICAgIGlmICghdGhpcy5zZXR0aW5ncy5jYXNlU2Vuc2l0aXZlKSB7XG4gICAgICAgIHRoaXMuZW50ZXJlZFRleHQgPSBleGFjdENvcnJlY3RNYXRjaGVzWzBdLnVzZWRBbHRlcm5hdGl2ZTtcbiAgICAgIH1cbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZXhhY3RJbmNvcnJlY3RNYXRjaGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuc2V0QW5zd2VyU3RhdGUoTWVzc2FnZVR5cGUuRXJyb3IpO1xuICAgICAgdGhpcy5zaG93RXJyb3JUb29sdGlwKGV4YWN0SW5jb3JyZWN0TWF0Y2hlc1swXS51c2VkQW5zd2VyLCBzdXJwcmVzc1Rvb2x0aXBzKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoY2xvc2VDb3JyZWN0TWF0Y2hlcy5sZW5ndGggPiAwKSB7XG4gICAgICBpZiAodGhpcy5zZXR0aW5ncy53YXJuU3BlbGxpbmdFcnJvcnMpIHtcbiAgICAgICAgdGhpcy5kaXNwbGF5VG9vbHRpcCh0aGlzLmdldFNwZWxsaW5nTWlzdGFrZU1lc3NhZ2UoY2xvc2VDb3JyZWN0TWF0Y2hlc1swXS51c2VkQWx0ZXJuYXRpdmUsIHRoaXMuZW50ZXJlZFRleHQpLCBNZXNzYWdlVHlwZS5SZXRyeSwgc3VycHJlc3NUb29sdGlwcyk7XG4gICAgICAgIHRoaXMuc2V0QW5zd2VyU3RhdGUoTWVzc2FnZVR5cGUuUmV0cnkpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5zZXR0aW5ncy5hY2NlcHRTcGVsbGluZ0Vycm9ycykge1xuICAgICAgICB0aGlzLnNldEFuc3dlclN0YXRlKE1lc3NhZ2VUeXBlLkNvcnJlY3QpO1xuICAgICAgICB0aGlzLmVudGVyZWRUZXh0ID0gY2xvc2VDb3JyZWN0TWF0Y2hlc1swXS51c2VkQWx0ZXJuYXRpdmU7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoY2xvc2VJbmNvcnJlY3RNYXRjaGVzLmxlbmd0aCA+IDApIHtcbiAgICAgIHRoaXMuc2V0QW5zd2VyU3RhdGUoTWVzc2FnZVR5cGUuRXJyb3IpO1xuICAgICAgdGhpcy5zaG93RXJyb3JUb29sdGlwKGNsb3NlSW5jb3JyZWN0TWF0Y2hlc1swXS51c2VkQW5zd2VyLCBzdXJwcmVzc1Rvb2x0aXBzKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB2YXIgYWx3YXlzQXBwbHlpbmdBbnN3ZXJzID0gdGhpcy5pbmNvcnJlY3RBbnN3ZXJzLmZpbHRlcihhID0+IGEuYXBwbGllc0Fsd2F5cyk7XG4gICAgaWYgKGFsd2F5c0FwcGx5aW5nQW5zd2VycyAmJiBhbHdheXNBcHBseWluZ0Fuc3dlcnMubGVuZ3RoID4gMCkge1xuICAgICAgdGhpcy5zaG93RXJyb3JUb29sdGlwKGFsd2F5c0FwcGx5aW5nQW5zd2Vyc1swXSwgc3VycHJlc3NUb29sdGlwcyk7XG4gICAgfVxuXG4gICAgdGhpcy5zZXRBbnN3ZXJTdGF0ZShNZXNzYWdlVHlwZS5FcnJvcik7XG4gIH1cblxuICBwdWJsaWMgb25UeXBlZCgpOiB2b2lkIHtcbiAgICB0aGlzLnNldEFuc3dlclN0YXRlKE1lc3NhZ2VUeXBlLk5vbmUpO1xuICAgIHRoaXMubGFzdENoZWNrZWRUZXh0ID0gXCJcIjtcbiAgICB0aGlzLnJlbW92ZVRvb2x0aXAoKTtcbiAgfVxuXG4gIHB1YmxpYyBsb3N0Rm9jdXMoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMubWVzc2FnZVNlcnZpY2UuaXNBY3RpdmUodGhpcykpIHtcbiAgICAgIHRoaXMubWVzc2FnZVNlcnZpY2UuaGlkZSgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBib29sZWFuIHByb3BlcnRpZXMgaXNDb3JyZWN0LCBpcyBFcnJvciBhbmQgaXNSZXRyeSBhY2NvcmRpbmcgdG8gdGhlcGFzc2VkICBtZXNzYWdlVHlwZS5cbiAgICogQHBhcmFtIG1lc3NhZ2VUeXBlIFxuICAgKi9cbiAgcHJpdmF0ZSBzZXRBbnN3ZXJTdGF0ZShtZXNzYWdlVHlwZTogTWVzc2FnZVR5cGUpIHtcbiAgICB0aGlzLmlzQ29ycmVjdCA9IGZhbHNlO1xuICAgIHRoaXMuaXNFcnJvciA9IGZhbHNlO1xuICAgIHRoaXMuaXNSZXRyeSA9IGZhbHNlO1xuICAgIHRoaXMuaXNTaG93aW5nU29sdXRpb24gPSBmYWxzZTtcblxuICAgIHN3aXRjaCAobWVzc2FnZVR5cGUpIHtcbiAgICAgIGNhc2UgTWVzc2FnZVR5cGUuQ29ycmVjdDpcbiAgICAgICAgdGhpcy5pc0NvcnJlY3QgPSB0cnVlO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgTWVzc2FnZVR5cGUuRXJyb3I6XG4gICAgICAgIHRoaXMuaXNFcnJvciA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBNZXNzYWdlVHlwZS5SZXRyeTpcbiAgICAgICAgdGhpcy5pc1JldHJ5ID0gdHJ1ZTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIE1lc3NhZ2VUeXBlLlNob3dTb2x1dGlvbjpcbiAgICAgICAgdGhpcy5pc1Nob3dpbmdTb2x1dGlvbiA9IHRydWU7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc2hvd0Vycm9yVG9vbHRpcChhbnN3ZXI6IEFuc3dlciwgc3VycHJlc3NUb29sdGlwOiBib29sZWFuKSB7XG4gICAgaWYgKGFuc3dlci5tZXNzYWdlICYmIGFuc3dlci5tZXNzYWdlLnRleHQpIHtcbiAgICAgIHRoaXMuc2V0VG9vbHRpcEVycm9yVGV4dChhbnN3ZXIubWVzc2FnZSwgc3VycHJlc3NUb29sdGlwKTtcbiAgICB9XG4gICAgaWYgKCFzdXJwcmVzc1Rvb2x0aXApIHtcbiAgICAgIGFuc3dlci5hY3RpdmF0ZUhpZ2hsaWdodCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNwbGF5cyB0aGUgaGludCBpbiB0aGUgdG9vbHRpcC5cbiAgICovXG4gIHB1YmxpYyBzaG93SGludCgpIHtcbiAgICBpZiAodGhpcy5pc1Nob3dpbmdTb2x1dGlvbiB8fCB0aGlzLmlzQ29ycmVjdClcbiAgICAgIHJldHVybjtcblxuICAgIHRoaXMucmVtb3ZlVG9vbHRpcCgpO1xuICAgIGlmICh0aGlzLmhpbnQgJiYgdGhpcy5oaW50LnRleHQgIT09IFwiXCIpIHtcbiAgICAgIHRoaXMuZGlzcGxheVRvb2x0aXAodGhpcy5oaW50LnRleHQsIE1lc3NhZ2VUeXBlLlJldHJ5LCBmYWxzZSk7XG4gICAgICBpZiAodGhpcy5oaW50LmhpZ2hsaWdodGVkRWxlbWVudCkge1xuICAgICAgICB0aGlzLmhpbnQuaGlnaGxpZ2h0ZWRFbGVtZW50LmlzSGlnaGxpZ2h0ZWQgPSB0cnVlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBzZXJpYWxpemUoKSB7XG4gICAgcmV0dXJuIHRoaXMuZW50ZXJlZFRleHQ7XG4gIH1cblxuICBwdWJsaWMgZGVzZXJpYWxpemUoZGF0YTogYW55KSB7XG4gICAgdGhpcy5lbnRlcmVkVGV4dCA9IGRhdGE7XG4gIH1cbn0iLCJleHBvcnQgZW51bSBDbG96ZUVsZW1lbnRUeXBlIHtcbiAgQmxhbmssXG4gIEhpZ2hsaWdodFxufVxuXG5leHBvcnQgY2xhc3MgQ2xvemVFbGVtZW50IHtcbiAgcHVibGljIHR5cGU6IENsb3plRWxlbWVudFR5cGU7XG59IiwiaW1wb3J0IHsgSGlnaGxpZ2h0IH0gZnJvbSBcIi4vaGlnaGxpZ2h0XCI7XG5pbXBvcnQgeyBCbGFuayB9IGZyb20gXCIuL2JsYW5rXCI7XG5cbi8qKlxuICogUmVwcmVzZW50cyB0aGUgY2xvemUuIEluc3RhbnRpYXRlIHdpdGggc3RhdGljIGNyZWF0ZUNsb3plKCkuXG4gKi9cbmV4cG9ydCBjbGFzcyBDbG96ZSB7XG4gIHB1YmxpYyBodG1sOiBzdHJpbmc7XG4gIHB1YmxpYyBoaWdobGlnaHRzOiBIaWdobGlnaHRbXTtcbiAgcHVibGljIGJsYW5rczogQmxhbmtbXTtcblxuICBwdWJsaWMgY29uc3RydWN0b3IoKSB7IH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIGlmIGFsbCBibGFua3Mgd2VyZSBlbnRlcmVkIGNvcnJlY3RseS4gXG4gICAqIEByZXR1cm5zIGJvb2xlYW5cbiAgICovXG4gIHB1YmxpYyBnZXQgaXNTb2x2ZWQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuYmxhbmtzLmV2ZXJ5KGIgPT4gYi5pc0NvcnJlY3QgPT09IHRydWUpO1xuICB9XG5cblxuICBwdWJsaWMgaGlkZUFsbEhpZ2hsaWdodHMoKTogdm9pZCB7XG4gICAgZm9yICh2YXIgaGlnaGxpZ2h0IG9mIHRoaXMuaGlnaGxpZ2h0cykge1xuICAgICAgaGlnaGxpZ2h0LmlzSGlnaGxpZ2h0ZWQgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcmVzZXQoKSB7XG4gICAgdGhpcy5oaWRlQWxsSGlnaGxpZ2h0cygpO1xuICAgIGZvciAodmFyIGJsYW5rIG9mIHRoaXMuYmxhbmtzKSB7XG4gICAgICBibGFuay5yZXNldCgpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBzaG93U29sdXRpb25zKCkge1xuICAgIGZvciAodmFyIGJsYW5rIG9mIHRoaXMuYmxhbmtzKSB7XG4gICAgICBibGFuay5zaG93U29sdXRpb24oKTtcbiAgICB9XG4gICAgdGhpcy5oaWRlQWxsSGlnaGxpZ2h0cygpO1xuICB9XG5cbiAgcHVibGljIHNlcmlhbGl6ZSgpIDogc3RyaW5nW10ge1xuICAgIHZhciBjbG96ZSA9IFtdO1xuICAgIGZvciAodmFyIGJsYW5rIG9mIHRoaXMuYmxhbmtzKSB7XG4gICAgICBjbG96ZS5wdXNoKGJsYW5rLnNlcmlhbGl6ZSgpKTtcbiAgICB9XG5cbiAgICByZXR1cm4gY2xvemU7XG4gIH1cblxuICBwdWJsaWMgZGVzZXJpYWxpemUoZGF0YTogYW55KSB7XG4gICAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGRhdGEubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgICBpZiAoaW5kZXggPj0gdGhpcy5ibGFua3MubGVuZ3RoKVxuICAgICAgICByZXR1cm47XG4gICAgICB2YXIgYmxhbmsgPSB0aGlzLmJsYW5rc1tpbmRleF07XG4gICAgICBibGFuay5kZXNlcmlhbGl6ZShkYXRhW2luZGV4XSk7XG4gICAgfVxuICB9XG59IiwiZXhwb3J0IGVudW0gTWVzc2FnZVR5cGUge1xuICBFcnJvcixcbiAgQ29ycmVjdCxcbiAgUmV0cnksXG4gIFNob3dTb2x1dGlvbixcbiAgTm9uZVxufVxuXG5leHBvcnQgZW51bSBDbG96ZVR5cGUge1xuICBUeXBlLFxuICBTZWxlY3Rcbn1cblxuZXhwb3J0IGVudW0gU2VsZWN0QWx0ZXJuYXRpdmVzIHtcbiAgQWx0ZXJuYXRpdmVzLFxuICBBbGxcbn0iLCJpbXBvcnQgeyBDbG96ZUVsZW1lbnQsIENsb3plRWxlbWVudFR5cGUgfSBmcm9tICcuL2Nsb3plLWVsZW1lbnQnO1xuXG4vKipcbiAqIFJlcHJlc2VudHMgYSBoaWdobGlnaHQgaW4gdGhlIGNsb3plLlxuICovXG5leHBvcnQgY2xhc3MgSGlnaGxpZ2h0IGV4dGVuZHMgQ2xvemVFbGVtZW50IHtcblx0dGV4dDogc3RyaW5nO1xuXHRpc0hpZ2hsaWdodGVkOiBib29sZWFuO1xuXHRpZDogc3RyaW5nO1xuXG5cdGNvbnN0cnVjdG9yKHRleHQ6IHN0cmluZywgaWQ6IHN0cmluZykge1xuXHRcdHN1cGVyKCk7XG5cdFx0dGhpcy50eXBlID0gQ2xvemVFbGVtZW50VHlwZS5IaWdobGlnaHQ7XG5cdFx0dGhpcy50ZXh0ID0gdGV4dDtcblx0XHR0aGlzLmlkID0gaWQ7XG5cdFx0dGhpcy5pc0hpZ2hsaWdodGVkID0gZmFsc2U7XG5cdH1cbn0iLCJpbXBvcnQgeyBIaWdobGlnaHQgfSBmcm9tIFwiLi9oaWdobGlnaHRcIjtcblxuLyoqXG4gKiBSZXByZXNlbnRzIGEgbWVzc2FnZSB0aGF0IHRoZSBjb250ZW50IGF1dGhvciBoYXMgc3BlY2lmaWVkIHRvIGJlIGEgcmVhY3Rpb25cbiAqIHRvIGFuIHVzZXIncyBhbnN3ZXIuIFxuICovXG5leHBvcnQgY2xhc3MgTWVzc2FnZSB7XG4gIGhpZ2hsaWdodGVkRWxlbWVudDogSGlnaGxpZ2h0O1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB0ZXh0OiBzdHJpbmcsIHNob3dIaWdobGlnaHQ6IGJvb2xlYW4sIHByaXZhdGUgcmVsYXRpdmVIaWdobGlnaHRQb3NpdGlvbjogbnVtYmVyKSB7XG4gICAgaWYoIXNob3dIaWdobGlnaHQpXG4gICAgICB0aGlzLnJlbGF0aXZlSGlnaGxpZ2h0UG9zaXRpb24gPSB1bmRlZmluZWQ7XG4gIH1cblxuICBsaW5rSGlnaGxpZ2h0ID0gKGhpZ2hsaWdodHNCZWZvcmU6IEhpZ2hsaWdodFtdLCBoaWdobGlnaHRzQWZ0ZXI6IEhpZ2hsaWdodFtdKSA9PiB7XG4gICAgaWYgKCF0aGlzLnJlbGF0aXZlSGlnaGxpZ2h0UG9zaXRpb24pXG4gICAgICByZXR1cm47XG5cbiAgICAgIGlmICh0aGlzLnJlbGF0aXZlSGlnaGxpZ2h0UG9zaXRpb24gPCAwICYmICgwIC0gdGhpcy5yZWxhdGl2ZUhpZ2hsaWdodFBvc2l0aW9uIC0gMSkgPCBoaWdobGlnaHRzQmVmb3JlLmxlbmd0aCkge1xuICAgICAgICB0aGlzLmhpZ2hsaWdodGVkRWxlbWVudCA9IGhpZ2hsaWdodHNCZWZvcmVbMCAtIHRoaXMucmVsYXRpdmVIaWdobGlnaHRQb3NpdGlvbiAtIDFdO1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAodGhpcy5yZWxhdGl2ZUhpZ2hsaWdodFBvc2l0aW9uID4gMCAmJiAodGhpcy5yZWxhdGl2ZUhpZ2hsaWdodFBvc2l0aW9uIC0gMSA8IGhpZ2hsaWdodHNBZnRlci5sZW5ndGgpKSB7XG4gICAgICAgIHRoaXMuaGlnaGxpZ2h0ZWRFbGVtZW50ID0gaGlnaGxpZ2h0c0FmdGVyW3RoaXMucmVsYXRpdmVIaWdobGlnaHRQb3NpdGlvbiAtIDFdO1xuICAgICAgfVxuICB9XG59IiwiLyoqXG4gKiBBIHNuaXBwZXQgaXMgYSB0ZXh0IGJsb2NrIHRoYXQgaXMgcHV0IGludG8gcGxhY2VkIG1hcmtlZCBpbiBmZWVkYmFjayB0ZXh0cyBvciBoaW50cy5cbiAqL1xuZXhwb3J0IGNsYXNzIFNuaXBwZXQge1xuICAvKipcbiAgICogQ29uc3RydWN0cyB0aGUgc25pcHBldC5cbiAgICogQHBhcmFtIG5hbWUgVGhlIG5hbWUgb2YgdGhlIHNuaXBwZXQgdGhhdCBpcyB1c2VkIHdoZW4gaXQgaXMgcmVmZXJlbmNlZCBpbiBhIGZlZWRiYWNrdGV4dCAod2l0aG91dCB0aGUgc25pcHBldCBtYXJrZXIgQClcbiAgICogQHBhcmFtIHRleHQgVGhlIHNuaXBwZXQgaXRzZWxmIChodG1sKVxuICAgKi9cbiAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZywgcHVibGljIHRleHQ6IHN0cmluZykge1xuICAgIFxuICB9XG59IiwiZXhwb3J0IGNsYXNzIFhBUElBY3Rpdml0eURlZmluaXRpb24ge1xuICBuYW1lOiBhbnk7XG4gIGRlc2NyaXB0aW9uOiBhbnk7XG4gIHR5cGU6IHN0cmluZztcbiAgaW50ZXJhY3Rpb25UeXBlOiBcInRydWUtZmFsc2VcIiB8IFwiY2hvaWNlXCIgfCBcImZpbGwtaW5cIiB8IFwibG9uZy1maWxsLWluXCIgfCBcIm1hdGNoaW5nXCIgfCBcInBlcmZvcm1hbmNlXCIgfCBcInNlcXVlbmNpbmdcIiB8IFwibGlrZXJ0XCIgfCBcIm51bWVyaWNcIiB8IFwib3RoZXJcIjtcbiAgY29ycmVjdFJlc3BvbnNlc1BhdHRlcm4/OiBzdHJpbmdbXVxufSIsImltcG9ydCB7IEJsYW5rTG9hZGVyIH0gZnJvbSAnLi4vY29udGVudC1sb2FkZXJzL2JsYW5rLWxvYWRlcic7XG5pbXBvcnQgeyBCbGFuayB9IGZyb20gXCIuLi9tb2RlbHMvYmxhbmtcIjtcbmltcG9ydCB7IFNuaXBwZXQgfSBmcm9tIFwiLi4vbW9kZWxzL3NuaXBwZXRcIjtcbmltcG9ydCB7IElTZXR0aW5ncyB9IGZyb20gXCIuLi9zZXJ2aWNlcy9zZXR0aW5nc1wiO1xuaW1wb3J0IHsgSDVQTG9jYWxpemF0aW9uIH0gZnJvbSBcIi4vbG9jYWxpemF0aW9uXCI7XG5pbXBvcnQgeyBVbnJ3YXBwZXIgfSBmcm9tICcuLi9oZWxwZXJzL3Vud3JhcHBlcic7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSURhdGFSZXBvc2l0b3J5IHtcbiAgZ2V0QmxhbmtzKCk6IEJsYW5rW107XG4gIGdldENsb3plVGV4dCgpOiBzdHJpbmc7XG4gIGdldEZlZWRiYWNrVGV4dCgpOiBzdHJpbmc7XG4gIGdldE1lZGlhKCk6IGFueTtcbiAgZ2V0VGFza0Rlc2NyaXB0aW9uKCk6IHN0cmluZztcbiAgZ2V0U25pcHBldHMoKTogU25pcHBldFtdO1xufVxuXG4vKipcbiAqIFdyYXBzIGFyb3VuZCB0aGUgaDVwIGNvbmZpZyBvYmplY3QgYW5kIHByb3ZpZGVzIGFjY2VzcyB0byB0aGUgY29udGVudC5cbiAqL1xuZXhwb3J0IGNsYXNzIEg1UERhdGFSZXBvc2l0b3J5IGltcGxlbWVudHMgSURhdGFSZXBvc2l0b3J5IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBoNXBDb25maWdEYXRhOiBhbnksIHByaXZhdGUgc2V0dGluZ3M6IElTZXR0aW5ncyxcbiAgICBwcml2YXRlIGxvY2FsaXphdGlvbjogSDVQTG9jYWxpemF0aW9uLCBwcml2YXRlIGpxdWVyeTogSlF1ZXJ5U3RhdGljLCBcbiAgICBwcml2YXRlIHVud3JhcHBlcjogVW5yd2FwcGVyKSB7XG5cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBibGFuayB0ZXh0IG9mIHRoZSBjbG96ZSAoYXMgSFRNTCBtYXJrdXApLlxuICAgKi9cbiAgZ2V0Q2xvemVUZXh0KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuaDVwQ29uZmlnRGF0YS5jb250ZW50LmJsYW5rc1RleHQ7XG4gIH1cblxuICAvLyBUT0RPOiByZW1vdmUgb3IgaW1wbGVtZW50XG4gIGdldEZlZWRiYWNrVGV4dCgpOiBzdHJpbmcge1xuICAgIHJldHVybiBcIlwiO1xuICB9XG5cbiAgZ2V0TWVkaWEoKTogYW55IHtcbiAgICByZXR1cm4gdGhpcy5oNXBDb25maWdEYXRhLm1lZGlhO1xuICB9XG5cbiAgZ2V0VGFza0Rlc2NyaXB0aW9uKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuaDVwQ29uZmlnRGF0YS5jb250ZW50LnRhc2s7XG4gIH1cblxuICBnZXRCbGFua3MoKTogQmxhbmtbXSB7XG4gICAgdmFyIGJsYW5rczogQmxhbmtbXSA9IG5ldyBBcnJheSgpO1xuXG4gICAgaWYgKCF0aGlzLmg1cENvbmZpZ0RhdGEuY29udGVudC5ibGFua3NMaXN0KVxuICAgICAgcmV0dXJuIGJsYW5rcztcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5oNXBDb25maWdEYXRhLmNvbnRlbnQuYmxhbmtzTGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGg1cEJsYW5rID0gdGhpcy5oNXBDb25maWdEYXRhLmNvbnRlbnQuYmxhbmtzTGlzdFtpXTtcblxuICAgICAgdmFyIGNvcnJlY3RUZXh0ID0gaDVwQmxhbmsuY29ycmVjdEFuc3dlclRleHQ7XG4gICAgICBpZiAoY29ycmVjdFRleHQgPT09IFwiXCIgfHwgY29ycmVjdFRleHQgPT09IHVuZGVmaW5lZClcbiAgICAgICAgY29udGludWU7XG5cbiAgICAgIHZhciBibGFuayA9IEJsYW5rTG9hZGVyLmluc3RhbmNlLmNyZWF0ZUJsYW5rKFwiY2xvemVcIiArIGksIGNvcnJlY3RUZXh0LFxuICAgICAgICBoNXBCbGFuay5oaW50LCBoNXBCbGFuay5pbmNvcnJlY3RBbnN3ZXJzTGlzdCk7XG5cbiAgICAgIGJsYW5rLmZpbmlzaEluaXRpYWxpemF0aW9uKCk7XG4gICAgICBibGFua3MucHVzaChibGFuayk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGJsYW5rcztcbiAgfVxuXG4gIGdldFNuaXBwZXRzKCk6IFNuaXBwZXRbXSB7XG4gICAgdmFyIHNuaXBwZXRzOiBTbmlwcGV0W10gPSBuZXcgQXJyYXkoKTtcblxuICAgIGlmICghdGhpcy5oNXBDb25maWdEYXRhLnNuaXBwZXRzKVxuICAgICAgcmV0dXJuIHNuaXBwZXRzO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmg1cENvbmZpZ0RhdGEuc25pcHBldHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciByYXdfc25pcHBldCA9IHRoaXMuaDVwQ29uZmlnRGF0YS5zbmlwcGV0c1tpXTtcbiAgICAgIHZhciBzbmlwcGV0ID0gbmV3IFNuaXBwZXQocmF3X3NuaXBwZXQuc25pcHBldE5hbWUsIHRoaXMudW53cmFwcGVyLnVud3JhcChyYXdfc25pcHBldC5zbmlwcGV0VGV4dCkpO1xuICAgICAgc25pcHBldHMucHVzaChzbmlwcGV0KTtcbiAgICB9XG4gICAgcmV0dXJuIHNuaXBwZXRzO1xuICB9XG59IiwiZXhwb3J0IGVudW0gTG9jYWxpemF0aW9uTGFiZWxzIHtcbiAgc2hvd1NvbHV0aW9uQnV0dG9uID0gXCJzaG93U29sdXRpb25zXCIsXG4gIHJldHJ5QnV0dG9uID0gXCJ0cnlBZ2FpblwiLFxuICBjaGVja0FsbEJ1dHRvbiA9IFwiY2hlY2tBbnN3ZXJcIixcbiAgbm90RmlsbGVkT3V0V2FybmluZyA9IFwibm90RmlsbGVkT3V0XCIsXG4gIHRpcEJ1dHRvbiA9XCJ0aXBMYWJlbFwiLFxuICB0eXBvTWVzc2FnZSA9IFwic3BlbGxpbmdNaXN0YWtlV2FybmluZ1wiLFxuICBzY29yZUJhckxhYmVsID0gXCJzY29yZUJhckxhYmVsXCIgIFxufVxuXG5leHBvcnQgZW51bSBMb2NhbGl6YXRpb25TdHJ1Y3R1cmVzIHtcbiAgY29uZmlybUNoZWNrID0gXCJjb25maXJtQ2hlY2tcIixcbiAgY29uZmlybVJldHJ5ID0gXCJjb25maXJtUmV0cnlcIixcbiAgb3ZlcmFsbEZlZWRiYWNrID0gXCJvdmVyYWxsRmVlZGJhY2tcIlxufVxuXG4vKipcbiAqIFByb3ZpZGVzIGxvY2FsaXphdGlvbiBzZXJ2aWNlcy5cbiAqL1xuXG5leHBvcnQgY2xhc3MgSDVQTG9jYWxpemF0aW9uIHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBoNXBDb25maWd1cmF0aW9uOiBhbnkpIHtcblxuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGxvY2FsaXplZCBzdHJpbmcgdGhhdCBpcyByZXByZXNlbnRlZCBieSB0aGUgaWRlbnRpZmllci5cbiAgICogQHBhcmFtICB7c3RyaW5nfSBsb2NhbGl6YWJsZVN0cmluZ0lkZW50aWZpZXJcbiAgICogQHJldHVybnMgc3RyaW5nXG4gICAqL1xuICBwcml2YXRlIGdldFRleHQobG9jYWxpemFibGVTdHJpbmdJZGVudGlmaWVyOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiB0aGlzLmg1cENvbmZpZ3VyYXRpb25bbG9jYWxpemFibGVTdHJpbmdJZGVudGlmaWVyXTtcbiAgfVxuXG4gIHByaXZhdGUgbGFiZWxUb1N0cmluZyhsYWJlbDogTG9jYWxpemF0aW9uTGFiZWxzKSB7XG4gICAgcmV0dXJuIGxhYmVsLnRvU3RyaW5nKCk7XG4gIH1cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGxvY2FsaXplZCBzdHJpbmcgZm9yIHRoZSBsYWJlbC5cbiAgICogQHBhcmFtICB7TG9jYWxpemF0aW9uTGFiZWxzfSBsYWJlbFxuICAgKiBAcmV0dXJucyBzdHJpbmdcbiAgICovXG4gIGdldFRleHRGcm9tTGFiZWwobGFiZWw6IExvY2FsaXphdGlvbkxhYmVscyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0VGV4dCh0aGlzLmxhYmVsVG9TdHJpbmcobGFiZWwpKTtcbiAgfVxuXG4gIGdldE9iamVjdEZvclN0cnVjdHVyZShzdHJ1Y3R1cmU6IExvY2FsaXphdGlvblN0cnVjdHVyZXMpIDogYW55IHtcbiAgICByZXR1cm4gdGhpcy5oNXBDb25maWd1cmF0aW9uW3N0cnVjdHVyZS50b1N0cmluZygpXTtcbiAgfVxufSIsImltcG9ydCB7IEJsYW5rIH0gZnJvbSAnLi4vbW9kZWxzL2JsYW5rJztcbmltcG9ydCB7IE1lc3NhZ2VUeXBlIH0gZnJvbSAnLi4vbW9kZWxzL2VudW1zJztcblxuZXhwb3J0IGNsYXNzIE1lc3NhZ2VTZXJ2aWNlIHtcbiAgcHJpdmF0ZSBzcGVlY2hCdWJibGU6IGFueTtcbiAgcHJpdmF0ZSBhc3NvY2lhdGVkQmxhbms6IEJsYW5rO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgalF1ZXJ5OiBKUXVlcnlTdGF0aWMpIHtcblxuICB9XG5cbiAgcHVibGljIHNob3coZWxlbWVudElkOiBzdHJpbmcsIG1lc3NhZ2U6IHN0cmluZywgYmxhbms6IEJsYW5rLCB0eXBlPzogTWVzc2FnZVR5cGUpIHtcbiAgICBpZiAoIXR5cGUpXG4gICAgICB0eXBlID0gTWVzc2FnZVR5cGUuTm9uZTtcblxuICAgIHZhciBlbGVtZW50cyA9IHRoaXMualF1ZXJ5KFwiI1wiICsgZWxlbWVudElkKTtcblxuICAgIGlmIChlbGVtZW50cy5sZW5ndGggPiAwKSB7XG4gICAgICB0aGlzLnNwZWVjaEJ1YmJsZSA9IG5ldyBINVAuSm91YmVsU3BlZWNoQnViYmxlKGVsZW1lbnRzLCBtZXNzYWdlKTtcbiAgICAgIHRoaXMuYXNzb2NpYXRlZEJsYW5rID0gYmxhbms7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGhpZGUoKSB7XG4gICAgaWYgKHRoaXMuc3BlZWNoQnViYmxlKSB7XG4gICAgICB0cnkge1xuICAgICAgICB0aGlzLnNwZWVjaEJ1YmJsZS5yZW1vdmUoKTtcbiAgICAgIH1cbiAgICAgIGNhdGNoIChleGNlcHRpb24pIHtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5zcGVlY2hCdWJibGUgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5hc3NvY2lhdGVkQmxhbmsgPSB1bmRlZmluZWQ7XG4gIH1cblxuICBwdWJsaWMgaXNBY3RpdmUoYmxhbms6IEJsYW5rKSB7XG4gICAgcmV0dXJuIHRoaXMuYXNzb2NpYXRlZEJsYW5rID09PSBibGFuaztcbiAgfVxufSIsImltcG9ydCB7IENsb3plVHlwZSwgU2VsZWN0QWx0ZXJuYXRpdmVzIH0gZnJvbSBcIi4uL21vZGVscy9lbnVtc1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIElTZXR0aW5ncyB7XG4gIGNsb3plVHlwZTogQ2xvemVUeXBlO1xuICBzZWxlY3RBbHRlcm5hdGl2ZXM6IFNlbGVjdEFsdGVybmF0aXZlcztcbiAgc2VsZWN0QWx0ZXJuYXRpdmVSZXN0cmljdGlvbjogbnVtYmVyO1xuICBlbmFibGVSZXRyeTogYm9vbGVhbjtcbiAgZW5hYmxlU29sdXRpb25zQnV0dG9uOiBib29sZWFuO1xuICBlbmFibGVDaGVja0J1dHRvbjogYm9vbGVhbjtcbiAgYXV0b0NoZWNrOiBib29sZWFuO1xuICBjYXNlU2Vuc2l0aXZlOiBib29sZWFuO1xuICB3YXJuU3BlbGxpbmdFcnJvcnM6IGJvb2xlYW47XG4gIGFjY2VwdFNwZWxsaW5nRXJyb3JzOiBib29sZWFuO1xuICBzaG93U29sdXRpb25zUmVxdWlyZXNJbnB1dDogYm9vbGVhbjtcbiAgY29uZmlybUNoZWNrRGlhbG9nOiBib29sZWFuO1xuICBjb25maXJtUmV0cnlEaWFsb2c6IGJvb2xlYW47XG4gIGRpc2FibGVJbWFnZVpvb21pbmc6IGJvb2xlYW47XG59XG5cbmV4cG9ydCBjbGFzcyBINVBTZXR0aW5ncyBpbXBsZW1lbnRzIElTZXR0aW5ncyB7XG4gIHB1YmxpYyBjbG96ZVR5cGU6IENsb3plVHlwZSA9IENsb3plVHlwZS5UeXBlO1xuICBwdWJsaWMgc2VsZWN0QWx0ZXJuYXRpdmVzOiBTZWxlY3RBbHRlcm5hdGl2ZXMgPSBTZWxlY3RBbHRlcm5hdGl2ZXMuQWx0ZXJuYXRpdmVzO1xuICBwdWJsaWMgc2VsZWN0QWx0ZXJuYXRpdmVSZXN0cmljdGlvbjogbnVtYmVyID0gNTtcbiAgcHVibGljIGVuYWJsZVJldHJ5OiBib29sZWFuID0gdHJ1ZTtcbiAgcHVibGljIGVuYWJsZVNvbHV0aW9uc0J1dHRvbjogYm9vbGVhbiA9IHRydWU7XG4gIHB1YmxpYyBlbmFibGVDaGVja0J1dHRvbjogYm9vbGVhbiA9IHRydWU7XG4gIHB1YmxpYyBhdXRvQ2hlY2s6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHVibGljIGNhc2VTZW5zaXRpdmU6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHVibGljIHdhcm5TcGVsbGluZ0Vycm9yczogYm9vbGVhbiA9IHRydWU7XG4gIHB1YmxpYyBhY2NlcHRTcGVsbGluZ0Vycm9yczogYm9vbGVhbiA9IGZhbHNlO1xuICBwdWJsaWMgc2hvd1NvbHV0aW9uc1JlcXVpcmVzSW5wdXQ6IGJvb2xlYW4gPSB0cnVlO1xuICBwdWJsaWMgY29uZmlybUNoZWNrRGlhbG9nOiBib29sZWFuID0gZmFsc2U7XG4gIHB1YmxpYyBjb25maXJtUmV0cnlEaWFsb2c6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHVibGljIGRpc2FibGVJbWFnZVpvb21pbmc6IGJvb2xlYW4gPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihoNXBDb25maWdEYXRhOiBhbnkpIHtcbiAgICBpZiAoaDVwQ29uZmlnRGF0YS5iZWhhdmlvdXIubW9kZSA9PT0gJ3NlbGVjdGlvbicpIHtcbiAgICAgIHRoaXMuY2xvemVUeXBlID0gQ2xvemVUeXBlLlNlbGVjdDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICB0aGlzLmNsb3plVHlwZSA9IENsb3plVHlwZS5UeXBlO1xuICAgIH1cblxuICAgIGlmIChoNXBDb25maWdEYXRhLmJlaGF2aW91ci5zZWxlY3RBbHRlcm5hdGl2ZXMgPT09ICdhbGwnKSB7XG4gICAgICB0aGlzLnNlbGVjdEFsdGVybmF0aXZlcyA9IFNlbGVjdEFsdGVybmF0aXZlcy5BbGw7XG4gICAgfSBlbHNlIGlmIChoNXBDb25maWdEYXRhLmJlaGF2aW91ci5zZWxlY3RBbHRlcm5hdGl2ZXMgPT09ICdhbHRlcm5hdGl2ZXMnKSB7XG4gICAgICB0aGlzLnNlbGVjdEFsdGVybmF0aXZlcyA9IFNlbGVjdEFsdGVybmF0aXZlcy5BbHRlcm5hdGl2ZXM7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgdGhpcy5zZWxlY3RBbHRlcm5hdGl2ZXMgPSBTZWxlY3RBbHRlcm5hdGl2ZXMuQWxsO1xuICAgIH1cblxuICAgIHRoaXMuc2VsZWN0QWx0ZXJuYXRpdmVSZXN0cmljdGlvbiA9IGg1cENvbmZpZ0RhdGEuYmVoYXZpb3VyLnNlbGVjdEFsdGVybmF0aXZlUmVzdHJpY3Rpb247XG4gICAgdGhpcy5lbmFibGVSZXRyeSA9IGg1cENvbmZpZ0RhdGEuYmVoYXZpb3VyLmVuYWJsZVJldHJ5O1xuICAgIHRoaXMuZW5hYmxlU29sdXRpb25zQnV0dG9uID0gaDVwQ29uZmlnRGF0YS5iZWhhdmlvdXIuZW5hYmxlU29sdXRpb25zQnV0dG9uO1xuICAgIHRoaXMuZW5hYmxlQ2hlY2tCdXR0b24gPSBoNXBDb25maWdEYXRhLmJlaGF2aW91ci5lbmFibGVDaGVja0J1dHRvbjtcbiAgICB0aGlzLmF1dG9DaGVjayA9IGg1cENvbmZpZ0RhdGEuYmVoYXZpb3VyLmF1dG9DaGVjaztcbiAgICB0aGlzLmNhc2VTZW5zaXRpdmUgPSBoNXBDb25maWdEYXRhLmJlaGF2aW91ci5jYXNlU2Vuc2l0aXZlO1xuICAgIHRoaXMud2FyblNwZWxsaW5nRXJyb3JzID0gaDVwQ29uZmlnRGF0YS5iZWhhdmlvdXIuc3BlbGxpbmdFcnJvckJlaGF2aW91ciA9PT0gXCJ3YXJuXCI7XG4gICAgdGhpcy5hY2NlcHRTcGVsbGluZ0Vycm9ycyA9IGg1cENvbmZpZ0RhdGEuYmVoYXZpb3VyLnNwZWxsaW5nRXJyb3JCZWhhdmlvdXIgPT09IFwiYWNjZXB0XCI7XG4gICAgdGhpcy5zaG93U29sdXRpb25zUmVxdWlyZXNJbnB1dCA9IGg1cENvbmZpZ0RhdGEuYmVoYXZpb3VyLnNob3dTb2x1dGlvbnNSZXF1aXJlc0lucHV0O1xuICAgIHRoaXMuY29uZmlybUNoZWNrRGlhbG9nID0gaDVwQ29uZmlnRGF0YS5iZWhhdmlvdXIuY29uZmlybUNoZWNrRGlhbG9nO1xuICAgIHRoaXMuY29uZmlybVJldHJ5RGlhbG9nID0gaDVwQ29uZmlnRGF0YS5iZWhhdmlvdXIuY29uZmlybVJldHJ5RGlhbG9nO1xuICAgIHRoaXMuZGlzYWJsZUltYWdlWm9vbWluZyA9IGg1cENvbmZpZ0RhdGEuYmVoYXZpb3VyLmRpc2FibGVJbWFnZVpvb21pbmc7XG5cbiAgICB0aGlzLmVuZm9yY2VMb2dpYygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFRoaXMgbWV0aG9kIHNldHMgc2Vuc2libGUgZGVmYXVsdCB2YWx1ZXMgZm9yIHNldHRpbmdzIGhpZGRlbiB3aXRoIHNob3dXaGVuXG4gICAqL1xuICBwcml2YXRlIGVuZm9yY2VMb2dpYygpIHtcbiAgICBpZiAodGhpcy5jbG96ZVR5cGUgPT09IENsb3plVHlwZS5UeXBlKSB7XG4gICAgICB0aGlzLnNlbGVjdEFsdGVybmF0aXZlcyA9IFNlbGVjdEFsdGVybmF0aXZlcy5BbGw7XG4gICAgICB0aGlzLnNlbGVjdEFsdGVybmF0aXZlUmVzdHJpY3Rpb24gPSAwO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5zZWxlY3RBbHRlcm5hdGl2ZVJlc3RyaWN0aW9uID09PSBTZWxlY3RBbHRlcm5hdGl2ZXMuQWx0ZXJuYXRpdmVzKSB7XG4gICAgICAgIHRoaXMuc2VsZWN0QWx0ZXJuYXRpdmVSZXN0cmljdGlvbiA9IDA7XG4gICAgICB9XG4gICAgICB0aGlzLndhcm5TcGVsbGluZ0Vycm9ycyA9IGZhbHNlO1xuICAgICAgdGhpcy5hY2NlcHRTcGVsbGluZ0Vycm9ycyA9IGZhbHNlO1xuICAgICAgdGhpcy5jYXNlU2Vuc2l0aXZlID0gZmFsc2U7XG4gICAgfVxuICB9XG59IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiBtb2R1bGVbJ2RlZmF1bHQnXSA6XG5cdFx0KCkgPT4gbW9kdWxlO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZVxuX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2VudHJpZXMvZGlzdC50c1wiKTtcbi8vIFRoaXMgZW50cnkgbW9kdWxlIHVzZWQgJ2V4cG9ydHMnIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbiJdLCJzb3VyY2VSb290IjoiIn0=