// https://raw.githubusercontent.com/chakra-ui/chakra-ui/develop/examples/nextjs-typescript/components/NextChakraLink.tsx
import NextLink, { LinkProps as NextLinkProps } from "next/link";
import {
  Link as ChakraLink,
  LinkProps as ChakraLinkProps
} from "@chakra-ui/react";

// import { SerializedStyles } from "@emotion/react";
// declare type Url = string;
// type NextLinkProps = {
//   href?: Url;
//   as?: Url;
//   replace?: boolean;
//   scroll?: boolean;
//   shallow?: boolean;
//   passHref?: boolean;
//   prefetch?: boolean;
//   locale?: string | false;
//   className?: string;
//   // --
//   onClick?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
//   children: React.ReactNode | React.ReactNodeArray;
//   css?: SerializedStyles;
// };

export type LinkProps = Partial<NextLinkProps> &
  ChakraLinkProps & { variant?: "underline" };

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
      passHref
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
