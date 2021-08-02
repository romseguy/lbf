import { useDispatch } from "react-redux";
import { configureStore, ThunkAction } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { Action } from "redux";
import { createWrapper } from "next-redux-wrapper";
import org from "features/orgs/orgSlice";
import subscription from "features/subscriptions/subscriptionSlice";
import user from "features/users/userSlice";
import { eventApi } from "features/events/eventsApi";
import { orgApi } from "features/orgs/orgsApi";
import { subscriptionApi } from "features/subscriptions/subscriptionsApi";
import { userApi } from "features/users/usersApi";

const makeStore = () =>
  configureStore({
    reducer: {
      org,
      subscription,
      user,
      [eventApi.reducerPath]: eventApi.reducer,
      [orgApi.reducerPath]: orgApi.reducer,
      [subscriptionApi.reducerPath]: subscriptionApi.reducer,
      [userApi.reducerPath]: userApi.reducer
    },
    middleware: (getDefaultMiddleware) =>
      // getDefaultMiddleware({ serializableCheck: false }).concat(logger),
      getDefaultMiddleware().concat(
        eventApi.middleware,
        orgApi.middleware,
        subscriptionApi.middleware,
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
