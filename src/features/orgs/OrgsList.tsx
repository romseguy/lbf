import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Icon,
  IconButton,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Tooltip,
  useColorMode
} from "@chakra-ui/react";
import {
  compareAsc,
  compareDesc,
  intervalToDuration,
  parseISO
} from "date-fns";
import React, { useMemo, useState } from "react";
import { FaMapMarkedAlt, FaLeaf } from "react-icons/fa";
import { IoIosGitBranch } from "react-icons/io";
import { css } from "twin.macro";
import { EntityButton } from "features/common";
import { scrollbarCss } from "features/layout/theme";
import { MapModal } from "features/modals/MapModal";
import { SubscribePopover } from "features/subscriptions/SubscribePopover";
import { EOrgType, IOrg, orgTypeFull } from "models/Org";
import { ISubscription } from "models/Subscription";
import { ITopic } from "models/Topic";
import { IUser } from "models/User";
import { selectIsMobile } from "store/uiSlice";
import { timeAgo } from "utils/date";
import { AppQuery } from "utils/types";
import { useSelector } from "react-redux";
import { hasItems } from "utils/array";

export enum EOrderKey {
  "createdBy" = "createdBy",
  "icon" = "icon",
  "latestActivity" = "latestActivity",
  "orgName" = "orgName",
  "subscription" = "subscription"
}

const defaultKeys = (orgType: EOrgType) => [
  // {
  //   key: "subscription",
  //   label: ""
  // },
  {
    key: EOrderKey.orgName,
    label: `Nom de ${orgTypeFull(orgType)}`
  },
  // { key: "orgType", label: "Type" },
  // { key: "orgCity", label: "Position" },
  {
    key: EOrderKey.createdBy,
    label: "Créé par"
  }
];

const iconProps = {
  boxSize: 6,
  mt: -1
};

export const OrgsList = ({
  //query,
  data,
  subQuery,
  orgType = EOrgType.NETWORK,
  ...props
}: {
  data: IOrg[];
  keys?: (queryorgType: EOrgType) => {
    key: EOrderKey;
    label: string;
  }[];
  //query: AppQuery<IOrg | IOrg[]>;
  subQuery?: AppQuery<ISubscription>;
  orgType?: EOrgType;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const isMobile = useSelector(selectIsMobile);

  const [selectedOrder, _setSelectedOrder] = useState<{
    key: EOrderKey;
    order: "asc" | "desc";
  }>({
    key: EOrderKey.latestActivity,
    order: "asc"
  });
  const setSelectedOrder = (key: EOrderKey) => {
    const order = !selectedOrder
      ? "asc"
      : selectedOrder?.key === key && selectedOrder?.order === "asc"
      ? "desc"
      : "asc";
    _setSelectedOrder({ key, order });
  };

  const orgsMetadata = useMemo(() => {
    const record: Record<
      string,
      {
        latestMessageCreatedAt: Date;
        latestMessageUpdatedAt: Date;
        latestTopic: ITopic;
      }
    > = {};

    if (!Array.isArray(data)) return record;

    for (const org of data) {
      if (hasItems(org.orgTopics)) {
        for (const orgTopic of org.orgTopics) {
          for (const orgTopicMessage of orgTopic.topicMessages || []) {
            const createdAt = parseISO(orgTopicMessage.createdAt || "");
            const updatedAt = parseISO(orgTopicMessage.updatedAt || "");
            const saved = record[org._id];

            if (!saved) {
              record[org._id] = {
                latestMessageCreatedAt: createdAt,
                latestMessageUpdatedAt: updatedAt,
                latestTopic: orgTopic
              };
            } else {
              // if createdAt is before saved createdAt
              if (compareDesc(createdAt, saved.latestMessageCreatedAt)) {
                saved.latestMessageCreatedAt = createdAt;
                saved.latestTopic = orgTopic;
              }
              // if updatedAt is before saved updatedAt
              if (compareDesc(updatedAt, saved.latestMessageUpdatedAt)) {
                saved.latestMessageUpdatedAt = updatedAt;
                saved.latestTopic = orgTopic;
              }
            }
          }
        }
      }
    }
    return record;
  }, [data]);

  const orgs = useMemo(() => {
    if (!Array.isArray(data)) return [];

    if (selectedOrder?.key === EOrderKey.latestActivity) {
      const orgsWithMetadata = data
        .filter((org) => !!orgsMetadata[org._id])
        .sort((a, b) => {
          const dateA =
            orgsMetadata[a._id][
              "latestMessageCreatedAt"
              // compareAsc(
              //   orgsMetadata[a._id].latestMessageCreatedAt,
              //   orgsMetadata[a._id].latestMessageUpdatedAt
              // ) === 0
              //   ? "latestMessageCreatedAt"
              //   : "latestMessageUpdatedAt"
            ];
          const dateB =
            orgsMetadata[b._id][
              "latestMessageCreatedAt"
              // compareAsc(
              //   orgsMetadata[b._id].latestMessageCreatedAt,
              //   orgsMetadata[b._id].latestMessageUpdatedAt
              // ) === 0
              //   ? "latestMessageCreatedAt"
              //   : "latestMessageUpdatedAt"
            ];
          const compare =
            selectedOrder.order === "asc" ? compareDesc : compareAsc;
          return compare(dateA, dateB);
        });
      const orgsWithoutMetadata = data.filter((org) => !orgsMetadata[org._id]);
      return orgsWithMetadata.concat(orgsWithoutMetadata);
    }

    return [...data].sort((a, b) => {
      const key: keyof IOrg = selectedOrder?.key || "orgName";
      const order = selectedOrder?.order || "asc";

      let valueA: IUser | string | undefined = a[key];
      if (typeof valueA === "string") valueA = valueA.toLowerCase();
      else valueA = valueA?.userName.toLowerCase();

      let valueB: IUser | string | undefined = b[key];
      if (typeof valueB === "string") valueB = valueB.toLowerCase();
      else valueB = valueB?.userName.toLowerCase();

      if (valueA && valueB) {
        if (order === "asc") {
          if (valueA < valueB) return -1;
          if (valueA > valueB) return 1;
        } else if (order === "desc") {
          if (valueA > valueB) return -1;
          if (valueA < valueB) return 1;
        }
      }

      return 0;
    });
  }, [data, selectedOrder]);

  const keys = props.keys ? props.keys(orgType) : defaultKeys(orgType);
  const [orgToShow, setOrgToShow] = useState<IOrg | void>();

  return (
    <Box
      overflowX="auto"
      css={css`
        ${scrollbarCss}
      `}
    >
      <Table
        colorScheme="teal"
        css={css`
          th {
            font-size: ${isMobile ? "11px" : "inherit"};
            padding: ${isMobile ? 0 : "4px"};
          }
          td {
            padding: ${isMobile ? "8px 0" : "8px"};
            padding-right: ${isMobile ? "4px" : "8px"};
            button {
              font-size: ${isMobile ? "13px" : "inherit"};
            }
          }
        `}
      >
        <Thead>
          <Tr>
            {keys.map(({ key, label }) => {
              return (
                <Th
                  key={key}
                  color={isDark ? "white" : "black"}
                  cursor="pointer"
                  onClick={() => setSelectedOrder(key)}
                >
                  {label}

                  {selectedOrder ? (
                    selectedOrder.key === key ? (
                      selectedOrder.order === "desc" ? (
                        <ChevronUpIcon {...iconProps} />
                      ) : (
                        <ChevronDownIcon {...iconProps} />
                      )
                    ) : (
                      ""
                    )
                  ) : key === "orgName" ? (
                    <ChevronDownIcon {...iconProps} />
                  ) : (
                    ""
                  )}
                </Th>
              );
            })}
          </Tr>
        </Thead>

        <Tbody>
          {orgs.map((org: IOrg) => {
            const { latestMessageCreatedAt, latestTopic } =
              orgsMetadata[org._id] || {};

            return (
              <Tr key={`org-${org._id}`}>
                {keys.find(({ key }) => key === "icon") && (
                  <Td p={isMobile ? 0 : undefined}>
                    <Icon
                      as={
                        org.orgType === EOrgType.NETWORK
                          ? IoIosGitBranch
                          : FaLeaf
                      }
                      color={
                        org.orgType === EOrgType.NETWORK
                          ? "blue.500"
                          : "green.500"
                      }
                    />
                  </Td>
                )}

                {keys.find(({ key }) => key === EOrderKey.subscription) &&
                  subQuery && (
                    <Td p={isMobile ? 0 : undefined}>
                      <SubscribePopover
                        org={org}
                        //query={query}
                        subQuery={subQuery}
                        isIconOnly
                        my={isMobile ? 2 : 0}
                        mr={isMobile ? 2 : 0}
                      />
                    </Td>
                  )}

                {keys.find(({ key }) => key === EOrderKey.orgName) && (
                  <Td>
                    {/* {org.orgType === EOrgType.TREETOOLS
                        ? OrgTypes[org.orgType] + " : "
                        : ""}
                      <Tooltip
                        hasArrow
                        label={`Visiter ${orgTypeFull5(org.orgType)}`}
                        placement="top"
                      >
                        <span>
                          <Link
                            variant="underline"
                            href={`/${org.orgUrl}`}
                            shallow
                          >
                            {org.orgName}
                          </Link>
                        </span>
                      </Tooltip> */}
                    <EntityButton
                      org={org}
                      backgroundColor={isDark ? "whiteAlpha.300" : undefined}
                    />

                    {/* {org.orgCity && (
                        <Tooltip label="Afficher sur la carte" placement="top">
                          <IconButton
                            aria-label="Afficher sur la carte"
                            icon={<FaMapMarkedAlt />}
                            ml={2}
                            onClick={() => setOrgToShow(org)}
                          />
                        </Tooltip>
                      )} */}
                  </Td>
                )}

                {keys.find(({ key }) => key === EOrderKey.latestActivity) && (
                  <Td>
                    {latestTopic && (
                      <EntityButton
                        org={org}
                        topic={latestTopic}
                        backgroundColor={isDark ? "whiteAlpha.300" : undefined}
                      >
                        {latestTopic.topicName}
                        <Badge
                          bgColor={isDark ? "teal.600" : "teal.100"}
                          color={isDark ? "white" : "black"}
                          variant="solid"
                          ml={1}
                        >
                          {timeAgo(latestMessageCreatedAt, true).timeAgo}
                          {/* {"" + latestMessageCreatedAt} */}
                          {/* {"" +
                              intervalToDuration({
                                start: new Date(),
                                end: latestMessageCreatedAt
                              })} */}
                        </Badge>
                      </EntityButton>
                    )}
                  </Td>
                )}

                {keys.find(({ key }) => key === EOrderKey.createdBy) && (
                  <Td>
                    <EntityButton
                      backgroundColor={isDark ? "whiteAlpha.500" : undefined}
                      user={{ userName: (org.createdBy as IUser).userName }}
                      tooltipProps={{ placement: "top" }}
                    />
                  </Td>
                )}
              </Tr>
            );
          })}
        </Tbody>
      </Table>

      {orgToShow && (
        <MapModal
          header={
            <>
              <Icon as={IoIosGitBranch} color="blue" mr={2} />{" "}
              {orgToShow.orgName}
            </>
          }
          isOpen
          isSearch={false}
          orgs={[orgToShow]}
          center={{
            lat: orgToShow.orgLat,
            lng: orgToShow.orgLng
          }}
          zoomLevel={16}
          onClose={() => setOrgToShow()}
        />
      )}
    </Box>
  );
};
