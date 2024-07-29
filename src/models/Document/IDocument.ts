import { IEntity } from "models/Entity";
import { IGallery } from "models/Gallery";

export interface IDocument extends IEntity {
  documentName: string;
  documentBytes: number;
  documentHeight: number;
  documentWidth: number;
  documentTime?: number;
  gallery: IGallery;
}
