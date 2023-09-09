import { Alert, AlertIcon, Box, Spinner } from "@chakra-ui/react";
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
  useGetUserQuery
} from "features/api/usersApi";
import { Column, EntityAddButton, NotFound } from "features/common";
import { Layout } from "features/layout";
import { EventPage } from "features/events/EventPage";
import { OrgPage } from "features/orgs/OrgPage";
import { OrgPageLogin } from "features/orgs/OrgPageLogin";
import { UserPage } from "features/users/UserPage";
import { useSession } from "hooks/useSession";
import { PageProps } from "main";
import { IEvent } from "models/Event";
import { EOrgType, IOrg } from "models/Org";
import { ISubscription } from "models/Subscription";
import { IUser } from "models/User";
import { wrapper } from "store";
import { selectUserEmail } from "store/userSlice";
import { defaultErrorMessage, normalize } from "utils/string";
import { AppQuery, AppQueryWithData } from "utils/types";
import { IEntity } from "models/Entity";

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

function getError(query: AppQuery<IEntity>) {
  if (query.error) {
    if (query.error.data) {
      return query.error.data.message;
    }

    if (query.error.error) return query.error.error;
  }
}

const ErrorPage = ({
  query,
  ...props
}: PageProps & {
  query: AppQuery<IEntity>;
}) => {
  const columnProps = {
    maxWidth: "4xl",
    m: "0 auto",
    p: props.isMobile ? 2 : 3
  };
  return (
    <Layout {...props}>
      <Column {...columnProps}>
        {defaultErrorMessage}
        <Alert status="error">
          <AlertIcon />
          {getError(query)}
        </Alert>
      </Column>
    </Layout>
  );
};

const HashPage = ({ ...props }: PageProps) => {
  const columnProps = {
    maxWidth: "4xl",
    m: "0 auto",
    p: props.isMobile ? 2 : 3
  };
  const router = useRouter();
  const { data: session } = useSession();
  const userEmail = useSelector(selectUserEmail);
  //const [isLoading, setIsLoading] = useState(props.isLoading && !!session);

  //#region routing
  let [entityUrl, entityTab = "accueil", entityTabItem] =
    "name" in router.query && Array.isArray(router.query.name)
      ? router.query.name
      : [];
  //entityTabItem = entityUrl === "forum" ? entityTab : entityTabItem;
  //#endregion

  //#region queries
  const [eventQueryParams, setEventQueryParams] = useState<GetEventParams>(
    initialEventQueryParams(entityUrl)
  );
  const [orgQueryParams, setOrgQueryParams] = useState<GetOrgParams>(
    initialOrgQueryParams(entityUrl)
  );
  // const [userQueryParams, setUserQueryParams] = useState<UserQueryParams>(
  //   initialUserQueryParams(entityUrl)
  // );
  const [skip, setSkip] = useState(false);
  const eventQuery = useGetEventQuery(eventQueryParams, {
    skip
  }) as AppQuery<IEvent>;
  const orgQuery = useGetOrgQuery(orgQueryParams, { skip }) as AppQuery<IOrg>;
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
  const orgQueryStatus = orgQuery.error?.status || 200;
  const userQueryStatus = userQuery.error?.status || 200;
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
        setOrgQueryParams({ ...orgQueryParams, orgUrl: entityUrl });
        setEventQueryParams({ ...eventQueryParams, eventUrl: entityUrl });
        //setUserQueryParams({ ...userQueryParams, slug: entityUrl });
      }
    },
    [entityUrl]
  );
  // useEffect(() => {
  //   if (!orgQuery.data?._id) {
  //     const isCreator = session?.user.userId === getRefId(orgQuery.data);

  //     if (isCreator) {
  //       orgQuery.refetch();
  //     }
  //   }
  // }, []);
  // useEffect(() => {
  //   if (orgQuery.data?._id && isLoading) setIsLoading(false);
  // }, [orgQuery.data]);
  //#endregion

  //#region rendering
  if (orgQueryStatus === 404 && orgQueryParams.orgUrl === "forum") {
    return (
      <NotFound
        {...props}
        isRedirect={false}
        message="Veuillez créer la planète forum."
      >
        <EntityAddButton
          label={`Créer la planète « Forum »`}
          orgName="Forum"
          orgType={EOrgType.NETWORK}
        />
      </NotFound>
    );
  }

  if (
    eventQueryStatus === 404 &&
    orgQueryStatus === 404 &&
    userQueryStatus === 404
  ) {
    return <NotFound {...props} />;
  }

  if (eventQuery.data && eventQueryStatus === 200) {
    return (
      <EventPage
        {...props}
        eventQuery={eventQuery as AppQueryWithData<IEvent>}
        subQuery={subQuery}
        tab={entityTab}
        tabItem={entityTabItem}
      />
    );
  }

  if (
    eventQuery.error &&
    eventQueryStatus !== 404 &&
    userQuery.error &&
    orgQuery.error
  ) {
    return <ErrorPage {...props} query={eventQuery} />;
  }

  if (userQuery.data && userQueryStatus === 200) {
    return (
      <UserPage {...props} userQuery={userQuery as AppQueryWithData<IUser>} />
    );
  }

  if (userQuery.error && userQueryStatus !== 404 && orgQuery.error) {
    return <ErrorPage {...props} query={userQuery} />;
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
  }

  if (orgQuery.error && userQuery.error && eventQuery.error) {
    return <ErrorPage {...props} query={orgQuery} />;
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
        normalizedEntityUrl === "sitemap.xml" ||
        normalizedEntityUrl === "robots.txt" ||
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
