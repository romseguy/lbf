import { Box } from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

export const TextSeparator = () => (
  <Box as="span" aria-hidden mx={1}>
    ·
  </Box>
);
