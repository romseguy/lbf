import {
  Alert,
  AlertIcon,
  Box,
  Flex,
  Grid,
  GridItem,
  Icon,
  Link,
  Spinner,
  Tooltip,
  useColorMode
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaVideo } from "react-icons/fa";
import { useSelector } from "react-redux";
import { css } from "twin.macro";
import { RemoteFile, useGetDocumentsQuery } from "features/api/documentsApi";
import { Column, ColumnProps, AppHeading } from "features/common";
import { isOrg } from "models/Entity";
import { IOrg } from "models/Org";
import { IUser } from "models/User";
import { selectIsMobile } from "store/uiSlice";
import { isVideo } from "utils/string";
import { hasItems } from "utils/array";

interface Video extends RemoteFile {
  fileName: string;
}

export const DocumentsListPlayer = ({
  entity,
  ...props
}: ColumnProps & { entity: IOrg | IUser }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const isMobile = useSelector(selectIsMobile);
  const isO = isOrg(entity);
  const [currentVideo, setCurrentVideo] = useState<Video>();
  const query = useGetDocumentsQuery(
    {
      [isO ? "orgId" : "userId"]: entity._id
    },
    {
      selectFromResult: ({ data = [], ...rest }) => {
        let array: Video[] = [];
        for (const file of data) {
          if (isVideo(file.url)) {
            array.push({
              ...file,
              fileName: file.url,
              url: `${process.env.NEXT_PUBLIC_FILES}/${
                entity._id
              }/${encodeURIComponent(file.url)}`
            });
          }
        }

        return { ...rest, videos: array };
      }
    }
  );
  useEffect(() => {
    query.refetch();
  }, [entity]);
  useEffect(() => {
    if (!currentVideo) setCurrentVideo(query.videos[0]);
  }, [query.videos]);

  return (
    <Column {...props}>
      <Flex alignItems="center" p={3}>
        <AppHeading noContainer smaller>
          Visionneuse de vidéos
        </AppHeading>
      </Flex>

      {query.isLoading || query.isFetching ? (
        <Spinner m={3} mt={0} />
      ) : !hasItems(query.videos) ? (
        <Alert status="info">
          <AlertIcon />
          Aucune vidéos.
        </Alert>
      ) : currentVideo ? (
        <Box m={3} mt={0}>
          <Column bg={isDark ? "gray.700" : "lightblue"} mb={3}>
            <Grid
              gridTemplateColumns="auto 1fr"
              alignItems="center"
              gridRowGap={3}
            >
              {query.videos.map((video) => {
                return (
                  <React.Fragment key={video.url}>
                    <GridItem pr={1} pt={1}>
                      <Icon as={FaVideo} />
                    </GridItem>

                    <GridItem
                      css={css`
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                      `}
                    >
                      {currentVideo.fileName === video.fileName ? (
                        video.fileName
                      ) : (
                        <Tooltip hasArrow label="Lire la vidéo" placement="top">
                          <span>
                            <Link
                              // href={url}
                              // target="_blank"
                              variant="underline"
                              onClick={() => {
                                setCurrentVideo(video);
                              }}
                            >
                              {video.fileName}
                            </Link>
                          </span>
                        </Tooltip>
                      )}
                    </GridItem>

                    {/* <GridItem
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
                  </GridItem> */}
                  </React.Fragment>
                );
              })}
            </Grid>
          </Column>

          <video controls src={currentVideo.url}>
            La vidéo n'a pas pu être chargée.
          </video>
        </Box>
      ) : null}
    </Column>
  );
};
