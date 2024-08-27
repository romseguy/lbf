import { EntityPageTopics, RTEditor } from "features/common";
import { TopicMessagesList } from "features/forum/TopicMessagesList";
import { IEvent } from "models/Event";
import { isEdit, ITopic } from "models/Topic";
import { ISubscription } from "models/Subscription";
import { useState } from "react";
import { AppQueryWithData, AppQuery } from "utils/types";
import { TopicMessagesListItem } from "features/forum/TopicMessagesListItem";
import {
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  useColorMode,
  VStack
} from "@chakra-ui/react";
import { useSession } from "hooks/useSession";
import { useEditTopicMutation } from "features/api/topicsApi";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { css } from "twin.macro";

export const EventPageTopicsTabPanel = ({
  currentTopicName,
  isCreator,
  isFollowed,
  query,
  subQuery
}: {
  currentTopicName?: string;
  isCreator: boolean;
  isFollowed: boolean;
  query: AppQueryWithData<IEvent>;
  subQuery: AppQuery<ISubscription>;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const { data: session } = useSession();
  const mutation = useEditTopicMutation();

  const entity = query.data;
  const topics = entity.eventTopics;
  const [currentTopic, setCurrentTopic] = useState<ITopic | null>();
  const [isEdit, setIsEdit] = useState<isEdit>({});
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});

  // isEdit = { isEdit };
  // setIsEdit = { setIsEdit };
  // topic = { topic };
  // query = { query };

  const body = css`
    display: flex;
    flex-direction: column;
  `;

  return (
    <EntityPageTopics
      topics={topics}
      currentTopicName={currentTopicName}
      isCreator={isCreator}
      isFollowed={isFollowed}
      query={query}
      subQuery={subQuery}
    />
  );

  return (
    <Box css={body}>
      {currentTopic ? (
        <>
          {currentTopic.topicMessages.map((topicMessage, index) => {
            const row = css`
              display: flex;
              flex: 1;
            `;
            const column1 = css`
              display: flex;
              flex-direction: column;
              flex-basis: 100%;
              flex: 0;
            `;
            const column2 = css`
              display: flex;
              flex-direction: column;
              flex-basis: 100%;
              flex: 1;
            `;
            return (
              <>
                <Box css={row} mb={index !== topics.length - 1 ? 3 : 0}>
                  {index === 0 && (
                    <Box css={column1} mr={3}>
                      <IconButton
                        flex={1}
                        aria-label="Commenter"
                        icon={<ChevronLeftIcon boxSize={10} />}
                        borderRadius={18}
                        onClick={() => {
                          setCurrentTopic(null);
                        }}
                      />
                    </Box>
                  )}

                  <TopicMessagesListItem
                    index={index}
                    isDark={isDark}
                    isEdit={isEdit}
                    isLoading={isLoading}
                    mutation={mutation}
                    query={query}
                    session={session}
                    setIsEdit={setIsEdit}
                    setIsLoading={setIsLoading}
                    topic={currentTopic}
                    topicMessage={topicMessage}
                    css={column2}
                  />
                </Box>
              </>
            );
          })}
        </>
      ) : (
        <>
          {topics.map((topic, index) => {
            const row = css`
              display: flex;
              flex: 1;
            `;
            const column1 = css`
              display: flex;
              flex-direction: column;
              flex-basis: 100%;
              flex: 1;
            `;
            const column2 = css`
              display: flex;
              flex-direction: column;
              flex-basis: 100%;
              flex: 0;
            `;
            return (
              <Box css={row} mb={index !== topics.length - 1 ? 3 : 0}>
                <TopicMessagesListItem
                  index={index}
                  isDark={isDark}
                  isEdit={isEdit}
                  isLoading={isLoading}
                  mutation={mutation}
                  query={query}
                  session={session}
                  setIsEdit={setIsEdit}
                  setIsLoading={setIsLoading}
                  topic={topic}
                  topicMessage={topic.topicMessages[0]}
                  css={column1}
                  mr={3}
                />

                <Box css={column2}>
                  <IconButton
                    flex={1}
                    aria-label="Commenter"
                    icon={<ChevronRightIcon boxSize={10} />}
                    borderRadius={18}
                    onClick={() => {
                      setCurrentTopic(topic);
                    }}
                  />
                </Box>
              </Box>
            );
          })}
        </>
      )}

      <VStack
        alignItems="start"
        mt={3}
        css={css`
          .tox {
            width: 100%;
          }
        `}
      >
        <RTEditor
          placeholder="Contenu de votre message"
          onChange={({ html }) => {
            console.log("🚀 ~ html:", html);
            //renderProps.onChange(html);
          }}
        />

        <Button
          alignSelf="end"
          colorScheme="green"
          // isLoading={
          //   isLoading ||
          //   addTopicMutation.isLoading ||
          //   editTopicMutation.isLoading
          // }
          // isDisabled={Object.keys(errors).length > 0}
        >
          Ajouter
        </Button>
      </VStack>
    </Box>
  );
};
