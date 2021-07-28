import { Input as ChakraInput, useColorMode } from "@chakra-ui/react";
import styled from "@emotion/styled";

export const Input = styled(ChakraInput)((/* props */) => {
  const { colorMode } = useColorMode();
  if (/* props. */ colorMode === "dark")
    return `
    border: 1px solid #7b8593;

    :hover {
      border: 1px solid white;
    }

    ::placeholder {
      color: #7b8593;
    }
    `;
  return null;
});
