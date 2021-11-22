import bcrypt from "bcryptjs";
import { models } from "database";
import { IUser } from "models/User";
import NextAuth, { User } from "next-auth";
import type {
  NextApiRequest,
  NextApiResponse
} from "next-auth/internals/utils";
import Providers from "next-auth/providers";
import nodemailer from "nodemailer";
import api from "utils/api";
import { logJson } from "utils/string";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  return NextAuth(req, res, {
    pages: {
      verifyRequest: "/verify"
    },
    providers: [
      Providers.Credentials({
        name: "Credentials",
        credentials: {
          email: { label: "Adresse e-mail", type: "text" },
          password: { label: "Mot de passe", type: "password" }
        },
        //@ts-expect-error
        authorize: async (signInOptions) => {
          logJson(
            "POST /auth/callback/credentials: signInOptions",
            signInOptions
          );

          try {
            //@ts-expect-error
            const { email, user } = signInOptions;

            return {
              email,
              userId: user._id,
              userName: user.userName
            };
          } catch (error) {
            return null;
          }
        }
      }),
      Providers.Email({
        server: process.env.EMAIL_SERVER,
        from: process.env.EMAIL_FROM,
        maxAge: 24 * 60 * 60, // How long email links are valid for (default 24h)
        sendVerificationRequest: async ({
          identifier: email,
          url,
          provider: { server, from }
        }) => {
          const { host } = new URL(url);
          const transport = nodemailer.createTransport(server);
          await transport.sendMail({
            to: email,
            from,
            subject: `Connexion à ${host}`,
            text: text({ url, host }),
            html: html({ url, host, email })
          });
        }
      })
    ],
    database: process.env.DATABASE_URL,
    //secret: process.env.SECRET,
    session: {
      // Signin in with credentials is only supported if JSON Web Tokens are enabled!
      //
      // Use JSON Web Tokens for session instead of database sessions.
      // This option can be used with or without a database for users/accounts.
      // Note: `jwt` is automatically set to `true` if no database is specified.
      jwt: true
    },
    // jwt: {
    //   secret: process.env.SECRET
    // },
    callbacks: {
      /*
       * This JSON Web Token callback is called whenever a JSON Web Token is created (i.e. at sign in)
       * or updated (i.e whenever a session is accessed in the client).
       * e.g. /api/auth/signin, getSession(), useSession(), /api/auth/session
       */
      async jwt(token, user, account, profile, isNewUser) {
        //console.log("JWT() PARAMS:", token, user, account, profile, isNewUser);

        if (user) {
          token = user;
        }

        //console.log("JWT() RETURN:", token);
        return token;
      },

      /*
       * The session callback is called whenever a session is checked.
       * e.g. getSession(), useSession(), /api/auth/session
       */
      async session(session, userOrToken) {
        //console.log("SESSION() PARAMS:", session, userOrToken);

        // If you want to make something available you added to the token through the jwt() callback,
        // you have to explicitly forward it here to make it available to the client.
        // e.g. getSession(), useSession(), /api/auth/session
        session.user = userOrToken;

        //console.log("SESSION() RETURN:", session);
        return session;
      }
    },
    debug: false
  });
};

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
