import { Flex, FlexProps, useColorMode } from "@chakra-ui/react";
import tw, { css } from "twin.macro";

export const Footer = ({
  children,
  ...props
}: FlexProps & { children: React.ReactNode }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const styles = css`
    ${isDark ? tw`bg-gray-800` : tw`bg-white`}
  `;

  return (
    <Flex
      as="footer"
      css={styles}
      alignItems="center"
      justifyContent="flex-end"
      pr={3}
      // py={5}
      // px={10}
      {...props}
    >
      {children}
    </Flex>
  );
};
