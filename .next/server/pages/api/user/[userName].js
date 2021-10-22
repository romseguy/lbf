(function() {
var exports = {};
exports.id = 3425;
exports.ids = [3425];
exports.modules = {

/***/ 3066:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var next_connect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9303);
/* harmony import */ var next_connect__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_connect__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var database__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9163);
/* harmony import */ var utils_errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8177);
/* harmony import */ var hooks_useAuth__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8238);
/* harmony import */ var utils_string__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(7535);
/* harmony import */ var utils_email__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9281);






const handler = next_connect__WEBPACK_IMPORTED_MODULE_0___default()();
handler.use(database__WEBPACK_IMPORTED_MODULE_1__/* .default */ .ZP);
handler.get(async function getUser(req, res) {
  const {
    query: {
      userName
    }
  } = req;
  let user = null;
  let selector;

  try {
    if (utils_email__WEBPACK_IMPORTED_MODULE_4__/* .emailR.test */ .GN.test(userName)) {
      selector = {
        email: userName
      };
    } else if (utils_string__WEBPACK_IMPORTED_MODULE_5__/* .phoneR.test */ .S9.test(userName)) {
      selector = {
        phone: userName
      };
    }

    if (selector) {
      user = await database__WEBPACK_IMPORTED_MODULE_1__/* .models.User.findOne */ .Cq.User.findOne(selector);
    } else {
      user = await database__WEBPACK_IMPORTED_MODULE_1__/* .models.User.findOne */ .Cq.User.findOne({
        userName
      });
      if (!user) user = await database__WEBPACK_IMPORTED_MODULE_1__/* .models.User.findOne */ .Cq.User.findOne({
        _id: userName
      });
    }

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_2__/* .createServerError */ .Eh)(new Error(`L'utilisateur ${userName} n'a pas pu être trouvé`)));
    }
  } catch (error) {
    res.status(500).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_2__/* .createServerError */ .Eh)(error));
  }
});
handler.put(async function editUser(req, res) {
  const session = await (0,hooks_useAuth__WEBPACK_IMPORTED_MODULE_3__/* .getSession */ .G)({
    req
  });

  if (!session) {
    res.status(403).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_2__/* .createServerError */ .Eh)(new Error("Vous devez être identifié pour accéder à ce contenu")));
  } else {
    try {
      const {
        query: {
          userName
        },
        body
      } = req;

      if (body.userName) {
        body.userName = (0,utils_string__WEBPACK_IMPORTED_MODULE_5__/* .normalize */ .Fv)(body.userName);
        const user = await database__WEBPACK_IMPORTED_MODULE_1__/* .models.User.findOne */ .Cq.User.findOne({
          userName: body.userName
        });

        if (user) {
          throw utils_errors__WEBPACK_IMPORTED_MODULE_2__/* .duplicateError */ .b$;
        }
      }

      const {
        n,
        nModified
      } = await database__WEBPACK_IMPORTED_MODULE_1__/* .models.User.updateOne */ .Cq.User.updateOne({
        userName
      }, body);

      if (nModified === 1) {
        res.status(200).json({});
      } else {
        const {
          n,
          nModified
        } = await database__WEBPACK_IMPORTED_MODULE_1__/* .models.User.updateOne */ .Cq.User.updateOne({
          _id: userName
        }, body);

        if (nModified === 1) {
          res.status(200).json({});
        } else {
          res.status(400).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_2__/* .createServerError */ .Eh)(new Error(`L'utilisateur ${userName} n'a pas pu être modifié`)));
        }
      }
    } catch (error) {
      if (error.code && error.code === utils_errors__WEBPACK_IMPORTED_MODULE_2__/* .databaseErrorCodes.DUPLICATE_KEY */ .MM.DUPLICATE_KEY) {
        res.status(400).json({
          userName: "Ce nom d'utilisateur n'est pas disponible"
        });
      } else {
        res.status(500).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_2__/* .createServerError */ .Eh)(error));
      }
    }
  }
});
/* harmony default export */ __webpack_exports__["default"] = (handler);

/***/ }),

/***/ 3724:
/***/ (function(module) {

"use strict";
module.exports = require("@chakra-ui/icons");;

/***/ }),

/***/ 3426:
/***/ (function(module) {

"use strict";
module.exports = require("@chakra-ui/react");;

/***/ }),

/***/ 7381:
/***/ (function(module) {

"use strict";
module.exports = require("@emotion/react");;

/***/ }),

/***/ 4617:
/***/ (function(module) {

"use strict";
module.exports = require("@emotion/styled/base");;

/***/ }),

/***/ 5228:
/***/ (function(module) {

"use strict";
module.exports = require("@hookform/error-message");;

/***/ }),

/***/ 2077:
/***/ (function(module) {

"use strict";
module.exports = require("@react-icons/all-files/fa/FaHeart.js");;

/***/ }),

/***/ 1631:
/***/ (function(module) {

"use strict";
module.exports = require("@react-icons/all-files/fa/FaMapMarkedAlt.js");;

/***/ }),

/***/ 1899:
/***/ (function(module) {

"use strict";
module.exports = require("@react-icons/all-files/fa/FaMoon.js");;

/***/ }),

/***/ 739:
/***/ (function(module) {

"use strict";
module.exports = require("@react-icons/all-files/fa/FaSun.js");;

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

/***/ 2376:
/***/ (function(module) {

"use strict";
module.exports = require("axios");;

/***/ }),

/***/ 2773:
/***/ (function(module) {

"use strict";
module.exports = require("bcryptjs");;

/***/ }),

/***/ 3879:
/***/ (function(module) {

"use strict";
module.exports = require("date-fns");;

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

/***/ 8417:
/***/ (function(module) {

"use strict";
module.exports = require("next/dist/next-server/lib/router-context.js");;

/***/ }),

/***/ 2238:
/***/ (function(module) {

"use strict";
module.exports = require("next/dist/next-server/lib/router/utils/get-asset-path-from-route.js");;

/***/ }),

/***/ 1191:
/***/ (function(module) {

"use strict";
module.exports = require("querystring");;

/***/ }),

/***/ 3149:
/***/ (function(module) {

"use strict";
module.exports = require("quill");;

/***/ }),

/***/ 4404:
/***/ (function(module) {

"use strict";
module.exports = require("quill-auto-links");;

/***/ }),

/***/ 4657:
/***/ (function(module) {

"use strict";
module.exports = require("quill-delta-to-html");;

/***/ }),

/***/ 9297:
/***/ (function(module) {

"use strict";
module.exports = require("react");;

/***/ }),

/***/ 62:
/***/ (function(module) {

"use strict";
module.exports = require("react-cool-onclickoutside");;

/***/ }),

/***/ 9008:
/***/ (function(module) {

"use strict";
module.exports = require("react-datepicker");;

/***/ }),

/***/ 2047:
/***/ (function(module) {

"use strict";
module.exports = require("react-device-detect");;

/***/ }),

/***/ 2662:
/***/ (function(module) {

"use strict";
module.exports = require("react-hook-form");;

/***/ }),

/***/ 6199:
/***/ (function(module) {

"use strict";
module.exports = require("react-quilljs");;

/***/ }),

/***/ 79:
/***/ (function(module) {

"use strict";
module.exports = require("react-redux");;

/***/ }),

/***/ 7405:
/***/ (function(module) {

"use strict";
module.exports = require("react-toggle");;

/***/ }),

/***/ 632:
/***/ (function(module) {

"use strict";
module.exports = require("use-places-autocomplete");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
var __webpack_exports__ = __webpack_require__.X(0, [1664,5328,8716,9163,8177,6837,4281,8238,3831], function() { return __webpack_exec__(3066); });
module.exports = __webpack_exports__;

})();