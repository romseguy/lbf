import {
  Box,
  Heading,
  HStack,
  Spinner,
  useColorMode,
  VStack
} from "@chakra-ui/react";
import { GetOrgParams, useGetOrgQuery } from "features/api/orgsApi";
import { useGetSubscriptionQuery } from "features/api/subscriptionsApi";
import { AppHeading, Link } from "features/common";
import { TopicsList } from "features/forum/TopicsList";
import { TopicsListItem } from "features/forum/TopicsListItem";
import { Nav, SimpleLayout } from "features/layout";
import theme from "features/layout/theme";
import { useSession } from "hooks/useSession";
import { PageProps } from "main";
import { getRefId } from "models/Entity";
import { IOrg } from "models/Org";
import { ISubscription } from "models/Subscription";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectUserEmail } from "store/userSlice";
import { css } from "twin.macro";
import { AppQuery, AppQueryWithData } from "utils/types";

const BlogPage = ({ isMobile, ...props }: PageProps) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const { data: session } = useSession();
  const userEmail = useSelector(selectUserEmail);
  const params: GetOrgParams = { orgUrl: "blog", populate: "orgTopics" };
  const query = useGetOrgQuery(params) as AppQuery<IOrg>;
  const blog = query.data;
  const subQuery = useGetSubscriptionQuery({
    email: userEmail
  }) as AppQuery<ISubscription>;

  const [currentTopicName, setCurrentTopicName] = useState("");
  const title = "Dernières publications";

  return (
    <>
      <Box maxW="5xl" m="0 auto">
        <Nav m={0} p={0} color="white" />
      </Box>

      <Box maxW="5xl" m="0 auto">
        {query.isLoading && <Heading color="white">Chargement...</Heading>}

        {!query.isLoading && (
          <TopicsList
            currentTopicName={currentTopicName}
            query={query as AppQueryWithData<IOrg>}
            subQuery={subQuery}
            isCreator
            addButtonLabel="Ajouter une publication"
          >
            {({
              currentTopic,
              selectedCategories,
              setSelectedCategories,
              notifyModalState,
              setNotifyModalState,
              topicModalState,
              setTopicModalState
            }) => {
              return blog?.orgTopics.map((topic, topicIndex) => {
                const isCurrent = topic._id === currentTopic?._id;
                const isTopicCreator = getRefId(topic) === session?.user.userId;
                const isSubbedToTopic = !!subQuery.data?.topics?.find(
                  (topicSubscription) => {
                    if (!topicSubscription.topic) return false;
                    return topicSubscription.topic._id === topic._id;
                  }
                );

                return (
                  <TopicsListItem
                    key={topic._id}
                    baseUrl="blog"
                    isMobile={isMobile}
                    session={session}
                    isCreator
                    query={query as AppQueryWithData<IOrg>}
                    subQuery={subQuery}
                    //currentTopicName={currentTopicName}
                    topic={topic}
                    topicIndex={topicIndex}
                    isSubbedToTopic={isSubbedToTopic}
                    isCurrent={isCurrent}
                    isTopicCreator={isTopicCreator}
                    isDark={isDark}
                    //isLoading={isLoading[topic._id] || query.isLoading}
                    //setIsLoading={setIsLoading}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                    notifyModalState={notifyModalState}
                    setNotifyModalState={setNotifyModalState}
                    topicModalState={topicModalState}
                    setTopicModalState={setTopicModalState}
                    mb={topicIndex < blog.orgTopics.length - 1 ? 5 : 0}
                    onClick={function () {
                      if (currentTopicName === topic.topicName)
                        setCurrentTopicName("");
                      else setCurrentTopicName(topic.topicName);
                    }}
                    w="100%"
                    maxW="5xl"
                    {...props}
                  />
                );
              });
            }}
          </TopicsList>
        )}
      </Box>
    </>
  );
};
export default BlogPage;
