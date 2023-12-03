import React from "react";
import { Link } from "features/common";
import { LinkProps } from "features/common";
import { useAppDispatch } from "store";
import { setIsContactModalOpen } from "store/modalSlice";

export const ContactLink = (props: LinkProps & { label?: string }) => {
  const dispatch = useAppDispatch();
  return (
    <Link
      variant="underline"
      onClick={() => dispatch(setIsContactModalOpen(true))}
      {...props}
    >
      {props.label || "contactez-nous"}
    </Link>
  );
};
