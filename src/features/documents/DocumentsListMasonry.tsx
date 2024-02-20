import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Image,
  Spinner,
  Text,
  useColorMode,
  UseDisclosureProps
} from "@chakra-ui/react";
import AbortController from "abort-controller";
import React, { useEffect, useMemo, useState } from "react";
import { FaImage, FaFile } from "react-icons/fa";
import { useSelector } from "react-redux";
import { RemoteImage, useGetDocumentsQuery } from "features/api/documentsApi";
import { Column, ColumnProps, AppHeading } from "features/common";
import { pxBreakpoints } from "features/layout/theme";
import { FullscreenModal } from "features/modals/FullscreenModal";
import { isOrg } from "models/Entity";
import { IOrg } from "models/Org";
import { IUser } from "models/User";
import { selectIsMobile } from "store/uiSlice";
import { divideArray, hasItems } from "utils/array";
import * as stringUtils from "utils/string";

const controller = new AbortController();
const signal = controller.signal;

export const DocumentsListMasonry = ({
  entity,
  ...props
}: ColumnProps & {
  entity: IOrg | IUser;
  isCreator?: boolean;
  isFollowed?: boolean;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const isMobile = useSelector(selectIsMobile);

  const isO = isOrg(entity);
  const { isLoading, isFetching, images, imagesSize, refetch } =
    useGetDocumentsQuery(
      {
        [isO ? "orgId" : "userId"]: entity._id
      },
      {
        selectFromResult: ({ data = [], ...rest }) => {
          // const images = data.filter<RemoteImage>((file): file is RemoteImage => "height" in file)
          let images = [];
          let count = 0;
          for (const file of data) {
            if ("height" in file) {
              count += file.bytes;
              images.push({
                ...file,
                url: `${process.env.NEXT_PUBLIC_FILES}/${
                  entity._id
                }/${encodeURIComponent(file.url)}`
              });
            }
          }
          return {
            ...rest,
            images,
            imagesSize: count
          };
        }
      }
    );
  const [currentIndex, setCurrentIndex] = useState(0);
  const length = (images.length - 1) % 10;
  const pages = divideArray(images, length);
  useEffect(() => {
    refetch();
  }, [entity]);

  //#region masonry state
  const [columnCount, setColumnCount] = useState(1);
  const masonry = useMemo(() => {
    //if (!canLoad) return [];
    if (!pages.length) return [];

    const arry = pages.reduce((acc, cur, index) => {
      if (index < currentIndex) return acc.concat(cur);

      return acc;
    }, []);

    return divideArray<RemoteImage>(arry, columnCount);
  }, [images, columnCount]);
  const [screenWidth, setScreenWidth] = useState<number>(0);
  useEffect(() => {
    if (!isMobile && hasItems(images)) {
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
  }, [images]);
  useEffect(() => {
    if (images && screenWidth) {
      let col = 1;
      if (screenWidth >= pxBreakpoints.xl)
        col = images.length >= 4 ? 4 : images.length;
      else if (screenWidth >= pxBreakpoints.lg) col = 3;
      else if (screenWidth >= pxBreakpoints.md) col = 2;
      if (col != columnCount) setColumnCount(col);
    }
  }, [screenWidth]);
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
    <Column {...props}>
      <Flex alignItems="center" p={3}>
        <AppHeading noContainer smaller>
          Visionneuse d'images
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
        <>
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
                        //ref={imageRefs[image.url]}
                        src={image.url}
                        width={`${width}px`}
                        borderRadius="12px"
                        cursor="pointer"
                        mb={3}
                        mx={3}
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

          {currentIndex < pages.length && (
            <Button
              onClick={() => {
                setCurrentIndex(currentIndex + 1);
              }}
            >
              Charger les 12 images suivantes{" "}
              <Badge colorScheme="teal">
                {stringUtils.bytesForHuman(
                  pages[currentIndex].reduce((sum, cur) => {
                    return sum + cur.bytes;
                  }, 0)
                )}
              </Badge>
            </Button>
          )}
        </>
      )}

      {modalState.isOpen && modalState.image && (
        <FullscreenModal
          //header={modalState.image.url.match(/[^=]+$/)![0]}
          header={
            <HStack>
              <FaImage />
              <Text>
                {modalState.image.url.substring(
                  modalState.image.url.lastIndexOf("/") + 1
                )}
              </Text>
            </HStack>
          }
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
