import {
  SmallAddIcon,
  EditIcon,
  ChevronRightIcon,
  ChevronUpIcon
} from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Badge,
  BadgeProps,
  Button,
  Flex,
  Heading,
  Icon,
  IconButton,
  List,
  ListItem,
  Spinner,
  Text,
  Tooltip,
  useColorMode,
  useDisclosure
} from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { GrWorkshop } from "react-icons/gr";
import {
  FaMapMarkedAlt,
  FaNewspaper,
  FaRecycle,
  FaRegMap,
  FaTree
} from "react-icons/fa";
import { useSelector } from "react-redux";
import {
  Column,
  EditIconButton,
  EntityButton,
  EntityInfo,
  Link,
  TabContainer,
  TabContainerContent,
  TabContainerHeader
} from "features/common";
import { MapModal } from "features/modals/MapModal";
import {
  IOrg,
  getNetworks,
  orgTypeFull,
  EOrgType,
  orgTypeFull2
} from "models/Org";
import { getEmail, ISubscription } from "models/Subscription";
import { useAppDispatch } from "store";
import { selectIsMobile } from "store/uiSlice";
import { getItem, hasItems } from "utils/array";
import { Session } from "utils/auth";
import { normalize, sanitize, transformRTEditorOutput } from "utils/string";
import { AppQuery, AppQueryWithData } from "utils/types";
import { EOrderKey, OrgsList } from "./OrgsList";
import { IsEditConfig } from "./OrgPage";

export const OrgPageHomeTabPanel = ({
  isCreator,
  orgQuery,
  session,
  setIsEdit,
  subQuery
}: {
  isCreator: boolean;
  orgQuery: AppQueryWithData<IOrg>;
  session: Session | null;
  setIsEdit: (arg: boolean | IsEditConfig) => void;
  subQuery: AppQuery<ISubscription>;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const dispatch = useAppDispatch();
  const isMobile = useSelector(selectIsMobile);
  const router = useRouter();
  const badgeProps: BadgeProps = {
    colorScheme: "teal",
    variant: "solid",
    ml: 2
  };

  //#region org
  const org = orgQuery.data;
  const isAttendee =
    session?.user.isAdmin ||
    !!org.orgLists
      .find(({ listName }) => {
        return listName === "Participants";
      })
      ?.subscriptions.find((sub) => getEmail(sub) === session?.user.email);
  const hasInfo =
    hasItems(org.orgAddress) ||
    hasItems(org.orgEmail) ||
    hasItems(org.orgPhone) ||
    hasItems(org.orgWeb);
  const [orgNetworks, setOrgNetworks] = useState<IOrg[]>([]);
  useEffect(() => {
    (async () => {
      if (org.orgType === EOrgType.GENERIC) {
        const networks = await getNetworks(org, session, dispatch);
        setOrgNetworks(networks || []);
      } else setOrgNetworks([]);
    })();
  }, [org]);
  //#endregion

  //#region local state
  const [description, setDescription] = useState<string | undefined>(
    org.orgDescription
  );
  useEffect(() => {
    if (!org.orgDescription) return setDescription(undefined);
    const newDoc = isMobile
      ? transformRTEditorOutput(org.orgDescription)
      : new DOMParser().parseFromString(org.orgDescription, "text/html");
    const newDescription = newDoc.body.innerHTML;
    if (description !== newDescription) setDescription(newDescription);
  }, [org]);
  const [isListOpen, setIsListOpen] = useState(true);
  const [isChildrenOpen, setIsChildrenOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(true);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(true);
  const {
    isOpen: isMapModalOpen,
    onOpen: openMapModal,
    onClose: closeMapModal
  } = useDisclosure({ defaultIsOpen: false });
  const {
    isOpen: isNetworksModalOpen,
    onOpen: openNetworksModal,
    onClose: closeNetworksModal
  } = useDisclosure({ defaultIsOpen: false });
  //#endregion

  // useEffect(() => {
  //   const section = normalize(getItem(router.query.name, 1));
  //   setIsChildrenOpen(section === "foret");
  //   setIsInfoOpen(section === "info");
  // }, [router.asPath]);

  return (
    <>
      {isAttendee && (
        <Link href={`/${org.orgUrl}/galeries`} shallow>
          <Button colorScheme="orange" mb={5}>
            Cliquez ici pour déposer vos photos !
          </Button>
        </Link>
      )}
      <TabContainer borderBottomRadius={isDescriptionOpen ? undefined : "lg"}>
        <TabContainerHeader
          borderBottomRadius={isDescriptionOpen ? undefined : "lg"}
          onClick={() => setIsDescriptionOpen(!isDescriptionOpen)}
        >
          <Icon
            as={isDescriptionOpen ? ChevronUpIcon : ChevronRightIcon}
            boxSize={6}
            ml={3}
            mr={1}
          />

          <Heading size="sm">
            {`${
              org.orgType === EOrgType.TREETOOLS ? "Matériel" : "Description"
            } ${orgTypeFull(org.orgType)}`}
          </Heading>

          {org.orgDescription && isCreator && (
            <Tooltip
              hasArrow
              label="Modifier la description"
              placement="bottom"
            >
              <span>
                <EditIconButton
                  aria-label="Modifier la description"
                  ml={3}
                  {...(isMobile ? {} : {})}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEdit({ isAddingDescription: true });
                  }}
                />
              </span>
            </Tooltip>
          )}
        </TabContainerHeader>

        {isDescriptionOpen && (
          <TabContainerContent
            //bg={isDark ? "gray.600" : "#F7FAFC"}
            p={3}
          >
            {description && description.length > 0 ? (
              <div
                className="rteditor"
                dangerouslySetInnerHTML={{
                  __html: sanitize(description)
                }}
              />
            ) : isCreator ? (
              <Tooltip
                placement="right"
                label={`Ajouter une description ${orgTypeFull2(org.orgType)}`}
              >
                <IconButton
                  aria-label={`Ajouter une description ${orgTypeFull2(
                    org.orgType
                  )}`}
                  alignSelf="flex-start"
                  colorScheme="teal"
                  icon={
                    <>
                      <SmallAddIcon />
                      <FaNewspaper />
                    </>
                  }
                  pr={1}
                  onClick={() => setIsEdit({ isAddingDescription: true })}
                />
              </Tooltip>
            ) : (
              <Text fontStyle="italic">Aucune description.</Text>
            )}
          </TabContainerContent>
        )}
      </TabContainer>

      <TabContainer borderBottomRadius={isInfoOpen ? undefined : "lg"} mb={0}>
        <TabContainerHeader
          borderBottomRadius={isInfoOpen ? undefined : "lg"}
          onClick={
            () => setIsInfoOpen(!isInfoOpen)
            // router.push(
            //   `${org.orgUrl}${isInfoOpen ? "" : "/info"}`,
            //   `${org.orgUrl}${isInfoOpen ? "" : "/info"}`,
            //   { shallow: true }
            // )
          }
        >
          <Icon
            as={isInfoOpen ? ChevronUpIcon : ChevronRightIcon}
            boxSize={6}
            ml={3}
            mr={1}
          />
          <Heading size="sm">Coordonnées {orgTypeFull(org.orgType)}</Heading>
          <Badge {...badgeProps}>
            {org.orgAddress.length +
              org.orgEmail.length +
              org.orgPhone.length +
              org.orgWeb.length}
          </Badge>
          {hasInfo && isCreator && (
            <Tooltip
              hasArrow
              label="Modifier les coordonnées"
              placement="bottom"
            >
              <span>
                <EditIconButton
                  aria-label="Modifier les coordonnées"
                  ml={3}
                  {...(isMobile ? {} : {})}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEdit({ isAddingInfo: true });
                  }}
                />
              </span>
            </Tooltip>
          )}
        </TabContainerHeader>

        {isInfoOpen && (
          <TabContainerContent p={3}>
            {hasInfo ? (
              <EntityInfo org={org} />
            ) : isCreator ? (
              <Tooltip
                placement="right"
                label={`Ajouter des coordonnées ${orgTypeFull2(org.orgType)}`}
              >
                <Button
                  // aria-label={`Ajouter des coordonnées ${orgTypeFull2(
                  //   org.orgType
                  // )}`}
                  alignSelf="flex-start"
                  colorScheme="teal"
                  leftIcon={
                    <>
                      <SmallAddIcon />
                      <FaMapMarkedAlt />
                    </>
                  }
                  pr={1}
                  onClick={() => setIsEdit({ isAddingInfo: true })}
                >
                  {`Ajouter des coordonnées`}
                </Button>
              </Tooltip>
            ) : (
              <Text fontStyle="italic">Aucunes coordonnées.</Text>
            )}
          </TabContainerContent>
        )}
      </TabContainer>
    </>
  );
};
