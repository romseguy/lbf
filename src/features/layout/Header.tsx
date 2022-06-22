import { Flex, Image, useColorMode, FlexProps } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { css } from "twin.macro";
import { Link } from "features/common";
import { EventCategoryTag } from "features/events/EventCategoryTag";
import { logoHeight } from "features/layout/theme";
import { FullscreenModal } from "features/modals/FullscreenModal";
import { useScroll } from "hooks/useScroll";
import {
  IEntity,
  IEntityBanner,
  IEntityLogo,
  isEvent,
  isOrg
} from "models/Entity";
import { IOrg, orgTypeFull } from "models/Org";
import { HeaderTitle } from "./HeaderTitle";

export const Header = ({
  defaultTitle,
  entity,
  pageTitle,
  ...props
}: FlexProps & {
  defaultTitle: string;
  entity?: IEntity;
  pageTitle?: string;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const router = useRouter();
  const [executeScroll, elementToScrollRef] = useScroll<HTMLDivElement>();
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  useEffect(() => {
    if (router.asPath === "/") return;
    if (Array.isArray(router.query.name) && !!router.query.name[1]) return;
    executeScroll();
  }, [router.asPath]);

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
    <Flex
      ref={elementToScrollRef as React.ForwardedRef<HTMLDivElement>}
      as="header"
      alignItems="center"
      bg={isDark ? "gray.700" : "lightblue"}
      borderRadius="lg"
      color={isDark ? "white" : "black"}
      cursor={banner ? "pointer" : "default"}
      height={banner ? banner.headerHeight : undefined}
      p={
        banner && !logo
          ? "0 12px 0 12px"
          : banner && logo
          ? "0 12px 0 0"
          : !banner && !logo
          ? 3
          : !banner && logo
          ? "0 12px 0 0"
          : undefined
      }
      css={
        banner
          ? css`
              background-image: url("${banner.base64 || banner.url}");
              background-size: 100% 100%;
              background-repeat: no-repeat;
            `
          : undefined
      }
      onClick={(e) => {
        e.stopPropagation();
        setIsBannerModalOpen(true);
      }}
      {...props}
    >
      {logo && (
        <Link
          alignSelf="flex-end"
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

      {(!entity || showTitle) && (
        <HeaderTitle entity={entity} pageTitle={pageTitle || defaultTitle} />
      )}

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
    </Flex>
  );
};
