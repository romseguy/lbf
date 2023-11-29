import localtunnel from "localtunnel";
import nodemailer, { SendMailOptions as Mail } from "nodemailer";

const sendMail = async (mail: Mail) => {
  try {
    const server = {
      pool: true,
      host: "smtp-relay.brevo.com",
      port: 587,
      secure: false, // use TLS
      auth: {
        user: "rom.seguy@lilo.org",
        pass: "hQj2dKDg0ML5yHNZ"
      }
    };

    const transport = nodemailer.createTransport(server);
    await transport.sendMail(mail);

    console.log(`sent mail to ${mail.to}`, mail);
  } catch (error: any) {
    console.log(`error sending mail to ${mail.to}`, mail);
    console.error(error);
  }
};

(async () => {
  const tunnel = await localtunnel({ port: 8001 });

  // the assigned public url for your tunnel
  // i.e. https://abcdefgjhij.localtunnel.me
  // tunnel.url;
  await sendMail({
    from: "lbf@lebonforum.fr",
    to: "rom.seguy@lilo.org",
    subject: "Tunnel ON@" + tunnel.url,
    html: "Tunnel ON@" + tunnel.url
  });

  tunnel.on("close", async () => {
    // tunnels are closed
    await sendMail({
      from: "lbf@lebonforum.fr",
      to: "rom.seguy@lilo.org",
      subject: "Tunnel OFF",
      html: "Tunnel OFF"
    });
  });
})();
