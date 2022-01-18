import {
  ChatIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  EmailIcon
} from "@chakra-ui/icons";
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
  useColorMode,
  useDisclosure
} from "@chakra-ui/react";
import React, { useEffect, useMemo, useState } from "react";
import {
  FaGift,
  FaHandshake,
  FaKey,
  FaQuoteLeft,
  FaRegLightbulb
} from "react-icons/fa";
import { css } from "twin.macro";
import {
  Button,
  Container,
  EntityButton,
  Link,
  LinkShare,
  PageContainer
} from "features/common";
import { Layout } from "features/layout";
import { breakpoints } from "theme/theme";
import { PageProps } from "./_app";
import { setIsContactModalOpen } from "features/modals/modalSlice";
import { useAppDispatch } from "store";
import { NetworksModal } from "features/modals/NetworksModal";
import { useGetOrgsQuery } from "features/orgs/orgsApi";
import { selectOrgsRefetch } from "features/orgs/orgSlice";
import { InputNode } from "features/treeChart/types";
import { Visibility } from "models/Org";
import { useSelector } from "react-redux";
import { hasItems } from "utils/array";

let cachedRefetchOrgs = false;

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

  const {
    isOpen: isNetworksModalOpen,
    onOpen: openNetworksModal,
    onClose: closeNetworksModal
  } = useDisclosure({ defaultIsOpen: false });

  const orgsQuery = useGetOrgsQuery({ populate: "orgs" });
  const inputNodes: InputNode[] = useMemo(
    () =>
      orgsQuery.data
        ? orgsQuery.data
            .filter(
              (org) =>
                hasItems(org.orgs) && org.orgVisibility !== Visibility.PRIVATE
            )
            .map((org) => ({
              name: org.orgName,
              children: org.orgs?.map(({ orgName }) => ({ name: orgName }))
            }))
        : [],
    [orgsQuery.data]
  );

  const refetchOrgs = useSelector(selectOrgsRefetch);
  useEffect(() => {
    if (refetchOrgs !== cachedRefetchOrgs) {
      cachedRefetchOrgs = refetchOrgs;
      console.log("refetching orgs");
      orgsQuery.refetch();
    }
  }, [refetchOrgs]);

  const isGnsa =
    process.env.NEXT_PUBLIC_TITLE ===
    "GNSA Groupe National de Surveillance des Arbres";
  const [isCollapsed, setIsCollasped] = useState(isGnsa);
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
  const url = `${process.env.NEXT_PUBLIC_URL}/nom_de_votre_organisation`;

  return (
    <Layout {...props} pageTitle="Accueil">
      {isGnsa && (
        <Flex flexDirection="column">
          <Button
            alignSelf="center"
            colorScheme="teal"
            onClick={() => openNetworksModal()}
            mb={3}
          >
            Naviguer dans l'arborescence du GNSA
          </Button>

          <Button
            rightIcon={isCollapsed ? <ChevronRightIcon /> : <ChevronDownIcon />}
            alignSelf="center"
            colorScheme="teal"
            onClick={() => setIsCollasped(!isCollapsed)}
            mb={5}
          >
            À propos de cet outil
          </Button>
        </Flex>
      )}

      {!isGnsa && (
        <PageContainer pt={2} mb={5}>
          <Heading
            className="rainbow-text"
            alignSelf="flex-start"
            fontFamily="DancingScript"
            mb={3}
          >
            Équipez votre organisation
          </Heading>

          <List {...listStyles}>
            <ListItem>
              <Flex flexDirection="column">
                Avec un début de site internet et une adresse facile à retenir,
                par exemple :{" "}
                <Tag
                  alignSelf="flex-start"
                  colorScheme="red"
                  mt={1}
                  mr={1}
                  px={2}
                  py={3}
                >
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
              </Flex>
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
      )}

      {!isCollapsed && (
        <>
          <PageContainer pt={2}>
            <Heading
              alignSelf="flex-start"
              className="rainbow-text"
              fontFamily="DancingScript"
              mb={3}
            >
              Envoyez des invitations
            </Heading>

            <Box fontSize="xl">
              Invitez vos adhérents à vos événements, projets, et discussions.
              <Container>
                <Icon
                  as={FaRegLightbulb}
                  color={isDark ? "yellow" : "green"}
                  mr={3}
                />
                Saisissez la liste des adresses e-mail de vos adhérents, et
                envoyez les invitations, ou alors, créez une ou plusieurs listes
                de diffusion pour inviter seulement les personnes concernées.
              </Container>
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
              <Text ml={3}>
                Cet outil est un logiciel libre et open-source mis à disposition
                gratuitement par son créateur.
              </Text>
            </PageContainer>

            <PageContainer {...halfStyles} height="100%" minHeight={0}>
              <Icon as={EmailIcon} color="green" boxSize={[5, 4]} />
              <Text ml={3}>
                {host} peut envoyer jusqu'à 100 e-mails par jour. Si cela
                s'avère insuffisant, parlons en sur le{" "}
                <EntityButton org={{ orgUrl: "forum" }} />
              </Text>
            </PageContainer>
          </Flex>

          <PageContainer bg="transparent" border={0} p={0}>
            <PageContainer {...halfStyles}>
              <Icon as={FaKey} color="green" boxSize={[5, 4]} />
              <Text ml={3}>
                Pour que cet outil reste libre et open-source, la license{" "}
                {license} a été choisie.
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
                  <Icon as={FaQuoteLeft} /> La license {license} ne s'intéresse
                  pas au problème du SaaSS (service se substituant au logiciel).
                  On parle de SaaSS lorsque les utilisateurs font leurs propres
                  tâches informatiques sur l'ordinateur de quelqu'un d'autre.
                  Ceci les oblige à envoyer leurs données au serveur ; ce
                  dernier les traite et leur renvoie les résultats.
                </Text>

                <Text>
                  Si vous ne voulez pas faire confiance à {host} pour le
                  traitement de vos données,{" "}
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
      )}

      {isNetworksModalOpen && (
        <NetworksModal
          inputNodes={inputNodes}
          isMobile={props.isMobile}
          isOpen={isNetworksModalOpen}
          //header="Carte des réseaux"
          onClose={closeNetworksModal}
        />
      )}
    </Layout>
  );
};

export default IndexPage;
