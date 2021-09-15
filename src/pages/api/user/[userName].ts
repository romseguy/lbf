import type { IUser } from "models/User";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "database";
import {
  createServerError,
  databaseErrorCodes,
  duplicateError
} from "utils/errors";
import { getSession } from "hooks/useAuth";
import { normalize } from "utils/string";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.get<
  NextApiRequest & {
    query: {
      userName: string;
    };
  },
  NextApiResponse
>(async function getUser(req, res) {
  const {
    query: { userName }
  } = req;

  try {
    let user = await models.User.findOne({ userName });

    if (!user) {
      user = await models.User.findOne({ email: userName });

      if (!user) user = await models.User.findOne({ _id: userName });
    }

    if (user) {
      res.status(200).json(user);
    } else {
      res
        .status(404)
        .json(
          createServerError(
            new Error(`L'utilisateur ${userName} n'a pas pu être trouvé`)
          )
        );
    }
  } catch (error) {
    res.status(500).json(createServerError(error));
  }
});

handler.put<
  NextApiRequest & {
    query: { userName: string };
    body: IUser;
  },
  NextApiResponse
>(async function editUser(req, res) {
  const session = await getSession({ req });

  if (!session) {
    res
      .status(403)
      .json(
        createServerError(
          new Error("Vous devez être identifié pour accéder à ce contenu")
        )
      );
  } else {
    try {
      const {
        query: { userName },
        body
      }: {
        query: { userName: string };
        body: IUser;
      } = req;

      if (body.userName) {
        body.userName = normalize(body.userName);

        const user = await models.User.findOne({ userName: body.userName });

        if (user) {
          throw duplicateError;
        }
      }

      const { n, nModified } = await models.User.updateOne({ userName }, body);

      if (nModified === 1) {
        res.status(200).json({});
      } else {
        const { n, nModified } = await models.User.updateOne(
          { _id: userName },
          body
        );

        if (nModified === 1) {
          res.status(200).json({});
        } else {
          res
            .status(400)
            .json(
              createServerError(
                new Error(`L'utilisateur ${userName} n'a pas pu être modifié`)
              )
            );
        }
      }
    } catch (error) {
      if (error.code && error.code === databaseErrorCodes.DUPLICATE_KEY) {
        res.status(400).json({
          userName: "Ce nom d'utilisateur n'est pas disponible"
        });
      } else {
        res.status(500).json(createServerError(error));
      }
    }
  }
});

export default handler;
