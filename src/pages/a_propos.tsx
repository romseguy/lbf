import { CalendarIcon, EmailIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Flex,
  FlexProps,
  Icon,
  IconButton,
  IconButtonProps,
  List,
  ListItem,
  Tag,
  TagProps,
  Text,
  useColorMode
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import {
  FaGift,
  FaKey,
  FaHandshake,
  FaQuoteLeft,
  FaLightbulb,
  FaShare
} from "react-icons/fa";
import { IoIosPeople } from "react-icons/io";
import { css } from "twin.macro";
import {
  Row,
  EntityButton,
  Heading,
  HostTag,
  Link,
  Column
} from "features/common";
import { Layout } from "features/layout";
import { useDiskUsage } from "hooks/useDiskUsage";
import { useAppDispatch } from "store";
import { setIsContactModalOpen } from "store/modalSlice";
import { bytesForHuman } from "utils/string";
import { PageProps } from "main";

const columnStyles: (isDark: boolean) => FlexProps = (isDark) => ({
  bg: isDark ? "gray.600" : "lightcyan"
});

const rowStyles: (isDark: boolean) => FlexProps = (isDark) => ({
  bg: isDark ? "gray.600" : "lightcyan",
  border: 0,
  fontSize: "sm",
  p: 2
});

export const AboutPage = ({
  isMobile,
  ...props
}: PageProps & { onClose?: () => void }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const dispatch = useAppDispatch();
  const router = useRouter();

  const contactLink = (
    <Link
      variant="underline"
      onClick={() => dispatch(setIsContactModalOpen(true))}
    >
      contactez-nous
    </Link>
  );
  const [diskUsage] = useDiskUsage();
  const license = (
    <a
      href="https://www.gnu.org/licenses/why-affero-gpl.fr.html"
      target="_blank"
      style={{ textDecoration: "underline" }}
    >
      GNU AGPL
    </a>
  );
  const OrgTag = () => {
    const url = `${process.env.NEXT_PUBLIC_URL}/nom_de_votre_planete`;
    const urlElement = (
      <Flex flexWrap="wrap" my={2}>
        {process.env.NEXT_PUBLIC_URL}
        <b>/nom_de_votre_planete</b>
      </Flex>
    );
    const iconButtonProps: Omit<IconButtonProps, "aria-label"> = isMobile
      ? {}
      : { ml: 2 };
    const tagProps: TagProps = isMobile
      ? {
          flexDirection: "column",
          alignItems: "flex-start"
        }
      : {};

    return (
      <Tag bg={isDark ? "gray.500" : "orange.100"} px={1} py={1} {...tagProps}>
        <Icon as={IoIosPeople} boxSize={6} color="green" mr={2} />
        {urlElement}
        <IconButton
          aria-label="Page d'accueil d'une organisation"
          colorScheme="teal"
          icon={<FaShare />}
          onClick={() => {
            props.onClose && props.onClose();
            router.push(url, url, { shallow: true });
          }}
          {...iconButtonProps}
        />
      </Tag>
    );
  };
  const EventTag = () => {
    const eventUrl = `${process.env.NEXT_PUBLIC_URL}/nom_d'un_evenement`;
    const eventUrlElement = (
      <Flex flexWrap="wrap" my={2}>
        {process.env.NEXT_PUBLIC_URL}
        <b>/nom_d'un_evenement</b>
      </Flex>
    );
    const iconButtonProps: Omit<IconButtonProps, "aria-label"> = isMobile
      ? {}
      : { ml: 2 };
    const tagProps: TagProps = isMobile
      ? {
          flexDirection: "column",
          alignItems: "flex-start"
        }
      : {};

    return (
      <Tag
        bg={isDark ? "gray.500" : "orange.100"}
        m="0 auto"
        px={1}
        py={1}
        {...tagProps}
      >
        <CalendarIcon boxSize={5} color="green" mr={2.5} />
        {eventUrlElement}
        <IconButton
          aria-label="Page d'accueil d'un événement"
          colorScheme="teal"
          icon={<FaShare />}
          onClick={() => {
            props.onClose && props.onClose();
            router.push(eventUrl, eventUrl, { shallow: true });
          }}
          {...iconButtonProps}
        />
      </Tag>
    );
  };

  return (
    <Box
      css={css`
        & > * {
          margin-bottom: 12px !important;
        }
      `}
    >
      <Heading>Équipez votre organisation</Heading>

      <Column {...columnStyles(isDark)}>
        <List listStyleType="bullet" ml={5}>
          <ListItem>
            <Text mb={1}>
              Avec une page d'accueil et une adresse facile à retenir, par
              exemple :
            </Text>

            <OrgTag />
          </ListItem>

          <ListItem mt={2}>
            <Text>
              Avec un outil de communication plus puissant qu'un outil de
              mailing traditionnel :
            </Text>
            <List ml={5} listStyleType="square">
              <ListItem mb={1}>
                Créez une page d'accueil pour vos événements, par exemple :
              </ListItem>
              <ListItem listStyleType="none">
                <EventTag />
              </ListItem>
            </List>
          </ListItem>

          <Flex flexDirection="column"></Flex>

          {/* <Box m="0 auto">
            <Link
              alignSelf="flex-start"
              fontSize="smaller"
              variant="underline"
              href={url}
              mt={2}
            >
              Voir la démonstration
            </Link>
            <Button
              colorScheme="teal"
              mt={3}
              onClick={() => router.push(url, url, { shallow: true })}
            >
              Visite guidée
            </Button>
          </Box> */}
        </List>
      </Column>

      <Heading>Invitez vos adhérents</Heading>

      <Column {...columnStyles(isDark)}>
        <Text mb={3}>
          Informez vos adhérents de vos projets et événements à venir.
          <br />
          Créez des discussions et envoyez des invitations par e-mail ou par
          notification mobile.
        </Text>

        <Row
          {...rowStyles(isDark)}
          bg={isDark ? "gray.500" : "orange.100"}
          px={3}
        >
          <Icon as={FaLightbulb} color={isDark ? "yellow" : "green"} mr={1} />
          Créez vos propres listes pour envoyer des invitations seulement aux
          personnes concernés.
        </Row>
      </Column>

      <Heading>Partage & Limitations</Heading>

      <Row {...rowStyles(isDark)}>
        <Icon as={EmailIcon} color="green" boxSize={[5, 4]} mr={3} />
        <Flex alignItems="center" flexWrap="wrap">
          <HostTag mr={1} /> peut envoyer jusqu'à{" "}
          <Badge colorScheme="purple" mx={1}>
            100 e-mails
          </Badge>{" "}
          par jour
          {typeof diskUsage.current !== "undefined" &&
            typeof diskUsage.max !== "undefined" && (
              <>
                , et stocker{" "}
                <Badge colorScheme="purple" mx={1}>
                  {bytesForHuman(diskUsage.max)}
                </Badge>{" "}
                de données
              </>
            )}
          . Si cela s'avère insuffisant, parlons financement participatif sur le{" "}
          <EntityButton org={{ orgUrl: "forum" }} />
        </Flex>
      </Row>

      <Row {...rowStyles(isDark)}>
        <Icon as={FaGift} color="green" boxSize={[5, 4]} />
        <Text ml={3}>
          Cet outil est un logiciel libre et open-source mis à disposition
          gratuitement, {contactLink} pour obtenir son code source.
        </Text>
      </Row>

      <Row {...rowStyles(isDark)}>
        <Icon as={FaKey} color="green" boxSize={[5, 4]} />
        <Text ml={3}>
          Pour qu'il reste libre et open-source, la license {license} a été
          choisie.
        </Text>
      </Row>

      <Row {...rowStyles(isDark)}>
        <Icon as={FaHandshake} color="green" boxSize={[5, 4]} />
        <Flex flexDirection="column" ml={3}>
          <Text
            bg={isDark ? "black" : "white"}
            border="1px solid black"
            borderRadius="lg"
            fontSize="xs"
            mb={2}
            p={2}
          >
            <Icon as={FaQuoteLeft} /> La license {license} ne s'intéresse pas au
            problème du SaaSS (service se substituant au logiciel). On parle de
            SaaSS lorsque les utilisateurs font leurs propres tâches
            informatiques sur l'ordinateur de quelqu'un d'autre. Ceci les oblige
            à envoyer leurs données au serveur ; ce dernier les traite et leur
            renvoie les résultats.
          </Text>

          <Text>
            Si vous ne souhaitez pas faire confiance à <HostTag /> pour le
            traitement de vos données, {contactLink} pour installer cet outil
            sur la machine de votre choix.
          </Text>
        </Flex>
      </Row>
    </Box>
  );
};

const About = (props: PageProps) => (
  <Layout pageTitle="À propos" {...props}>
    <AboutPage {...props} />
  </Layout>
);

export default About;

{
  /* <LinkShare
              // _hover={{ bg: "transparent", color: "white" }}
              // bg="transparent"
              //height="auto"
              label="Copier l'adresse du lien"
              //minWidth={0}
              ml={1}
              url={url}
              tooltipProps={{
                placement: "right"
              }}
            /> */
}
