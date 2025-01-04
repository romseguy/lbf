import {
  Alert,
  AlertIcon,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import { useEditOrgMutation, useGetOrgsQuery } from "features/api/orgsApi";
import { AddTopicPayload, useAddTopicMutation } from "features/api/topicsApi";
import { ErrorMessageText } from "features/common";
import useFormPersist from "hooks/useFormPersist";
import { useLeaveConfirm } from "hooks/useLeaveConfirm";
import { useToast } from "hooks/useToast";
import { getRefId } from "models/Entity";
import { IOrg } from "models/Org";
import { ITopic } from "models/Topic";
import { Controller, useForm } from "react-hook-form";
import ReactSelect from "react-select";
import { hasItems } from "utils/array";
import { Session } from "utils/auth";
import { handleError } from "utils/form";
import { removeProps } from "utils/object";

export const TopicCopyForm = ({
  topic,
  ...props
}: {
  topic?: ITopic;
  session: Session;
  onCancel: () => void;
  onSubmit: (topic: ITopic) => void;
}) => {
  console.log("🚀 ~ TopicCopyForm ~ topic:", topic);
  const toast = useToast({ position: "top" });

  const [addTopic, addTopicMutation] = useAddTopicMutation();

  const { myOrgs } = useGetOrgsQuery(
    {
      createdBy: props.session.user.userId
    },
    {
      selectFromResult: ({ data, ...rest }) => {
        return {
          ...rest,
          myOrgs: data?.filter((org) => {
            return getRefId(org, "_id") !== getRefId(topic?.org, "_id");
          })
        };
      }
    }
  );

  const {
    control,
    register,
    handleSubmit,
    errors,
    setError,
    clearErrors,
    setValue,
    watch,
    formState
  } = useFormPersist(
    useForm<{ formErrorMessage: ""; org: IOrg }>({
      mode: "onChange",
      defaultValues: {}
    })
  );
  useLeaveConfirm({ formState });

  const onChange = () => {
    clearErrors("formErrorMessage");
  };

  const onSubmit = async (form: { org: IOrg }) => {
    console.log("submitted", form);

    const addTopicPayload: AddTopicPayload = {
      topic: {
        ...removeProps(topic || {}, ["_id"]),
        org: form.org
      },
      org: form.org
    };

    try {
      await addTopic({
        payload: addTopicPayload
      }).unwrap();

      toast({
        title: "La discussion a été copiée",
        status: "success"
      });

      props.onSubmit && props.onSubmit(topic || {});
    } catch (error) {
      handleError(error, (message, field) =>
        field
          ? setError(field, { type: "manual", message })
          : setError("formErrorMessage", { type: "manual", message })
      );
    }
  };

  return (
    <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
      <FormControl isRequired isInvalid={!!errors["org"]} mb={3}>
        <FormLabel>Où souhaitez-vous copier la discussion ?</FormLabel>
        <Controller
          name="org"
          as={ReactSelect}
          control={control}
          closeMenuOnSelect
          isClearable
          //isMulti
          isSearchable
          menuPlacement="top"
          noOptionsMessage={() => "Aucun résultat"}
          options={myOrgs}
          getOptionLabel={(option: any) => option.orgName}
          getOptionValue={(option: any) => option._id}
          placeholder={
            hasItems(myOrgs)
              ? "Rechercher une planète ou un arbre..."
              : "Vous n'avez ajouté aucune planètes ou arbres"
          }
          styles={{
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
          onChange={(newValue: any /*, actionMeta*/) => {
            console.log("ONCHANGE");
            onChange();
            return newValue._id;
          }}
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="topicName" />
        </FormErrorMessage>
      </FormControl>

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
          //isLoading={ isLoading }
          isDisabled={Object.keys(errors).length > 0}
        >
          Copier
        </Button>
      </Flex>
    </form>
  );
};
