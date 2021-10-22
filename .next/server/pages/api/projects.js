(function() {
var exports = {};
exports.id = 4646;
exports.ids = [4646];
exports.modules = {

/***/ 4615:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var nodemailer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8123);
/* harmony import */ var nodemailer__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(nodemailer__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var nodemailer_sendgrid__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9619);
/* harmony import */ var nodemailer_sendgrid__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(nodemailer_sendgrid__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var next_connect__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9303);
/* harmony import */ var next_connect__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(next_connect__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var database__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9163);
/* harmony import */ var utils_errors__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(8177);
/* harmony import */ var hooks_useAuth__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(8238);
/* harmony import */ var utils_email__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(9281);
/* harmony import */ var models_Project__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(2728);
/* harmony import */ var utils_api__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(6837);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }










const transport = nodemailer__WEBPACK_IMPORTED_MODULE_0___default().createTransport(nodemailer_sendgrid__WEBPACK_IMPORTED_MODULE_1___default()({
  apiKey: process.env.EMAIL_API_KEY
}));
const handler = next_connect__WEBPACK_IMPORTED_MODULE_2___default()();
handler.use(database__WEBPACK_IMPORTED_MODULE_3__/* .default */ .ZP);
handler.get(async function getProjects(req, res) {
  try {
    const {
      query: {
        populate
      }
    } = req;
    let projects;

    if (populate) {
      projects = await database__WEBPACK_IMPORTED_MODULE_3__/* .models.Project.find */ .Cq.Project.find({}).populate(populate);
    } else {
      projects = await database__WEBPACK_IMPORTED_MODULE_3__/* .models.Project.find */ .Cq.Project.find({});
    }

    for (const project of projects) {
      if (project.forwardedFrom.projectId) {
        const e = await database__WEBPACK_IMPORTED_MODULE_3__/* .models.Project.findOne */ .Cq.Project.findOne({
          _id: project.forwardedFrom.projectId
        });

        if (e) {
          project.projectName = e.projectName;
        }
      }
    }

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_4__/* .createServerError */ .Eh)(error));
  }
});
handler.post(async function postProject(req, res) {
  const session = await (0,hooks_useAuth__WEBPACK_IMPORTED_MODULE_5__/* .getSession */ .G)({
    req
  });

  if (!session) {
    res.status(403).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_4__/* .createServerError */ .Eh)(new Error("Vous devez être identifié pour accéder à ce contenu")));
  } else {
    try {
      var _project;

      const {
        body
      } = req;
      let project;
      let projectOrgs = body.projectOrgs; // if (body.forwardedFrom) {
      //   project = await models.Project.findOne({ projectName });
      //   if (!project)
      //     return res
      //       .status(404)
      //       .json(
      //         createServerError(
      //           new Error(`Le projet ${projectName} n'a pas pu être trouvé`)
      //         )
      //       );
      //   for (const projectOrg of body.projectOrgs) {
      //     const o = await models.Org.findOne({ _id: projectOrg._id }).populate(
      //       "orgProjects"
      //     );
      //     if (o) {
      //       if (
      //         !o.orgProjects.find((orgProject) =>
      //           equals(orgProject._id, project!._id)
      //         )
      //       ) {
      //         projectOrgs.push(o._id);
      //       }
      //     }
      //   }
      //   if (projectOrgs.length > 0) {
      //     if (project) {
      //       console.log(
      //         "project has been forwarded once, update it with new orgs"
      //       );
      //     } else {
      //       project = await models.Project.create({
      //         ...body,
      //         projectOrgs
      //       });
      //     }
      //   }
      // } else {

      project = await database__WEBPACK_IMPORTED_MODULE_3__/* .models.Project.create */ .Cq.Project.create(_objectSpread({}, body)); //}

      await database__WEBPACK_IMPORTED_MODULE_3__/* .models.Org.updateMany */ .Cq.Org.updateMany({
        _id: projectOrgs
      }, {
        $push: {
          orgProjects: (_project = project) === null || _project === void 0 ? void 0 : _project._id
        }
      });
      const admin = await database__WEBPACK_IMPORTED_MODULE_3__/* .models.User.findOne */ .Cq.User.findOne({
        isAdmin: true
      });

      if (admin && admin.userSubscription && project.projectVisibility === models_Project__WEBPACK_IMPORTED_MODULE_7__/* .Visibility.PUBLIC */ .Hk.PUBLIC) {
        await utils_api__WEBPACK_IMPORTED_MODULE_8__/* .default.post */ .Z.post("notification", {
          subscription: admin.userSubscription,
          notification: {
            title: "Un projet attend votre approbation",
            message: "Appuyez pour ouvrir la page de l'organisation",
            url: `${"https://aucourant.de"}/${projectOrgs[0].orgUrl}`
          }
        });
        (0,utils_email__WEBPACK_IMPORTED_MODULE_6__/* .sendToAdmin */ .AE)({
          project: body,
          transport
        });
      }

      res.status(200).json(project);
    } catch (error) {
      if (error.errors) {
        res.status(400).json(error.errors);
      } else {
        res.status(500).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_4__/* .createServerError */ .Eh)(error));
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
var __webpack_require__ = require("../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
var __webpack_exports__ = __webpack_require__.X(0, [1664,5328,8716,9163,8177,6837,4281,8238,3831], function() { return __webpack_exec__(4615); });
module.exports = __webpack_exports__;

})();