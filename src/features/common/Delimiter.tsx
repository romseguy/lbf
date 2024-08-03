import { Box, BoxProps } from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

export const Delimiter = ({ ...props }: BoxProps & {}) => {
  return (
    <Box as="span" aria-hidden mx={1} {...props}>
      ·
    </Box>
  );
};
