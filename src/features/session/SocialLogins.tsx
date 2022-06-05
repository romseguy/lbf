import { OAuthProvider } from "@magic-ext/oauth";
import React, { useState } from "react";

export const SocialLogins = ({
  onSubmit
}: {
  onSubmit: (provider: OAuthProvider) => void;
}) => {
  const providers = [
    //"apple",
    "google"
    // "facebook",
    // "github"
  ] as OAuthProvider[];
  const [isRedirecting, setIsRedirecting] = useState(false);

  return (
    <>
      {providers.map((provider) => {
        return (
          <div key={provider}>
            <button
              type="submit"
              className="social-btn"
              onClick={() => {
                setIsRedirecting(true);
                onSubmit(provider);
              }}
              key={provider}
              style={{ backgroundImage: `url(${provider}.png)` }}
            >
              {/* turns "google" to "Google" */}
              {provider.replace(/^\w/, (c) => c.toUpperCase())}
            </button>
          </div>
        );
      })}

      {isRedirecting && <>Redirecting...</>}

      <style jsx>{`
        .social-btn {
          cursor: pointer;
          border-radius: 50px;
          margin-bottom: 20px;
          border: 1px solid #8a8a8a;
          padding: 9px 24px 9px 35px;
          width: 80%;

          background-color: #fff;
          background-size: 20px;
          background-repeat: no-repeat;
          background-position: 23% 50%;
        }
      `}</style>
    </>
  );
};
