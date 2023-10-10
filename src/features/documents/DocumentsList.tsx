import { DownloadIcon } from "@chakra-ui/icons";
import {
  Grid,
  GridItem,
  Icon,
  IconButton,
  Image,
  Link,
  Text,
  Tooltip,
  useColorMode,
  UseDisclosureProps,
  useToast
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FaImage, FaFile } from "react-icons/fa";
import { useSelector } from "react-redux";
import { css } from "twin.macro";
import { RemoteImage, useGetDocumentsQuery } from "features/api/documentsApi";
import { Column, DeleteButton, LinkShare } from "features/common";
import { FullscreenModal } from "features/modals/FullscreenModal";
import { isOrg } from "models/Entity";
import { IOrg } from "models/Org";
import { IUser } from "models/User";
import { selectIsMobile } from "store/uiSlice";
import api from "utils/api";
import * as stringUtils from "utils/string";

export const DocumentsList = ({
  entity,
  ...props
}: {
  entity: IOrg | IUser;
  isCreator?: boolean;
  isFollowed?: boolean;
  onDelete?: () => void;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const isMobile = useSelector(selectIsMobile);
  const router = useRouter();
  const toast = useToast({ position: "top" });

  const isO = isOrg(entity);
  const query = useGetDocumentsQuery({
    [isO ? "orgId" : "userId"]: entity._id
  });

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
      {Array.isArray(query.data) && query.data.length > 0 && (
        <Column
          bg={isDark ? "gray.700" : "lightblue"}
          // css={css`
          //   overflow-x: auto;
          //   ${scrollbarCss}
          // `}
          {...(isMobile ? { px: 1, borderRadius: 0 } : {})}
        >
          <Grid
            gridTemplateColumns="auto 1fr auto"
            alignItems="center"
            gridRowGap={3}
          >
            {query.data.map((file) => {
              const url = `${process.env.NEXT_PUBLIC_FILES}/${entity._id}/${file.url}`;
              const isImage = stringUtils.isImage(file.url);
              // const isPdf = fileName.includes(".pdf");
              // const url = `${process.env.NEXT_PUBLIC_API2}/${
              //   isImage || isPdf ? "view" : "download"
              // }?${
              //   org ? `orgId=${org._id}` : user ? `userId=${user._id}` : ""
              // }&fileName=${fileName}`;

              const downloadUrl = `${
                process.env.NEXT_PUBLIC_API
              }/documents/download?${`${isO ? "orgId" : "userId"}=${
                entity._id
              }`}&fileName=${file.url}`;

              return (
                <React.Fragment key={file.url}>
                  <GridItem pr={1} pt={1}>
                    <Icon as={isImage ? FaImage : FaFile} />
                  </GridItem>
                  <GridItem
                    // display="flex"
                    // alignItems="center"
                    // p={isMobile ? "0" : "16px 12px 16px 12px"}
                    css={css`
                      overflow: hidden;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                      /*
                        display: -webkit-box;
                        -webkit-line-clamp: 1;
                        -webkit-box-orient: vertical;
                      */
                    `}
                  >
                    <Tooltip
                      hasArrow
                      label={
                        isImage ? "Ouvrir l'image" : "Télécharger le fichier"
                      }
                      placement="top"
                    >
                      <span>
                        <Link
                          // href={url}
                          // target="_blank"
                          variant="underline"
                          onClick={() => {
                            if (isImage) {
                              onOpen(file as RemoteImage);
                            } else {
                              window.location.href = downloadUrl;
                            }
                          }}
                        >
                          {file.url}
                        </Link>
                      </span>
                    </Tooltip>
                  </GridItem>

                  <GridItem
                  //whiteSpace="nowrap"
                  // {...(isMobile ? {} : { pb: 3 })}
                  >
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
                          <Text display="inline" color="red" fontWeight="bold">
                            {file.url}
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
                          [isO ? "orgId" : "userId"]: entity._id,
                          fileName: file.url
                        };

                        try {
                          await api.remove(
                            process.env.NEXT_PUBLIC_API2,
                            payload
                          );
                          toast({
                            title: `Le document ${file.url} a été supprimé !`,
                            status: "success"
                          });
                          props.onDelete && props.onDelete();
                          query.refetch();
                        } catch (error) {
                          console.error(error);
                          toast({
                            title: `Le document ${file.url} n'a pas pu être supprimé.`,
                            status: "error"
                          });
                        }
                      }}
                    />
                  </GridItem>
                </React.Fragment>
              );
            })}
          </Grid>
        </Column>
      )}

      {modalState.isOpen && modalState.image && (
        <FullscreenModal
          //header={modalState.image.url.match(/[^=]+$/)![0]}
          header={modalState.image.url}
          bodyProps={{ bg: "black" }}
          onClose={onClose}
        >
          <Image
            alignSelf="center"
            src={`${process.env.NEXT_PUBLIC_FILES}/${entity._id}/${modalState.image.url}`}
            width={`${modalState.image.width}px`}
          />
        </FullscreenModal>
      )}
    </>
  );
};
