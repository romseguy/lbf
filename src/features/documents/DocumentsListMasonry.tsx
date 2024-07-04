import {
  Alert,
  AlertIcon,
  Badge,
  Button,
  Flex,
  HStack,
  IconButton,
  Image,
  Spinner,
  Text,
  useColorMode,
  UseDisclosureProps
} from "@chakra-ui/react";
import AbortController from "abort-controller";
import React, { useEffect, useState } from "react";
import { FaImage } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RemoteImage, useGetDocumentsQuery } from "features/api/documentsApi";
import { Column, ColumnProps, AppHeading } from "features/common";
import { pxBreakpoints } from "features/layout/theme";
import { FullscreenModal } from "features/modals/FullscreenModal";
import { isOrg } from "models/Entity";
import { IOrg } from "models/Org";
import { IUser } from "models/User";
import {
  selectIsMobile,
  selectScreenHeight,
  selectScreenWidth
} from "store/uiSlice";
import { divideArray, hasItems } from "utils/array";
import * as stringUtils from "utils/string";
import { useRouter } from "next/router";
import { IEvent } from "models/Event";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

interface IndexedRemoteImage extends RemoteImage {
  index: number;
}

export const DocumentsListMasonry = ({
  entity,
  isCreator,
  ...props
}: ColumnProps & {
  entity: IEvent | IOrg | IUser;
  isCreator?: boolean;
}) => {
  const { colorMode } = useColorMode();
  const router = useRouter();
  const screenHeight = useSelector(selectScreenHeight);
  const screenWidth = useSelector(selectScreenWidth);
  const isO = isOrg(entity);
  const [images, setImages] = useState<IndexedRemoteImage[]>([]);
  const [imagesSize, setImagesSize] = useState(0);
  const { isLoading, isFetching, data, refetch } = useGetDocumentsQuery({
    [isO ? "orgId" : "userId"]: entity._id
  });
  useEffect(() => {
    if (data && hasItems(data)) {
      let count = 0;
      let i = 0;
      let arr: IndexedRemoteImage[] = []; // = data.filter<RemoteImage>((file): file is RemoteImage => "height" in file)

      for (const file of data) {
        if ("height" in file) {
          count += file.bytes;
          arr.push({
            ...file,
            index: i,
            url: `${process.env.NEXT_PUBLIC_FILES}/${
              entity._id
            }/${encodeURIComponent(file.url)}`
          });
          i++;
        }
      }

      setImages(
        arr.sort((a, b) =>
          !!a.time && !!b.time ? (a.time < b.time ? 1 : -1) : 0
        )
      );
      setImagesSize(count);
    }
  }, [data]);
  useEffect(() => {
    refetch();
  }, [entity]);

  //#region column count relative to screen width
  const [columnCount, setColumnCount] = useState<number>(1);
  useEffect(() => {
    const getColumnCount = () => {
      let col = 1;
      if (hasItems(images) && screenWidth) {
        if (screenWidth >= pxBreakpoints.xl)
          col = images.length >= 4 ? 4 : images.length;
        else if (screenWidth >= pxBreakpoints.lg) col = 3;
        else if (screenWidth >= pxBreakpoints.md) col = 2;
        else col = 1;
      }
      return col;
    };
    const col = getColumnCount();
    if (col !== columnCount) setColumnCount(col);
  }, [router.asPath, images, screenWidth]);
  //#endregion

  //#region masonry state
  const [currentIndex, setCurrentIndex] = useState(0);
  const pageImageCount = 10;
  const pagesCount =
    images.length > pageImageCount ? images.length % pageImageCount : 1;
  //const pageLength = images.length / pagesCount;
  const pages = divideArray(images, pagesCount);
  const masonry = divideArray<IndexedRemoteImage>(
    pages.reduce(
      (arr, page, index) => (index <= currentIndex ? arr.concat(page) : arr),
      []
    ),
    columnCount
  );
  //#endregion

  //#region modal state
  const [modalState, setModalState] = useState<
    UseDisclosureProps & { image?: IndexedRemoteImage }
  >({
    isOpen: false
  });
  const onClose = () =>
    setModalState({
      ...modalState,
      isOpen: false,
      image: undefined
    });
  const onOpen = async (image: IndexedRemoteImage) => {
    setModalState({ ...modalState, isOpen: true, image });
  };
  //#endregion

  return (
    <Column {...props}>
      <Flex alignItems="center" p={3}>
        <AppHeading noContainer smaller>
          {images.length} images
        </AppHeading>
        <Badge variant="subtle" colorScheme="green" ml={1}>
          {stringUtils.bytesForHuman(imagesSize)}
        </Badge>
      </Flex>

      {isLoading || isFetching ? (
        <Spinner m={3} />
      ) : !hasItems(images) ? (
        <Alert status="info">
          <AlertIcon />
          Aucune images.
        </Alert>
      ) : (
        !!columnCount && (
          <>
            <Flex justifyContent="center">
              {masonry.map((column, index) => {
                return (
                  <Flex key={index} flexDirection="column" width="100%">
                    {column.map((image, imageIndex) => {
                      let marginAround = 2 * (4 * 12 + 24);
                      marginAround = 0;
                      //const marginBetween = (columnCount - 1) * 24;
                      const marginBetween = 0;
                      let newMW = screenWidth - marginAround;

                      if (screenWidth > pxBreakpoints["2xl"]) {
                        marginAround = 2 * (5 * 12 + 20 + 84);
                        marginAround = 0;
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
                        marginAround = 0;
                        newMW =
                          (screenWidth - marginAround - marginBetween) /
                          columnCount;
                      }

                      const width = image.width > newMW ? newMW : image.width;

                      return (
                        <Image
                          key={`image-${imageIndex}`}
                          //ref={imageRefs[image.url]}
                          src={image.url}
                          width={`${width}px`}
                          borderRadius="12px"
                          cursor="pointer"
                          mb={3}
                          onClick={() => {
                            onOpen(image);
                          }}
                          // onLoad={() => {
                          //   if (!isLoaded[image.url])
                          //     setIsLoaded({ [image.url]: true });
                          // }}
                        />
                      );
                    })}
                  </Flex>
                );
              })}
            </Flex>

            {Array.isArray(pages[currentIndex + 1]) && (
              <Button
                onClick={() => {
                  setCurrentIndex(currentIndex + 1);
                }}
              >
                Charger les images suivantes{" "}
                <Badge colorScheme="teal">
                  {stringUtils.bytesForHuman(
                    pages[currentIndex + 1].reduce((sum, cur) => {
                      return sum + cur.bytes;
                    }, 0)
                  )}
                </Badge>
              </Button>
            )}
          </>
        )
      )}

      {modalState.isOpen && modalState.image && (
        <FullscreenModal
          //header={images[modalState.index].url.match(/[^=]+$/)![0]}
          header={
            <HStack>
              <IconButton
                aria-label="Précédent"
                colorScheme="teal"
                icon={<ChevronLeftIcon boxSize={10} />}
                isDisabled={modalState.image.index - 1 < 0}
                onClick={() => {
                  //@ts-ignore
                  const index = modalState.image.index - 1;
                  setModalState({
                    ...modalState,
                    image: images[index < 0 ? 0 : index]
                  });
                }}
              />
              <IconButton
                aria-label="Suivant"
                colorScheme="teal"
                icon={<ChevronRightIcon boxSize={10} />}
                isDisabled={modalState.image.index + 1 >= images.length}
                onClick={() => {
                  //@ts-ignore
                  const index = modalState.image.index + 1;
                  setModalState({
                    ...modalState,
                    image: images[index > images.length ? images.length : index]
                  });
                }}
              />
              <FaImage />
              <Text>
                {images[modalState.image.index].url.substring(
                  images[modalState.image.index].url.lastIndexOf("/") + 1
                )}
              </Text>
            </HStack>
          }
          bodyProps={{ bg: "black" }}
          onClose={onClose}
        >
          <Image
            alignSelf="center"
            src={images[modalState.image.index].url}
            maxHeight={screenHeight - 72 + "px"}
            //width={`${images[modalState.index].width}px`}
          />
        </FullscreenModal>
      )}
    </Column>
  );
};

{
  /*
  #region images loading state
  const imageRefs = useMemo(() => {
    return images.reduce((acc: Record<string, React.RefObject<any>>, value) => {
      acc[value.url] = React.createRef();
      return acc;
    }, {});
  }, [images]);

  const [isLoaded, setIsLoaded] = useState<{ [url: string]: boolean }>({});

  useEffect(() => {
    const newIsLoaded = { ...isLoaded };
    let touched = false;

    Object.keys(imageRefs).map((url) => {
      const imageRef = imageRefs[url];
      const imageEl = imageRef.current;
      if (imageEl && imageEl.complete && !isLoaded[url]) {
        touched = true;
        newIsLoaded[url] = true;
      }
    });

    if (touched) {
      setIsLoaded(newIsLoaded);
    }
  }, [imageRefs]);
  #endregion
*/
}
