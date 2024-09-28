import {
  Alert,
  AlertIcon,
  Box,
  BoxProps,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Progress,
  Text,
  useColorMode
} from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

import { ErrorMessage } from "@hookform/error-message";
import axios from "axios";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { css } from "twin.macro";
import {
  Column,
  ErrorMessageText,
  FileInput,
  FileInputTable
} from "features/common";
import theme, { scrollbarCss } from "features/layout/theme";
import { selectIsMobile } from "store/uiSlice";
import { hasItems } from "utils/array";
import { handleError } from "utils/form";
import { useSession } from "hooks/useSession";
import { IGallery } from "models/Gallery";
import {
  AddDocumentPayload,
  useAddDocumentMutation
} from "features/api/documentsApi";
import { getImageDimensions } from "utils/image";
import { removeProps } from "utils/object";
import { ArrowForwardIcon } from "@chakra-ui/icons";

type FormValues = {
  fichiers: File[];
  formErrorMessage: { message: string };
};

const maxFileSize = 3;

export const DocumentForm = ({
  gallery,
  remainingDocumentsCount,
  ...props
}: BoxProps & {
  gallery?: IGallery;
  remainingDocumentsCount?: number;
  onSubmit?: () => void;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const isMobile = useSelector(selectIsMobile);
  const toast = useToast({ position: "top" });
  const [addDocument] = useAddDocumentMutation();

  const [isLoading, setIsLoading] = useState(false);
  const [loaded, setLoaded] = useState<{ [fileName: string]: number }>({});
  const [list, setList] = useState<File[]>([]);

  const {
    control,
    register,
    handleSubmit,
    errors,
    clearErrors,
    setError,
    setValue
  } = useForm<FormValues>({
    mode: "onChange"
  });

  const onChange = () => {
    clearErrors();
    setLoaded({});
  };
  const onSubmit = async () => {
    console.log("submitted", list);
    setIsLoading(true);

    try {
      if (!hasItems(list))
        throw new Error(`Veuillez sélectionner un ou plusieurs fichiers`);

      for (const file of list) {
        if (!file.type.includes("image"))
          return toast({
            title: `${file.name} n'est pas une image`,
            status: "error"
          });
        const fsMb = file.size / (1024 * 1024);
        if (fsMb > maxFileSize)
          return toast({
            title: `${file.name} est trop volumineux`,
            status: "error"
          });
      }

      for (const file of list) {
        setLoaded({ ...loaded, [file.name]: 0 });
        const { width, height } = await getImageDimensions(file);

        //API1
        let payload: AddDocumentPayload = {
          documentName: file.name,
          documentHeight: height,
          documentWidth: width,
          documentTime: new Date().getTime(),
          documentBytes: file.size,
          gallery
        };
        const { documentId } = await addDocument(payload).unwrap();

        //API2
        const data = new FormData();
        data.append("fileId", documentId);
        data.append("file", file, file.name);
        await axios.post(process.env.NEXT_PUBLIC_API2, data, {
          onUploadProgress: (ProgressEvent) => {
            setLoaded({
              ...loaded,
              [file.name]: (ProgressEvent.loaded / ProgressEvent.total) * 100
            });
          }
        });
      }

      toast({
        title: "Vos photos ont été ajoutées !",
        status: "success"
      });

      props.onSubmit && props.onSubmit();
    } catch (error) {
      handleError(error, (message) =>
        setError("formErrorMessage", {
          type: "manual",
          message
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      as="form"
      onChange={onChange}
      onSubmit={handleSubmit(onSubmit)}
      {...removeProps(props, ["onSubmit"])}
    >
      <FormControl isInvalid={!!errors["fichiers"]} mb={3}>
        <FormLabel>
          {/* <Text>Sélectionner un ou plusieurs fichiers.</Text> */}
          {!!remainingDocumentsCount && (
            <HStack spacing={1}>
              <ArrowForwardIcon />
              <Text>Vous pouvez encore ajouter </Text>
              <Text color="teal">{remainingDocumentsCount}</Text>
              <Text>
                photo{remainingDocumentsCount !== 1 ? "s" : ""}{" "}
                {!!gallery?.org
                  ? "à cette galerie"
                  : "à la galerie de cet événement"}
              </Text>
            </HStack>
          )}
          <HStack spacing={1}>
            <ArrowForwardIcon />
            <Text>Taille maximum par photo :</Text>
            <Text color="teal">{maxFileSize}Mo</Text>
          </HStack>
        </FormLabel>

        {list.length > 0 && (
          <Column
            bg={isDark ? "gray.700" : "white"}
            borderColor={isDark ? "gray.500" : "gray.200"}
            overflowX="auto"
            mb={3}
            css={css(scrollbarCss)}
            {...(isMobile ? { p: 0 } : {})}
          >
            <FileInputTable
              list={list}
              setList={setList}
              css={css`
                th,
                td {
                  border-color: ${isDark
                    ? theme.colors.gray[500]
                    : theme.colors.gray[200]};
                }
              `}
            />
          </Column>
        )}

        <Controller
          control={control}
          name="fichiers"
          defaultValue={[]}
          render={(renderProps) => {
            return (
              <FileInput
                id="fichiers"
                multiple
                alignSelf="flex-start"
                color="transparent"
                height="auto"
                p={0}
                width="auto"
                css={css`
                  background: none !important;
                  border: none !important;
                `}
                onChange={(event) => {
                  const files = event.target.files;
                  if (files) {
                    //@ts-expect-error
                    let newList: File[] = [].concat(list);

                    for (const file of Array.from(files)) {
                      const fsMb = file.size / (1024 * 1024);
                      if (fsMb < maxFileSize) newList = newList.concat([file]);
                      else
                        toast({
                          title: file.name + " est trop volumineux",
                          status: "error"
                        });
                    }
                    setList(newList);
                  }
                  onChange();
                  renderProps.onChange(files);
                }}
              />
            );
          }}
        />

        <FormErrorMessage>
          <ErrorMessage errors={errors} name="fichiers" />
        </FormErrorMessage>
      </FormControl>

      {Object.keys(loaded).map((fileName, i) => (
        <React.Fragment key={i}>
          <Text>{fileName}</Text>
          <Progress mb={3} hasStripe value={loaded[fileName]} />
        </React.Fragment>
      ))}

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

      <FormControl>
        <Button
          colorScheme="green"
          type="submit"
          isLoading={isLoading}
          isDisabled={!hasItems(list) || Object.keys(errors).length > 0}
        >
          Valider
        </Button>
      </FormControl>
    </Box>
  );
};

{
  /*
                 onChange={async (fichiers) => {
                   console.log(
                     "🚀 ~ file: DocumentForm.tsx:173 ~ onChange={ ~ fichiers:",
                     fichiers
                   );
                   onChange();
                   renderProps.onChange(fichiers);
                   @ts-expect-error
                   document.getElementById("fichiers").value = "";
                   setValue("fichiers", fichiers);
                 }}
  */
}

{
  /**
           <Box
             alignSelf="flex-start"
             bgColor={isDark ? "black" : "white"}
             overflowX="scroll"
             borderWidth={1}
             borderBottom="none"
             borderColor={isDark ? "gray.600" : "gray.200"}
             borderRadius="lg"
             mb={3}
             css={css`
               table {
                 width: auto;
               }
               table th {
                 padding: 12px;
               }
               table td {
                 border: none;
                 padding: 12px;
               }
             `}
           >
          // </Box>
 */
}

{
  /*
    if (statusText === "OK") {
      toast({
        title: "Votre document a été ajouté !",
        status: "success"
      });
    }

    const file = form.files[0];
    const data = new FormData();
    data.append("file", file, file.name);

    if (org) data.append("orgId", org._id);
    else if (user) data.append("userId", user._id);

    const { statusText } = await axios.post(
      process.env.NEXT_PUBLIC_API2,
      data,
      {
        onUploadProgress: (ProgressEvent) => {
          setLoaded((ProgressEvent.loaded / ProgressEvent.total) * 100);
        }
      }
    );

    if (statusText === "OK") {
      toast({
        title: "Votre document a été ajouté !",
        status: "success"
      });
    }
  */
}
