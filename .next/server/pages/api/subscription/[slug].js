(function() {
var exports = {};
exports.id = 4340;
exports.ids = [4340];
exports.modules = {

/***/ 2464:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var next_connect__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9303);
/* harmony import */ var next_connect__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_connect__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var database__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9163);
/* harmony import */ var utils_errors__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8177);
/* harmony import */ var hooks_useAuth__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8238);
/* harmony import */ var utils_string__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(7535);
/* harmony import */ var utils_email__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9281);
/* harmony import */ var utils_array__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(1609);







const handler = next_connect__WEBPACK_IMPORTED_MODULE_0___default()();
handler.use(database__WEBPACK_IMPORTED_MODULE_1__/* .default */ .ZP);
handler.get(async function getSubscription(req, res) {
  try {
    const {
      query: {
        slug,
        populate
      }
    } = req;
    let selector = {};

    if (utils_email__WEBPACK_IMPORTED_MODULE_4__/* .emailR.test */ .GN.test(slug)) {
      const user = await database__WEBPACK_IMPORTED_MODULE_1__/* .models.User.findOne */ .Cq.User.findOne({
        email: slug
      });
      selector = user ? {
        user
      } : {
        email: slug
      };
    } else {
      const user = await database__WEBPACK_IMPORTED_MODULE_1__/* .models.User.findOne */ .Cq.User.findOne({
        _id: slug
      });
      if (user) selector = {
        user
      };else selector = {
        _id: slug
      };
    }

    let subscription = await database__WEBPACK_IMPORTED_MODULE_1__/* .models.Subscription.findOne */ .Cq.Subscription.findOne(selector);

    if (!subscription) {
      return res.status(404).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_2__/* .createServerError */ .Eh)(new Error(`L'abonnement ${slug} n'a pas pu être trouvé`)));
    }

    if (populate) subscription.populate(populate);
    subscription = subscription.populate({
      path: "events",
      populate: {
        path: "event"
      }
    }).populate({
      path: "orgs",
      populate: {
        path: "org"
      }
    }).populate({
      path: "topics",
      populate: {
        path: "topic"
      }
    });
    subscription = await subscription.execPopulate();
    res.status(200).json(subscription);
  } catch (error) {
    console.log("error", error);
    res.status(500).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_2__/* .createServerError */ .Eh)(error));
  }
});
handler.put(async function editSubscription(req, res) {
  const session = await (0,hooks_useAuth__WEBPACK_IMPORTED_MODULE_3__/* .getSession */ .G)({
    req
  });

  if (!session) {
    res.status(403).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_2__/* .createServerError */ .Eh)(new Error("Vous devez être identifié pour accéder à ce contenu")));
  } else {
    try {
      const {
        query: {
          slug
        }
      } = req;
      let body = req.body;
      const {
        n,
        nModified
      } = await database__WEBPACK_IMPORTED_MODULE_1__/* .models.Subscription.updateOne */ .Cq.Subscription.updateOne({
        _id: slug
      }, body);

      if (nModified === 1) {
        res.status(200).json({});
      } else {
        res.status(400).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_2__/* .createServerError */ .Eh)(new Error(`L'abonnement n'a pas pu être modifié`)));
      }
    } catch (error) {
      res.status(500).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_2__/* .createServerError */ .Eh)(error));
    }
  }
});
handler.delete(async function removeSubscription(req, res) {
  const {
    query: {
      slug: subscriptionId
    },
    body
  } = req;

  try {
    let subscription = await database__WEBPACK_IMPORTED_MODULE_1__/* .models.Subscription.findOne */ .Cq.Subscription.findOne({
      _id: subscriptionId
    });

    if (!subscription) {
      return res.status(404).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_2__/* .createServerError */ .Eh)(new Error(`L'abonnement ${subscriptionId} n'a pas pu être trouvé`)));
    }

    if (body.orgs) {
      let orgSubscription;

      if ((0,utils_array__WEBPACK_IMPORTED_MODULE_5__/* .hasItems */ .t)(body.orgs)) {
        orgSubscription = body.orgs[0];
      } // todo http status code unchanged


      if (!orgSubscription) return res.status(200).json(subscription);
      const {
        orgId,
        type
      } = orgSubscription;
      const org = await database__WEBPACK_IMPORTED_MODULE_1__/* .models.Org.findOne */ .Cq.Org.findOne({
        _id: orgId
      }).populate("orgSubscriptions");
      if (!org) return res.status(400).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_2__/* .createServerError */ .Eh)(new Error(`L'organisation ${orgId} n'a pas pu être trouvé`)));
      console.log("unsubbing from org", org);
      subscription = await subscription.populate("user", "-securityCode -password").execPopulate();
      subscription.orgs = subscription.orgs.filter(orgSubscription => {
        let keep = true;

        if ((0,utils_string__WEBPACK_IMPORTED_MODULE_6__/* .equals */ .fS)(orgSubscription.orgId, orgId)) {
          if (orgSubscription.type === type) {
            keep = false;
          }
        }

        return keep;
      });
      await subscription.save();
      console.log("subscription saved", subscription);
      res.status(200).json(subscription);
    } else if (body.orgId) {
      const org = await database__WEBPACK_IMPORTED_MODULE_1__/* .models.Org.findOne */ .Cq.Org.findOne({
        _id: body.orgId
      }).populate("orgSubscriptions");
      if (!org) return res.status(400).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_2__/* .createServerError */ .Eh)(new Error(`L'organisation ${body.orgId} n'a pas pu être trouvé`)));
      console.log("unsubbing from org", org);
      org.orgSubscriptions = org.orgSubscriptions.filter(subscription => {
        let keep = true;

        if ((0,utils_string__WEBPACK_IMPORTED_MODULE_6__/* .equals */ .fS)(subscription._id, subscriptionId)) {
          keep = false;
        }

        return keep;
      });
      await org.save();
      console.log("org saved", org);
      subscription = await subscription.populate("user", "-securityCode -password").execPopulate();
      subscription.orgs = subscription.orgs.filter(orgSubscription => {
        let keep = true;

        if ((0,utils_string__WEBPACK_IMPORTED_MODULE_6__/* .equals */ .fS)(orgSubscription.orgId, body.orgId)) {
          keep = false;
        }

        return keep;
      });
      await subscription.save();
      console.log("subscription saved", subscription);
      res.status(200).json(subscription);
    } else if (body.events) {
      const {
        eventId
      } = body.events[0];
      const event = await database__WEBPACK_IMPORTED_MODULE_1__/* .models.Event.findOne */ .Cq.Event.findOne({
        _id: eventId
      }).populate("eventSubscriptions");
      if (!event) return res.status(400).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_2__/* .createServerError */ .Eh)(new Error(`L'événement ${eventId} n'a pas pu être trouvé`)));
      console.log("unsubbing from event", event);
      subscription = await subscription.populate("user", "-securityCode -password").execPopulate();
      event.eventSubscriptions = event.eventSubscriptions.filter(subscription => {
        let keep = true;
        if (subscription.events.find(eventSubscription => (0,utils_string__WEBPACK_IMPORTED_MODULE_6__/* .equals */ .fS)(eventSubscription.eventId, eventId))) keep = false;
        return keep;
      });
      await event.save();
      subscription.events = subscription.events.filter(eventSubscription => {
        let keep = true;

        if ((0,utils_string__WEBPACK_IMPORTED_MODULE_6__/* .equals */ .fS)(eventSubscription.eventId, eventId)) {
          keep = false;
        }

        return keep;
      });
      await subscription.save();
      console.log("subscription saved", subscription);
      res.status(200).json(subscription);
    } else if (body.topicId) {
      // console.log("unsubbing from topic", body.topicId);
      subscription = await subscription.populate({
        path: "topics",
        populate: {
          path: "topic"
        }
      }).execPopulate();
      subscription.topics = subscription.topics.filter(({
        topic
      }) => {
        let allow = false;
        allow = !(0,utils_string__WEBPACK_IMPORTED_MODULE_6__/* .equals */ .fS)(topic._id, body.topicId);
        return allow;
      });
      await subscription.save();
      console.log("subscription saved", subscription);
      res.status(200).json(subscription);
    } else {
      console.log("deleting subscription", subscription);

      for (const eventSubscription of subscription.events) {
        const event = await database__WEBPACK_IMPORTED_MODULE_1__/* .models.Event.findOne */ .Cq.Event.findOne({
          _id: eventSubscription.eventId
        });
        if (!event) continue;
        event.eventSubscriptions = event.eventSubscriptions.filter(subscription => {
          var _subscription$events;

          let keep = true;
          if ((_subscription$events = subscription.events) !== null && _subscription$events !== void 0 && _subscription$events.find(eventSubscription => (0,utils_string__WEBPACK_IMPORTED_MODULE_6__/* .equals */ .fS)(eventSubscription.eventId, event._id))) keep = false;
          return keep;
        });
        await event.save();
      }

      for (const orgSubscription of subscription.orgs) {
        const org = await database__WEBPACK_IMPORTED_MODULE_1__/* .models.Org.findOne */ .Cq.Org.findOne({
          _id: orgSubscription.orgId
        });
        if (!org) continue;
        org.orgSubscriptions = org.orgSubscriptions.filter(subscription => {
          var _subscription$orgs;

          let keep = true;
          if ((_subscription$orgs = subscription.orgs) !== null && _subscription$orgs !== void 0 && _subscription$orgs.find(orgSubscription => (0,utils_string__WEBPACK_IMPORTED_MODULE_6__/* .equals */ .fS)(orgSubscription.orgId, org._id))) keep = false;
          return keep;
        });
        await org.save();
      }

      const {
        deletedCount
      } = await database__WEBPACK_IMPORTED_MODULE_1__/* .models.Subscription.deleteOne */ .Cq.Subscription.deleteOne({
        _id: subscriptionId
      });

      if (deletedCount === 1) {
        res.status(200).json(subscription);
      } else {
        subscription = await subscription.populate("user", "-securityCode -password").execPopulate();
        const email = typeof subscription.user === "object" ? subscription.user.email : subscription.email;
        res.status(400).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_2__/* .createServerError */ .Eh)(new Error(`Les abonnements de ${email} n'ont pas pu être supprimés`)));
      }
    }
  } catch (error) {
    res.status(500).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_2__/* .createServerError */ .Eh)(error));
  }
});
/* harmony default export */ __webpack_exports__["default"] = (handler);

/***/ }),

/***/ 1609:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "t": function() { return /* binding */ hasItems; }
/* harmony export */ });
const hasItems = array => Array.isArray(array) && array.length > 0;

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
var __webpack_exports__ = __webpack_require__.X(0, [1664,5328,8716,9163,8177,6837,4281,8238,3831], function() { return __webpack_exec__(2464); });
module.exports = __webpack_exports__;

})();