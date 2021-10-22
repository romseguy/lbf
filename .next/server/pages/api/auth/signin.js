(function() {
var exports = {};
exports.id = 4964;
exports.ids = [4964];
exports.modules = {

/***/ 1597:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var next_connect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9303);
/* harmony import */ var next_connect__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_connect__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var database__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9163);
/* harmony import */ var utils_errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8177);



const handler = next_connect__WEBPACK_IMPORTED_MODULE_0___default()();
handler.use(database__WEBPACK_IMPORTED_MODULE_1__/* .default */ .ZP);
handler.get(async function redirectToHomePage(req, res) {
  res.redirect("/");
});
handler.post(async function signin(req, res) {
  const {
    body: {
      email,
      password
    }
  } = req;

  try {
    const user = await database__WEBPACK_IMPORTED_MODULE_1__/* .models.User.findOne */ .Cq.User.findOne({
      email: email.toLowerCase()
    });

    if (!user) {
      res.status(403).json({
        email: "Cette adresse e-mail ne correspond à aucun compte"
      });
      return;
    }

    const isValid = await user.validatePassword(password);

    if (!isValid) {
      res.status(403).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_2__/* .createServerError */ .Eh)(new Error("La tentative de connexion a échouée")));
    } else {
      user.isOnline = true;
      await user.save();
      res.status(200).json(user);
    }
  } catch (error) {
    res.status(500).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_2__/* .createServerError */ .Eh)(error));
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
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
var __webpack_exports__ = __webpack_require__.X(0, [8716,9163,8177], function() { return __webpack_exec__(1597); });
module.exports = __webpack_exports__;

})();