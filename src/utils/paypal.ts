declare const PayPal: any;

export const renderDonationButton = () => {
  PayPal.Donation.Button({
    env: "production",
    hosted_button_id: "Z59K3UWBJDUS8",
    image: {
      src: "https://www.paypalobjects.com/fr_FR/FR/i/btn/btn_donate_SM.gif",
      alt: "Faire un don"
    }
  }).render("#donate-button");
};
