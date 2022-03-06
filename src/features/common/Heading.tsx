import {
  Flex,
  Heading as ChakraHeading,
  HeadingProps,
  useColorMode
} from "@chakra-ui/react";

export const Heading = ({
  children,
  ...props
}: HeadingProps & { children: React.ReactNode }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  return (
    <Flex>
      <ChakraHeading
        className={`rainbow-text ${isDark ? "dark" : ""}`}
        fontFamily="DancingScript"
        fontSize={["2xl", "4xl"]}
        pl={1}
        {...props}
      >
        {children}
      </ChakraHeading>
    </Flex>
  );
};
