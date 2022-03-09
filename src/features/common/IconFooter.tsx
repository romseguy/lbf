import { Box, BoxProps, IconButton, Image, Tooltip } from "@chakra-ui/react";
import React from "react";
import { Link } from "features/common";
import { useAppDispatch } from "store";
import { setIsContactModalOpen } from "features/modals/modalSlice";
import { EmailIcon } from "@chakra-ui/icons";

export const IconFooter = ({
  noContainer = false,
  ...props
}: BoxProps & {
  noContainer?: boolean;
}) => {
  const dispatch = useAppDispatch();
  const label = "Contactez-nous  ͡❛ ͜ʖ ͡❛";
  const link = (
    <Link
      onClick={() => {
        dispatch(setIsContactModalOpen(true));
      }}
    >
      <Tooltip hasArrow label={label}>
        {/* <Image src="/favicon-32x32.png" /> */}
        <IconButton
          aria-label={label}
          colorScheme="purple"
          icon={<EmailIcon />}
        />
      </Tooltip>
    </Link>
  );

  return <Box {...props}>{link}</Box>;
};
