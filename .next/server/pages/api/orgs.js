(function() {
var exports = {};
exports.id = 1050;
exports.ids = [1050];
exports.modules = {

/***/ 2013:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var next_connect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9303);
/* harmony import */ var next_connect__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_connect__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var database__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9163);
/* harmony import */ var utils_errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8177);
/* harmony import */ var hooks_useAuth__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8238);
/* harmony import */ var utils_string__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(7535);
/* harmony import */ var models_Org__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9759);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }







const handler = next_connect__WEBPACK_IMPORTED_MODULE_0___default()();
handler.use(database__WEBPACK_IMPORTED_MODULE_1__/* .default */ .ZP);
handler.get(async function getOrgs(req, res) {
  try {
    const {
      query: {
        populate,
        createdBy
      }
    } = req;
    let orgs;
    let select = createdBy ? {
      createdBy
    } : {
      orgVisibility: models_Org__WEBPACK_IMPORTED_MODULE_4__/* .Visibility */ .EE[models_Org__WEBPACK_IMPORTED_MODULE_4__/* .Visibility.PUBLIC */ .EE.PUBLIC]
    };

    if (populate) {
      orgs = await database__WEBPACK_IMPORTED_MODULE_1__/* .models.Org.find */ .Cq.Org.find(select, {
        orgBanner: 0
      }).populate(populate);
    } else {
      orgs = await database__WEBPACK_IMPORTED_MODULE_1__/* .models.Org.find */ .Cq.Org.find(select, {
        orgBanner: 0
      });
    }

    res.status(200).json(orgs);
  } catch (error) {
    res.status(500).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_2__/* .createServerError */ .Eh)(error));
  }
});
handler.post(async function postOrg(req, res) {
  const session = await (0,hooks_useAuth__WEBPACK_IMPORTED_MODULE_3__/* .getSession */ .G)({
    req
  });

  if (!session) {
    res.status(403).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_2__/* .createServerError */ .Eh)(new Error("Vous devez être identifié pour accéder à ce contenu")));
  } else {
    try {
      let {
        body
      } = req;
      body = _objectSpread(_objectSpread({}, body), {}, {
        orgName: body.orgName.trim()
      });
      const orgUrl = (0,utils_string__WEBPACK_IMPORTED_MODULE_5__/* .normalize */ .Fv)(body.orgName);
      const org = await database__WEBPACK_IMPORTED_MODULE_1__/* .models.Org.findOne */ .Cq.Org.findOne({
        orgUrl
      });
      if (org) throw utils_errors__WEBPACK_IMPORTED_MODULE_2__/* .duplicateError */ .b$;
      const user = await database__WEBPACK_IMPORTED_MODULE_1__/* .models.User.findOne */ .Cq.User.findOne({
        userName: body.orgName
      });
      if (user) throw utils_errors__WEBPACK_IMPORTED_MODULE_2__/* .duplicateError */ .b$;
      const event = await database__WEBPACK_IMPORTED_MODULE_1__/* .models.Event.findOne */ .Cq.Event.findOne({
        eventUrl: orgUrl
      });
      if (event) throw utils_errors__WEBPACK_IMPORTED_MODULE_2__/* .duplicateError */ .b$;
      const doc = await database__WEBPACK_IMPORTED_MODULE_1__/* .models.Org.create */ .Cq.Org.create(_objectSpread(_objectSpread({}, req.body), {}, {
        orgUrl,
        isApproved: false
      }));
      res.status(200).json(doc);
    } catch (error) {
      if (error.code && error.code === utils_errors__WEBPACK_IMPORTED_MODULE_2__/* .databaseErrorCodes.DUPLICATE_KEY */ .MM.DUPLICATE_KEY) {
        res.status(400).json({
          orgName: "Ce nom n'est pas disponible"
        });
      } else {
        res.status(500).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_2__/* .createServerError */ .Eh)(error));
      }
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
var __webpack_require__ = require("../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
var __webpack_exports__ = __webpack_require__.X(0, [8716,9163,8177,6837,4281,8238], function() { return __webpack_exec__(2013); });
module.exports = __webpack_exports__;

})();