import { AddIcon, ChevronRightIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
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
import React, { useState } from "react";
import { FaFile, FaImage } from "react-icons/fa";
import { useForm } from "react-hook-form";
import {
  Column,
  DeleteButton,
  ErrorMessageText,
  HostTag,
  LinkShare
} from "features/common";
import { useSession } from "hooks/useSession";
import { IOrg, orgTypeFull } from "models/Org";
import { IUser } from "models/User";
import { useGetDocumentsQuery } from "features/api/documentsApi";
import api from "utils/api";
import { handleError } from "utils/form";
import * as stringUtils from "utils/string";
import { hasItems } from "utils/array";
import { useDiskUsage } from "hooks/useDiskUsage";

export const DocumentsList = ({
  org,
  user,
  isLogin,
  setIsLogin,
  ...props
}: {
  org?: IOrg;
  user?: IUser;
  isCreator?: boolean;
  isFollowed?: boolean;
  isSubscribed?: boolean;
  isLogin: number;
  setIsLogin: (isLogin: number) => void;
}) => {
  const { data: session, loading: isSessionLoading } = useSession();
  const toast = useToast({ position: "top" });

  //#region documents
  const query = useGetDocumentsQuery(
    org ? { orgId: org._id } : user ? { userId: user._id } : {}
  );
  //#endregion

  //#region local state
  const diskUsage = useDiskUsage();
  const [loaded, setLoaded] = useState(0);
  const [isAdd, setIsAdd] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  //#endregion

  //#region form
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
  //#endregion

  return (
    <>
      <Flex flexWrap="wrap" mb={3} mt={-3}>
        <Box flexGrow={1} mt={3}>
          <Button
            colorScheme="teal"
            leftIcon={<AddIcon />}
            rightIcon={isAdd ? <ChevronUpIcon /> : <ChevronRightIcon />}
            onClick={() => {
              if (!isSessionLoading) {
                if (session) {
                  if (org && !props.isSubscribed && !props.isCreator)
                    toast({
                      status: "error",
                      title: `Vous devez être adhérent ou créateur ${orgTypeFull(
                        org.orgType
                      )} pour ajouter un document`
                    });
                  else setIsAdd(!isAdd);
                } else {
                  setIsLogin(isLogin + 1);
                }
              }
            }}
          >
            Ajouter un fichier
          </Button>
        </Box>

        <Flex flexDir="column" mt={3}>
          <HostTag mb={1} />
          <Progress hasStripe value={diskUsage.pct} />
          {typeof diskUsage.current !== "undefined" &&
            typeof diskUsage.max !== "undefined" && (
              <Flex alignItems="center" fontSize="smaller" mt={1}>
                <Text>
                  {stringUtils.bytesForHuman(diskUsage.current)} sur{" "}
                  {stringUtils.bytesForHuman(diskUsage.max)}
                </Text>
              </Flex>
            )}
        </Flex>
      </Flex>

      {isAdd && (
        <Column m="0 0 20px 0">
          <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
            <FormControl isInvalid={!!errors["files"]} mb={3}>
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
        </Column>
      )}

      {query.isLoading || query.isFetching ? (
        <Text>Chargement des documents...</Text>
      ) : Array.isArray(query.data) ? (
        <Column overflowX="auto" m="" maxWidth={undefined} p={0}>
          <Table>
            <Tbody>
              {hasItems(query.data) ? (
                query.data.map((fileName) => {
                  const isImage = stringUtils.isImage(fileName);
                  const isPdf = fileName.includes(".pdf");
                  const url = `${process.env.NEXT_PUBLIC_API2}/${
                    isImage || isPdf ? "view" : "download"
                  }?${
                    org ? `orgId=${org._id}` : user ? `userId=${user._id}` : ""
                  }&fileName=${fileName}`;

                  return (
                    <Tr key={fileName}>
                      <Td p="16px 12px 16px 12px">
                        <a href={url} target="_blank">
                          <Box display="flex" alignItems="center">
                            <Icon as={isImage ? FaImage : FaFile} mr={3} />
                            {fileName}
                          </Box>
                        </a>
                      </Td>

                      <Td p="0 8px 0 0" textAlign="right" whiteSpace="nowrap">
                        <LinkShare
                          label="Copier l'adresse du lien"
                          url={url}
                          colorScheme="blue"
                          mr={2}
                          variant="outline"
                          tooltipProps={{ placement: "bottom" }}
                        />

                        <DeleteButton
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
                          isIconOnly
                          isSmall={false}
                          placement="bottom"
                          variant="outline"
                          onClick={async () => {
                            let payload: {
                              fileName: string;
                              orgId?: string;
                              userId?: string;
                            } = {
                              fileName
                            };

                            if (org) payload.orgId = org._id;
                            else if (user) payload.userId = user._id;

                            try {
                              await api.remove(
                                process.env.NEXT_PUBLIC_API2,
                                payload
                              );
                              toast({
                                title: `Le document ${fileName} a été supprimé !`,
                                status: "success"
                              });
                              query.refetch();
                            } catch (error) {
                              console.error(error);
                              toast({
                                title: `Le document ${fileName} n'a pas pu être supprimé.`,
                                status: "error"
                              });
                            }
                          }}
                        />
                      </Td>
                    </Tr>
                  );
                })
              ) : (
                <Alert status="warning">
                  <AlertIcon />
                  Aucun documents.
                </Alert>
              )}
            </Tbody>
          </Table>
        </Column>
      ) : (
        <Alert status="warning">
          <AlertIcon />
          Aucun documents.
        </Alert>
      )}
    </>
  );
};
