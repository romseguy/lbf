import {
  Alert,
  AlertIcon,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Progress,
  Text,
  useColorMode,
  useToast
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { css } from "twin.macro";
import { ErrorMessageText, FileInput } from "features/common";
import { IOrg } from "models/Org";
import { IUser } from "models/User";
import { handleError } from "utils/form";
import { hasItems } from "utils/array";

type FormValues = {
  fichiers: File[];
  formErrorMessage: { message: string };
};

const TableContainer = ({
  children
}: {
  children: React.ReactNode | React.ReactNodeArray;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <Box
      alignSelf="flex-start"
      bgColor={isDark ? "black" : "white"}
      overflowX="auto"
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
      {children}
    </Box>
  );
};

export const DocumentForm = ({
  org,
  user,
  ...props
}: {
  org?: IOrg;
  user?: IUser;
  onSubmit: () => void;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const toast = useToast({ position: "top" });
  const [isLoading, setIsLoading] = useState(false);
  const [loaded, setLoaded] = useState<{ [fileName: string]: number }>({});
  const [list, setList] = useState<File[]>([]);

  //#region form state
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
        throw `Veuillez sélectionner un ou plusieurs fichiers`;

      for (const file of list) {
        setLoaded({ ...loaded, [file.name]: 0 });
        const fsMb = file.size / (1024 * 1024);

        if (fsMb > 10) throw `${file.name} est trop volumineux`;

        const data = new FormData();
        data.append("file", file, file.name);
        if (org) data.append("orgId", org._id);
        else if (user) data.append("userId", user._id);

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
        title: "Vos fichiers ont été ajoutés !",
        status: "success"
      });

      props.onSubmit && props.onSubmit();
    } catch (error) {
      if (typeof error === "string")
        setError("formErrorMessage", {
          type: "manual",
          message: error
        });
      else
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
    <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={!!errors["fichiers"]} mb={3}>
        <FormLabel>
          Sélectionnez un ou plusieurs fichiers. Taille maximum par fichier :{" "}
          <b>10Mo</b>
        </FormLabel>

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
                TableContainer={TableContainer}
                css={css`
                  background: none !important;
                  border: none !important;
                `}
                //@ts-expect-error
                list={list}
                setList={setList}
                onChange={(event) => {
                  const files = event.target.files;
                  onChange();
                  renderProps.onChange(files);
                }}
                // onChange={async (fichiers) => {
                //   console.log(
                //     "🚀 ~ file: DocumentForm.tsx:173 ~ onChange={ ~ fichiers:",
                //     fichiers
                //   );
                //   onChange();
                //   renderProps.onChange(fichiers);
                //   //@ts-expect-error
                //   //document.getElementById("fichiers").value = "";
                //   //setValue("fichiers", fichiers);
                // }}
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

      <Button
        colorScheme="green"
        type="submit"
        isLoading={isLoading}
        isDisabled={Object.keys(errors).length > 0}
      >
        Ajouter
      </Button>
    </form>
  );
};

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
