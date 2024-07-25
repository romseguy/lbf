import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "server/database";
import { getRefId } from "models/Entity";
import { getSession } from "server/auth";
import { createEndpointError } from "utils/errors";
import { equals } from "utils/string";

import axios from "axios";
import https from "https";
const agent = new https.Agent({
  rejectUnauthorized: false,
  requestCert: false
});
const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API2,
  responseType: "json",
  withCredentials: true,
  httpsAgent: agent
});

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.delete<
  NextApiRequest & {
    query: { documentId: string };
  },
  NextApiResponse
>(async function removeDocument(req, res) {
  const prefix = `🚀 ~ ${new Date().toLocaleString()} ~ DELETE /document/[documentId] `;
  console.log(prefix + "query", req.query);

  const session = await getSession({ req });

  if (!session) {
    return res
      .status(401)
      .json(createEndpointError(new Error("Vous devez être identifié")));
  }

  try {
    const _id = req.query.documentId;
    let doc = await models.Document.findOne({ _id });
    if (!doc) {
      return res
        .status(404)
        .json(
          createEndpointError(new Error(`Le document n'a pas pu être trouvé`))
        );
    }

    const isDocumentCreator = equals(getRefId(doc), session.user.userId);
    if (!isDocumentCreator && !session.user.isAdmin)
      return res
        .status(403)
        .json(
          createEndpointError(
            new Error(
              "Vous ne pouvez pas supprimer un document que vous n'avez pas créé"
            )
          )
        );

    const { deletedCount } = await models.Document.deleteOne({
      _id
    });

    if (deletedCount !== 1) {
      return res
        .status(400)
        .json(
          createEndpointError(
            new Error(`Le document ${_id} n'a pas pu être supprimé`)
          )
        );
    }

    await client.delete(`/?fileId=${_id}`);

    //#region references
    if (doc.gallery) {
      console.log(
        prefix + "deleting document from document.gallery",
        doc.gallery.galleryDocuments
      );
      await models.Gallery.updateOne(
        { _id: doc.gallery._id },
        {
          $pull: { galleryDocuments: _id }
        }
      );
    }
    //#endregion

    res.status(200).json({ ...doc._doc });
  } catch (error) {
    res.status(500).json(createEndpointError(error));
  }
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb"
    }
  }
};

export default handler;