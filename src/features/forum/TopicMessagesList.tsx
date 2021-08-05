import React from "react";
import { Box } from "@chakra-ui/layout";
import { Avatar, AvatarBadge, Flex, Tooltip } from "@chakra-ui/react";
import { Container, Link, Spacer } from "features/common";
import { intervalToDuration, format, parseISO } from "date-fns";
import { fr } from "date-fns/locale";
import { ITopicMessage } from "models/TopicMessage";
import { formatDuration } from "utils/date";
import DOMPurify from "isomorphic-dompurify";

export const TopicMessagesList = ({
  topicMessages
}: {
  topicMessages: ITopicMessage[];
}) => {
  return (
    <>
      {topicMessages.map(({ _id, message, createdBy, createdAt }, index) => {
        const end = createdAt ? parseISO(createdAt) : new Date();
        const fullDate = format(end, "eeee dd MMMM yyyy à H'h'mm", {
          locale: fr
        });

        const duration = intervalToDuration({
          start: new Date(),
          end
        });
        const formatted = formatDuration(duration, {
          format: ["years", "months", "weeks", "days", "hours", "minutes"]
        });
        const timeAgo = formatted === "" ? "1m" : formatted;

        return (
          <Flex key={_id} px={2} py={2}>
            <Avatar name={createdBy.userName} boxSize={12} />
            {/* <AvatarBadge boxSize="1.25em" bg="green.500" />
            </Avatar> */}
            <Box ml={3}>
              <Container
                borderRadius={18}
                light={{ bg: "white" }}
                dark={{ bg: "gray.700" }}
                py={1}
                px={3}
              >
                <Link
                  href={`/${encodeURIComponent(createdBy.userName)}`}
                  fontWeight="bold"
                >
                  {createdBy.userName}
                </Link>
                <Box className="ql-editor" p={0} m={0}>
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
