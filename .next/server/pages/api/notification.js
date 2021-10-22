(function() {
var exports = {};
exports.id = 9313;
exports.ids = [9313];
exports.modules = {

/***/ 8163:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ notification; }
});

;// CONCATENATED MODULE: external "web-push"
var external_web_push_namespaceObject = require("web-push");;
var external_web_push_default = /*#__PURE__*/__webpack_require__.n(external_web_push_namespaceObject);
;// CONCATENATED MODULE: ./src/pages/api/notification.ts

external_web_push_default().setVapidDetails(`mailto:${process.env.WEB_PUSH_EMAIL}`, "BLEyStoGlsI2TjYfNzQpBn99baJxj9RujWg-0Pn2R5MS6s-HC1LNp0YyEC1sR7e6wKTWvG0eZIbW_jYPPYZLGOQ", process.env.WEB_PUSH_PRIVATE_KEY);
/* harmony default export */ var notification = (async (req, res) => {
  if (req.method == "POST") {
    const {
      subscription,
      notification
    } = req.body;

    try {
      const response = await external_web_push_default().sendNotification(subscription, JSON.stringify(notification));
      console.log(typeof response.body, response.body);
      res.writeHead(response.statusCode, response.headers).end(response.body === "" ? {} : response.body);
    } catch (err) {
      if ("statusCode" in err) {
        res.writeHead(err.statusCode, err.headers).end(err.body);
      } else {
        console.error(err);
        res.statusCode = 500;
        res.end();
      }
    }
  }
}); // const handler = nextConnect<NextApiRequest, NextApiResponse>();
// handler.post<NextApiRequest, NextApiResponse>(async function postEvent(
//   req,
//   res
// ) {
//   const { subscription, notification } = req.body;
//   try {
//     const response = await webPush
//       //.sendNotification(subscription, JSON.stringify(notification))
//       .sendNotification(
//         subscription,
//         // JSON.stringify({
//         //   title: "Un événement attend votre approbation",
//         //   message: "Appuyez pour ouvrir la page de l'événement"
//         // })
//         JSON.stringify({ title: "H", message: "Y" })
//       );
//     console.log("body", response);
//     res.status(response.statusCode)
//     .headersSent()
//     .json({});
//   } catch (err) {
//     console.log("error", err);
//     res.status(500).json(createServerError(err));
//     // if ("statusCode" in err) {
//     //   res.writeHead(err.statusCode, err.headers).end(err.body);
//     // } else {
//     //   console.error(err);
//     //   res.statusCode = 500;
//     //   res.end();
//     // }
//   }
// });
// export default handler;

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
var __webpack_exports__ = (__webpack_exec__(8163));
module.exports = __webpack_exports__;

})();