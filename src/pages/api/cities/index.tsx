import fs from "fs";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import { createEndpointError } from "utils/errors";

import https from "https";
import cors from "cors";
import axios from "axios";
const agent = new https.Agent({
  rejectUnauthorized: false,
  requestCert: false
});
const client = axios.create({
  baseURL: "https://app.panneaupocket.com",
  responseType: "json",
  withCredentials: true,
  httpsAgent: agent
});

export interface City {
  address: string;
  city: string;
  department: string;
  id: number;
  latitude: number;
  link: string;
  logo: {
    url: string;
    width: number;
    height: number;
    dpr: number;
  };
  longitude: number;
  name: string;
  postCode: string;
  region: string;
}

const handler = nextConnect<NextApiRequest, NextApiResponse>().use(cors());

handler.get<NextApiRequest & { query: {} }, NextApiResponse>(
  async function getCities(req, res) {
    const {
      query: {}
    } = req;

    try {
      if (fs.existsSync("public/cities.json")) {
        const data = fs.readFileSync("public/cities.json");
        const json: City[] = JSON.parse(data.toString());

        return res.status(200).json(
          json.filter((city) => {
            return city.postCode.startsWith("11");
          })
        );
      }

      const response = await client.get<City[]>("public-api/city");
      const json = response.data;

      if (Array.isArray(json)) {
        fs.writeFileSync(
          "public/cities.json",
          "\n" + JSON.stringify(json, null, 2)
        );

        return res.status(200).json(
          json.filter((city) => {
            return city.postCode.startsWith("11");
          })
        );
      }

      res.status(200).json([]);
    } catch (error) {
      res.status(500).json(createEndpointError(error));
    }
  }
);

export default handler;
