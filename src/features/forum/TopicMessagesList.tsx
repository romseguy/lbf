import { EditIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  Spinner,
  Tag,
  Text,
  Tooltip,
  useColorMode,
  FlexProps
} from "@chakra-ui/react";
import DOMPurify from "isomorphic-dompurify";
import React, { useState } from "react";
import {
  Container,
  DeleteButton,
  formats,
  Link,
  RTEditor
} from "features/common";
import { useSession } from "hooks/useAuth";
import { ITopic } from "models/Topic";
import * as dateUtils from "utils/date";
import { useEditTopicMutation } from "./topicsApi";

export const TopicMessagesList = ({
  topic,
  query,
  ...props
}: FlexProps & {
  topic: ITopic;
  query: any;
}) => {
  const { data: session, loading: isSessionLoading } = useSession();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const [editTopic, editTopicMutation] = useEditTopicMutation();

  const [isEdit, setIsEdit] = useState<{
    [key: string]: {
      html?: string;
      quillHtml?: string;
      isOpen: boolean;
    };
  }>({});
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});

  if (!topic) return null;

  return (
    <Flex flexDirection="column" {...props}>
      <Box>
        {topic.topicMessages.map(
          ({ _id, message, createdBy, createdAt }, index) => {
            let userName = "";
            let userImage;
            let userId =
              typeof createdBy === "object" ? createdBy._id : createdBy;

            if (typeof createdBy === "object") {
              userName = createdBy.userName;
              userImage = createdBy.userImage?.base64;
              userId = createdBy._id as string;
            }

            const { timeAgo, fullDate } = dateUtils.timeAgo(createdAt);

            const isCreator =
              userId === session?.user.userId || session?.user.isAdmin;

            return (
              <Flex key={_id} pb={3} data-cy="topic-message">
                <Link variant="no-underline" href={userName}>
                  <Avatar name={userName} boxSize={10} src={userImage} />
                </Link>

                <Box ml={2}>
                  <Container
                    borderRadius={18}
                    light={{ bg: "white" }}
                    dark={{ bg: "gray.600" }}
                    px={3}
                  >
                    <Link href={`/${userName}`} fontWeight="bold">
                      {userName}
                    </Link>

                    {_id && isEdit[_id] && isEdit[_id].isOpen ? (
                      <Box pt={1} pb={3}>
                        <RTEditor
                          formats={formats.filter((f) => f !== "size")}
                          defaultValue={message}
                          onChange={({ html, quillHtml }) => {
                            setIsEdit({
                              ...isEdit,
                              [_id]: { ...isEdit[_id], html, quillHtml }
                            });
                          }}
                          placeholder="Contenu de votre message"
                        />

                        <Flex
                          alignItems="center"
                          justifyContent="space-between"
                          mt={3}
                        >
                          <Button
                            onClick={() =>
                              setIsEdit({
                                ...isEdit,
                                [_id]: { ...isEdit[_id], isOpen: false }
                              })
                            }
                          >
                            Annuler
                          </Button>

                          <Button
                            colorScheme="green"
                            onClick={async () => {
                              await editTopic({
                                topicId: topic._id,
                                payload: {
                                  topic,
                                  topicMessage: {
                                    _id,
                                    message: isEdit[_id].quillHtml || "",
                                    messageHtml: isEdit[_id].html || ""
                                  }
                                }
                              }).unwrap();
                              query.refetch();
                              setIsEdit({
                                ...isEdit,
                                [_id]: { ...isEdit[_id], isOpen: false }
                              });
                            }}
                            data-cy="topic-message-edit-submit"
                          >
                            Modifier
                          </Button>
                        </Flex>
                      </Box>
                    ) : (
                      <Box className="ql-editor">
                        <div
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(message)
                          }}
                        />
                      </Box>
                    )}
                  </Container>

                  <Link pl={3} fontSize="smaller" aria-hidden>
                    <Tooltip placement="bottom" label={fullDate}>
                      <span>{timeAgo}</span>
                    </Tooltip>
                  </Link>

                  {isCreator && (
                    <>
                      <span aria-hidden> · </span>
                      <Tooltip placement="bottom" label="Modifier le message">
                        <IconButton
                          aria-label="Modifier le message"
                          icon={<EditIcon />}
                          bg="transparent"
                          height="auto"
                          minWidth={0}
                          _hover={{ color: "green" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (_id)
                              setIsEdit({
                                ...isEdit,
                                [_id]: { ...isEdit[_id], isOpen: true }
                              });
                          }}
                          data-cy="topic-message-edit"
                        />
                      </Tooltip>

                      <span aria-hidden> · </span>

                      <DeleteButton
                        isIconOnly
                        isLoading={
                          _id &&
                          isLoading[_id] &&
                          !query.isLoading &&
                          !query.isFetching
                        }
                        placement="bottom"
                        header={
                          <>Êtes vous sûr de vouloir supprimer ce message ?</>
                        }
                        onClick={async () => {
                          _id && setIsLoading({ [_id]: true });

                          const payload = {
                            topic: {
                              ...topic,
                              topicMessages:
                                index === topic.topicMessages.length - 1
                                  ? topic.topicMessages.filter((m) => {
                                      return m._id !== _id;
                                    })
                                  : topic.topicMessages.map((m) => {
                                      if (m._id === _id) {
                                        return {
                                          message: "<i>Message supprimé</i>",
                                          createdBy
                                        };
                                      }

                                      return m;
                                    })
                            }
                          };

                          try {
                            await editTopic({
                              payload,
                              topicId: topic._id
                            }).unwrap();

                            query.refetch();
                            _id && setIsLoading({ [_id]: false });
                          } catch (error) {
                            // todo
                            console.error(error);
                          }
                        }}
                      />
                    </>
                  )}
                </Box>
              </Flex>
            );
          }
        )}
      </Box>
    </Flex>
  );
};
