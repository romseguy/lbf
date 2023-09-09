import { models } from "server/database";
import { hasItems } from "utils/array";

export const getCurrentId = async () => {
  const ids: number[] = [];

  const pushIds = (name?: string) => {
    if (name) {
      const matches = name.match(/[^-]+-([0-9]+)/);
      if (matches) ids.push(parseInt(matches[1]));
    }
  };

  const events = await models.Event.find({});
  for (const currentEvent of events) pushIds(currentEvent.eventName);
  const orgs = await models.Org.find({});
  for (const currentOrg of orgs) pushIds(currentOrg.orgName);
  const users = await models.User.find({});
  for (const currentUser of users) pushIds(currentUser.userName);

  return hasItems(ids) ? ids.reduce((a, b) => Math.max(a, b)) : 0;
};
