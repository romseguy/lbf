import { Flex, FlexProps, Button, Spinner } from "@chakra-ui/react";
import { OAuthProvider } from "@magic-ext/oauth";
import React, { useState } from "react";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { capitalize } from "utils/string";

export const SocialLogins = ({
  onSubmit,
  ...props
}: Omit<FlexProps, "onSubmit"> & {
  onSubmit: (provider: OAuthProvider) => void;
}) => {
  const providers = ["google", "facebook"] as OAuthProvider[];
  const [provider, setProvider] = useState<string>();

  return (
    <Flex {...props}>
      {providers.map((p) => {
        return (
          <Button
            key={p}
            isDisabled={!!provider}
            leftIcon={p === "google" ? <FaGoogle /> : <FaFacebook />}
            mb={3}
            onClick={() => {
              setProvider(p);
              onSubmit(p);
            }}
          >
            {/* {p.replace(/^\w/, (c) => c.toUpperCase())} */}
            {capitalize(p)}
          </Button>
        );
      })}

      {provider && <Spinner mb={3} />}
    </Flex>
  );
};
