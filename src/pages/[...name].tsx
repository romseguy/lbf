import { Button, Heading, Spinner } from "@chakra-ui/react";
import bcrypt from "bcryptjs";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { EventPage } from "features/events/EventPage";
import { getEvent } from "features/events/eventsApi";
import { Layout } from "features/layout";
import { OrgPage } from "features/orgs/OrgPage";
import { getOrg } from "features/orgs/orgsApi";
import { UserPage } from "features/users/UserPage";
import { getUser } from "features/users/usersApi";
import { setUserEmail } from "features/users/userSlice";
import { IEvent } from "models/Event";
import { IOrg, orgTypeFull } from "models/Org";
import { IUser } from "models/User";
import { useAppDispatch, wrapper } from "store";
import { PageProps } from "./_app";

let populate = "";

const Hash = ({
  email,
  ...props
}: PageProps & {
  email?: string;
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
  const [error, setError] = useState<
    { pageTitle: string; fc: React.FC; redirect?: boolean } | undefined
  >();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const xhr = async () => {
      console.log(`fetching entity ${entityUrl}...`);
      populate = "";

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
          } else {
            setError({
              pageTitle: "Page introuvable",
              fc: () => (
                <>
                  <Heading className="rainbow-text" fontFamily="DancingScript">
                    Page introuvable
                  </Heading>
                  Vous allez être redirigé vers la page d'accueil dans quelques
                  secondes...
                </>
              ),
              redirect: true
            });
          }
        }
      }
    };

    xhr();
  }, [router.asPath]);

  useEffect(() => {
    if (!isAuthorized && org && org.orgPassword) {
      const password = prompt(
        `Veuillez entrer le mot de passe pour accéder à la page ${orgTypeFull(
          org.orgType
        )}`
      );

      if (password && bcrypt.compareSync(password, org.orgPassword))
        setIsAuthorized(true);
      else {
        setError({
          pageTitle: "Accès refusé",
          fc: () => {
            const [isLoading, setIsLoading] = useState(false);
            return (
              <>
                <Heading className="rainbow-text" fontFamily="DancingScript">
                  Accès refusé
                </Heading>

                <Button
                  colorScheme="teal"
                  isLoading={isLoading}
                  mt={3}
                  onClick={() => {
                    setIsLoading(true);
                    window.location.reload();
                  }}
                >
                  Réessayer
                </Button>
              </>
            );
          }
        });
      }
    }
  }, [org]);

  useEffect(() => {
    if (email) dispatch(setUserEmail(email));
  }, []);

  if (error) {
    if (error.redirect) {
      //if (!isServer())
      setTimeout(() => {
        router.push("/");
      }, 2000);

      return (
        <Layout pageTitle="Page introuvable" {...props}>
          <error.fc />
        </Layout>
      );
    } else
      return (
        <Layout pageTitle={error?.pageTitle} {...props}>
          <error.fc />
        </Layout>
      );
  }

  if (event)
    return (
      <EventPage
        event={event}
        populate={populate}
        tab={entityTab}
        tabItem={entityTabItem}
        {...props}
      />
    );

  if (org)
    return (
      <OrgPage
        org={org}
        populate={populate}
        tab={entityTab}
        tabItem={entityTabItem}
        {...props}
      />
    );

  if (user) return <UserPage user={user} {...props} />;

  return (
    <Layout {...props}>
      <Spinner />
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

    if (ctx.query.email) {
      console.log("email", ctx.query.email);
      store.dispatch(setUserEmail(ctx.query.email as string)); // todo rehydrate
      return { props: { email: ctx.query.email } };
    }

    return { props: {} };
  }
);
