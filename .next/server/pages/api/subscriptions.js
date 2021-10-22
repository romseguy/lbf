(function() {
var exports = {};
exports.id = 7936;
exports.ids = [7936];
exports.modules = {

/***/ 9157:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var models_Subscription__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8716);
/* harmony import */ var next_connect__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9303);
/* harmony import */ var next_connect__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(next_connect__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var database__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9163);
/* harmony import */ var utils_errors__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8177);
/* harmony import */ var hooks_useAuth__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(8238);
/* harmony import */ var utils_string__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(7535);






const handler = next_connect__WEBPACK_IMPORTED_MODULE_1___default()();
handler.use(database__WEBPACK_IMPORTED_MODULE_2__/* .default */ .ZP);
handler.get(async function getSubscriptions(req, res) {
  const {
    query: {
      topicId
    }
  } = req;
  const array = [];
  const subscriptions = await database__WEBPACK_IMPORTED_MODULE_2__/* .models.Subscription.find */ .Cq.Subscription.find({});

  for (const subscription of subscriptions) {
    for (const topicSubscription of subscription.topics) {
      if ((0,utils_string__WEBPACK_IMPORTED_MODULE_5__/* .equals */ .fS)(topicSubscription.topic, topicId)) {
        const s = await subscription.populate("user", "-userImage -email -password -securityCode").execPopulate();
        array.push(s);
        break;
      }
    }
  }

  res.status(200).json(array);
});
handler.post(async function postSubscription(req, res) {
  const session = await (0,hooks_useAuth__WEBPACK_IMPORTED_MODULE_4__/* .getSession */ .G)({
    req
  });
  console.log("!!", session);

  try {
    const {
      body
    } = req;
    const selector = {};

    if (body.email) {
      const user = await database__WEBPACK_IMPORTED_MODULE_2__/* .models.User.findOne */ .Cq.User.findOne({
        email: body.email
      });

      if (user) {
        selector.user = user;
      } else {
        selector.email = body.email;
      }
    } else if (body.phone) {
      const user = await database__WEBPACK_IMPORTED_MODULE_2__/* .models.User.findOne */ .Cq.User.findOne({
        phone: body.phone
      });

      if (user) {
        selector.user = user;
      } else {
        selector.phone = body.phone;
      }
    } else if (body.user) {
      const user = await database__WEBPACK_IMPORTED_MODULE_2__/* .models.User.findOne */ .Cq.User.findOne({
        _id: typeof body.user === "object" ? body.user._id : body.user
      });

      if (user) {
        selector.user = user;
      }
    } else if (session) {
      const user = await database__WEBPACK_IMPORTED_MODULE_2__/* .models.User.findOne */ .Cq.User.findOne({
        _id: session.user.userId
      });

      if (user) {
        selector.user = user;
      }
    } else {
      return res.status(400).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_3__/* .createServerError */ .Eh)(new Error("Vous devez fournir une adresse e-mail pour vous abonner")));
    }

    console.log("looking for subscription", selector);
    let subscription = await database__WEBPACK_IMPORTED_MODULE_2__/* .models.Subscription.findOne */ .Cq.Subscription.findOne(selector);

    if (!subscription) {
      console.log("creating subscription", selector);
      subscription = await database__WEBPACK_IMPORTED_MODULE_2__/* .models.Subscription.create */ .Cq.Subscription.create(selector);
    }

    if (body.orgs) {
      const {
        orgs: newOrgSubscriptions
      } = body;

      if (subscription.orgs.length > 0) {
        console.log("user already got org subscriptions");

        for (const newOrgSubscription of newOrgSubscriptions) {
          console.log("newOrgSubscription", newOrgSubscription);
          const org = await database__WEBPACK_IMPORTED_MODULE_2__/* .models.Org.findOne */ .Cq.Org.findOne({
            _id: newOrgSubscription.orgId
          });

          if (!org) {
            return res.status(400).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_3__/* .createServerError */ .Eh)(new Error("Vous ne pouvez pas vous abonner à une organisation inexistante")));
          }

          let isFollower = false;
          let isSub = false;

          for (const orgSubscription of subscription.orgs) {
            if ((0,utils_string__WEBPACK_IMPORTED_MODULE_5__/* .equals */ .fS)(org._id, orgSubscription.orgId)) {
              if (orgSubscription.type === models_Subscription__WEBPACK_IMPORTED_MODULE_0__/* .SubscriptionTypes.FOLLOWER */ .NY.FOLLOWER) {
                isFollower = true;
              } else if (orgSubscription.type === models_Subscription__WEBPACK_IMPORTED_MODULE_0__/* .SubscriptionTypes.SUBSCRIBER */ .NY.SUBSCRIBER) {
                isSub = true;
              }

              break;
            }
          }

          if (newOrgSubscription.type === models_Subscription__WEBPACK_IMPORTED_MODULE_0__/* .SubscriptionTypes.FOLLOWER */ .NY.FOLLOWER) {
            if (isFollower) {
              console.log("user is already following org => replacing old subscription with new one");
              subscription.orgs = subscription.orgs.map(orgSubscription => {
                if (orgSubscription.type === models_Subscription__WEBPACK_IMPORTED_MODULE_0__/* .SubscriptionTypes.FOLLOWER */ .NY.FOLLOWER && (0,utils_string__WEBPACK_IMPORTED_MODULE_5__/* .equals */ .fS)(orgSubscription.orgId, newOrgSubscription.orgId)) {
                  return newOrgSubscription;
                }

                return orgSubscription;
              });
            } else {
              subscription.orgs.push(newOrgSubscription);
            }
          }

          if (newOrgSubscription.type === models_Subscription__WEBPACK_IMPORTED_MODULE_0__/* .SubscriptionTypes.SUBSCRIBER */ .NY.SUBSCRIBER) {
            if (isSub) {
              console.log("user is already subscribed to org => replacing old subscription with new one");
              subscription.orgs = subscription.orgs.map(orgSubscription => {
                if (orgSubscription.type === models_Subscription__WEBPACK_IMPORTED_MODULE_0__/* .SubscriptionTypes.SUBSCRIBER */ .NY.SUBSCRIBER && (0,utils_string__WEBPACK_IMPORTED_MODULE_5__/* .equals */ .fS)(orgSubscription.orgId, newOrgSubscription.orgId)) {
                  return newOrgSubscription;
                }

                return orgSubscription;
              });
            } else {
              subscription.orgs.push(newOrgSubscription);
            }
          }

          if (!org.orgSubscriptions.find(orgSubscription => (0,utils_string__WEBPACK_IMPORTED_MODULE_5__/* .equals */ .fS)(orgSubscription._id, subscription._id))) {
            org.orgSubscriptions.push(subscription);
            await org.save();
            console.log("org updated with new subscription");
          } // if (staleOrgSubscriptionOrgIds.length > 0) {
          //   subscription.orgs = subscription.orgs.filter(
          //     (orgSubscription) =>
          //       !staleOrgSubscriptionOrgIds.find((id) =>
          //         equals(id, orgSubscription.orgId)
          //       )
          //   );

        }
      } else if (subscription) {
        console.log("first time user subscribes to any org");
        subscription.orgs = newOrgSubscriptions;

        for (const newOrgSubscription of newOrgSubscriptions) {
          let org = await database__WEBPACK_IMPORTED_MODULE_2__/* .models.Org.findOne */ .Cq.Org.findOne({
            _id: newOrgSubscription.org._id
          }).populate("orgSubscriptions");

          if (!org) {
            return res.status(400).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_3__/* .createServerError */ .Eh)(new Error("Vous ne pouvez pas vous abonner à une organisation inexistante")));
          }

          if (!org.orgSubscriptions.find(orgSubscription => (0,utils_string__WEBPACK_IMPORTED_MODULE_5__/* .equals */ .fS)(orgSubscription._id, subscription._id))) {
            org.orgSubscriptions.push(subscription);
            await org.save();
            console.log("org updated with new subscription");
          }
        }
      }
    } else if (body.events) {
      const {
        events: newEventSubscriptions
      } = body;

      if (subscription.events.length > 0) {
        console.log("user already got event subscriptions");

        for (const newEventSubscription of newEventSubscriptions) {
          console.log("newEventSubscription", newEventSubscription);
          const event = await database__WEBPACK_IMPORTED_MODULE_2__/* .models.Event.findOne */ .Cq.Event.findOne({
            _id: newEventSubscription.eventId
          });

          if (!event) {
            return res.status(400).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_3__/* .createServerError */ .Eh)(new Error("Vous ne pouvez pas vous abonner à un événement inexistant")));
          }

          let isFollower;

          for (const eventSubscription of subscription.events) {
            if ((0,utils_string__WEBPACK_IMPORTED_MODULE_5__/* .equals */ .fS)(event._id, eventSubscription.eventId)) {
              isFollower = true;
              break;
            }
          }

          if (isFollower) {
            console.log("user is already following event => replacing old subscription with new one");
            subscription.events = subscription.events.map(eventSubscription => {
              if ((0,utils_string__WEBPACK_IMPORTED_MODULE_5__/* .equals */ .fS)(eventSubscription.eventId, newEventSubscription.eventId)) return newEventSubscription;
              return eventSubscription;
            });
          } else {
            subscription.events.push(newEventSubscription);
          }

          await database__WEBPACK_IMPORTED_MODULE_2__/* .models.Event.updateOne */ .Cq.Event.updateOne({
            _id: event._id
          }, {
            $push: {
              eventSubscriptions: subscription
            }
          });
        } // if (staleEventSubscriptionEventIds.length > 0) {
        //   subscription.events = subscription.events.filter(
        //     (eventSubscription) =>
        //       !staleEventSubscriptionEventIds.find((id) =>
        //         equals(id, eventSubscription.eventId)
        //       )
        //   );
        // }

      } else if (subscription) {
        console.log("first time user subscribes to any event");
        const newEventSubscription = newEventSubscriptions[0];
        let event = await database__WEBPACK_IMPORTED_MODULE_2__/* .models.Event.findOne */ .Cq.Event.findOne({
          _id: newEventSubscription.eventId || newEventSubscription.event._id
        }).populate("eventSubscriptions");

        if (!event) {
          return res.status(400).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_3__/* .createServerError */ .Eh)(new Error("Vous ne pouvez pas vous abonner à un événement inexistant")));
        }

        subscription.events = newEventSubscriptions;
        let found = false;

        for (const eventSubscription of event.eventSubscriptions) {
          if ((0,utils_string__WEBPACK_IMPORTED_MODULE_5__/* .equals */ .fS)(eventSubscription._id, subscription._id)) {
            found = true;
            break;
          }
        }

        if (!found) {
          event.eventSubscriptions.push(subscription);
          await event.save();
        }
      }
    }

    if (body.topics) {
      if (!body.topics.length) {
        subscription.topics = [];
      }

      for (let i = 0; i < body.topics.length; i++) {
        const topicId = body.topics[i].topic._id;
        const topic = await database__WEBPACK_IMPORTED_MODULE_2__/* .models.Topic.findOne */ .Cq.Topic.findOne({
          _id: topicId
        });

        if (!topic) {
          return res.status(404).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_3__/* .createServerError */ .Eh)(new Error(`Vous ne pouvez pas vous abonner à un topic inexistant`)));
        }

        if (Array.isArray(subscription.topics) && subscription.topics.length > 0) {
          console.log("user already got topic subscriptions");

          if (!subscription.topics.find(({
            topic
          }) => typeof topic === "object" ? (0,utils_string__WEBPACK_IMPORTED_MODULE_5__/* .equals */ .fS)(topic._id, topicId) : (0,utils_string__WEBPACK_IMPORTED_MODULE_5__/* .equals */ .fS)(topic, topicId))) {
            subscription.topics.push({
              topic,
              emailNotif: true,
              pushNotif: true
            });
          }
        } else {
          console.log("first time user subscribes to any topic");
          subscription.topics = body.topics;
        }
      }
    }

    console.log("saving subscription", subscription);
    await subscription.save();
    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).json((0,utils_errors__WEBPACK_IMPORTED_MODULE_3__/* .createServerError */ .Eh)(error));
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
var __webpack_exports__ = __webpack_require__.X(0, [8716,9163,8177,6837,4281,8238], function() { return __webpack_exec__(9157); });
module.exports = __webpack_exports__;

})();