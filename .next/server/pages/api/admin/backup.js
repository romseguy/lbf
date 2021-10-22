(function() {
var exports = {};
exports.id = 9466;
exports.ids = [9466];
exports.modules = {

/***/ 5856:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var next_connect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9303);
/* harmony import */ var next_connect__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_connect__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var database__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9163);
/* harmony import */ var utils_errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8177);
/* harmony import */ var hooks_useAuth__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8238);




const handler = next_connect__WEBPACK_IMPORTED_MODULE_0___default()();
handler.use(database__WEBPACK_IMPORTED_MODULE_1__/* .default */ .ZP);
handler.get(async function exportData(req, res) {
  const session = await (0,hooks_useAuth__WEBPACK_IMPORTED_MODULE_3__/* .getSession */ .G)({
    req
  });

  if (!session) {
    res.status(403).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_2__/* .createServerError */ .Eh)(new Error("Vous devez être identifié pour accéder à ce contenu.")));
  } else if (!session.user.isAdmin) {
    res.status(403).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_2__/* .createServerError */ .Eh)(new Error("Vous devez être administrateur pour accéder à ce contenu.")));
  } else {
    try {
      const data = {};
      const keys = Object.keys(database__WEBPACK_IMPORTED_MODULE_1__/* .models */ .Cq);

      for (const key of keys) {
        if (key === "User") continue;
        const model = database__WEBPACK_IMPORTED_MODULE_1__/* .models */ .Cq[key];
        data[key] = await model.find({});
      }

      res.status(200).json({
        data
      });
    } catch (error) {
      res.status(500).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_2__/* .createServerError */ .Eh)(error));
    }
  }
});
handler.post(async function importData(req, res) {
  const session = await (0,hooks_useAuth__WEBPACK_IMPORTED_MODULE_3__/* .getSession */ .G)({
    req
  });

  if (!session) {
    res.status(403).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_2__/* .createServerError */ .Eh)(new Error("Vous devez être identifié pour accéder à ce contenu.")));
  } else if (!session.user.isAdmin) {
    res.status(403).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_2__/* .createServerError */ .Eh)(new Error("Vous devez être administrateur pour accéder à ce contenu.")));
  } else {
    try {
      const body = JSON.parse(req.body);
      const keys = Object.keys(database__WEBPACK_IMPORTED_MODULE_1__/* .models */ .Cq);

      for (const key of keys) {
        if (key === "User") continue;
        if (!body.data[key]) continue;
        const model = database__WEBPACK_IMPORTED_MODULE_1__/* .models */ .Cq[key];
        model.collection.remove({});

        for (const o of body.data[key]) {
          model.create(o);
        }
      }

      res.status(200).json({});
    } catch (error) {
      res.status(400).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_2__/* .createServerError */ .Eh)(error));
    }
  }
});
/* harmony default export */ __webpack_exports__["default"] = (handler);

/***/ }),

/***/ 6139:
/***/ (function(module) {

"use strict";
module.exports = require("@reduxjs/toolkit");;

/***/ }),

/***/ 5641:
/***/ (function(module) {

"use strict";
module.exports = require("@reduxjs/toolkit/query/react");;

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

/***/ 8104:
/***/ (function(module) {

"use strict";
module.exports = require("next-auth/client");;

/***/ }),

/***/ 9303:
/***/ (function(module) {

"use strict";
module.exports = require("next-connect");;

/***/ }),

/***/ 2744:
/***/ (function(module) {

"use strict";
module.exports = require("next-redux-wrapper");;

/***/ }),

/***/ 1191:
/***/ (function(module) {

"use strict";
module.exports = require("querystring");;

/***/ }),

/***/ 79:
/***/ (function(module) {

"use strict";
module.exports = require("react-redux");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
var __webpack_exports__ = __webpack_require__.X(0, [8716,9163,8177,6837,4281,8238], function() { return __webpack_exec__(5856); });
module.exports = __webpack_exports__;

})();