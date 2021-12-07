import useScript, { ScriptStatus } from "@charlietango/use-script";
import { useEffect } from "react";
import { renderDonationButton } from "utils/paypal";

export const PaypalButton = () => {
  const [_, status] = useScript(
    "https://www.paypalobjects.com/donate/sdk/donate-sdk.js"
  );

  useEffect(() => {
    if (status === ScriptStatus.READY) renderDonationButton();
  }, [status]);

  if (status === ScriptStatus.ERROR) return null;

  return (
    <div id="donate-button-container">
      <div id="donate-button"></div>
    </div>
  );
};
