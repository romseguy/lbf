import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { GlobalConfig } from "features/GlobalConfig";
import { GlobalStyles } from "features/layout";

export interface PageProps {
  isMobile: boolean;
}

export const Main = ({
  Component,
  ...props
}: PageProps & { Component: NextPage<PageProps> }) => {
  const router = useRouter();

  return (
    <>
      {router.pathname !== "/callback" && <GlobalConfig {...props} />}
      <GlobalStyles />
      <Component
        {...props}
        //isMobile
      />
    </>
  );
};
