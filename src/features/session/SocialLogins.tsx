import { Alert, AlertIcon, Button } from "@chakra-ui/react";
import { OAuthProvider } from "@magic-ext/oauth";
import React, { useState } from "react";
import { FaFacebook, FaGoogle } from "react-icons/fa";

export const SocialLogins = ({
  onSubmit
}: {
  onSubmit: (provider: OAuthProvider) => void;
}) => {
  const providers = [
    //"apple",
    "google",
    "facebook"
    // "github"
  ] as OAuthProvider[];
  const [isRedirecting, setIsRedirecting] = useState(false);

  return (
    <>
      {providers.map((provider) => {
        return (
          <div key={provider}>
            <Button
              key={provider}
              isDisabled={isRedirecting}
              leftIcon={provider === "google" ? <FaGoogle /> : <FaFacebook />}
              mb={3}
              onClick={() => {
                setIsRedirecting(true);
                onSubmit(provider);
              }}
            >
              {/* turns "google" to "Google" */}
              {provider.replace(/^\w/, (c) => c.toUpperCase())}
            </Button>
          </div>
        );
      })}

      {isRedirecting && (
        <Alert status="info">
          <AlertIcon />
          Vous allez être redirigé vers la page de connexion Google...
        </Alert>
      )}
    </>
  );
};
