import { Flex, TabList, TabListProps, useColorMode } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useScroll } from "hooks/useScroll";

export const EntityPageTabList = ({ children, ...props }: TabListProps) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  // const router = useRouter();
  // const [executeScroll, elementToScrollRef] = useScroll<HTMLDivElement>();
  // useEffect(() => {
  //   if (
  //     Array.isArray(router.query.name) &&
  //     !!router.query.name[1] &&
  //     !router.query.name[2]
  //   ) {
  //     executeScroll();
  //     console.log(
  //       "🚀 ~ file: EntityPageTabList.tsx:14 ~ useEffect ~ executeScroll"
  //     );
  //   }
  // }, [router.asPath]);

  return (
    <TabList
      //ref={elementToScrollRef as React.ForwardedRef<HTMLDivElement>}
      as="nav"
      bg={isDark ? "gray.700" : "lightblue"}
      borderRadius="xl"
      {...props}
    >
      <Flex flexWrap="wrap" mt={-3} p={2}>
        {children}
      </Flex>
    </TabList>
  );
};
