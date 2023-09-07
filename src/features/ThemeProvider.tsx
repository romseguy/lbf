import { ChakraProvider, cookieStorageManager } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import theme from "features/layout/theme";
//import { isServer } from "utils/isServer";

export function ThemeProvider({
  cookies,
  children
}: PropsWithChildren<{
  cookies?: string;
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
      {children}
    </ChakraProvider>
  );
}
