import * as deepl from "deepl-node";
import { ObjectId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "server/database";
import { createEndpointError } from "utils/errors";

const authKey = "fb3a73a6-028f-74d4-dee4-9e93734833cf:fx";
const translator = new deepl.Translator(authKey);

const handler = nextConnect<NextApiRequest, NextApiResponse>()
  .use(database)
  .get<NextApiRequest, NextApiResponse>(async function check(req, res) {
    try {
      const prefix = `🚀 ~ ${new Date().toLocaleString()} ~ GET /sandbox `;
      console.log(prefix);

      //const targetLang: deepl.TargetLanguageCode = "en-US";
      const targetLang: deepl.TargetLanguageCode = "fr";
      const result = await translator.translateText(
        `From the parting of the Veil draped across the perceptual threshold of 4th density, a distilled sense may be obtained of how previous Logoic experience with worlds of soul-development found such process slow or positively stagnant, due to the absence of an adequate catalyst which might serve to move mind toward active search for a deeper Being ultimately commensurate with consciousness-in-itself. Thus according to Ra the device for the succeeding Logoic pattern was formulated, i.e. that of screening the value of spiritual inherence (or Void-nature) from the perceptual potential of 3rd density where consciousness first takes estimable stock of itself.  Cubing the Circle`,
        null,
        targetLang
      );

      console.log(result.text);

      res.status(200).json({ text: result.text });

      // const s = await models.Subscription.find(
      //   {
      //     orgs: { $elemMatch: { orgId: "62a349f45ab90133eb880f22" } }
      //   },
      //   "user email events orgs"
      // );
      // // .populate([
      // //   { path: "orgs", populate: [{ path: "org", select: "_id" }] }
      // // ]);
      // res.status(200).json(s);
    } catch (error) {
      res.status(404).json(createEndpointError(error));
    }
  });

export default handler;
