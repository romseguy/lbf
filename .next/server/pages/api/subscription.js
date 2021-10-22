(function() {
var exports = {};
exports.id = 4775;
exports.ids = [4775];
exports.modules = {

/***/ 472:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var next_connect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9303);
/* harmony import */ var next_connect__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_connect__WEBPACK_IMPORTED_MODULE_0__);

const handler = next_connect__WEBPACK_IMPORTED_MODULE_0___default()();
handler.get(async function getNothing(req, res) {
  return res.status(400).json({});
});
/* harmony default export */ __webpack_exports__["default"] = (handler);

/***/ }),

/***/ 9303:
/***/ (function(module) {

"use strict";
module.exports = require("next-connect");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
var __webpack_exports__ = (__webpack_exec__(472));
module.exports = __webpack_exports__;

})();