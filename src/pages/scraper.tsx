import axios, { AxiosResponse } from "axios";
import { SimpleLayout } from "features/layout";
import https from "https";
import IframeResizer from "iframe-resizer-react";
import { PageProps } from "main";
import { useEffect, useRef, useState } from "react";
import api from "utils/api";
import { City } from "./api/cities";

const agent = new https.Agent({
  rejectUnauthorized: false,
  requestCert: false
});

export const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
  responseType: "text",
  withCredentials: true,
  httpsAgent: agent
});

const ScraperPage = ({ isMobile, ...props }: PageProps) => {
  const iframeRef = useRef(null);

  const [cities, setCities] = useState<City[]>([]);
  const [html, setHtml] = useState("");
  useEffect(() => {
    (async () => {
      let newCities: City[] = [];
      const { data }: { data?: City[] } = await api.get("cities");

      if (Array.isArray(data)) {
        //   let i = 0;
        //   for (const city of data) {
        //     i++;
        //   }

        newCities = data;
      }

      setCities(newCities);
    })();
  }, []);

  const [selectedId, setSelectedId] = useState<number>(0);
  useEffect(() => {
    (async () => {
      if (selectedId) {
        //   const { data }: { data?: City[] } = await client.get(`cities/${selectedId}`);
        const { data }: { data?: City[] } = await client.get(
          "cities/" + selectedId
        );

        if (typeof data === "string") {
          setHtml(data);
        }
      }
    })();
  }, [selectedId]);

  return (
    <SimpleLayout
      isMobile={isMobile}
      title="Sélectionner une ville"
      height="100%"
      maxW="5xl"
      m="0 auto"
      p={6}
    >
      <select
        onChange={(e) => {
          setSelectedId(Number(e.target.value));
        }}
      >
        {cities.map((city) => {
          return (
            <option key={city.id} value={city.id}>
              {city.name} ({city.postCode})
            </option>
          );
        })}
      </select>

      {html && (
        <iframe
          srcDoc={html}
          style={{
            backgroundColor: "pink",
            width: "100vw",
            maxWidth: "64rem",
            height: "calc(100vh - 150px)",
            overflow: "scroll"
          }}
        />
      )}
    </SimpleLayout>
  );
};

export default ScraperPage;
