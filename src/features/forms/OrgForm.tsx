import {
  Alert,
  AlertIcon,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  List,
  ListItem,
  Select,
  Tag,
  Text,
  Tooltip,
  useColorMode,
  useToast
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import bcrypt from "bcryptjs";
import React, { useState, useEffect, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import useFormPersist from "react-hook-form-persist";
import { FaTree } from "react-icons/fa";
import Creatable from "react-select/creatable";
import { Suggestion } from "use-places-autocomplete";
import {
  AddressControl,
  EmailControl,
  PhoneControl,
  UrlControl,
  Button,
  ErrorMessageText,
  RTEditor,
  PasswordControl,
  PasswordConfirmControl,
  EntityTag
} from "features/common";
import { withGoogleApi } from "features/map/GoogleApiWrapper";
import {
  AddOrgPayload,
  useAddOrgMutation,
  useEditOrgMutation,
  useGetOrgsQuery
} from "features/api/orgsApi";
import { useLeaveConfirm } from "hooks/useLeaveConfirm";
import {
  IEntityEmail,
  IEntityPhone,
  IEntityWeb,
  IEntityAddress
} from "models/Entity";
import {
  IOrg,
  orgTypeFull,
  orgTypeFull5,
  EOrgType,
  EOrgVisibility,
  OrgVisibilities
} from "models/Org";
import { hasItems } from "utils/array";
import { Session } from "utils/auth";
import { handleError } from "utils/form";
import { unwrapSuggestion } from "utils/maps";
import { normalize } from "utils/string";
import { AppQueryWithData } from "utils/types";

type FormValues = {
  orgName: string;
  orgType?: EOrgType;
  orgs: { label: string; value: string }[];
  orgDescription: string;
  orgVisibility: EOrgVisibility;
  orgPassword?: string;
  orgPasswordConfirm?: string;
  orgAddress?: IEntityAddress[];
  orgEmail?: IEntityEmail[];
  orgPhone?: IEntityPhone[];
  orgWeb?: IEntityWeb[];
};
export const OrgForm = withGoogleApi({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
})(
  ({
    session,
    orgQuery,
    ...props
  }: {
    session: Session;
    orgQuery?: AppQueryWithData<IOrg>;
    orgType?: string;
    onCancel?: () => void;
    onSubmit?: (orgUrl: string) => void;
  }) => {
    const { colorMode } = useColorMode();
    const isDark = colorMode === "dark";
    const toast = useToast({ position: "top" });
    const [addOrg] = useAddOrgMutation();
    const [editOrg] = useEditOrgMutation();
    const org = orgQuery?.data;
    const [orgTrees, setOrgTrees] = useState(
      org ? org.orgs.filter((org) => org.orgType === EOrgType.GENERIC) : []
    );

    const orgsQuery = useGetOrgsQuery();
    const { data: myOrgs } = useGetOrgsQuery(
      {
        createdBy: session.user.userId
      },
      {
        selectFromResult: (query) => {
          const data = query.data?.filter((myOrg) => {
            return org ? myOrg.orgName !== org.orgName : true;
          });

          return {
            ...query,
            data
          };
        }
      }
    );
    const trees = session.user.isAdmin
      ? orgsQuery.data?.filter(
          (org) => org.orgType === EOrgType.GENERIC && org.orgUrl !== "forum"
        )
      : myOrgs?.filter(
          (org) => org.orgType === EOrgType.GENERIC && org.orgUrl !== "forum"
        );
    const orgsOptions = trees
      ? trees.filter(
          (tree) => !orgTrees?.find((orgTree) => orgTree._id === tree._id)
        )
      : [];

    //#region local state
    const containerProps = {
      backgroundColor: isDark ? "gray.700" : "white",
      _hover: {
        borderColor: isDark ? "#5F6774" : "#CBD5E0"
      },
      borderColor: isDark ? "#677080" : "gray.200",
      borderWidth: "1px",
      borderRadius: "lg",
      mt: 3,
      p: 3
    };
    const [isLoading, setIsLoading] = useState(false);
    const [suggestion, setSuggestion] = useState<Suggestion>();
    //#endregion

    //#region form
    const {
      control,
      register,
      handleSubmit,
      errors,
      setError,
      clearErrors,
      formState,
      watch,
      getValues,
      setValue
    } = useForm<FormValues>({
      defaultValues: {
        orgAddress: org?.orgAddress,
        orgEmail: org?.orgEmail,
        orgPhone: org?.orgPhone,
        orgWeb: org?.orgWeb
      },
      mode: "onChange"
    });
    useLeaveConfirm({ formState });

    const orgAddress = watch("orgAddress");
    const orgEmail = watch("orgEmail");
    const orgPhone = watch("orgPhone");
    const orgName = watch("orgName");
    const orgType = (props.orgType ||
      org?.orgType ||
      EOrgType.GENERIC) as EOrgType;
    const orgTypeLabel = orgTypeFull(orgType) || "de l'arbre";
    const orgVisibility = watch("orgVisibility");
    const password = useRef({});
    password.current = watch("orgPassword", "");
    const orgWeb = watch("orgWeb");

    const onChange = () => {
      clearErrors("formErrorMessage");
    };

    const onSubmit = async (form: {
      orgName: string;
      orgType?: EOrgType;
      orgs: { label: string; value: string }[];
      orgDescription: string;
      orgVisibility: EOrgVisibility;
      orgPassword?: string;
      orgPasswordConfirm?: string;
      orgAddress?: IEntityAddress[];
      orgEmail?: IEntityEmail[];
      orgPhone?: IEntityPhone[];
      orgWeb?: IEntityWeb[];
    }) => {
      console.log("submitted", form);
      setIsLoading(true);

      const orgName = form.orgName.trim();
      let orgUrl = normalize(orgName);
      const orgDescription = !form.orgDescription.length
        ? undefined
        : form.orgDescription;
      const orgs = orgTrees;
      const orgAddress = (form.orgAddress || []).filter(
        ({ address }) => address !== ""
      );
      const orgEmail = (form.orgEmail || []).filter(
        ({ email }) => email !== ""
      );
      const orgPhone = (form.orgPhone || []).filter(
        ({ phone }) => phone !== ""
      );
      const orgWeb = (form.orgWeb || []).filter(({ url }) => url !== "");

      let payload: AddOrgPayload = {
        ...form,
        orgName,
        orgType,
        orgDescription,
        orgs,
        orgAddress,
        orgEmail,
        orgPhone,
        orgWeb
      };

      if (form.orgPassword) {
        const salt = await bcrypt.genSalt(10);
        payload.orgPassword = await bcrypt.hash(form.orgPassword, salt);
        payload.orgSalt = salt;
      }

      try {
        if (
          suggestion &&
          (!org ||
            !hasItems(org.orgAddress) ||
            (orgAddress[0] &&
              org.orgAddress[0] &&
              org.orgAddress[0].address !== orgAddress[0].address))
        ) {
          const {
            lat: orgLat,
            lng: orgLng,
            city: orgCity
          } = await unwrapSuggestion(suggestion);
          payload = { ...payload, orgLat, orgLng, orgCity };
        }

        if (org) {
          if (form.orgVisibility === EOrgVisibility.PUBLIC && !!org.orgPassword)
            await editOrg({
              orgId: org._id,
              payload: ["orgPassword"]
            }).unwrap();

          await editOrg({ orgId: org._id, payload }).unwrap();

          toast({
            title: `La modification a été effectuée !`,
            status: "success"
          });
        } else {
          const org = await addOrg(payload).unwrap();
          orgUrl = org.orgUrl;

          toast({
            title: `Vous allez être redirigé vers ${orgTypeFull5(orgType)} ${
              org.orgName
            }...`,
            status: "success"
          });
        }

        setIsLoading(false);
        props.onSubmit && props.onSubmit(orgUrl as string);
      } catch (error) {
        setIsLoading(false);
        handleError(error, (message, field) => {
          setError(field || "formErrorMessage", {
            type: "manual",
            message
          });
        });
      }
    };
    //#endregion

    //#region componentDidMount
    const [orgDescriptionDefaultValue, setOrgDescriptionDefaultValue] =
      useState<string>();
    const [storage, setStorage] = useState<Storage | undefined>();
    useEffect(() => {
      setStorage(window.localStorage);

      if (!org) {
        const formData = window.localStorage.getItem("storageKey");
        if (formData) {
          setOrgDescriptionDefaultValue(JSON.parse(formData).orgDescription);
        }
      }
    }, []);
    useFormPersist("storageKey", {
      watch,
      setValue,
      storage,
      exclude: org
        ? [
            "orgName",
            "orgs",
            "orgDescription",
            "orgVisibility",
            "orgAddress",
            "orgEmail",
            "orgPhone",
            "orgWeb"
          ]
        : []
    });
    //#endregion

    return (
      <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
        <FormControl
          isRequired
          isInvalid={!!errors["orgName"]}
          display="flex"
          flexDirection="column"
          mb={getValues("orgName") ? 0 : 3}
        >
          <FormLabel>Nom {orgTypeLabel}</FormLabel>
          <Input
            name="orgName"
            ref={register({
              required: `Veuillez saisir le nom ${orgTypeLabel}`
              // pattern: {
              //   value: /^[A-zÀ-ú0-9 ]+$/i,
              //   message:
              //     "Veuillez saisir un nom composé de lettres et de chiffres uniquement"
              // }
            })}
            autoComplete="off"
            defaultValue={org?.orgName}
            placeholder={`Saisir le nom ${orgTypeLabel}`}
          />
          {getValues("orgName") && (
            <Tooltip label={`Adresse de la page de ${orgTypeLabel}`}>
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
          mb={3}
          isInvalid={!!errors["orgs"]}
          display={orgType !== EOrgType.NETWORK ? "none" : undefined}
        >
          <FormLabel>Arbres de la planète</FormLabel>

          {Array.isArray(orgTrees) && orgTrees.length > 0 && (
            <List>
              {orgTrees.map((orgTree) => (
                <ListItem key={orgTree._id}>
                  <EntityTag
                    entity={orgTree}
                    body={
                      <>
                        <Icon as={FaTree} mx={1} />
                        <Text mr={3}>{orgTree.orgName}</Text>
                      </>
                    }
                    mb={3}
                    onCloseClick={() => {
                      setOrgTrees(
                        orgTrees.filter(({ _id }) => _id !== orgTree._id)
                      );
                    }}
                  />
                </ListItem>
              ))}
            </List>
          )}

          <Controller
            name="orgs"
            control={control}
            defaultValue={[]}
            render={(renderProps) => {
              return (
                <Creatable
                  options={orgsOptions.map(({ _id, orgName }) => ({
                    label: orgName,
                    value: _id
                  }))}
                  value={renderProps.value}
                  onChange={renderProps.onChange}
                  onCreateOption={async (inputValue: string) => {
                    try {
                      const payload: AddOrgPayload = {
                        orgName: inputValue,
                        orgType: EOrgType.GENERIC,
                        orgs: org ? [org] : [],
                        orgVisibility: EOrgVisibility.PUBLIC,
                        orgAddress: [],
                        orgEmail: [],
                        orgPhone: [],
                        orgWeb: []
                      };

                      const addedOrg = await addOrg(payload).unwrap();

                      setOrgTrees(orgTrees.concat(addedOrg));

                      // setValue(
                      //   "orgs",
                      //   renderProps.value.concat({
                      //     label: addedOrg.orgName,
                      //     value: addedOrg._id
                      //   })
                      // );

                      toast({
                        status: "success",
                        title: "L'arbre a bien été créé !"
                      });
                    } catch (error: any) {
                      console.error(error);
                      toast({
                        status: "error",
                        title: error.message
                      });
                    }
                  }}
                  //#region ui
                  allowCreateWhileLoading
                  formatCreateLabel={(inputValue: string) =>
                    `Créer l'arbre "${inputValue}"`
                  }
                  isClearable
                  isMulti
                  noOptionsMessage={() => "Aucun résultat"}
                  placeholder="Créer ou rechercher un arbre"
                  //#endregion
                  //#region styling
                  className="react-select-container"
                  classNamePrefix="react-select"
                  styles={{
                    control: (defaultStyles: any) => {
                      return {
                        ...defaultStyles,
                        borderColor: "#e2e8f0"
                      };
                    },
                    placeholder: () => {
                      return {
                        color: "#A0AEC0"
                      };
                    }
                  }}
                  //#endregion
                />
              );
            }}
          />

          <FormErrorMessage>
            <ErrorMessage errors={errors} name="orgs" />
          </FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors["orgDescription"]} mb={3}>
          <FormLabel>Description {orgTypeLabel}</FormLabel>
          <Controller
            name="orgDescription"
            control={control}
            defaultValue={org?.orgDescription || ""}
            render={(renderProps) => {
              return (
                <RTEditor
                  defaultValue={
                    org?.orgDescription || orgDescriptionDefaultValue
                  }
                  org={org}
                  placeholder={`Saisir la description ${orgTypeLabel}`}
                  session={session}
                  onChange={({ html }) => {
                    renderProps.onChange(html);
                  }}
                />
              );
            }}
          />
          <FormErrorMessage>
            <ErrorMessage errors={errors} name="orgDescription" />
          </FormErrorMessage>
        </FormControl>

        <FormControl
          isRequired
          isInvalid={!!errors["orgVisibility"]}
          onChange={async (e) => {
            clearErrors("orgOrgs");
          }}
          mb={3}
        >
          <FormLabel>Visibilité {orgTypeLabel}</FormLabel>
          <Select
            name="orgVisibility"
            ref={register({
              required: `Veuillez sélectionner la visibilité ${orgTypeLabel}`
            })}
            color={isDark ? "whiteAlpha.400" : "gray.400"}
            defaultValue={org?.orgVisibility || EOrgVisibility.PUBLIC}
            placeholder={`Visibilité ${orgTypeLabel}`}
          >
            {Object.keys(EOrgVisibility).map((key) => {
              const visibility = key as EOrgVisibility;
              return (
                <option key={visibility} value={visibility}>
                  {OrgVisibilities[visibility]}
                </option>
              );
            })}
          </Select>
          <FormErrorMessage>
            <ErrorMessage errors={errors} name="orgVisibility" />
          </FormErrorMessage>
        </FormControl>

        {formState.dirtyFields.orgVisibility &&
          orgVisibility === EOrgVisibility.PRIVATE && (
            <>
              <PasswordControl
                name="orgPassword"
                errors={errors}
                register={register}
                mb={3}
                //isRequired={orgVisibility === Visibility.PRIVATE}
              />
              <PasswordConfirmControl
                name="orgPasswordConfirm"
                errors={errors}
                register={register}
                password={password}
                mb={3}
              />
            </>
          )}

        <AddressControl
          name="orgAddress"
          control={control}
          errors={errors}
          setValue={setValue}
          mb={3}
          containerProps={
            orgAddress && orgAddress[0]
              ? { ...containerProps, mt: 0 }
              : { mb: 3 }
          }
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
          mb={3}
          containerProps={
            orgEmail && orgEmail[0] ? { ...containerProps, mt: 0 } : { mb: 3 }
          }
        />

        <PhoneControl
          name="orgPhone"
          register={register}
          control={control}
          errors={errors}
          setValue={setValue}
          mb={3}
          containerProps={orgPhone && orgPhone[0] ? containerProps : { mb: 3 }}
        />

        <UrlControl
          name="orgWeb"
          register={register}
          control={control}
          errors={errors}
          setValue={setValue}
          mb={3}
          containerProps={
            orgWeb && orgWeb[0] ? { ...containerProps, mb: 3 } : { mb: 3 }
          }
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

        <Flex justifyContent="space-between">
          {props.onCancel && (
            <Button colorScheme="red" onClick={props.onCancel}>
              Annuler
            </Button>
          )}

          <Button
            colorScheme="green"
            type="submit"
            isLoading={isLoading}
            isDisabled={Object.keys(errors).length > 0}
          >
            {org ? "Modifier" : "Ajouter"}
          </Button>
        </Flex>
      </form>
    );
  }
);

{
  /*
    <FormControl isInvalid={!!errors["orgType"]} mb={3}>
      <FormLabel>Type de l'organisation</FormLabel>
      <Select
        name="orgType"
        ref={register()}
        defaultValue={org?.orgType || orgType}
        placeholder={`Type de l'organisation`}
        color={isDark ? "whiteAlpha.400" : "gray.400"}
      >
        {Object.keys(EOrgType).map((k) => {
          const orgType = k as EOrgType;
          return (
            <option key={orgType} value={orgType}>
              {OrgTypes[orgType]}
            </option>
          );
        })}
      </Select>
      <FormErrorMessage>
        <ErrorMessage errors={errors} name="orgType" />
      </FormErrorMessage>
    </FormControl>
*/
}

{
  /*
    <Controller
      name="orgs"
      as={ReactSelect}
      control={control}
      defaultValue={[]}
      closeMenuOnSelect
      isClearable
      isMulti
      isSearchable
      menuPlacement="top"
      noOptionsMessage={() => "Aucun arbre trouvé"}
      options={orgTrees}
      getOptionLabel={(option: any) => option.orgName}
      getOptionValue={(option: any) => option._id}
      placeholder="Rechercher un arbre..."
      styles={{
        control: (defaultStyles: any) => {
          return {
            ...defaultStyles,
            borderColor: "#e2e8f0",
            paddingLeft: "8px"
          };
        }
      }}
      className="react-select-container"
      classNamePrefix="react-select"
      onChange={(newValue: any) => newValue._id}
    />
*/
}
