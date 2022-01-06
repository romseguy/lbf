import { ChatIcon, EmailIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  FlexProps,
  Heading,
  Icon,
  List,
  ListItem,
  Tag,
  Text,
  Tooltip,
  useColorMode
} from "@chakra-ui/react";
import React, { useState } from "react";
import {
  FaGift,
  FaHandshake,
  FaKey,
  FaQuoteLeft,
  FaRegLightbulb
} from "react-icons/fa";
import { css } from "twin.macro";
import {
  EntityButton,
  IconFooter,
  Link,
  LinkShare,
  PageContainer
} from "features/common";
import { Layout } from "features/layout";
import { breakpoints } from "theme/theme";
import { PageProps } from "./_app";
import { setIsContactModalOpen } from "features/modals/modalSlice";
import { useAppDispatch } from "store";

const listStyles = {
  listStyleType: "square",
  mb: 3,
  ml: 5,
  spacing: 2,
  fontSize: "xl"
};

const halfStyles: FlexProps = {
  alignItems: "center",
  flex: 1,
  flexDirection: "row",
  maxWidth: "auto",
  m: "0",
  mt: 5
};

const IndexPage = (props: PageProps) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const dispatch = useAppDispatch();

  const [className, setClassName] = useState<string | undefined>();
  const host = <Tag colorScheme="red">{process.env.NEXT_PUBLIC_SHORT_URL}</Tag>;
  const license = (
    <a
      href="https://www.gnu.org/licenses/why-affero-gpl.fr.html"
      target="_blank"
      style={{ textDecoration: "underline" }}
    >
      GNU AGPL
    </a>
  );
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
            <Tag colorScheme="blue" mt={1} mr={1} px={2} py={3}>
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
          Invitez vos adhérents à vos événements, projets, et discussions.
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

      <Flex
        m="0 auto"
        maxWidth="4xl"
        css={css`
          @media (max-width: ${breakpoints.sm}) {
            display: block;
          }
        `}
      >
        <PageContainer
          {...halfStyles}
          css={css`
            @media (min-width: ${breakpoints.sm}) {
              margin-right: 12px;
            }
          `}
        >
          <Icon as={FaGift} color="green" boxSize={[5, 4]} />
          <Text ml={2}>
            Cet outil est un logiciel libre et open-source mis à disposition
            gratuitement par son créateur.
          </Text>
        </PageContainer>

        <PageContainer {...halfStyles} height="100%" minHeight={0}>
          <Icon as={EmailIcon} color="green" boxSize={[5, 4]} />
          <Text ml={2}>
            {host} peut envoyer jusqu'à 100 e-mails par jour. Si cela s'avère
            insuffisant, parlons en sur le{" "}
            <EntityButton org={{ orgName: "aucourant" }} />
          </Text>
        </PageContainer>
      </Flex>

      <PageContainer bg="transparent" border={0} p={0}>
        <PageContainer {...halfStyles}>
          <Icon as={FaKey} color="green" boxSize={[5, 4]} />
          <Text ml={2}>
            Pour que cet outil reste libre et open-source, la license {license}{" "}
            a été choisie.
          </Text>
        </PageContainer>

        <PageContainer {...halfStyles}>
          <Icon as={FaHandshake} color="green" boxSize={[5, 4]} />
          <Flex flexDirection="column">
            <Text fontSize="smaller" ml={2}>
              <Icon as={FaQuoteLeft} /> La license {license} ne s'intéresse pas
              au problème du SaaSS (service se substituant au logiciel). On
              parle de SaaSS lorsque les utilisateurs font leurs propres tâches
              informatiques sur l'ordinateur de quelqu'un d'autre. Ceci les
              oblige à envoyer leurs données au serveur ; ce dernier les traite
              et leur renvoie les résultats.
            </Text>

            <Text ml={2}>
              Si vous ne voulez pas faire confiance à {host} pour le traitement
              de vos données,{" "}
              <Link
                variant="underline"
                onClick={() => dispatch(setIsContactModalOpen(true))}
              >
                contactez
              </Link>{" "}
              le créateur pour installer l'outil sur votre propre serveur.
            </Text>
          </Flex>
        </PageContainer>
      </PageContainer>
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
