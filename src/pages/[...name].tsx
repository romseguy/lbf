import { Spinner } from "@chakra-ui/react";
import bcrypt from "bcryptjs";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { NotFound } from "features/common";
import { EventPage } from "features/events/EventPage";
import { GetEventParams, useGetEventQuery } from "features/events/eventsApi";
import { Layout } from "features/layout";
import { OrgPage } from "features/orgs/OrgPage";
import { OrgPageLogin } from "features/orgs/OrgPageLogin";
import { GetOrgParams, useGetOrgQuery } from "features/orgs/orgsApi";
import { useGetSubscriptionQuery } from "features/subscriptions/subscriptionsApi";
import { selectSubscriptionRefetch } from "features/subscriptions/subscriptionSlice";
import { UserPage } from "features/users/UserPage";
import { useGetUserQuery, UserQueryParams } from "features/users/usersApi";
import { selectUserEmail, setUserEmail } from "features/users/userSlice";
import { useSession } from "hooks/useAuth";
import { useRouterLoading } from "hooks/useRouterLoading";
import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { ISubscription } from "models/Subscription";
import { IUser } from "models/User";
import { useAppDispatch } from "store";
import { AppQuery } from "utils/types";
import { PageProps } from "./_app";

let cachedEmail: string | undefined;
let cachedRefetchSubscription = false;

type HashProps = PageProps;

const Hash = ({ ...props }: HashProps) => {
  const { data: clientSession } = useSession();
  const session = clientSession || props.session;
  const userEmail = useSelector(selectUserEmail);

  //#region routing
  const router = useRouter();
  const { isLoading: isRouterLoading } = useRouterLoading();
  let [entityUrl, entityTab, entityTabItem] =
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
    populate: session?.user.userName === entityUrl ? "userProjects" : undefined,
    select: session?.user.userName === entityUrl ? "userProjects" : undefined
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
      <Layout {...props} session={session}>
        <Spinner />
      </Layout>
    );
  }

  if (orgQueryStatus === 404 && orgQueryParams.orgUrl === "forum") {
    return (
      <NotFound
        {...props}
        isRedirect={false}
        message="Veuillez créer l'organisation forum."
        session={session}
      />
    );
  }

  if (
    eventQueryStatus === 404 &&
    orgQueryStatus === 404 &&
    userQueryStatus === 404
  ) {
    return <NotFound {...props} session={session} />;
  }

  if (eventQueryStatus === 200) {
    return (
      <EventPage
        {...props}
        email={userEmail}
        eventQuery={eventQuery}
        subQuery={subQuery}
        session={session}
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
        session={session}
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
        orgQuery={orgQuery}
        subQuery={subQuery}
        session={session}
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
        session={session}
        userQuery={userQuery}
      />
    );
  }

  return <NotFound {...props} session={session} />;
};

export async function getServerSideProps(
  ctx: GetServerSidePropsContext
): Promise<{
  props?: Partial<HashProps>;
  redirect?: { permanent: boolean; destination: string };
}> {
  if (Array.isArray(ctx.query.name) && typeof ctx.query.name[0] === "string") {
    let entityUrl = ctx.query.name[0];

    if (entityUrl === "login")
      return { redirect: { permanent: false, destination: "/?login" } };

    if (entityUrl.indexOf(" ") !== -1) {
      const destination = `/${entityUrl.replace(/\ /g, "_")}`;

      return {
        redirect: {
          permanent: false,
          destination
        }
      };
    }
  }

  return { props: {} };
}

export default Hash;
