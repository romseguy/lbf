import {
  Alert,
  AlertIcon,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Progress,
  Text,
  useToast
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessageText } from "features/common";
import { IOrg } from "models/Org";
import { IUser } from "models/User";
import { handleError } from "utils/form";

export const DocumentForm = ({
  org,
  user,
  ...props
}: {
  org?: IOrg;
  user?: IUser;
  onSubmit: () => void;
}) => {
  const toast = useToast({ position: "top" });
  const [isLoading, setIsLoading] = useState(false);
  const [loaded, setLoaded] = useState(0);

  //#region form state
  const { register, handleSubmit, setError, errors, clearErrors, watch } =
    useForm({
      mode: "onChange"
    });
  const onChange = () => {
    clearErrors("formErrorMessage");
  };
  const onSubmit = async (form: any) => {
    console.log("submitted", form);
    setIsLoading(true);

    try {
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
    <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
      <FormControl isInvalid={!!errors["files"]} mb={3}>
        <FormLabel display="inline">
          Sélectionnez un fichier. Taille maximum :{" "}
          <Text as="span" color="red">
            10Mo
          </Text>
        </FormLabel>
        <Input
          height="auto"
          py={3}
          name="files"
          type="file"
          accept="*"
          onChange={async (e) => {
            if (e.target.files && e.target.files[0]) {
              setLoaded(0);
              clearErrors("file");
              clearErrors("formErrorMessage");
            }
          }}
          ref={register({
            required: "Vous devez sélectionner un fichier",
            validate: (file) => {
              if (file && file[0] && file[0].size >= 10000000) {
                return "Le fichier ne doit pas dépasser 10Mo.";
              }
              return true;
            }
          })}
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="files" />
        </FormErrorMessage>
      </FormControl>

      {loaded > 0 && loaded !== 100 && (
        <Progress mb={3} hasStripe value={loaded} />
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
