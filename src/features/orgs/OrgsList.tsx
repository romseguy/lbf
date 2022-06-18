import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import {
  Flex,
  Box,
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
import React, { useMemo, useState } from "react";
import { css } from "twin.macro";
import { Link } from "features/common";
import { EOrgType, IOrg, orgTypeFull5, OrgTypes } from "models/Org";
import { scrollbarStyles, tableStyles } from "features/layout/theme/theme";
import { SubscribePopover } from "features/subscriptions/SubscribePopover";
import { AppQuery } from "utils/types";
import { ISubscription } from "models/Subscription";
import { MapModal } from "features/modals/MapModal";

export const OrgsList = ({
  query,
  subQuery,
  orgType = EOrgType.NETWORK
}: {
  query: AppQuery<IOrg | IOrg[]>;
  subQuery: AppQuery<ISubscription>;
  orgType?: EOrgType;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const [orgToShow, setOrgToShow] = useState<IOrg | void>();

  let { data, isLoading } = query;
  if (!Array.isArray(data)) data = data?.orgs;

  const [selectedOrder, s] = useState<{ key: string; order: "asc" | "desc" }>();
  const setSelectedOrder = (key: string) => {
    const order = !selectedOrder
      ? "asc"
      : selectedOrder?.key === key && selectedOrder?.order === "asc"
      ? "desc"
      : "asc";
    s({ key, order });
  };

  const orgs = useMemo(
    () =>
      Array.isArray(data)
        ? [...data].sort((a, b) => {
            const key = selectedOrder?.key || "orgName";
            const order = selectedOrder?.order || "asc";
            //@ts-expect-error
            const valueA = a[key]?.toLowerCase() || "";
            //@ts-expect-error
            const valueB = b[key]?.toLowerCase() || "";

            if (order === "asc") {
              if (valueA < valueB) return -1;
              if (valueA > valueB) return 1;
            } else if (order === "desc") {
              if (valueA > valueB) return -1;
              if (valueA < valueB) return 1;
            }

            return 0;
          })
        : [],
    [data, selectedOrder]
  );

  const iconProps = {
    boxSize: 6
  };

  return (
    <Box
      overflowX="auto"
      css={css`
        ${scrollbarStyles}
      `}
    >
      <Table css={css(tableStyles)}>
        <Thead>
          <Tr>
            {[
              { key: "subscription", label: "" },
              {
                key: "orgName",
                label: `Nom de ${orgTypeFull5(orgType)}`
              },
              // { key: "orgType", label: "Type" },
              { key: "orgCity", label: "Position" }
            ].map(({ key, label }) => {
              return (
                <Th
                  color={isDark ? "white" : "black"}
                  key={key}
                  cursor="pointer"
                  onClick={() => setSelectedOrder(key)}
                >
                  <Flex alignItems="center">
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
                  </Flex>
                </Th>
              );
            })}
          </Tr>
        </Thead>

        <Tbody>
          {isLoading ? (
            <Tr>
              <Td colSpan={4}>
                <Spinner />
              </Td>
            </Tr>
          ) : (
            orgs.map((org: IOrg) => {
              if (org.orgUrl === "forum") return;
              return (
                <Tr key={`org-${org._id}`}>
                  <Td>
                    <SubscribePopover
                      org={org}
                      query={query}
                      subQuery={subQuery}
                      isIconOnly
                    />
                  </Td>
                  <Td>
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
                    </Tooltip>
                  </Td>
                  {/* <Td>{OrgTypes[org.orgType]}</Td> */}
                  <Td>
                    <Tooltip hasArrow label="Voir sur la carte" placement="top">
                      <span>
                        <Link
                          variant="underline"
                          onClick={() => setOrgToShow(org)}
                        >
                          {org.orgCity}
                        </Link>
                      </span>
                    </Tooltip>
                  </Td>
                </Tr>
              );
            })
          )}
        </Tbody>
      </Table>

      {orgToShow && (
        <MapModal
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
