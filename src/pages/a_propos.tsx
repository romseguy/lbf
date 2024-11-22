import {
  Button,
  Flex,
  HStack,
  Icon,
  Tag,
  Text,
  useColorMode,
  VStack
} from "@chakra-ui/react";
import {
  AppHeading,
  EntityAddButton,
  HostTag,
  Link,
  LinkProps,
  Row
} from "features/common";
import { Layout } from "features/layout";
import { PageProps } from "main";
import { EOrgType } from "models/Org";
import { useRouter } from "next/router";
import React from "react";
import { FaGift, FaQuoteLeft } from "react-icons/fa";
import { useAppDispatch } from "store";
import { setIsContactModalOpen } from "store/modalSlice";

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

const OrgTag = ({ isMobile }: { isMobile: boolean }) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <Tag
      border="1px solid"
      p={5}
      {...(isDark ? {} : {})}
      {...(isMobile
        ? {
            flexDirection: "column",
            alignItems: "flex-start"
          }
        : {})}
    >
      <Flex flexWrap="wrap" m={2}>
        {process.env.NEXT_PUBLIC_URL}
        <b>/nom_de_la_planete</b>
      </Flex>
    </Tag>
  );
};

export const AboutPage = ({ isMobile }: PageProps) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const router = useRouter();
  const hostTagProps = { verticalAlign: "middle" };

  return (
    <>
      <VStack align="left" spacing={3}>
        <AppHeading smaller>Présentation</AppHeading>

        <Row {...(isDark ? {} : {})}>
          <Icon as={FaGift} color="green" boxSize={[5, 4]} mx={3} />
          <Flex flexDir="column">
            <Text>
              <HostTag {...hostTagProps} /> est un service qui fait
              démonstration d'un logiciel libre et open-source mis à disposition
              gratuitement par{" "}
              <Link
                href="https://romseguy.com"
                target="_blank"
                variant="underline"
              >
                @romseguy
              </Link>{" "}
              sous couvert de la license GNU AGPL.
            </Text>

            <Text
              bg={isDark ? "black" : "white"}
              border="1px solid"
              borderRadius="lg"
              m={3}
              ml={0}
              p={3}
            >
              <Icon as={FaQuoteLeft} {...hostTagProps} /> La license GNU AGPL ne
              s'intéresse pas au problème du SaaSS (Service as a Software
              Substitute, service se substituant au logiciel). On parle de SaaSS
              lorsque les utilisateurs font leurs propres tâches informatiques
              sur l'ordinateur de quelqu'un d'autre. Ceci les oblige à envoyer
              leurs données au serveur ; ce dernier les traite et leur renvoie
              les résultats.
            </Text>

            <Text>
              Si vous ne souhaitez pas faire confiance à{" "}
              <HostTag {...hostTagProps} /> pour traiter vos données{" "}
              <ContactLink /> pour savoir comment installer le logiciel de
              @romseguy où vous le souhaitez.
            </Text>
          </Flex>
        </Row>

        <AppHeading mt={3} smaller>
          Premiers pas
        </AppHeading>

        <HStack>
          <Text>Pour créer votre forum</Text>
          <EntityAddButton
            label="Ajoutez une planète"
            orgType={EOrgType.NETWORK}
          />
          <Text>et partagez son adresse :</Text>
        </HStack>

        <Flex mt={3}>
          <OrgTag isMobile={isMobile} />
        </Flex>

        <Flex mt={3}>
          <Button
            colorScheme="teal"
            onClick={() =>
              router.push("nom_de_votre_forum", "nom_de_votre_forum", {
                shallow: true
              })
            }
          >
            Voir un exemple
          </Button>
        </Flex>
      </VStack>
    </>
  );
};

const About = (props: PageProps) => (
  <Layout
    pageTitle={`À propos de ${process.env.NEXT_PUBLIC_SHORT_URL}`}
    mainContainer={true}
    {...props}
  >
    <AboutPage {...props} />
  </Layout>
);

export default About;
