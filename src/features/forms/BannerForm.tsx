import {
  Alert,
  AlertIcon,
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Icon,
  Image,
  Radio,
  RadioGroup,
  Select,
  Spinner,
  Stack,
  useColorMode
} from "@chakra-ui/react";
import axios from "axios";
import { useToast } from "hooks/useToast";

import { ErrorMessage } from "@hookform/error-message";
import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { css } from "twin.macro";
import { useEditEventMutation } from "features/api/eventsApi";
import {
  Button,
  DeleteButton,
  ErrorMessageText,
  Input,
  UrlControl
} from "features/common";
import { EventConfigVisibility } from "features/events/EventConfigPanel";
import { OrgConfigVisibility } from "features/orgs/OrgConfigPanel";
import { useEditOrgMutation } from "features/api/orgsApi";
import { getRefId, IEntity, isEvent, isOrg } from "models/Entity";
import { orgTypeFull } from "models/Org";
import { bannerWidth as defaultBannerWidth } from "features/layout/theme";
import { handleError } from "utils/form";
import { getImageDimensions, getMeta } from "utils/image";
import { AppQueryWithData } from "utils/types";
import { MB } from "utils/string";
import { EditIcon } from "@chakra-ui/icons";
import api, { client } from "utils/api";
import {
  AddDocumentPayload,
  useAddDocumentMutation
} from "features/api/documentsApi";
import { useSelector } from "react-redux";
import { selectScreenWidth } from "store/uiSlice";

export const BannerForm = ({
  query,
  toggleVisibility
}: (EventConfigVisibility | OrgConfigVisibility) & {
  query: AppQueryWithData<IEntity>;
}) => {
  const screenWidth = useSelector(selectScreenWidth);
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const toast = useToast({ position: "top" });
  const [editEvent] = useEditEventMutation();
  const [editOrg] = useEditOrgMutation();
  const [addDocument] = useAddDocumentMutation();

  const entity = query.data;
  const isE = isEvent(entity);
  const isO = isOrg(entity);
  const edit = isE ? editEvent : editOrg;
  const entityName = isE ? entity.eventName : isO ? entity.orgName : entity._id;
  const entityBanner = isE
    ? entity.eventBanner
    : isO
      ? entity.orgBanner
      : undefined;
  // const [entityBanner, setEntityBanner] = useState({
  //   url: process.env.NEXT_PUBLIC_FILES + "/" + entity._id
  // });
  // const [entityBanner, setEntityBanner] = useState(
  //   isE ? entity.eventBanner : isO ? entity.orgBanner : undefined
  // );
  const entityBannerUrl =
    entityBanner && entityBanner.doc
      ? process.env.NEXT_PUBLIC_FILES + "/" + getRefId(entityBanner.doc, "_id")
      : undefined;
  const entityBannerWidth = 0;
  // useEffect(() => {
  //   (async () => {
  //     const { status } = await api.get(
  //       process.env.NEXT_PUBLIC_FILES + "/" + entity._id
  //     );
  //   })();
  // }, []);

  //#region form
  const {
    register,
    control,
    handleSubmit,
    setError,
    errors,
    clearErrors,
    setValue
  } = useForm({
    mode: "onChange"
  });

  //#region form state
  const [isEdit, setIsEdit] = useState(!entityBanner);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File>();
  const [uploadType, setUploadType] = useState<"url" | "local">("local");
  const url = useWatch<string>({ control, name: "url" });

  const [heights, setHeights] = useState([
    { label: "Petit", height: 140 },
    { label: "Moyen", height: 240 },
    { label: "Grand", height: 500 }
  ]);
  const defaultHeight = heights[0].height;
  const bannerHeight = entityBanner?.headerHeight || defaultHeight;
  const formHeight =
    useWatch<number>({ control, name: "height" }) || defaultHeight;
  //#endregion

  //#region form handlers

  async function postImage() {
    if (!imageFile) throw new Error("No image");

    try {
      const { height, width } = await getImageDimensions(imageFile);
      const payload: AddDocumentPayload = {
        documentName: entity._id,
        documentHeight: height,
        documentWidth: width,
        documentTime: new Date().getTime(),
        documentBytes: imageFile.size
      };
      const { documentId } = await addDocument(payload).unwrap();

      const data = new FormData();
      data.append("fileId", documentId);
      data.append("file", imageFile, imageFile.name);
      await axios.post(process.env.NEXT_PUBLIC_API2, data, {
        // onUploadProgress: (ProgressEvent) => {
        //   setLoaded({
        //     ...loaded,
        //     [imageFile.name]: (ProgressEvent.loaded / ProgressEvent.total) * 100
        //   });
        // }
      });

      return documentId;
    } catch (error) {
      throw error;
    }
  }
  const onChange = () => clearErrors("formErrorMessage");
  const onSubmit = async (form: {
    file?: FileList;
    url?: string;
    height: number;
  }) => {
    console.log("submitted", form);
    setIsLoading(true);

    try {
      const key = `${isE ? "event" : "org"}Banner`;
      let payload = {};

      // if (form.url) {
      //   const { height, width } = await getMeta(form.url);

      //   payload = {
      //     [key]: {
      //       url: form.url,
      //       headerHeight: formHeight,
      //       height,
      //       width
      //     }
      //   };
      // } else

      if (imageFile) {
        const documentId = await postImage();
        const { width, height } = await getImageDimensions(imageFile);
        payload = {
          [key]: {
            doc: documentId,
            height,
            width,
            headerHeight: formHeight
          }
        };

        setImageFile(undefined);
      } else throw new Error("Vous devez choisir une bannière");

      await edit({
        payload,
        [isE ? "eventId" : isO ? "orgId" : "entityId"]: entity._id
      }).unwrap();
      setIsLoading(false);

      toast({
        title: `La bannière ${
          isE ? "de l'événement" : isO ? orgTypeFull(entity.orgType) : ""
        } a été modifiée !`,
        status: "success"
      });
      toggleVisibility("banner");
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

  // useEffect(() => {
  //   const el = document.getElementById("banner");

  //   if (el && el.src === process.env.NEXT_PUBLIC_URL + "/") {
  //     console.log("banner 404");
  //     setEntityBanner({ url: "" });
  //   }
  // }, []);

  return (
    <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
      {isLoading && <Spinner />}

      {/* <Image
        id="banner"
        alt="Bannière"
        src={entityBannerUrl}
        fallbackSrc={process.env.NEXT_PUBLIC_URL}
      /> */}

      {!isLoading && entityBanner && entityBannerUrl && !isEdit && (
        <>
          <HStack>
            <Button
              colorScheme="teal"
              leftIcon={<Icon as={EditIcon} />}
              // mb={isMobile ? 3 : 0}
              // mr={isMobile ? 0 : 3}
              onClick={() => {
                setIsEdit(true);
              }}
            >
              Modifier
            </Button>

            <DeleteButton
              header={<>Êtes vous sûr de vouloir supprimer la bannière ?</>}
              mb={3}
              onClick={async () => {
                try {
                  setIsLoading(true);
                  await edit({
                    payload: isE ? ["eventBanner"] : ["orgBanner"],
                    [isE ? "eventId" : "orgId"]: entity._id
                  }).unwrap();
                  setIsLoading(false);
                  toast({
                    title: `La bannière ${
                      isE
                        ? "de l'événement"
                        : isO
                          ? orgTypeFull(entity.orgType)
                          : ""
                    } a été supprimée !`,
                    status: "success"
                  });
                  toggleVisibility("banner");
                } catch (error) {
                  setIsLoading(false);
                  toast({
                    title: `La bannière ${
                      isE
                        ? "de l'événement"
                        : isO
                          ? orgTypeFull(entity.orgType)
                          : ""
                    } n'a pas pu être supprimée`,
                    status: "error"
                  });
                }
              }}
            />
          </HStack>

          {/* <Image
            id="banner"
            alt="Bannière"
            src={entityBannerUrl}
            fallbackSrc={process.env.NEXT_PUBLIC_URL}
          /> */}

          <Box
            //as="img"
            css={css`
              background-image: url("${entityBannerUrl}");
              background-position: center;
              background-size: cover;
              height: ${entityBanner.headerHeight || defaultHeight}px;
              width: ${entityBannerWidth ? entityBannerWidth + "px" : "100%"};
            `}
            my={5}
          />

          <FormControl mb={3}>
            <FormLabel>Hauteur de la bannière</FormLabel>
            <Select
              name="height"
              ref={register()}
              onChange={async (e) => {
                try {
                  setIsLoading(true);

                  const headerHeight = Number(e.target.value);
                  const key = `${isE ? "event" : "org"}Banner`;
                  let payload = {
                    [key]: {
                      doc: getRefId(entityBanner.doc, "_id"),
                      height: entityBanner.height,
                      width: entityBanner.width,
                      headerHeight
                    }
                  };
                  await edit({
                    payload,
                    [isE ? "eventId" : isO ? "orgId" : "entityId"]: entity._id
                  }).unwrap();

                  setIsLoading(false);
                } catch (error) {
                  setIsLoading(false);
                  handleError(error, (message) =>
                    setError("formErrorMessage", {
                      type: "manual",
                      message
                    })
                  );
                }
              }}
            >
              {heights.map(({ label, height: h }) => (
                <option
                  key={"height-" + h}
                  selected={h === bannerHeight}
                  //disabled={h === Number(entityBanner.headerHeight)}
                  value={h}
                >
                  {label}
                </option>
              ))}
            </Select>
          </FormControl>
        </>
      )}

      {!isLoading && (isEdit || !entityBannerUrl) && (
        <>
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
                isDisabled
                isChecked={uploadType === "url"}
                onChange={() => {
                  setUploadType("url");
                }}
              >
                Utiliser une image en provenance d'une autre adresse
              </Radio>
            </Stack>
          </RadioGroup>

          {/* {uploadType === "url" && (
            <>
              <UrlControl
                name="url"
                control={control}
                defaultValue={entityBanner?.url}
                errors={errors}
                register={register}
                setValue={setValue}
                isMultiple={false}
                isRequired
                label="Adresse internet de l'image"
                placeholder=""
                mb={3}
              />

              {url && (
                <Image
                  alt="banner"
                  src={url}
                  height={parseInt(formHeight)}
                  width={defaultBannerWidth}
                />
              )}
            </>
          )} */}

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
                      const imageFile = e.target.files[0];
                      if (imageFile.size < 5 * MB) {
                        setImageFile(imageFile);
                        clearErrors("file");
                      }
                    }
                  }}
                  ref={register({
                    validate: (file) => {
                      if (file && file[0] && file[0].size >= 5 * MB) {
                        return "L'image ne doit pas dépasser 5Mo.";
                      }
                      return true;
                    }
                  })}
                />
                <FormErrorMessage>
                  <ErrorMessage errors={errors} name="file" />
                </FormErrorMessage>
              </FormControl>

              {/* {image && (
                <Box
                  css={css`
                    background-image: url("${bannerUrl}");
                    background-position: center;
                    background-size: cover;
                    height: ${formHeight}px;
                  `}
                />
              )} */}
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

          <Flex justifyContent="space-between" mt={5}>
            <Button
              colorScheme="red"
              onClick={() => {
                setIsEdit(false);
              }}
            >
              Annuler
            </Button>

            <Button
              colorScheme="green"
              type="submit"
              isLoading={isLoading}
              isDisabled={Object.keys(errors).length > 0}
            >
              Valider
            </Button>
          </Flex>
        </>
      )}
    </form>
  );
};
