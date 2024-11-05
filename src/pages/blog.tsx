import { Spinner, useColorMode } from "@chakra-ui/react";
import { GetOrgParams, useGetOrgQuery } from "features/api/orgsApi";
import { useGetSubscriptionQuery } from "features/api/subscriptionsApi";
import { TopicsList } from "features/forum/TopicsList";
import { TopicsListItem } from "features/forum/TopicsListItem";
import { SimpleLayout } from "features/layout";
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

const BlogPage = ({ ...props }: PageProps) => {
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

  return (
    <SimpleLayout
      {...props}
      title="Dernières publications"
      height="100%"
      maxW="5xl"
      m="0 auto"
      p={6}
      css={css`
        background-color: ${theme.colors.whiteAlpha["800"]};
      `}
    >
      {query.isLoading && <Spinner />}

      {!query.isLoading && (
        <TopicsList
          currentTopicName={currentTopicName}
          query={query as AppQueryWithData<IOrg>}
          subQuery={subQuery}
          isCreator
          addButtonLabel="Ajouter une publication"
          maxW="4xl"
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
                  //isMobile={isMobile}
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
                  width="4xl"
                  {...props}
                />
              );
            });
          }}
        </TopicsList>
      )}
    </SimpleLayout>
  );
};
export default BlogPage;
