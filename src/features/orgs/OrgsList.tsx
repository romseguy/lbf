import { Spinner, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import DOMPurify from "dompurify";
import { Link } from "features/common";
import { IOrg } from "models/Org";
import React from "react";

export const OrgsList = ({ orgsQuery }: { orgsQuery: any }) => {
  return (
    <Table>
      <Thead>
        <Tr>
          <Th>Nom</Th>
          {/* <Th>Description</Th> */}
          <Th>Adresse</Th>
          <Th>E-mail</Th>
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
          orgsQuery.data?.map((org: IOrg) => {
            if (org.orgName === "aucourant") return;
            return (
              <Tr key={`org-${org._id}`}>
                <Td>
                  <Link variant="underline" href={`/${org.orgUrl}`}>
                    {org.orgName}
                  </Link>
                </Td>
                {/* <Td>
                  {org.orgDescription && (
                    <div className="ql-editor">
                      <div
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(org.orgDescription)
                        }}
                      />
                    </div>
                  )}
                </Td> */}
                <Td>{org.orgCity}</Td>
                <Td>{org.orgEmail}</Td>
              </Tr>
            );
          })
        )}
      </Tbody>
    </Table>
  );
};
