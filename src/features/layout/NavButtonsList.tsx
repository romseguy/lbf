import { CalendarIcon, ChatIcon } from "@chakra-ui/icons";
import { Button, Flex, useColorMode, useDisclosure } from "@chakra-ui/react";
import { useGetOrgsQuery } from "features/api/orgsApi";
import { Heading, Link, LinkProps } from "features/common";
import { TreeChartModal } from "features/modals/TreeChartModal";
import { InputNode } from "features/treeChart/types";
import { EOrgType, EOrgVisibility, IOrg, OrgTypes } from "models/Org";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { FaHome } from "react-icons/fa";
import { IoIosGitNetwork, IoMdGitNetwork } from "react-icons/io";
import { css } from "twin.macro";
import { AppQuery } from "utils/types";

export const NavButtonsList = ({
  direction = "row",
  isMobile,
  onClose
}: {
  direction?: "row" | "column";
  isMobile: boolean;
  onClose?: () => void;
}) => {
  const router = useRouter();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  //#region l'univers
  const orgsQuery = useGetOrgsQuery({
    orgType: EOrgType.NETWORK,
    populate: "orgs createdBy"
  }) as AppQuery<IOrg[]>;
  const planets = orgsQuery.data?.filter((org) =>
    org ? org.orgType === EOrgType.NETWORK : true
  );
  const {
    isOpen: isNetworksModalOpen,
    onOpen: openNetworksModal,
    onClose: closeNetworksModal
  } = useDisclosure({ defaultIsOpen: false });
  const inputNodes: InputNode[] = useMemo(() => {
    return planets
      ? planets
          .filter(
            (org) =>
              org.orgType === EOrgType.NETWORK &&
              org.orgVisibility !== EOrgVisibility.PRIVATE &&
              org.orgUrl !== "forum"
          )
          .map((org) => {
            return {
              name: org.orgName,
              children: org.orgs
                .filter(
                  ({ orgVisibility }) =>
                    orgVisibility !== EOrgVisibility.PRIVATE
                )
                .map(({ orgName, orgType }) => {
                  const name = `${
                    orgType === EOrgType.TREETOOLS
                      ? OrgTypes[orgType] + " : "
                      : ""
                  }${orgName}`;

                  return { name };
                })
            };
          })
      : [];
  }, [planets]);
  //#endregion

  const linkProps: Partial<LinkProps> = {
    "aria-hidden": true,
    alignSelf: "flex-start",
    variant: "no-underline"
  };
  const CSSObject = {
    colorScheme: isDark ? "gray" : "cyan",
    my: isMobile ? 2 : undefined
  };

  return (
    <Flex
      flexDirection={direction}
      flexWrap="wrap"
      mt={-3}
      css={css`
        button[data-active] {
          color: white;
        }
      `}
    >
      <Link
        {...linkProps}
        onClick={() => {
          router.push("/", "/", { shallow: true });
          onClose && onClose();
        }}
      >
        <Button
          leftIcon={<FaHome />}
          isActive={router.asPath === "/"}
          {...CSSObject}
        >
          Accueil
        </Button>
      </Link>

      <Link
        {...linkProps}
        onClick={() => {
          openNetworksModal();
        }}
      >
        <Button leftIcon={<IoIosGitNetwork />} {...CSSObject}>
          Naviguer
        </Button>
      </Link>

      {isNetworksModalOpen && (
        <TreeChartModal
          header={
            <Heading mb={3}>
              L'univers {process.env.NEXT_PUBLIC_SHORT_URL}
            </Heading>
          }
          inputNodes={inputNodes}
          isMobile={isMobile}
          isOpen={isNetworksModalOpen}
          onClose={closeNetworksModal}
        />
      )}

      <Link
        {...linkProps}
        onClick={() => {
          router.push("/evenements", "/evenements", { shallow: true });
          onClose && onClose();
        }}
      >
        <Button
          leftIcon={<CalendarIcon />}
          isActive={router.asPath === "/evenements"}
          {...CSSObject}
        >
          Événements
        </Button>
      </Link>

      <Link
        {...linkProps}
        onClick={() => {
          router.push("/forum", "/forum", { shallow: true });
          onClose && onClose();
        }}
      >
        <Button
          leftIcon={<ChatIcon />}
          isActive={router.asPath === "/forum"}
          {...CSSObject}
        >
          Forum
        </Button>
      </Link>
    </Flex>
  );
};
