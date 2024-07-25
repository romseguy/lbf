import { RemoteImage } from "features/api/documentsApi";

export * from "./IGallery";

export type GalleryImage = RemoteImage & {
  index: number;
  userId: string;
};
