import { Box } from "@chakra-ui/react";
import React from "react";
import { SimpleLayout } from "features/layout";
import { PageProps } from "main";
import { css } from "twin.macro";

const Page = ({ isMobile }: PageProps) => {
  return (
    <SimpleLayout title="Les cahiers de Sand & Jenaël" isMobile={isMobile}>
      <Box
        css={css`
          iframe {
            width: 100vw;
            height: calc(100vh - 150px);
          }
        `}
      >
        {/* <iframe src="/html/cahiers.html" /> */}
        <iframe src={`${process.env.NEXT_PUBLIC_FILES}/cahiers.html`} />
      </Box>
    </SimpleLayout>
  );
};

export default Page;
