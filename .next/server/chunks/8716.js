exports.id = 8716;
exports.ids = [8716];
exports.modules = {

/***/ 8716:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "u1": function() { return /* binding */ isOrgSubscription; },
/* harmony export */   "Nc": function() { return /* binding */ addTagType; },
/* harmony export */   "J8": function() { return /* binding */ removeTagType; },
/* harmony export */   "NY": function() { return /* binding */ SubscriptionTypes; },
/* harmony export */   "GR": function() { return /* binding */ SubscriptionSchema; }
/* harmony export */ });
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5619);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);

const isOrgSubscription = followerSubscription => {
  return followerSubscription.orgId !== undefined;
};
const addTagType = (tagType, followerSubscription) => {
  return followerSubscription.tagTypes && !followerSubscription.tagTypes.includes(tagType) ? [...followerSubscription.tagTypes, tagType] : [tagType];
};
const removeTagType = (tagType, followerSubscription) => {
  if (followerSubscription.tagTypes) {
    if (followerSubscription.tagTypes.includes(tagType)) {
      return followerSubscription.tagTypes.filter(t => t !== tagType);
    }
  }

  return followerSubscription.tagTypes || [];
};
const SubscriptionTypes = {
  SUBSCRIBER: "SUBSCRIBER",
  FOLLOWER: "FOLLOWER"
};
const SubscriptionSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema({
  user: {
    type: mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema.Types.ObjectId,
    ref: "User"
  },
  email: String,
  phone: String,
  // IEventSubscription
  events: [{
    eventId: {
      type: mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema.Types.ObjectId,
      required: true
    },
    event: {
      type: mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema.Types.ObjectId,
      ref: "Event"
    },
    tagTypes: [String]
  }],
  // IOrgSubscription
  orgs: [{
    orgId: {
      type: mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema.Types.ObjectId,
      required: true
    },
    org: {
      type: mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema.Types.ObjectId,
      ref: "Org"
    },
    type: {
      type: String,
      enum: Object.keys(SubscriptionTypes).map(key => SubscriptionTypes[key]),
      required: true
    },
    tagTypes: [String],
    eventCategories: {
      type: [{
        catId: Number,
        emailNotif: Boolean,
        pushNotif: Boolean
      }],
      default: undefined
    }
  }],
  // ITopicSubscription
  topics: [{
    emailNotif: Boolean,
    pushNotif: Boolean,
    topic: {
      type: mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema.Types.ObjectId,
      ref: "Topic"
    }
  }]
}, {
  timestamps: {
    createdAt: "createdAt",
    updatedAt: "updatedAt"
  }
});

/***/ })

};
;