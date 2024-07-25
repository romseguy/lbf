import { wrapper } from "store";
import { PageProps } from "main";

const IndexPage = ({ ...props }: PageProps) => null;

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    return {
      redirect: {
        permanent: false,
        //@ts-ignore
        destination: "/photo"
      }
    };
  }
);

export default IndexPage;
