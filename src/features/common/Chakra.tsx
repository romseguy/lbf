import {
  ChakraProvider,
  cookieStorageManager,
  localStorageManager,
  BaseThemeWithExtensions
} from "@chakra-ui/react";

export function Chakra({
  cookies,
  children,
  theme
}: {
  cookies: any;
  children: React.ReactNode | React.ReactNodeArray;
  theme: BaseThemeWithExtensions<any, any>;
}) {
  const colorModeManager =
    typeof cookies === "string"
      ? cookieStorageManager(cookies)
      : localStorageManager;

  return (
    <ChakraProvider resetCSS theme={theme} colorModeManager={colorModeManager}>
      {children}
    </ChakraProvider>
  );
}
