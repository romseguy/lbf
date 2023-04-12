import { Spinner } from "@chakra-ui/react";
import bcrypt from "bcryptjs";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { GetEventParams, useGetEventQuery } from "features/api/eventsApi";
import { GetOrgParams, useGetOrgQuery } from "features/api/orgsApi";
import { useGetSubscriptionQuery } from "features/api/subscriptionsApi";
import { useGetUserQuery, UserQueryParams } from "features/api/usersApi";
import { NotFound } from "features/common";
import { EventPage } from "features/events/EventPage";
import { Layout } from "features/layout";
import { OrgPage } from "features/orgs/OrgPage";
import { OrgPageLogin } from "features/orgs/OrgPageLogin";
import { UserPage } from "features/users/UserPage";
import { useRouterLoading } from "hooks/useRouterLoading";
import { PageProps } from "main";
import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { ISubscription } from "models/Subscription";
import { IUser } from "models/User";
import { selectSubscriptionRefetch } from "store/subscriptionSlice";
import { selectUserEmail } from "store/userSlice";
import { normalize } from "utils/string";
import { AppQuery, AppQueryWithData } from "utils/types";

let cachedEmail: string | undefined;
let cachedRefetchSubscription = false;

const Hash = ({ ...props }: PageProps) => {
  const userEmail = useSelector(selectUserEmail);

  //#region routing
  const router = useRouter();
  const { isLoading: isRouterLoading } = useRouterLoading();
  let [entityUrl, entityTab = "accueil", entityTabItem] =
    "name" in router.query && Array.isArray(router.query.name)
      ? router.query.name
      : [];
  entityTabItem = entityUrl === "forum" ? entityTab : entityTabItem;
  useEffect(
    function onNavigate() {
      setOrgQueryParams({ ...orgQueryParams, orgUrl: entityUrl });
      setEventQueryParams({ ...eventQueryParams, eventUrl: entityUrl });
      setUserQueryParams({ ...userQueryParams, slug: entityUrl });
    },
    [router.asPath]
  );
  //#endregion

  //#region queries parameters
  const [eventQueryParams, setEventQueryParams] = useState<GetEventParams>({
    eventUrl: entityUrl,
    populate: "eventOrgs"
  });
  const [orgQueryParams, setOrgQueryParams] = useState<GetOrgParams>({
    orgUrl: entityUrl,
    populate:
      "orgBanner orgEvents orgLogo orgLists orgProjects orgSubscriptions orgTopics orgs"
  });
  const [userQueryParams, setUserQueryParams] = useState<UserQueryParams>({
    slug: entityUrl
  });
  //#endregion

  //#region queries
  const eventQuery = useGetEventQuery(eventQueryParams) as AppQuery<IEvent>;
  const orgQuery = useGetOrgQuery(orgQueryParams) as AppQuery<IOrg>;
  const subQuery = useGetSubscriptionQuery({
    email: userEmail
  }) as AppQuery<ISubscription>;
  const userQuery = useGetUserQuery({
    slug: entityUrl,
    populate:
      props.session?.user.userName === entityUrl ? "userProjects" : undefined
  }) as AppQuery<IUser>;
  //#endregion

  //#region queries statuses
  const eventQueryStatus = eventQuery.error?.status || 200;
  const orgQueryStatus = orgQuery.error?.status || 200;
  const userQueryStatus = userQuery.error?.status || 200;
  //#endregion

  //#region cross refetch
  const refetchSubscription = useSelector(selectSubscriptionRefetch);
  useEffect(() => {
    if (refetchSubscription !== cachedRefetchSubscription) {
      console.log("refetching subscription");
      cachedRefetchSubscription = refetchSubscription;
      subQuery.refetch();
    }

    if (typeof cachedEmail === "string" && cachedEmail !== userEmail) {
      console.group(
        "refetching subscription and entities because user email changed"
      );
      console.log("cached", cachedEmail);
      console.log("current", userEmail);
      console.groupEnd();

      cachedEmail = userEmail;
      subQuery.refetch();
      if (eventQueryStatus === 200) eventQuery.refetch();
      if (orgQueryStatus === 200) orgQuery.refetch();
      if (userQueryStatus === 200) userQuery.refetch();
    }
  }, [refetchSubscription, userEmail]);
  //#endregion

  if (
    isRouterLoading ||
    eventQuery.isLoading ||
    orgQuery.isLoading ||
    userQuery.isLoading
  ) {
    return (
      <Layout {...props}>
        <Spinner />
      </Layout>
    );
  }

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

  if (eventQueryStatus === 200) {
    return (
      <EventPage
        {...props}
        email={userEmail}
        eventQuery={eventQuery as AppQueryWithData<IEvent>}
        subQuery={subQuery}
        tab={entityTab}
        tabItem={entityTabItem}
      />
    );
  }

  if (
    orgQueryStatus === 403 ||
    (orgQueryStatus === 200 && !orgQuery.data?._id)
  ) {
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

  if (orgQueryStatus === 200 && orgQuery.data?._id) {
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

  if (userQueryStatus === 200) {
    return (
      <UserPage
        {...props}
        email={userEmail}
        userQuery={userQuery as AppQueryWithData<IUser>}
      />
    );
  }

  return <NotFound {...props} />;
};

export async function getServerSideProps(
  ctx: GetServerSidePropsContext
): Promise<{
  props?: {};
  redirect?: { permanent: boolean; destination: string };
}> {
  if (Array.isArray(ctx.query.name) && typeof ctx.query.name[0] === "string") {
    let entityUrl = ctx.query.name[0];

    const normalizedEntityUrl = normalize(entityUrl);
    //console.log(entityUrl, normalizedEntityUrl);

    if (entityUrl !== normalizedEntityUrl)
      return {
        redirect: {
          permanent: false,
          destination: normalizedEntityUrl
        }
      };
  }

  return { props: {} };
}

export default Hash;
