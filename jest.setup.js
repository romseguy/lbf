import 'cross-fetch/polyfill';
import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

jest.mock('next/router', () => {
  const router = {
    asPath: "",
    events: {
      on: jest.fn(),
      off: jest.fn(),
      emit: jest.fn(),
    },
    route: "",
    pathname: "/",
    push: jest.fn(),
    query: {},
  }

  return {
    __esModule: true,
    ...jest.requireActual('next/router'),
    ...router,
    useRouter: jest.fn().mockReturnValue(router)
  }
});
jest.mock('react-datepicker/dist/react-datepicker.min.css', () => '')

// jest.mock('next/router',
//  () => ({
//   query: {},
//   pathname: "/",
//   asPath: "/",
//   events: {
//     emit: jest.fn(),
//     on: jest.fn(),
//     off: jest.fn()
//   },
//   push: jest.fn(() => Promise.resolve(true)),
//   prefetch: jest.fn(() => Promise.resolve(true)),
//   replace: jest.fn(() => Promise.resolve(true))
// })
// )