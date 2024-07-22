import { Alert, AlertIcon, Flex, Spinner, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useGetOrgsQuery } from "features/api/orgsApi";
import { AppHeading, Column } from "features/common";
import { LoginForm } from "features/forms/LoginForm";
import { Layout } from "features/layout";
import { OrgsList } from "features/orgs/OrgsList";
import { useSession } from "hooks/useSession";
import { wrapper } from "store";
import { selectIsMobile } from "store/uiSlice";
import { PageProps } from "main";
import { EOrgType } from "models/Org";
import { getError } from "utils/query";
import { ErrorPage } from "./_error";

const IndexPage = ({ ...props }: PageProps) => {
  const isMobile = useSelector(selectIsMobile);
  const {
    data: session,
    loading: isSessionLoading,
    setSession,
    setIsSessionLoading
  } = useSession();

  const initialOrgsQueryParams = {
    orgType: EOrgType.NETWORK,
    populate: "orgs orgTopics.topicMessages createdBy"
  };
  const [orgsQueryParams, setOrgsQueryParams] = useState(
    initialOrgsQueryParams
  );
  const orgsQuery = useGetOrgsQuery(orgsQueryParams, {
    selectFromResult: ({ data, ...rest }) => ({
      ...rest,
      orgs: (data || []).filter((org) => true)
    })
  });

  //@ts-ignore
  if (getError(orgsQuery)) return <ErrorPage query={orgsQuery} {...props} />;

  return (
    <Layout
      {...props}
      pageTitle={`Bienvenue ${session ? session.user.userName : ""} !`}
    >
      {session ? (
        <>
          <AppHeading mb={5}>Liste des ateliers LEO</AppHeading>
          {orgsQuery.isLoading ? (
            <Spinner />
          ) : (
            <OrgsList data={orgsQuery.orgs} />
          )}
        </>
      ) : (
        <>
          <LoginForm
            {...props}
            title=""
            //title="Veuillez saisir votre adresse e-mail ci-dessous pour accéder aux ateliers"
          />
        </>
      )}
    </Layout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    return {
      redirect: {
        permanent: false,
        //@ts-ignore
        destination: "/photo"
      }
    };
  }
);

export default IndexPage;
