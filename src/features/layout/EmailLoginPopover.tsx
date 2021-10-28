import React, { useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/client";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  useColorModeValue,
  Icon,
  IconButton,
  Box,
  Heading,
  Button,
  BoxProps,
  useToast,
  Alert,
  AlertIcon
} from "@chakra-ui/react";
import { EmailControl, ErrorMessageText, Link } from "features/common";
import { useSession } from "hooks/useAuth";
import { EmailIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useAppDispatch } from "store";

export const EmailLoginPopover = ({ boxSize, ...props }: BoxProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const toast = useToast({ position: "top" });
  const dispatch = useAppDispatch();

  //#region local state
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const iconHoverColor = useColorModeValue("white", "lightgreen");
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
        offset={[-140, 0]}
        onClose={() => {
          clearErrors("formErrorMessage");
          setIsOpen(false);
        }}
      >
        <PopoverTrigger>
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
                _hover={{ color: iconHoverColor }}
                boxSize={boxSize}
              />
            }
          />
        </PopoverTrigger>

        <PopoverContent>
          <PopoverHeader>
            <Heading size="md">Connexion par e-mail</Heading>
          </PopoverHeader>
          <PopoverBody>
            <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
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

              <EmailControl
                name="email"
                register={register}
                setValue={setValue}
                errors={errors}
                isMultiple={false}
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
