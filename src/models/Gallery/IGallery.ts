import { IEntity, IEntityCategory } from "models/Entity";

export interface IGallery extends IEntity {
  galleryCategory?: string | null;
  galleryName: string;
  //galleryOrg: IOr
  isPinned?: boolean;
}
export interface IGalleryCategory extends IEntityCategory {}
