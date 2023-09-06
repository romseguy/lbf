import {
  Flex,
  FlexProps,
  Heading,
  HeadingProps,
  useColorMode
} from "@chakra-ui/react";
import { css } from "twin.macro";
import { rainbowTextCss } from "features/layout/theme";

export const AppHeading = ({
  children,
  containerProps,
  fontFamily = "Roboto",
  smaller,
  noContainer = false,
  ...props
}: HeadingProps & {
  children: React.ReactNode;
  containerProps?: FlexProps;
  fontFamily?: string;
  smaller?: boolean;
  noContainer?: boolean;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const element = (
    <Heading
      fontFamily={fontFamily}
      fontSize={smaller ? "2xl" : ["3xl", "4xl"]}
      css={css(rainbowTextCss(isDark))}
      {...props}
    >
      {children}
    </Heading>
  );

  if (noContainer) return element;

  return <Flex {...containerProps}>{element}</Flex>;
};
