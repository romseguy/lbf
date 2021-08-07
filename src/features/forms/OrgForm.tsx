import React, { useState } from "react";
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
  useColorMode,
  Alert,
  AlertIcon
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
import usePlacesAutocomplete, {
  getDetails,
  getGeocode,
  getLatLng,
  Suggestion
} from "use-places-autocomplete";
import { useEffect } from "react";

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

  const {
    control,
    register,
    handleSubmit,
    errors,
    setError,
    clearErrors,
    watch,
    getValues
  } = useForm({
    mode: "onChange"
  });

  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<Suggestion>();
  watch("orgAddress");
  const orgAddress = getValues("orgAddress") || props.org?.orgAddress;
  const {
    ready,
    value: autoCompleteValue,
    suggestions: { status, data },
    setValue,
    clearSuggestions
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: {
        country: "fr"
      }
    },
    debounce: 300
  });

  useEffect(() => {
    if (!suggestion) setValue(orgAddress);
  }, [orgAddress]);

  const onChange = () => {
    clearErrors("formErrorMessage");
  };

  const onSubmit = async (form: IOrg) => {
    console.log("submitted", form);
    setIsLoading(true);
    const payload = {
      ...form,
      orgDescription:
        form.orgDescription === "<p><br></p>"
          ? ""
          : form.orgDescription?.replace(/\&nbsp;/g, " ")
    };

    try {
      let sugg = suggestion;

      if (!suggestion && payload.orgAddress && data[0]) {
        sugg = data[0];
      }

      if (sugg) {
        const details: any = await getDetails({
          placeId: sugg.place_id,
          fields: ["address_component"]
        });

        details.address_components.forEach((component: any) => {
          const types = component.types;

          if (types.indexOf("locality") > -1) {
            payload.orgCity = component.long_name;
          }
        });

        const results = await getGeocode({ address: sugg.description });
        const { lat, lng } = await getLatLng(results[0]);

        payload.orgLat = lat;
        payload.orgLng = lng;
      }

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

      setIsLoading(false);
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
          <Alert status="error" mb={3}>
            <AlertIcon />
            <ErrorMessageText>{message}</ErrorMessageText>
          </Alert>
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
        onSuggestionSelect={(suggestion) => {
          setSuggestion(suggestion);
        }}
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
          isLoading={
            isLoading || addOrgMutation.isLoading || editOrgMutation.isLoading
          }
          isDisabled={Object.keys(errors).length > 0}
          data-cy="orgFormSubmit"
        >
          {props.org ? "Modifier" : "Ajouter"}
        </Button>
      </Flex>
    </form>
  );
};
