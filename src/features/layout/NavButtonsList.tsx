import { CalendarIcon, ChatIcon, SearchIcon } from "@chakra-ui/icons";
import { Button, Flex, useColorMode, useDisclosure } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { FaHome } from "react-icons/fa";
import { IoIosGitNetwork, IoMdGitNetwork } from "react-icons/io";
import { useSelector } from "react-redux";
import { useGetOrgsQuery } from "features/api/orgsApi";
import { AppHeading, Link, LinkProps } from "features/common";
import { TreeChartModal } from "features/modals/TreeChartModal";
import { InputNode } from "features/treeChart/types";
import { EOrgType, EOrgVisibility, IOrg, OrgTypes } from "models/Org";
import { unauthorizedEntityUrls } from "utils/url";
import { selectIsMobile } from "store/uiSlice";
import { css } from "twin.macro";
import { AppQuery } from "utils/types";

export const NavButtonsList = ({
  direction = "row",
  title,
  onClose
}: {
  direction?: "row" | "column";
  title?: string;
  onClose?: () => void;
}) => {
  const isMobile = useSelector(selectIsMobile);
  const router = useRouter();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const buttonProps = {
    borderRadius: "9999px",
    colorScheme: isDark ? "gray" : "cyan",
    background: isDark ? undefined : "lightcyan",
    marginRight: "12px",
    my: isMobile ? 2 : undefined
  };
  const isEntityPage =
    Array.isArray(router.query.name) &&
    !unauthorizedEntityUrls.includes(router.query.name[0]);
  const linkProps: Partial<LinkProps> = {
    "aria-hidden": true,
    alignSelf: "flex-start"
  };
  const rootName = "Forum public";

  //#region parcourir
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
                  return {
                    name: orgName,
                    prefix:
                      orgType === EOrgType.TREETOOLS
                        ? OrgTypes[orgType] + " : "
                        : ""
                  };
                })
            };
          })
      : [];
  }, [planets]);
  //#endregion

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
      {isMobile && (
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
            {...buttonProps}
          >
            Accueil
          </Button>
        </Link>
      )}

      <Link
        {...linkProps}
        onClick={() => {
          openNetworksModal();
        }}
      >
        <Button leftIcon={<SearchIcon />} {...buttonProps}>
          Parcourir
        </Button>
      </Link>

      {isNetworksModalOpen && inputNodes.length > 0 && (
        <TreeChartModal
          header={
            <AppHeading smaller={isMobile} mb={3}>
              {rootName}
            </AppHeading>
          }
          inputNodes={inputNodes}
          isOpen={isNetworksModalOpen}
          rootName=" "
          onClose={() => {
            closeNetworksModal();
            onClose && onClose();
          }}
        />
      )}

      {(isMobile || !isEntityPage) && (
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
            {...buttonProps}
          >
            Événements
          </Button>
        </Link>
      )}

      {/* {(isMobile || !isEntityPage) && (
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
            {...buttonProps}
          >
            Forum
          </Button>
        </Link>
      )} */}
    </Flex>
  );
};
