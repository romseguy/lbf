import React from "react";
import { Controller, useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import {
  ChakraProps,
  FormControl,
  FormLabel,
  Box,
  Stack,
  FormErrorMessage,
  Textarea,
  useToast,
  Flex,
  useColorMode
} from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";
import {
  AddressControl,
  EmailControl,
  Button,
  ErrorMessageText,
  Input,
  Select,
  RTEditor
} from "features/common";
import { useAddOrgMutation, useEditOrgMutation } from "features/orgs/orgsApi";
import { useSession } from "hooks/useAuth";
import { OrgTypes, OrgTypesV } from "models/Org";
import type { IOrg } from "models/Org";
import { handleError } from "utils/form";

interface OrgFormProps extends ChakraProps {
  org?: IOrg;
  onClose?: () => void;
  onCancel?: () => void;
  onSubmit?: (orgName: string) => void;
}

export const OrgForm = (props: OrgFormProps) => {
  //const [isLoading, setIsLoading] = useState();
  const { data: session } = useSession();
  const [addOrg, addOrgMutation] = useAddOrgMutation();
  const [editOrg, editOrgMutation] = useEditOrgMutation();
  const toast = useToast({ position: "top" });

  const { control, register, handleSubmit, errors, setError, clearErrors } =
    useForm({
      mode: "onChange"
    });

  const onChange = () => {
    clearErrors("formErrorMessage");
  };

  const onSubmit = async (form: IOrg) => {
    console.log("submitted", form);
    const payload = form;

    try {
      if (props.org) {
        await editOrg({ payload, orgName: props.org.orgName }).unwrap();

        toast({
          title: "Votre organisation a bien été modifiée !",
          status: "success",
          isClosable: true
        });
      } else {
        payload.createdBy = session.user.userId;
        await addOrg(payload).unwrap();

        toast({
          title: "Votre organisation a bien été ajoutée !",
          status: "success",
          isClosable: true
        });
      }

      props.onClose && props.onClose();
      props.onSubmit && props.onSubmit(payload.orgName);
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
    <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
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
        id="orgName"
        isRequired
        isInvalid={!!errors["orgName"]}
        mb={3}
      >
        <FormLabel>Nom de l'organisation</FormLabel>
        <Input
          name="orgName"
          placeholder="Cliquez ici pour saisir le nom de l'organisation..."
          ref={register({
            required: "Veuillez saisir le nom de l'organisation",
            pattern: {
              value: /^[A-zÀ-ú0-9 ]+$/i,
              message:
                "Veuillez saisir un nom composé de lettres et de chiffres uniquement"
            }
          })}
          defaultValue={props.org?.orgName}
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="orgName" />
        </FormErrorMessage>
      </FormControl>

      <FormControl
        id="orgType"
        isRequired
        isInvalid={!!errors["orgType"]}
        mb={3}
      >
        <FormLabel>Type de l'organisation</FormLabel>
        <Select
          name="orgType"
          ref={register({
            required: "Veuillez sélectionner le type de l'organisation"
          })}
          defaultValue={props.org?.orgType}
          placeholder="Cliquez ici pour sélectionner le type de l'organisation..."
          color="gray.400"
        >
          {Object.keys(OrgTypes).map((orgType) => {
            return (
              <option key={orgType} value={orgType}>
                {OrgTypesV[orgType]}
              </option>
            );
          })}
        </Select>
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="orgType" />
        </FormErrorMessage>
      </FormControl>

      <AddressControl
        name="orgAddress"
        isRequired
        defaultValue={props.org?.orgAddress || ""}
        errors={errors}
        control={control}
        mb={3}
      />

      <EmailControl
        name="orgEmail"
        defaultValue={props.org?.orgEmail}
        errors={errors}
        register={register}
        mb={3}
      />

      <FormControl
        id="orgDescription"
        isInvalid={!!errors["orgDescription"]}
        mb={3}
      >
        <FormLabel>Description</FormLabel>
        <Controller
          name="orgDescription"
          control={control}
          defaultValue={props.org?.orgDescription || ""}
          render={(p) => {
            return (
              <RTEditor
                defaultValue={props.org?.orgDescription}
                onChange={p.onChange}
                placeholder="Cliquez ici pour saisir la description de l'organisation..."
              />
            );
          }}
        />

        <FormErrorMessage>
          <ErrorMessage errors={errors} name="orgDescription" />
        </FormErrorMessage>
      </FormControl>

      <Flex justifyContent="space-between">
        <Button
          onClick={() => props.onCancel && props.onCancel()}
          dark={{ bg: "gray.700", _hover: { bg: "gray.600" } }}
        >
          Annuler
        </Button>

        <Button
          colorScheme="green"
          type="submit"
          isLoading={addOrgMutation.isLoading || editOrgMutation.isLoading}
          isDisabled={Object.keys(errors).length > 0}
          data-cy="orgFormSubmit"
        >
          {props.org ? "Modifier" : "Ajouter"}
        </Button>
      </Flex>
    </form>
  );
};
