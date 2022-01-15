import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  GridProps,
  Heading,
  Radio,
  RadioGroup,
  Stack,
  useToast
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import React, { useState, useRef, useEffect } from "react";
import AvatarEditor from "react-avatar-editor";
import { useForm } from "react-hook-form";
import { FaMinusSquare, FaPlusSquare } from "react-icons/fa";
import {
  Button,
  DeleteButton,
  ErrorMessageText,
  Grid,
  GridHeader,
  GridItem,
  Input,
  Link,
  UrlControl
} from "features/common";
import { useEditEventMutation } from "features/events/eventsApi";
import { IEvent } from "models/Event";
import { handleError } from "utils/form";
import { Base64Image, getBase64, getMeta } from "utils/image";
import { Visibility } from "./EventPage";

type EventConfigLogoPanelProps = GridProps &
  Visibility & {
    event: IEvent;
    eventQuery: any;
  };

export const EventConfigLogoPanel = ({
  event,
  eventQuery,
  isVisible,
  setIsVisible,
  ...props
}: EventConfigLogoPanelProps) => {
  const toast = useToast({ position: "top" });

  //#region event
  const [editEvent, editEventMutation] = useEditEventMutation();
  //#endregion

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

  const [logoHeight, setLogoHeight] = useState<number | undefined>();
  const [logoWidth, setLogoWidth] = useState<number | undefined>();
  const url = watch("url");
  useEffect(() => {
    const xhr = async () => {
      const { height, width } = await getMeta(url);
      if (height !== logoHeight) setLogoHeight(height);
      if (width !== logoWidth) setLogoWidth(width);
    };
    if (typeof url === "string" && url.length > 0) {
      xhr();
    }
  }, [url]);

  const [uploadType, setUploadType] = useState<"url" | "local">(
    event.eventLogo?.url ? "url" : "local"
  );

  const [upImg, setUpImg] = useState<Base64Image>();
  const [scale, setScale] = useState(1);
  const [elementLocked, setElementLocked] = useState<
    { el: HTMLElement; locked: boolean } | undefined
  >();
  const disableScroll = (target: HTMLElement) => {
    disableBodyScroll(target);
  };
  const enableScroll = (target: HTMLElement) => {
    enableBodyScroll(target);
  };
  const setEditorRef = useRef<AvatarEditor | null>(null);

  const onSubmit = async (form: any) => {
    console.log("submitted", form);
    if (elementLocked) enableScroll(elementLocked.el);

    try {
      let payload = {};

      if (uploadType === "url") {
        payload = {
          url,
          height: logoHeight,
          width: logoWidth
        };
      } else {
        if (!upImg) throw new Error("Vous devez choisir un logo");

        payload = {
          eventLogo: {
            base64: setEditorRef?.current?.getImageScaledToCanvas().toDataURL(),
            height: upImg?.height,
            width: upImg?.width
          }
        };

        setUpImg(undefined);
      }

      await editEvent({
        payload,
        eventUrl: event.eventUrl
      });
      toast({
        title: `Le logo de l'événement a bien été modifié !`,
        isClosable: true,
        status: "success"
      });
      eventQuery.refetch();
      setIsVisible({ ...isVisible, logo: false });
    } catch (error) {
      handleError(error, (message) =>
        setError("formErrorMessage", {
          type: "manual",
          message
        })
      );
    }
  };
  //#endregion

  return (
    <Grid {...props}>
      <Link
        variant="no-underline"
        onClick={() =>
          setIsVisible({
            ...isVisible,
            banner: false,
            logo: !isVisible.logo
          })
        }
      >
        <GridHeader
          borderTopRadius="lg"
          borderBottomRadius={!isVisible.logo ? "lg" : undefined}
          alignItems="center"
        >
          <Flex alignItems="center">
            {isVisible.logo ? <FaMinusSquare /> : <FaPlusSquare />}
            <Heading size="sm" ml={2} py={3}>
              Logo
            </Heading>
          </Flex>
        </GridHeader>
      </Link>

      {isVisible.logo && (
        <GridItem light={{ bg: "orange.100" }} dark={{ bg: "gray.500" }}>
          <Box p={5}>
            {event.eventLogo && (
              <DeleteButton
                header={
                  <>
                    Êtes vous sûr de vouloir supprimer le logo de{" "}
                    {event.eventName} ?
                  </>
                }
                mb={3}
                onClick={async () => {
                  try {
                    await editEvent({
                      payload: ["eventLogo"],
                      eventUrl: event.eventUrl
                    });
                    eventQuery.refetch();
                    toast({
                      title: "Le logo a bien été supprimé !",
                      status: "success",
                      isClosable: true
                    });
                  } catch (error) {
                    toast({
                      title: "Le logo n'a pas pu être supprimé",
                      status: "error",
                      isClosable: true
                    });
                  }
                }}
              />
            )}

            <form
              method="post"
              onChange={() => {
                clearErrors("formErrorMessage");
              }}
              onSubmit={handleSubmit(onSubmit)}
              onWheel={(e) => {
                if (elementLocked) enableScroll(elementLocked.el);
              }}
            >
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
                  defaultValue={event.eventLogo?.url}
                  isMultiple={false}
                  isRequired
                />
              ) : (
                <FormControl id="file" isInvalid={!!errors["file"]} mb={3}>
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
                  image={getValues("url") || event.eventLogo?.url}
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

              <Button
                colorScheme="green"
                type="submit"
                isLoading={editEventMutation.isLoading}
                isDisabled={Object.keys(errors).length > 0}
                mt={3}
              >
                Valider
              </Button>
            </form>
          </Box>
        </GridItem>
      )}
    </Grid>
  );
};
