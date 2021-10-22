(function() {
var exports = {};
exports.id = 6369;
exports.ids = [6369];
exports.modules = {

/***/ 8028:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ _name_; },
  "getServerSideProps": function() { return /* binding */ getServerSideProps; }
});

// EXTERNAL MODULE: external "@chakra-ui/react"
var react_ = __webpack_require__(3426);
// EXTERNAL MODULE: external "next/router"
var router_ = __webpack_require__(6731);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(9297);
var external_react_default = /*#__PURE__*/__webpack_require__.n(external_react_);
// EXTERNAL MODULE: external "react-redux"
var external_react_redux_ = __webpack_require__(79);
// EXTERNAL MODULE: external "@react-icons/all-files/io/IoIosPeople.js"
var IoIosPeople_js_ = __webpack_require__(4244);
// EXTERNAL MODULE: external "@react-icons/all-files/fa/FaGlobeEurope.js"
var FaGlobeEurope_js_ = __webpack_require__(8237);
// EXTERNAL MODULE: external "@react-icons/all-files/fa/FaMapMarkedAlt.js"
var FaMapMarkedAlt_js_ = __webpack_require__(1631);
// EXTERNAL MODULE: external "@emotion/react"
var external_emotion_react_ = __webpack_require__(7381);
// EXTERNAL MODULE: external "@chakra-ui/icons"
var icons_ = __webpack_require__(3724);
// EXTERNAL MODULE: ./src/models/Event.ts
var Event = __webpack_require__(7823);
// EXTERNAL MODULE: ./src/hooks/useAuth.ts
var useAuth = __webpack_require__(8238);
// EXTERNAL MODULE: external "date-fns"
var external_date_fns_ = __webpack_require__(3879);
// EXTERNAL MODULE: ./node_modules/date-fns/esm/locale/fr/index.js + 9 modules
var fr = __webpack_require__(678);
// EXTERNAL MODULE: external "isomorphic-dompurify"
var external_isomorphic_dompurify_ = __webpack_require__(3082);
var external_isomorphic_dompurify_default = /*#__PURE__*/__webpack_require__.n(external_isomorphic_dompurify_);
// EXTERNAL MODULE: ./src/features/common/index.tsx + 23 modules
var common = __webpack_require__(1109);
// EXTERNAL MODULE: ./src/features/forum/TopicsList.tsx + 7 modules
var TopicsList = __webpack_require__(1929);
// EXTERNAL MODULE: ./src/features/layout/index.tsx + 13 modules
var layout = __webpack_require__(4497);
// EXTERNAL MODULE: ./src/features/events/eventsApi.ts
var eventsApi = __webpack_require__(9416);
// EXTERNAL MODULE: ./src/features/forms/EventForm.tsx
var EventForm = __webpack_require__(4168);
;// CONCATENATED MODULE: external "react-avatar-editor"
var external_react_avatar_editor_namespaceObject = require("react-avatar-editor");;
var external_react_avatar_editor_default = /*#__PURE__*/__webpack_require__.n(external_react_avatar_editor_namespaceObject);
;// CONCATENATED MODULE: external "pica"
var external_pica_namespaceObject = require("pica");;
var external_pica_default = /*#__PURE__*/__webpack_require__.n(external_pica_namespaceObject);
;// CONCATENATED MODULE: ./src/utils/image.ts

let picaInstance;
function getPicaInstance() {
  if (picaInstance) {
    return picaInstance;
  }

  picaInstance = external_pica_default()();
  return picaInstance;
}
const getBase64 = file => new Promise(function (resolve, reject) {
  let reader = new FileReader();
  reader.readAsDataURL(file);

  reader.onloadend = () => typeof reader.result === "string" ? resolve(reader.result) : reject("invalid type");

  reader.onerror = error => reject(error);
}); // Calculate the next 'scale' to use based on how hard the user scrolled

function calculateScale(scale, delta) {
  const zoomFactor = Math.max(Math.abs(delta) / 1000, 0.1);
  const nextScale = delta > 0 ? scale - zoomFactor : scale + zoomFactor;
  const clamped = Math.min(10, Math.max(1, nextScale));
  return clamped;
}
function getMeta(url, callback) {
  var img = new Image();
  img.src = url;

  img.onload = function () {
    //@ts-expect-error
    callback(this.width, this.height);
  };
}
// EXTERNAL MODULE: external "react-hook-form"
var external_react_hook_form_ = __webpack_require__(2662);
// EXTERNAL MODULE: ./src/utils/form.ts
var utils_form = __webpack_require__(6941);
// EXTERNAL MODULE: external "@hookform/error-message"
var error_message_ = __webpack_require__(5228);
// EXTERNAL MODULE: ./src/features/common/forms/UrlControl.tsx + 1 modules
var UrlControl = __webpack_require__(3808);
;// CONCATENATED MODULE: ./src/features/events/EventConfigBannerPanel.tsx
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }














const EventConfigBannerPanel = (_ref) => {
  var _event$eventBanner, _event$eventBanner2, _event$eventBanner3, _event$eventBanner4;

  let {
    event,
    eventQuery,
    isVisible,
    setIsVisible
  } = _ref,
      props = _objectWithoutProperties(_ref, ["event", "eventQuery", "isVisible", "setIsVisible"]);

  const toast = (0,react_.useToast)({
    position: "top"
  }); //#region local state

  const {
    0: heights,
    1: setHeights
  } = (0,external_react_.useState)([{
    label: "Petit",
    height: 140
  }, {
    label: "Moyen",
    height: 240
  }, {
    label: "Grand",
    height: 340
  }]);
  const {
    0: uploadType,
    1: setUploadType
  } = (0,external_react_.useState)((_event$eventBanner = event.eventBanner) !== null && _event$eventBanner !== void 0 && _event$eventBanner.url ? "url" : "local");
  const {
    0: upImg,
    1: setUpImg
  } = (0,external_react_.useState)(null);
  const setEditorRef = (0,external_react_.useRef)(null); //#endregion
  //#region form state

  const {
    register,
    control,
    handleSubmit,
    setError,
    errors,
    clearErrors,
    getValues,
    setValue,
    watch
  } = (0,external_react_hook_form_.useForm)({
    mode: "onChange"
  });
  const defaultHeight = ((_event$eventBanner2 = event.eventBanner) === null || _event$eventBanner2 === void 0 ? void 0 : _event$eventBanner2.height) || heights[0].height;
  const formHeight = watch("height") || defaultHeight; //#endregion
  //#region event

  const [editEvent, editEventMutation] = (0,eventsApi/* useEditEventMutation */.VA)(); // useEffect(() => {
  //   if (event.eventBanner?.url)
  //     getMeta(event.eventBanner.url, (width, height) => {
  //       console.log("url height", height);
  //       setHeights(heights.filter(({ height: h }) => h < height));
  //     });
  // }, [event.eventBanner?.url]);
  //#endregion

  const onSubmit = async form => {
    console.log("submitted", form);

    try {
      let payload = {};

      if (uploadType === "url") {
        payload = {
          eventBanner: {
            url: form.url,
            height: form.height
          }
        };
      } else {
        var _setEditorRef$current;

        payload = {
          eventBanner: {
            height: form.height,
            mode: form.mode,
            base64: setEditorRef === null || setEditorRef === void 0 ? void 0 : (_setEditorRef$current = setEditorRef.current) === null || _setEditorRef$current === void 0 ? void 0 : _setEditorRef$current.getImageScaledToCanvas().toDataURL()
          }
        };
      }

      await editEvent({
        payload,
        eventUrl: event.eventUrl
      });
      toast({
        title: "L'image de couverture a bien été modifiée !",
        status: "success"
      });
      eventQuery.refetch();
      setIsVisible(_objectSpread(_objectSpread({}, isVisible), {}, {
        banner: false
      }));
    } catch (error) {
      (0,utils_form/* handleError */.S)(error, message => setError("formErrorMessage", {
        type: "manual",
        message
      }));
    }
  };

  return (0,external_emotion_react_.jsx)(common/* Grid */.rj, props, (0,external_emotion_react_.jsx)(common/* Link */.rU, {
    variant: "no-underline",
    onClick: () => setIsVisible(_objectSpread(_objectSpread({}, isVisible), {}, {
      banner: !isVisible.banner,
      logo: false
    }))
  }, (0,external_emotion_react_.jsx)(common/* GridHeader */.Q1, {
    borderTopRadius: "lg",
    borderBottomRadius: !isVisible.banner ? "lg" : undefined,
    alignItems: "center"
  }, (0,external_emotion_react_.jsx)(react_.Flex, {
    flexDirection: "row",
    alignItems: "center"
  }, isVisible.banner ? (0,external_emotion_react_.jsx)(icons_.ChevronDownIcon, null) : (0,external_emotion_react_.jsx)(icons_.ChevronRightIcon, null), (0,external_emotion_react_.jsx)(react_.Heading, {
    size: "sm",
    py: 3
  }, "Changer l'image de couverture")))), isVisible.banner && (0,external_emotion_react_.jsx)(common/* GridItem */.P4, {
    light: {
      bg: "orange.100"
    },
    dark: {
      bg: "gray.500"
    }
  }, (0,external_emotion_react_.jsx)(react_.Box, {
    p: 5
  }, (0,external_emotion_react_.jsx)("form", {
    method: "post",
    onChange: () => {
      clearErrors("formErrorMessage");
    },
    onSubmit: handleSubmit(onSubmit)
  }, (0,external_emotion_react_.jsx)(error_message_.ErrorMessage, {
    errors: errors,
    name: "formErrorMessage",
    render: ({
      message
    }) => (0,external_emotion_react_.jsx)(react_.Alert, {
      status: "error",
      mb: 3
    }, (0,external_emotion_react_.jsx)(react_.AlertIcon, null), (0,external_emotion_react_.jsx)(common/* ErrorMessageText */.h1, null, message))
  }), (0,external_emotion_react_.jsx)(react_.RadioGroup, {
    name: "uploadType",
    mb: 3
  }, (0,external_emotion_react_.jsx)(react_.Stack, {
    spacing: 2
  }, (0,external_emotion_react_.jsx)(react_.Radio, {
    isChecked: uploadType === "local",
    onChange: () => {
      setUploadType("local"); //setUpImg(event.eventBanner?.base64 || null);
    }
  }, "Envoyer une image depuis votre ordinateur"), (0,external_emotion_react_.jsx)(react_.Radio, {
    isChecked: uploadType === "url",
    onChange: () => {
      setUploadType("url"); //setUpImg(event.eventBanner?.url || null);
      //setUpImg(null);
    }
  }, "Utiliser une image en provenance d'une autre adresse"))), (0,external_emotion_react_.jsx)(react_.FormControl, {
    id: "height",
    mb: 3
  }, (0,external_emotion_react_.jsx)(react_.FormLabel, null, "Hauteur"), (0,external_emotion_react_.jsx)(common/* Select */.Ph, {
    name: "height",
    ref: register(),
    defaultValue: defaultHeight
  }, heights.map(({
    label,
    height: h
  }) => (0,external_emotion_react_.jsx)("option", {
    key: "height-" + h,
    value: h
  }, label)))), uploadType === "url" ? (0,external_emotion_react_.jsx)(UrlControl/* UrlControl */.I, {
    name: "url",
    register: register,
    control: control,
    label: "Adresse internet de l'image",
    defaultValue: (_event$eventBanner3 = event.eventBanner) === null || _event$eventBanner3 === void 0 ? void 0 : _event$eventBanner3.url,
    errors: errors,
    isMultiple: false
  }) : (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, (0,external_emotion_react_.jsx)(react_.FormControl, {
    id: "file",
    isInvalid: !!errors["file"],
    mb: 3
  }, (0,external_emotion_react_.jsx)(react_.FormLabel, null, "Image"), (0,external_emotion_react_.jsx)(common/* Input */.II, {
    height: "auto",
    py: 3,
    name: "file",
    type: "file",
    accept: "image/*",
    onChange: async e => {
      if (e.target.files && e.target.files[0]) {
        if (e.target.files[0].size < 1000000) {
          setUpImg(await getBase64(e.target.files[0])); // const reader = new FileReader();
          // reader.addEventListener("load", () =>
          //   setUpImg(reader.result)
          // );
          //reader.readAsDataURL(e.target.files[0]);

          clearErrors("file");
        }
      }
    },
    ref: register({
      validate: file => {
        if (file && file[0] && file[0].size >= 1000000) {
          return "L'image ne doit pas dépasser 1Mo.";
        }

        return true;
      }
    })
  }), (0,external_emotion_react_.jsx)(react_.FormErrorMessage, null, (0,external_emotion_react_.jsx)(error_message_.ErrorMessage, {
    errors: errors,
    name: "file"
  })))), (0,external_emotion_react_.jsx)(react_.Box, {
    mb: 3
  }, uploadType === "url" ? (0,external_emotion_react_.jsx)(react_.Image, {
    src: getValues("url") || ((_event$eventBanner4 = event.eventBanner) === null || _event$eventBanner4 === void 0 ? void 0 : _event$eventBanner4.url)
  }) : upImg && (0,external_emotion_react_.jsx)((external_react_avatar_editor_default()), {
    ref: setEditorRef,
    image: upImg,
    width: 1154,
    height: parseInt(formHeight),
    border: 0,
    color: [255, 255, 255, 0.6] // RGBA
    ,
    scale: 1,
    rotate: 0
  })), (0,external_emotion_react_.jsx)(common/* Button */.zx, {
    colorScheme: "green",
    type: "submit",
    isLoading: editEventMutation.isLoading,
    isDisabled: Object.keys(errors).length > 0
  }, "Valider")))));
};
;// CONCATENATED MODULE: ./src/features/events/EventConfigLogoPanel.tsx
function EventConfigLogoPanel_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function EventConfigLogoPanel_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { EventConfigLogoPanel_ownKeys(Object(source), true).forEach(function (key) { EventConfigLogoPanel_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { EventConfigLogoPanel_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function EventConfigLogoPanel_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function EventConfigLogoPanel_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = EventConfigLogoPanel_objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function EventConfigLogoPanel_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }













const EventConfigLogoPanel = (_ref) => {
  let {
    event,
    eventQuery,
    isVisible,
    setIsVisible
  } = _ref,
      props = EventConfigLogoPanel_objectWithoutProperties(_ref, ["event", "eventQuery", "isVisible", "setIsVisible"]);

  const toast = (0,react_.useToast)({
    position: "top"
  });
  const [editEvent, editEventMutation] = (0,eventsApi/* useEditEventMutation */.VA)();
  const {
    register,
    handleSubmit,
    setError,
    errors,
    clearErrors,
    watch
  } = (0,external_react_hook_form_.useForm)({
    mode: "onChange"
  });
  const height = 220;
  const width = 220;
  const {
    0: upImg,
    1: setUpImg
  } = (0,external_react_.useState)();
  const setEditorRef = (0,external_react_.useRef)(null);

  const onSubmit = async form => {
    console.log("submitted", form);

    try {
      var _setEditorRef$current;

      await editEvent({
        payload: {
          eventLogo: {
            width,
            height,
            base64: setEditorRef === null || setEditorRef === void 0 ? void 0 : (_setEditorRef$current = setEditorRef.current) === null || _setEditorRef$current === void 0 ? void 0 : _setEditorRef$current.getImageScaledToCanvas().toDataURL()
          }
        },
        eventUrl: event.eventUrl
      });
      toast({
        title: `Le logo de l'événement a bien été modifié !`,
        status: "success"
      });
      eventQuery.refetch();
      setIsVisible(EventConfigLogoPanel_objectSpread(EventConfigLogoPanel_objectSpread({}, isVisible), {}, {
        logo: false
      }));
    } catch (error) {
      (0,utils_form/* handleError */.S)(error, message => setError("formErrorMessage", {
        type: "manual",
        message
      }));
    }
  };

  return (0,external_emotion_react_.jsx)(react_.Grid, props, (0,external_emotion_react_.jsx)(common/* Link */.rU, {
    variant: "no-underline",
    onClick: () => setIsVisible(EventConfigLogoPanel_objectSpread(EventConfigLogoPanel_objectSpread({}, isVisible), {}, {
      logo: !isVisible.logo,
      banner: false
    }))
  }, (0,external_emotion_react_.jsx)(common/* GridHeader */.Q1, {
    borderTopRadius: "lg",
    borderBottomRadius: !isVisible.logo ? "lg" : undefined,
    alignItems: "center"
  }, (0,external_emotion_react_.jsx)(react_.Flex, {
    flexDirection: "row",
    alignItems: "center"
  }, isVisible.logo ? (0,external_emotion_react_.jsx)(icons_.ChevronDownIcon, null) : (0,external_emotion_react_.jsx)(icons_.ChevronRightIcon, null), (0,external_emotion_react_.jsx)(react_.Heading, {
    size: "sm",
    py: 3
  }, "Changer le logo")))), isVisible.logo && (0,external_emotion_react_.jsx)(common/* GridItem */.P4, {
    light: {
      bg: "orange.100"
    },
    dark: {
      bg: "gray.500"
    }
  }, (0,external_emotion_react_.jsx)(react_.Box, {
    p: 5
  }, (0,external_emotion_react_.jsx)("form", {
    method: "post",
    onChange: () => {
      clearErrors("formErrorMessage");
    },
    onSubmit: handleSubmit(onSubmit)
  }, (0,external_emotion_react_.jsx)(error_message_.ErrorMessage, {
    errors: errors,
    name: "formErrorMessage",
    render: ({
      message
    }) => (0,external_emotion_react_.jsx)(react_.Alert, {
      status: "error",
      mb: 3
    }, (0,external_emotion_react_.jsx)(react_.AlertIcon, null), (0,external_emotion_react_.jsx)(common/* ErrorMessageText */.h1, null, message))
  }), (0,external_emotion_react_.jsx)(react_.FormControl, {
    id: "file",
    isInvalid: !!errors["file"],
    mb: 3
  }, (0,external_emotion_react_.jsx)(react_.FormLabel, null, "Image"), (0,external_emotion_react_.jsx)(common/* Input */.II, {
    height: "auto",
    py: 3,
    name: "file",
    type: "file",
    accept: "image/*",
    onChange: async e => {
      if (e.target.files && e.target.files[0]) {
        if (e.target.files[0].size < 1000000) {
          setUpImg(await getBase64(e.target.files[0])); // const reader = new FileReader();
          // reader.addEventListener("load", () =>
          //   setUpImg(reader.result)
          // );
          //reader.readAsDataURL(e.target.files[0]);

          clearErrors("file");
        }
      }
    },
    ref: register({
      validate: file => {
        if (file && file[0] && file[0].size >= 1000000) {
          return "L'image ne doit pas dépasser 1Mo.";
        }

        return true;
      }
    })
  }), (0,external_emotion_react_.jsx)(react_.FormErrorMessage, null, (0,external_emotion_react_.jsx)(error_message_.ErrorMessage, {
    errors: errors,
    name: "file"
  }))), upImg && (0,external_emotion_react_.jsx)((external_react_avatar_editor_default()), {
    ref: setEditorRef,
    image: upImg,
    width: width,
    height: height,
    border: 0,
    color: [255, 255, 255, 0.6] // RGBA
    ,
    scale: 1,
    rotate: 0,
    style: {
      marginBottom: "12px"
    }
  }), (0,external_emotion_react_.jsx)(common/* Button */.zx, {
    colorScheme: "green",
    type: "submit",
    isLoading: editEventMutation.isLoading,
    isDisabled: Object.keys(errors).length > 0
  }, "Valider")))));
};
;// CONCATENATED MODULE: ./src/features/events/EventConfigPanel.tsx
function EventConfigPanel_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function EventConfigPanel_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { EventConfigPanel_ownKeys(Object(source), true).forEach(function (key) { EventConfigPanel_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { EventConfigPanel_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function EventConfigPanel_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _EMOTION_STRINGIFIED_CSS_ERROR__() { return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop)."; }













var _ref =  true ? {
  name: "1vkc4pg",
  styles: "&:hover{--tw-bg-opacity:1;background-color:rgba(110, 231, 183, var(--tw-bg-opacity));;}"
} : 0;

const EventConfigPanel = ({
  session,
  event,
  eventQuery,
  isConfig,
  isEdit,
  isVisible,
  setIsConfig,
  setIsEdit,
  setIsVisible
}) => {
  const router = (0,router_.useRouter)();
  const toast = (0,react_.useToast)({
    position: "top"
  });
  const [deleteEvent, deleteQuery] = (0,eventsApi/* useDeleteEventMutation */.gV)();
  const {
    0: isDisabled,
    1: setIsDisabled
  } = (0,external_react_.useState)(true);
  return (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, (0,external_emotion_react_.jsx)(react_.Box, {
    mb: 3
  }, !isEdit && (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, (0,external_emotion_react_.jsx)(common/* Button */.zx, {
    "aria-label": "Modifier",
    leftIcon: (0,external_emotion_react_.jsx)(react_.Icon, {
      as: isEdit ? icons_.ArrowBackIcon : icons_.EditIcon
    }),
    mr: 3,
    onClick: () => {
      setIsEdit(!isEdit);
      setIsVisible(EventConfigPanel_objectSpread(EventConfigPanel_objectSpread({}, isVisible), {}, {
        banner: false
      }));
    },
    css: _ref,
    "data-cy": "eventEdit"
  }, "Modifier"), (0,external_emotion_react_.jsx)(common/* DeleteButton */.m1, {
    isDisabled: isDisabled,
    isLoading: deleteQuery.isLoading,
    header: (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, "Vous \xEAtes sur le point de supprimer l'\xE9v\xE9nement", (0,external_emotion_react_.jsx)(react_.Text, {
      display: "inline",
      color: "red",
      fontWeight: "bold"
    }, ` ${event.eventName}`)),
    body: (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, "Saisissez le nom de l'\xE9v\xE9nement pour confimer sa suppression :", (0,external_emotion_react_.jsx)(common/* Input */.II, {
      autoComplete: "off",
      onChange: e => setIsDisabled(e.target.value !== event.eventName)
    })),
    onClick: async () => {
      try {
        const deletedEvent = await deleteEvent({
          eventUrl: event.eventUrl
        }).unwrap();

        if (deletedEvent) {
          await router.push(`/`);
          toast({
            title: `${deletedEvent.eventName} a bien été supprimé !`,
            status: "success",
            isClosable: true
          });
        }
      } catch (error) {
        toast({
          title: error.data ? error.data.message : error.message,
          status: "error",
          isClosable: true
        });
      }
    }
  }))), isEdit ? (0,external_emotion_react_.jsx)(EventForm/* EventForm */.$, {
    session: session,
    event: event,
    onCancel: () => setIsEdit(false),
    onSubmit: async eventUrl => {
      if (event && eventUrl !== event.eventUrl) {
        await router.push(`/${eventUrl}`, `/${eventUrl}`, {
          shallow: true
        });
      } else {
        eventQuery.refetch();
        setIsEdit(false);
        setIsConfig(false);
      }
    }
  }) : (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, (0,external_emotion_react_.jsx)(EventConfigLogoPanel, {
    event: event,
    eventQuery: eventQuery,
    isVisible: isVisible,
    setIsVisible: setIsVisible,
    mb: 3
  }), (0,external_emotion_react_.jsx)(EventConfigBannerPanel, {
    event: event,
    eventQuery: eventQuery,
    isVisible: isVisible,
    setIsVisible: setIsVisible,
    mb: 3
  })));
};
// EXTERNAL MODULE: ./src/features/users/userSlice.ts
var userSlice = __webpack_require__(3185);
// EXTERNAL MODULE: ./src/models/Subscription.ts
var Subscription = __webpack_require__(8716);
// EXTERNAL MODULE: ./src/store.ts
var store = __webpack_require__(4281);
// EXTERNAL MODULE: ./src/utils/email.ts
var utils_email = __webpack_require__(9281);
// EXTERNAL MODULE: ./src/features/subscriptions/subscriptionsApi.ts
var subscriptionsApi = __webpack_require__(1096);
// EXTERNAL MODULE: ./src/models/Org.ts
var Org = __webpack_require__(9759);
;// CONCATENATED MODULE: ./src/features/subscriptions/SubscriptionEditPopover.tsx
function SubscriptionEditPopover_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = SubscriptionEditPopover_objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function SubscriptionEditPopover_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function SubscriptionEditPopover_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function SubscriptionEditPopover_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { SubscriptionEditPopover_ownKeys(Object(source), true).forEach(function (key) { SubscriptionEditPopover_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { SubscriptionEditPopover_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function SubscriptionEditPopover_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }










const setAllItems = payload => Object.keys(Event/* Category */.WD).reduce((obj, key) => {
  const k = parseInt(key);
  if (k === 0) return obj;
  return SubscriptionEditPopover_objectSpread(SubscriptionEditPopover_objectSpread({}, obj), {}, {
    [k]: payload
  });
}, {});

const SubscriptionEditPopover = (_ref) => {
  let {
    event,
    org,
    notifType,
    subQuery,
    userEmail
  } = _ref,
      props = SubscriptionEditPopover_objectWithoutProperties(_ref, ["event", "org", "notifType", "subQuery", "userEmail"]);

  const toast = (0,react_.useToast)({
    position: "top"
  }); //#region local state

  let followerSubscription = SubscriptionEditPopover_objectSpread({}, props.followerSubscription);

  const {
    0: isLoading,
    1: setIsLoading
  } = (0,external_react_.useState)(false);
  const {
    0: isOpen,
    1: setIsOpen
  } = (0,external_react_.useState)(false);
  const {
    0: isPending,
    1: setIsPending
  } = (0,external_react_.useState)(false); //#endregion
  //#region topics

  const {
    0: topics,
    1: setTopics
  } = (0,external_react_.useState)({});
  const {
    0: isAllTopics,
    1: setIsAllTopics
  } = (0,external_react_.useState)(!followerSubscription.tagTypes || followerSubscription.tagTypes.includes("Topics"));
  (0,external_react_.useEffect)(() => {
    let checkedCount = 0;
    const newTopics = !subQuery.data ? {} : subQuery.data.topics.reduce((obj, {
      topic
    }) => {
      const topicId = topic._id || "";
      let isChecked = false;

      if (org) {
        var _topic$org;

        const orgId = typeof topic.org === "string" ? topic.org : (_topic$org = topic.org) === null || _topic$org === void 0 ? void 0 : _topic$org._id;
        isChecked = orgId === org._id;
      } else if (event) {
        var _topic$event;

        const eventId = typeof topic.event === "string" ? topic.event : (_topic$event = topic.event) === null || _topic$event === void 0 ? void 0 : _topic$event._id;
        isChecked = eventId === event._id;
      }

      if (isChecked) {
        checkedCount++;
        return SubscriptionEditPopover_objectSpread(SubscriptionEditPopover_objectSpread({}, obj), {}, {
          [topicId]: {
            topic,
            checked: true
          }
        });
      }

      return obj;
    }, {});
    setTopics(newTopics);
  }, [subQuery.data]); //#endregion
  //#region org/event follower subscription

  const [addSubscription, addSubscriptionMutation] = (0,subscriptionsApi/* useAddSubscriptionMutation */.h_)();
  const {
    0: isAllEvents,
    1: setIsAllEvents
  } = (0,external_react_.useState)(!followerSubscription.tagTypes || followerSubscription.tagTypes.includes("Events"));
  const {
    0: showEventCategories,
    1: setShowEventCategories
  } = (0,external_react_.useState)(false);
  const {
    0: eventCategories,
    1: setEventCategories
  } = (0,external_react_.useState)({});
  (0,external_react_.useEffect)(() => {
    if (org) {
      const newEventCategories = Object.keys(Event/* Category */.WD).reduce((obj, key) => {
        var _followerSubscription;

        if (!(0,Subscription/* isOrgSubscription */.u1)(followerSubscription)) return obj;
        const k = parseInt(key);
        if (k === 0) return obj;
        const checked = !!((_followerSubscription = followerSubscription.eventCategories) !== null && _followerSubscription !== void 0 && _followerSubscription.find(({
          catId,
          emailNotif,
          pushNotif
        }) => {
          return notifType === "email" ? catId === k && emailNotif : catId === k && pushNotif;
        }));
        return SubscriptionEditPopover_objectSpread(SubscriptionEditPopover_objectSpread({}, obj), {}, {
          [k]: {
            checked
          }
        });
      }, {});
      setEventCategories(newEventCategories);
    }
  }, [props.followerSubscription]); //#endregion

  const onSubmit = async params => {
    if (!isPending) return;

    try {
      setIsLoading(true);
      let payload = {};
      payload.topics = Object.keys(topics).filter(topicId => topics[topicId].checked).map(topicId => {
        const {
          topic
        } = topics[topicId];
        return {
          topic,
          emailNotif: notifType === "email" ? true : undefined,
          pushNotif: notifType === "push" ? true : undefined
        };
      });

      if ("orgId" in followerSubscription) {
        const newOrgSubscription = SubscriptionEditPopover_objectSpread({}, followerSubscription);

        newOrgSubscription.eventCategories = [];

        for (const key of Object.keys(eventCategories)) {
          var _followerSubscription2;

          if (!eventCategories[parseInt(key)].checked) continue;
          const eventCategory = (_followerSubscription2 = followerSubscription.eventCategories) === null || _followerSubscription2 === void 0 ? void 0 : _followerSubscription2.find(({
            catId
          }) => catId === parseInt(key));

          let newEventCategory = SubscriptionEditPopover_objectSpread({}, eventCategory);

          if (eventCategory) {
            if (notifType === "email") {
              newEventCategory.emailNotif = true;
            } else {
              newEventCategory.pushNotif = true;
            }
          } else {
            newEventCategory = {
              catId: parseInt(key),
              emailNotif: notifType === "email" ? true : undefined,
              pushNotif: notifType === "push" ? true : undefined
            };
          }

          newOrgSubscription.eventCategories.push(newEventCategory);
        }

        if (!newOrgSubscription.eventCategories.length) delete newOrgSubscription.eventCategories;
        payload.orgs = [newOrgSubscription];
      }

      await addSubscription({
        payload,
        email: userEmail
      }).unwrap();
      subQuery.refetch();
      if (!(params !== null && params !== void 0 && params.silent)) toast({
        title: `Votre abonnement à ${org ? org.orgName : event.eventName} a bien été modifié !`,
        status: "success"
      });
    } catch (error) {
      console.error(error);
      toast({
        status: "error",
        title: "Nous n'avons pas pu modifier votre abonnement"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (0,external_emotion_react_.jsx)(react_.Popover, {
    isLazy: true,
    isOpen: isOpen,
    onClose: () => {
      onSubmit({
        silent: true
      });
      setIsPending(false);
      setIsOpen(false);
    }
  }, (0,external_emotion_react_.jsx)(react_.PopoverTrigger, null, (0,external_emotion_react_.jsx)(react_.Button, {
    leftIcon: notifType === "email" ? (0,external_emotion_react_.jsx)(icons_.EmailIcon, null) : (0,external_emotion_react_.jsx)(icons_.BellIcon, null),
    colorScheme: "teal",
    onClick: async () => {
      setIsOpen(!isOpen);
    },
    "data-cy": "subscribeToOrg"
  }, notifType === "email" ? "Notifications e-mail" : "Notifications mobile")), (0,external_emotion_react_.jsx)(react_.PopoverContent, null, subQuery.data ? (0,external_emotion_react_.jsx)(react_.PopoverHeader, null, (0,external_emotion_react_.jsx)(react_.Text, null, userEmail), (0,external_emotion_react_.jsx)(react_.Link, {
    href: `/unsubscribe/${org ? org.orgUrl : event === null || event === void 0 ? void 0 : event.eventUrl}?subscriptionId=${subQuery.data._id}`,
    fontSize: "smaller",
    variant: "underline"
  }, "Se d\xE9sabonner de ", org ? (0,Org/* orgTypeFull */.rY)(org.orgType) : "l'événement")) : userEmail && (0,external_emotion_react_.jsx)(react_.PopoverHeader, null, (0,external_emotion_react_.jsx)(react_.Text, null, "Abonnement de ", userEmail)), (0,external_emotion_react_.jsx)(react_.PopoverBody, null, (0,external_emotion_react_.jsx)(react_.FormControl, null, (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, subQuery.isLoading || subQuery.isFetching ? (0,external_emotion_react_.jsx)(react_.Spinner, null) : (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, "Recevoir une notification", " ", notifType === "email" ? "e-mail" : "mobile", " pour :", org && (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, (0,external_emotion_react_.jsx)(react_.Switch, {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    my: 3,
    isChecked: isAllEvents,
    isDisabled: isLoading,
    onChange: async e => {
      try {
        console.log(e.target.checked ? "adding tagType" : "removing tagType");
        setIsLoading(true);
        setIsAllEvents(e.target.checked);
        let payload;

        if ((0,Subscription/* isOrgSubscription */.u1)(followerSubscription)) {
          payload = {
            orgs: [SubscriptionEditPopover_objectSpread(SubscriptionEditPopover_objectSpread({}, followerSubscription), {}, {
              tagTypes: e.target.checked ? (0,Subscription/* addTagType */.Nc)("Events", followerSubscription) : (0,Subscription/* removeTagType */.J8)("Events", followerSubscription)
            })]
          };
          await addSubscription({
            payload,
            email: userEmail
          });
          subQuery.refetch();
        }
      } catch (error) {
        console.error(error);
        toast({
          status: "error",
          title: "Nous n'avons pas pu modifier votre abonnement"
        });
      } finally {
        setIsLoading(false);
      }
    }
  }, "un nouvel \xE9v\xE9nement"), (0,external_emotion_react_.jsx)(react_.Switch, {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    my: 3,
    isChecked: showEventCategories,
    onChange: e => {
      if (!e.target.checked) {
        setEventCategories(setAllItems({
          checked: false
        }));
      }

      setShowEventCategories(!showEventCategories);
    }
  }, "un nouvel \xE9v\xE9nement de la cat\xE9gorie..."), showEventCategories && (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, subQuery.isLoading || subQuery.isFetching ? (0,external_emotion_react_.jsx)(react_.Text, null, "Chargement...") : (0,external_emotion_react_.jsx)(react_.CheckboxGroup, null, (0,external_emotion_react_.jsx)(react_.VStack, {
    alignItems: "flex-start",
    ml: 3
  }, Object.keys(eventCategories).map(key => {
    const k = parseInt(key);
    const cat = Event/* Category */.WD[k];
    return (0,external_emotion_react_.jsx)(react_.Checkbox, {
      key: k,
      isChecked: eventCategories[k].checked,
      onChange: e => {
        var _followerSubscription3;

        if (!(0,Subscription/* isOrgSubscription */.u1)(followerSubscription)) return;
        const wasSubscribedToEventCategory = !!((_followerSubscription3 = followerSubscription.eventCategories) !== null && _followerSubscription3 !== void 0 && _followerSubscription3.find(({
          catId
        }) => catId === k));
        setIsPending(e.target.checked !== wasSubscribedToEventCategory);
        setEventCategories(SubscriptionEditPopover_objectSpread(SubscriptionEditPopover_objectSpread({}, eventCategories), {}, {
          [k]: {
            checked: e.target.checked
          }
        }));
      }
    }, cat.label);
  }))))), (0,external_emotion_react_.jsx)(react_.Switch, {
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    my: 3,
    isChecked: isAllTopics,
    isDisabled: isLoading,
    onChange: async e => {
      try {
        setIsLoading(true);
        setIsAllTopics(e.target.checked);
        let payload;

        if ((0,Subscription/* isOrgSubscription */.u1)(followerSubscription)) {
          payload = {
            orgs: [SubscriptionEditPopover_objectSpread(SubscriptionEditPopover_objectSpread({}, followerSubscription), {}, {
              tagTypes: e.target.checked ? (0,Subscription/* addTagType */.Nc)("Topics", followerSubscription) : (0,Subscription/* removeTagType */.J8)("Topics", followerSubscription)
            })]
          };
        } else {
          payload = {
            events: [SubscriptionEditPopover_objectSpread(SubscriptionEditPopover_objectSpread({}, followerSubscription), {}, {
              tagTypes: e.target.checked ? (0,Subscription/* addTagType */.Nc)("Topics", followerSubscription) : (0,Subscription/* removeTagType */.J8)("Topics", followerSubscription)
            })]
          };
        }

        await addSubscription({
          payload,
          email: userEmail
        });
        subQuery.refetch();
      } catch (error) {
        console.error(error);
        toast({
          status: "error",
          title: "Nous n'avons pas pu modifier votre abonnement"
        });
      } finally {
        setIsLoading(false);
      }
    }
  }, "une nouvelle discussion"), Object.keys(topics).length > 0 && (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, "- une r\xE9ponse \xE0 la discussion...", (0,external_emotion_react_.jsx)(react_.CheckboxGroup, null, (0,external_emotion_react_.jsx)(react_.VStack, {
    alignItems: "flex-start",
    mt: 3,
    ml: 3
  }, Object.keys(topics).map(topicId => {
    const checked = topics[topicId].checked;
    const topic = topics[topicId].topic;
    return (0,external_emotion_react_.jsx)(react_.Checkbox, {
      key: topicId,
      isChecked: checked,
      onChange: e => {
        var _subQuery$data;

        const wasSubscribedToTopic = !!((_subQuery$data = subQuery.data) !== null && _subQuery$data !== void 0 && _subQuery$data.topics.find(({
          topic: {
            _id
          }
        }) => _id === topicId));
        setIsPending(e.target.checked !== wasSubscribedToTopic);
        setTopics(SubscriptionEditPopover_objectSpread(SubscriptionEditPopover_objectSpread({}, topics), {}, {
          [topicId]: SubscriptionEditPopover_objectSpread(SubscriptionEditPopover_objectSpread({}, topics[topicId]), {}, {
            checked: e.target.checked
          })
        }));
      }
    }, topic.topicName);
  })))))))), (0,external_emotion_react_.jsx)(react_.PopoverFooter, null, (0,external_emotion_react_.jsx)(react_.Button, {
    colorScheme: "green",
    isDisabled: isLoading || !isPending,
    onClick: () => onSubmit()
  }, "Valider"))));
}; // if (!followerSubscription) {
//   console.log("no follower subscription => unchecking all");
//   return { ...obj, [k]: { checked: false } };
// }
// if (!("eventCategories" in followerSubscription)) {
//   console.log(
//     "follower subscription => undefined eventCategories => checking all"
//   );
//   return {
//     ...obj,
//     [k]: { checked: true }
//   };
// }
// addEventOrOrgSubscription({
//   form,
//   followerSubscription,
//   eventCategories,
//   notifType,
//   setIsLoading,
//   topics,
//   userEmail,
//   addSubscription
// });
;// CONCATENATED MODULE: ./src/features/subscriptions/SubscriptionPopover.tsx
function SubscriptionPopover_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = SubscriptionPopover_objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function SubscriptionPopover_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }















const SubscriptionPopover = (_ref) => {
  let {
    org,
    event,
    query,
    subQuery,
    notifType = "email"
  } = _ref,
      props = SubscriptionPopover_objectWithoutProperties(_ref, ["org", "event", "query", "subQuery", "notifType"]);

  if (!org && !event) return null;
  const {
    data: session
  } = (0,useAuth/* useSession */.k)();
  const toast = (0,react_.useToast)({
    position: "top"
  });
  const dispatch = (0,store/* useAppDispatch */.TL)();
  const userEmail = (0,external_react_redux_.useSelector)(userSlice/* selectUserEmail */.I_) || (session === null || session === void 0 ? void 0 : session.user.email);
  const [addSubscription, addSubscriptionMutation] = (0,subscriptionsApi/* useAddSubscriptionMutation */.h_)(); //#region subscription

  let followerSubscription = props.followerSubscription; //#endregion
  //#region local state

  const {
    0: isOpen,
    1: setIsOpen
  } = (0,external_react_.useState)(false);
  const {
    0: isLoading,
    1: setIsLoading
  } = (0,external_react_.useState)(false); // const [tooltipProps, setTooltipProps] = useState<{
  //   label?: string;
  //   closeDelay?: number;
  //   openDelay?: number;
  // }>({
  //   label: org
  //     ? "S'abonner pour recevoir une notification quand un événement est publié par cette organisation, ou quand une discussion est ajoutée à cette organisation."
  //     : "S'abonner pour recevoir une notification quand une discussion est ajoutée à cet événement."
  // });
  //#endregion
  //#region form state

  const {
    errors,
    handleSubmit,
    register
  } = (0,external_react_hook_form_.useForm)({
    mode: "onChange"
  }); //#endregion

  const onChange = () => {//clearErrors("email");
  };

  const addFollowerSubscription = async email => {
    setIsLoading(true);
    let payload = {};

    if (org) {
      payload.orgs = [{
        org,
        orgId: org._id,
        type: Subscription/* SubscriptionTypes.FOLLOWER */.NY.FOLLOWER,
        tagTypes: ["Events", "Topics"]
      }];
    } else if (event) {
      payload.events = [{
        event,
        eventId: event._id,
        tagTypes: ["Topics"]
      }];
    }

    try {
      await addSubscription({
        payload,
        email: email || userEmail
      }).unwrap();
      query.refetch();
      subQuery.refetch();
    } catch (error) {
      toast({
        status: "error",
        title: "Nous n'avons pas pu vous abonner"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onStep1Submit = async ({
    email
  }) => {
    if (!email) return;
    setIsLoading(true);
    dispatch((0,userSlice/* setUserEmail */.WG)(email));
    await addFollowerSubscription(email);
    setIsLoading(false); // setIsOpen(false);
    //props.onSubmit && props.onSubmit(true);
  };

  if (!userEmail) return (0,external_emotion_react_.jsx)(react_.Popover, {
    isLazy: true,
    isOpen: isOpen,
    onClose: () => setIsOpen(false)
  }, (0,external_emotion_react_.jsx)(react_.PopoverTrigger, null, (0,external_emotion_react_.jsx)(react_.Button, {
    isLoading: isLoading,
    leftIcon: notifType === "email" ? (0,external_emotion_react_.jsx)(icons_.EmailIcon, null) : (0,external_emotion_react_.jsx)(icons_.BellIcon, null),
    colorScheme: "teal",
    onClick: async () => {
      setIsOpen(!isOpen);
    },
    "data-cy": "subscribeToOrg"
  }, "S'abonner")), (0,external_emotion_react_.jsx)(react_.PopoverContent, {
    ml: 0
  }, (0,external_emotion_react_.jsx)("form", {
    onChange: onChange,
    onSubmit: handleSubmit(onStep1Submit)
  }, (0,external_emotion_react_.jsx)(react_.PopoverBody, null, (0,external_emotion_react_.jsx)(react_.FormControl, {
    id: "email",
    isRequired: true,
    isInvalid: !!errors["email"]
  }, (0,external_emotion_react_.jsx)(react_.InputGroup, null, (0,external_emotion_react_.jsx)(react_.InputLeftElement, {
    pointerEvents: "none",
    children: notifType === "email" ? (0,external_emotion_react_.jsx)(icons_.EmailIcon, null) : (0,external_emotion_react_.jsx)(icons_.BellIcon, null)
  }), (0,external_emotion_react_.jsx)(react_.Input, {
    name: "email",
    placeholder: "Entrez votre adresse e-mail",
    ref: register({
      required: "Veuillez saisir votre adresse e-mail",
      pattern: {
        value: utils_email/* emailR */.GN,
        message: "Adresse e-mail invalide"
      }
    })
  })), (0,external_emotion_react_.jsx)(react_.FormErrorMessage, null, (0,external_emotion_react_.jsx)(error_message_.ErrorMessage, {
    errors: errors,
    name: "email"
  })))), (0,external_emotion_react_.jsx)(react_.PopoverFooter, null, (0,external_emotion_react_.jsx)(react_.Button, {
    colorScheme: "green",
    type: "submit",
    isLoading: isLoading,
    isDisabled: Object.keys(errors).length > 0
  }, "Valider")))));
  return (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, !subQuery.isLoading && !subQuery.isFetching && !followerSubscription ? (0,external_emotion_react_.jsx)(react_.Button, {
    isLoading: isLoading,
    leftIcon: notifType === "email" ? (0,external_emotion_react_.jsx)(icons_.EmailIcon, null) : (0,external_emotion_react_.jsx)(icons_.BellIcon, null),
    colorScheme: "teal",
    onClick: () => addFollowerSubscription(),
    "data-cy": "subscribeToOrg"
  }, "S'abonner") : followerSubscription && (0,external_emotion_react_.jsx)(SubscriptionEditPopover, {
    event: event,
    org: org,
    followerSubscription: followerSubscription,
    notifType: notifType //query={query}
    ,
    subQuery: subQuery,
    userEmail: userEmail
  }));
};
// EXTERNAL MODULE: ./src/features/subscriptions/subscriptionSlice.ts
var subscriptionSlice = __webpack_require__(1430);
;// CONCATENATED MODULE: ./src/features/events/EventAttendingForm.tsx








const EventAttendingForm = ({
  email,
  setEmail,
  event,
  eventQuery
}) => {
  const {
    data: session,
    loading: isSessionLoading
  } = (0,useAuth/* useSession */.k)();
  const toast = (0,react_.useToast)({
    position: "top"
  });
  const [editEvent, editEventMutation] = (0,eventsApi/* useEditEventMutation */.VA)();

  const attend = async () => {
    var _event$eventNotified;

    let promptedEmail = null;

    if (!session && !email) {
      promptedEmail = prompt("Veuillez entrer votre adresse e-mail :");

      if (!promptedEmail || !utils_email/* emailR.test */.GN.test(promptedEmail)) {
        toast({
          status: "error",
          title: "Adresse e-mail invalide"
        });
        return;
      }

      setEmail(promptedEmail);
    }

    const userEmail = promptedEmail || email;

    if ((0,Event/* isAttending */.po)({
      email: userEmail,
      event
    })) {
      toast({
        status: "error",
        title: "Vous participez déjà à cet événement"
      });
      return;
    }

    let isFound = false;
    let eventNotified = (_event$eventNotified = event.eventNotified) === null || _event$eventNotified === void 0 ? void 0 : _event$eventNotified.map(({
      email: e,
      status
    }) => {
      if (e === userEmail) {
        if (status !== Event/* StatusTypes.OK */.Sk.OK) {
          isFound = true;
          return {
            email: e,
            status: Event/* StatusTypes.OK */.Sk.OK
          };
        }
      }

      return {
        email: e,
        status
      };
    });
    if (!isFound && userEmail) eventNotified === null || eventNotified === void 0 ? void 0 : eventNotified.push({
      email: userEmail,
      status: Event/* StatusTypes.OK */.Sk.OK
    });
    await editEvent({
      payload: {
        eventNotified
      },
      eventUrl: event.eventUrl
    });
    eventQuery.refetch();
  };

  const unattend = async () => {
    var _event$eventNotified2;

    let promptedEmail = null;

    if (!session && !email) {
      promptedEmail = prompt("Veuillez entrer votre adresse e-mail :");

      if (!promptedEmail || !utils_email/* emailR.test */.GN.test(promptedEmail)) {
        toast({
          status: "error",
          title: "Adresse e-mail invalide"
        });
        return;
      }

      setEmail(promptedEmail);
    }

    const userEmail = promptedEmail || email;

    if ((0,Event/* isNotAttending */.iu)({
      email: userEmail,
      event
    })) {
      toast({
        status: "error",
        title: "Vous avez déjà indiqué ne pas participer à cet événement"
      });
      return;
    }

    let isNew = true;
    let eventNotified = (_event$eventNotified2 = event.eventNotified) === null || _event$eventNotified2 === void 0 ? void 0 : _event$eventNotified2.map(({
      email: e,
      status
    }) => {
      if (e === userEmail && status !== Event/* StatusTypes.NOK */.Sk.NOK) {
        isNew = false;
        return {
          email: e,
          status: Event/* StatusTypes.NOK */.Sk.NOK
        };
      }

      return {
        email: e,
        status
      };
    });
    if (isNew && userEmail) eventNotified === null || eventNotified === void 0 ? void 0 : eventNotified.push({
      email: userEmail,
      status: Event/* StatusTypes.NOK */.Sk.NOK
    });
    await editEvent({
      payload: {
        eventNotified
      },
      eventUrl: event.eventUrl
    });
    eventQuery.refetch();
  };

  return (0,external_emotion_react_.jsx)(react_.Alert, {
    mb: 3,
    status: (0,Event/* isAttending */.po)({
      email,
      event
    }) ? "success" : (0,Event/* isNotAttending */.iu)({
      email,
      event
    }) ? "error" : "info"
  }, (0,external_emotion_react_.jsx)(react_.AlertIcon, null), (0,Event/* isAttending */.po)({
    email,
    event
  }) ? (0,external_emotion_react_.jsx)(react_.Flex, {
    flexDirection: "column"
  }, (0,external_emotion_react_.jsx)(react_.Text, {
    as: "h3"
  }, "Vous participez \xE0 cet \xE9v\xE9nement."), (0,external_emotion_react_.jsx)(react_.Box, null, (0,external_emotion_react_.jsx)(common/* Button */.zx, {
    colorScheme: "red",
    isLoading: editEventMutation.isLoading || eventQuery.isFetching || eventQuery.isLoading,
    onClick: async () => {
      const ok = confirm("Êtes-vous sûr de ne plus vouloir participer à cet événement ?");

      if (ok) {
        unattend();
      }
    }
  }, "Ne plus participer"))) : (0,Event/* isNotAttending */.iu)({
    email,
    event
  }) ? (0,external_emotion_react_.jsx)(react_.Flex, {
    flexDirection: "column"
  }, (0,external_emotion_react_.jsx)(react_.Text, {
    as: "h3"
  }, "Vous avez refus\xE9 de participer \xE0 cet \xE9v\xE9nement."), (0,external_emotion_react_.jsx)(react_.Box, null, (0,external_emotion_react_.jsx)(common/* Button */.zx, {
    colorScheme: "green",
    mr: 3,
    isLoading: editEventMutation.isLoading || eventQuery.isFetching || eventQuery.isLoading,
    onClick: attend
  }, "Participer"))) : (0,external_emotion_react_.jsx)(react_.Flex, {
    flexDirection: "column"
  }, (0,external_emotion_react_.jsx)(react_.Text, {
    as: "h3"
  }, "Participer \xE0 cet \xE9v\xE9nement ?"), (0,external_emotion_react_.jsx)(react_.Box, {
    mt: 2
  }, editEventMutation.isLoading || eventQuery.isFetching || eventQuery.isLoading ? (0,external_emotion_react_.jsx)(react_.Spinner, null) : (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, (0,external_emotion_react_.jsx)(common/* Button */.zx, {
    colorScheme: "green",
    mr: 3,
    onClick: attend
  }, "Oui"), (0,external_emotion_react_.jsx)(common/* Button */.zx, {
    colorScheme: "red",
    onClick: () => {
      unattend();
    }
  }, "Non")))));
};
// EXTERNAL MODULE: ./src/utils/array.ts
var array = __webpack_require__(1609);
;// CONCATENATED MODULE: ./src/features/common/forms/EventSendForm.tsx
function EventSendForm_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function EventSendForm_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { EventSendForm_ownKeys(Object(source), true).forEach(function (key) { EventSendForm_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { EventSendForm_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function EventSendForm_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function EventSendForm_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = EventSendForm_objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function EventSendForm_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }











const EventSendForm = (_ref) => {
  let {
    event,
    eventQuery,
    session
  } = _ref,
      props = EventSendForm_objectWithoutProperties(_ref, ["event", "eventQuery", "session"]);

  const toast = (0,react_.useToast)({
    position: "top"
  });
  const {
    colorMode
  } = (0,react_.useColorMode)();
  const isDark = colorMode === "dark"; //#region event

  const [postEventNotif, q] = (0,eventsApi/* usePostEventNotifMutation */.SO)();
  const notifiedCount = Array.isArray(event.eventNotified) ? event.eventNotified.length : 0; //#endregion
  //#region local state

  const {
    0: isLoading,
    1: setIsLoading
  } = (0,external_react_.useState)(false); //#endregion
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
    getValues,
    trigger
  } = (0,external_react_hook_form_.useForm)({
    mode: "onChange"
  });

  const onSubmit = async form => {
    console.log("submitted", form);
    setIsLoading(true);

    let payload = EventSendForm_objectSpread(EventSendForm_objectSpread({}, form), {}, {
      orgIds: typeof form.orgIds === "boolean" ? [] : typeof form.orgIds === "string" ? [form.orgIds] : form.orgIds
    });

    try {
      const res = await postEventNotif({
        eventUrl: event.eventUrl,
        payload
      }).unwrap();

      if ((0,array/* hasItems */.t)(res.emailList)) {
        eventQuery.refetch();
        const s = res.emailList.length > 1 ? "s" : "";
        toast({
          title: `Une invitation a été envoyée à ${form.email ? form.email : `${res.emailList.length} abonné${s}`}`,
          status: "success",
          isClosable: true
        });
      } else {
        toast({
          title: "Aucune invitation envoyée",
          status: "warning",
          isClosable: true
        });
      }

      props.onSubmit && props.onSubmit();
    } catch (error) {
      console.error(error);
      toast({
        title: "Une erreur est survenue",
        status: "error",
        isClosable: true
      });
    } finally {
      setIsLoading(false);
    }
  }; //#endregion


  return (0,external_emotion_react_.jsx)("form", {
    onSubmit: handleSubmit(onSubmit)
  }, (0,external_emotion_react_.jsx)(react_.Alert, {
    status: "info",
    mt: 3
  }, (0,external_emotion_react_.jsx)(react_.Flex, {
    flexDirection: "column"
  }, "Pour envoyer un e-mail d'invitation aux abonn\xE9s des organisations de cet \xE9v\xE9n\xE9ment, cochez une ou plusieurs des cases correspondantes :", (0,external_emotion_react_.jsx)(react_.FormControl, {
    isInvalid: !!errors.orgIds
  }, (0,external_emotion_react_.jsx)(react_.CheckboxGroup, null, (0,external_emotion_react_.jsx)(react_.Table, {
    backgroundColor: isDark ? "whiteAlpha.100" : "blackAlpha.100",
    borderWidth: "1px",
    borderRadius: "lg",
    mt: 2
  }, (0,external_emotion_react_.jsx)(react_.Tbody, null, eventQuery.isLoading || eventQuery.isFetching ? (0,external_emotion_react_.jsx)(react_.Tr, null, (0,external_emotion_react_.jsx)(react_.Td, {
    colSpan: 3
  }, (0,external_emotion_react_.jsx)(react_.Spinner, null))) : event.eventOrgs.map(org => {
    const orgFollowersCount = org.orgSubscriptions.map(subscription => {
      return subscription.orgs.filter(orgSubscription => {
        return orgSubscription.orgId === org._id && orgSubscription.type === Subscription/* SubscriptionTypes.FOLLOWER */.NY.FOLLOWER;
      }).length;
    }).reduce((a, b) => a + b, 0);
    const canSendCount = orgFollowersCount - notifiedCount;
    const s = canSendCount > 1 ? "s" : "";
    return (0,external_emotion_react_.jsx)(react_.Tr, {
      key: org.orgName,
      mb: 1
    }, (0,external_emotion_react_.jsx)(react_.Td, null, (0,external_emotion_react_.jsx)(react_.Checkbox, {
      icon: (0,external_emotion_react_.jsx)(icons_.EmailIcon, null),
      name: "orgIds",
      ref: register({
        required: "Veuillez sélectionner une organisation au minimum"
      }),
      value: org._id
    }, org.orgName)), (0,external_emotion_react_.jsx)(react_.Td, {
      textAlign: "right"
    }, (0,external_emotion_react_.jsx)(react_.Tag, {
      fontSize: "smaller"
    }, canSendCount, " abonn\xE9", s, " n'", s ? "ont" : "a", " pas \xE9t\xE9 invit\xE9", s)));
  })))), (0,external_emotion_react_.jsx)(react_.FormErrorMessage, null, (0,external_emotion_react_.jsx)(error_message_.ErrorMessage, {
    errors: errors,
    name: "orgIds"
  }))), (0,external_emotion_react_.jsx)(common/* EmailControl */.sm, {
    name: "email",
    label: "(facultatif) envoyer l'invitation seulement \xE0 l'adresse e-mail de votre choix :",
    control: control,
    register: register,
    errors: errors,
    placeholder: "Envoyer \xE0 cette adresse e-mail uniquement",
    mt: 3,
    isMultiple: false
  }), (0,external_emotion_react_.jsx)(react_.Flex, {
    justifyContent: "flex-end",
    mt: 3
  }, (0,external_emotion_react_.jsx)(react_.Button, {
    colorScheme: "green",
    type: "submit",
    isLoading: isLoading
  }, "Envoyer ", !!getValues("email") ? "une invitation" : "")))));
};
;// CONCATENATED MODULE: external "@react-icons/all-files/fa/FaHome.js"
var FaHome_js_namespaceObject = require("@react-icons/all-files/fa/FaHome.js");;
// EXTERNAL MODULE: external "react-device-detect"
var external_react_device_detect_ = __webpack_require__(2047);
;// CONCATENATED MODULE: ./src/features/events/EventPageTabs.tsx


function EventPageTabs_EMOTION_STRINGIFIED_CSS_ERROR_() { return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop)."; }

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function EventPageTabs_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = EventPageTabs_objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function EventPageTabs_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

//@ts-nocheck






var _ref3 =  true ? {
  name: "1utmw3m",
  styles: "-webkit-overflow-scrolling:touch;-ms-overflow-style:-ms-autohiding-scrollbar"
} : 0;

const EventPageTabs = (_ref) => {
  let {
    isCreator,
    children
  } = _ref,
      props = EventPageTabs_objectWithoutProperties(_ref, ["isCreator", "children"]);

  const StyledTab = (0,react_.chakra)("button", {
    themeKey: "Tabs.Tab"
  });
  const inactiveTabBg = (0,react_.useColorModeValue)("gray.100", "whiteAlpha.300");
  const {
    0: currentTabIndex,
    1: setCurrentTabIndex
  } = (0,external_react_.useState)(0);
  const defaultTabIndex = 0;
  const tabs = [// { name: "Accueil", icon: <FaHome boxSize={6} /> },
  {
    name: "Accueil",
    icon: FaHome_js_namespaceObject.FaHome
  }, {
    name: "Discussions",
    icon: icons_.ChatIcon
  }];
  if (isCreator) tabs.push({
    name: "Invitations",
    icon: icons_.EmailIcon
  });
  const CustomTab = /*#__PURE__*/external_react_default().forwardRef((_ref2, ref) => {
    let {
      icon,
      tabIndex
    } = _ref2,
        props = EventPageTabs_objectWithoutProperties(_ref2, ["icon", "tabIndex"]);

    const tabProps = (0,react_.useTab)(props);
    tabProps.tabIndex = 0;

    if (currentTabIndex === tabIndex) {
      tabProps["aria-selected"] = true;
    }

    const styles = (0,react_.useStyles)();
    return (0,external_emotion_react_.jsx)(StyledTab, _extends({
      display: "flex",
      flex: external_react_device_detect_.isMobile ? "0 0 auto" : "1" //flex="0 0 auto"
      ,
      alignItems: "center",
      justifyContent: "center",
      bg: inactiveTabBg,
      mx: 1,
      _focus: {
        boxShadow: "none"
      }
    }, tabProps, {
      __css: styles.tab
    }), (0,external_emotion_react_.jsx)("span", {
      style: {
        display: "inline-flex",
        flexShrink: "0",
        marginInlineEnd: "0.5rem"
      }
    }, (0,external_emotion_react_.jsx)(react_.Icon, {
      as: icon,
      boxSize: 5,
      verticalAlign: "middle"
    })), tabProps.children);
  });
  return (0,external_emotion_react_.jsx)(react_.Tabs, {
    defaultIndex: defaultTabIndex,
    index: currentTabIndex,
    onChange: index => setCurrentTabIndex(index),
    isFitted: true,
    variant: "solid-rounded",
    borderWidth: 1,
    borderColor: "gray.200",
    borderRadius: "lg",
    isManual: true,
    isLazy: true,
    lazyBehavior: "keepMounted"
  }, (0,external_emotion_react_.jsx)(react_.TabList, {
    as: "nav",
    display: "flex",
    flexWrap: "nowrap",
    alignItems: "center",
    height: "60px",
    overflowX: "auto" //borderBottom="0"
    ,
    mx: 3,
    css: _ref3,
    "aria-hidden": true
  }, tabs.map(({
    name,
    icon
  }, tabIndex) => (0,external_emotion_react_.jsx)(CustomTab, {
    key: `eventTab-${tabIndex}`,
    tabIndex: tabIndex,
    icon: icon,
    "data-cy": `eventTab-${name}`
  }, name))), children);
};
// EXTERNAL MODULE: ./src/features/events/eventSlice.ts
var eventSlice = __webpack_require__(9829);
// EXTERNAL MODULE: ./src/features/events/EventTimeline.tsx
var EventTimeline = __webpack_require__(4263);
;// CONCATENATED MODULE: ./src/features/events/EventPage.tsx




function EventPage_EMOTION_STRINGIFIED_CSS_ERROR_() { return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop)."; }





























let cachedRefetchEvent = false;
let cachedRefetchSubscription = false;
let cachedEmail;

var EventPage_ref =  true ? {
  name: "1qrf9a4",
  styles: "&{grid-template-columns:minmax(425px, 1fr) minmax(170px, 1fr);}@media (max-width: 700px){&{grid-template-columns:1fr!important;}}"
} : 0;

const EventPage = (_ref2) => {
  var _subQuery$data, _event$eventEmail, _event$eventPhone, _event$eventWeb, _event$eventNotified2;

  let props = Object.assign({}, _ref2);
  const router = (0,router_.useRouter)();
  const {
    data,
    loading: isSessionLoading
  } = (0,useAuth/* useSession */.k)();
  const session = data || props.session;
  const toast = (0,react_.useToast)({
    position: "top"
  });
  const {
    colorMode
  } = (0,react_.useColorMode)();
  const isDark = colorMode === "dark";
  const userEmail = (0,external_react_redux_.useSelector)(userSlice/* selectUserEmail */.I_) || (session === null || session === void 0 ? void 0 : session.user.email); //#region event

  const eventQuery = (0,eventsApi/* useGetEventQuery */.Tl)({
    eventUrl: props.event.eventUrl
  }, {
    selectFromResult: query => query
  });
  const event = eventQuery.data || props.event;
  const refetchEvent = (0,external_react_redux_.useSelector)(eventSlice/* selectEventRefetch */.MI);
  (0,external_react_.useEffect)(() => {
    if (refetchEvent !== cachedRefetchEvent) {
      cachedRefetchEvent = refetchEvent;
      console.log("refetching event");
      eventQuery.refetch();
    }
  }, [refetchEvent]);
  (0,external_react_.useEffect)(() => {
    if (userEmail !== cachedEmail) {
      cachedEmail = userEmail;
      console.log("refetching event with new email", userEmail);
      eventQuery.refetch();
    }
  }, [userEmail]);
  (0,external_react_.useEffect)(() => {
    console.log("refetching event with new route", router.asPath);
    eventQuery.refetch();
    setIsEdit(false);
  }, [router.asPath]);
  const eventCreatedByUserName = event.createdBy && typeof event.createdBy === "object" ? event.createdBy.userName || event.createdBy._id : "";
  const eventCreatedByUserId = event.createdBy && typeof event.createdBy === "object" ? event.createdBy._id : "";
  const isCreator = (session === null || session === void 0 ? void 0 : session.user.userId) === eventCreatedByUserId || (session === null || session === void 0 ? void 0 : session.user.isAdmin); //#endregion
  //#region sub

  const [addSubscription, addSubscriptionMutation] = (0,subscriptionsApi/* useAddSubscriptionMutation */.h_)();
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
  const isFollowed = (0,subscriptionSlice/* isFollowedBy */.C3)({
    event,
    subQuery
  });
  const isSubscribedToAtLeastOneOrg = isCreator || !!((_subQuery$data = subQuery.data) !== null && _subQuery$data !== void 0 && _subQuery$data.orgs.find(orgSubscription => {
    for (const org of event.eventOrgs) {
      if (org._id === orgSubscription.orgId && orgSubscription.type === Subscription/* SubscriptionTypes.SUBSCRIBER */.NY.SUBSCRIBER) return true;
    }

    return false;
  })); //#endregion
  //#region local state

  const {
    0: email,
    1: setEmail
  } = (0,external_react_.useState)(userEmail);
  const {
    0: isLogin,
    1: setIsLogin
  } = (0,external_react_.useState)(0);
  const {
    0: isConfig,
    1: setIsConfig
  } = (0,external_react_.useState)(false);
  const {
    0: isEdit,
    1: setIsEdit
  } = (0,external_react_.useState)(false);
  const {
    0: isVisible,
    1: setIsVisible
  } = (0,external_react_.useState)({
    topics: false,
    banner: false,
    logo: false
  });
  const {
    0: showSendForm,
    1: setShowSendForm
  } = (0,external_react_.useState)(false);
  let showAttendingForm = false;

  if (session) {
    if (!isCreator && isSubscribedToAtLeastOneOrg) showAttendingForm = true;
  } else {
    if (event.eventVisibility === Event/* Visibility.SUBSCRIBERS */.Hk.SUBSCRIBERS) {
      var _event$eventNotified;

      if (!!((_event$eventNotified = event.eventNotified) !== null && _event$eventNotified !== void 0 && _event$eventNotified.find(notified => notified.email === email))) showAttendingForm = true;
    } else {
      showAttendingForm = true;
    }
  } //#endregion


  return (0,external_emotion_react_.jsx)(layout/* Layout */.Ar, {
    event: event,
    isLogin: isLogin,
    session: props.session
  }, isCreator && !isConfig ? (0,external_emotion_react_.jsx)(common/* Button */.zx, {
    colorScheme: "teal",
    leftIcon: (0,external_emotion_react_.jsx)(icons_.SettingsIcon, {
      boxSize: 6,
      "data-cy": "eventSettings"
    }),
    onClick: () => setIsConfig(true),
    mb: 2
  }, "Param\xE8tres de l'\xE9v\xE9nement") : isConfig && !isEdit ? (0,external_emotion_react_.jsx)(common/* Button */.zx, {
    colorScheme: "pink",
    leftIcon: (0,external_emotion_react_.jsx)(icons_.ArrowBackIcon, {
      boxSize: 6
    }),
    onClick: () => setIsConfig(false),
    mb: 2
  }, "Revenir \xE0 l'\xE9v\xE9nement") : null, !subQuery.isLoading && !isConfig && (0,external_emotion_react_.jsx)(react_.Flex, {
    flexDirection: "row",
    flexWrap: "wrap",
    mt: -3
  }, isFollowed && (0,external_emotion_react_.jsx)(react_.Box, {
    mr: 3,
    mt: 3
  }, (0,external_emotion_react_.jsx)(SubscriptionPopover, {
    event: event,
    query: eventQuery,
    subQuery: subQuery,
    followerSubscription: isFollowed //isLoading={subQuery.isLoading || subQuery.isFetching}

  })), (0,external_emotion_react_.jsx)(react_.Box, {
    mt: 3
  }, (0,external_emotion_react_.jsx)(SubscriptionPopover, {
    event: event,
    query: eventQuery,
    subQuery: subQuery,
    followerSubscription: isFollowed,
    notifType: "push" //isLoading={subQuery.isLoading || subQuery.isFetching}

  }))), (0,external_emotion_react_.jsx)(react_.Box, {
    mb: 3
  }, (0,external_emotion_react_.jsx)(react_.Text, {
    fontSize: "smaller",
    pt: 1
  }, "\xC9v\xE9nement ajout\xE9 le", " ", (0,external_date_fns_.format)((0,external_date_fns_.parseISO)(event.createdAt), "eeee d MMMM yyyy", {
    locale: fr/* default */.Z
  }), " ", "par :", " ", (0,external_emotion_react_.jsx)(common/* Link */.rU, {
    variant: "underline",
    href: `/${eventCreatedByUserName}`
  }, eventCreatedByUserName), " ", isCreator && "(Vous)")), isCreator && !event.isApproved && (0,external_emotion_react_.jsx)(react_.Alert, {
    status: "info",
    mb: 3
  }, (0,external_emotion_react_.jsx)(react_.AlertIcon, null), (0,external_emotion_react_.jsx)(react_.Box, null, (0,external_emotion_react_.jsx)(react_.Text, null, "Votre \xE9v\xE9nement est en attente de mod\xE9ration."), (0,external_emotion_react_.jsx)(react_.Text, {
    fontSize: "smaller"
  }, "Vous devez attendre son approbation avant de pouvoir envoyer un e-mail d'invitation aux adh\xE9rents des organisateurs."))), event.eventVisibility === Event/* Visibility.SUBSCRIBERS */.Hk.SUBSCRIBERS && !isConfig && (0,external_emotion_react_.jsx)(react_.Alert, {
    status: isSubscribedToAtLeastOneOrg ? "success" : "warning",
    mb: 3
  }, (0,external_emotion_react_.jsx)(react_.AlertIcon, null), (0,external_emotion_react_.jsx)(react_.Box, null, (0,external_emotion_react_.jsx)(react_.Text, {
    as: "h3"
  }, "Cet \xE9v\xE9nement est reserv\xE9 aux adh\xE9rents des organisations suivantes :", " ", event.eventOrgs.map(org => (0,external_emotion_react_.jsx)(common/* Link */.rU, {
    key: org._id,
    href: org.orgUrl,
    shallow: true
  }, (0,external_emotion_react_.jsx)(react_.Tag, {
    mx: 1
  }, org.orgName)))))), showAttendingForm && (0,external_emotion_react_.jsx)(EventAttendingForm, {
    email: email,
    setEmail: setEmail,
    event: event,
    eventQuery: eventQuery
  }), !isConfig && (0,external_emotion_react_.jsx)(EventPageTabs, {
    isCreator: isCreator
  }, (0,external_emotion_react_.jsx)(react_.TabPanels, null, (0,external_emotion_react_.jsx)(react_.TabPanel, {
    "aria-hidden": true
  }, (0,external_emotion_react_.jsx)(react_.Grid // templateColumns="minmax(425px, 1fr) minmax(200px, 1fr) minmax(200px, 1fr)"
  , {
    gridGap: 5,
    css: EventPage_ref
  }, (0,external_emotion_react_.jsx)(common/* GridItem */.P4, {
    rowSpan: 3,
    borderTopRadius: "lg",
    light: {
      bg: "orange.100"
    },
    dark: {
      bg: "gray.500"
    }
  }, (0,external_emotion_react_.jsx)(common/* GridHeader */.Q1, {
    borderTopRadius: "lg",
    alignItems: "center"
  }, (0,external_emotion_react_.jsx)(react_.Flex, {
    flexDirection: "row",
    alignItems: "center"
  }, (0,external_emotion_react_.jsx)(react_.Heading, {
    size: "sm",
    py: 3
  }, "Description de l'\xE9v\xE9nement"), event.eventDescription && isCreator && (0,external_emotion_react_.jsx)(react_.Tooltip, {
    placement: "bottom",
    label: "Modifier la description"
  }, (0,external_emotion_react_.jsx)(react_.IconButton, {
    "aria-label": "Modifier la description",
    icon: (0,external_emotion_react_.jsx)(icons_.EditIcon, null),
    bg: "transparent",
    ml: 3,
    _hover: {
      color: "green"
    },
    onClick: () => {
      setIsConfig(true);
      setIsEdit(true);
    }
  })))), (0,external_emotion_react_.jsx)(common/* GridItem */.P4, null, (0,external_emotion_react_.jsx)(react_.Box, {
    className: "ql-editor",
    p: 5
  }, event.eventDescription && event.eventDescription.length > 0 ? (0,external_emotion_react_.jsx)("div", {
    dangerouslySetInnerHTML: {
      __html: external_isomorphic_dompurify_default().sanitize(event.eventDescription)
    }
  }) : isCreator ? (0,external_emotion_react_.jsx)(common/* Link */.rU, {
    onClick: () => {
      setIsConfig(true);
      setIsEdit(true);
    },
    variant: "underline"
  }, "Cliquez ici pour ajouter la description de l'\xE9v\xE9nement.") : (0,external_emotion_react_.jsx)(react_.Text, {
    fontStyle: "italic"
  }, "Aucune description.")))), (0,external_emotion_react_.jsx)(common/* GridItem */.P4, {
    light: {
      bg: "orange.100"
    },
    dark: {
      bg: "gray.500"
    },
    borderTopRadius: "lg"
  }, (0,external_emotion_react_.jsx)(react_.Grid, {
    templateRows: "auto 1fr"
  }, (0,external_emotion_react_.jsx)(common/* GridHeader */.Q1, {
    borderTopRadius: "lg",
    alignItems: "center"
  }, (0,external_emotion_react_.jsx)(react_.Heading, {
    size: "sm",
    py: 3
  }, "Quand ?")), (0,external_emotion_react_.jsx)(common/* GridItem */.P4, {
    light: {
      bg: "orange.100"
    },
    dark: {
      bg: "gray.500"
    }
  }, (0,external_emotion_react_.jsx)(react_.Box, {
    ml: 3,
    pt: 3
  }, (0,external_emotion_react_.jsx)(EventTimeline/* EventTimeline */.G, {
    event: event
  }))))), (0,external_emotion_react_.jsx)(common/* GridItem */.P4, {
    light: {
      bg: "orange.100"
    },
    dark: {
      bg: "gray.500"
    },
    borderTopRadius: "lg"
  }, (0,external_emotion_react_.jsx)(react_.Grid, {
    templateRows: "auto 1fr"
  }, (0,external_emotion_react_.jsx)(common/* GridHeader */.Q1, {
    borderTopRadius: "lg",
    alignItems: "center"
  }, (0,external_emotion_react_.jsx)(react_.Heading, {
    size: "sm",
    py: 3
  }, "Coordonn\xE9es")), (0,external_emotion_react_.jsx)(common/* GridItem */.P4, {
    light: {
      bg: "orange.100"
    },
    dark: {
      bg: "gray.500"
    }
  }, (0,external_emotion_react_.jsx)(react_.Box, {
    p: 5
  }, event.eventAddress && (0,external_emotion_react_.jsx)(react_.Flex, {
    flexDirection: "column"
  }, (0,external_emotion_react_.jsx)(react_.Flex, {
    alignItems: "center"
  }, (0,external_emotion_react_.jsx)(react_.Icon, {
    as: FaMapMarkedAlt_js_.FaMapMarkedAlt,
    mr: 3
  }), event.eventAddress)), event.eventEmail && (0,external_emotion_react_.jsx)(react_.Flex, {
    flexDirection: "column"
  }, (_event$eventEmail = event.eventEmail) === null || _event$eventEmail === void 0 ? void 0 : _event$eventEmail.map(({
    email
  }, index) => (0,external_emotion_react_.jsx)(react_.Flex, {
    key: `phone-${index}`,
    alignItems: "center"
  }, (0,external_emotion_react_.jsx)(icons_.AtSignIcon, {
    mr: 3
  }), (0,external_emotion_react_.jsx)(common/* Link */.rU, {
    variant: "underline",
    href: `mailto:${email}`
  }, email)))), event.eventPhone && (0,external_emotion_react_.jsx)(react_.Flex, {
    flexDirection: "column"
  }, (_event$eventPhone = event.eventPhone) === null || _event$eventPhone === void 0 ? void 0 : _event$eventPhone.map(({
    phone
  }, index) => (0,external_emotion_react_.jsx)(react_.Flex, {
    key: `phone-${index}`,
    alignItems: "center"
  }, (0,external_emotion_react_.jsx)(icons_.PhoneIcon, {
    mr: 3
  }), (0,external_emotion_react_.jsx)(common/* Link */.rU, {
    variant: "underline",
    href: `tel:+33${phone.substr(1, phone.length)}`
  }, phone)))), event.eventWeb && (0,external_emotion_react_.jsx)(react_.Flex, {
    flexDirection: "column"
  }, (_event$eventWeb = event.eventWeb) === null || _event$eventWeb === void 0 ? void 0 : _event$eventWeb.map(({
    url,
    prefix
  }, index) => (0,external_emotion_react_.jsx)(react_.Flex, {
    key: `phone-${index}`,
    alignItems: "center"
  }, (0,external_emotion_react_.jsx)(react_.Icon, {
    as: FaGlobeEurope_js_.FaGlobeEurope,
    mr: 3
  }), (0,external_emotion_react_.jsx)(common/* Link */.rU, {
    variant: "underline",
    href: prefix + url
  }, url)))))))), (0,external_emotion_react_.jsx)(common/* GridItem */.P4, {
    light: {
      bg: "orange.100"
    },
    dark: {
      bg: "gray.500"
    },
    borderTopRadius: "lg"
  }, (0,external_emotion_react_.jsx)(react_.Grid, {
    templateRows: "auto 1fr"
  }, (0,external_emotion_react_.jsx)(common/* GridHeader */.Q1, {
    borderTopRadius: "lg",
    alignItems: "center"
  }, (0,external_emotion_react_.jsx)(react_.Heading, {
    size: "sm",
    py: 3
  }, "Organis\xE9 par")), (0,external_emotion_react_.jsx)(common/* GridItem */.P4, {
    light: {
      bg: "orange.100"
    },
    dark: {
      bg: "gray.500"
    }
  }, (0,external_emotion_react_.jsx)(react_.Box, {
    p: 5
  }, (0,array/* hasItems */.t)(event.eventOrgs) ? event.eventOrgs.map((eventOrg, index) => (0,external_emotion_react_.jsx)(react_.Flex, {
    key: eventOrg._id,
    mb: 2,
    alignItems: "center"
  }, (0,external_emotion_react_.jsx)(react_.Icon, {
    as: IoIosPeople_js_.IoIosPeople,
    mr: 2
  }), (0,external_emotion_react_.jsx)(common/* Link */.rU, {
    "data-cy": `eventCreatedBy-${eventOrg.orgName}`,
    variant: "underline",
    href: `/${eventOrg.orgUrl}`,
    shallow: true
  }, `${eventOrg.orgName}`))) : (0,external_emotion_react_.jsx)(react_.Flex, {
    alignItems: "center"
  }, (0,external_emotion_react_.jsx)(react_.Icon, {
    as: icons_.AtSignIcon,
    mr: 2
  }), (0,external_emotion_react_.jsx)(common/* Link */.rU, {
    variant: "underline",
    href: `/${eventCreatedByUserName}`
  }, eventCreatedByUserName)))))))), (0,external_emotion_react_.jsx)(react_.TabPanel, {
    "aria-hidden": true
  }, (0,external_emotion_react_.jsx)(TopicsList/* TopicsList */.v, {
    event: event,
    query: eventQuery,
    subQuery: subQuery,
    isCreator: isCreator,
    isFollowed: !!isFollowed,
    isLogin: isLogin,
    setIsLogin: setIsLogin
  })), isCreator && (0,external_emotion_react_.jsx)(react_.TabPanel, {
    "aria-hidden": true
  }, (0,external_emotion_react_.jsx)(common/* Button */.zx, {
    colorScheme: "teal",
    rightIcon: showSendForm ? (0,external_emotion_react_.jsx)(icons_.ChevronDownIcon, null) : (0,external_emotion_react_.jsx)(icons_.ChevronRightIcon, null),
    onClick: () => {
      if (!event.isApproved) alert("L'événement doit être vérifié par un modérateur avant de pouvoir envoyer des invitations.");else setShowSendForm(!showSendForm);
    }
  }, "Envoyer les invitations"), showSendForm && session && (0,external_emotion_react_.jsx)(EventSendForm, {
    event: event,
    eventQuery: eventQuery,
    session: session,
    onSubmit: () => setShowSendForm(false)
  }), (0,external_emotion_react_.jsx)(react_.Box, {
    light: {
      bg: "orange.100"
    },
    dark: {
      bg: "gray.500"
    },
    overflowX: "auto",
    mt: 5
  }, !event.eventNotified || Array.isArray(event.eventNotified) && !event.eventNotified.length ? (0,external_emotion_react_.jsx)(react_.Text, null, "Aucune invitation envoy\xE9e.") : (0,external_emotion_react_.jsx)(react_.Table, null, (0,external_emotion_react_.jsx)(react_.Tbody, null, (_event$eventNotified2 = event.eventNotified) === null || _event$eventNotified2 === void 0 ? void 0 : _event$eventNotified2.map(({
    email: e,
    status
  }) => {
    return (0,external_emotion_react_.jsx)(react_.Tr, {
      key: e
    }, (0,external_emotion_react_.jsx)(react_.Td, null, e), (0,external_emotion_react_.jsx)(react_.Td, null, (0,external_emotion_react_.jsx)(react_.Tag, {
      variant: "solid",
      colorScheme: status === Event/* StatusTypes.PENDING */.Sk.PENDING ? "blue" : status === Event/* StatusTypes.OK */.Sk.OK ? "green" : "red"
    }, Event/* StatusTypesV */.EE[status])));
  }))))))), session && isConfig && (0,external_emotion_react_.jsx)(EventConfigPanel, {
    session: session,
    event: event,
    eventQuery: eventQuery,
    isConfig: isConfig,
    isEdit: isEdit,
    isVisible: isVisible,
    setIsConfig: setIsConfig,
    setIsEdit: setIsEdit,
    setIsVisible: setIsVisible
  }));
};
;// CONCATENATED MODULE: external "@react-icons/all-files/fa/FaFile.js"
var FaFile_js_namespaceObject = require("@react-icons/all-files/fa/FaFile.js");;
;// CONCATENATED MODULE: external "@react-icons/all-files/fa/FaImage.js"
var FaImage_js_namespaceObject = require("@react-icons/all-files/fa/FaImage.js");;
// EXTERNAL MODULE: external "axios"
var external_axios_ = __webpack_require__(2376);
var external_axios_default = /*#__PURE__*/__webpack_require__.n(external_axios_);
// EXTERNAL MODULE: ./src/utils/string.ts
var string = __webpack_require__(7535);
// EXTERNAL MODULE: ./src/features/documents/documentsApi.ts
var documentsApi = __webpack_require__(2445);
;// CONCATENATED MODULE: ./src/features/documents/DocumentsList.tsx



function DocumentsList_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = DocumentsList_objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function DocumentsList_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }













const DocumentsList = (_ref) => {
  let {
    org,
    isLogin,
    setIsLogin
  } = _ref,
      props = DocumentsList_objectWithoutProperties(_ref, ["org", "isLogin", "setIsLogin"]);

  const {
    data: session,
    loading: isSessionLoading
  } = (0,useAuth/* useSession */.k)();
  const toast = (0,react_.useToast)({
    position: "top"
  });
  const query = (0,documentsApi/* useGetDocumentsQuery */.An)(org._id); //const [addDocument, addDocumentMutation] = useAddDocumentMutation();

  const {
    0: loaded,
    1: setLoaded
  } = (0,external_react_.useState)(0);
  const {
    0: isAdd,
    1: setIsAdd
  } = (0,external_react_.useState)(false);
  const {
    0: isLoading,
    1: setIsLoading
  } = (0,external_react_.useState)(false);
  const {
    register,
    handleSubmit,
    setError,
    errors,
    clearErrors,
    watch
  } = (0,external_react_hook_form_.useForm)({
    mode: "onChange"
  });

  const onSubmit = async form => {
    console.log("submitted", form);
    setIsLoading(true);

    try {
      const file = form.files[0];
      const data = new FormData();
      data.append("file", file, file.name);
      data.append("orgId", org._id);
      const {
        statusText
      } = await external_axios_default().post("https://api.aucourant.de", data, {
        onUploadProgress: ProgressEvent => {
          setLoaded(ProgressEvent.loaded / ProgressEvent.total * 100);
        }
      });

      if (statusText === "OK") {
        toast({
          title: "Votre document a bien été ajouté !",
          status: "success"
        });
        query.refetch();
      }
    } catch (error) {
      (0,utils_form/* handleError */.S)(error, message => setError("formErrorMessage", {
        type: "manual",
        message
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, (0,external_emotion_react_.jsx)(react_.Button, {
    colorScheme: "teal",
    leftIcon: (0,external_emotion_react_.jsx)(icons_.AddIcon, null),
    rightIcon: isAdd ? (0,external_emotion_react_.jsx)(icons_.ChevronDownIcon, null) : (0,external_emotion_react_.jsx)(icons_.ChevronRightIcon, null),
    mb: 5,
    onClick: () => {
      if (!isSessionLoading) {
        if (session) {
          setIsAdd(!isAdd);
        } else {
          setIsLogin(isLogin + 1);
        }
      }
    }
  }, "Ajouter"), isAdd && (0,external_emotion_react_.jsx)("form", {
    method: "post",
    onChange: () => {
      clearErrors("formErrorMessage");
    },
    onSubmit: handleSubmit(onSubmit)
  }, (0,external_emotion_react_.jsx)(error_message_.ErrorMessage, {
    errors: errors,
    name: "formErrorMessage",
    render: ({
      message
    }) => (0,external_emotion_react_.jsx)(react_.Alert, {
      status: "error",
      mb: 3
    }, (0,external_emotion_react_.jsx)(react_.AlertIcon, null), (0,external_emotion_react_.jsx)(common/* ErrorMessageText */.h1, null, message))
  }), (0,external_emotion_react_.jsx)(react_.FormControl, {
    id: "files",
    isInvalid: !!errors["files"],
    mb: 3
  }, (0,external_emotion_react_.jsx)(react_.FormLabel, null, "S\xE9lectionnez un fichier :"), (0,external_emotion_react_.jsx)(react_.Input, {
    height: "auto",
    py: 3,
    name: "files",
    type: "file",
    accept: "*",
    onChange: async e => {
      if (e.target.files && e.target.files[0]) {
        setLoaded(0);
        clearErrors("file");
        clearErrors("formErrorMessage");
      }
    },
    ref: register({
      required: "Vous devez sélectionner un fichier",
      validate: file => {
        if (file && file[0] && file[0].size >= 50000000) {
          return "Le fichier ne doit pas dépasser 50Mo.";
        }

        return true;
      }
    })
  }), (0,external_emotion_react_.jsx)(react_.FormErrorMessage, null, (0,external_emotion_react_.jsx)(error_message_.ErrorMessage, {
    errors: errors,
    name: "files"
  }))), loaded > 0 && loaded !== 100 && (0,external_emotion_react_.jsx)(react_.Progress, {
    mb: 3,
    hasStripe: true,
    value: loaded
  }), (0,external_emotion_react_.jsx)(react_.Button, {
    colorScheme: "green",
    type: "submit",
    isLoading: isLoading,
    isDisabled: Object.keys(errors).length > 0
  }, "Ajouter")), query.isLoading || query.isFetching ? (0,external_emotion_react_.jsx)(react_.Text, null, "Chargement des documents...") : Array.isArray(query.data) && (0,external_emotion_react_.jsx)(react_.Table, null, (0,external_emotion_react_.jsx)(react_.Tbody, null, query.data.map(fileName => {
    const isImage = string/* isImage */.Or(fileName);
    const isPdf = fileName.includes(".pdf");
    return (0,external_emotion_react_.jsx)(react_.Tr, null, (0,external_emotion_react_.jsx)(react_.Td, null, (0,external_emotion_react_.jsx)("a", {
      href: `${"https://api.aucourant.de"}/${isImage || isPdf ? "view" : "download"}?orgId=${org._id}&fileName=${fileName}`,
      target: "_blank"
    }, (0,external_emotion_react_.jsx)(react_.Box, {
      display: "flex",
      alignItems: "center"
    }, (0,external_emotion_react_.jsx)(react_.Icon, {
      as: isImage ? FaImage_js_namespaceObject.FaImage : FaFile_js_namespaceObject.FaFile,
      mr: 3
    }), fileName))));
  }))));
};
// EXTERNAL MODULE: ./src/features/events/EventsList.tsx + 7 modules
var EventsList = __webpack_require__(1526);
// EXTERNAL MODULE: ./src/models/Project.ts
var Project = __webpack_require__(2728);
// EXTERNAL MODULE: external "react-select"
var external_react_select_ = __webpack_require__(724);
var external_react_select_default = /*#__PURE__*/__webpack_require__.n(external_react_select_);
// EXTERNAL MODULE: ./src/features/projects/projectsApi.ts
var projectsApi = __webpack_require__(7562);
// EXTERNAL MODULE: ./src/features/orgs/orgsApi.ts
var orgsApi = __webpack_require__(2207);
;// CONCATENATED MODULE: ./src/features/forms/ProjectForm.tsx
function ProjectForm_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function ProjectForm_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ProjectForm_ownKeys(Object(source), true).forEach(function (key) { ProjectForm_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ProjectForm_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function ProjectForm_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function ProjectForm_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = ProjectForm_objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function ProjectForm_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }













const ProjectForm = (_ref) => {
  var _props$project2;

  let {
    org
  } = _ref,
      props = ProjectForm_objectWithoutProperties(_ref, ["org"]);

  const toast = (0,react_.useToast)({
    position: "top"
  }); //#region project

  const [addProject, addProjectMutation] = (0,projectsApi/* useAddProjectMutation */.KV)();
  const [editProject, editProjectMutation] = (0,projectsApi/* useEditProjectMutation */.KT)(); //#endregion
  //#region local state

  const {
    0: isLoading,
    1: setIsLoading
  } = (0,external_react_.useState)(false); //#endregion
  //#region myOrgs

  const {
    data: myOrgs,
    isLoading: isQueryLoading
  } = (0,orgsApi/* useGetOrgsQuery */.Gt)({
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
    getValues,
    trigger
  } = (0,external_react_hook_form_.useForm)({
    mode: "onChange"
  });
  const statusOptions = Object.keys(Project/* Status */.qb).map(key => Project/* Status */.qb[key]);
  const visibilityOptions = Object.keys(Project/* Visibility */.Hk).map(key => Project/* Visibility */.Hk[key]);
  const projectVisibility = watch("projectVisibility");
  const projectOrgsRules = {
    required: projectVisibility === Project/* Visibility.SUBSCRIBERS */.Hk.SUBSCRIBERS
  }; //#endregion

  const onChange = () => {
    clearErrors("formErrorMessage");
  };

  const onSubmit = async form => {
    var _form$projectDescript;

    console.log("submitted", form);
    setIsLoading(true);

    let payload = ProjectForm_objectSpread(ProjectForm_objectSpread({}, form), {}, {
      projectDescription: form.projectDescription === "<p><br></p>" ? "" : (_form$projectDescript = form.projectDescription) === null || _form$projectDescript === void 0 ? void 0 : _form$projectDescript.replace(/\&nbsp;/g, " ")
    });

    try {
      if (props.project) {
        await editProject({
          payload,
          projectId: props.project._id
        }).unwrap();
        toast({
          title: "Votre projet a bien été modifié",
          status: "success",
          isClosable: true
        });
      } else {
        const res = await addProject(ProjectForm_objectSpread(ProjectForm_objectSpread({}, payload), {}, {
          createdBy: props.session.user.userId
        }));

        if (res.error) {
          throw res.error;
        } else {
          toast({
            title: "Votre projet a bien été ajouté !",
            status: "success",
            isClosable: true
          });
        }
      }

      props.onSubmit && props.onSubmit(props.project || null);
      props.onClose && props.onClose();
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

  return (0,external_emotion_react_.jsx)("form", {
    onChange: onChange,
    onSubmit: handleSubmit(onSubmit)
  }, (0,external_emotion_react_.jsx)(error_message_.ErrorMessage, {
    errors: errors,
    name: "formErrorMessage",
    render: ({
      message
    }) => (0,external_emotion_react_.jsx)(react_.Alert, {
      status: "error",
      mb: 3
    }, (0,external_emotion_react_.jsx)(react_.AlertIcon, null), (0,external_emotion_react_.jsx)(common/* ErrorMessageText */.h1, null, message))
  }), (0,external_emotion_react_.jsx)(react_.FormControl, {
    id: "projectName",
    isRequired: true,
    isInvalid: !!errors["projectName"],
    mb: 3
  }, (0,external_emotion_react_.jsx)(react_.FormLabel, null, "Nom du projet"), (0,external_emotion_react_.jsx)(react_.Input, {
    name: "projectName",
    placeholder: "Nom du projet",
    ref: register({
      required: "Veuillez saisir le nom du projet"
    }),
    defaultValue: props.project && props.project.projectName
  }), (0,external_emotion_react_.jsx)(react_.FormErrorMessage, null, (0,external_emotion_react_.jsx)(error_message_.ErrorMessage, {
    errors: errors,
    name: "projectName"
  }))), (0,external_emotion_react_.jsx)(react_.FormControl, {
    id: "projectDescription",
    isInvalid: !!errors["projectDescription"],
    mb: 3
  }, (0,external_emotion_react_.jsx)(react_.FormLabel, null, "Description du projet"), (0,external_emotion_react_.jsx)(external_react_hook_form_.Controller, {
    name: "projectDescription",
    control: control,
    defaultValue: "",
    render: p => {
      var _props$project;

      return (0,external_emotion_react_.jsx)(common/* RTEditor */.Qd, {
        defaultValue: (_props$project = props.project) === null || _props$project === void 0 ? void 0 : _props$project.projectDescription,
        onChange: html => {
          p.onChange(html === "<p><br></p>" ? "" : html);
        },
        placeholder: "Description du projet"
      });
    }
  }), (0,external_emotion_react_.jsx)(react_.FormErrorMessage, null, (0,external_emotion_react_.jsx)(error_message_.ErrorMessage, {
    errors: errors,
    name: "projectDescription"
  }))), statusOptions.length > 0 && (0,external_emotion_react_.jsx)(react_.FormControl, {
    id: "projectStatus",
    isRequired: true,
    isInvalid: !!errors["projectStatus"],
    mb: 3
  }, (0,external_emotion_react_.jsx)(react_.FormLabel, null, "Statut"), (0,external_emotion_react_.jsx)(react_.Select, {
    name: "projectStatus",
    defaultValue: Project/* Status */.qb[Project/* Status.PENDING */.qb.PENDING],
    ref: register({
      required: "Veuillez sélectionner le statut du projet"
    }),
    placeholder: "S\xE9lectionnez le statut du projet...",
    color: "gray.400"
  }, statusOptions.map(key => {
    return (0,external_emotion_react_.jsx)("option", {
      key: key,
      value: key
    }, Project/* StatusV */.cZ[key]);
  })), (0,external_emotion_react_.jsx)(react_.FormErrorMessage, null, (0,external_emotion_react_.jsx)(error_message_.ErrorMessage, {
    errors: errors,
    name: "projectStatus"
  }))), visibilityOptions.length > 0 && (0,external_emotion_react_.jsx)(react_.FormControl, {
    id: "projectVisibility",
    isRequired: true,
    isInvalid: !!errors["projectVisibility"],
    mb: 3
  }, (0,external_emotion_react_.jsx)(react_.FormLabel, null, "Visibilit\xE9"), (0,external_emotion_react_.jsx)(react_.Select, {
    name: "projectVisibility",
    defaultValue: Project/* Visibility */.Hk[Project/* Visibility.PUBLIC */.Hk.PUBLIC],
    ref: register({
      required: "Veuillez sélectionner la visibilité du projet"
    }),
    placeholder: "S\xE9lectionnez la visibilit\xE9 du projet...",
    color: "gray.400"
  }, visibilityOptions.map(key => {
    return (0,external_emotion_react_.jsx)("option", {
      key: key,
      value: key
    }, Project/* VisibilityV */.XO[key]);
  })), (0,external_emotion_react_.jsx)(react_.FormErrorMessage, null, (0,external_emotion_react_.jsx)(error_message_.ErrorMessage, {
    errors: errors,
    name: "projectVisibility"
  }))), (0,external_emotion_react_.jsx)(react_.FormControl, {
    mb: 3,
    id: "projectOrgs",
    isInvalid: !!errors["projectOrgs"],
    isRequired: projectOrgsRules.required
  }, (0,external_emotion_react_.jsx)(react_.FormLabel, null, "Organisateurs"), (0,external_emotion_react_.jsx)(external_react_hook_form_.Controller, {
    name: "projectOrgs",
    rules: projectOrgsRules,
    as: (external_react_select_default()),
    control: control,
    defaultValue: ((_props$project2 = props.project) === null || _props$project2 === void 0 ? void 0 : _props$project2.projectOrgs) || [org],
    placeholder: "S\xE9lectionner...",
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
        return ProjectForm_objectSpread(ProjectForm_objectSpread({}, defaultStyles), {}, {
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
  }), (0,external_emotion_react_.jsx)(react_.FormErrorMessage, null, (0,external_emotion_react_.jsx)(error_message_.ErrorMessage, {
    errors: errors,
    name: "projectOrgs"
  }))), (0,external_emotion_react_.jsx)(react_.Flex, {
    justifyContent: "space-between"
  }, (0,external_emotion_react_.jsx)(react_.Button, {
    onClick: () => props.onCancel && props.onCancel()
  }, "Annuler"), (0,external_emotion_react_.jsx)(react_.Button, {
    colorScheme: "green",
    type: "submit",
    isLoading: isLoading || addProjectMutation.isLoading || editProjectMutation.isLoading,
    isDisabled: Object.keys(errors).length > 0,
    "data-cy": "addProject"
  }, props.project ? "Modifier" : "Ajouter")));
};
;// CONCATENATED MODULE: ./src/features/modals/ProjectModal.tsx




const ProjectModal = props => {
  const {
    isOpen,
    onOpen,
    onClose
  } = (0,react_.useDisclosure)({
    defaultIsOpen: true
  });
  return (0,external_emotion_react_.jsx)(react_.Modal, {
    isOpen: isOpen,
    onClose: () => {
      props.onClose && props.onClose();
      onClose();
    },
    closeOnOverlayClick: false
  }, (0,external_emotion_react_.jsx)(react_.ModalOverlay, null, (0,external_emotion_react_.jsx)(react_.ModalContent, null, (0,external_emotion_react_.jsx)(react_.ModalHeader, null, props.project ? "Modifier le projet" : "Ajouter un projet"), (0,external_emotion_react_.jsx)(react_.ModalCloseButton, null), (0,external_emotion_react_.jsx)(react_.ModalBody, null, (0,external_emotion_react_.jsx)(ProjectForm, props)))));
};
;// CONCATENATED MODULE: ./src/features/projects/ProjectAttendingForm.tsx











const ProjectAttendingForm = ({
  project,
  orgQuery
}) => {
  const {
    data: session,
    loading: isSessionLoading
  } = (0,useAuth/* useSession */.k)();
  const toast = (0,react_.useToast)({
    position: "top"
  });
  const dispatch = (0,store/* useAppDispatch */.TL)(); //#region project

  const [editProject, editProjectMutation] = (0,projectsApi/* useEditProjectMutation */.KT)(); //#endregion
  //#region local state

  const storedUserEmail = (0,external_react_redux_.useSelector)(userSlice/* selectUserEmail */.I_);
  const userEmail = storedUserEmail || (session === null || session === void 0 ? void 0 : session.user.email) || ""; //#endregion

  const attend = async () => {
    var _project$projectNotif;

    let promptedEmail = null;

    if (!session && (!userEmail || userEmail === "")) {
      promptedEmail = prompt("Veuillez entrer votre adresse e-mail :");

      if (!promptedEmail || !utils_email/* emailR.test */.GN.test(promptedEmail)) {
        toast({
          status: "error",
          title: "Adresse e-mail invalide"
        });
        return;
      }

      dispatch((0,userSlice/* setUserEmail */.WG)(promptedEmail));
    }

    if ((0,Project/* isAttending */.po)({
      email: promptedEmail || userEmail,
      project
    })) {
      toast({
        status: "error",
        title: "Vous participez déjà à cet projet"
      });
      return;
    }

    let isNew = true;
    let projectNotified = ((_project$projectNotif = project.projectNotified) === null || _project$projectNotif === void 0 ? void 0 : _project$projectNotif.map(({
      email: e,
      status
    }) => {
      if ((e === promptedEmail || userEmail) && status !== Project/* StatusTypes.OK */.Sk.OK) {
        isNew = false;
        return {
          email: e,
          status: Project/* StatusTypes.OK */.Sk.OK
        };
      }

      return {
        email: e,
        status
      };
    })) || [];
    if (isNew) projectNotified === null || projectNotified === void 0 ? void 0 : projectNotified.push({
      email: promptedEmail || userEmail,
      status: Project/* StatusTypes.OK */.Sk.OK
    });
    await editProject({
      payload: {
        projectNotified
      },
      projectId: project._id
    });
    orgQuery.refetch();
  };

  const unattend = async () => {
    var _project$projectNotif2;

    let promptedEmail = null;

    if (!session && (!userEmail || userEmail === "")) {
      promptedEmail = prompt("Veuillez entrer votre adresse e-mail :");

      if (!promptedEmail || !utils_email/* emailR.test */.GN.test(promptedEmail)) {
        toast({
          status: "error",
          title: "Adresse e-mail invalide"
        });
        return;
      }

      dispatch((0,userSlice/* setUserEmail */.WG)(promptedEmail));
    }

    let projectNotified = (_project$projectNotif2 = project.projectNotified) === null || _project$projectNotif2 === void 0 ? void 0 : _project$projectNotif2.filter(({
      email,
      status
    }) => {
      return email !== promptedEmail && email !== userEmail;
    });
    await editProject({
      payload: {
        projectNotified
      },
      projectId: project._id
    });
    orgQuery.refetch();
  };

  return (0,external_emotion_react_.jsx)(react_.Box, {
    p: 3
  }, (0,Project/* isAttending */.po)({
    email: userEmail,
    project
  }) ? (0,external_emotion_react_.jsx)(common/* Button */.zx, {
    colorScheme: "red",
    isLoading: editProjectMutation.isLoading || orgQuery.isFetching || orgQuery.isLoading,
    onClick: async () => {
      const ok = confirm("Êtes-vous sûr de ne plus vouloir participer à cet projet ?");

      if (ok) {
        unattend();
      }
    }
  }, "Ne plus participer \xE0 ce projet") : editProjectMutation.isLoading || orgQuery.isFetching || orgQuery.isLoading ? (0,external_emotion_react_.jsx)(react_.Spinner, null) : (0,external_emotion_react_.jsx)(common/* Button */.zx, {
    colorScheme: "green",
    onClick: attend
  }, "Participer \xE0 ce projet"));
};
// EXTERNAL MODULE: ./src/utils/date.ts
var date = __webpack_require__(4245);
// EXTERNAL MODULE: external "@react-icons/all-files/io/IoMdPerson.js"
var IoMdPerson_js_ = __webpack_require__(1917);
// EXTERNAL MODULE: ./src/models/Topic.ts + 1 modules
var Topic = __webpack_require__(3921);
;// CONCATENATED MODULE: ./src/features/projects/ProjectItemVisibility.tsx







const ProjectItemVisibility = ({
  projectVisibility
}) => projectVisibility === Topic/* Visibility.SUBSCRIBERS */.EE.SUBSCRIBERS ? (0,external_emotion_react_.jsx)(react_.Tooltip, {
  label: "Projet r\xE9serv\xE9 aux adh\xE9rents"
}, (0,external_emotion_react_.jsx)("span", null, (0,external_emotion_react_.jsx)(react_.Icon, {
  as: IoMdPerson_js_.IoMdPerson,
  boxSize: 4
}))) : projectVisibility === Topic/* Visibility.FOLLOWERS */.EE.FOLLOWERS ? (0,external_emotion_react_.jsx)(react_.Tooltip, {
  label: "Projet r\xE9serv\xE9 aux abonn\xE9s"
}, (0,external_emotion_react_.jsx)(icons_.EmailIcon, {
  boxSize: 4
})) : projectVisibility === Topic/* Visibility.PUBLIC */.EE.PUBLIC ? (0,external_emotion_react_.jsx)(react_.Tooltip, {
  label: "Projet public"
}, (0,external_emotion_react_.jsx)("span", null, (0,external_emotion_react_.jsx)(react_.Icon, {
  as: FaGlobeEurope_js_.FaGlobeEurope,
  boxSize: 4
}))) : null;
;// CONCATENATED MODULE: ./src/features/projects/ProjectsListFilters.tsx
function ProjectsListFilters_extends() { ProjectsListFilters_extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return ProjectsListFilters_extends.apply(this, arguments); }

function ProjectsListFilters_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = ProjectsListFilters_objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function ProjectsListFilters_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }





const ProjectsListFilters = (_ref) => {
  let {
    selectedStatuses,
    setSelectedStatuses
  } = _ref,
      props = ProjectsListFilters_objectWithoutProperties(_ref, ["selectedStatuses", "setSelectedStatuses"]);

  const {
    colorMode
  } = (0,react_.useColorMode)();
  const isDark = colorMode === "dark";
  return (0,external_emotion_react_.jsx)(react_.Flex, ProjectsListFilters_extends({
    flexWrap: "nowrap",
    overflowX: "auto"
  }, props), Object.keys(Project/* Status */.qb).map(k => {
    // const bgColor = Status[k].bgColor;
    const bgColor = "transparent";
    const isSelected = selectedStatuses.includes(k);
    return (0,external_emotion_react_.jsx)(react_.Link, {
      key: "status-" + k,
      variant: "no-underline",
      onClick: () => {
        setSelectedStatuses(selectedStatuses.includes(k) ? selectedStatuses.filter(sC => sC !== k) : [k]);
      }
    }, (0,external_emotion_react_.jsx)(react_.Tag, {
      variant: isSelected ? "solid" : "outline",
      color: isDark ? "white" : isSelected ? "white" : "black",
      bgColor: isSelected ? bgColor === "transparent" ? isDark ? "whiteAlpha.300" : "blackAlpha.600" : bgColor : undefined,
      mr: 1,
      whiteSpace: "nowrap"
    }, Project/* StatusV */.cZ[k]));
  }));
};
;// CONCATENATED MODULE: ./src/features/projects/ProjectsListOrder.tsx
function ProjectsListOrder_extends() { ProjectsListOrder_extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return ProjectsListOrder_extends.apply(this, arguments); }

function ProjectsListOrder_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = ProjectsListOrder_objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function ProjectsListOrder_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }



const orderList = [{
  key: "a-z",
  label: "A-Z",
  order: "asc"
}, {
  key: "z-a",
  label: "Z-A",
  order: "desc"
}];
const ProjectsListOrder = (_ref) => {
  let {
    selectedOrder,
    setSelectedOrder
  } = _ref,
      props = ProjectsListOrder_objectWithoutProperties(_ref, ["selectedOrder", "setSelectedOrder"]);

  return (0,external_emotion_react_.jsx)(react_.Select, ProjectsListOrder_extends({
    placeholder: "Changer l'ordre d'affichage",
    width: "fit-content",
    onChange: e => {
      setSelectedOrder(orderList.find(({
        key
      }) => key === e.target.value));
    }
  }, props), orderList.map(({
    key,
    label,
    order
  }) => {
    return (0,external_emotion_react_.jsx)("option", {
      key: key + "-" + order,
      value: key
    }, label);
  }));
};
;// CONCATENATED MODULE: ./src/features/projects/ProjectsList.tsx
function ProjectsList_extends() { ProjectsList_extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return ProjectsList_extends.apply(this, arguments); }

function ProjectsList_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function ProjectsList_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ProjectsList_ownKeys(Object(source), true).forEach(function (key) { ProjectsList_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ProjectsList_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function ProjectsList_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function ProjectsList_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = ProjectsList_objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function ProjectsList_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }


















const ProjectsList = (_ref) => {
  let {
    org,
    orgQuery,
    isCreator,
    isFollowed,
    isSubscribed,
    isLogin,
    setIsLogin
  } = _ref,
      props = ProjectsList_objectWithoutProperties(_ref, ["org", "orgQuery", "isCreator", "isFollowed", "isSubscribed", "isLogin", "setIsLogin"]);

  const {
    colorMode
  } = (0,react_.useColorMode)();
  const isDark = colorMode === "dark";
  const {
    data: session,
    loading: isSessionLoading
  } = (0,useAuth/* useSession */.k)();
  const toast = (0,react_.useToast)({
    position: "top"
  }); //#region project

  const [deleteProject, deleteProjectMutation] = (0,projectsApi/* useDeleteProjectMutation */.ec)();
  const projects = (0,external_react_.useMemo)(() => [...org.orgProjects], [org]);
  const projectsCount = Array.isArray(org.orgProjects) ? org.orgProjects.length : 0; //#endregion
  //#region local state

  const {
    0: isLoading,
    1: setIsLoading
  } = (0,external_react_.useState)({});
  const {
    0: projectModalState,
    1: setProjectModalState
  } = (0,external_react_.useState)({
    isOpen: false,
    project: undefined
  });
  const {
    0: currentProject,
    1: setCurrentProject
  } = (0,external_react_.useState)(null);
  const {
    0: selectedStatuses,
    1: setSelectedStatuses
  } = (0,external_react_.useState)([]);
  const {
    0: selectedOrder,
    1: setSelectedOrder
  } = (0,external_react_.useState)(); //#endregion

  return (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, (0,external_emotion_react_.jsx)(react_.Button, {
    colorScheme: "teal",
    leftIcon: (0,external_emotion_react_.jsx)(icons_.AddIcon, null),
    mb: 5,
    onClick: () => {
      if (!isSessionLoading) {
        if (session) {
          if (!isCreator && !isSubscribed) {
            toast({
              status: "error",
              title: `Vous devez être adhérent ${(0,Org/* orgTypeFull */.rY)(org.orgType)} pour ajouter un projet`
            });
          } else {
            setProjectModalState(ProjectsList_objectSpread(ProjectsList_objectSpread({}, projectModalState), {}, {
              isOpen: true
            }));
          }
        } else {
          setIsLogin(isLogin + 1);
        }
      }
    }
  }, "Ajouter un projet"), (0,external_emotion_react_.jsx)(ProjectsListFilters, {
    selectedStatuses: selectedStatuses,
    setSelectedStatuses: setSelectedStatuses,
    mb: 5
  }), (0,external_emotion_react_.jsx)(ProjectsListOrder, {
    selectedOrder: selectedOrder,
    setSelectedOrder: setSelectedOrder,
    mb: 5
  }), (0,external_emotion_react_.jsx)(common/* Grid */.rj, ProjectsList_extends({
    "data-cy": "projectList"
  }, props), orgQuery.isLoading || orgQuery.isFetching ? (0,external_emotion_react_.jsx)(react_.Text, null, "Chargement des projets...") : projects.sort((a, b) => {
    if (!selectedOrder) return 0;

    if (selectedOrder.order === "asc") {
      if (a.projectName < b.projectName) return -1;
      if (a.projectName > b.projectName) return 1;
    } else if (selectedOrder.order === "desc") {
      if (a.projectName > b.projectName) return -1;
      if (a.projectName < b.projectName) return 1;
    }

    return 0;
  }).map((orgProject, projectIndex) => {
    var _createdBy$email;

    const {
      projectName,
      projectDescription,
      projectStatus,
      createdBy,
      createdAt
    } = orgProject;
    if ((0,array/* hasItems */.t)(selectedStatuses) && !selectedStatuses.includes(projectStatus)) return null;
    const projectCreatedByUserName = typeof createdBy === "object" ? createdBy.userName || ((_createdBy$email = createdBy.email) === null || _createdBy$email === void 0 ? void 0 : _createdBy$email.replace(/@.+/, "")) : "";
    const {
      timeAgo,
      fullDate
    } = date/* timeAgo */.Sy(createdAt, true);
    const isCurrent = currentProject && orgProject._id === currentProject._id;
    const isProjectCreator = typeof createdBy === "object" ? createdBy._id === (session === null || session === void 0 ? void 0 : session.user.userId) : "";
    const bgColor = isDark ? projectIndex % 2 === 0 ? "gray.600" : "gray.500" : projectIndex % 2 === 0 ? "orange.200" : "orange.100";
    return (0,external_emotion_react_.jsx)(react_.Box, {
      key: orgProject._id,
      mb: 5
    }, (0,external_emotion_react_.jsx)(common/* GridItem */.P4, {
      minWidth: "100%",
      p: 3,
      borderTopRadius: "xl" // borderBottomRadius="xl"
      // borderTopRadius={projectIndex === 0 ? "lg" : undefined}
      ,
      borderBottomRadius: !isCurrent ? "xl" : undefined,
      light: {
        bg: bgColor,
        _hover: {
          bg: "orange.300"
        }
      },
      dark: {
        bg: bgColor,
        _hover: {
          bg: "gray.400"
        }
      }
    }, (0,external_emotion_react_.jsx)(common/* Link */.rU, {
      variant: "no-underline",
      onClick: () => setCurrentProject(isCurrent ? null : orgProject),
      "data-cy": "project"
    }, (0,external_emotion_react_.jsx)(common/* Grid */.rj, {
      templateColumns: "auto auto 1fr auto"
    }, (0,external_emotion_react_.jsx)(common/* GridItem */.P4, {
      display: "flex",
      alignItems: "center",
      pr: 3
    }, currentProject && isCurrent ? (0,external_emotion_react_.jsx)(icons_.ViewIcon, {
      boxSize: 6
    }) : (0,external_emotion_react_.jsx)(icons_.ViewOffIcon, {
      boxSize: 6
    })), (0,external_emotion_react_.jsx)(common/* GridItem */.P4, {
      display: "flex",
      alignItems: "center",
      pr: 3
    }, (0,external_emotion_react_.jsx)(react_.Tag, {
      variant: "solid",
      colorScheme: projectStatus === Project/* Status.PENDING */.qb.PENDING ? "red" : projectStatus === Project/* Status.ONGOING */.qb.ONGOING ? "orange" : "green"
    }, Project/* StatusV */.cZ[projectStatus])), (0,external_emotion_react_.jsx)(common/* GridItem */.P4, null, (0,external_emotion_react_.jsx)(react_.Text, {
      fontWeight: "bold"
    }, projectName), (0,external_emotion_react_.jsx)(react_.Box, {
      display: "inline",
      fontSize: "smaller",
      color: isDark ? "white" : "gray.600"
    }, projectCreatedByUserName, (0,external_emotion_react_.jsx)("span", {
      "aria-hidden": true
    }, " \xB7 "), (0,external_emotion_react_.jsx)(react_.Tooltip, {
      placement: "bottom",
      label: fullDate
    }, (0,external_emotion_react_.jsx)("span", null, timeAgo)), (0,external_emotion_react_.jsx)("span", {
      "aria-hidden": true
    }, " \xB7 "), (0,external_emotion_react_.jsx)(ProjectItemVisibility, {
      projectVisibility: orgProject.projectVisibility
    }))), isProjectCreator && (0,external_emotion_react_.jsx)(common/* GridItem */.P4, {
      display: "flex",
      alignItems: "center"
    }, (0,external_emotion_react_.jsx)(react_.Tooltip, {
      label: "Modifier le projet"
    }, (0,external_emotion_react_.jsx)(react_.IconButton, {
      "aria-label": "Modifier le projet",
      icon: (0,external_emotion_react_.jsx)(icons_.EditIcon, null),
      bg: "transparent",
      _hover: {
        bg: "transparent",
        color: "green"
      },
      height: "auto",
      minWidth: 0,
      onClick: () => {
        setProjectModalState({
          isOpen: true,
          project: orgProject
        });
      }
    })), (0,external_emotion_react_.jsx)(react_.Box, {
      "aria-hidden": true,
      mx: 1
    }, "\xB7"), (0,external_emotion_react_.jsx)(common/* DeleteButton */.m1, {
      isIconOnly: true,
      isLoading: isLoading[orgProject._id],
      placement: "bottom",
      bg: "transparent",
      height: "auto",
      minWidth: 0,
      _hover: {
        color: "red"
      },
      header: (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, "\xCAtes vous s\xFBr de vouloir supprimer le projet", (0,external_emotion_react_.jsx)(react_.Text, {
        display: "inline",
        color: "red",
        fontWeight: "bold"
      }, ` ${projectName}`), " ", "?"),
      onClick: async () => {
        setIsLoading({
          [orgProject._id]: true
        });

        try {
          let deletedProject;

          if (orgProject._id) {
            deletedProject = await deleteProject(orgProject._id).unwrap();
          }

          if (deletedProject) {
            // subQuery.refetch();
            orgQuery.refetch();
            toast({
              title: `${deletedProject.projectName} a bien été supprimé !`,
              status: "success",
              isClosable: true
            });
          }
        } catch (error) {
          toast({
            title: error.data ? error.data.message : error.message,
            status: "error",
            isClosable: true
          });
        }
      },
      "data-cy": "deleteTopic"
    }))))), isCurrent && (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, (0,external_emotion_react_.jsx)(common/* GridItem */.P4, {
      p: 3,
      light: {
        bg: "white"
      },
      dark: {
        bg: "gray.700"
      }
    }, projectDescription ? (0,external_emotion_react_.jsx)(react_.Box, {
      className: "ql-editor"
    }, (0,external_emotion_react_.jsx)("div", {
      dangerouslySetInnerHTML: {
        __html: external_isomorphic_dompurify_default().sanitize(projectDescription)
      }
    })) : isProjectCreator ? (0,external_emotion_react_.jsx)(common/* Link */.rU, {
      onClick: () => {
        setProjectModalState({
          isOpen: true,
          project: orgProject
        });
      },
      variant: "underline"
    }, "Cliquez ici pour ajouter la description du projet.") : (0,external_emotion_react_.jsx)(react_.Text, {
      fontStyle: "italic"
    }, "Aucune description.")), (0,external_emotion_react_.jsx)(common/* GridItem */.P4, {
      light: {
        bg: bgColor
      },
      dark: {
        bg: bgColor
      },
      overflowX: "auto",
      borderBottomRadius: "xl"
    }, isProjectCreator ? (0,external_emotion_react_.jsx)(react_.Table, null, (0,external_emotion_react_.jsx)(react_.Tbody, null, Array.isArray(orgProject.projectNotified) && orgProject.projectNotified.length > 0 ? orgProject.projectNotified.map(({
      email,
      status
    }) => (0,external_emotion_react_.jsx)(react_.Tr, null, (0,external_emotion_react_.jsx)(react_.Td, null, email), (0,external_emotion_react_.jsx)(react_.Td, null, (0,external_emotion_react_.jsx)(react_.Tag, {
      variant: "solid",
      colorScheme: status === Project/* StatusTypes.PENDING */.Sk.PENDING ? "blue" : status === Project/* StatusTypes.OK */.Sk.OK ? "green" : "red"
    }, Project/* StatusTypesV */.EE[status])))) : (0,external_emotion_react_.jsx)(react_.Tr, null, (0,external_emotion_react_.jsx)(react_.Td, null, (0,external_emotion_react_.jsx)(react_.Text, {
      fontStyle: "italic"
    }, "Personne n'a indiqu\xE9 participer."))))) : (0,external_emotion_react_.jsx)(ProjectAttendingForm, {
      project: orgProject,
      orgQuery: orgQuery
    }))));
  })), projectModalState.isOpen && session && (0,external_emotion_react_.jsx)(ProjectModal, {
    session: session,
    project: projectModalState.project,
    org: org,
    isCreator: isCreator,
    isFollowed: isFollowed,
    isSubscribed: isSubscribed,
    onCancel: () => setProjectModalState(ProjectsList_objectSpread(ProjectsList_objectSpread({}, projectModalState), {}, {
      isOpen: false,
      project: undefined
    })),
    onSubmit: async project => {
      orgQuery.refetch(); // subQuery.refetch();

      setProjectModalState(ProjectsList_objectSpread(ProjectsList_objectSpread({}, projectModalState), {}, {
        isOpen: false,
        project: undefined
      }));
      setCurrentProject(project ? project : null);
    },
    onClose: () => setProjectModalState(ProjectsList_objectSpread(ProjectsList_objectSpread({}, projectModalState), {}, {
      isOpen: false,
      project: undefined
    }))
  }));
};
// EXTERNAL MODULE: ./src/features/forms/OrgForm.tsx
var OrgForm = __webpack_require__(5088);
;// CONCATENATED MODULE: ./src/features/orgs/OrgConfigBannerPanel.tsx
function OrgConfigBannerPanel_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function OrgConfigBannerPanel_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { OrgConfigBannerPanel_ownKeys(Object(source), true).forEach(function (key) { OrgConfigBannerPanel_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { OrgConfigBannerPanel_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function OrgConfigBannerPanel_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function OrgConfigBannerPanel_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = OrgConfigBannerPanel_objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function OrgConfigBannerPanel_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }














const OrgConfigBannerPanel = (_ref) => {
  var _org$orgBanner, _org$orgBanner2, _org$orgBanner3, _org$orgBanner4;

  let {
    org,
    orgQuery,
    isVisible,
    setIsVisible
  } = _ref,
      props = OrgConfigBannerPanel_objectWithoutProperties(_ref, ["org", "orgQuery", "isVisible", "setIsVisible"]);

  const toast = (0,react_.useToast)({
    position: "top"
  }); //#region local state

  const {
    0: heights,
    1: setHeights
  } = (0,external_react_.useState)([{
    label: "Petit",
    height: 140
  }, {
    label: "Moyen",
    height: 240
  }, {
    label: "Grand",
    height: 340
  }]);
  const {
    0: uploadType,
    1: setUploadType
  } = (0,external_react_.useState)((_org$orgBanner = org.orgBanner) !== null && _org$orgBanner !== void 0 && _org$orgBanner.url ? "url" : "local");
  const {
    0: upImg,
    1: setUpImg
  } = (0,external_react_.useState)(null);
  const setEditorRef = (0,external_react_.useRef)(null); //#endregion
  //#region form state

  const {
    register,
    control,
    handleSubmit,
    setError,
    errors,
    clearErrors,
    getValues,
    setValue,
    watch
  } = (0,external_react_hook_form_.useForm)({
    mode: "onChange"
  });
  const defaultHeight = ((_org$orgBanner2 = org.orgBanner) === null || _org$orgBanner2 === void 0 ? void 0 : _org$orgBanner2.height) || heights[0].height;
  const formHeight = watch("height") || defaultHeight; //#endregion
  //#region org

  const [editOrg, editOrgMutation] = (0,orgsApi/* useEditOrgMutation */.iO)(); // useEffect(() => {
  //   if (org.orgBanner?.url)
  //     getMeta(org.orgBanner.url, (width, height) => {
  //       console.log("url height", height);
  //       setHeights(heights.filter(({ height: h }) => h < height));
  //     });
  // }, [org.orgBanner?.url]);
  //#endregion

  const onSubmit = async form => {
    console.log("submitted", form);

    try {
      let payload = {};

      if (uploadType === "url") {
        payload = {
          orgBanner: {
            url: form.url,
            height: form.height
          }
        };
      } else {
        var _setEditorRef$current;

        payload = {
          orgBanner: {
            height: form.height,
            mode: form.mode,
            base64: setEditorRef === null || setEditorRef === void 0 ? void 0 : (_setEditorRef$current = setEditorRef.current) === null || _setEditorRef$current === void 0 ? void 0 : _setEditorRef$current.getImageScaledToCanvas().toDataURL()
          }
        };
      }

      await editOrg({
        payload,
        orgUrl: org.orgUrl
      });
      toast({
        title: "L'image de couverture a bien été modifiée !",
        status: "success"
      });
      orgQuery.refetch();
      setIsVisible(OrgConfigBannerPanel_objectSpread(OrgConfigBannerPanel_objectSpread({}, isVisible), {}, {
        banner: false
      }));
    } catch (error) {
      (0,utils_form/* handleError */.S)(error, message => setError("formErrorMessage", {
        type: "manual",
        message
      }));
    }
  };

  return (0,external_emotion_react_.jsx)(common/* Grid */.rj, props, (0,external_emotion_react_.jsx)(common/* Link */.rU, {
    variant: "no-underline",
    onClick: () => setIsVisible(OrgConfigBannerPanel_objectSpread(OrgConfigBannerPanel_objectSpread({}, isVisible), {}, {
      banner: !isVisible.banner,
      logo: false
    }))
  }, (0,external_emotion_react_.jsx)(common/* GridHeader */.Q1, {
    borderTopRadius: "lg",
    borderBottomRadius: !isVisible.banner ? "lg" : undefined,
    alignItems: "center"
  }, (0,external_emotion_react_.jsx)(react_.Flex, {
    flexDirection: "row",
    alignItems: "center"
  }, isVisible.banner ? (0,external_emotion_react_.jsx)(icons_.ChevronDownIcon, null) : (0,external_emotion_react_.jsx)(icons_.ChevronRightIcon, null), (0,external_emotion_react_.jsx)(react_.Heading, {
    size: "sm",
    py: 3
  }, "Changer l'image de couverture")))), isVisible.banner && (0,external_emotion_react_.jsx)(common/* GridItem */.P4, {
    light: {
      bg: "orange.100"
    },
    dark: {
      bg: "gray.500"
    }
  }, (0,external_emotion_react_.jsx)(react_.Box, {
    p: 5
  }, (0,external_emotion_react_.jsx)("form", {
    method: "post",
    onChange: () => {
      clearErrors("formErrorMessage");
    },
    onSubmit: handleSubmit(onSubmit)
  }, (0,external_emotion_react_.jsx)(error_message_.ErrorMessage, {
    errors: errors,
    name: "formErrorMessage",
    render: ({
      message
    }) => (0,external_emotion_react_.jsx)(react_.Alert, {
      status: "error",
      mb: 3
    }, (0,external_emotion_react_.jsx)(react_.AlertIcon, null), (0,external_emotion_react_.jsx)(common/* ErrorMessageText */.h1, null, message))
  }), (0,external_emotion_react_.jsx)(react_.RadioGroup, {
    name: "uploadType",
    mb: 3
  }, (0,external_emotion_react_.jsx)(react_.Stack, {
    spacing: 2
  }, (0,external_emotion_react_.jsx)(react_.Radio, {
    isChecked: uploadType === "local",
    onChange: () => {
      setUploadType("local"); //setUpImg(org.orgBanner?.base64 || null);
    }
  }, "Envoyer une image depuis votre ordinateur"), (0,external_emotion_react_.jsx)(react_.Radio, {
    isChecked: uploadType === "url",
    onChange: () => {
      setUploadType("url"); //setUpImg(org.orgBanner?.url || null);
      //setUpImg(null);
    }
  }, "Utiliser une image en provenance d'une autre adresse"))), (0,external_emotion_react_.jsx)(react_.FormControl, {
    id: "height",
    mb: 3
  }, (0,external_emotion_react_.jsx)(react_.FormLabel, null, "Hauteur"), (0,external_emotion_react_.jsx)(common/* Select */.Ph, {
    name: "height",
    ref: register(),
    defaultValue: defaultHeight
  }, heights.map(({
    label,
    height: h
  }) => (0,external_emotion_react_.jsx)("option", {
    key: "height-" + h,
    value: h
  }, label)))), uploadType === "url" ? (0,external_emotion_react_.jsx)(UrlControl/* UrlControl */.I, {
    name: "url",
    register: register,
    control: control,
    errors: errors,
    label: "Adresse internet de l'image",
    defaultValue: (_org$orgBanner3 = org.orgBanner) === null || _org$orgBanner3 === void 0 ? void 0 : _org$orgBanner3.url,
    isMultiple: false
  }) : (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, (0,external_emotion_react_.jsx)(react_.FormControl, {
    id: "file",
    isInvalid: !!errors["file"],
    mb: 3
  }, (0,external_emotion_react_.jsx)(react_.FormLabel, null, "Image"), (0,external_emotion_react_.jsx)(common/* Input */.II, {
    height: "auto",
    py: 3,
    name: "file",
    type: "file",
    accept: "image/*",
    onChange: async e => {
      if (e.target.files && e.target.files[0]) {
        if (e.target.files[0].size < 1000000) {
          setUpImg(await getBase64(e.target.files[0])); // const reader = new FileReader();
          // reader.addOrgListener("load", () =>
          //   setUpImg(reader.result)
          // );
          //reader.readAsDataURL(e.target.files[0]);

          clearErrors("file");
        }
      }
    },
    ref: register({
      validate: file => {
        if (file && file[0] && file[0].size >= 1000000) {
          return "L'image ne doit pas dépasser 1Mo.";
        }

        return true;
      }
    })
  }), (0,external_emotion_react_.jsx)(react_.FormErrorMessage, null, (0,external_emotion_react_.jsx)(error_message_.ErrorMessage, {
    errors: errors,
    name: "file"
  })))), (0,external_emotion_react_.jsx)(react_.Box, {
    mb: 3
  }, uploadType === "url" ? (0,external_emotion_react_.jsx)(react_.Image, {
    src: getValues("url") || ((_org$orgBanner4 = org.orgBanner) === null || _org$orgBanner4 === void 0 ? void 0 : _org$orgBanner4.url)
  }) : upImg && (0,external_emotion_react_.jsx)((external_react_avatar_editor_default()), {
    ref: setEditorRef,
    image: upImg,
    width: 1154,
    height: parseInt(formHeight),
    border: 0,
    color: [255, 255, 255, 0.6] // RGBA
    ,
    scale: 1,
    rotate: 0
  })), (0,external_emotion_react_.jsx)(common/* Button */.zx, {
    colorScheme: "green",
    type: "submit",
    isLoading: editOrgMutation.isLoading,
    isDisabled: Object.keys(errors).length > 0
  }, "Valider")))));
};
// EXTERNAL MODULE: external "@react-icons/all-files/io/IoIosPerson.js"
var IoIosPerson_js_ = __webpack_require__(1869);
// EXTERNAL MODULE: ./src/features/users/usersApi.ts
var usersApi = __webpack_require__(4616);
;// CONCATENATED MODULE: ./src/features/orgs/OrgConfigSubscribersPanel.tsx


function OrgConfigSubscribersPanel_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function OrgConfigSubscribersPanel_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { OrgConfigSubscribersPanel_ownKeys(Object(source), true).forEach(function (key) { OrgConfigSubscribersPanel_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { OrgConfigSubscribersPanel_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function OrgConfigSubscribersPanel_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function OrgConfigSubscribersPanel_EMOTION_STRINGIFIED_CSS_ERROR_() { return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop)."; }





















var OrgConfigSubscribersPanel_ref =  true ? {
  name: "15zbsul",
  styles: "/*\n                  @media (max-width: 452px) {\n                    & > tr {\n                      td {\n                        padding: 0 12px 0 0;\n                      }\n\n                      td:first-of-type {\n                        padding: 4px 0 4px 4px;\n\n                        & > span:first-of-type {\n                          margin-bottom: 4px;\n                        }\n                      }\n                    }\n                  }\n\n                  @media (min-width: 453px) and (max-width: 604px) {\n                    & > tr {\n                      td:first-of-type {\n                        & > span:first-of-type {\n                          margin-bottom: 4px;\n                        }\n                      }\n                    }\n                  }\n                */"
} : 0;

var _ref2 =  true ? {
  name: "7sy4z5",
  styles: ".chakra-checkbox__control{border-color:black;}"
} : 0;

var OrgConfigSubscribersPanel_ref3 =  true ? {
  name: "12bhwe5",
  styles: "@media (max-width: 730px){&{grid-column:1;padding-bottom:12px;}}"
} : 0;

var _ref4 =  true ? {
  name: "15qy8yo",
  styles: "@media (max-width: 730px){&{padding-top:12px;padding-bottom:12px;}}"
} : 0;

const OrgConfigSubscribersPanel = ({
  org,
  orgQuery,
  subQuery,
  isVisible,
  setIsVisible
}) => {
  const {
    colorMode
  } = (0,react_.useColorMode)();
  const isDark = colorMode === "dark";
  const router = (0,router_.useRouter)();
  const toast = (0,react_.useToast)({
    position: "top"
  });
  const dispatch = (0,store/* useAppDispatch */.TL)(); //#region subscription

  const [addSubscription, addSubscriptionMutation] = (0,subscriptionsApi/* useAddSubscriptionMutation */.h_)();
  const [deleteSubscription, deleteSubscriptionMutation] = (0,subscriptionsApi/* useDeleteSubscriptionMutation */.l_)(); //#endregion
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
    getValues,
    trigger
  } = (0,external_react_hook_form_.useForm)({
    mode: "onChange"
  }); //#endregion
  //#region local state

  const {
    0: isAdd,
    1: setIsAdd
  } = (0,external_react_.useState)(false);
  const {
    0: isLoading,
    1: setIsLoading
  } = (0,external_react_.useState)(false);
  const {
    0: isSubscriptionLoading,
    1: setIsSubscriptionLoading
  } = (0,external_react_.useState)(org.orgSubscriptions.reduce((obj, subscription) => {
    return OrgConfigSubscribersPanel_objectSpread(OrgConfigSubscribersPanel_objectSpread({}, obj), {}, {
      [subscription._id]: false
    });
  }, {})); //#endregion

  const onTagClick = async ({
    type,
    following,
    subscribing,
    email,
    phone,
    user,
    subscription
  }) => {
    if (isSubscriptionLoading[subscription._id]) return;
    setIsSubscriptionLoading(OrgConfigSubscribersPanel_objectSpread(OrgConfigSubscribersPanel_objectSpread({}, isSubscriptionLoading), {}, {
      [subscription._id]: true
    }));
    const userEmail = typeof user === "object" ? user.email : email;

    if (type === Subscription/* SubscriptionTypes.FOLLOWER */.NY.FOLLOWER) {
      if (following) {
        const unsubscribe = confirm(`Êtes vous sûr de vouloir retirer ${userEmail} de la liste des abonnés ${(0,Org/* orgTypeFull */.rY)(org.orgType)} ${org.orgName} ?`);

        if (unsubscribe) {
          await deleteSubscription({
            subscriptionId: subscription._id,
            payload: {
              orgs: [following]
            }
          });
          orgQuery.refetch();
        }
      } else {
        await addSubscription({
          email,
          phone,
          user,
          payload: {
            orgs: [{
              orgId: org._id,
              org,
              type: Subscription/* SubscriptionTypes.FOLLOWER */.NY.FOLLOWER
            }]
          }
        });
        orgQuery.refetch();
      }
    } else if (type === Subscription/* SubscriptionTypes.SUBSCRIBER */.NY.SUBSCRIBER) {
      if (subscribing) {
        const unsubscribe = confirm(`Êtes vous sûr de vouloir retirer ${userEmail} de la liste des adhérents ${(0,Org/* orgTypeFull */.rY)(org.orgType)} ${org.orgName} ?`);

        if (unsubscribe) {
          await deleteSubscription({
            subscriptionId: subscription._id,
            payload: {
              orgs: [subscribing]
            }
          });
          orgQuery.refetch();
          subQuery.refetch();
        }
      } else {
        await addSubscription({
          email,
          phone,
          user,
          payload: {
            orgs: [{
              orgId: org._id,
              org,
              type: Subscription/* SubscriptionTypes.SUBSCRIBER */.NY.SUBSCRIBER
            }]
          }
        });
        orgQuery.refetch();
      }
    }

    setIsSubscriptionLoading(OrgConfigSubscribersPanel_objectSpread(OrgConfigSubscribersPanel_objectSpread({}, isSubscriptionLoading), {}, {
      [subscription._id]: false
    }));
  };

  const onSubmit = async (form) => {
    try {
      setIsLoading(true);
      console.log("submitted", form);
      const {
        emailList,
        phoneList,
        subscriptionType
      } = form;
      const emailArray = emailList.split(/(\s+)/).filter(e => e.trim().length > 0).filter(email => utils_email/* emailR.test */.GN.test(email));
      const phoneArray = phoneList.split(/(\s+)/).filter(e => e.trim().length > 0).filter(phone => string/* phoneR.test */.S9.test(phone));

      if (!emailArray.length && !phoneArray.length) {
        throw new Error("Aucune coordonnée valide");
      }

      for (const email of emailArray) {
        for (const type of subscriptionType) {
          await addSubscription({
            email,
            payload: {
              orgs: [{
                orgId: org._id,
                org,
                type
              }]
            }
          });
        }
      }

      for (const phone of phoneArray) {
        for (const type of subscriptionType) {
          await addSubscription({
            phone,
            payload: {
              orgs: [{
                orgId: org._id,
                org,
                type
              }]
            }
          });
        }
      }

      setIsVisible(OrgConfigSubscribersPanel_objectSpread(OrgConfigSubscribersPanel_objectSpread({}, isVisible), {}, {
        subscribers: true
      }));
      setIsAdd(false);
      orgQuery.refetch();
      subQuery.refetch();
      dispatch((0,eventSlice/* refetchEvent */.pK)());
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

  return (0,external_emotion_react_.jsx)(react_.Grid, null, (0,external_emotion_react_.jsx)(common/* Link */.rU, {
    variant: "no-underline",
    onClick: () => {
      if (!(0,array/* hasItems */.t)(org.orgSubscriptions)) {
        setIsAdd(true);
      } else {
        setIsAdd(false);
        setIsVisible(OrgConfigSubscribersPanel_objectSpread(OrgConfigSubscribersPanel_objectSpread({}, isVisible), {}, {
          subscribers: !isVisible.subscribers,
          banner: false
        }));
      }
    }
  }, (0,external_emotion_react_.jsx)(common/* GridHeader */.Q1, {
    borderTopRadius: "lg",
    borderBottomRadius: !isVisible.subscribers ? "lg" : undefined
  }, (0,external_emotion_react_.jsx)(react_.Grid, {
    templateColumns: "1fr auto",
    alignItems: "center"
  }, (0,external_emotion_react_.jsx)(common/* GridItem */.P4, {
    css: _ref4
  }, (0,external_emotion_react_.jsx)(react_.Flex, {
    flexDirection: "row",
    alignItems: "center"
  }, isVisible.subscribers ? (0,external_emotion_react_.jsx)(icons_.ChevronDownIcon, null) : (0,external_emotion_react_.jsx)(icons_.ChevronRightIcon, null), (0,external_emotion_react_.jsx)(react_.Heading, {
    size: "sm"
  }, "Adh\xE9rents & Abonn\xE9s"))), (0,external_emotion_react_.jsx)(common/* GridItem */.P4, {
    css: OrgConfigSubscribersPanel_ref3
  }, (0,external_emotion_react_.jsx)(react_.Button, {
    rightIcon: isAdd ? (0,external_emotion_react_.jsx)(icons_.ChevronDownIcon, null) : (0,external_emotion_react_.jsx)(icons_.ChevronRightIcon, null),
    colorScheme: isAdd ? "green" : "teal",
    onClick: e => {
      e.stopPropagation();
      clearErrors();
      setValue("subscriptionType", []);
      setIsAdd(!isAdd);
      setIsVisible(OrgConfigSubscribersPanel_objectSpread(OrgConfigSubscribersPanel_objectSpread({}, isVisible), {}, {
        subscribers: false
      }));
    },
    m: 1,
    "data-cy": "orgAddSubscribers"
  }, "Ajouter des coordonn\xE9es"))))), isAdd && (0,external_emotion_react_.jsx)(common/* GridItem */.P4, {
    light: {
      bg: "orange.50"
    },
    dark: {
      bg: "gray.700"
    },
    p: 5
  }, (0,external_emotion_react_.jsx)("form", {
    onChange: () => clearErrors("formErrorMessage"),
    onSubmit: handleSubmit(onSubmit)
  }, (0,external_emotion_react_.jsx)(react_.FormControl, {
    id: "emailList",
    isInvalid: !!errors.emailList,
    mb: 3
  }, (0,external_emotion_react_.jsx)(react_.FormLabel, null, "Entrez les e-mails s\xE9par\xE9es par un espace ou un retour \xE0 la ligne :", " "), (0,external_emotion_react_.jsx)(common/* Textarea */.gx, {
    ref: register(),
    name: "emailList",
    dark: {
      _hover: {
        borderColor: "white"
      }
    }
  }), (0,external_emotion_react_.jsx)(react_.FormErrorMessage, null, (0,external_emotion_react_.jsx)(error_message_.ErrorMessage, {
    errors: errors,
    name: "emailList"
  }))), (0,external_emotion_react_.jsx)(react_.FormControl, {
    id: "phoneList",
    isInvalid: !!errors.phoneList,
    mb: 3
  }, (0,external_emotion_react_.jsx)(react_.FormLabel, null, "Entrez les num\xE9ros de t\xE9l\xE9phone mobile s\xE9par\xE9s par un espace ou un retour \xE0 la ligne :", " "), (0,external_emotion_react_.jsx)(common/* Textarea */.gx, {
    ref: register(),
    name: "phoneList",
    dark: {
      _hover: {
        borderColor: "white"
      }
    }
  }), (0,external_emotion_react_.jsx)(react_.FormErrorMessage, null, (0,external_emotion_react_.jsx)(error_message_.ErrorMessage, {
    errors: errors,
    name: "phoneList"
  }))), (0,external_emotion_react_.jsx)(react_.FormControl, {
    id: "subscriptionType",
    isRequired: true,
    isInvalid: !!errors.subscriptionType,
    mb: 3
  }, (0,external_emotion_react_.jsx)(react_.FormLabel, null, "Ajouter les coordonn\xE9es en tant que :"), (0,external_emotion_react_.jsx)(react_.CheckboxGroup, null, (0,external_emotion_react_.jsx)(react_.Box, {
    display: "flex",
    flexDirection: "column",
    css: _ref2,
    color: "black"
  }, (0,external_emotion_react_.jsx)(react_.Checkbox, {
    ref: register({
      required: true
    }),
    name: "subscriptionType",
    value: Subscription/* SubscriptionTypes.SUBSCRIBER */.NY.SUBSCRIBER,
    bg: "purple.100",
    borderRadius: "lg",
    p: 3,
    mb: 3
  }, "Adh\xE9rent", (0,external_emotion_react_.jsx)(react_.Text, {
    fontSize: "smaller"
  }, "La personne aura acc\xE8s aux discussions et \xE9v\xE9nements r\xE9serv\xE9es aux adh\xE9rents.")), (0,external_emotion_react_.jsx)(react_.Checkbox, {
    ref: register({
      required: true
    }),
    name: "subscriptionType",
    value: Subscription/* SubscriptionTypes.FOLLOWER */.NY.FOLLOWER,
    bg: "green.100",
    borderRadius: "lg",
    p: 3
  }, "Abonn\xE9", (0,external_emotion_react_.jsx)(react_.Text, {
    fontSize: "smaller"
  }, "La personne recevra les e-mails d'invitation aux \xE9v\xE9nements.")))), (0,external_emotion_react_.jsx)(react_.FormErrorMessage, null, (0,external_emotion_react_.jsx)(error_message_.ErrorMessage, {
    errors: errors,
    name: "subscriptionType",
    message: "Veuillez cocher une case au minimum"
  }))), (0,external_emotion_react_.jsx)(error_message_.ErrorMessage, {
    errors: errors,
    name: "formErrorMessage",
    render: ({
      message
    }) => (0,external_emotion_react_.jsx)(react_.Alert, {
      status: "error",
      mb: 3
    }, (0,external_emotion_react_.jsx)(react_.AlertIcon, null), (0,external_emotion_react_.jsx)(common/* ErrorMessageText */.h1, null, message))
  }), (0,external_emotion_react_.jsx)(react_.Flex, null, (0,external_emotion_react_.jsx)(react_.Button, {
    onClick: () => setIsAdd(false),
    mr: 3
  }, "Annuler"), (0,external_emotion_react_.jsx)(react_.Button, {
    colorScheme: "green",
    type: "submit",
    isDisabled: Object.keys(errors).length > 0 || Object.keys(isSubscriptionLoading).some(_id => !!isSubscriptionLoading[_id]),
    isLoading: isLoading,
    "data-cy": "orgAddSubscribersSubmit"
  }, "Ajouter")))), isVisible.subscribers && (orgQuery.isLoading ? (0,external_emotion_react_.jsx)(react_.Text, null, "Chargement de la liste des adh\xE9rents & abonn\xE9s...") : (0,external_emotion_react_.jsx)(common/* GridItem */.P4, {
    light: {
      bg: "orange.100"
    },
    dark: {
      bg: "gray.500"
    },
    overflowX: "auto",
    "aria-hidden": true
  }, (0,external_emotion_react_.jsx)(react_.Table, null, (0,external_emotion_react_.jsx)(react_.Tbody, {
    css: OrgConfigSubscribersPanel_ref
  }, org.orgSubscriptions.map((subscription, index) => {
    let {
      email,
      phone,
      user,
      orgs = []
    } = subscription;
    let userEmail, userName;

    if (typeof user === "object") {
      userEmail = user.email;
      userName = user.userName;
    }

    let following = null;
    let subscribing = null;

    for (const orgSubscription of orgs) {
      const {
        type,
        orgId
      } = orgSubscription;
      if (orgId !== org._id || !type) continue;
      if (type === Subscription/* SubscriptionTypes.FOLLOWER */.NY.FOLLOWER) following = orgSubscription;else if (type === Subscription/* SubscriptionTypes.SUBSCRIBER */.NY.SUBSCRIBER) subscribing = orgSubscription;
    }

    return (0,external_emotion_react_.jsx)(react_.Tr, {
      key: `email-${index}`
    }, (0,external_emotion_react_.jsx)(react_.Td, {
      whiteSpace: "nowrap"
    }, (0,external_emotion_react_.jsx)(common/* Link */.rU, {
      variant: "no-underline",
      onClick: () => onTagClick({
        type: Subscription/* SubscriptionTypes.FOLLOWER */.NY.FOLLOWER,
        following,
        email,
        phone,
        user,
        subscription
      }),
      "data-cy": following ? "orgSubscriberUnfollow" : "orgSubscriberFollow"
    }, (0,external_emotion_react_.jsx)(react_.Tooltip, {
      placement: "top",
      hasArrow: true,
      label: `${following ? "Retirer de" : "Ajouter à"} la liste des abonnés`
    }, (0,external_emotion_react_.jsx)(react_.Tag, {
      variant: following ? "solid" : "outline",
      colorScheme: "green",
      mr: 3
    }, (0,external_emotion_react_.jsx)(react_.TagLabel, null, "Abonn\xE9")))), (0,external_emotion_react_.jsx)(common/* Link */.rU, {
      variant: "no-underline",
      onClick: () => onTagClick({
        type: Subscription/* SubscriptionTypes.SUBSCRIBER */.NY.SUBSCRIBER,
        subscribing,
        email,
        phone,
        user,
        subscription
      }),
      "data-cy": subscribing ? "orgSubscriberUnsubscribe" : "orgSubscriberSubscribe"
    }, (0,external_emotion_react_.jsx)(react_.Tooltip, {
      placement: "top",
      hasArrow: true,
      label: `${subscribing ? "Retirer de" : "Ajouter à"} la liste des adhérents`
    }, (0,external_emotion_react_.jsx)(react_.Tag, {
      variant: subscribing ? "solid" : "outline",
      colorScheme: "purple",
      mr: 3
    }, (0,external_emotion_react_.jsx)(react_.TagLabel, null, "Adh\xE9rent"))))), (0,external_emotion_react_.jsx)(react_.Td, {
      width: "100%"
    }, phone || email || userEmail), (0,external_emotion_react_.jsx)(react_.Td, {
      whiteSpace: "nowrap",
      textAlign: "right"
    }, (0,external_emotion_react_.jsx)(react_.Tooltip, {
      label: "Aller \xE0 la page de l'utilisateur",
      hasArrow: true,
      placement: "top"
    }, (0,external_emotion_react_.jsx)(react_.IconButton, {
      "aria-label": "Aller \xE0 la page de l'utilisateur",
      bg: "transparent",
      _hover: {
        bg: "transparent",
        color: "green"
      },
      icon: (0,external_emotion_react_.jsx)(IoIosPerson_js_.IoIosPerson, null),
      isLoading: isSubscriptionLoading[subscription._id],
      height: "auto",
      cursor: isSubscriptionLoading[subscription._id] ? "not-allowed" : undefined,
      onClick: async () => {
        setIsSubscriptionLoading(OrgConfigSubscribersPanel_objectSpread(OrgConfigSubscribersPanel_objectSpread({}, isSubscriptionLoading), {}, {
          [subscription._id]: true
        }));

        if (userName) {
          setIsSubscriptionLoading(OrgConfigSubscribersPanel_objectSpread(OrgConfigSubscribersPanel_objectSpread({}, isSubscriptionLoading), {}, {
            [subscription._id]: false
          }));
          router.push(`/${userName}`, `/${userName}`, {
            shallow: true
          });
        } else {
          const query = await dispatch(usersApi/* getUser.initiate */.PR.initiate(phone || email || ""));

          if (query.data) {
            setIsSubscriptionLoading(OrgConfigSubscribersPanel_objectSpread(OrgConfigSubscribersPanel_objectSpread({}, isSubscriptionLoading), {}, {
              [subscription._id]: false
            }));
            router.push(`/${query.data.userName}`, `/${query.data.userName}`, {
              shallow: true
            });
          } else {
            setIsSubscriptionLoading(OrgConfigSubscribersPanel_objectSpread(OrgConfigSubscribersPanel_objectSpread({}, isSubscriptionLoading), {}, {
              [subscription._id]: false
            }));
            toast({
              status: "warning",
              title: `Aucun utilisateur associé à ${phone ? "ce numéro de téléphone" : "cette adresse-email"}`
            });
          }
        }
      }
    })), (0,external_emotion_react_.jsx)(react_.Tooltip, {
      label: "Supprimer de la liste",
      hasArrow: true,
      placement: "top"
    }, (0,external_emotion_react_.jsx)(react_.IconButton, {
      "aria-label": "D\xE9sinscrire",
      bg: "transparent",
      _hover: {
        bg: "transparent",
        color: "red"
      },
      icon: (0,external_emotion_react_.jsx)(icons_.DeleteIcon, null),
      isLoading: isSubscriptionLoading[subscription._id],
      height: "auto",
      minWidth: 0,
      cursor: isSubscriptionLoading[subscription._id] ? "not-allowed" : undefined,
      onClick: async () => {
        setIsSubscriptionLoading(OrgConfigSubscribersPanel_objectSpread(OrgConfigSubscribersPanel_objectSpread({}, isSubscriptionLoading), {}, {
          [subscription._id]: true
        }));
        const unsubscribe = confirm(`Êtes-vous sûr de vouloir supprimer l'abonnement ${userEmail || subscription.phone} de ${(0,Org/* orgTypeFull */.rY)(org.orgType)} ${org.orgName} ?`);

        if (unsubscribe) {
          await deleteSubscription({
            subscriptionId: subscription._id,
            orgId: org._id
          });
          dispatch((0,eventSlice/* refetchEvent */.pK)());
          orgQuery.refetch();
          subQuery.refetch();
        }

        setIsSubscriptionLoading(OrgConfigSubscribersPanel_objectSpread(OrgConfigSubscribersPanel_objectSpread({}, isSubscriptionLoading), {}, {
          [subscription._id]: false
        }));
      },
      "data-cy": "orgUnsubscribe"
    }))));
  }))))));
};
;// CONCATENATED MODULE: ./src/features/orgs/OrgConfigLogoPanel.tsx
function OrgConfigLogoPanel_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function OrgConfigLogoPanel_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { OrgConfigLogoPanel_ownKeys(Object(source), true).forEach(function (key) { OrgConfigLogoPanel_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { OrgConfigLogoPanel_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function OrgConfigLogoPanel_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function OrgConfigLogoPanel_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = OrgConfigLogoPanel_objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function OrgConfigLogoPanel_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }














const OrgConfigLogoPanel = (_ref) => {
  let {
    org,
    orgQuery,
    isVisible,
    setIsVisible
  } = _ref,
      props = OrgConfigLogoPanel_objectWithoutProperties(_ref, ["org", "orgQuery", "isVisible", "setIsVisible"]);

  const toast = (0,react_.useToast)({
    position: "top"
  });
  const [editOrg, editOrgMutation] = (0,orgsApi/* useEditOrgMutation */.iO)();
  const {
    register,
    handleSubmit,
    setError,
    errors,
    clearErrors,
    watch
  } = (0,external_react_hook_form_.useForm)({
    mode: "onChange"
  });
  const height = 220;
  const width = 220;
  const {
    0: upImg,
    1: setUpImg
  } = (0,external_react_.useState)();
  const setEditorRef = (0,external_react_.useRef)(null);

  const onSubmit = async form => {
    console.log("submitted", form);

    try {
      var _setEditorRef$current;

      await editOrg({
        payload: OrgConfigLogoPanel_objectSpread(OrgConfigLogoPanel_objectSpread({}, org), {}, {
          orgLogo: {
            width,
            height,
            base64: setEditorRef === null || setEditorRef === void 0 ? void 0 : (_setEditorRef$current = setEditorRef.current) === null || _setEditorRef$current === void 0 ? void 0 : _setEditorRef$current.getImageScaledToCanvas().toDataURL()
          }
        }),
        orgUrl: org.orgUrl
      });
      toast({
        title: `Le logo ${(0,Org/* orgTypeFull */.rY)(org.orgType)} a bien été modifié !`,
        status: "success"
      });
      orgQuery.refetch();
      setIsVisible(OrgConfigLogoPanel_objectSpread(OrgConfigLogoPanel_objectSpread({}, isVisible), {}, {
        banner: false
      }));
    } catch (error) {
      (0,utils_form/* handleError */.S)(error, message => setError("formErrorMessage", {
        type: "manual",
        message
      }));
    }
  };

  return (0,external_emotion_react_.jsx)(react_.Grid, props, (0,external_emotion_react_.jsx)(common/* Link */.rU, {
    variant: "no-underline",
    onClick: () => setIsVisible(OrgConfigLogoPanel_objectSpread(OrgConfigLogoPanel_objectSpread({}, isVisible), {}, {
      logo: !isVisible.logo,
      banner: false,
      subscribers: false
    }))
  }, (0,external_emotion_react_.jsx)(common/* GridHeader */.Q1, {
    borderTopRadius: "lg",
    borderBottomRadius: !isVisible.logo ? "lg" : undefined,
    alignItems: "center"
  }, (0,external_emotion_react_.jsx)(react_.Flex, {
    flexDirection: "row",
    alignItems: "center"
  }, isVisible.logo ? (0,external_emotion_react_.jsx)(icons_.ChevronDownIcon, null) : (0,external_emotion_react_.jsx)(icons_.ChevronRightIcon, null), (0,external_emotion_react_.jsx)(react_.Heading, {
    size: "sm",
    py: 3
  }, "Changer le logo")))), isVisible.logo && (0,external_emotion_react_.jsx)(common/* GridItem */.P4, {
    light: {
      bg: "orange.100"
    },
    dark: {
      bg: "gray.500"
    }
  }, (0,external_emotion_react_.jsx)(react_.Box, {
    p: 5
  }, (0,external_emotion_react_.jsx)("form", {
    method: "post",
    onChange: () => {
      clearErrors("formErrorMessage");
    },
    onSubmit: handleSubmit(onSubmit)
  }, (0,external_emotion_react_.jsx)(error_message_.ErrorMessage, {
    errors: errors,
    name: "formErrorMessage",
    render: ({
      message
    }) => (0,external_emotion_react_.jsx)(react_.Alert, {
      status: "error",
      mb: 3
    }, (0,external_emotion_react_.jsx)(react_.AlertIcon, null), (0,external_emotion_react_.jsx)(common/* ErrorMessageText */.h1, null, message))
  }), (0,external_emotion_react_.jsx)(react_.FormControl, {
    id: "file",
    isInvalid: !!errors["file"],
    mb: 3
  }, (0,external_emotion_react_.jsx)(react_.FormLabel, null, "Image"), (0,external_emotion_react_.jsx)(common/* Input */.II, {
    height: "auto",
    py: 3,
    name: "file",
    type: "file",
    accept: "image/*",
    onChange: async e => {
      if (e.target.files && e.target.files[0]) {
        if (e.target.files[0].size < 1000000) {
          setUpImg(await getBase64(e.target.files[0])); // const reader = new FileReader();
          // reader.addEventListener("load", () =>
          //   setUpImg(reader.result)
          // );
          //reader.readAsDataURL(e.target.files[0]);

          clearErrors("file");
        }
      }
    },
    ref: register({
      validate: file => {
        if (file && file[0] && file[0].size >= 1000000) {
          return "L'image ne doit pas dépasser 1Mo.";
        }

        return true;
      }
    })
  }), (0,external_emotion_react_.jsx)(react_.FormErrorMessage, null, (0,external_emotion_react_.jsx)(error_message_.ErrorMessage, {
    errors: errors,
    name: "file"
  }))), upImg && (0,external_emotion_react_.jsx)((external_react_avatar_editor_default()), {
    ref: setEditorRef,
    image: upImg,
    width: width,
    height: height,
    border: 0,
    color: [255, 255, 255, 0.6] // RGBA
    ,
    scale: 1,
    rotate: 0,
    style: {
      marginBottom: "12px"
    }
  }), (0,external_emotion_react_.jsx)(common/* Button */.zx, {
    colorScheme: "green",
    type: "submit",
    isLoading: editOrgMutation.isLoading,
    isDisabled: Object.keys(errors).length > 0
  }, "Valider")))));
};
;// CONCATENATED MODULE: ./src/features/orgs/OrgConfigPanel.tsx
function OrgConfigPanel_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function OrgConfigPanel_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { OrgConfigPanel_ownKeys(Object(source), true).forEach(function (key) { OrgConfigPanel_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { OrgConfigPanel_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function OrgConfigPanel_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function OrgConfigPanel_EMOTION_STRINGIFIED_CSS_ERROR_() { return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop)."; }














var OrgConfigPanel_ref =  true ? {
  name: "1vkc4pg",
  styles: "&:hover{--tw-bg-opacity:1;background-color:rgba(110, 231, 183, var(--tw-bg-opacity));;}"
} : 0;

const OrgConfigPanel = ({
  session,
  org,
  orgQuery,
  subQuery,
  isConfig,
  isEdit,
  isVisible,
  setIsConfig,
  setIsEdit,
  setIsVisible
}) => {
  const router = (0,router_.useRouter)();
  const toast = (0,react_.useToast)({
    position: "top"
  });
  const [deleteOrg, deleteQuery] = (0,orgsApi/* useDeleteOrgMutation */.Xt)();
  const {
    0: isDisabled,
    1: setIsDisabled
  } = (0,external_react_.useState)(true);
  const {
    0: orgType,
    1: setOrgType
  } = (0,external_react_.useState)();
  return (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, (0,external_emotion_react_.jsx)(react_.Box, {
    mb: 3
  }, !isEdit && (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, (0,external_emotion_react_.jsx)(common/* Button */.zx, {
    "aria-label": "Modifier",
    leftIcon: (0,external_emotion_react_.jsx)(react_.Icon, {
      as: isEdit ? icons_.ArrowBackIcon : icons_.EditIcon
    }),
    mr: 3,
    onClick: () => {
      setIsEdit(!isEdit);
      setIsVisible(OrgConfigPanel_objectSpread(OrgConfigPanel_objectSpread({}, isVisible), {}, {
        banner: false,
        subscribers: false
      }));
    },
    css: OrgConfigPanel_ref,
    "data-cy": "orgEdit"
  }, "Modifier"), (0,external_emotion_react_.jsx)(common/* DeleteButton */.m1, {
    isDisabled: isDisabled,
    isLoading: deleteQuery.isLoading,
    header: (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, "Vous \xEAtes sur le point de supprimer l'organisation", (0,external_emotion_react_.jsx)(react_.Text, {
      display: "inline",
      color: "red",
      fontWeight: "bold"
    }, ` ${org.orgName}`)),
    body: (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, "Saisissez le nom de l'organisation pour confimer sa suppression :", (0,external_emotion_react_.jsx)(common/* Input */.II, {
      autoComplete: "off",
      onChange: e => setIsDisabled(e.target.value !== org.orgName)
    })),
    onClick: async () => {
      try {
        const deletedOrg = await deleteOrg(org.orgUrl).unwrap();

        if (deletedOrg) {
          await router.push(`/`);
          toast({
            title: `${deletedOrg.orgName} a bien été supprimé !`,
            status: "success",
            isClosable: true
          });
        }
      } catch (error) {
        toast({
          title: error.data ? error.data.message : error.message,
          status: "error",
          isClosable: true
        });
      }
    }
  }))), isEdit ? (0,external_emotion_react_.jsx)(OrgForm/* OrgForm */.f, {
    session: session,
    org: org,
    onCancel: () => setIsEdit(false),
    onSubmit: async orgUrl => {
      if (org && orgUrl !== org.orgUrl) {
        await router.push(`/${orgUrl}`);
      } else {
        orgQuery.refetch();
        setIsEdit(false);
        setIsConfig(false);
      }
    }
  }) : (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, (0,external_emotion_react_.jsx)(OrgConfigLogoPanel, {
    org: org,
    orgQuery: orgQuery,
    isVisible: isVisible,
    setIsVisible: setIsVisible,
    mb: 3
  }), (0,external_emotion_react_.jsx)(OrgConfigBannerPanel, {
    org: org,
    orgQuery: orgQuery,
    isVisible: isVisible,
    setIsVisible: setIsVisible,
    mb: 3
  }), (0,external_emotion_react_.jsx)(OrgConfigSubscribersPanel, {
    org: org,
    orgQuery: orgQuery,
    subQuery: subQuery,
    isVisible: isVisible,
    setIsVisible: setIsVisible
  })));
};
;// CONCATENATED MODULE: external "@react-icons/all-files/fa/FaImages.js"
var FaImages_js_namespaceObject = require("@react-icons/all-files/fa/FaImages.js");;
;// CONCATENATED MODULE: external "@react-icons/all-files/fa/FaTools.js"
var FaTools_js_namespaceObject = require("@react-icons/all-files/fa/FaTools.js");;
;// CONCATENATED MODULE: ./src/features/orgs/OrgPageTabs.tsx




function OrgPageTabs_EMOTION_STRINGIFIED_CSS_ERROR_() { return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop)."; }

function OrgPageTabs_extends() { OrgPageTabs_extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return OrgPageTabs_extends.apply(this, arguments); }

function OrgPageTabs_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = OrgPageTabs_objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function OrgPageTabs_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

//@ts-nocheck






var OrgPageTabs_ref3 =  true ? {
  name: "1utmw3m",
  styles: "-webkit-overflow-scrolling:touch;-ms-overflow-style:-ms-autohiding-scrollbar"
} : 0;

const OrgPageTabs = (_ref) => {
  let {
    children
  } = _ref,
      props = OrgPageTabs_objectWithoutProperties(_ref, ["children"]);

  const StyledTab = (0,react_.chakra)("button", {
    themeKey: "Tabs.Tab"
  });
  const inactiveTabBg = (0,react_.useColorModeValue)("gray.100", "whiteAlpha.300");
  const {
    0: currentTabIndex,
    1: setCurrentTabIndex
  } = (0,external_react_.useState)(0);
  const defaultTabIndex = 0;
  const CustomTab = /*#__PURE__*/external_react_default().forwardRef((_ref2, ref) => {
    let {
      icon,
      tabIndex
    } = _ref2,
        props = OrgPageTabs_objectWithoutProperties(_ref2, ["icon", "tabIndex"]);

    const tabProps = (0,react_.useTab)(props);
    tabProps.tabIndex = 0;

    if (currentTabIndex === tabIndex) {
      tabProps["aria-selected"] = true;
    }

    const styles = (0,react_.useStyles)();
    return (0,external_emotion_react_.jsx)(StyledTab, OrgPageTabs_extends({
      display: "flex",
      flex: external_react_device_detect_.isMobile ? "0 0 auto" : "1" //flex="0 0 auto"
      ,
      alignItems: "center",
      justifyContent: "center",
      bg: inactiveTabBg,
      mx: 1,
      _focus: {
        boxShadow: "none"
      }
    }, tabProps, {
      __css: styles.tab
    }), (0,external_emotion_react_.jsx)("span", {
      style: {
        display: "inline-flex",
        flexShrink: "0",
        marginInlineEnd: "0.5rem"
      }
    }, (0,external_emotion_react_.jsx)(react_.Icon, {
      as: icon,
      boxSize: 5,
      verticalAlign: "middle"
    })), tabProps.children);
  });
  return (0,external_emotion_react_.jsx)(react_.Tabs, {
    defaultIndex: defaultTabIndex,
    index: currentTabIndex,
    onChange: index => setCurrentTabIndex(index),
    isFitted: true,
    variant: "solid-rounded",
    borderWidth: 1,
    borderColor: "gray.200",
    borderRadius: "lg",
    isManual: true,
    isLazy: true,
    lazyBehavior: "keepMounted"
  }, (0,external_emotion_react_.jsx)(react_.TabList, {
    as: "nav",
    display: "flex",
    flexWrap: "nowrap",
    alignItems: "center",
    height: "60px",
    overflowX: "auto" //borderBottom="0"
    ,
    mx: 3,
    css: OrgPageTabs_ref3,
    "aria-hidden": true
  }, [{
    name: "Accueil",
    icon: FaHome_js_namespaceObject.FaHome
  }, {
    name: "Événements",
    icon: icons_.CalendarIcon
  }, {
    name: "Projets",
    icon: FaTools_js_namespaceObject.FaTools
  }, {
    name: "Discussions",
    icon: icons_.ChatIcon
  }, {
    name: "Galerie",
    icon: FaImages_js_namespaceObject.FaImages
  }].map(({
    name,
    icon
  }, tabIndex) => (0,external_emotion_react_.jsx)(CustomTab, {
    key: `orgTab-${tabIndex}`,
    tabIndex: tabIndex,
    icon: icon,
    "data-cy": `orgTab-${name}`
  }, name))), children);
};
// EXTERNAL MODULE: ./src/features/orgs/orgSlice.ts
var orgSlice = __webpack_require__(1442);
;// CONCATENATED MODULE: ./src/features/orgs/OrgPage.tsx



function OrgPage_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = OrgPage_objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function OrgPage_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function OrgPage_EMOTION_STRINGIFIED_CSS_ERROR_() { return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop)."; }




























let cachedRefetchOrg = false;
let OrgPage_cachedRefetchSubscription = false;
let OrgPage_cachedEmail;

var OrgPage_ref =  true ? {
  name: "vs73z9",
  styles: "@media (max-width: 650px){&{grid-template-columns:1fr!important;}}"
} : 0;

const OrgPage = (_ref2) => {
  var _org$orgEmail, _org$orgPhone, _org$orgWeb;

  let {
    populate
  } = _ref2,
      props = OrgPage_objectWithoutProperties(_ref2, ["populate"]);

  const router = (0,router_.useRouter)();
  const {
    data,
    loading: isSessionLoading
  } = (0,useAuth/* useSession */.k)();
  const session = data || props.session;
  const toast = (0,react_.useToast)({
    position: "top"
  });
  const userEmail = (0,external_react_redux_.useSelector)(userSlice/* selectUserEmail */.I_) || (session === null || session === void 0 ? void 0 : session.user.email); //#region org

  const orgQuery = (0,orgsApi/* useGetOrgQuery */.iA)({
    orgUrl: props.org.orgUrl,
    populate
  }, {
    selectFromResult: query => query
  });
  const org = orgQuery.data || props.org;
  const refetchOrg = (0,external_react_redux_.useSelector)(orgSlice/* selectOrgRefetch */.s$);
  (0,external_react_.useEffect)(() => {
    if (refetchOrg !== cachedRefetchOrg) {
      cachedRefetchOrg = refetchOrg;
      console.log("refetching org");
      orgQuery.refetch();
    }
  }, [refetchOrg]);
  (0,external_react_.useEffect)(() => {
    if (userEmail !== OrgPage_cachedEmail) {
      OrgPage_cachedEmail = userEmail;
      console.log("refetching org with new email", userEmail);
      orgQuery.refetch();
    }
  }, [userEmail]);
  (0,external_react_.useEffect)(() => {
    console.log("refetching org with new route", router.asPath);
    orgQuery.refetch();
    setIsEdit(false);
  }, [router.asPath]);
  const orgCreatedByUserName = typeof org.createdBy === "object" ? org.createdBy.userName || org.createdBy._id : "";
  const orgCreatedByUserId = typeof org.createdBy === "object" ? org.createdBy._id : "";
  const isCreator = (session === null || session === void 0 ? void 0 : session.user.userId) === orgCreatedByUserId || (session === null || session === void 0 ? void 0 : session.user.isAdmin);
  const publicEvents = org.orgEvents.filter(orgEvent => orgEvent.eventVisibility === Event/* Visibility.PUBLIC */.Hk.PUBLIC); //#endregion
  //#region sub

  const [addSubscription, addSubscriptionMutation] = (0,subscriptionsApi/* useAddSubscriptionMutation */.h_)();
  const subQuery = (0,subscriptionsApi/* useGetSubscriptionQuery */.xu)(userEmail);
  const refetchSubscription = (0,external_react_redux_.useSelector)(subscriptionSlice/* selectSubscriptionRefetch */.di);
  (0,external_react_.useEffect)(() => {
    if (refetchSubscription !== OrgPage_cachedRefetchSubscription) {
      OrgPage_cachedRefetchSubscription = refetchSubscription;
      console.log("refetching subscription");
      subQuery.refetch();
    }
  }, [refetchSubscription]);
  (0,external_react_.useEffect)(() => {
    if (userEmail !== OrgPage_cachedEmail) {
      OrgPage_cachedEmail = userEmail;
      console.log("refetching subscription with new email", userEmail);
      subQuery.refetch();
    }
  }, [userEmail]);
  const isFollowed = (0,subscriptionSlice/* isFollowedBy */.C3)({
    org,
    subQuery
  });
  const isSubscribed = (0,subscriptionSlice/* isSubscribedBy */.eM)(org, subQuery); //#endregion
  //#region local state

  const {
    0: isEventModalOpen,
    1: setIsEventModalOpen
  } = (0,external_react_.useState)(false);
  const {
    0: isLogin,
    1: setIsLogin
  } = (0,external_react_.useState)(0);
  const {
    0: isConfig,
    1: setIsConfig
  } = (0,external_react_.useState)(false);
  const {
    0: isEdit,
    1: setIsEdit
  } = (0,external_react_.useState)(false);
  const {
    0: isVisible,
    1: setIsVisible
  } = (0,external_react_.useState)({
    logo: false,
    banner: false,
    topics: false,
    subscribers: false
  }); //#endregion

  const addEvent = () => {
    if (!isSessionLoading) {
      if (!session) setIsLogin(isLogin + 1);else if (isCreator) setIsEventModalOpen(true);
    }
  };

  return (0,external_emotion_react_.jsx)(layout/* Layout */.Ar, {
    org: org,
    isLogin: isLogin,
    session: props.session
  }, isCreator && !isConfig ? (0,external_emotion_react_.jsx)(common/* Button */.zx, {
    colorScheme: "teal",
    leftIcon: (0,external_emotion_react_.jsx)(icons_.SettingsIcon, {
      boxSize: 6,
      "data-cy": "orgSettings"
    }),
    onClick: () => setIsConfig(true),
    mb: 2
  }, "Param\xE8tres ", (0,Org/* orgTypeFull */.rY)(org.orgType)) : isConfig && !isEdit ? (0,external_emotion_react_.jsx)(common/* Button */.zx, {
    colorScheme: "pink",
    leftIcon: (0,external_emotion_react_.jsx)(icons_.ArrowBackIcon, {
      boxSize: 6
    }),
    onClick: () => setIsConfig(false),
    mb: 2
  }, `Revenir ${(0,Org/* orgTypeFull2 */.pP)(org.orgType)}`) : null, !subQuery.isLoading && !isConfig && (0,external_emotion_react_.jsx)(react_.Flex, {
    flexDirection: "row",
    flexWrap: "wrap",
    mt: -3
  }, isFollowed && (0,external_emotion_react_.jsx)(react_.Box, {
    mr: 3,
    mt: 3
  }, (0,external_emotion_react_.jsx)(SubscriptionPopover, {
    org: org,
    query: orgQuery,
    subQuery: subQuery,
    followerSubscription: isFollowed //isLoading={subQuery.isLoading || subQuery.isFetching}

  })), (0,external_emotion_react_.jsx)(react_.Box, {
    mt: 3
  }, (0,external_emotion_react_.jsx)(SubscriptionPopover, {
    org: org,
    query: orgQuery,
    subQuery: subQuery,
    followerSubscription: isFollowed,
    notifType: "push" //isLoading={subQuery.isLoading || subQuery.isFetching}

  }))), (0,external_emotion_react_.jsx)(react_.Box, {
    my: 3
  }, (0,external_emotion_react_.jsx)(react_.Text, {
    fontSize: "smaller"
  }, "Organisation ajout\xE9e le", " ", (0,external_date_fns_.format)((0,external_date_fns_.parseISO)(org.createdAt), "eeee d MMMM yyyy", {
    locale: fr/* default */.Z
  }), " ", "par :", " ", (0,external_emotion_react_.jsx)(common/* Link */.rU, {
    variant: "underline",
    href: `/${orgCreatedByUserName}`
  }, orgCreatedByUserName), " ", isCreator && !(session !== null && session !== void 0 && session.user.isAdmin) && "(Vous)")), isSubscribed && !isConfig && (0,external_emotion_react_.jsx)(react_.Alert, {
    status: "info",
    mb: 3
  }, (0,external_emotion_react_.jsx)(react_.AlertIcon, null), (0,external_emotion_react_.jsx)(react_.Box, null, (0,external_emotion_react_.jsx)(react_.Text, null, "Vous \xEAtes adh\xE9rent ", (0,Org/* orgTypeFull */.rY)(org.orgType), " ", org.orgName, ".", (0,external_emotion_react_.jsx)(react_.Text, {
    fontSize: "smaller"
  }, "Vous avez donc acc\xE8s aux \xE9v\xE9nements et discussions r\xE9serv\xE9es aux adh\xE9rents.")))), !isConfig && (0,external_emotion_react_.jsx)(OrgPageTabs, null, (0,external_emotion_react_.jsx)(react_.TabPanels, null, (0,external_emotion_react_.jsx)(react_.TabPanel, {
    "aria-hidden": true
  }, (0,external_emotion_react_.jsx)(react_.Grid // templateColumns="minmax(425px, 1fr) minmax(200px, 1fr) minmax(200px, 1fr)"
  , {
    gridGap: 5,
    css: OrgPage_ref
  }, (0,external_emotion_react_.jsx)(common/* GridItem */.P4, {
    light: {
      bg: "orange.100"
    },
    dark: {
      bg: "gray.500"
    },
    borderTopRadius: "lg"
  }, (0,external_emotion_react_.jsx)(react_.Grid, {
    templateRows: "auto 1fr"
  }, (0,external_emotion_react_.jsx)(common/* GridHeader */.Q1, {
    borderTopRadius: "lg",
    alignItems: "center"
  }, (0,external_emotion_react_.jsx)(react_.Heading, {
    size: "sm",
    py: 3
  }, "Coordonn\xE9es")), (0,external_emotion_react_.jsx)(common/* GridItem */.P4, {
    light: {
      bg: "orange.100"
    },
    dark: {
      bg: "gray.500"
    }
  }, (0,external_emotion_react_.jsx)(react_.Box, {
    p: 5
  }, org.orgAddress && (0,external_emotion_react_.jsx)(react_.Flex, {
    flexDirection: "column"
  }, (0,external_emotion_react_.jsx)(react_.Flex, {
    alignItems: "center"
  }, (0,external_emotion_react_.jsx)(react_.Icon, {
    as: FaMapMarkedAlt_js_.FaMapMarkedAlt,
    mr: 3
  }), org.orgAddress)), org.orgEmail && (0,external_emotion_react_.jsx)(react_.Flex, {
    flexDirection: "column"
  }, (_org$orgEmail = org.orgEmail) === null || _org$orgEmail === void 0 ? void 0 : _org$orgEmail.map(({
    email
  }, index) => (0,external_emotion_react_.jsx)(react_.Flex, {
    key: `email-${index}`,
    alignItems: "center"
  }, (0,external_emotion_react_.jsx)(icons_.AtSignIcon, {
    mr: 3
  }), (0,external_emotion_react_.jsx)(common/* Link */.rU, {
    variant: "underline",
    href: `mailto:${email}`
  }, email)))), org.orgPhone && (0,external_emotion_react_.jsx)(react_.Flex, {
    flexDirection: "column"
  }, (_org$orgPhone = org.orgPhone) === null || _org$orgPhone === void 0 ? void 0 : _org$orgPhone.map(({
    phone
  }, index) => (0,external_emotion_react_.jsx)(react_.Flex, {
    key: `phone-${index}`,
    alignItems: "center"
  }, (0,external_emotion_react_.jsx)(icons_.PhoneIcon, {
    mr: 3
  }), (0,external_emotion_react_.jsx)(common/* Link */.rU, {
    variant: "underline",
    href: `tel:+33${phone.substr(1, phone.length)}`
  }, phone)))), org.orgWeb && (0,external_emotion_react_.jsx)(react_.Flex, {
    flexDirection: "column"
  }, (_org$orgWeb = org.orgWeb) === null || _org$orgWeb === void 0 ? void 0 : _org$orgWeb.map(({
    url,
    prefix
  }, index) => (0,external_emotion_react_.jsx)(react_.Flex, {
    key: `web-${index}`,
    alignItems: "center"
  }, (0,external_emotion_react_.jsx)(react_.Icon, {
    as: FaGlobeEurope_js_.FaGlobeEurope,
    mr: 3
  }), (0,external_emotion_react_.jsx)(common/* Link */.rU, {
    variant: "underline",
    href: prefix + url
  }, url)))))))), (0,external_emotion_react_.jsx)(common/* GridItem */.P4, {
    rowSpan: 1,
    borderTopRadius: "lg",
    light: {
      bg: "orange.100"
    },
    dark: {
      bg: "gray.500"
    }
  }, (0,external_emotion_react_.jsx)(common/* GridHeader */.Q1, {
    borderTopRadius: "lg",
    alignItems: "center"
  }, (0,external_emotion_react_.jsx)(react_.Flex, {
    flexDirection: "row",
    alignItems: "center"
  }, (0,external_emotion_react_.jsx)(react_.Heading, {
    size: "sm",
    py: 3
  }, "Description ", (0,Org/* orgTypeFull */.rY)(org.orgType)), org.orgDescription && isCreator && (0,external_emotion_react_.jsx)(react_.Tooltip, {
    placement: "bottom",
    label: "Modifier la description"
  }, (0,external_emotion_react_.jsx)(react_.IconButton, {
    "aria-label": "Modifier la description",
    icon: (0,external_emotion_react_.jsx)(icons_.EditIcon, null),
    bg: "transparent",
    ml: 3,
    _hover: {
      color: "green"
    },
    onClick: () => {
      setIsConfig(true);
      setIsEdit(true);
    }
  })))), (0,external_emotion_react_.jsx)(common/* GridItem */.P4, null, (0,external_emotion_react_.jsx)(react_.Box, {
    className: "ql-editor",
    p: 5
  }, org.orgDescription && org.orgDescription.length > 0 ? (0,external_emotion_react_.jsx)("div", {
    dangerouslySetInnerHTML: {
      __html: external_isomorphic_dompurify_default().sanitize(org.orgDescription)
    }
  }) : isCreator ? (0,external_emotion_react_.jsx)(common/* Link */.rU, {
    onClick: () => {
      setIsEdit(true);
      setIsConfig(true);
    },
    variant: "underline"
  }, "Cliquez ici pour ajouter la description", " ", (0,Org/* orgTypeFull */.rY)(org.orgType), ".") : (0,external_emotion_react_.jsx)(react_.Text, {
    fontStyle: "italic"
  }, "Aucune description.")))))), (0,external_emotion_react_.jsx)(react_.TabPanel, {
    "aria-hidden": true
  }, (0,external_emotion_react_.jsx)(EventsList/* EventsList */.i, {
    events: !session ? publicEvents : org.orgEvents,
    org: org,
    orgQuery: orgQuery,
    isCreator: isCreator,
    isSubscribed: isSubscribed,
    isLogin: isLogin,
    setIsLogin: setIsLogin
  }), (0,external_emotion_react_.jsx)(common/* IconFooter */.AW, null)), (0,external_emotion_react_.jsx)(react_.TabPanel, {
    "aria-hidden": true
  }, (0,external_emotion_react_.jsx)(ProjectsList, {
    org: org,
    orgQuery: orgQuery,
    isCreator: isCreator,
    isFollowed: !!isFollowed,
    isSubscribed: isSubscribed,
    isLogin: isLogin,
    setIsLogin: setIsLogin
  }), (0,external_emotion_react_.jsx)(common/* IconFooter */.AW, null)), (0,external_emotion_react_.jsx)(react_.TabPanel, {
    "aria-hidden": true
  }, (isCreator || isSubscribed) && // <DidYouKnow mb={3}>
  //   Le saviez-vous ? Vous pouvez notifier vos abonnés de l'ajout
  //   d'une nouvelle discussion.
  // </DidYouKnow>
  (0,external_emotion_react_.jsx)(react_.Alert, {
    status: "info",
    mb: 5
  }, (0,external_emotion_react_.jsx)(react_.AlertIcon, null), (0,external_emotion_react_.jsx)(react_.Box, null, "Cette section a pour vocation de proposer une alternative plus simple et respectueuse des abonn\xE9es aux", " ", (0,external_emotion_react_.jsx)(react_.Tooltip, {
    label: "synonymes : mailing lists, newsletters"
  }, (0,external_emotion_react_.jsx)(react_.Text, {
    display: "inline",
    borderBottom: "1px dotted black",
    cursor: "pointer"
  }, "listes de diffusion")), ".")), (0,external_emotion_react_.jsx)(TopicsList/* TopicsList */.v, {
    org: org,
    query: orgQuery,
    subQuery: subQuery,
    isCreator: isCreator,
    isFollowed: !!isFollowed,
    isSubscribed: isSubscribed,
    isLogin: isLogin,
    setIsLogin: setIsLogin
  }), (0,external_emotion_react_.jsx)(common/* IconFooter */.AW, null)), (0,external_emotion_react_.jsx)(react_.TabPanel, {
    "aria-hidden": true
  }, (0,external_emotion_react_.jsx)(DocumentsList, {
    org: org,
    query: orgQuery,
    isCreator: isCreator,
    isSubscribed: isSubscribed,
    isLogin: isLogin,
    setIsLogin: setIsLogin
  }), (0,external_emotion_react_.jsx)(common/* IconFooter */.AW, null)))), isConfig && session && (0,external_emotion_react_.jsx)(OrgConfigPanel, {
    session: session,
    org: org,
    orgQuery: orgQuery,
    subQuery: subQuery,
    isConfig: isConfig,
    isEdit: isEdit,
    isVisible: isVisible,
    setIsConfig: setIsConfig,
    setIsEdit: setIsEdit,
    setIsVisible: setIsVisible
  }));
};
;// CONCATENATED MODULE: external "body-scroll-lock"
var external_body_scroll_lock_namespaceObject = require("body-scroll-lock");;
// EXTERNAL MODULE: ./src/features/session/sessionSlice.ts
var sessionSlice = __webpack_require__(6089);
// EXTERNAL MODULE: ./src/features/common/forms/PhoneControl.tsx
var PhoneControl = __webpack_require__(6127);
;// CONCATENATED MODULE: ./src/features/forms/UserForm.tsx
function UserForm_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function UserForm_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { UserForm_ownKeys(Object(source), true).forEach(function (key) { UserForm_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { UserForm_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function UserForm_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
















const UserForm = props => {
  var _props$user$userImage;

  const dispatch = (0,store/* useAppDispatch */.TL)();
  const [addUser, addUserMutation] = (0,usersApi/* useAddUserMutation */.Vx)();
  const [editUser, editUserMutation] = (0,usersApi/* useEditUserMutation */.Gl)();
  const {
    0: isLoading,
    1: setIsLoading
  } = (0,external_react_.useState)(false);
  const {
    control,
    register,
    handleSubmit,
    errors,
    setError,
    clearErrors
  } = (0,external_react_hook_form_.useForm)({
    mode: "onChange"
  });
  const {
    0: upImg,
    1: setUpImg
  } = (0,external_react_.useState)();
  const {
    0: scale,
    1: setScale
  } = (0,external_react_.useState)(1);
  const {
    0: elementLocked,
    1: setElementLocked
  } = (0,external_react_.useState)();

  const disableScroll = target => {
    (0,external_body_scroll_lock_namespaceObject.disableBodyScroll)(target);
  };

  const enableScroll = target => {
    (0,external_body_scroll_lock_namespaceObject.enableBodyScroll)(target);
  };

  const setEditorRef = (0,external_react_.useRef)(null);

  const onChange = () => {
    clearErrors("formErrorMessage");
  };

  const onSubmit = async form => {
    console.log("submitted", form);
    setIsLoading(true);

    const payload = UserForm_objectSpread(UserForm_objectSpread({}, form), {}, {
      userName: props.user.userName !== form.userName ? (0,string/* normalize */.Fv)(form.userName) : undefined
    });

    if (setEditorRef.current) {
      const canvas = setEditorRef.current.getImage();
      const offScreenCanvas = document.createElement("canvas");
      offScreenCanvas.width = 40;
      offScreenCanvas.height = 40;
      const picaCanvas = await getPicaInstance().resize(canvas, offScreenCanvas, {
        alpha: true
      });
      payload.userImage = {
        width: 40,
        height: 40,
        base64: picaCanvas.toDataURL("image/png", 1.0)
      };
    }

    try {
      if (props.user) {
        await editUser({
          payload,
          userName: props.user.userName || props.user._id
        }).unwrap();
        dispatch((0,sessionSlice/* setSession */.KY)(null));
      }

      props.onSubmit && props.onSubmit(payload);
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

  return (0,external_emotion_react_.jsx)("form", {
    onChange: onChange,
    onSubmit: handleSubmit(onSubmit),
    onWheel: e => {
      if (elementLocked) enableScroll(elementLocked.el);
    }
  }, (0,external_emotion_react_.jsx)(error_message_.ErrorMessage, {
    errors: errors,
    name: "formErrorMessage",
    render: ({
      message
    }) => (0,external_emotion_react_.jsx)(react_.Alert, {
      status: "error",
      mb: 3
    }, (0,external_emotion_react_.jsx)(react_.AlertIcon, null), (0,external_emotion_react_.jsx)(common/* ErrorMessageText */.h1, null, message))
  }), (0,external_emotion_react_.jsx)(react_.FormControl, {
    id: "userName",
    isRequired: true,
    isInvalid: !!errors["userName"],
    mb: 3
  }, (0,external_emotion_react_.jsx)(react_.FormLabel, null, "Nom d'utilisateur"), (0,external_emotion_react_.jsx)(react_.Input, {
    name: "userName",
    placeholder: "Nom d'utilisateur",
    ref: register({
      required: "Veuillez saisir le nom de l'utilisateur" // pattern: {
      //   value: /^[a-z0-9 ]+$/i,
      //   message:
      //     "Veuillez saisir un nom composé de lettres et de chiffres uniquement"
      // }

    }),
    defaultValue: props.user.userName
  }), (0,external_emotion_react_.jsx)(react_.FormErrorMessage, null, (0,external_emotion_react_.jsx)(error_message_.ErrorMessage, {
    errors: errors,
    name: "userName"
  }))), (0,external_emotion_react_.jsx)(common/* EmailControl */.sm, {
    name: "email",
    control: control,
    register: register,
    isRequired: true,
    defaultValue: props.user.email,
    errors: errors,
    mb: 3,
    isMultiple: false,
    placeholder: "Cliquez ici pour saisir votre adresse e-mail..."
  }), (0,external_emotion_react_.jsx)(react_.Alert, {
    status: "info",
    mb: 3
  }, (0,external_emotion_react_.jsx)(react_.AlertIcon, null), "Votre e-mail ne sera jamais affich\xE9 publiquement sur le site."), (0,external_emotion_react_.jsx)(PhoneControl/* PhoneControl */.K, {
    name: "phone",
    register: register,
    control: control,
    errors: errors,
    isMultiple: false,
    defaultValue: props.user.phone,
    placeholder: "Cliquez ici pour saisir votre num\xE9ro de t\xE9l\xE9phone..."
  }), (0,external_emotion_react_.jsx)(react_.FormControl, {
    id: "userImage",
    isInvalid: !!errors["userImage"],
    mb: 3
  }, (0,external_emotion_react_.jsx)(react_.FormLabel, null, "Avatar"), (0,external_emotion_react_.jsx)(react_.Tooltip, {
    hasArrow: true,
    label: props.user.userImage ? "Changer l'avatar" : "Définir un avatar",
    placement: "right"
  }, (0,external_emotion_react_.jsx)(react_.Avatar, {
    boxSize: 10,
    name: props.user.userImage ? undefined : props.user.userName,
    src: (_props$user$userImage = props.user.userImage) === null || _props$user$userImage === void 0 ? void 0 : _props$user$userImage.base64,
    mb: 3,
    cursor: "pointer",
    onClick: () => {
      var _document, _document$getElementB;

      (_document = document) === null || _document === void 0 ? void 0 : (_document$getElementB = _document.getElementById("fileInput")) === null || _document$getElementB === void 0 ? void 0 : _document$getElementB.click();
    }
  })), (0,external_emotion_react_.jsx)(react_.Input, {
    id: "fileInput",
    name: "userImage",
    display: "none",
    type: "file",
    accept: "image/*",
    onChange: async ({
      target: {
        files
      }
    }) => {
      if (files) {
        const file = files[0];

        if (file.size < 1000000) {
          setUpImg(await getBase64(file));
          clearErrors("userImage");
        }
      }
    },
    ref: register({
      validate: file => {
        if (file && file[0] && file[0].size >= 1000000) {
          return "L'image ne doit pas dépasser 1Mo.";
        }

        return true;
      }
    })
  }), (0,external_emotion_react_.jsx)(react_.FormErrorMessage, null, (0,external_emotion_react_.jsx)(error_message_.ErrorMessage, {
    errors: errors,
    name: "userImage"
  }))), upImg && (0,external_emotion_react_.jsx)(react_.Box, {
    width: "200px",
    onWheel: e => {
      e.stopPropagation();
      setScale(calculateScale(scale, e.deltaY));
      const el = e.target;
      disableScroll(el);
      if (!elementLocked) setElementLocked({
        el,
        locked: true
      });
    }
  }, (0,external_emotion_react_.jsx)((external_react_avatar_editor_default()), {
    ref: setEditorRef,
    image: upImg,
    border: 0,
    borderRadius: 100,
    color: [255, 255, 255, 0.6] // RGBA
    ,
    scale: scale,
    rotate: 0,
    style: {
      marginBottom: "12px"
    }
  })), (0,external_emotion_react_.jsx)(react_.Button, {
    colorScheme: "green",
    type: "submit",
    isLoading: isLoading,
    isDisabled: Object.keys(errors).length > 0,
    mb: 2
  }, "Modifier"));
};
// EXTERNAL MODULE: ./src/utils/api.ts
var api = __webpack_require__(6837);
;// CONCATENATED MODULE: ./src/features/users/UserPage.tsx
function UserPage_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function UserPage_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { UserPage_ownKeys(Object(source), true).forEach(function (key) { UserPage_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { UserPage_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function UserPage_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function UserPage_EMOTION_STRINGIFIED_CSS_ERROR_() { return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop)."; }














var UserPage_ref =  true ? {
  name: "1vkc4pg",
  styles: "&:hover{--tw-bg-opacity:1;background-color:rgba(110, 231, 183, var(--tw-bg-opacity));;}"
} : 0;

const UserPage = (_ref2) => {
  let props = Object.assign({}, _ref2);
  const router = (0,router_.useRouter)();
  const {
    data: clientSession
  } = (0,useAuth/* useSession */.k)();
  const session = clientSession || props.session;
  const toast = (0,react_.useToast)({
    position: "top"
  });
  const dispatch = (0,store/* useAppDispatch */.TL)(); // const userQuery = useGetUserQuery(props.user.userName || props.user._id);

  const isSelf = props.user._id === (session === null || session === void 0 ? void 0 : session.user.userId);
  const user = isSelf ? UserPage_objectSpread(UserPage_objectSpread({}, props.user), {}, {
    _id: session === null || session === void 0 ? void 0 : session.user.userId,
    email: session === null || session === void 0 ? void 0 : session.user.email,
    userName: session === null || session === void 0 ? void 0 : session.user.userName,
    userImage: session === null || session === void 0 ? void 0 : session.user.userImage,
    isAdmin: session === null || session === void 0 ? void 0 : session.user.isAdmin
  }) : props.user;
  const {
    0: data,
    1: setData
  } = (0,external_react_.useState)();
  const {
    0: isEdit,
    1: setIsEdit
  } = (0,external_react_.useState)(false);
  return (0,external_emotion_react_.jsx)(layout/* Layout */.Ar, {
    pageTitle: user.userName,
    session: session
  }, (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, (0,external_emotion_react_.jsx)(react_.Flex, {
    mb: 5,
    flexDirection: "column"
  }, (isSelf || (session === null || session === void 0 ? void 0 : session.user.isAdmin)) && (0,external_emotion_react_.jsx)(react_.Box, null, (0,external_emotion_react_.jsx)(react_.Button, {
    "aria-label": "Modifier",
    leftIcon: (0,external_emotion_react_.jsx)(react_.Icon, {
      as: isEdit ? icons_.ArrowBackIcon : icons_.EditIcon
    }),
    mr: 3,
    onClick: () => setIsEdit(!isEdit),
    css: UserPage_ref,
    "data-cy": "userEdit"
  }, isEdit ? "Retour" : "Modifier"))), isEdit && (0,external_emotion_react_.jsx)(UserForm, {
    user: user,
    onSubmit: async ({
      userName
    }) => {
      setIsEdit(false);
      toast({
        title: "Votre profil a bien été modifié !",
        status: "success",
        isClosable: true
      });

      if (userName && userName !== user.userName) {
        await router.push(`/${userName}`);
      }
    }
  }), isSelf && (session === null || session === void 0 ? void 0 : session.user.isAdmin) && !isEdit && (0,external_emotion_react_.jsx)(react_.VStack, {
    spacing: 5
  }, (0,external_emotion_react_.jsx)(react_.Button, {
    onClick: () => router.push("/sandbox")
  }, "Sandbox"), (0,external_emotion_react_.jsx)(react_.Button, {
    onClick: async () => {
      const {
        error,
        data
      } = await api/* default.get */.Z.get("admin/backup");
      const a = document.createElement("a");
      const href = window.URL.createObjectURL(new Blob([JSON.stringify(data)], {
        type: "application/json"
      }));
      a.href = href;
      a.download = "data-" + (0,external_date_fns_.format)(new Date(), "dd-MM-yyyy");
      a.click();
      window.URL.revokeObjectURL(href);
    }
  }, "Exporter les donn\xE9es"), (0,external_emotion_react_.jsx)(react_.Textarea, {
    onChange: e => setData(e.target.value),
    placeholder: "Copiez ici les donn\xE9es export\xE9es pr\xE9c\xE9demment"
  }), (0,external_emotion_react_.jsx)(react_.Button, {
    isDisabled: !data,
    onClick: async () => {
      const query = await api/* default.post */.Z.post("admin/backup", data);

      if (query.error) {
        toast({
          status: "error",
          title: query.error.message
        });
      } else {
        toast({
          status: "success",
          title: "Les données ont été importées"
        });
      }
    }
  }, "Importer les donn\xE9es"))));
};
;// CONCATENATED MODULE: ./src/pages/[...name].tsx
function _name_extends() { _name_extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _name_extends.apply(this, arguments); }

function _name_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _name_objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _name_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }
















let populate = "";

const Hash = (_ref) => {
  let {
    email
  } = _ref,
      props = _name_objectWithoutProperties(_ref, ["email"]);

  const dispatch = (0,store/* useAppDispatch */.TL)();
  const router = (0,router_.useRouter)();
  const routeName = router.asPath.substr(1, router.asPath.length);
  const {
    0: event,
    1: setEvent
  } = (0,external_react_.useState)();
  const {
    0: org,
    1: setOrg
  } = (0,external_react_.useState)();
  const {
    0: user,
    1: setUser
  } = (0,external_react_.useState)();
  const {
    0: isLoading,
    1: setIsLoading
  } = (0,external_react_.useState)(true);
  const {
    0: error,
    1: setError
  } = (0,external_react_.useState)();
  const refetchOrg = (0,external_react_redux_.useSelector)(orgSlice/* selectOrgRefetch */.s$);
  (0,external_react_.useEffect)(() => {
    if (email) dispatch((0,userSlice/* setUserEmail */.WG)(email));
  }, []);
  (0,external_react_.useEffect)(() => {
    const xhr = async () => {
      const eventQuery = await dispatch(eventsApi/* getEvent.initiate */.EY.initiate({
        eventUrl: routeName,
        populate: "orgSubscriptions"
      }));

      if (eventQuery.data) {
        setEvent(eventQuery.data);
      } else {
        populate = "orgBanner orgEvents orgLogo orgProjects orgSubscriptions orgTopics";
        const orgQuery = await dispatch(orgsApi/* getOrg.initiate */.tn.initiate({
          orgUrl: routeName,
          populate
        }));

        if (orgQuery.data) {
          setOrg(orgQuery.data);
        } else {
          const userQuery = await dispatch(usersApi/* getUser.initiate */.PR.initiate(routeName));
          if (userQuery.data) setUser(userQuery.data);else setError(new Error("La page demandée n'a pas été trouvée. Vous allez être redirigé vers la page d'accueil dans quelques secondes."));
        }
      }
    };

    setEvent(undefined);
    setOrg(undefined);
    setUser(undefined);
    xhr();
  }, [router.asPath, refetchOrg]);

  if (event) {
    return (0,external_emotion_react_.jsx)(EventPage, _name_extends({
      event: event
    }, props));
  }

  if (org) {
    return (0,external_emotion_react_.jsx)(OrgPage, _name_extends({
      org: org,
      populate: populate
    }, props));
  }

  if (user) {
    return (0,external_emotion_react_.jsx)(UserPage, _name_extends({
      user: user
    }, props));
  }

  if (error) {
    setTimeout(() => {
      router.push("/");
    }, 2000);
  }

  return (0,external_emotion_react_.jsx)(layout/* Layout */.Ar, _name_extends({
    pageTitle: error ? "Page introuvable" : ""
  }, props), isLoading ? (0,external_emotion_react_.jsx)(react_.Spinner, null) : error ? (0,external_emotion_react_.jsx)(react_.Alert, {
    status: "error"
  }, (0,external_emotion_react_.jsx)(react_.AlertIcon, null), error.message) : (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null));
};

/* harmony default export */ var _name_ = (Hash); // export async function getServerSideProps(ctx: GetServerSidePropsContext) {

const getServerSideProps = store/* wrapper.getServerSideProps */.YS.getServerSideProps(store => async ctx => {
  if (!Array.isArray(ctx.query.name) || typeof ctx.query.name[0] !== "string") {
    return {
      props: {}
    };
  }

  let routeName = ctx.query.name[0];

  if (routeName.indexOf(" ") !== -1) {
    const destination = `/${routeName.replace(/\ /g, "_")}`;
    return {
      redirect: {
        permanent: false,
        destination
      }
    };
  }

  if (ctx.query.email) {
    console.log("email", ctx.query.email);
    store.dispatch((0,userSlice/* setUserEmail */.WG)(ctx.query.email)); // todo rehydrate

    return {
      props: {
        email: ctx.query.email
      }
    };
  }

  return {
    props: {}
  };
});

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
var __webpack_exports__ = __webpack_require__.X(0, [1664,5328,8716,9163,8177,6837,4281,8238,3831,4497,1240,8739,1526,1929], function() { return __webpack_exec__(8028); });
module.exports = __webpack_exports__;

})();