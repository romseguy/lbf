(function() {
var exports = {};
exports.id = 3748;
exports.ids = [3748];
exports.modules = {

/***/ 7293:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ _nextauth_; }
});

;// CONCATENATED MODULE: external "next-auth"
var external_next_auth_namespaceObject = require("next-auth");;
var external_next_auth_default = /*#__PURE__*/__webpack_require__.n(external_next_auth_namespaceObject);
;// CONCATENATED MODULE: external "next-auth/providers"
var providers_namespaceObject = require("next-auth/providers");;
var providers_default = /*#__PURE__*/__webpack_require__.n(providers_namespaceObject);
// EXTERNAL MODULE: external "nodemailer"
var external_nodemailer_ = __webpack_require__(8123);
var external_nodemailer_default = /*#__PURE__*/__webpack_require__.n(external_nodemailer_);
// EXTERNAL MODULE: ./src/utils/api.ts
var api = __webpack_require__(6837);
;// CONCATENATED MODULE: ./src/pages/api/auth/[...nextauth].ts




/* harmony default export */ var _nextauth_ = (async (req, res) => {
  return external_next_auth_default()(req, res, {
    pages: {
      verifyRequest: "/verify"
    },
    providers: [providers_default().Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Adresse e-mail",
          type: "text"
        },
        password: {
          label: "Mot de passe",
          type: "password"
        }
      },
      authorize: async signInOptions => {
        //console.log("AUTHORIZE:", signInOptions);
        const {
          email,
          password
        } = signInOptions;
        const {
          data,
          error
        } = await api/* default.post */.Z.post("auth/signin", {
          email,
          password
        });

        if (data) {
          const user = {
            email,
            userId: data._id,
            userName: data.userName,
            // userImage: data.userImage,
            isAdmin: data.isAdmin || false
          }; //console.log("AUTHORIZED:", user);

          return user;
        }

        if (error) {
          console.log("AUTHORIZE ERROR:", error);
          throw new Error("Nous n'avons pas pu vous identifier.");
        }

        return null;
      }
    }), providers_default().Email({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      maxAge: 24 * 60 * 60,
      // How long email links are valid for (default 24h)
      sendVerificationRequest: async ({
        identifier: email,
        url,
        provider: {
          server,
          from
        }
      }) => {
        const {
          host
        } = new URL(url);
        const transport = external_nodemailer_default().createTransport(server);
        await transport.sendMail({
          to: email,
          from,
          subject: `Connexion à ${host}`,
          text: _nextauth_text({
            url,
            host
          }),
          html: html({
            url,
            host,
            email
          })
        });
      }
    })],
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
        } //console.log("JWT() RETURN:", token);


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
        session.user = userOrToken; //console.log("SESSION() RETURN:", session);

        return session;
      }

    },
    debug: false
  });
}); // Email HTML body

function html({
  url,
  host,
  email
}) {
  // Insert invisible space into domains and email address to prevent both the
  // email address and the domain from being turned into a hyperlink by email
  // clients like Outlook and Apple mail, as this is confusing because it seems
  // like they are supposed to click on their email address to sign in.
  const escapedEmail = `${email.replace(/\./g, "&#8203;.")}`;
  const escapedHost = `${host.replace(/\./g, "&#8203;.")}`; // Some simple styling options

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
} // Email Text body (fallback for email clients that don't render HTML, e.g. feature phones)


function _nextauth_text({
  url,
  host
}) {
  return `Connexion à ${host}\n${url}\n\n`;
}

/***/ }),

/***/ 8123:
/***/ (function(module) {

"use strict";
module.exports = require("nodemailer");;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
var __webpack_exports__ = __webpack_require__.X(0, [8177,6837], function() { return __webpack_exec__(7293); });
module.exports = __webpack_exports__;

})();