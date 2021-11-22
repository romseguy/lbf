import nextConnect from "next-connect";
import database, {
  db,
  AppModelKey,
  IEntity,
  models,
  collectionKeys,
  collectionToModelKeys
} from "database";
import { createServerError } from "utils/errors";
import { getSession } from "hooks/useAuth";
import { NextApiRequest, NextApiResponse } from "next";

const handler = nextConnect();

handler.use(database);

handler.get<NextApiRequest, NextApiResponse>(async function exportData(
  req,
  res
) {
  const session = await getSession({ req });

  if (!session) {
    return res
      .status(403)
      .json(
        createServerError(
          new Error("Vous devez être identifié pour accéder à ce contenu.")
        )
      );
  }

  if (!session.user.isAdmin) {
    return res
      .status(403)
      .json(
        createServerError(
          new Error("Vous devez être administrateur pour accéder à ce contenu.")
        )
      );
  }

  try {
    const data: { [key: string]: IEntity[] } = {};

    for (const key of collectionKeys) {
      data[key] = await db.collection(key).find({}).toArray();
    }

    return res.status(200).json({ data });
  } catch (error) {
    res.status(500).json(createServerError(error));
  }
});

handler.post<NextApiRequest, NextApiResponse>(async function importData(
  req,
  res
) {
  const session = await getSession({ req });

  if (!session) {
    return res
      .status(403)
      .json(
        createServerError(
          new Error("Vous devez être identifié pour accéder à ce contenu.")
        )
      );
  }

  if (!session.user.isAdmin) {
    return res
      .status(403)
      .json(
        createServerError(
          new Error("Vous devez être administrateur pour accéder à ce contenu.")
        )
      );
  }

  try {
    const body = JSON.parse(req.body);

    for (const key of collectionKeys) {
      // if (key === "users") continue;

      if (!body.data[key]) {
        console.log(`POST /admin/backup: could not find body.data[${key}]`);
        continue;
      }

      const model = models[collectionToModelKeys[key]];

      if (!model) {
        console.log(`POST /admin/backup: could not find model ${key}`);
        continue;
      }

      model.collection.remove({});

      for (const o of body.data[key]) {
        model.create(o);
      }
    }
    res.status(200).json({});
  } catch (error) {
    res.status(500).json(createServerError(error));
  }
});

export default handler;

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb"
    }
  }
};
