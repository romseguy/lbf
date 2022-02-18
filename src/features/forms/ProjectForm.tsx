import {
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
  Flex,
  Select,
  Alert,
  AlertIcon
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import { Session } from "next-auth";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import ReactSelect from "react-select";
import { ErrorMessageText, ListsControl, RTEditor } from "features/common";
import { useGetOrgsQuery } from "features/orgs/orgsApi";
import {
  useAddProjectMutation,
  useEditProjectMutation
} from "features/projects/projectsApi";
import { getLists, IOrg } from "models/Org";
import { IProject, Status, Statuses } from "models/Project";
import { IUser } from "models/User";
import { handleError } from "utils/form";
import { hasItems } from "utils/array";

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

  //#region project
  const [addProject, addProjectMutation] = useAddProjectMutation();
  const [editProject, editProjectMutation] = useEditProjectMutation();
  //#endregion

  //#region local state
  const [isLoading, setIsLoading] = useState(false);
  let lists = getLists(org);
  //#endregion

  //#region myOrgs
  const { data: myOrgs, isLoading: isQueryLoading } = useGetOrgsQuery({
    populate: "orgSubscriptions",
    createdBy: props.session.user.userId
  });
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
    setValue,
    getValues,
    trigger
  } = useForm({
    mode: "onChange"
  });
  const statusOptions: string[] = Object.keys(Status).map(
    (key) => key as Status
  );
  // const visibilityOptions: Visibility[] = Object.keys(Visibility).map(
  //   (key) => Visibilities[key as Visibility]
  // );
  const projectVisibility = watch("projectVisibility");

  const onChange = () => {
    clearErrors("formErrorMessage");
  };

  const onSubmit = async (form: {
    projectName: string;
    projectDescription: string;
    projectOrgs?: IOrg[];
    projectVisibility?: { label: string; value: string }[];
  }) => {
    console.log("submitted", form);
    setIsLoading(true);

    let payload = {
      ...form,
      projectDescription: form.projectDescription,
      projectDescriptionHtml: form.projectDescription,
      projectVisibility: form.projectVisibility?.map(({ value }) => value)
    };

    try {
      if (props.project) {
        await editProject({
          payload,
          projectId: props.project._id
        }).unwrap();

        toast({
          title: "Votre projet a bien été modifié",
          status: "success",
          isClosable: true
        });
      } else {
        await addProject({
          ...payload
        });

        toast({
          title: "Votre projet a bien été ajouté !",
          status: "success",
          isClosable: true
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
      <FormControl
        id="projectName"
        isRequired
        isInvalid={!!errors["projectName"]}
        mb={3}
      >
        <FormLabel>Nom du projet</FormLabel>
        <Input
          name="projectName"
          placeholder="Nom du projet"
          ref={register({
            required: "Veuillez saisir le nom du projet"
          })}
          defaultValue={props.project && props.project.projectName}
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="projectName" />
        </FormErrorMessage>
      </FormControl>

      <FormControl
        id="projectDescription"
        isInvalid={!!errors["projectDescription"]}
        mb={3}
      >
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
                onChange={({ html }) => renderProps.onChange(html)}
              />
            );
          }}
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="projectDescription" />
        </FormErrorMessage>
      </FormControl>

      {statusOptions.length > 0 && (
        <FormControl
          id="projectStatus"
          isRequired
          isInvalid={!!errors["projectStatus"]}
          mb={3}
        >
          <FormLabel>Statut</FormLabel>
          <Select
            name="projectStatus"
            defaultValue={
              props.project?.projectStatus || Status[Status.PENDING]
            }
            ref={register({
              required: "Veuillez sélectionner le statut du projet"
            })}
            placeholder="Sélectionnez le statut du projet..."
            color="gray.400"
          >
            {statusOptions.map((key) => {
              const status = key as Status;
              return (
                <option key={status} value={status}>
                  {Statuses[status]}
                </option>
              );
            })}
          </Select>
          <FormErrorMessage>
            <ErrorMessage errors={errors} name="projectStatus" />
          </FormErrorMessage>
        </FormControl>
      )}

      {props.isCreator && lists && (
        <ListsControl
          control={control}
          errors={errors}
          lists={lists}
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

      {org && (
        <FormControl
          display="none"
          mb={3}
          id="projectOrgs"
          isInvalid={!!errors["projectOrgs"]}
        >
          <FormLabel>Organisateurs</FormLabel>
          <Controller
            name="projectOrgs"
            as={ReactSelect}
            control={control}
            defaultValue={props.project?.projectOrgs || [org]}
            placeholder="Rechercher une organisation..."
            menuPlacement="top"
            noOptionsMessage={() => "Aucun résultat"}
            isClearable
            isMulti
            isSearchable
            closeMenuOnSelect
            styles={{
              placeholder: () => {
                return {
                  color: "#A0AEC0"
                };
              },
              control: (defaultStyles: any) => {
                return {
                  ...defaultStyles,
                  borderColor: "#e2e8f0",
                  paddingLeft: "8px"
                };
              }
            }}
            className="react-select-container"
            classNamePrefix="react-select"
            options={myOrgs}
            getOptionLabel={(option: any) => `${option.orgName}`}
            getOptionValue={(option: any) => option._id}
            onChange={(option: any) => option._id}
          />
          <FormErrorMessage>
            <ErrorMessage errors={errors} name="projectOrgs" />
          </FormErrorMessage>
        </FormControl>
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
        <Button onClick={() => props.onCancel && props.onCancel()}>
          Annuler
        </Button>

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
