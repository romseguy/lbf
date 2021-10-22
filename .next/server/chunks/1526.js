exports.id = 1526;
exports.ids = [1526];
exports.modules = {

/***/ 1526:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "i": function() { return /* binding */ EventsList; }
});

// EXTERNAL MODULE: external "@chakra-ui/icons"
var icons_ = __webpack_require__(3724);
// EXTERNAL MODULE: external "@chakra-ui/react"
var react_ = __webpack_require__(3426);
// EXTERNAL MODULE: external "date-fns"
var external_date_fns_ = __webpack_require__(3879);
// EXTERNAL MODULE: ./node_modules/date-fns/esm/locale/fr/index.js + 9 modules
var fr = __webpack_require__(678);
// EXTERNAL MODULE: external "isomorphic-dompurify"
var external_isomorphic_dompurify_ = __webpack_require__(3082);
var external_isomorphic_dompurify_default = /*#__PURE__*/__webpack_require__.n(external_isomorphic_dompurify_);
// EXTERNAL MODULE: external "next/router"
var router_ = __webpack_require__(6731);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(9297);
var external_react_default = /*#__PURE__*/__webpack_require__.n(external_react_);
// EXTERNAL MODULE: ./src/features/common/index.tsx + 23 modules
var common = __webpack_require__(1109);
// EXTERNAL MODULE: ./src/features/modals/DescriptionModal.tsx
var DescriptionModal = __webpack_require__(5011);
// EXTERNAL MODULE: ./src/features/modals/NotifyModal.tsx
var NotifyModal = __webpack_require__(8739);
// EXTERNAL MODULE: ./src/features/modals/EventModal.tsx
var EventModal = __webpack_require__(5978);
// EXTERNAL MODULE: external "@hookform/error-message"
var error_message_ = __webpack_require__(5228);
// EXTERNAL MODULE: external "react-hook-form"
var external_react_hook_form_ = __webpack_require__(2662);
// EXTERNAL MODULE: external "react-select"
var external_react_select_ = __webpack_require__(724);
var external_react_select_default = /*#__PURE__*/__webpack_require__.n(external_react_select_);
// EXTERNAL MODULE: ./src/hooks/useAuth.ts
var useAuth = __webpack_require__(8238);
// EXTERNAL MODULE: ./src/features/events/eventsApi.ts
var eventsApi = __webpack_require__(9416);
// EXTERNAL MODULE: ./src/features/orgs/orgsApi.ts
var orgsApi = __webpack_require__(2207);
// EXTERNAL MODULE: ./src/utils/form.ts
var utils_form = __webpack_require__(6941);
// EXTERNAL MODULE: external "@emotion/react"
var external_emotion_react_ = __webpack_require__(7381);
;// CONCATENATED MODULE: ./src/features/common/forms/EventForwardForm.tsx
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }













const EventForwardForm = (_ref) => {
  let props = Object.assign({}, _ref);
  const router = (0,router_.useRouter)();
  const {
    data: session
  } = (0,useAuth/* useSession */.k)();
  const toast = (0,react_.useToast)({
    position: "top"
  });
  const [addEvent, addEventMutation] = (0,eventsApi/* useAddEventMutation */.SY)(); //const { data: forwardedEvent } = useGetEventQuery({eventUrl: props.event._id})

  const {
    0: isLoading,
    1: setIsLoading
  } = (0,external_react_.useState)(false); //#region form state

  const {
    control,
    errors,
    handleSubmit,
    setError,
    clearErrors
  } = (0,external_react_hook_form_.useForm)();
  const {
    data: orgs,
    isLoading: isQueryLoading,
    refetch: refetchOrgs
  } = (0,orgsApi/* useGetOrgsQuery */.Gt)({
    populate: "orgSubscriptions orgEvents",
    createdBy: session === null || session === void 0 ? void 0 : session.user.userId
  });
  const myOrgs = orgs === null || orgs === void 0 ? void 0 : orgs.filter(org => !org.orgEvents.find(orgEvent => {
    var _orgEvent$forwardedFr;

    return props.event._id === orgEvent._id || ((_orgEvent$forwardedFr = orgEvent.forwardedFrom) === null || _orgEvent$forwardedFr === void 0 ? void 0 : _orgEvent$forwardedFr.eventId) === props.event._id;
  }));
  (0,external_react_.useEffect)(() => {
    refetchOrgs();
  }, [router.asPath]); //#endregion

  const onChange = () => {
    clearErrors("formErrorMessage");
  };

  const onSubmit = async ({
    orgs
  }) => {
    try {
      setIsLoading(true);
      await addEvent(_objectSpread(_objectSpread({}, props.event), {}, {
        _id: undefined,
        eventName: props.event._id,
        forwardedFrom: {
          eventId: props.event._id
        },
        eventOrgs: orgs,
        createdBy: session === null || session === void 0 ? void 0 : session.user.userId
      }));
      toast({
        title: "L'événement a bien été rediffusé !",
        status: "success",
        isClosable: true
      });
      refetchOrgs();
      props.onSubmit && props.onSubmit();
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
  }), isQueryLoading ? (0,external_emotion_react_.jsx)(react_.Spinner, null) : (0,external_emotion_react_.jsx)(react_.FormControl, {
    mb: 3,
    id: "orgs",
    isInvalid: !!errors.orgs,
    isRequired: true
  }, (0,external_emotion_react_.jsx)(react_.FormLabel, null, "Organisations"), (0,external_emotion_react_.jsx)(external_react_hook_form_.Controller, {
    name: "orgs",
    rules: {
      required: "Veuillez sélectionner une ou plusieurs organisations"
    },
    as: (external_react_select_default()),
    control: control,
    defaultValue: null,
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
  }), (0,external_emotion_react_.jsx)(react_.FormErrorMessage, null, (0,external_emotion_react_.jsx)(error_message_.ErrorMessage, {
    errors: errors,
    name: "orgs"
  }))), (0,external_emotion_react_.jsx)(react_.Flex, {
    justifyContent: "space-between"
  }, (0,external_emotion_react_.jsx)(react_.Button, {
    onClick: () => props.onCancel && props.onCancel()
  }, "Annuler"), (0,external_emotion_react_.jsx)(react_.Button, {
    colorScheme: "green",
    type: "submit",
    isLoading: isLoading,
    isDisabled: Object.keys(errors).length > 0
  }, "Rediffuser")));
};
;// CONCATENATED MODULE: ./src/features/modals/ForwardModal.tsx




const ForwardModal = props => {
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
  }, (0,external_emotion_react_.jsx)(react_.ModalOverlay, null, (0,external_emotion_react_.jsx)(react_.ModalContent, null, (0,external_emotion_react_.jsx)(react_.ModalHeader, null, "Rediffuser l'\xE9v\xE9nement : ", props.event.eventName), (0,external_emotion_react_.jsx)(react_.ModalCloseButton, null), (0,external_emotion_react_.jsx)(react_.ModalBody, null, (0,external_emotion_react_.jsx)(EventForwardForm, props)))));
};
// EXTERNAL MODULE: ./src/features/orgs/orgSlice.ts
var orgSlice = __webpack_require__(1442);
// EXTERNAL MODULE: ./src/models/Event.ts
var Event = __webpack_require__(7823);
// EXTERNAL MODULE: ./src/models/Org.ts
var Org = __webpack_require__(9759);
// EXTERNAL MODULE: ./src/models/Subscription.ts
var Subscription = __webpack_require__(8716);
// EXTERNAL MODULE: ./src/store.ts
var store = __webpack_require__(4281);
// EXTERNAL MODULE: external "@react-icons/all-files/io/IoIosPerson.js"
var IoIosPerson_js_ = __webpack_require__(1869);
// EXTERNAL MODULE: external "@react-icons/all-files/io/IoIosPeople.js"
var IoIosPeople_js_ = __webpack_require__(4244);
// EXTERNAL MODULE: external "@react-icons/all-files/fa/FaRetweet.js"
var FaRetweet_js_ = __webpack_require__(1415);
// EXTERNAL MODULE: external "@react-icons/all-files/fa/FaGlobeEurope.js"
var FaGlobeEurope_js_ = __webpack_require__(8237);
// EXTERNAL MODULE: external "@react-icons/all-files/io/IoMdPerson.js"
var IoMdPerson_js_ = __webpack_require__(1917);
;// CONCATENATED MODULE: ./src/features/events/EventsListItemVisibility.tsx






const EventsListItemVisibility = ({
  eventVisibility
}) => eventVisibility === Event/* Visibility.SUBSCRIBERS */.Hk.SUBSCRIBERS ? (0,external_emotion_react_.jsx)(react_.Tooltip, {
  label: "\xC9v\xE9nement r\xE9serv\xE9 aux adh\xE9rents"
}, (0,external_emotion_react_.jsx)("span", null, (0,external_emotion_react_.jsx)(react_.Icon, {
  as: IoMdPerson_js_.IoMdPerson,
  boxSize: 4
}))) : // : topicVisibility === Visibility.FOLLOWERS ? (
//   <Tooltip label="Événement réservé aux abonnés">
//     <EmailIcon boxSize={4} />
//   </Tooltip>
// )
eventVisibility === Event/* Visibility.PUBLIC */.Hk.PUBLIC ? (0,external_emotion_react_.jsx)(react_.Tooltip, {
  label: "\xC9v\xE9nement public"
}, (0,external_emotion_react_.jsx)("span", null, (0,external_emotion_react_.jsx)(react_.Icon, {
  as: FaGlobeEurope_js_.FaGlobeEurope,
  boxSize: 4
}))) : null;
// EXTERNAL MODULE: ./src/utils/array.ts
var array = __webpack_require__(1609);
;// CONCATENATED MODULE: ./src/features/events/EventsListItem.tsx




function EventsListItem_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function EventsListItem_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { EventsListItem_ownKeys(Object(source), true).forEach(function (key) { EventsListItem_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { EventsListItem_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function EventsListItem_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _EMOTION_STRINGIFIED_CSS_ERROR__() { return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop)."; }














var _ref =  true ? {
  name: "k4khca",
  styles: "letter-spacing:0.1em"
} : 0;

const EventsListItem = (_ref2) => {
  let {
    deleteEvent,
    editEvent,
    editOrg,
    event,
    index,
    isCreator,
    isDark,
    isLoading,
    setIsLoading,
    org,
    orgQuery,
    orgFollowersCount,
    length,
    session,
    eventToForward,
    setEventToForward,
    notifyModalState,
    setNotifyModalState,
    eventToShow,
    setEventToShow,
    toast
  } = _ref2,
      props = _objectWithoutProperties(_ref2, ["deleteEvent", "editEvent", "editOrg", "event", "index", "isCreator", "isDark", "isLoading", "setIsLoading", "org", "orgQuery", "orgFollowersCount", "length", "session", "eventToForward", "setEventToForward", "notifyModalState", "setNotifyModalState", "eventToShow", "setEventToShow", "toast"]);

  const minDate = event.eventMinDate;
  const maxDate = event.eventMaxDate;
  const showIsApproved = org && isCreator;
  const showEventCategory = event.eventCategory ? true : false;
  const showEventVisiblity = !!org;
  const extraColumns = [showIsApproved, showEventCategory, showEventVisiblity].filter(b => b).flatMap(b => "auto ");
  let notifiedCount = 0;
  let canSendCount = 0;

  if (orgFollowersCount && ((session === null || session === void 0 ? void 0 : session.user.userId) === event.createdBy || session !== null && session !== void 0 && session.user.isAdmin)) {
    notifiedCount = Array.isArray(event.eventNotified) ? event.eventNotified.length : 0;
    canSendCount = orgFollowersCount - notifiedCount;
  }

  return (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, (0,external_emotion_react_.jsx)(common/* GridItem */.P4, {
    rowSpan: 3,
    light: {
      bg: "orange.100"
    },
    dark: {
      bg: "gray.500"
    },
    borderBottomLeftRadius: index === length - 1 ? "lg" : undefined
  }, (0,external_emotion_react_.jsx)(react_.Box, {
    pt: 2,
    pl: 2,
    pr: 2
  }, (0,external_emotion_react_.jsx)(react_.Text, {
    pb: 1,
    title:  false ? 0 : undefined
  }, (0,external_date_fns_.format)(minDate, `H'h'${(0,external_date_fns_.getMinutes)(minDate) !== 0 ? "mm" : ""}`, {
    locale: fr/* default */.Z
  })), (0,external_emotion_react_.jsx)(react_.Icon, {
    as: icons_.UpDownIcon
  }), (0,external_emotion_react_.jsx)(react_.Text, {
    pt: 2
  }, (0,external_date_fns_.getDay)(minDate) !== (0,external_date_fns_.getDay)(maxDate) && (0,external_date_fns_.format)(maxDate, `EEEE`, {
    locale: fr/* default */.Z
  }), " ", (0,external_date_fns_.format)(maxDate, `H'h'${(0,external_date_fns_.getMinutes)(maxDate) !== 0 ? "mm" : ""}`, {
    locale: fr/* default */.Z
  })))), (0,external_emotion_react_.jsx)(common/* GridItem */.P4, {
    light: {
      bg: "white"
    },
    dark: {
      bg: "gray.700"
    },
    alignItems: "center"
  }, (0,external_emotion_react_.jsx)(react_.Grid, {
    alignItems: "center",
    css: /*#__PURE__*/(0,external_emotion_react_.css)("grid-template-columns:auto auto ", extraColumns[0], " 1fr;@media (max-width: 700px){grid-template-columns:1fr!important;&:first-of-type{padding-top:4px;}}" + ( true ? "" : 0),  true ? "" : 0)
  }, showIsApproved && (0,external_emotion_react_.jsx)(common/* GridItem */.P4, {
    pl: 1
  }, event.isApproved ? (0,external_emotion_react_.jsx)(react_.Tooltip, {
    label: "\xC9v\xE9nement approuv\xE9"
  }, (0,external_emotion_react_.jsx)(icons_.CheckCircleIcon, {
    color: "green"
  })) : (0,external_emotion_react_.jsx)(react_.Tooltip, {
    label: "\xC9v\xE9nement en attente de mod\xE9ration"
  }, (0,external_emotion_react_.jsx)(icons_.WarningIcon, {
    color: "orange"
  })), org && isCreator && (0,external_emotion_react_.jsx)(react_.Tooltip, {
    label: canSendCount === 0 ? "Tous les abonnés ont reçu l'invitation" : `${canSendCount} abonné${canSendCount > 1 ? "s" : ""} ${(0,Org/* orgTypeFull */.rY)(org.orgType)} ${org.orgName} n'${canSendCount > 1 ? "ont" : "a"} pas encore reçu d'invitation.`
  }, (0,external_emotion_react_.jsx)(react_.IconButton, {
    "aria-label": canSendCount === 0 ? "Aucun abonné à inviter" : `Inviter les abonnés de ${org.orgName}`,
    icon: (0,external_emotion_react_.jsx)(icons_.EmailIcon, null),
    isLoading: isLoading,
    isDisabled: !event.isApproved,
    title: !event.isApproved ? "L'événement est en attente de modération" : "",
    bg: "transparent",
    height: "auto",
    minWidth: 0,
    mx: 2,
    _hover: {
      background: "transparent",
      color: "green"
    },
    onClick: e => {
      setNotifyModalState(EventsListItem_objectSpread(EventsListItem_objectSpread({}, notifyModalState), {}, {
        entity: event
      }));
    }
  }))), typeof event.eventCategory === "number" && (0,external_emotion_react_.jsx)(common/* GridItem */.P4, {
    pl: 1
  }, (0,external_emotion_react_.jsx)(react_.Tag, {
    color: "white",
    bgColor: Event/* Category */.WD[event.eventCategory].bgColor === "transparent" ? isDark ? "whiteAlpha.100" : "blackAlpha.600" : Event/* Category */.WD[event.eventCategory].bgColor,
    mr: 1
  }, Event/* Category */.WD[event.eventCategory].label)), (0,external_emotion_react_.jsx)(common/* GridItem */.P4, {
    pl: 1
  }, (0,external_emotion_react_.jsx)(common/* Link */.rU, {
    className: "rainbow-text",
    css: _ref,
    mr: 1,
    size: "larger",
    href: `/${encodeURIComponent(event.eventUrl)}`,
    shallow: true
  }, event.eventName)), (0,external_emotion_react_.jsx)(common/* GridItem */.P4, {
    whiteSpace: "nowrap",
    pl: 1
  }, org && (0,external_emotion_react_.jsx)(EventsListItemVisibility, {
    eventVisibility: event.eventVisibility
  }), session && !event.forwardedFrom ? (0,external_emotion_react_.jsx)(react_.Tooltip, {
    label: "Rediffuser"
  }, (0,external_emotion_react_.jsx)("span", null, (0,external_emotion_react_.jsx)(react_.IconButton, {
    "aria-label": "Rediffuser",
    icon: (0,external_emotion_react_.jsx)(FaRetweet_js_.FaRetweet, null),
    bg: "transparent",
    _hover: {
      background: "transparent",
      color: "green"
    },
    minWidth: 0,
    ml: 2,
    height: "auto",
    onClick: () => {
      setEventToForward(EventsListItem_objectSpread(EventsListItem_objectSpread({}, event), {}, {
        eventMinDate: (0,external_date_fns_.formatISO)(minDate),
        eventMaxDate: (0,external_date_fns_.formatISO)(maxDate)
      }));
    }
  }))) : org && event.forwardedFrom && event.forwardedFrom.eventId && (session === null || session === void 0 ? void 0 : session.user.userId) === event.createdBy ? (0,external_emotion_react_.jsx)(react_.Tooltip, {
    label: "Annuler la rediffusion"
  }, (0,external_emotion_react_.jsx)(react_.IconButton, {
    "aria-label": "Annuler la rediffusion",
    icon: (0,external_emotion_react_.jsx)(icons_.DeleteIcon, null),
    bg: "transparent",
    height: "auto",
    minWidth: 0,
    ml: 2,
    _hover: {
      background: "transparent",
      color: "red"
    },
    onClick: async () => {
      const confirmed = confirm("Êtes vous sûr de vouloir annuler la rediffusion ?");

      if (confirmed) {
        if (event.eventOrgs.length <= 1) {
          var _event$forwardedFrom;

          await deleteEvent({
            eventUrl: (_event$forwardedFrom = event.forwardedFrom) === null || _event$forwardedFrom === void 0 ? void 0 : _event$forwardedFrom.eventId
          }).unwrap();
        } else {
          var _event$forwardedFrom2;

          await editEvent({
            eventUrl: (_event$forwardedFrom2 = event.forwardedFrom) === null || _event$forwardedFrom2 === void 0 ? void 0 : _event$forwardedFrom2.eventId,
            payload: {
              eventOrgs: event.eventOrgs.filter(eventOrg => typeof eventOrg === "object" ? eventOrg._id !== org._id : eventOrg !== org._id)
            }
          });
          await editOrg({
            orgUrl: org.orgUrl,
            payload: {
              orgEvents: org.orgEvents.filter(orgEvent => orgEvent._id !== event._id)
            }
          });
        }

        orgQuery.refetch();
        toast({
          title: `La rediffusion a bien été annulée.`,
          status: "success",
          isClosable: true
        });
      }
    }
  })) : event.forwardedFrom && event.forwardedFrom.eventId && org && (0,external_emotion_react_.jsx)(react_.Tooltip, {
    label: `Rediffusé par ${org.orgName}`
  }, (0,external_emotion_react_.jsx)("span", null, (0,external_emotion_react_.jsx)(react_.Icon, {
    as: FaRetweet_js_.FaRetweet,
    color: "green",
    ml: 2
  })))))), (0,external_emotion_react_.jsx)(common/* GridItem */.P4, {
    rowSpan: 3,
    light: {
      bg: "orange.100"
    },
    dark: {
      bg: "gray.500"
    },
    borderBottomRightRadius: index === length - 1 ? "lg" : undefined
  }, (0,external_emotion_react_.jsx)(react_.Box, {
    pt: 2,
    pl: 2,
    pr: 2
  }, (0,external_emotion_react_.jsx)(react_.Text, null, event.eventCity || "À définir"))), (0,external_emotion_react_.jsx)(common/* GridItem */.P4, {
    pl: 3,
    pb: 3,
    light: {
      bg: "white"
    },
    dark: {
      bg: "gray.700"
    }
  }, event.eventDescription && event.eventDescription.length > 0 ? (0,external_emotion_react_.jsx)(common/* Link */.rU, {
    variant: "underline",
    onClick: () => setEventToShow(EventsListItem_objectSpread(EventsListItem_objectSpread({}, event), {}, {
      eventMinDate: (0,external_date_fns_.formatISO)(minDate),
      eventMaxDate: (0,external_date_fns_.formatISO)(maxDate)
    }))
  }, "Voir l'affiche de l'\xE9v\xE9nement") : (0,external_emotion_react_.jsx)(react_.Text, {
    fontSize: "smaller"
  }, "Aucune affiche disponible.")), !org && (0,external_emotion_react_.jsx)(common/* GridItem */.P4, {
    light: {
      bg: "white"
    },
    dark: {
      bg: "gray.700"
    },
    pl: 3,
    pb: 3
  }, (0,array/* hasItems */.t)(event.eventOrgs) ? event.eventOrgs.map(eventOrg => {
    return (0,external_emotion_react_.jsx)(common/* Link */.rU, {
      key: eventOrg.orgUrl,
      href: `/${eventOrg.orgUrl}`,
      shallow: true
    }, (0,external_emotion_react_.jsx)(react_.Tag, null, (0,external_emotion_react_.jsx)(react_.Icon, {
      as: IoIosPeople_js_.IoIosPeople,
      mr: 1
    }), eventOrg.orgName));
  }) : typeof event.createdBy === "object" && (0,external_emotion_react_.jsx)(common/* Link */.rU, {
    href: `/${event.createdBy.userName}`,
    shallow: true
  }, (0,external_emotion_react_.jsx)(react_.Tag, null, (0,external_emotion_react_.jsx)(react_.Icon, {
    as: IoIosPerson_js_.IoIosPerson,
    mr: 1
  }), event.createdBy.userName))));
};
;// CONCATENATED MODULE: ./src/features/events/EventsListToggle.tsx
function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function EventsListToggle_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = EventsListToggle_objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function EventsListToggle_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }





const EventsListToggle = (_ref) => {
  let {
    previousEvents,
    showPreviousEvents,
    setShowPreviousEvents,
    currentEvents,
    nextEvents,
    showNextEvents,
    setShowNextEvents
  } = _ref,
      props = EventsListToggle_objectWithoutProperties(_ref, ["previousEvents", "showPreviousEvents", "setShowPreviousEvents", "currentEvents", "nextEvents", "showNextEvents", "setShowNextEvents"]);

  if (!previousEvents.length && !currentEvents.length && !nextEvents.length) return null;
  return (0,external_emotion_react_.jsx)(react_.Flex, _extends({
    flexDirection: "row",
    flexWrap: "wrap",
    mt: -3
  }, props), (0,external_emotion_react_.jsx)(react_.Box, {
    flexGrow: 1,
    mt: 3
  }, !showNextEvents && (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, !showPreviousEvents && previousEvents.length > 0 && (0,external_emotion_react_.jsx)(react_.Button, {
    colorScheme: "teal",
    fontSize: "smaller",
    height: 7,
    leftIcon: (0,external_emotion_react_.jsx)(icons_.ArrowBackIcon, null),
    onClick: () => {
      setShowPreviousEvents(true);
    }
  }, "Voir les \xE9v\xE9n\xE9ments pr\xE9c\xE9dents"), showPreviousEvents && (0,external_emotion_react_.jsx)(react_.Button, {
    colorScheme: "pink",
    fontSize: "smaller",
    height: 7,
    rightIcon: (0,external_emotion_react_.jsx)(icons_.ArrowForwardIcon, null),
    onClick: () => {
      setShowPreviousEvents(false);
    }
  }, "Revenir aux \xE9v\xE9nements de cette semaine"))), (0,external_emotion_react_.jsx)(react_.Box, {
    mt: 3
  }, !showPreviousEvents && (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, !showNextEvents && nextEvents.length > 0 && (0,external_emotion_react_.jsx)(react_.Button, {
    colorScheme: "teal",
    fontSize: "smaller",
    height: 7,
    leftIcon: showNextEvents ? (0,external_emotion_react_.jsx)(icons_.ArrowBackIcon, null) : undefined,
    rightIcon: !showNextEvents ? (0,external_emotion_react_.jsx)(icons_.ArrowForwardIcon, null) : undefined,
    onClick: () => {
      setShowNextEvents(!showNextEvents);
    }
  }, "Voir les \xE9v\xE9n\xE9ments suivants"), showNextEvents && (0,external_emotion_react_.jsx)(react_.Button, {
    colorScheme: "pink",
    fontSize: "smaller",
    height: 7,
    leftIcon: showNextEvents ? (0,external_emotion_react_.jsx)(icons_.ArrowBackIcon, null) : undefined,
    rightIcon: !showNextEvents ? (0,external_emotion_react_.jsx)(icons_.ArrowForwardIcon, null) : undefined,
    onClick: () => {
      setShowNextEvents(!showNextEvents);
    }
  }, "Revenir aux \xE9v\xE9nements de cette semaine"))));
};
;// CONCATENATED MODULE: ./src/features/events/EventCategory.tsx
function EventCategory_extends() { EventCategory_extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return EventCategory_extends.apply(this, arguments); }

function EventCategory_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = EventCategory_objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function EventCategory_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }





const EventCategory = (_ref) => {
  let {
    selectedCategory
  } = _ref,
      props = EventCategory_objectWithoutProperties(_ref, ["selectedCategory"]);

  const {
    colorMode
  } = (0,react_.useColorMode)();
  const isDark = colorMode === "dark";
  return (0,external_emotion_react_.jsx)(react_.Tag, EventCategory_extends({}, props, {
    color: "white",
    bgColor: Event/* Category */.WD[selectedCategory].bgColor === "transparent" ? isDark ? "whiteAlpha.300" : "blackAlpha.600" : Event/* Category */.WD[selectedCategory].bgColor
  }), Event/* Category */.WD[selectedCategory].label);
};
;// CONCATENATED MODULE: ./src/features/events/EventsListCategories.tsx
function EventsListCategories_extends() { EventsListCategories_extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return EventsListCategories_extends.apply(this, arguments); }

function EventsListCategories_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = EventsListCategories_objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function EventsListCategories_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }





const EventsListCategories = (_ref) => {
  let {
    selectedCategories,
    setSelectedCategories
  } = _ref,
      props = EventsListCategories_objectWithoutProperties(_ref, ["selectedCategories", "setSelectedCategories"]);

  const {
    colorMode
  } = (0,react_.useColorMode)();
  const isDark = colorMode === "dark";
  return (0,external_emotion_react_.jsx)(react_.Flex, EventsListCategories_extends({
    flexWrap: "nowrap",
    overflowX: "auto"
  }, props), Object.keys(Event/* Category */.WD).map(key => {
    const k = parseInt(key);
    if (k === 0) return null;
    const bgColor = Event/* Category */.WD[k].bgColor;
    const isSelected = selectedCategories.includes(k);
    return (0,external_emotion_react_.jsx)(react_.Link, {
      key: "cat-" + key,
      variant: "no-underline",
      onClick: () => {
        setSelectedCategories(selectedCategories.includes(k) ? selectedCategories.filter(sC => sC !== k) : selectedCategories.concat([k]));
      }
    }, (0,external_emotion_react_.jsx)(react_.Tag, {
      variant: isSelected ? "solid" : "outline",
      color: isDark ? "white" : isSelected ? "white" : "black",
      bgColor: isSelected ? bgColor === "transparent" ? isDark ? "whiteAlpha.300" : "blackAlpha.600" : bgColor : undefined,
      mr: 1,
      whiteSpace: "nowrap"
    }, Event/* Category */.WD[k].label));
  }));
};
;// CONCATENATED MODULE: ./src/features/events/EventsList.tsx
function EventsList_extends() { EventsList_extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return EventsList_extends.apply(this, arguments); }

function EventsList_ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function EventsList_objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { EventsList_ownKeys(Object(source), true).forEach(function (key) { EventsList_defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { EventsList_ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function EventsList_defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function EventsList_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = EventsList_objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function EventsList_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }


























const EventsList = (_ref) => {
  let {
    eventsQuery,
    org,
    orgQuery,
    isCreator,
    isSubscribed,
    isLogin,
    setIsLogin
  } = _ref,
      props = EventsList_objectWithoutProperties(_ref, ["eventsQuery", "org", "orgQuery", "isCreator", "isSubscribed", "isLogin", "setIsLogin"]);

  const router = (0,router_.useRouter)();
  const {
    data: session,
    loading: isSessionLoading
  } = (0,useAuth/* useSession */.k)();
  const toast = (0,react_.useToast)({
    position: "top"
  });
  const {
    colorMode
  } = (0,react_.useColorMode)();
  const isDark = colorMode === "dark";
  const dispatch = (0,store/* useAppDispatch */.TL)();
  const today = (0,external_date_fns_.setHours)(new Date(), 0);
  const [deleteEvent, deleteQuery] = (0,eventsApi/* useDeleteEventMutation */.gV)();
  const [editEvent, editEventMutation] = (0,eventsApi/* useEditEventMutation */.VA)();
  const [editOrg, editOrgMutation] = (0,orgsApi/* useEditOrgMutation */.iO)();
  const postEventNotifMutation = (0,eventsApi/* usePostEventNotifMutation */.SO)(); //#region local state

  const {
    0: isLoading,
    1: setIsLoading
  } = (0,external_react_.useState)(false);
  const {
    0: isEventModalOpen,
    1: setIsEventModalOpen
  } = (0,external_react_.useState)(false);
  const {
    0: eventToShow,
    1: setEventToShow
  } = (0,external_react_.useState)(null);
  const {
    0: eventToForward,
    1: setEventToForward
  } = (0,external_react_.useState)(null);
  const {
    0: notifyModalState,
    1: setNotifyModalState
  } = (0,external_react_.useState)({
    entity: null
  });
  (0,external_react_.useEffect)(() => {
    if (notifyModalState.entity) {
      const event = props.events.find(({
        _id
      }) => _id === notifyModalState.entity._id);
      setNotifyModalState({
        entity: event || null
      });
    }
  }, [props.events]);
  const {
    0: selectedCategories,
    1: setSelectedCategories
  } = (0,external_react_.useState)([]);
  const selectedCategoriesCount = selectedCategories ? selectedCategories.length : 0;
  const {
    0: showPreviousEvents,
    1: setShowPreviousEvents
  } = (0,external_react_.useState)(false);
  const {
    0: showNextEvents,
    1: setShowNextEvents
  } = (0,external_react_.useState)(false); //#endregion
  //#region org

  const orgFollowersCount = org === null || org === void 0 ? void 0 : org.orgSubscriptions.map(subscription => subscription.orgs.filter(orgSubscription => {
    return orgSubscription.orgId === (org === null || org === void 0 ? void 0 : org._id) && orgSubscription.type === Subscription/* SubscriptionTypes.FOLLOWER */.NY.FOLLOWER;
  }).length).reduce((a, b) => a + b, 0); //#endregion

  const eventsListItemProps = {
    deleteEvent,
    editEvent,
    editOrg,
    eventHeader: props.eventHeader,
    isCreator,
    isDark,
    isLoading,
    setIsLoading,
    org,
    orgQuery,
    orgFollowersCount,
    session,
    eventToForward,
    setEventToForward,
    notifyModalState,
    setNotifyModalState,
    eventToShow,
    setEventToShow,
    toast
  };

  const getEvents = events => {
    let previousEvents = [];
    let currentEvents = [];
    let nextEvents = [];

    for (const event of events) {
      if (event.eventCategory && selectedCategories.length > 0 && !selectedCategories.includes(event.eventCategory)) continue;
      if (!event.eventCategory && selectedCategories.length > 0) continue;

      if (isCreator || event.eventVisibility === Event/* Visibility.PUBLIC */.Hk.PUBLIC || event.eventVisibility === Event/* Visibility.SUBSCRIBERS */.Hk.SUBSCRIBERS && (isSubscribed || isCreator)) {
        const start = (0,external_date_fns_.parseISO)(event.eventMinDate);
        const end = (0,external_date_fns_.parseISO)(event.eventMaxDate);
        const {
          hours = 0
        } = (0,external_date_fns_.intervalToDuration)({
          start,
          end
        });

        if ((0,external_date_fns_.compareDesc)(today, start) !== -1) {
          // event starts 1 week after today
          if ((0,external_date_fns_.compareDesc)((0,external_date_fns_.addWeeks)(today, 1), start) !== -1) nextEvents.push(EventsList_objectSpread(EventsList_objectSpread({}, event), {}, {
            eventMinDate: start,
            eventMaxDate: end
          })); // event starts today or after
          else currentEvents.push(EventsList_objectSpread(EventsList_objectSpread({}, event), {}, {
              eventMinDate: start,
              eventMaxDate: end
            }));
        } else previousEvents.push(EventsList_objectSpread(EventsList_objectSpread({}, event), {}, {
          eventMinDate: start,
          eventMaxDate: end
        }));

        if (event.otherDays) {
          for (const otherDay of event.otherDays) {
            const eventMinDate = otherDay.startDate ? (0,external_date_fns_.parseISO)(otherDay.startDate) : (0,external_date_fns_.setDay)(start, otherDay.dayNumber + 1);
            const eventMaxDate = otherDay.startDate ? (0,external_date_fns_.addHours)((0,external_date_fns_.parseISO)(otherDay.startDate), hours) : (0,external_date_fns_.setDay)(end, otherDay.dayNumber + 1);

            if ((0,external_date_fns_.compareDesc)(today, eventMinDate) !== -1) {
              // event starts 1 week after today
              if ((0,external_date_fns_.compareDesc)((0,external_date_fns_.addWeeks)(today, 1), start) !== -1) nextEvents.push(EventsList_objectSpread(EventsList_objectSpread({}, event), {}, {
                eventMinDate,
                eventMaxDate,
                repeat: otherDay.dayNumber + 1
              })); // event starts today or after
              else currentEvents.push(EventsList_objectSpread(EventsList_objectSpread({}, event), {}, {
                  eventMinDate,
                  eventMaxDate,
                  repeat: otherDay.dayNumber + 1
                }));
            } else previousEvents.push(EventsList_objectSpread(EventsList_objectSpread({}, event), {}, {
              eventMinDate,
              eventMaxDate,
              repeat: otherDay.dayNumber + 1
            }));
          }
        }

        if (event.repeat) {
          for (let i = 1; i <= event.repeat; i++) {
            if (i % event.repeat !== 0) continue;
            const eventMinDate = (0,external_date_fns_.addWeeks)(start, i);
            const eventMaxDate = (0,external_date_fns_.addWeeks)(end, i);

            if ((0,external_date_fns_.compareDesc)((0,external_date_fns_.addWeeks)(today, 1), eventMinDate) !== -1) {
              // repeated event starts 1 week after today
              nextEvents.push(EventsList_objectSpread(EventsList_objectSpread({}, event), {}, {
                eventMinDate,
                eventMaxDate
              }));
            } else if ((0,external_date_fns_.compareDesc)(today, eventMinDate) !== -1) {
              currentEvents.push(EventsList_objectSpread(EventsList_objectSpread({}, event), {}, {
                eventMinDate,
                eventMaxDate
              }));
            } else {
              previousEvents.push(EventsList_objectSpread(EventsList_objectSpread({}, event), {}, {
                eventMinDate,
                eventMaxDate
              }));
            }

            if (event.otherDays) {
              for (const otherDay of event.otherDays) {
                const start = otherDay.startDate ? (0,external_date_fns_.addWeeks)((0,external_date_fns_.parseISO)(otherDay.startDate), i) : (0,external_date_fns_.setDay)(eventMinDate, otherDay.dayNumber + 1);
                const end = otherDay.startDate ? (0,external_date_fns_.addWeeks)((0,external_date_fns_.addHours)((0,external_date_fns_.parseISO)(otherDay.startDate), hours), i) : (0,external_date_fns_.setDay)(eventMaxDate, otherDay.dayNumber + 1);

                if ((0,external_date_fns_.compareDesc)((0,external_date_fns_.addWeeks)(today, 1), start) !== -1) {
                  nextEvents.push(EventsList_objectSpread(EventsList_objectSpread({}, event), {}, {
                    eventMinDate: start,
                    eventMaxDate: end,
                    repeat: otherDay.dayNumber + 1
                  }));
                } else if ((0,external_date_fns_.compareDesc)(today, start) !== -1) {
                  currentEvents.push(EventsList_objectSpread(EventsList_objectSpread({}, event), {}, {
                    eventMinDate: start,
                    eventMaxDate: end,
                    repeat: otherDay.dayNumber + 1
                  }));
                } else {
                  previousEvents.push(EventsList_objectSpread(EventsList_objectSpread({}, event), {}, {
                    eventMinDate: start,
                    eventMaxDate: end,
                    repeat: otherDay.dayNumber + 1
                  }));
                }
              }
            }
          }
        }
      }
    }

    return {
      previousEvents,
      currentEvents,
      nextEvents
    };
  };

  const events = (0,external_react_.useMemo)(() => {
    let currentDateP = null;
    let currentDate = null;
    let {
      previousEvents,
      currentEvents,
      nextEvents
    } = getEvents(props.events);
    return (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, (0,external_emotion_react_.jsx)(EventsListToggle, {
      previousEvents: previousEvents,
      showPreviousEvents: showPreviousEvents,
      setShowPreviousEvents: setShowPreviousEvents,
      currentEvents: currentEvents,
      nextEvents: nextEvents,
      showNextEvents: showNextEvents,
      setShowNextEvents: setShowNextEvents,
      mb: 5
    }), (0,external_emotion_react_.jsx)(EventsListCategories, {
      selectedCategories: selectedCategories,
      setSelectedCategories: setSelectedCategories,
      mb: 5
    }), showPreviousEvents && (0,external_emotion_react_.jsx)(react_.Box, null, previousEvents.sort((a, b) => (0,external_date_fns_.compareAsc)(a.eventMinDate, b.eventMinDate)).map((event, index) => {
      let addGridHeader = false;
      const minDate = event.eventMinDate;
      const iscurrentDatePOneDayBeforeMinDate = currentDateP ? (0,external_date_fns_.getDayOfYear)(currentDateP) < (0,external_date_fns_.getDayOfYear)(minDate) : true;

      if (iscurrentDatePOneDayBeforeMinDate) {
        addGridHeader = true;
        currentDateP = minDate;
      } else {
        addGridHeader = false;
      }

      return (0,external_emotion_react_.jsx)(react_.Grid, {
        key: "event-" + index,
        templateRows: "auto auto 4fr auto",
        templateColumns: "1fr 6fr minmax(75px, 1fr)"
      }, (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, addGridHeader ? props.eventHeader ? props.eventHeader : (0,external_emotion_react_.jsx)(common/* GridHeader */.Q1, {
        colSpan: 3,
        borderTopRadius: index === 0 ? "lg" : undefined
      }, (0,external_emotion_react_.jsx)(react_.Heading, {
        size: "sm",
        py: 3
      }, (0,external_date_fns_.format)(minDate, "cccc d MMMM", {
        locale: fr/* default */.Z
      }))) : (0,external_emotion_react_.jsx)(common/* GridItem */.P4, {
        colSpan: 3
      }, (0,external_emotion_react_.jsx)(common/* Spacer */.LZ, {
        borderWidth: 1
      })), (0,external_emotion_react_.jsx)(EventsListItem, EventsList_extends({}, eventsListItemProps, {
        event: event,
        index: index,
        length: previousEvents.length
      }))));
    })), !showPreviousEvents && !showNextEvents && (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, currentEvents.length > 0 ? currentEvents.sort((a, b) => (0,external_date_fns_.compareAsc)(a.eventMinDate, b.eventMinDate)).map((event, index) => {
      let addGridHeader = false;
      const minDate = event.eventMinDate;
      const isCurrentDateOneDayBeforeMinDate = currentDate ? (0,external_date_fns_.getDayOfYear)(currentDate) < (0,external_date_fns_.getDayOfYear)(minDate) : true;

      if (isCurrentDateOneDayBeforeMinDate) {
        addGridHeader = true;
        currentDate = minDate; // console.log("currentDate set to", currentDate);
      } else {
        addGridHeader = false;
      }

      return (0,external_emotion_react_.jsx)(react_.Grid, {
        key: "event-" + index,
        templateRows: "auto auto 4fr auto",
        templateColumns: "1fr 6fr minmax(75px, 1fr)"
      }, (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, addGridHeader ? props.eventHeader ? props.eventHeader : (0,external_emotion_react_.jsx)(common/* GridHeader */.Q1, {
        colSpan: 3,
        borderTopRadius: index === 0 ? "lg" : undefined
      }, (0,external_emotion_react_.jsx)(react_.Heading, {
        size: "sm",
        py: 3
      }, (0,external_date_fns_.format)(minDate, "cccc d MMMM", {
        locale: fr/* default */.Z
      }))) : (0,external_emotion_react_.jsx)(common/* GridItem */.P4, {
        colSpan: 3
      }, (0,external_emotion_react_.jsx)(common/* Spacer */.LZ, {
        borderWidth: 1
      })), (0,external_emotion_react_.jsx)(EventsListItem, EventsList_extends({}, eventsListItemProps, {
        event: event,
        index: index,
        length: currentEvents.length
      }))));
    }) : (0,external_emotion_react_.jsx)(react_.Alert, {
      status: "info"
    }, (0,external_emotion_react_.jsx)(react_.AlertIcon, null), "Aucun \xE9v\xE9nement", " ", Array.isArray(selectedCategories) && selectedCategoriesCount === 1 ? (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, "de la cat\xE9gorie", (0,external_emotion_react_.jsx)(EventCategory, {
      selectedCategory: selectedCategories[0],
      mx: 1
    })) : selectedCategoriesCount > 1 ? (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, "dans les cat\xE9gories", selectedCategories.map((catNumber, index) => (0,external_emotion_react_.jsx)(EventCategory, {
      selectedCategory: selectedCategories[index],
      mx: 1
    }))) : "", " ", "pr\xE9vu", previousEvents.length > 0 || nextEvents.length > 0 ? " cette semaine." : ".")), showNextEvents && (0,external_emotion_react_.jsx)(react_.Box, null, nextEvents.sort((a, b) => (0,external_date_fns_.compareAsc)(a.eventMinDate, b.eventMinDate)).map((event, index) => {
      let addGridHeader = false;
      const minDate = event.eventMinDate;
      const iscurrentDatePOneDayBeforeMinDate = currentDateP ? (0,external_date_fns_.getDayOfYear)(currentDateP) < (0,external_date_fns_.getDayOfYear)(minDate) : true;

      if (iscurrentDatePOneDayBeforeMinDate) {
        addGridHeader = true;
        currentDateP = minDate;
      } else {
        addGridHeader = false;
      }

      return (0,external_emotion_react_.jsx)(react_.Grid, {
        key: "event-" + index,
        templateRows: "auto auto 4fr auto",
        templateColumns: "1fr 6fr minmax(75px, 1fr)"
      }, (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, addGridHeader ? props.eventHeader ? props.eventHeader : (0,external_emotion_react_.jsx)(common/* GridHeader */.Q1, {
        colSpan: 3,
        borderTopRadius: index === 0 ? "lg" : undefined
      }, (0,external_emotion_react_.jsx)(react_.Heading, {
        size: "sm",
        py: 3
      }, (0,external_date_fns_.format)(minDate, "cccc d MMMM", {
        locale: fr/* default */.Z
      }))) : (0,external_emotion_react_.jsx)(common/* GridItem */.P4, {
        colSpan: 3
      }, (0,external_emotion_react_.jsx)(common/* Spacer */.LZ, {
        borderWidth: 1
      })), (0,external_emotion_react_.jsx)(EventsListItem, EventsList_extends({}, eventsListItemProps, {
        event: event,
        index: index,
        length: nextEvents.length
      }))));
    })), (showPreviousEvents && previousEvents.length > 0 || showNextEvents || currentEvents.length > 0) && (0,external_emotion_react_.jsx)(EventsListToggle, {
      previousEvents: previousEvents,
      showPreviousEvents: showPreviousEvents,
      setShowPreviousEvents: setShowPreviousEvents,
      currentEvents: currentEvents,
      nextEvents: nextEvents,
      showNextEvents: showNextEvents,
      setShowNextEvents: setShowNextEvents,
      mt: 3
    }));
  }, [props.events, session, isLoading, showPreviousEvents, showNextEvents, selectedCategories]);
  return (0,external_emotion_react_.jsx)("div", null, org && (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, (0,external_emotion_react_.jsx)(react_.Button, {
    colorScheme: "teal",
    leftIcon: (0,external_emotion_react_.jsx)(icons_.AddIcon, null),
    mb: 5,
    onClick: () => {
      if (!isSessionLoading) {
        if (session) {
          if (org) {
            if (isCreator || isSubscribed) setIsEventModalOpen(true);else toast({
              status: "error",
              title: `Vous devez être adhérent ${(0,Org/* orgTypeFull */.rY)(org.orgType)} pour ajouter un événement`
            });
          } else setIsEventModalOpen(true);
        } else if (setIsLogin && isLogin) {
          setIsLogin(isLogin + 1);
        }
      }
    },
    "data-cy": "addEvent"
  }, "Ajouter un \xE9v\xE9nement"), session && isEventModalOpen && (0,external_emotion_react_.jsx)(EventModal/* EventModal */.Q, {
    session: session,
    initialEventOrgs: [org],
    onCancel: () => setIsEventModalOpen(false),
    onSubmit: async eventUrl => {
      if (org) {
        dispatch((0,orgSlice/* refetchOrg */.E2)());
      }

      await router.push(`/${eventUrl}`, `/${eventUrl}`, {
        shallow: true
      });
    },
    onClose: () => setIsEventModalOpen(false)
  })), events, eventToShow && (0,external_emotion_react_.jsx)(DescriptionModal/* DescriptionModal */.n, {
    onClose: () => {
      setEventToShow(null);
    },
    header: (0,external_emotion_react_.jsx)(common/* Link */.rU, {
      href: `/${eventToShow.eventUrl}`,
      size: "larger",
      className: "rainbow-text"
    }, eventToShow.eventName)
  }, eventToShow.eventDescription && eventToShow.eventDescription.length > 0 && eventToShow.eventDescription !== "<p><br></p>" ? (0,external_emotion_react_.jsx)("div", {
    className: "ql-editor"
  }, (0,external_emotion_react_.jsx)("div", {
    dangerouslySetInnerHTML: {
      __html: external_isomorphic_dompurify_default().sanitize(eventToShow.eventDescription)
    }
  })) : (0,external_emotion_react_.jsx)(react_.Text, {
    fontStyle: "italic"
  }, "Aucune description.")), eventToForward && (0,external_emotion_react_.jsx)(ForwardModal, {
    event: eventToForward,
    onCancel: () => {
      setEventToForward(null);
    },
    onClose: () => {
      setEventToForward(null);
    },
    onSubmit: () => {
      setEventToForward(null);
    }
  }), (0,external_emotion_react_.jsx)(NotifyModal/* NotifyModal */.i, {
    event: notifyModalState.entity || undefined,
    org: org,
    query: orgQuery,
    mutation: postEventNotifMutation,
    setModalState: setNotifyModalState,
    modalState: notifyModalState
  }));
};

/***/ })

};
;