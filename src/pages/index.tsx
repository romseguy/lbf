import { Flex, Spinner, Switch } from "@chakra-ui/react";
import { getRunningQueriesThunk } from "features/api";
import { getOrgs, useGetOrgsQuery } from "features/api/orgsApi";
import { AppHeading, Column, EntityAddButton } from "features/common";
import { Layout } from "features/layout";
import { EOrderKey, OrgsList } from "features/orgs/OrgsList";
import { useSession } from "hooks/useSession";
import { PageProps } from "main";
import { EOrgType, EOrgVisibility } from "models/Org";
import React, { useState } from "react";
import { wrapper } from "store";

const initialOrgsQueryParams = {
  orgType: EOrgType.NETWORK,
  //populate: "orgs orgTopics.topicMessages createdBy"
  populate: "orgTopics.topicMessages",
};

const IndexPage = (props: PageProps) => {
  const { data: session } = useSession();

  const orgsQuery = useGetOrgsQuery(initialOrgsQueryParams, {
    selectFromResult: ({ data, ...query }) => {
      return {
        ...query,
        data,
        front: data?.filter(
          (org) => org.orgVisibility === EOrgVisibility.FRONT,
        ),
        public: data?.filter(
          (org) => org.orgVisibility === EOrgVisibility.PUBLIC,
        ),
      };
    },
  });

  const myOrgsQuery = useGetOrgsQuery({
    orgType: EOrgType.NETWORK,
    createdBy: session?.user.userId,
    populate: "orgTopics.topicMessages",
  });

  const [data, setData] = useState(orgsQuery.front);
  const [isChecked, setIsChecked] = useState(false);

  return (
    <Layout {...props} mainContainer={false} pageTitle="Accueil">
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
                <AppHeading mb={5}>Vos planètes</AppHeading>

                <OrgsList
                  data={myOrgsQuery.data.filter((org) => {
                    return !org.isArchived;
                  })}
                  keys={(orgType) => [
                    {
                      key: EOrderKey.orgName,
                      label: `Nom`,
                    },
                    {
                      key: EOrderKey.latestActivity,
                      label: "Dernier message",
                    },
                  ]}
                />

                <Flex justifyContent="center">
                  <EntityAddButton
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
                      label: `Nom`,
                    },
                    {
                      key: EOrderKey.latestActivity,
                      label: "Dernier message",
                    },
                  ]}
                />

                <Flex justifyContent="center">
                  <EntityAddButton
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
      props: {},
    };
  },
);

export default IndexPage;
