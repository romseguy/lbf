import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { createServerError } from "utils/errors";
import webPush from "web-push";

webPush.setVapidDetails(
  `mailto:${process.env.WEB_PUSH_EMAIL}`,
  process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
  process.env.WEB_PUSH_PRIVATE_KEY
);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method == "POST") {
    const { subscription, notification } = req.body;

    try {
      const response = await webPush.sendNotification(
        subscription,
        JSON.stringify(notification)
      );
      console.log(typeof response.body, response.body);

      res
        .writeHead(response.statusCode, response.headers)
        .end(response.body === "" ? {} : response.body);
    } catch (err: any) {
      if ("statusCode" in err) {
        res.writeHead(err.statusCode, err.headers).end(err.body);
      } else {
        console.error(err);
        res.statusCode = 500;
        res.end();
      }
    }
  }
};

// const handler = nextConnect<NextApiRequest, NextApiResponse>();

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
