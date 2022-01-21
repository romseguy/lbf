import { EmailIcon } from "@chakra-ui/icons";
import {
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverProps,
  PopoverTrigger,
  Icon,
  IconButton,
  IconProps,
  Box,
  Heading,
  BoxProps,
  Tooltip
} from "@chakra-ui/react";
import React, { useState } from "react";
import { EmailLoginForm } from "features/forms/EmailLoginForm";

export const EmailLoginPopover = ({
  iconProps,
  popoverProps,
  ...props
}: BoxProps & { iconProps?: IconProps; popoverProps?: PopoverProps }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box {...props}>
      <Popover
        isLazy
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
        }}
        {...popoverProps}
      >
        <PopoverTrigger>
          <Tooltip label="Connexion par e-mail">
            <IconButton
              onClick={() => {
                setIsOpen(!isOpen);
              }}
              aria-label="Connexion par e-mail"
              bg="transparent"
              _hover={{ bg: "transparent" }}
              icon={
                <Icon
                  as={EmailIcon}
                  _hover={{ color: "#00B5D8" }}
                  {...iconProps}
                />
              }
            />
          </Tooltip>
        </PopoverTrigger>

        <PopoverContent>
          <PopoverHeader>
            <Heading size="md">Connexion par e-mail</Heading>
          </PopoverHeader>
          <PopoverBody>
            <EmailLoginForm onCancel={() => setIsOpen(false)} />
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
};
