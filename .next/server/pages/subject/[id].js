(function() {
var exports = {};
exports.id = 4315;
exports.ids = [4315];
exports.modules = {

/***/ 9238:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ _id_; },
  "getServerSideProps": function() { return /* binding */ getServerSideProps; }
});

// EXTERNAL MODULE: external "react-redux"
var external_react_redux_ = __webpack_require__(79);
// EXTERNAL MODULE: ./node_modules/next/link.js
var next_link = __webpack_require__(1664);
// EXTERNAL MODULE: ./src/store.ts
var store = __webpack_require__(4281);
// EXTERNAL MODULE: external "next-redux-wrapper"
var external_next_redux_wrapper_ = __webpack_require__(2744);
// EXTERNAL MODULE: external "@reduxjs/toolkit"
var toolkit_ = __webpack_require__(6139);
;// CONCATENATED MODULE: ./src/features/subject/subjectSlice.ts
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

//@ts-nocheck


const subjectSlice = (0,toolkit_.createSlice)({
  name: "subject",
  initialState: {},
  reducers: {
    setEnt(state, {
      payload
    }) {
      return payload;
    }

  },
  extraReducers: {
    [external_next_redux_wrapper_.HYDRATE]: (state, action) => {
      //console.log("HYDRATE", state, action.payload);
      return _objectSpread(_objectSpread({}, state), action.payload.subject);
    }
  }
});
const {
  setEnt
} = subjectSlice.actions;
const selectSubject = id => state => {
  var _state$subjectSlice$n;

  return state === null || state === void 0 ? void 0 : (_state$subjectSlice$n = state[subjectSlice.name]) === null || _state$subjectSlice$n === void 0 ? void 0 : _state$subjectSlice$n[id];
};
/* harmony default export */ var subject_subjectSlice = (subjectSlice.reducer);
const fetchSubject = id => async dispatch => {
  const timeoutPromise = timeout => new Promise(resolve => setTimeout(resolve, timeout));

  await timeoutPromise(200);
  dispatch(subjectSlice.actions.setEnt({
    [id]: {
      id,
      name: `Subject ${id}`
    }
  }));
};
// EXTERNAL MODULE: external "@emotion/react"
var react_ = __webpack_require__(7381);
;// CONCATENATED MODULE: ./src/pages/subject/[id].tsx
// @ts-nocheck






const Page = props => {
  console.log("State on render", (0,external_react_redux_.useStore)().getState(), {
    props
  });
  const content = (0,external_react_redux_.useSelector)(selectSubject(props.id));
  console[content ? "info" : "warn"]("Rendered content: ", content);

  if (!content) {
    return (0,react_.jsx)("div", null, "RENDERED WITHOUT CONTENT FROM STORE!!!???");
  }

  return (0,react_.jsx)("div", null, (0,react_.jsx)("h3", null, content.name), (0,react_.jsx)(next_link.default, {
    href: "/subject/1"
  }, (0,react_.jsx)("a", null, "Subject id 1")), "\xA0\xA0\xA0\xA0", (0,react_.jsx)(next_link.default, {
    href: "/subject/2"
  }, (0,react_.jsx)("a", null, "Subject id 2")));
};

const getServerSideProps = store/* wrapper.getServerSideProps */.YS.getServerSideProps(store => async ctx => {
  const {
    id
  } = ctx.params;
  await store.dispatch(fetchSubject(id));
  console.log("State on server", store.getState());
  return {
    props: {
      id
    }
  };
});
/* harmony default export */ var _id_ = (Page);

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

/***/ 9297:
/***/ (function(module) {

"use strict";
module.exports = require("react");;

/***/ }),

/***/ 79:
/***/ (function(module) {

"use strict";
module.exports = require("react-redux");;

/***/ }),

/***/ 4453:
/***/ (function() {

/* (ignored) */

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
var __webpack_exports__ = __webpack_require__.X(0, [1664,8716,4281], function() { return __webpack_exec__(9238); });
module.exports = __webpack_exports__;

})();