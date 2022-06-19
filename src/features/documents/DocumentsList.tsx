import {
  AddIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  DownloadIcon
} from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Image,
  Progress,
  Table,
  Tbody,
  Td,
  Text,
  Tooltip,
  Tr,
  UseDisclosureProps,
  useToast
} from "@chakra-ui/react";
import AbortController from "abort-controller";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { FaFile, FaImage } from "react-icons/fa";
import {
  Column,
  DeleteButton,
  Heading,
  HostTag,
  Link,
  LinkShare
} from "features/common";
import { useSession } from "hooks/useSession";
import { IOrg, orgTypeFull } from "models/Org";
import { IUser } from "models/User";
import { useGetDocumentsQuery } from "features/api/documentsApi";
import api from "utils/api";
import * as stringUtils from "utils/string";
import { useDiskUsage } from "hooks/useDiskUsage";
import { pxBreakpoints } from "features/layout/theme/theme";
import { FullscreenModal } from "features/modals/FullscreenModal";
import { getMeta } from "utils/image";
import { DocumentForm } from "features/forms/DocumentForm";
import { divideArray, hasItems } from "utils/array";

const controller = new AbortController();
const signal = controller.signal;

interface RemoteImage {
  url: string;
  height: number;
  width: number;
}

export const DocumentsList = ({
  org,
  user,
  isLogin,
  setIsLogin,
  isMobile,
  ...props
}: {
  org?: IOrg;
  user?: IUser;
  isCreator?: boolean;
  isFollowed?: boolean;
  isSubscribed?: boolean;
  isLogin: number;
  setIsLogin: (isLogin: number) => void;
  isMobile: boolean;
}) => {
  const { data: session, loading: isSessionLoading } = useSession();
  const router = useRouter();
  const toast = useToast({ position: "top" });
  const [diskUsage, refreshDiskUsage] = useDiskUsage();
  const [isAdd, setIsAdd] = useState(false);

  //#region images state
  const query = useGetDocumentsQuery(
    org ? { orgId: org._id } : user ? { userId: user._id } : {}
  );
  const [images, setImages] = useState<RemoteImage[]>([]);

  useEffect(() => {
    const xhr = async (data: string[]) => {
      let newImages: RemoteImage[] = [];

      for (const fileName of data) {
        if (stringUtils.isImage(fileName)) {
          const url = `${process.env.NEXT_PUBLIC_API2}/view?${
            org ? `orgId=${org._id}` : user ? `userId=${user._id}` : ""
          }&fileName=${fileName}`;
          const { height, width } = await getMeta(url);
          newImages.push({ url, height, width });
        }
      }

      setImages(newImages);
      setMasonry(divideArray<RemoteImage>(newImages, columnCount));
    };

    if (query.data) xhr(query.data);
  }, [query.data]);
  //#endregion

  //#region masonry state
  const [columnCount, setColumnCount] = useState(1);
  const [masonry, setMasonry] = useState<RemoteImage[][]>([]);
  useEffect(() => {
    if (hasItems(images))
      setMasonry(divideArray<RemoteImage>(images, columnCount));
  }, [columnCount]);
  //#endregion

  //#region modal state
  const [modalState, setModalState] = useState<
    UseDisclosureProps & { image?: RemoteImage }
  >({
    isOpen: false
  });
  const onClose = () =>
    setModalState({
      ...modalState,
      isOpen: false,
      image: undefined
    });
  const onOpen = async (image: RemoteImage) => {
    setModalState({ ...modalState, image, isOpen: true });
  };
  //#endregion

  //#region componentDidMount
  const [screenWidth, setScreenWidth] = useState<number>(0);
  useEffect(() => {
    if (hasItems(images) && screenWidth) {
      let col = 1;
      if (screenWidth >= pxBreakpoints.xl)
        col = images.length >= 4 ? 4 : images.length;
      else if (screenWidth >= pxBreakpoints.lg) col = 3;
      else if (screenWidth >= pxBreakpoints.md) col = 2;
      if (col != columnCount) setColumnCount(col);
    }
  }, [images, screenWidth]);
  useEffect(() => {
    if (!isMobile) {
      const updateScreenWidth = () => setScreenWidth(window.innerWidth - 15);
      updateScreenWidth();
      window.addEventListener("resize", updateScreenWidth);
      signal.addEventListener("abort", () => {
        window.removeEventListener("resize", updateScreenWidth);
      });
    }

    return () => {
      if (!isMobile) controller.abort();
    };
  }, []);
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
                      )} pour ajouter un fichier`
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
          <DocumentForm
            org={org}
            user={user}
            onSubmit={() => {
              refreshDiskUsage();
              query.refetch();
              setIsAdd(false);
            }}
          />
        </Column>
      )}

      {query.isLoading || query.isFetching ? (
        <Text>Chargement des documents...</Text>
      ) : Array.isArray(query.data) && query.data.length > 0 ? (
        <>
          <Column overflowX="auto" m="" maxWidth={undefined} mb={3} p={0}>
            <Heading px={3} pb={3}>
              Liste des fichiers
            </Heading>
            <Table>
              <Tbody>
                {query.data.map((fileName) => {
                  const isImage = stringUtils.isImage(fileName);
                  // const isPdf = fileName.includes(".pdf");
                  // const url = `${process.env.NEXT_PUBLIC_API2}/${
                  //   isImage || isPdf ? "view" : "download"
                  // }?${
                  //   org ? `orgId=${org._id}` : user ? `userId=${user._id}` : ""
                  // }&fileName=${fileName}`;

                  const url = `${process.env.NEXT_PUBLIC_API2}/view?${
                    org ? `orgId=${org._id}` : user ? `userId=${user._id}` : ""
                  }&fileName=${fileName}`;
                  const downloadUrl = `${
                    process.env.NEXT_PUBLIC_API2
                  }/download?${
                    org ? `orgId=${org._id}` : user ? `userId=${user._id}` : ""
                  }&fileName=${fileName}`;

                  return (
                    <Tr key={fileName}>
                      <Td p="16px 12px 16px 12px">
                        <Box display="flex" alignItems="center">
                          <Icon as={isImage ? FaImage : FaFile} mr={3} />
                          <Tooltip
                            hasArrow
                            label={`Ouvrir ${
                              isImage ? "l'image" : "le fichier"
                            }`}
                            placement="top"
                          >
                            <span>
                              <Link
                                // href={url}
                                // target="_blank"
                                variant="underline"
                                onClick={() => {
                                  if (isImage) {
                                    const image = images.find(
                                      (image) => image.url === url
                                    );
                                    if (image) onOpen(image);
                                  }
                                }}
                              >
                                {fileName}
                              </Link>
                            </span>
                          </Tooltip>
                        </Box>
                      </Td>

                      <Td p="0 8px 0 0" textAlign="right" whiteSpace="nowrap">
                        <Tooltip label="Télécharger le fichier">
                          <IconButton
                            aria-label="Télécharger le fichier"
                            colorScheme="green"
                            icon={<DownloadIcon />}
                            mr={2}
                            variant="outline"
                            onClick={() => {
                              router.push(downloadUrl);
                            }}
                          />
                        </Tooltip>

                        <LinkShare
                          colorScheme="blue"
                          label="Copier l'adresse du lien"
                          mr={2}
                          url={url}
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
                              refreshDiskUsage();
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
                })}
              </Tbody>
            </Table>
          </Column>

          {hasItems(masonry) && (
            <Column p={0}>
              <Heading px={3} pb={3}>
                Portfolio
              </Heading>

              <Flex justifyContent="center">
                {masonry.map((column, index) => {
                  return (
                    <Flex key={index} flexDirection="column" width="100%">
                      {column.map((image, imageIndex) => {
                        let marginAround = 2 * (4 * 12 + 24);
                        const marginBetween = (columnCount - 1) * 24;
                        let newMW = screenWidth - marginAround;

                        if (screenWidth > pxBreakpoints["2xl"]) {
                          marginAround = 2 * (5 * 12 + 20 + 84);
                          newMW =
                            (screenWidth - marginAround - marginBetween) /
                            columnCount;
                          console.log(
                            "1",
                            columnCount,
                            screenWidth,
                            newMW,
                            marginAround,
                            marginBetween
                          );
                        } else if (columnCount !== 1) {
                          console.log("2");
                          marginAround = 2 * (4 * 12 + 20);
                          newMW =
                            (screenWidth - marginAround - marginBetween) /
                            columnCount;
                        }

                        const width = image.width > newMW ? newMW : image.width;

                        return (
                          <Image
                            key={`image-${imageIndex}`}
                            src={image.url}
                            width={`${width}px`}
                            borderRadius="12px"
                            cursor="pointer"
                            mb={3}
                            mx={3}
                            onClick={() => {
                              onOpen(image);
                            }}
                          />
                        );
                      })}
                    </Flex>
                  );
                })}
              </Flex>
            </Column>
          )}
        </>
      ) : (
        <Alert status="info">
          <AlertIcon />
          Aucun documents.
        </Alert>
      )}

      {modalState.isOpen && modalState.image && (
        <FullscreenModal
          header={modalState.image.url.match(/[^=]+$/)![0]}
          bodyProps={{ bg: "black" }}
          onClose={onClose}
        >
          <Image
            alignSelf="center"
            src={modalState.image.url}
            width={`${modalState.image.width}px`}
          />
        </FullscreenModal>
      )}
    </>
  );
};
