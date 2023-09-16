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
import { settingApi } from "features/api/settingsApi";
const { getEnv } = require("utils/env");

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
      [settingApi.reducerPath]: settingApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }).concat([
        api.middleware,
        settingApi.middleware
      ]),
    devTools: getEnv() !== "production"
  });

export const store = makeStore();
// export const getState = store.getState;
// interface customWindow extends Window {
//   getState?: typeof getState;
// }
// declare const window: customWindow;
// if (!isServer() && getEnv() === "development") {
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
