(function() {
var exports = {};
exports.id = 3726;
exports.ids = [3726];
exports.modules = {

/***/ 7345:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ orgs; }
});

// EXTERNAL MODULE: external "@react-icons/all-files/fa/FaRegMap.js"
var FaRegMap_js_ = __webpack_require__(5504);
// EXTERNAL MODULE: external "@chakra-ui/react"
var react_ = __webpack_require__(3426);
// EXTERNAL MODULE: ./src/features/layout/index.tsx + 13 modules
var layout = __webpack_require__(4497);
// EXTERNAL MODULE: ./src/features/modals/MapModal.tsx + 4 modules
var MapModal = __webpack_require__(3494);
// EXTERNAL MODULE: ./src/features/orgs/orgsApi.ts
var orgsApi = __webpack_require__(2207);
// EXTERNAL MODULE: ./src/features/orgs/orgSlice.ts
var orgSlice = __webpack_require__(1442);
// EXTERNAL MODULE: ./src/features/common/index.tsx + 23 modules
var common = __webpack_require__(1109);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(9297);
// EXTERNAL MODULE: external "@emotion/react"
var external_emotion_react_ = __webpack_require__(7381);
;// CONCATENATED MODULE: ./src/features/orgs/OrgsList.tsx




const OrgsList = ({
  orgsQuery
}) => {
  var _orgsQuery$data;

  return (0,external_emotion_react_.jsx)(react_.Box, {
    overflowX: "auto"
  }, (0,external_emotion_react_.jsx)(react_.Table, null, (0,external_emotion_react_.jsx)(react_.Thead, null, (0,external_emotion_react_.jsx)(react_.Tr, null, (0,external_emotion_react_.jsx)(react_.Th, null, "Nom"), (0,external_emotion_react_.jsx)(react_.Th, null, "Adresse"))), (0,external_emotion_react_.jsx)(react_.Tbody, null, orgsQuery.isLoading ? (0,external_emotion_react_.jsx)(react_.Tr, null, (0,external_emotion_react_.jsx)(react_.Td, {
    colSpan: 4
  }, (0,external_emotion_react_.jsx)(react_.Spinner, null))) : (_orgsQuery$data = orgsQuery.data) === null || _orgsQuery$data === void 0 ? void 0 : _orgsQuery$data.map(org => {
    if (org.orgName === "aucourant") return;
    return (0,external_emotion_react_.jsx)(react_.Tr, {
      key: `org-${org._id}`
    }, (0,external_emotion_react_.jsx)(react_.Td, null, (0,external_emotion_react_.jsx)(common/* Link */.rU, {
      variant: "underline",
      href: `/${org.orgUrl}`
    }, org.orgName)), (0,external_emotion_react_.jsx)(react_.Td, null, org.orgCity));
  }))));
};
// EXTERNAL MODULE: external "react-redux"
var external_react_redux_ = __webpack_require__(79);
;// CONCATENATED MODULE: ./src/pages/orgs.tsx











const OrgsPage = props => {
  var _orgsQuery$data;

  const orgsQuery = (0,orgsApi/* useGetOrgsQuery */.Gt)({});
  const refetchOrgs = (0,external_react_redux_.useSelector)(orgSlice/* selectOrgsRefetch */.Z8);
  (0,external_react_.useEffect)(() => {
    orgsQuery.refetch();
  }, [refetchOrgs]);
  const {
    isOpen: isMapModalOpen,
    onOpen: openMapModal,
    onClose: closeMapModal
  } = (0,react_.useDisclosure)({
    defaultIsOpen: false
  });
  return (0,external_emotion_react_.jsx)(layout/* Layout */.Ar, props, (0,external_emotion_react_.jsx)(react_.Button, {
    colorScheme: "teal",
    isDisabled: !orgsQuery.data || !orgsQuery.data.length,
    leftIcon: (0,external_emotion_react_.jsx)(FaRegMap_js_.FaRegMap, null),
    onClick: openMapModal,
    mb: 3
  }, "Carte des organisations"), (0,external_emotion_react_.jsx)(OrgsList, {
    orgsQuery: orgsQuery
  }), isMapModalOpen && (0,external_emotion_react_.jsx)(MapModal/* MapModal */.V, {
    isOpen: isMapModalOpen,
    orgs: ((_orgsQuery$data = orgsQuery.data) === null || _orgsQuery$data === void 0 ? void 0 : _orgsQuery$data.filter(org => typeof org.orgLat === "number" && typeof org.orgLng === "number" && org.orgName !== "aucourant")) || [],
    onClose: closeMapModal
  }));
};

/* harmony default export */ var orgs = (OrgsPage);

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

/***/ 9443:
/***/ (function(module) {

"use strict";
module.exports = require("@googlemaps/markerclustererplus");;

/***/ }),

/***/ 5228:
/***/ (function(module) {

"use strict";
module.exports = require("@hookform/error-message");;

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

/***/ 2276:
/***/ (function(module) {

"use strict";
module.exports = require("@react-icons/all-files/fa/FaMapMarkerAlt.js");;

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

/***/ 5504:
/***/ (function(module) {

"use strict";
module.exports = require("@react-icons/all-files/fa/FaRegMap.js");;

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

/***/ 5403:
/***/ (function(module) {

"use strict";
module.exports = require("google-map-react");;

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

/***/ 2268:
/***/ (function(module) {

"use strict";
module.exports = require("react-dom");;

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
var __webpack_exports__ = __webpack_require__.X(0, [1664,5328,8716,9163,8177,6837,4281,8238,3831,4497,1240,3494], function() { return __webpack_exec__(7345); });
module.exports = __webpack_exports__;

})();