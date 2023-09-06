import {
  BaseThemeWithExtensions,
  ChakraProvider,
  cookieStorageManagerSSR
} from "@chakra-ui/react";
import { PropsWithChildren } from "react";

export function Chakra({
  cookies,
  children,
  theme
}: PropsWithChildren<{
  cookies?: string;
  theme: BaseThemeWithExtensions<any, any>;
}>) {
  const colorModeManager = cookieStorageManagerSSR(
    cookies || "chakra-ui-color-mode=light"
  );

  return (
    <ChakraProvider resetCSS theme={theme} colorModeManager={colorModeManager}>
      {children}
    </ChakraProvider>
  );
}
