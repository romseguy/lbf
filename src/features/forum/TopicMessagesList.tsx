import React from "react";
import { Box } from "@chakra-ui/layout";
import { Avatar, AvatarBadge, Flex, Tooltip } from "@chakra-ui/react";
import { Container, Link, Spacer } from "features/common";
import { ITopicMessage } from "models/TopicMessage";
import * as dateUtils from "utils/date";
import DOMPurify from "isomorphic-dompurify";

export const TopicMessagesList = ({
  topicMessages
}: {
  topicMessages: ITopicMessage[];
}) => {
  return (
    <>
      {topicMessages.map(({ _id, message, createdBy, createdAt }, index) => {
        const { timeAgo, fullDate } = dateUtils.timeAgo(createdAt);

        return (
          <Flex key={_id} px={2} pt={index === 0 ? 3 : 0} pb={3}>
            <Avatar
              name={createdBy.userName}
              boxSize={10}
              src={createdBy.userImage?.base64}
            />
            {/* <AvatarBadge boxSize="1.25em" bg="green.500" />
            </Avatar> */}
            <Box ml={2}>
              <Container
                borderRadius={18}
                light={{ bg: "white" }}
                dark={{ bg: "gray.600" }}
                px={3}
              >
                <Link
                  href={`/${encodeURIComponent(createdBy.userName)}`}
                  fontWeight="bold"
                >
                  {createdBy.userName}
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
            </Box>
          </Flex>
        );
      })}
    </>
  );
};
