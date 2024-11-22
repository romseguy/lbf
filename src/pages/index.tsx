import {
  Flex,
  Heading,
  HStack,
  Select,
  Spinner,
  Switch,
  useColorMode,
  useDisclosure
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { getRunningQueriesThunk } from "features/api";
import { getOrgs, useGetOrgsQuery } from "features/api/orgsApi";
import {
  Column,
  EntityAddButton,
  AppHeading,
  Delimiter
} from "features/common";
import { Layout } from "features/layout";
import { MapModal } from "features/modals/MapModal";
import { EOrderKey, OrgsList } from "features/orgs/OrgsList";
import { useSession } from "hooks/useSession";
import { PageProps } from "main";
import { EOrgType, EOrgVisibility } from "models/Org";
import { hasItems } from "utils/array";
import { wrapper } from "store";
import { useGetUsersQuery } from "features/api/usersApi";
import { getRefId } from "models/Entity";
import { StarIcon } from "@chakra-ui/icons";

const initialOrgsQueryParams = {
  orgType: EOrgType.NETWORK,
  //populate: "orgs orgTopics.topicMessages createdBy"
  populate: "orgTopics.topicMessages"
};

const IndexPage = (props: PageProps) => {
  const { data: session } = useSession();

  const orgsQuery = useGetOrgsQuery(initialOrgsQueryParams, {
    selectFromResult: ({ data, ...query }) => {
      return {
        ...query,
        data,
        front: data?.filter(
          (org) => org.orgVisibility === EOrgVisibility.FRONT
        ),
        public: data?.filter(
          (org) => org.orgVisibility === EOrgVisibility.PUBLIC
        )
      };
    }
  });

  const myOrgsQuery = useGetOrgsQuery({
    orgType: EOrgType.NETWORK,
    createdBy: session?.user.userId,
    populate: "orgTopics.topicMessages"
  });

  const [data, setData] = useState(orgsQuery.front);
  const [isChecked, setIsChecked] = useState(false);

  return (
    <Layout {...props} mainContainer={false} pageTitle="Accueil">
      <Column
        {...(props.isMobile
          ? { bg: "transparent", p: 1, pt: 0, mt: 3, mb: 5, mx: 1 }
          : { mx: 3, mb: 5 })}
      >
        {orgsQuery.isLoading && <Spinner />}

        {Array.isArray(data) && data.length > 0 && (
          <>
            <Switch
              display="flex"
              alignItems="center"
              fontSize="lg"
              size="lg"
              mb={5}
              isChecked={isChecked}
              onChange={(e) => {
                if (isChecked) {
                  setData(orgsQuery.front);
                  setIsChecked(false);
                } else {
                  setData(orgsQuery.data);
                  setIsChecked(true);
                }
              }}
              {...(props.isMobile ? { m: 5 } : {})}
            >
              Afficher tous les forums public ?
            </Switch>

            <OrgsList
              data={data}
              keys={(orgType) => [
                {
                  key: EOrderKey.orgName,
                  label: `Nom du forum`
                },
                {
                  key: EOrderKey.latestActivity,
                  label: "Dernier message"
                }
              ]}
            />
          </>
        )}

        <Flex justifyContent="center">
          <EntityAddButton
            label="Ajoutez un forum"
            orgType={EOrgType.NETWORK}
            mt={data && data.length > 0 ? (props.isMobile ? 1 : 5) : 0}
          />
        </Flex>
      </Column>

      {session && (
        <>
          {myOrgsQuery.isLoading && <Spinner />}

          {Array.isArray(myOrgsQuery.data) && myOrgsQuery.data.length > 0 && (
            <>
              <Column
                {...(props.isMobile
                  ? { bg: "transparent", p: 1, my: 5, mx: 1 }
                  : { mx: 3, mb: 5 })}
              >
                <AppHeading mb={5}>Vos forums</AppHeading>

                <OrgsList
                  data={myOrgsQuery.data.filter((org) => {
                    return !org.isArchived;
                  })}
                  keys={(orgType) => [
                    {
                      key: EOrderKey.orgName,
                      label: `Nom du forum`
                    },
                    {
                      key: EOrderKey.latestActivity,
                      label: "Dernier message"
                    }
                  ]}
                />

                <Flex justifyContent="center">
                  <EntityAddButton
                    label="Ajoutez un forum"
                    orgType={EOrgType.NETWORK}
                    mt={props.isMobile ? 1 : 5}
                  />
                </Flex>
              </Column>

              <Column
                {...(props.isMobile
                  ? { bg: "transparent", p: 1, mt: 5, mx: 1 }
                  : { mx: 3, mb: 5 })}
              >
                <AppHeading mb={5}>Vos archives</AppHeading>

                <OrgsList
                  data={myOrgsQuery.data.filter((org) => {
                    return org.isArchived;
                  })}
                  keys={(orgType) => [
                    {
                      key: EOrderKey.orgName,
                      label: `Nom du forum`
                    },
                    {
                      key: EOrderKey.latestActivity,
                      label: "Dernier message"
                    }
                  ]}
                />

                <Flex justifyContent="center">
                  <EntityAddButton
                    label="Ajoutez un forum"
                    orgType={EOrgType.NETWORK}
                    mt={props.isMobile ? 1 : 5}
                  />
                </Flex>
              </Column>
            </>
          )}
        </>
      )}
    </Layout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    store.dispatch(getOrgs.initiate(initialOrgsQueryParams));
    await Promise.all(store.dispatch(getRunningQueriesThunk()));

    return {
      props: {}
    };
  }
);

export default IndexPage;
