import React from "react";
import { Flex, Heading, SpaceProps, TypographyProps } from "@chakra-ui/react";

export const Hero = ({
  title,
  ...props
}: // align = "center"
SpaceProps &
  TypographyProps & {
    title: string | string[] | undefined;
    // align?: string | string[];
  }) => (
  // <Flex justifyContent={align} alignItems={align}>
  <Heading as="h1" className="hero rainbow-text" {...props}>
    {title}
  </Heading>
  // </Flex>
);
