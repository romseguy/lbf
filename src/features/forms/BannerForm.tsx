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
import { useToast } from "hooks/useToast";

import { ErrorMessage } from "@hookform/error-message";
import React, { useState } from "react";
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
import { IEntity, isEvent, isOrg } from "models/Entity";
import { orgTypeFull } from "models/Org";
import { bannerWidth } from "features/layout/theme";
import { handleError } from "utils/form";
import { Base64Image, getBase64, getMeta } from "utils/image";
import { AppQueryWithData } from "utils/types";
import { MB } from "utils/string";
import { EditIcon } from "@chakra-ui/icons";

export const BannerForm = ({
  query,
  toggleVisibility
}: (EventConfigVisibility | OrgConfigVisibility) & {
  query: AppQueryWithData<IEntity>;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const toast = useToast({ position: "top" });
  const [editEvent] = useEditEventMutation();
  const [editOrg] = useEditOrgMutation();
  const entity = query.data;
  const isE = isEvent(entity);
  const isO = isOrg(entity);
  const edit = isE ? editEvent : editOrg;
  const entityBanner = isE
    ? entity.eventBanner
    : isO
      ? entity.orgBanner
      : undefined;
  const entityName = isE ? entity.eventName : isO ? entity.orgName : entity._id;

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
  const [image, setImage] = useState<Base64Image>();
  const [uploadType, setUploadType] = useState<"url" | "local">("local");
  const url = useWatch<string>({ control, name: "url" });

  const [heights, setHeights] = useState([
    { label: "Petit", height: 140 },
    { label: "Moyen", height: 240 },
    { label: "Grand", height: 340 }
  ]);
  const defaultHeight = heights[0].height;
  const bannerHeight = entityBanner?.headerHeight || defaultHeight;
  const formHeight =
    useWatch<number>({ control, name: "height" }) || defaultHeight;
  //#endregion

  //#region form handlers
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

      if (form.url) {
        const { height, width } = await getMeta(form.url);

        payload = {
          [key]: {
            url: form.url,
            headerHeight: formHeight,
            height,
            width
          }
        };
      } else if (image) {
        payload = {
          [key]: {
            ...image,
            headerHeight: formHeight
          }
        };

        setImage(undefined);
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

  return (
    <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
      {isLoading && <Spinner />}

      {!isLoading && entityBanner && !isEdit && (
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

          <Box
            //as="img"
            css={css`
              background-image: url("${entityBanner.base64 || entityBanner.url}");
              background-position: center;
              background-size: cover;
              height: ${entityBanner.headerHeight || defaultHeight}px;
              /*width: ${bannerWidth}px;*/
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
                      ...entityBanner,
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

      {!isLoading && isEdit && (
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

          {uploadType === "url" && (
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
                  width={bannerWidth}
                />
              )}
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
                      if (e.target.files[0].size < 5 * MB) {
                        setImage(await getBase64(e.target.files[0]));
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

              {image?.base64 && (
                <Box
                  //as="img"
                  css={css`
                    background-image: url("${image.base64}");
                    background-position: center;
                    background-size: cover;
                    height: ${formHeight}px;
                    /*width: ${bannerWidth}px;*/
                  `}
                />
              )}
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
