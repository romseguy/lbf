import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { IUser } from "models/User";
import React, { useEffect, useState } from "react";
import { Alert, AlertIcon, Spinner } from "@chakra-ui/react";
import { EventPage } from "features/events/EventPage";
import { Layout } from "features/layout";
import { OrgPage } from "features/orgs/OrgPage";
import { User } from "features/users/UserPage";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { setUserEmail } from "features/users/userSlice";
import { useAppDispatch, wrapper } from "store";
import { getEvent } from "features/events/eventsApi";
import { getOrg } from "features/orgs/orgsApi";
import { getUser } from "features/users/usersApi";
import { selectOrgRefetch } from "features/orgs/orgSlice";

let populate = "";

const Hash = ({ email, ...props }: { email?: string }) => {
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
      const eventQuery = await dispatch(
        getEvent.initiate({ eventUrl: routeName, populate: "orgSubscriptions" })
      );

      if (eventQuery.data) {
        setEvent(eventQuery.data);
      } else {
        populate =
          "orgBanner orgEvents orgLogo orgProjects orgSubscriptions orgTopics";
        const orgQuery = await dispatch(
          getOrg.initiate({
            orgUrl: routeName,
            populate
          })
        );

        if (orgQuery.data) {
          setOrg(orgQuery.data);
        } else {
          const userQuery = await dispatch(getUser.initiate(routeName));

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
    return <EventPage event={event} />;
  }

  if (org) {
    return <OrgPage org={org} populate={populate} />;
  }

  if (user) {
    return <User user={user} />;
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
