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
  AlertIcon
} from "@chakra-ui/react";
import { useEditOrgMutation } from "features/orgs/orgsApi";
import {
  Button,
  ErrorMessageText,
  GridHeader,
  GridItem,
  Input,
  Select
} from "features/common";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  WarningIcon
} from "@chakra-ui/icons";
import { getBase64 } from "utils/image";
import { useForm } from "react-hook-form";
import { handleError } from "utils/form";
import { ErrorMessage } from "@hookform/error-message";
import { useRef } from "react";

type OrgConfigBannerPanelProps = Visibility & {
  org: IOrg;
  orgQuery: any;
};

export const OrgConfigBannerPanel = ({
  org,
  orgQuery,
  isVisible,
  setIsVisible
}: OrgConfigBannerPanelProps) => {
  const [editOrg, editOrgMutation] = useEditOrgMutation();
  const { register, handleSubmit, setError, errors, clearErrors, watch } =
    useForm({
      mode: "onChange"
    });
  const height = watch("height");
  const width = watch("width");

  const [upImg, setUpImg] = useState<string | File>();
  const setEditorRef = useRef<AvatarEditor | null>(null);

  const onSubmit = async (form: any) => {
    console.log("submitted", form);

    try {
      await editOrg({
        payload: {
          ...org,
          orgBanner: {
            width: form.width,
            height: form.height,
            mode: form.mode,
            base64: setEditorRef?.current?.getImageScaledToCanvas().toDataURL()
          }
        },
        orgUrl: org.orgUrl
      });
      orgQuery.refetch();
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
    <>
      <GridHeader
        borderTopRadius="lg"
        alignItems="center"
        cursor="pointer"
        onClick={() =>
          setIsVisible({
            ...isVisible,
            banner: !isVisible.banner,
            subscribers: false
          })
        }
      >
        <Heading size="sm" py={3}>
          Changer l'image de couverture{" "}
          {isVisible.banner ? <ChevronDownIcon /> : <ChevronRightIcon />}
        </Heading>
      </GridHeader>

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

              <FormControl id="width" mb={3}>
                <FormLabel>Largeur</FormLabel>
                <Select
                  name="width"
                  ref={register()}
                  defaultValue={org.orgBanner?.width}
                >
                  <option>1154</option>
                </Select>
              </FormControl>

              <FormControl id="height" mb={3}>
                <FormLabel>Hauteur</FormLabel>
                <Select
                  name="height"
                  ref={register()}
                  defaultValue={org.orgBanner?.height}
                >
                  <option>140</option>
                  <option>240</option>
                  <option>340</option>
                </Select>
              </FormControl>

              <FormControl id="mode" mb={3}>
                <FormLabel>Theme</FormLabel>
                <Select
                  name="mode"
                  ref={register()}
                  defaultValue={org.orgBanner?.mode || "light"}
                >
                  <option value="light">Clair</option>
                  <option value="dark">Sombre</option>
                </Select>
              </FormControl>

              <FormControl id="file" isInvalid={!!errors["file"]} mb={3}>
                <FormLabel>Image</FormLabel>
                <Input
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
                <AvatarEditor
                  ref={setEditorRef}
                  image={upImg}
                  width={parseInt(width) * 0.9}
                  height={parseInt(height)}
                  border={0}
                  color={[255, 255, 255, 0.6]} // RGBA
                  scale={1}
                  rotate={0}
                  style={{ marginBottom: "12px" }}
                />
              )}

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
    </>
  );
};
