import type { Visibility } from "./OrgPage";
import type { IOrg } from "models/Org";
import React, { useState } from "react";
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
  GridProps
} from "@chakra-ui/react";
import { useEditOrgMutation } from "features/orgs/orgsApi";
import {
  Button,
  DeleteButton,
  ErrorMessageText,
  Grid,
  GridHeader,
  GridItem,
  Input,
  Link,
  Select
} from "features/common";
import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { Base64Image, getBase64, getMeta } from "utils/image";
import { useForm } from "react-hook-form";
import { handleError } from "utils/form";
import { ErrorMessage } from "@hookform/error-message";
import { useRef } from "react";
import { UrlControl } from "features/common/forms/UrlControl";

type OrgConfigBannerPanelProps = GridProps &
  Visibility & {
    org: IOrg;
    orgQuery: any;
  };

export const OrgConfigBannerPanel = ({
  org,
  orgQuery,
  isVisible,
  setIsVisible,
  ...props
}: OrgConfigBannerPanelProps) => {
  const toast = useToast({ position: "top" });

  //#region org
  const [editOrg, editOrgMutation] = useEditOrgMutation();
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
  const [heights, setHeights] = useState([
    { label: "Petit", height: 140 },
    { label: "Moyen", height: 240 },
    { label: "Grand", height: 340 }
  ]);
  const { height: defaultHeight } =
    heights.find(({ height }) => height === org.orgBanner?.headerHeight) ||
    heights[0];
  const formHeight = watch("height") || defaultHeight;
  const [uploadType, setUploadType] = useState<"url" | "local">(
    org.orgBanner?.url ? "url" : "local"
  );
  const [upImg, setUpImg] = useState<Base64Image>();
  const setEditorRef = useRef<AvatarEditor | null>(null);

  const onSubmit = async (form: any) => {
    console.log("submitted", form);

    try {
      let payload = {};

      if (uploadType === "url") {
        const { height } = await getMeta(form.url);
        payload = {
          orgBanner: {
            url: form.url,
            height,
            headerHeight: form.height
          }
        };
      } else {
        payload = {
          orgBanner: {
            base64: setEditorRef?.current?.getImageScaledToCanvas().toDataURL(),
            height: form.height, // todo actual height
            headerHeight: form.height,
            mode: form.mode
          }
        };
      }

      await editOrg({
        payload,
        orgUrl: org.orgUrl
      });
      toast({
        title: "La bannière a bien été modifiée !",
        status: "success"
      });
      orgQuery.refetch();
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
  //#endregion

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
              Bannière
            </Heading>
          </Flex>
        </GridHeader>
      </Link>

      {isVisible.banner && (
        <GridItem light={{ bg: "orange.100" }} dark={{ bg: "gray.500" }}>
          <Box p={5}>
            {org.orgBanner && (
              <DeleteButton
                header={
                  <>
                    Êtes vous sûr de vouloir supprimer la bannière de{" "}
                    {org.orgName} ?
                  </>
                }
                mb={3}
                onClick={async () => {
                  try {
                    await editOrg({
                      payload: ["orgBanner"],
                      orgUrl: org.orgUrl
                    });
                    orgQuery.refetch();
                    toast({
                      title: "La bannière a bien été supprimée",
                      status: "success"
                    });
                  } catch (error) {
                    toast({
                      title: "La bannière n'a pas pu être supprimée",
                      status: "error"
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
                  setValue={setValue}
                  control={control}
                  errors={errors}
                  label="Adresse internet de l'image"
                  defaultValue={org.orgBanner?.url}
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

              <Box mb={3}>
                {uploadType === "url" ? (
                  <AvatarEditor
                    ref={setEditorRef}
                    border={0}
                    color={[255, 255, 255, 0.6]} // RGBA
                    height={parseInt(formHeight)}
                    image={getValues("url") || org.orgBanner?.url}
                    rotate={0}
                    scale={1}
                    width={1154}
                    position={{ x: 0, y: 0 }}
                  />
                ) : (
                  upImg &&
                  upImg.base64 && (
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
                  )
                )}
              </Box>

              <Button
                colorScheme="green"
                type="submit"
                isLoading={editOrgMutation.isLoading}
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
