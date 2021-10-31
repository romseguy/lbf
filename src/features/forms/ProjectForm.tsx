import type { IOrg } from "models/Org";
import { IProject, Status, StatusV } from "models/Project";
import React, { useState } from "react";
import ReactSelect from "react-select";
import { Controller, useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import {
  ChakraProps,
  Input,
  Button,
  FormControl,
  FormLabel,
  Box,
  Stack,
  FormErrorMessage,
  useToast,
  Flex,
  Select,
  Alert,
  AlertIcon
} from "@chakra-ui/react";
import { WarningIcon } from "@chakra-ui/icons";
import { ErrorMessageText, RTEditor } from "features/common";
import { Session } from "next-auth";
import { Visibility, VisibilityV } from "models/Project";
import { handleError } from "utils/form";
import {
  useAddProjectMutation,
  useEditProjectMutation
} from "features/projects/projectsApi";
import { useGetOrgsQuery } from "features/orgs/orgsApi";
import { FetchBaseQueryError } from "@reduxjs/toolkit/dist/query";
import { SerializedError } from "@reduxjs/toolkit";
import { IUser } from "models/User";

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
  const [projectDescriptionHtml, setProjectDescriptionHtml] = useState(
    props.project?.projectDescriptionHtml
  );
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
  const statusOptions: string[] = Object.keys(Status).map((key) => Status[key]);
  const visibilityOptions: string[] = Object.keys(Visibility).map(
    (key) => Visibility[key]
  );
  const projectVisibility = watch("projectVisibility");
  const projectOrgsRules: { required: boolean } = {
    required: projectVisibility === Visibility.SUBSCRIBERS
  };

  const onChange = () => {
    clearErrors("formErrorMessage");
  };

  const onSubmit = async (form: IProject) => {
    console.log("submitted", form);
    setIsLoading(true);

    let payload = {
      ...form,
      projectDescription:
        form.projectDescription === "<p><br></p>"
          ? ""
          : form.projectDescription?.replace(/\&nbsp;/g, " "),
      projectDescriptionHtml
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
        const res: {
          data?: IProject;
          error?: FetchBaseQueryError | SerializedError;
        } = await addProject({
          ...payload,
          createdBy: props.session.user.userId
        });

        if (res.error) {
          throw res.error;
        } else {
          toast({
            title: "Votre projet a bien été ajouté !",
            status: "success",
            isClosable: true
          });
        }
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
          defaultValue={""}
          render={(renderProps) => {
            return (
              <RTEditor
                defaultValue={props.project?.projectDescription}
                placeholder="Description du projet"
                onChange={({ html, quillHtml }) => {
                  setProjectDescriptionHtml(html);
                  renderProps.onChange(quillHtml);
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
              return (
                <option key={key} value={key}>
                  {StatusV[key]}
                </option>
              );
            })}
          </Select>
          <FormErrorMessage>
            <ErrorMessage errors={errors} name="projectStatus" />
          </FormErrorMessage>
        </FormControl>
      )}

      {org && visibilityOptions.length > 0 && (
        <FormControl
          id="projectVisibility"
          isRequired
          isInvalid={!!errors["projectVisibility"]}
          mb={3}
        >
          <FormLabel>Visibilité</FormLabel>
          <Select
            name="projectVisibility"
            defaultValue={Visibility[Visibility.PUBLIC]}
            ref={register({
              required: "Veuillez sélectionner la visibilité du projet"
            })}
            placeholder="Sélectionnez la visibilité du projet..."
            color="gray.400"
          >
            {visibilityOptions.map((key) => {
              return (
                <option key={key} value={key}>
                  {VisibilityV[key]}
                </option>
              );
            })}
          </Select>
          <FormErrorMessage>
            <ErrorMessage errors={errors} name="projectVisibility" />
          </FormErrorMessage>
        </FormControl>
      )}

      {org && (
        <FormControl
          mb={3}
          id="projectOrgs"
          isInvalid={!!errors["projectOrgs"]}
          isRequired={projectOrgsRules.required}
        >
          <FormLabel>Organisateurs</FormLabel>
          <Controller
            name="projectOrgs"
            rules={projectOrgsRules}
            as={ReactSelect}
            control={control}
            defaultValue={props.project?.projectOrgs || [org]}
            placeholder="Sélectionner..."
            menuPlacement="top"
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
            getOptionLabel={(option: IOrg) => `${option.orgName}`}
            getOptionValue={(option: IOrg) => option._id}
            onChange={([option]: [option: IOrg]) => option._id}
          />
          <FormErrorMessage>
            <ErrorMessage errors={errors} name="projectOrgs" />
          </FormErrorMessage>
        </FormControl>
      )}

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
