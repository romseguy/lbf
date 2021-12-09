import { Box, Image, Tooltip } from "@chakra-ui/react";

export const IconFooter = () => {
  return (
    <Box my={3} borderBottomRadius="lg" align="center">
      <a href="https://twitter.com/romseguy" target="_blank">
        <Tooltip hasArrow label="Contacter le développeur  ͡❛ ͜ʖ ͡❛">
          <Image src="/favicon-32x32.png" />
        </Tooltip>
      </a>
    </Box>
  );
};
