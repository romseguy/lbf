import { CalendarIcon } from "@chakra-ui/icons";
import { Flex, Icon, Spinner } from "@chakra-ui/react";
import { AppHeading, Column } from "features/common";

import { OrgForm } from "features/forms/OrgForm";
import { Layout } from "features/layout";
import { useSession } from "hooks/useSession";
import { PageProps } from "main";
import { EOrgType, orgTypeFull3 } from "models/Org";
import { useRouter } from "next/router";
import React from "react";
import { FaGlobeEurope, FaTree } from "react-icons/fa";

export const EntityAddPage = ({
  orgType,
  ...props
}: PageProps & { orgType?: EOrgType }) => {
  const router = useRouter();
  const {
    eventName,
    orgId,
    orgName,
  }: { eventName?: string; orgId?: string; orgName?: string } = router.query;
  const { data: session } = useSession();

  const onSubmit = async (url: string) => {
    await router.push(`/${url}`, `/${url}`, {
      shallow: true,
    });
  };

  return (
    <Layout
      {...props}
      pageHeader={
        <Flex alignItems="center">
          <Icon
            as={
              orgType
                ? orgType === EOrgType.NETWORK
                  ? FaGlobeEurope
                  : FaTree
                : CalendarIcon
            }
            color={
              orgType
                ? orgType === EOrgType.NETWORK
                  ? "blue"
                  : "green"
                : undefined
            }
            mr={3}
            boxSize={8}
          />
          <AppHeading>
            Ajouter {!orgType ? "un événement" : orgTypeFull3(orgType)}
          </AppHeading>
        </Flex>
      }
      pageTitle={`Ajouter ${!orgType ? "un événement" : orgTypeFull3(orgType)}`}
    >
      <Column>
        {session ? (
          <>
            {orgType ? (
              <OrgForm
                {...props}
                orgName={orgName}
                orgType={orgType}
                session={session}
                onSubmit={onSubmit}
              />
            ) : null}
          </>
        ) : (
          <Spinner />
        )}
      </Column>
    </Layout>
  );
};
