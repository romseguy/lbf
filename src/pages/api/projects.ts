import { Document } from "mongoose";
import nodemailer from "nodemailer";
import nodemailerSendgrid from "nodemailer-sendgrid";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "database";
import {
  createServerError,
  databaseErrorCodes,
  duplicateError
} from "utils/errors";
import { getSession } from "hooks/useAuth";
import { sendToAdmin } from "api/email";
import { IProject, Visibility } from "models/Project";
import { IOrg } from "models/Org";
import api from "utils/api";
import { log } from "utils/string";
import axios from "axios";
import { hasItems } from "utils/array";

const transport = nodemailer.createTransport(
  nodemailerSendgrid({
    apiKey: process.env.EMAIL_API_KEY
  })
);

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
      if (project.forwardedFrom.projectId) {
        const e = await models.Project.findOne({
          _id: project.forwardedFrom.projectId
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

handler.post<NextApiRequest, NextApiResponse>(async function postProject(
  req,
  res
) {
  const session = await getSession({ req });

  if (!session) {
    res
      .status(403)
      .json(
        createServerError(
          new Error("Vous devez être identifié pour accéder à ce contenu")
        )
      );
  } else {
    try {
      const { body }: { body: IProject } = req;
      let project: (IProject & Document<any, any, any>) | null;
      const projectOrgs = body.projectOrgs;

      project = await models.Project.create({
        ...body
      });

      if (projectOrgs) {
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
          sendToAdmin({ project: body, transport });

          if (admin.userSubscription)
            await axios.post(
              process.env.NEXT_PUBLIC_API + "/notification",
              {
                subscription: admin.userSubscription,
                notification: {
                  title: "Un projet attend votre approbation",
                  message: "Appuyez pour ouvrir la page de l'organisation",
                  url: `${process.env.NEXT_PUBLIC_URL}/${projectOrgs[0].orgUrl}`
                }
              },
              {
                headers: {
                  Accept: "application/json, text/plain, */*",
                  "User-Agent": "*"
                }
              }
            );
        }
      } else {
        await models.User.updateOne(
          {
            _id:
              typeof body.createdBy === "object"
                ? body.createdBy._id
                : body.createdBy
          },
          { $push: { userProjects: project._id } }
        );
      }

      res.status(200).json(project);
    } catch (error: any) {
      if (error.errors) {
        res.status(400).json(error.errors);
      } else {
        res.status(500).json(createServerError(error));
      }
    }
  }
});

export default handler;
