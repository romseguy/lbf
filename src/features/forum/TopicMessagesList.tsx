import React, { useState } from "react";
import DOMPurify from "isomorphic-dompurify";
import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  Tooltip
} from "@chakra-ui/react";
import { EditIcon } from "@chakra-ui/icons";
import { Container, DeleteButton, Link, RTEditor } from "features/common";
import { useSession } from "hooks/useAuth";
import { ITopic } from "models/Topic";
import * as dateUtils from "utils/date";
import { useEditTopicMutation } from "./topicsApi";

export const TopicMessagesList = ({
  topic,
  query
}: {
  topic: ITopic;
  query: any;
}) => {
  const { data: session, loading: isSessionLoading } = useSession();

  const [editTopic, editTopicMutation] = useEditTopicMutation();

  const [isEdit, setIsEdit] = useState<{
    [key: string]: {
      html?: string;
      isOpen: boolean;
    };
  }>({});
  const [isLoading, setIsLoading] = useState<{ [key: string]: boolean }>({});

  if (!topic) return null;

  return (
    <>
      {topic.topicMessages.map(
        ({ _id, message, createdBy, createdAt }, index) => {
          let userName = "";
          let userImage;
          let userId: string = createdBy as string;

          if (typeof createdBy === "object") {
            userName = createdBy.userName;
            userImage = createdBy.userImage?.base64;
            userId = createdBy._id as string;
          }

          const { timeAgo, fullDate } = dateUtils.timeAgo(createdAt);

          const isCreator =
            userId === session?.user.userId || session?.user.isAdmin;

          return (
            <Flex key={_id} px={2} pt={index === 0 ? 3 : 0} pb={3}>
              <Link variant="no-underline" href={userName}>
                <Avatar name={userName} boxSize={10} src={userImage} />
              </Link>
              {/* <AvatarBadge boxSize="1.25em" bg="green.500" />
            </Avatar> */}
              <Box ml={2}>
                <Container
                  borderRadius={18}
                  light={{ bg: "orange.50" }}
                  dark={{ bg: "gray.600" }}
                  px={3}
                  data-cy="topicMessage"
                >
                  <Link href={`/${userName}`} fontWeight="bold">
                    {userName}
                  </Link>
                  {_id && isEdit[_id] && isEdit[_id].isOpen ? (
                    <Box pt={1} pb={3}>
                      <RTEditor
                        //defaultValue={isEdit[_id].html || message}
                        defaultValue={message}
                        onChange={(html) => {
                          setIsEdit({
                            ...isEdit,
                            [_id]: { ...isEdit[_id], html }
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
                              payload: {
                                ...topic,
                                topicMessages: topic.topicMessages.map((m) => {
                                  if (m._id === _id) {
                                    return {
                                      ...m,
                                      message: isEdit[_id].html || ""
                                    };
                                  }
                                  return m;
                                })
                              },
                              topicId: topic._id
                            }).unwrap();
                            query.refetch();
                            setIsEdit({
                              ...isEdit,
                              [_id]: { ...isEdit[_id], isOpen: false }
                            });
                          }}
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
                      bg="transparent"
                      height="auto"
                      minWidth={0}
                      _hover={{ color: "red" }}
                      placement="bottom"
                      header={
                        <>Êtes vous sûr de vouloir supprimer ce message ?</>
                      }
                      onClick={async () => {
                        _id && setIsLoading({ [_id]: true });

                        const payload = {
                          ...topic,
                          topicMessages:
                            index === topic.topicMessages.length - 1
                              ? topic.topicMessages.filter((m) => {
                                  return m._id !== _id;
                                })
                              : topic.topicMessages.map((m) => {
                                  if (m._id === _id) {
                                    return {
                                      _id,
                                      message: "<i>Message supprimé</i>",
                                      createdBy,
                                      createdAt
                                    };
                                  }

                                  return m;
                                })
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
    </>
  );
};
