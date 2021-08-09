// https://raw.githubusercontent.com/chakra-ui/chakra-ui/develop/examples/nextjs-typescript/components/NextChakraLink.tsx
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import {
  ThemingProps,
  Link as ChakraLink,
  SpaceProps,
  TypographyProps
} from "@chakra-ui/react";
import { SerializedStyles } from "@emotion/react";
declare type Url = string;

export type LinkProps = ThemingProps &
  SpaceProps &
  TypographyProps & {
    href?: Url;
    as?: Url;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    prefetch?: boolean;
    locale?: string | false;
    className?: string;
    // --
    onClick?: () => void;
    children: React.ReactNode | React.ReactNodeArray;
    css?: SerializedStyles;
  };

export const Link = ({
  // NextLink
  href,
  as,
  replace,
  scroll,
  shallow,
  prefetch,
  // Chakra
  className,
  size,
  variant,
  onClick,
  children,
  ...props
}: LinkProps) => {
  const chakraLink = (
    <ChakraLink
      className={className}
      size={size}
      variant={variant}
      onClick={onClick}
      {...props}
    >
      {children}
    </ChakraLink>
  );
  if (!href) {
    return chakraLink;
  }
  return (
    <NextLink
      passHref={true}
      href={href}
      as={as}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      prefetch={prefetch}
    >
      {chakraLink}
    </NextLink>
  );
};
