import { Flex, FlexProps } from "@chakra-ui/react";

export const Footer = (props: FlexProps) => (
  <Flex
    as="footer"
    alignItems="center"
    justifyContent="space-between"
    py={5}
    px={10}
    {...props}
  />
);
