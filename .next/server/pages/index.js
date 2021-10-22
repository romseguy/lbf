(function() {
var exports = {};
exports.id = 5405;
exports.ids = [5405];
exports.modules = {

/***/ 3394:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ pages; }
});

;// CONCATENATED MODULE: external "@react-icons/all-files/io/IoIosChatbubbles.js"
var IoIosChatbubbles_js_namespaceObject = require("@react-icons/all-files/io/IoIosChatbubbles.js");;
// EXTERNAL MODULE: external "@react-icons/all-files/io/IoMdPerson.js"
var IoMdPerson_js_ = __webpack_require__(1917);
// EXTERNAL MODULE: external "@react-icons/all-files/io/IoIosPeople.js"
var IoIosPeople_js_ = __webpack_require__(4244);
// EXTERNAL MODULE: external "@chakra-ui/icons"
var icons_ = __webpack_require__(3724);
// EXTERNAL MODULE: external "@chakra-ui/react"
var react_ = __webpack_require__(3426);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(9297);
var external_react_default = /*#__PURE__*/__webpack_require__.n(external_react_);
// EXTERNAL MODULE: ./src/features/common/index.tsx + 23 modules
var common = __webpack_require__(1109);
// EXTERNAL MODULE: external "@react-icons/all-files/fa/FaRegMap.js"
var FaRegMap_js_ = __webpack_require__(5504);
// EXTERNAL MODULE: external "next/router"
var router_ = __webpack_require__(6731);
// EXTERNAL MODULE: ./src/features/modals/MapModal.tsx + 4 modules
var MapModal = __webpack_require__(3494);
// EXTERNAL MODULE: ./src/models/Event.ts
var Event = __webpack_require__(7823);
// EXTERNAL MODULE: ./src/features/events/eventsApi.ts
var eventsApi = __webpack_require__(9416);
// EXTERNAL MODULE: ./src/features/events/EventsList.tsx + 7 modules
var EventsList = __webpack_require__(1526);
// EXTERNAL MODULE: external "@emotion/react"
var external_emotion_react_ = __webpack_require__(7381);
;// CONCATENATED MODULE: ./src/features/events/EventsPage.tsx










const EventsPage = ({}) => {
  var _eventsQuery$data;

  const router = (0,router_.useRouter)();
  const eventsQuery = (0,eventsApi/* useGetEventsQuery */.kg)();
  (0,external_react_.useEffect)(() => {
    console.log("refetching events");
    eventsQuery.refetch();
  }, [router.asPath]);
  const events = (_eventsQuery$data = eventsQuery.data) === null || _eventsQuery$data === void 0 ? void 0 : _eventsQuery$data.filter(event => {
    if (event.forwardedFrom && event.forwardedFrom.eventId) return false;
    if (event.eventVisibility !== Event/* Visibility.PUBLIC */.Hk.PUBLIC) return false;
    return event.isApproved;
  });
  const {
    isOpen: isMapModalOpen,
    onOpen: openMapModal,
    onClose: closeMapModal
  } = (0,react_.useDisclosure)({
    defaultIsOpen: false
  });
  return (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, (0,external_emotion_react_.jsx)(common/* Button */.zx, {
    colorScheme: "teal",
    isLoading: eventsQuery.isLoading,
    isDisabled: !events || !events.length,
    leftIcon: (0,external_emotion_react_.jsx)(FaRegMap_js_.FaRegMap, null),
    onClick: openMapModal,
    mb: 5
  }, "Carte des \xE9v\xE9nements"), eventsQuery.isLoading || eventsQuery.isFetching ? (0,external_emotion_react_.jsx)(react_.Text, null, "Chargement des \xE9v\xE9nements publics...") : events && (0,external_emotion_react_.jsx)("div", null, (0,external_emotion_react_.jsx)(EventsList/* EventsList */.i, {
    events: events,
    eventsQuery: eventsQuery
  }), (0,external_emotion_react_.jsx)(common/* IconFooter */.AW, null)), isMapModalOpen && (0,external_emotion_react_.jsx)(MapModal/* MapModal */.V, {
    isOpen: isMapModalOpen,
    events: (events === null || events === void 0 ? void 0 : events.filter(event => {
      return typeof event.eventLat === "number" && typeof event.eventLng === "number" && event.eventVisibility === Event/* Visibility.PUBLIC */.Hk.PUBLIC;
    })) || [],
    onClose: closeMapModal
  }));
};
// EXTERNAL MODULE: ./src/features/layout/index.tsx + 13 modules
var layout = __webpack_require__(4497);
;// CONCATENATED MODULE: ./src/pages/index.tsx











const IndexPage = props => {
  const {
    colorMode
  } = (0,react_.useColorMode)();
  const isDark = colorMode === "dark";
  const {
    0: isAbout,
    1: setIsAbout
  } = (0,external_react_.useState)(false);

  const orgs = plural => (0,external_emotion_react_.jsx)(react_.Text, {
    color: isDark ? "green.200" : "green",
    display: "inline"
  }, (0,external_emotion_react_.jsx)(react_.Icon, {
    as: IoIosPeople_js_.IoIosPeople
  }), " ", (0,external_emotion_react_.jsx)(common/* Link */.rU, {
    href: "/orgs"
  }, "organisation", plural ? "s" : ""));

  const subscribers = plural => (0,external_emotion_react_.jsx)(react_.Text, {
    color: isDark ? "green.200" : "green",
    display: "inline"
  }, (0,external_emotion_react_.jsx)(react_.Icon, {
    as: IoMdPerson_js_.IoMdPerson
  }), "adh\xE9rent", plural ? "s" : "");

  return (0,external_emotion_react_.jsx)(layout/* Layout */.Ar, props,  true ? (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null,  false && 0, isAbout && (0,external_emotion_react_.jsx)(react_.Container, {
    maxW: "xl",
    mb: 3,
    p: "4",
    bg: isDark ? "gray.500" : "white",
    borderRadius: "lg"
  }, (0,external_emotion_react_.jsx)(react_.Text, {
    align: "justify",
    mb: 3
  }, "La premi\xE8re vocation de cet outil de communication est de co-cr\xE9er un ", (0,external_emotion_react_.jsx)("strong", null, "calendrier local"), "."), (0,external_emotion_react_.jsx)(react_.Heading, {
    size: "md",
    mb: 3
  }, "Vous \xEAtes un particulier :"), (0,external_emotion_react_.jsx)(react_.Container, {
    borderWidth: 1,
    borderColor: "gray.200",
    borderRadius: "lg",
    p: 3,
    maxW: "xl",
    mb: 3
  }, (0,external_emotion_react_.jsx)(react_.List, {
    spacing: 1
  }, (0,external_emotion_react_.jsx)(react_.ListItem, {
    align: "justify"
  }, (0,external_emotion_react_.jsx)(react_.ListIcon, {
    as: icons_.EmailIcon
  }), "Abonnez-vous aux ", orgs(true), " et recevez un e-mail lors de la publication d'un nouvel \xE9v\xE9nement."), (0,external_emotion_react_.jsx)(react_.ListItem, {
    align: "justify"
  }, (0,external_emotion_react_.jsx)(react_.ListIcon, {
    as: IoIosChatbubbles_js_namespaceObject.IoIosChatbubbles
  }), "Participez aux discussions sur les pages des ", orgs(true), ", des \xE9v\xE9nements, et du", " ", (0,external_emotion_react_.jsx)(common/* Link */.rU, {
    variant: "underline",
    href: "/forum"
  }, (0,external_emotion_react_.jsx)(react_.Tag, null, (0,external_emotion_react_.jsx)(react_.TagLeftIcon, {
    as: icons_.ChatIcon
  }), " Forum"))))), (0,external_emotion_react_.jsx)(react_.Heading, {
    size: "md",
    mb: 3
  }, "Vous \xEAtes une ", orgs(), " (association, groupe, ...) :"), (0,external_emotion_react_.jsx)(react_.Container, {
    borderWidth: 1,
    borderColor: "gray.200",
    borderRadius: "lg",
    p: 3,
    maxW: "xl"
  }, (0,external_emotion_react_.jsx)(react_.List, {
    spacing: 1
  }, (0,external_emotion_react_.jsx)(react_.ListItem, {
    align: "justify"
  }, (0,external_emotion_react_.jsx)(react_.ListIcon, {
    as: icons_.CalendarIcon
  }), "Publiez des \xE9v\xE9nements public ou bien r\xE9serv\xE9s \xE0 vos adh\xE9rents."), (0,external_emotion_react_.jsx)(react_.ListItem, {
    align: "justify"
  }, (0,external_emotion_react_.jsx)(react_.ListIcon, {
    as: IoIosChatbubbles_js_namespaceObject.IoIosChatbubbles
  }), "Communiquez avec vos ", subscribers(true), "."))))) : 0, (0,external_emotion_react_.jsx)(EventsPage, null));
};

/* harmony default export */ var pages = (IndexPage);

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

/***/ 1415:
/***/ (function(module) {

"use strict";
module.exports = require("@react-icons/all-files/fa/FaRetweet.js");;

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

/***/ 1869:
/***/ (function(module) {

"use strict";
module.exports = require("@react-icons/all-files/io/IoIosPerson.js");;

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
var __webpack_exports__ = __webpack_require__.X(0, [1664,5328,8716,9163,8177,6837,4281,8238,3831,4497,1240,8739,1526,3494], function() { return __webpack_exec__(3394); });
module.exports = __webpack_exports__;

})();