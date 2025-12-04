import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import {
  DeleteOrgParams,
  EditOrgPayload,
  GetOrgParams,
} from "features/api/orgsApi";
import { getRefId, isUser } from "models/Entity";
import {
  EOrgType,
  EOrgVisibility,
  IOrg,
  orgTypeFull,
  orgTypeFull4,
  orgTypeFull5,
  OrgTypes,
} from "models/Org";
import { getSession } from "server/auth";
import database, { models } from "server/database";
import { logEvent, ServerEventTypes } from "server/logging";
import { getClientIp } from "server/ip";
import api from "utils/api";
import { hasItems } from "utils/array";
import {
  createEndpointError,
  databaseErrorCodes,
  duplicateError,
} from "utils/errors";
import { equals, logJson, normalize } from "utils/string";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.get<
  NextApiRequest & {
    query: GetOrgParams;
  },
  NextApiResponse
>(async function getOrg(req, res) {
  let {
    query: { orgUrl, hash, populate = "" },
  } = req;

  try {
    const prefix = `🚀 ~ ${new Date().toLocaleString()} ~ GET /org/${orgUrl} `;
    console.log(prefix);

    const select = `+orgPassword ${
      populate.includes("orgLogo") ? "+orgLogo" : ""
    } ${populate.includes("orgBanner") ? "+orgBanner" : ""} ${
      populate.includes("orgDescription") ? "+orgDescription" : ""
    }`;

    let org = await models.Org.findOne({ orgUrl }, select);
    if (!org) org = await models.Org.findOne({ _id: orgUrl }, select);
    if (!org)
      return res
        .status(404)
        .json(
          createEndpointError(
            new Error(`L'organisation ${orgUrl} n'a pas pu être trouvé`),
          ),
        );

    logEvent({
      type: ServerEventTypes.API_CALL,
      metadata: {
        method: "GET",
        ip: getClientIp(req),
        url: `/api/${orgUrl}`,
      },
    });

    const session = await getSession({ req });
    const isCreator =
      orgUrl === "nom_de_votre_forum" ||
      equals(getRefId(org), session?.user.userId) ||
      session?.user.isAdmin;

    if (!isCreator) {
      if (org.orgPassword) {
        if (!hash) {
          org = await org.populate("createdBy", "_id userName").execPopulate();
          return res.status(200).json({
            orgName: org.orgName,
            orgSalt: org.orgSalt,
            orgStyles: org.orgStyles,
            orgType: org.orgType,
            orgUrl: org.orgUrl,
            createdAt: org.createdAt,
            createdBy: org.createdBy,
          });
        }

        if (org.orgPassword !== hash)
          return res
            .status(403)
            .json(createEndpointError(new Error("Mot de passe incorrect")));

        org.orgPassword = undefined;
      } else if (
        org.orgType === EOrgType.GENERIC ||
        org.orgType === EOrgType.TREETOOLS
      ) {
        const privateNetworks = await models.Org.find(
          {
            orgType: EOrgType.NETWORK,
            orgVisibility: EOrgVisibility.PRIVATE,
          },
          "+orgPassword",
        ).populate("orgs");
        const orgNetwork = privateNetworks.find(
          ({ orgs }) => !!orgs.find(({ orgName }) => orgName === org!.orgName),
        );
        const orgBelongsToAtLeastOnePrivateNetwork = !!orgNetwork;

        if (orgBelongsToAtLeastOnePrivateNetwork) {
          if (!hash)
            return res.status(200).json({
              orgName: org.orgName,
              orgSalt: orgNetwork.orgSalt,
              orgStyles: org.orgStyles,
              orgType: org.orgType,
              orgUrl: org.orgUrl,
            });

          if (orgNetwork.orgPassword !== hash)
            return res
              .status(403)
              .json(createEndpointError(new Error("Mot de passe incorrect")));
        }
      }
    }

    for (const modelKey of populate
      .split(/(\s+)/)
      .filter((e) => e.trim().length > 0)) {
      if (["orgs", "orgTopics", "orgSubscriptions"].includes(modelKey)) {
        //console.log(prefix + `populating ${modelKey} with custom behavior`);
        populate = populate.replace(modelKey, "");
      }

      if (modelKey === "orgs") {
        org = org.populate({
          path: "orgs",
          populate: [
            //{ path: "createdBy" },
            {
              path: "orgTopics",
              select:
                "topicName topicMessages.createdAt topicMessages.updatedAt",
            },
          ],
        });
      }

      if (modelKey === "orgTopics") {
        org = await org
          .populate({
            path: "orgTopics",
            populate: [
              {
                path: "topicMessages",
                populate: { path: "createdBy", select: "_id userName" },
              },
              { path: "createdBy", select: "_id userName" },
              {
                path: "org",
                select: "orgUrl",
              },
              { path: "event", select: "eventUrl" },
            ],
          })
          .execPopulate();

        // for (const orgTopic of org.orgTopics) {
        //   for (const topicMessage of orgTopic.topicMessages) {
        //     if (typeof topicMessage.createdBy === "object") {
        //       if (
        //         !topicMessage.createdBy.userName &&
        //         topicMessage.createdBy.email
        //       ) {
        //         topicMessage.createdBy.userName =
        //           topicMessage.createdBy.email.replace(/@.+/, "");
        //       }
        //       // todo: check this
        //       // topicMessage.createdBy.email = undefined;
        //     }
        //   }
        // }

        if (!isCreator) {
          org = await org.execPopulate();

          org.orgTopics = org.orgTopics.filter(
            ({ topicVisibility }) => !hasItems(topicVisibility),
          );
        }
      }
    }

    org = await org.populate("createdBy", "_id userName").execPopulate();

    // console.log(prefix + `unhandled keys: ${populate}`);
    // logJson(prefix, org);
    res.status(200).json(org);
  } catch (error: any) {
    if (error.kind === "ObjectId")
      return res
        .status(404)
        .json(
          createEndpointError(
            new Error(`L'organisation ${orgUrl} n'a pas pu être trouvé`),
          ),
        );
    res.status(500).json(createEndpointError(error));
  }
});

handler.put<
  NextApiRequest & {
    query: { orgUrl: string };
    body: EditOrgPayload;
  },
  NextApiResponse
>(async function editOrg(req, res) {
  const prefix = `🚀 ~ ${new Date().toLocaleString()} ~ PUT /org/${
    req.query.orgUrl
  } `;
  console.log(prefix);

  const session = await getSession({ req });

  if (!session) {
    return res
      .status(401)
      .json(createEndpointError(new Error("Vous devez être identifié")));
  }

  try {
    const _id = req.query.orgUrl;
    let org = await models.Org.findOne({ _id });

    if (!org) {
      return res
        .status(404)
        .json(
          createEndpointError(
            new Error(`L'organisation ${_id} n'a pas pu être trouvé`),
          ),
        );
    }

    let { body }: { body: EditOrgPayload } = req;
    const isCreator =
      equals(getRefId(org), session?.user.userId) || session?.user.isAdmin;
    let canEdit = isCreator;

    if (!Array.isArray(body)) {
      canEdit =
        canEdit ||
        Array.isArray(body.orgTopicCategories) ||
        (Array.isArray(body.orgs) && org.orgPermissions?.anyoneCanAddChildren);
    }

    if (!canEdit) {
      return res
        .status(403)
        .json(
          createEndpointError(
            new Error(
              `Vous n'avez pas la permission de modifier ${orgTypeFull4(
                org.orgType,
              )}`,
            ),
          ),
        );
    }

    let update:
      | {
          $unset?: { [key: string]: number };
          $pull?: { [key: string]: { [key: string]: string } | string };
        }
      | undefined;

    if (Array.isArray(body)) {
      for (const key of body) {
        if (key.includes(".") && key.includes("=")) {
          // orgLists.listName=string
          const matches = key.match(/([^\.]+)\.([^=]+)=(.+)/);

          // if (matches && matches[1] === "orgTopics")
          //   org = await org.populate("orgTopics").execPopulate();

          if (matches && matches.length === 4) {
            update = {
              $pull: { [matches[1]]: { [matches[2]]: matches[3] } },
            };
          }
        } else if (key.includes("=")) {
          // orgTopicCategories=string
          const matches = key.match(/([^=]+)=(.+)/);

          if (matches && matches.length === 3) {
            update = {
              $pull: { [matches[1]]: matches[2] },
            };

            if (matches[1] === "orgTopicCategories") {
              await models.Topic.updateMany(
                { topicCategory: matches[2] },
                { topicCategory: null },
              );
            }
          }
        } else {
          update = { $unset: { [key]: 1 } };
        }
      }
    } else {
      if (body.orgName) {
        body = {
          ...body,
          orgName: body.orgName.trim(),
          orgUrl: normalize(body.orgName.trim()),
        };

        if (
          body.orgName !== org.orgName &&
          (await models.Org.findOne({ orgName: body.orgName }))
        )
          throw duplicateError();
      }

      if (body.orgTopicCategories) {
        if (!isCreator) {
          return res
            .status(401)
            .json(
              createEndpointError(
                new Error(
                  `Vous n'avez pas la permission ${orgTypeFull(
                    org.orgType,
                  )} pour gérer les catégories de discussions`,
                ),
              ),
            );
        }
      }
    }

    logJson(prefix, update || body);
    org = await models.Org.findOneAndUpdate({ _id }, update || body);

    if (!org) {
      return res
        .status(400)
        .json(
          createEndpointError(
            new Error(`L'organisation ${_id} n'a pas pu être modifiée`),
          ),
        );
    }

    res.status(200).json(org);
  } catch (error: any) {
    if (error.code && error.code === databaseErrorCodes.DUPLICATE_KEY)
      return res.status(400).json({
        [error.field || "orgName"]: "Ce nom n'est pas disponible",
      });

    res.status(500).json(createEndpointError(error));
  }
});

handler.delete<
  NextApiRequest & {
    query: DeleteOrgParams;
  },
  NextApiResponse
>(async function removeOrg(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res
      .status(401)
      .json(createEndpointError(new Error("Vous devez être identifié")));
  }

  try {
    const _id = req.query.orgUrl;
    const org = await models.Org.findOne({ _id });

    if (!org) {
      return res
        .status(404)
        .json(
          createEndpointError(
            new Error(`L'organisation ${_id} n'a pas pu être trouvé`),
          ),
        );
    }

    if (!equals(org.createdBy, session.user.userId) && !session.user.isAdmin) {
      return res
        .status(403)
        .json(
          createEndpointError(
            new Error(
              "Vous ne pouvez pas supprimer une organisation que vous n'avez pas créé",
            ),
          ),
        );
    }

    const { deletedCount /*, n, ok */ } = await models.Org.deleteOne({ _id });

    if (deletedCount !== 1) {
      return res
        .status(400)
        .json(
          createEndpointError(
            new Error(`L'organisation ${_id} n'a pas pu être supprimé`),
          ),
        );
    }

    /*const { deletedCount, n, ok } = */ await models.Topic.deleteMany({
      _id: { $in: org.orgTopics },
    });

    // await api.client.delete(`folder`, {
    //   data: { orgId: _id },
    // });

    res.status(200).json(org);
  } catch (error) {
    res.status(500).json(createEndpointError(error));
  }
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "50mb",
    },
    responseLimit: "8mb",
  },
};

export default handler;
