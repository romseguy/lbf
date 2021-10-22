(function() {
var exports = {};
exports.id = 264;
exports.ids = [264];
exports.modules = {

/***/ 644:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var next_connect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9303);
/* harmony import */ var next_connect__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_connect__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var nodemailer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8123);
/* harmony import */ var nodemailer__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(nodemailer__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var nodemailer_sendgrid__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9619);
/* harmony import */ var nodemailer_sendgrid__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(nodemailer_sendgrid__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var database__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9163);
/* harmony import */ var hooks_useAuth__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(8238);
/* harmony import */ var utils_errors__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(8177);
/* harmony import */ var utils_string__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(7535);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }








const transport = nodemailer__WEBPACK_IMPORTED_MODULE_1___default().createTransport(nodemailer_sendgrid__WEBPACK_IMPORTED_MODULE_2___default()({
  apiKey: process.env.EMAIL_API_KEY
}));
const handler = next_connect__WEBPACK_IMPORTED_MODULE_0___default()();
handler.use(database__WEBPACK_IMPORTED_MODULE_3__/* .default */ .ZP);
handler.get(async function getOrg(req, res) {
  try {
    const session = await (0,hooks_useAuth__WEBPACK_IMPORTED_MODULE_4__/* .getSession */ .G)({
      req
    });
    const {
      query: {
        orgUrl,
        populate
      }
    } = req;
    let org = await database__WEBPACK_IMPORTED_MODULE_3__/* .models.Org.findOne */ .Cq.Org.findOne({
      orgUrl
    });
    if (!org) return res.status(404).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_5__/* .createServerError */ .Eh)(new Error(`L'organisation ${orgUrl} n'a pas pu être trouvé`))); // hand emails to org creator only

    const isCreator = (0,utils_string__WEBPACK_IMPORTED_MODULE_6__/* .equals */ .fS)(org.createdBy, session === null || session === void 0 ? void 0 : session.user.userId) || (session === null || session === void 0 ? void 0 : session.user.isAdmin);
    console.log(org.orgName, "isCreator", isCreator);
    let select = isCreator ? "-password -securityCode" : "-email -password -securityCode";

    if (populate) {
      if (populate.includes("orgEvents")) {
        org = org.populate("orgEvents");
      }

      if (populate.includes("orgProjects")) org = org.populate({
        path: "orgProjects",
        populate: [{
          path: "projectOrgs createdBy"
        }]
      });
      if (populate.includes("orgTopics")) org = org.populate({
        path: "orgTopics",
        populate: [{
          path: "topicMessages",
          populate: {
            path: "createdBy"
          }
        }, {
          path: "createdBy"
        }]
      });

      if (populate.includes("orgSubscriptions")) {
        org = org.populate({
          path: "orgSubscriptions",
          select: isCreator ? undefined : "-email",
          populate: {
            path: "user",
            select: isCreator ? "-password -securityCode" : "-email -password -securityCode"
          }
        });
      }
    }

    org = await org.populate("createdBy", select + " -userImage").execPopulate();

    if (!populate || !populate.includes("orgLogo")) {
      org.orgLogo = undefined;
    }

    if (!populate || !populate.includes("orgBanner")) {
      org.orgBanner = undefined;
    }

    for (const orgEvent of org.orgEvents) {
      var _orgEvent$forwardedFr;

      if ((_orgEvent$forwardedFr = orgEvent.forwardedFrom) !== null && _orgEvent$forwardedFr !== void 0 && _orgEvent$forwardedFr.eventId) {
        const e = await database__WEBPACK_IMPORTED_MODULE_3__/* .models.Event.findOne */ .Cq.Event.findOne({
          _id: orgEvent.forwardedFrom.eventId
        });

        if (e) {
          orgEvent.forwardedFrom.eventUrl = orgEvent._id;
          orgEvent.eventName = e.eventName;
          orgEvent.eventUrl = e.eventUrl;
        }
      }
    }

    for (const orgTopic of org.orgTopics) {
      if (orgTopic.topicMessages) {
        for (const topicMessage of orgTopic.topicMessages) {
          if (typeof topicMessage.createdBy === "object") {
            if (!topicMessage.createdBy.userName && topicMessage.createdBy.email) {
              topicMessage.createdBy.userName = topicMessage.createdBy.email.replace(/@.+/, "");
            } // todo: check this
            // topicMessage.createdBy.email = undefined;

          }
        }
      }
    }

    res.status(200).json(org);
  } catch (error) {
    res.status(500).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_5__/* .createServerError */ .Eh)(error));
  }
});
handler.put(async function editOrg(req, res) {
  const session = await (0,hooks_useAuth__WEBPACK_IMPORTED_MODULE_4__/* .getSession */ .G)({
    req
  });

  if (!session) {
    res.status(403).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_5__/* .createServerError */ .Eh)(new Error("Vous devez être identifié pour accéder à ce contenu")));
  } else {
    try {
      let {
        body
      } = req;
      const orgUrl = req.query.orgUrl;
      const org = await database__WEBPACK_IMPORTED_MODULE_3__/* .models.Org.findOne */ .Cq.Org.findOne({
        orgUrl
      });

      if (!org) {
        return res.status(404).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_5__/* .createServerError */ .Eh)(new Error(`L'organisation ${orgUrl} n'a pas pu être trouvé`)));
      }

      if (!(0,utils_string__WEBPACK_IMPORTED_MODULE_6__/* .equals */ .fS)(org.createdBy, session.user.userId) && !session.user.isAdmin) {
        return res.status(403).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_5__/* .createServerError */ .Eh)(new Error("Vous ne pouvez pas modifier un organisation que vous n'avez pas créé.")));
      }

      if (body.orgName) {
        body = _objectSpread(_objectSpread({}, body), {}, {
          orgName: body.orgName.trim()
        });
        body.orgUrl = (0,utils_string__WEBPACK_IMPORTED_MODULE_6__/* .normalize */ .Fv)(body.orgName);
      }

      const {
        n,
        nModified
      } = await database__WEBPACK_IMPORTED_MODULE_3__/* .models.Org.updateOne */ .Cq.Org.updateOne({
        orgUrl
      }, body);

      if (nModified === 1) {
        res.status(200).json({});
      } else {
        res.status(400).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_5__/* .createServerError */ .Eh)(new Error(`L'organisation ${orgUrl} n'a pas pu être modifiée`)));
      }
    } catch (error) {
      res.status(500).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_5__/* .createServerError */ .Eh)(error));
    }
  }
});
handler.delete(async function removeOrg(req, res) {
  const session = await (0,hooks_useAuth__WEBPACK_IMPORTED_MODULE_4__/* .getSession */ .G)({
    req
  });

  if (!session) {
    res.status(403).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_5__/* .createServerError */ .Eh)(new Error("Vous devez être identifié pour accéder à ce contenu")));
  } else {
    try {
      const orgUrl = req.query.orgUrl;
      const org = await database__WEBPACK_IMPORTED_MODULE_3__/* .models.Org.findOne */ .Cq.Org.findOne({
        orgUrl
      });

      if (!org) {
        return res.status(404).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_5__/* .createServerError */ .Eh)(new Error(`L'organisation ${orgUrl} n'a pas pu être trouvé`)));
      }

      if (!(0,utils_string__WEBPACK_IMPORTED_MODULE_6__/* .equals */ .fS)(org.createdBy, session.user.userId) && !session.user.isAdmin) {
        return res.status(403).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_5__/* .createServerError */ .Eh)(new Error("Vous ne pouvez pas supprimer une organisation que vous n'avez pas créé.")));
      }

      const {
        deletedCount
      } = await database__WEBPACK_IMPORTED_MODULE_3__/* .models.Org.deleteOne */ .Cq.Org.deleteOne({
        orgUrl
      }); // todo delete references to this org

      if (deletedCount === 1) {
        res.status(200).json(org);
      } else {
        res.status(400).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_5__/* .createServerError */ .Eh)(new Error(`L'organisation ${orgUrl} n'a pas pu être supprimé`)));
      }
    } catch (error) {
      res.status(500).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_5__/* .createServerError */ .Eh)(error));
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
var __webpack_exports__ = __webpack_require__.X(0, [8716,9163,8177,6837,4281,8238], function() { return __webpack_exec__(644); });
module.exports = __webpack_exports__;

})();