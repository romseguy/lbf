exports.id = 3831;
exports.ids = [3831];
exports.modules = {

/***/ 842:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "r": function() { return /* binding */ Link; }
/* harmony export */ });
/* harmony import */ var next_link__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1664);
/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3426);
/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _emotion_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7381);
/* harmony import */ var _emotion_react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_emotion_react__WEBPACK_IMPORTED_MODULE_2__);
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

// https://raw.githubusercontent.com/chakra-ui/chakra-ui/develop/examples/nextjs-typescript/components/NextChakraLink.tsx



const Link = (_ref) => {
  let {
    // NextLink
    href,
    as,
    replace,
    scroll,
    shallow,
    prefetch,
    // Chakra
    className,
    size,
    variant,
    onClick,
    children
  } = _ref,
      props = _objectWithoutProperties(_ref, ["href", "as", "replace", "scroll", "shallow", "prefetch", "className", "size", "variant", "onClick", "children"]);

  const chakraLink = (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_1__.Link, _extends({
    className: className,
    size: size,
    variant: variant,
    onClick: onClick
  }, props), children);

  if (!href) {
    return chakraLink;
  }

  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_2__.jsx)(next_link__WEBPACK_IMPORTED_MODULE_0__.default, {
    passHref: true,
    href: href,
    as: as,
    replace: replace,
    scroll: scroll,
    shallow: shallow,
    prefetch: prefetch
  }, chakraLink);
};

/***/ }),

/***/ 1109:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "b$": function() { return /* reexport */ AddressControl; },
  "pJ": function() { return /* reexport */ AutoCompletePlacesControl; },
  "zx": function() { return /* reexport */ Button; },
  "s4": function() { return /* reexport */ Chakra; },
  "W2": function() { return /* reexport */ Container; },
  "pZ": function() { return /* reexport */ DarkModeSwitch; },
  "Mt": function() { return /* reexport */ DatePicker; },
  "m1": function() { return /* reexport */ DeleteButton; },
  "sm": function() { return /* reexport */ EmailControl; },
  "h1": function() { return /* reexport */ ErrorMessageText; },
  "rj": function() { return /* reexport */ Grid; },
  "Q1": function() { return /* reexport */ GridHeader; },
  "P4": function() { return /* reexport */ GridItem; },
  "AW": function() { return /* reexport */ IconFooter; },
  "II": function() { return /* reexport */ Input; },
  "rU": function() { return /* reexport */ Link/* Link */.r; },
  "Qd": function() { return /* reexport */ RTEditor; },
  "Ph": function() { return /* reexport */ Select; },
  "LZ": function() { return /* reexport */ Spacer; },
  "gx": function() { return /* reexport */ Textarea; },
  "bd": function() { return /* reexport */ formats; },
  "q1": function() { return /* reexport */ renderCustomInput; },
  "fL": function() { return /* reexport */ toDateRange; }
});

// UNUSED EXPORTS: DateRange, DidYouKnow

// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(9297);
var external_react_default = /*#__PURE__*/__webpack_require__.n(external_react_);
// EXTERNAL MODULE: external "react-hook-form"
var external_react_hook_form_ = __webpack_require__(2662);
// EXTERNAL MODULE: external "@hookform/error-message"
var error_message_ = __webpack_require__(5228);
// EXTERNAL MODULE: external "@chakra-ui/react"
var react_ = __webpack_require__(3426);
// EXTERNAL MODULE: ./src/features/map/GoogleApiWrapper.tsx + 2 modules
var GoogleApiWrapper = __webpack_require__(4878);
// EXTERNAL MODULE: external "@emotion/react"
var external_emotion_react_ = __webpack_require__(7381);
;// CONCATENATED MODULE: ./src/features/common/forms/AddressControl.tsx
function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }








const AddressControl = (0,GoogleApiWrapper/* withGoogleApi */.q)({
  apiKey: "AIzaSyBW6lVlo-kbzkD3bThsccdDilCdb8_CPH8"
})((_ref) => {
  let {
    name,
    defaultValue,
    errors,
    control,
    isRequired = false,
    noLabel = false,
    mb,
    onSuggestionSelect,
    onClick
  } = _ref,
      props = _objectWithoutProperties(_ref, ["name", "defaultValue", "errors", "control", "isRequired", "noLabel", "mb", "onSuggestionSelect", "onClick"]);

  const controlRules = {
    required: isRequired && props.google
  };
  let loaded = props.loaded && props.google;

  if (false) {}

  return (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, (0,external_emotion_react_.jsx)(react_.FormControl, {
    id: name,
    isRequired: !!controlRules.required,
    isInvalid: !!errors[name],
    mb: mb
  }, !noLabel && (0,external_emotion_react_.jsx)(react_.FormLabel, null, "Adresse"), loaded ? (0,external_emotion_react_.jsx)(external_react_hook_form_.Controller, {
    name: name,
    control: control,
    defaultValue: defaultValue,
    rules: controlRules,
    render: ({
      onChange,
      value
    }) => {
      return (0,external_emotion_react_.jsx)(AutoCompletePlacesControl, {
        onClick: onClick,
        onChange: description => {
          onChange(description.replace(", France", ""));
          props.onChange && props.onChange(description.replace(", France", ""));
        },
        onSuggestionSelect: onSuggestionSelect,
        value: typeof props.value === "string" ? props.value : value,
        placeholder: props.placeholder || "Cliquez ici pour saisir une adresse..."
      });
    }
  }) : (0,external_emotion_react_.jsx)(react_.Spinner, null), (0,external_emotion_react_.jsx)(react_.FormErrorMessage, null, (0,external_emotion_react_.jsx)(error_message_.ErrorMessage, {
    errors: errors,
    name: name
  }))));
});
// EXTERNAL MODULE: external "@react-icons/all-files/fa/FaMapMarkedAlt.js"
var FaMapMarkedAlt_js_ = __webpack_require__(1631);
// EXTERNAL MODULE: external "react-cool-onclickoutside"
var external_react_cool_onclickoutside_ = __webpack_require__(62);
var external_react_cool_onclickoutside_default = /*#__PURE__*/__webpack_require__.n(external_react_cool_onclickoutside_);
// EXTERNAL MODULE: external "use-places-autocomplete"
var external_use_places_autocomplete_ = __webpack_require__(632);
var external_use_places_autocomplete_default = /*#__PURE__*/__webpack_require__.n(external_use_places_autocomplete_);
;// CONCATENATED MODULE: ./src/features/common/forms/AutoCompletePlacesControl.tsx






let cachedVal = "";
const acceptedKeys = ["ArrowUp", "ArrowDown", "Escape", "Enter"];
const AutoCompletePlacesControl = ({
  onChange,
  value,
  placeholder,
  onSuggestionSelect,
  onClick
}) => {
  const {
    colorMode
  } = (0,react_.useColorMode)();
  const isDark = colorMode === "dark";
  const {
    ready,
    value: autoCompleteValue,
    suggestions: {
      status,
      data
    },
    setValue: setAutoCompleteValue,
    clearSuggestions
  } = external_use_places_autocomplete_default()({
    requestOptions: {
      componentRestrictions: {
        country: "fr"
      }
    },
    debounce: 300
  });
  const {
    0: currIndex,
    1: setCurrIndex
  } = (0,external_react_.useState)(null);

  const dismissSuggestions = () => {
    setCurrIndex(null);
    clearSuggestions();
  };

  const hasSuggestions = status === "OK";
  (0,external_react_.useEffect)(() => {
    if (typeof value === "string") {
      setAutoCompleteValue(value, false);
    }
  }, [value]);
  const ref = external_react_cool_onclickoutside_default()(() => {
    dismissSuggestions();
  });

  const handleSelect = suggestion => () => {
    const {
      description
    } = suggestion;
    setAutoCompleteValue(description, false);
    onChange(description);
    onSuggestionSelect && onSuggestionSelect(suggestion);
    dismissSuggestions();
  };

  const renderSuggestions = () => data.map((suggestion, idx) => {
    const {
      place_id,
      structured_formatting: {
        main_text,
        secondary_text
      }
    } = suggestion;
    const isCurrent = idx === currIndex;
    let bg = isDark ? "gray.600" : "white";
    let color = isDark ? "white" : "black";

    if (isCurrent) {
      if (isDark) {
        bg = "white";
        color = "black";
      } else {
        bg = "black";
        color = "white";
      }
    }

    return (0,external_emotion_react_.jsx)(react_.ListItem, {
      key: place_id,
      cursor: "pointer",
      bg: bg,
      color: color,
      borderRadius: "lg",
      px: 3,
      py: 2,
      _hover: {
        boxShadow: "outline"
      },
      onClick: handleSelect(suggestion)
    }, (0,external_emotion_react_.jsx)("strong", null, main_text), " ", (0,external_emotion_react_.jsx)("small", null, secondary_text));
  });

  return (0,external_emotion_react_.jsx)("div", {
    ref: ref
  }, (0,external_emotion_react_.jsx)(react_.InputGroup, null, (0,external_emotion_react_.jsx)(react_.InputLeftElement, {
    pointerEvents: "none",
    children: (0,external_emotion_react_.jsx)(FaMapMarkedAlt_js_.FaMapMarkedAlt, null)
  }), (0,external_emotion_react_.jsx)(react_.Input, {
    value: autoCompleteValue,
    onChange: e => {
      setAutoCompleteValue(e.target.value);
      cachedVal = e.target.value;
      onChange(e.target.value);
    },
    autoComplete: "off",
    placeholder: placeholder,
    pl: 10,
    onClick: onClick,
    onKeyDown: e => {
      if (!hasSuggestions || !acceptedKeys.includes(e.key)) return;

      if (e.key === "Escape") {
        e.preventDefault();
        dismissSuggestions();
        return;
      }

      if (e.key === "Enter") {
        e.preventDefault();
        const newValue = currIndex === null ? cachedVal : data[currIndex].description;
        setAutoCompleteValue(newValue, false);
        onChange(newValue);
        dismissSuggestions();
        return;
      }

      let nextIndex;

      if (e.key === "ArrowUp") {
        e.preventDefault();
        nextIndex = currIndex !== null && currIndex !== void 0 ? currIndex : data.length;
        nextIndex = nextIndex > 0 ? nextIndex - 1 : null;
      } else {
        nextIndex = currIndex !== null && currIndex !== void 0 ? currIndex : -1;
        nextIndex = nextIndex < data.length - 1 ? nextIndex + 1 : null;
      }

      setCurrIndex(nextIndex);
      if (nextIndex === null) setAutoCompleteValue(cachedVal);else setAutoCompleteValue(data[nextIndex].description, false);
    }
  })), status === "OK" && (0,external_emotion_react_.jsx)(react_.List, {
    className: "suggestions",
    spacing: 3,
    pt: 2,
    px: 5
  }, renderSuggestions()));
};
// EXTERNAL MODULE: external "@emotion/styled/base"
var base_ = __webpack_require__(4617);
var base_default = /*#__PURE__*/__webpack_require__.n(base_);
// EXTERNAL MODULE: external "@chakra-ui/icons"
var icons_ = __webpack_require__(3724);
// EXTERNAL MODULE: ./node_modules/date-fns/esm/locale/fr/index.js + 9 modules
var fr = __webpack_require__(678);
// EXTERNAL MODULE: external "react-datepicker"
var external_react_datepicker_ = __webpack_require__(9008);
var external_react_datepicker_default = /*#__PURE__*/__webpack_require__.n(external_react_datepicker_);
// EXTERNAL MODULE: external "react-device-detect"
var external_react_device_detect_ = __webpack_require__(2047);
// EXTERNAL MODULE: ./node_modules/react-datepicker/dist/react-datepicker.min.css
var react_datepicker_min = __webpack_require__(919);
// EXTERNAL MODULE: external "date-fns"
var external_date_fns_ = __webpack_require__(3879);
;// CONCATENATED MODULE: ./src/features/common/forms/DatePicker.tsx


function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }











const ReactDatePickerStyles = base_default()("span",  true ? {
  target: "emps5eb0"
} : 0)(({
  isBrowser
}) => [`
    .react-datepicker {
    }
    
    .react-datepicker__time-list-item--disabled {
      display: none;
    }

    .react-datepicker__day {
      //width: 24px !important;
      margin: unset;
    }
    .react-datepicker__day-name {
      //width: 24px !important;
      margin: unset;
    }

    .react-datepicker__month-container {
      width: 250px !important;
    }
    .react-datepicker__month {
      margin: unset;
    }

    .react-datepicker__time-container {
      width: unset !important;
    }
    .react-datepicker__time-container
      .react-datepicker__time
      .react-datepicker__time-box {
      width: unset;
    }
    // ul.react-datepicker__time-list > li {
    //   padding: unset !important;
    // }
  `, isBrowser && `
      .react-datepicker-popper {
        z-index: 100 !important;
      }
      /* remove default previous/next icons */
        .react-datepicker__navigation-icon--previous:before {
          border: 0 !important;
        }
        .react-datepicker__navigation-icon--next:before {
          border: 0 !important;
        }
      /* use custom */
        .react-datepicker__navigation--next {
          background: url(/images/arrow-right.png) no-repeat;
        }
        .react-datepicker__navigation--previous {
          background: url(/images/arrow-left.png) no-repeat;
        }
        .react-datepicker__navigation--previous,
        .react-datepicker__navigation--next {
          width: 15px;
          height: 15px;
          border: none;
          top: 12px;
        }
      `],  true ? "" : 0);

const renderCustomInput = (label, timeOnly) => {
  const ExampleCustomInput = /*#__PURE__*/(0,external_react_.forwardRef)(({
    value,
    onClick
  }, ref) => {
    let cursor = "pointer";
    let isDisabled = false;
    const day = value === null || value === void 0 ? void 0 : value.substr(0, 2);
    const month = value === null || value === void 0 ? void 0 : value.substr(3, 2);
    const year = value === null || value === void 0 ? void 0 : value.substr(6, 4);
    const hours = value === null || value === void 0 ? void 0 : value.substr(12, 2);
    const minutes = value === null || value === void 0 ? void 0 : value.substr(15, 2);
    const date = (0,external_date_fns_.parseISO)(`${year}-${month}-${day}T${hours}:${minutes}`); // if (
    //   label === "repeat" &&
    //   (!eventMinDate || !eventMaxDate)
    // ) {
    //   cursor = "not-allowed";
    //   isDisabled = true;
    // }

    return (0,external_emotion_react_.jsx)(react_.Button, {
      "aria-label": label,
      onClick: onClick,
      ref: ref,
      isDisabled: isDisabled
    }, value ? (0,external_date_fns_.format)(date, timeOnly ? "H'h'mm" : "cccc d MMMM H'h'mm", {
      locale: fr/* default */.Z
    }) : (0,external_emotion_react_.jsx)(icons_.TimeIcon, {
      cursor: cursor
    }));
  });
  return (0,external_emotion_react_.jsx)(ExampleCustomInput, null);
};
const DatePicker = (_ref) => {
  let datePickerProps = Object.assign({}, _ref);
  return (0,external_emotion_react_.jsx)(ReactDatePickerStyles, {
    isBrowser: external_react_device_detect_.isBrowser
  }, (0,external_emotion_react_.jsx)((external_react_datepicker_default()), _extends({
    dateFormat: "dd/MM",
    locale: fr/* default */.Z,
    timeCaption: "h",
    onChangeRaw: e => e.preventDefault()
  }, datePickerProps)));
};
// EXTERNAL MODULE: ./src/features/common/Link.tsx
var Link = __webpack_require__(842);
;// CONCATENATED MODULE: ./src/features/common/forms/EmailControl.tsx
function EmailControl_extends() { EmailControl_extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return EmailControl_extends.apply(this, arguments); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function EmailControl_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = EmailControl_objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function EmailControl_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }


 // import { Input } from "features/common";






const EmailControl = (_ref) => {
  let {
    defaultValue,
    errors,
    name,
    label = "Adresse e-mail",
    noLabel,
    control,
    register,
    setValue,
    isRequired = false,
    isMultiple = true,
    onRightElementClick
  } = _ref,
      props = EmailControl_objectWithoutProperties(_ref, ["defaultValue", "errors", "name", "label", "noLabel", "control", "register", "setValue", "isRequired", "isMultiple", "onRightElementClick"]);

  let formRules = {};

  if (isRequired) {
    formRules.required = "Veuillez saisir une adresse e-mail";
  }

  if (!isMultiple) {
    return (0,external_emotion_react_.jsx)(react_.FormControl, EmailControl_extends({
      id: name,
      isRequired: isRequired,
      isInvalid: !!errors[name]
    }, props), !noLabel && (0,external_emotion_react_.jsx)(react_.FormLabel, null, label), (0,external_emotion_react_.jsx)(react_.InputGroup, null, (0,external_emotion_react_.jsx)(react_.InputLeftElement, {
      pointerEvents: "none",
      children: (0,external_emotion_react_.jsx)(icons_.AtSignIcon, null)
    }), (0,external_emotion_react_.jsx)(react_.Input, {
      name: name,
      placeholder: props.placeholder || "Cliquez ici pour saisir une adresse e-mail...",
      ref: register(_objectSpread({
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: "Adresse email invalide"
        }
      }, formRules)),
      defaultValue: defaultValue,
      pl: 10
    }), noLabel && onRightElementClick && (0,external_emotion_react_.jsx)(react_.InputRightElement, {
      pointerEvents: "none",
      children: (0,external_emotion_react_.jsx)(react_.Icon, {
        as: icons_.EmailIcon,
        onClick: onRightElementClick
      })
    })), (0,external_emotion_react_.jsx)(react_.FormErrorMessage, null, (0,external_emotion_react_.jsx)(error_message_.ErrorMessage, {
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
  return (0,external_emotion_react_.jsx)(react_.Box, {
    mb: 3
  }, fields.map((field, index) => {
    return (0,external_emotion_react_.jsx)(react_.FormControl, EmailControl_extends({
      key: field.id,
      id: name,
      isRequired: isRequired,
      isInvalid: errors[name] && errors[name][index]
    }, props), !noLabel && (0,external_emotion_react_.jsx)(react_.FormLabel, {
      m: 0
    }, index > 0 ? `${index + 1}ème ${label.toLowerCase()}` : label), (0,external_emotion_react_.jsx)(react_.InputGroup, null, (0,external_emotion_react_.jsx)(react_.InputLeftElement, {
      pointerEvents: "none",
      children: (0,external_emotion_react_.jsx)(icons_.AtSignIcon, null)
    }), (0,external_emotion_react_.jsx)(react_.Input, {
      name: `${name}[${index}].email`,
      placeholder: props.placeholder || "Cliquez ici pour saisir une adresse e-mail...",
      defaultValue: `${field.email}` // make sure to set up defaultValue
      ,
      ref: register(_objectSpread({
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: "Adresse email invalide"
        }
      }, formRules))
    }), (0,external_emotion_react_.jsx)(react_.InputRightAddon, {
      p: 0,
      children: (0,external_emotion_react_.jsx)(react_.IconButton, {
        "aria-label": `Supprimer la ${index + 1}ème adresse e-mail`,
        icon: (0,external_emotion_react_.jsx)(icons_.DeleteIcon, null),
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
    })), (0,external_emotion_react_.jsx)(react_.FormErrorMessage, null, (0,external_emotion_react_.jsx)(error_message_.ErrorMessage, {
      errors: errors,
      name: `${name}[${index}].email`
    })));
  }), (0,external_emotion_react_.jsx)(Link/* Link */.r, {
    fontSize: "smaller",
    onClick: () => {
      append({
        email: ""
      });
    }
  }, (0,external_emotion_react_.jsx)(icons_.EmailIcon, null), " Ajouter une adresse e-mail"));
};
;// CONCATENATED MODULE: ./src/features/common/forms/Input.tsx


const Input = /*#__PURE__*/base_default()(react_.Input,  true ? {
  target: "e1ae99010"
} : 0)(() =>
/* props */
{
  const {
    colorMode
  } = (0,react_.useColorMode)();
  if (
  /* props. */
  colorMode === "dark") return `
    border: 1px solid #7b8593;

    :hover {
      border: 1px solid white;
    }

    ::placeholder {
      color: #7b8593;
    }
    `;
  return null;
},  true ? "" : 0);
// EXTERNAL MODULE: external "axios"
var external_axios_ = __webpack_require__(2376);
var external_axios_default = /*#__PURE__*/__webpack_require__.n(external_axios_);
// EXTERNAL MODULE: external "quill-delta-to-html"
var external_quill_delta_to_html_ = __webpack_require__(4657);
// EXTERNAL MODULE: external "react-quilljs"
var external_react_quilljs_ = __webpack_require__(6199);
// EXTERNAL MODULE: ./src/utils/string.ts
var string = __webpack_require__(7535);
// EXTERNAL MODULE: external "@react-icons/all-files/fa/FaHeart.js"
var FaHeart_js_ = __webpack_require__(2077);
;// CONCATENATED MODULE: ./src/features/common/forms/RTEditorToolbar.tsx




const RTEditorToolbar = ({
  id,
  formats,
  event,
  org
}) => {
  return (0,external_emotion_react_.jsx)("div", {
    id: id
  }, formats.includes("size") && (0,external_emotion_react_.jsx)("span", {
    className: "ql-formats"
  }, (0,external_emotion_react_.jsx)("select", {
    className: "ql-size",
    title: "Taille du texte"
  })), (0,external_emotion_react_.jsx)("span", {
    className: "ql-formats"
  }, (0,external_emotion_react_.jsx)("select", {
    className: "ql-color",
    title: "Texte en couleur"
  }), (0,external_emotion_react_.jsx)(react_.Tooltip, {
    label: "Texte en gras"
  }, (0,external_emotion_react_.jsx)("button", {
    className: "ql-bold"
  })), (0,external_emotion_react_.jsx)(react_.Tooltip, {
    label: "Texte en italique"
  }, (0,external_emotion_react_.jsx)("button", {
    className: "ql-italic"
  })), (0,external_emotion_react_.jsx)(react_.Tooltip, {
    label: "Texte soulign\xE9"
  }, (0,external_emotion_react_.jsx)("button", {
    className: "ql-underline"
  }))), (0,external_emotion_react_.jsx)("span", {
    className: "ql-formats"
  }, (0,external_emotion_react_.jsx)(react_.Tooltip, {
    label: "Citation"
  }, (0,external_emotion_react_.jsx)("button", {
    className: "ql-blockquote"
  })), (0,external_emotion_react_.jsx)("select", {
    className: "ql-align",
    title: "Aligner le texte"
  })), formats.includes("list") && (0,external_emotion_react_.jsx)("span", {
    className: "ql-formats"
  }, (0,external_emotion_react_.jsx)("button", {
    className: "ql-list",
    value: "ordered"
  }), (0,external_emotion_react_.jsx)("button", {
    className: "ql-list",
    value: "bullet"
  })), (0,external_emotion_react_.jsx)("span", {
    className: "ql-formats"
  }, (0,external_emotion_react_.jsx)("button", {
    className: "ql-indent",
    value: "-1"
  }), (0,external_emotion_react_.jsx)("button", {
    className: "ql-indent",
    value: "+1"
  })), (0,external_emotion_react_.jsx)("span", {
    className: "ql-formats"
  }, (0,external_emotion_react_.jsx)(react_.Tooltip, {
    label: "Annuler"
  }, (0,external_emotion_react_.jsx)("button", {
    className: "ql-undo"
  })), (0,external_emotion_react_.jsx)(react_.Tooltip, {
    label: "Refaire"
  }, (0,external_emotion_react_.jsx)("button", {
    className: "ql-redo"
  }))), (0,external_emotion_react_.jsx)("span", {
    className: "ql-formats"
  }, (0,external_emotion_react_.jsx)(react_.Tooltip, {
    label: "Ins\xE9rer une image"
  }, (0,external_emotion_react_.jsx)("button", {
    className: "ql-image"
  })), (0,external_emotion_react_.jsx)(react_.Tooltip, {
    label: "Ins\xE9rer une vid\xE9o"
  }, (0,external_emotion_react_.jsx)("button", {
    className: "ql-video"
  })), (0,external_emotion_react_.jsx)(react_.Tooltip, {
    label: "Ins\xE9rer un lien"
  }, (0,external_emotion_react_.jsx)("button", {
    className: "ql-link"
  }))), (0,external_emotion_react_.jsx)("span", {
    className: "ql-formats"
  }, (0,external_emotion_react_.jsx)(react_.Tooltip, {
    label: "Supprimer le formatage"
  }, (0,external_emotion_react_.jsx)("button", {
    className: "ql-clean"
  })), (0,external_emotion_react_.jsx)(react_.Tooltip, {
    label: "Ins\xE9rer un \u2665"
  }, (0,external_emotion_react_.jsx)("button", {
    className: "ql-insertHeart"
  }, (0,external_emotion_react_.jsx)(FaHeart_js_.FaHeart, null)))));
};
;// CONCATENATED MODULE: ./src/features/common/forms/RTEditorStyles.tsx



const tabSize = 10;
const RTEditorStyles = /*#__PURE__*/base_default()("span",  true ? {
  target: "e1d9h6v90"
} : 0)(props => {
  const {
    colorMode
  } = (0,react_.useColorMode)();
  const bothColorModes = `
      .ql-editor {
        padding: 12px;
        tab-size: ${tabSize};
        -moz-tab-size: ${tabSize};
        -o-tab-size:  ${tabSize};
        max-height: 250px;
        overflow: auto;
      }

      &:hover {
        .ql-toolbar {
          border: 1px solid #cbd5e0;
        }

        .ql-container {
          border: 1px solid #cbd5e0;
        }
      }

      .ql-toolbar {
        border: 1px solid #e2e8f0;
        padding: 0;
        text-align: center;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;

        button {
          padding: 0;
        }

        .ql-picker-label {
          padding: 0;
        }

        & > .ql-formats {
          margin: 0 8px 0 0;
        }

        // & > .ql-formats > button {
        //     padding: 0 2px 0 0;
        //     width: auto;
        // }

        // & > .ql-formats > button:hover {
        //     & > svg > .ql-stroke {
        //     }
        //     & > svg > .ql-fill {
        //     }
        // }

        .ql-picker.ql-size {
          width: auto;
          .ql-picker-label {
            padding-right: 16px;
            padding-left: 4px;
          }
        }

        .ql-insertHeart {
          padding: 0;
        }
      }

      .ql-container.ql-disabled {
        * {
          cursor: not-allowed;
        }
      }

      .ql-container {
        width: ${props.width ? props.width : ""};
        height: ${props.height ? props.height : ""};
        border: 1px solid #e2e8f0;
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;

        & > .ql-editor.ql-blank::before {
          font-size: 16px;
          color: ${colorMode === "dark" ? "#7b8593" : "#bfc7ce"};
          font-style: normal;
          overflow: hidden;
          white-space: nowrap;
        }
      }

      .image-uploading {
        position: relative;
        display: inline-block;
      }

      .image-uploading img {
        max-width: 98% !important;
        filter: blur(5px);
        opacity: 0.3;
      }

      .image-uploading::before {
        content: "";
        box-sizing: border-box;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 30px;
        height: 30px;
        margin-top: -15px;
        margin-left: -15px;
        border-radius: 50%;
        border: 3px solid #ccc;
        border-top-color: #1e986c;
        z-index: 1;
        animation: spinner 0.6s linear infinite;
      }

      @keyframes spinner {
        to {
          transform: rotate(360deg);
        }
      }

    `;
  return `
    ${bothColorModes}
    ${colorMode === "dark" && `
      &:hover {
        .ql-toolbar {
          border: 1px solid #5F6774;
        }

        .ql-container {
          border: 1px solid #5F6774;
        }
      }

      .ql-toolbar {
        border: 1px solid #4F5765;

        .ql-stroke {
          stroke: white;
        }
        
        .ql-fill {
          fill: white;
        }

        .ql-size {
          color: white;
        }
        
        .ql-picker-options {
          color: white;
          background: black;
        }

      }

      .ql-container {
        border: 1px solid #4F5765;
      }
      `}
    `;
},  true ? "" : 0);
;// CONCATENATED MODULE: ./src/features/common/forms/RTEditor.tsx
function RTEditor_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = RTEditor_objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function RTEditor_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }











function deltaToHtml(deltaOps) {
  const converter = new external_quill_delta_to_html_.QuillDeltaToHtmlConverter(deltaOps, {
    inlineStyles: true
  });
  const html = converter.convert();
  return html;
}

const formats = ["size", "bold", "italic", "underline", "blockquote", "indent", "header", //"list",
"color", "align", "link", "image", "imageBlot", "video", "undo", "redo"];
const RTEditor = (_ref) => {
  let {
    defaultValue,
    event,
    org,
    session,
    onChange,
    readOnly,
    placeholder
  } = _ref,
      props = RTEditor_objectWithoutProperties(_ref, ["defaultValue", "event", "org", "session", "onChange", "readOnly", "placeholder"]);

  const toast = (0,react_.useToast)({
    position: "top"
  });
  const shortId = (0,string/* getUniqueId */.Ki)();

  const modules = id => ({
    history: {
      delay: 1000,
      maxStack: 50,
      userOnly: false
    },
    autoLinks: true,
    imageUploader: {
      upload: async file => {
        console.log(file);

        if (!/^image\//.test(file.type)) {
          toast({
            status: "error",
            title: "Vous devez sélectionner une image"
          });
          return;
        }

        if (file.size >= 10000000) {
          toast({
            status: "error",
            title: "L'image ne doit pas dépasser 10Mo."
          });
          return;
        }

        const data = new FormData();
        data.append("file", file);
        if (event) data.append("eventId", event._id);else if (org) data.append("orgId", org._id);else if (session) data.append("userId", session.user.userId);
        const mutation = await external_axios_default().post("https://api.aucourant.de", data);
        let url = `${"https://api.aucourant.de"}/view?fileName=${mutation.data.file}`;
        if (event) url += `&eventId=${event._id}`;else if (org) url += `&orgId=${org._id}`;else if (session) url += `&userId=${session.user.userId}`;
        return url;
      }
    },
    toolbar: {
      container: "#" + id,
      handlers: {
        //image: () => {},
        insertHeart: () => {},
        undo: () => {},
        redo: () => {}
      }
    }
  });

  const options = {
    theme: "snow",
    modules: modules(shortId),
    formats: props.formats || formats,
    placeholder,
    readOnly
  };
  const {
    quill,
    quillRef,
    Quill
  } = (0,external_react_quilljs_.useQuill)(options);
  const insertHeart = (0,external_react_.useCallback)(() => {
    const cursorPosition = quill.getSelection().index;
    quill.insertText(cursorPosition, "♥");
    quill.setSelection(cursorPosition + 1);
  }, [quill]);
  const undo = (0,external_react_.useCallback)(() => {
    return quill.history.undo();
  }, [quill]);
  const redo = (0,external_react_.useCallback)(() => {
    return quill.history.redo();
  }, [quill]);

  if (Quill && !quill) {
    const Image = Quill.import("formats/image");

    Image.sanitize = url => url;

    var icons = Quill.import("ui/icons");
    icons["undo"] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18px" height="18px">
      <path d="M0 0h24v24H0z" fill="none"/>
      <path class="ql-fill" d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/>
      </svg>`;
    icons["redo"] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18px" height="18px">
      <path d="M0 0h24v24H0z" fill="none"/>
      <path class="ql-fill" d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"/>
      </svg>`;

    const AutoLinks = __webpack_require__(4404).default; // or quill-magic-url


    Quill.register("modules/autoLinks", AutoLinks, true); // const ImageCompress = require("quill-image-compress").default;
    // Quill.register("modules/imageCompress", ImageCompress);

    const ImageUploader = __webpack_require__(6815)/* .default */ .Z;

    Quill.register("modules/imageUploader", ImageUploader, true);
  }

  (0,external_react_.useEffect)(() => {
    if (quill) {
      if (quill.root) {
        quill.root.innerHTML = defaultValue || "";
      }

      quill.on("text-change", () =>
      /*delta, oldDelta, source*/
      {
        if (onChange && quill.root) {
          const delta = quill.getContents();
          onChange(deltaToHtml(delta.ops));
        }
      }); //quill.getModule("toolbar").addHandler("image", image);

      quill.getModule("toolbar").addHandler("insertHeart", insertHeart);
      quill.getModule("toolbar").addHandler("undo", undo);
      quill.getModule("toolbar").addHandler("redo", redo);
    }
  }, [quill, undo, redo, insertHeart]);
  (0,external_react_.useEffect)(() => {
    if (quill && quill.root) quill.root.innerHTML = defaultValue === undefined ? "" : defaultValue;
  }, [defaultValue]);
  return (0,external_emotion_react_.jsx)(RTEditorStyles, {
    height: props.height,
    width: props.width
  }, (0,external_emotion_react_.jsx)(RTEditorToolbar, {
    id: shortId,
    formats: props.formats || formats,
    event: event,
    org: org
  }), (0,external_emotion_react_.jsx)("div", {
    ref: quillRef
  }));
};
;// CONCATENATED MODULE: ./src/features/common/forms/Select.tsx


const Select = /*#__PURE__*/base_default()(react_.Select,  true ? {
  target: "e1aux2xo0"
} : 0)(() =>
/* props */
{
  const {
    colorMode
  } = (0,react_.useColorMode)();
  if (
  /* props. */
  colorMode === "dark") return `
    border: 1px solid #7b8593;

    :hover {
      border: 1px solid white;
    }
    `;
  return null;
},  true ? "" : 0);
;// CONCATENATED MODULE: ./src/features/common/forms/Textarea.tsx


const Textarea = /*#__PURE__*/base_default()(react_.Textarea,  true ? {
  target: "e7qupoi0"
} : 0)(() =>
/* props */
{
  const {
    colorMode
  } = (0,react_.useColorMode)();
  if (
  /* props. */
  colorMode === "dark") return `
    border: 1px solid #7b8593;

    :hover {
      border: 1px solid white;
    }

    ::placeholder {
      color: #7b8593;
    }
    `;
  return null;
},  true ? "" : 0);
;// CONCATENATED MODULE: ./src/features/common/Button.tsx
function Button_extends() { Button_extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return Button_extends.apply(this, arguments); }

function Button_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = Button_objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function Button_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }




const Button = (_ref) => {
  let {
    children,
    light,
    dark
  } = _ref,
      props = Button_objectWithoutProperties(_ref, ["children", "light", "dark"]);

  const styles = (0,react_.useColorModeValue)(light, dark);
  return (0,external_emotion_react_.jsx)(react_.Button, Button_extends({}, styles, props), children);
};
;// CONCATENATED MODULE: ./src/features/common/Chakra.tsx


function Chakra({
  cookies,
  children,
  theme
}) {
  const colorModeManager = typeof cookies === "string" ? (0,react_.cookieStorageManager)(cookies) : react_.localStorageManager;
  return (0,external_emotion_react_.jsx)(react_.ChakraProvider, {
    resetCSS: true,
    theme: theme,
    colorModeManager: colorModeManager
  }, children);
}
;// CONCATENATED MODULE: ./src/features/common/Container.tsx
function Container_extends() { Container_extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return Container_extends.apply(this, arguments); }

function Container_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = Container_objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function Container_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }




const Container = (_ref) => {
  let {
    light,
    dark
  } = _ref,
      props = Container_objectWithoutProperties(_ref, ["light", "dark"]);

  const styles = (0,react_.useColorModeValue)(light, dark);
  return (0,external_emotion_react_.jsx)(react_.Container, Container_extends({}, styles, props));
};
// EXTERNAL MODULE: external "@react-icons/all-files/fa/FaSun.js"
var FaSun_js_ = __webpack_require__(739);
// EXTERNAL MODULE: external "@react-icons/all-files/fa/FaMoon.js"
var FaMoon_js_ = __webpack_require__(1899);
// EXTERNAL MODULE: external "react-toggle"
var external_react_toggle_ = __webpack_require__(7405);
var external_react_toggle_default = /*#__PURE__*/__webpack_require__.n(external_react_toggle_);
;// CONCATENATED MODULE: ./src/features/common/DarkModeSwitch.tsx



function DarkModeSwitch_extends() { DarkModeSwitch_extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return DarkModeSwitch_extends.apply(this, arguments); }





const DarkModeSwitch = props => {
  const {
    colorMode,
    toggleColorMode
  } = (0,react_.useColorMode)();
  const isDark = colorMode === "dark";
  return (0,external_emotion_react_.jsx)((external_react_toggle_default()), DarkModeSwitch_extends({
    defaultChecked: isDark,
    icons: {
      checked: (0,external_emotion_react_.jsx)(FaMoon_js_.FaMoon, {
        color: "white"
      }),
      unchecked: (0,external_emotion_react_.jsx)(FaSun_js_.FaSun, {
        color: "white"
      })
    },
    onChange: toggleColorMode
  }, props));
};
;// CONCATENATED MODULE: ./src/features/common/DateRange.tsx




const fullMinDateString = date => (0,external_date_fns_.format)(date, "dd MMMM", {
  locale: fr/* default */.Z
});

const fullMaxDateString = date => (0,external_date_fns_.format)(date, "dd MMMM", {
  locale: fr/* default */.Z
});

const toDateRange = (minDate, maxDate) => {
  return `
      du <b>${(0,external_date_fns_.format)(minDate, "cccc", {
    locale: fr/* default */.Z
  })}</b>${" "}
      ${fullMinDateString(minDate)} à${" "}
      <b>${(0,external_date_fns_.format)(minDate, "H:mm", {
    locale: fr/* default */.Z
  })}</b>
      <br />
      jusqu'au <b>${(0,external_date_fns_.format)(maxDate, "cccc", {
    locale: fr/* default */.Z
  })}</b>${" "}
      ${fullMaxDateString(maxDate)} à${" "}
      <b>${(0,external_date_fns_.format)(maxDate, "H:mm", {
    locale: fr/* default */.Z
  })}</b>
      `;
};
const DateRange = ({
  minDate,
  maxDate
}) => {
  return ___EmotionJSX("div", {
    dangerouslySetInnerHTML: {
      __html: toDateRange(minDate, maxDate)
    }
  });
};
;// CONCATENATED MODULE: ./src/features/common/DeleteButton.tsx
function DeleteButton_extends() { DeleteButton_extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return DeleteButton_extends.apply(this, arguments); }

function DeleteButton_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = DeleteButton_objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function DeleteButton_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }





const DeleteButton = (_ref) => {
  let {
    onClick,
    isDisabled,
    isLoading,
    isIconOnly,
    header,
    body,
    placement = "left"
  } = _ref,
      props = DeleteButton_objectWithoutProperties(_ref, ["onClick", "isDisabled", "isLoading", "isIconOnly", "header", "body", "placement"]);

  const [isOpen, setIsOpen] = external_react_default().useState(false);

  const onClose = () => setIsOpen(false);

  const cancelRef = external_react_default().useRef(null);
  return (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, isIconOnly ? (0,external_emotion_react_.jsx)(react_.Tooltip, {
    label: "Supprimer",
    placement: placement
  }, (0,external_emotion_react_.jsx)(react_.IconButton, DeleteButton_extends({
    "aria-label": "Supprimer",
    icon: (0,external_emotion_react_.jsx)(icons_.DeleteIcon, null),
    isLoading: isLoading
  }, props, {
    onClick: e => {
      e.stopPropagation();
      setIsOpen(true);
    }
  }))) : (0,external_emotion_react_.jsx)(react_.Button, DeleteButton_extends({}, props, {
    "aria-label": "Supprimer",
    leftIcon: (0,external_emotion_react_.jsx)(icons_.DeleteIcon, null),
    onClick: e => {
      e.stopPropagation();
      setIsOpen(true);
    },
    colorScheme: "red" // css={css`
    //   &:hover {
    //     background-color: red;
    //   }
    //   ${tw`bg-red-400`}
    // `}

  }), "Supprimer"), (0,external_emotion_react_.jsx)(react_.AlertDialog, {
    isOpen: isOpen,
    leastDestructiveRef: cancelRef,
    onClose: onClose
  }, (0,external_emotion_react_.jsx)(react_.AlertDialogOverlay, null, (0,external_emotion_react_.jsx)(react_.AlertDialogContent, null, (0,external_emotion_react_.jsx)(react_.AlertDialogHeader, {
    fontSize: "lg",
    fontWeight: "bold"
  }, header), (0,external_emotion_react_.jsx)(react_.AlertDialogBody, null, body), (0,external_emotion_react_.jsx)(react_.AlertDialogFooter, null, (0,external_emotion_react_.jsx)(react_.Button, {
    ref: cancelRef,
    onClick: onClose
  }, "Annuler"), (0,external_emotion_react_.jsx)(react_.Button, {
    isDisabled: isDisabled,
    isLoading: isLoading,
    colorScheme: "red",
    onClick: () => {
      onClick();
      onClose();
    },
    ml: 3,
    "data-cy": "deleteButtonSubmit"
  }, "Supprimer")))))); // const { onOpen, onClose, isOpen } = useDisclosure();
  // return (
  //   <Popover isOpen={isOpen} onOpen={onOpen} onClose={onClose} isLazy>
  //     <PopoverTrigger>
  //     </PopoverTrigger>
  //     <PopoverContent ml={5}>
  //       <PopoverCloseButton />
  //       {isLoading ? (
  //         <Spinner />
  //       ) : (
  //         <>
  //           <PopoverBody>{body}</PopoverBody>
  //           <PopoverFooter d="flex" justifyContent="space-between">
  //             <Button
  //               colorScheme="green"
  //               onClick={() => {
  //                 onClick();
  //                 onClose();
  //               }}
  //             >
  //               Supprimer
  //             </Button>
  //             <Button onClick={onClose}>Annuler</Button>
  //           </PopoverFooter>
  //         </>
  //       )}
  //     </PopoverContent>
  //   </Popover>
  // );
};
;// CONCATENATED MODULE: ./src/features/common/DidYouKnow.tsx
function DidYouKnow_extends() { DidYouKnow_extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return DidYouKnow_extends.apply(this, arguments); }

function DidYouKnow_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = DidYouKnow_objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function DidYouKnow_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }





const DidYouKnow = (_ref) => {
  let {
    children
  } = _ref,
      props = DidYouKnow_objectWithoutProperties(_ref, ["children"]);

  return ___EmotionJSX(Alert, DidYouKnow_extends({
    status: "info"
  }, props), ___EmotionJSX(Icon, {
    as: QuestionIcon,
    boxSize: 5,
    color: "blue.500"
  }), ___EmotionJSX(Box, {
    ml: 3
  }, children));
};
;// CONCATENATED MODULE: ./src/features/common/ErrorMessageText.tsx
function _EMOTION_STRINGIFIED_CSS_ERROR__() { return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop)."; }





// const styles = {
//   color: "red"
// }
//
// becomes:
const styles =  true ? {
  name: "5gmj0c",
  styles: "--tw-text-opacity:1;color:rgba(220, 38, 38, var(--tw-text-opacity)); font-weight:bold"
} : 0; // = tailwind classes + SASS

const ErrorMessageText = ({
  children
}) => {
  return (0,external_emotion_react_.jsx)(react_.Text, {
    css: styles
  }, children);
};
;// CONCATENATED MODULE: ./src/features/common/Grid.tsx
function Grid_extends() { Grid_extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return Grid_extends.apply(this, arguments); }

function Grid_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = Grid_objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function Grid_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }




const Grid = (_ref) => {
  let {
    children,
    light,
    dark
  } = _ref,
      props = Grid_objectWithoutProperties(_ref, ["children", "light", "dark"]);

  const styles = (0,react_.useColorModeValue)(light, dark);
  return (0,external_emotion_react_.jsx)(react_.Grid, Grid_extends({}, styles, props), children);
};
;// CONCATENATED MODULE: ./src/features/common/GridItem.tsx
function GridItem_extends() { GridItem_extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return GridItem_extends.apply(this, arguments); }

function GridItem_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = GridItem_objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function GridItem_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }




const GridItem = (_ref) => {
  let {
    children,
    light,
    dark
  } = _ref,
      props = GridItem_objectWithoutProperties(_ref, ["children", "light", "dark"]);

  const styles = (0,react_.useColorModeValue)(light, dark);
  return (0,external_emotion_react_.jsx)(react_.GridItem, GridItem_extends({}, styles, props), children);
};
;// CONCATENATED MODULE: ./src/features/common/GridHeader.tsx
function GridHeader_extends() { GridHeader_extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return GridHeader_extends.apply(this, arguments); }

function GridHeader_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = GridHeader_objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function GridHeader_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }




const GridHeader = (_ref) => {
  let {
    children,
    light = {
      bg: "orange.300"
    },
    dark = {
      bg: "gray.600"
    },
    pl = 3
  } = _ref,
      props = GridHeader_objectWithoutProperties(_ref, ["children", "light", "dark", "pl"]);

  return (0,external_emotion_react_.jsx)(GridItem, GridHeader_extends({
    light: light,
    dark: dark,
    pl: pl
  }, props), children);
};
;// CONCATENATED MODULE: ./src/features/common/IconFooter.tsx


const IconFooter = () => {
  return (0,external_emotion_react_.jsx)(react_.Box, {
    my: 3,
    borderBottomRadius: "lg",
    align: "center"
  }, (0,external_emotion_react_.jsx)(react_.Image, {
    src: "/favicon-32x32.png"
  }));
};
;// CONCATENATED MODULE: ./src/features/common/Spacer.tsx
function Spacer_extends() { Spacer_extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return Spacer_extends.apply(this, arguments); }

function Spacer_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = Spacer_objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function Spacer_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }




const Spacer = (_ref) => {
  let {
    light = {
      borderColor: "black"
    },
    dark = {
      borderColor: "white"
    }
  } = _ref,
      props = Spacer_objectWithoutProperties(_ref, ["light", "dark"]);

  const styles = (0,react_.useColorModeValue)(light, dark);
  return (0,external_emotion_react_.jsx)(react_.Spacer, Spacer_extends({}, styles, props));
};
;// CONCATENATED MODULE: ./src/features/common/index.tsx























/***/ }),

/***/ 4878:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "q": function() { return /* binding */ withGoogleApi; }
});

// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(9297);
var external_react_default = /*#__PURE__*/__webpack_require__.n(external_react_);
;// CONCATENATED MODULE: ./src/features/map/ScriptCache.tsx
//@ts-nocheck
let counter = 0;
const ScriptCache_window = typeof global === "object" && global.global === global && global || typeof self === "object" && self.self === self && self || undefined;
let scriptMap =  false || new Map();
const ScriptCache = function (global) {
  global._scriptMap = global._scriptMap || scriptMap;
  return function ScriptCache(scripts) {
    const Cache = {};

    Cache._onLoad = function (key) {
      return cb => {
        let registered = true;

        function unregister() {
          registered = false;
        }

        let stored = scriptMap.get(key);

        if (stored) {
          stored.promise.then(() => {
            if (registered) {
              stored.error ? cb(stored.error) : cb(null, stored);
            }

            return stored;
          }).catch(error => cb(error));
        } else {// TODO:
        }

        return unregister;
      };
    };

    Cache._scriptTag = (key, src) => {
      if (!scriptMap.has(key)) {
        // Server side rendering environments don't always have access to the `document` global.
        // In these cases, we're not going to be able to return a script tag, so just return null.
        if (typeof document === "undefined") return null;
        let tag = document.createElement("script");
        let promise = new Promise((resolve, reject) => {
          let body = document.getElementsByTagName("body")[0];
          tag.type = "text/javascript";
          tag.async = false; // Load in order

          const cbName = `loaderCB${counter++}${Date.now()}`;
          let cb;

          let handleResult = state => {
            return evt => {
              let stored = scriptMap.get(key);

              if (state === "loaded") {
                stored.resolved = true;
                resolve(src); // stored.handlers.forEach(h => h.call(null, stored))
                // stored.handlers = []
              } else if (state === "error") {
                stored.errored = true; // stored.handlers.forEach(h => h.call(null, stored))
                // stored.handlers = [];

                reject(evt);
              }

              stored.loaded = true;
              cleanup();
            };
          };

          const cleanup = () => {
            if (global[cbName] && typeof global[cbName] === "function") {
              global[cbName] = null;
              delete global[cbName];
            }
          };

          tag.onload = handleResult("loaded");
          tag.onerror = handleResult("error");

          tag.onreadystatechange = () => {
            handleResult(tag.readyState);
          }; // Pick off callback, if there is one


          if (src.match(/callback=CALLBACK_NAME/)) {
            src = src.replace(/(callback=)[^\&]+/, `$1${cbName}`);
            cb = ScriptCache_window[cbName] = tag.onload;
          } else {
            tag.addEventListener("load", tag.onload);
          }

          tag.addEventListener("error", tag.onerror);
          tag.src = src;
          body.appendChild(tag);
          return tag;
        });
        let initialState = {
          loaded: false,
          error: false,
          promise,
          tag
        };
        scriptMap.set(key, initialState);
      }

      return scriptMap.get(key).tag;
    }; // let scriptTags = document.querySelectorAll('script')
    //
    // NodeList.prototype.filter = Array.prototype.filter;
    // NodeList.prototype.map = Array.prototype.map;
    // const initialScripts = scriptTags
    //   .filter(s => !!s.src)
    //   .map(s => s.src.split('?')[0])
    //   .reduce((memo, script) => {
    //     memo[script] = script;
    //     return memo;
    //   }, {});


    Object.keys(scripts).forEach(function (key) {
      const script = scripts[key];
      const tag = ScriptCache_window._scriptMap.has(key) ? ScriptCache_window._scriptMap.get(key).tag : Cache._scriptTag(key, script);
      Cache[key] = {
        tag: tag,
        onLoad: Cache._onLoad(key)
      };
    });
    return Cache;
  };
}(ScriptCache_window);
/* harmony default export */ var map_ScriptCache = ((/* unused pure expression or super */ null && (ScriptCache)));
;// CONCATENATED MODULE: ./src/features/map/GoogleApi.tsx
//@ts-nocheck
const GoogleApi = function (opts) {
  opts = opts || {};

  if (!opts.hasOwnProperty("apiKey")) {
    throw new Error("You must pass an apiKey to use GoogleApi");
  }

  const apiKey = opts.apiKey;
  const libraries = opts.libraries || ["places"];
  const client = opts.client;
  const URL = opts.url || "https://maps.googleapis.com/maps/api/js";
  const googleVersion = opts.version || "3.31";
  let script = null;
  let google =  false || null;
  let loading = false;
  let channel = null;
  let language = opts.language;
  let region = opts.region || null;
  let onLoadEvents = [];

  const url = () => {
    let url = URL;
    let params = {
      key: apiKey,
      callback: "CALLBACK_NAME",
      libraries: libraries.join(","),
      client: client,
      v: googleVersion,
      channel: channel,
      language: language,
      region: region,
      onerror: "ERROR_FUNCTION"
    };
    let paramStr = Object.keys(params).filter(k => !!params[k]).map(k => `${k}=${params[k]}`).join("&");
    return `${url}?${paramStr}`;
  };

  return url();
};
/* harmony default export */ var map_GoogleApi = (GoogleApi);
// EXTERNAL MODULE: external "@emotion/react"
var react_ = __webpack_require__(7381);
;// CONCATENATED MODULE: ./src/features/map/GoogleApiWrapper.tsx
//@ts-nocheck




const defaultMapConfig = {};

const serialize = obj => JSON.stringify(obj);

const isSame = (obj1, obj2) => obj1 === obj2 || serialize(obj1) === serialize(obj2);

const defaultCreateCache = options => {
  options = options || {};
  const apiKey = options.apiKey;
  const libraries = options.libraries || ["places"];
  const version = options.version || "3";
  const language = options.language || "en";
  const url = options.url;
  const client = options.client;
  const region = options.region;
  return ScriptCache({
    google: map_GoogleApi({
      apiKey: apiKey,
      language: language,
      libraries: libraries,
      version: version,
      url: url,
      client: client,
      region: region
    })
  });
};

const withGoogleApi = input => WrappedComponent => {
  return class Wrapper extends (external_react_default()).Component {
    constructor(props, context) {
      super(props, context); // Build options from input

      const options = typeof input === "function" ? input(props) : input; // Initialize required Google scripts and other configured options

      this.initialize(options);
      this.state = {
        loaded: false,
        map: null,
        google: null,
        options: options
      };
      this.mapRef = /*#__PURE__*/external_react_default().createRef();
    }

    UNSAFE_componentWillReceiveProps(props) {
      // Do not update input if it's not dynamic
      if (typeof input !== "function") {
        return;
      } // Get options to compare


      const prevOptions = this.state.options;
      const options = typeof input === "function" ? input(props) : input; // Ignore when options are not changed

      if (isSame(options, prevOptions)) {
        return;
      } // Initialize with new options


      this.initialize(options); // Save new options in component state,
      // and remove information about previous API handlers

      this.setState({
        options: options,
        loaded: false,
        google: null
      });
    }

    componentWillUnmount() {
      if (this.unregisterLoadHandler) {
        this.unregisterLoadHandler();
      }
    }

    initialize(options) {
      // Avoid race condition: remove previous 'load' listener
      if (this.unregisterLoadHandler) {
        this.unregisterLoadHandler();
        this.unregisterLoadHandler = null;
      } // Load cache factory


      const createCache = options.createCache || defaultCreateCache; // Build script

      this.scriptCache = createCache(options);
      this.unregisterLoadHandler = this.scriptCache.google.onLoad(this.onLoad.bind(this));
    }

    onLoad(err, tag) {
      this._gapi = window.google;
      this.setState({
        loaded: true,
        google: this._gapi
      });
    }

    render() {
      const props = Object.assign({}, this.props, {
        loaded: this.state.loaded,
        google: window.google
      });
      return (0,react_.jsx)(WrappedComponent, props); // return (
      //   <div>
      //     <WrappedComponent {...props} />
      //     <div ref={this.mapRef} />
      //   </div>
      // );
    }

  };
};

/***/ }),

/***/ 9281:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "GN": function() { return /* binding */ emailR; },
/* harmony export */   "SO": function() { return /* binding */ createEventEmailNotif; },
/* harmony export */   "rM": function() { return /* binding */ sendEventEmailNotifToOrgFollowers; },
/* harmony export */   "Vv": function() { return /* binding */ sendTopicToFollowers; },
/* harmony export */   "Wu": function() { return /* binding */ sendMessageToTopicFollowers; },
/* harmony export */   "AE": function() { return /* binding */ sendToAdmin; }
/* harmony export */ });
/* unused harmony export sendEventToOrgFollowers */
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2376);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(3879);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(date_fns__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var database__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9163);
/* harmony import */ var features_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1109);
/* harmony import */ var models_Subscription__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(8716);
/* harmony import */ var _api__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(6837);
/* harmony import */ var _string__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(7535);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }








const emailR = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i; // Some simple styling options

const backgroundColor = "#f9f9f9";
const textColor = "#444444";
const mainBackgroundColor = "#ffffff";
const descriptionBackgroundColor = "#f9f9f9";
const buttonBackgroundColor = "#346df1";
const buttonBorderColor = "#346df1";
const buttonTextColor = "#ffffff";
const createEventEmailNotif = ({
  email,
  event,
  org,
  subscription,
  isPreview
}) => {
  var _event$eventDescripti;

  const orgUrl = `${"https://aucourant.de"}/${org.orgUrl}`;
  const eventUrl = `${"https://aucourant.de"}/${event.eventUrl}`;
  const eventDescription = (_event$eventDescripti = event.eventDescription) === null || _event$eventDescripti === void 0 ? void 0 : _event$eventDescripti.replace(/<p><br><\/p>/g, "");
  return {
    from: process.env.EMAIL_FROM,
    to: `<${email}>`,
    subject: `${org.orgName} vous invite à un nouvel événement : ${event.eventName}`,
    html: `
      <body style="background: ${backgroundColor};">
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
            <strong>${"aucourant.de"}</strong>
          </td>
        </tr>
      </table>

      <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px;">
        <tr>
          <td align="center" style="padding: 0px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
            <h2>
            <a href="${orgUrl}">${org.orgName}</a> vous invite à un nouvel événement : ${event.eventName}
            </h2>

            <h3>
            ${ true ? (0,features_common__WEBPACK_IMPORTED_MODULE_3__/* .toDateRange */ .fL)((0,date_fns__WEBPACK_IMPORTED_MODULE_1__.addHours)((0,date_fns__WEBPACK_IMPORTED_MODULE_1__.parseISO)(event.eventMinDate), 2), (0,date_fns__WEBPACK_IMPORTED_MODULE_1__.addHours)((0,date_fns__WEBPACK_IMPORTED_MODULE_1__.parseISO)(event.eventMaxDate), 2)) : 0}
            </h3>

            <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${descriptionBackgroundColor}; border-radius: 10px;">
              <tr>
                <td>
                  ${eventDescription}
                </td>
              </tr>
            </table>

            <p>Rendez-vous sur <a href="${eventUrl}?email=${email}">la page de l'événement</a> pour indiquer si vous souhaitez y participer.</p>
          </td>
        </tr>
      </table>

      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tr>
          <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
            ${isPreview ? `
                  <a href="${"https://aucourant.de"}/unsubscribe/${org.orgUrl}?subscriptionId=${subscription ? subscription._id : "foo"}">Se désabonner de ${org.orgName}</a>
                  ` : subscription ? `
                  <a href="${"https://aucourant.de"}/unsubscribe/${org.orgUrl}?subscriptionId=${subscription._id}">Se désabonner de ${org.orgName}</a>
                  ` : ""}
          </td>
        </tr>
      </table>
    </body>
    `
  };
};
const sendEventToOrgFollowers = async (event, orgIds, transport) => {
  // console.log("sending notifications to event", event);
  const emailList = [];

  if (!event.isApproved) {
    throw new Error("L'événément doit être approuvé");
  }

  if (!Array.isArray(event.eventOrgs)) {
    throw new Error("L'événement est organisé par aucune organisation");
  }

  if (!Array.isArray(orgIds) || !orgIds.length) {
    throw new Error("Aucune organisation spécifiée");
  }

  for (const org of event.eventOrgs) {
    const orgId = typeof org === "object" ? org._id : org;

    for (const notifOrgId of orgIds) {
      if (!equals(notifOrgId, orgId)) continue; //console.log("notifying followers from org", org);

      for (const orgSubscription of org.orgSubscriptions) {
        const subscription = await models.Subscription.findOne({
          _id: orgSubscription
        }).populate("user");

        if (!subscription) {
          // shouldn't happen because when user remove subscription to org it is also removed from org.orgSubscriptions
          continue;
        }

        for (const {
          orgId,
          type,
          eventCategories = []
        } of subscription.orgs) {
          if (!equals(notifOrgId, orgId) || type !== SubscriptionTypes.FOLLOWER) continue;
          const email = typeof subscription.user === "object" ? subscription.user.email : subscription.email;

          if (subscription.phone) {// todo
          } else if (email) {
            if (Array.isArray(event.eventNotified) && event.eventNotified.find(m => m.email === email)) continue;
            const user = await models.User.findOne({
              email
            });
            const eventCategoriesEmail = eventCategories.filter(({
              emailNotif
            }) => emailNotif);
            const eventCategoriesPush = eventCategories.filter(({
              pushNotif
            }) => pushNotif);

            if (user && user.userSubscription && (eventCategoriesPush.length === 0 || !!eventCategoriesPush.find(eventCategory => eventCategory.catId === event.eventCategory && eventCategory.pushNotif))) {
              await api.post("notification", {
                subscription: user.userSubscription,
                notification: {
                  title: `Invitation à un événement`,
                  message: event.eventName,
                  url: `${"https://aucourant.de"}/${event.eventUrl}`
                }
              });
            }

            if (eventCategoriesEmail.length > 0 && !eventCategoriesEmail.find(eventCategory => eventCategory.catId === event.eventCategory && eventCategory.emailNotif)) continue;
            const mail = createEventEmailNotif({
              email,
              event,
              org,
              subscription
            });

            if (true) {
              try {
                const res = await axios.post("https://api.aucourant.de" + "/mail", {
                  eventId: event._id,
                  mail
                });
                console.log(`sent event email notif to subscriber ${res.data.email}`, mail);
              } catch (error) {
                console.log(`error sending mail to ${email}`);
                console.error(error);
                continue;
              }
            } else {}

            emailList.push(email);
          }
        }
      }
    }
  }

  return emailList;
};
const sendEventEmailNotifToOrgFollowers = async (event, orgIds, transport) => {
  // console.log("sending notifications to event", event);
  const emailList = [];

  if (!event.isApproved) {
    throw new Error("L'événément doit être approuvé");
  }

  if (!Array.isArray(event.eventOrgs)) {
    throw new Error("L'événement est organisé par aucune organisation");
  }

  if (!Array.isArray(orgIds) || !orgIds.length) {
    throw new Error("Aucune organisation spécifiée");
  }

  let mails = [];

  for (const org of event.eventOrgs) {
    const orgId = typeof org === "object" ? org._id : org;

    for (const notifOrgId of orgIds) {
      if (!(0,_string__WEBPACK_IMPORTED_MODULE_6__/* .equals */ .fS)(notifOrgId, orgId)) continue; //console.log("notifying followers from org", org);

      for (const orgSubscription of org.orgSubscriptions) {
        const subscription = await database__WEBPACK_IMPORTED_MODULE_2__/* .models.Subscription.findOne */ .Cq.Subscription.findOne({
          _id: orgSubscription
        }).populate("user");

        if (!subscription) {
          // shouldn't happen because when user remove subscription to org it is also removed from org.orgSubscriptions
          continue;
        }

        for (const {
          orgId,
          type,
          eventCategories = []
        } of subscription.orgs) {
          if (!(0,_string__WEBPACK_IMPORTED_MODULE_6__/* .equals */ .fS)(notifOrgId, orgId) || type !== models_Subscription__WEBPACK_IMPORTED_MODULE_4__/* .SubscriptionTypes.FOLLOWER */ .NY.FOLLOWER) continue;
          const email = typeof subscription.user === "object" ? subscription.user.email : subscription.email;

          if (subscription.phone) {// todo
          } else if (email) {
            if (Array.isArray(event.eventNotified) && event.eventNotified.find(m => m.email === email)) continue; // const user = await models.User.findOne({ email });
            // const eventCategoriesEmail = eventCategories.filter(
            //   ({ emailNotif }) => emailNotif
            // );
            // const eventCategoriesPush = eventCategories.filter(
            //   ({ pushNotif }) => pushNotif
            // );
            // if (
            //   user &&
            //   user.userSubscription &&
            //   (eventCategoriesPush.length === 0 ||
            //     !!eventCategoriesPush.find(
            //       (eventCategory) =>
            //         eventCategory.catId === event.eventCategory &&
            //         eventCategory.pushNotif
            //     ))
            // ) {
            //   await api.post("notification", {
            //     subscription: user.userSubscription,
            //     notification: {
            //       title: `Invitation à un événement`,
            //       message: event.eventName,
            //       url: `${process.env.NEXT_PUBLIC_URL}/${event.eventUrl}`
            //     }
            //   });
            // }
            // if (
            //   eventCategoriesEmail.length > 0 &&
            //   !eventCategoriesEmail.find(
            //     (eventCategory) =>
            //       eventCategory.catId === event.eventCategory &&
            //       eventCategory.emailNotif
            //   )
            // )
            //   continue;

            const mail = createEventEmailNotif({
              email,
              event,
              org,
              subscription
            });
            mails.push({
              email,
              mail
            });
            emailList.push(email);
          }
        }
      }

      try {
        await axios__WEBPACK_IMPORTED_MODULE_0___default().post("https://api.aucourant.de" + "/mails", {
          eventId: event._id,
          mails
        });
      } catch (error) {
        console.error(error);
        continue;
      }
    }
  }

  return emailList;
};
const sendTopicToFollowers = async ({
  event,
  org,
  subscriptions,
  topic,
  transport
}) => {
  const emailList = [];
  if (!event && !org) return emailList;

  if (!subscriptions.length) {
    console.log(`nobody subscribed to this ${org ? "org" : "event"}`);
    return emailList;
  }

  const entityName = event ? event.eventName : org === null || org === void 0 ? void 0 : org.orgName;
  const entityUrl = event ? event.eventUrl : org === null || org === void 0 ? void 0 : org.orgUrl;
  const subject = `Nouvelle discussion : ${topic.topicName}`;
  const type = event ? "l'événement" : "l'organisation";
  const url = entityName === "aucourant" ? `${"https://aucourant.de"}/forum` : `${"https://aucourant.de"}/${entityUrl}`;
  let mail = {
    from: process.env.EMAIL_FROM,
    subject
  };

  for (const subscription of subscriptions) {
    var _topic$topicNotified;

    const email = typeof subscription.user === "object" ? subscription.user.email : subscription.email;
    if (!email) continue;
    if ((_topic$topicNotified = topic.topicNotified) !== null && _topic$topicNotified !== void 0 && _topic$topicNotified.find(({
      email: e
    }) => e === email)) continue;
    mail.to = `<${email}>`;
    mail.html = `
    <h1>${subject}</h1><p>Rendez-vous sur la page de ${type} <a href="${url}">${entityName}</a> pour lire la discussion.</p>
    <a href="${"https://aucourant.de"}/unsubscribe/${entityUrl}?subscriptionId=${subscription._id}">Se désabonner de ${type} ${entityName}</a>
    `;
    if (true) await transport.sendMail(mail);else {}
    emailList.push(email);
  }

  return emailList;
};
const sendMessageToTopicFollowers = async ({
  event,
  org,
  subscriptions,
  topic,
  transport
}) => {
  if (!event && !org) return;
  const entityName = event ? event.eventName : org === null || org === void 0 ? void 0 : org.orgName;
  const entityUrl = event ? event.eventUrl : org === null || org === void 0 ? void 0 : org.orgUrl;
  const subject = `Nouveau commentaire sur la discussion : ${topic.topicName}`;
  const type = event ? "l'événement" : "l'organisation";
  const url = entityName === "aucourant" ? `${"https://aucourant.de"}/forum` : `${"https://aucourant.de"}/${entityUrl}`;

  for (const subscription of subscriptions) {
    let html = `<h1>${subject}</h1><p>Rendez-vous sur la page de ${type} <a href="${url}">${entityName}</a> pour lire la discussion.</p>
    <p><a href="${"https://aucourant.de"}/unsubscribe/${entityUrl}?subscriptionId=${subscription._id}&topicId=${topic._id}">Se désabonner de cette discussion</a></p>
    <a href="${"https://aucourant.de"}/unsubscribe/${entityUrl}?subscriptionId=${subscription._id}">Se désabonner de ${entityName}</a>
    `;

    if (entityName === "aucourant") {
      html = `<h1>${subject}</h1><p>Rendez-vous sur le forum de <a href="${url}">${"aucourant.de"}</a> pour lire la discussion.</p>`;
    }

    const email = typeof subscription.user === "object" ? subscription.user.email : subscription.email;
    if (!email) continue;
    const mail = {
      from: process.env.EMAIL_FROM,
      to: `<${email}>`,
      subject,
      html
    };
    if (true) await transport.sendMail(mail);else {}
  }
};
const sendToAdmin = async ({
  event,
  project,
  transport
}) => {
  if (!event && !project) return;
  let mail = {
    from: process.env.EMAIL_FROM,
    to: process.env.EMAIL_ADMIN
  };

  if (event) {
    if (event.isApproved) return;
    mail = _objectSpread(_objectSpread({}, mail), {}, {
      subject: `Un événement attend votre approbation : ${event.eventName}`,
      html: `
        <h1>Nouvel événement : ${event.eventName}</h1>
        <p>Rendez-vous sur <a href="${"https://aucourant.de"}/${event.eventUrl}">${"aucourant.de"}/${event.eventUrl}</a> pour l'approuver.</p>
      `
    });
  } else if (project) {
    mail = _objectSpread(_objectSpread({}, mail), {}, {
      subject: `Un projet attend votre approbation : ${project.projectName}`,
      html: `
        <h1>Nouveau projet : ${project.projectName}</h1>
        <p>Rendez-vous sur <a href="${"https://aucourant.de"}/${project.projectOrgs[0].orgName}">${"aucourant.de"}/${project.projectOrgs[0].orgName}</a> pour l'approuver.</p>
      `
    });
  }

  if (true) {
    await transport.sendMail(mail);
  } else {}
};

/***/ }),

/***/ 6815:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var quill__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3149);
/* harmony import */ var quill__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(quill__WEBPACK_IMPORTED_MODULE_0__);

const InlineBlot = quill__WEBPACK_IMPORTED_MODULE_0___default().import("blots/block");

class LoadingImage extends InlineBlot {
  static create(src) {
    const node = super.create(src);
    if (src === true) return node;
    const image = document.createElement("img");
    image.setAttribute("src", src);
    node.appendChild(image);
    return node;
  }

  deleteAt(index, length) {
    super.deleteAt(index, length);
    this.cache = {};
  }

  static value(domNode) {
    const {
      src,
      custom
    } = domNode.dataset;
    return {
      src,
      custom
    };
  }

}

LoadingImage.blotName = "imageBlot";
LoadingImage.className = "image-uploading";
LoadingImage.tagName = "span";
quill__WEBPACK_IMPORTED_MODULE_0___default().register({
  "formats/imageBlot": LoadingImage
});

class ImageUploader {
  constructor(quill, options) {
    this.quill = quill;
    this.options = options;
    this.range = null;
    if (typeof this.options.upload !== "function") console.warn("[Missing config] upload function that returns a promise is required");
    var toolbar = this.quill.getModule("toolbar");
    toolbar.addHandler("image", this.selectLocalImage.bind(this));
    this.handleDrop = this.handleDrop.bind(this);
    this.handlePaste = this.handlePaste.bind(this);
    this.quill.root.addEventListener("drop", this.handleDrop, false);
    this.quill.root.addEventListener("paste", this.handlePaste, false);
  }

  selectLocalImage() {
    this.range = this.quill.getSelection();
    this.fileHolder = document.createElement("input");
    this.fileHolder.setAttribute("type", "file");
    this.fileHolder.setAttribute("accept", "image/*");
    this.fileHolder.setAttribute("style", "visibility:hidden");
    this.fileHolder.onchange = this.fileChanged.bind(this);
    document.body.appendChild(this.fileHolder);
    this.fileHolder.click();
    window.requestAnimationFrame(() => {
      document.body.removeChild(this.fileHolder);
    });
  }

  handleDrop(evt) {
    evt.stopPropagation();
    evt.preventDefault();

    if (evt.dataTransfer && evt.dataTransfer.files && evt.dataTransfer.files.length) {
      if (document.caretRangeFromPoint) {
        const selection = document.getSelection();
        const range = document.caretRangeFromPoint(evt.clientX, evt.clientY);

        if (selection && range) {
          selection.setBaseAndExtent(range.startContainer, range.startOffset, range.startContainer, range.startOffset);
        }
      } else {
        const selection = document.getSelection();
        const range = document.caretPositionFromPoint(evt.clientX, evt.clientY);

        if (selection && range) {
          selection.setBaseAndExtent(range.offsetNode, range.offset, range.offsetNode, range.offset);
        }
      }

      this.range = this.quill.getSelection();
      let file = evt.dataTransfer.files[0];
      setTimeout(() => {
        this.range = this.quill.getSelection();
        this.readAndUploadFile(file);
      }, 0);
    }
  }

  handlePaste(evt) {
    let clipboard = evt.clipboardData || window.clipboardData; // IE 11 is .files other browsers are .items

    if (clipboard && (clipboard.items || clipboard.files)) {
      let items = clipboard.items || clipboard.files;
      const IMAGE_MIME_REGEX = /^image\/(jpe?g|gif|png|svg|webp)$/i;

      for (let i = 0; i < items.length; i++) {
        if (IMAGE_MIME_REGEX.test(items[i].type)) {
          let file = items[i].getAsFile ? items[i].getAsFile() : items[i];

          if (file) {
            this.range = this.quill.getSelection();
            evt.preventDefault();
            setTimeout(() => {
              this.range = this.quill.getSelection();
              this.readAndUploadFile(file);
            }, 0);
          }
        }
      }
    }
  }

  readAndUploadFile(file) {
    let isUploadReject = false;
    const fileReader = new FileReader();
    fileReader.addEventListener("load", () => {
      if (!isUploadReject) {
        let base64ImageSrc = fileReader.result;
        this.insertBase64Image(base64ImageSrc);
      }
    }, false);

    if (file) {
      fileReader.readAsDataURL(file);
    }

    this.options.upload(file).then(imageUrl => {
      this.insertToEditor(imageUrl);
    }, error => {
      isUploadReject = true;
      this.removeBase64Image();
      console.warn(error);
    });
  }

  fileChanged() {
    const file = this.fileHolder.files[0];
    this.readAndUploadFile(file);
  }

  insertBase64Image(url) {
    const range = this.range;
    this.quill.insertEmbed(range.index, LoadingImage.blotName, `${url}`, "user");
  }

  insertToEditor(url) {
    const range = this.range; // Delete the placeholder image

    this.quill.deleteText(range.index, 3, "user"); // Insert the server saved image

    this.quill.insertEmbed(range.index, "image", `${url}`, "user");
    range.index++;
    this.quill.setSelection(range, "user");
  }

  removeBase64Image() {
    const range = this.range;
    this.quill.deleteText(range.index, 3, "user");
  }

} //window.ImageUploader = ImageUploader;


/* harmony default export */ __webpack_exports__["Z"] = (ImageUploader);

/***/ }),

/***/ 4453:
/***/ (function() {

/* (ignored) */

/***/ })

};
;