import useScript, { ScriptStatus } from "@charlietango/use-script";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { renderDonationButton } from "utils/paypal";

export const PaypalButton = () => {
  const router = useRouter();
  const [rendered, setRendered] = useState(false);
  const [ready, status] = useScript(
    "https://www.paypalobjects.com/donate/sdk/donate-sdk.js"
  );
  useEffect(() => {
    setRendered(false);
  }, [router.asPath]);

  if (status === ScriptStatus.ERROR) {
    if (process.env.NODE_ENV === "production")
      console.error("Failed to load Paypal API");
    return null;
  }

  if (ready && !rendered) {
    renderDonationButton();
    setRendered(true);
  }

  return (
    <div id="donate-button-container">
      <div id="donate-button"></div>
    </div>
  );
};
