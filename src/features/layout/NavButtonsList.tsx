import { CalendarIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  useColorMode,
  useDisclosure,
  useToast,
  InputGroup,
  InputLeftAddon,
  Icon
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { FaGlobeEurope, FaHome } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useGetOrgsQuery } from "features/api/orgsApi";
import { Link, LinkProps, SearchInput } from "features/common";
import { TreeChartModal } from "features/modals/TreeChartModal";
import { InputNode } from "features/treeChart/types";
import { EOrgType, EOrgVisibility, IOrg, OrgTypes } from "models/Org";
import { unauthorizedEntityUrls } from "utils/url";
import { selectIsMobile } from "store/uiSlice";
import { css } from "twin.macro";
import { AppQuery } from "utils/types";

export const NavButtonsList = ({
  direction = "row",
  onClose,
  ...props
}: {
  direction?: "row" | "column";
  isNetworksModalOpen?: boolean;
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
  const [keyword, setKeyword] = useState("");
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
          .filter((org) => {
            if (
              org.orgType === EOrgType.NETWORK &&
              [EOrgVisibility.PUBLIC, EOrgVisibility.FRONT].includes(
                org.orgVisibility
              ) &&
              org.orgUrl !== "forum"
            ) {
              if (!keyword) return true;

              console.log(
                "🚀 ~ .filter ~ keyword:",
                keyword.toLowerCase(),
                org.orgName.toLowerCase(),
                org.orgName.toLowerCase().includes(keyword.toLowerCase())
              );
              return org.orgName.toLowerCase().includes(keyword.toLowerCase());
            }

            return false;
          })
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
  }, [keyword, planets]);
  //#endregion

  useEffect(() => {
    if (props.isNetworksModalOpen !== undefined) {
      if (props.isNetworksModalOpen) openNetworksModal();
      else closeNetworksModal();
    }
  }, [props.isNetworksModalOpen]);

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

      {isNetworksModalOpen && (
        <TreeChartModal
          // header={
          //   <AppHeading smaller={isMobile} mb={3}>
          //     {rootName}
          //   </AppHeading>
          // }
          header={
            <InputGroup>
              <InputLeftAddon children={<Icon as={FaGlobeEurope} />} />
              <SearchInput
                placeholder="Rechercher un nom de planète"
                width="calc(100% - 70px)"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
              />
            </InputGroup>
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
