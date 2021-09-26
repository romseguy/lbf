import type { Document } from "mongoose";
import { IProject } from "models/Project";
import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import database, { models } from "database";
import { createServerError } from "utils/errors";
import nodemailer from "nodemailer";
import nodemailerSendgrid from "nodemailer-sendgrid";
import { getSession } from "hooks/useAuth";
// import { sendProjectToOrgFollowers } from "utils/email";
import { equals, normalize } from "utils/string";

const transport = nodemailer.createTransport(
  nodemailerSendgrid({
    apiKey: process.env.EMAIL_API_KEY
  })
);

const handler = nextConnect<NextApiRequest, NextApiResponse>();

handler.use(database);

handler.put<
  NextApiRequest & {
    query: { projectId: string };
    body: IProject;
  },
  NextApiResponse
>(async function editProject(req, res) {
  const session = await getSession({ req });
  const { body }: { body: IProject } = req;

  if (!session && !body.projectNotified) {
    res
      .status(403)
      .json(
        createServerError(
          new Error("Vous devez être identifié pour accéder à ce contenu")
        )
      );
  } else {
    try {
      const projectId = req.query.projectId;

      const project = await models.Project.findOne({ _id: projectId }).populate(
        "projectOrgs"
      );

      if (!project) {
        return res
          .status(404)
          .json(
            createServerError(
              new Error(`Le projet ${projectId} n'a pas pu être trouvé`)
            )
          );
      }

      if (!body.projectNotified && session) {
        if (
          !equals(project.createdBy, session.user.userId) &&
          !session.user.isAdmin
        ) {
          return res
            .status(403)
            .json(
              createServerError(
                new Error(
                  "Vous ne pouvez pas modifier un projet que vous n'avez pas créé."
                )
              )
            );
        }
      }

      if (body.projectOrgs) {
        const staleProjectOrgsIds: string[] = [];

        for (const { _id } of body.projectOrgs) {
          const org = await models.Org.findOne({ _id });

          if (!org) {
            staleProjectOrgsIds.push(_id);
            continue;
          }

          if (org.orgProjects.indexOf(project._id) === -1) {
            await models.Org.updateOne(
              { _id: org._id },
              {
                $push: {
                  orgProjects: project._id
                }
              }
            );
          }
        }

        if (staleProjectOrgsIds.length > 0) {
          body.projectOrgs = body.projectOrgs.filter(
            (projectOrg) =>
              !staleProjectOrgsIds.find((id) => id === projectOrg._id)
          );
        }
      }

      // project.projectNotif = body.projectNotif || [];
      // const emailList = await sendProjectToOrgFollowers(project, transport);

      let projectNotified;

      if (body.projectNotified) {
        projectNotified = body.projectNotified;
      }
      // else if (emailList.length > 0) {
      //   projectNotified = project.projectNotified?.concat(
      //     emailList.map((email) => ({
      //       email,
      //       status: StatusTypes.PENDING
      //     }))
      //   );
      // }

      const { n, nModified } = await models.Project.updateOne(
        { _id: projectId },
        {
          ...body,
          projectNotified
        }
      );

      if (nModified === 1) {
        //res.status(200).json({ emailList });
        res.status(200).json({});
      } else {
        res
          .status(400)
          .json(
            createServerError(new Error("Le projet n'a pas pu être modifié"))
          );
      }
    } catch (error) {
      res.status(500).json(createServerError(error));
    }
  }
});

handler.delete<
  NextApiRequest & {
    query: { projectId: string };
  },
  NextApiResponse
>(async function removeProject(req, res) {
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
      const projectId = req.query.projectId;
      const project = await models.Project.findOne({ _id: projectId });

      if (!project) {
        return res
          .status(404)
          .json(
            createServerError(
              new Error(`Le projet ${projectId} n'a pas pu être trouvé`)
            )
          );
      }

      if (
        !equals(project.createdBy, session.user.userId) &&
        !session.user.isAdmin
      ) {
        return res
          .status(403)
          .json(
            createServerError(
              new Error(
                "Vous ne pouvez pas supprimer un projet que vous n'avez pas créé."
              )
            )
          );
      }

      const { deletedCount } = await models.Project.deleteOne({
        _id: projectId
      });

      if (deletedCount === 1) {
        if (project && project.projectOrgs) {
          for (const projectOrg of project.projectOrgs) {
            const o = await models.Org.findOne({ _id: projectOrg });

            if (o) {
              o.orgProjects = o.orgProjects.filter(
                (orgProject) => !equals(orgProject, project?._id)
              );
              o.save();
            }
          }
        }

        res.status(200).json(project);
      } else {
        res
          .status(400)
          .json(
            createServerError(
              new Error(`Le projet ${projectId} n'a pas pu être supprimé`)
            )
          );
      }
    } catch (error) {
      res.status(500).json(createServerError(error));
    }
  }
});

export default handler;