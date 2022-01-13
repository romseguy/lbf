import { Heading, Spinner } from "@chakra-ui/react";
import bcrypt from "bcryptjs";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { EventPage } from "features/events/EventPage";
import { EventQueryParams, useGetEventQuery } from "features/events/eventsApi";
import { Layout } from "features/layout";
import { OrgPage } from "features/orgs/OrgPage";
import { OrgQueryParams, useGetOrgQuery } from "features/orgs/orgsApi";
import { UserPage } from "features/users/UserPage";
import { useGetUserQuery, UserQueryParams } from "features/users/usersApi";
import { setUserEmail } from "features/users/userSlice";
import { useSession } from "hooks/useAuth";
import { useAppDispatch, wrapper } from "store";
import { PageProps } from "./_app";
import { OrgPageLogin } from "features/orgs/OrgPageLogin";

const Hash = ({
  email,
  ...props
}: PageProps & {
  email?: string;
}) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: session } = useSession();

  //#region routing
  let [entityUrl, entityTab, entityTabItem] =
    "name" in router.query && Array.isArray(router.query.name)
      ? router.query.name
      : [];

  const [orgQueryParams, setOrgQueryParams] = useState<OrgQueryParams>({
    orgUrl: entityUrl,
    populate:
      "orgBanner orgEvents orgLogo orgLists orgProjects orgSubscriptions orgTopics orgs"
  });
  const [eventQueryParams, setEventQueryParams] = useState<EventQueryParams>({
    eventUrl: entityUrl
  });
  const [userQueryParams, setUserQueryParams] = useState<UserQueryParams>({
    slug: entityUrl
  });
  useEffect(() => {
    setOrgQueryParams({ ...orgQueryParams, orgUrl: entityUrl });
    setEventQueryParams({ ...eventQueryParams, eventUrl: entityUrl });
    setUserQueryParams({ ...userQueryParams, slug: entityUrl });
  }, [router.asPath]);
  //#endregion

  const eventQuery = useGetEventQuery(eventQueryParams);
  const orgQuery = useGetOrgQuery(orgQueryParams);
  const userQuery = useGetUserQuery(
    {
      slug: session?.user.email || "",
      populate:
        session?.user.userName === entityUrl ? "userProjects" : undefined,
      select: session?.user.userName === entityUrl ? "userProjects" : undefined
    },
    {
      selectFromResult: (query) => {
        if (query.data) {
          return {
            ...query,
            data: {
              ...query.data,
              email: query.data.email || session?.user.email || ""
            }
          };
        }
        return query;
      }
    }
  );

  entityTabItem = entityUrl === "forum" ? entityTab : entityTabItem;
  const [error, setError] = useState<
    { pageTitle: string; fc: React.FC; redirect?: boolean } | undefined
  >();

  useEffect(() => {
    if (email) dispatch(setUserEmail(email));
  }, []);

  if (eventQuery.isError && orgQuery.isError && userQuery.isError) {
    setTimeout(() => {
      router.push("/");
    }, 2000);

    return (
      <Layout pageTitle="Page introuvable" {...props}>
        <Heading className="rainbow-text" fontFamily="DancingScript">
          Page introuvable
        </Heading>
        Vous allez être redirigé vers la page d'accueil dans quelques
        secondes...
      </Layout>
    );
  }

  if (!eventQuery.isError && eventQuery.data) {
    return (
      <EventPage
        eventQuery={eventQuery}
        tab={entityTab}
        tabItem={entityTabItem}
        {...props}
      />
    );
  }

  if (!orgQuery.isError && orgQuery.data) {
    if (orgQuery.data._id)
      return (
        <OrgPage
          orgQuery={orgQuery}
          tab={entityTab}
          tabItem={entityTabItem}
          {...props}
        />
      );

    return (
      <OrgPageLogin
        onSubmit={async (orgPassword) => {
          const hash = bcrypt.hashSync(orgPassword, orgQuery.data!.orgSalt);
          setOrgQueryParams({ ...orgQueryParams, hash });
        }}
        {...props}
      />
    );
  }

  if (!userQuery.isError && userQuery.data)
    return <UserPage userQuery={userQuery} {...props} />;

  return (
    <Layout {...props}>
      <Spinner />
    </Layout>
  );
};

export default Hash;

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

// setError({
//   pageTitle: "Page introuvable",
//   fc: () => (
//     <>
//       <Heading className="rainbow-text" fontFamily="DancingScript">
//         Page introuvable
//       </Heading>
//       Vous allez être redirigé vers la page d'accueil dans quelques
//       secondes...
//     </>
//   ),
//   redirect: true
// });

// setError({
//   pageTitle: "Accès refusé",
//   fc: () => {
//     const [isLoading, setIsLoading] = useState(false);
//     return (
//       <>
//         <Heading className="rainbow-text" fontFamily="DancingScript">
//           Accès refusé
//         </Heading>

//         <Button
//           colorScheme="teal"
//           isLoading={isLoading}
//           mt={3}
//           onClick={() => {
//             setIsLoading(true);
//             window.location.reload();
//           }}
//         >
//           Réessayer
//         </Button>
//       </>
//     );
//   }
// });
