import { Alert, AlertIcon, Spinner } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { EventPage } from "features/events/EventPage";
import { getEvent } from "features/events/eventsApi";
import { Layout } from "features/layout";
import { OrgPage } from "features/orgs/OrgPage";
import { getOrg } from "features/orgs/orgsApi";
import { selectOrgRefetch } from "features/orgs/orgSlice";
import { UserPage } from "features/users/UserPage";
import { getUser } from "features/users/usersApi";
import { setUserEmail } from "features/users/userSlice";
import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { IUser } from "models/User";
import { useAppDispatch, wrapper } from "store";
import { selectEventRefetch } from "features/events/eventSlice";
import ForumPage from "./forum";

let populate = "";

const Hash = ({
  email,
  ...props
}: {
  email?: string;
  session: Session | null;
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  //const routeName = router.asPath.substr(1, router.asPath.length);
  let [entityUrl, entityTab, entityTabItem] =
    "name" in router.query && Array.isArray(router.query.name)
      ? router.query.name
      : [];
  entityTabItem = entityUrl === "forum" ? entityTab : entityTabItem;
  const [event, setEvent] = useState<IEvent | undefined>();
  const [org, setOrg] = useState<IOrg | undefined>();
  const [user, setUser] = useState<IUser | undefined>();
  const [error, setError] = useState<Error | undefined>();
  const refetchOrg = useSelector(selectOrgRefetch);
  const refetchEvent = useSelector(selectEventRefetch);

  useEffect(() => {
    const xhr = async () => {
      console.log(`fetching entity ${entityUrl}...`);
      populate = "";

      if (entityUrl === "forum") return;

      const eventQuery = await dispatch(
        getEvent.initiate({ eventUrl: entityUrl, populate })
      );

      if (eventQuery.data) {
        setEvent(eventQuery.data);
        setOrg(undefined);
        setUser(undefined);
      } else {
        populate =
          "orgBanner orgEvents orgLogo orgLists orgProjects orgSubscriptions orgTopics orgs";
        const orgQuery = await dispatch(
          getOrg.initiate({
            orgUrl: entityUrl,
            populate
          })
        );

        if (orgQuery.data) {
          setEvent(undefined);
          setOrg(orgQuery.data);
          setUser(undefined);
        } else {
          const userQuery = await dispatch(
            getUser.initiate({ slug: entityUrl })
          );

          if (userQuery.data) {
            setEvent(undefined);
            setOrg(undefined);
            setUser(userQuery.data);
          } else
            setError(
              new Error(
                "La page demandée n'a pas été trouvée. Vous allez être redirigé vers la page d'accueil dans quelques secondes."
              )
            );
        }
      }
    };

    xhr();
  }, [router.asPath]);

  useEffect(() => {
    if (email) dispatch(setUserEmail(email));
  }, []);

  if (entityUrl === "forum")
    return <ForumPage tabItem={entityTabItem} {...props} />;

  if (event) {
    return (
      <EventPage
        event={event}
        populate={populate}
        tab={entityTab}
        tabItem={entityTabItem}
        {...props}
      />
    );
  }

  if (org) {
    return (
      <OrgPage
        org={org}
        populate={populate}
        tab={entityTab}
        tabItem={entityTabItem}
        {...props}
      />
    );
  }

  if (user) {
    return <UserPage user={user} {...props} />;
  }

  if (error) {
    setTimeout(() => {
      router.push("/");
    }, 2000);
  }

  return (
    <Layout pageTitle={error ? "Page introuvable" : ""} {...props}>
      {error && (
        <Alert status="error">
          <AlertIcon />
          {error.message}
        </Alert>
      )}
    </Layout>
  );
};

export default Hash;

// export async function getServerSideProps(ctx: GetServerSidePropsContext) {
export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    if (
      !Array.isArray(ctx.query.name) ||
      typeof ctx.query.name[0] !== "string"
    ) {
      return {
        props: {}
      };
    }

    let entityUrl = ctx.query.name[0];

    if (entityUrl.indexOf(" ") !== -1) {
      const destination = `/${entityUrl.replace(/\ /g, "_")}`;

      return {
        redirect: {
          permanent: false,
          destination
        }
      };
    }

    if (ctx.query.email) {
      console.log("email", ctx.query.email);
      store.dispatch(setUserEmail(ctx.query.email as string)); // todo rehydrate
      return { props: { email: ctx.query.email } };
    }

    return { props: {} };
  }
);
