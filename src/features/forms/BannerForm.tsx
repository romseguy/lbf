import {
  Alert,
  AlertIcon,
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Radio,
  RadioGroup,
  Select,
  Stack,
  useToast
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import React, { useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { useForm } from "react-hook-form";
import {
  Button,
  DeleteButton,
  ErrorMessageText,
  Input,
  UrlControl
} from "features/common";
import { useEditEventMutation } from "features/api/eventsApi";
import { EventConfigVisibility } from "features/events/EventConfigPanel";
import { OrgConfigVisibility } from "features/orgs/OrgConfigPanel";
import { useEditOrgMutation } from "features/api/orgsApi";
import { IEvent } from "models/Event";
import { IOrg, orgTypeFull } from "models/Org";
import { handleError } from "utils/form";
import { Base64Image, getBase64, getMeta } from "utils/image";
import { AppQuery } from "utils/types";
import { IEntityBanner, isEvent } from "models/Entity";

export const BannerForm = ({
  query,
  isVisible,
  toggleVisibility
}: (EventConfigVisibility | OrgConfigVisibility) & {
  query: AppQuery<IOrg | IEvent>;
}) => {
  const toast = useToast({ position: "top" });
  const [editEvent] = useEditEventMutation();
  const [editOrg] = useEditOrgMutation();
  const entity = (query.data || {}) as IEvent | IOrg;
  const isE = isEvent(entity);
  const edit = isE ? editEvent : editOrg;
  const entityBanner: IEntityBanner | undefined = isE
    ? entity.eventBanner
    : entity.orgBanner;
  const entityName = isE ? entity.eventName : entity.orgName;

  //#region form
  const {
    register,
    control,
    handleSubmit,
    setError,
    errors,
    clearErrors,
    getValues,
    setValue,
    watch
  } = useForm({
    mode: "onChange"
  });

  //#region form state
  const [isLoading, setIsLoading] = useState(false);
  const [heights, setHeights] = useState([
    { label: "Petit", height: 140 },
    { label: "Moyen", height: 240 },
    { label: "Grand", height: 340 }
  ]);
  const { height: defaultHeight } =
    heights.find(({ height }) => height === entityBanner?.headerHeight) ||
    heights[0];
  const formHeight = watch("height") || defaultHeight;
  const [uploadType, setUploadType] = useState<"url" | "local">(
    entityBanner?.url ? "url" : "local"
  );
  const [upImg, setUpImg] = useState<Base64Image>();
  const setEditorRef = useRef<AvatarEditor | null>(null);
  //#endregion

  //#region form handlers
  const onChange = () => clearErrors("formErrorMessage");
  const onSubmit = async (form: { url?: string; height: number }) => {
    console.log("submitted", form);
    setIsLoading(true);

    try {
      const key = `${isE ? "event" : "org"}Banner`;
      let payload = {};

      if (uploadType === "url" && form.url) {
        const { height } = await getMeta(form.url);
        payload = {
          [key]: {
            url: form.url,
            height,
            headerHeight: form.height
          }
        };
      } else {
        if (!upImg) throw new Error("Vous devez choisir une bannière");

        payload = {
          [key]: {
            base64: setEditorRef?.current?.getImageScaledToCanvas().toDataURL(),
            height: form.height, // todo actual height
            headerHeight: form.height
          }
        };

        setUpImg(undefined);
      }

      await edit({
        payload,
        eventId: entity._id
      }).unwrap();
      setIsLoading(false);
      toggleVisibility("banner");
      toast({
        title: `La bannière ${
          isE ? "de l'événement" : orgTypeFull(entity.orgType)
        } a été modifiée !`,
        status: "success"
      });
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
      {entityBanner && (
        <DeleteButton
          header={
            <>
              Êtes vous sûr de vouloir supprimer la bannière de {entityName} ?
            </>
          }
          isLoading={isLoading}
          mb={3}
          onClick={async () => {
            try {
              setIsLoading(true);
              await edit({
                payload: ["orgBanner"],
                eventId: entity._id
              }).unwrap();
              setIsLoading(false);
              toast({
                title: `La bannière ${
                  isE ? "de l'événement" : orgTypeFull(entity.orgType)
                } a été supprimée !`,
                status: "success"
              });
            } catch (error) {
              setIsLoading(false);
              toast({
                title: `La bannière ${
                  isE ? "de l'événement" : orgTypeFull(entity.orgType)
                } n'a pas pu être supprimée`,
                status: "error"
              });
            }
          }}
        />
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

        <FormControl mb={3}>
          <FormLabel>Hauteur</FormLabel>
          <Select name="height" ref={register()} defaultValue={defaultHeight}>
            {heights.map(({ label, height: h }) => (
              <option key={"height-" + h} value={h}>
                {label}
              </option>
            ))}
          </Select>
        </FormControl>

        {uploadType === "url" ? (
          <UrlControl
            name="url"
            register={register}
            setValue={setValue}
            control={control}
            errors={errors}
            label="Adresse internet de l'image"
            defaultValue={entityBanner?.url}
            isMultiple={false}
            isRequired
            mb={3}
          />
        ) : (
          <FormControl isInvalid={!!errors["file"]} mb={3}>
            <FormLabel>Image</FormLabel>
            <Input
              height="auto"
              py={3}
              name="file"
              type="file"
              accept="image/*"
              onChange={async (e) => {
                if (e.target.files && e.target.files[0]) {
                  if (e.target.files[0].size < 1000000) {
                    setUpImg(await getBase64(e.target.files[0]));
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
        )}

        <Box mb={3}>
          {(getValues("url") || entityBanner?.url) && (
            <AvatarEditor
              ref={setEditorRef}
              border={0}
              color={[255, 255, 255, 0.6]} // RGBA
              height={parseInt(formHeight)}
              image={getValues("url") || entityBanner?.url}
              rotate={0}
              scale={1}
              width={1154}
              position={{ x: 0, y: 0 }}
            />
          )}

          {upImg && upImg.base64 && (
            <AvatarEditor
              ref={setEditorRef}
              border={0}
              color={[255, 255, 255, 0.6]} // RGBA
              height={parseInt(formHeight)}
              image={upImg.base64}
              rotate={0}
              scale={1}
              width={1154}
            />
          )}
        </Box>

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
        >
          Valider
        </Button>
      </form>
    </>
  );
};
