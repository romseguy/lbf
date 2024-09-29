import {
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon
} from "@chakra-ui/icons";
import {
  Box,
  Button,
  HStack,
  IconButton,
  Image,
  Text,
  Tooltip,
  useColorMode,
  UseDisclosureProps
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { FaImage } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useDeleteDocumentMutation } from "features/api/documentsApi";
import {
  AddTopicPayload,
  useAddTopicMutation,
  useEditTopicMutation
} from "features/api/topicsApi";
import { DeleteButton, LinkShare } from "features/common";
import { FullscreenModal } from "features/modals/FullscreenModal";
import { useToast } from "hooks/useToast";
import { getRefId, IEntity, isEvent } from "models/Entity";
import { ITopic } from "models/Topic";
import { selectScreenHeight } from "store/uiSlice";
import { downloadImage } from "utils/image";
import { MosaicImage } from "./Mosaic";
import { getErrorMessageString } from "utils/query";

export const DocumentsListModal = ({
  entity,
  images,
  isGalleryCreator = false,
  modalState,
  setModalState,
  onOpen,
  onClose,
  ...props
}: {
  entity: IEntity;
  images: MosaicImage[];
  isGalleryCreator?: boolean;
  modalState: UseDisclosureProps & {
    image: MosaicImage;
  };
  setModalState: React.Dispatch<
    React.SetStateAction<
      UseDisclosureProps & {
        image: MosaicImage | undefined;
      }
    >
  >;
  onOpen: (image: MosaicImage) => Promise<void>;
  onClose: () => void;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const router = useRouter();
  const toast = useToast({ position: "top" });
  const [addTopic] = useAddTopicMutation();
  const [deleteDocument] = useDeleteDocumentMutation();
  const [editTopic] = useEditTopicMutation();
  const screenHeight = useSelector(selectScreenHeight);

  const isE = isEvent(entity);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <FullscreenModal
      //header={images[modalState.index].url.match(/[^=]+$/)![0]}
      header={
        <HStack>
          <Tooltip label="Image précédente">
            <IconButton
              aria-label="Image précédente"
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
          </Tooltip>
          <Tooltip label="Image suivante">
            <IconButton
              aria-label="Image suivante"
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
          </Tooltip>

          <FaImage />
          <Text>
            {/* {images[modalState.image.index].url.substring(
                  images[modalState.image.index].url.lastIndexOf("/") + 1
                )} */}
            {modalState.image.name}
          </Text>

          <Tooltip label="Télécharger l'image">
            <IconButton
              aria-label="Télécharger"
              colorScheme="teal"
              icon={<DownloadIcon />}
              onClick={() => {
                downloadImage(
                  `${process.env.NEXT_PUBLIC_API}/documents/download?id=${modalState.image.id}&fileName=${modalState.image.name}`,
                  modalState.image.name || ""
                );
              }}
            />
          </Tooltip>

          <LinkShare
            colorScheme="teal"
            label="Copier le lien vers la photo"
            url={modalState.image.url}
            tooltipProps={{ placement: "bottom" }}
          />

          {(isGalleryCreator || modalState.image.isCreator) && (
            <DeleteButton
              aria-label="Supprimer l'image"
              variant="solid"
              header={
                <>
                  Êtes vous sûr de vouloir supprimer l'image{" "}
                  {modalState.image.name}
                  {/* <Text display="inline" color="red" fontWeight="bold">
                      {modalState.image.url.match(urlFilenameR)[0]}
                    </Text>{" "} */}
                  ?
                </>
              }
              isIconOnly
              isSmall={false}
              placement="bottom"
              onClick={async () => {
                const [...parts] = modalState.image.url.split("/");
                const fileName = parts[parts.length - 1];

                try {
                  await deleteDocument(fileName).unwrap();
                  //await api.remove(process.env.NEXT_PUBLIC_API2, payload);
                  toast({
                    title: `L'image a été supprimée !`,
                    status: "success",
                    isClosable: true
                  });
                  onClose();
                  //onDelete && onDelete();
                } catch (error) {
                  console.error(error);
                  toast({
                    title: `L'image n'a pas pu être supprimée.`,
                    status: "error"
                  });
                }
              }}
            />
          )}

          <Button
            colorScheme="green"
            isLoading={isLoading}
            onClick={async () => {
              try {
                setIsLoading(true);
                const key = isE ? "event" : "org";
                const topicName = modalState.image.name;
                const topicMessage = {
                  message: `<img src="${modalState.image.url}" style="max-height: 400px"/>`
                };
                const topic = entity[key + "Topics"].find(
                  (topic: ITopic) =>
                    getRefId(topic.document, "_id") === modalState.image.id
                );
                // add topic only if not already there
                if (!topic) {
                  const payload: AddTopicPayload = {
                    topic: {
                      [key]: entity,
                      document: modalState.image.id,
                      topicName,
                      topicMessages: [topicMessage]
                    }
                  };
                  await addTopic({ payload }).unwrap();
                }

                await router.push(
                  `/${entity[key + "Url"]}/discussions/${topicName}`
                );
                setIsLoading(false);
              } catch (error) {
                setIsLoading(false);
                toast({
                  title: getErrorMessageString(
                    error,
                    "La discussion n'a pas pu être créée"
                  ),
                  status: "error"
                });
              }
            }}
          >
            Commenter
          </Button>

          <Box flexGrow={1} textAlign="right" pr={10}>
            {modalState.image.createdBy &&
            typeof modalState.image.createdBy !== "string"
              ? modalState.image.createdBy.userName
              : ""}
          </Box>
        </HStack>
      }
      bodyProps={{ bg: "black" }}
      onClose={onClose}
    >
      <Image
        alt={modalState.image.name}
        alignSelf="center"
        src={images[modalState.image.index].url}
        maxHeight={screenHeight - 72 + "px"}
        //width={`${images[modalState.index].width}px`}
      />
    </FullscreenModal>
  );
};
