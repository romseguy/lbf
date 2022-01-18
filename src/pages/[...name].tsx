import { Flex, Heading, Spinner } from "@chakra-ui/react";
import bcrypt from "bcryptjs";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Container } from "features/common";
import { EventPage } from "features/events/EventPage";
import { EventQueryParams, useGetEventQuery } from "features/events/eventsApi";
import { Layout } from "features/layout";
import { OrgPage } from "features/orgs/OrgPage";
import { OrgPageLogin } from "features/orgs/OrgPageLogin";
import { OrgQueryParams, useGetOrgQuery } from "features/orgs/orgsApi";
import { UserPage } from "features/users/UserPage";
import { useGetUserQuery, UserQueryParams } from "features/users/usersApi";
import { selectUserEmail, setUserEmail } from "features/users/userSlice";
import { useSession } from "hooks/useAuth";
import { useAppDispatch } from "store";
import { PageProps } from "./_app";

let cachedEmail: string | undefined;
const canRedirect = true;

type HashProps = PageProps & {
  email?: string;
};

const Hash = ({ ...props }: HashProps) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: clientSession } = useSession();
  const session = props.session || clientSession;

  const notFound = () => {
    if (canRedirect)
      setTimeout(() => {
        router.push("/");
      }, 2000);

    return (
      <Layout {...props} pageTitle="Page introuvable" session={session}>
        <Flex>
          <Heading className="rainbow-text" fontFamily="DancingScript">
            Page introuvable
          </Heading>
        </Flex>

        <Container>
          Vous allez être redirigé vers la page d'accueil dans quelques
          secondes...
        </Container>
      </Layout>
    );
  };

  //#region user email
  const userEmail =
    useSelector(selectUserEmail) ||
    (router.query.email as string | undefined) ||
    props.email ||
    session?.user.email;
  const [email, setEmail] = useState(userEmail);
  useEffect(() => {
    if (email) dispatch(setUserEmail(email));
  }, []);
  useEffect(() => {
    if (userEmail !== cachedEmail) {
      cachedEmail = userEmail;
      setEmail(userEmail);
    }
  }, [userEmail]);
  //#endregion

  //#region routing
  let [entityUrl, entityTab, entityTabItem] =
    "name" in router.query && Array.isArray(router.query.name)
      ? router.query.name
      : [];
  entityTabItem = entityUrl === "forum" ? entityTab : entityTabItem;

  const [eventQueryParams, setEventQueryParams] = useState<EventQueryParams>({
    eventUrl: entityUrl,
    populate: "eventOrgs"
  });
  const [orgQueryParams, setOrgQueryParams] = useState<OrgQueryParams>({
    orgUrl: entityUrl,
    populate:
      "orgBanner orgEvents orgLogo orgLists orgProjects orgSubscriptions orgTopics orgs"
  });
  const [userQueryParams, setUserQueryParams] = useState<UserQueryParams>({
    slug: entityUrl
  });
  useEffect(() => {
    setOrgQueryParams({ ...orgQueryParams, orgUrl: entityUrl });
    setEventQueryParams({ ...eventQueryParams, eventUrl: entityUrl });
    setUserQueryParams({ ...userQueryParams, slug: entityUrl });
  }, [router.asPath]);
  const eventQuery = useGetEventQuery(eventQueryParams);
  //@ts-expect-error
  const eventQueryStatus = eventQuery.error?.status || 200;
  const orgQuery = useGetOrgQuery(orgQueryParams);
  //@ts-expect-error
  const orgQueryStatus = orgQuery.error?.status || 200;
  const userQuery = useGetUserQuery({
    slug: entityUrl,
    populate: session?.user.userName === entityUrl ? "userProjects" : undefined,
    select: session?.user.userName === entityUrl ? "userProjects" : undefined
  });
  //@ts-expect-error
  const userQueryStatus = userQuery.error?.status || 200;
  //#endregion

  //#region query status
  if (eventQuery.isLoading || orgQuery.isLoading || userQuery.isLoading) {
    return (
      <Layout {...props} session={session}>
        <Spinner />
      </Layout>
    );
  }

  if (
    eventQueryStatus === 404 &&
    orgQueryStatus === 404 &&
    userQueryStatus === 404
  ) {
    return notFound();
  }

  if (eventQueryStatus === 200) {
    return (
      <EventPage
        {...props}
        email={email}
        eventQuery={eventQuery}
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

  if (orgQuery.data?._id) {
    return (
      <OrgPage
        {...props}
        email={email}
        orgQuery={orgQuery}
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
        email={email}
        session={session}
        userQuery={userQuery}
      />
    );
  }
  //#endregion

  return notFound();
};

export async function getServerSideProps(
  ctx: GetServerSidePropsContext
): Promise<{
  props?: Partial<HashProps>;
  redirect?: { permanent: boolean; destination: string };
}> {
  if (!Array.isArray(ctx.query.name) || typeof ctx.query.name[0] !== "string") {
    return {};
  }

  //#region redirect
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
  //#endregion

  //#region props
  let props: Partial<HashProps> = {};

  if (ctx.query.email) {
    props.email = ctx.query.email as string;
  }

  return { props };
  //#endregion
}

export default Hash;
