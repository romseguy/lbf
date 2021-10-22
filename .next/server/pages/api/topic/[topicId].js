(function() {
var exports = {};
exports.id = 9904;
exports.ids = [9904];
exports.modules = {

/***/ 4232:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5619);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var next_connect__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9303);
/* harmony import */ var next_connect__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_connect__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var nodemailer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8123);
/* harmony import */ var nodemailer__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(nodemailer__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var nodemailer_sendgrid__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9619);
/* harmony import */ var nodemailer_sendgrid__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(nodemailer_sendgrid__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var database__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9163);
/* harmony import */ var hooks_useAuth__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(8238);
/* harmony import */ var utils_errors__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(8177);
/* harmony import */ var utils_email__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(9281);
/* harmony import */ var utils_string__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(7535);









const transport = nodemailer__WEBPACK_IMPORTED_MODULE_2___default().createTransport(nodemailer_sendgrid__WEBPACK_IMPORTED_MODULE_3___default()({
  apiKey: process.env.EMAIL_API_KEY
}));
const handler = next_connect__WEBPACK_IMPORTED_MODULE_1___default()();
handler.use(database__WEBPACK_IMPORTED_MODULE_4__/* .default */ .ZP);
handler.post(async function postTopicNotif(req, res) {
  const session = await (0,hooks_useAuth__WEBPACK_IMPORTED_MODULE_5__/* .getSession */ .G)({
    req
  });

  if (!session) {
    return res.status(403).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_6__/* .createServerError */ .Eh)(new Error("Vous devez être identifié pour accéder à ce contenu")));
  }

  try {
    const {
      body
    } = req;
    const topicId = req.query.topicId;
    const topic = await database__WEBPACK_IMPORTED_MODULE_4__/* .models.Topic.findOne */ .Cq.Topic.findOne({
      _id: topicId
    });

    if (!topic) {
      return res.status(404).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_6__/* .createServerError */ .Eh)(new Error(`La discussion ${topicId} n'existe pas`)));
    }

    if (!(0,utils_string__WEBPACK_IMPORTED_MODULE_8__/* .equals */ .fS)(topic.createdBy, session.user.userId) && !session.user.isAdmin) {
      return res.status(403).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_6__/* .createServerError */ .Eh)(new Error("Vous ne pouvez pas envoyer des notifications pour une discussion que vous n'avez pas créé.")));
    }

    let emailList = [];

    if (body.event) {
      // getting subscriptions of users subscribed to this event
      const subscriptions = await database__WEBPACK_IMPORTED_MODULE_4__/* .models.Subscription.find */ .Cq.Subscription.find({
        "events.event": mongoose__WEBPACK_IMPORTED_MODULE_0__.Types.ObjectId(body.event._id)
      }).populate("user");
      emailList = await (0,utils_email__WEBPACK_IMPORTED_MODULE_7__/* .sendTopicToFollowers */ .Vv)({
        event: body.event,
        subscriptions,
        topic,
        transport
      });
    } else if (body.org) {
      // getting subscriptions of users subscribed to this org
      const subscriptions = await database__WEBPACK_IMPORTED_MODULE_4__/* .models.Subscription.find */ .Cq.Subscription.find({
        "orgs.org": mongoose__WEBPACK_IMPORTED_MODULE_0__.Types.ObjectId(body.org._id)
      }).populate("user");
      emailList = await (0,utils_email__WEBPACK_IMPORTED_MODULE_7__/* .sendTopicToFollowers */ .Vv)({
        org: body.org,
        subscriptions,
        topic,
        transport
      });
    }

    const topicNotified = emailList.map(email => ({
      email
    }));

    if (topic.topicNotified) {
      topic.topicNotified = topic.topicNotified.concat(topicNotified);
    } else {
      topic.topicNotified = topicNotified;
    }

    await topic.save();
    res.status(200).json({
      emailList
    });
  } catch (error) {
    res.status(500).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_6__/* .createServerError */ .Eh)(error));
  }
});
handler.put(async function editTopic(req, res) {
  const session = await (0,hooks_useAuth__WEBPACK_IMPORTED_MODULE_5__/* .getSession */ .G)({
    req
  });

  if (!session) {
    res.status(403).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_6__/* .createServerError */ .Eh)(new Error("Vous devez être identifié pour accéder à ce contenu")));
  } else {
    try {
      const {
        body
      } = req;
      const topicId = req.query.topicId;
      const topic = await database__WEBPACK_IMPORTED_MODULE_4__/* .models.Topic.findOne */ .Cq.Topic.findOne({
        _id: topicId
      });

      if (!topic) {
        return res.status(404).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_6__/* .createServerError */ .Eh)(new Error(`La discussion ${topicId} n'existe pas`)));
      }

      if (!(0,utils_string__WEBPACK_IMPORTED_MODULE_8__/* .equals */ .fS)(topic.createdBy, session.user.userId) && !session.user.isAdmin) {
        return res.status(403).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_6__/* .createServerError */ .Eh)(new Error("Vous ne pouvez pas modifier une discussion que vous n'avez pas créé.")));
      }

      const {
        n,
        nModified
      } = await database__WEBPACK_IMPORTED_MODULE_4__/* .models.Topic.updateOne */ .Cq.Topic.updateOne({
        _id: topicId
      }, body);

      if (nModified === 1) {
        res.status(200).json({});
      } else {
        res.status(400).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_6__/* .createServerError */ .Eh)(new Error("La discussion n'a pas pu être modifié")));
      }
    } catch (error) {
      res.status(500).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_6__/* .createServerError */ .Eh)(error));
    }
  }
});
handler.delete(async function removeTopic(req, res) {
  const session = await (0,hooks_useAuth__WEBPACK_IMPORTED_MODULE_5__/* .getSession */ .G)({
    req
  });

  if (!session) {
    res.status(403).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_6__/* .createServerError */ .Eh)(new Error("Vous devez être identifié pour accéder à ce contenu")));
  } else {
    try {
      const topicId = req.query.topicId;
      const topic = await database__WEBPACK_IMPORTED_MODULE_4__/* .models.Topic.findOne */ .Cq.Topic.findOne({
        _id: topicId
      });

      if (!topic) {
        return res.status(404).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_6__/* .createServerError */ .Eh)(new Error(`La discussion n'a pas pu être trouvée`)));
      }

      if (!(0,utils_string__WEBPACK_IMPORTED_MODULE_8__/* .equals */ .fS)(topic.createdBy, session.user.userId) && !session.user.isAdmin) {
        return res.status(403).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_6__/* .createServerError */ .Eh)(new Error("Vous ne pouvez pas supprimer une discussion que vous n'avez pas créé.")));
      } //#region org reference


      let nModified;

      if (topic.org) {
        console.log("deleting org reference to topic", topic.org);
        const mutation = await database__WEBPACK_IMPORTED_MODULE_4__/* .models.Org.updateOne */ .Cq.Org.updateOne({
          _id: topic.org
        }, {
          $pull: {
            orgTopics: topic._id
          }
        });
        nModified = mutation.nModified;
      } else if (topic.event) {
        console.log("deleting event reference to topic", topic.event);
        const mutation = await database__WEBPACK_IMPORTED_MODULE_4__/* .models.Event.updateOne */ .Cq.Event.updateOne({
          _id: topic.event
        }, {
          $pull: {
            eventTopics: topic._id
          }
        });
        nModified = mutation.nModified;
      }

      if (nModified === 1) console.log("org reference to topic deleted"); //#endregion
      //#region subscription reference

      const subscriptions = await database__WEBPACK_IMPORTED_MODULE_4__/* .models.Subscription.find */ .Cq.Subscription.find({});
      let count = 0;

      for (const subscription of subscriptions) {
        subscription.topics = subscription.topics.filter(topicSubscription => {
          if ((0,utils_string__WEBPACK_IMPORTED_MODULE_8__/* .equals */ .fS)(topicSubscription.topic._id, topic._id)) {
            count++;
            return false;
          }

          return true;
        });
        await subscription.save();
      }

      if (count > 0) console.log(count + " subscriptions references to topic deleted"); //#endregion

      const {
        deletedCount
      } = await database__WEBPACK_IMPORTED_MODULE_4__/* .models.Topic.deleteOne */ .Cq.Topic.deleteOne({
        _id: topicId
      });

      if (deletedCount === 1) {
        res.status(200).json(topic);
      } else {
        res.status(400).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_6__/* .createServerError */ .Eh)(new Error(`La discussion n'a pas pu être supprimée`)));
      }
    } catch (error) {
      res.status(500).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_6__/* .createServerError */ .Eh)(error));
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
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
var __webpack_exports__ = __webpack_require__.X(0, [1664,5328,8716,9163,8177,6837,4281,8238,3831], function() { return __webpack_exec__(4232); });
module.exports = __webpack_exports__;

})();