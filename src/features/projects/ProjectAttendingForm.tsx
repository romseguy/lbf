import { Box, useToast, Spinner } from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";
import { Button } from "features/common";
import { useEditProjectMutation } from "features/api/projectsApi";
import { selectUserEmail, setUserEmail } from "store/userSlice";
import { useSession } from "hooks/useSession";
import { IOrg } from "models/Org";
import { IProject, isAttending, EProjectInviteStatus } from "models/Project";
import { IUser } from "models/User";
import { useAppDispatch } from "store";
import { emailR } from "utils/email";
import { AppQueryWithData } from "utils/types";

export const ProjectAttendingForm = ({
  project,
  query
}: {
  project: IProject;
  query: AppQueryWithData<IOrg | IUser>;
}) => {
  const { data: session } = useSession();
  const toast = useToast({ position: "top" });
  const dispatch = useAppDispatch();

  //#region project
  const [editProject, editProjectMutation] = useEditProjectMutation();
  //#endregion

  //#region local state
  const userEmail = useSelector(selectUserEmail);
  //#endregion

  const attend = async () => {
    let promptedEmail: string | null = null;

    if (!session && (!userEmail || userEmail === "")) {
      promptedEmail = prompt("Veuillez entrer votre adresse e-mail :");

      if (!promptedEmail || !emailR.test(promptedEmail)) {
        toast({ status: "error", title: "Adresse e-mail invalide" });
        return;
      }

      dispatch(setUserEmail(promptedEmail));
    }

    if (isAttending({ email: promptedEmail || userEmail, project })) {
      toast({ status: "error", title: "Vous participez déjà à cet projet" });
      return;
    }

    let isNew = true;

    let projectNotifications =
      project.projectNotifications?.map(({ email: e, status }) => {
        const projectNotification = {
          email: e,
          status,
          createdAt: new Date().toISOString()
        };
        if (
          (e === promptedEmail || userEmail) &&
          status !== EProjectInviteStatus.OK
        ) {
          isNew = false;
          return { ...projectNotification, status: EProjectInviteStatus.OK };
        }
        return projectNotification;
      }) || [];

    if (isNew)
      projectNotifications?.push({
        email: promptedEmail || userEmail,
        status: EProjectInviteStatus.OK,
        createdAt: new Date().toISOString()
      });

    await editProject({
      payload: { projectNotifications },
      projectId: project._id
    });
  };

  const unattend = async () => {
    let promptedEmail: string | null = null;

    if (!session && (!userEmail || userEmail === "")) {
      promptedEmail = prompt("Veuillez entrer votre adresse e-mail :");

      if (!promptedEmail || !emailR.test(promptedEmail)) {
        toast({ status: "error", title: "Adresse e-mail invalide" });
        return;
      }

      dispatch(setUserEmail(promptedEmail));
    }

    let projectNotifications = project.projectNotifications?.filter(
      ({ email, status }) => {
        return email !== promptedEmail && email !== userEmail;
      }
    );

    await editProject({
      payload: {
        projectNotifications
      },
      projectId: project._id
    });
  };

  return (
    <Box p={3}>
      {isAttending({ email: userEmail, project }) ? (
        <Button
          colorScheme="red"
          isLoading={
            editProjectMutation.isLoading || query.isFetching || query.isLoading
          }
          onClick={async () => {
            const ok = confirm(
              "Êtes-vous sûr de ne plus vouloir participer à cet projet ?"
            );

            if (ok) {
              unattend();
            }
          }}
        >
          Ne plus participer à ce projet
        </Button>
      ) : editProjectMutation.isLoading ||
        query.isFetching ||
        query.isLoading ? (
        <Spinner />
      ) : (
        <Button colorScheme="green" onClick={attend}>
          Participer à ce projet
        </Button>
      )}
    </Box>
  );
};
