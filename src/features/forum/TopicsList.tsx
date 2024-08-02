import { AddIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Box,
  Flex,
  GridProps,
  List,
  ListItem,
  Select,
  Spinner,
  Text,
  useColorMode
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useAddTopicNotifMutation } from "features/api/topicsApi";
import { Button, AppHeading, CategoryTag } from "features/common";
import {
  NotifModalState,
  EntityNotifModal
} from "features/modals/EntityNotifModal";
import { TopicFormModal } from "features/modals/TopicFormModal";
import { useSession } from "hooks/useSession";
import {
  getCategoryLabel,
  getRefId,
  IEntity,
  isEvent,
  isOrg
} from "models/Entity";
import { IOrgList } from "models/Org";
import { ISubscription } from "models/Subscription";
import { ITopic } from "models/Topic";
import { hasItems } from "utils/array";
import { normalize } from "utils/string";
import { AppQuery, AppQueryWithData } from "utils/types";
import { TopicsListCategories } from "./TopicsListCategories";
import { TopicsListItem } from "./TopicsListItem";
import { TopicsListOrgLists } from "./TopicsListOrgLists";
import { selectIsMobile } from "store/uiSlice";

enum ETopicsListOrder {
  ALPHA = "ALPHA",
  NEWEST = "NEWEST",
  OLDEST = "OLDEST",
  PINNED = "PINNED"
}

export type TopicModalState = {
  isOpen: boolean;
  topic?: ITopic;
};

export const TopicsList = ({
  query,
  subQuery,
  currentTopicName,
  ...props
}: GridProps & {
  query: AppQueryWithData<IEntity>;
  subQuery: AppQuery<ISubscription>;
  isCreator: boolean;
  isFollowed?: boolean;
  currentTopicName?: string;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const isMobile = useSelector(selectIsMobile);
  const router = useRouter();
  const { data: session } = useSession();

  const addTopicNotifMutation = useAddTopicNotifMutation();

  //#region local state
  const entity = query.data;
  const isE = isEvent(entity);
  const isO = isOrg(entity);
  const [selectedCategories, setSelectedCategories] = useState<string[]>();
  const [selectedLists, setSelectedLists] = useState<IOrgList[]>();
  const defaultOrder = ETopicsListOrder.NEWEST;
  const [selectedOrder, setSelectedOrder] =
    useState<ETopicsListOrder>(defaultOrder);
  const topicCategories = useMemo(
    () =>
      isE ? entity.eventTopicCategories : isO ? entity.orgTopicCategories : [],
    [entity]
  );
  const topics = useMemo(() => {
    return (
      isE
        ? entity.eventTopics
        : isO
        ? entity.orgTopics.concat(
            entity.orgEvents.map((event) => ({
              _id: event._id,
              event,
              isPinned: true,
              topicName: event._id,
              topicMessages: [],
              topicNotifications: [],
              topicVisibility: [],
              createdAt: event.eventMinDate,
              createdBy: event.createdBy
            }))
          )
        : []
    )
      .filter((topic: ITopic) => {
        if (hasItems(selectedCategories) || hasItems(selectedLists)) {
          let belongsToCategory = false;
          let belongsToList = false;

          if (
            Array.isArray(selectedCategories) &&
            selectedCategories.length > 0
          ) {
            if (
              topic.topicCategory &&
              selectedCategories.find(
                (selectedCategory) => selectedCategory === topic.topicCategory
              )
            )
              belongsToCategory = true;
          }

          if (isE || (isO && entity.orgUrl === "forum"))
            return belongsToCategory;

          if (Array.isArray(selectedLists) && selectedLists.length > 0) {
            if (hasItems(topic.topicVisibility)) {
              let found = false;

              for (let i = 0; i < topic.topicVisibility.length; i++)
                for (let j = 0; j < selectedLists.length; j++)
                  if (selectedLists[j].listName === topic.topicVisibility[i])
                    found = true;

              if (found) belongsToList = true;
            }
          }

          return belongsToCategory || belongsToList;
        }

        return true;
      })
      .sort((topicA, topicB) => {
        if (topicA.isPinned && !topicB.isPinned) return -1;
        if (!topicA.isPinned && topicB.isPinned) return 1;

        if (selectedOrder === ETopicsListOrder.ALPHA)
          return topicA.topicName > topicB.topicName ? 1 : -1;

        if (selectedOrder === ETopicsListOrder.OLDEST)
          return topicA.createdAt! < topicB.createdAt! ? -1 : 1;

        return topicA.createdAt! > topicB.createdAt! ? -1 : 1;
      });
  }, [entity, selectedCategories, selectedLists, selectedOrder]);
  const currentTopic = useMemo(() => {
    if (
      !currentTopicName ||
      ["ajouter", "a"].includes(currentTopicName) ||
      !hasItems(topics)
    )
      return null;

    const topic = topics.find(
      (topic) => normalize(topic.topicName) === normalize(currentTopicName)
    );

    return topic || null;
  }, [currentTopicName, topics]);
  // const refs = useMemo(
  //   () =>
  //     topics.reduce((acc: Record<string, React.RefObject<any>>, value) => {
  //       acc[value._id] = React.createRef();
  //       return acc;
  //     }, {}),
  //   [topics]
  // );
  //const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  // useEffect(() => {
  //   if (currentTopic && !isLoading[currentTopic._id]) {
  //     const topicRef = refs[currentTopic._id].current;
  //     if (topicRef) {
  //       topicRef.scrollIntoView({
  //         behavior: "smooth",
  //         block: "start"
  //       });
  //     }
  //   }
  // }, [currentTopic, isLoading]);
  //#endregion

  //#region topic modal state
  const [topicModalState, setTopicModalState] = useState<TopicModalState>({
    isOpen: !!currentTopicName && ["ajouter", "a"].includes(currentTopicName)
  });
  const onClose = () =>
    setTopicModalState({
      ...topicModalState,
      isOpen: false,
      topic: undefined
    });
  const onAddClick = () => {
    if (!session) {
      router.push("/login", "/login", { shallow: true });
      return;
    }

    setTopicModalState({ ...topicModalState, isOpen: true });
  };
  //#endregion

  return (
    <>
      {/*Ajouter une discussion*/}
      <Box>
        <Button
          colorScheme="teal"
          leftIcon={<AddIcon />}
          mb={3}
          onClick={onAddClick}
          data-cy="topic-add-button"
        >
          Ajouter une discussion
        </Button>
      </Box>

      <Box mb={5}>
        <AppHeading smaller>Ordre d'affichage</AppHeading>

        <Select
          defaultValue={defaultOrder}
          width="275px"
          onChange={(e) => {
            //@ts-ignore
            setSelectedOrder(e.target.value);
          }}
        >
          <option value={ETopicsListOrder.ALPHA}>
            Dans l'ordre alphabétique
          </option>
          {/* <option value={ETopicsListOrder.PINNED}>Épinglé</option> */}
          <option value={ETopicsListOrder.NEWEST}>
            Du plus récent au plus ancien
          </option>
          <option value={ETopicsListOrder.OLDEST}>
            Du plus ancien au plus récent
          </option>
        </Select>
      </Box>

      <Box
        {...(isMobile
          ? {}
          : { display: "flex", justifyContent: "space-between" })}
      >
        {(props.isCreator || topicCategories.length > 0) && (
          <Flex flexDirection="column" mb={3}>
            <AppHeading smaller>Catégories</AppHeading>

            <TopicsListCategories
              query={query}
              isCreator={props.isCreator}
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
            />
          </Flex>
        )}

        {isO &&
          entity.orgUrl !== "forum" &&
          session &&
          hasItems(entity.orgLists) && (
            <Flex flexDirection="column" mb={3}>
              <AppHeading smaller>Listes</AppHeading>
              <TopicsListOrgLists
                org={entity}
                isCreator={props.isCreator}
                selectedLists={selectedLists}
                session={session}
                setSelectedLists={setSelectedLists}
                subQuery={subQuery}
              />
            </Flex>
          )}
      </Box>

      <Box data-cy="topic-list">
        {query.isLoading ? (
          <Spinner />
        ) : !topics.length ? (
          <Alert status="warning" mb={3}>
            <AlertIcon />
            <Flex flexDirection="column">
              {(selectedCategories && selectedCategories.length >= 1) ||
              (selectedLists && selectedLists.length >= 1) ? (
                <>
                  {selectedLists &&
                  selectedLists.length >= 1 &&
                  selectedCategories &&
                  selectedCategories.length >= 1 ? (
                    <>
                      Aucune discussions appartenant :
                      <List listStyleType="square" ml={5}>
                        <ListItem mb={1}>
                          aux catégories :
                          {selectedCategories.map((catId, index) => (
                            <>
                              <CategoryTag key={index} mx={1}>
                                {getCategoryLabel(topicCategories, catId)}
                              </CategoryTag>
                              {index !== selectedCategories.length - 1 && "ou"}
                            </>
                          ))}
                        </ListItem>
                        <ListItem>
                          aux listes :
                          {selectedLists.map(({ listName }, index) => (
                            <>
                              <CategoryTag mx={1}>{listName}</CategoryTag>
                              {index !== selectedLists.length - 1 && "ou"}
                            </>
                          ))}
                        </ListItem>
                      </List>
                    </>
                  ) : selectedCategories && selectedCategories.length >= 1 ? (
                    <Box>
                      {selectedCategories.length === 1 ? (
                        <>
                          Aucune discussions appartenant à la catégorie{" "}
                          <CategoryTag>
                            {getCategoryLabel(
                              topicCategories,
                              selectedCategories[0]
                            )}
                          </CategoryTag>
                        </>
                      ) : (
                        <>
                          Aucune discussions appartenant aux catégories
                          {selectedCategories.map((catId, index) => (
                            <>
                              <CategoryTag key={index} mx={1}>
                                {getCategoryLabel(topicCategories, catId)}
                              </CategoryTag>
                              {index !== selectedCategories.length - 1 && "ou"}
                            </>
                          ))}
                        </>
                      )}
                    </Box>
                  ) : selectedLists && selectedLists.length >= 1 ? (
                    <Box>
                      {selectedLists.length === 1 ? (
                        <>
                          Aucune discussions appartenant à la liste{" "}
                          <CategoryTag>{selectedLists[0].listName}</CategoryTag>
                        </>
                      ) : (
                        <>
                          Aucune discussions appartenant aux listes
                          {selectedLists.map(({ listName }, index) => (
                            <>
                              <CategoryTag mx={1}>{listName}</CategoryTag>
                              {index !== selectedLists.length - 1 && "ou"}
                            </>
                          ))}
                        </>
                      )}
                    </Box>
                  ) : (
                    <>todo</>
                  )}
                </>
              ) : (
                <Text>Aucune discussions.</Text>
              )}
            </Flex>
          </Alert>
        ) : (
          topics.map((topic, topicIndex) => {
            if (typeof topic === "string") return null;

            const isCurrent = topic._id === currentTopic?._id;
            const isTopicCreator =
              props.isCreator || getRefId(topic) === session?.user.userId;
            const isSubbedToTopic = !!subQuery.data?.topics?.find(
              (topicSubscription) => {
                if (!topicSubscription.topic) return false;
                return topicSubscription.topic._id === topic._id;
              }
            );
            //if (!isCurrent) return null;
            return (
              <TopicsListItem
                key={topic._id}
                isMobile={isMobile}
                session={session}
                isCreator={props.isCreator}
                query={query}
                subQuery={subQuery}
                currentTopicName={currentTopicName}
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
                //notifyModalState={notifyModalState}
                //setNotifyModalState={setNotifyModalState}
                topicModalState={topicModalState}
                setTopicModalState={setTopicModalState}
                mb={topicIndex < topics.length - 1 ? 5 : 0}
                // onClick={onClick}
                // onDeleteClick={onDeleteClick}
                // onEditClick={onEditClick}
                // onNotifClick={onNotifClick}
                // onSubscribeClick={onSubscribeClick}
              />
            );
          })
        )}
      </Box>

      {topicModalState.isOpen && (
        <TopicFormModal
          {...topicModalState}
          query={query}
          subQuery={subQuery}
          isCreator={props.isCreator}
          isFollowed={props.isFollowed}
          onCancel={onClose}
          onSubmit={async (topic) => {
            // const topicName = normalize(topic.topicName);
            // const url = `${baseUrl}/${topicName}`;
            // await router.push(url, url, { shallow: true });
            query.refetch();
            onClose();
          }}
          onClose={onClose}
        />
      )}
    </>
  );
};

TopicsList.whyDidYouRender = false;

{
  /*
  //#region notify modal state
  const [notifyModalState, setNotifyModalState] = useState<
    NotifModalState<ITopic>
  >({});
  //#endregion


      {session && (
        <EntityNotifModal
          query={query}
          mutation={addTopicNotifMutation}
          setModalState={setNotifyModalState}
          modalState={notifyModalState}
          session={session}
        />
      )}
  */
}
