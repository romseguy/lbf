import { Box, BoxProps, Image, useColorMode } from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

import React, { useState } from "react";
import { css } from "twin.macro";
import { Link } from "features/common";
import { EventCategoryTag } from "features/events/EventCategoryTag";
import theme, { logoHeight } from "features/layout/theme";
import { FullscreenModal } from "features/modals/FullscreenModal";
import {
  IEntity,
  IEntityBanner,
  IEntityLogo,
  isEvent,
  isOrg
} from "models/Entity";
import { IOrg, orgTypeFull } from "models/Org";
import { IUser } from "models/User";
import { HeaderTitle } from "./HeaderTitle";
import { useSelector } from "react-redux";
import { selectIsMobile } from "store/uiSlice";

export const Header = ({
  defaultTitle,
  entity,
  pageHeader,
  pageTitle,
  ...props
}: BoxProps & {
  defaultTitle: string;
  entity?: IEntity | IUser;
  pageHeader?: React.ReactNode;
  pageTitle?: string;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const isMobile = useSelector(selectIsMobile);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  // const router = useRouter();
  // const [executeScroll, elementToScrollRef] = useScroll<HTMLDivElement>();
  // useEffect(() => {
  //   if (router.asPath === "/") return;
  //   if (Array.isArray(router.query.name) && !!router.query.name[1]) return;
  //   executeScroll();
  //   console.log("🚀 ~ file: Header.tsx:41 ~ useEffect ~ executeScroll:");
  // }, [router.asPath]);

  const isE = isEvent(entity);
  const isO = isOrg(entity);
  let banner: IEntityBanner | undefined;
  let logo: IEntityLogo | undefined;
  let showTitle = true;
  if (isE) {
    banner = entity.eventBanner;
    logo = entity.eventLogo;
    showTitle = entity.eventStyles.showTitle;
  } else if (isO) {
    banner = entity.orgBanner;
    logo = entity.orgLogo;
    showTitle = entity.orgStyles.showTitle;
  }

  if (!banner && !logo && !showTitle) return null;

  return (
    <Box
      //ref={elementToScrollRef as React.ForwardedRef<HTMLDivElement>}
      as="header"
      //alignItems="center"
      borderRadius="lg"
      color={isDark ? "white" : "black"}
      css={css`
        display: flex;
        padding: 12px;

        ${isMobile
          ? `
        flex-direction: column;
        align-items: flex-start;
        justify-content: flex-end;
        `
          : `
        flex-direction: row;
        `}

        ${banner &&
        `
          background-image: url("${banner.base64 || banner.url}");
          background-size: 100% 100%;
          background-repeat: no-repeat;
          cursor: pointer;
          height: ${banner.headerHeight}px;
          ${logo ? `` : ``}
        `}

        ${!banner &&
        `
          /*background-color: ${
            isDark ? theme.colors.gray[700] : "lightblue"
          };*/
          background-color: ${
            isDark ? theme.colors.gray[700] : theme.colors.blackAlpha[50]
          };
          ${logo ? `` : ``}
        `}
      `}
      onClick={(e) => {
        e.stopPropagation();
        if (!isMobile) setIsBannerModalOpen(true);
      }}
      {...props}
    >
      {logo && (
        <Link
          alignSelf={isMobile ? undefined : "flex-end"}
          mb={isMobile ? 3 : undefined}
          onClick={(e) => {
            e.stopPropagation();
            setIsLogoModalOpen(true);
          }}
        >
          <Image
            src={logo.url || logo.base64}
            borderBottomLeftRadius="lg"
            borderTopLeftRadius={!banner && logo ? "lg" : undefined}
            borderTopRightRadius={!banner && logo ? undefined : "lg"}
            height={`${logoHeight}px`}
          />
        </Link>
      )}

      {/* {(!entity || showTitle) && (
        <HeaderTitle
          alignSelf={isMobile ? undefined : "flex-end"}
          entity={entity}
          pageHeader={pageHeader}
          pageTitle={pageTitle || defaultTitle}
        />
      )} */}

      {isE && typeof entity.eventCategory === "string" && (
        <EventCategoryTag
          event={entity}
          selectedCategory={entity.eventCategory}
          ml={2}
          variant="solid"
        />
      )}

      {banner && isBannerModalOpen && (
        <FullscreenModal
          header={
            <>
              Bannière{" "}
              {isE ? "de l'événement" : orgTypeFull((entity as IOrg).orgType)}
            </>
          }
          bodyProps={{ bg: "black" }}
          onClose={() => {
            setIsBannerModalOpen(false);
          }}
        >
          <Image
            alignSelf="center"
            src={(banner.url || banner.base64) as string}
            height={banner.height || 140}
            width={banner.width || 1154}
          />
        </FullscreenModal>
      )}

      {logo && isLogoModalOpen && (
        <FullscreenModal
          header={
            <>
              Logo{" "}
              {isE ? "de l'événement" : orgTypeFull((entity as IOrg).orgType)}
            </>
          }
          bodyProps={{ bg: "black" }}
          onClose={() => {
            setIsLogoModalOpen(false);
          }}
        >
          <Image
            alignSelf="center"
            src={(logo.url || logo.base64) as string}
            height={logo.height}
            width={logo.width}
          />
        </FullscreenModal>
      )}
    </Box>
  );
};
