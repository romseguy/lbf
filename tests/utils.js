import { render as tlRender } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { Chakra } from "features/common";
import theme from "features/layout/theme";
import { makeStore } from "store";

export function wrapper(store) {
  return ({ children }) => <Provider store={store}><Chakra theme={theme}>{children}</Chakra></Provider>;
  //return <App Component={children} />;
}

export function render(
  ui,
  {
    preloadedState = {},
    store = makeStore(preloadedState),
    ...renderOptions
  } = {}
) {
  return { store, ...tlRender(ui, { wrapper: wrapper(store), ...renderOptions }) };
}
