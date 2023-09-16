import { ChakraProvider, cookieStorageManager } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { GlobalStyles } from "features/layout";
import theme from "features/layout/theme";
//import { isServer } from "utils/isServer";

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
  // const colorModeManager = cookieStorageManagerSSR(
  //   cookies || "chakra-ui-color-mode=light"
  // );

  return (
    <ChakraProvider
      resetCSS
      theme={theme}
      colorModeManager={cookieStorageManager(cookies)}
    >
      <GlobalStyles isMobile={isMobile} />
      {children}
    </ChakraProvider>
  );
}
