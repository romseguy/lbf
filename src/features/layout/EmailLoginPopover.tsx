import { EmailIcon } from "@chakra-ui/icons";
import {
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverFooter,
  PopoverHeader,
  PopoverProps,
  PopoverTrigger,
  Icon,
  IconButton,
  IconProps,
  Box,
  Heading,
  Button,
  BoxProps,
  Alert,
  AlertIcon,
  Tooltip
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import { signIn } from "next-auth/client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { EmailControl, ErrorMessageText } from "features/common";

export const EmailLoginPopover = ({
  iconProps,
  popoverProps,
  ...props
}: BoxProps & { iconProps?: IconProps; popoverProps?: PopoverProps }) => {
  //#region local state
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  //#endregion

  //#region form
  const { clearErrors, errors, setError, handleSubmit, register, setValue } =
    useForm({
      mode: "onChange"
    });

  const onChange = () => {
    clearErrors("formErrorMessage");
  };

  const onSubmit = async ({ email }: { email: string }) => {
    setIsLoading(true);
    try {
      await signIn("email", { email });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  //#endregion

  return (
    <Box {...props}>
      <Popover
        isLazy
        isOpen={isOpen}
        onClose={() => {
          clearErrors("formErrorMessage");
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
            <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
              <EmailControl
                name="email"
                register={register}
                setValue={setValue}
                errors={errors}
                isMultiple={false}
              />

              <ErrorMessage
                errors={errors}
                name="formErrorMessage"
                render={({ message }) => (
                  <Alert status="error" mb={3}>
                    <AlertIcon />
                    <ErrorMessageText>{message}</ErrorMessageText>
                  </Alert>
                )}
              />
            </form>
          </PopoverBody>
          <PopoverFooter display="flex" justifyContent="space-between">
            <Button
              colorScheme="gray"
              onClick={() => {
                onChange();
                setIsOpen(false);
              }}
            >
              Annuler
            </Button>

            <Button
              colorScheme="green"
              type="submit"
              isLoading={isLoading}
              isDisabled={Object.keys(errors).length > 0}
              onClick={handleSubmit(onSubmit)}
            >
              Connexion
            </Button>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
    </Box>
  );
};
