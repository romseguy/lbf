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
import DOMPurify from "dompurify";
import { Link } from "features/common";
import { IOrg, OrgTypesV } from "models/Org";
import React, { useMemo, useState } from "react";

export const OrgsList = ({
  orgsQuery
}: {
  orgsQuery: {
    isLoading: boolean;
    data?: IOrg[];
  };
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
      Array.isArray(orgsQuery.data)
        ? [...orgsQuery.data].sort((a, b) => {
            const key = selectedOrder?.key || "orgName";
            const order = selectedOrder?.order || "asc";
            //@ts-expect-error
            const valueA = a[key] || "";
            //@ts-expect-error
            const valueB = b[key] || "";

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
    [orgsQuery.data, selectedOrder]
  );

  const iconProps = {
    boxSize: 6
  };

  return (
    <Box overflowX="auto">
      <Table>
        <Thead>
          <Tr>
            {[
              { key: "orgName", label: "Nom" },
              { key: "orgType", label: "Type" },
              { key: "orgCity", label: "Ville" }
            ].map(({ key, label }) => {
              return (
                <Th cursor="pointer" onClick={() => setSelectedOrder(key)}>
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
          {orgsQuery.isLoading ? (
            <Tr>
              <Td colSpan={4}>
                <Spinner />
              </Td>
            </Tr>
          ) : (
            orgs.map((org: IOrg) => {
              if (org.orgName === "aucourant") return;
              return (
                <Tr key={`org-${org._id}`}>
                  <Td>
                    <Link variant="underline" href={`/${org.orgUrl}`}>
                      {org.orgName}
                    </Link>
                  </Td>
                  <Td>{OrgTypesV[org.orgType]}</Td>
                  {/* <Td>
                  {org.orgDescription && (
                    <div className="ql-editor">
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
