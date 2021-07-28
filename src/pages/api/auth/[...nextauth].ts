import type { Account, Profile, Session, User } from "next-auth";
import type {
  NextApiRequest,
  NextApiResponse
} from "next-auth/internals/utils";
import type { JWT } from "next-auth/jwt";
import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import api from "utils/api";

const createOptions = (req: NextApiRequest) => ({
  providers: [
    Providers.Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Adresse e-mail", type: "text" },
        password: { label: "Mot de passe", type: "password" }
      },
      authorize: async (signInOptions: any) => {
        //console.log("AUTHORIZE:", signInOptions);
        const { email, password } = signInOptions;
        const { data, error } = await api.post("auth/signin", {
          email,
          password
        });

        if (data) {
          const user = {
            email,
            userId: data._id,
            userName: data.userName
          };
          //console.log("AUTHORIZED:", user);
          return user;
        }

        if (error) {
          //console.log("AUTHORIZE ERROR:", error);
          throw new Error("Nous n'avons pas pu vous identifier.");
        }

        return {};
      }
    })
  ],
  // database: process.env.DATABASE_URL,
  secret: process.env.SECRET,
  // JSON Web Tokens can be used for session tokens if enabled with session: { jwt: true }
  session: {
    jwt: true
  },
  callbacks: {
    /*
     * This JSON Web Token callback is called whenever a JSON Web Token is created (i.e. at sign in)
     * or updated (i.e whenever a session is accessed in the client).
     * e.g. /api/auth/signin, getSession(), useSession(), /api/auth/session
     */
    async jwt(params: {
      token: JWT;
      user?: User;
      account?: Account;
      profile?: Profile;
      isNewUser?: boolean;
    }) {
      const { user, account } = params;
      //console.log("JWT() PARAMS:", params);
      let token = params.token;

      if (account?.accessToken) {
        token.accessToken = account.accessToken;
      }

      if (user) {
        token = { ...token, ...user };
      }

      if (req && req.url === "/api/auth/session?update") {
        const { data } = await api.get(`user/${token.userId}`);

        if (data) {
          const { userName, email } = data;
          token = { ...token, userName, email };
        }
      }

      // console.log("JWT() RETURN:", token);
      return token;
    },

    /*
     * The session callback is called whenever a session is checked.
     * e.g. getSession(), useSession(), /api/auth/session
     */
    async session(params: { session: Session; token: JWT }) {
      const { session, token } = params;
      // console.log("SESSION() PARAMS:", params);

      // If you want to make something available you added to the token through the jwt() callback,
      // you have to explicitly forward it here to make it available to the client.
      // e.g. getSession(), useSession(), /api/auth/session
      const { email, userId, userName } = token;
      session.user = { email, userId, userName };

      // console.log("SESSION() RETURN", session);
      return session;
    }
  },
  debug: true
});

export default async (req: NextApiRequest, res: NextApiResponse) => {
  return NextAuth(req, res, createOptions(req));
};
