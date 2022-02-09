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
  Tr
} from "@chakra-ui/react";
import React, { useMemo, useState } from "react";
import { css } from "twin.macro";
import { Link } from "features/common";
import { IOrg, OrgTypes } from "models/Org";
import { scrollbarStyles, tableStyles } from "theme/theme";

export const OrgsList = ({
  data,
  isLoading
}: {
  isLoading: boolean;
  data?: IOrg[];
}) => {
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
              { key: "orgName", label: "Nom" },
              { key: "orgType", label: "Type" },
              { key: "orgCity", label: "Localité" }
            ].map(({ key, label }) => {
              return (
                <Th
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
                    <Link variant="underline" href={`/${org.orgUrl}`} shallow>
                      {org.orgName}
                    </Link>
                  </Td>
                  <Td>{OrgTypes[org.orgType]}</Td>
                  {/* <Td>
                  {org.orgDescription && (
                    <div className="rteditor">
                      <div
                    Rennes    dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(org.orgDescription)
                        }}
                      />
                    </div>
                  )}
                </Td> */}
                  <Td>{org.orgCity}</Td>
                  {/* <Td>{org.orgEmail}</Td> */}
                </Tr>
              );
            })
          )}
        </Tbody>
      </Table>
    </Box>
  );
};
