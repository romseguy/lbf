import { useState } from "react";
import { Forum } from "features/forum/Forum";
import { Layout, LayoutProps } from "features/layout";
import { PageProps } from "./_app";

const ForumPage = ({
  tabItem,
  ...props
}: PageProps &
  Omit<LayoutProps, "children"> & {
    tabItem?: string;
  }) => {
  const [isLogin, setIsLogin] = useState(0);

  return (
    <Layout pageTitle="Forum" isLogin={isLogin} {...props}>
      <Forum isLogin={isLogin} setIsLogin={setIsLogin} tabItem={tabItem} />
    </Layout>
  );
};

export default ForumPage;
