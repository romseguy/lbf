import { Tag } from "@chakra-ui/react";
import React from "react";

export const HostTag = () => {
  return <Tag colorScheme="red">{process.env.NEXT_PUBLIC_SHORT_URL}</Tag>;
};
