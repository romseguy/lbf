import { Alert, AlertIcon, Flex, Icon, Spinner } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { FaGlobeEurope, FaTree } from "react-icons/fa";
import { Column, Heading } from "features/common";
import { EventForm } from "features/forms/EventForm";
import { OrgForm } from "features/forms/OrgForm";
import { Layout } from "features/layout";
import { useSession } from "hooks/useSession";
import { PageProps } from "main";
import { EOrgType, orgTypeFull3 } from "models/Org";
import { CalendarIcon } from "@chakra-ui/icons";

export const EntityAddPage = ({
  orgType,
  ...props
}: PageProps & { orgType?: EOrgType }) => {
  const router = useRouter();
  const { orgId }: { orgId?: string } = router.query;
  const { data } = useSession();
  const session = data || props.session;

  const onSubmit = async (url: string) => {
    await router.push(`/${url}`, `/${url}`, {
      shallow: true
    });
    localStorage.removeItem("storageKey");
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
                : "black"
            }
            mr={3}
            boxSize={8}
          />
          <Heading>
            Ajouter {!orgType ? "un événement" : orgTypeFull3(orgType)}
          </Heading>
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
                session={session}
                orgType={orgType}
                onSubmit={onSubmit}
              />
            ) : (
              <EventForm
                {...props}
                session={session}
                orgId={orgId}
                onSubmit={onSubmit}
              />
            )}
          </>
        ) : (
          <Spinner />
        )}
      </Column>
    </Layout>
  );
};
