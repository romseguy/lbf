import { Alert, AlertIcon, Button } from "@chakra-ui/react";
import { OAuthProvider } from "@magic-ext/oauth";
import React, { useState } from "react";
import { FaFacebook, FaGoogle } from "react-icons/fa";
import { capitalize } from "utils/string";

export const SocialLogins = ({
  onSubmit
}: {
  onSubmit: (provider: OAuthProvider) => void;
}) => {
  const providers = ["google", "facebook"] as OAuthProvider[];
  const [provider, setProvider] = useState<string>();

  return (
    <>
      {providers.map((p) => {
        return (
          <div key={p}>
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
          </div>
        );
      })}

      {provider && (
        <Alert status="info">
          <AlertIcon />
          Vous allez être redirigé vers la page de connexion{" "}
          {capitalize(provider)}...
        </Alert>
      )}
    </>
  );
};
