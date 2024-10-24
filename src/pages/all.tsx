//import Image from "next/image";
import { PageProps } from "main";
import { wrapper } from "store";
import api from "utils/api";
import { Box, Flex, Image } from "@chakra-ui/react";
import { useGetDocumentsQuery } from "features/api/documentsApi";
import { selectUserEmail } from "store/userSlice";

const PPage = ({ data, ...props }: PageProps) => {
  const { data: docs } = useGetDocumentsQuery({});
  //console.log("🚀 ~ PPage ~ docs:", docs);
  const images = data?.filter(
    ({ url }) => !docs?.find(({ _id, gallery }) => _id === url && !!gallery)
  );
  // const arr = images.map(
  //   ({ url: a }) => data?.find(({ url: b }) => a === b).url
  // );
  // console.log("🚀 ~ PPage ~ orphaned:", "rm " + arr.join(" "));
  return (
    <>
      <Flex flexDir="row" flexWrap="wrap">
        {images.map(({ url }) => {
          return (
            <Box key={url}>
              <Image
                src={`${process.env.NEXT_PUBLIC_FILES}/${url}`}
                height={200}
                onClick={() => console.log(url)}
              />
            </Box>
          );
        })}
      </Flex>
    </>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) => async (ctx) => {
    const userEmail = selectUserEmail(store.getState());
    const isAdmin =
      typeof process.env.ADMIN_EMAILS === "string"
        ? process.env.ADMIN_EMAILS.split(",").includes(userEmail)
        : false;

    if (!isAdmin)
      return {
        redirect: {
          permanent: false,
          destination: "/"
        }
      };

    const { data }: { data: { url: string }[] } = await api.client.get(
      "/images"
    );
    //return { props: { data: data.slice(0, 10) } };
    return { props: { data } };
  }
);

export default PPage;
