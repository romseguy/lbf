import type { AppSession } from "hooks/useAuth";
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
import { normalize } from "utils/string";
import { unwrapSuggestion } from "utils/maps";
import { withGoogleApi } from "features/map/GoogleApiWrapper";

interface OrgFormProps extends ChakraProps {
  session: AppSession;
  org?: IOrg;
  onClose?: () => void;
  onCancel?: () => void;
  onSubmit?: (orgUrl: string) => void;
}

export const OrgForm = withGoogleApi({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
})((props: OrgFormProps) => {
  //#region org
  const [addOrg, addOrgMutation] = useAddOrgMutation();
  const [editOrg, editOrgMutation] = useEditOrgMutation();
  //#endregion

  //#region form state
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
  watch("orgAddress");
  const orgAddress = getValues("orgAddress") || props.org?.orgAddress;
  //#endregion

  //#region local state
  const toast = useToast({ position: "top" });
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<Suggestion>();
  const {
    ready,
    value: autoCompleteValue,
    suggestions: { status, data },
    setValue: setAutoCompleteValue,
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
    if (!suggestion) setAutoCompleteValue(orgAddress);
  }, [orgAddress]);
  //#endregion

  const onChange = () => {
    clearErrors("formErrorMessage");
  };

  const onSubmit = async (form: IOrg) => {
    console.log("submitted", form);
    setIsLoading(true);
    let payload = {
      ...form,
      orgUrl: normalize(form.orgName),
      orgDescription:
        form.orgDescription === "<p><br></p>"
          ? ""
          : form.orgDescription?.replace(/\&nbsp;/g, " ")
    };

    try {
      const sugg = suggestion || data[0];

      if (sugg) {
        const {
          lat: orgLat,
          lng: orgLng,
          city: orgCity
        } = await unwrapSuggestion(sugg);
        payload = { ...payload, orgLat, orgLng, orgCity };
      }

      if (props.org) {
        await editOrg({ payload, orgUrl: props.org.orgUrl }).unwrap();

        toast({
          title: "Votre organisation a bien été modifiée !",
          status: "success",
          isClosable: true
        });
      } else {
        payload.createdBy = props.session.user.userId;
        await addOrg(payload).unwrap();

        toast({
          title: "Votre organisation a bien été ajoutée !",
          status: "success",
          isClosable: true
        });
      }

      props.onClose && props.onClose();
      props.onSubmit && props.onSubmit(payload.orgUrl);
    } catch (error) {
      handleError(error, (message, field) => {
        if (field) {
          setError(field, { type: "manual", message });
        } else {
          setError("formErrorMessage", { type: "manual", message });
        }
      });
    } finally {
      setIsLoading(false);
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
          placeholder="Nom de l'organisation"
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
          placeholder="Type de l'organisation"
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
        onSuggestionSelect={(suggestion: Suggestion) => {
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
                placeholder="Description de l'organisation"
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
          // dark={{ bg: "gray.700", _hover: { bg: "gray.600" } }}
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
});
