(function() {
var exports = {};
exports.id = 4820;
exports.ids = [4820];
exports.modules = {

/***/ 6336:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _emotion_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7381);
/* harmony import */ var _emotion_react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_emotion_react__WEBPACK_IMPORTED_MODULE_0__);


function Error({
  statusCode
}) {
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", null, statusCode ? `An error ${statusCode} occurred on server` : "An error occurred on client");
}

Error.getInitialProps = ctx => {
  const {
    res,
    err
  } = ctx;
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return {
    statusCode
  };
};

/* harmony default export */ __webpack_exports__["default"] = (Error);

/***/ }),

/***/ 7381:
/***/ (function(module) {

"use strict";
module.exports = require("@emotion/react");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
var __webpack_exports__ = (__webpack_exec__(6336));
module.exports = __webpack_exports__;

})();