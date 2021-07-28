export type Base64Image = { base64?: string; width: number; height: number };

export const getBase64 = (file: File): Promise<string> =>
  new Promise(function (resolve, reject) {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () =>
      typeof reader.result === "string"
        ? resolve(reader.result)
        : reject("invalid type");
    reader.onerror = (error) => reject(error);
  });
