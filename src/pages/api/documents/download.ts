import cors from "cors";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import api from "utils/api";
import { createServerError } from "utils/errors";
import { objectToQueryString } from "utils/query";
import { getExtension } from "utils/string";

const handler = nextConnect<NextApiRequest, NextApiResponse>()
  .use(cors())
  .get<NextApiRequest & { query: { fileName: string } }, NextApiResponse>(
    async function download(req, res) {
      try {
        let {
          query: { orgId, userId, fileName }
        } = req;

        const url = `view?${objectToQueryString(req.query)}`;
        const response = await api.client.get(url, {
          responseType: "arraybuffer"
        });

        const img = Buffer.from(response.data, "binary").toString("base64");
        //const img = Buffer.from(base64, 'base64');

        res.setHeader(
          "Content-Disposition",
          `attachment; filename=${fileName}`
        );
        res.setHeader("Content-Length", img.length);
        res.setHeader("Content-Type", `image/${getExtension(fileName)}`);
        res.status(200).end(img);
      } catch (error) {
        res.status(404).json(createServerError(error));
      }
    }
  );

export default handler;
