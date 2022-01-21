import { ChatIcon, EmailIcon, Icon, InfoIcon } from "@chakra-ui/icons";
import {
  Flex,
  FlexProps,
  Heading,
  List,
  ListItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Tag,
  Text,
  Tooltip,
  useColorMode,
  Box
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FaGift, FaKey, FaHandshake, FaQuoteLeft } from "react-icons/fa";
import { css } from "twin.macro";
import {
  Container,
  EntityButton,
  Link,
  LinkShare,
  PageContainer,
  Spacer
} from "features/common";
import { useAppDispatch } from "store";
import { breakpoints } from "theme/theme";
import { setIsContactModalOpen } from "./modalSlice";

type AboutModalProps = {
  isMobile: boolean;
  isOpen: boolean;
  onClose: () => void;
};

const listStyles = {
  listStyleType: "square",
  mb: 3,
  ml: 5,
  spacing: 2
};

const halfStyles: FlexProps = {
  alignItems: "center",
  flex: 1,
  flexDirection: "row",
  maxWidth: "auto",
  m: "0",
  mt: 5
};

const AboutPage = ({ ...props }: AboutModalProps) => {
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
  const url = `${process.env.NEXT_PUBLIC_URL}/nom de votre organisation`;
  return (
    <>
      <PageContainer pt={2} mb={5}>
        <Heading
          alignSelf="flex-start"
          className="rainbow-text"
          fontFamily="DancingScript"
          fontSize={["2xl", "4xl"]}
          mb={3}
        >
          Équipez votre organisation
        </Heading>

        <List {...listStyles}>
          <ListItem>
            <Flex flexDirection="column">
              <Text>
                Avec un début de site internet et une adresse facile à retenir,
                par exemple :
              </Text>

              <Tag colorScheme="red" my={2} mr={1} px={2} py={3}>
                {url}
                <LinkShare
                  _hover={{ bg: "transparent", color: "white" }}
                  bg="transparent"
                  height="auto"
                  label="Copier l'adresse du lien"
                  minWidth={0}
                  ml={1}
                  url={url}
                  tooltipProps={{
                    placement: "right"
                  }}
                />
              </Tag>

              <Link
                alignSelf="flex-start"
                fontSize="smaller"
                variant="underline"
                href={url}
                mr={1}
              >
                Voir la démonstration
              </Link>
            </Flex>
          </ListItem>

          <ListItem>
            Avec un outil plus adapté, ergonomique et éthique que les{" "}
            <Tooltip label="synonymes : mailing lists, newsletters">
              <Text
                display="inline"
                borderBottom={
                  props.isMobile
                    ? undefined
                    : `1px dotted ${isDark ? "white" : "black"}`
                }
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
        <Heading
          alignSelf="flex-start"
          className="rainbow-text"
          fontFamily="DancingScript"
          fontSize={["2xl", "4xl"]}
          mb={3}
        >
          Fonctionnalités
        </Heading>

        <Box>
          Invitez vos adhérents à vos événements, projets, et discussions.
          <Container fontSize="sm" mt={3}>
            <Icon as={InfoIcon} color={isDark ? "yellow" : "green"} mx={3} />
            En saisissant les adresses e-mail de vos adhérents, vous pourrez
            envoyer les invitations, ou bien créer une ou plusieurs listes de
            diffusion pour inviter seulement les personnes concernées.
          </Container>
        </Box>
      </PageContainer>

      <Spacer borderWidth={1} mt={5} />

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
          <Text ml={3}>
            Cet outil est un logiciel libre et open-source mis à disposition
            gratuitement par son créateur.
          </Text>
        </PageContainer>

        <PageContainer {...halfStyles} height="100%" minHeight={0}>
          <Icon as={EmailIcon} color="green" boxSize={[5, 4]} />
          <Text ml={3}>
            {host} peut envoyer jusqu'à 100 e-mails par jour. Si cela s'avère
            insuffisant, parlons en sur le{" "}
            <EntityButton org={{ orgUrl: "forum" }} />
          </Text>
        </PageContainer>
      </Flex>

      <PageContainer bg="transparent" border={0} p={0}>
        <PageContainer {...halfStyles}>
          <Icon as={FaKey} color="green" boxSize={[5, 4]} />
          <Text ml={3}>
            Pour que cet outil reste libre et open-source, la license {license}{" "}
            a été choisie.
          </Text>
        </PageContainer>

        <PageContainer {...halfStyles}>
          <Icon as={FaHandshake} color="green" boxSize={[5, 4]} />
          <Flex flexDirection="column" ml={3}>
            <Text
              bg={isDark ? "black" : "white"}
              border="1px solid black"
              borderRadius="lg"
              fontSize="smaller"
              mb={2}
              p={2}
            >
              <Icon as={FaQuoteLeft} /> La license {license} ne s'intéresse pas
              au problème du SaaSS (service se substituant au logiciel). On
              parle de SaaSS lorsque les utilisateurs font leurs propres tâches
              informatiques sur l'ordinateur de quelqu'un d'autre. Ceci les
              oblige à envoyer leurs données au serveur ; ce dernier les traite
              et leur renvoie les résultats.
            </Text>

            <Text>
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
    </>
  );
};

export const AboutModal = ({ ...props }: AboutModalProps) => {
  return (
    <Modal
      isOpen={props.isOpen}
      onClose={() => {
        props.onClose && props.onClose();
      }}
    >
      <ModalOverlay>
        <ModalContent my={0}>
          <ModalHeader pb={0}>À propos</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <AboutPage {...props} />
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
