(function() {
var exports = {};
exports.id = 8084;
exports.ids = [8084];
exports.modules = {

/***/ 1443:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3426);
/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var features_session_sessionSlice__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6089);
/* harmony import */ var features_users_usersApi__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4616);
/* harmony import */ var hooks_useAuth__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(8238);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9297);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(79);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _emotion_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(7381);
/* harmony import */ var _emotion_react__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_emotion_react__WEBPACK_IMPORTED_MODULE_6__);








const reload = () => {
  const event = new Event("visibilitychange");
  document.dispatchEvent(event);
};

const Sandbox = () => {
  const {
    data: session,
    loading: isSessionLoading
  } = (0,hooks_useAuth__WEBPACK_IMPORTED_MODULE_3__/* .useSession */ .k)();
  const dispatch = (0,react_redux__WEBPACK_IMPORTED_MODULE_5__.useDispatch)();
  const appSession = (0,react_redux__WEBPACK_IMPORTED_MODULE_5__.useSelector)(features_session_sessionSlice__WEBPACK_IMPORTED_MODULE_1__/* .selectSession */ .Wu);
  console.log(isSessionLoading);
  console.log("s", session === null || session === void 0 ? void 0 : session.user.userName);
  console.log("a", appSession === null || appSession === void 0 ? void 0 : appSession.user.userName);
  const [editUser, editUserMutation] = (0,features_users_usersApi__WEBPACK_IMPORTED_MODULE_2__/* .useEditUserMutation */ .Gl)();
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)((react__WEBPACK_IMPORTED_MODULE_4___default().Fragment), null, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__.Button, {
    onClick: async () => {
      await editUser({
        payload: {
          userName: (session === null || session === void 0 ? void 0 : session.user.userName) === "romseguy" ? "romseguyz" : "romseguy"
        },
        userName: session === null || session === void 0 ? void 0 : session.user.userId
      }).unwrap();
      dispatch((0,features_session_sessionSlice__WEBPACK_IMPORTED_MODULE_1__/* .setSession */ .KY)(null));
    }
  }, "Changer"), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)("br", null), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)("br", null), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__.Button, {
    onClick: () => {
      dispatch((0,features_session_sessionSlice__WEBPACK_IMPORTED_MODULE_1__/* .setSession */ .KY)(null));
    }
  }, "Null"), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)("br", null), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)("br", null), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__.Button, {
    onClick: reload
  }, "Reload"));
};

/* harmony default export */ __webpack_exports__["default"] = (Sandbox);

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

/***/ 9297:
/***/ (function(module) {

"use strict";
module.exports = require("react");;

/***/ }),

/***/ 79:
/***/ (function(module) {

"use strict";
module.exports = require("react-redux");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
var __webpack_exports__ = __webpack_require__.X(0, [8716,8177,6837,4281,8238], function() { return __webpack_exec__(1443); });
module.exports = __webpack_exports__;

})();