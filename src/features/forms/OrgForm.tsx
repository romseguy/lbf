import {
  ChakraProps,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  useToast,
  Flex,
  Alert,
  AlertIcon,
  Select,
  Tag,
  Tooltip
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import { Session } from "next-auth";
import React, { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import usePlacesAutocomplete, { Suggestion } from "use-places-autocomplete";

import {
  AddressControl,
  EmailControl,
  Button,
  ErrorMessageText,
  RTEditor
} from "features/common";
import { PhoneControl } from "features/common/forms/PhoneControl";
import { UrlControl } from "features/common/forms/UrlControl";
import { withGoogleApi } from "features/map/GoogleApiWrapper";
import { useAddOrgMutation, useEditOrgMutation } from "features/orgs/orgsApi";
import {
  IOrg,
  orgTypeFull,
  OrgTypes,
  OrgTypesV,
  Visibility,
  VisibilityV
} from "models/Org";
import { handleError } from "utils/form";
import { unwrapSuggestion } from "utils/maps";
import { normalize } from "utils/string";

interface OrgFormProps extends ChakraProps {
  session: Session;
  org?: IOrg;
  setOrgType?: (orgType: string) => void;
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
    getValues,
    setValue
  }: { [key: string]: any } = useForm({
    defaultValues: {
      orgEmail: props.org?.orgEmail,
      orgPhone: props.org?.orgPhone,
      orgWeb: props.org?.orgWeb
    },
    mode: "onChange"
  });

  watch("orgAddress");
  if (props.setOrgType) props.setOrgType(getValues("orgType"));
  const orgAddress = getValues("orgAddress") || props.org?.orgAddress;
  const orgType =
    orgTypeFull(getValues("orgType") || props.org?.orgType) ||
    "de l'organisation";
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

    const orgEmail = form.orgEmail?.filter(({ email }) => email !== "");
    const orgPhone = form.orgPhone?.filter(({ phone }) => phone !== "");
    const orgWeb = form.orgWeb?.filter(({ url }) => url !== "");

    let payload = {
      ...form,
      orgUrl: normalize(form.orgName),
      orgDescription:
        form.orgDescription === "<p><br></p>"
          ? ""
          : form.orgDescription?.replace(/\&nbsp;/g, " "),
      orgEmail: Array.isArray(orgEmail) && orgEmail.length > 0 ? orgEmail : [],
      orgPhone: Array.isArray(orgPhone) && orgPhone.length > 0 ? orgPhone : [],
      orgWeb: Array.isArray(orgWeb) && orgWeb.length > 0 ? orgWeb : []
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

      console.log("payload", payload);

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
        display="flex"
        flexDirection="column"
        mb={3}
      >
        <FormLabel>Nom {orgType}</FormLabel>
        <Input
          name="orgName"
          placeholder={`Nom ${orgType}`}
          ref={register({
            required: `Veuillez saisir le nom ${orgType}`
            // pattern: {
            //   value: /^[A-zÀ-ú0-9 ]+$/i,
            //   message:
            //     "Veuillez saisir un nom composé de lettres et de chiffres uniquement"
            // }
          })}
          defaultValue={props.org?.orgName}
        />
        {getValues("orgName") && (
          <Tooltip label={`Adresse de la page de ${orgType}`}>
            <Tag mt={3} alignSelf="flex-end" cursor="help">
              {process.env.NEXT_PUBLIC_URL}/{normalize(getValues("orgName"))}
            </Tag>
          </Tooltip>
        )}
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
        <FormLabel>Type {orgType}</FormLabel>
        <Select
          name="orgType"
          ref={register({
            required: `Veuillez sélectionner le type ${orgType}`
          })}
          defaultValue={props.org?.orgType}
          placeholder={`Type ${orgType}`}
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
        placeholder={`Adresse ${orgType}`}
        onSuggestionSelect={(suggestion: Suggestion) => {
          setSuggestion(suggestion);
        }}
      />

      <EmailControl
        name="orgEmail"
        register={register}
        control={control}
        errors={errors}
        setValue={setValue}
        placeholder={`Adresse e-mail ${orgType}`}
      />

      <PhoneControl
        name="orgPhone"
        register={register}
        control={control}
        errors={errors}
        setValue={setValue}
        placeholder={`Numéro de téléphone ${orgType}`}
      />

      <UrlControl
        name="orgWeb"
        register={register}
        control={control}
        errors={errors}
        setValue={setValue}
        placeholder={`Site internet ${orgType}`}
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
                org={props.org}
                session={props.session}
                defaultValue={props.org?.orgDescription}
                onChange={p.onChange}
                placeholder="Décrivez l'organisation, ses activités, etc..."
                // TODO placeholder={`Description ${orgType}`}
              />
            );
          }}
        />

        <FormErrorMessage>
          <ErrorMessage errors={errors} name="orgDescription" />
        </FormErrorMessage>
      </FormControl>

      <FormControl
        id="orgVisibility"
        isRequired
        isInvalid={!!errors["orgVisibility"]}
        onChange={async (e) => {
          clearErrors("orgOrgs");
        }}
        mb={3}
      >
        <FormLabel>Visibilité</FormLabel>
        <Select
          name="orgVisibility"
          defaultValue={
            props.org?.orgVisibility || Visibility[Visibility.PUBLIC]
          }
          ref={register({
            required: "Veuillez sélectionner la visibilité de l'organisation"
          })}
          placeholder="Visibilité de l'organisation"
          color="gray.400"
        >
          {[Visibility.PUBLIC, Visibility.PRIVATE].map((key) => {
            return (
              <option key={key} value={key}>
                {VisibilityV[key]}
              </option>
            );
          })}
        </Select>
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="orgVisibility" />
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
