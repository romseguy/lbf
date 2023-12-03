import { ChevronRightIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { Box, Flex, Heading, Text, Table, Tr, Td } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { AppHeading, Column, ContactLink, Link } from "features/common";
import { Layout } from "features/layout";
import { PageProps } from "main";
import { useScroll } from "hooks/useScroll";
import { Badge, Icon, useColorMode } from "@chakra-ui/react";
import { FaGift, FaQuoteLeft } from "react-icons/fa";
import { Row, HostTag } from "features/common";
import { useDiskUsage } from "hooks/useDiskUsage";
import { bytesForHuman } from "utils/string";
import theme from "features/layout/theme";

const PrivacyPage = ({ isMobile }: PageProps) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const [diskUsage] = useDiskUsage();
  const [isTOSCollapsed, setIsTOSCollapsed] = useState(true);
  const [isPolicyCollapsed, setIsPolicyCollapsed] = useState(true);
  const [isNoticeCollapsed, setIsNoticeCollapsed] = useState(true);
  const [executeScrollToTOS, TOSRef] = useScroll<HTMLDivElement>();
  const [executeScrollToPolicy, PolicyRef] = useScroll<HTMLDivElement>();
  const [executeScrollToNotice, NoticeRef] = useScroll<HTMLDivElement>();

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (!isTOSCollapsed) {
      timer = setTimeout(() => {
        if (!isTOSCollapsed) {
          executeScrollToTOS();
        }
      }, 100);
    }

    return () => timer && clearTimeout(timer);
  }, [isTOSCollapsed]);
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (!isPolicyCollapsed) {
      timer = setTimeout(() => {
        if (!isPolicyCollapsed) {
          executeScrollToPolicy();
        }
      }, 100);
    }

    return () => timer && clearTimeout(timer);
  }, [isPolicyCollapsed]);
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    if (!isNoticeCollapsed) {
      timer = setTimeout(() => {
        if (!isNoticeCollapsed) {
          executeScrollToNotice();
        }
      }, 100);
    }

    return () => timer && clearTimeout(timer);
  }, [isNoticeCollapsed]);

  const columnProps = {
    maxWidth: "4xl",
    m: "0 auto",
    mb: 3,
    py: "0"
  };
  const hostTagProps = { verticalAlign: "middle" };
  const rowProps = {
    bg: isDark ? "gray.600" : "lightcyan",
    border: 0,
    fontSize: "sm",
    p: 2,
    mb: 3
  };
  const tableProps = {
    borderWidth: "1px",
    mb: 3,
    css: `
    ${
      isDark
        ? `
        td {
          border-color: ${theme.colors.gray[500]};
        }
      `
        : ``
    }
    `
  };

  return (
    <Layout isMobile={isMobile} pageTitle="Conditions Générales d'Utilisation">
      <Box m="0 auto" maxWidth="4xl">
        <Row {...rowProps}>
          <Icon as={FaGift} color="green" boxSize={[5, 4]} mr={3} />
          <Flex flexDir="column">
            <Text>
              <HostTag {...hostTagProps} /> est un service qui utilise un
              logiciel libre et open-source mis à disposition gratuitement par{" "}
              <Link
                href="https://github.com/romseguy"
                target="_blank"
                variant="underline"
              >
                @romseguy
              </Link>{" "}
              sous couvert de la license GNU AGPL.
            </Text>

            <Text
              bg={isDark ? "black" : "white"}
              border="1px solid black"
              borderRadius="lg"
              my={2}
              p={2}
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
              Donc si vous ne souhaitez pas confier vos données à{" "}
              <HostTag {...hostTagProps} /> <ContactLink /> pour savoir comment
              installer ce logiciel chez vous.
            </Text>
          </Flex>
        </Row>

        {/* <Row {...rowStyles(isDark)}>
            <Icon as={FaKey} color="green" boxSize={[5, 4]} />
            <Flex flexDirection="column" ml={3}>
            </Flex>
          </Row> */}
      </Box>

      <Column {...columnProps}>
        <Box
          display="flex"
          alignItems="center"
          ref={TOSRef}
          cursor="pointer"
          onClick={() => setIsTOSCollapsed(!isTOSCollapsed)}
        >
          <AppHeading pr={1}>Conditions du service</AppHeading>

          {isTOSCollapsed ? (
            <ChevronRightIcon boxSize={10} />
          ) : (
            <ChevronUpIcon boxSize={10} />
          )}
        </Box>

        {!isTOSCollapsed && (
          <>
            <Column {...columnProps} mt={3} py={1} pb={2}>
              <AppHeading smaller>Préambule</AppHeading>
              <Text>
                En utilisant le service <HostTag {...hostTagProps} /> vous
                acceptez d'être lié·e par ses conditions générales
                d'utilisation. Le service se réserve le droit de mettre à jour
                et modifier ces conditions de temps à autre et de vous prévenir
                si un changement important survient.
              </Text>
            </Column>

            <Column {...columnProps} m="0" py={1} pb={2}>
              <AppHeading smaller>Limitations</AppHeading>
              <Text>
                Le service peut envoyer jusqu'à{" "}
                <Badge colorScheme="purple">100</Badge> e-mails par jour
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
                . Si cela s'avère insuffisant <ContactLink />
              </Text>
            </Column>

            <AppHeading smaller mb={3}>
              Engagements
            </AppHeading>

            <Table {...tableProps} bg={isDark ? "gray.700" : "transparent"}>
              <Tr>
                <Td>
                  Votre contenu vous appartient (mais nous vous encourageons à
                  le publier sous licence libre) ;
                </Td>
              </Tr>
              <Tr>
                <Td>
                  <HostTag {...hostTagProps} /> n'exploitera pas vos données
                  personnelles, sauf pour vous prévenir d'un changement
                  important sur le service ;
                </Td>
              </Tr>
              <Tr>
                <Td borderWidth={0}>
                  <HostTag {...hostTagProps} /> ne transmettra ni ne revendra
                  vos données personnelles ;
                </Td>
              </Tr>
            </Table>

            <AppHeading smaller mb={3}>
              Clauses
            </AppHeading>

            <Table {...tableProps} bg={isDark ? "gray.700" : "transparent"}>
              <Tr>
                <Td>
                  Clause{" "}
                  <em>« Si ça casse, nous ne sommes pas obligé de réparer »</em>{" "}
                  : <HostTag {...hostTagProps} /> propose ce service
                  gratuitement et librement. Si vous perdez des données, par
                  votre faute ou par la notre, désolé, mais ça arrive. Nous
                  ferons ce que nous pouvons pour les récupérer, mais nous ne
                  nous assignons aucune obligation de résultat. En clair, évitez
                  de mettre des données sensibles ou importantes sur les
                  services <HostTag {...hostTagProps} />, car en cas de perte,
                  nous ne garantissons pas leur récupération ;
                </Td>
              </Tr>
              <Tr>
                <Td>
                  Clause{" "}
                  <em>
                    « Si vous n'êtes pas content·es, vous êtes invité·es à aller
                    voir ailleurs »
                  </em>{" "}
                  : si le service ne vous convient pas, libre à vous d'en
                  trouver un équivalent (ou meilleur) ailleurs, ou de monter le
                  votre ;
                </Td>
              </Tr>
              <Tr>
                <Td>
                  Clause <em>« Tout abus sera puni »</em> : si un·e
                  utilisateur·ice abuse du service, par exemple en monopolisant
                  les ressources machines partagées, ou en publiant publiquement
                  des contenus considérés comme non pertinents, son contenu ou
                  son compte pourra être supprimé sans avertissement ni
                  négociation. <HostTag {...hostTagProps} /> reste seul juge de
                  cette notion « d'abus » dans le but de fournir le meilleur
                  service possible à l'ensemble de ses utilisateur·ices. Si cela
                  vous parait anti-démocratique, anti-libriste,
                  anti-liberté-d'expression, merci de vous référer à la clause
                  précédente ;
                </Td>
              </Tr>
              <Tr>
                <Td borderWidth={0}>
                  Clause « Rien n'est éternel » : le service peut fermer (faute
                  de fonds pour le maintenir, par exemple), il peuvent être
                  victime d'intrusion (le « 100 % sécurisé » n'existe pas). Nous
                  vous encourageons donc à conserver une copie des données qui
                  vous importent, car <HostTag {...hostTagProps} /> ne saurait
                  être tenu pour responsable de leur hébergement sans limite de
                  temps.
                </Td>
              </Tr>
            </Table>
          </>
        )}
      </Column>

      <Column
        {...columnProps}
        css={`
          h2 {
            font-size: 1.25em;
            font-weight: bold;
          }
        `}
      >
        <Flex
          ref={PolicyRef}
          alignItems="center"
          cursor="pointer"
          onClick={() => setIsPolicyCollapsed(!isPolicyCollapsed)}
        >
          <Heading as="h1">Privacy Policy</Heading>
          {isPolicyCollapsed ? (
            <ChevronRightIcon boxSize={10} />
          ) : (
            <ChevronUpIcon boxSize={10} />
          )}
        </Flex>

        {!isPolicyCollapsed && (
          <>
            <p>
              We are <HostTag {...hostTagProps} /> ("we", "our", "us"). We're
              committed to protecting and respecting your privacy. If you have
              questions about your personal information please{" "}
              <Link href="/contact" variant="underline">
                contact us
              </Link>
              .
            </p>
            <h2>What information we hold about you</h2>
            <p>The type of data that we collect and process includes:</p>
            <ul>
              <li>Your username.</li>
              <li>Your email address.</li>
            </ul>
            <p>
              Further data may be collected if you choose to share it, such as
              if you fill out fields on your profile.
            </p>
            <p>
              We collect some or all of this information in the following cases:
            </p>
            <ul>
              <li>You fill out our login or contact form.</li>
              <li>You fill out fields on your profile.</li>
            </ul>
            <h2>How your personal information is used</h2>
            <p>We may use your personal information in the following ways:</p>
            <ul>
              <li>
                For the purposes of making you a registered member of our site,
                in order for you to contribute content to this site.
              </li>
              <li>
                We may use your email address if you chose to be informed of
                activity on our site.
              </li>
            </ul>
            <h2>Other ways we may use your personal information</h2>
            <p>
              We may collect non-personally identifiable information about you
              in the course of your interaction with our site. This information
              may include technical information about the browser or type of
              device you're using. This information will be used purely for the
              purposes of adapting to the device you are using.
            </p>
            <h2>Keeping your data secure</h2>
            <p>
              We are committed to ensuring that any information you provide to
              us is secure. In order to prevent unauthorized access or
              disclosure, we have put in place suitable measures and procedures
              to safeguard and secure the information that we collect.
            </p>
            <h2>Cookie policy</h2>
            <p>
              Cookies are small text files which are set by us on your computer
              which allow us to provide certain functionality on our site, such
              as being able to log in, or remembering certain preferences.
            </p>
            <h2>Rights</h2>
            <p>
              You have a right to access the personal data we hold about you or
              obtain a copy of it. To do so please{" "}
              <Link href="/contact" variant="underline">
                contact us
              </Link>
              . If you believe that the information we hold for you is
              incomplete or inaccurate, you may{" "}
              <Link href="/contact" variant="underline">
                contact us
              </Link>{" "}
              to ask us to complete or correct that information.
            </p>
            <p>
              You also have the right to request the erasure of your personal
              data. Please{" "}
              <Link href="/contact" variant="underline">
                contact us
              </Link>{" "}
              if you would like us to remove your personal data.
            </p>
            <h2>Acceptance of this policy</h2>
            <p>
              Continued use of our site signifies your acceptance of this
              policy. If you do not accept the policy then please do not use
              this site. When registering we will further request your explicit
              acceptance of the privacy policy.
            </p>
            <h2>Changes to this policy</h2>
            <p>
              We may make changes to this policy at any time. You may be asked
              to review and re-accept the information in this policy if it
              changes in the future.
            </p>
          </>
        )}
      </Column>

      <Column {...columnProps}>
        <Flex
          ref={NoticeRef}
          alignItems="center"
          cursor="pointer"
          onClick={() => setIsNoticeCollapsed(!isNoticeCollapsed)}
        >
          <Heading>Legal Notice</Heading>
          {isNoticeCollapsed ? (
            <ChevronRightIcon boxSize={10} />
          ) : (
            <ChevronUpIcon boxSize={10} />
          )}
        </Flex>

        {!isNoticeCollapsed && (
          <>
            <p>
              The providers ("we", "us", "our") of the service provided by this
              web site ("Service") are not responsible for any user-generated
              content and accounts. Content submitted express the views of their
              author only.
            </p>

            <p>
              This Service is only available to users who are at least 18 years
              old. If you are younger than this, please do not register for this
              Service. If you register for this Service, you represent that you
              are this age or older.
            </p>

            <p>
              All content you submit, upload, or otherwise make available to the
              Service ("Content") may be reviewed by staff members. All Content
              you submit or upload may be sent to third-party verification
              services (including, but not limited to, spam prevention
              services). Do not submit any Content that you consider to be
              private or confidential.
            </p>

            <p>
              You agree to not use the Service to submit or link to any Content
              which is defamatory, abusive, hateful, threatening, spam or
              spam-like, likely to offend, contains adult or objectionable
              content, contains personal information of others, risks copyright
              infringement, encourages unlawful activity, or otherwise violates
              any laws. You are entirely responsible for the content of, and any
              harm resulting from, that Content or your conduct.
            </p>

            <p>
              We may remove or modify any Content submitted at any time, with or
              without cause, with or without notice. Requests for Content to be
              removed or modified will be undertaken only at our discretion. We
              may terminate your access to all or any part of the Service at any
              time, with or without cause, with or without notice.
            </p>

            <p>
              You are granting us with a non-exclusive, permanent, irrevocable,
              unlimited license to use, publish, or re-publish your Content in
              connection with the Service. You retain copyright over the
              Content.
            </p>

            <p>These terms may be changed at any time without notice.</p>

            <p>
              If you do not agree with these terms, please do not register or
              use the Service. Use of the Service constitutes acceptance of
              these terms. If you wish to close your account, please{" "}
              <Link href="/contact" variant="underline">
                contact us
              </Link>
              .
            </p>
          </>
        )}
      </Column>
    </Layout>
  );
};

export default PrivacyPage;
