import { Document, Types } from "mongoose";
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
import { normalize, phoneR } from "utils/string";
import { emailR } from "utils/email";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.get<
  NextApiRequest & {
    query: {
      slug: string;
    };
  },
  NextApiResponse
>(async function getUser(req, res) {
  const {
    query: { slug, populate }
  } = req;

  let user: (IUser & Document<any, any, any>) | null = null;
  let selector;

  try {
    if (emailR.test(slug)) {
      selector = { email: slug };
    } else if (phoneR.test(slug)) {
      selector = { phone: slug };
    }

    if (selector) {
      user = await models.User.findOne(selector);
    } else {
      user = await models.User.findOne({ userName: slug });
      if (!user) user = await models.User.findOne({ _id: slug });
    }

    if (user) {
      if (populate) {
        if (populate.includes("userProjects")) {
          user = user.populate({
            path: "userProjects",
            populate: [{ path: "createdBy" }]
          });
        }

        user = await user.execPopulate();
      }

      res.status(200).json(user);
    } else {
      res
        .status(404)
        .json(
          createServerError(
            new Error(`L'utilisateur ${slug} n'a pas pu être trouvé`)
          )
        );
    }
  } catch (error) {
    res.status(500).json(createServerError(error));
  }
});

handler.put<
  NextApiRequest & {
    query: { slug: string };
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
        query: { slug },
        body
      }: {
        query: { slug: string };
        body: Partial<IUser>;
      } = req;

      if (body.userName) {
        body.userName = normalize(body.userName);

        const user = await models.User.findOne({ userName: body.userName });

        if (user) {
          throw duplicateError;
        }
      }

      let selector;
      if (emailR.test(slug)) {
        selector = { email: slug };
      } else if (phoneR.test(slug)) {
        selector = { phone: slug };
      } else {
        selector = { userName: slug };
      }

      const { n, nModified } = await models.User.updateOne(selector, body);

      if (nModified === 1) {
        res.status(200).json({});
      } else {
        const { n, nModified } = await models.User.updateOne(
          { _id: slug },
          body
        );
        if (nModified === 1) {
          res.status(200).json({});
        } else {
          res
            .status(400)
            .json(
              createServerError(
                new Error(`L'utilisateur ${slug} n'a pas pu être modifié`)
              )
            );
        }
      }
    } catch (error: any) {
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
