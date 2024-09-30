import picaFn from "pica";

let picaInstance: any;
export function getPicaInstance() {
  if (picaInstance) {
    return picaInstance;
  }

  picaInstance = picaFn();

  return picaInstance;
}

export type Base64Image = { base64?: string; width: number; height: number };

export const getBase64 = (file: File): Promise<Base64Image> =>
  new Promise(function (resolve, reject) {
    let reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        const img = new Image();
        img.src = reader.result;

        img.onload = () => {
          if (typeof reader.result === "string")
            resolve({
              base64: reader.result,
              height: img.height,
              width: img.width
            });
        };
      } else reject("invalid type");
    };

    reader.onerror = (error) => reject(error);
  });

// Calculate the next 'scale' to use based on how hard the user scrolled
export function calculateScale(scale: number, delta: number): number {
  const zoomFactor = Math.max(Math.abs(delta) / 1000, 0.1);
  const nextScale = delta > 0 ? scale - zoomFactor : scale + zoomFactor;
  const clamped = Math.min(10, Math.max(0.5, nextScale));

  return clamped;
}

import axios from "axios";
import https from "https";
const agent = new https.Agent({
  rejectUnauthorized: false,
  requestCert: false
});
const client = axios.create({
  responseType: "blob",
  withCredentials: true,
  httpsAgent: agent
});
export async function downloadImage(url: string, fileName: string) {
  const response = await client.get(url);

  const href = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = href;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();

  // const blob = new Blob([res.data]);
  // const href = window.URL.createObjectURL(blob);
  // const a = document.createElement("a");
  // a.style.display = "none";
  // a.href = href;
  // a.download = name;
  // document.body.appendChild(a);
  // a.click();
  window.URL.revokeObjectURL(href);
}

export const getMeta = async (
  url: string
): Promise<{ height: number; width: number }> => {
  return new Promise((resolve, reject) => {
    var img = new Image();
    img.src = url;
    img.onload = function () {
      //@ts-expect-error
      resolve({ width: this.width, height: this.height });
    };
  });
};

export async function getImageDimensions(file: File | Blob | string) {
  let img = new Image();
  if (typeof file === "string") {
    img.src = file;
  } else {
    img.src = URL.createObjectURL(file);
  }

  await img.decode();
  let width = img.width;
  let height = img.height;
  return {
    width,
    height
  };
}

export function isCached(src: string) {
  const img = new Image();
  img.src = src;
  const complete = img.complete;
  console.log("🚀 ~ file: image.ts:65 ~ isCached ~ src:", complete);
  img.src = "";
  return complete;
}

// export function isCached(src: string) {
//   const imgEl = document.createElement("img");
//   console.log("🚀 ~ file: image.ts:73 ~ isCached ~ imgEl:", imgEl.complete);
//   imgEl.src = src;
//   return imgEl.complete || imgEl.width + imgEl.height > 0;
// }
