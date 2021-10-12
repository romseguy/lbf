import type { Visibility } from "./OrgPage";
import type { IOrg } from "models/Org";
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
import { useEditOrgMutation } from "features/orgs/orgsApi";
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

  //#region local state
  const [heights, setHeights] = useState([
    { label: "Petit", height: 140 },
    { label: "Moyen", height: 240 },
    { label: "Grand", height: 340 }
  ]);
  const [uploadType, setUploadType] = useState<"url" | "local">(
    org.orgBanner?.url ? "url" : "local"
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
  const defaultHeight = org.orgBanner?.height || heights[0].height;
  const formHeight = watch("height") || defaultHeight;
  //#endregion

  //#region org
  const [editOrg, editOrgMutation] = useEditOrgMutation();
  // useEffect(() => {
  //   if (org.orgBanner?.url)
  //     getMeta(org.orgBanner.url, (width, height) => {
  //       console.log("url height", height);
  //       setHeights(heights.filter(({ height: h }) => h < height));
  //     });
  // }, [org.orgBanner?.url]);
  //#endregion

  const onSubmit = async (form: any) => {
    console.log("submitted", form);

    try {
      let payload = {};

      if (uploadType === "url") {
        payload = { orgBanner: { url: form.url, height: form.height } };
      } else {
        payload = {
          orgBanner: {
            height: form.height,
            mode: form.mode,
            base64: setEditorRef?.current?.getImageScaledToCanvas().toDataURL()
          }
        };
      }

      await editOrg({
        payload,
        orgUrl: org.orgUrl
      });
      toast({
        title: "L'image de couverture a bien été modifiée !",
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
                      //setUpImg(org.orgBanner?.base64 || null);
                    }}
                  >
                    Envoyer une image depuis votre ordinateur
                  </Radio>
                  <Radio
                    isChecked={uploadType === "url"}
                    onChange={() => {
                      setUploadType("url");
                      //setUpImg(org.orgBanner?.url || null);
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
                  errors={errors}
                  label="Adresse internet de l'image"
                  defaultValue={org.orgBanner?.url}
                  isMultiple={false}
                />
              ) : (
                <>
                  {/* <FormControl id="mode" mb={3}>
                <FormLabel>Theme</FormLabel>
                <Select
                  name="mode"
                  ref={register()}
                  defaultValue={org.orgBanner?.mode || "light"}
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
                            // reader.addOrgListener("load", () =>
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
                  <Image src={getValues("url") || org.orgBanner?.url} />
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
