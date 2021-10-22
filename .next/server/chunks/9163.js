exports.id = 9163;
exports.ids = [9163];
exports.modules = {

/***/ 9163:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "db": function() { return /* binding */ db; },
  "ZP": function() { return /* binding */ database; },
  "Cq": function() { return /* binding */ models; }
});

// UNUSED EXPORTS: connectToDatabase

// EXTERNAL MODULE: external "mongoose"
var external_mongoose_ = __webpack_require__(5619);
var external_mongoose_default = /*#__PURE__*/__webpack_require__.n(external_mongoose_);
// EXTERNAL MODULE: external "next-connect"
var external_next_connect_ = __webpack_require__(9303);
var external_next_connect_default = /*#__PURE__*/__webpack_require__.n(external_next_connect_);
// EXTERNAL MODULE: ./src/models/Event.ts
var Event = __webpack_require__(7823);
// EXTERNAL MODULE: ./src/models/Org.ts
var Org = __webpack_require__(9759);
// EXTERNAL MODULE: ./src/models/Project.ts
var Project = __webpack_require__(2728);
// EXTERNAL MODULE: external "bcryptjs"
var external_bcryptjs_ = __webpack_require__(2773);
var external_bcryptjs_default = /*#__PURE__*/__webpack_require__.n(external_bcryptjs_);
// EXTERNAL MODULE: ./src/utils/string.ts
var string = __webpack_require__(7535);
;// CONCATENATED MODULE: ./src/models/User.ts



const HASH_ROUNDS = 10;
const UserSchema = new external_mongoose_.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true
  },
  phone: String,
  isOnline: {
    type: Boolean
  },
  password: {
    type: String,
    required: true
  },
  securityCode: String,
  userName: {
    type: String,
    // required: true,
    trim: true
  },
  userImage: {
    base64: String,
    width: Number,
    height: Number
  },
  userSubscription: external_mongoose_.Schema.Types.Mixed,
  isAdmin: Boolean
}, {
  timestamps: {
    createdAt: "createdAt",
    updatedAt: "updatedAt"
  }
});
UserSchema.index({
  email: 1,
  userName: 1
}, {
  unique: true
});

UserSchema.methods.validatePassword = async function (pass) {
  return external_bcryptjs_default().compare(pass, this.password);
};

UserSchema.pre("save", async function (next) {
  // here we need to retype 'this' because by default it is
  // of type Document from which the 'IUser' interface is inheriting
  // but the Document does not know about our password property
  const thisObj = this;

  if (this.isModified("password")) {
    try {
      const salt = await external_bcryptjs_default().genSalt(HASH_ROUNDS);
      const hash = await external_bcryptjs_default().hash(thisObj.password, salt);
      thisObj.password = hash;
    } catch (error) {
      return next(error);
    }
  }

  if (this.isModified("email")) {
    try {
      // const name = normalize(thisObj.email.replace(/@.+/, ""));
      // const userName = name.match(/[0-9]/) === null ? name + randomNumber(4) : name;
      thisObj.userName = (0,string/* normalize */.Fv)(thisObj.email.replace(/@.+/, ""));
    } catch (error) {
      return next(error);
    }
  }

  return next();
});
UserSchema.pre("updateOne", async function (next) {
  // this.set({ updatedAt: new Date() });
  const {
    password
  } = this.getUpdate();

  if (!password) {
    return next();
  }

  try {
    const salt = await external_bcryptjs_default().genSalt(HASH_ROUNDS);
    const hash = await external_bcryptjs_default().hash(password, salt);
    this.update({}, {
      password: hash
    }).exec();
    next();
  } catch (error) {
    return next(error);
  }

  return next();
});
// EXTERNAL MODULE: ./src/models/Subscription.ts
var Subscription = __webpack_require__(8716);
// EXTERNAL MODULE: ./src/models/Topic.ts + 1 modules
var Topic = __webpack_require__(3921);
;// CONCATENATED MODULE: ./src/database.ts








let connection;
let db;
let models;
const middleware = external_next_connect_default()();
const connectToDatabase = async () => {
  if (!connection) {
    connection = await external_mongoose_default().createConnection(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    });
    db = connection.db;
    models = {
      Event: connection.model("Event", Event/* EventSchema */.Q9),
      Org: connection.model("Org", Org/* OrgSchema */.cU),
      Project: connection.model("Project", Project/* ProjectSchema */.B5),
      Subscription: connection.model("Subscription", Subscription/* SubscriptionSchema */.GR),
      Topic: connection.model("Topic", Topic/* TopicSchema */.$9),
      User: connection.model("User", UserSchema)
    };
  }

  return connection;
};
middleware.use(async (req, res, next) => {
  await connectToDatabase();
  return next();
});
/* harmony default export */ var database = (middleware);

/***/ }),

/***/ 7823:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WD": function() { return /* binding */ Category; },
/* harmony export */   "Sk": function() { return /* binding */ StatusTypes; },
/* harmony export */   "EE": function() { return /* binding */ StatusTypesV; },
/* harmony export */   "Hk": function() { return /* binding */ Visibility; },
/* harmony export */   "XO": function() { return /* binding */ VisibilityV; },
/* harmony export */   "po": function() { return /* binding */ isAttending; },
/* harmony export */   "iu": function() { return /* binding */ isNotAttending; },
/* harmony export */   "Q9": function() { return /* binding */ EventSchema; }
/* harmony export */ });
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5619);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }


const Category = [{
  label: "À définir",
  bgColor: "gray"
}, {
  label: "Atelier",
  bgColor: "red"
}, {
  label: "Chantier participatif",
  bgColor: "orange"
}, {
  label: "Concert",
  bgColor: "green.300"
}, {
  label: "Exposition",
  bgColor: "green.600"
}, {
  label: "Fête",
  bgColor: "blue.300"
}, {
  label: "Festival",
  bgColor: "blue.600"
}, {
  label: "Jam session",
  bgColor: "purple.300"
}, {
  label: "Réunion",
  bgColor: "purple.600"
}, {
  label: "Autre",
  bgColor: "transparent"
}].reduce((obj, cat, index) => _objectSpread(_objectSpread({}, obj), {}, {
  [index]: cat
}), {});
const StatusTypes = {
  PENDING: "PENDING",
  OK: "OK",
  NOK: "NOK"
};
const StatusTypesV = {
  PENDING: "Invitation envoyée",
  OK: "Participant",
  NOK: "Invitation refusée"
};
const Visibility = {
  PUBLIC: "PUBLIC",
  SUBSCRIBERS: "SUBSCRIBERS"
};
const VisibilityV = {
  PUBLIC: "Publique",
  SUBSCRIBERS: "Adhérents"
};
const isAttending = ({
  email,
  event
}) => {
  var _event$eventNotified;

  if (!email) return false;
  return !!((_event$eventNotified = event.eventNotified) !== null && _event$eventNotified !== void 0 && _event$eventNotified.find(({
    email: e,
    status
  }) => {
    return e === email && status === StatusTypes.OK;
  }));
};
const isNotAttending = ({
  email,
  event
}) => {
  var _event$eventNotified2;

  if (!email) return false;
  return !!((_event$eventNotified2 = event.eventNotified) !== null && _event$eventNotified2 !== void 0 && _event$eventNotified2.find(({
    email: e,
    status
  }) => {
    return e === email && status === StatusTypes.NOK;
  }));
};
const EventSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema({
  eventName: {
    type: String,
    required: true
  },
  eventUrl: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  eventMinDate: {
    type: String,
    required: true
  },
  eventMaxDate: {
    type: String,
    required: true
  },
  eventAddress: String,
  eventCity: String,
  eventLat: Number,
  eventLng: Number,
  eventEmail: [{
    email: String
  }],
  eventPhone: [{
    phone: String
  }],
  eventWeb: [{
    url: String,
    prefix: String
  }],
  eventDescription: String,
  eventCategory: Number,
  eventVisibility: {
    type: String,
    enum: Object.keys(Visibility).map(key => Visibility[key])
  },
  eventOrgs: [{
    type: mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema.Types.ObjectId,
    ref: "Org"
  }],
  eventSubscriptions: [{
    type: mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema.Types.ObjectId,
    ref: "Subscription",
    required: true
  }],
  eventTopics: [{
    type: mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema.Types.ObjectId,
    ref: "Topic"
  }],
  eventNotified: [{
    email: String,
    phone: String,
    status: {
      type: String,
      enum: Object.keys(StatusTypes).map(key => StatusTypes[key])
    }
  }],
  eventLogo: {
    base64: String,
    width: Number,
    height: Number
  },
  eventBanner: {
    base64: String,
    height: Number,
    mode: String,
    url: String
  },
  createdBy: {
    type: mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema.Types.ObjectId,
    ref: "User"
  },
  repeat: Number,
  otherDays: [{
    dayNumber: Number,
    startDate: String,
    endTime: String
  }],
  isApproved: Boolean,
  forwardedFrom: {
    eventId: {
      type: mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema.Types.ObjectId,
      ref: "Event"
    },
    eventUrl: String
  }
}, {
  timestamps: {
    createdAt: "createdAt",
    updatedAt: "updatedAt"
  }
});

/***/ }),

/***/ 9759:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "T": function() { return /* binding */ OrgTypes; },
/* harmony export */   "D2": function() { return /* binding */ OrgTypesV; },
/* harmony export */   "EE": function() { return /* binding */ Visibility; },
/* harmony export */   "XO": function() { return /* binding */ VisibilityV; },
/* harmony export */   "rY": function() { return /* binding */ orgTypeFull; },
/* harmony export */   "pP": function() { return /* binding */ orgTypeFull2; },
/* harmony export */   "Dk": function() { return /* binding */ orgTypeFull3; },
/* harmony export */   "cU": function() { return /* binding */ OrgSchema; }
/* harmony export */ });
/* unused harmony export orgTypeFull4 */
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5619);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);

const OrgTypes = {
  ASSO: "ASSO",
  GROUP: "GROUP"
};
const OrgTypesV = {
  ASSO: "Association",
  GROUP: "Groupe"
};
const Visibility = {
  PUBLIC: "PUBLIC",
  PRIVATE: "PRIVATE"
};
const VisibilityV = {
  PUBLIC: "Publique",
  PRIVATE: "Privée"
};
const orgTypeFull = orgType => {
  if (!orgType) return "";
  return `${orgType === OrgTypes.ASSO ? "de l'" : "du "}${OrgTypesV[orgType].toLowerCase()}`;
};
const orgTypeFull2 = orgType => `${orgType === OrgTypes.ASSO ? "à l'" : "au "}${OrgTypesV[orgType].toLowerCase()}`;
const orgTypeFull3 = orgType => {
  if (!orgType) return "une organisation";
  return `${orgType === OrgTypes.ASSO ? "une " : "un "}${OrgTypesV[orgType].toLowerCase()}`;
};
const orgTypeFull4 = orgType => `${orgType === OrgTypes.ASSO ? "cette " : "ce "}${OrgTypesV[orgType].toLowerCase()}`;
const OrgSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema({
  orgName: {
    type: String,
    required: true
  },
  orgUrl: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  orgType: {
    type: String,
    enum: Object.keys(OrgTypes).map(key => OrgTypes[key]),
    required: true
  },
  orgAddress: String,
  orgCity: String,
  orgLat: Number,
  orgLng: Number,
  orgEmail: [{
    email: String
  }],
  orgPhone: [{
    phone: String
  }],
  orgWeb: [{
    url: String,
    prefix: String
  }],
  orgDescription: String,
  orgEvents: [{
    type: mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema.Types.ObjectId,
    ref: "Event"
  }],
  orgProjects: [{
    type: mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema.Types.ObjectId,
    ref: "Project"
  }],
  orgSubscriptions: [{
    type: mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema.Types.ObjectId,
    ref: "Subscription",
    required: true
  }],
  orgTopics: [{
    type: mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema.Types.ObjectId,
    ref: "Topic"
  }],
  orgLogo: {
    base64: String,
    width: Number,
    height: Number
  },
  orgBanner: {
    base64: String,
    width: Number,
    height: Number,
    mode: String,
    url: String
  },
  orgVisibility: {
    type: String,
    enum: Object.keys(Visibility).map(key => Visibility[key])
  },
  isApproved: Boolean,
  createdBy: {
    type: mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema.Types.ObjectId,
    ref: "User"
  }
}, {
  timestamps: {
    createdAt: "createdAt",
    updatedAt: "updatedAt"
  }
});

/***/ }),

/***/ 2728:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Hk": function() { return /* binding */ Visibility; },
/* harmony export */   "XO": function() { return /* binding */ VisibilityV; },
/* harmony export */   "qb": function() { return /* binding */ Status; },
/* harmony export */   "cZ": function() { return /* binding */ StatusV; },
/* harmony export */   "Sk": function() { return /* binding */ StatusTypes; },
/* harmony export */   "EE": function() { return /* binding */ StatusTypesV; },
/* harmony export */   "po": function() { return /* binding */ isAttending; },
/* harmony export */   "B5": function() { return /* binding */ ProjectSchema; }
/* harmony export */ });
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5619);
/* harmony import */ var mongoose__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mongoose__WEBPACK_IMPORTED_MODULE_0__);

const Visibility = {
  PUBLIC: "PUBLIC",
  SUBSCRIBERS: "SUBSCRIBERS",
  FOLLOWERS: "FOLLOWERS"
};
const VisibilityV = {
  PUBLIC: "Publique",
  SUBSCRIBERS: "Adhérents",
  FOLLOWERS: "Abonnés"
};
const Status = {
  PENDING: "PENDING",
  ONGOING: "ONGOING",
  FINISHED: "FINISHED"
};
const StatusV = {
  PENDING: "En attente",
  ONGOING: "En cours",
  FINISHED: "Terminé"
};
const StatusTypes = {
  PENDING: "PENDING",
  OK: "OK",
  NOK: "NOK"
};
const StatusTypesV = {
  PENDING: "Invitation envoyée",
  OK: "Participant",
  NOK: "Invitation refusée"
};
const isAttending = ({
  email,
  project
}) => {
  var _project$projectNotif;

  if (email === "") return false;
  return !!((_project$projectNotif = project.projectNotified) !== null && _project$projectNotif !== void 0 && _project$projectNotif.find(({
    email: e,
    status
  }) => {
    return e === email && status === StatusTypes.OK;
  }));
};
const ProjectSchema = new mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema({
  projectName: {
    type: String,
    required: true,
    trim: true
  },
  projectDescription: {
    type: String,
    trim: true
  },
  projectOrgs: [{
    type: mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema.Types.ObjectId,
    ref: "Org"
  }],
  projectStatus: {
    type: String,
    enum: Object.keys(Status).map(key => Status[key])
  },
  projectVisibility: {
    type: String,
    enum: Object.keys(Visibility).map(key => Visibility[key])
  },
  projectNotified: [{
    email: String,
    status: {
      type: String,
      enum: Object.keys(StatusTypes).map(key => StatusTypes[key])
    }
  }],
  forwardedFrom: {
    projectId: {
      type: mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema.Types.ObjectId,
      ref: "Project"
    }
  },
  createdBy: {
    type: mongoose__WEBPACK_IMPORTED_MODULE_0__.Schema.Types.ObjectId,
    ref: "User"
  }
}, {
  timestamps: {
    createdAt: "createdAt",
    updatedAt: "updatedAt"
  }
});

/***/ }),

/***/ 3921:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "$9": function() { return /* binding */ TopicSchema; },
  "EE": function() { return /* binding */ Visibility; },
  "XO": function() { return /* binding */ VisibilityV; }
});

// EXTERNAL MODULE: external "mongoose"
var external_mongoose_ = __webpack_require__(5619);
;// CONCATENATED MODULE: ./src/models/TopicMessage.ts

const TopicMessageSchema = new external_mongoose_.Schema({
  message: {
    type: String,
    required: true,
    trim: true
  },
  createdBy: {
    type: external_mongoose_.Schema.Types.ObjectId,
    ref: "User"
  }
}, {
  timestamps: {
    createdAt: "createdAt",
    updatedAt: "updatedAt"
  }
});
;// CONCATENATED MODULE: ./src/models/Topic.ts


const Visibility = {
  PUBLIC: "PUBLIC",
  SUBSCRIBERS: "SUBSCRIBERS",
  FOLLOWERS: "FOLLOWERS"
};
const VisibilityV = {
  PUBLIC: "Publique",
  SUBSCRIBERS: "Adhérents",
  FOLLOWERS: "Abonnés"
};
const TopicSchema = new external_mongoose_.Schema({
  topicName: {
    type: String,
    required: true,
    trim: true
  },
  topicMessages: [TopicMessageSchema],
  topicVisibility: {
    type: String,
    enum: Object.keys(Visibility).map(key => Visibility[key])
  },
  org: {
    type: external_mongoose_.Schema.Types.ObjectId,
    ref: "Org"
  },
  event: {
    type: external_mongoose_.Schema.Types.ObjectId,
    ref: "Event"
  },
  topicNotified: [{
    email: String
  }],
  createdBy: {
    type: external_mongoose_.Schema.Types.ObjectId,
    ref: "User"
  }
}, {
  timestamps: {
    createdAt: "createdAt",
    updatedAt: "updatedAt"
  }
});

/***/ }),

/***/ 7535:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "S9": function() { return /* binding */ phoneR; },
/* harmony export */   "Ki": function() { return /* binding */ getUniqueId; },
/* harmony export */   "Fv": function() { return /* binding */ normalize; },
/* harmony export */   "fS": function() { return /* binding */ equals; },
/* harmony export */   "BB": function() { return /* binding */ toString; },
/* harmony export */   "eh": function() { return /* binding */ base64ToUint8Array; },
/* harmony export */   "Or": function() { return /* binding */ isImage; }
/* harmony export */ });
/* unused harmony exports capitalize, getStyleObjectFromString */
const phoneR = /^[0-9]{10,}$/i;
function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.substring(1, string.length);
}
function getUniqueId(prefix) {
  const time = new Date().getTime() + Math.round(Math.random() * 100);
  return `${prefix || "uid-"}${time}`;
}
function normalize(str, underscores) {
  str = str.trim();
  str = str.replace(/\//g, "");
  str = str.replace(/\s{2,}/g, " ");
  str = str.replace(/\ /g, "_");
  return str.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}
function equals(a, b) {
  if (typeof a === "string" && typeof b === "string") a === b;
  let aa = a;
  let bb = b;
  if (typeof a === "object" && a.toString) aa = a.toString();
  if (typeof b === "object" && b.toString) bb = b.toString();
  return aa === bb;
}
function toString(a) {
  if (typeof a === "object" && a.toString) return a.toString();
  return "" + a;
}

const formatStringToCamelCase = str => {
  const splitted = str.split("-");
  if (splitted.length === 1) return splitted[0];
  return splitted[0] + splitted.slice(1).map(word => word[0].toUpperCase() + word.slice(1)).join("");
};

const getStyleObjectFromString = str => {
  const style = {};
  str.split(";").forEach(el => {
    const [property, value] = el.split(":");
    console.log(property, value);
    if (!property || !value) return;
    const formattedProperty = formatStringToCamelCase(property.trim());
    style[formattedProperty] = value.trim();
  });
  return style;
};
const base64ToUint8Array = base64 => {
  const padding = "=".repeat((4 - base64.length % 4) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(b64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};
const isImage = fileName => {
  return fileName.includes(".png") || fileName.includes(".jpg") || fileName.includes(".jpeg") || fileName.includes(".bmp") || fileName.includes(".webp");
};

/***/ })

};
;