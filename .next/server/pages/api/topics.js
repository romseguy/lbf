(function() {
var exports = {};
exports.id = 5929;
exports.ids = [5929];
exports.modules = {

/***/ 1528:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ topics; }
});

// EXTERNAL MODULE: external "mongoose"
var external_mongoose_ = __webpack_require__(5619);
// EXTERNAL MODULE: ./src/database.ts + 1 modules
var database = __webpack_require__(9163);
;// CONCATENATED MODULE: external "react-async-hook"
var external_react_async_hook_namespaceObject = require("react-async-hook");;
// EXTERNAL MODULE: external "next-auth/client"
var client_ = __webpack_require__(8104);
// EXTERNAL MODULE: ./src/utils/api.ts
var api = __webpack_require__(6837);
;// CONCATENATED MODULE: ./src/hooks/useAuth.test.ts
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//@ts-nocheck

 //import type { UseSessionOptions, GetSessionOptions } from "next-auth/client";


const speedUpDev =  false && 0;
const session = {
  user: {
    userId: process.env.NEXT_PUBLIC_IS_LOCAL_TEST ? "610ee9f18ee7760d3390e482" : "60e318732d8f5b154bfaa346",
    userName: "romseguy8933",
    email: process.env.EMAIL_ADMIN
  }
};
// server-side
async function getSession(options) {
  if (process.env.NEXT_PUBLIC_IS_TEST || speedUpDev) {
    return session;
  }

  const nextAuthSession = await (0,client_.getSession)(options);
  let ret = nextAuthSession;

  if (nextAuthSession && nextAuthSession.user) {
    if (!nextAuthSession.user.userId) {
      const {
        data
      } = await fetchUser(nextAuthSession);

      if (data) {
        const {
          _id,
          userName,
          isAdmin
        } = data;
        ret = _objectSpread(_objectSpread({}, nextAuthSession), {}, {
          user: _objectSpread(_objectSpread({}, nextAuthSession.user), {}, {
            userId: _id,
            userName,
            isAdmin: isAdmin || false
          })
        });
      }
    }
  }

  return ret;
}

const fetchUser = async s => {
  if (s && !s.user.userId) return await api/* default.get */.Z.get(`user/${s.user.email}`);
  return null;
}; // client-side
// export function useSession(options?: UseSessionOptions): {


function useSession(options) {
  if (process.env.NEXT_PUBLIC_IS_TEST || speedUpDev) {
    return {
      data: session,
      loading: false
    };
  } // const { data, status } = useNextAuthSession();
  // return { data, loading: false };


  const [session, loading] = useNextAuthSession();
  let data = session;
  const userQuery = useAsync(fetchUser, [session]);

  if (session && !session.user.userId && !userQuery.loading && userQuery.result.data) {
    const {
      _id,
      userName,
      isAdmin
    } = userQuery.result.data;
    data = _objectSpread(_objectSpread({}, session), {}, {
      user: _objectSpread(_objectSpread({}, session.user), {}, {
        userId: _id,
        userName,
        isAdmin: isAdmin || false
      })
    });
  }

  return {
    data,
    loading: loading || userQuery.loading
  };
}
// EXTERNAL MODULE: external "next-connect"
var external_next_connect_ = __webpack_require__(9303);
var external_next_connect_default = /*#__PURE__*/__webpack_require__.n(external_next_connect_);
// EXTERNAL MODULE: external "nodemailer"
var external_nodemailer_ = __webpack_require__(8123);
var external_nodemailer_default = /*#__PURE__*/__webpack_require__.n(external_nodemailer_);
// EXTERNAL MODULE: external "nodemailer-sendgrid"
var external_nodemailer_sendgrid_ = __webpack_require__(9619);
var external_nodemailer_sendgrid_default = /*#__PURE__*/__webpack_require__.n(external_nodemailer_sendgrid_);
// EXTERNAL MODULE: ./src/utils/errors.ts
var errors = __webpack_require__(8177);
// EXTERNAL MODULE: ./src/utils/email.ts
var email = __webpack_require__(9281);
// EXTERNAL MODULE: ./src/utils/string.ts
var string = __webpack_require__(7535);
;// CONCATENATED MODULE: ./src/pages/api/topics.ts
function topics_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function topics_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { topics_ownKeys(Object(source), true).forEach(function (key) { topics_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { topics_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function topics_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }










const transport = external_nodemailer_default().createTransport(external_nodemailer_sendgrid_default()({
  apiKey: process.env.EMAIL_API_KEY
}));
const handler = external_next_connect_default()();
handler.use(database/* default */.ZP);
handler.post(async function postTopic(req, res) {
  const session = await getSession({
    req
  });

  if (!session) {
    res.status(403).json((0,errors/* createServerError */.Eh)(new Error("Vous devez être identifié pour accéder à ce contenu")));
  } else {
    try {
      const {
        body
      } = req;
      const topic = body.topic;
      const topicNotif = body.topicNotif || false;
      let event = null;
      let org = null;

      if (body.event) {
        event = await database/* models.Event.findOne */.Cq.Event.findOne({
          _id: body.event._id
        });
      } else if (body.org) {
        org = await database/* models.Org.findOne */.Cq.Org.findOne({
          _id: body.org._id
        });
      } else {
        return res.status(400).json((0,errors/* createServerError */.Eh)(new Error("Le sujet de discussion doit être associé à une organisation ou à un événément")));
      }

      let createdBy;
      let doc = null;

      if (topic._id) {
        // existing topic: must have a message to add
        console.log("existing topic");

        if (!Array.isArray(topic.topicMessages) || !topic.topicMessages.length) {
          return res.status(200).json({});
        }

        const newMessage = topic.topicMessages[0];
        doc = await database/* models.Topic.findOne */.Cq.Topic.findOne({
          _id: topic._id
        });

        if (!doc) {
          return res.status(404).json((0,errors/* createServerError */.Eh)(new Error("Impossible d'ajouter un message à un topic inexistant")));
        }

        createdBy = (0,string/* toString */.BB)(doc.createdBy);
        doc.topicMessages.push(newMessage);
        await doc.save(); // getting subscriptions of users subscribed to this topic

        const subscriptions = await database/* models.Subscription.find */.Cq.Subscription.find({
          "topics.topic": external_mongoose_.Types.ObjectId(topic._id),
          user: {
            $ne: newMessage.createdBy
          }
        }).populate("user");
        (0,email/* sendMessageToTopicFollowers */.Wu)({
          event,
          org,
          subscriptions,
          topic: doc,
          transport
        });
      } else {
        console.log("new topic");
        doc = await database/* models.Topic.create */.Cq.Topic.create(topics_objectSpread(topics_objectSpread({}, topic), {}, {
          event: event || undefined,
          org: org || undefined
        }));
        createdBy = (0,string/* toString */.BB)(doc.createdBy);

        if (event) {
          event.eventTopics.push(doc);
          await event.save();

          if (topicNotif) {
            // getting subscriptions of users subscribed to this event
            const subscriptions = await database/* models.Subscription.find */.Cq.Subscription.find({
              phone: {
                $exists: false
              },
              "events.event": external_mongoose_.Types.ObjectId(event._id)
            }).populate("user");
            const emailList = await (0,email/* sendTopicToFollowers */.Vv)({
              event,
              subscriptions,
              topic: doc,
              transport
            });
            doc.topicNotified = emailList.map(email => ({
              email
            }));
            await doc.save();
          }
        } else if (org) {
          org.orgTopics.push(doc);
          await org.save();

          if (topicNotif) {
            // getting subscriptions of users subscribed to this org
            const subscriptions = await database/* models.Subscription.find */.Cq.Subscription.find({
              phone: {
                $exists: false
              },
              "orgs.org": external_mongoose_.Types.ObjectId(org._id)
            }).populate("user");
            const emailList = await (0,email/* sendTopicToFollowers */.Vv)({
              org,
              subscriptions,
              topic: doc,
              transport
            });
            doc.topicNotified = emailList.map(email => ({
              email
            }));
            await doc.save();
          }
        }
      }

      const user = await database/* models.User.findOne */.Cq.User.findOne({
        _id: createdBy
      });

      if (user) {
        const subscription = await database/* models.Subscription.findOne */.Cq.Subscription.findOne({
          user
        });

        if (!subscription) {
          console.log("no sub for this user => adding one");
          await database/* models.Subscription.create */.Cq.Subscription.create({
            user,
            topics: [{
              topic,
              emailNotif: true,
              pushNotif: true
            }]
          });
        } else {
          const topicSubscription = subscription.topics.find(({
            topic: t
          }) => (0,string/* equals */.fS)(t._id, topic._id));

          if (!topicSubscription) {
            console.log("no sub for this topic => adding one", subscription);
            subscription.topics = subscription.topics.concat([{
              topic: doc._id,
              emailNotif: true,
              pushNotif: true
            }]);
            await subscription.save();
            console.log("subscription saved", subscription);
          }
        }
      }

      res.status(200).json(topic);
    } catch (error) {
      res.status(500).json((0,errors/* createServerError */.Eh)(error));
    }
  }
});
/* harmony default export */ var topics = (handler);

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
var __webpack_require__ = require("../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
var __webpack_exports__ = __webpack_require__.X(0, [1664,5328,8716,9163,8177,6837,3831], function() { return __webpack_exec__(1528); });
module.exports = __webpack_exports__;

})();