import { AtSignIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Box,
  Flex,
  InputLeftElement,
  useColorMode
} from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

import { ItemTag } from "@choc-ui/chakra-autocomplete";
import { ErrorMessage } from "@hookform/error-message";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Button,
  ErrorMessageText,
  ListsControl,
  TagsControl
} from "features/common";
import { formBoxProps } from "features/layout/theme";
import { EditOrgPayload, useEditOrgMutation } from "features/api/orgsApi";
import { useAddSubscriptionMutation } from "features/api/subscriptionsApi";
import { getLists, IOrg } from "models/Org";
import { EOrgSubscriptionType } from "models/Subscription";
import { hasItems } from "utils/array";
import { emailR } from "utils/regex";
import { handleError } from "utils/form";
import { phoneR } from "utils/regex";
import { useLeaveConfirm } from "hooks/useLeaveConfirm";
import useFormPersist from "hooks/useFormPersist";

type FormValues = {
  emailList: string;
  phoneList?: string;
  orgLists: { label: string; value: string }[];
};

export const SubscriptionForm = ({
  org,
  onCancel,
  isSubscriptionLoading,
  ...props
}: {
  org: IOrg;
  isSubscriptionLoading: {
    [key: string]: boolean;
  };
  onCancel?: () => void;
  onSubmit: () => void;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const [addSubscription] = useAddSubscriptionMutation();
  const [editOrg] = useEditOrgMutation();
  const [isLoading, setIsLoading] = useState(false);
  const lists = useMemo(() => getLists(org), [org]);
  const [tags, setTags] = useState<ItemTag[]>([]);
  //#region form
  const {
    clearErrors,
    control,
    errors,
    handleSubmit,
    setError,
    setValue,
    formState
    // watch
  } = useFormPersist(
    useForm<FormValues>({
      mode: "onChange",
      defaultValues: {
        emailList: ""
      }
    })
  );
  useLeaveConfirm({ formState });
  const isDisabled =
    Object.keys(errors).length > 0 ||
    Object.keys(isSubscriptionLoading).some(
      (_id) => !!isSubscriptionLoading[_id]
    );

  const onChange = () => clearErrors("formErrorMessage");

  const onSubmit = async (form: FormValues) => {
    console.log("submitted", form);
    setIsLoading(true);
    const { emailList /*phoneList, orgLists*/ } = form;

    const emailArray: string[] = tags
      .map(({ label }) => label)
      .concat(emailList)
      .filter((email: string) => emailR.test(email));

    try {
      if (!hasItems(emailArray) /*&& !hasItems(phoneArray)*/) {
        throw new Error("Aucunes coordonnées valide");
      }

      for (const email of emailArray) {
        await addSubscription({
          email,
          orgs: [
            {
              org,
              orgId: org._id
            }
          ]
        });
      }

      setIsLoading(false);
      props.onSubmit && props.onSubmit();
    } catch (error) {
      setIsLoading(false);
      handleError(error, (message, field) => {
        if (field) {
          setError(field, { type: "manual", message });
        } else {
          setError("formErrorMessage", { type: "manual", message });
        }
      });
    } finally {
    }
  };
  //#endregion

  return (
    <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
      <Box {...formBoxProps(isDark)}>
        <TagsControl
          name="emailList"
          control={control}
          errors={errors}
          setError={setError}
          setValue={setValue}
          //isRequired
          label="Adresses e-mail séparées par un espace : "
          leftElement={
            <InputLeftElement cursor="pointer" children={<AtSignIcon />} />
          }
          tags={tags}
          setTags={setTags}
          mb={3}
        />
      </Box>

      {/*<Box {...formBoxProps(isDark)}>
        <ListsControl
          name="orgLists"
          control={control}
          errors={errors}
          setError={setError}
          isMultiple={false}
          isRequired
          label="Liste :"
          lists={lists}
          mb={3}
          onChange={onChange}
        />
      </Box>*/}

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
        {onCancel && (
          <Button colorScheme="red" onClick={onCancel} mr={3}>
            Annuler
          </Button>
        )}

        <Button
          colorScheme="green"
          type="submit"
          isDisabled={isDisabled}
          isLoading={isLoading}
        >
          Ajouter
        </Button>
      </Flex>
    </form>
  );
};

{
  /*
    const phoneArray: string[] = (phoneList || "")
      .split(/(\s+)/)
      .filter((e: string) => e.trim().length > 0)
      .filter((phone: string) => phoneR.test(phone));
    for (const phone of phoneArray) {
      for (const type of orgLists) {
        await addSubscription({
          phone,
          payload: {
            orgs: [
              {
                orgId: org._id,
                org,
                type
              }
            ]
          }
        });
      }
    }

    setValue("orgLists", []);
  */
}

{
  /*
    if (hasItems(orgLists)) {
      for (const { value: listName } of orgLists) {
        let type;
        // TODO1 replace with sub.list
        if (listName === "Abonnés") type = EOrgSubscriptionType.FOLLOWER;
        if (type) {
          await addSubscription({
            email,
            orgs: [
              {
                org,
                orgId: org._id,
                type,
                tagTypes: [
                  { type: "Events", emailNotif: true, pushNotif: true },
                  { type: "Projects", emailNotif: true, pushNotif: true },
                  { type: "Topics", emailNotif: true, pushNotif: true }
                ]
              }
            ]
          });
        } else {
          const subscription = await addSubscription({
            email,
            orgs: [
              {
                org,
                orgId: org._id
              }
            ]
          }).unwrap();
        }
      }

      const payload: EditOrgPayload = {
        orgLists: org.orgLists.map((orgList) => {
          if (orgList.listName === listName) {
            if (!orgList.subscriptions.length)
              return {
                ...orgList,
                subscriptions: [subscription]
              };

            return {
              ...orgList,
              subscriptions: !orgList.subscriptions.find(
                ({ _id }) => _id === subscription._id
              )
                ? [...orgList.subscriptions, subscription]
                : orgList.subscriptions
            };
          }

          return orgList;
        })
      };
      await editOrg({ orgId: org._id, payload });
    } else
  */
}
