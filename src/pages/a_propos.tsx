import { EmailIcon } from "@chakra-ui/icons";
import {
  Badge,
  Box,
  Flex,
  FlexProps,
  Icon,
  IconButton,
  List,
  ListItem,
  Tag,
  Text,
  useColorMode
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import {
  FaGift,
  FaKey,
  FaQuoteLeft,
  FaLightbulb,
  FaShare,
  FaGlobeEurope
} from "react-icons/fa";
import { css } from "twin.macro";
import {
  Row,
  EntityButton,
  Heading,
  HostTag,
  Link,
  Column,
  LinkProps
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

const ContactLink = (props: LinkProps) => {
  const dispatch = useAppDispatch();
  return (
    <Link
      variant="underline"
      onClick={() => dispatch(setIsContactModalOpen(true))}
      {...props}
    >
      contactez-nous
    </Link>
  );
};

export const AboutPage = ({
  isMobile,
  ...props
}: PageProps & { onClose?: () => void }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const dispatch = useAppDispatch();
  const router = useRouter();

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
  const OrgTag = ({ orgUrl = "nom_de_votre_planete" }: { orgUrl?: string }) => {
    const url = `${process.env.NEXT_PUBLIC_URL}/${orgUrl}/discussions`;
    const urlElement = (
      <Flex flexWrap="wrap" my={2}>
        {process.env.NEXT_PUBLIC_URL}
        <b>/{orgUrl}</b>
        /discussions
      </Flex>
    );
    const iconButtonProps = isMobile ? {} : { ml: 2 };
    const tagProps: any = isMobile
      ? {
          flexDirection: "column",
          alignItems: "flex-start"
        }
      : {};

    return (
      <Tag bg={isDark ? "gray.500" : "orange.100"} px={1} py={1} {...tagProps}>
        <Icon as={FaGlobeEurope} boxSize={6} color="green" mr={2} />
        {urlElement}
        <IconButton
          aria-label="Page d'accueil d'un forum"
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
  const lightbulb = (
    <Icon as={FaLightbulb} color={isDark ? "yellow" : "green"} mr={1} />
  );

  return (
    <Box
      width={isMobile ? "auto" : "2xl"}
      m="0 auto"
      css={css`
        & > * {
          margin-bottom: 12px !important;
        }
      `}
    >
      <Heading>Créez l'arborescence de votre forum</Heading>

      <Column {...columnStyles(isDark)}>
        <List listStyleType="bullet" ml={5}>
          <ListItem mb={3}>
            <Text mb={1}>
              <Link href="/planetes/ajouter" shallow variant="underline">
                Créez une planète
              </Link>
              , et accédez à votre <b>forum</b> par cette adresse :
            </Text>

            <OrgTag />
          </ListItem>

          <ListItem>
            <Text mb={1}>
              <Link href="/arbres/ajouter" shallow variant="underline">
                Créez un arbre
              </Link>
              , ajoutez le à la forêt de votre planète, et accéder à votre{" "}
              <b>sous-forum</b> par cette adresse :{" "}
            </Text>

            <OrgTag orgUrl="nom_de_votre_arbre" />
          </ListItem>

          {/* <ListItem mt={2}>
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
          </ListItem> */}

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

      {/* <Heading>Partage & Limitations</Heading>

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
          gratuitement, <ContactLink /> pour obtenir son code source.
        </Text>
      </Row>

      <Row {...rowStyles(isDark)}>
        <Icon as={FaKey} color="green" boxSize={[5, 4]} />
        <Flex flexDirection="column" ml={3}>
          <Text>
            Pour qu'il reste libre et open-source, la license {license} a été
            choisie.
          </Text>

          <Text
            bg={isDark ? "black" : "white"}
            border="1px solid black"
            borderRadius="lg"
            fontSize="small"
            my={2}
            p={2}
          >
            <Icon as={FaQuoteLeft} mr={1} /> La license {license} ne s'intéresse
            pas au problème du SaaSS (service se substituant au logiciel). On
            parle de SaaSS lorsque les utilisateurs font leurs propres tâches
            informatiques sur l'ordinateur de quelqu'un d'autre. Ceci les oblige
            à envoyer leurs données au serveur ; ce dernier les traite et leur
            renvoie les résultats.
          </Text>

          <Flex flexDirection="column" alignItems="center">
            <Text>
              Si vous ne souhaitez pas faire confiance à <HostTag mx={1} /> pour
              le traitement de vos données, <ContactLink /> pour installer cet
              outil sur la machine de votre choix.
            </Text>
          </Flex>
        </Flex>
      </Row> */}

      {/* <Row {...rowStyles(isDark)}>
        <Icon as={FaHandshake} color="green" boxSize={[5, 4]} />
        <Flex flexDirection="column" ml={3}>
        </Flex>
      </Row> */}
    </Box>
  );
};

const About = (props: PageProps) => (
  <Layout
    pageTitle={`À propos de ${process.env.NEXT_PUBLIC_SHORT_URL}`}
    {...props}
  >
    <AboutPage {...props} />
  </Layout>
);

export default About;

{
  /*
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
  */
}

{
  /*
    <Heading>Communiquez depuis votre planète</Heading>

    <Column {...columnStyles(isDark)}>
      <Row
        {...rowStyles(isDark)}
        bg={isDark ? "gray.500" : "orange.100"}
        px={3}
      >
        {lightbulb}
        Créez des listes d'abonnés. votre choix.
      </Row>
      <Row
        {...rowStyles(isDark)}
        bg={isDark ? "gray.500" : "orange.100"}
        px={3}
      >
        {lightbulb}
        Invitez les personnes de ces listes aux discussions et événements.
      </Row>

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
  */
}
