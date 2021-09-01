import React from "react";
import { Box } from "@chakra-ui/layout";
import { Avatar, AvatarBadge, Flex, Icon, Tooltip } from "@chakra-ui/react";
import { Container, Link, Spacer } from "features/common";
import * as dateUtils from "utils/date";
import DOMPurify from "isomorphic-dompurify";
import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import { useEditTopicMutation } from "./topicsApi";
import { ITopic } from "models/Topic";
import { useSession } from "hooks/useAuth";

export const TopicMessagesList = ({
  topic,
  query
}: {
  topic: ITopic;
  query: any;
}) => {
  const { data: session, loading: isSessionLoading } = useSession();
  const [editTopic, editTopicMutation] = useEditTopicMutation();

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
                  light={{ bg: "white" }}
                  dark={{ bg: "gray.600" }}
                  px={3}
                  data-cy="topicMessage"
                >
                  <Link href={`/${userName}`} fontWeight="bold">
                    {userName}
                  </Link>
                  <Box className="ql-editor">
                    <div
                      dangerouslySetInnerHTML={{
                        __html: DOMPurify.sanitize(message)
                      }}
                    />
                  </Box>
                </Container>

                <Link pl={3} fontSize="smaller">
                  <Tooltip placement="bottom" label={fullDate}>
                    {timeAgo}
                  </Tooltip>
                </Link>

                <span aria-hidden="true"> · </span>
                {/* <EditIcon cursor="pointer" _hover={{ color: "green" }} />
                <span aria-hidden="true"> · </span> */}
                {isCreator && (
                  <Icon
                    as={DeleteIcon}
                    cursor="pointer"
                    _hover={{ color: "red" }}
                    onClick={async () => {
                      if (editTopicMutation.isLoading) return;
                      const yes = confirm(
                        `Êtes vous sûr de vouloir supprimer ce message ?`
                      );
                      if (yes) {
                        const payload = {
                          ...topic,
                          topicMessages: topic.topicMessages.filter((m) => {
                            return m._id !== _id;
                          })
                        };
                        await editTopic({
                          payload,
                          topicId: topic._id
                        }).unwrap();

                        query.refetch();
                      }
                    }}
                  />
                )}
              </Box>
            </Flex>
          );
        }
      )}
    </>
  );
};
