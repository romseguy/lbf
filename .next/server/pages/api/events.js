(function() {
var exports = {};
exports.id = 2174;
exports.ids = [2174];
exports.modules = {

/***/ 4925:
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
/* harmony import */ var utils_string__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(7535);
/* harmony import */ var models_Event__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(7823);
/* harmony import */ var utils_api__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(6837);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }











const transport = nodemailer__WEBPACK_IMPORTED_MODULE_0___default().createTransport(nodemailer_sendgrid__WEBPACK_IMPORTED_MODULE_1___default()({
  apiKey: process.env.EMAIL_API_KEY
}));
const handler = next_connect__WEBPACK_IMPORTED_MODULE_2___default()();
handler.use(database__WEBPACK_IMPORTED_MODULE_3__/* .default */ .ZP);
handler.get(async function getEvents(req, res) {
  const {
    query: {
      userId
    }
  } = req;
  let events;
  let selector = {};
  if (userId) selector = {
    createdBy: userId
  };

  try {
    events = await database__WEBPACK_IMPORTED_MODULE_3__/* .models.Event.find */ .Cq.Event.find(selector).sort({
      eventMinDate: "ascending"
    }).populate("eventOrgs", "-orgBanner -orgLogo").populate("createdBy", "userName");

    for (const event of events) {
      var _event$forwardedFrom;

      if ((_event$forwardedFrom = event.forwardedFrom) !== null && _event$forwardedFrom !== void 0 && _event$forwardedFrom.eventId) {
        var _event$forwardedFrom2;

        const e = await database__WEBPACK_IMPORTED_MODULE_3__/* .models.Event.findOne */ .Cq.Event.findOne({
          _id: (_event$forwardedFrom2 = event.forwardedFrom) === null || _event$forwardedFrom2 === void 0 ? void 0 : _event$forwardedFrom2.eventId
        });

        if (e) {
          event.eventName = e.eventName;
          event.eventUrl = e.eventUrl;
        }
      }
    }

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_4__/* .createServerError */ .Eh)(error));
  }
});
handler.post(async function postEvent(req, res) {
  const session = await (0,hooks_useAuth__WEBPACK_IMPORTED_MODULE_5__/* .getSession */ .G)({
    req
  });

  if (!session) {
    res.status(403).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_4__/* .createServerError */ .Eh)(new Error("Vous devez être identifié pour accéder à ce contenu")));
  } else {
    try {
      let {
        body
      } = req;
      body = _objectSpread(_objectSpread({}, body), {}, {
        eventName: body.eventName.trim()
      });
      const eventUrl = (0,utils_string__WEBPACK_IMPORTED_MODULE_9__/* .normalize */ .Fv)(body.eventName);
      let event = null;
      let eventOrgs = [];

      if (body.forwardedFrom) {
        event = await database__WEBPACK_IMPORTED_MODULE_3__/* .models.Event.findOne */ .Cq.Event.findOne({
          eventUrl
        });

        for (const eventOrg of body.eventOrgs) {
          const o = await database__WEBPACK_IMPORTED_MODULE_3__/* .models.Org.findOne */ .Cq.Org.findOne({
            _id: eventOrg._id
          }).populate("orgEvents");

          if (o && !o.orgEvents.find(orgEvent => (0,utils_string__WEBPACK_IMPORTED_MODULE_9__/* .equals */ .fS)(orgEvent.eventUrl, eventUrl))) {
            eventOrgs.push(o._id);
          }
        }

        if (eventOrgs.length > 0) {
          if (event) {
            console.log("event has already been forwarded => adding new eventOrgs");
            event.eventOrgs = event.eventOrgs.concat(eventOrgs);
            await event.save();
          } else {
            event = await database__WEBPACK_IMPORTED_MODULE_3__/* .models.Event.create */ .Cq.Event.create(_objectSpread(_objectSpread({}, body), {}, {
              eventUrl,
              eventOrgs
            }));
          }
        }
      } else {
        event = await database__WEBPACK_IMPORTED_MODULE_3__/* .models.Event.findOne */ .Cq.Event.findOne({
          eventUrl
        });
        if (event) throw utils_errors__WEBPACK_IMPORTED_MODULE_4__/* .duplicateError */ .b$;
        const org = await database__WEBPACK_IMPORTED_MODULE_3__/* .models.Org.findOne */ .Cq.Org.findOne({
          orgUrl: eventUrl
        });
        if (org) throw utils_errors__WEBPACK_IMPORTED_MODULE_4__/* .duplicateError */ .b$;
        const user = await database__WEBPACK_IMPORTED_MODULE_3__/* .models.User.findOne */ .Cq.User.findOne({
          userName: body.eventName
        });
        if (user) throw utils_errors__WEBPACK_IMPORTED_MODULE_4__/* .duplicateError */ .b$;
        let isApproved = session.user.isAdmin;

        for (const eventOrg of body.eventOrgs) {
          const o = await database__WEBPACK_IMPORTED_MODULE_3__/* .models.Org.findOne */ .Cq.Org.findOne({
            _id: eventOrg._id
          });

          if (!o) {
            console.log("POST /events: skipping unknown eventOrg");
            continue;
          } else {
            eventOrgs.push(o);

            if (o.isApproved) {
              isApproved = true;
            }
          }
        }

        console.log("POST /events: creating event with eventOrgs", eventOrgs);
        event = await database__WEBPACK_IMPORTED_MODULE_3__/* .models.Event.create */ .Cq.Event.create(_objectSpread(_objectSpread({}, body), {}, {
          eventUrl,
          eventOrgs,
          isApproved
        }));

        if (!isApproved) {
          const admin = await database__WEBPACK_IMPORTED_MODULE_3__/* .models.User.findOne */ .Cq.User.findOne({
            isAdmin: true
          });

          if (admin && admin.userSubscription && event.eventVisibility === models_Event__WEBPACK_IMPORTED_MODULE_7__/* .Visibility.PUBLIC */ .Hk.PUBLIC) {
            await utils_api__WEBPACK_IMPORTED_MODULE_8__/* .default.post */ .Z.post("notification", {
              subscription: admin.userSubscription,
              notification: {
                title: "Un événement attend votre approbation",
                message: "Appuyez pour ouvrir la page de l'événement",
                url: `${"https://aucourant.de"}/${event.eventUrl}`
              }
            });
            (0,utils_email__WEBPACK_IMPORTED_MODULE_6__/* .sendToAdmin */ .AE)({
              event: body,
              transport
            });
          }
        }
      }

      if (event) {
        await database__WEBPACK_IMPORTED_MODULE_3__/* .models.Org.updateMany */ .Cq.Org.updateMany({
          _id: eventOrgs
        }, {
          $push: {
            orgEvents: event._id
          }
        });
      }

      res.status(200).json(event);
    } catch (error) {
      if (error.code && error.code === utils_errors__WEBPACK_IMPORTED_MODULE_4__/* .databaseErrorCodes.DUPLICATE_KEY */ .MM.DUPLICATE_KEY) {
        res.status(400).json({
          eventName: "Ce nom d'événement n'est pas disponible"
        });
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
var __webpack_exports__ = __webpack_require__.X(0, [1664,5328,8716,9163,8177,6837,4281,8238,3831], function() { return __webpack_exec__(4925); });
module.exports = __webpack_exports__;

})();