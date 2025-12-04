import { AddIcon, CheckCircleIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Box,
  BoxProps,
  Flex,
  HStack,
  IconButton,
  List,
  ListItem,
  Select,
  Spinner,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { EditOrgPayload, useEditOrgMutation } from "features/api/orgsApi";
import { AppHeading, Button } from "features/common";
import {
  TopicCopyFormModal,
  TopicFormModal,
} from "features/modals/TopicFormModal";
import { useSession } from "hooks/useSession";
import { getCategoryLabel, getRefId, IEntity, isOrg } from "models/Entity";
import { ETopicsListOrder, ITopic } from "models/Topic";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { selectIsMobile } from "store/uiSlice";
import { hasItems } from "utils/array";
import { normalize } from "utils/string";
import { AppQueryWithData } from "utils/types";
import { TopicCategoryTag } from "./TopicCategoryTag";
import { TopicsListCategories } from "./TopicsListCategories";
import { TopicsListItem } from "./TopicsListItem";

export type TopicModalState = {
  isOpen: boolean;
  topic?: ITopic;
};

export const TopicsList = ({
  query,
  currentTopicName,
  addButtonLabel,
  ...props
}: Omit<BoxProps, "children"> & {
  children?: ({
    currentTopic,
    selectedCategories,
    setSelectedCategories,
    topicModalState,
    setTopicModalState,
    topicCopyModalState,
    setTopicCopyModalState,
  }: {
    currentTopic: ITopic | null;
    selectedCategories?: string[];
    setSelectedCategories: React.Dispatch<
      React.SetStateAction<string[] | undefined>
    >;
    topicModalState: TopicModalState;
    setTopicModalState: React.Dispatch<React.SetStateAction<TopicModalState>>;
    topicCopyModalState: TopicModalState;
    setTopicCopyModalState: React.Dispatch<
      React.SetStateAction<TopicModalState>
    >;
  }) => React.ReactNode;
  query: AppQueryWithData<IEntity>;
  isCreator: boolean;
  currentTopicName?: string;
  addButtonLabel?: string;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const isMobile = useSelector(selectIsMobile);
  const router = useRouter();
  const { data: session } = useSession();

  const [editOrg] = useEditOrgMutation();

  //#region local state
  const entity = query.data;
  const isO = isOrg(entity);
  const edit = editOrg;
  const [selectedCategories, setSelectedCategories] = useState<string[]>();
  const defaultOrder = isO ? entity.orgTopicOrder : ETopicsListOrder.NEWEST;
  const [selectedOrder, setSelectedOrder] = useState<ETopicsListOrder>(
    defaultOrder || ETopicsListOrder.NEWEST,
  );
  const topicCategories = useMemo(
    () => (isO ? entity.orgTopicCategories : [] || []),
    [entity],
  );
  const topics = useMemo(() => {
    return (
      (isO ? entity.orgTopics : [])
        .filter((topic: ITopic) => {
          if (hasItems(selectedCategories)) {
            let belongsToCategory = false;

            if (
              Array.isArray(selectedCategories) &&
              selectedCategories.length > 0
            ) {
              if (
                topic.topicCategory &&
                selectedCategories.find(
                  (selectedCategory) =>
                    selectedCategory === topic.topicCategory,
                )
              )
                belongsToCategory = true;
            }

            return belongsToCategory;
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
        }) || []
    );
  }, [entity, selectedCategories, selectedOrder]);
  const currentTopic = useMemo(() => {
    if (
      !currentTopicName ||
      ["ajouter", "a"].includes(currentTopicName) ||
      !hasItems(topics)
    )
      return null;

    const topic = topics.find((topic) => {
      if (normalize(topic.topicName) === normalize(currentTopicName))
        return true;

      return topic._id === currentTopicName;
    });

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
    isOpen: !!currentTopicName && ["ajouter", "a"].includes(currentTopicName),
  });
  const onClose = () => {
    setTopicModalState({
      ...topicModalState,
      isOpen: false,
      topic: undefined,
    });
    setTopicCopyModalState({
      ...topicCopyModalState,
      isOpen: false,
      topic: undefined,
    });
  };
  const onAddClick = () => {
    if (!session) {
      router.push("/login", "/login", { shallow: true });
      return;
    }

    setTopicModalState({ ...topicModalState, isOpen: true });
  };
  //#endregion

  //#region move topic modal state
  const [topicCopyModalState, setTopicCopyModalState] =
    useState<TopicModalState>({
      isOpen: false,
    });
  //#endregion

  return (
    <Flex {...props} flexDirection="column">
      <Box>
        <Button
          colorScheme="teal"
          leftIcon={<AddIcon />}
          mb={6}
          onClick={onAddClick}
        >
          {addButtonLabel || "Ajouter une discussion"}
        </Button>
      </Box>

      {!!query.data && (
        <HStack mb={5}>
          <Box w="150px">
            <Select
              defaultValue={defaultOrder}
              onChange={(e) => {
                //@ts-ignore
                setSelectedOrder(e.target.value);
              }}
            >
              <option value={ETopicsListOrder.ALPHA}>A-Z</option>
              {/* <option value={ETopicsListOrder.PINNED}>Épinglé</option> */}
              <option value={ETopicsListOrder.NEWEST}>Plus récent</option>
              <option value={ETopicsListOrder.OLDEST}>Plus ancien</option>
            </Select>
          </Box>
          {props.isCreator && (
            <IconButton
              aria-label="Sauvegarder"
              icon={<CheckCircleIcon />}
              onClick={async () => {
                try {
                  const payload: EditOrgPayload = {
                    [isO ? "orgTopicOrder" : "eventTopicOrder"]: selectedOrder,
                  };
                  const res = await edit({
                    [isO ? "orgId" : "entityId"]: entity._id,
                    payload,
                  }).unwrap();
                } catch (error) {}
              }}
            />
          )}
        </HStack>
      )}

      {!!query.data && (
        <Box
          mb={5}
          {...(isMobile
            ? {}
            : { display: "flex", justifyContent: "space-between" })}
        >
          {query.data && (props.isCreator || topicCategories.length > 0) && (
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
        </Box>
      )}

      {props.children ? (
        props.children({
          currentTopic,
          selectedCategories,
          setSelectedCategories,
          topicModalState,
          setTopicModalState,
          topicCopyModalState,
          setTopicCopyModalState,
        })
      ) : (
        <Box data-cy="topic-list">
          {query.isLoading ? (
            <Spinner />
          ) : !topics.length ? (
            <Alert status="warning" mb={3}>
              <AlertIcon />
              <Flex flexDirection="column">
                {selectedCategories && selectedCategories.length >= 1 ? (
                  <>
                    {selectedCategories && selectedCategories.length >= 1 ? (
                      <>
                        Aucune discussions appartenant :
                        <List listStyleType="square" ml={5}>
                          <ListItem mb={1}>
                            aux catégories :
                            {selectedCategories.map((catId, index) => (
                              <>
                                <TopicCategoryTag key={index} mx={1}>
                                  {getCategoryLabel(topicCategories, catId)}
                                </TopicCategoryTag>
                                {index !== selectedCategories.length - 1 &&
                                  "ou"}
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
                            <TopicCategoryTag>
                              {getCategoryLabel(
                                topicCategories,
                                selectedCategories[0],
                              )}
                            </TopicCategoryTag>
                          </>
                        ) : (
                          <>
                            Aucune discussions appartenant aux catégories
                            {selectedCategories.map((catId, index) => (
                              <>
                                <TopicCategoryTag key={index} mx={1}>
                                  {getCategoryLabel(topicCategories, catId)}
                                </TopicCategoryTag>
                                {index !== selectedCategories.length - 1 &&
                                  "ou"}
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
              const isCurrent = topic._id === currentTopic?._id;
              const isTopicCreator =
                props.isCreator || getRefId(topic) === session?.user.userId;

              return (
                <TopicsListItem
                  key={topic._id}
                  isMobile={isMobile}
                  session={session}
                  isCreator={props.isCreator}
                  query={query}
                  currentTopicName={currentTopicName}
                  topic={topic}
                  topicIndex={topicIndex}
                  isCurrent={isCurrent}
                  isTopicCreator={isTopicCreator}
                  isDark={isDark}
                  //isLoading={isLoading[topic._id] || query.isLoading}
                  //setIsLoading={setIsLoading}
                  selectedCategories={selectedCategories}
                  setSelectedCategories={setSelectedCategories}
                  topicModalState={topicModalState}
                  setTopicModalState={setTopicModalState}
                  topicCopyModalState={topicCopyModalState}
                  setTopicCopyModalState={setTopicCopyModalState}
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
      )}

      {topicModalState.isOpen && (
        <TopicFormModal
          {...topicModalState}
          query={query}
          isCreator={props.isCreator}
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

      {topicCopyModalState.isOpen && (
        <TopicCopyFormModal
          {...topicCopyModalState}
          query={query}
          session={session}
          isCreator={props.isCreator}
          onCancel={onClose}
          onSubmit={async (topic) => {
            // const topicName = normalize(topic.topicName);
            // const url = `${baseUrl}/${topicName}`;
            // await router.push(url, url, { shallow: true });
            //query.refetch();
            onClose();
          }}
          onClose={onClose}
        />
      )}
    </Flex>
  );
};

TopicsList.whyDidYouRender = false;
