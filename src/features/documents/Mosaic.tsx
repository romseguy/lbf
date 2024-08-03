import { Badge, Box, BoxProps, Button, Flex, Image } from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RemoteImage } from "features/api/documentsApi";
import { pxBreakpoints } from "features/layout/theme";
import { selectScreenHeight, selectScreenWidth } from "store/uiSlice";
import { divideArray, hasItems } from "utils/array";
import * as stringUtils from "utils/string";
import { useRouter } from "next/router";

export type MosaicImage = RemoteImage & {
  index: number;
  id: string;
  name: string;
};

export const Mosaic = ({
  images,
  marginBetween,
  onImageClick,
  ...props
}: BoxProps & {
  images: MosaicImage[];
  marginBetween: number;
  onImageClick: (image: MosaicImage) => void;
}) => {
  const router = useRouter();
  const screenHeight = useSelector(selectScreenHeight);
  const screenWidth = useSelector(selectScreenWidth);

  const [columnCount, setColumnCount] = useState<number>(1);
  const [currentIndex, setCurrentIndex] = useState(0);

  const pageImageCount = 10;
  //const pageLength = images.length / pagesCount;
  const pagesCount =
    images.length > pageImageCount ? images.length % pageImageCount : 1;
  const pages = divideArray(images, pagesCount);
  const mosaic = divideArray(
    pages.reduce(
      (arr, page, index) => (index <= currentIndex ? arr.concat(page) : arr),
      []
    ),
    columnCount
  );
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

  return (
    <Box {...props}>
      <Flex>
        {mosaic.map((column, columnIndex) => {
          return (
            <Flex key={`column-${columnIndex}`} flexDir="column">
              {column.map((image, rowIndex) => {
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

                // if (columnIndex / (columnCount - 1) !== 1) {
                //   width -= marginBetween * 12;
                // }

                // console.log(
                //   "modulo",
                //   columnIndex,
                //   //imageIndex,
                //   columnCount,
                //   columnIndex / (columnCount - 1)
                // );

                return (
                  <Box
                    key={`row-${rowIndex}`}
                    pb={
                      rowIndex !== images.length / columnCount - 1
                        ? marginBetween + "px"
                        : 0
                    }
                    pr={
                      //columnIndex / (columnCount - 1) !== 1
                      columnIndex < columnCount - 1 ? marginBetween + "px" : 0
                    }
                    pl={
                      //columnIndex / (columnCount - 1) === 1
                      //columnIndex == columnCount ? marginBetween + "px" : 0
                      0
                    }
                  >
                    <Image
                      //ref={imageRefs[image.url]}
                      src={image.url}
                      width={`${width}px`}
                      borderRadius="12px"
                      cursor="pointer"
                      //mb={3}
                      // pb={
                      //   rowIndex !== images.length / columnCount - 1
                      //     ? marginBetween + "px"
                      //     : 0
                      // }
                      // pr={
                      //   columnIndex / (columnCount - 1) !== 1
                      //     ? marginBetween + "px"
                      //     : 0
                      // }
                      onClick={() => {
                        onImageClick(image);
                      }}
                      // onLoad={() => {
                      //   if (!isLoaded[image.url])
                      //     setIsLoaded({ [image.url]: true });
                      // }}
                    />
                  </Box>
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
    </Box>
  );
};
