import { IProject, isAttending, StatusTypes } from "models/Project";
import React from "react";
import { useSession } from "hooks/useAuth";
import {
  Box,
  Text,
  Flex,
  Alert,
  AlertIcon,
  useToast,
  Spinner
} from "@chakra-ui/react";
import { Button } from "features/common";
import { useEditProjectMutation } from "features/projects/projectsApi";
import { emailR } from "utils/email";
import { selectUserEmail, setUserEmail } from "features/users/userSlice";
import { useAppDispatch } from "store";
import { useSelector } from "react-redux";

export const ProjectAttendingForm = ({
  project,
  orgQuery
}: {
  project: IProject;
  orgQuery?: any;
}) => {
  const { data: session, loading: isSessionLoading } = useSession();
  const toast = useToast({ position: "top" });
  const dispatch = useAppDispatch();

  //#region project
  const [editProject, editProjectMutation] = useEditProjectMutation();
  //#endregion

  //#region local state
  const storedUserEmail = useSelector(selectUserEmail);
  const userEmail = storedUserEmail || session?.user.email || "";
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

    let projectNotified =
      project.projectNotified?.map(({ email: e, status }) => {
        if ((e === promptedEmail || userEmail) && status !== StatusTypes.OK) {
          isNew = false;
          return { email: e, status: StatusTypes.OK };
        }
        return { email: e, status };
      }) || [];

    if (isNew)
      projectNotified?.push({
        email: promptedEmail || userEmail,
        status: StatusTypes.OK
      });

    await editProject({
      payload: { projectNotified },
      projectId: project._id
    });
    orgQuery.refetch();
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

    let projectNotified = project.projectNotified?.filter(
      ({ email, status }) => {
        return email !== promptedEmail && email !== userEmail;
      }
    );

    await editProject({
      payload: {
        projectNotified
      },
      projectId: project._id
    });
    orgQuery.refetch();
  };

  return (
    <Box p={3}>
      {isAttending({ email: userEmail, project }) ? (
        <Button
          colorScheme="red"
          isLoading={
            editProjectMutation.isLoading ||
            orgQuery.isFetching ||
            orgQuery.isLoading
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
        orgQuery.isFetching ||
        orgQuery.isLoading ? (
        <Spinner />
      ) : (
        <Button colorScheme="green" onClick={attend}>
          Participer à ce projet
        </Button>
      )}
    </Box>
  );
};
