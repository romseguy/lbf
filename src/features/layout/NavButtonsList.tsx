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
import { GrWorkshop } from "react-icons/gr";
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
import { useSession } from "hooks/useSession";

export const NavButtonsList = ({
  direction = "row",
  onClose,
  ...props
}: {
  direction?: "row" | "column";
  isNetworksModalOpen?: boolean;
  onClose?: () => void;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const isMobile = useSelector(selectIsMobile);
  const router = useRouter();
  const { data: session } = useSession();
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
  const createdBy = session ? session.user.userId : undefined;
  const orgsQuery = useGetOrgsQuery({
    createdBy,
    orgType: EOrgType.NETWORK,
    populate: "orgs createdBy"
  }) as AppQuery<IOrg[]>;

  const {
    isOpen: isNetworksModalOpen,
    onOpen: openNetworksModal,
    onClose: closeNetworksModal
  } = useDisclosure({ defaultIsOpen: false });

  const inputNodes: InputNode[] = (orgsQuery.data || [])
    .filter((org) => {
      let canDisplay =
        org.orgType === EOrgType.NETWORK && org.orgUrl !== "forum";

      if (!session) {
        canDisplay =
          canDisplay &&
          [EOrgVisibility.PUBLIC, EOrgVisibility.FRONT].includes(
            org.orgVisibility
          );
      }

      if (canDisplay) {
        if (!keyword) return true;

        // console.log(
        //   "🚀 ~ .filter ~ keyword:",
        //   keyword.toLowerCase(),
        //   org.orgName.toLowerCase(),
        //   org.orgName.toLowerCase().includes(keyword.toLowerCase())
        // );
        return org.orgName.toLowerCase().includes(keyword.toLowerCase());
      }

      return false;
    })
    .map((org) => {
      return {
        name: org.orgName,
        children: org.orgs
          .filter(({ orgName, orgVisibility }) => {
            let canDisplay = orgVisibility === EOrgVisibility.PUBLIC;
            if (canDisplay) {
              if (!keyword) return true;

              return org.orgName.toLowerCase().includes(keyword.toLowerCase());
            }
            return false;
          })
          .map(({ orgName, orgType }) => {
            return {
              name: orgName,
              prefix:
                orgType === EOrgType.TREETOOLS ? OrgTypes[orgType] + " : " : ""
            };
          })
      };
    });
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
              <InputLeftAddon children={<Icon as={GrWorkshop} />} />
              <SearchInput
                placeholder="Rechercher un nom de atelier"
                width="calc(100% - 80px)"
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
      {/* {(isMobile || !isEntityPage) && (
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
      )} */}
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
