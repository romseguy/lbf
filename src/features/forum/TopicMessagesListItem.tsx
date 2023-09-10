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
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { DeleteButton, Link, RTEditor } from "features/common";
import { isEdit, ITopic } from "models/Topic";
import { ITopicMessage } from "models/TopicMessage";
import { Session } from "utils/auth";
import * as dateUtils from "utils/date";
import { sanitize, transformTopicMessage } from "utils/string";
import { AppQuery } from "utils/types";
import { IEntity, isUser } from "models/Entity";
import { selectIsMobile } from "store/uiSlice";
import { useScroll } from "hooks/useScroll";
import { getStoredValue } from "utils/string/getStoredValue";

export const TopicMessagesListItemEdit = ({
  mutation,
  isEdit,
  isLoading,
  setIsEdit,
  setIsLoading,
  topic,
  ...props
}: {
  mutation: any;
  isEdit: isEdit;
  isLoading: Record<string, boolean>;
  setIsEdit: React.Dispatch<React.SetStateAction<isEdit>>;
  setIsLoading: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  topic: ITopic;
  topicMessage: ITopicMessage;
}) => {
  const [editTopic, editTopicMutation] = mutation;

  //#region topic message
  const { _id, createdBy } = props.topicMessage;
  const isU = isUser(createdBy);
  //#endregion

  const [executeScroll, elementToScrollRef] = useScroll<HTMLDivElement>();
  const [defaultValue, setDefaultValue] = useState("");
  //const [value, setValue] = useState("");

  useEffect(() => {
    executeScroll();
    const storedValue = getStoredValue(_id);
    if (storedValue) setDefaultValue(storedValue);
    else setDefaultValue(props.topicMessage.message);
  }, []);

  // for ts
  if (!_id) return null;

  return (
    <Flex ref={elementToScrollRef} flexDirection="column" pt={1} pb={3}>
      <RTEditor
        //formats={formats.filter((f) => f !== "size")}
        defaultValue={defaultValue}
        //value={value}
        height={500}
        onChange={({ html }) => {
          const value = getStoredValue(_id);
          if (value !== html) localStorage.setItem(_id, `{"value": "${html}"}`);
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
          isDisabled={editTopicMutation.isLoading}
          isLoading={editTopicMutation.isLoading}
          onClick={async () => {
            const message = getStoredValue(_id) || defaultValue;
            localStorage.removeItem(_id);
            await editTopic({
              topicId: topic._id,
              payload: {
                topic,
                topicMessage: {
                  _id,
                  message,
                  messageHtml: message
                }
              }
            }).unwrap();
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
    </Flex>
  );
};

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
  ...props
}: {
  index: number;
  isDark: boolean;
  isEdit: isEdit;
  isLoading: Record<string, boolean>;
  mutation: any;
  query: AppQuery<IEntity>;
  session: Session | null;
  setIsEdit: React.Dispatch<React.SetStateAction<isEdit>>;
  setIsLoading: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  topic: ITopic;
  topicMessage: ITopicMessage;
}) => {
  const router = useRouter();
  const isMobile = useSelector(selectIsMobile);
  const [editTopic, editTopicMutation] = mutation;

  //#region topic message
  const { _id, createdBy, createdAt } = props.topicMessage;
  const isU = isUser(createdBy);
  const userName = isU ? createdBy.userName || createdBy._id : createdBy || "";
  const userImage = isU ? createdBy.userImage?.base64 : undefined;
  const userId = isU ? createdBy._id : createdBy;
  const isCreator = userId === session?.user.userId || session?.user.isAdmin;
  const { timeAgo, fullDate } = dateUtils.timeAgo(createdAt);
  //#endregion

  return (
    <Box
      key={_id}
      borderRadius={18}
      bg={isDark ? "gray.600" : "white"}
      px={3}
      py={2}
      mb={3}
      data-cy="topic-message"
    >
      <Flex alignItems="center">
        <Flex
          alignItems="center"
          cursor="pointer"
          onClick={() =>
            router.push(`/${userName}`, `/${userName}`, { shallow: true })
          }
        >
          <Avatar name={userName} boxSize={10} src={userImage} tabIndex={0} />
          <Text fontWeight="bold" ml={2} tabIndex={0}>
            {userName}
          </Text>
        </Flex>

        <Box as="span" aria-hidden mx={1}>
          ·
        </Box>

        <Tooltip placement="bottom" label={fullDate}>
          <Text fontSize="smaller" suppressHydrationWarning>
            {timeAgo}
          </Text>
        </Tooltip>

        {isCreator && (
          <>
            <Box as="span" aria-hidden mx={1}>
              ·
            </Box>

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

            <Box as="span" aria-hidden mx={1}>
              ·
            </Box>

            <DeleteButton
              isDisabled={query.isLoading || query.isFetching}
              isIconOnly
              isLoading={typeof _id === "string" && isLoading[_id]}
              placement="bottom"
              header={<>Êtes vous sûr de vouloir supprimer ce message ?</>}
              onClick={async () => {
                typeof _id === "string" && setIsLoading({ [_id]: true });
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

                  _id && setIsLoading({ [_id]: false });
                } catch (error) {
                  // todo
                  console.error(error);
                }
              }}
            />
          </>
        )}
      </Flex>

      <Box className="rteditor" mt={2}>
        <div
          dangerouslySetInnerHTML={{
            __html: sanitize(
              transformTopicMessage(props.topicMessage.message, isMobile)
            )
          }}
        />
      </Box>
    </Box>
  );
};
