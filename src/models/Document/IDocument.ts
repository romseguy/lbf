import { IEntity } from "models/Entity";
import { IGallery } from "models/Gallery";

export interface IDocument extends IEntity {
  documentName: string;
  gallery: IGallery;
  documentHeight: number;
  documentWidth: number;
  documentTime?: number;
  documentBytes: number;
}
