import { EmailIcon, QuestionIcon } from "@chakra-ui/icons";
import { Box, BoxProps, IconButton, Tooltip } from "@chakra-ui/react";
import React from "react";
import { Link } from "features/common";
import { useAppDispatch } from "store";
import { setIsContactModalOpen } from "store/modalSlice";

export const IconFooter = ({ ...props }: BoxProps & {}) => {
  const dispatch = useAppDispatch();
  const label = "Une question ? Contactez-nous  ͡❛ ͜ʖ ͡❛";
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
          icon={<QuestionIcon />}
        />
      </Tooltip>
    </Link>
  );

  return <Box {...props}>{link}</Box>;
};
