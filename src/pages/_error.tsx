import { NextPageContext } from "next";
import { isMobile } from "react-device-detect";
import { Layout } from "features/layout";
import { useSession } from "hooks/useAuth";

function Error({ statusCode }: { statusCode: number }) {
  const { data: session } = useSession();
  return (
    <Layout isMobile={isMobile} pageTitle="Erreur" session={session}>
      {`Une erreur ${
        statusCode ? `(${statusCode})` : ""
      } est survenue, merci de contacter le créateur de cet outil.`}
    </Layout>
  );
}

Error.getInitialProps = (ctx: NextPageContext) => {
  const { res, err } = ctx;
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
