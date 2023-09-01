import { Alert, AlertIcon, Spinner } from "@chakra-ui/react";
import bcrypt from "bcryptjs";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getRunningQueriesThunk } from "features/api";
import {
  getEvent,
  GetEventParams,
  //getRunningQueriesThunk as eventApiThunk,
  useGetEventQuery
} from "features/api/eventsApi";
import {
  getOrg,
  GetOrgParams,
  //getRunningQueriesThunk as orgApiThunk,
  useGetOrgQuery
} from "features/api/orgsApi";
import { useGetSubscriptionQuery } from "features/api/subscriptionsApi";
import {
  //getRunningQueriesThunk as userApiThunk,
  getUser,
  useGetUserQuery,
  UserQueryParams
} from "features/api/usersApi";
import { Column, NotFound } from "features/common";
import { Layout } from "features/layout";
import { EventPage } from "features/events/EventPage";
import { OrgPage } from "features/orgs/OrgPage";
import { OrgPageLogin } from "features/orgs/OrgPageLogin";
import { UserPage } from "features/users/UserPage";
import { useSession } from "hooks/useSession";
import { PageProps } from "main";
import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { ISubscription } from "models/Subscription";
import { IUser } from "models/User";
import { wrapper } from "store";
import { selectUserEmail } from "store/userSlice";
import { isServer } from "utils/isServer";
import { defaultErrorMessage, normalize } from "utils/string";
import { AppQuery, AppQueryWithData } from "utils/types";
import { getRefId } from "models/Entity";

const initialEventQueryParams = (entityUrl: string) => ({
  eventUrl: entityUrl,
  populate: "eventOrgs"
});
const initialOrgQueryParams = (entityUrl: string) => ({
  orgUrl: entityUrl,
  populate:
    "orgBanner orgEvents orgLogo orgLists orgProjects orgSubscriptions orgTopics orgs"
});
const initialUserQueryParams = (entityUrl: string) => ({
  slug: entityUrl
});
const subQueryParams = (email: string) => ({
  email
});

const HashPage = ({ ...props }: PageProps) => {
  const columnProps = {
    maxWidth: "4xl",
    m: "0 auto",
    p: props.isMobile ? 2 : 3
  };
  const router = useRouter();
  const { data: session } = useSession();
  console.log("🚀 ~ file: [...name].tsx:69 ~ HashPage ~ session:", session);
  const userEmail = useSelector(selectUserEmail);
  //const [isLoading, setIsLoading] = useState(props.isLoading && !!session);

  //#region routing
  let [entityUrl, entityTab = "accueil", entityTabItem] =
    "name" in router.query && Array.isArray(router.query.name)
      ? router.query.name
      : [];
  entityTabItem = entityUrl === "forum" ? entityTab : entityTabItem;
  //#endregion

  //#region queries
  const [eventQueryParams, setEventQueryParams] = useState<GetEventParams>(
    initialEventQueryParams(entityUrl)
  );
  const [orgQueryParams, setOrgQueryParams] = useState<GetOrgParams>(
    initialOrgQueryParams(entityUrl)
  );
  console.log(
    "🚀 ~ file: [...name].tsx:81 ~ HashPage ~ orgQueryParams:",
    orgQueryParams
  );
  // const [userQueryParams, setUserQueryParams] = useState<UserQueryParams>(
  //   initialUserQueryParams(entityUrl)
  // );
  const [skip, setSkip] = useState(false);
  const eventQuery = useGetEventQuery(eventQueryParams, {
    skip
  }) as AppQuery<IEvent>;
  const orgQuery = useGetOrgQuery(orgQueryParams, { skip }) as AppQuery<IOrg>;
  console.log("🚀 ~ file: [...name].tsx:99 ~ HashPage ~ orgQuery:", orgQuery);
  // console.log(
  //   "🚀 ~ file: [...name].tsx:90 ~ HashPage ~ orgQuery.data?.orgDescription:",
  //   orgQuery.data?.orgDescription
  // );
  const subQuery = useGetSubscriptionQuery(
    subQueryParams(userEmail)
  ) as AppQuery<ISubscription>;
  const userQuery = useGetUserQuery(
    {
      slug: entityUrl,
      populate:
        session?.user.userName === entityUrl ? "userProjects" : undefined
    },
    { skip }
  ) as AppQuery<IUser>;
  const eventQueryStatus = eventQuery.error?.status || 200;
  console.log(
    "🚀 ~ file: [...name].tsx:112 ~ HashPage ~ eventQueryStatus:",
    eventQueryStatus
  );
  const orgQueryStatus = orgQuery.error?.status || 200;
  console.log(
    "🚀 ~ file: [...name].tsx:103 ~ HashPage ~ orgQueryStatus:",
    orgQueryStatus
  );
  const userQueryStatus = userQuery.error?.status || 200;
  console.log(
    "🚀 ~ file: [...name].tsx:118 ~ HashPage ~ userQueryStatus:",
    userQueryStatus
  );
  //#endregion

  //#region effects
  // useEffect(() => {
  //   if (
  //     props.isLoading ||
  //     (orgQuery.data &&
  //       !orgQuery.data._id &&
  //       session?.user.userId === getRefId(orgQuery.data))
  //   ) {
  //     orgQuery.refetch()
  //   }
  // }, []);
  useEffect(
    function onNavigate() {
      if (entityUrl !== orgQueryParams.orgUrl) {
        console.log(
          "🚀 ~ file: [...name].tsx:129 ~ onNavigate ~ entityUrl:",
          entityUrl
        );
        setOrgQueryParams({ ...orgQueryParams, orgUrl: entityUrl });
        setEventQueryParams({ ...eventQueryParams, eventUrl: entityUrl });
        //setUserQueryParams({ ...userQueryParams, slug: entityUrl });
      }
    },
    [entityUrl]
  );
  useEffect(() => {
    if (!orgQuery.data?._id) {
      const isCreator = session?.user.userId === getRefId(orgQuery.data);

      if (isCreator) {
        orgQuery.refetch();
      }
    }
  }, []);
  // useEffect(() => {
  //   if (orgQuery.data?._id && isLoading) setIsLoading(false);
  // }, [orgQuery.data]);
  //#endregion

  //#region rendering
  // if (isLoading)
  //   return (
  //     <Layout {...props}>
  //       <Spinner />
  //     </Layout>
  //   );

  if (orgQueryStatus === 404 && orgQueryParams.orgUrl === "forum") {
    return (
      <NotFound
        {...props}
        isRedirect={false}
        message="Veuillez ajouter la planète forum."
      />
    );
  }

  if (
    eventQueryStatus === 404 &&
    orgQueryStatus === 404 &&
    userQueryStatus === 404
  ) {
    return <NotFound {...props} />;
  }

  if (eventQuery.data) {
    return (
      <EventPage
        {...props}
        eventQuery={eventQuery as AppQueryWithData<IEvent>}
        subQuery={subQuery}
        tab={entityTab}
        tabItem={entityTabItem}
      />
    );
  } else if (
    eventQuery.error &&
    eventQueryStatus !== 404 &&
    userQuery.error &&
    orgQuery.error
  ) {
    return (
      <Layout {...props}>
        <Column {...columnProps}>
          {defaultErrorMessage}
          <Alert status="error">
            <AlertIcon />
            {eventQuery.error.data.message}
          </Alert>
        </Column>
      </Layout>
    );
  }

  if (userQuery.data) {
    return (
      <UserPage {...props} userQuery={userQuery as AppQueryWithData<IUser>} />
    );
  } else if (userQuery.error && userQueryStatus !== 404 && orgQuery.error) {
    return (
      <Layout {...props}>
        <Column {...columnProps}>
          {defaultErrorMessage}
          <Alert status="error">
            <AlertIcon />
            {userQuery.error.data.message}
          </Alert>
        </Column>
      </Layout>
    );
  }

  if (orgQuery.data) {
    if (orgQuery.data._id) {
      return (
        <OrgPage
          {...props}
          orgQuery={orgQuery as AppQueryWithData<IOrg>}
          subQuery={subQuery}
          tab={entityTab}
          tabItem={entityTabItem}
        />
      );
    }

    return (
      <OrgPageLogin
        {...props}
        orgQuery={orgQuery as AppQueryWithData<IOrg>}
        status={orgQueryStatus}
        onSubmit={async (orgPassword) => {
          const hash = bcrypt.hashSync(orgPassword, orgQuery.data!.orgSalt);
          setOrgQueryParams({ ...orgQueryParams, hash });
        }}
      />
    );
  } else if (orgQuery.error) {
    return (
      <Layout {...props}>
        <Column {...columnProps}>
          {defaultErrorMessage}
          <Alert status="error">
            <AlertIcon />
            {orgQuery.error.data.message}
          </Alert>
        </Column>
      </Layout>
    );
  }
  //#endregion

  return (
    <Layout {...props}>
      <Column {...columnProps}>
        <Spinner />
      </Column>
    </Layout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    if (
      Array.isArray(ctx.query.name) &&
      typeof ctx.query.name[0] === "string"
    ) {
      const entityUrl = ctx.query.name[0];
      const normalizedEntityUrl = normalize(entityUrl);

      if (
        normalizedEntityUrl === "api" ||
        normalizedEntityUrl === "icons" ||
        normalizedEntityUrl.includes("worker")
      )
        return {
          redirect: {
            permanent: false,
            destination: "/"
          }
        };

      if (entityUrl !== normalizedEntityUrl)
        return {
          redirect: {
            permanent: false,
            destination: normalizedEntityUrl
          }
        };

      // todo: pass ctx.req.headers.cookie
      store.dispatch(getOrg.initiate(initialOrgQueryParams(entityUrl)));
      store.dispatch(getEvent.initiate(initialEventQueryParams(entityUrl)));
      store.dispatch(getUser.initiate(initialUserQueryParams(entityUrl)));
      await Promise.all(store.dispatch(getRunningQueriesThunk()));

      // if (typeof ctx.query.name[1] === "string") {
      //   return {
      //     props: { entityTab: ctx.query.name[1] }
      //   };
      // }
    }

    return { props: {} };
  }
);

// export async function getServerSideProps( ctx: GetServerSidePropsContext): Promise<{ props?: {}; redirect?: { permanent: boolean; destination: string }; }> {}

export default HashPage;
