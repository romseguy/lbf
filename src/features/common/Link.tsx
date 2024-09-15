import {
  Box,
  BoxProps,
  Link as ChakraLink,
  LinkProps as ChakraLinkProps
} from "@chakra-ui/react";
import { LinkProps as NextLinkProps } from "next/link";
import { useRouter } from "next/router";
import { PropsWithChildren } from "react";

export type LinkProps = PropsWithChildren<
  BoxProps & Partial<ChakraLinkProps> & Partial<NextLinkProps>
>;

export const Link = ({
  children,
  // NextLink
  href,
  // as,
  // replace,
  // scroll,
  // shallow,
  // prefetch,
  // Chakra
  // variant,
  // onClick,
  ...props
}: Omit<LinkProps, "color">) => {
  const router = useRouter();

  if (typeof props.as === "string") {
    return (
      <Box
        {...props}
        onClick={(e) => {
          props.onClick && props.onClick(e);
        }}
      >
        {children}
      </Box>
    );
  }

  if (typeof href === "string") {
    return (
      <a
        href={href}
        {...(props.variant === "underline"
          ? { style: { textDecoration: "underline" } }
          : {})}
        {...props}
        onClick={(e) => {
          if (!props.target) {
            e.preventDefault();
            router.push(href, href, { shallow: props.shallow });
            props.onClick && props.onClick(e);
          }
        }}
      >
        {children}
      </a>
    );
  }

  if (props.onClick) {
    return <ChakraLink {...props}>{children}</ChakraLink>;
  }

  return <>{children}</>;
};

// https://raw.githubusercontent.com/chakra-ui/chakra-ui/develop/examples/nextjs-typescript/components/NextChakraLink.tsx
