import {
  ChakraProvider,
  createCookieStorageManager
  //cookieStorageManager,
  //cookieStorageManagerSSR
} from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { GlobalStyles } from "features/layout";
import theme from "features/layout/theme";
//import { isServer } from "utils/isServer";
//import { wrapper } from "store";

export function ThemeProvider({
  cookies,
  children,
  isMobile
}: PropsWithChildren<{
  cookies?: string;
  isMobile: boolean;
}>) {
  // https://chakra-ui.com/docs/styled-system/color-mode#add-colormodemanager-optional-for-ssr
  // if you use colorModeManager, you can avoid adding the <ColorModeScript /> to _document.js.

  const colorModeManager = createCookieStorageManager("lbf-cui", cookies);
  //const colorModeManager = cookieStorageManagerSSR(cookies || "");

  return (
    <ChakraProvider
      resetCSS
      theme={theme}
      colorModeManager={colorModeManager}
      //colorModeManager={cookieStorageManager(cookies)}
      //colorModeManager={cookieStorageManager}
    >
      <GlobalStyles isMobile={isMobile} />
      {children}
    </ChakraProvider>
  );
}

// export const getServerSideProps = wrapper.getServerSideProps(
//   (store) => async (ctx) => {
//     const headers = ctx.req?.headers;
//     const cookies = headers?.cookie;

//     return {
//       props: { cookies }
//     };
//   }
// );
