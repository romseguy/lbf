import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "server/database";
import { EditSettingPayload } from "features/api/settingsApi";
import { getSession } from "server/auth";
import { createServerError } from "utils/errors";
import { logJson } from "utils/string";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.put<
  NextApiRequest & {
    query: { settingId: string };
    body: EditSettingPayload;
  },
  NextApiResponse
>(async function editSetting(req, res) {
  // const session = await getSession({ req });

  // if (!session) {
  //   return res
  //     .status(401)
  //     .json(createServerError(new Error("Vous devez être identifié")));
  // }

  // if (!session.user.isAdmin) {
  //   return res
  //     .status(401)
  //     .json(createServerError(new Error("Vous devez être administrateur")));
  // }

  try {
    const _id = req.query.settingId;
    let setting = await models.Setting.findOne({ _id });

    if (!setting) {
      return res
        .status(404)
        .json(
          createServerError(
            new Error(`Le paramètre ${_id} n'a pas pu être trouvé`)
          )
        );
    }

    const { body }: { body: EditSettingPayload } = req;

    logJson(`PUT /setting/${_id}:`, body);

    if (body.settingName) {
      return res
        .status(400)
        .json(
          createServerError(
            new Error(`Vous ne pouvez pas modifier le nom du paramètre`)
          )
        );
    }

    setting = await models.Setting.findOneAndUpdate({ _id }, body);

    if (!setting) {
      return res
        .status(400)
        .json(
          createServerError(
            new Error(`Le paramètre ${_id} n'a pas pu être modifié`)
          )
        );
    }

    res.status(200).json(setting);
  } catch (error) {
    res.status(500).json(createServerError(error));
  }
});

export default handler;
