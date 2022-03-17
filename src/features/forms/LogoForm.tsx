import {
  Alert,
  AlertIcon,
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  useToast
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import React, { useEffect, useRef, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import { useForm } from "react-hook-form";
import {
  Button,
  DeleteButton,
  ErrorMessageText,
  Input,
  UrlControl
} from "features/common";
import { EventConfigVisibility } from "features/events/EventConfigPanel";
import { useEditEventMutation } from "features/events/eventsApi";
import { OrgConfigVisibility } from "features/orgs/OrgConfigPanel";
import { useEditOrgMutation } from "features/orgs/orgsApi";
import { isEvent, IEntityLogo } from "models/Entity";
import { IEvent } from "models/Event";
import { IOrg, orgTypeFull } from "models/Org";
import { handleError } from "utils/form";
import { Base64Image, getBase64, getMeta } from "utils/image";
import { AppQuery } from "utils/types";

export const LogoForm = ({
  query,
  isVisible,
  setIsVisible
}: (EventConfigVisibility | OrgConfigVisibility) & {
  query: AppQuery<IOrg | IEvent>;
}) => {
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
    getValues,
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
  const [elementLocked, setElementLocked] = useState<
    { el: HTMLElement; locked: boolean } | undefined
  >();
  const [logoHeight, setLogoHeight] = useState<number | undefined>();
  const [logoWidth, setLogoWidth] = useState<number | undefined>();
  const [scale, setScale] = useState(1);
  const [upImg, setUpImg] = useState<Base64Image>();
  const [uploadType, setUploadType] = useState<"url" | "local">(
    entityLogo?.url ? "url" : "local"
  );
  const setEditorRef = useRef<AvatarEditor | null>(null);
  const url = watch("url");
  useEffect(() => {
    const onUrlChange = async () => {
      const { height, width } = await getMeta(url);
      if (height !== logoHeight) setLogoHeight(height);
      if (width !== logoWidth) setLogoWidth(width);
    };
    if (typeof url === "string" && url.length > 0) {
      onUrlChange();
    }
  }, [url]);
  //#endregion

  //#region form handlers
  const disableScroll = (target: HTMLElement) => {
    disableBodyScroll(target);
  };
  const enableScroll = (target: HTMLElement) => {
    enableBodyScroll(target);
  };
  const onChange = () => clearErrors("formErrorMessage");
  const onSubmit = async (form: any) => {
    console.log("submitted", form);
    setIsLoading(true);
    if (elementLocked) enableScroll(elementLocked.el);

    try {
      const key = `${isE ? "event" : "org"}Logo`;
      let payload = {};

      if (uploadType === "url") {
        payload = {
          [key]: {
            url,
            height: logoHeight,
            width: logoWidth
          }
        };
      } else {
        if (!upImg) throw new Error("Vous devez choisir un logo");

        payload = {
          [key]: {
            base64: setEditorRef?.current?.getImageScaledToCanvas().toDataURL(),
            height: upImg?.height,
            width: upImg?.width
          }
        };

        setUpImg(undefined);
      }

      await edit({
        payload,
        eventId: entity._id
      }).unwrap();
      query.refetch();
      setIsLoading(false);
      setIsVisible({ ...isVisible, logo: false });
      toast({
        title: `Le logo ${
          isE ? "de l'événement" : orgTypeFull(entity.orgType)
        } a été modifié !`,
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
      {entityLogo && (
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
                payload: ["orgLogo"],
                eventId: entity._id
              }).unwrap();
              query.refetch();
              setIsLoading(false);
              toast({
                title: `Le logo ${
                  isE ? "de l'événement" : orgTypeFull(entity.orgType)
                } a été supprimé !`,
                status: "success"
              });
            } catch (error) {
              setIsLoading(false);
              toast({
                title: `Le logo ${
                  isE ? "de l'événement" : orgTypeFull(entity.orgType)
                } n'a pas pu être supprimé`,
                status: "success"
              });
            }
          }}
        />
      )}

      <form
        onChange={onChange}
        onSubmit={handleSubmit(onSubmit)}
        onWheel={(e) => {
          if (elementLocked) enableScroll(elementLocked.el);
        }}
      >
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

        {uploadType === "url" ? (
          <UrlControl
            name="url"
            register={register}
            setValue={setValue}
            control={control}
            errors={errors}
            label="Adresse internet de l'image"
            defaultValue={entityLogo?.url}
            isMultiple={false}
            isRequired
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

        {uploadType === "url" ? (
          <AvatarEditor
            ref={setEditorRef}
            border={0}
            color={[255, 255, 255, 0.6]} // RGBA
            height={logoHeight || 0}
            image={getValues("url") || entityLogo?.url}
            rotate={0}
            scale={1}
            width={logoWidth}
            position={{ x: 0, y: 0 }}
          />
        ) : (
          upImg &&
          upImg.base64 && (
            <Box
              width={upImg.width || 220}
              // onWheel={(e) => {
              //   e.stopPropagation();
              //   setScale(calculateScale(scale, e.deltaY));
              //   const el = e.target as HTMLElement;
              //   disableScroll(el);
              //   if (!elementLocked)
              //     setElementLocked({ el, locked: true });
              // }}
            >
              <AvatarEditor
                ref={setEditorRef}
                image={upImg.base64}
                height={upImg.height}
                width={upImg.width}
                border={1}
                color={[255, 255, 255, 0.6]} // RGBA
                scale={scale}
                rotate={0}
                style={{ marginBottom: "12px" }}
              />
            </Box>
          )
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
