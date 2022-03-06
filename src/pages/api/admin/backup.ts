import { Document } from "mongodb";
import nextConnect from "next-connect";
import database, { db, models, collectionToModelKeys } from "database";
import { getSession } from "hooks/useAuth";
import { NextApiRequest, NextApiResponse } from "next";
import { createServerError } from "utils/errors";
import { IEntity } from "models/Entity";
import { TypedMap } from "utils/types";

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
      .json(createServerError(new Error("Vous devez être identifié.")));
  }

  if (!session.user.isAdmin) {
    return res
      .status(403)
      .json(createServerError(new Error("Vous devez être administrateur.")));
  }

  try {
    const collectionKeys = (await db.listCollections().toArray()).map(
      (collection) => collection.name
    );
    const data: TypedMap<string, Document[]> = {};

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
      .json(createServerError(new Error("Vous devez être identifié.")));
  }

  if (!session.user.isAdmin) {
    return res
      .status(403)
      .json(createServerError(new Error("Vous devez être administrateur.")));
  }

  try {
    const body = JSON.parse(req.body);
    const collectionKeys = (await db.listCollections().toArray()).map(
      (collection) => collection.name
    );

    for (const key of collectionKeys) {
      if (key === "users") continue;
      console.log(`POST /admin/backup collection: ${key}`);

      if (!body.data[key]) {
        console.log(`POST /admin/backup: could not find body.data[${key}]`);
        continue;
      }

      const model = models[collectionToModelKeys[key]];

      if (!model) {
        console.log(`POST /admin/backup: could not find model ${key}`);
        continue;
      }

      //@ts-expect-error
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
