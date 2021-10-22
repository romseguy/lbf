exports.id = 4497;
exports.ids = [4497];
exports.modules = {

/***/ 6127:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "K": function() { return /* binding */ PhoneControl; }
/* harmony export */ });
/* harmony import */ var _hookform_error_message__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5228);
/* harmony import */ var _hookform_error_message__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_hookform_error_message__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3426);
/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _chakra_ui_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(3724);
/* harmony import */ var _chakra_ui_icons__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_chakra_ui_icons__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9297);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_hook_form__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(2662);
/* harmony import */ var react_hook_form__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_hook_form__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _Link__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(842);
/* harmony import */ var utils_string__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(7535);
/* harmony import */ var _emotion_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(7381);
/* harmony import */ var _emotion_react__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_emotion_react__WEBPACK_IMPORTED_MODULE_6__);
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }


 // import { Input } from "features/common";







const PhoneControl = (_ref) => {
  let {
    defaultValue = "",
    errors,
    name,
    label = "Numéro de téléphone",
    noLabel,
    control,
    register,
    setValue,
    isRequired = false,
    isMultiple = true
  } = _ref,
      props = _objectWithoutProperties(_ref, ["defaultValue", "errors", "name", "label", "noLabel", "control", "register", "setValue", "isRequired", "isMultiple"]);

  let formRules = {};

  if (isRequired) {
    formRules.required = "Veuillez saisir un numéro de téléphone";
  }

  if (!isMultiple) {
    return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.FormControl, _extends({
      id: name,
      isRequired: isRequired,
      isInvalid: !!errors[name]
    }, props), !noLabel && (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.FormLabel, {
      m: 0
    }, label), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.InputGroup, null, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.InputLeftElement, {
      pointerEvents: "none",
      children: (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)(_chakra_ui_icons__WEBPACK_IMPORTED_MODULE_2__.PhoneIcon, null)
    }), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.Input, {
      name: name,
      placeholder: props.placeholder || "Cliquez ici pour saisir un numéro de téléphone...",
      defaultValue: defaultValue,
      ref: register(_objectSpread({
        pattern: {
          value: utils_string__WEBPACK_IMPORTED_MODULE_7__/* .phoneR */ .S9,
          message: "Numéro de téléphone invalide"
        }
      }, formRules))
    })), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.FormErrorMessage, null, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)(_hookform_error_message__WEBPACK_IMPORTED_MODULE_0__.ErrorMessage, {
      errors: errors,
      name: name
    })));
  }

  const {
    fields,
    append,
    prepend,
    remove,
    swap,
    move,
    insert
  } = (0,react_hook_form__WEBPACK_IMPORTED_MODULE_4__.useFieldArray)({
    control,
    // control props comes from useForm (optional: if you are using FormContext)
    name // unique name for your Field Array
    // keyName: "id", default to "id", you can change the key name

  });
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.Box, {
    mb: 3
  }, fields.map((field, index) => {
    return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.FormControl, _extends({
      key: field.id,
      id: name,
      isRequired: isRequired,
      isInvalid: errors[name] && errors[name][index]
    }, props), !noLabel && (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.FormLabel, {
      m: 0
    }, index > 0 ? `${index + 1}ème ${label.toLowerCase()}` : label), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.InputGroup, null, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.InputLeftElement, {
      pointerEvents: "none",
      children: (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)(_chakra_ui_icons__WEBPACK_IMPORTED_MODULE_2__.PhoneIcon, null)
    }), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.Input, {
      name: `${name}[${index}].phone`,
      placeholder: props.placeholder || "Cliquez ici pour saisir un numéro de téléphone...",
      defaultValue: `${field.phone}` // make sure to set up defaultValue
      ,
      ref: register(_objectSpread({
        pattern: {
          value: utils_string__WEBPACK_IMPORTED_MODULE_7__/* .phoneR */ .S9,
          message: "Numéro de téléphone invalide"
        }
      }, formRules))
    }), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.InputRightAddon, {
      p: 0,
      children: (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.IconButton, {
        "aria-label": `Supprimer le ${index + 1}ème numéro de téléphone`,
        icon: (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)(_chakra_ui_icons__WEBPACK_IMPORTED_MODULE_2__.DeleteIcon, null),
        bg: "transparent",
        _hover: {
          bg: "transparent",
          color: "red"
        },
        onClick: () => {
          remove(index);
          if (fields.length === 1) setValue(name, null);
        }
      })
    })), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.FormErrorMessage, null, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)(_hookform_error_message__WEBPACK_IMPORTED_MODULE_0__.ErrorMessage, {
      errors: errors,
      name: `${name}[${index}].phone`
    })));
  }), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)(_Link__WEBPACK_IMPORTED_MODULE_5__/* .Link */ .r, {
    fontSize: "smaller",
    onClick: () => {
      append({
        phone: ""
      });
    }
  }, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)(_chakra_ui_icons__WEBPACK_IMPORTED_MODULE_2__.PhoneIcon, null), " Ajouter un num\xE9ro de t\xE9l\xE9phone"));
};

/***/ }),

/***/ 3808:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "I": function() { return /* binding */ UrlControl; }
});

// EXTERNAL MODULE: external "@react-icons/all-files/fa/FaGlobeEurope.js"
var FaGlobeEurope_js_ = __webpack_require__(8237);
// EXTERNAL MODULE: external "@emotion/react"
var react_ = __webpack_require__(7381);
// EXTERNAL MODULE: external "@chakra-ui/icons"
var icons_ = __webpack_require__(3724);
// EXTERNAL MODULE: external "@chakra-ui/react"
var external_chakra_ui_react_ = __webpack_require__(3426);
// EXTERNAL MODULE: external "@hookform/error-message"
var error_message_ = __webpack_require__(5228);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(9297);
// EXTERNAL MODULE: external "react-hook-form"
var external_react_hook_form_ = __webpack_require__(2662);
;// CONCATENATED MODULE: ./src/utils/url.ts
const urlR = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/i;
const optionalProtocolUrlR = /^((?:https?:\/\/)?[^./]+(?:\.[^./]+)+(?:\/.*)?)$/i;
// EXTERNAL MODULE: ./src/features/common/Link.tsx
var Link = __webpack_require__(842);
;// CONCATENATED MODULE: ./src/features/common/forms/UrlControl.tsx


function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _EMOTION_STRINGIFIED_CSS_ERROR__() { return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop)."; }











var _ref =  true ? {
  name: "1ep9nyp",
  styles: "margin:0!important"
} : 0;

const UrlControl = (_ref2) => {
  let {
    label = "Site internet",
    placeholder,
    defaultValue,
    errors,
    name,
    control,
    register,
    setValue,
    isRequired = false,
    isMultiple = true
  } = _ref2,
      props = _objectWithoutProperties(_ref2, ["label", "placeholder", "defaultValue", "errors", "name", "control", "register", "setValue", "isRequired", "isMultiple"]);

  let formRules = {};

  if (isRequired) {
    formRules.required = "Veuillez saisir une adresse internet";
  }

  if (!isMultiple) {
    return (0,react_.jsx)(external_chakra_ui_react_.FormControl, {
      id: name,
      isRequired: isRequired,
      isInvalid: !!errors[name]
    }, (0,react_.jsx)(external_chakra_ui_react_.FormLabel, null, label || "Site internet"), (0,react_.jsx)(external_chakra_ui_react_.InputGroup, null, (0,react_.jsx)(external_chakra_ui_react_.InputLeftElement, {
      pointerEvents: "none",
      children: (0,react_.jsx)(icons_.AtSignIcon, null)
    }), (0,react_.jsx)(external_chakra_ui_react_.Input, _extends({
      name: name,
      placeholder: placeholder || "Saisir une adresse internet",
      ref: register(_objectSpread({
        pattern: {
          value: urlR,
          message: "Adresse invalide"
        }
      }, formRules)),
      defaultValue: defaultValue,
      pl: 10
    }, props))), (0,react_.jsx)(external_chakra_ui_react_.FormErrorMessage, null, (0,react_.jsx)(error_message_.ErrorMessage, {
      errors: errors,
      name: name
    })));
  }

  const {
    fields,
    append,
    prepend,
    remove,
    swap,
    move,
    insert
  } = (0,external_react_hook_form_.useFieldArray)({
    control,
    // control props comes from useForm (optional: if you are using FormContext)
    name // unique name for your Field Array
    // keyName: "id", default to "id", you can change the key name

  });
  return (0,react_.jsx)(external_chakra_ui_react_.Box, {
    mb: 3
  }, fields.map((field, index) => {
    return (0,react_.jsx)(external_chakra_ui_react_.FormControl, _extends({
      key: field.id,
      id: name,
      isRequired: isRequired,
      isInvalid: !!(errors[name] && errors[name][index])
    }, props), (0,react_.jsx)(external_chakra_ui_react_.FormLabel, {
      m: 0
    }, index > 0 ? `${index + 1}ème ${label.toLowerCase()}` : label), (0,react_.jsx)(external_chakra_ui_react_.InputGroup, null, (0,react_.jsx)(external_chakra_ui_react_.InputLeftAddon, {
      bg: "transparent",
      border: 0,
      p: 0,
      children: (0,react_.jsx)(external_chakra_ui_react_.Select, {
        name: `${name}[${index}].prefix`,
        ref: register(),
        defaultValue: field.prefix,
        variant: "filled",
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
        css: _ref,
        onChange: e => setValue(`${name}[${index}].prefix`, e.target.value)
      }, (0,react_.jsx)("option", {
        value: "https://"
      }, "https://"), (0,react_.jsx)("option", {
        value: "http://"
      }, "http://"))
    }), (0,react_.jsx)(external_chakra_ui_react_.Input, {
      name: `${name}[${index}].url`,
      placeholder: placeholder || "Saisir une adresse internet",
      defaultValue: field.url,
      ref: register(_objectSpread({
        pattern: {
          value: optionalProtocolUrlR,
          message: "Adresse invalide"
        }
      }, formRules))
    }), (0,react_.jsx)(external_chakra_ui_react_.InputRightAddon, {
      p: 0,
      children: (0,react_.jsx)(external_chakra_ui_react_.IconButton, {
        "aria-label": `Supprimer la ${index + 1}ème adresse de site internet`,
        icon: (0,react_.jsx)(icons_.DeleteIcon, null),
        bg: "transparent",
        _hover: {
          bg: "transparent",
          color: "red"
        },
        onClick: () => {
          remove(index);
          if (fields.length === 1) setValue(name, null);
        }
      })
    })), (0,react_.jsx)(external_chakra_ui_react_.FormErrorMessage, null, (0,react_.jsx)(error_message_.ErrorMessage, {
      errors: errors,
      name: `${name}[${index}].url`
    })));
  }), (0,react_.jsx)(Link/* Link */.r, {
    fontSize: "smaller",
    onClick: () => {
      append({
        url: "",
        prefix: "https://"
      });
    }
  }, (0,react_.jsx)(external_chakra_ui_react_.Icon, {
    as: FaGlobeEurope_js_.FaGlobeEurope
  }), " Ajouter un site internet"));
};

/***/ }),

/***/ 4168:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "$": function() { return /* binding */ EventForm; }
/* harmony export */ });
/* harmony import */ var _emotion_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7381);
/* harmony import */ var _emotion_react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_emotion_react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3426);
/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _hookform_error_message__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5228);
/* harmony import */ var _hookform_error_message__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_hookform_error_message__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(3879);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(date_fns__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9297);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var react_device_detect__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(2047);
/* harmony import */ var react_device_detect__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_device_detect__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var react_hook_form__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(2662);
/* harmony import */ var react_hook_form__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_hook_form__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(724);
/* harmony import */ var react_select__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_select__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var use_places_autocomplete__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(632);
/* harmony import */ var use_places_autocomplete__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(use_places_autocomplete__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var features_common__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(1109);
/* harmony import */ var features_common_forms_UrlControl__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(3808);
/* harmony import */ var features_common_forms_PhoneControl__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(6127);
/* harmony import */ var features_events_eventsApi__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(9416);
/* harmony import */ var features_map_GoogleApiWrapper__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(4878);
/* harmony import */ var features_orgs_orgsApi__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(2207);
/* harmony import */ var models_Event__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(7823);
/* harmony import */ var models_Topic__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(3921);
/* harmony import */ var utils_array__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(1609);
/* harmony import */ var utils_date__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(4245);
/* harmony import */ var utils_form__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(6941);
/* harmony import */ var utils_maps__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(2051);
/* harmony import */ var utils_string__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(7535);
/* harmony import */ var _chakra_ui_icons__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(3724);
/* harmony import */ var _chakra_ui_icons__WEBPACK_IMPORTED_MODULE_19___default = /*#__PURE__*/__webpack_require__.n(_chakra_ui_icons__WEBPACK_IMPORTED_MODULE_19__);
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

























const repeatOptions = [];

for (let i = 1; i <= 10; i++) {
  repeatOptions[i] = i;
}

const EventForm = (0,features_map_GoogleApiWrapper__WEBPACK_IMPORTED_MODULE_13__/* .withGoogleApi */ .q)({
  apiKey: "AIzaSyBW6lVlo-kbzkD3bThsccdDilCdb8_CPH8"
})((_ref) => {
  var _props$event, _props$event2, _props$event3, _props$event4, _props$event5, _props$event7, _props$event9, _props$event10, _props$event11;

  let {
    initialEventOrgs = []
  } = _ref,
      props = _objectWithoutProperties(_ref, ["initialEventOrgs"]);

  const toast = (0,_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.useToast)({
    position: "top"
  });
  const {
    colorMode
  } = (0,_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.useColorMode)();
  const isDark = colorMode === "dark"; //#region event

  const [addEvent, addEventMutation] = (0,features_events_eventsApi__WEBPACK_IMPORTED_MODULE_12__/* .useAddEventMutation */ .SY)();
  const [editEvent, editEventMutation] = (0,features_events_eventsApi__WEBPACK_IMPORTED_MODULE_12__/* .useEditEventMutation */ .VA)(); //#endregion
  //#region myOrgs

  const {
    data: myOrgs,
    isLoading: isQueryLoading
  } = (0,features_orgs_orgsApi__WEBPACK_IMPORTED_MODULE_14__/* .useGetOrgsQuery */ .Gt)({
    populate: "orgSubscriptions",
    createdBy: props.session.user.userId
  }); //#endregion
  //#region form state

  const {
    control,
    register,
    handleSubmit,
    errors,
    setError,
    clearErrors,
    watch,
    setValue,
    getValues
  } = (0,react_hook_form__WEBPACK_IMPORTED_MODULE_6__.useForm)({
    defaultValues: {
      eventEmail: (_props$event = props.event) === null || _props$event === void 0 ? void 0 : _props$event.eventEmail,
      eventPhone: (_props$event2 = props.event) === null || _props$event2 === void 0 ? void 0 : _props$event2.eventPhone,
      eventWeb: (_props$event3 = props.event) === null || _props$event3 === void 0 ? void 0 : _props$event3.eventWeb
    },
    mode: "onChange"
  });
  watch(["eventAddress", "eventOrgs"]);
  const eventVisibility = watch("eventVisibility");
  const defaultEventOrgs = ((_props$event4 = props.event) === null || _props$event4 === void 0 ? void 0 : _props$event4.eventOrgs) || initialEventOrgs || [];
  const eventOrgs = getValues("eventOrgs") || defaultEventOrgs;
  const eventOrgsRules = {
    required: eventVisibility === models_Topic__WEBPACK_IMPORTED_MODULE_16__/* .Visibility.SUBSCRIBERS */ .EE.SUBSCRIBERS ? "Veuillez sélectionner une ou plusieurs organisations" : false
  };

  if (!errors.eventOrgs && typeof eventOrgsRules.required === "string" && Array.isArray(eventOrgs) && !eventOrgs.length) {
    setError("eventOrgs", {
      type: "manual",
      message: eventOrgsRules.required
    });
  }

  const visibilityOptions = eventOrgs ? [models_Topic__WEBPACK_IMPORTED_MODULE_16__/* .Visibility.PUBLIC */ .EE.PUBLIC, models_Topic__WEBPACK_IMPORTED_MODULE_16__/* .Visibility.SUBSCRIBERS */ .EE.SUBSCRIBERS] : []; //#endregion
  //#region local state

  const {
    0: isLoading,
    1: setIsLoading
  } = (0,react__WEBPACK_IMPORTED_MODULE_4__.useState)(false);
  const {
    0: isRepeat,
    1: setIsRepeat
  } = (0,react__WEBPACK_IMPORTED_MODULE_4__.useState)((0,utils_array__WEBPACK_IMPORTED_MODULE_20__/* .hasItems */ .t)((_props$event5 = props.event) === null || _props$event5 === void 0 ? void 0 : _props$event5.otherDays));
  const {
    0: days,
    1: setDays
  } = (0,react__WEBPACK_IMPORTED_MODULE_4__.useState)(utils_date__WEBPACK_IMPORTED_MODULE_17__/* .days.reduce */ .an.reduce((obj, day, index) => {
    var _props$event6, _props$event6$otherDa;

    const otherDay = (_props$event6 = props.event) === null || _props$event6 === void 0 ? void 0 : (_props$event6$otherDa = _props$event6.otherDays) === null || _props$event6$otherDa === void 0 ? void 0 : _props$event6$otherDa.find(({
      dayNumber
    }) => dayNumber === index);
    return _objectSpread(_objectSpread({}, obj), {}, {
      [index]: {
        checked: !!otherDay,
        isOpen: false,
        startDate: otherDay !== null && otherDay !== void 0 && otherDay.startDate ? (0,date_fns__WEBPACK_IMPORTED_MODULE_3__.parseISO)(otherDay.startDate) : undefined
      }
    });
  }, {}));

  const setDayState = (index, match = {}, nomatch = {}) => {
    return Object.keys(days).reduce((obj, day, i) => i === index ? _objectSpread(_objectSpread({}, obj), {}, {
      [i]: _objectSpread(_objectSpread({}, days[i]), match)
    }) : _objectSpread(_objectSpread({}, obj), {}, {
      [i]: _objectSpread(_objectSpread({}, days[i]), nomatch)
    }), {});
  };

  const {
    0: suggestion,
    1: setSuggestion
  } = (0,react__WEBPACK_IMPORTED_MODULE_4__.useState)();
  const {
    // ready,
    // value: autoCompleteValue,
    suggestions: {
      status,
      data
    },
    setValue: setAutoCompleteValue // clearSuggestions

  } = use_places_autocomplete__WEBPACK_IMPORTED_MODULE_8___default()({
    requestOptions: {
      componentRestrictions: {
        country: "fr"
      }
    },
    debounce: 300
  });
  const eventAddress = getValues("eventAddress") || ((_props$event7 = props.event) === null || _props$event7 === void 0 ? void 0 : _props$event7.eventAddress);
  (0,react__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    if (!suggestion) setAutoCompleteValue(eventAddress);
  }, [eventAddress]); //#endregion
  //#region event min and max dates

  const now = new Date();
  let eventMinDefaultDate = props.event && (0,date_fns__WEBPACK_IMPORTED_MODULE_3__.parseISO)(props.event.eventMinDate) || null;
  let eventMaxDefaultDate = props.event && (0,date_fns__WEBPACK_IMPORTED_MODULE_3__.parseISO)(props.event.eventMaxDate) || null;
  const eventMinDate = watch("eventMinDate");
  const eventMaxDate = watch("eventMaxDate");
  const eventMinDuration = 1;
  const start = eventMinDate || eventMinDefaultDate;
  const {
    0: end,
    1: setEnd
  } = (0,react__WEBPACK_IMPORTED_MODULE_4__.useState)(eventMaxDate || eventMaxDefaultDate);
  (0,react__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    if ((end === null || end === void 0 ? void 0 : end.toISOString()) !== (eventMaxDate === null || eventMaxDate === void 0 ? void 0 : eventMaxDate.toISOString())) {
      setEnd(eventMaxDate);
    }
  }, [eventMaxDate]);
  let canRepeat = false;
  let canRepeat1day = false;
  const highlightDatesStart = [];
  const highlightDatesEnd = [];

  if (start && end) {
    const duration = (0,date_fns__WEBPACK_IMPORTED_MODULE_3__.intervalToDuration)({
      start,
      end
    });

    if (duration) {
      if (!duration.days) {
        let startDay = (0,date_fns__WEBPACK_IMPORTED_MODULE_3__.getDay)(start);
        startDay = startDay === 0 ? 6 : startDay - 1;

        if (days[startDay] && !days[startDay].isDisabled) {
          setDays(setDayState(startDay, {
            checked: true,
            isDisabled: true
          }));
        }

        canRepeat = true;
        canRepeat1day = true;
      } else {
        if (duration.days < 7) canRepeat = true;
      }
    }

    for (let i = 1; i <= 10; i++) {
      highlightDatesStart[i] = (0,date_fns__WEBPACK_IMPORTED_MODULE_3__.addWeeks)(start, i);
      highlightDatesEnd[i] = (0,date_fns__WEBPACK_IMPORTED_MODULE_3__.addWeeks)(end, i);
    }
  }

  (0,react__WEBPACK_IMPORTED_MODULE_4__.useEffect)(() => {
    if (eventMinDate && (0,date_fns__WEBPACK_IMPORTED_MODULE_3__.getHours)(eventMinDate) !== 0 && !eventMaxDate) {
      setValue("eventMaxDate", (0,date_fns__WEBPACK_IMPORTED_MODULE_3__.addHours)(eventMinDate, eventMinDuration));
      clearErrors("eventMaxDate");
    } else if (eventMinDate === undefined && (0,date_fns__WEBPACK_IMPORTED_MODULE_3__.getHours)((0,date_fns__WEBPACK_IMPORTED_MODULE_3__.addHours)(eventMinDate, 2)) === 1) {
      setValue("eventMinDate", (0,date_fns__WEBPACK_IMPORTED_MODULE_3__.addHours)(now, 12));
    }
  }, [eventMinDate]);

  if (props.event) {
    eventMinDefaultDate = (0,date_fns__WEBPACK_IMPORTED_MODULE_3__.parseISO)(props.event.eventMinDate);
    eventMaxDefaultDate = (0,date_fns__WEBPACK_IMPORTED_MODULE_3__.parseISO)(props.event.eventMaxDate);
  }

  const eventMinDatePickerProps = {
    minDate: now,
    maxDate: end,
    dateFormat: "Pp",
    showTimeSelect: true,
    timeFormat: "p",
    timeIntervals: 60,
    filterTime: date => {
      if (end) {
        if ((0,date_fns__WEBPACK_IMPORTED_MODULE_3__.getDay)(end) === (0,date_fns__WEBPACK_IMPORTED_MODULE_3__.getDay)(date)) {
          if ((0,date_fns__WEBPACK_IMPORTED_MODULE_3__.getHours)(date) >= (0,date_fns__WEBPACK_IMPORTED_MODULE_3__.getHours)(end)) return false;
        }
      }

      return true;
    }
  };
  const eventMaxDatePickerProps = {
    minDate: eventMinDate ? (0,date_fns__WEBPACK_IMPORTED_MODULE_3__.addHours)(eventMinDate, eventMinDuration) : eventMinDefaultDate ? (0,date_fns__WEBPACK_IMPORTED_MODULE_3__.addHours)(eventMinDefaultDate, eventMinDuration) : (0,date_fns__WEBPACK_IMPORTED_MODULE_3__.addHours)(now, eventMinDuration),
    dateFormat: "Pp",
    showTimeSelect: true,
    timeFormat: "p",
    timeIntervals: 60,
    filterTime: time => {
      if (start) {
        if ((0,date_fns__WEBPACK_IMPORTED_MODULE_3__.getHours)(time) >= (0,date_fns__WEBPACK_IMPORTED_MODULE_3__.getHours)((0,date_fns__WEBPACK_IMPORTED_MODULE_3__.addHours)(start, eventMinDuration)) || (0,date_fns__WEBPACK_IMPORTED_MODULE_3__.getDay)(time) !== (0,date_fns__WEBPACK_IMPORTED_MODULE_3__.getDay)(start)) {
          // console.log(
          //   "allowing",
          //   getHours(time),
          //   getHours(addHours(start, eventMinDuration))
          // );
          return true;
        }
      } else if (time.getTime() > (0,date_fns__WEBPACK_IMPORTED_MODULE_3__.addHours)(now, eventMinDuration + eventMinDuration).getTime()) {
        // console.log(
        //   "allowing",
        //   getHours(time),
        //   getHours(addHours(now, 2))
        // );
        return true;
      }

      return false;
    }
  }; //#endregion

  const onChange = () => {
    clearErrors();
  };

  const onSubmit = async form => {
    var _form$eventEmail, _form$eventPhone, _form$eventWeb, _form$eventDescriptio;

    console.log("submitted", form);
    setIsLoading(true);
    const eventEmail = (_form$eventEmail = form.eventEmail) === null || _form$eventEmail === void 0 ? void 0 : _form$eventEmail.filter(({
      email
    }) => email !== "");
    const eventPhone = (_form$eventPhone = form.eventPhone) === null || _form$eventPhone === void 0 ? void 0 : _form$eventPhone.filter(({
      phone
    }) => phone !== "");
    const eventWeb = (_form$eventWeb = form.eventWeb) === null || _form$eventWeb === void 0 ? void 0 : _form$eventWeb.filter(({
      url
    }) => url !== "");
    const otherDays = Object.keys(days).filter(key => {
      const day = days[parseInt(key)];
      return !day.isDisabled && day.checked;
    }).map(key => {
      var _day$startDate, _day$endTime;

      const dayNumber = parseInt(key);
      const day = days[dayNumber];
      return {
        dayNumber,
        startDate: (_day$startDate = day.startDate) === null || _day$startDate === void 0 ? void 0 : _day$startDate.toISOString(),
        endTime: (_day$endTime = day.endTime) === null || _day$endTime === void 0 ? void 0 : _day$endTime.toISOString()
      };
    });

    let payload = _objectSpread(_objectSpread({}, form), {}, {
      eventName: form.eventName.trim(),
      eventUrl: (0,utils_string__WEBPACK_IMPORTED_MODULE_21__/* .normalize */ .Fv)(form.eventName),
      eventDescription: form.eventDescription === "<p><br></p>" ? "" : (_form$eventDescriptio = form.eventDescription) === null || _form$eventDescriptio === void 0 ? void 0 : _form$eventDescriptio.replace(/\&nbsp;/g, " "),
      eventEmail: Array.isArray(eventEmail) && eventEmail.length > 0 ? eventEmail : [],
      eventPhone: Array.isArray(eventPhone) && eventPhone.length > 0 ? eventPhone : [],
      eventWeb: Array.isArray(eventWeb) && eventWeb.length > 0 ? eventWeb : [],
      otherDays
    });

    try {
      const sugg = suggestion || data[0];

      if (sugg) {
        const {
          lat: eventLat,
          lng: eventLng,
          city: eventCity
        } = await (0,utils_maps__WEBPACK_IMPORTED_MODULE_18__/* .unwrapSuggestion */ .X8)(sugg);
        payload = _objectSpread(_objectSpread({}, payload), {}, {
          eventLat,
          eventLng,
          eventCity
        });
      }

      console.log("payload", payload);

      if (props.event) {
        await editEvent({
          payload,
          eventUrl: props.event.eventUrl
        }).unwrap();
        toast({
          title: "Votre événement a bien été modifié !",
          status: "success",
          isClosable: true
        });
      } else {
        payload.createdBy = props.session.user.userId;
        const event = await addEvent(payload).unwrap();
        toast({
          title: "Votre événement a bien été ajouté !",
          status: "success",
          isClosable: true
        });
      }

      props.onSubmit && props.onSubmit(payload.eventUrl);
    } catch (error) {
      (0,utils_form__WEBPACK_IMPORTED_MODULE_22__/* .handleError */ .S)(error, (message, field) => {
        if (field) {
          setError(field, {
            type: "manual",
            message
          });
        } else {
          setError("formErrorMessage", {
            type: "manual",
            message
          });
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)("form", {
    onChange: onChange,
    onSubmit: handleSubmit(onSubmit)
  }, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_hookform_error_message__WEBPACK_IMPORTED_MODULE_2__.ErrorMessage, {
    errors: errors,
    name: "formErrorMessage",
    render: ({
      message
    }) => (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.Alert, {
      status: "error",
      mb: 3
    }, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.AlertIcon, null), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(features_common__WEBPACK_IMPORTED_MODULE_9__/* .ErrorMessageText */ .h1, null, message))
  }), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.FormControl, {
    id: "eventName",
    isRequired: true,
    isInvalid: !!errors["eventName"],
    display: "flex",
    flexDirection: "column",
    mb: !props.event && getValues("eventName") ? 0 : 3
  }, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.FormLabel, null, "Nom de l'\xE9v\xE9nement"), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.Input, {
    name: "eventName",
    placeholder: "Nom de l'\xE9v\xE9nement",
    ref: register({
      required: "Veuillez saisir un nom d'événement" // pattern: {
      //   value: /^[A-zÀ-ú0-9 ]+$/i,
      //   message:
      //     "Veuillez saisir un nom composé de lettres et de chiffres uniquement"
      // }

    }),
    defaultValue: props.event && props.event.eventName
  }), !props.event && getValues("eventName") && (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.Tooltip, {
    label: `Adresse de la page de l'événement`
  }, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.Tag, {
    mt: 3,
    alignSelf: "flex-end",
    cursor: "help"
  }, "https://aucourant.de", "/", (0,utils_string__WEBPACK_IMPORTED_MODULE_21__/* .normalize */ .Fv)(getValues("eventName")))), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.FormErrorMessage, null, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_hookform_error_message__WEBPACK_IMPORTED_MODULE_2__.ErrorMessage, {
    errors: errors,
    name: "eventName"
  }))), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.FormControl, {
    id: "eventCategory",
    isInvalid: !!errors["eventCategory"],
    onChange: async e => {
      clearErrors("eventOrgs");
    },
    mb: 3
  }, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.FormLabel, null, "Cat\xE9gorie"), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.Select, {
    name: "eventCategory",
    defaultValue: props.event ? props.event.eventCategory : undefined,
    ref: register(),
    placeholder: "Cat\xE9gorie de l'\xE9v\xE9nement",
    color: "gray.400"
  }, Object.keys(models_Event__WEBPACK_IMPORTED_MODULE_15__/* .Category */ .WD).map(key => {
    const k = parseInt(key);
    return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", {
      key: key,
      value: key
    }, models_Event__WEBPACK_IMPORTED_MODULE_15__/* .Category */ .WD[k].label);
  })), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.FormErrorMessage, null, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_hookform_error_message__WEBPACK_IMPORTED_MODULE_2__.ErrorMessage, {
    errors: errors,
    name: "eventCategory"
  }))), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.FormControl, {
    id: "eventMinDate",
    isRequired: true,
    isInvalid: !!errors["eventMinDate"],
    mb: 3
  }, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.FormLabel, null, "Date de d\xE9but"), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_hook_form__WEBPACK_IMPORTED_MODULE_6__.Controller, {
    name: "eventMinDate",
    control: control,
    defaultValue: eventMinDefaultDate,
    rules: {
      required: "Veuillez saisir une date"
    },
    render: props => {
      return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(features_common__WEBPACK_IMPORTED_MODULE_9__/* .DatePicker */ .Mt, _extends({
        withPortal: react_device_detect__WEBPACK_IMPORTED_MODULE_5__.isMobile ? true : false,
        customInput: (0,features_common__WEBPACK_IMPORTED_MODULE_9__/* .renderCustomInput */ .q1)("minDate"),
        selected: props.value,
        onChange: e => {
          clearErrors("eventMinDate");
          props.onChange(e);
        } // onCalendarClose={() => {
        //   if (eventMinDate && !eventMaxDate) {
        //     setValue(
        //       "eventMaxDate",
        //       addHours(eventMinDate, eventMinDuration)
        //     );
        //   }
        // }}

      }, eventMinDatePickerProps));
    }
  }), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.FormErrorMessage, null, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_hookform_error_message__WEBPACK_IMPORTED_MODULE_2__.ErrorMessage, {
    errors: errors,
    name: "eventMinDate"
  }))), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.FormControl, {
    id: "eventMaxDate",
    isRequired: true,
    isInvalid: !!errors["eventMaxDate"] // isDisabled={!eventMinDate}
    ,
    mb: 3
  }, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.FormLabel, null, "Date de fin"), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_hook_form__WEBPACK_IMPORTED_MODULE_6__.Controller, {
    name: "eventMaxDate",
    control: control,
    defaultValue: eventMaxDefaultDate,
    rules: {
      required: "Veuillez saisir une date"
    },
    render: ({
      onChange,
      value
    }) => {
      return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(features_common__WEBPACK_IMPORTED_MODULE_9__/* .DatePicker */ .Mt // disabled={!eventMinDate}
      , _extends({
        withPortal: react_device_detect__WEBPACK_IMPORTED_MODULE_5__.isMobile ? true : false,
        customInput: (0,features_common__WEBPACK_IMPORTED_MODULE_9__/* .renderCustomInput */ .q1)("maxDate"),
        selected: value,
        onChange: onChange,
        highlightDates: highlightDatesStart
      }, eventMaxDatePickerProps));
    }
  }), eventMaxDate !== null && (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.IconButton, {
    "aria-label": "Date de fin remise \xE0 z\xE9ro",
    icon: (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_icons__WEBPACK_IMPORTED_MODULE_19__.DeleteIcon, null),
    ml: 3,
    onClick: () => {
      setEnd(null);
      setValue("eventMaxDate", null);
    }
  }), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.FormErrorMessage, null, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_hookform_error_message__WEBPACK_IMPORTED_MODULE_2__.ErrorMessage, {
    errors: errors,
    name: "eventMaxDate"
  }))), canRepeat && (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.FormControl, {
    id: "repeat",
    isInvalid: !!errors["repeat"] // isDisabled={!eventMinDate || !eventMaxDate}
    ,
    mb: 3
  }, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.Checkbox, {
    isChecked: isRepeat,
    onChange: e => setIsRepeat(e.target.checked)
  }, "Autres jours"), isRepeat && (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.Box, {
    mt: 3
  }, canRepeat1day && utils_date__WEBPACK_IMPORTED_MODULE_17__/* .days.map */ .an.map((label, index) => {
    var _props$event8, _props$event8$otherDa;

    const day = days[index];
    const otherDay = (_props$event8 = props.event) === null || _props$event8 === void 0 ? void 0 : (_props$event8$otherDa = _props$event8.otherDays) === null || _props$event8$otherDa === void 0 ? void 0 : _props$event8$otherDa.find(({
      dayNumber,
      startDate
    }) => dayNumber === index && startDate);
    let selectedStart = day.startDate || start;
    if (otherDay !== null && otherDay !== void 0 && otherDay.startDate) selectedStart = (0,date_fns__WEBPACK_IMPORTED_MODULE_3__.parseISO)(otherDay.startDate);
    let selectedEnd = day.endTime || end;
    if (otherDay !== null && otherDay !== void 0 && otherDay.endTime) selectedEnd = (0,date_fns__WEBPACK_IMPORTED_MODULE_3__.parseISO)(otherDay.endTime);
    let tagLabel = label;

    if (day.checked) {
      if (selectedStart && selectedEnd) tagLabel += ` ${(0,date_fns__WEBPACK_IMPORTED_MODULE_3__.getHours)(selectedStart)}h - ${(0,date_fns__WEBPACK_IMPORTED_MODULE_3__.getHours)(selectedEnd)}h`;else if (selectedStart) tagLabel += `${(0,date_fns__WEBPACK_IMPORTED_MODULE_3__.getHours)(selectedStart)}h`;
    }

    return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.Popover, {
      key: "day-" + index,
      closeOnBlur: false,
      isOpen: !!days[index].isOpen,
      onClose: () => setDays(setDayState(index, {
        isOpen: false
      }))
    }, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.PopoverTrigger, null, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(features_common__WEBPACK_IMPORTED_MODULE_9__/* .Link */ .rU, {
      variant: "no-underline",
      onClick: () => {
        if (day.isDisabled) return;

        if (day.checked && !day.isOpen) {
          setDays(setDayState(index, {
            checked: false
          }));
        } else {
          setDays(setDayState(index, {
            checked: true,
            isOpen: true
          }, {
            isOpen: false
          }));
        }
      }
    }, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.Tag, {
      variant: day.checked ? "solid" : "outline",
      bgColor: day.checked ? "green" : undefined,
      cursor: day.isDisabled ? "not-allowed" : "pointer",
      mr: 1,
      mb: 3
    }, tagLabel))), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.PopoverContent, null, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.PopoverHeader, {
      fontWeight: "bold"
    }, utils_date__WEBPACK_IMPORTED_MODULE_17__/* .days */ .an[index]), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.PopoverCloseButton, null), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.PopoverBody, null, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.FormLabel, null, "Heure de d\xE9but"), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(features_common__WEBPACK_IMPORTED_MODULE_9__/* .DatePicker */ .Mt //withPortal
    , {
      customInput: (0,features_common__WEBPACK_IMPORTED_MODULE_9__/* .renderCustomInput */ .q1)("startDate" + index, true),
      selected: selectedStart,
      dateFormat: "Pp",
      showTimeSelect: true,
      showTimeSelectOnly: true,
      timeFormat: "p",
      timeIntervals: 60,
      filterTime: time => {
        if (selectedEnd && (0,date_fns__WEBPACK_IMPORTED_MODULE_3__.getHours)(time) >= (0,date_fns__WEBPACK_IMPORTED_MODULE_3__.getHours)(selectedEnd)) return false;
        return true;
      },
      onChange: startDate => {
        let endTime;

        if (selectedEnd) {
          if ((0,date_fns__WEBPACK_IMPORTED_MODULE_3__.getHours)(selectedEnd) > (0,date_fns__WEBPACK_IMPORTED_MODULE_3__.getHours)(startDate)) endTime = selectedEnd;
        }

        setDays(setDayState(index, {
          startDate: (0,date_fns__WEBPACK_IMPORTED_MODULE_3__.setDay)(startDate, index + 1),
          endTime
        }));
      }
    }), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.FormLabel, null, "Heure de fin"), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(features_common__WEBPACK_IMPORTED_MODULE_9__/* .DatePicker */ .Mt //withPortal
    , {
      customInput: (0,features_common__WEBPACK_IMPORTED_MODULE_9__/* .renderCustomInput */ .q1)("startDate" + index, true),
      selected: selectedEnd,
      dateFormat: "Pp",
      showTimeSelect: true,
      showTimeSelectOnly: true,
      timeFormat: "p",
      timeIntervals: 60,
      filterTime: time => {
        if (selectedStart && (0,date_fns__WEBPACK_IMPORTED_MODULE_3__.getHours)(time) <= (0,date_fns__WEBPACK_IMPORTED_MODULE_3__.getHours)(selectedStart)) {
          return false;
        } // console.log("allowing", time);


        return true;
      },
      onChange: endDate => {
        setDays(setDayState(index, {
          endTime: (0,date_fns__WEBPACK_IMPORTED_MODULE_3__.setDay)(endDate, index + 1)
        }));
      }
    }))));
  }), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.Select, {
    name: "repeat",
    ref: register(),
    defaultValue: (_props$event9 = props.event) === null || _props$event9 === void 0 ? void 0 : _props$event9.repeat,
    placeholder: "Ne pas r\xE9p\xE9ter",
    css: /*#__PURE__*/(0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.css)(isDark ? `
                color: white;
              ` : `
                color: black;
              `, ";" + ( true ? "" : 0),  true ? "" : 0)
  }, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", {
    key: "all",
    value: 99
  }, "Toutes les semaines"), repeatOptions.map(i => i > 1 && (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", {
    key: `${i}w`,
    value: i
  }, `Toutes les ${i} semaines`)))), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.FormErrorMessage, null, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_hookform_error_message__WEBPACK_IMPORTED_MODULE_2__.ErrorMessage, {
    errors: errors,
    name: "repeat"
  }))), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(features_common__WEBPACK_IMPORTED_MODULE_9__/* .AddressControl */ .b$, {
    name: "eventAddress",
    isRequired: true,
    defaultValue: ((_props$event10 = props.event) === null || _props$event10 === void 0 ? void 0 : _props$event10.eventAddress) || "",
    errors: errors,
    control: control,
    mb: 3,
    placeholder: "Adresse de l'\xE9v\xE9nement",
    onSuggestionSelect: suggestion => {
      setSuggestion(suggestion);
    }
  }), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(features_common__WEBPACK_IMPORTED_MODULE_9__/* .EmailControl */ .sm, {
    name: "eventEmail",
    register: register,
    control: control,
    errors: errors,
    setValue: setValue,
    placeholder: "Adresse e-mail de l'\xE9v\xE9nement"
  }), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(features_common_forms_PhoneControl__WEBPACK_IMPORTED_MODULE_11__/* .PhoneControl */ .K, {
    name: "eventPhone",
    register: register,
    control: control,
    errors: errors,
    setValue: setValue,
    placeholder: "Num\xE9ro de t\xE9l\xE9phone de l'\xE9v\xE9nement"
  }), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(features_common_forms_UrlControl__WEBPACK_IMPORTED_MODULE_10__/* .UrlControl */ .I, {
    name: "eventWeb",
    register: register,
    control: control,
    errors: errors,
    setValue: setValue,
    placeholder: "Site internet de l'\xE9v\xE9nement"
  }), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.FormControl, {
    id: "eventDescription",
    isInvalid: !!errors["eventDescription"],
    mb: 3
  }, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.FormLabel, null, "Description"), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_hook_form__WEBPACK_IMPORTED_MODULE_6__.Controller, {
    name: "eventDescription",
    control: control,
    defaultValue: ((_props$event11 = props.event) === null || _props$event11 === void 0 ? void 0 : _props$event11.eventDescription) || "",
    render: p => {
      var _props$event12;

      return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(features_common__WEBPACK_IMPORTED_MODULE_9__/* .RTEditor */ .Qd, {
        event: props.event,
        session: props.session,
        defaultValue: (_props$event12 = props.event) === null || _props$event12 === void 0 ? void 0 : _props$event12.eventDescription,
        onChange: html => {
          p.onChange(html === "<p><br></p>" ? "" : html);
        },
        placeholder: "Description de l'\xE9v\xE9nement"
      });
    }
  }), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.FormErrorMessage, null, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_hookform_error_message__WEBPACK_IMPORTED_MODULE_2__.ErrorMessage, {
    errors: errors,
    name: "eventDescription"
  }))), visibilityOptions.length > 0 && (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.FormControl, {
    id: "eventVisibility",
    isRequired: true,
    isInvalid: !!errors["eventVisibility"],
    onChange: async e => {
      clearErrors("eventOrgs");
    },
    mb: 3
  }, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.FormLabel, null, "Visibilit\xE9"), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.Select, {
    name: "eventVisibility",
    defaultValue: props.event ? props.event.eventVisibility : undefined,
    ref: register({
      required: "Veuillez sélectionner la visibilité de l'événement"
    }),
    placeholder: "Visibilit\xE9 de l'\xE9v\xE9nement",
    color: "gray.400"
  }, visibilityOptions.map(key => {
    return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)("option", {
      key: key,
      value: key
    }, models_Event__WEBPACK_IMPORTED_MODULE_15__/* .VisibilityV */ .XO[key]);
  })), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.FormErrorMessage, null, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_hookform_error_message__WEBPACK_IMPORTED_MODULE_2__.ErrorMessage, {
    errors: errors,
    name: "eventVisibility"
  }))), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.FormControl, {
    mb: 3,
    id: "eventOrgs",
    isInvalid: !!errors["eventOrgs"],
    isRequired: eventOrgsRules.required === false ? false : !!eventOrgsRules.required
  }, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.FormLabel, null, "Organisateurs"), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(react_hook_form__WEBPACK_IMPORTED_MODULE_6__.Controller, {
    name: "eventOrgs",
    rules: eventOrgsRules,
    as: (react_select__WEBPACK_IMPORTED_MODULE_7___default()),
    control: control,
    defaultValue: defaultEventOrgs,
    placeholder: "S\xE9lectionner une ou plusieurs organisations",
    menuPlacement: "top",
    isClearable: true,
    isMulti: true,
    isSearchable: true,
    closeMenuOnSelect: true,
    styles: {
      placeholder: () => {
        return {
          color: "#A0AEC0"
        };
      },
      control: defaultStyles => {
        return _objectSpread(_objectSpread({}, defaultStyles), {}, {
          borderColor: "#e2e8f0",
          paddingLeft: "8px"
        });
      }
    },
    className: "react-select-container",
    classNamePrefix: "react-select",
    options: myOrgs,
    getOptionLabel: option => `${option.orgName}`,
    getOptionValue: option => option._id,
    onChange: ([option]) => option._id
  }), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.FormErrorMessage, null, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_hookform_error_message__WEBPACK_IMPORTED_MODULE_2__.ErrorMessage, {
    errors: errors,
    name: "eventOrgs"
  }))), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.Flex, {
    justifyContent: "space-between"
  }, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.Button, {
    onClick: () => props.onCancel && props.onCancel()
  }, "Annuler"), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_0__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.Button, {
    colorScheme: "green",
    type: "submit",
    isLoading: isLoading || addEventMutation.isLoading || editEventMutation.isLoading,
    isDisabled: Object.keys(errors).length > 0,
    "data-cy": "eventFormSubmit"
  }, props.event ? "Modifier" : "Ajouter")));
});

/***/ }),

/***/ 5088:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "f": function() { return /* binding */ OrgForm; }
/* harmony export */ });
/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3426);
/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _hookform_error_message__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5228);
/* harmony import */ var _hookform_error_message__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_hookform_error_message__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9297);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_hook_form__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2662);
/* harmony import */ var react_hook_form__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_hook_form__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var use_places_autocomplete__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(632);
/* harmony import */ var use_places_autocomplete__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(use_places_autocomplete__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var features_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(1109);
/* harmony import */ var features_common_forms_PhoneControl__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(6127);
/* harmony import */ var features_common_forms_UrlControl__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(3808);
/* harmony import */ var features_map_GoogleApiWrapper__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(4878);
/* harmony import */ var features_orgs_orgsApi__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(2207);
/* harmony import */ var models_Org__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(9759);
/* harmony import */ var utils_form__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(6941);
/* harmony import */ var utils_maps__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(2051);
/* harmony import */ var utils_string__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(7535);
/* harmony import */ var _emotion_react__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(7381);
/* harmony import */ var _emotion_react__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(_emotion_react__WEBPACK_IMPORTED_MODULE_12__);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
















const OrgForm = (0,features_map_GoogleApiWrapper__WEBPACK_IMPORTED_MODULE_8__/* .withGoogleApi */ .q)({
  apiKey: "AIzaSyBW6lVlo-kbzkD3bThsccdDilCdb8_CPH8"
})(props => {
  var _props$org, _props$org2, _props$org3, _props$org4, _props$org5, _props$org6, _props$org7, _props$org8, _props$org9, _props$org11;

  //#region org
  const [addOrg, addOrgMutation] = (0,features_orgs_orgsApi__WEBPACK_IMPORTED_MODULE_9__/* .useAddOrgMutation */ .vz)();
  const [editOrg, editOrgMutation] = (0,features_orgs_orgsApi__WEBPACK_IMPORTED_MODULE_9__/* .useEditOrgMutation */ .iO)(); //#endregion
  //#region form state

  const {
    control,
    register,
    handleSubmit,
    errors,
    setError,
    clearErrors,
    watch,
    getValues,
    setValue
  } = (0,react_hook_form__WEBPACK_IMPORTED_MODULE_3__.useForm)({
    defaultValues: {
      orgEmail: (_props$org = props.org) === null || _props$org === void 0 ? void 0 : _props$org.orgEmail,
      orgPhone: (_props$org2 = props.org) === null || _props$org2 === void 0 ? void 0 : _props$org2.orgPhone,
      orgWeb: (_props$org3 = props.org) === null || _props$org3 === void 0 ? void 0 : _props$org3.orgWeb
    },
    mode: "onChange"
  });
  watch("orgAddress");
  if (props.setOrgType) props.setOrgType(getValues("orgType"));
  const orgAddress = getValues("orgAddress") || ((_props$org4 = props.org) === null || _props$org4 === void 0 ? void 0 : _props$org4.orgAddress);
  const orgType = (0,models_Org__WEBPACK_IMPORTED_MODULE_10__/* .orgTypeFull */ .rY)(getValues("orgType") || ((_props$org5 = props.org) === null || _props$org5 === void 0 ? void 0 : _props$org5.orgType)) || "de l'organisation"; //#endregion
  //#region local state

  const toast = (0,_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__.useToast)({
    position: "top"
  });
  const {
    0: isLoading,
    1: setIsLoading
  } = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
  const {
    0: suggestion,
    1: setSuggestion
  } = (0,react__WEBPACK_IMPORTED_MODULE_2__.useState)();
  const {
    ready,
    value: autoCompleteValue,
    suggestions: {
      status,
      data
    },
    setValue: setAutoCompleteValue,
    clearSuggestions
  } = use_places_autocomplete__WEBPACK_IMPORTED_MODULE_4___default()({
    requestOptions: {
      componentRestrictions: {
        country: "fr"
      }
    },
    debounce: 300
  });
  (0,react__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    if (!suggestion) setAutoCompleteValue(orgAddress);
  }, [orgAddress]); //#endregion

  const onChange = () => {
    clearErrors("formErrorMessage");
  };

  const onSubmit = async form => {
    var _form$orgEmail, _form$orgPhone, _form$orgWeb, _form$orgDescription;

    console.log("submitted", form);
    setIsLoading(true);
    const orgEmail = (_form$orgEmail = form.orgEmail) === null || _form$orgEmail === void 0 ? void 0 : _form$orgEmail.filter(({
      email
    }) => email !== "");
    const orgPhone = (_form$orgPhone = form.orgPhone) === null || _form$orgPhone === void 0 ? void 0 : _form$orgPhone.filter(({
      phone
    }) => phone !== "");
    const orgWeb = (_form$orgWeb = form.orgWeb) === null || _form$orgWeb === void 0 ? void 0 : _form$orgWeb.filter(({
      url
    }) => url !== "");

    let payload = _objectSpread(_objectSpread({}, form), {}, {
      orgUrl: (0,utils_string__WEBPACK_IMPORTED_MODULE_13__/* .normalize */ .Fv)(form.orgName),
      orgDescription: form.orgDescription === "<p><br></p>" ? "" : (_form$orgDescription = form.orgDescription) === null || _form$orgDescription === void 0 ? void 0 : _form$orgDescription.replace(/\&nbsp;/g, " "),
      orgEmail: Array.isArray(orgEmail) && orgEmail.length > 0 ? orgEmail : [],
      orgPhone: Array.isArray(orgPhone) && orgPhone.length > 0 ? orgPhone : [],
      orgWeb: Array.isArray(orgWeb) && orgWeb.length > 0 ? orgWeb : []
    });

    try {
      const sugg = suggestion || data[0];

      if (sugg) {
        const {
          lat: orgLat,
          lng: orgLng,
          city: orgCity
        } = await (0,utils_maps__WEBPACK_IMPORTED_MODULE_11__/* .unwrapSuggestion */ .X8)(sugg);
        payload = _objectSpread(_objectSpread({}, payload), {}, {
          orgLat,
          orgLng,
          orgCity
        });
      }

      console.log("payload", payload);

      if (props.org) {
        await editOrg({
          payload,
          orgUrl: props.org.orgUrl
        }).unwrap();
        toast({
          title: "Votre organisation a bien été modifiée !",
          status: "success",
          isClosable: true
        });
      } else {
        payload.createdBy = props.session.user.userId;
        await addOrg(payload).unwrap();
        toast({
          title: "Votre organisation a bien été ajoutée !",
          status: "success",
          isClosable: true
        });
      }

      props.onClose && props.onClose();
      props.onSubmit && props.onSubmit(payload.orgUrl);
    } catch (error) {
      (0,utils_form__WEBPACK_IMPORTED_MODULE_14__/* .handleError */ .S)(error, (message, field) => {
        if (field) {
          setError(field, {
            type: "manual",
            message
          });
        } else {
          setError("formErrorMessage", {
            type: "manual",
            message
          });
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_12__.jsx)("form", {
    onChange: onChange,
    onSubmit: handleSubmit(onSubmit)
  }, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_12__.jsx)(_hookform_error_message__WEBPACK_IMPORTED_MODULE_1__.ErrorMessage, {
    errors: errors,
    name: "formErrorMessage",
    render: ({
      message
    }) => (0,_emotion_react__WEBPACK_IMPORTED_MODULE_12__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__.Alert, {
      status: "error",
      mb: 3
    }, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_12__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__.AlertIcon, null), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_12__.jsx)(features_common__WEBPACK_IMPORTED_MODULE_5__/* .ErrorMessageText */ .h1, null, message))
  }), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_12__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__.FormControl, {
    id: "orgName",
    isRequired: true,
    isInvalid: !!errors["orgName"],
    display: "flex",
    flexDirection: "column",
    mb: 3
  }, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_12__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__.FormLabel, null, "Nom ", orgType), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_12__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__.Input, {
    name: "orgName",
    placeholder: `Nom ${orgType}`,
    ref: register({
      required: `Veuillez saisir le nom ${orgType}` // pattern: {
      //   value: /^[A-zÀ-ú0-9 ]+$/i,
      //   message:
      //     "Veuillez saisir un nom composé de lettres et de chiffres uniquement"
      // }

    }),
    defaultValue: (_props$org6 = props.org) === null || _props$org6 === void 0 ? void 0 : _props$org6.orgName
  }), getValues("orgName") && (0,_emotion_react__WEBPACK_IMPORTED_MODULE_12__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__.Tooltip, {
    label: `Adresse de la page de ${orgType}`
  }, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_12__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__.Tag, {
    mt: 3,
    alignSelf: "flex-end",
    cursor: "help"
  }, "https://aucourant.de", "/", (0,utils_string__WEBPACK_IMPORTED_MODULE_13__/* .normalize */ .Fv)(getValues("orgName")))), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_12__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__.FormErrorMessage, null, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_12__.jsx)(_hookform_error_message__WEBPACK_IMPORTED_MODULE_1__.ErrorMessage, {
    errors: errors,
    name: "orgName"
  }))), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_12__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__.FormControl, {
    id: "orgType",
    isRequired: true,
    isInvalid: !!errors["orgType"],
    mb: 3
  }, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_12__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__.FormLabel, null, "Type ", orgType), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_12__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__.Select, {
    name: "orgType",
    ref: register({
      required: `Veuillez sélectionner le type ${orgType}`
    }),
    defaultValue: (_props$org7 = props.org) === null || _props$org7 === void 0 ? void 0 : _props$org7.orgType,
    placeholder: `Type ${orgType}`,
    color: "gray.400"
  }, Object.keys(models_Org__WEBPACK_IMPORTED_MODULE_10__/* .OrgTypes */ .T).map(orgType => {
    return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_12__.jsx)("option", {
      key: orgType,
      value: orgType
    }, models_Org__WEBPACK_IMPORTED_MODULE_10__/* .OrgTypesV */ .D2[orgType]);
  })), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_12__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__.FormErrorMessage, null, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_12__.jsx)(_hookform_error_message__WEBPACK_IMPORTED_MODULE_1__.ErrorMessage, {
    errors: errors,
    name: "orgType"
  }))), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_12__.jsx)(features_common__WEBPACK_IMPORTED_MODULE_5__/* .AddressControl */ .b$, {
    name: "orgAddress",
    isRequired: true,
    defaultValue: ((_props$org8 = props.org) === null || _props$org8 === void 0 ? void 0 : _props$org8.orgAddress) || "",
    errors: errors,
    control: control,
    mb: 3,
    placeholder: `Adresse ${orgType}`,
    onSuggestionSelect: suggestion => {
      setSuggestion(suggestion);
    }
  }), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_12__.jsx)(features_common__WEBPACK_IMPORTED_MODULE_5__/* .EmailControl */ .sm, {
    name: "orgEmail",
    register: register,
    control: control,
    errors: errors,
    setValue: setValue,
    placeholder: `Adresse e-mail ${orgType}`
  }), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_12__.jsx)(features_common_forms_PhoneControl__WEBPACK_IMPORTED_MODULE_6__/* .PhoneControl */ .K, {
    name: "orgPhone",
    register: register,
    control: control,
    errors: errors,
    setValue: setValue,
    placeholder: `Numéro de téléphone ${orgType}`
  }), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_12__.jsx)(features_common_forms_UrlControl__WEBPACK_IMPORTED_MODULE_7__/* .UrlControl */ .I, {
    name: "orgWeb",
    register: register,
    control: control,
    errors: errors,
    setValue: setValue,
    placeholder: `Site internet ${orgType}`
  }), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_12__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__.FormControl, {
    id: "orgDescription",
    isInvalid: !!errors["orgDescription"],
    mb: 3
  }, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_12__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__.FormLabel, null, "Description"), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_12__.jsx)(react_hook_form__WEBPACK_IMPORTED_MODULE_3__.Controller, {
    name: "orgDescription",
    control: control,
    defaultValue: ((_props$org9 = props.org) === null || _props$org9 === void 0 ? void 0 : _props$org9.orgDescription) || "",
    render: p => {
      var _props$org10;

      return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_12__.jsx)(features_common__WEBPACK_IMPORTED_MODULE_5__/* .RTEditor */ .Qd, {
        org: props.org,
        session: props.session,
        defaultValue: (_props$org10 = props.org) === null || _props$org10 === void 0 ? void 0 : _props$org10.orgDescription,
        onChange: p.onChange,
        placeholder: "D\xE9crivez l'organisation, ses activit\xE9s, etc..." // TODO placeholder={`Description ${orgType}`}

      });
    }
  }), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_12__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__.FormErrorMessage, null, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_12__.jsx)(_hookform_error_message__WEBPACK_IMPORTED_MODULE_1__.ErrorMessage, {
    errors: errors,
    name: "orgDescription"
  }))), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_12__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__.FormControl, {
    id: "orgVisibility",
    isRequired: true,
    isInvalid: !!errors["orgVisibility"],
    onChange: async e => {
      clearErrors("orgOrgs");
    },
    mb: 3
  }, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_12__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__.FormLabel, null, "Visibilit\xE9"), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_12__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__.Select, {
    name: "orgVisibility",
    defaultValue: ((_props$org11 = props.org) === null || _props$org11 === void 0 ? void 0 : _props$org11.orgVisibility) || models_Org__WEBPACK_IMPORTED_MODULE_10__/* .Visibility */ .EE[models_Org__WEBPACK_IMPORTED_MODULE_10__/* .Visibility.PUBLIC */ .EE.PUBLIC],
    ref: register({
      required: "Veuillez sélectionner la visibilité de l'organisation"
    }),
    placeholder: "Visibilit\xE9 de l'organisation",
    color: "gray.400"
  }, [models_Org__WEBPACK_IMPORTED_MODULE_10__/* .Visibility.PUBLIC */ .EE.PUBLIC, models_Org__WEBPACK_IMPORTED_MODULE_10__/* .Visibility.PRIVATE */ .EE.PRIVATE].map(key => {
    return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_12__.jsx)("option", {
      key: key,
      value: key
    }, models_Org__WEBPACK_IMPORTED_MODULE_10__/* .VisibilityV */ .XO[key]);
  })), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_12__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__.FormErrorMessage, null, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_12__.jsx)(_hookform_error_message__WEBPACK_IMPORTED_MODULE_1__.ErrorMessage, {
    errors: errors,
    name: "orgVisibility"
  }))), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_12__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__.Flex, {
    justifyContent: "space-between"
  }, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_12__.jsx)(features_common__WEBPACK_IMPORTED_MODULE_5__/* .Button */ .zx, {
    onClick: () => props.onCancel && props.onCancel() // dark={{ bg: "gray.700", _hover: { bg: "gray.600" } }}

  }, "Annuler"), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_12__.jsx)(features_common__WEBPACK_IMPORTED_MODULE_5__/* .Button */ .zx, {
    colorScheme: "green",
    type: "submit",
    isLoading: isLoading || addOrgMutation.isLoading || editOrgMutation.isLoading,
    isDisabled: Object.keys(errors).length > 0,
    "data-cy": "orgFormSubmit"
  }, props.org ? "Modifier" : "Ajouter")));
});

/***/ }),

/***/ 4497:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "S2": function() { return /* reexport */ EmailLoginPopover; },
  "Qj": function() { return /* reexport */ EventPopover; },
  "$_": function() { return /* reexport */ Footer; },
  "nz": function() { return /* reexport */ GlobalStyles; },
  "h4": function() { return /* reexport */ Header; },
  "Ar": function() { return /* reexport */ Layout; },
  "or": function() { return /* reexport */ Main; },
  "JL": function() { return /* reexport */ Nav; },
  "ei": function() { return /* reexport */ OrgPopover; }
});

// EXTERNAL MODULE: external "@emotion/react"
var react_ = __webpack_require__(7381);
// EXTERNAL MODULE: external "@chakra-ui/react"
var external_chakra_ui_react_ = __webpack_require__(3426);
;// CONCATENATED MODULE: ./src/features/layout/Footer.tsx
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }




const Footer = (_ref) => {
  let {
    children
  } = _ref,
      props = _objectWithoutProperties(_ref, ["children"]);

  const {
    colorMode
  } = (0,external_chakra_ui_react_.useColorMode)();
  const isDark = colorMode === "dark";

  const styles = /*#__PURE__*/(0,react_.css)(isDark ? {
    "--tw-bg-opacity": "1",
    "backgroundColor": "rgba(31, 41, 55, var(--tw-bg-opacity))"
  } : {
    "--tw-bg-opacity": "1",
    "backgroundColor": "rgba(255, 255, 255, var(--tw-bg-opacity))"
  }, ";" + ( true ? "" : 0),  true ? "" : 0);

  return (0,react_.jsx)(external_chakra_ui_react_.Box, _extends({
    as: "footer",
    css: styles
  }, props), children);
};
// EXTERNAL MODULE: ./src/theme/theme.ts + 1 modules
var theme = __webpack_require__(26);
;// CONCATENATED MODULE: ./src/features/layout/GlobalStyles.tsx



const GlobalStyles = () => (0,react_.jsx)(react_.Global, {
  styles: /*#__PURE__*/(0,react_.css)("@font-face{font-family:\"Aladin\";src:url(\"/fonts/Aladin-Regular.ttf\");}html,body,#__next{height:100%;}body,#__next{display:flex;flex-direction:column;}@media (min-width: ", theme/* breakpoints.2xl */.A["2xl"], "){.chakra-ui-light{background:lightblue;}.chakra-ui-dark{background:black;}}", RainbowTextStyles, " ", ReactToggleStyles, " .ql-editor,.ql-editor ul{padding:0;}.ql-editor a{text-decoration:underline;color:blue;}" + ( true ? "" : 0),  true ? "" : 0)
});
const RainbowTextStyles = `
  .rainbow-text {
    /* Create a conic gradient. */
    /* Double percentages to avoid blur (#000 10%, #fff 10%, #fff 20%, ...). */
    background: #ca4246;
    background-color: #ca4246;
    background: conic-gradient(
      #ca4246 16.666%,
      #e16541 16.666%,
      #e16541 33.333%,
      #f18f43 33.333%,
      #f18f43 50%,
      #8b9862 50%,
      #8b9862 66.666%,
      #476098 66.666%,
      #476098 83.333%,
      #a7489b 83.333%
    );

    /* Set the background size and repeat properties. */
    background-size: 57%;
    background-repeat: repeat;

    /* Use the text as a mask for the background. */
    /* This will show the gradient as a text color rather than element bg. */
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    /* Animate the text when loading the element. */
    /* This animates it on page load and when hovering out. */
    animation: rainbow-text-animation-rev 0.5s ease forwards;

    cursor: pointer;
  }

  /* Add animation on hover. */
  .rainbow-text:hover {
    animation: rainbow-text-animation 0.5s ease forwards;
  }

  /* Move the background and make it larger. */
  /* Animation shown when hovering over the text. */
  @keyframes rainbow-text-animation {
    0% {
      background-size: 57%;
      background-position: 0 0;
    }
    20% {
      background-size: 57%;
      background-position: 0 1em;
    }
    100% {
      background-size: 300%;
      background-position: -9em 1em;
    }
  }

  /* Move the background and make it smaller. */
  /* Animation shown when entering the page and after the hover animation. */
  @keyframes rainbow-text-animation-rev {
    0% {
      background-size: 300%;
      background-position: -9em 1em;
    }
    20% {
      background-size: 57%;
      background-position: 0 1em;
    }
    100% {
        background-size: 57%;
        background-position: 0 0;
      }
    }
`;
const ReactToggleStyles = `
  .react-toggle {
    touch-action: pan-x;

    display: inline-block;
    position: relative;
    cursor: pointer;
    background-color: transparent;
    border: 0;
    padding: 0;

    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-tap-highlight-color: transparent;
  }

  .react-toggle-screenreader-only {
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  }

  .react-toggle--disabled {
    cursor: not-allowed;
    opacity: 0.5;
    -webkit-transition: opacity 0.25s;
    transition: opacity 0.25s;
  }

  .react-toggle-track {
    width: 50px;
    height: 24px;
    padding: 0;
    border-radius: 30px;
    background-color: #4d4d4d;
    -webkit-transition: all 0.2s ease;
    -moz-transition: all 0.2s ease;
    transition: all 0.2s ease;
  }

  .react-toggle:hover:not(.react-toggle--disabled) .react-toggle-track {
    background-color: #000000;
  }

  .react-toggle--checked .react-toggle-track {
    background-color: #19ab27;
  }

  .react-toggle--checked:hover:not(.react-toggle--disabled)
    .react-toggle-track {
    background-color: #128d15;
  }

  .react-toggle-track-check {
    position: absolute;
    width: 14px;
    height: 10px;
    top: 0px;
    bottom: 0px;
    margin: 4px 0 0 0;
    line-height: 0;
    left: 8px;
    opacity: 0;
    -webkit-transition: opacity 0.25s ease;
    -moz-transition: opacity 0.25s ease;
    transition: opacity 0.25s ease;
  }

  .react-toggle--checked .react-toggle-track-check {
    opacity: 1;
    -webkit-transition: opacity 0.25s ease;
    -moz-transition: opacity 0.25s ease;
    transition: opacity 0.25s ease;
  }

  .react-toggle-track-x {
    position: absolute;
    width: 10px;
    height: 10px;
    top: 0px;
    bottom: 0px;
    margin: 4px 0 0 0;
    line-height: 0;
    right: 10px;
    opacity: 1;
    -webkit-transition: opacity 0.25s ease;
    -moz-transition: opacity 0.25s ease;
    transition: opacity 0.25s ease;
  }

  .react-toggle--checked .react-toggle-track-x {
    opacity: 0;
  }

  .react-toggle-thumb {
    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1) 0ms;
    position: absolute;
    top: 1px;
    left: 1px;
    width: 22px;
    height: 22px;
    border: 1px solid #4d4d4d;
    border-radius: 50%;
    background-color: #fafafa;

    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;

    -webkit-transition: all 0.25s ease;
    -moz-transition: all 0.25s ease;
    transition: all 0.25s ease;
  }

  .react-toggle--checked .react-toggle-thumb {
    left: 27px;
    border-color: #19ab27;
  }

  .react-toggle--focus .react-toggle-thumb {
    -webkit-box-shadow: 0px 0px 3px 2px #0099e0;
    -moz-box-shadow: 0px 0px 3px 2px #0099e0;
    box-shadow: 0px 0px 2px 3px #0099e0;
  }

  .react-toggle:active:not(.react-toggle--disabled) .react-toggle-thumb {
    -webkit-box-shadow: 0px 0px 5px 5px #0099e0;
    -moz-box-shadow: 0px 0px 5px 5px #0099e0;
    box-shadow: 0px 0px 5px 5px #0099e0;
  }
`;
// EXTERNAL MODULE: external "@react-icons/all-files/fa/FaRegCalendarTimes.js"
var FaRegCalendarTimes_js_ = __webpack_require__(9501);
// EXTERNAL MODULE: external "@react-icons/all-files/fa/FaRegCalendarCheck.js"
var FaRegCalendarCheck_js_ = __webpack_require__(8209);
// EXTERNAL MODULE: external "@react-icons/all-files/io/IoIosPeople.js"
var IoIosPeople_js_ = __webpack_require__(4244);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(9297);
var external_react_default = /*#__PURE__*/__webpack_require__.n(external_react_);
// EXTERNAL MODULE: external "next/router"
var router_ = __webpack_require__(6731);
// EXTERNAL MODULE: ./src/features/common/index.tsx + 23 modules
var common = __webpack_require__(1109);
// EXTERNAL MODULE: external "@chakra-ui/icons"
var icons_ = __webpack_require__(3724);
// EXTERNAL MODULE: ./src/models/Event.ts
var Event = __webpack_require__(7823);
;// CONCATENATED MODULE: ./src/features/layout/Header.tsx




function Header_extends() { Header_extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return Header_extends.apply(this, arguments); }

function Header_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = Header_objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function Header_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }










const Header = (_ref) => {
  let {
    defaultTitle,
    defaultTitleColor,
    event,
    org,
    pageTitle,
    pageSubTitle
  } = _ref,
      props = Header_objectWithoutProperties(_ref, ["defaultTitle", "defaultTitleColor", "event", "org", "pageTitle", "pageSubTitle"]);

  const router = (0,router_.useRouter)();
  const {
    colorMode
  } = (0,external_chakra_ui_react_.useColorMode)();
  const isDark = colorMode === "dark";
  const banner = (event === null || event === void 0 ? void 0 : event.eventBanner) || (org === null || org === void 0 ? void 0 : org.orgBanner);
  const bgImage = banner ? `url("${banner.base64 || banner.url}")` : "";
  const logo = (event === null || event === void 0 ? void 0 : event.eventLogo) || (org === null || org === void 0 ? void 0 : org.orgLogo);
  const logoBgImage = logo ? `url("${logo.base64}")` : "";
  const logoBgSize = "110px"; //#region local state

  const hasTitle = org || event || pageTitle;
  const {
    0: className,
    1: setClassName
  } = (0,external_react_.useState)("");
  const {
    0: isBannerModalOpen,
    1: setIsBannerModalOpen
  } = (0,external_react_.useState)(false);
  const {
    0: isLogoModalOpen,
    1: setIsLogoModalOpen
  } = (0,external_react_.useState)(false); // const [bgHeight, setBgHeight] = useState<number | undefined>(
  //   banner?.height || 140
  // );
  // const [bgWidth, setBgWidth] = useState(banner?.width || 1154);
  // if (banner?.url) {
  //   getMeta(banner.url, (width, height) => {
  //     setBgHeight(height);
  //     setBgWidth(width);
  //   });
  // }
  //#endregion

  return (0,react_.jsx)(external_chakra_ui_react_.Flex, Header_extends({
    as: "header",
    alignItems: "center",
    cursor: banner ? "pointer" : "default",
    height: banner ? banner.height : undefined,
    css: /*#__PURE__*/(0,react_.css)("background-image:", bgImage, ";background-size:cover;background-repeat:no-repeat;", isDark ? {
      "--tw-bg-opacity": "1",
      "backgroundColor": "rgba(31, 41, 55, var(--tw-bg-opacity))"
    } : {
      "--tw-bg-opacity": "1",
      "backgroundColor": "rgba(255, 255, 255, var(--tw-bg-opacity))"
    }, "@media (min-width: ", theme/* breakpoints.2xl */.A["2xl"], "){}" + ( true ? "" : 0),  true ? "" : 0),
    onClick: e => {
      e.stopPropagation();
      setIsBannerModalOpen(true);
    }
  }, props), logo ? (0,react_.jsx)((external_react_default()).Fragment, null, (0,react_.jsx)(common/* Link */.rU, {
    alignSelf: "flex-end",
    onClick: e => {
      e.stopPropagation();
      setIsLogoModalOpen(true);
    }
  }, (0,react_.jsx)(external_chakra_ui_react_.Box, {
    css: /*#__PURE__*/(0,react_.css)("margin:", !banner ? "12px 0 12px 12px" : 0, ";height:", logoBgSize, ";width:", logoBgSize, ";background-image:", logoBgImage, ";background-size:cover;border-top-right-radius:12px;" + ( true ? "" : 0),  true ? "" : 0)
  })), (0,react_.jsx)(external_chakra_ui_react_.Box, {
    bgColor: isDark ? "black" : "white",
    borderRadius: "lg",
    ml: 5,
    px: 3
  }, (0,react_.jsx)(common/* Link */.rU, {
    href: router.asPath,
    variant: "no-underline"
  }, (0,react_.jsx)(external_chakra_ui_react_.Text, {
    as: "h1",
    className: "rainbow-text",
    display: "flex",
    alignItems: "center",
    fontSize: ["3xl", "3xl", pageSubTitle ? "3xl" : "3xl"]
  }, org || event ? (0,react_.jsx)(external_chakra_ui_react_.Icon, {
    mr: 3,
    as: org ? IoIosPeople_js_.IoIosPeople : event !== null && event !== void 0 && event.isApproved ? FaRegCalendarCheck_js_.FaRegCalendarCheck : FaRegCalendarTimes_js_.FaRegCalendarTimes
  }) : pageTitle === "Forum" && (0,react_.jsx)(external_chakra_ui_react_.Icon, {
    mr: 3,
    as: icons_.ChatIcon
  }), org ? org.orgName : event ? event.eventName : pageTitle))), (event === null || event === void 0 ? void 0 : event.eventCategory) && (0,react_.jsx)(external_chakra_ui_react_.Tag, {
    ml: 3,
    bgColor: Event/* Category */.WD[event.eventCategory || 0].bgColor === "transparent" ? isDark ? "whiteAlpha.300" : "blackAlpha.600" : Event/* Category */.WD[event.eventCategory || 0].bgColor,
    color: "white"
  }, Event/* Category */.WD[event.eventCategory || 0].label)) : (0,react_.jsx)(external_chakra_ui_react_.Flex, {
    flexDirection: "column",
    ml: 5,
    onMouseEnter: () => setClassName("rainbow-text"),
    onMouseLeave: () => setClassName("")
  }, (0,react_.jsx)(common/* Link */.rU, {
    className: className,
    variant: "no-underline",
    fontFamily: "Aladin",
    fontSize: "x-large",
    fontStyle: "italic" //mb={!pageTitle ? 5 : undefined}
    ,
    color: defaultTitleColor,
    onClick: () => router.push("/", "/", {
      shallow: true
    })
  }, (0,react_.jsx)(external_chakra_ui_react_.Text, {
    as: "h1"
  }, defaultTitle)), hasTitle ? (0,react_.jsx)((external_react_default()).Fragment, null, (0,react_.jsx)(common/* Link */.rU, {
    href: router.asPath,
    variant: "no-underline"
  }, (0,react_.jsx)(external_chakra_ui_react_.Text, {
    as: "h1",
    className: "rainbow-text",
    fontSize: ["3xl", "3xl", pageSubTitle ? "3xl" : "3xl"],
    display: "flex",
    alignItems: "center"
  }, org || event ? (0,react_.jsx)(external_chakra_ui_react_.Icon, {
    mr: 3,
    as: org ? IoIosPeople_js_.IoIosPeople : event !== null && event !== void 0 && event.isApproved ? FaRegCalendarCheck_js_.FaRegCalendarCheck : FaRegCalendarTimes_js_.FaRegCalendarTimes
  }) : pageTitle === "Forum" && (0,react_.jsx)(external_chakra_ui_react_.Icon, {
    mr: 3,
    as: icons_.ChatIcon
  }), org ? org.orgName : event ? event.eventName : pageTitle)), event ? (0,react_.jsx)(external_chakra_ui_react_.Box, null, (0,react_.jsx)(external_chakra_ui_react_.Tag, {
    bgColor: Event/* Category */.WD[event.eventCategory || 0].bgColor === "transparent" ? isDark ? "whiteAlpha.300" : "blackAlpha.600" : Event/* Category */.WD[event.eventCategory || 0].bgColor,
    color: "white"
  }, Event/* Category */.WD[event.eventCategory || 0].label)) : pageSubTitle) : null), banner && (isBannerModalOpen ? (0,react_.jsx)(external_chakra_ui_react_.Modal, {
    size: "full",
    isOpen: true,
    closeOnOverlayClick: true,
    onClose: () => {
      setIsBannerModalOpen(false);
    }
  }, (0,react_.jsx)(external_chakra_ui_react_.ModalOverlay, null, (0,react_.jsx)(external_chakra_ui_react_.ModalContent, {
    bg: "transparent",
    mt: 0,
    minHeight: "auto"
  }, (0,react_.jsx)(external_chakra_ui_react_.ModalHeader, {
    bg: "blackAlpha.700",
    color: "white"
  }, "Banni\xE8re de ", org ? org.orgName : event ? event.eventName : ""), (0,react_.jsx)(external_chakra_ui_react_.ModalCloseButton, {
    color: "white"
  }), (0,react_.jsx)(external_chakra_ui_react_.ModalBody, {
    display: "flex",
    flexDirection: "column",
    p: 0
  }, (0,react_.jsx)(external_chakra_ui_react_.Box, {
    bg: bgImage,
    bgRepeat: "no-repeat",
    bgSize: "contain",
    height: banner.height || 140,
    width: banner.width || 1154,
    alignSelf: "center"
  }))))) : logo && isLogoModalOpen && (0,react_.jsx)(external_chakra_ui_react_.Modal, {
    size: "full",
    isOpen: true,
    closeOnOverlayClick: true,
    onClose: () => {
      setIsLogoModalOpen(false);
    }
  }, (0,react_.jsx)(external_chakra_ui_react_.ModalOverlay, null, (0,react_.jsx)(external_chakra_ui_react_.ModalContent, {
    bg: "transparent",
    mt: 0,
    minHeight: "auto"
  }, (0,react_.jsx)(external_chakra_ui_react_.ModalHeader, {
    bg: "blackAlpha.700",
    color: "white"
  }, "Logo de ", org ? org.orgName : event ? event.eventName : ""), (0,react_.jsx)(external_chakra_ui_react_.ModalCloseButton, {
    color: "white"
  }), (0,react_.jsx)(external_chakra_ui_react_.ModalBody, {
    display: "flex",
    flexDirection: "column",
    p: 0
  }, (0,react_.jsx)(external_chakra_ui_react_.Box, {
    bg: logoBgImage,
    bgRepeat: "no-repeat",
    height: logo.height,
    width: logo.width,
    alignSelf: "center"
  })))))));
};
// EXTERNAL MODULE: external "next/head"
var head_ = __webpack_require__(701);
var head_default = /*#__PURE__*/__webpack_require__.n(head_);
// EXTERNAL MODULE: external "nextjs-progressbar"
var external_nextjs_progressbar_ = __webpack_require__(1687);
var external_nextjs_progressbar_default = /*#__PURE__*/__webpack_require__.n(external_nextjs_progressbar_);
// EXTERNAL MODULE: external "react-detect-offline"
var external_react_detect_offline_ = __webpack_require__(8064);
;// CONCATENATED MODULE: ./src/features/common/forms/PaypalButton.tsx

const PaypalButton = () => {
  return (0,react_.jsx)("form", {
    action: "https://www.paypal.com/donate",
    method: "post",
    target: "_top"
  }, (0,react_.jsx)("input", {
    type: "hidden",
    name: "hosted_button_id",
    value: "Z59K3UWBJDUS8"
  }), (0,react_.jsx)("input", {
    type: "image",
    src: "https://www.paypalobjects.com/fr_FR/FR/i/btn/btn_donate_LG.gif",
    name: "submit",
    title: "PayPal - The safer, easier way to pay online!",
    alt: "Donate with PayPal button"
  }), (0,react_.jsx)("img", {
    alt: "",
    src: "https://www.paypal.com/fr_FR/i/scr/pixel.gif",
    width: "1",
    height: "1"
  }));
};
;// CONCATENATED MODULE: ./src/features/layout/Layout.tsx
function Layout_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = Layout_objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function Layout_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }












const defaultTitle = "Au courant de...";
const Layout = (_ref) => {
  let {
    logo,
    banner,
    children,
    isLogin,
    pageHeader,
    pageTitle,
    pageSubTitle,
    session,
    title
  } = _ref,
      props = Layout_objectWithoutProperties(_ref, ["logo", "banner", "children", "isLogin", "pageHeader", "pageTitle", "pageSubTitle", "session", "title"]);

  const {
    colorMode
  } = (0,external_chakra_ui_react_.useColorMode)();
  const isDark = colorMode === "dark";
  let defaultTitleColor = isDark ? "white" : "black";

  if (banner) {
    defaultTitleColor = banner.mode === "light" ? "white" : "black";
  }

  const {
    0: hasVerticalScrollbar,
    1: setHasVerticalScrollbar
  } = (0,external_react_.useState)(false); // console.log("hasVerticalScrollbar", hasVerticalScrollbar);

  const handleResize = () => {
    let scrollHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);

    if (scrollHeight >= window.innerHeight) {
      setHasVerticalScrollbar(true);
    }
  };

  (0,external_react_.useEffect)(() => {
    window.addEventListener("resize", handleResize);
    handleResize();
  }, []);
  return (0,react_.jsx)((external_react_default()).Fragment, null, (0,react_.jsx)((head_default()), null, (0,react_.jsx)("meta", {
    charSet: "utf-8"
  }), (0,react_.jsx)("meta", {
    name: "viewport",
    content: "width=device-width, initial-scale=1.0"
  }), (0,react_.jsx)("title", null, title ? `${defaultTitle} ${title}` : pageTitle ? `${defaultTitle} ${pageTitle}` : defaultTitle)), (0,react_.jsx)(external_chakra_ui_react_.Flex, {
    css: /*#__PURE__*/(0,react_.css)("flex-direction:column;flex-grow:1;@media (min-width: ", theme/* breakpoints.2xl */.A["2xl"], "){margin:0 auto;width:1180px;", isDark ? `
            border-left: 12px solid transparent;
            border-right: 12px solid transparent;
            border-image: linear-gradient(to bottom right, #b827fc 0%, #2c90fc 25%, #b8fd33 50%, #fec837 75%, #fd1892 100%);
            border-image-slice: 1;
            ` : `
            border-left: 12px solid transparent;
            border-right: 12px solid transparent;
            border-image: url("data:image/svg+xml;charset=utf-8,%3Csvg width='100' height='100' viewBox='0 0 100 100' fill='none' xmlns='http://www.w3.org/2000/svg'%3E %3ClinearGradient id='g' x1='0%25' y1='0%25' x2='0%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23cffffe' /%3E%3Cstop offset='25%25' stop-color='%23f9f7d9' /%3E%3Cstop offset='50%25' stop-color='%23fce2ce' /%3E%3Cstop offset='100%25' stop-color='%23ffc1f3' /%3E%3C/linearGradient%3E %3Cpath d='M1.5 1.5 l97 0l0 97l-97 0 l0 -97' stroke-linecap='square' stroke='url(%23g)' stroke-width='3'/%3E %3C/svg%3E") 1;
            `, ";}" + ( true ? "" : 0),  true ? "" : 0)
  }, (0,react_.jsx)((external_nextjs_progressbar_default()), {
    color: "#29D",
    startPosition: 0.3,
    stopDelayMs: 200,
    height: 3,
    showOnShallow: true
  }), (0,react_.jsx)(Header, {
    defaultTitle: defaultTitle,
    defaultTitleColor: defaultTitleColor,
    org: props.org,
    event: props.event,
    pageTitle: pageTitle,
    pageSubTitle: pageSubTitle
  }), (0,react_.jsx)(Nav, {
    py: hasVerticalScrollbar ? 7 : 0,
    minH: "96px",
    isLogin: isLogin,
    session: session
  }), (0,react_.jsx)(Main, props, children), (0,react_.jsx)(Footer, null, (0,react_.jsx)(external_chakra_ui_react_.Flex, {
    justifyContent: "space-between",
    alignItems: "center",
    pl: 5,
    pr: 5,
    pb: 5
  },  true && (0,react_.jsx)(PaypalButton, null), (0,react_.jsx)(common/* DarkModeSwitch */.pZ, null))),  true && (0,react_.jsx)(external_react_detect_offline_.Offline, null, (0,react_.jsx)(external_chakra_ui_react_.Box, {
    pointerEvents: "none",
    position: "fixed",
    bottom: "40px",
    right: "20px",
    bg: isDark ? "whiteAlpha.300" : "blackAlpha.200",
    borderRadius: "lg",
    p: 3
  }, (0,react_.jsx)(external_chakra_ui_react_.Icon, {
    viewBox: "0 0 256 256",
    boxSize: 10,
    mr: 3 //h="48px"
    //w="48px"

  }, (0,react_.jsx)("line", {
    x1: "48",
    x2: "208",
    y1: "40",
    y2: "216",
    fill: "none",
    stroke: "red",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "16"
  }), (0,react_.jsx)("path", {
    fill: "none",
    stroke: isDark ? "#fff" : "#000",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    strokeWidth: "16",
    d: "M107.12984 57.47077a148.358 148.358 0 0 1 20.86235-1.46787 145.90176 145.90176 0 0 1 102.9284 42.17662M25.06379 98.17952A145.88673 145.88673 0 0 1 72.42537 66.8671M152.11967 106.95874a97.88568 97.88568 0 0 1 44.88614 25.1619M58.97857 132.12064a97.89874 97.89874 0 0 1 49.03639-26.105M92.91969 166.06177a50.81565 50.81565 0 0 1 67.576-2.317"
  }), (0,react_.jsx)("circle", {
    cx: "128",
    cy: "200",
    r: "12",
    fill: isDark ? "#fff" : "#000"
  })), "V\xE9rifiez votre connexion \xE0 internet pour continuer \xE0 utiliser l'application."))));
};
// EXTERNAL MODULE: external "@chakra-ui/color-mode"
var color_mode_ = __webpack_require__(3321);
;// CONCATENATED MODULE: ./src/features/layout/Main.tsx
function Main_extends() { Main_extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return Main_extends.apply(this, arguments); }

function Main_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = Main_objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function Main_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }






const Main = (_ref) => {
  let {
    p = 5
  } = _ref,
      props = Main_objectWithoutProperties(_ref, ["p"]);

  const {
    colorMode
  } = (0,color_mode_.useColorMode)();
  const isDark = colorMode === "dark";

  const styles = /*#__PURE__*/(0,react_.css)(isDark ? {
    "--tw-bg-opacity": "1",
    "backgroundColor": "rgba(31, 41, 55, var(--tw-bg-opacity))"
  } : {
    "--tw-bg-opacity": "1",
    "backgroundColor": "rgba(255, 255, 255, var(--tw-bg-opacity))"
  }, "@media (min-width: ", theme/* breakpoints.2xl */.A["2xl"], "){}" + ( true ? "" : 0),  true ? "" : 0);

  return (0,react_.jsx)(external_chakra_ui_react_.Box, Main_extends({
    as: "main",
    flex: "1 0 auto",
    p: p,
    css: styles
  }, props));
};
// EXTERNAL MODULE: external "@react-icons/all-files/fa/FaPowerOff.js"
var FaPowerOff_js_ = __webpack_require__(8669);
// EXTERNAL MODULE: external "next-auth/client"
var client_ = __webpack_require__(8104);
// EXTERNAL MODULE: external "react-device-detect"
var external_react_device_detect_ = __webpack_require__(2047);
// EXTERNAL MODULE: external "react-redux"
var external_react_redux_ = __webpack_require__(79);
// EXTERNAL MODULE: external "react-hook-form"
var external_react_hook_form_ = __webpack_require__(2662);
// EXTERNAL MODULE: external "@hookform/error-message"
var error_message_ = __webpack_require__(5228);
// EXTERNAL MODULE: ./src/utils/api.ts
var api = __webpack_require__(6837);
// EXTERNAL MODULE: ./src/utils/form.ts
var utils_form = __webpack_require__(6941);
// EXTERNAL MODULE: ./src/utils/email.ts
var email = __webpack_require__(9281);
;// CONCATENATED MODULE: ./src/features/forms/ForgottenForm.tsx










const ForgottenForm = ({
  display,
  onCancel,
  onSuccess
}) => {
  const {
    0: isLoading,
    1: setIsLoading
  } = (0,external_react_.useState)(false);
  const {
    0: isSent,
    1: setIsSent
  } = (0,external_react_.useState)(false);
  const {
    0: savedSecurityCode,
    1: setSavedSecurityCode
  } = (0,external_react_.useState)();
  const {
    0: isValid,
    1: setIsValid
  } = (0,external_react_.useState)(false);
  const {
    0: savedEmail,
    1: setSavedEmail
  } = (0,external_react_.useState)();
  const toast = (0,external_chakra_ui_react_.useToast)({
    position: "top"
  });
  const {
    control,
    register,
    handleSubmit,
    getValues,
    watch,
    errors,
    setError,
    clearErrors,
    trigger,
    reset
  } = (0,external_react_hook_form_.useForm)({
    mode: "onChange"
  });

  const onChange = () => {
    clearErrors("formErrorMessage");
  };

  const onSubmit = async () => {
    setIsLoading(true);
    await trigger();
    const {
      emailForgotten,
      securityCode,
      password
    } = getValues(["emailForgotten", "securityCode", "password"]);

    if (emailForgotten) {
      const {
        error,
        data
      } = await api/* default.post */.Z.post("auth/forgotten", {
        email: emailForgotten
      });

      if (error) {
        (0,utils_form/* handleError */.S)(error, (message, field) => {
          if (!field || field === "message") {
            setError("formErrorMessage", {
              type: "manual",
              message
            });
          }
        });
      } else {
        setSavedEmail(emailForgotten);
        setSavedSecurityCode(data);
        reset();
        setIsSent(true);
        toast({
          title: `Veuillez saisir le code de sécurité qui vous a été envoyé à ${emailForgotten}`,
          status: "success",
          duration: 9000,
          isClosable: true
        });
      }
    } else if (securityCode) {
      if (parseInt(savedSecurityCode) === parseInt(securityCode)) {
        setIsValid(true);
      } else {
        setError("formErrorMessage", {
          type: "manual",
          message: "Le code de sécurité est incorrect."
        });
      }
    } else if (password) {
      const {
        error,
        data
      } = await api/* default.post */.Z.post("auth/forgotten", {
        email: savedEmail,
        password
      });

      if (error) {
        (0,utils_form/* handleError */.S)(error, (message, field) => {
          if (!field || field === "message") {
            setError("formErrorMessage", {
              type: "manual",
              message
            });
          }
        });
      } else {
        toast({
          title: `Le mot de passe du compte ${savedEmail} a bien été changé.`,
          status: "success",
          isClosable: true
        });
        onSuccess && onSuccess();
      }
    } else {}

    setIsLoading(false);
  };

  return (0,react_.jsx)("form", {
    style: {
      display
    },
    onChange: onChange,
    onSubmit: handleSubmit(onSubmit)
  }, (0,react_.jsx)(error_message_.ErrorMessage, {
    errors: errors,
    name: "formErrorMessage",
    render: ({
      message
    }) => (0,react_.jsx)(external_chakra_ui_react_.Alert, {
      status: "error",
      mb: 3
    }, (0,react_.jsx)(external_chakra_ui_react_.AlertIcon, null), (0,react_.jsx)(common/* ErrorMessageText */.h1, null, message))
  }), !isSent && !isValid && (0,react_.jsx)(external_chakra_ui_react_.FormControl, {
    id: "emailForgotten",
    isRequired: true,
    isInvalid: !!errors["emailForgotten"],
    mb: 3
  }, (0,react_.jsx)(external_chakra_ui_react_.FormLabel, null, "Adresse e-mail"), (0,react_.jsx)(external_chakra_ui_react_.InputGroup, null, (0,react_.jsx)(external_chakra_ui_react_.InputLeftElement, {
    pointerEvents: "none",
    children: (0,react_.jsx)(icons_.EmailIcon, null)
  }), (0,react_.jsx)(external_chakra_ui_react_.Input, {
    name: "emailForgotten",
    placeholder: "Entrez votre adresse e-mail",
    ref: register({
      required: "Veuillez saisir votre adresse e-mail",
      pattern: {
        value: email/* emailR */.GN,
        message: "Adresse e-mail invalide"
      }
    })
  })), (0,react_.jsx)(external_chakra_ui_react_.FormErrorMessage, null, (0,react_.jsx)(error_message_.ErrorMessage, {
    errors: errors,
    name: "emailForgotten"
  }))), isSent && !isValid && (0,react_.jsx)(external_chakra_ui_react_.FormControl, {
    id: "securityCode",
    isRequired: true,
    isInvalid: !!errors["securityCode"],
    mb: 3
  }, (0,react_.jsx)(external_chakra_ui_react_.FormLabel, null, "Code de s\xE9curit\xE9"), (0,react_.jsx)(external_chakra_ui_react_.InputGroup, null, (0,react_.jsx)(external_chakra_ui_react_.Input, {
    name: "securityCode",
    placeholder: "Entrez le code de s\xE9curit\xE9",
    ref: register({
      required: "Veuillez saisir le code de sécurité"
    })
  })), (0,react_.jsx)(external_chakra_ui_react_.FormErrorMessage, null, (0,react_.jsx)(error_message_.ErrorMessage, {
    errors: errors,
    name: "securityCode"
  }))), isValid && (0,react_.jsx)((external_react_default()).Fragment, null, (0,react_.jsx)(external_chakra_ui_react_.FormControl, {
    id: "password",
    mb: 3,
    isRequired: true,
    isInvalid: !!errors["password"]
  }, (0,react_.jsx)(external_chakra_ui_react_.FormLabel, null, "Nouveau mot de passe"), (0,react_.jsx)(external_chakra_ui_react_.Input, {
    name: "password",
    ref: register({
      required: "Veuillez saisir un mot de passe"
    }),
    type: "password"
  }), (0,react_.jsx)(external_chakra_ui_react_.FormErrorMessage, null, (0,react_.jsx)(error_message_.ErrorMessage, {
    errors: errors,
    name: "password"
  }))), (0,react_.jsx)(external_chakra_ui_react_.FormControl, {
    id: "passwordConfirm",
    isRequired: true,
    isInvalid: !!errors["passwordConfirm"],
    mb: 3
  }, (0,react_.jsx)(external_chakra_ui_react_.FormLabel, null, "Confirmation du nouveau mot de passe"), (0,react_.jsx)(external_chakra_ui_react_.Input, {
    name: "passwordConfirm",
    ref: register({
      validate: value => value === getValues("password") || "Les mots de passe ne correspondent pas"
    }),
    type: "password"
  }), (0,react_.jsx)(external_chakra_ui_react_.FormErrorMessage, null, (0,react_.jsx)(error_message_.ErrorMessage, {
    errors: errors,
    name: "passwordConfirm"
  })))), (0,react_.jsx)(external_chakra_ui_react_.Flex, {
    justifyContent: "space-between"
  }, (0,react_.jsx)(external_chakra_ui_react_.Button, {
    onClick: () => {
      reset();
      setSavedEmail(undefined);
      setIsSent(false);
      setIsValid(false);
      onCancel();
    }
  }, "Annuler"), (0,react_.jsx)(external_chakra_ui_react_.Button, {
    colorScheme: "blue",
    type: "submit",
    isLoading: isLoading,
    isDisabled: Object.keys(errors).length > 0,
    p: 5,
    mb: 3
  }, "Valider")));
};
;// CONCATENATED MODULE: ./src/features/modals/LoginModal.tsx













const LoginModal = props => {
  const router = (0,router_.useRouter)();
  const {
    colorMode
  } = (0,external_chakra_ui_react_.useColorMode)();
  const isDark = colorMode === "dark";
  const {
    0: isEmail,
    1: setIsEmail
  } = (0,external_react_.useState)(false);
  const {
    0: isForgotten,
    1: setIsForgotten
  } = (0,external_react_.useState)(false);
  const {
    0: isSignup,
    1: setIsSignup
  } = (0,external_react_.useState)(false);
  const {
    0: isLoading,
    1: setIsLoading
  } = (0,external_react_.useState)(false);
  const {
    0: passwordFieldType,
    1: setPasswordFieldType
  } = (0,external_react_.useState)("password");
  const {
    0: passwordConfirmFieldType,
    1: setPasswordConfirmFieldType
  } = (0,external_react_.useState)("password");
  const {
    isOpen,
    onOpen,
    onClose
  } = (0,external_chakra_ui_react_.useDisclosure)({
    defaultIsOpen: true
  });
  const portalRef = (0,external_react_.useRef)(null);
  const {
    control,
    register,
    handleSubmit,
    watch,
    errors,
    setError,
    clearErrors,
    reset
  } = (0,external_react_hook_form_.useForm)({
    mode: "onChange"
  });
  const password = (0,external_react_.useRef)({});
  password.current = watch("password", "");

  const onChange = () => {
    clearErrors("formErrorMessage");
  };

  const onSubmit = async ({
    password,
    email
  }) => {
    if (isForgotten) return;
    setIsLoading(true);

    try {
      if (isSignup) {
        const {
          error
        } = await api/* default.post */.Z.post("auth/signup", {
          email,
          password
        });
        await (0,client_.signIn)("credentials", {
          email,
          password
        });
        setIsLoading(false);
        onClose();
        props.onClose && props.onClose();
      } else if (isEmail) {
        await (0,client_.signIn)("email", {
          email
        });
      } else {
        const res = await (0,client_.signIn)("credentials", {
          email,
          password,
          redirect: false
        });

        if (res) {
          if (res.error) throw new Error(res.error);else {
            onClose();
            props.onClose && props.onClose();
            props.onSubmit && props.onSubmit(res === null || res === void 0 ? void 0 : res.url);
          }
        } else throw new Error("Nous n'avons pas pu vous identifier.");
      }
    } catch (error) {
      (0,utils_form/* handleError */.S)(error, (message, field) => {
        if (field) {
          setError(field, {
            type: "manual",
            message
          });
        } else {
          setError("formErrorMessage", {
            type: "manual",
            message
          });
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (0,react_.jsx)(external_chakra_ui_react_.Modal, {
    isOpen: isOpen,
    onClose: () => {
      setIsLoading(false);
      props.onClose && props.onClose();
      onClose();
    },
    closeOnOverlayClick: false
  }, (0,react_.jsx)(external_chakra_ui_react_.ModalOverlay, null, (0,react_.jsx)(external_chakra_ui_react_.ModalContent, null, (0,react_.jsx)(external_chakra_ui_react_.ModalHeader, null, isForgotten ? "Mot de passe oublié" : isSignup ? "Inscription" : "Connexion"), (0,react_.jsx)(external_chakra_ui_react_.ModalCloseButton, null), (0,react_.jsx)("form", {
    onChange: onChange,
    onSubmit: handleSubmit(onSubmit)
  }, (0,react_.jsx)(external_chakra_ui_react_.ModalBody, {
    pt: 0
  }, (0,react_.jsx)(error_message_.ErrorMessage, {
    errors: errors,
    name: "formErrorMessage",
    render: ({
      message
    }) => (0,react_.jsx)(external_chakra_ui_react_.Alert, {
      status: "error",
      mb: 3
    }, (0,react_.jsx)(external_chakra_ui_react_.AlertIcon, null), (0,react_.jsx)(common/* ErrorMessageText */.h1, null, message))
  }), !isForgotten && (0,react_.jsx)((external_react_default()).Fragment, null, (0,react_.jsx)(external_chakra_ui_react_.FormControl, {
    id: "email",
    isRequired: true,
    isInvalid: !!errors["email"],
    mb: 3
  }, (0,react_.jsx)(external_chakra_ui_react_.FormLabel, null, "Adresse e-mail"), (0,react_.jsx)(external_chakra_ui_react_.Input, {
    name: "email",
    ref: register({
      required: "Veuillez saisir une adresse e-mail",
      pattern: {
        value: email/* emailR */.GN,
        message: "Adresse e-mail invalide"
      }
    })
  }), (0,react_.jsx)(external_chakra_ui_react_.FormErrorMessage, null, (0,react_.jsx)(error_message_.ErrorMessage, {
    errors: errors,
    name: "email"
  }))), !isEmail && (0,react_.jsx)(external_chakra_ui_react_.FormControl, {
    id: "password",
    mb: 3,
    isRequired: true,
    isInvalid: !!errors["password"]
  }, (0,react_.jsx)(external_chakra_ui_react_.FormLabel, null, "Mot de passe"), (0,react_.jsx)(external_chakra_ui_react_.InputGroup, null, (0,react_.jsx)(external_chakra_ui_react_.Input, {
    name: "password",
    ref: register({
      required: "Veuillez saisir un mot de passe"
    }),
    type: passwordFieldType
  }), (0,react_.jsx)(external_chakra_ui_react_.InputRightElement, {
    cursor: "pointer",
    children: passwordFieldType === "password" ? (0,react_.jsx)(icons_.ViewOffIcon, null) : (0,react_.jsx)(icons_.ViewIcon, null),
    onClick: () => {
      if (passwordFieldType === "password") setPasswordFieldType("text");else setPasswordFieldType("password");
    }
  })), (0,react_.jsx)(external_chakra_ui_react_.FormErrorMessage, null, (0,react_.jsx)(error_message_.ErrorMessage, {
    errors: errors,
    name: "password"
  })))), !isSignup && (0,react_.jsx)((external_react_default()).Fragment, null, !isForgotten && (0,react_.jsx)(external_chakra_ui_react_.Flex, {
    justifyContent: "space-between"
  }, isEmail ? (0,react_.jsx)(external_chakra_ui_react_.Link, {
    fontSize: 12,
    onClick: () => {
      clearErrors("formErrorMessage");
      setIsEmail(false);
    }
  }, "Connexion par mot de passe") : (0,react_.jsx)(external_chakra_ui_react_.Link, {
    fontSize: 12,
    onClick: () => {
      clearErrors("formErrorMessage");
      setIsEmail(true);
    }
  }, "Connexion par e-mail"), !isEmail && (0,react_.jsx)(external_chakra_ui_react_.Link, {
    fontSize: 12,
    onClick: () => {
      clearErrors("formErrorMessage");
      setIsForgotten(true);
    }
  }, "Mot de passe oubli\xE9 ?")), (0,react_.jsx)((external_react_default()).Fragment, null, (0,react_.jsx)(external_chakra_ui_react_.Portal, {
    containerRef: portalRef
  }, (0,react_.jsx)(ForgottenForm, {
    display: isForgotten ? "block" : "none",
    onCancel: () => setIsForgotten(false),
    onSuccess: () => setIsForgotten(false)
  })), (0,react_.jsx)(external_chakra_ui_react_.Box, {
    ref: portalRef
  }))), isSignup && (0,react_.jsx)(external_chakra_ui_react_.FormControl, {
    id: "passwordConfirm",
    isRequired: true,
    isInvalid: !!errors["passwordConfirm"]
  }, (0,react_.jsx)(external_chakra_ui_react_.FormLabel, null, "Confirmation du mot de passe"), (0,react_.jsx)(external_chakra_ui_react_.InputGroup, null, (0,react_.jsx)(external_chakra_ui_react_.Input, {
    name: "passwordConfirm",
    ref: register({
      validate: value => value === password.current || "Les mots de passe ne correspondent pas"
    }),
    type: passwordConfirmFieldType
  }), (0,react_.jsx)(external_chakra_ui_react_.InputRightElement, {
    cursor: "pointer",
    children: passwordConfirmFieldType === "password" ? (0,react_.jsx)(icons_.ViewOffIcon, null) : (0,react_.jsx)(icons_.ViewIcon, null),
    onClick: () => {
      if (passwordConfirmFieldType === "password") setPasswordConfirmFieldType("text");else setPasswordConfirmFieldType("password");
    }
  })), (0,react_.jsx)(external_chakra_ui_react_.FormErrorMessage, null, (0,react_.jsx)(error_message_.ErrorMessage, {
    errors: errors,
    name: "passwordConfirm"
  })))), !isForgotten && (0,react_.jsx)(external_chakra_ui_react_.ModalFooter, {
    justifyContent: "space-between"
  }, isSignup ? (0,react_.jsx)(external_chakra_ui_react_.Button, {
    colorScheme: "transparent",
    color: "black",
    size: "xs",
    leftIcon: (0,react_.jsx)(icons_.ChevronLeftIcon, null),
    onClick: () => {
      //reset();
      clearErrors("formErrorMessage");
      setIsSignup(false);
    }
  }, "Se connecter") : (0,react_.jsx)(external_chakra_ui_react_.Button, {
    colorScheme: "transparent",
    color: isDark ? "white" : "black",
    size: "xs",
    rightIcon: (0,react_.jsx)(icons_.ChevronRightIcon, null),
    onClick: () => {
      //reset();
      clearErrors("formErrorMessage");
      setIsSignup(true);
    }
  }, "S'inscrire"), (0,react_.jsx)(external_chakra_ui_react_.Button, {
    ml: 3,
    colorScheme: "green",
    type: "submit",
    isLoading: isLoading,
    isDisabled: Object.keys(errors).length > 0,
    "data-cy": "loginFormSubmit"
  }, isSignup ? "Inscription" : "Connexion"))))));
};
// EXTERNAL MODULE: ./src/features/subscriptions/subscriptionSlice.ts
var subscriptionSlice = __webpack_require__(1430);
// EXTERNAL MODULE: ./src/features/users/usersApi.ts
var usersApi = __webpack_require__(4616);
// EXTERNAL MODULE: ./src/features/users/userSlice.ts
var userSlice = __webpack_require__(3185);
// EXTERNAL MODULE: ./src/hooks/useAuth.ts
var useAuth = __webpack_require__(8238);
// EXTERNAL MODULE: ./src/store.ts
var store = __webpack_require__(4281);
// EXTERNAL MODULE: ./src/utils/isServer.ts
var isServer = __webpack_require__(7870);
// EXTERNAL MODULE: ./src/utils/string.ts
var string = __webpack_require__(7535);
// EXTERNAL MODULE: ./src/features/session/sessionSlice.ts
var sessionSlice = __webpack_require__(6089);
;// CONCATENATED MODULE: ./src/features/layout/Nav.tsx



function Nav_extends() { Nav_extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return Nav_extends.apply(this, arguments); }

function Nav_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = Nav_objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function Nav_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }























const linkList = /*#__PURE__*/(0,react_.css)("&>button{margin:0 0 0 12px;}@media (max-width: ", theme/* breakpoints.sm */.A.sm, "){margin-left:0;button{font-size:0.8rem;}&>button{display:block;margin:0 0 0 12px;}}" + ( true ? "" : 0),  true ? "" : 0);

const buttonList = /*#__PURE__*/(0,react_.css)("margin-left:20px;@media (max-width: ", theme/* breakpoints.sm */.A.sm, "){margin-left:0;}" + ( true ? "" : 0),  true ? "" : 0);

const Nav = (_ref) => {
  var _userQuery$data2;

  let {
    isLogin = 0
  } = _ref,
      props = Nav_objectWithoutProperties(_ref, ["isLogin"]);

  const router = (0,router_.useRouter)();
  const {
    data,
    loading: isSessionLoading
  } = (0,useAuth/* useSession */.k)();
  const session = data || props.session;
  const userName = (session === null || session === void 0 ? void 0 : session.user.userName) || "";
  const toast = (0,external_chakra_ui_react_.useToast)({
    position: "top"
  });
  const {
    colorMode
  } = (0,external_chakra_ui_react_.useColorMode)();
  const isDark = colorMode === "dark";
  const dispatch = (0,store/* useAppDispatch */.TL)(); //#region login modal

  const {
    0: isLoginModalOpen,
    1: setIsLoginModalOpen
  } = (0,external_react_.useState)(router.asPath === "/?login" || false);
  (0,external_react_.useEffect)(() => {
    if (isLogin !== 0) {
      setIsLoginModalOpen(true);
    }
  }, [isLogin]); //#endregion
  //#region push subscriptions

  const [editUser, editUserMutation] = (0,usersApi/* useEditUserMutation */.Gl)();
  const userEmail = (0,external_react_redux_.useSelector)(userSlice/* selectUserEmail */.I_) || (session === null || session === void 0 ? void 0 : session.user.email) || "";
  const userQuery = (0,usersApi/* useGetUserQuery */.GR)(userEmail);
  const {
    0: registration,
    1: setRegistration
  } = (0,external_react_.useState)(null);
  const {
    0: isSubscribed,
    1: setIsSubscribed
  } = (0,external_react_.useState)(false);
  const {
    0: subscription,
    1: setSubscription
  } = (0,external_react_.useState)(null);
  (0,external_react_.useEffect)(() => {
    if (!(0,isServer/* isServer */.s)() && "serviceWorker" in navigator && window.workbox !== undefined) {
      navigator.serviceWorker.ready.then(reg => {
        console.log("sw ready, setting reg");
        setRegistration(reg);
        reg.pushManager.getSubscription().then(sub => {
          console.log("reg.pushManager.getSubscription", sub);

          if (sub // !(
          //   sub.expirationTime &&
          //   Date.now() > sub.expirationTime - 5 * 60 * 1000
          // )
          ) {
              setSubscription(sub);
              setIsSubscribed(true);
            }
        });
      });
    }
  }, []); //#endregion

  const styles = /*#__PURE__*/(0,react_.css)("height:auto!important;", isDark ? {
    "height": "6rem",
    "backgroundImage": "linear-gradient(to bottom, var(--tw-gradient-stops))",
    "--tw-gradient-from": "#1f2937",
    "--tw-gradient-stops": "var(--tw-gradient-from), #059669, var(--tw-gradient-to, rgba(5, 150, 105, 0))",
    "--tw-gradient-to": "#1f2937"
  } : {
    "height": "6rem",
    "backgroundImage": "linear-gradient(to bottom, var(--tw-gradient-stops))",
    "--tw-gradient-from": "#fff",
    "--tw-gradient-stops": "var(--tw-gradient-from), #fbbf24, var(--tw-gradient-to, rgba(251, 191, 36, 0))",
    "--tw-gradient-to": "#fff"
  }, ";" + ( true ? "" : 0),  true ? "" : 0);

  return (0,react_.jsx)(external_chakra_ui_react_.Flex, Nav_extends({
    as: "nav",
    align: "center",
    justifyContent: "space-between",
    wrap: "nowrap"
  }, props, {
    css: styles
  }), (0,react_.jsx)(external_chakra_ui_react_.Box, {
    css: linkList
  }, (0,react_.jsx)(external_chakra_ui_react_.Button, {
    bg: "transparent",
    _hover: {
      bg: isDark ? "blackAlpha.400" : "whiteAlpha.600"
    },
    leftIcon: (0,react_.jsx)(icons_.CalendarIcon, null),
    onClick: () => router.push("/", "/", {
      shallow: true
    }),
    "data-cy": "homeLink"
  }, "Accueil"), (0,react_.jsx)(external_chakra_ui_react_.Button, {
    bg: "transparent",
    _hover: {
      bg: isDark ? "blackAlpha.400" : "whiteAlpha.600"
    },
    leftIcon: (0,react_.jsx)(IoIosPeople_js_.IoIosPeople, null),
    onClick: () => router.push("/orgs", "/orgs", {
      shallow: true
    })
  }, "Organisations"), (0,react_.jsx)(external_chakra_ui_react_.Button, {
    bg: "transparent",
    _hover: {
      bg: isDark ? "blackAlpha.400" : "whiteAlpha.600"
    },
    leftIcon: (0,react_.jsx)(icons_.ChatIcon, null),
    onClick: () => router.push("/forum", "/forum", {
      shallow: true
    })
  }, "Forum")), (0,react_.jsx)(external_chakra_ui_react_.Flex, {
    justifyContent: "flex-end",
    css: buttonList
  }, session ? (0,react_.jsx)((external_react_default()).Fragment, null, (0,react_.jsx)(EventPopover, {
    boxSize: [6, 8, 8],
    session: session
  }), (0,react_.jsx)(OrgPopover, {
    boxSize: [8, 10, 12],
    session: session
  }), (0,react_.jsx)(external_chakra_ui_react_.Menu, null, (0,react_.jsx)(external_chakra_ui_react_.MenuButton, {
    mr: [1, 3]
  }, (0,react_.jsx)(external_chakra_ui_react_.Avatar, {
    boxSize: 10,
    name: userName,
    css: /*#__PURE__*/(0,react_.css)( true ? "" : 0,  true ? "" : 0),
    src: session.user.userImage ? session.user.userImage.base64 : undefined
  })), (0,react_.jsx)(external_chakra_ui_react_.MenuList, {
    mr: [1, 3]
  }, (0,react_.jsx)(external_chakra_ui_react_.MenuItem, {
    "aria-hidden": true,
    command: `${userEmail}`,
    cursor: "default",
    _hover: {
      bg: isDark ? "gray.700" : "white"
    }
  }),  false && 0, (0,react_.jsx)(common/* Link */.rU, {
    href: `/${userName}`,
    "aria-hidden": true
  }, (0,react_.jsx)(external_chakra_ui_react_.MenuItem, null, "Ma page")),
  /*isMobile*/
   true && (0,react_.jsx)(external_chakra_ui_react_.MenuItem, {
    isDisabled: registration === null || userQuery.isLoading || userQuery.isFetching,
    onClick: async () => {
      try {
        var _userQuery$data;

        if (isSubscribed && (_userQuery$data = userQuery.data) !== null && _userQuery$data !== void 0 && _userQuery$data.userSubscription) {
          if (!subscription) throw new Error("Une erreur est survenue.");
          await subscription.unsubscribe();
          await editUser({
            payload: {
              userSubscription: null
            },
            userName
          });
          setSubscription(null);
          setIsSubscribed(false);
          userQuery.refetch();
          toast({
            status: "success",
            title: "Vous ne recevrez plus de notifications mobile"
          });
        } else {
          const sub = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: (0,string/* base64ToUint8Array */.eh)("BLEyStoGlsI2TjYfNzQpBn99baJxj9RujWg-0Pn2R5MS6s-HC1LNp0YyEC1sR7e6wKTWvG0eZIbW_jYPPYZLGOQ")
          });
          setSubscription(sub);
          setIsSubscribed(true);
          await editUser({
            payload: {
              userSubscription: sub
            },
            userName
          }).unwrap();
          userQuery.refetch();
          toast({
            status: "success",
            title: "Vous recevrez des notifications mobile en plus des e-mails"
          });
        }
      } catch (error) {
        toast({
          status: "error",
          title: error.message
        });
      }
    }
  }, isSubscribed && (_userQuery$data2 = userQuery.data) !== null && _userQuery$data2 !== void 0 && _userQuery$data2.userSubscription ? "Désactiver" : "Activer", " ", "les notifications mobile"), (0,react_.jsx)(external_chakra_ui_react_.MenuItem, {
    onClick: async () => {
      const {
        url
      } = await (0,client_.signOut)({
        redirect: false,
        callbackUrl: "/"
      });
      dispatch((0,userSlice/* setUserEmail */.WG)(null));
      dispatch((0,sessionSlice/* setSession */.KY)(null));
      if (true) router.push(url);else {}
    }
  }, "D\xE9connexion")))) : (0,react_.jsx)((external_react_default()).Fragment, null, (0,react_.jsx)(EmailLoginPopover, {
    boxSize: [8, 10, 10]
  }), external_react_device_detect_.isMobile ? (0,react_.jsx)(external_chakra_ui_react_.IconButton, {
    "aria-label": "Connexion",
    icon: (0,react_.jsx)(external_chakra_ui_react_.Icon, {
      as: FaPowerOff_js_.FaPowerOff,
      boxSize: [8, 10, 10]
    }),
    bg: "transparent",
    _hover: {
      bg: "transparent"
    },
    mx: 3,
    onClick: () => setIsLoginModalOpen(true)
  }) : (0,react_.jsx)(external_chakra_ui_react_.Box, {
    mr: 5,
    ml: 5
  }, (0,react_.jsx)(external_chakra_ui_react_.Button, {
    variant: "outline",
    colorScheme: "purple" // isLoading={isSessionLoading}
    ,
    onClick: () => setIsLoginModalOpen(true),
    "data-cy": "login"
  }, "Connexion")))), isLoginModalOpen && (0,react_.jsx)(LoginModal, {
    onClose: () => setIsLoginModalOpen(false),
    onSubmit: async url => {
      dispatch((0,userSlice/* setUserEmail */.WG)(null));
      const login = `${"https://aucourant.de"}/?login`;

      if (url === "/?login" || url === login) {
        await router.push("/");
      } else {
        await router.push(url || "/");
      }
    }
  }));
};
// EXTERNAL MODULE: ./src/features/modals/EventModal.tsx
var EventModal = __webpack_require__(5978);
// EXTERNAL MODULE: ./src/features/events/eventsApi.ts
var eventsApi = __webpack_require__(9416);
// EXTERNAL MODULE: ./src/features/events/eventSlice.ts
var eventSlice = __webpack_require__(9829);
// EXTERNAL MODULE: ./src/features/subscriptions/subscriptionsApi.ts
var subscriptionsApi = __webpack_require__(1096);
// EXTERNAL MODULE: ./src/utils/array.ts
var array = __webpack_require__(1609);
;// CONCATENATED MODULE: ./src/features/layout/EventPopover.tsx
function EventPopover_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = EventPopover_objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function EventPopover_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }















let cachedRefetchEvents = false;
let cachedRefetchSubscription = false;
let cachedEmail;
const EventPopover = (_ref) => {
  var _subQuery$data;

  let {
    boxSize,
    session
  } = _ref,
      props = EventPopover_objectWithoutProperties(_ref, ["boxSize", "session"]);

  const router = (0,router_.useRouter)();
  const userEmail = (0,external_react_redux_.useSelector)(userSlice/* selectUserEmail */.I_) || session.user.email; //#region events

  const eventsQuery = (0,eventsApi/* useGetEventsQuery */.kg)({
    userId: session.user.userId
  });
  const refetchEvents = (0,external_react_redux_.useSelector)(eventSlice/* selectEventsRefetch */.Ax);
  (0,external_react_.useEffect)(() => {
    if (refetchEvents !== cachedRefetchEvents) {
      cachedRefetchEvents = refetchEvents;
      console.log("refetching events");
      eventsQuery.refetch();
    }
  }, [refetchEvents]); //#endregion
  //#region sub

  const subQuery = (0,subscriptionsApi/* useGetSubscriptionQuery */.xu)(userEmail);
  const refetchSubscription = (0,external_react_redux_.useSelector)(subscriptionSlice/* selectSubscriptionRefetch */.di);
  (0,external_react_.useEffect)(() => {
    if (refetchSubscription !== cachedRefetchSubscription) {
      cachedRefetchSubscription = refetchSubscription;
      console.log("refetching subscription");
      subQuery.refetch();
    }
  }, [refetchSubscription]);
  (0,external_react_.useEffect)(() => {
    if (userEmail !== cachedEmail) {
      cachedEmail = userEmail;
      console.log("refetching subscription with new email", userEmail);
      subQuery.refetch();
    }
  }, [userEmail]);
  const subscribedEvents = ((_subQuery$data = subQuery.data) === null || _subQuery$data === void 0 ? void 0 : _subQuery$data.events) || [];
  const hasSubscribedEvents = (0,array/* hasItems */.t)(subscribedEvents); //#endregion
  //#region local state

  const {
    0: isOpen,
    1: setIsOpen
  } = (0,external_react_.useState)(false);
  const {
    0: eventModalState,
    1: setEventModalState
  } = (0,external_react_.useState)({
    isOpen: false,
    event: undefined
  });
  const iconHoverColor = (0,external_chakra_ui_react_.useColorModeValue)("white", "lightgreen"); //#endregion

  return (0,react_.jsx)(external_chakra_ui_react_.Box, props, (0,react_.jsx)(external_chakra_ui_react_.Popover, {
    isLazy: true,
    isOpen: isOpen,
    offset: [-140, 0],
    onClose: () => setIsOpen(false)
  }, (0,react_.jsx)(external_chakra_ui_react_.PopoverTrigger, null, (0,react_.jsx)(external_chakra_ui_react_.IconButton, {
    onClick: () => {
      if (!isOpen) {
        eventsQuery.refetch();
        subQuery.refetch();
      }

      setIsOpen(!isOpen);
    },
    "aria-label": "Social",
    bg: "transparent",
    _hover: {
      bg: "transparent"
    },
    icon: (0,react_.jsx)(external_chakra_ui_react_.Icon, {
      as: icons_.CalendarIcon,
      boxSize: boxSize,
      _hover: {
        color: iconHoverColor
      }
    }),
    "data-cy": "eventPopover"
  })), (0,react_.jsx)(external_chakra_ui_react_.PopoverContent, null, (0,react_.jsx)(external_chakra_ui_react_.PopoverHeader, null, (0,react_.jsx)(external_chakra_ui_react_.Heading, {
    size: "md"
  }, "Les \xE9v\xE9nements...")), (0,react_.jsx)(external_chakra_ui_react_.PopoverCloseButton, null), (0,react_.jsx)(external_chakra_ui_react_.PopoverBody, null, (0,react_.jsx)(external_chakra_ui_react_.Box, {
    mb: 3
  }, (0,react_.jsx)(external_chakra_ui_react_.Heading, {
    size: "sm",
    mb: 1
  }, "...que j'ai ajout\xE9 :"), eventsQuery.isLoading || eventsQuery.isFetching ? (0,react_.jsx)(external_chakra_ui_react_.Spinner, null) : Array.isArray(eventsQuery.data) && eventsQuery.data.length > 0 ? (0,react_.jsx)(external_chakra_ui_react_.VStack, {
    alignItems: "flex-start",
    overflowX: "auto",
    ml: 3
  }, eventsQuery.data.map((event, index) => (0,react_.jsx)(common/* Link */.rU, {
    key: index,
    href: `/${event.eventUrl}`,
    shallow: true,
    onClick: () => {
      setIsOpen(false);
    }
  }, (0,react_.jsx)(external_chakra_ui_react_.Button, {
    leftIcon: (0,react_.jsx)(icons_.CalendarIcon, {
      color: "green.500"
    }),
    p: 2
  }, event.eventName)))) : (0,react_.jsx)(external_chakra_ui_react_.Text, {
    fontSize: "smaller",
    ml: 3,
    my: 2
  }, "Vous n'avez ajout\xE9 aucun \xE9v\xE9nement.")), (0,react_.jsx)(external_chakra_ui_react_.Heading, {
    size: "sm",
    mt: (0,array/* hasItems */.t)(eventsQuery.data) ? 2 : 0,
    mb: 1
  }, "...o\xF9 je me suis abonn\xE9 :"), eventsQuery.isLoading || eventsQuery.isFetching ? (0,react_.jsx)(external_chakra_ui_react_.Spinner, null) : hasSubscribedEvents ? (0,react_.jsx)(external_chakra_ui_react_.VStack, {
    alignItems: "flex-start",
    overflowX: "auto",
    ml: 3
  }, subscribedEvents.map(({
    event
  }, index) => (0,react_.jsx)(common/* Link */.rU, {
    key: index,
    href: `/${event.eventUrl}`,
    shallow: true,
    onClick: () => {
      setIsOpen(false);
    }
  }, (0,react_.jsx)(external_chakra_ui_react_.Button, {
    leftIcon: (0,react_.jsx)(external_chakra_ui_react_.Icon, {
      as: icons_.CalendarIcon,
      color: "green.500"
    }),
    p: 2
  }, event.eventName)))) : (0,react_.jsx)(external_chakra_ui_react_.Text, {
    fontSize: "smaller",
    ml: 3
  }, "Vous n'\xEAtes abonn\xE9 \xE0 aucun \xE9v\xE9nement")), (0,react_.jsx)(external_chakra_ui_react_.PopoverFooter, null, (0,react_.jsx)(external_chakra_ui_react_.Button, {
    colorScheme: "teal",
    leftIcon: (0,react_.jsx)(icons_.AddIcon, null),
    mt: 1,
    onClick: () => {
      setEventModalState({
        isOpen: true
      });
    },
    "data-cy": "addEvent"
  }, "Ajouter un \xE9v\xE9nement")))), session && eventModalState.isOpen && (0,react_.jsx)(EventModal/* EventModal */.Q, {
    session: session,
    onCancel: () => setEventModalState({
      isOpen: false
    }),
    onClose: () => setEventModalState({
      isOpen: false
    }),
    onSubmit: async eventUrl => {
      await router.push(`/${eventUrl}`);
    }
  }));
};
// EXTERNAL MODULE: ./src/features/forms/OrgForm.tsx
var OrgForm = __webpack_require__(5088);
// EXTERNAL MODULE: ./src/models/Org.ts
var Org = __webpack_require__(9759);
;// CONCATENATED MODULE: ./src/features/modals/OrgModal.tsx
function OrgModal_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = OrgModal_objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function OrgModal_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }






const OrgModal = (_ref) => {
  let {
    session,
    onCancel,
    onSubmit
  } = _ref,
      props = OrgModal_objectWithoutProperties(_ref, ["session", "onCancel", "onSubmit"]);

  const {
    isOpen: isOrgModalOpen,
    onOpen,
    onClose: onOrgModalClose
  } = (0,external_chakra_ui_react_.useDisclosure)({
    defaultIsOpen: true
  });
  const {
    0: orgType,
    1: setOrgType
  } = (0,external_react_.useState)();

  const onClose = () => {
    props.onClose();
    onOrgModalClose();
  };

  return (0,react_.jsx)(external_chakra_ui_react_.Modal, {
    isOpen: isOrgModalOpen,
    onClose: onClose,
    closeOnOverlayClick: false
  }, (0,react_.jsx)(external_chakra_ui_react_.ModalOverlay, null), (0,react_.jsx)(external_chakra_ui_react_.ModalContent, null, (0,react_.jsx)(external_chakra_ui_react_.ModalHeader, null, "Ajouter ", (0,Org/* orgTypeFull3 */.Dk)(orgType)), (0,react_.jsx)(external_chakra_ui_react_.ModalCloseButton, {
    "data-cy": "orgPopoverCloseButton"
  }), (0,react_.jsx)(external_chakra_ui_react_.ModalBody, null, (0,react_.jsx)(OrgForm/* OrgForm */.f, {
    setOrgType: setOrgType,
    session: session,
    onCancel: onClose,
    onClose: onClose,
    onSubmit: orgUrl => {
      onClose();
      onSubmit(orgUrl);
    }
  }))));
};
// EXTERNAL MODULE: ./src/features/orgs/orgsApi.ts
var orgsApi = __webpack_require__(2207);
// EXTERNAL MODULE: ./src/features/orgs/orgSlice.ts
var orgSlice = __webpack_require__(1442);
;// CONCATENATED MODULE: ./src/features/layout/OrgPopover.tsx


function OrgPopover_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = OrgPopover_objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function OrgPopover_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }















let cachedRefetchOrgs = false;
let OrgPopover_cachedRefetchSubscription = false;
let OrgPopover_cachedEmail;
const OrgPopover = (_ref) => {
  let {
    boxSize,
    session
  } = _ref,
      props = OrgPopover_objectWithoutProperties(_ref, ["boxSize", "session"]);

  const router = (0,router_.useRouter)();
  const userEmail = (0,external_react_redux_.useSelector)(userSlice/* selectUserEmail */.I_) || (session === null || session === void 0 ? void 0 : session.user.email); //#region myOrgs

  const orgsQuery = (0,orgsApi/* useGetOrgsQuery */.Gt)({});
  const refetchOrgs = (0,external_react_redux_.useSelector)(orgSlice/* selectOrgsRefetch */.Z8);
  (0,external_react_.useEffect)(() => {
    if (refetchOrgs !== cachedRefetchOrgs) {
      cachedRefetchOrgs = refetchOrgs;
      console.log("refetching orgs");
      orgsQuery.refetch();
    }
  }, [refetchOrgs]);
  const myOrgs = Array.isArray(orgsQuery.data) && orgsQuery.data.length > 0 && orgsQuery.data.filter(org => (session === null || session === void 0 ? void 0 : session.user.userId) === (org === null || org === void 0 ? void 0 : org.createdBy)) || [];
  const hasOrgs = Array.isArray(myOrgs) && myOrgs.length > 0; //#endregion
  //#region sub

  const subQuery = (0,subscriptionsApi/* useGetSubscriptionQuery */.xu)(userEmail);
  const refetchSubscription = (0,external_react_redux_.useSelector)(subscriptionSlice/* selectSubscriptionRefetch */.di);
  (0,external_react_.useEffect)(() => {
    if (refetchSubscription !== OrgPopover_cachedRefetchSubscription) {
      console.log("refetching subscription");
      subQuery.refetch();
    }
  }, [refetchSubscription]);
  (0,external_react_.useEffect)(() => {
    if (userEmail !== OrgPopover_cachedEmail) {
      OrgPopover_cachedEmail = userEmail;
      console.log("refetching subscription with new email", userEmail);
      subQuery.refetch();
    }
  }, [userEmail]);
  const subscribedOrgs = Array.isArray(orgsQuery.data) && orgsQuery.data.length > 0 && orgsQuery.data.filter(org => (0,subscriptionSlice/* isSubscribedBy */.eM)(org, subQuery)) || [];
  const hasSubscribedOrgs = (0,array/* hasItems */.t)(subscribedOrgs); //#endregion
  //#region local state

  const {
    0: isOpen,
    1: setIsOpen
  } = (0,external_react_.useState)(false);
  const {
    0: orgModalState,
    1: setOrgModalState
  } = (0,external_react_.useState)({
    isOpen: false,
    org: undefined
  });
  const iconHoverColor = (0,external_chakra_ui_react_.useColorModeValue)("white", "lightgreen"); //#endregion

  return (0,react_.jsx)(external_chakra_ui_react_.Box, props, (0,react_.jsx)(external_chakra_ui_react_.Popover, {
    isLazy: true,
    isOpen: isOpen,
    offset: [-140, 0],
    onClose: () => setIsOpen(false)
  }, (0,react_.jsx)(external_chakra_ui_react_.PopoverTrigger, null, (0,react_.jsx)(external_chakra_ui_react_.IconButton, {
    onClick: () => {
      if (!isOpen) {
        orgsQuery.refetch();
        subQuery.refetch();
      }

      setIsOpen(!isOpen);
    },
    "aria-label": "Social",
    mx: [0, 2, 2],
    bg: "transparent",
    _hover: {
      bg: "transparent"
    },
    icon: (0,react_.jsx)(external_chakra_ui_react_.Icon, {
      as: IoIosPeople_js_.IoIosPeople,
      boxSize: boxSize,
      _hover: {
        color: iconHoverColor
      }
    }),
    "data-cy": "orgPopover"
  })), (0,react_.jsx)(external_chakra_ui_react_.PopoverContent, null, (0,react_.jsx)(external_chakra_ui_react_.PopoverHeader, null, (0,react_.jsx)(external_chakra_ui_react_.Heading, {
    size: "md"
  }, "Les organisations...")), (0,react_.jsx)(external_chakra_ui_react_.PopoverCloseButton, null), (0,react_.jsx)(external_chakra_ui_react_.PopoverBody, null, (0,react_.jsx)(external_chakra_ui_react_.Box, {
    mb: 3
  }, (0,react_.jsx)(external_chakra_ui_react_.Heading, {
    size: "sm",
    mb: 1
  }, "...o\xF9 je suis administrateur :"), orgsQuery.isLoading || orgsQuery.isFetching ? (0,react_.jsx)(external_chakra_ui_react_.Spinner, null) : hasOrgs ? (0,react_.jsx)(external_chakra_ui_react_.VStack, {
    alignItems: "flex-start",
    overflowX: "auto",
    ml: 3
  }, myOrgs.map((org, index) => (0,react_.jsx)(common/* Link */.rU, {
    key: index,
    href: `/${org.orgUrl}`,
    shallow: true,
    onClick: () => {
      setIsOpen(false);
    }
  }, (0,react_.jsx)(external_chakra_ui_react_.Button, {
    leftIcon: (0,react_.jsx)(external_chakra_ui_react_.Icon, {
      as: IoIosPeople_js_.IoIosPeople,
      color: "green.500"
    }),
    p: 2
  }, org.orgName)))) : (0,react_.jsx)(external_chakra_ui_react_.Text, {
    fontSize: "smaller",
    ml: 3,
    my: 2
  }, "Vous n'avez ajout\xE9 aucune organisation.")), (0,react_.jsx)(external_chakra_ui_react_.Heading, {
    size: "sm",
    mt: hasOrgs ? 2 : 0,
    mb: 1
  }, "...o\xF9 je suis adh\xE9rent :"), orgsQuery.isLoading || orgsQuery.isFetching ? (0,react_.jsx)(external_chakra_ui_react_.Spinner, null) : hasSubscribedOrgs ? (0,react_.jsx)(external_chakra_ui_react_.VStack, {
    alignItems: "flex-start",
    overflowX: "auto",
    ml: 3
  }, subscribedOrgs.map((org, index) => (0,react_.jsx)(common/* Link */.rU, {
    key: index,
    href: `/${org.orgUrl}`,
    shallow: true,
    onClick: () => {
      setIsOpen(false);
    }
  }, (0,react_.jsx)(external_chakra_ui_react_.Button, {
    leftIcon: (0,react_.jsx)(external_chakra_ui_react_.Icon, {
      as: IoIosPeople_js_.IoIosPeople,
      color: "green.500"
    }),
    p: 2
  }, org.orgName)))) : (0,react_.jsx)(external_chakra_ui_react_.Text, {
    fontSize: "smaller",
    ml: 3
  }, "Personne ne vous a inscrit en tant qu'adh\xE9rent, bient\xF4t peut-\xEAtre ?")), (0,react_.jsx)(external_chakra_ui_react_.PopoverFooter, null, (0,react_.jsx)(external_chakra_ui_react_.Button, {
    colorScheme: "teal",
    leftIcon: (0,react_.jsx)(icons_.AddIcon, null),
    mt: 1,
    onClick: () => {
      setOrgModalState({
        isOpen: true
      });
    },
    "data-cy": "addOrg"
  }, "Ajouter une organisation")))), session && orgModalState.isOpen && (0,react_.jsx)(OrgModal, {
    session: session,
    onCancel: () => setOrgModalState({
      isOpen: false
    }),
    onClose: () => setOrgModalState({
      isOpen: false
    }),
    onSubmit: async orgUrl => {
      await router.push(`/${orgUrl}`);
    }
  }));
};
;// CONCATENATED MODULE: ./src/features/layout/EmailLoginPopover.tsx
function EmailLoginPopover_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = EmailLoginPopover_objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function EmailLoginPopover_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }












const EmailLoginPopover = (_ref) => {
  let {
    boxSize
  } = _ref,
      props = EmailLoginPopover_objectWithoutProperties(_ref, ["boxSize"]);

  const router = (0,router_.useRouter)();
  const {
    data: session
  } = (0,useAuth/* useSession */.k)();
  const toast = (0,external_chakra_ui_react_.useToast)({
    position: "top"
  });
  const dispatch = (0,store/* useAppDispatch */.TL)(); //#region local state

  const {
    0: isOpen,
    1: setIsOpen
  } = (0,external_react_.useState)(false);
  const {
    0: isLoading,
    1: setIsLoading
  } = (0,external_react_.useState)(false);
  const iconHoverColor = (0,external_chakra_ui_react_.useColorModeValue)("white", "lightgreen"); //#endregion
  //#region form

  const {
    clearErrors,
    errors,
    setError,
    handleSubmit,
    register
  } = (0,external_react_hook_form_.useForm)({
    mode: "onChange"
  });

  const onChange = () => {
    clearErrors("formErrorMessage");
  };

  const onSubmit = async ({
    email
  }) => {
    setIsLoading(true);

    try {
      await (0,client_.signIn)("email", {
        email
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }; //#endregion


  return (0,react_.jsx)(external_chakra_ui_react_.Box, props, (0,react_.jsx)(external_chakra_ui_react_.Popover, {
    isLazy: true,
    isOpen: isOpen,
    offset: [-140, 0],
    onClose: () => {
      clearErrors("formErrorMessage");
      setIsOpen(false);
    }
  }, (0,react_.jsx)(external_chakra_ui_react_.PopoverTrigger, null, (0,react_.jsx)(external_chakra_ui_react_.IconButton, {
    onClick: () => {
      setIsOpen(!isOpen);
    },
    "aria-label": "Connexion par e-mail",
    bg: "transparent",
    _hover: {
      bg: "transparent"
    },
    icon: (0,react_.jsx)(external_chakra_ui_react_.Icon, {
      as: icons_.EmailIcon,
      _hover: {
        color: iconHoverColor
      },
      boxSize: boxSize
    })
  })), (0,react_.jsx)(external_chakra_ui_react_.PopoverContent, null, (0,react_.jsx)(external_chakra_ui_react_.PopoverHeader, null, (0,react_.jsx)(external_chakra_ui_react_.Heading, {
    size: "md"
  }, "Connexion par e-mail")), (0,react_.jsx)(external_chakra_ui_react_.PopoverBody, null, (0,react_.jsx)("form", {
    onChange: onChange,
    onSubmit: handleSubmit(onSubmit)
  }, (0,react_.jsx)(error_message_.ErrorMessage, {
    errors: errors,
    name: "formErrorMessage",
    render: ({
      message
    }) => (0,react_.jsx)(external_chakra_ui_react_.Alert, {
      status: "error",
      mb: 3
    }, (0,react_.jsx)(external_chakra_ui_react_.AlertIcon, null), (0,react_.jsx)(common/* ErrorMessageText */.h1, null, message))
  }), (0,react_.jsx)(common/* EmailControl */.sm, {
    name: "email",
    register: register,
    errors: errors,
    isMultiple: false
  }))), (0,react_.jsx)(external_chakra_ui_react_.PopoverFooter, {
    display: "flex",
    justifyContent: "space-between"
  }, (0,react_.jsx)(external_chakra_ui_react_.Button, {
    colorScheme: "gray",
    onClick: () => {
      onChange();
      setIsOpen(false);
    }
  }, "Annuler"), (0,react_.jsx)(external_chakra_ui_react_.Button, {
    colorScheme: "green",
    type: "submit",
    isLoading: isLoading,
    isDisabled: Object.keys(errors).length > 0,
    onClick: handleSubmit(onSubmit)
  }, "Connexion")))));
};
;// CONCATENATED MODULE: ./src/features/layout/index.tsx











/***/ }),

/***/ 5978:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Q": function() { return /* binding */ EventModal; }
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(9297);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3426);
/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var features_forms_EventForm__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(4168);
/* harmony import */ var _emotion_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7381);
/* harmony import */ var _emotion_react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_emotion_react__WEBPACK_IMPORTED_MODULE_3__);
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }





const EventModal = props => {
  const {
    isOpen,
    onOpen,
    onClose
  } = (0,_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.useDisclosure)({
    defaultIsOpen: true
  });
  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_3__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.Modal, {
    isOpen: isOpen,
    onClose: () => {
      props.onClose && props.onClose();
      onClose();
    },
    closeOnOverlayClick: false
  }, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_3__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.ModalOverlay, null, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_3__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.ModalContent, {
    maxWidth: "xl"
  }, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_3__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.ModalHeader, null, "Ajouter un \xE9v\xE9nement"), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_3__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.ModalCloseButton, null), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_3__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.ModalBody, null, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_3__.jsx)(features_forms_EventForm__WEBPACK_IMPORTED_MODULE_2__/* .EventForm */ .$, _extends({
    initialEventOrgs: props.initialEventOrgs
  }, props))))));
};

/***/ }),

/***/ 26:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "A": function() { return /* binding */ breakpoints; },
  "Z": function() { return /* binding */ theme_theme; }
});

// EXTERNAL MODULE: external "@chakra-ui/react"
var react_ = __webpack_require__(3426);
// EXTERNAL MODULE: external "@chakra-ui/theme-tools"
var theme_tools_ = __webpack_require__(8547);
;// CONCATENATED MODULE: ./src/theme/styles.ts
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



const ReactSelectStyles = props => ({
  ".react-select-container": {
    ".react-select__control": {
      backgroundColor: (0,theme_tools_.mode)("white", "gray.700")(props),
      "&:hover": {
        borderColor: (0,theme_tools_.mode)("#CBD5E0", "#5F6774")(props)
      },
      borderColor: (0,theme_tools_.mode)("gray.200", "#4F5765")(props),
      ".react-select__placeholder": {
        color: (0,theme_tools_.mode)("gray.400", "gray.400")(props)
      }
    },
    ".react-select__multi-value": {
      backgroundColor: (0,theme_tools_.mode)("gray.400", "whiteAlpha.400")(props),
      borderRadius: "md",
      ".react-select__multi-value__label": {
        color: (0,theme_tools_.mode)("black", "white")(props)
      },
      ".react-select__multi-value__remove": {
        ":hover": {
          cursor: "pointer",
          color: "red",
          borderRadius: "md",
          backgroundColor: (0,theme_tools_.mode)("black", "white")(props)
        }
      }
    },
    ".react-select__clear-indicator": {
      cursor: "pointer",
      color: (0,theme_tools_.mode)("black", "white")(props)
    },
    ".react-select__dropdown-indicator": {
      color: (0,theme_tools_.mode)("black", "white")(props)
    },
    ".react-select__menu": {
      backgroundColor: (0,theme_tools_.mode)("white", "gray.700")(props),
      ".react-select__menu-list": {
        padding: 0,
        borderWidth: "2px",
        borderRadius: "md",
        borderColor: "#2684FF",
        backgroundColor: (0,theme_tools_.mode)("white", "transparent")(props),
        color: (0,theme_tools_.mode)("black", "white")(props),
        ".react-select__option": {
          backgroundColor: (0,theme_tools_.mode)("white", "transparent")(props),
          "&:hover": {
            cursor: "pointer",
            backgroundColor: (0,theme_tools_.mode)("orange.100", "whiteAlpha.400")(props),
            color: (0,theme_tools_.mode)("black", "white")(props)
          }
        }
      }
    }
  }
});

/* harmony default export */ var styles = ({
  global: props => {
    const customGlobalStyles = _objectSpread({}, ReactSelectStyles(props));

    return customGlobalStyles;
  }
});
;// CONCATENATED MODULE: ./src/theme/theme.ts



const fonts = {
  mono: `'Menlo', monospace`
};
const breakpoints = (0,theme_tools_.createBreakpoints)({
  sm: "28em",
  md: "40em",
  lg: "52em",
  xl: "64em",
  "2xl": "80em"
});
const theme = (0,react_.extendTheme)({
  components: {
    FormLabel: {
      baseStyle: {
        fontWeight: "bold"
      }
    },
    Input: {
      baseStyle: {
        ".chakra-ui-dark &": {
          border: "1px solid white",
          _hover: {
            border: "1px solid white"
          }
        }
      }
    },
    Link: {
      sizes: {
        larger: {
          fontSize: "2xl",
          fontWeight: "bold"
        }
      },
      variants: {
        "no-underline": {
          _hover: {
            textDecoration: "none"
          }
        },
        underline: {
          textDecoration: "underline"
        }
      }
    },
    Spacer: {
      baseStyle: {
        border: "1px solid orange.300 !important",
        ".chakra-ui-dark &": {
          border: "1px solid white !important"
        }
      }
    }
  },
  styles: styles,
  colors: {
    black: "#16161D"
  },
  fonts,
  breakpoints
});
/* harmony default export */ var theme_theme = (theme);

/***/ }),

/***/ 1609:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "t": function() { return /* binding */ hasItems; }
/* harmony export */ });
const hasItems = array => Array.isArray(array) && array.length > 0;

/***/ }),

/***/ 4245:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "an": function() { return /* binding */ days; },
/* harmony export */   "Sy": function() { return /* binding */ timeAgo; }
/* harmony export */ });
/* unused harmony exports formatArray, formatDuration, fullDateString */
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3879);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(date_fns__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var date_fns_locale__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(678);


const days = ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"];
const formatArray = ["years", "months", "weeks", "days", "hours", "minutes"];
const formatDistanceLocale = {
  xSeconds: "{{count}}s",
  xMinutes: "{{count}}m",
  xHours: "{{count}}h",
  xDays: "{{count}}j",
  xMonths: "{{count}}m",
  xYears: "{{count}}y"
};
const formatDuration = (duration, {
  format
}) => {
  return (0,date_fns__WEBPACK_IMPORTED_MODULE_0__.formatDuration)(duration, {
    format,
    locale: {
      formatDistance: (token, count) => formatDistanceLocale[token].replace("{{count}}", count)
    }
  });
};
const fullDateString = date => {
  return (0,date_fns__WEBPACK_IMPORTED_MODULE_0__.format)(date, "eeee dd MMMM yyyy à H'h'mm", {
    locale: date_fns_locale__WEBPACK_IMPORTED_MODULE_1__/* .default */ .Z
  });
};
const timeAgo = (date, isShort) => {
  const end = typeof date === "string" ? (0,date_fns__WEBPACK_IMPORTED_MODULE_0__.parseISO)(date) : date !== undefined ? date : new Date();
  const fullDate = fullDateString(end);
  const duration = (0,date_fns__WEBPACK_IMPORTED_MODULE_0__.intervalToDuration)({
    start: new Date(),
    end
  });
  let format = formatArray;

  if (isShort) {
    if (duration.days === 0 && duration.hours && duration.hours > 0) {
      format = formatArray.filter(f => f === "hours");
    }
  }

  const formatted = formatDuration(duration, {
    format
  });
  return {
    timeAgo: formatted === "" ? "1m" : formatted,
    fullDate
  };
};

/***/ }),

/***/ 6941:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "S": function() { return /* binding */ handleError; }
/* harmony export */ });
/* unused harmony export pickFile */
const handleError = (error, setError) => {
  console.error(error);

  const setFieldsErrors = fields => {
    const keys = Object.keys(fields);

    if (!keys.length) {
      return setError("Une erreur inconnue est survenue");
    }

    for (const key of keys) {
      if (key === "message") {
        setError(fields[key]);
      } else {
        const message = fields[key].message ? fields[key].message : fields[key];
        setError(message, key);
      }
    }
  };

  if (error.status === 400 || error.status === 500) {
    if (error.data) {
      const keys = Object.keys(error.data);

      if (keys.length) {
        setFieldsErrors(error.data);
      } else {
        if (error.data.message) {
          setError(error.data.message);
        } else {
          setFieldsErrors(error.data);
        }
      }
    } else if (error.message) {
      setError(error.message);
    } else {
      setFieldsErrors(error);
    }
  } else {
    if (error.data) {
      if (error.data.message) {
        setError(error.data.message);
      } else {
        setFieldsErrors(error.data);
      }
    } else if (error.message) {
      setError(error.message);
    } else {
      setFieldsErrors(error);
    }
  }
};
function pickFile(onFilePicked) {
  const inputElement = document.createElement("input");
  inputElement.style.display = "none";
  inputElement.type = "file";
  inputElement.addEventListener("change", () => {
    if (inputElement.files) {
      onFilePicked(inputElement.files[0]);
    }
  });

  const teardown = () => {
    document.body.removeEventListener("focus", teardown, true);
    setTimeout(() => {
      document.body.removeChild(inputElement);
    }, 1000);
  };

  document.body.addEventListener("focus", teardown, true);
  document.body.appendChild(inputElement);
  inputElement.click();
}

/***/ }),

/***/ 2051:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "X8": function() { return /* binding */ unwrapSuggestion; }
/* harmony export */ });
/* unused harmony exports latLng2World, world2Screen */
/* harmony import */ var use_places_autocomplete__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(632);
/* harmony import */ var use_places_autocomplete__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(use_places_autocomplete__WEBPACK_IMPORTED_MODULE_0__);

const unwrapSuggestion = async suggestion => {
  const details = await (0,use_places_autocomplete__WEBPACK_IMPORTED_MODULE_0__.getDetails)({
    placeId: suggestion.place_id,
    fields: ["address_component"]
  });
  let city;
  details.address_components.forEach(component => {
    const types = component.types;

    if (types.indexOf("locality") > -1) {
      city = component.long_name;
    }
  });
  const results = await (0,use_places_autocomplete__WEBPACK_IMPORTED_MODULE_0__.getGeocode)({
    address: suggestion.description
  });
  const {
    lat,
    lng
  } = await (0,use_places_autocomplete__WEBPACK_IMPORTED_MODULE_0__.getLatLng)(results[0]);
  return {
    lat,
    lng,
    city
  };
};
const TILE_SIZE = 256;
function latLng2World({
  lat,
  lng
}) {
  const sin = Math.sin(lat * Math.PI / 180);
  const x = lng / 360 + 0.5;
  let y = 0.5 - 0.25 * Math.log((1 + sin) / (1 - sin)) / Math.PI;
  y = y < -1 // .
  ? -1 : y > 1 ? 1 : y;
  return {
    x,
    y
  };
}
function world2Screen({
  x,
  y
}, zoom) {
  const scale = Math.pow(2, zoom);
  return {
    x: x * scale * TILE_SIZE,
    y: y * scale * TILE_SIZE
  };
}

/***/ })

};
;