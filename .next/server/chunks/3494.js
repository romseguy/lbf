exports.id = 3494;
exports.ids = [3494];
exports.modules = {

/***/ 3494:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "V": function() { return /* binding */ MapModal; }
});

// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(9297);
var external_react_default = /*#__PURE__*/__webpack_require__.n(external_react_);
// EXTERNAL MODULE: external "@chakra-ui/react"
var react_ = __webpack_require__(3426);
// EXTERNAL MODULE: external "@react-icons/all-files/fa/FaMapMarkerAlt.js"
var FaMapMarkerAlt_js_ = __webpack_require__(2276);
// EXTERNAL MODULE: external "@react-icons/all-files/io/IoIosPeople.js"
var IoIosPeople_js_ = __webpack_require__(4244);
// EXTERNAL MODULE: external "@emotion/react"
var external_emotion_react_ = __webpack_require__(7381);
// EXTERNAL MODULE: external "@chakra-ui/icons"
var icons_ = __webpack_require__(3724);
// EXTERNAL MODULE: external "@googlemaps/markerclustererplus"
var markerclustererplus_ = __webpack_require__(9443);
var markerclustererplus_default = /*#__PURE__*/__webpack_require__.n(markerclustererplus_);
// EXTERNAL MODULE: external "google-map-react"
var external_google_map_react_ = __webpack_require__(5403);
var external_google_map_react_default = /*#__PURE__*/__webpack_require__.n(external_google_map_react_);
// EXTERNAL MODULE: external "isomorphic-dompurify"
var external_isomorphic_dompurify_ = __webpack_require__(3082);
var external_isomorphic_dompurify_default = /*#__PURE__*/__webpack_require__.n(external_isomorphic_dompurify_);
// EXTERNAL MODULE: external "react-dom"
var external_react_dom_ = __webpack_require__(2268);
// EXTERNAL MODULE: ./src/features/common/index.tsx + 23 modules
var common = __webpack_require__(1109);
// EXTERNAL MODULE: ./src/features/modals/DescriptionModal.tsx
var DescriptionModal = __webpack_require__(5011);
;// CONCATENATED MODULE: ./src/features/map/FullscreenControl.tsx
function _EMOTION_STRINGIFIED_CSS_ERROR__() { return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop)."; }






var _ref =  true ? {
  name: "oze4vv",
  styles: "height:18px;width:18px"
} : 0;

var _ref2 =  true ? {
  name: "oze4vv",
  styles: "height:18px;width:18px"
} : 0;

var _ref3 =  true ? {
  name: "oze4vv",
  styles: "height:18px;width:18px"
} : 0;

var _ref4 =  true ? {
  name: "k7f9my",
  styles: "background:none rgb(255, 255, 255);border:0px;margin:10px;padding:0px;text-transform:none;appearance:none;position:absolute;cursor:pointer;user-select:none;border-radius:2px;height:40px;width:40px;box-shadow:rgba(0, 0, 0, 0.3) 0px 1px 4px -1px;overflow:hidden;top:0px;right:0px"
} : 0;

const FullscreenControl = ({
  onClick
}) => {
  const {
    0: isFull,
    1: setIsFull
  } = (0,external_react_.useState)(false);
  return (0,external_emotion_react_.jsx)(react_.Button, {
    className: "gm-control-active gm-fullscreen-control",
    draggable: "false",
    "aria-label": "Passer en plein \xE9cran",
    title: "Passer en plein \xE9cran",
    type: "button",
    onClick: () => {
      const f = !isFull;
      setIsFull(f);
      onClick && onClick(f);
    },
    css: _ref4
  }, (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, (0,external_emotion_react_.jsx)("img", {
    src: "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2018%2018%22%3E%3Cpath%20fill%3D%22%23666%22%20d%3D%22M0%200v6h2V2h4V0H0zm16%200h-4v2h4v4h2V0h-2zm0%2016h-4v2h6v-6h-2v4zM2%2012H0v6h6v-2H2v-4z%22/%3E%3C/svg%3E",
    alt: "",
    css: _ref3
  }), (0,external_emotion_react_.jsx)("img", {
    src: "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2018%2018%22%3E%3Cpath%20fill%3D%22%23333%22%20d%3D%22M0%200v6h2V2h4V0H0zm16%200h-4v2h4v4h2V0h-2zm0%2016h-4v2h6v-6h-2v4zM2%2012H0v6h6v-2H2v-4z%22/%3E%3C/svg%3E",
    alt: "",
    css: _ref2
  }), (0,external_emotion_react_.jsx)("img", {
    src: "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20viewBox%3D%220%200%2018%2018%22%3E%3Cpath%20fill%3D%22%23111%22%20d%3D%22M0%200v6h2V2h4V0H0zm16%200h-4v2h4v4h2V0h-2zm0%2016h-4v2h6v-6h-2v4zM2%2012H0v6h6v-2H2v-4z%22/%3E%3C/svg%3E",
    alt: "",
    css: _ref
  })));
};
// EXTERNAL MODULE: ./src/features/map/GoogleApiWrapper.tsx + 2 modules
var GoogleApiWrapper = __webpack_require__(4878);
;// CONCATENATED MODULE: ./src/features/map/Marker.tsx





const defaultStyles = `
  position: absolute;
  top: 50%;
  left: 50%;
  width: 18px;
  height: 18px;
  background-color: red;
  border: 2px solid #fff;
  border-radius: 100%;
  user-select: none;
  transform: translate(-50%, -50%);
  cursor: pointer;
`;
const Marker = ({
  key,
  item,
  lat,
  lng,
  zoomLevel,
  setItemToShow
}) => {
  const name = "eventName" in item ? item.eventName : item.orgName; // if (lat && lng) {
  // const world = latLng2World({ lat, lng });
  // const screen = world2Screen({ x: world.x, y: world.y }, zoomLevel);
  // }

  let wideStyles;
  const isWide = zoomLevel > 16;

  if (isWide) {
    // console.log(getStyleObjectFromString(styles));
    wideStyles = `
    position: absolute;
    top: 50%;
    left: 50%;
    width: auto;
    height: auto;
    padding: 8px;
    color: black;
    background-color: white;
    border: 2px solid black;
    border-radius: 12px;
    user-select: none;
    transform: translate(-50%, -50%);
    cursor: pointer;
    `;
  }

  const m = (0,external_emotion_react_.jsx)(react_.Box, {
    css: /*#__PURE__*/(0,external_emotion_react_.css)(wideStyles || defaultStyles,  true ? "" : 0,  true ? "" : 0),
    _hover: {
      bgColor: "green",
      zIndex: 1
    },
    onClick: () => setItemToShow(item)
  }, isWide ? (0,external_emotion_react_.jsx)(common/* Link */.rU, {
    className: "rainbow-text",
    size: "larger"
  }, name) : "");

  return (0,external_emotion_react_.jsx)("div", {
    key: key
  }, isWide ? m : (0,external_emotion_react_.jsx)(react_.Tooltip, {
    label: name
  }, m));
};
// EXTERNAL MODULE: ./src/features/events/EventTimeline.tsx
var EventTimeline = __webpack_require__(4263);
;// CONCATENATED MODULE: ./src/features/map/Map.tsx



function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function Map_EMOTION_STRINGIFIED_CSS_ERROR_() { return "You have tried to stringify object returned from `css` function. It isn't supposed to be used directly (e.g. as value of the `className` prop), but rather handed to emotion so it can handle it (e.g. as value of `css` prop)."; }
















const defaultCenter = {
  lat: 43.0555331,
  lng: 2.2126466
};

var Map_ref =  true ? {
  name: "k4khca",
  styles: "letter-spacing:0.1em"
} : 0;

const Map = (0,GoogleApiWrapper/* withGoogleApi */.q)({
  apiKey: "AIzaSyBW6lVlo-kbzkD3bThsccdDilCdb8_CPH8"
})((_ref2) => {
  let {
    center,
    events,
    orgs,
    size,
    onFullscreenControlClick
  } = _ref2,
      props = _objectWithoutProperties(_ref2, ["center", "events", "orgs", "size", "onFullscreenControlClick"]);

  const {
    0: itemToShow,
    1: setItemToShow
  } = (0,external_react_.useState)(null);
  const {
    0: zoomLevel,
    1: setZoomLevel
  } = (0,external_react_.useState)(10);
  const mapRef = (0,external_react_.useRef)(null);
  const options = {
    fullscreenControl: false // zoomControl: boolean,
    // mapTypeControl: boolean,
    // scaleControl: boolean,
    // streetViewControl: boolean,
    // rotateControl: boolean,

  };
  const hash = {};

  const mapItem = (item, index) => {
    const key = `marker-${index}`;
    let lat = "eventName" in item ? item.eventLat : item.orgLat;
    let lng = "eventName" in item ? item.eventLng : item.orgLng;

    if (lat && lng) {
      const latLng = `${lat}_${lng}`;

      if (hash[latLng]) {
        lat = lat + (Math.random() - 0.5) / 1500;
        lng = lng + (Math.random() - 0.5) / 1500;
      } else hash[latLng] = true;
    }

    return {
      key,
      lat,
      lng,
      item
    };
  };

  const {
    0: markers,
    1: setMarkers
  } = (0,external_react_.useState)(events ? events.map(mapItem) : orgs ? orgs.map(mapItem) : []);

  const onGoogleApiLoaded = ({
    map,
    maps: api
  }) => {
    if (!map || !api) return;
    props.onGoogleApiLoaded && props.onGoogleApiLoaded(); // if (mapRef.current) {
    //   console.log(mapRef.current);
    // }

    if (!options.fullscreenControl) {
      const controlButtonDiv = document.createElement("div");
      (0,external_react_dom_.render)((0,external_emotion_react_.jsx)(FullscreenControl, {
        onClick: onFullscreenControlClick
      }), controlButtonDiv);
      map.controls[api.ControlPosition.TOP_RIGHT].push(controlButtonDiv);
    }

    const gMarkers = markers.map(({
      lat,
      lng
    }) => {
      const gMarker = new api.Marker({
        position: {
          lat,
          lng
        }
      });
      gMarker.setVisible(false);
      return gMarker;
    });
    const cluster = new (markerclustererplus_default())(map, gMarkers, {
      imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
      minimumClusterSize: 2
    });
    api.event.addListener(cluster, "clusteringend", () => {
      const markersGrouped = cluster.getClusters().map(cl => cl.getMarkers()).filter(marker => marker.length > 1);
      const positions = markersGrouped.map(markers => markers.map(marker => ({
        lat: marker.getPosition().lat(),
        lng: marker.getPosition().lng()
      })))[0];
      const newMarkers = [];

      for (const marker of markers) {
        if (positions && positions.find(position => position.lat === marker.lat && position.lng === marker.lng)) continue;
        newMarkers.push(marker);
      }

      setMarkers(newMarkers);
    });
  };

  const isOffline = props.loaded && !props.google;

  if (!props.loaded) {
    return (0,external_emotion_react_.jsx)(react_.Spinner, null);
  } else if (isOffline) {
    return (0,external_emotion_react_.jsx)(react_.Alert, {
      status: "error"
    }, (0,external_emotion_react_.jsx)(react_.AlertIcon, null), "Nous n'avons pas pu charger la carte. \xCAtes-vous connect\xE9 \xE0 internet ?");
  }

  return (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, (0,external_emotion_react_.jsx)((external_google_map_react_default()), {
    ref: mapRef,
    defaultCenter: defaultCenter,
    defaultZoom: 10,
    center: center,
    zoom: zoomLevel,
    options: maps => options,
    yesIWantToUseGoogleMapApiInternals: true,
    onGoogleApiLoaded: onGoogleApiLoaded,
    onChange: e => {
      setZoomLevel(e.zoom);
    },
    style: {
      position: "relative",
      flex: 1
    }
  }, markers.map(marker => (0,external_emotion_react_.jsx)(Marker, {
    key: marker.key,
    lat: marker.lat,
    lng: marker.lng,
    item: marker.item,
    zoomLevel: zoomLevel,
    setItemToShow: setItemToShow
  }))), itemToShow && (0,external_emotion_react_.jsx)(DescriptionModal/* DescriptionModal */.n, {
    onClose: () => {
      setItemToShow(null);
    },
    header: (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, (0,external_emotion_react_.jsx)(react_.Box, {
      display: "inline-flex",
      alignItems: "center",
      maxWidth: "90%"
    }, "eventName" in itemToShow ? (0,external_emotion_react_.jsx)(react_.Icon, {
      as: icons_.CalendarIcon,
      mr: 1,
      boxSize: 6
    }) : (0,external_emotion_react_.jsx)(react_.Icon, {
      as: IoIosPeople_js_.IoIosPeople,
      mr: 1,
      boxSize: 6
    }), " ", (0,external_emotion_react_.jsx)(common/* Link */.rU, {
      href: `/${"eventName" in itemToShow ? itemToShow.eventUrl : itemToShow.orgUrl}`,
      css: Map_ref,
      size: "larger",
      className: "rainbow-text"
    }, "eventName" in itemToShow ? itemToShow.eventName : itemToShow.orgName)), (0,external_emotion_react_.jsx)("br", null), (0,external_emotion_react_.jsx)(react_.Box, {
      display: "inline-flex",
      alignItems: "center"
    }, (0,external_emotion_react_.jsx)(react_.Icon, {
      as: FaMapMarkerAlt_js_.FaMapMarkerAlt,
      mr: 2,
      color: "red"
    }), "eventName" in itemToShow ? itemToShow.eventAddress : itemToShow.orgAddress))
  }, (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, "eventName" in itemToShow && (0,external_emotion_react_.jsx)(EventTimeline/* EventTimeline */.G, {
    event: itemToShow
  }), (0,external_emotion_react_.jsx)(react_.Box, {
    mt: 4
  }, "eventName" in itemToShow ? itemToShow.eventDescription && itemToShow.eventDescription.length > 0 ? (0,external_emotion_react_.jsx)("div", {
    className: "ql-editor"
  }, (0,external_emotion_react_.jsx)("div", {
    dangerouslySetInnerHTML: {
      __html: external_isomorphic_dompurify_default().sanitize(itemToShow.eventDescription)
    }
  })) : (0,external_emotion_react_.jsx)(react_.Text, {
    fontStyle: "italic"
  }, "Aucune description.") : itemToShow.orgDescription && itemToShow.orgDescription.length > 0 ? (0,external_emotion_react_.jsx)("div", {
    className: "ql-editor"
  }, (0,external_emotion_react_.jsx)("div", {
    dangerouslySetInnerHTML: {
      __html: external_isomorphic_dompurify_default().sanitize(itemToShow.orgDescription)
    }
  })) : (0,external_emotion_react_.jsx)(react_.Text, {
    fontStyle: "italic"
  }, "Aucune description.")))));
});
// EXTERNAL MODULE: external "react-hook-form"
var external_react_hook_form_ = __webpack_require__(2662);
// EXTERNAL MODULE: ./src/utils/maps.ts
var maps = __webpack_require__(2051);
;// CONCATENATED MODULE: ./src/features/map/MapSearch.tsx





const MapSearch = ({
  setCenter,
  isVisible
}) => {
  const defaultValue = "Limoux, France";
  const {
    0: value,
    1: setValue
  } = (0,external_react_.useState)(defaultValue);
  const {
    control,
    register,
    handleSubmit,
    errors,
    setError,
    clearErrors,
    watch,
    getValues
  } = (0,external_react_hook_form_.useForm)({
    mode: "onChange"
  });

  const onChange = () => {};

  const onSubmit = () => {};

  if (!isVisible) return null;
  return (0,external_emotion_react_.jsx)("form", {
    onChange: onChange,
    onSubmit: handleSubmit(onSubmit)
  }, (0,external_emotion_react_.jsx)(common/* AddressControl */.b$, {
    name: "eventAddress",
    control: control,
    errors: errors,
    defaultValue: defaultValue,
    value: value,
    noLabel: true,
    mb: 3,
    onChange: description => {
      setValue(description);
    },
    onClick: () => {
      setValue("");
    },
    onSuggestionSelect: async suggestion => {
      if (suggestion) {
        setCenter(await (0,maps/* unwrapSuggestion */.X8)(suggestion));
      }
    }
  }));
};
// EXTERNAL MODULE: ./src/utils/array.ts
var array = __webpack_require__(1609);
;// CONCATENATED MODULE: ./src/features/modals/MapModal.tsx
function MapModal_objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = MapModal_objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function MapModal_objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }








const MapModal = (0,GoogleApiWrapper/* withGoogleApi */.q)({
  apiKey: "AIzaSyBW6lVlo-kbzkD3bThsccdDilCdb8_CPH8"
})((_ref) => {
  let {
    events,
    orgs
  } = _ref,
      props = MapModal_objectWithoutProperties(_ref, ["events", "orgs"]);

  const isOffline = props.loaded && !props.google;
  const {
    0: center,
    1: setCenter
  } = (0,external_react_.useState)();
  const divRef = (0,external_react_.useRef)(null);
  const {
    0: size,
    1: setSize
  } = (0,external_react_.useState)({
    defaultSize: {
      enabled: true
    },
    fullSize: {
      enabled: false
    }
  });
  return (0,external_emotion_react_.jsx)(react_.Modal, {
    isOpen: props.isOpen,
    onClose: () => {
      props.onClose && props.onClose();
    },
    size: size.fullSize.enabled ? "full" : undefined,
    closeOnOverlayClick: true
  }, (0,external_emotion_react_.jsx)(react_.ModalOverlay, null, (0,external_emotion_react_.jsx)(react_.ModalContent, {
    my: size.fullSize.enabled ? 0 : undefined,
    minHeight: !isOffline && size.defaultSize.enabled ? "calc(100vh - 180px)" : size.fullSize.enabled ? "100vh" : undefined
  }, size.defaultSize.enabled && (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, (0,external_emotion_react_.jsx)(react_.ModalHeader, null, `Carte des ${events ? "événements" : "organisations"}`), (0,external_emotion_react_.jsx)(react_.ModalCloseButton, null)), (0,external_emotion_react_.jsx)(react_.ModalBody, {
    ref: divRef,
    p: size.fullSize.enabled ? 0 : undefined,
    display: "flex",
    flexDirection: "column"
  }, props.loaded && props.google && (0,array/* hasItems */.t)(events || orgs || []) ? (0,external_emotion_react_.jsx)((external_react_default()).Fragment, null, (0,external_emotion_react_.jsx)(MapSearch, {
    setCenter: setCenter,
    isVisible: size.defaultSize.enabled
  }), (0,external_emotion_react_.jsx)(Map, {
    center: center,
    events: events,
    orgs: orgs,
    size: size,
    onFullscreenControlClick: isFull => {
      setSize({
        defaultSize: {
          enabled: !isFull
        },
        fullSize: {
          enabled: isFull
        }
      });
    }
  })) : isOffline ? (0,external_emotion_react_.jsx)(react_.Alert, {
    status: "error",
    mb: 3
  }, (0,external_emotion_react_.jsx)(react_.AlertIcon, null), "Nous n'avons pas pu charger la carte. \xCAtes-vous connect\xE9 \xE0 internet ?") : !props.loaded ? (0,external_emotion_react_.jsx)(react_.Spinner, null) : (0,external_emotion_react_.jsx)(react_.Text, null, "Il n'y a encore rien \xE0 afficher sur cette carte, revenez plus tard !")))));
});

/***/ })

};
;