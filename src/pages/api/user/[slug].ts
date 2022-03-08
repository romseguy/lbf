import { Document } from "mongoose";
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
import { logJson, normalize, phoneR } from "utils/string";
import { emailR } from "utils/email";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.get<
  NextApiRequest & {
    query: {
      slug: string;
      populate: string;
    };
  },
  NextApiResponse
>(async function getUser(req, res) {
  const {
    query: { slug, populate, ...query }
  } = req;

  const notFoundResponse = () =>
    res
      .status(404)
      .json(
        createServerError(
          new Error(`L'utilisateur ${slug} n'a pas pu être trouvé`)
        )
      );

  try {
    let select: string | undefined;
    const session = await getSession({ req });
    const isSelf =
      session?.user.isAdmin ||
      session?.user.email === slug ||
      session?.user.userName === slug ||
      session?.user.userId === slug;
    if (isSelf) {
      select = "+email +phone +userImage +userSubscription";
    }

    let selector;
    if (emailR.test(slug)) {
      selector = { email: slug };
    } else if (phoneR.test(slug)) {
      selector = { phone: slug };
    }

    let user: (IUser & Document<any, IUser>) | null = null;
    if (selector) {
      user = await models.User.findOne(selector, select);
    } else {
      user = await models.User.findOne({ userName: slug }, select);
      if (!user) user = await models.User.findOne({ _id: slug }, select);
    }

    if (!user) return notFoundResponse();

    if (populate) {
      if (populate.includes("userProjects") && isSelf) {
        user = user.populate({
          path: "userProjects",
          populate: [{ path: "createdBy" }]
        });
      }

      user = await user.execPopulate();
    }

    res.status(200).json(user);
  } catch (error: any) {
    if (error.name === "CastError" && error.value === slug)
      return notFoundResponse();

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
    return res
      .status(403)
      .json(createServerError(new Error("Vous devez être identifié")));
  }

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
    }

    let selector;

    if (emailR.test(slug)) {
      selector = { email: slug };
    } else if (phoneR.test(slug)) {
      selector = { phone: slug };
    }

    if (!selector) {
      let user = await models.User.findOne({ userName: slug });

      if (user) {
        selector = { userName: slug };
      } else {
        user = await models.User.findOne({ _id: slug });

        if (user) {
          selector = { _id: slug };
        } else {
          return res
            .status(400)
            .json(
              createServerError(new Error(`L'utilisateur ${slug} n'existe pas`))
            );
        }
      }

      if (body.userName && body.userName !== user.userName) {
        const user = await models.User.findOne({ userName: body.userName });
        if (user) throw duplicateError();
      }
    }

    logJson(`PUT /user/${slug}: selector`, selector);
    logJson(`PUT /user/${slug}: body`, body);
    await models.User.updateOne(selector, body);

    // if (nModified === 1) {
    res.status(200).json({});
    // } else {
    //   await models.User.updateOne({ _id: slug }, body);
    //   if (nModified === 1) {
    //     res.status(200).json({});
    //   } else {
    //     res
    //       .status(400)
    //       .json(
    //         createServerError(
    //           new Error(`L'utilisateur ${slug} n'a pas pu être modifié`)
    //         )
    //       );
    //   }
    // }
  } catch (error: any) {
    if (error.code && error.code === databaseErrorCodes.DUPLICATE_KEY) {
      res.status(400).json({
        userName: "Ce nom d'utilisateur n'est pas disponible"
      });
    } else {
      res.status(500).json(createServerError(error));
    }
  }
});

export default handler;
