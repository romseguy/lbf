import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Flex,
  Icon,
  IconButton,
  Image,
  Link,
  Progress,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Tooltip,
  Tr,
  useColorMode,
  UseDisclosureProps,
  useToast
} from "@chakra-ui/react";
import AbortController from "abort-controller";
import React, { useEffect, useState } from "react";
import {
  Column,
  AppHeading,
  DeleteButton,
  HostTag,
  LinkShare,
  ColumnProps
} from "features/common";
import { IOrg } from "models/Org";
import { IUser } from "models/User";
import { useGetDocumentsQuery } from "features/api/documentsApi";
import api from "utils/api";
import * as stringUtils from "utils/string";
import { pxBreakpoints } from "features/layout/theme";
import { FullscreenModal } from "features/modals/FullscreenModal";
import { divideArray, hasItems } from "utils/array";
import { selectIsMobile } from "store/uiSlice";
import { useSelector } from "react-redux";
import {
  AddIcon,
  ChevronUpIcon,
  ChevronRightIcon,
  DownloadIcon
} from "@chakra-ui/icons";
import { DocumentForm } from "features/forms/DocumentForm";
import { useDiskUsage } from "hooks/useDiskUsage";
import { useSession } from "hooks/useSession";
import { useRouter } from "next/router";
import { FaImage, FaFile } from "react-icons/fa";

const controller = new AbortController();
const signal = controller.signal;

interface RemoteImage {
  url: string;
  height: number;
  width: number;
}

async function getImages({
  data,
  org,
  user
}: {
  data: string[];
  org?: IOrg;
  user?: IUser;
}) {
  let newImages: RemoteImage[] = [];

  for (const fileName of data) {
    if (stringUtils.isImage(fileName)) {
      const url = `${process.env.NEXT_PUBLIC_API}/documents/view?${
        org ? `orgId=${org._id}` : user ? `userId=${user._id}` : ""
      }&fileName=${fileName}`;

      const {
        data: { height, width }
      } = await api.get(
        `documents/dimensions?${
          org ? `orgId=${org._id}` : user ? `userId=${user._id}` : ""
        }&fileName=${fileName}`
      );
      newImages.push({ url, height, width });
    }
  }

  return newImages;
}

export const DocumentsList = ({
  org,
  user,
  ...props
}: {
  org?: IOrg;
  user?: IUser;
  isCreator?: boolean;
  isFollowed?: boolean;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const router = useRouter();
  const { data: session } = useSession();
  const toast = useToast({ position: "top" });

  //#region local state
  const columnProps: ColumnProps = {
    bg: isDark ? "gray.700" : "lightblue",
    mb: 3,
    mt: 0,
    pt: 0
  };
  const [diskUsage, refreshDiskUsage] = useDiskUsage();
  const [images, setImages] = useState<RemoteImage[]>([]);
  const [isAdd, setIsAdd] = useState(false);
  const query = useGetDocumentsQuery(
    org ? { orgId: org._id } : user ? { userId: user._id } : {}
  );
  useEffect(() => {
    (async () => {
      if (Array.isArray(query.data) && query.data.length > 0) {
        const newImages = await getImages({
          data: query.data,
          org,
          user
        });
        setImages(newImages);
      }
    })();
  }, [query.data]);
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

  return (
    <>
      <Flex flexWrap="wrap" mb={3} mt={-3}>
        <Box flexGrow={1} mt={3}>
          <Button
            colorScheme="teal"
            leftIcon={<AddIcon />}
            rightIcon={isAdd ? <ChevronUpIcon /> : <ChevronRightIcon />}
            onClick={() => {
              if (!session) {
                router.push("/login", "/login", { shallow: true });
                return;
              }

              // if (org && !props.isCreator) {
              //   toast({
              //     status: "error",
              //     title: `Vous n'avez pas la permission ${orgTypeFull(
              //       org.orgType
              //     )} pour ajouter un fichier`
              //   });
              //   return;
              // }

              setIsAdd(!isAdd);
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
        <Column m={3} mt={0}>
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

      {Array.isArray(query.data) && query.data.length > 0 && (
        <Column {...columnProps}>
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

                const url = `${process.env.NEXT_PUBLIC_API}/documents/view?${
                  org ? `orgId=${org._id}` : user ? `userId=${user._id}` : ""
                }&fileName=${fileName}`;
                const downloadUrl = `${
                  process.env.NEXT_PUBLIC_API
                }/documents/download?${
                  org ? `orgId=${org._id}` : user ? `userId=${user._id}` : ""
                }&fileName=${fileName}`;

                return (
                  <Tr key={fileName}>
                    <Td p="16px 12px 16px 12px">
                      <Box display="flex" alignItems="center">
                        <Icon as={isImage ? FaImage : FaFile} mr={3} />
                        <Tooltip
                          hasArrow
                          label={`Ouvrir ${isImage ? "l'image" : "le fichier"}`}
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
                                } else {
                                  window.location.href = downloadUrl;
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
                        label="Copier le lien du fichier"
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

export const DocumentsListMasonry = ({
  org,
  user,
  ...props
}: {
  org?: IOrg;
  user?: IUser;
  isCreator?: boolean;
  isFollowed?: boolean;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const isMobile = useSelector(selectIsMobile);
  const [isMasonryLoading, setIsMasonryLoading] = useState(true);

  //#region images state
  const query = useGetDocumentsQuery(
    org ? { orgId: org._id } : user ? { userId: user._id } : {}
  );
  // console.log("🚀 ~ file: DocumentsList.tsx:335 ~ query:", query);
  const [images, setImages] = useState<RemoteImage[]>([]);
  // console.log("🚀 ~ file: DocumentsList.tsx:384 ~ images:", images);
  useEffect(() => {
    (async () => {
      if (Array.isArray(query.data) && query.data.length > 0) {
        setIsMasonryLoading(true);
        const newImages = await getImages({ data: query.data, org, user });
        setImages(newImages);
        setMasonry(divideArray<RemoteImage>(newImages, columnCount));
        setIsMasonryLoading(false);

        // if (
        //   !masonry.length &&
        //   query.data.find((fileName) => stringUtils.isImage(fileName))
        // )
        //   setIsMasonryLoading(true);
      }
    })();
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
      {query.isLoading || query.isFetching ? (
        <Spinner />
      ) : images.length > 0 ? (
        <>
          {isMasonryLoading && (
            <Column p={0}>
              <AppHeading px={3} pb={3}>
                Visionneuse d'images
              </AppHeading>

              <Flex justifyContent="center" mb={3}>
                <Spinner />
              </Flex>
            </Column>
          )}

          {!isMasonryLoading && hasItems(masonry) && (
            <Column p={0}>
              <AppHeading px={3} pb={3}>
                Visionneuse d'images
              </AppHeading>

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
                          // console.log(
                          //   "1",
                          //   columnCount,
                          //   screenWidth,
                          //   newMW,
                          //   marginAround,
                          //   marginBetween
                          // );
                        } else if (columnCount !== 1) {
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
          Aucune images.
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
