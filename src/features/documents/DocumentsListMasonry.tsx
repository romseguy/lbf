import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Image,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Spinner,
  Text,
  useColorMode,
  UseDisclosureProps
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaImage } from "react-icons/fa";
import { useSelector } from "react-redux";
import { IndexedRemoteImage } from "features/api/documentsApi";
import { Column, ColumnProps, AppHeading } from "features/common";
import { pxBreakpoints } from "features/layout/theme";
import { FullscreenModal } from "features/modals/FullscreenModal";
import { selectScreenHeight, selectScreenWidth } from "store/uiSlice";
import { divideArray, hasItems } from "utils/array";
import * as stringUtils from "utils/string";
import { useRouter } from "next/router";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

export const DocumentsListMasonry = ({
  isCreator,
  images,
  imagesSize,
  isLoading,
  isFetching,
  ...props
}: ColumnProps & {
  isCreator?: boolean;
  images: IndexedRemoteImage[];
  imagesSize: number;
  isLoading: boolean;
  isFetching: boolean;
}) => {
  const router = useRouter();
  const screenHeight = useSelector(selectScreenHeight);
  const screenWidth = useSelector(selectScreenWidth);

  //#region column count relative to screen width
  const [columnCount, setColumnCount] = useState<number>(1);
  const [marginBetween, setMarginBetween] = useState<number>(0);

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
  const masonry = divideArray(
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

  const handleChange = (valueString: number | string) => {
    setMarginBetween(
      typeof valueString === "string" ? Number(valueString) : valueString
    );
  };

  return (
    <Column {...props}>
      <Flex alignItems="center" p={3} justifyContent="space-between">
        <HStack>
          <AppHeading noContainer smaller>
            {images.length} images
          </AppHeading>
          <Badge variant="subtle" colorScheme="green" ml={1}>
            {stringUtils.bytesForHuman(imagesSize)}
          </Badge>
        </HStack>
        {/* <Flex> */}
        {/* <Text>Marges</Text> */}
        {/* </Flex> */}
      </Flex>
      <Flex alignItems="center" mb={3}>
        <Text ml={5}>Marges</Text>
        <Slider
          flex="1"
          focusThumbOnChange={false}
          value={marginBetween}
          onChange={handleChange}
          mx={10}
        >
          <SliderTrack>
            <SliderFilledTrack />
          </SliderTrack>
          <SliderThumb fontSize="sm" boxSize="32px" children={marginBetween} />
        </Slider>
        <NumberInput
          maxW="100px"
          mr="2rem"
          //allowMouseWheel
          value={marginBetween}
          //min={0}
          //max={200}
          onChange={handleChange}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper
            // bg="green.200"
            // _active={{ bg: "green.300" }}
            // children="+"
            />
            <NumberDecrementStepper
            // bg="pink.200"
            // _active={{ bg: "pink.300" }}
            // children="-"
            />
          </NumberInputStepper>
        </NumberInput>
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
                console.log("🚀 ~ {masonry.map ~ column index:", index);
                return (
                  <Flex key={index} flexDirection="column" width="100%">
                    {column.map((image, imageIndex) => {
                      console.log("🚀 ~ {column.map ~ row index:", imageIndex);
                      let marginAround = 2 * (4 * 12 + 24);
                      marginAround = 0;
                      //const marginBetween = (columnCount - 1) * 24;
                      let newMW = screenWidth - marginAround;

                      if (screenWidth > pxBreakpoints["2xl"]) {
                        marginAround = 2 * (5 * 12 + 20 + 84);
                        marginAround = 0;
                        // newMW =
                        //   (screenWidth - marginAround - marginBetween) /
                        //   columnCount;
                        newMW = (screenWidth - marginAround) / columnCount;
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
                        // newMW =
                        //   (screenWidth - marginAround - marginBetween) /
                        //   columnCount;
                        newMW = (screenWidth - marginAround) / columnCount;
                      }

                      let width = image.width > newMW ? newMW : image.width;

                      console.log(
                        "modulo",
                        index,
                        //imageIndex,
                        columnCount,
                        index / (columnCount - 1)
                      );

                      return (
                        <Image
                          key={`image-${imageIndex}`}
                          //ref={imageRefs[image.url]}
                          src={image.url}
                          width={`${width}px`}
                          borderRadius="12px"
                          cursor="pointer"
                          //mb={3}
                          pb={
                            imageIndex !== images.length / columnCount - 1
                              ? marginBetween + "px"
                              : 0
                          }
                          pr={
                            index / (columnCount - 1) !== 1
                              ? marginBetween + "px"
                              : 0
                          }
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
