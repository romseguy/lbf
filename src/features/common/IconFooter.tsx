import { Box, BoxProps, Image, Tooltip } from "@chakra-ui/react";
import React from "react";
import { Link } from "features/common";
import { useAppDispatch } from "store";
import { setIsContactModalOpen } from "features/modals/modalSlice";

export const IconFooter = ({
  noContainer = false,
  ...props
}: BoxProps & {
  noContainer?: boolean;
}) => {
  const dispatch = useAppDispatch();
  const link = (
    <Link
      onClick={() => {
        dispatch(setIsContactModalOpen(true));
      }}
    >
      <Tooltip hasArrow label="Contacter le créateur de cet outil  ͡❛ ͜ʖ ͡❛">
        <Image src="/favicon-32x32.png" />
      </Tooltip>
    </Link>
  );

  if (noContainer) return <>{link}</>;

  return (
    <>
      <Box align="center" {...props}>
        {link}
      </Box>
    </>
  );
};
