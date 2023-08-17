import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { makeStore } from "store";
import IndexPage from "pages/index";

function renderWithProviders(
  ui,
  {
    preloadedState = {},
    // Automatically create a store instance if no store was passed in
    store = makeStore(preloadedState),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

jest.mock("next/router", () => ({
  __esModule: true,
  useRouter: () => ({
    query: {},
    pathname: "/",
    asPath: "/",
    events: {
      emit: jest.fn(),
      on: jest.fn(),
      off: jest.fn()
    },
    push: jest.fn(() => Promise.resolve(true)),
    prefetch: jest.fn(() => Promise.resolve(true)),
    replace: jest.fn(() => Promise.resolve(true))
  })
}));

describe("0", () => {
  it("0.1", () => {
    renderWithProviders(<IndexPage />);
  });
});

// // mock useRouter
// jest.mock('next/router', () => ({
//   useRouter: jest.fn()
// }))

// // setup a new mocking function for push method
// const pushMock = jest.fn()

// // mock a return value on useRouter
// useRouter.mockReturnValue({
//   query: {},
//   pathname: "/",
//   // return mock for push method
//   push: pushMock,
//   // ... add the props or methods you need
// })

//import App from "pages/_app";
