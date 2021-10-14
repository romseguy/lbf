export const PaypalButton = () => {
  return (
    <form action="https://www.paypal.com/donate" method="post" target="_top">
      <input type="hidden" name="hosted_button_id" value="Z59K3UWBJDUS8" />
      <input
        type="image"
        src="https://www.paypalobjects.com/fr_FR/FR/i/btn/btn_donate_LG.gif"
        name="submit"
        title="PayPal - The safer, easier way to pay online!"
        alt="Donate with PayPal button"
      />
      <img
        alt=""
        src="https://www.paypal.com/fr_FR/i/scr/pixel.gif"
        width="1"
        height="1"
      />
    </form>
  );
};
