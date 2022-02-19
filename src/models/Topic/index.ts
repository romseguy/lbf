import { TypedMap } from "utils/types";
import { ETopicVisibility } from "./ITopic";

export * from "./ITopic";

export const TopicVisibilities: TypedMap<ETopicVisibility, string> = {
  [ETopicVisibility.FOLLOWERS]: "Abonnés",
  [ETopicVisibility.PUBLIC]: "Publique",
  [ETopicVisibility.SUBSCRIBERS]: "Adhérents"
};
