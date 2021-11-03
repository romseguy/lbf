import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Heading,
  FormLabel,
  FormControl,
  FormErrorMessage,
  Alert,
  AlertIcon,
  Flex,
  Grid,
  GridProps,
  useToast
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import React, { useState, useRef } from "react";
import AvatarEditor from "react-avatar-editor";
import { useForm } from "react-hook-form";
import {
  Button,
  ErrorMessageText,
  GridHeader,
  GridItem,
  Input,
  Link
} from "features/common";
import { useEditEventMutation } from "features/events/eventsApi";
import { handleError } from "utils/form";
import { IEvent } from "models/Event";
import { calculateScale, getBase64 } from "utils/image";
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

  const [editEvent, editEventMutation] = useEditEventMutation();

  //#region form state
  const { register, handleSubmit, setError, errors, clearErrors, watch } =
    useForm({
      mode: "onChange"
    });
  const height = 220;
  const width = 220;
  const [upImg, setUpImg] = useState<string | File>();
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
      await editEvent({
        payload: {
          eventLogo: {
            width,
            height,
            base64: setEditorRef?.current?.getImageScaledToCanvas().toDataURL()
          }
        },
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
            logo: !isVisible.logo,
            banner: false
          })
        }
      >
        <GridHeader
          borderTopRadius="lg"
          borderBottomRadius={!isVisible.logo ? "lg" : undefined}
          alignItems="center"
        >
          <Flex flexDirection="row" alignItems="center">
            {isVisible.logo ? <ChevronDownIcon /> : <ChevronRightIcon />}
            <Heading size="sm" py={3}>
              Changer le logo
            </Heading>
          </Flex>
        </GridHeader>
      </Link>

      {isVisible.logo && (
        <GridItem light={{ bg: "orange.100" }} dark={{ bg: "gray.500" }}>
          <Box p={5}>
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

              {upImg && (
                <Box
                  width={width}
                  onWheel={(e) => {
                    e.stopPropagation();
                    console.log(scale);

                    setScale(calculateScale(scale, e.deltaY));

                    const el = e.target as HTMLElement;
                    disableScroll(el);
                    if (!elementLocked) setElementLocked({ el, locked: true });
                  }}
                >
                  <AvatarEditor
                    ref={setEditorRef}
                    image={upImg}
                    width={width}
                    height={height}
                    border={0}
                    color={[255, 255, 255, 0.6]} // RGBA
                    scale={scale}
                    rotate={0}
                    style={{ marginBottom: "12px" }}
                  />
                </Box>
              )}

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
