import React, { useState } from "react";
import { EventsPage } from "features/events/EventsPage";
import type { IEvent } from "models/Event";
import api from "utils/api";
import { GetServerSidePropsContext } from "next";
import {
  Container,
  Heading,
  Icon,
  List,
  ListIcon,
  ListItem,
  Spinner,
  Tag,
  TagLeftIcon,
  Text,
  useColorModeValue,
  VStack
} from "@chakra-ui/react";
import { useSession } from "hooks/useAuth";
import { Layout } from "features/layout";
import { IoIosChatbubbles, IoIosPeople, IoMdPerson } from "react-icons/io";
import { Link } from "features/common";
import { CalendarIcon, ChatIcon, EmailIcon } from "@chakra-ui/icons";

const Index = ({ events }: { events?: IEvent[] }) => {
  const { data: session, loading: isSessionLoading } = useSession();
  const [isLogin, setIsLogin] = useState(0);

  const orgs = (plural?: boolean) => (
    <Text color={useColorModeValue("green", "green.200")} display="inline">
      <Icon as={IoIosPeople} />
      organisation{plural ? "s" : ""}
    </Text>
  );
  const subscribers = (plural?: boolean) => (
    <Text color={useColorModeValue("green", "green.200")} display="inline">
      <Icon as={IoMdPerson} />
      abonné(e){plural ? "s" : ""}
    </Text>
  );

  return (
    <Layout pageTitle="Votre Agenda Local" isLogin={isLogin}>
      {isSessionLoading ? (
        <Spinner />
      ) : true ? (
        <Container
          maxW="xl"
          mb={3}
          p="4"
          bg={useColorModeValue("white", "gray.500")}
          borderRadius="lg"
        >
          {/* <Box textAlign="center">
            <Link
              className="rainbow-text"
              css={css`
                letter-spacing: 0.1em;
              `}
              size="larger"
              href={`/`}
            >
              {process.env.NEXT_PUBLIC_SHORT_URL}
            </Link>
          </Box> */}
          <Text align="justify" mb={3}>
            La première vocation de cet outil de communication est de proposer
            un <strong>agenda local commun</strong>.
          </Text>

          <Container
            borderWidth={1}
            borderColor="gray.200"
            borderRadius="lg"
            p={3}
            maxW="xl"
            mb={3}
          >
            <List spacing={1}>
              <ListItem align="justify">
                <ListIcon as={EmailIcon} />
                Abonnez-vous aux {orgs(true)} à l'origine des événements pour
                être averti sur votre e-mail des événements futurs.
              </ListItem>
              <ListItem align="justify">
                <ListIcon as={IoIosChatbubbles} />
                Créez des discussions <em>publiques</em> sur les pages des{" "}
                {orgs(true)}, de leurs événements, et du{" "}
                <Link variant="underline" href="/forum">
                  <Tag>
                    <TagLeftIcon as={ChatIcon} /> Forum
                  </Tag>
                </Link>
              </ListItem>
            </List>
          </Container>

          <Heading size="md" mb={3}>
            Vous êtes une {orgs()} (association, groupe, ...) :
          </Heading>
          <Container
            borderWidth={1}
            borderColor="gray.200"
            borderRadius="lg"
            p={3}
            maxW="xl"
          >
            <List spacing={1}>
              <ListItem align="justify">
                <ListIcon as={CalendarIcon} />
                Publiez vos événements et retrouvez les avec les événements des
                autres organisations sur{" "}
                <Link variant="underline" href="/">
                  <Tag>
                    <TagLeftIcon as={CalendarIcon} /> Votre agenda local
                  </Tag>
                </Link>
              </ListItem>
              {/* <ListItem align="justify">
                  <ListIcon as={IoMdPersonAdd} />
                  Ajoutez les e-mails de vos adhérents.
                </ListItem> */}
              <ListItem align="justify">
                <ListIcon as={IoIosChatbubbles} />
                Créez des discussions <em>réservées</em> aux {subscribers(true)}{" "}
                inscrits par les administrateurs de votre organisation.
              </ListItem>
            </List>
          </Container>
        </Container>
      ) : (
        <Heading>Premiers pas</Heading>
      )}
      <EventsPage events={events} isLogin={isLogin} setIsLogin={setIsLogin} />
    </Layout>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const { data: events } = await api.get(`events`);

  if (events) {
    return {
      props: { events }
    };
  }

  return {
    props: {}
  };
}

export default Index;

// https://github.com/reduxjs/redux-toolkit/issues/1240
// export const getServerSideProps = wrapper.getServerSideProps(
//   (store) =>
//     async ({ req, res }) => {
//       // server-side fetching
//       const query = await store.dispatch(getEvents.initiate(null));
//       console.log(query);

//       if (query.data) {
//         const events: IEvent = query.data;
//         return Promise.resolve({ props: { events } });
//       }

//       return Promise.resolve({ props: {} });
//     }
// );
