import https from "https";
import { Spinner, useColorMode } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Textarea } from "features/common";
import { Layout } from "features/layout";
import { PageProps } from "main";
import api from "utils/api";
import { logJson, sanitize } from "utils/string";
const agent = new https.Agent({
  rejectUnauthorized: false
});

const Sandbox = ({ ...props }: PageProps) => {
  //   const { colorMode } = useColorMode();
  //   const isDark = colorMode === "dark";

  //   const description = "Test de <a href='https://fast.com'>lien</a>";
  //   return (
  //     <div className="rteditor">
  //       <div
  //         dangerouslySetInnerHTML={{
  //           __html: sanitize(description)
  //         }}
  //       />
  //     </div>
  //   );

  //const [error, setError] = useState();
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState("");
  const [linksWithTitle, setLinksWithTitle] = useState<
    {
      link: HTMLAnchorElement;
      title: string;
    }[]
  >([]);
  useEffect(() => {
    (async () => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, "text/html");
      const links = (doc.firstChild as HTMLElement).getElementsByTagName("a");
      let arr: {
        link: HTMLAnchorElement;
        title: string;
      }[] = [];

      for (let i = 0; i < links.length; i++) {
        const link = links[i];
        if (!link.href.includes("http")) continue;
        //if (link.innerText.includes("http")) {
        let href = link.href
          .replace("http://", "https://")
          .replace("www.", "")
          .replace(
            "https://localhost:3000",
            "https://unfuturdifferent.jimdofree.com"
          )
          .replace("jimdo.com", "jimdofree.com");

        try {
          const res = await fetch(href, {
            method: "get",
            mode: "cors",
            agent
          });
          const body = await res.text();
          var title = body.split("<title>")[1].split("</title>")[0];
          arr = arr.concat([{ link, title }]);
        } catch (error) {
          arr = arr.concat([{ link, title: link.href }]);
        }
      }
      setLinksWithTitle(arr);
    })();
  }, [text]);

  return (
    <Layout pageTitle="Sandbox" {...props}>
      <Textarea
        onBlur={(e) => {
          setText(e.target.value);
        }}
      />

      <ol>
        {linksWithTitle.map(({ link, title }, index) => {
          return (
            <li key={index}>
              <a target="_blank" href={link.href}>
                {title}
              </a>
            </li>
          );
        })}
      </ol>

      {isLoading ? (
        <Spinner />
      ) : (
        <button
          onClick={async () => {
            try {
              const res = await api.get("sandbox");
              setIsLoading(true);

              if (res.error)
                console.log(
                  "🚀 ~ file: sandbox.tsx:41 ~ res.error:",
                  res.error
                );
              else if (res.data) setData(res.data);
            } catch (error) {
              console.log("🚀 ~ file: sandbox.tsx:46 ~ error:", error);
            } finally {
              setIsLoading(false);
            }
          }}
        >
          call
        </button>
      )}
    </Layout>
  );
  //   //return <>{isDark ? "dark" : "light"}</>;
};

export default Sandbox;
