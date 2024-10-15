import { Alert, AlertIcon, Spinner } from "@chakra-ui/react";
import { Layout } from "features/layout";
import { useSession } from "hooks/useSession";
import { PageProps } from "main";
import { useEffect } from "react";
import { useAppDispatch, wrapper } from "store";
import { setIsSessionLoading, setSession } from "store/sessionSlice";
import { resetUserEmail } from "store/userSlice";
import api from "utils/api";
import { magic } from "utils/auth";

interface LogoutPageProps {
  loggedOut: boolean;
}

const LogoutPage = ({ loggedOut, ...props }: PageProps & LogoutPageProps) => {
  const dispatch = useAppDispatch();
  const { loading: isSessionLoading } = useSession();
  useEffect(() => {
    (async () => {
      if (await magic.user.isLoggedIn()) {
        await magic.user.logout();
      }
      dispatch(setIsSessionLoading(false));
    })();
  }, [magic]);
  return (
    <Layout {...props} pageTitle="Déconnexion">
      {isSessionLoading ? (
        <Spinner />
      ) : (
        <Alert status={loggedOut ? "success" : "error"}>
          <AlertIcon />
          {loggedOut
            ? "Vous êtes déconnecté"
            : "Vous n'avez pas pu être déconnecté"}
        </Alert>
      )}
    </Layout>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    try {
      store.dispatch(setIsSessionLoading(true));
      store.dispatch(resetUserEmail());
      const { status, data } = await api.get("logout");
      if (status === 200) {
        store.dispatch(setSession(null));
        return { props: { loggedOut: status === 200 } };
      }
      return { props: { loggedOut: false } };
    } catch (error) {
      console.log("🚀 ~ error:", error);
      return { props: { loggedOut: false } };
    }
  }
);

export default LogoutPage;
