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
  const routeName = router.asPath.substr(1, router.asPath.length);
  const [event, setEvent] = useState<IEvent | undefined>();
  const [org, setOrg] = useState<IOrg | undefined>();
  const [user, setUser] = useState<IUser | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();
  const refetchOrg = useSelector(selectOrgRefetch);

  useEffect(() => {
    if (email) dispatch(setUserEmail(email));
  }, []);

  useEffect(() => {
    const xhr = async () => {
      populate = "orgSubscriptions";
      const eventQuery = await dispatch(
        getEvent.initiate({ eventUrl: routeName, populate })
      );

      if (eventQuery.data) {
        setEvent(eventQuery.data);
      } else {
        populate =
          "orgBanner orgEvents orgLogo orgLists orgProjects orgSubscriptions orgTopics orgs";
        const orgQuery = await dispatch(
          getOrg.initiate({
            orgUrl: routeName,
            populate
          })
        );

        if (orgQuery.data) {
          setOrg(orgQuery.data);
        } else {
          const userQuery = await dispatch(
            getUser.initiate({ slug: routeName })
          );

          if (userQuery.data) setUser(userQuery.data);
          else
            setError(
              new Error(
                "La page demandée n'a pas été trouvée. Vous allez être redirigé vers la page d'accueil dans quelques secondes."
              )
            );
        }
      }
    };

    setEvent(undefined);
    setOrg(undefined);
    setUser(undefined);
    xhr();
  }, [router.asPath, refetchOrg]);

  if (event) {
    return <EventPage event={event} populate={populate} {...props} />;
  }

  if (org) {
    return <OrgPage org={org} populate={populate} {...props} />;
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
      {isLoading ? (
        <Spinner />
      ) : error ? (
        <Alert status="error">
          <AlertIcon />
          {error.message}
        </Alert>
      ) : (
        <></>
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

    let routeName = ctx.query.name[0];

    if (routeName.indexOf(" ") !== -1) {
      const destination = `/${routeName.replace(/\ /g, "_")}`;

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
