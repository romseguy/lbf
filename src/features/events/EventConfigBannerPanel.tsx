import type { Visibility } from "./EventPage";
import type { IEvent } from "models/Event";
import React, { useEffect, useState } from "react";
import AvatarEditor from "react-avatar-editor";
import {
  Box,
  Heading,
  FormLabel,
  FormControl,
  Stack,
  FormErrorMessage,
  Alert,
  AlertIcon,
  useToast,
  Flex,
  Radio,
  RadioGroup,
  GridProps,
  Image
} from "@chakra-ui/react";
import { useEditEventMutation } from "features/events/eventsApi";
import {
  Button,
  ErrorMessageText,
  Grid,
  GridHeader,
  GridItem,
  Input,
  Link,
  Select
} from "features/common";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  WarningIcon
} from "@chakra-ui/icons";
import { getBase64, getMeta } from "utils/image";
import { useForm } from "react-hook-form";
import { handleError } from "utils/form";
import { ErrorMessage } from "@hookform/error-message";
import { useRef } from "react";
import { UrlControl } from "features/common/forms/UrlControl";
import { urlR } from "utils/url";

type EventConfigBannerPanelProps = GridProps &
  Visibility & {
    event: IEvent;
    eventQuery: any;
  };

export const EventConfigBannerPanel = ({
  event,
  eventQuery,
  isVisible,
  setIsVisible,
  ...props
}: EventConfigBannerPanelProps) => {
  const toast = useToast({ position: "top" });

  //#region local state
  const [heights, setHeights] = useState([
    { label: "Petit", height: 140 },
    { label: "Moyen", height: 240 },
    { label: "Grand", height: 340 }
  ]);
  const [uploadType, setUploadType] = useState<"url" | "local">(
    event.eventBanner?.url ? "url" : "local"
  );
  const [upImg, setUpImg] = useState<string | File | null>(null);
  const setEditorRef = useRef<AvatarEditor | null>(null);
  //#endregion

  //#region form state
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
  const defaultHeight = event.eventBanner?.height || heights[0].height;
  const formHeight = watch("height") || defaultHeight;
  //#endregion

  //#region event
  const [editEvent, editEventMutation] = useEditEventMutation();
  // useEffect(() => {
  //   if (event.eventBanner?.url)
  //     getMeta(event.eventBanner.url, (width, height) => {
  //       console.log("url height", height);
  //       setHeights(heights.filter(({ height: h }) => h < height));
  //     });
  // }, [event.eventBanner?.url]);
  //#endregion

  const onSubmit = async (form: any) => {
    console.log("submitted", form);

    try {
      let payload = {};

      if (uploadType === "url") {
        payload = { eventBanner: { url: form.url, height: form.height } };
      } else {
        payload = {
          eventBanner: {
            height: form.height,
            mode: form.mode,
            base64: setEditorRef?.current?.getImageScaledToCanvas().toDataURL()
          }
        };
      }

      await editEvent({
        payload,
        eventUrl: event.eventUrl
      });
      toast({
        title: "L'image de couverture a bien été modifiée !",
        status: "success"
      });
      eventQuery.refetch();
      setIsVisible({ ...isVisible, banner: false });
    } catch (error) {
      handleError(error, (message) =>
        setError("formErrorMessage", {
          type: "manual",
          message
        })
      );
    }
  };

  return (
    <Grid {...props}>
      <Link
        variant="no-underline"
        onClick={() =>
          setIsVisible({
            ...isVisible,
            banner: !isVisible.banner,
            logo: false
          })
        }
      >
        <GridHeader
          borderTopRadius="lg"
          borderBottomRadius={!isVisible.banner ? "lg" : undefined}
          alignItems="center"
        >
          <Flex flexDirection="row" alignItems="center">
            {isVisible.banner ? <ChevronDownIcon /> : <ChevronRightIcon />}
            <Heading size="sm" py={3}>
              Changer l'image de couverture
            </Heading>
          </Flex>
        </GridHeader>
      </Link>

      {isVisible.banner && (
        <GridItem light={{ bg: "orange.100" }} dark={{ bg: "gray.500" }}>
          <Box p={5}>
            <form
              method="post"
              onChange={() => {
                clearErrors("formErrorMessage");
              }}
              onSubmit={handleSubmit(onSubmit)}
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
                      //setUpImg(event.eventBanner?.base64 || null);
                    }}
                  >
                    Envoyer une image depuis votre ordinateur
                  </Radio>
                  <Radio
                    isChecked={uploadType === "url"}
                    onChange={() => {
                      setUploadType("url");
                      //setUpImg(event.eventBanner?.url || null);
                      //setUpImg(null);
                    }}
                  >
                    Utiliser une image en provenance d'une autre adresse
                  </Radio>
                </Stack>
              </RadioGroup>

              <FormControl id="height" mb={3}>
                <FormLabel>Hauteur</FormLabel>
                <Select
                  name="height"
                  ref={register()}
                  defaultValue={defaultHeight}
                >
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
                  control={control}
                  label="Adresse internet de l'image"
                  defaultValue={event.eventBanner?.url}
                  errors={errors}
                  isMultiple={false}
                />
              ) : (
                <>
                  {/* <FormControl id="mode" mb={3}>
                <FormLabel>Theme</FormLabel>
                <Select
                  name="mode"
                  ref={register()}
                  defaultValue={event.eventBanner?.mode || "light"}
                >
                  <option value="light">Clair</option>
                  <option value="dark">Sombre</option>
                </Select>
              </FormControl> */}

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
                            // const reader = new FileReader();
                            // reader.addEventListener("load", () =>
                            //   setUpImg(reader.result)
                            // );
                            //reader.readAsDataURL(e.target.files[0]);
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
                </>
              )}

              <Box mb={3}>
                {uploadType === "url" ? (
                  <Image src={getValues("url") || event.eventBanner?.url} />
                ) : (
                  upImg && (
                    <AvatarEditor
                      ref={setEditorRef}
                      image={upImg}
                      width={1154}
                      height={parseInt(formHeight)}
                      border={0}
                      color={[255, 255, 255, 0.6]} // RGBA
                      scale={1}
                      rotate={0}
                    />
                  )
                )}
              </Box>

              <Button
                colorScheme="green"
                type="submit"
                isLoading={editEventMutation.isLoading}
                isDisabled={Object.keys(errors).length > 0}
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
