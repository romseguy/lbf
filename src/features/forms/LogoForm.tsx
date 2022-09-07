import {
  Alert,
  AlertIcon,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Image,
  Radio,
  RadioGroup,
  Stack,
  useColorMode,
  useToast
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  DeleteButton,
  ErrorMessageText,
  Input,
  UrlControl
} from "features/common";
import { EventConfigVisibility } from "features/events/EventConfigPanel";
import { useEditEventMutation } from "features/api/eventsApi";
import { OrgConfigVisibility } from "features/orgs/OrgConfigPanel";
import { useEditOrgMutation } from "features/api/orgsApi";
import { isEvent, IEntityLogo } from "models/Entity";
import { IEvent } from "models/Event";
import { IOrg, orgTypeFull } from "models/Org";
import { logoHeight } from "features/layout/theme";
import { handleError } from "utils/form";
import { Base64Image, getBase64, getMeta } from "utils/image";
import { AppQuery } from "utils/types";

export const LogoForm = ({
  query,
  toggleVisibility
}: (EventConfigVisibility | OrgConfigVisibility) & {
  query: AppQuery<IOrg | IEvent>;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const toast = useToast({ position: "top" });
  const [editEvent] = useEditEventMutation();
  const [editOrg] = useEditOrgMutation();
  const entity = (query.data || {}) as IEvent | IOrg;
  const isE = isEvent(entity);
  const edit = isE ? editEvent : editOrg;
  const entityLogo: IEntityLogo | undefined = isE
    ? entity.eventLogo
    : entity.orgLogo;
  const entityName = isE ? entity.eventName : entity.orgName;

  //#region form
  const {
    register,
    control,
    handleSubmit,
    setValue,
    setError,
    errors,
    clearErrors,
    watch
  } = useForm({
    mode: "onChange"
  });

  //#region form state
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState<Base64Image>();
  const [uploadType, setUploadType] = useState<"url" | "local">("local");
  const url = watch("url");
  //#endregion

  //#region form handlers
  const onChange = () => clearErrors("formErrorMessage");
  const onSubmit = async (form: { file?: FileList; url?: string }) => {
    console.log("submitted", form);
    setIsLoading(true);

    try {
      const key = `${isE ? "event" : "org"}Logo`;
      let payload = {};

      if (form.url) {
        const { height, width } = await getMeta(form.url);

        payload = {
          [key]: {
            url: form.url,
            height,
            width
          }
        };
      } else if (image) {
        payload = {
          [key]: image
        };

        setImage(undefined);
      } else throw new Error("Vous devez choisir un logo");

      await edit({
        payload,
        [isE ? "eventId" : "orgId"]: entity._id
      }).unwrap();
      setIsLoading(false);
      toast({
        title: `Le logo ${
          isE ? "de l'événement" : orgTypeFull(entity.orgType)
        } a été modifié !`,
        status: "success"
      });
      toggleVisibility("logo");
    } catch (error) {
      setIsLoading(false);
      handleError(error, (message) =>
        setError("formErrorMessage", {
          type: "manual",
          message
        })
      );
    }
  };
  //#endregion
  //#endregion

  return (
    <>
      {entityLogo && (
        <>
          <Image
            src={entityLogo.url || entityLogo.base64}
            height={logoHeight}
            mb={3}
          />

          <DeleteButton
            header={
              <>Êtes vous sûr de vouloir supprimer le logo de {entityName} ?</>
            }
            isLoading={isLoading}
            mb={3}
            onClick={async () => {
              try {
                setIsLoading(true);
                await edit({
                  payload: isE ? ["eventLogo"] : ["orgLogo"],
                  [isE ? "eventId" : "orgId"]: entity._id
                }).unwrap();
                setIsLoading(false);
                toast({
                  title: `Le logo ${
                    isE ? "de l'événement" : orgTypeFull(entity.orgType)
                  } a été supprimé !`,
                  status: "success"
                });
                toggleVisibility("logo");
              } catch (error) {
                setIsLoading(false);
                toast({
                  title: `Le logo ${
                    isE ? "de l'événement" : orgTypeFull(entity.orgType)
                  } n'a pas pu être supprimé`,
                  status: "error"
                });
              }
            }}
          />
        </>
      )}

      <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
        <RadioGroup name="uploadType" mb={3}>
          <Stack spacing={2}>
            <Radio
              isChecked={uploadType === "local"}
              onChange={() => {
                setUploadType("local");
              }}
            >
              Envoyer une image depuis votre ordinateur
            </Radio>
            <Radio
              isChecked={uploadType === "url"}
              onChange={() => {
                setUploadType("url");
              }}
            >
              Utiliser une image en provenance d'une autre adresse
            </Radio>
          </Stack>
        </RadioGroup>

        {uploadType === "url" && (
          <>
            <UrlControl
              name="url"
              control={control}
              defaultValue={entityLogo?.url}
              errors={errors}
              register={register}
              setValue={setValue}
              isMultiple={false}
              isRequired
              label="Adresse internet de l'image"
              placeholder=""
              mb={3}
            />

            {url && <Image src={url} height={logoHeight} />}
          </>
        )}

        {uploadType === "local" && (
          <>
            <FormControl isInvalid={!!errors["file"]} mb={3}>
              <FormLabel>Image</FormLabel>
              <Input
                backgroundColor={isDark ? "whiteAlpha.400" : "white"}
                height="auto"
                py={3}
                name="file"
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  if (e.target.files && e.target.files[0]) {
                    if (e.target.files[0].size < 1000000) {
                      setImage(await getBase64(e.target.files[0]));
                      clearErrors("file");
                    }
                  }
                }}
                ref={register({
                  validate: (file) => {
                    if (file && file[0] && file[0].size >= 1000000) {
                      return "L'image ne doit pas dépasser 1Mo.";
                    }
                    return true;
                  }
                })}
              />
              <FormErrorMessage>
                <ErrorMessage errors={errors} name="file" />
              </FormErrorMessage>
            </FormControl>

            {image?.base64 && <Image src={image.base64} height={logoHeight} />}
          </>
        )}

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

        <Button
          colorScheme="green"
          type="submit"
          isLoading={isLoading}
          isDisabled={Object.keys(errors).length > 0}
          mt={3}
        >
          Valider
        </Button>
      </form>
    </>
  );
};
