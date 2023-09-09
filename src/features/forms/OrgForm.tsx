import type { UrlControlValue } from "features/common/forms/UrlControl";
import {
  Alert,
  AlertIcon,
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  List,
  ListItem,
  Select,
  Spinner,
  Stack,
  Switch,
  Tag,
  Text,
  Tooltip,
  useColorMode,
  useToast
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import bcrypt from "bcryptjs";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import useFormPersist from "hooks/useFormPersist";
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
  EntityTag,
  Link
} from "features/common";
import { withGoogleApi } from "features/map/GoogleApiWrapper";
import {
  AddOrgPayload,
  useAddOrgMutation,
  useEditOrgMutation,
  useGetOrgsQuery
} from "features/api/orgsApi";
import { formBoxProps } from "features/layout/theme";
import { IsEditConfig } from "features/orgs/OrgPage";
import { useLeaveConfirm } from "hooks/useLeaveConfirm";
import {
  IEntityEmail,
  IEntityPhone,
  IEntityWeb,
  IEntityAddress
} from "models/Entity";
import {
  IOrg,
  IOrgPermissions,
  orgTypeFull,
  orgTypeFull5,
  EOrgType,
  EOrgVisibility,
  OrgVisibilities,
  orgTypeFull2,
  OrgTypes,
  getOrgDescriptionByType
} from "models/Org";
import { hasItems } from "utils/array";
import { Session } from "utils/auth";
import { handleError } from "utils/form";
import { unwrapSuggestion } from "utils/maps";
import { capitalize, normalize } from "utils/string";
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
    isCreator,
    isEditConfig,
    session,
    orgQuery,
    ...props
  }: {
    isCreator?: boolean;
    isEditConfig?: IsEditConfig;
    session: Session;
    orgQuery?: AppQueryWithData<IOrg>;
    orgName?: string;
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
    const allowedChildrenTypes = Object.keys(
      org?.orgPermissions?.allowedChildrenTypes || {}
    );
    const [orgTrees, setOrgTrees] = useState(
      org
        ? org.orgs.filter((org) =>
            [EOrgType.GENERIC, EOrgType.TREETOOLS].includes(org.orgType)
          )
        : []
    );

    const orgsQuery = useGetOrgsQuery();
    const myOrgsQuery = useGetOrgsQuery(
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
    const myOrgs = myOrgsQuery.data;
    const trees = session.user.isAdmin
      ? orgsQuery.data?.filter(
          (org) => org.orgType === EOrgType.GENERIC && org.orgUrl !== "forum"
        )
      : myOrgs?.filter((myOrg) => {
          if (myOrg.orgUrl === "forum") return false;

          if (!allowedChildrenTypes.length)
            return [EOrgType.GENERIC, EOrgType.TREETOOLS].includes(
              myOrg.orgType
            );

          return allowedChildrenTypes.includes(myOrg.orgType);
        });
    const orgsOptions = trees
      ? trees.filter(
          (tree) => !orgTrees?.find((orgTree) => orgTree._id === tree._id)
        )
      : [];
    const orgsPlaceholder = `Sélectionnez ou créez ${
      allowedChildrenTypes.length > 0
        ? "le " + OrgTypes[allowedChildrenTypes[0] as EOrgType].toLowerCase()
        : "l'arbre"
    } que vous voulez planter`;

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
    const [isPassword, setIsPassword] = useState(false);
    const [suggestion, setSuggestion] = useState<Suggestion>();
    //#endregion

    //#region form
    const defaultValues = {
      orgName: props.orgName || org?.orgName || "",
      orgDescription: org?.orgDescription || "",
      orgAddress: org?.orgAddress,
      orgEmail: org?.orgEmail,
      orgPhone: org?.orgPhone,
      orgWeb: org?.orgWeb
    };
    const {
      control,
      register,
      handleSubmit,
      errors,
      setError,
      clearErrors,
      formState,
      getValues,
      setValue
    } = useFormPersist(
      useForm<FormValues>({
        defaultValues,
        mode: "onChange"
      })
    );
    useLeaveConfirm({ formState });
    const refs = useMemo(
      () =>
        Object.keys(defaultValues).reduce(
          (acc: Record<string, React.RefObject<any>>, fieldName) => {
            acc[fieldName] = React.createRef();
            return acc;
          },
          {}
        ),
      [defaultValues]
    );
    useEffect(() => {
      if (Object.keys(errors).length > 0) {
        const fieldName = Object.keys(errors)[0];
        const fieldRef = refs[fieldName].current;
        if (fieldRef)
          fieldRef.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
      }
    }, [errors]);

    const hasSelectedChildrenTypes = useWatch<string>({
      control,
      name: "hasSelectedChildrenTypes"
    });
    const orgName = useWatch<string>({ control, name: "orgName" });
    const orgAddress = useWatch<string>({ control, name: "orgAddress" });
    const orgEmail = useWatch<string>({ control, name: "orgEmail" });
    const orgPhone = useWatch<string>({ control, name: "orgPhone" });
    const orgType = (getValues("orgType") ||
      props.orgType ||
      org?.orgType ||
      EOrgType.GENERIC) as EOrgType;
    const orgTypeLabel = orgTypeFull(orgType) || "de l'arbre";
    useEffect(() => {
      const currentDescription = getValues("orgDescription");

      if (!currentDescription) {
        if (orgType === EOrgType.TREETOOLS) {
          setValue("orgDescription", getOrgDescriptionByType(orgType));
        }
      } else {
        if (
          orgType === EOrgType.GENERIC &&
          currentDescription === getOrgDescriptionByType(EOrgType.TREETOOLS)
        ) {
          setValue("orgDescription", "");
        }
      }
    }, [orgType]);
    const orgVisibility = useWatch<EOrgVisibility>({
      control,
      name: "orgVisibility"
    });
    useEffect(() => {
      if (orgVisibility !== EOrgVisibility.PRIVATE) setIsPassword(false);
    }, [orgVisibility]);
    const password = useRef<string | undefined>();
    password.current = useWatch({ control, name: "orgPassword" }) || "";
    const orgWeb = useWatch<UrlControlValue>({ control, name: "orgWeb" });

    const onChange = () => {
      clearErrors("formErrorMessage");
    };

    const onSubmit = async (form: {
      orgName?: string;
      orgType?: EOrgType;
      orgs: { label: string; value: string }[];
      orgDescription?: string;
      orgVisibility?: EOrgVisibility;
      orgPassword?: string;
      orgPasswordConfirm?: string;
      orgAddress?: IEntityAddress[];
      orgEmail?: IEntityEmail[];
      orgPhone?: IEntityPhone[];
      orgWeb?: IEntityWeb[];
      // permissions
      allowedChildrenTypes: string;
      anyoneCanAddChildren: boolean;
      hasSelectedChildrenTypes: boolean;
    }) => {
      console.log("submitted", form, suggestion);
      setIsLoading(true);

      try {
        const orgName = form.orgName ? form.orgName.trim() : org?.orgName;
        if (!orgName) throw new Error("Une erreur inattendue est survenue.");
        let orgUrl = normalize(orgName);
        const orgDescription = form.orgDescription || "";
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

        let permissions: IOrgPermissions = {
          anyoneCanAddChildren: form.anyoneCanAddChildren
        };
        if (form.hasSelectedChildrenTypes) {
          permissions.allowedChildrenTypes = {
            [form.allowedChildrenTypes]: true
          };
        } else permissions.allowedChildrenTypes = {};
        const orgPermissions = org?.orgPermissions
          ? {
              ...org?.orgPermissions,
              ...permissions
            }
          : permissions;

        let payload: AddOrgPayload = {
          ...form,
          orgName,
          orgType,
          orgDescription,
          orgs,
          orgVisibility:
            form.orgVisibility || org?.orgVisibility || EOrgVisibility.PUBLIC,
          orgAddress,
          orgEmail,
          orgPhone,
          orgWeb,
          orgPermissions
        };

        if (form.orgPassword) {
          const salt = await bcrypt.genSalt(10);
          payload.orgPassword = await bcrypt.hash(form.orgPassword, salt);
          payload.orgSalt = salt;
        }

        if (hasItems(orgAddress) && suggestion)
          if (
            !(
              org &&
              org.orgAddress[0] &&
              org.orgAddress[0].address === orgAddress[0].address
            )
          ) {
            const {
              lat: orgLat,
              lng: orgLng,
              city: orgCity
            } = await unwrapSuggestion(suggestion);
            payload = { ...payload, orgLat, orgLng, orgCity };
          }

        if (org) {
          if (isEditConfig?.isAddingChild && hasItems(orgs)) {
            await editOrg({ orgId: org._id, payload: { orgs } }).unwrap();
          } else if (isEditConfig?.isAddingDescription) {
            await editOrg({
              orgId: org._id,
              payload: { orgDescription }
            }).unwrap();
          } else if (isEditConfig?.isAddingInfo) {
            await editOrg({
              orgId: org._id,
              payload: {
                orgAddress,
                orgEmail,
                orgPhone,
                orgWeb,
                orgCity: payload.orgCity,
                orgLat: payload.orgLat,
                orgLng: payload.orgLng
              }
            }).unwrap();
          } else if (
            form.orgVisibility === EOrgVisibility.PUBLIC &&
            !!org.orgPassword
          ) {
            await editOrg({
              orgId: org._id,
              payload: ["orgPassword"]
            }).unwrap();
            await editOrg({ orgId: org._id, payload }).unwrap();
          } else {
            await editOrg({ orgId: org._id, payload }).unwrap();
          }

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
    // const [orgDescriptionDefaultValue, setOrgDescriptionDefaultValue] =
    //   useState<string>();
    // useEffect(() => {
    //   setStorage(window.localStorage);
    //   const formData = window.localStorage.getItem("storageKey");
    //   if (formData && formData.includes("orgDescription")) {
    //     const parsed = JSON.parse(formData);
    //     if (parsed.orgDescription)
    //       setOrgDescriptionDefaultValue(parsed.orgDescription);
    //   }
    //   //else setOrgDescriptionDefaultValue(getOrgDescriptionByType(orgType));
    // }, []);
    //#endregion

    //#region form controls
    const ChildrenFormControl = (
      <FormControl
        mb={3}
        isInvalid={!!errors["orgs"]}
        display={orgType !== EOrgType.NETWORK ? "none" : undefined}
      >
        {Array.isArray(orgTrees) && orgTrees.length > 0 && (
          <>
            <FormLabel>Forêt de la planète : </FormLabel>
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
                    onCloseClick={
                      isCreator
                        ? () => {
                            setOrgTrees(
                              orgTrees.filter(({ _id }) => _id !== orgTree._id)
                            );
                          }
                        : undefined
                    }
                  />
                </ListItem>
              ))}
            </List>
          </>
        )}

        <FormLabel>
          {isEditConfig?.isAddingChild
            ? orgsPlaceholder + " :"
            : "Forêt de la planète (optionnel)"}
        </FormLabel>

        {myOrgsQuery.isLoading ? (
          <Spinner />
        ) : (
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
                  onChange={(options, { action, option }) => {
                    if (action === "select-option") {
                      const tree = trees?.find(
                        ({ _id }) => _id === option.value
                      );
                      if (tree) setOrgTrees([...orgTrees, tree]);
                    } else renderProps.onChange;
                  }}
                  onCreateOption={async (inputValue: string) => {
                    try {
                      const allowedChildrenTypes = Object.keys(
                        org?.orgPermissions?.allowedChildrenTypes || {}
                      );
                      const payload: AddOrgPayload = {
                        orgName: inputValue,
                        orgType:
                          allowedChildrenTypes.length > 0
                            ? (allowedChildrenTypes[0] as EOrgType)
                            : EOrgType.GENERIC,
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

                      // toast({
                      //   status: "success",
                      //   title: "L'arbre a bien été créé !"
                      // });
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
                    `Planter ${
                      allowedChildrenTypes.length > 0
                        ? "le " +
                          OrgTypes[
                            allowedChildrenTypes[0] as EOrgType
                          ].toLowerCase()
                        : "l'arbre"
                    } "${inputValue}"`
                  }
                  isClearable
                  isMulti
                  noOptionsMessage={() => "Aucun résultat"}
                  placeholder={
                    isEditConfig?.isAddingChild ? "" : orgsPlaceholder
                  }
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
        )}

        <FormErrorMessage>
          <ErrorMessage errors={errors} name="orgs" />
        </FormErrorMessage>
      </FormControl>
    );

    const DescriptionFormControl = (
      <FormControl isInvalid={!!errors["orgDescription"]} mb={3}>
        <FormLabel>Description {orgTypeLabel} (optionnel)</FormLabel>
        <Controller
          name="orgDescription"
          control={control}
          render={(renderProps) => {
            return (
              <RTEditor
                height={isEditConfig?.isAddingDescription ? 500 : undefined}
                org={org}
                placeholder={`Saisir la description ${orgTypeLabel}`}
                session={session}
                value={renderProps.value}
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
    );

    const FooterFormControl = (
      <>
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
            {org ? "Valider" : "Ajouter"}
          </Button>
        </Flex>
      </>
    );

    const InfoFormControl = (
      <>
        <FormLabel>Coordonnées {orgTypeFull(orgType)} (optionnel)</FormLabel>

        <AddressControl
          name="orgAddress"
          control={control}
          errors={errors}
          setValue={setValue}
          containerProps={
            orgAddress && orgAddress[0]
              ? { ...containerProps, mt: 0 }
              : { mb: 3 }
          }
          label="Adresse ou localité"
          labelAdd="Ajouter une adresse postale ou une localité"
          placeholder="Saisir une adresse ou une localité..."
          mb={3}
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
      </>
    );

    const PasswordFormControl = (
      <>
        <PasswordControl
          name="orgPassword"
          errors={errors}
          register={register}
          my={3}
          //isRequired={orgVisibility === Visibility.PRIVATE}
        />
        <PasswordConfirmControl
          name="orgPasswordConfirm"
          errors={errors}
          register={register}
          password={password}
        />
      </>
    );

    const VisibilityFormControl = (
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
    );
    //#endregion

    if (isEditConfig?.isAddingChild)
      return (
        <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
          {ChildrenFormControl}
          {FooterFormControl}
        </form>
      );

    if (isEditConfig?.isAddingDescription)
      return (
        <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
          {DescriptionFormControl}
          {FooterFormControl}
        </form>
      );

    if (isEditConfig?.isAddingInfo)
      return (
        <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
          {InfoFormControl}
          {FooterFormControl}
        </form>
      );

    if (capitalize(orgName) === "Forum")
      return (
        <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
          <FormControl
            ref={refs.orgName}
            isInvalid={!!errors["orgName"]}
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
              placeholder={`Saisir le nom ${orgTypeLabel}`}
            />
            {getValues("orgName") && (
              <Tooltip label={`Adresse de la page de ${orgTypeLabel}`}>
                <Tag mt={3} alignSelf="flex-end" cursor="help">
                  {process.env.NEXT_PUBLIC_URL}/
                  {normalize(getValues("orgName"))}
                </Tag>
              </Tooltip>
            )}
            <FormErrorMessage>
              <ErrorMessage errors={errors} name="orgName" />
            </FormErrorMessage>
          </FormControl>

          {FooterFormControl}
        </form>
      );

    return (
      <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
        <FormControl
          isRequired
          isInvalid={!!errors["orgName"]}
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

        {props.orgType === EOrgType.GENERIC && (
          <FormControl mb={3}>
            <FormLabel>Type de l'arbre</FormLabel>
            <Select name="orgType" ref={register()}>
              <option value={EOrgType.GENERIC}>-</option>
              <option value={EOrgType.TREETOOLS}>
                {OrgTypes[EOrgType.TREETOOLS]}
              </option>
            </Select>
          </FormControl>
        )}

        {ChildrenFormControl}

        {DescriptionFormControl}

        {orgType === EOrgType.NETWORK && (
          <Box {...formBoxProps(isDark)}>
            {VisibilityFormControl}

            {orgVisibility === EOrgVisibility.PRIVATE && (
              <>
                {org?.orgPassword ? (
                  <>
                    <Link
                      variant="underline"
                      onClick={() => {
                        setIsPassword(!isPassword);
                      }}
                    >
                      {isPassword ? "Annuler" : "Changer le mot de passe"}
                    </Link>

                    {isPassword && PasswordFormControl}
                  </>
                ) : (
                  <>{PasswordFormControl}</>
                )}
              </>
            )}
          </Box>
        )}

        {orgType === EOrgType.NETWORK && (
          <Box {...formBoxProps(isDark)}>
            <FormLabel>Politique {orgTypeFull(orgType)} (optionnel)</FormLabel>

            <Stack flexDirection="column" spacing={3}>
              <Switch
                name="anyoneCanAddChildren"
                ref={register()}
                defaultChecked={!!org?.orgPermissions?.anyoneCanAddChildren}
                cursor="pointer"
                display="flex"
                alignItems="center"
              >
                Tout le monde peut ajouter un arbre {orgTypeFull2(orgType)}
              </Switch>

              <Switch
                name="hasSelectedChildrenTypes"
                ref={register()}
                defaultChecked={!!org?.orgPermissions?.allowedChildrenTypes}
                cursor="pointer"
                display="flex"
                alignItems="center"
              >
                Restreindre la forêt à un {/*ou plusieurs*/} type d'arbre
              </Switch>

              {hasSelectedChildrenTypes && (
                <Select name="allowedChildrenTypes" ref={register()}>
                  <option value={EOrgType.TREETOOLS}>
                    {OrgTypes[EOrgType.TREETOOLS]}
                  </option>
                </Select>
              )}
            </Stack>
          </Box>
        )}

        <Box {...formBoxProps(isDark)}>{InfoFormControl}</Box>

        {FooterFormControl}
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
