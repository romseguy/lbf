(function() {
var exports = {};
exports.id = 2568;
exports.ids = [2568];
exports.modules = {

/***/ 4600:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ forum; }
});

// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(9297);
// EXTERNAL MODULE: external "next/router"
var router_ = __webpack_require__(6731);
// EXTERNAL MODULE: ./src/hooks/useAuth.ts
var useAuth = __webpack_require__(8238);
// EXTERNAL MODULE: ./src/features/orgs/orgsApi.ts
var orgsApi = __webpack_require__(2207);
// EXTERNAL MODULE: ./src/features/forum/TopicsList.tsx + 7 modules
var TopicsList = __webpack_require__(1929);
// EXTERNAL MODULE: ./src/features/subscriptions/subscriptionsApi.ts
var subscriptionsApi = __webpack_require__(1096);
// EXTERNAL MODULE: ./src/features/subscriptions/subscriptionSlice.ts
var subscriptionSlice = __webpack_require__(1430);
// EXTERNAL MODULE: external "react-redux"
var external_react_redux_ = __webpack_require__(79);
// EXTERNAL MODULE: external "@chakra-ui/react"
var react_ = __webpack_require__(3426);
// EXTERNAL MODULE: ./src/features/users/userSlice.ts
var userSlice = __webpack_require__(3185);
// EXTERNAL MODULE: external "@emotion/react"
var external_emotion_react_ = __webpack_require__(7381);
;// CONCATENATED MODULE: ./src/features/forum/Forum.tsx











const Forum = ({
  isLogin,
  setIsLogin
}) => {
  const router = (0,router_.useRouter)();
  const {
    data: session,
    loading: isSessionLoading
  } = (0,useAuth/* useSession */.k)();
  const userEmail = (0,external_react_redux_.useSelector)(userSlice/* selectUserEmail */.I_) || (session === null || session === void 0 ? void 0 : session.user.email); //#region org

  const query = (0,orgsApi/* useGetOrgQuery */.iA)({
    orgUrl: "aucourant",
    populate: "orgTopics orgSubscriptions"
  });
  const org = query.data;
  let isCreator = false;

  if (session && org) {
    if (typeof org.createdBy === "object" && org.createdBy._id === session.user.userId) {
      isCreator = true;
    } else if (org.createdBy === session.user.userId) {
      isCreator = true;
    }
  } //#endregion
  //#region subscription


  const subQuery = (0,subscriptionsApi/* useGetSubscriptionQuery */.xu)(userEmail);
  const {
    0: isFollowed,
    1: setIsFollowed
  } = (0,external_react_.useState)(!!(0,subscriptionSlice/* isFollowedBy */.C3)({
    org,
    subQuery
  }));
  const {
    0: isSubscribed,
    1: setIsSubscribed
  } = (0,external_react_.useState)((0,subscriptionSlice/* isSubscribedBy */.eM)(org, subQuery));
  (0,external_react_.useEffect)(() => {
    if (org && subQuery.data) {
      setIsFollowed(!!(0,subscriptionSlice/* isFollowedBy */.C3)({
        org,
        subQuery
      }));
      setIsSubscribed((0,subscriptionSlice/* isSubscribedBy */.eM)(org, subQuery));
    }
  }, [org, subQuery.data]); //#endregion

  if (query.isLoading) {
    return (0,external_emotion_react_.jsx)(react_.Spinner, null);
  }

  if (!org) return null;
  return (0,external_emotion_react_.jsx)(TopicsList/* TopicsList */.v, {
    org: org,
    query: query,
    subQuery: subQuery,
    isCreator: isCreator,
    isFollowed: isFollowed,
    isSubscribed: isSubscribed,
    setIsLogin: setIsLogin,
    isLogin: isLogin
  });
};
// EXTERNAL MODULE: ./src/features/layout/index.tsx + 13 modules
var layout = __webpack_require__(4497);
// EXTERNAL MODULE: external "react-device-detect"
var external_react_device_detect_ = __webpack_require__(2047);
;// CONCATENATED MODULE: ./src/pages/forum.tsx
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }







const ForumPage = props => {
  const {
    0: isLogin,
    1: setIsLogin
  } = (0,external_react_.useState)(0);
  return (0,external_emotion_react_.jsx)(layout/* Layout */.Ar, _extends({
    pageTitle: "Forum",
    isLogin: isLogin,
    p: external_react_device_detect_.isMobile ? 5 : 5
  }, props), (0,external_emotion_react_.jsx)(Forum, {
    isLogin: isLogin,
    setIsLogin: setIsLogin
  }));
};

/* harmony default export */ var forum = (ForumPage);

/***/ }),

/***/ 3321:
/***/ (function(module) {

"use strict";
module.exports = require("@chakra-ui/color-mode");;

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

/***/ 8547:
/***/ (function(module) {

"use strict";
module.exports = require("@chakra-ui/theme-tools");;

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

/***/ 612:
/***/ (function(module) {

"use strict";
module.exports = require("@react-icons/all-files/fa/FaBell.js");;

/***/ }),

/***/ 1054:
/***/ (function(module) {

"use strict";
module.exports = require("@react-icons/all-files/fa/FaBellSlash.js");;

/***/ }),

/***/ 8237:
/***/ (function(module) {

"use strict";
module.exports = require("@react-icons/all-files/fa/FaGlobeEurope.js");;

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

/***/ 8669:
/***/ (function(module) {

"use strict";
module.exports = require("@react-icons/all-files/fa/FaPowerOff.js");;

/***/ }),

/***/ 8209:
/***/ (function(module) {

"use strict";
module.exports = require("@react-icons/all-files/fa/FaRegCalendarCheck.js");;

/***/ }),

/***/ 9501:
/***/ (function(module) {

"use strict";
module.exports = require("@react-icons/all-files/fa/FaRegCalendarTimes.js");;

/***/ }),

/***/ 739:
/***/ (function(module) {

"use strict";
module.exports = require("@react-icons/all-files/fa/FaSun.js");;

/***/ }),

/***/ 4244:
/***/ (function(module) {

"use strict";
module.exports = require("@react-icons/all-files/io/IoIosPeople.js");;

/***/ }),

/***/ 1917:
/***/ (function(module) {

"use strict";
module.exports = require("@react-icons/all-files/io/IoMdPerson.js");;

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

/***/ 3082:
/***/ (function(module) {

"use strict";
module.exports = require("isomorphic-dompurify");;

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

/***/ 701:
/***/ (function(module) {

"use strict";
module.exports = require("next/head");;

/***/ }),

/***/ 6731:
/***/ (function(module) {

"use strict";
module.exports = require("next/router");;

/***/ }),

/***/ 1687:
/***/ (function(module) {

"use strict";
module.exports = require("nextjs-progressbar");;

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

/***/ 8064:
/***/ (function(module) {

"use strict";
module.exports = require("react-detect-offline");;

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

/***/ 724:
/***/ (function(module) {

"use strict";
module.exports = require("react-select");;

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
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
var __webpack_exports__ = __webpack_require__.X(0, [1664,5328,8716,9163,8177,6837,4281,8238,3831,4497,8739,1929], function() { return __webpack_exec__(4600); });
module.exports = __webpack_exports__;

})();