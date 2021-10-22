(function() {
var exports = {};
exports.id = 2731;
exports.ids = [2731];
exports.modules = {

/***/ 8385:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var next_connect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9303);
/* harmony import */ var next_connect__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_connect__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var database__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9163);
/* harmony import */ var utils_errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8177);
/* harmony import */ var nodemailer__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8123);
/* harmony import */ var nodemailer__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(nodemailer__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var nodemailer_sendgrid__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9619);
/* harmony import */ var nodemailer_sendgrid__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(nodemailer_sendgrid__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var hooks_useAuth__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(8238);
/* harmony import */ var utils_string__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(7535);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }






 // import { sendProjectToOrgFollowers } from "utils/email";


const transport = nodemailer__WEBPACK_IMPORTED_MODULE_3___default().createTransport(nodemailer_sendgrid__WEBPACK_IMPORTED_MODULE_4___default()({
  apiKey: process.env.EMAIL_API_KEY
}));
const handler = next_connect__WEBPACK_IMPORTED_MODULE_0___default()();
handler.use(database__WEBPACK_IMPORTED_MODULE_1__/* .default */ .ZP);
handler.put(async function editProject(req, res) {
  const session = await (0,hooks_useAuth__WEBPACK_IMPORTED_MODULE_5__/* .getSession */ .G)({
    req
  });
  const {
    body
  } = req;

  if (!session && !body.projectNotified) {
    res.status(403).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_2__/* .createServerError */ .Eh)(new Error("Vous devez être identifié pour accéder à ce contenu")));
  } else {
    try {
      const projectId = req.query.projectId;
      const project = await database__WEBPACK_IMPORTED_MODULE_1__/* .models.Project.findOne */ .Cq.Project.findOne({
        _id: projectId
      }).populate("projectOrgs");

      if (!project) {
        return res.status(404).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_2__/* .createServerError */ .Eh)(new Error(`Le projet ${projectId} n'a pas pu être trouvé`)));
      }

      if (!body.projectNotified && session) {
        if (!(0,utils_string__WEBPACK_IMPORTED_MODULE_6__/* .equals */ .fS)(project.createdBy, session.user.userId) && !session.user.isAdmin) {
          return res.status(403).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_2__/* .createServerError */ .Eh)(new Error("Vous ne pouvez pas modifier un projet que vous n'avez pas créé.")));
        }
      }

      if (body.projectOrgs) {
        const staleProjectOrgsIds = [];

        for (const {
          _id
        } of body.projectOrgs) {
          const org = await database__WEBPACK_IMPORTED_MODULE_1__/* .models.Org.findOne */ .Cq.Org.findOne({
            _id
          });

          if (!org) {
            staleProjectOrgsIds.push(_id);
            continue;
          }

          if (org.orgProjects.indexOf(project._id) === -1) {
            await database__WEBPACK_IMPORTED_MODULE_1__/* .models.Org.updateOne */ .Cq.Org.updateOne({
              _id: org._id
            }, {
              $push: {
                orgProjects: project._id
              }
            });
          }
        }

        if (staleProjectOrgsIds.length > 0) {
          body.projectOrgs = body.projectOrgs.filter(projectOrg => !staleProjectOrgsIds.find(id => id === projectOrg._id));
        }
      } // project.projectNotif = body.projectNotif || [];
      // const emailList = await sendProjectToOrgFollowers(project, transport);


      let projectNotified;

      if (body.projectNotified) {
        projectNotified = body.projectNotified;
      } // else if (emailList.length > 0) {
      //   projectNotified = project.projectNotified?.concat(
      //     emailList.map((email) => ({
      //       email,
      //       status: StatusTypes.PENDING
      //     }))
      //   );
      // }


      const {
        n,
        nModified
      } = await database__WEBPACK_IMPORTED_MODULE_1__/* .models.Project.updateOne */ .Cq.Project.updateOne({
        _id: projectId
      }, _objectSpread(_objectSpread({}, body), {}, {
        projectNotified
      }));

      if (nModified === 1) {
        //res.status(200).json({ emailList });
        res.status(200).json({});
      } else {
        res.status(400).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_2__/* .createServerError */ .Eh)(new Error("Le projet n'a pas pu être modifié")));
      }
    } catch (error) {
      res.status(500).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_2__/* .createServerError */ .Eh)(error));
    }
  }
});
handler.delete(async function removeProject(req, res) {
  const session = await (0,hooks_useAuth__WEBPACK_IMPORTED_MODULE_5__/* .getSession */ .G)({
    req
  });

  if (!session) {
    res.status(403).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_2__/* .createServerError */ .Eh)(new Error("Vous devez être identifié pour accéder à ce contenu")));
  } else {
    try {
      const projectId = req.query.projectId;
      const project = await database__WEBPACK_IMPORTED_MODULE_1__/* .models.Project.findOne */ .Cq.Project.findOne({
        _id: projectId
      });

      if (!project) {
        return res.status(404).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_2__/* .createServerError */ .Eh)(new Error(`Le projet ${projectId} n'a pas pu être trouvé`)));
      }

      if (!(0,utils_string__WEBPACK_IMPORTED_MODULE_6__/* .equals */ .fS)(project.createdBy, session.user.userId) && !session.user.isAdmin) {
        return res.status(403).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_2__/* .createServerError */ .Eh)(new Error("Vous ne pouvez pas supprimer un projet que vous n'avez pas créé.")));
      }

      const {
        deletedCount
      } = await database__WEBPACK_IMPORTED_MODULE_1__/* .models.Project.deleteOne */ .Cq.Project.deleteOne({
        _id: projectId
      });

      if (deletedCount === 1) {
        if (project && project.projectOrgs) {
          for (const projectOrg of project.projectOrgs) {
            const o = await database__WEBPACK_IMPORTED_MODULE_1__/* .models.Org.findOne */ .Cq.Org.findOne({
              _id: projectOrg
            });

            if (o) {
              o.orgProjects = o.orgProjects.filter(orgProject => !(0,utils_string__WEBPACK_IMPORTED_MODULE_6__/* .equals */ .fS)(orgProject, project === null || project === void 0 ? void 0 : project._id));
              o.save();
            }
          }
        }

        res.status(200).json(project);
      } else {
        res.status(400).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_2__/* .createServerError */ .Eh)(new Error(`Le projet ${projectId} n'a pas pu être supprimé`)));
      }
    } catch (error) {
      res.status(500).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_2__/* .createServerError */ .Eh)(error));
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
var __webpack_exports__ = __webpack_require__.X(0, [8716,9163,8177,6837,4281,8238], function() { return __webpack_exec__(8385); });
module.exports = __webpack_exports__;

})();