exports.id = 8238;
exports.ids = [8238];
exports.modules = {

/***/ 8238:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "G": function() { return /* binding */ getSession; },
/* harmony export */   "k": function() { return /* binding */ useSession; }
/* harmony export */ });
/* harmony import */ var next_auth_client__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(8104);
/* harmony import */ var next_auth_client__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(next_auth_client__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var store__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4281);
/* harmony import */ var utils_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(6837);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(79);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var features_session_sessionSlice__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(6089);
/* harmony import */ var utils_isServer__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(7870);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }







let cachedSession;
/*
export async function getSession(
  options: GetSessionOptions
): Promise<Session | null> {
  return await getNextAuthSession(options);
}

export const useSession = (): { data: Session | null; loading: boolean } => {
  const [session, loading] = useNextAuthSession();
  return { data: session, loading };
};
*/

async function getSession(options) {
  const session = await (0,next_auth_client__WEBPACK_IMPORTED_MODULE_0__.getSession)(options);
  if (!session || !session.user || session.user.userId) return session;

  if (!session.user.userId) {
    if (cachedSession) {
      // console.log("returning cachedSession");
      return cachedSession;
    }

    const {
      data
    } = await utils_api__WEBPACK_IMPORTED_MODULE_2__/* .default.get */ .Z.get(`user/${session.user.email}`);

    if (data) {
      var _session$user$email;

      const {
        _id,
        userName,
        userImage,
        isAdmin
      } = data;
      cachedSession = _objectSpread(_objectSpread({}, session), {}, {
        user: _objectSpread(_objectSpread({}, session.user), {}, {
          userId: _id,
          userName: userName ? userName : (_session$user$email = session.user.email) === null || _session$user$email === void 0 ? void 0 : _session$user$email.replace(/@.+/, ""),
          userImage,
          isAdmin: isAdmin || false
        })
      });
      return cachedSession;
    }
  }

  return session;
}
const useSession = () => {
  const dispatch = (0,store__WEBPACK_IMPORTED_MODULE_1__/* .useAppDispatch */ .TL)();
  const [session, loading] = (0,next_auth_client__WEBPACK_IMPORTED_MODULE_0__.useSession)();
  if ((0,utils_isServer__WEBPACK_IMPORTED_MODULE_5__/* .isServer */ .s)()) return {
    data: session,
    loading
  };
  const appSessionLoading = (0,react_redux__WEBPACK_IMPORTED_MODULE_3__.useSelector)(features_session_sessionSlice__WEBPACK_IMPORTED_MODULE_4__/* .selectLoading */ .NH);
  const appSession = (0,react_redux__WEBPACK_IMPORTED_MODULE_3__.useSelector)(features_session_sessionSlice__WEBPACK_IMPORTED_MODULE_4__/* .selectSession */ .Wu);
  if (appSession) return {
    data: appSession,
    loading: false
  };
  if (!session) return {
    data: null,
    loading
  };

  const xhr = async () => {
    dispatch((0,features_session_sessionSlice__WEBPACK_IMPORTED_MODULE_4__/* .setLoading */ .K4)(true));
    const userQuery = await utils_api__WEBPACK_IMPORTED_MODULE_2__/* .default.get */ .Z.get("user/" + session.user.userId);

    if (userQuery.data) {
      const {
        _id,
        email = session.user.email,
        userName = _id,
        userImage,
        isAdmin = false
      } = userQuery.data;

      const newSession = _objectSpread(_objectSpread({}, session), {}, {
        user: _objectSpread(_objectSpread({}, session.user), {}, {
          email,
          userId: _id,
          userName: userName ? userName : _id,
          userImage,
          isAdmin: isAdmin || false
        })
      });

      dispatch((0,features_session_sessionSlice__WEBPACK_IMPORTED_MODULE_4__/* .setSession */ .KY)(newSession));
      dispatch((0,features_session_sessionSlice__WEBPACK_IMPORTED_MODULE_4__/* .setLoading */ .K4)(false));
    }
  };

  if (!appSessionLoading) xhr();
  return {
    data: null,
    loading: true
  };
};

/***/ })

};
;