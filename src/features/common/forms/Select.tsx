import { Select as ChakraSelect, useColorMode } from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

import { styled } from "twin.macro";

export const Select = styled(ChakraSelect)((/* props */) => {
  const { colorMode } = useColorMode();
  if (/* props. */ colorMode === "dark")
    return `
    border: 1px solid #7b8593;

    :hover {
      border: 1px solid white;
    }
    `;
  return null;
});
