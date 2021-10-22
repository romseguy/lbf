(function() {
var exports = {};
exports.id = 3973;
exports.ids = [3973];
exports.modules = {

/***/ 1460:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ forgotten; }
});

// EXTERNAL MODULE: external "nodemailer"
var external_nodemailer_ = __webpack_require__(8123);
var external_nodemailer_default = /*#__PURE__*/__webpack_require__.n(external_nodemailer_);
// EXTERNAL MODULE: external "nodemailer-sendgrid"
var external_nodemailer_sendgrid_ = __webpack_require__(9619);
var external_nodemailer_sendgrid_default = /*#__PURE__*/__webpack_require__.n(external_nodemailer_sendgrid_);
// EXTERNAL MODULE: external "next-connect"
var external_next_connect_ = __webpack_require__(9303);
var external_next_connect_default = /*#__PURE__*/__webpack_require__.n(external_next_connect_);
// EXTERNAL MODULE: ./src/database.ts + 1 modules
var database = __webpack_require__(9163);
// EXTERNAL MODULE: ./src/utils/errors.ts
var errors = __webpack_require__(8177);
// EXTERNAL MODULE: ./src/utils/email.ts
var utils_email = __webpack_require__(9281);
;// CONCATENATED MODULE: external "@nastyox/rando.js"
var rando_js_namespaceObject = require("@nastyox/rando.js");;
;// CONCATENATED MODULE: ./src/utils/randomNumber.ts
//@ts-nocheck

const r = rando_js_namespaceObject.rando;
const randomNumber = maxNumber => {
  let randomNumberString;

  switch (maxNumber) {
    case 1:
      randomNumberString = r(1, 9).toString();
      break;

    case 2:
      randomNumberString = r(10, 90).toString();
      break;

    case 3:
      randomNumberString = r(100, 900).toString();
      break;

    case 4:
      randomNumberString = r(1000, 9000).toString();
      break;

    case 5:
      randomNumberString = r(10000, 90000).toString();
      break;

    case 6:
      randomNumberString = r(100000, 900000).toString();
      break;

    default:
      randomNumberString = "";
      break;
  }

  return randomNumberString;
};
;// CONCATENATED MODULE: ./src/pages/api/auth/forgotten.ts







const transport = external_nodemailer_default().createTransport(external_nodemailer_sendgrid_default()({
  apiKey: process.env.EMAIL_API_KEY
}));
const handler = external_next_connect_default()();
handler.use(database/* default */.ZP);
handler.post(async function forgotten(req, res) {
  const {
    body: {
      email,
      password
    }
  } = req;

  try {
    if (utils_email/* emailR.test */.GN.test(email)) {
      if (password) {
        const {
          n,
          nModified
        } = await database/* models.User.updateOne */.Cq.User.updateOne({
          email
        }, {
          password
        });

        if (nModified === 1) {
          res.status(200).json({});
        } else {
          res.status(400).json((0,errors/* createServerError */.Eh)(new Error("Le mot de passe n'a pas pu être modifié")));
        }
      } else {
        const securityCode = randomNumber(6);
        const {
          n,
          nModified
        } = await database/* models.User.updateOne */.Cq.User.updateOne({
          email
        }, {
          securityCode
        });

        if (nModified === 1) {
          const mail = {
            from: process.env.EMAIL_FROM,
            to: `<${email}>`,
            subject: `${securityCode} est votre code de sécurité ${"aucourant.de"}`,
            html: `<h1>Votre demande de réinitialisation de mot de passe</h1>Afin de réinitialiser votre mot de passse, veuillez saisir le code de sécurité suivant : ${securityCode}`
          };
          if (true) await transport.sendMail(mail);else {}
          res.status(200).json(securityCode);
        } else {
          res.status(400).json((0,errors/* createServerError */.Eh)(new Error("Cette adresse e-mail ne correspond à aucun compte")));
        }
      }
    } else {
      res.status(400).json({
        email: "Cette adresse e-mail est invalide"
      });
    }
  } catch (error) {
    res.status(500).json((0,errors/* createServerError */.Eh)(error));
  }
});
/* harmony default export */ var forgotten = (handler);

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

/***/ 9303:
/***/ (function(module) {

"use strict";
module.exports = require("next-connect");;

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

/***/ 8123:
/***/ (function(module) {

"use strict";
module.exports = require("nodemailer");;

/***/ }),

/***/ 9619:
/***/ (function(module) {

"use strict";
module.exports = require("nodemailer-sendgrid");;

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
var __webpack_exports__ = __webpack_require__.X(0, [1664,5328,8716,9163,8177,6837,3831], function() { return __webpack_exec__(1460); });
module.exports = __webpack_exports__;

})();