import { configureStore, ThunkAction } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { createWrapper } from "next-redux-wrapper";
import { useDispatch } from "react-redux";
import { Action } from "redux";

import event from "./eventSlice";
import modal from "./modalSlice";
import org from "./orgSlice";
import session from "./sessionSlice";
import setting from "./settingSlice";
import subscription from "./subscriptionSlice";
import ui from "./uiSlice";
import user from "./userSlice";

import { api } from "features/api";
//import { documentApi } from "features/api/documentsApi";
//import { eventApi } from "features/api/eventsApi";
//import { orgApi } from "features/api/orgsApi";
import { projectApi } from "features/api/projectsApi";
import { settingApi } from "features/api/settingsApi";
import { subscriptionApi } from "features/api/subscriptionsApi";
import { topicApi } from "features/api/topicsApi";
//import { isServer } from "utils/isServer";
//import { userApi } from "features/api/usersApi";

export const makeStore = () =>
  configureStore({
    reducer: {
      event,
      modal,
      org,
      session,
      setting,
      subscription,
      ui,
      user,
      [api.reducerPath]: api.reducer,
      //[documentApi.reducerPath]: documentApi.reducer,
      //[eventApi.reducerPath]: eventApi.reducer,
      //[orgApi.reducerPath]: orgApi.reducer,
      [projectApi.reducerPath]: projectApi.reducer,
      [settingApi.reducerPath]: settingApi.reducer,
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
// export const getState = store.getState;
// interface customWindow extends Window {
//   getState?: typeof getState;
// }
// declare const window: customWindow;
// if (!isServer() && process.env.NODE_ENV === "development") {
//   window.getState = getState;
// }

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
export const wrapper = createWrapper<AppStore>(makeStore, { debug: false });
