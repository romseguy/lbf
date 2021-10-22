exports.id = 4281;
exports.ids = [4281];
exports.modules = {

/***/ 2445:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "tG": function() { return /* binding */ documentApi; },
/* harmony export */   "An": function() { return /* binding */ useGetDocumentsQuery; }
/* harmony export */ });
/* unused harmony export useAddDocumentMutation */
/* harmony import */ var _reduxjs_toolkit_query_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5641);
/* harmony import */ var _reduxjs_toolkit_query_react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_reduxjs_toolkit_query_react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var utils_query__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7020);


const documentApi = (0,_reduxjs_toolkit_query_react__WEBPACK_IMPORTED_MODULE_0__.createApi)({
  reducerPath: "documentsApi",
  baseQuery: utils_query__WEBPACK_IMPORTED_MODULE_1__/* .default */ .Z,
  tagTypes: ["Documents"],
  endpoints: build => ({
    addDocument: build.mutation({
      query: body => ({
        url: "https://api.aucourant.de",
        method: "POST",
        body
      })
    }),
    getDocuments: build.query({
      query: orgId => {
        return {
          url: `${"https://api.aucourant.de"}?orgId=${orgId}`
        };
      }
    })
  })
});
const {
  useAddDocumentMutation,
  useGetDocumentsQuery
} = documentApi;

/***/ }),

/***/ 9829:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "pK": function() { return /* binding */ refetchEvent; },
/* harmony export */   "MI": function() { return /* binding */ selectEventRefetch; },
/* harmony export */   "Ax": function() { return /* binding */ selectEventsRefetch; }
/* harmony export */ });
/* unused harmony exports eventSlice, refetchEvents */
/* harmony import */ var _reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6139);
/* harmony import */ var _reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__);

const initialState = {
  refetchEvent: false,
  refetchEvents: false
};
const eventSlice = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__.createSlice)({
  name: "event",
  initialState,
  reducers: {
    refetchEvent: (state, action) => {
      state.refetchEvent = !state.refetchEvent;
    },
    refetchEvents: (state, action) => {
      state.refetchEvents = !state.refetchEvents;
    }
  }
});
const {
  refetchEvent,
  refetchEvents
} = eventSlice.actions;
const selectEventRefetch = state => state.event.refetchEvent;
const selectEventsRefetch = state => state.event.refetchEvents;
/* harmony default export */ __webpack_exports__["ZP"] = (eventSlice.reducer);

/***/ }),

/***/ 9416:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "S1": function() { return /* binding */ eventApi; },
/* harmony export */   "SY": function() { return /* binding */ useAddEventMutation; },
/* harmony export */   "SO": function() { return /* binding */ usePostEventNotifMutation; },
/* harmony export */   "gV": function() { return /* binding */ useDeleteEventMutation; },
/* harmony export */   "VA": function() { return /* binding */ useEditEventMutation; },
/* harmony export */   "Tl": function() { return /* binding */ useGetEventQuery; },
/* harmony export */   "kg": function() { return /* binding */ useGetEventsQuery; },
/* harmony export */   "EY": function() { return /* binding */ getEvent; }
/* harmony export */ });
/* unused harmony exports useGetEventsByUserIdQuery, getEvents, getEventsByUserId, deleteEvent */
/* harmony import */ var querystring__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1191);
/* harmony import */ var querystring__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(querystring__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _reduxjs_toolkit_query_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(5641);
/* harmony import */ var _reduxjs_toolkit_query_react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_reduxjs_toolkit_query_react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var utils_query__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7020);



const eventApi = (0,_reduxjs_toolkit_query_react__WEBPACK_IMPORTED_MODULE_1__.createApi)({
  reducerPath: "eventsApi",
  baseQuery: utils_query__WEBPACK_IMPORTED_MODULE_2__/* .default */ .Z,
  tagTypes: ["Events"],
  endpoints: build => ({
    addEvent: build.mutation({
      query: body => ({
        url: `events`,
        method: "POST",
        body
      }),
      invalidatesTags: [{
        type: "Events",
        id: "LIST"
      }]
    }),
    postEventNotif: build.mutation({
      query: ({
        payload,
        eventUrl
      }) => ({
        url: `event/${eventUrl}`,
        method: "POST",
        body: payload
      })
    }),
    deleteEvent: build.mutation({
      query: ({
        eventUrl
      }) => ({
        url: `event/${eventUrl}`,
        method: "DELETE"
      })
    }),
    editEvent: build.mutation({
      query: ({
        payload,
        eventUrl
      }) => ({
        url: `event/${eventUrl || payload.eventUrl}`,
        method: "PUT",
        body: payload
      })
    }),
    getEvent: build.query({
      query: ({
        eventUrl,
        email,
        populate
      }) => ({
        url: email ? `event/${eventUrl}/${email}` : populate ? `event/${eventUrl}?populate=${populate}` : `event/${eventUrl}`
      })
    }),
    getEvents: build.query({
      query: query => ({
        url: `events?${querystring__WEBPACK_IMPORTED_MODULE_0___default().stringify(query)}`
      })
    }),
    getEventsByUserId: build.query({
      query: userId => ({
        url: `events/${userId}`
      })
    })
  })
});
const {
  useAddEventMutation,
  usePostEventNotifMutation,
  useDeleteEventMutation,
  useEditEventMutation,
  useGetEventQuery,
  useGetEventsQuery,
  useGetEventsByUserIdQuery
} = eventApi;
const {
  endpoints: {
    getEvent,
    getEvents,
    getEventsByUserId,
    deleteEvent
  }
} = eventApi;

/***/ }),

/***/ 9830:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Wb": function() { return /* binding */ topicsApi; },
/* harmony export */   "EZ": function() { return /* binding */ useAddTopicMutation; },
/* harmony export */   "Vz": function() { return /* binding */ usePostTopicNotifMutation; },
/* harmony export */   "Wn": function() { return /* binding */ useDeleteTopicMutation; },
/* harmony export */   "m$": function() { return /* binding */ useEditTopicMutation; }
/* harmony export */ });
/* harmony import */ var _reduxjs_toolkit_query_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5641);
/* harmony import */ var _reduxjs_toolkit_query_react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_reduxjs_toolkit_query_react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var utils_query__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7020);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



//const baseQueryWithRetry = retry(baseQuery, { maxRetries: 10 });
const topicsApi = (0,_reduxjs_toolkit_query_react__WEBPACK_IMPORTED_MODULE_0__.createApi)({
  reducerPath: "topicsApi",
  // We only specify this because there are many services. This would not be common in most applications
  //baseQuery: baseQueryWithRetry,
  baseQuery: utils_query__WEBPACK_IMPORTED_MODULE_1__/* .default */ .Z,
  tagTypes: ["Topics"],
  endpoints: build => ({
    addTopic: build.mutation({
      query: ({
        payload,
        topicNotif
      }) => ({
        url: `topics`,
        method: "POST",
        body: _objectSpread(_objectSpread({}, payload), {}, {
          topicNotif
        })
      }),
      invalidatesTags: [{
        type: "Topics",
        id: "LIST"
      }]
    }),
    postTopicNotif: build.mutation({
      query: ({
        payload,
        topicId
      }) => ({
        url: `topic/${topicId}`,
        method: "POST",
        body: payload
      })
    }),
    deleteTopic: build.mutation({
      query: topicId => ({
        url: `topic/${topicId}`,
        method: "DELETE"
      })
    }),
    editTopic: build.mutation({
      query: ({
        payload,
        topicId,
        topicNotif
      }) => ({
        url: `topic/${topicId ? topicId : payload._id}`,
        method: "PUT",
        body: _objectSpread(_objectSpread({}, payload), {}, {
          topicNotif
        })
      })
    }) // getTopics: build.query<ITopic[], undefined>({
    //   query: () => ({ url: `topics` })
    // }),
    // getTopicByName: build.query<ITopic, string>({
    //   query: (topicUrl) => ({ url: `topic/${topicUrl}` })
    // }),
    // getTopicsByCreator: build.query<ITopic[], string>({
    //   query: (createdBy) => ({ url: `topics/${createdBy}` })
    // })

  })
});
const {
  useAddTopicMutation,
  // useAddTopicDetailsMutation,
  usePostTopicNotifMutation,
  useDeleteTopicMutation,
  useEditTopicMutation // useGetTopicsQuery,
  // useGetTopicByNameQuery,
  // useGetTopicsByCreatorQuery

} = topicsApi;
const {
  endpoints: {
    /* getTopicByName, getTopics, getTopicsByCreator */
  }
} = topicsApi;

/***/ }),

/***/ 1442:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "E2": function() { return /* binding */ refetchOrg; },
/* harmony export */   "s$": function() { return /* binding */ selectOrgRefetch; },
/* harmony export */   "Z8": function() { return /* binding */ selectOrgsRefetch; }
/* harmony export */ });
/* unused harmony exports orgSlice, refetchOrgs */
/* harmony import */ var _reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6139);
/* harmony import */ var _reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__);

const initialState = {
  refetchOrg: false,
  refetchOrgs: false
};
const orgSlice = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__.createSlice)({
  name: "org",
  initialState,
  reducers: {
    refetchOrg: (state, action) => {
      state.refetchOrg = !state.refetchOrg;
    },
    refetchOrgs: (state, action) => {
      state.refetchOrgs = !state.refetchOrgs;
    }
  }
});
const {
  refetchOrg,
  refetchOrgs
} = orgSlice.actions;
const selectOrgRefetch = state => state.org.refetchOrg;
const selectOrgsRefetch = state => state.org.refetchOrgs;
/* harmony default export */ __webpack_exports__["ZP"] = (orgSlice.reducer);

/***/ }),

/***/ 2207:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "RX": function() { return /* binding */ orgApi; },
/* harmony export */   "vz": function() { return /* binding */ useAddOrgMutation; },
/* harmony export */   "Xt": function() { return /* binding */ useDeleteOrgMutation; },
/* harmony export */   "iO": function() { return /* binding */ useEditOrgMutation; },
/* harmony export */   "iA": function() { return /* binding */ useGetOrgQuery; },
/* harmony export */   "Gt": function() { return /* binding */ useGetOrgsQuery; },
/* harmony export */   "tn": function() { return /* binding */ getOrg; }
/* harmony export */ });
/* unused harmony exports useGetOrgsByUserIdQuery, getOrgs, getOrgsByUserId */
/* harmony import */ var _reduxjs_toolkit_query_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5641);
/* harmony import */ var _reduxjs_toolkit_query_react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_reduxjs_toolkit_query_react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var utils_query__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7020);

 //const baseQueryWithRetry = retry(baseQuery, { maxRetries: 10 });

const orgApi = (0,_reduxjs_toolkit_query_react__WEBPACK_IMPORTED_MODULE_0__.createApi)({
  reducerPath: "orgsApi",
  // We only specify this because there are many services. This would not be common in most applications
  //baseQuery: baseQueryWithRetry,
  baseQuery: utils_query__WEBPACK_IMPORTED_MODULE_1__/* .default */ .Z,
  tagTypes: ["Orgs"],
  endpoints: build => ({
    addOrg: build.mutation({
      query: body => ({
        url: `orgs`,
        method: "POST",
        body
      }),
      invalidatesTags: [{
        type: "Orgs",
        id: "LIST"
      }]
    }),
    deleteOrg: build.mutation({
      query: orgUrl => ({
        url: `org/${orgUrl}`,
        method: "DELETE"
      })
    }),
    editOrg: build.mutation({
      query: ({
        payload,
        orgUrl
      }) => ({
        url: `org/${orgUrl || payload.orgUrl}`,
        method: "PUT",
        body: payload
      })
    }),
    getOrg: build.query({
      query: ({
        orgUrl,
        populate
      }) => ({
        url: populate ? `org/${orgUrl}?populate=${populate}` : `org/${orgUrl}`
      })
    }),
    getOrgs: build.query({
      query: ({
        populate,
        createdBy
      }) => {
        let url = "orgs";

        if (populate) {
          url += `?populate=${populate}`;
          if (createdBy) url += `&createdBy=${createdBy}`;
        } else if (createdBy) url += `?createdBy=${createdBy}`;

        return {
          url
        };
      }
    }),
    getOrgsByUserId: build.query({
      query: userId => ({
        url: `orgs/${userId}`
      })
    })
  })
});
const {
  useAddOrgMutation,
  useDeleteOrgMutation,
  useEditOrgMutation,
  useGetOrgQuery,
  useGetOrgsQuery,
  useGetOrgsByUserIdQuery
} = orgApi;
const {
  endpoints: {
    getOrg,
    getOrgs,
    getOrgsByUserId
  }
} = orgApi;

/***/ }),

/***/ 7562:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "F$": function() { return /* binding */ projectApi; },
/* harmony export */   "KV": function() { return /* binding */ useAddProjectMutation; },
/* harmony export */   "ec": function() { return /* binding */ useDeleteProjectMutation; },
/* harmony export */   "KT": function() { return /* binding */ useEditProjectMutation; }
/* harmony export */ });
/* harmony import */ var _reduxjs_toolkit_query_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5641);
/* harmony import */ var _reduxjs_toolkit_query_react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_reduxjs_toolkit_query_react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var utils_query__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7020);

 //const baseQueryWithRetry = retry(baseQuery, { maxRetries: 10 });

const projectApi = (0,_reduxjs_toolkit_query_react__WEBPACK_IMPORTED_MODULE_0__.createApi)({
  reducerPath: "projectsApi",
  // We only specify this because there are many services. This would not be common in most applications
  //baseQuery: baseQueryWithRetry,
  baseQuery: utils_query__WEBPACK_IMPORTED_MODULE_1__/* .default */ .Z,
  tagTypes: ["Projects"],
  endpoints: build => ({
    addProject: build.mutation({
      query: body => ({
        url: `projects`,
        method: "POST",
        body
      }),
      invalidatesTags: [{
        type: "Projects",
        id: "LIST"
      }]
    }),
    deleteProject: build.mutation({
      query: projectId => ({
        url: `project/${projectId}`,
        method: "DELETE"
      })
    }),
    editProject: build.mutation({
      query: ({
        payload,
        projectId
      }) => ({
        url: `project/${projectId ? projectId : payload._id}`,
        method: "PUT",
        body: payload
      })
    }) // getProjects: build.query<IProject[], undefined>({
    //   query: () => ({ url: `projects` })
    // }),
    // getProjectByName: build.query<IProject, string>({
    //   query: (projectUrl) => ({ url: `project/${projectUrl}` })
    // }),
    // getProjectsByCreator: build.query<IProject[], string>({
    //   query: (createdBy) => ({ url: `projects/${createdBy}` })
    // })

  })
});
const {
  useAddProjectMutation,
  // useAddProjectDetailsMutation,
  useDeleteProjectMutation,
  useEditProjectMutation // useGetProjectsQuery,
  // useGetProjectByNameQuery,
  // useGetProjectsByCreatorQuery

} = projectApi;
const {
  endpoints: {
    /* getProjectByName, getProjects, getProjectsByCreator */
  }
} = projectApi;

/***/ }),

/***/ 6089:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "KY": function() { return /* binding */ setSession; },
/* harmony export */   "K4": function() { return /* binding */ setLoading; },
/* harmony export */   "Wu": function() { return /* binding */ selectSession; },
/* harmony export */   "NH": function() { return /* binding */ selectLoading; }
/* harmony export */ });
/* unused harmony export sessionSlice */
/* harmony import */ var _reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6139);
/* harmony import */ var _reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__);

const initialState = {
  session: null,
  loading: false
};
const sessionSlice = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__.createSlice)({
  name: "session",
  initialState,
  reducers: {
    setSession: (state, action) => {
      state.session = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    }
  }
});
const {
  setSession
} = sessionSlice.actions;
const {
  setLoading
} = sessionSlice.actions;
const selectSession = state => state.session.session;
const selectLoading = state => state.session.loading;
/* harmony default export */ __webpack_exports__["ZP"] = (sessionSlice.reducer);

/***/ }),

/***/ 1430:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "C3": function() { return /* binding */ isFollowedBy; },
/* harmony export */   "eM": function() { return /* binding */ isSubscribedBy; },
/* harmony export */   "di": function() { return /* binding */ selectSubscriptionRefetch; }
/* harmony export */ });
/* unused harmony exports subscriptionSlice, refetchSubscription */
/* harmony import */ var _reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6139);
/* harmony import */ var _reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var models_Subscription__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(8716);


const isFollowedBy = ({
  event,
  org,
  subQuery
}) => {
  if (!org && !event) return;
  if (!subQuery || !subQuery.data) return;

  if (org) {
    return subQuery.data.orgs.find(orgSubscription => orgSubscription.orgId === org._id && orgSubscription.type === models_Subscription__WEBPACK_IMPORTED_MODULE_1__/* .SubscriptionTypes.FOLLOWER */ .NY.FOLLOWER);
  }

  if (event) {
    return subQuery.data.events.find(eventSubscription => eventSubscription.eventId === event._id);
  }
};
const isSubscribedBy = (org, subQuery) => {
  var _subQuery$data$orgs;

  if (!org || !subQuery || !subQuery.data) return false;
  return !!((_subQuery$data$orgs = subQuery.data.orgs) !== null && _subQuery$data$orgs !== void 0 && _subQuery$data$orgs.find(orgSubscription => orgSubscription.orgId === org._id && orgSubscription.type === models_Subscription__WEBPACK_IMPORTED_MODULE_1__/* .SubscriptionTypes.SUBSCRIBER */ .NY.SUBSCRIBER));
};
const initialState = {
  refetchSubscription: false
};
const subscriptionSlice = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__.createSlice)({
  name: "subscription",
  initialState,
  reducers: {
    refetchSubscription: (state, action) => {
      state.refetchSubscription = !state.refetchSubscription;
    }
  }
});
const {
  refetchSubscription
} = subscriptionSlice.actions;
const selectSubscriptionRefetch = state => state.subscription.refetchSubscription;
/* harmony default export */ __webpack_exports__["ZP"] = (subscriptionSlice.reducer);

/***/ }),

/***/ 1096:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "h7": function() { return /* binding */ subscriptionApi; },
/* harmony export */   "h_": function() { return /* binding */ useAddSubscriptionMutation; },
/* harmony export */   "l_": function() { return /* binding */ useDeleteSubscriptionMutation; },
/* harmony export */   "xu": function() { return /* binding */ useGetSubscriptionQuery; },
/* harmony export */   "Tb": function() { return /* binding */ useGetSubscriptionsQuery; }
/* harmony export */ });
/* unused harmony exports useEditSubscriptionMutation, getSubscription, getSubscriptions, deleteSubscription */
/* harmony import */ var _reduxjs_toolkit_query_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5641);
/* harmony import */ var _reduxjs_toolkit_query_react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_reduxjs_toolkit_query_react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var utils_query__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7020);
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



const subscriptionApi = (0,_reduxjs_toolkit_query_react__WEBPACK_IMPORTED_MODULE_0__.createApi)({
  reducerPath: "subscriptionsApi",
  baseQuery: utils_query__WEBPACK_IMPORTED_MODULE_1__/* .default */ .Z,
  tagTypes: ["Subscriptions"],
  endpoints: build => ({
    addSubscription: build.mutation({
      query: ({
        payload,
        email,
        phone,
        user
      }) => ({
        url: `subscriptions`,
        method: "POST",
        body: _objectSpread(_objectSpread({}, payload), {}, {
          email,
          phone,
          user
        })
      }),
      invalidatesTags: [{
        type: "Subscriptions",
        id: "LIST"
      }]
    }),
    deleteSubscription: build.mutation({
      query: ({
        payload,
        subscriptionId,
        orgId,
        topicId
      }) => ({
        url: `subscription/${subscriptionId}`,
        method: "DELETE",
        body: payload ? payload : {
          orgId,
          topicId
        }
      })
    }),
    editSubscription: build.mutation({
      query: ({
        payload,
        subscriptionId
      }) => ({
        url: `subscription/${subscriptionId || payload._id}`,
        method: "PUT",
        body: payload
      })
    }),
    getSubscription: build.query({
      // slug is either :
      // - email
      // - user._id
      // - subscription._id
      query: slug => ({
        url: `subscription/${slug || ""}`
      })
    }),
    getSubscriptions: build.query({
      query: ({
        topicId
      }) => ({
        url: `subscriptions${topicId ? `?topicId=${topicId}` : ""}`
      })
    }) // getSubscription: build.query<ISubscription, string | undefined>({
    //   query: (string) => ({ url: `subscriptions/${string}` })
    // })

  })
});
const {
  useAddSubscriptionMutation,
  useDeleteSubscriptionMutation,
  useEditSubscriptionMutation,
  useGetSubscriptionQuery,
  useGetSubscriptionsQuery
} = subscriptionApi;
const {
  endpoints: {
    getSubscription,
    getSubscriptions,
    deleteSubscription
  }
} = subscriptionApi;

/***/ }),

/***/ 3185:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "WG": function() { return /* binding */ setUserEmail; },
/* harmony export */   "I_": function() { return /* binding */ selectUserEmail; }
/* harmony export */ });
/* unused harmony export userSlice */
/* harmony import */ var _reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6139);
/* harmony import */ var _reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__);

const initialState = {
  userEmail: null
};
const userSlice = (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_0__.createSlice)({
  name: "user",
  initialState,
  reducers: {
    setUserEmail: (state, action) => {
      if (!action.payload) state.userEmail = initialState.userEmail;
      state.userEmail = action.payload;
    }
  }
});
const {
  setUserEmail
} = userSlice.actions;
const selectUserEmail = state => state.user.userEmail;
/* harmony default export */ __webpack_exports__["ZP"] = (userSlice.reducer);

/***/ }),

/***/ 4616:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "BG": function() { return /* binding */ userApi; },
/* harmony export */   "Vx": function() { return /* binding */ useAddUserMutation; },
/* harmony export */   "Gl": function() { return /* binding */ useEditUserMutation; },
/* harmony export */   "GR": function() { return /* binding */ useGetUserQuery; },
/* harmony export */   "PR": function() { return /* binding */ getUser; }
/* harmony export */ });
/* unused harmony export useGetUserByEmailQuery */
/* harmony import */ var _reduxjs_toolkit_query_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5641);
/* harmony import */ var _reduxjs_toolkit_query_react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_reduxjs_toolkit_query_react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var utils_query__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7020);


const userApi = (0,_reduxjs_toolkit_query_react__WEBPACK_IMPORTED_MODULE_0__.createApi)({
  reducerPath: "usersApi",
  baseQuery: utils_query__WEBPACK_IMPORTED_MODULE_1__/* .default */ .Z,
  tagTypes: ["Users"],
  endpoints: build => ({
    addUser: build.mutation({
      query: payload => ({
        url: `users`,
        method: "POST",
        body: payload
      }),
      invalidatesTags: [{
        type: "Users",
        id: "LIST"
      }]
    }),
    editUser: build.mutation({
      query: ({
        payload,
        userName
      }) => ({
        url: `user/${userName || payload.userName}`,
        method: "PUT",
        body: payload
      })
    }),
    getUser: build.query({
      query: userName => ({
        url: `user/${userName}`
      })
    }),
    getUserByEmail: build.query({
      query: email => ({
        url: `user/${email}`
      })
    })
  })
});
const {
  useAddUserMutation,
  useEditUserMutation,
  useGetUserQuery,
  useGetUserByEmailQuery
} = userApi;
const {
  endpoints: {
    getUser
  }
} = userApi;

/***/ }),

/***/ 4281:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "TL": function() { return /* binding */ useAppDispatch; },
/* harmony export */   "YS": function() { return /* binding */ wrapper; }
/* harmony export */ });
/* unused harmony export store */
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(79);
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_redux__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6139);
/* harmony import */ var _reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _reduxjs_toolkit_query_react__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(5641);
/* harmony import */ var _reduxjs_toolkit_query_react__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_reduxjs_toolkit_query_react__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var next_redux_wrapper__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(2744);
/* harmony import */ var next_redux_wrapper__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(next_redux_wrapper__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var features_events_eventSlice__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(9829);
/* harmony import */ var features_orgs_orgSlice__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(1442);
/* harmony import */ var features_session_sessionSlice__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(6089);
/* harmony import */ var features_subscriptions_subscriptionSlice__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(1430);
/* harmony import */ var features_users_userSlice__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(3185);
/* harmony import */ var features_events_eventsApi__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(9416);
/* harmony import */ var features_orgs_orgsApi__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(2207);
/* harmony import */ var features_projects_projectsApi__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(7562);
/* harmony import */ var features_subscriptions_subscriptionsApi__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(1096);
/* harmony import */ var features_forum_topicsApi__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(9830);
/* harmony import */ var features_users_usersApi__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(4616);
/* harmony import */ var features_documents_documentsApi__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(2445);

















const makeStore = () => (0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_1__.configureStore)({
  reducer: {
    event: features_events_eventSlice__WEBPACK_IMPORTED_MODULE_4__/* .default */ .ZP,
    org: features_orgs_orgSlice__WEBPACK_IMPORTED_MODULE_5__/* .default */ .ZP,
    session: features_session_sessionSlice__WEBPACK_IMPORTED_MODULE_6__/* .default */ .ZP,
    subscription: features_subscriptions_subscriptionSlice__WEBPACK_IMPORTED_MODULE_7__/* .default */ .ZP,
    user: features_users_userSlice__WEBPACK_IMPORTED_MODULE_8__/* .default */ .ZP,
    [features_documents_documentsApi__WEBPACK_IMPORTED_MODULE_15__/* .documentApi.reducerPath */ .tG.reducerPath]: features_documents_documentsApi__WEBPACK_IMPORTED_MODULE_15__/* .documentApi.reducer */ .tG.reducer,
    [features_events_eventsApi__WEBPACK_IMPORTED_MODULE_9__/* .eventApi.reducerPath */ .S1.reducerPath]: features_events_eventsApi__WEBPACK_IMPORTED_MODULE_9__/* .eventApi.reducer */ .S1.reducer,
    [features_orgs_orgsApi__WEBPACK_IMPORTED_MODULE_10__/* .orgApi.reducerPath */ .RX.reducerPath]: features_orgs_orgsApi__WEBPACK_IMPORTED_MODULE_10__/* .orgApi.reducer */ .RX.reducer,
    [features_projects_projectsApi__WEBPACK_IMPORTED_MODULE_11__/* .projectApi.reducerPath */ .F$.reducerPath]: features_projects_projectsApi__WEBPACK_IMPORTED_MODULE_11__/* .projectApi.reducer */ .F$.reducer,
    [features_subscriptions_subscriptionsApi__WEBPACK_IMPORTED_MODULE_12__/* .subscriptionApi.reducerPath */ .h7.reducerPath]: features_subscriptions_subscriptionsApi__WEBPACK_IMPORTED_MODULE_12__/* .subscriptionApi.reducer */ .h7.reducer,
    [features_forum_topicsApi__WEBPACK_IMPORTED_MODULE_13__/* .topicsApi.reducerPath */ .Wb.reducerPath]: features_forum_topicsApi__WEBPACK_IMPORTED_MODULE_13__/* .topicsApi.reducer */ .Wb.reducer,
    [features_users_usersApi__WEBPACK_IMPORTED_MODULE_14__/* .userApi.reducerPath */ .BG.reducerPath]: features_users_usersApi__WEBPACK_IMPORTED_MODULE_14__/* .userApi.reducer */ .BG.reducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({
    serializableCheck: false
  }).concat(features_documents_documentsApi__WEBPACK_IMPORTED_MODULE_15__/* .documentApi.middleware */ .tG.middleware, features_events_eventsApi__WEBPACK_IMPORTED_MODULE_9__/* .eventApi.middleware */ .S1.middleware, features_orgs_orgsApi__WEBPACK_IMPORTED_MODULE_10__/* .orgApi.middleware */ .RX.middleware, features_projects_projectsApi__WEBPACK_IMPORTED_MODULE_11__/* .projectApi.middleware */ .F$.middleware, features_subscriptions_subscriptionsApi__WEBPACK_IMPORTED_MODULE_12__/* .subscriptionApi.middleware */ .h7.middleware, features_forum_topicsApi__WEBPACK_IMPORTED_MODULE_13__/* .topicsApi.middleware */ .Wb.middleware, features_users_usersApi__WEBPACK_IMPORTED_MODULE_14__/* .userApi.middleware */ .BG.middleware),
  devTools: false
});

const store = makeStore();
(0,_reduxjs_toolkit_query_react__WEBPACK_IMPORTED_MODULE_2__.setupListeners)(store.dispatch);
const useAppDispatch = () => (0,react_redux__WEBPACK_IMPORTED_MODULE_0__.useDispatch)();
const wrapper = (0,next_redux_wrapper__WEBPACK_IMPORTED_MODULE_3__.createWrapper)(makeStore);

/***/ }),

/***/ 7020:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var _reduxjs_toolkit_query_react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5641);
/* harmony import */ var _reduxjs_toolkit_query_react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_reduxjs_toolkit_query_react__WEBPACK_IMPORTED_MODULE_0__);

const baseQuery = (0,_reduxjs_toolkit_query_react__WEBPACK_IMPORTED_MODULE_0__.fetchBaseQuery)({
  baseUrl: "https://aucourant.de/api"
});
/* harmony default export */ __webpack_exports__["Z"] = (baseQuery);

/***/ })

};
;