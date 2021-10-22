exports.id = 1240;
exports.ids = [1240];
exports.modules = {

/***/ 4263:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "G": function() { return /* binding */ EventTimeline; }
/* harmony export */ });
/* harmony import */ var _emotion_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7381);
/* harmony import */ var _emotion_react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_emotion_react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _chakra_ui_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3724);
/* harmony import */ var _chakra_ui_icons__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_chakra_ui_icons__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3426);
/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3879);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(date_fns__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var date_fns_locale__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(678);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9297);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var utils_date__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(4245);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _EMOTION_STRINGIFIED_CSS_ERROR__() { return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop)."; }









const timelineStyles =  true ? {
  name: "15g69pj",
  styles: "&>li{list-style:none;margin-left:12px;margin-top:0!important;border-left:2px dashed #3f4e58;padding:0 0 0 20px;position:relative;&::before{position:absolute;left:-14px;top:0;content:\" \";border:8px solid rgba(255, 255, 255, 0.74);border-radius:500%;background:#3f4e58;height:25px;width:25px;transition:all 500ms ease-in-out;}}"
} : 0;
const EventTimeline = ({
  event
}) => {
  const eventMinDate = (0,date_fns__WEBPACK_IMPORTED_MODULE_3__.parseISO)(event.eventMinDate);
  const eventMaxDate = (0,date_fns__WEBPACK_IMPORTED_MODULE_3__.parseISO)(event.eventMaxDate);
  const startHour = (0,date_fns__WEBPACK_IMPORTED_MODULE_3__.getHours)(eventMinDate);
  const endHour = (0,date_fns__WEBPACK_IMPORTED_MODULE_3__.getHours)(eventMaxDate);
  const duration = endHour - startHour;
  let startDay = (0,date_fns__WEBPACK_IMPORTED_MODULE_3__.getDay)(eventMinDate);
  startDay = startDay === 0 ? 6 : startDay - 1;
  const timeline = utils_date__WEBPACK_IMPORTED_MODULE_5__/* .days.reduce */ .an.reduce((obj, label, index) => {
    if (startDay === index) return _objectSpread(_objectSpread({}, obj), {}, {
      [index]: {
        startDate: eventMinDate,
        endTime: eventMaxDate
      }
    });

    if (event.otherDays) {
      for (const {
        dayNumber,
        startDate,
        endTime
      } of event.otherDays) {
        if (dayNumber === index) {
          return _objectSpread(_objectSpread({}, obj), {}, {
            [index]: {
              startDate: startDate ? (0,date_fns__WEBPACK_IMPORTED_MODULE_3__.parseISO)(startDate) : (0,date_fns__WEBPACK_IMPORTED_MODULE_3__.setDay)(eventMinDate, dayNumber + 1),
              endTime: endTime ? (0,date_fns__WEBPACK_IMPORTED_MODULE_3__.parseISO)(endTime) : (0,date_fns__WEBPACK_IMPORTED_MODULE_3__.setDay)(eventMaxDate, dayNumber + 1)
            }
          });
        }
      }
    }

    return obj;
  }, {});

  const renderTimeline = () => Object.keys(timeline).map(key => {
    const dayNumber = parseInt(key);
    const day = timeline[dayNumber];
    return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_2__.ListItem, {
      key: "timeline-item-" + key
    }, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_2__.Text, {
      fontWeight: "bold"
    }, (0,date_fns__WEBPACK_IMPORTED_MODULE_3__.format)(day.startDate, "cccc d MMMM", {
      locale: date_fns_locale__WEBPACK_IMPORTED_MODULE_6__/* .default */ .Z
    })), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_2__.Box, {
      display: "flex",
      alignItems: "center",
      ml: 3,
      fontWeight: "bold"
    }, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_2__.Text, {
      color: "green"
    }, (0,date_fns__WEBPACK_IMPORTED_MODULE_3__.format)(day.startDate, "H:mm", {
      locale: date_fns_locale__WEBPACK_IMPORTED_MODULE_6__/* .default */ .Z
    })), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_icons__WEBPACK_IMPORTED_MODULE_1__.ArrowForwardIcon, null), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_2__.Text, {
      color: "red"
    }, (0,date_fns__WEBPACK_IMPORTED_MODULE_3__.getDay)(day.startDate) !== (0,date_fns__WEBPACK_IMPORTED_MODULE_3__.getDay)(day.endTime) ? (0,date_fns__WEBPACK_IMPORTED_MODULE_3__.format)(day.endTime, "cccc d MMMM", {
      locale: date_fns_locale__WEBPACK_IMPORTED_MODULE_6__/* .default */ .Z
    }) : "", " ", (0,date_fns__WEBPACK_IMPORTED_MODULE_3__.format)(day.endTime, "H:mm", {
      locale: date_fns_locale__WEBPACK_IMPORTED_MODULE_6__/* .default */ .Z
    }))));
  });

  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)((react__WEBPACK_IMPORTED_MODULE_4___default().Fragment), null, event.repeat && (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_2__.Text, {
    fontWeight: "bold"
  }, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_icons__WEBPACK_IMPORTED_MODULE_1__.CalendarIcon, {
    mr: 1
  }), event.repeat === 99 ? "Toutes les semaines" : ""), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_2__.List, {
    spacing: 3,
    css: timelineStyles
  }, renderTimeline()));
};

/***/ }),

/***/ 5011:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "n": function() { return /* binding */ DescriptionModal; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9297);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3426);
/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _emotion_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7381);
/* harmony import */ var _emotion_react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_emotion_react__WEBPACK_IMPORTED_MODULE_2__);
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }




const DescriptionModal = (_ref) => {
  let {
    closeOnOverlayClick
  } = _ref,
      props = _objectWithoutProperties(_ref, ["closeOnOverlayClick"]);

  const {
    isOpen,
    onOpen,
    onClose
  } = (0,_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.useDisclosure)({
    defaultIsOpen: true
  });
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.Modal, {
    isOpen: isOpen,
    onClose: () => {
      props.onClose && props.onClose();
      onClose();
    },
    closeOnOverlayClick: closeOnOverlayClick
  }, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.ModalOverlay, null, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.ModalContent, null, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.ModalHeader, {
    px: 3,
    pt: 1
  }, props.header), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.ModalCloseButton, null), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.ModalBody, {
    px: 3,
    pt: 0
  }, props.children))));
};

/***/ })

};
;