import { configureStore, ThunkAction } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { createWrapper } from "next-redux-wrapper";
import { useDispatch } from "react-redux";
import { Action } from "redux";

import event from "./eventSlice";
import modal from "./modalSlice";
import org from "./orgSlice";
import session from "./sessionSlice";
import subscription from "./subscriptionSlice";
import ui from "./uiSlice";
import user from "./userSlice";

import { api } from "features/api";
//import { documentApi } from "features/api/documentsApi";
//import { eventApi } from "features/api/eventsApi";
//import { orgApi } from "features/api/orgsApi";
import { projectApi } from "features/api/projectsApi";
import { subscriptionApi } from "features/api/subscriptionsApi";
import { topicApi } from "features/api/topicsApi";
//import { userApi } from "features/api/usersApi";

const makeStore = () =>
  configureStore({
    reducer: {
      event,
      modal,
      org,
      session,
      subscription,
      ui,
      user,
      [api.reducerPath]: api.reducer,
      //[documentApi.reducerPath]: documentApi.reducer,
      //[eventApi.reducerPath]: eventApi.reducer,
      //[orgApi.reducerPath]: orgApi.reducer,
      [projectApi.reducerPath]: projectApi.reducer,
      [subscriptionApi.reducerPath]: subscriptionApi.reducer,
      [topicApi.reducerPath]: topicApi.reducer
      //[userApi.reducerPath]: userApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }).concat(
        api.middleware,
        //documentApi.middleware,
        //eventApi.middleware,
        //orgApi.middleware,
        projectApi.middleware,
        subscriptionApi.middleware,
        topicApi.middleware
        //userApi.middleware
      ),
    devTools: process.env.NODE_ENV !== "production"
  });

export const store = makeStore();
setupListeners(store.dispatch);

export type AppStore = ReturnType<typeof makeStore>;
export type AppState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action
>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const wrapper = createWrapper<AppStore>(makeStore);
