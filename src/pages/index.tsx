import React, { useState } from "react";
import { Layout } from "features/layout";
import { PageProps } from "./_app";
import {
  Box,
  Flex,
  Heading,
  Icon,
  List,
  ListItem,
  Tag,
  Text,
  Tooltip,
  useColorMode
} from "@chakra-ui/react";
import { FaGift, FaRegLightbulb } from "react-icons/fa";
import { IconFooter, Link, LinkShare, PageContainer } from "features/common";
import { ChatIcon } from "@chakra-ui/icons";

const IndexPage = (props: PageProps) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const [className, setClassName] = useState<string | undefined>();
  const listStyles = {
    listStyleType: "square",
    mb: 3,
    ml: 5,
    spacing: 2,
    fontSize: "xl"
  };
  const url = `${process.env.NEXT_PUBLIC_URL}/nom de votre association`;

  return (
    <Layout pageTitle="Accueil" {...props}>
      <PageContainer pt={2} mb={5}>
        <Heading className="rainbow-text" fontFamily="DancingScript" mb={3}>
          Équipez votre organisation
        </Heading>

        <List {...listStyles}>
          <ListItem>
            Avec un début de site internet et une adresse facile à retenir, par
            exemple :{" "}
            <Tag colorScheme="blue" mt={1} mr={1}>
              <Link href={url} mr={1}>
                {url}
              </Link>
              <LinkShare
                _hover={{ bg: "transparent", color: "white" }}
                bg="transparent"
                height="auto"
                label="Copier l'adresse du lien"
                minWidth={0}
                url={url}
                tooltipProps={{
                  placement: "right"
                }}
              />
            </Tag>
          </ListItem>

          <ListItem>
            Avec un outil plus adapté, ergonomique et éthique que les{" "}
            <Tooltip label="synonymes : mailing lists, newsletters">
              <Text
                display="inline"
                borderBottom={`1px dotted ${isDark ? "white" : "black"}`}
                cursor="pointer"
              >
                listes de diffusion
              </Text>
            </Tooltip>{" "}
            traditionnelles ;
          </ListItem>

          <ListItem>Avec un outil de partage multimédia ;</ListItem>
        </List>

        <Flex alignItems="center">
          <ChatIcon color={isDark ? "yellow" : "green"} mr={2} />
          <Link
            className={className}
            variant="underline"
            href="/forum"
            onMouseEnter={() => setClassName("rainbow-text")}
            onMouseLeave={() => setClassName(undefined)}
          >
            Proposer des idées sur le forum
          </Link>
        </Flex>
      </PageContainer>

      <PageContainer pt={2}>
        <Heading className="rainbow-text" fontFamily="DancingScript" mb={3}>
          Envoyez des invitations
        </Heading>

        <Box fontSize="xl">
          Invitez les personnes qui se sont abonnées ou qui ont adhéré à votre
          organisation, à vos événements, projets, et discussions.
          <Flex
            alignItems="center"
            borderColor={isDark ? "white" : "black"}
            borderRadius="lg"
            borderStyle="solid"
            borderWidth={1}
            fontSize="lg"
            mt={1}
            p={1}
          >
            <Icon
              as={FaRegLightbulb}
              color={isDark ? "yellow" : "green"}
              mr={1}
            />
            Saisissez la liste des adresses e-mail de vos adhérents, et envoyez
            les invitations, ou alors, créez une ou plusieurs listes de
            diffusion pour inviter seulement les personnes concernées.
          </Flex>
        </Box>
      </PageContainer>

      <PageContainer
        alignItems="center"
        flexDirection="row"
        maxWidth="fit-content"
        mt={5}
        pt={2}
      >
        <Icon as={FaGift} color="green" boxSize={[5, 4]} />
        <Text ml={2}>
          Cet outil est un logiciel libre et open-source mis à disposition
          gratuitement.
        </Text>
      </PageContainer>

      <IconFooter />
    </Layout>
  );
};

export default IndexPage;

/*
  const [isAbout, setIsAbout] = useState(false);
  const orgs = (plural?: boolean) => (
    <Text color={isDark ? "green.200" : "green"} display="inline">
      <Icon as={IoIosPeople} />{" "}
      <Link href="/organisations">organisation{plural ? "s" : ""}</Link>
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
