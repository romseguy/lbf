import { Session } from "next-auth";
import React, { useState } from "react";
import { Layout } from "features/layout";

const IndexPage = (props: { session?: Session }) => {
  return (
    <Layout pageTitle="Accueil" {...props}>
      Créez
    </Layout>
  );
};

export default IndexPage;

/*
  const [isAbout, setIsAbout] = useState(false);
  const orgs = (plural?: boolean) => (
    <Text color={isDark ? "green.200" : "green"} display="inline">
      <Icon as={IoIosPeople} />{" "}
      <Link href="/orgs">organisation{plural ? "s" : ""}</Link>
    </Text>
  );
  const subscribers = (plural?: boolean) => (
    <Text color={isDark ? "green.200" : "green"} display="inline">
      <Icon as={IoMdPerson} />
      adhérent{plural ? "s" : ""}
    </Text>
  );

  {true ? (
    <>
      {false && (
        <Box textAlign="center" mb={3}>
          <Link
            className="rainbow-text"
            size="larger"
            onClick={() => setIsAbout(!isAbout)}
          >
            À propos de {process.env.NEXT_PUBLIC_SHORT_URL}
          </Link>
        </Box>
      )}

      {isAbout && (
        <Container
          maxW="xl"
          mb={3}
          p="4"
          bg={isDark ? "gray.500" : "white"}
          borderRadius="lg"
        >
          <Text align="justify" mb={3}>
            La première vocation de cet outil de communication est de
            co-créer un <strong>calendrier local</strong>.
          </Text>

          <Heading size="md" mb={3}>
            Vous êtes un particulier :
          </Heading>
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
                Abonnez-vous aux {orgs(true)} et recevez un e-mail lors de
                la publication d'un nouvel événement.
              </ListItem>
              <ListItem align="justify">
                <ListIcon as={IoIosChatbubbles} />
                Participez aux discussions sur les pages des {orgs(true)},
                des événements, et du{" "}
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
                Publiez des événements public ou bien réservés à vos
                adhérents.
                  <Link variant="underline" href="/">
              <Tag>
                <TagLeftIcon as={CalendarIcon} /> Votre calendrier local
              </Tag>
            </Link> 
              </ListItem>
                <ListItem align="justify">
              <ListIcon as={IoMdPersonAdd} />
              Ajoutez les e-mails de vos adhérents.
            </ListItem> 
              <ListItem align="justify">
                <ListIcon as={IoIosChatbubbles} />
                Communiquez avec vos {subscribers(true)}.
              </ListItem>
            </List>
          </Container>
        </Container>
      )}
    </>
  ) : (
    <Heading>Premiers pas</Heading>
  )}
*/
