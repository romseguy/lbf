import {
  Flex,
  FlexProps,
  Heading as ChakraHeading,
  HeadingProps,
  useColorMode
} from "@chakra-ui/react";

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
      className={`rainbow-text ${isDark ? "dark" : ""}`}
      fontFamily="DancingScript"
      fontSize={smaller ? "2xl" : ["2xl", "4xl"]}
      pl={1}
      {...props}
    >
      {children}
    </ChakraHeading>
  );

  if (noContainer) return element;

  return <Flex>{element}</Flex>;
};
