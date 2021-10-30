import { AddIcon, ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  Progress,
  Table,
  Tbody,
  Td,
  Text,
  Tr,
  useToast
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import axios from "axios";
import { DeleteButton, ErrorMessageText, Link } from "features/common";
import { useSession } from "hooks/useAuth";
import { IOrg } from "models/Org";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaFile, FaImage } from "react-icons/fa";
import { handleError } from "utils/form";
import * as stringUtils from "utils/string";
import { useAddDocumentMutation, useGetDocumentsQuery } from "./documentsApi";
import api from "utils/api";

export const DocumentsList = ({
  org,
  isLogin,
  setIsLogin,
  ...props
}: {
  org: IOrg;
  isCreator?: boolean;
  isFollowed?: boolean;
  isSubscribed?: boolean;
  isLogin: number;
  setIsLogin: (isLogin: number) => void;
}) => {
  const { data: session, loading: isSessionLoading } = useSession();
  const toast = useToast({ position: "top" });

  const query = useGetDocumentsQuery(org._id);
  //const [addDocument, addDocumentMutation] = useAddDocumentMutation();

  const [loaded, setLoaded] = useState(0);
  const [isAdd, setIsAdd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, setError, errors, clearErrors, watch } =
    useForm({
      mode: "onChange"
    });

  const onSubmit = async (form: any) => {
    console.log("submitted", form);
    setIsLoading(true);

    try {
      const file = form.files[0];
      const data = new FormData();
      data.append("file", file, file.name);
      data.append("orgId", org._id);

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
          title: "Votre document a bien été ajouté !",
          status: "success"
        });
        query.refetch();
        setIsAdd(false);
      }
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
    <>
      <Button
        colorScheme="teal"
        leftIcon={<AddIcon />}
        rightIcon={isAdd ? <ChevronDownIcon /> : <ChevronRightIcon />}
        mb={5}
        onClick={() => {
          if (!isSessionLoading) {
            if (session) {
              setIsAdd(!isAdd);
            } else {
              setIsLogin(isLogin + 1);
            }
          }
        }}
      >
        Ajouter
      </Button>

      {isAdd && (
        <form
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

          <FormControl id="files" isInvalid={!!errors["files"]} mb={3}>
            <FormLabel>Sélectionnez un fichier :</FormLabel>
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
                  if (file && file[0] && file[0].size >= 50000000) {
                    return "Le fichier ne doit pas dépasser 50Mo.";
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

          <Button
            colorScheme="green"
            type="submit"
            isLoading={isLoading}
            isDisabled={Object.keys(errors).length > 0}
          >
            Ajouter
          </Button>
        </form>
      )}

      {query.isLoading || query.isFetching ? (
        <Text>Chargement des documents...</Text>
      ) : (
        Array.isArray(query.data) && (
          <Table>
            <Tbody>
              {query.data.map((fileName) => {
                const isImage = stringUtils.isImage(fileName);
                const isPdf = fileName.includes(".pdf");
                return (
                  <Tr>
                    <Td>
                      <a
                        href={`${process.env.NEXT_PUBLIC_API2}/${
                          isImage || isPdf ? "view" : "download"
                        }?orgId=${org._id}&fileName=${fileName}`}
                        target="_blank"
                      >
                        <Box display="flex" alignItems="center">
                          <Icon as={isImage ? FaImage : FaFile} mr={3} />
                          {fileName}
                        </Box>
                      </a>
                    </Td>
                    <Td textAlign="right">
                      <DeleteButton
                        isIconOnly
                        placement="bottom"
                        bg="transparent"
                        height="auto"
                        minWidth={0}
                        _hover={{ color: "red" }}
                        header={
                          <>
                            Êtes vous sûr de vouloir supprimer le fichier{" "}
                            <Text
                              display="inline"
                              color="red"
                              fontWeight="bold"
                            >
                              {fileName}
                            </Text>{" "}
                            ?
                          </>
                        }
                        onClick={async () => {
                          let payload: { fileName: string; orgId?: string } = {
                            fileName
                          };

                          if (org) {
                            payload.orgId = org._id;
                          }

                          try {
                            await api.remove(
                              process.env.NEXT_PUBLIC_API2,
                              payload
                            );
                            toast({
                              title: `Le document ${fileName} a bien été supprimé !`,
                              status: "success",
                              isClosable: true
                            });
                            query.refetch();
                          } catch (error) {
                            console.error(error);
                            toast({
                              title: `Le document ${fileName} n'a pas pu être supprimé.`,
                              status: "error",
                              isClosable: true
                            });
                          }
                        }}
                      />
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        )
      )}
    </>
  );
};
