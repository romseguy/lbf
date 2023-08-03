import { EditIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  Tooltip,
  Text
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { DeleteButton, Link, RTEditor } from "features/common";
import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { ITopic } from "models/Topic";
import { ITopicMessage } from "models/TopicMessage";
import { Session } from "utils/auth";
import * as dateUtils from "utils/date";
import { sanitize } from "utils/string";
import { AppQuery } from "utils/types";
import { IEntity } from "models/Entity";

export const TopicMessagesListItem = ({
  index,
  isDark,
  isEdit,
  isLoading,
  query,
  mutation,
  session,
  setIsEdit,
  setIsLoading,
  topic,
  topicMessage
}: {
  index: number;
  isDark: boolean;
  isEdit: Record<
    string,
    {
      html?: string | undefined;
      isOpen: boolean;
    }
  >;
  isLoading: Record<string, boolean>;
  mutation: any;
  query: AppQuery<IEntity>;
  session: Session | null;
  setIsEdit: React.Dispatch<
    React.SetStateAction<
      Record<
        string,
        {
          html?: string | undefined;
          isOpen: boolean;
        }
      >
    >
  >;
  setIsLoading: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  topic: ITopic;
  topicMessage: ITopicMessage;
}) => {
  const router = useRouter();
  const editTopic = mutation[0];

  const { message, createdBy, createdAt, ...rest } = topicMessage;

  const _id = rest._id as string;
  let userName = "";
  let userImage;
  let userId = typeof createdBy === "object" ? createdBy._id : createdBy;

  if (typeof createdBy === "object") {
    userName = createdBy.userName;
    userImage = createdBy.userImage?.base64;
    userId = createdBy._id as string;
  }

  const { timeAgo, fullDate } = dateUtils.timeAgo(createdAt);

  const isCreator = userId === session?.user.userId || session?.user.isAdmin;

  return (
    <Flex key={_id} pb={3} data-cy="topic-message">
      <Box ml={0}>
        <Box borderRadius={18} bg={isDark ? "gray.600" : "white"} px={3} py={2}>
          <Link
            variant="no-underline"
            alignItems="center"
            display="inline-flex"
            mb={2}
            onClick={() =>
              router.push(`/${userName}`, `/${userName}`, { shallow: true })
            }
          >
            <Avatar
              name={userName}
              boxSize={10}
              src={userImage}
              cursor="pointer"
              mr={2}
            />
            <Text fontWeight="bold">{userName}</Text>
          </Link>

          {_id && isEdit[_id] && isEdit[_id].isOpen ? (
            <Box pt={1} pb={3}>
              <RTEditor
                //formats={formats.filter((f) => f !== "size")}
                defaultValue={message}
                onChange={({ html }) => {
                  setIsEdit({
                    ...isEdit,
                    [_id]: { ...isEdit[_id], html }
                  });
                }}
                placeholder="Contenu de votre message"
              />

              <Flex alignItems="center" justifyContent="space-between" mt={3}>
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
                          message: isEdit[_id].html || "",
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
            <Box className="rteditor">
              <div
                dangerouslySetInnerHTML={{
                  __html: sanitize(message)
                }}
              />
            </Box>
          )}
        </Box>

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
                isLoading[_id] && !query.isLoading && !query.isFetching
              }
              placement="bottom"
              header={<>Êtes vous sûr de vouloir supprimer ce message ?</>}
              onClick={async () => {
                _id && setIsLoading({ [_id]: true });

                const payload = {
                  topic: {
                    ...topic,
                    //topicMessages: [{_id}]
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
};
