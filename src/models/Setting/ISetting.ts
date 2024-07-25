import { IDocument } from "models/Document";

export interface ISetting extends IDocument {
  settingName: string;
  settingValue: string;
}
