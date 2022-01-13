import { GetServerSidePropsContext } from "next";

const LoginPage = () => null;

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return { redirect: { permanent: false, destination: "/?login" } };
}

export default LoginPage;
