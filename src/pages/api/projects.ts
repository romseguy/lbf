import { Document } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "server/database";
import { sendToAdmin } from "server/email";
import { getSession } from "utils/auth";
import { IProject } from "models/Project";
import api from "utils/api";
import { hasItems } from "utils/array";
import { createServerError } from "utils/errors";
import { logJson } from "utils/string";

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.get<
  NextApiRequest & {
    query: { populate?: string };
  },
  NextApiResponse
>(async function getProjects(req, res) {
  try {
    const {
      query: { populate }
    } = req;

    let projects;

    if (populate) {
      projects = await models.Project.find({}).populate(populate);
    } else {
      projects = await models.Project.find({});
    }

    for (const project of projects) {
      if (project.forwardedFrom?.projectId) {
        const e = await models.Project.findOne({
          _id: project.forwardedFrom?.projectId
        });
        if (e) {
          project.projectName = e.projectName;
        }
      }
    }

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json(createServerError(error));
  }
});

handler.post<NextApiRequest & { body: Partial<IProject> }, NextApiResponse>(
  async function postProject(req, res) {
    const session = await getSession({ req });

    if (!session) {
      return res
        .status(401)
        .json(createServerError(new Error("Vous devez être identifié")));
    }

    try {
      const { body }: { body: IProject } = req;
      const project = await models.Project.create({
        ...body,
        createdBy: session.user.userId
      });
      const projectOrgs = body.projectOrgs;

      if (hasItems(projectOrgs)) {
        await models.Org.updateMany(
          {
            _id: {
              $in: projectOrgs.map((projectOrg) =>
                typeof projectOrg === "object" ? projectOrg._id : projectOrg
              )
            }
          },
          {
            $push: {
              orgProjects: project?._id
            }
          }
        );

        const admin = await models.User.findOne({ isAdmin: true });

        if (
          admin &&
          (!project.projectVisibility || !hasItems(project.projectVisibility))
        ) {
          sendToAdmin({ project: body });

          if (admin.userSubscription) {
            try {
              const data = await api.sendPushNotification({
                message: "Appuyez pour ouvrir la page de l'organisation",
                subscription: admin.userSubscription,
                title: "Un projet attend votre approbation",
                url: projectOrgs[0].orgUrl
              });
              console.log("sent push notif", data);
            } catch (error: any) {
              console.log("could not send push notif", error.message);
            }
          }
        }
      } else {
        await models.User.updateOne(
          {
            _id: session.user.userId
          },
          { $push: { userProjects: project._id } }
        );
      }

      res.status(200).json(project);
    } catch (error: any) {
      if (error.errors) return res.status(400).json(error.errors);

      res.status(500).json(createServerError(error));
    }
  }
);

export default handler;
