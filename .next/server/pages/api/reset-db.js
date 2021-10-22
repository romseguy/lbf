(function() {
var exports = {};
exports.id = 2239;
exports.ids = [2239];
exports.modules = {

/***/ 6436:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var next_connect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9303);
/* harmony import */ var next_connect__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_connect__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var database__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9163);


const handler = next_connect__WEBPACK_IMPORTED_MODULE_0___default()();
handler.use(database__WEBPACK_IMPORTED_MODULE_1__/* .default */ .ZP);
handler.get(async function resetDb(req, res) {
  if (!process.env.NEXT_PUBLIC_IS_TEST) {
    res.status(404).send("Not Found");
    return;
  }

  try {
    await Promise.all([database__WEBPACK_IMPORTED_MODULE_1__.db.dropCollection("events"), database__WEBPACK_IMPORTED_MODULE_1__.db.dropCollection("orgs"), database__WEBPACK_IMPORTED_MODULE_1__.db.dropCollection("subscriptions"), database__WEBPACK_IMPORTED_MODULE_1__.db.dropCollection("topics")]);
    res.status(200).send("Database reset");
  } catch (error) {
    res.status(200).send("Database already reset");
  }
});
/* harmony default export */ __webpack_exports__["default"] = (handler);

/***/ }),

/***/ 2773:
/***/ (function(module) {

"use strict";
module.exports = require("bcryptjs");;

/***/ }),

/***/ 5619:
/***/ (function(module) {

"use strict";
module.exports = require("mongoose");;

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
var __webpack_exports__ = __webpack_require__.X(0, [8716,9163], function() { return __webpack_exec__(6436); });
module.exports = __webpack_exports__;

})();