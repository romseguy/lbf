import {
  Flex,
  FlexProps,
  Heading as ChakraHeading,
  HeadingProps,
  useColorMode
} from "@chakra-ui/react";
import { css } from "twin.macro";
import { rainbowTextCss } from "features/layout/theme";

export const Heading = ({
  children,
  containerProps,
  smaller,
  noContainer = false,
  ...props
}: HeadingProps & {
  children: React.ReactNode;
  containerProps?: FlexProps;
  smaller?: boolean;
  noContainer?: boolean;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const element = (
    <ChakraHeading
      fontFamily="DancingScript"
      fontSize={smaller ? "2xl" : ["2xl", "4xl"]}
      pl={1}
      css={css(rainbowTextCss(isDark))}
      {...props}
    >
      {children}
    </ChakraHeading>
  );

  if (noContainer) return element;

  return <Flex {...containerProps}>{element}</Flex>;
};
