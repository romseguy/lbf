import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { sendMail } from "api/email";
import { clientPromise } from "database";
import { logJson, normalize } from "utils/string";
import { randomNumber } from "utils/randomNumber";

const CustomAdapter = () => {
  const adapter = MongoDBAdapter(
    process.env.NODE_ENV === "development"
      ? global._mongoClientPromise
      : clientPromise
  );

  const originalCreateUser = adapter.createUser;

  adapter.createUser = async (user) => {
    return originalCreateUser({
      ...user,
      userName:
        normalize(user.email as string).replace(/@.+/, "") +
        "-" +
        randomNumber(2)
    });
  };

  return adapter;
};

export default NextAuth({
  pages: {
    verifyRequest: "/auth/verify"
    //newUser: "/auth/newUser",
    //error: "/auth/newUser"
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Adresse e-mail", type: "text" },
        password: { label: "Mot de passe", type: "password" }
      },
      //@ts-expect-error
      authorize: async (credentials, req) => {
        logJson("AUTHORIZE", credentials);
        return credentials;
      }
    }),
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      maxAge: 24 * 60 * 60, // How long email links are valid for (default 24h)
      sendVerificationRequest: async ({
        identifier: email,
        url,
        provider: { server, from }
      }) => {
        try {
          const { host } = new URL(url);
          const mail = {
            to: email,
            from,
            subject: `Connexion à ${host}`,
            text: text({ url, host }),
            html: html({ url, host, email }),
            encoding: "UTF-8"
          };
          await sendMail(mail);
        } catch (error) {
          console.error("error sending verification email", error);
          throw error;
        }
      }
    })
  ],
  secret: process.env.SECRET,
  adapter: CustomAdapter(),
  // adapter: MongoDBAdapter(
  //   process.env.NODE_ENV === "development"
  //     ? global._mongoClientPromise
  //     : clientPromise
  // ),
  session: {
    // Signin in with credentials is only supported if JSON Web Tokens are enabled!
    //
    // Use JSON Web Tokens for session instead of database sessions.
    // This option can be used with or without a database for users/accounts.
    // Note: `jwt` is automatically set to `true` if no database is specified.
    strategy: "jwt"
  },
  // jwt: {
  //   secret: process.env.SECRET
  // },
  callbacks: {
    /*
     * This JSON Web Token callback is called whenever a JSON Web Token is created (i.e. at sign in)
     * or updated (i.e whenever a session is accessed in the client).
     * /api/auth/signin, getSession(), useSession(), /api/auth/session
     */
    async jwt(params) {
      //console.log("JWT() PARAMS:", params);
      let { token, user, account, profile, isNewUser } = params;
      //console.log("JWT() RETURN:", token);
      return token;
    },

    /*
     * The session callback is called whenever a session is checked.
     * e.g. getSession(), useSession(), /api/auth/session
     */
    async session(params) {
      //console.log("SESSION() PARAMS:", params);
      const { session, token } = params;

      // If you want to make something available you added to the token through the jwt() callback,
      // you have to explicitly forward it here to make it available to the client.
      // e.g. getSession(), useSession(), /api/auth/session
      if (token.email) session.user.email = token.email;

      //console.log("SESSION() RETURN:", session);
      return session;
    }
  },
  debug: false
});

// Email HTML body
function html({ url, host, email }: Record<"url" | "host" | "email", string>) {
  // Insert invisible space into domains and email address to prevent both the
  // email address and the domain from being turned into a hyperlink by email
  // clients like Outlook and Apple mail, as this is confusing because it seems
  // like they are supposed to click on their email address to sign in.
  const escapedEmail = `${email.replace(/\./g, "&#8203;.")}`;
  const escapedHost = `${host.replace(/\./g, "&#8203;.")}`;

  // Some simple styling options
  const backgroundColor = "#f9f9f9";
  const textColor = "#444444";
  const mainBackgroundColor = "#ffffff";
  const buttonBackgroundColor = "#346df1";
  const buttonBorderColor = "#346df1";
  const buttonTextColor = "#ffffff";

  return `
<body style="background: ${backgroundColor};">
  <table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 10px 0px 20px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        <strong>${escapedHost}</strong>
      </td>
    </tr>
  </table>
  <table width="100%" border="0" cellspacing="20" cellpadding="0" style="background: ${mainBackgroundColor}; max-width: 600px; margin: auto; border-radius: 10px;">
    <tr>
      <td align="center" style="padding: 10px 0px 0px 0px; font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        Connexion en tant que <strong>${escapedEmail}</strong>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 20px 0;">
        <table border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center" style="border-radius: 5px;" bgcolor="${buttonBackgroundColor}"><a href="${url}" target="_blank" style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: ${buttonTextColor}; text-decoration: none; border-radius: 5px; padding: 10px 20px; border: 1px solid ${buttonBorderColor}; display: inline-block; font-weight: bold;">Connexion</a></td>
          </tr>
        </table>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif; color: ${textColor};">
        Si vous n'avez pas demandé à recevoir cet e-mail, vous pouvez l'ignorer.
      </td>
    </tr>
  </table>
</body>
`;
}

// Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)
function text({ url, host }: Record<"url" | "host", string>) {
  return `Connexion à ${host}\n${url}\n\n`;
}
