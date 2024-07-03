import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "server/database";
import { GetSettingsParams } from "features/api/settingsApi";
//import { getSession } from "server/auth";
import { createEndpointError } from "utils/errors";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.get<
  NextApiRequest & {
    query: GetSettingsParams;
  },
  NextApiResponse
>(async function getSettings(req, res) {
  //const session = await getSession({ req });

  try {
    const {
      query: {}
    } = req;

    let selector: GetSettingsParams = {};
    let settings = await models.Setting.find(selector);

    if (!settings.length) {
      settings.push(
        await models.Setting.create({
          settingName: "networkLabel",
          settingValue: "atelier"
        })
      );
    }

    // console.log("GET /settings: selector", selector);
    // console.log("GET /settings: settings", settings);
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json(createEndpointError(error));
  }
});

{
  /*
handler.post<NextApiRequest & { body: AddSettingPayload }, NextApiResponse>(
  async function addSetting(req, res) {
    const session = await getSession({ req });

    if (!session) {
      return res
        .status(401)
        .json(createEndpointError(new Error("Vous devez être identifié")));
    }

    try {
      const { body }: { body: AddSettingPayload } = req;
      const settingName = body.settingName.trim();
      const settingUrl = normalize(settingName);
      let newSetting = {
        ...body,
        createdBy: session.user.userId,
        settingName,
        settingUrl,
        isApproved: session.user.isAdmin
      };

      const event = await models.Event.findOne({ eventUrl: settingUrl });
      const setting = await models.Setting.findOne({ settingUrl });
      const user = await models.User.findOne({ userName: settingUrl });
      if (event || setting || user) {
        const uid = (await getCurrentId()) + 1;
        newSetting = {
          ...newSetting,
          settingName: settingName + "-" + uid,
          settingUrl: settingUrl + "-" + uid
        };
      }

      logJson(`POST /settings: create`, newSetting);
      const doc = await models.Setting.create(newSetting);

      res.status(200).json(doc);
    } catch (error: any) {
      res.status(500).json(createEndpointError(error));
    }
  }
);
*/
}

export default handler;
