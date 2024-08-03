import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton
} from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

import React from "react";
import { AboutPage } from "pages/a_propos";
import { PageProps } from "main";

interface AboutModalProps extends PageProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal = ({ ...props }: AboutModalProps) => {
  return (
    <Modal
      isOpen={props.isOpen}
      size="4xl"
      onClose={() => {
        props.onClose && props.onClose();
      }}
    >
      <ModalOverlay>
        <ModalContent my={0}>
          {/* <ModalHeader display="flex" alignItems="center" pb={0}>
            <InfoIcon color="green" mr={2} /> À propos
          </ModalHeader> */}
          <ModalCloseButton />
          <ModalBody>
            <AboutPage {...props} />
          </ModalBody>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};

{
  /*
const halfStyles: (isDark: boolean) => FlexProps = (isDark) => ({
  alignItems: "center",
  bg: isDark ? "gray.600" : "orange.100",
  flex: 1,
  flexDirection: "row",
  maxWidth: "auto",
  m: "0"
});

const listStyles = {
  listStyleType: "square",
  mb: 3,
  ml: 5,
  spacing: 2
};
*/
}

{
  /* <Flex alignItems="center">
          <ChatIcon color={isDark ? "yellow" : "green"} mr={2} />
          <Link
            className={className}
            variant="underline"
            href="/forum"
            onMouseEnter={() => setClassName("rainbow-text")}
            onMouseLeave={() => setClassName(undefined)}
          >
            Proposer des idées sur le forum
          </Link>
        </Flex> */
}

{
  /* <Spacer borderWidth={1} mt={5} /> */
}

{
  /* <Flex
        m="0 auto"
        maxWidth="4xl"
        css={css`
          @media (max-width: ${breakpoints.sm}) {
            display: block;
          }
        `}
      >
        <PageContainer
          {...columnStyles(isDark)}
          css={css`
            @media (min-width: ${breakpoints.sm}) {
              margin-right: 12px;
            }
          `}
        >
          A
        </PageContainer>

        <PageContainer {...columnStyles(isDark)} height="100%" minHeight={0}>
          B
        </PageContainer>
      </Flex> */
}
