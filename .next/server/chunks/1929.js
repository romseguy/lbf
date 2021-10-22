exports.id = 1929;
exports.ids = [1929];
exports.modules = {

/***/ 1929:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "v": function() { return /* binding */ TopicsList; }
});

// EXTERNAL MODULE: external "@chakra-ui/icons"
var icons_ = __webpack_require__(3724);
// EXTERNAL MODULE: external "@chakra-ui/react"
var react_ = __webpack_require__(3426);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(9297);
var external_react_default = /*#__PURE__*/__webpack_require__.n(external_react_);
// EXTERNAL MODULE: ./src/hooks/useAuth.ts
var useAuth = __webpack_require__(8238);
// EXTERNAL MODULE: ./src/features/common/index.tsx + 23 modules
var common = __webpack_require__(1109);
// EXTERNAL MODULE: ./src/features/modals/NotifyModal.tsx
var NotifyModal = __webpack_require__(8739);
// EXTERNAL MODULE: external "@hookform/error-message"
var error_message_ = __webpack_require__(5228);
// EXTERNAL MODULE: external "react-hook-form"
var external_react_hook_form_ = __webpack_require__(2662);
// EXTERNAL MODULE: ./src/features/forum/topicsApi.ts
var topicsApi = __webpack_require__(9830);
// EXTERNAL MODULE: ./src/models/Topic.ts + 1 modules
var Topic = __webpack_require__(3921);
// EXTERNAL MODULE: ./src/utils/form.ts
var utils_form = __webpack_require__(6941);
// EXTERNAL MODULE: external "@emotion/react"
var external_emotion_react_ = __webpack_require__(7381);
;// CONCATENATED MODULE: ./src/features/forms/TopicForm.tsx
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }











const TopicForm = (_ref) => {
  var _props$topic;

  let {
    org,
    event
  } = _ref,
      props = _objectWithoutProperties(_ref, ["org", "event"]);

  const {
    data: session
  } = (0,useAuth/* useSession */.k)();
  const toast = (0,react_.useToast)({
    position: "top"
  });
  const [addTopic, addTopicMutation] = (0,topicsApi/* useAddTopicMutation */.EZ)();
  const [editTopic, editTopicMutation] = (0,topicsApi/* useEditTopicMutation */.m$)();
  const {
    0: isLoading,
    1: setIsLoading
  } = (0,external_react_.useState)(false);
  const visibilityOptions = [];

  if (org && org.orgName !== "aucourant" || event) {
    if (org) {
      visibilityOptions.push(Topic/* Visibility.PUBLIC */.EE.PUBLIC);

      if (props.isCreator) {
        visibilityOptions.push(Topic/* Visibility.FOLLOWERS */.EE.FOLLOWERS);
        visibilityOptions.push(Topic/* Visibility.SUBSCRIBERS */.EE.SUBSCRIBERS);
      } else if (props.isSubscribed) {
        visibilityOptions.push(Topic/* Visibility.SUBSCRIBERS */.EE.SUBSCRIBERS);
      }
    } else if (event) {
      visibilityOptions.push(Topic/* Visibility.PUBLIC */.EE.PUBLIC);

      if (props.isCreator || props.isFollowed) {
        visibilityOptions.push(Topic/* Visibility.FOLLOWERS */.EE.FOLLOWERS);
      }
    }
  }

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

  const onChange = () => {
    clearErrors("formErrorMessage");
  };

  const onSubmit = async (form) => {
    console.log("submitted", form);
    if (!session) return;
    setIsLoading(true);
    const topicMessages = form.topicMessage ? [{
      message: form.topicMessage,
      createdBy: session.user.userId
    }] : [];
    const payload = {
      org,
      event,
      topic: {
        topicName: form.topicName,
        topicMessages,
        topicVisibility: !form.topicVisibility ? Topic/* Visibility */.EE[Topic/* Visibility.PUBLIC */.EE.PUBLIC] : form.topicVisibility,
        createdBy: session.user.userId
      }
    };

    try {
      if (props.topic) {
        await editTopic({
          payload: _objectSpread(_objectSpread({}, payload.topic), {}, {
            topicMessages: payload.topic.topicMessages.concat(props.topic.topicMessages)
          }),
          topicId: props.topic._id
        }).unwrap();
        toast({
          title: "Votre discussion a bien été modifiée",
          status: "success",
          isClosable: true
        });
        props.onSubmit && props.onSubmit(props.topic);
      } else {
        const topic = await addTopic({
          payload,
          topicNotif: form.topicNotif
        }).unwrap();
        toast({
          title: "Votre discussion a bien été ajoutée !",
          status: "success",
          isClosable: true
        });
        props.onSubmit && props.onSubmit(topic);
      }

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
    id: "topicName",
    isRequired: true,
    isInvalid: !!errors["topicName"],
    mb: 3
  }, (0,external_emotion_react_.jsx)(react_.FormLabel, null, "Objet de la discussion"), (0,external_emotion_react_.jsx)(react_.Input, {
    name: "topicName",
    placeholder: "Objet de la discussion",
    ref: register({
      required: "Veuillez saisir l'objet de la discussion"
    }),
    defaultValue: props.topic ? props.topic.topicName : ""
  }), (0,external_emotion_react_.jsx)(react_.FormErrorMessage, null, (0,external_emotion_react_.jsx)(error_message_.ErrorMessage, {
    errors: errors,
    name: "topicName"
  }))), !props.topic && (0,external_emotion_react_.jsx)(react_.FormControl, {
    id: "topicMessage",
    isInvalid: !!errors["topicMessage"],
    mb: 3
  }, (0,external_emotion_react_.jsx)(react_.FormLabel, null, "Message (optionnel)"), (0,external_emotion_react_.jsx)(external_react_hook_form_.Controller, {
    name: "topicMessage",
    control: control,
    defaultValue: "",
    render: p => {
      return (0,external_emotion_react_.jsx)(common/* RTEditor */.Qd, {
        defaultValue: "",
        onChange: p.onChange,
        placeholder: "Contenu de votre message"
      });
    }
  }), (0,external_emotion_react_.jsx)(react_.FormErrorMessage, null, (0,external_emotion_react_.jsx)(error_message_.ErrorMessage, {
    errors: errors,
    name: "topicMessage"
  }))), visibilityOptions.length > 0 && (0,external_emotion_react_.jsx)(react_.FormControl, {
    id: "topicVisibility",
    isRequired: true,
    isInvalid: !!errors["topicVisibility"],
    mb: 3
  }, (0,external_emotion_react_.jsx)(react_.FormLabel, null, "Visibilit\xE9"), (0,external_emotion_react_.jsx)(react_.Select, {
    name: "topicVisibility",
    defaultValue: ((_props$topic = props.topic) === null || _props$topic === void 0 ? void 0 : _props$topic.topicVisibility) || Topic/* Visibility */.EE[Topic/* Visibility.PUBLIC */.EE.PUBLIC],
    ref: register({
      required: "Veuillez sélectionner la visibilité de la discussion"
    }),
    placeholder: "S\xE9lectionnez la visibilit\xE9 de la discussion...",
    color: "gray.400"
  }, visibilityOptions.map(key => {
    return (0,external_emotion_react_.jsx)("option", {
      key: key,
      value: key
    }, Topic/* VisibilityV */.XO[key]);
  })), (0,external_emotion_react_.jsx)(react_.FormErrorMessage, null, (0,external_emotion_react_.jsx)(error_message_.ErrorMessage, {
    errors: errors,
    name: "topicVisibility"
  }))), !props.topic && props.isCreator && (0,external_emotion_react_.jsx)(react_.Checkbox, {
    ref: register(),
    name: "topicNotif",
    mb: 3
  }, "Notifier les abonn\xE9s"), (0,external_emotion_react_.jsx)(react_.Flex, {
    justifyContent: "space-between"
  }, (0,external_emotion_react_.jsx)(react_.Button, {
    onClick: () => props.onCancel && props.onCancel()
  }, "Annuler"), (0,external_emotion_react_.jsx)(react_.Button, {
    colorScheme: "green",
    type: "submit",
    isLoading: isLoading || addTopicMutation.isLoading || editTopicMutation.isLoading,
    isDisabled: Object.keys(errors).length > 0,
    "data-cy": "addTopic"
  }, props.topic ? "Modifier" : "Ajouter")));
};
;// CONCATENATED MODULE: ./src/features/modals/TopicModal.tsx




const TopicModal = props => {
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
  }, (0,external_emotion_react_.jsx)(react_.ModalOverlay, null, (0,external_emotion_react_.jsx)(react_.ModalContent, null, (0,external_emotion_react_.jsx)(react_.ModalHeader, null, props.topic ? "Modifier la discussion" : "Ajouter une discussion"), (0,external_emotion_react_.jsx)(react_.ModalCloseButton, null), (0,external_emotion_react_.jsx)(react_.ModalBody, null, (0,external_emotion_react_.jsx)(TopicForm, props)))));
};
// EXTERNAL MODULE: ./src/features/subscriptions/subscriptionsApi.ts
var subscriptionsApi = __webpack_require__(1096);
// EXTERNAL MODULE: external "@react-icons/all-files/fa/FaBell.js"
var FaBell_js_ = __webpack_require__(612);
// EXTERNAL MODULE: external "@react-icons/all-files/fa/FaBellSlash.js"
var FaBellSlash_js_ = __webpack_require__(1054);
;// CONCATENATED MODULE: ./src/features/forms/TopicMessageForm.tsx
function TopicMessageForm_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function TopicMessageForm_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { TopicMessageForm_ownKeys(Object(source), true).forEach(function (key) { TopicMessageForm_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { TopicMessageForm_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function TopicMessageForm_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }










const TopicMessageForm = props => {
  const {
    data: session
  } = (0,useAuth/* useSession */.k)();
  const {
    0: isLoading,
    1: setIsLoading
  } = (0,external_react_.useState)(false);
  const [addTopic, addTopicMutation] = (0,topicsApi/* useAddTopicMutation */.EZ)();
  const toast = (0,react_.useToast)({
    position: "top"
  });
  const {
    0: topicMessageDefaultValue,
    1: setTopicMessageDefaultValue
  } = (0,external_react_.useState)();
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
  } = (0,external_react_hook_form_.useForm)({
    mode: "onChange"
  });

  const onChange = () => {
    clearErrors("formErrorMessage");
  };

  const onSubmit = async form => {
    console.log("submitted", form);
    if (!session) return;
    setIsLoading(true);
    setTopicMessageDefaultValue(topicMessageDefaultValue === undefined ? "" : undefined);
    const payload = {
      org: props.org,
      event: props.event,
      topic: TopicMessageForm_objectSpread(TopicMessageForm_objectSpread({}, props.topic), {}, {
        topicMessages: [{
          message: form.topicMessage,
          createdBy: session.user.userId
        }]
      })
    };

    try {
      await addTopic({
        payload
      }).unwrap();
      toast({
        title: "Votre message a bien été ajouté !",
        status: "success",
        isClosable: true
      });
      props.onSubmit && props.onSubmit(form.topicMessage);
      clearErrors("topicMessage");
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
    id: "topicMessage",
    isRequired: true,
    isInvalid: !!errors["topicMessage"],
    p: 3,
    pb: 3
  }, (0,external_emotion_react_.jsx)(external_react_hook_form_.Controller, {
    name: "topicMessage",
    control: control,
    defaultValue: topicMessageDefaultValue || "",
    rules: {
      required: "Veuillez saisir un message"
    },
    render: p => {
      return (0,external_emotion_react_.jsx)(common/* RTEditor */.Qd, {
        formats: props.formats,
        readOnly: session === null,
        defaultValue: topicMessageDefaultValue,
        onChange: html => {
          clearErrors("topicMessage");
          p.onChange(html === "<p><br></p>" ? "" : html);
        },
        placeholder: session ? "Cliquez ici pour répondre..." : "Connectez vous pour répondre..."
      });
    }
  }), (0,external_emotion_react_.jsx)(react_.FormErrorMessage, null, (0,external_emotion_react_.jsx)(error_message_.ErrorMessage, {
    errors: errors,
    name: "topicMessage"
  }))), (0,external_emotion_react_.jsx)(react_.Flex, {
    justifyContent: props.onCancel ? "space-between" : "flex-end"
  }, props.onCancel && (0,external_emotion_react_.jsx)(react_.Button, {
    onClick: () => props.onCancel && props.onCancel()
  }, "Annuler"), session ? (0,external_emotion_react_.jsx)(react_.Button, {
    colorScheme: "green",
    type: "submit",
    isLoading: isLoading,
    isDisabled: Object.keys(errors).length > 0,
    mr: props.onCancel ? 0 : 3
  }, props.topicMessage ? "Modifier" : "Répondre") : (0,external_emotion_react_.jsx)(react_.Button, {
    variant: "outline",
    onClick: props.onLoginClick,
    mr: 3
  }, "Connexion")));
};
// EXTERNAL MODULE: ./src/utils/date.ts
var date = __webpack_require__(4245);
// EXTERNAL MODULE: external "isomorphic-dompurify"
var external_isomorphic_dompurify_ = __webpack_require__(3082);
var external_isomorphic_dompurify_default = /*#__PURE__*/__webpack_require__.n(external_isomorphic_dompurify_);
;// CONCATENATED MODULE: ./src/features/forum/TopicMessagesList.tsx
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function TopicMessagesList_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function TopicMessagesList_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { TopicMessagesList_ownKeys(Object(source), true).forEach(function (key) { TopicMessagesList_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { TopicMessagesList_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function TopicMessagesList_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function TopicMessagesList_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = TopicMessagesList_objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function TopicMessagesList_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }










const TopicMessagesList = (_ref) => {
  let {
    topic,
    query
  } = _ref,
      props = TopicMessagesList_objectWithoutProperties(_ref, ["topic", "query"]);

  const {
    data: session,
    loading: isSessionLoading
  } = (0,useAuth/* useSession */.k)();
  const {
    colorMode
  } = (0,react_.useColorMode)();
  const isDark = colorMode === "dark";
  const [editTopic, editTopicMutation] = (0,topicsApi/* useEditTopicMutation */.m$)();
  const {
    0: isEdit,
    1: setIsEdit
  } = (0,external_react_.useState)({});
  const {
    0: isLoading,
    1: setIsLoading
  } = (0,external_react_.useState)({});
  if (!topic) return null;
  return (0,external_emotion_react_.jsx)(react_.Flex, _extends({
    flexDirection: "column"
  }, props), (0,external_emotion_react_.jsx)(react_.Box, null, topic.topicMessages.map(({
    _id,
    message,
    createdBy,
    createdAt
  }, index) => {
    let userName = "";
    let userImage;
    let userId = createdBy;

    if (typeof createdBy === "object") {
      var _createdBy$userImage;

      userName = createdBy.userName;
      userImage = (_createdBy$userImage = createdBy.userImage) === null || _createdBy$userImage === void 0 ? void 0 : _createdBy$userImage.base64;
      userId = createdBy._id;
    }

    const {
      timeAgo,
      fullDate
    } = date/* timeAgo */.Sy(createdAt);
    const isCreator = userId === (session === null || session === void 0 ? void 0 : session.user.userId) || (session === null || session === void 0 ? void 0 : session.user.isAdmin);
    return (0,external_emotion_react_.jsx)(react_.Box, {
      key: _id,
      display: "flex",
      pb: 3
    }, (0,external_emotion_react_.jsx)(common/* Link */.rU, {
      variant: "no-underline",
      href: userName
    }, (0,external_emotion_react_.jsx)(react_.Avatar, {
      name: userName,
      boxSize: 10,
      src: userImage
    })), (0,external_emotion_react_.jsx)(react_.Box, {
      ml: 2
    }, (0,external_emotion_react_.jsx)(common/* Container */.W2, {
      borderRadius: 18,
      light: {
        bg: "white"
      },
      dark: {
        bg: "gray.600"
      },
      px: 3,
      "data-cy": "topicMessage"
    }, (0,external_emotion_react_.jsx)(common/* Link */.rU, {
      href: `/${userName}`,
      fontWeight: "bold"
    }, userName), _id && isEdit[_id] && isEdit[_id].isOpen ? (0,external_emotion_react_.jsx)(react_.Box, {
      pt: 1,
      pb: 3
    }, (0,external_emotion_react_.jsx)(common/* RTEditor */.Qd, {
      formats: common/* formats.filter */.bd.filter(f => f !== "size"),
      defaultValue: message,
      onChange: html => {
        setIsEdit(TopicMessagesList_objectSpread(TopicMessagesList_objectSpread({}, isEdit), {}, {
          [_id]: TopicMessagesList_objectSpread(TopicMessagesList_objectSpread({}, isEdit[_id]), {}, {
            html
          })
        }));
      },
      placeholder: "Contenu de votre message"
    }), (0,external_emotion_react_.jsx)(react_.Flex, {
      alignItems: "center",
      justifyContent: "space-between",
      mt: 3
    }, (0,external_emotion_react_.jsx)(react_.Button, {
      onClick: () => setIsEdit(TopicMessagesList_objectSpread(TopicMessagesList_objectSpread({}, isEdit), {}, {
        [_id]: TopicMessagesList_objectSpread(TopicMessagesList_objectSpread({}, isEdit[_id]), {}, {
          isOpen: false
        })
      }))
    }, "Annuler"), (0,external_emotion_react_.jsx)(react_.Button, {
      colorScheme: "green",
      onClick: async () => {
        await editTopic({
          payload: TopicMessagesList_objectSpread(TopicMessagesList_objectSpread({}, topic), {}, {
            topicMessages: topic.topicMessages.map(m => {
              if (m._id === _id) {
                return TopicMessagesList_objectSpread(TopicMessagesList_objectSpread({}, m), {}, {
                  message: isEdit[_id].html || ""
                });
              }

              return m;
            })
          }),
          topicId: topic._id
        }).unwrap();
        query.refetch();
        setIsEdit(TopicMessagesList_objectSpread(TopicMessagesList_objectSpread({}, isEdit), {}, {
          [_id]: TopicMessagesList_objectSpread(TopicMessagesList_objectSpread({}, isEdit[_id]), {}, {
            isOpen: false
          })
        }));
      }
    }, "Modifier"))) : (0,external_emotion_react_.jsx)(react_.Box, {
      className: "ql-editor"
    }, (0,external_emotion_react_.jsx)("div", {
      dangerouslySetInnerHTML: {
        __html: external_isomorphic_dompurify_default().sanitize(message)
      }
    }))), (0,external_emotion_react_.jsx)(common/* Link */.rU, {
      pl: 3,
      fontSize: "smaller",
      "aria-hidden": true
    }, (0,external_emotion_react_.jsx)(react_.Tooltip, {
      placement: "bottom",
      label: fullDate
    }, (0,external_emotion_react_.jsx)("span", null, timeAgo))), isCreator && (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, (0,external_emotion_react_.jsx)("span", {
      "aria-hidden": true
    }, " \xB7 "), (0,external_emotion_react_.jsx)(react_.Tooltip, {
      placement: "bottom",
      label: "Modifier le message"
    }, (0,external_emotion_react_.jsx)(react_.IconButton, {
      "aria-label": "Modifier le message",
      icon: (0,external_emotion_react_.jsx)(icons_.EditIcon, null),
      bg: "transparent",
      height: "auto",
      minWidth: 0,
      _hover: {
        color: "green"
      },
      onClick: e => {
        e.stopPropagation();
        if (_id) setIsEdit(TopicMessagesList_objectSpread(TopicMessagesList_objectSpread({}, isEdit), {}, {
          [_id]: TopicMessagesList_objectSpread(TopicMessagesList_objectSpread({}, isEdit[_id]), {}, {
            isOpen: true
          })
        }));
      }
    })), (0,external_emotion_react_.jsx)("span", {
      "aria-hidden": true
    }, " \xB7 "), (0,external_emotion_react_.jsx)(common/* DeleteButton */.m1, {
      isIconOnly: true,
      isLoading: _id && isLoading[_id] && !query.isLoading && !query.isFetching,
      bg: "transparent",
      height: "auto",
      minWidth: 0,
      _hover: {
        color: "red"
      },
      placement: "bottom",
      header: (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, "\xCAtes vous s\xFBr de vouloir supprimer ce message ?"),
      onClick: async () => {
        _id && setIsLoading({
          [_id]: true
        });

        const payload = TopicMessagesList_objectSpread(TopicMessagesList_objectSpread({}, topic), {}, {
          topicMessages: index === topic.topicMessages.length - 1 ? topic.topicMessages.filter(m => {
            return m._id !== _id;
          }) : topic.topicMessages.map(m => {
            if (m._id === _id) {
              return {
                _id,
                message: "<i>Message supprimé</i>",
                createdBy,
                createdAt
              };
            }

            return m;
          })
        });

        try {
          await editTopic({
            payload,
            topicId: topic._id
          }).unwrap();
          query.refetch();
          _id && setIsLoading({
            [_id]: false
          });
        } catch (error) {
          // todo
          console.error(error);
        }
      }
    }))));
  })));
};
// EXTERNAL MODULE: external "@react-icons/all-files/fa/FaGlobeEurope.js"
var FaGlobeEurope_js_ = __webpack_require__(8237);
// EXTERNAL MODULE: external "@react-icons/all-files/io/IoMdPerson.js"
var IoMdPerson_js_ = __webpack_require__(1917);
;// CONCATENATED MODULE: ./src/features/forum/TopicsListItemVisibility.tsx







const TopicsListItemVisibility = ({
  topicVisibility
}) => topicVisibility === Topic/* Visibility.SUBSCRIBERS */.EE.SUBSCRIBERS ? (0,external_emotion_react_.jsx)(react_.Tooltip, {
  label: "Discussion r\xE9serv\xE9e aux adh\xE9rents"
}, (0,external_emotion_react_.jsx)("span", null, (0,external_emotion_react_.jsx)(react_.Icon, {
  as: IoMdPerson_js_.IoMdPerson,
  boxSize: 4
}))) : topicVisibility === Topic/* Visibility.FOLLOWERS */.EE.FOLLOWERS ? (0,external_emotion_react_.jsx)(react_.Tooltip, {
  label: "Discussion r\xE9serv\xE9e aux abonn\xE9s"
}, (0,external_emotion_react_.jsx)(icons_.EmailIcon, {
  boxSize: 4
})) : topicVisibility === Topic/* Visibility.PUBLIC */.EE.PUBLIC ? (0,external_emotion_react_.jsx)(react_.Tooltip, {
  label: "Discussion publique"
}, (0,external_emotion_react_.jsx)("span", null, (0,external_emotion_react_.jsx)(react_.Icon, {
  as: FaGlobeEurope_js_.FaGlobeEurope,
  boxSize: 4
}))) : null;
;// CONCATENATED MODULE: ./src/features/forum/TopicsListItemSubscribers.tsx






const TopicsListItemSubscribers = ({
  topic,
  isSubbedToTopic
}) => {
  const {
    data: session,
    loading: isSessionLoading
  } = (0,useAuth/* useSession */.k)();
  const query = (0,subscriptionsApi/* useGetSubscriptionsQuery */.Tb)({
    topicId: topic._id
  });
  (0,external_react_.useEffect)(() => query.refetch, [isSubbedToTopic]);
  if (query.isLoading || query.isFetching) return (0,external_emotion_react_.jsx)(react_.Spinner, {
    boxSize: 4
  });
  return Array.isArray(query.data) && query.data.length > 0 ? (0,external_emotion_react_.jsx)(react_.Text, null, "Abonn\xE9s \xE0 la discussion :", " ", query.data.map(subscription => {
    if (typeof subscription.user !== "object") return;
    const userName = subscription.user.userName || (session === null || session === void 0 ? void 0 : session.user.email.replace(/@.+/, ""));
    return (0,external_emotion_react_.jsx)(common/* Link */.rU, {
      key: subscription._id,
      href: `/${userName}`
    }, (0,external_emotion_react_.jsx)(react_.Tag, {
      mr: 1,
      mb: 1
    }, userName));
  })) : (0,external_emotion_react_.jsx)(react_.Text, null, "Aucun abonn\xE9s \xE0 la discussion.");
};
;// CONCATENATED MODULE: ./src/features/forum/TopicsListItem.tsx



function TopicsListItem_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function TopicsListItem_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { TopicsListItem_ownKeys(Object(source), true).forEach(function (key) { TopicsListItem_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { TopicsListItem_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function TopicsListItem_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }











const TopicsListItem = ({
  event,
  org,
  query,
  isSubscribed,
  topic,
  topicIndex,
  isSubbedToTopic,
  isCurrent,
  isCreator,
  isDark,
  isLoading,
  notifyModalState,
  setNotifyModalState,
  onClick,
  onEditClick,
  onDeleteClick,
  onSubscribeClick,
  onLoginClick
}) => {
  var _topic$createdBy$emai;

  const {
    timeAgo,
    fullDate
  } = date/* timeAgo */.Sy(topic.createdAt, true);
  const topicCreatedByUserName = typeof topic.createdBy === "object" ? topic.createdBy.userName || ((_topic$createdBy$emai = topic.createdBy.email) === null || _topic$createdBy$emai === void 0 ? void 0 : _topic$createdBy$emai.replace(/@.+/, "")) : "";
  return (0,external_emotion_react_.jsx)(react_.Box, {
    key: topic._id,
    mb: 5
  }, (0,external_emotion_react_.jsx)(common/* GridItem */.P4, null, (0,external_emotion_react_.jsx)(react_.Link, {
    variant: "no-underline",
    onClick: onClick,
    "data-cy": "topic"
  }, (0,external_emotion_react_.jsx)(common/* Grid */.rj, {
    templateColumns: "auto 1fr auto",
    borderTopRadius: "xl" //borderBottomRadius="xl"
    // borderTopRadius={topicIndex === 0 ? "lg" : undefined}
    ,
    borderBottomRadius: !isCurrent ? "lg" : undefined,
    light: {
      bg: topicIndex % 2 === 0 ? "orange.200" : "orange.100",
      _hover: {
        bg: "orange.300"
      }
    },
    dark: {
      bg: topicIndex % 2 === 0 ? "gray.600" : "gray.500",
      _hover: {
        bg: "gray.400"
      }
    }
  }, (0,external_emotion_react_.jsx)(common/* GridItem */.P4, {
    display: "flex",
    alignItems: "center",
    p: 3
  }, isCurrent ? (0,external_emotion_react_.jsx)(icons_.ViewIcon, {
    boxSize: 6
  }) : (0,external_emotion_react_.jsx)(icons_.ViewOffIcon, {
    boxSize: 6
  })), (0,external_emotion_react_.jsx)(common/* GridItem */.P4, {
    py: 3
  }, (0,external_emotion_react_.jsx)(react_.Box, {
    lineHeight: "1",
    "data-cy": "topicHeader"
  }, (0,external_emotion_react_.jsx)(react_.Text, {
    fontWeight: "bold"
  }, topic.topicName), (0,external_emotion_react_.jsx)(react_.Box, {
    display: "inline",
    fontSize: "smaller",
    color: isDark ? "white" : "gray.600"
  }, topicCreatedByUserName, (0,external_emotion_react_.jsx)("span", {
    "aria-hidden": true
  }, " \xB7 "), (0,external_emotion_react_.jsx)(react_.Tooltip, {
    placement: "bottom",
    label: fullDate
  }, (0,external_emotion_react_.jsx)("span", null, timeAgo)), (0,external_emotion_react_.jsx)("span", {
    "aria-hidden": true
  }, " \xB7 "), (0,external_emotion_react_.jsx)(TopicsListItemVisibility, {
    topicVisibility: topic.topicVisibility
  }), Array.isArray(topic.topicNotified) && isCreator && (isCreator || isSubscribed) && (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, (0,external_emotion_react_.jsx)("span", {
    "aria-hidden": true
  }, " \xB7 "), (0,external_emotion_react_.jsx)(react_.Link, {
    onClick: e => {
      e.stopPropagation();
      setNotifyModalState(TopicsListItem_objectSpread(TopicsListItem_objectSpread({}, notifyModalState), {}, {
        entity: topic
      }));
    }
  }, topic.topicNotified.length, " abonn\xE9s notifi\xE9s"))))), (0,external_emotion_react_.jsx)(common/* GridItem */.P4, {
    display: "flex",
    alignItems: "center"
  }, isLoading ? (0,external_emotion_react_.jsx)(react_.Spinner, {
    mr: 3,
    boxSize: 4
  }) : (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, isCreator && (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, (0,external_emotion_react_.jsx)(react_.Tooltip, {
    placement: "bottom",
    label: "Modifier la discussion"
  }, (0,external_emotion_react_.jsx)(react_.IconButton, {
    "aria-label": "Modifier la discussion",
    icon: (0,external_emotion_react_.jsx)(icons_.EditIcon, null),
    bg: "transparent",
    height: "auto",
    minWidth: 0,
    _hover: {
      color: "green"
    },
    onClick: e => {
      e.stopPropagation();
      onEditClick();
    }
  })), (0,external_emotion_react_.jsx)(react_.Box, {
    "aria-hidden": true,
    mx: 1
  }, "\xB7", " "), (0,external_emotion_react_.jsx)(common/* DeleteButton */.m1, {
    isIconOnly: true,
    placement: "bottom",
    bg: "transparent",
    height: "auto",
    minWidth: 0,
    _hover: {
      color: "red"
    } // isDisabled={isDeleteButtonDisabled}
    ,
    header: (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, "\xCAtes vous s\xFBr de vouloir supprimer la discussion", (0,external_emotion_react_.jsx)(react_.Text, {
      display: "inline",
      color: "red",
      fontWeight: "bold"
    }, ` ${topic.topicName}`), " ", "?"),
    onClick: onDeleteClick,
    "data-cy": "deleteTopic"
  }), (0,external_emotion_react_.jsx)(react_.Box, {
    "aria-hidden": true,
    mx: 1
  }, "\xB7")), (0,external_emotion_react_.jsx)(react_.Tooltip, {
    label: isSubbedToTopic ? "Vous recevez une notification lorsque quelqu'un répond à cette discussion." : "Recevoir un e-mail et une notification lorsque quelqu'un répond à cette discussion.",
    placement: "left"
  }, (0,external_emotion_react_.jsx)("span", null, (0,external_emotion_react_.jsx)(react_.IconButton, {
    "aria-label": isSubbedToTopic ? "Se désabonner de la discussion" : "S'abonner à la discussion",
    icon: isSubbedToTopic ? (0,external_emotion_react_.jsx)(FaBellSlash_js_.FaBellSlash, null) : (0,external_emotion_react_.jsx)(FaBell_js_.FaBell, null),
    bg: "transparent",
    height: "auto",
    minWidth: 0,
    mr: 3,
    _hover: {
      color: isDark ? "lightgreen" : "white"
    },
    onClick: async e => {
      e.stopPropagation();
      onSubscribeClick();
    },
    "data-cy": isSubbedToTopic ? "topicUnsubscribe" : "topicSubscribe"
  }))))))), isCurrent && (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, (0,external_emotion_react_.jsx)(common/* GridItem */.P4, {
    light: {
      bg: "orange.50"
    },
    dark: {
      bg: "gray.700"
    }
  }, (0,external_emotion_react_.jsx)(TopicMessagesList, {
    query: query,
    topic: topic,
    pt: 3,
    px: 3
  })), (0,external_emotion_react_.jsx)(common/* GridItem */.P4, {
    bg: isDark ? "gray.600" : "gray.200",
    borderRadius: "lg",
    p: 3
  }, (0,external_emotion_react_.jsx)(TopicsListItemSubscribers, {
    topic: topic,
    isSubbedToTopic: isSubbedToTopic
  })), (0,external_emotion_react_.jsx)(common/* GridItem */.P4, {
    light: {
      bg: "orange.50"
    },
    dark: {
      bg: "gray.700"
    },
    pb: 3,
    borderBottomRadius: "xl"
  }, (0,external_emotion_react_.jsx)(TopicMessageForm, {
    event: event,
    org: org,
    topic: topic,
    formats: common/* formats.filter */.bd.filter(f => f !== "size"),
    onLoginClick: onLoginClick,
    onSubmit: () => query.refetch()
  })))));
};
;// CONCATENATED MODULE: ./src/features/forum/TopicsList.tsx
function TopicsList_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function TopicsList_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { TopicsList_ownKeys(Object(source), true).forEach(function (key) { TopicsList_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { TopicsList_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function TopicsList_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function TopicsList_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = TopicsList_objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function TopicsList_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }













const TopicsList = (_ref) => {
  let {
    event,
    org,
    query,
    subQuery,
    isLogin,
    setIsLogin
  } = _ref,
      props = TopicsList_objectWithoutProperties(_ref, ["event", "org", "query", "subQuery", "isLogin", "setIsLogin"]);

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
  }); //#region subscription

  const [deleteSubscription, deleteSubscriptionMutation] = (0,subscriptionsApi/* useDeleteSubscriptionMutation */.l_)();
  const [addSubscription, addSubscriptionMutation] = (0,subscriptionsApi/* useAddSubscriptionMutation */.h_)(); //#endregion
  //#region topic

  const postTopicNotifMutation = (0,topicsApi/* usePostTopicNotifMutation */.Vz)();
  const [deleteTopic, deleteTopicMutation] = (0,topicsApi/* useDeleteTopicMutation */.Wn)(); //#endregion
  //#region local state

  const {
    0: isLoading,
    1: setIsLoading
  } = (0,external_react_.useState)({});
  const {
    0: topicModalState,
    1: setTopicModalState
  } = (0,external_react_.useState)({
    isOpen: false,
    entity: null
  });
  const {
    0: notifyModalState,
    1: setNotifyModalState
  } = (0,external_react_.useState)({
    entity: null
  });
  const {
    0: currentTopic,
    1: setCurrentTopic
  } = (0,external_react_.useState)(null);
  const entityName = org ? org.orgName : event === null || event === void 0 ? void 0 : event.eventName;
  let topics = org ? org.orgTopics : event ? event.eventTopics : []; //#endregion

  return (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, (0,external_emotion_react_.jsx)(common/* Button */.zx, {
    colorScheme: "teal",
    leftIcon: (0,external_emotion_react_.jsx)(icons_.AddIcon, null),
    mb: 5,
    onClick: () => {
      if (!isSessionLoading) {
        if (session) {
          //setCurrentTopic(null);
          setTopicModalState(TopicsList_objectSpread(TopicsList_objectSpread({}, topicModalState), {}, {
            isOpen: true
          }));
        } else {
          setIsLogin(isLogin + 1);
        }
      }
    },
    "data-cy": "addTopicForm"
  }, "Ajouter une discussion"), topicModalState.isOpen && (0,external_emotion_react_.jsx)(TopicModal, {
    topic: topicModalState.entity,
    org: org,
    event: event,
    isCreator: props.isCreator,
    isFollowed: props.isFollowed,
    isSubscribed: props.isSubscribed,
    onCancel: () => setTopicModalState(TopicsList_objectSpread(TopicsList_objectSpread({}, topicModalState), {}, {
      isOpen: false,
      entity: null
    })),
    onSubmit: async topic => {
      query.refetch();
      subQuery.refetch();
      setTopicModalState(TopicsList_objectSpread(TopicsList_objectSpread({}, topicModalState), {}, {
        isOpen: false,
        entity: null
      }));
      setCurrentTopic(topic ? topic : null);
    },
    onClose: () => setTopicModalState(TopicsList_objectSpread(TopicsList_objectSpread({}, topicModalState), {}, {
      isOpen: false,
      entity: null
    }))
  }), (0,external_emotion_react_.jsx)(NotifyModal/* NotifyModal */.i, {
    event: event,
    org: org,
    query: query,
    mutation: postTopicNotifMutation,
    setModalState: setNotifyModalState,
    modalState: notifyModalState
  }), (0,external_emotion_react_.jsx)(common/* Grid */.rj, {
    "data-cy": "topicList"
  }, query.isLoading ? (0,external_emotion_react_.jsx)(react_.Spinner, null) : topics.filter(topic => {
    if (entityName === "aucourant") return true;
    let allow = false;

    if (topic.topicVisibility === Topic/* Visibility.PUBLIC */.EE.PUBLIC) {
      allow = true;
    } else {
      if (props.isCreator) {
        allow = true;
      }

      if (props.isSubscribed && topic.topicVisibility === Topic/* Visibility.SUBSCRIBERS */.EE.SUBSCRIBERS) {
        allow = true;
      }

      if (props.isFollowed && topic.topicVisibility === Topic/* Visibility.FOLLOWERS */.EE.FOLLOWERS) {
        allow = true;
      }
    } //console.log(topic.topicVisibility, allow);


    return allow;
  }).map((topic, topicIndex) => {
    const isCurrent = topic._id === (currentTopic === null || currentTopic === void 0 ? void 0 : currentTopic._id);
    const topicCreatedBy = typeof topic.createdBy === "object" ? topic.createdBy._id : topic.createdBy;
    const isCreator = (session === null || session === void 0 ? void 0 : session.user.isAdmin) || topicCreatedBy === (session === null || session === void 0 ? void 0 : session.user.userId);
    let isSubbedToTopic = false;

    if (subQuery.data) {
      isSubbedToTopic = !!subQuery.data.topics.find(({
        topic: t
      }) => t._id === topic._id);
    }

    return (0,external_emotion_react_.jsx)(TopicsListItem, {
      key: topic._id,
      event: event,
      org: org,
      query: query,
      isSubscribed: props.isSubscribed || false,
      topic: topic,
      topicIndex: topicIndex,
      isSubbedToTopic: isSubbedToTopic,
      isCurrent: isCurrent,
      isCreator: isCreator,
      isDark: isDark,
      isLoading: isLoading[topic._id] || query.isLoading,
      notifyModalState: notifyModalState,
      setNotifyModalState: setNotifyModalState,
      onClick: () => setCurrentTopic(isCurrent ? null : topic),
      onEditClick: () => setTopicModalState(TopicsList_objectSpread(TopicsList_objectSpread({}, topicModalState), {}, {
        isOpen: true,
        entity: topic
      })),
      onDeleteClick: async () => {
        setIsLoading({
          [topic._id]: true
        });

        try {
          let deletedTopic = null;

          if (topic._id) {
            deletedTopic = await deleteTopic(topic._id).unwrap();
          }

          if (deletedTopic) {
            subQuery.refetch();
            query.refetch();
            toast({
              title: `${deletedTopic.topicName} a bien été supprimé !`,
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
        } finally {
          setIsLoading({
            [topic._id]: false
          });
        }
      },
      onSubscribeClick: async () => {
        setIsLoading({
          [topic._id]: true
        });

        if (!subQuery.data || !isSubbedToTopic) {
          await addSubscription({
            payload: {
              topics: [{
                topic: topic,
                emailNotif: true,
                pushNotif: true
              }]
            },
            user: session === null || session === void 0 ? void 0 : session.user.userId
          });
          toast({
            title: `Vous êtes abonné à la discussion ${topic.topicName}`,
            status: "success",
            isClosable: true
          });
        } else if (isSubbedToTopic) {
          const unsubscribe = confirm(`Êtes vous sûr de vouloir vous désabonner de la discussion : ${topic.topicName} ?`);

          if (unsubscribe) {
            await deleteSubscription({
              subscriptionId: subQuery.data._id,
              topicId: topic._id
            });
            toast({
              title: `Vous êtes désabonné de ${topic.topicName}`,
              status: "success",
              isClosable: true
            });
          }
        }

        subQuery.refetch();
        setIsLoading({
          [topic._id]: false
        });
      },
      onLoginClick: () => setIsLogin(isLogin + 1)
    });
  })));
};

/***/ })

};
;