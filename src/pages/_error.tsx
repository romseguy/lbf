import { NextPageContext } from "next";
import { isMobile } from "react-device-detect";
import { Layout } from "features/layout";
import { useSession } from "hooks/useSession";

function Error({ statusCode, message }: { statusCode: number; message: string; }) {
  const { data: session } = useSession();
  return (
    <Layout isMobile={isMobile} pageTitle="Erreur">
      {`Une erreur ${
        statusCode ? `(${statusCode})` : ""
      } est survenue : ${message}`}
    </Layout>
  );
}

Error.getInitialProps = (ctx: NextPageContext) => {
  const { res, err } = ctx;
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  const message = err?.message || "aucun message d'erreur"
  return { statusCode, message };
};

export default Error;
