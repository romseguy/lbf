import { NextPage } from "next";
import { useRouter } from "next/router";
import React from "react";
import { GlobalConfig } from "features/GlobalConfig";
import { GlobalStyles } from "features/layout";
import { Session } from "utils/auth";

export interface PageProps {
  email: string;
  isMobile: boolean;
  session: Session | null;
}

export const Main = ({
  Component,
  //email,
  ...props
}: PageProps & { Component: NextPage<PageProps> }) => {
  //console.log("Main.props", props);
  const router = useRouter();
  //const userEmail = useSelector(selectUserEmail);

  return (
    <>
      {router.pathname !== "/callback" && <GlobalConfig {...props} />}
      <GlobalStyles />
      <Component
        {...props}
        //isMobile
        //email={session ? session.user.email : email ? email : userEmail}
      />
    </>
  );
};
