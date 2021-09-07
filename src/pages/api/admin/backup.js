import nextConnect from "next-connect";
import database, { models } from "database";
import { createServerError } from "utils/errors";
import { getSession } from "hooks/useAuth";

const handler = nextConnect();

handler.use(database);

handler.get(async function exportData(req, res) {
  const session = await getSession({ req });

  if (!session) {
    res
      .status(403)
      .json(
        createServerError(
          new Error("Vous devez être identifié pour accéder à ce contenu.")
        )
      );
  } else if (!session.user.isAdmin) {
    res
      .status(403)
      .json(
        createServerError(
          new Error("Vous devez être administrateur pour accéder à ce contenu.")
        )
      );
  } else {
    try {
      const data = {};
      const keys = Object.keys(models);

      for (const key of keys) {
        const model = models[key];
        data[key] = await model.find({});
      }

      res.status(200).json({ data });
    } catch (error) {
      res.status(400).json(createServerError(error));
    }
  }
});

handler.post(async function importData(req, res) {
  const session = await getSession({ req });

  if (!session) {
    res
      .status(403)
      .json(
        createServerError(
          new Error("Vous devez être identifié pour accéder à ce contenu.")
        )
      );
  } else if (!session.user.isAdmin) {
    res
      .status(403)
      .json(
        createServerError(
          new Error("Vous devez être administrateur pour accéder à ce contenu.")
        )
      );
  } else {
    try {
      const body = JSON.parse(req.body);
      const keys = Object.keys(models);
      for (const key of keys) {
        const model = models[key];
        model.collection.remove({});
        model.collection.insertMany(body.data[key], { ordered: false });
      }
      res.status(200).json({});
    } catch (error) {
      res.status(400).json(createServerError(error));
    }
  }
});

export default handler;
