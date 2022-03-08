import { EmailIcon, Icon } from "@chakra-ui/icons";
import {
  Flex,
  FlexProps,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Tag,
  Text,
  useColorMode,
  Box,
  Badge
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  FaGift,
  FaKey,
  FaHandshake,
  FaQuoteLeft,
  FaLightbulb,
  FaShare
} from "react-icons/fa";
import { css } from "twin.macro";
import {
  Row,
  EntityButton,
  Heading,
  HostTag,
  Link,
  Column
} from "features/common";
import { useAppDispatch } from "store";
import { setIsContactModalOpen } from "./modalSlice";
import { useDiskUsage } from "hooks/useDiskUsage";
import { bytesForHuman } from "utils/string";

type AboutModalProps = {
  isMobile: boolean;
  isOpen: boolean;
  onClose: () => void;
};

const columnStyles: (isDark: boolean) => FlexProps = (isDark) => ({
  bg: isDark ? "gray.600" : "lightblue",
  textAlign: "center"
});

const rowStyles: (isDark: boolean) => FlexProps = (isDark) => ({
  bg: isDark ? "gray.600" : "lightblue",
  border: 0,
  fontSize: "sm",
  p: 2
});

const AboutPage = ({ ...props }: AboutModalProps) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const dispatch = useAppDispatch();
  const router = useRouter();

  const [className, setClassName] = useState<string | undefined>();
  const contactLink = (
    <Link
      variant="underline"
      onClick={() => dispatch(setIsContactModalOpen(true))}
    >
      contactez-nous
    </Link>
  );
  const diskUsage = useDiskUsage();
  const license = (
    <a
      href="https://www.gnu.org/licenses/why-affero-gpl.fr.html"
      target="_blank"
      style={{ textDecoration: "underline" }}
    >
      GNU AGPL
    </a>
  );
  const url = `${process.env.NEXT_PUBLIC_URL}/nom de votre organisation`;

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
        <Flex flexDirection="column">
          <Text mb={2}>
            Avec un début de site internet et une adresse facile à retenir, par
            exemple :
          </Text>

          <Tag bg={isDark ? "gray.500" : "lightcyan"} m="0 auto" px={1} py={1}>
            {url}
            <IconButton
              aria-label="Visite guidée"
              colorScheme="teal"
              icon={<FaShare />}
              ml={1}
              onClick={() => {
                props.onClose();
                router.push(url, url, { shallow: true });
              }}
            />
            {/* <LinkShare
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
            /> */}
          </Tag>

          <Box m="0 auto">
            {/* <Link
              alignSelf="flex-start"
              fontSize="smaller"
              variant="underline"
              href={url}
              mt={2}
            >
              Voir la démonstration
            </Link> */}
            {/* <Button
              colorScheme="teal"
              mt={3}
              onClick={() => router.push(url, url, { shallow: true })}
            >
              Visite guidée
            </Button> */}
          </Box>
        </Flex>
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
          alignSelf="flex-start"
          bg={isDark ? "gray.500" : "lightcyan"}
          m="0 auto"
          px={3}
        >
          <Icon as={FaLightbulb} color={isDark ? "yellow" : "green"} mr={1} />
          Créez vos propres listes pour envoyer des invitations seulement aux
          personnes concernés.
        </Row>
      </Column>

      <Heading>Partage & Limitations</Heading>

      <Row {...rowStyles(isDark)}>
        <Icon as={EmailIcon} color="green" boxSize={[5, 4]} />
        <Text lineHeight={2} ml={3}>
          <HostTag /> peut envoyer jusqu'à{" "}
          <Badge colorScheme="purple">100 e-mails</Badge> par jour
          {typeof diskUsage.current !== "undefined" &&
            typeof diskUsage.max !== "undefined" && (
              <>
                , et stocker{" "}
                <Badge colorScheme="purple">
                  {bytesForHuman(diskUsage.max)}
                </Badge>{" "}
                de données
              </>
            )}
          . Si cela s'avère insuffisant, parlons financement participatif sur le{" "}
          <EntityButton org={{ orgUrl: "forum" }} />
        </Text>
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

export const AboutModal = ({ ...props }: AboutModalProps) => {
  return (
    <Modal
      isOpen={props.isOpen}
      size="4xl"
      onClose={() => {
        props.onClose && props.onClose();
      }}
    >
      <ModalOverlay>
        <ModalContent my={0}>
          {/* <ModalHeader display="flex" alignItems="center" pb={0}>
            <InfoIcon color="green" mr={2} /> À propos
          </ModalHeader> */}
          <ModalCloseButton />
          <ModalBody>
            <AboutPage {...props} />
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

{
  /*
const halfStyles: (isDark: boolean) => FlexProps = (isDark) => ({
  alignItems: "center",
  bg: isDark ? "gray.600" : "lightblue",
  flex: 1,
  flexDirection: "row",
  maxWidth: "auto",
  m: "0"
});

const listStyles = {
  listStyleType: "square",
  mb: 3,
  ml: 5,
  spacing: 2
};
*/
}

{
  /* <Flex alignItems="center">
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
        </Flex> */
}

{
  /* <Spacer borderWidth={1} mt={5} /> */
}

{
  /* <Flex
        m="0 auto"
        maxWidth="4xl"
        css={css`
          @media (max-width: ${breakpoints.sm}) {
            display: block;
          }
        `}
      >
        <PageContainer
          {...columnStyles(isDark)}
          css={css`
            @media (min-width: ${breakpoints.sm}) {
              margin-right: 12px;
            }
          `}
        >
          A
        </PageContainer>

        <PageContainer {...columnStyles(isDark)} height="100%" minHeight={0}>
          B
        </PageContainer>
      </Flex> */
}
