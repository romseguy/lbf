import {
  Alert,
  AlertIcon,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
  useToast
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import { Session } from "next-auth";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { ErrorMessageText, ListsControl, RTEditor } from "features/common";
import {
  AddProjectPayload,
  useAddProjectMutation,
  useEditProjectMutation
} from "features/projects/projectsApi";
import { IOrg } from "models/Org";
import { IProject, EProjectStatus, ProjectStatuses } from "models/Project";
import { IUser } from "models/User";
import { handleError } from "utils/form";
import { hasItems } from "utils/array";
import { useLeaveConfirm } from "hooks/useLeaveConfirm";

export const ProjectForm = ({
  org,
  ...props
}: {
  session: Session;
  org?: IOrg;
  project?: IProject;
  user?: IUser;
  isCreator?: boolean;
  isFollowed?: boolean;
  isSubscribed?: boolean;
  onClose?: () => void;
  onCancel?: () => void;
  onSubmit?: (project: IProject | null) => void;
}) => {
  const toast = useToast({ position: "top" });
  const [addProject, addProjectMutation] = useAddProjectMutation();
  const [editProject, editProjectMutation] = useEditProjectMutation();

  //#region local state
  const [isLoading, setIsLoading] = useState(false);
  //#endregion

  //#region form
  const {
    control,
    register,
    handleSubmit,
    errors,
    setError,
    clearErrors,
    watch,
    formState
  } = useForm({
    mode: "onChange"
  });
  useLeaveConfirm({ formState });

  const projectVisibility = watch("projectVisibility");
  const statusOptions: string[] = Object.keys(EProjectStatus).map(
    (key) => key as EProjectStatus
  );

  const onChange = () => {
    clearErrors("formErrorMessage");
  };

  const onSubmit = async (form: {
    projectName: string;
    projectDescription: string;
    projectDescriptionHtml: string;
    projectStatus: EProjectStatus;
    projectVisibility?: { label: string; value: string }[];
  }) => {
    console.log("submitted", form);
    setIsLoading(true);

    let payload: AddProjectPayload = {
      ...form,
      projectOrgs: org ? [org] : [],
      projectVisibility: form.projectVisibility?.map(({ value }) => value)
    };

    try {
      if (props.project) {
        await editProject({
          payload,
          projectId: props.project._id
        }).unwrap();

        toast({
          title: "Le projet a été modifié",
          status: "success"
        });
      } else {
        await addProject({
          ...payload
        });

        toast({
          title: "Le projet a été ajouté !",
          status: "success"
        });
      }

      setIsLoading(false);
      props.onSubmit && props.onSubmit(props.project || null);
    } catch (error) {
      setIsLoading(false);
      handleError(error, (message, field) => {
        if (field) {
          setError(field, { type: "manual", message });
        } else {
          setError("formErrorMessage", { type: "manual", message });
        }
      });
    }
  };
  //#endregion

  return (
    <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
      <FormControl isRequired isInvalid={!!errors["projectName"]} mb={3}>
        <FormLabel>Nom du projet</FormLabel>
        <Input
          name="projectName"
          ref={register({
            required: "Veuillez saisir le nom du projet"
          })}
          autoComplete="off"
          defaultValue={props.project && props.project.projectName}
          placeholder="Nom du projet"
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="projectName" />
        </FormErrorMessage>
      </FormControl>

      <FormControl isInvalid={!!errors["projectDescription"]} mb={3}>
        <FormLabel>Description du projet</FormLabel>
        <Controller
          name="projectDescription"
          control={control}
          defaultValue=""
          render={(renderProps) => {
            return (
              <RTEditor
                defaultValue={props.project?.projectDescription}
                placeholder="Description du projet"
                onChange={({ html }) => {
                  renderProps.onChange(html);
                }}
              />
            );
          }}
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="projectDescription" />
        </FormErrorMessage>
      </FormControl>

      {statusOptions.length > 0 && (
        <FormControl isRequired isInvalid={!!errors["projectStatus"]} mb={3}>
          <FormLabel>Statut</FormLabel>
          <Select
            name="projectStatus"
            defaultValue={
              props.project?.projectStatus ||
              EProjectStatus[EProjectStatus.PENDING]
            }
            ref={register({
              required: "Veuillez sélectionner le statut du projet"
            })}
            placeholder="Sélectionnez le statut du projet..."
            color="gray.400"
          >
            {statusOptions.map((key) => {
              const status = key as EProjectStatus;
              return (
                <option key={status} value={status}>
                  {ProjectStatuses[status]}
                </option>
              );
            })}
          </Select>
          <FormErrorMessage>
            <ErrorMessage errors={errors} name="projectStatus" />
          </FormErrorMessage>
        </FormControl>
      )}

      {org && props.isCreator && (
        <ListsControl
          control={control}
          errors={errors}
          lists={org.orgLists}
          name="projectVisibility"
        />
      )}

      {hasItems(projectVisibility) && (
        <Alert status="info" mb={3}>
          <AlertIcon />
          Le projet ne sera visible que par les membres des listes
          sélectionnées.
        </Alert>
      )}

      <ErrorMessage
        errors={errors}
        name="formErrorMessage"
        render={({ message }) => (
          <Alert status="error" mb={3}>
            <AlertIcon />
            <ErrorMessageText>{message}</ErrorMessageText>
          </Alert>
        )}
      />

      <Flex justifyContent="space-between">
        {props.onCancel && (
          <Button colorScheme="red" onClick={props.onCancel}>
            Annuler
          </Button>
        )}

        <Button
          colorScheme="green"
          type="submit"
          isLoading={
            isLoading ||
            addProjectMutation.isLoading ||
            editProjectMutation.isLoading
          }
          isDisabled={Object.keys(errors).length > 0}
          data-cy="addProject"
        >
          {props.project ? "Modifier" : "Ajouter"}
        </Button>
      </Flex>
    </form>
  );
};
