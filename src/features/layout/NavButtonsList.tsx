import { CalendarIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Tooltip,
  useColorMode,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { FaHome } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useGetOrgsQuery } from "features/api/orgsApi";
import { AppHeading, DarkModeSwitch, Link, LinkProps } from "features/common";
import { TreeChartModal } from "features/modals/TreeChartModal";
import { InputNode } from "features/treeChart/types";
import { EOrgType, EOrgVisibility, IOrg, OrgTypes } from "models/Org";
import { unauthorizedEntityUrls } from "utils/url";
import { selectIsMobile } from "store/uiSlice";
import { css } from "twin.macro";
import { AppQuery } from "utils/types";

export const NavButtonsList = ({
  direction = "row",
  onClose
}: {
  direction?: "row" | "column";
  onClose?: () => void;
}) => {
  const isMobile = useSelector(selectIsMobile);
  const router = useRouter();
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const toast = useToast({ position: "top" });

  const buttonProps = {
    // bg: isDark ? "red.300" : "teal.500",
    // color: isDark ? "black" : "white",
    colorScheme: "red",
    borderRadius: "9999px",
    marginRight: "12px",
    my: isMobile ? 2 : undefined
    // _hover: {
    //   bg: isDark ? "blue.400" : "blue.400",
    //   color: isDark ? "white" : undefined
    // }
  };
  const isEntityPage =
    Array.isArray(router.query.name) &&
    !unauthorizedEntityUrls.includes(router.query.name[0]);
  const linkProps: Partial<LinkProps> = {
    "aria-hidden": true,
    alignSelf: "flex-start"
  };
  const rootName = "Tous les forums";

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
              org.orgVisibility === EOrgVisibility.PUBLIC &&
              org.orgUrl !== "forum"
          )
          .map((org) => {
            return {
              name: org.orgName,
              children: org.orgs
                .filter(
                  ({ orgVisibility }) => orgVisibility === EOrgVisibility.PUBLIC
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
        <>
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
        </>
      )}

      {/* Parcourir */}
      <Link
        {...linkProps}
        onClick={() => {
          if (inputNodes.length > 0) openNetworksModal();
          else toast({ title: "Aucune planètes.", status: "warning" });
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

      {/* Événements */}
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
    </Flex>
  );
};

{
  /*
    {(isMobile || !isEntityPage) && (
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
    )}
  */
}
