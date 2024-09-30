import { Box, HStack, Image, Spinner } from "@chakra-ui/react";
import { FullscreenModal } from "features/modals/FullscreenModal";
import { PageProps } from "main";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaImage } from "react-icons/fa";
import { useSelector } from "react-redux";
import { selectScreenHeight } from "store/uiSlice";
import { css } from "twin.macro";
import { getImageDimensions } from "utils/image";

const FullscreenPage = ({ ...props }: PageProps) => {
  const router = useRouter();
  const url = process.env.NEXT_PUBLIC_FILES + "/" + router.query.imgName;
  const [height, setHeight] = useState(0);
  const [width, setWidth] = useState(0);
  const screenHeight = useSelector(selectScreenHeight);
  useEffect(() => {
    (async () => {
      if (!screenHeight) return;
      const { width: w, height: h } = await getImageDimensions(url);
      const r = w / h;
      const nh = screenHeight - 52;
      const nw = r * nh;
      setHeight(nh);
      setWidth(nw);
    })();
  }, [url, screenHeight]);

  const header = (
    <HStack>
      <FaImage />
      {/* <Text>tarace</Text> */}
    </HStack>
  );

  return (
    <FullscreenModal
      header={header}
      onClose={() => {
        window.history.back();
      }}
    >
      <Box m="0 auto">
        {!height || !width ? (
          <Spinner />
        ) : (
          <Image src={url} height={`${height}px`} width={`${width}px`} />
        )}
      </Box>
    </FullscreenModal>
  );
};

export default FullscreenPage;
