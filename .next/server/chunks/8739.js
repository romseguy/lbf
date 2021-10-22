exports.id = 8739;
exports.ids = [8739];
exports.modules = {

/***/ 8739:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "i": function() { return /* binding */ NotifyModal; }
/* harmony export */ });
/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3426);
/* harmony import */ var _chakra_ui_react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(9297);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var features_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(1109);
/* harmony import */ var models_Event__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(7823);
/* harmony import */ var models_Org__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9759);
/* harmony import */ var models_Subscription__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(8716);
/* harmony import */ var utils_array__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(1609);
/* harmony import */ var _emotion_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(7381);
/* harmony import */ var _emotion_react__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_emotion_react__WEBPACK_IMPORTED_MODULE_6__);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }










const isEvent = entity => {
  return entity.eventUrl !== undefined;
};

const isTopic = entity => {
  return entity.topicName !== undefined;
};

const NotifyModal = ({
  event,
  org,
  query,
  mutation,
  setModalState,
  modalState
}) => {
  const toast = (0,_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__.useToast)({
    position: "top"
  });
  const [postNotif, postNotifMutation] = mutation;
  const {
    entity
  } = modalState;
  if (!org && !event || !entity || !isEvent(entity) && !isTopic(entity)) return null; //#region event or org

  const name = org ? org.orgName : event ? event.eventName : "";
  let subscriptions = org ? org.orgSubscriptions : event ? event.eventSubscriptions : []; //#endregion
  //#region modal entity

  let entityId = "";
  let entityIdKey = "eventUrl";
  let entityName = "";
  let entityTypeLabel = "l'événement";
  let payload = {
    orgIds: org ? [org._id] : undefined
  };
  let topicNotified;
  let eventNotified;
  let notifiedCount = 0;

  if (isTopic(entity)) {
    entityId = entity._id;
    entityIdKey = "topicId";
    entityName = entity.topicName;
    entityTypeLabel = "la discussion";
    payload = {
      org,
      event
    };
    subscriptions = subscriptions.filter(({
      phone
    }) => phone === undefined);

    if (entity.topicNotified) {
      topicNotified = entity.topicNotified;
      notifiedCount = topicNotified.length;
    }
  } else if (isEvent(entity)) {
    entityId = entity.eventUrl;
    entityName = entity.eventName;
    subscriptions = subscriptions.filter(subscription => {
      return org && subscription.orgs.find(orgSubscription => {
        return orgSubscription.orgId === org._id && orgSubscription.type === models_Subscription__WEBPACK_IMPORTED_MODULE_5__/* .SubscriptionTypes.FOLLOWER */ .NY.FOLLOWER;
      });
    });

    if (entity.eventNotified) {
      eventNotified = entity.eventNotified;
      notifiedCount = eventNotified.length;
    }
  }

  const onSubmit = async () => {
    const {
      emailList
    } = await postNotif({
      [entityIdKey]: entityId,
      payload
    }).unwrap();

    if ((0,utils_array__WEBPACK_IMPORTED_MODULE_7__/* .hasItems */ .t)(emailList)) {
      toast({
        status: "success",
        title: `${emailList.length} abonnés invités !`
      });
      query.refetch();
    } else toast({
      status: "warning",
      title: "Aucun abonné invité"
    });

    setModalState(_objectSpread(_objectSpread({}, modalState), {}, {
      entity: null
    }));
  }; //#endregion


  return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__.Modal, {
    isOpen: true,
    onClose: () => setModalState(_objectSpread(_objectSpread({}, modalState), {}, {
      entity: null
    }))
  }, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__.ModalOverlay, null, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__.ModalContent, null, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__.ModalHeader, null, isTopic(entity) ? "Notifications" : "Invitations"), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__.ModalCloseButton, null), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__.ModalBody, null, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__.Alert, {
    status: "info",
    flexDirection: "row"
  }, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__.AlertIcon, null), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__.Box, null, "Ci-dessous la liste des abonn\xE9s", " ", org ? (0,models_Org__WEBPACK_IMPORTED_MODULE_4__/* .orgTypeFull */ .rY)(org.orgType) : "", " ", (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)("b", null, name), " \xE0", " ", isTopic(entity) ? "notifier de " : "inviter à ", entityTypeLabel, " ", (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)("b", null, entityName), ".")), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__.Box, {
    overflowX: "auto"
  }, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__.Table, null, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__.Tbody, null, subscriptions.map(subscription => {
    const e = typeof subscription.user === "object" ? subscription.user.email || "" : subscription.email || "";
    const p = subscription.phone || null;

    if (isEvent(entity) && eventNotified.find(({
      email,
      phone
    }) => email === e || phone === p) || isTopic(entity) && topicNotified.find(({
      email
    }) => email === e)) {
      return {
        email: e,
        phone: p,
        status: models_Event__WEBPACK_IMPORTED_MODULE_3__/* .StatusTypes.PENDING */ .Sk.PENDING
      };
    }

    return {
      email: e,
      phone: p,
      status: models_Event__WEBPACK_IMPORTED_MODULE_3__/* .StatusTypes.NOK */ .Sk.NOK
    };
  }).map(item => {
    return (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__.Tr, {
      key: item.phone || item.email
    }, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__.Td, null, item.phone || item.email), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__.Td, null, item.status === models_Event__WEBPACK_IMPORTED_MODULE_3__/* .StatusTypes.PENDING */ .Sk.PENDING ? (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__.Tag, {
      colorScheme: "green"
    }, isTopic(entity) ? "Notifié" : "Invité") : (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)(features_common__WEBPACK_IMPORTED_MODULE_2__/* .Link */ .rU, {
      onClick: async () => {
        const {
          emailList
        } = await postNotif({
          [entityIdKey]: entityId,
          payload: _objectSpread(_objectSpread({}, payload), {}, {
            email: item.email
          })
        }).unwrap();

        if ((0,utils_array__WEBPACK_IMPORTED_MODULE_7__/* .hasItems */ .t)(emailList)) {
          toast({
            status: "success",
            title: `Une ${isTopic(entity) ? "notification" : "invitation"} a été envoyée à ${item.email} !`
          });
          query.refetch();
        } else toast({
          status: "warning",
          title: `Aucun abonné ${isTopic(entity) ? "notifié" : "invité"}`
        });
      }
    }, (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)(_chakra_ui_react__WEBPACK_IMPORTED_MODULE_0__.Tag, {
      colorScheme: "red"
    }, isTopic(entity) ? "Notifier" : "Inviter"))));
  })))), (0,_emotion_react__WEBPACK_IMPORTED_MODULE_6__.jsx)(features_common__WEBPACK_IMPORTED_MODULE_2__/* .Button */ .zx, {
    mt: 3,
    colorScheme: "green",
    isLoading: postNotifMutation.isLoading,
    onClick: onSubmit
  }, "Envoyer ", subscriptions.length - notifiedCount, " ", isTopic(entity) ? "notifications" : "invitations")))));
};

/***/ })

};
;