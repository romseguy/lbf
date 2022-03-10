import {
  configureStore,
  createSlice,
  PayloadAction,
  ThunkAction
} from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { createWrapper } from "next-redux-wrapper";
import { useDispatch } from "react-redux";
import { Action } from "redux";

import { documentApi } from "features/documents/documentsApi";

import event from "features/events/eventSlice";
import { eventApi } from "features/events/eventsApi";

import org from "features/orgs/orgSlice";
import { orgApi } from "features/orgs/orgsApi";

import modal from "features/modals/modalSlice";

import { projectApi } from "features/projects/projectsApi";

import session from "features/session/sessionSlice";

import subscription from "features/subscriptions/subscriptionSlice";
import { subscriptionApi } from "features/subscriptions/subscriptionsApi";

import { topicsApi } from "features/forum/topicsApi";

import user from "features/users/userSlice";
import { userApi } from "features/users/usersApi";

const uiSlice = createSlice({
  name: "ui",
  initialState: { isAppMounted: false, rteditorIndex: 0 },
  reducers: {
    incrementRTEditorIndex: (state, action: PayloadAction<undefined>) => {
      state.rteditorIndex++;
    },
    setIsAppMounted: (state, action: PayloadAction<boolean>) => {
      state.isAppMounted = action.payload;
    }
  }
});

export const { incrementRTEditorIndex, setIsAppMounted } = uiSlice.actions;
export const selectRTEditorIndex = (state: AppState) => state.ui.rteditorIndex;
export const selectIsAppMounted = (state: AppState) => state.ui.isAppMounted;

const makeStore = () =>
  configureStore({
    reducer: {
      [uiSlice.name]: uiSlice.reducer,
      event,
      org,
      modal,
      session,
      subscription,
      user,
      [documentApi.reducerPath]: documentApi.reducer,
      [eventApi.reducerPath]: eventApi.reducer,
      [orgApi.reducerPath]: orgApi.reducer,
      [projectApi.reducerPath]: projectApi.reducer,
      [subscriptionApi.reducerPath]: subscriptionApi.reducer,
      [topicsApi.reducerPath]: topicsApi.reducer,
      [userApi.reducerPath]: userApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({ serializableCheck: false }).concat(
        documentApi.middleware,
        eventApi.middleware,
        orgApi.middleware,
        projectApi.middleware,
        subscriptionApi.middleware,
        topicsApi.middleware,
        userApi.middleware
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
