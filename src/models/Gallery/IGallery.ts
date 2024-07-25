import { IDocument } from "models/Document";
import { IEntity, IEntityCategory } from "models/Entity";
import { IOrg } from "models/Org";

export interface IGallery extends IEntity {
  galleryCategory?: string | null;
  galleryName: string;
  galleryDocuments?: IDocument[];
  isPinned?: boolean;
  org?: IOrg;
}
export interface IGalleryCategory extends IEntityCategory {}
