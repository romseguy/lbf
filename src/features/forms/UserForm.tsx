import React from "react";
import Router from "next/router";
import { Controller, useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import {
  ChakraProps,
  Input,
  Button,
  FormControl,
  FormLabel,
  Box,
  Stack,
  FormErrorMessage,
  Select,
  Textarea,
  useToast
} from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";
import { EmailControl, ErrorMessageText } from "features/common";
import {
  useAddUserMutation,
  useEditUserMutation
} from "features/users/usersApi";
import { useSession } from "hooks/useAuth";
import { handleError } from "utils/form";
import type { IUser } from "models/User";

export const UserForm = (props: {
  user: IUser;
  onSubmit: (user: IUser) => void;
}) => {
  const [addUser, addUserMutation] = useAddUserMutation();
  const [editUser, editUserMutation] = useEditUserMutation();
  const toast = useToast({ position: "top" });

  const { control, register, handleSubmit, errors, setError, clearErrors } =
    useForm({
      mode: "onChange"
    });

  const onChange = () => {
    clearErrors("formErrorMessage");
  };

  const onSubmit = async (form: IUser) => {
    console.log("submitted", form);
    const payload = form;

    try {
      if (props.user) {
        await editUser({
          payload,
          userName: props.user.userName
        }).unwrap();
      } else {
        await addUser(payload).unwrap();
        toast({
          title: "Votre profil a bien été ajouté !",
          status: "success",
          isClosable: true
        });
      }

      props.onSubmit && props.onSubmit(payload);
    } catch (error) {
      handleError(error, (message, field) => {
        if (field) {
          setError(field, { type: "manual", message });
        } else {
          setError("formErrorMessage", { type: "manual", message });
        }
      });
    }
  };

  return (
    <form method="post" onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
      <ErrorMessage
        errors={errors}
        name="formErrorMessage"
        render={({ message }) => (
          <Stack isInline p={5} mb={5} shadow="md" color="red.500">
            <WarningIcon boxSize={5} />
            <Box>
              <ErrorMessageText>{message}</ErrorMessageText>
            </Box>
          </Stack>
        )}
      />

      <FormControl
        id="userName"
        isRequired
        isInvalid={!!errors["userName"]}
        mb={3}
      >
        <FormLabel>Nom d'utilisateur</FormLabel>
        <Input
          name="userName"
          placeholder="Cliquez ici pour saisir le nom de l'utilisateur..."
          ref={register({
            required: "Veuillez saisir le nom de l'utilisateur",
            pattern: {
              value: /^[a-z0-9 ]+$/i,
              message:
                "Veuillez saisir un nom composé de lettres et de chiffres uniquement"
            }
          })}
          defaultValue={props.user?.userName}
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="userName" />
        </FormErrorMessage>
      </FormControl>

      {/* <AddressControl
        name="userAddress"
        defaultValue={props.user?.userAddress || ""}
        errors={errors}
        control={control}
        mb={3}
      /> */}

      <EmailControl
        name="email"
        isRequired
        defaultValue={props.user?.email}
        errors={errors}
        register={register}
        mb={3}
      />

      {/* <FormControl
        id="password"
        mb={3}
        isRequired
        isInvalid={!!errors["password"]}
      >
        <FormLabel>Mot de passe</FormLabel>
        <Input
          name="password"
          ref={register({
            required: "Veuillez saisir un mot de passe"
          })}
          type="password"
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="password" />
        </FormErrorMessage>
      </FormControl>

      <FormControl
        id="passwordConfirm"
        isRequired
        isInvalid={!!errors["passwordConfirm"]}
      >
        <FormLabel>Confirmation du mot de passe</FormLabel>
        <Input
          name="passwordConfirm"
          ref={register({
            validate: (value) =>
              value === password.current ||
              "Les mots de passe ne correspondent pas"
          })}
          type="password"
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="passwordConfirm" />
        </FormErrorMessage>
      </FormControl> */}

      <Button
        colorScheme="green"
        type="submit"
        isLoading={addUserMutation.isLoading || editUserMutation.isLoading}
        isDisabled={Object.keys(errors).length > 0}
        mb={2}
      >
        {props.user ? "Modifier" : "Ajouter"}
      </Button>
    </form>
  );
};
