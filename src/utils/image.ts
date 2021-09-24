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

export const getBase64 = (file: File): Promise<string> =>
  new Promise(function (resolve, reject) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () =>
      typeof reader.result === "string"
        ? resolve(reader.result)
        : reject("invalid type");
    reader.onerror = (error) => reject(error);
  });

// Calculate the next 'scale' to use based on how hard the user scrolled
export function calculateScale(scale: number, delta: number): number {
  const zoomFactor = Math.max(Math.abs(delta) / 1000, 0.1);
  const nextScale = delta > 0 ? scale - zoomFactor : scale + zoomFactor;
  const clamped = Math.min(10, Math.max(1, nextScale));

  return clamped;
}

export function getMeta(
  url: string,
  callback: (width: number, height: number) => void
) {
  var img = new Image();
  img.src = url;
  img.onload = function () {
    //@ts-expect-error
    callback(this.width, this.height);
  };
}
