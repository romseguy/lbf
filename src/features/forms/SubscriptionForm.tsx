import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  Alert,
  AlertIcon,
  Flex
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ErrorMessageText, Button, ListsControl } from "features/common";
import { EditOrgPayload, useEditOrgMutation } from "features/orgs/orgsApi";
import { useAddSubscriptionMutation } from "features/subscriptions/subscriptionsApi";
import { IOrg } from "models/Org";
import { ESubscriptionType } from "models/Subscription";
import { hasItems } from "utils/array";
import { emailR } from "utils/email";
import { handleError } from "utils/form";
import { phoneR } from "utils/string";
import { useLeaveConfirm } from "hooks/useLeaveConfirm";
import { TagsControl } from "features/common/forms/TagsControl";
import { ItemTag } from "@choc-ui/chakra-autocomplete";

type FormData = {
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
  onCancel: () => void;
  onSubmit: () => void;
}) => {
  const [addSubscription] = useAddSubscriptionMutation();
  const [editOrg] = useEditOrgMutation();

  //#region local state
  const [isLoading, setIsLoading] = useState(false);
  //#endregion

  //#region form
  const {
    clearErrors,
    control,
    errors,
    handleSubmit,
    setError,
    setValue,
    formState
  } = useForm<FormData>({
    mode: "onChange",
    defaultValues: {
      emailList: ""
    }
  });
  useLeaveConfirm({ formState });

  const [tags, setTags] = useState<ItemTag[]>([]);

  const onChange = () => clearErrors();

  const onSubmit = async (form: FormData) => {
    console.log("submitted", form);
    setIsLoading(true);
    const { emailList, phoneList, orgLists } = form;

    const emailArray: string[] = tags
      .map(({ label }) => label)
      .concat(emailList)
      .filter((email: string) => emailR.test(email));

    const phoneArray: string[] = (phoneList || "")
      .split(/(\s+)/)
      .filter((e: string) => e.trim().length > 0)
      .filter((phone: string) => phoneR.test(phone));

    try {
      if (!hasItems(emailArray) && !hasItems(phoneArray)) {
        throw new Error("Aucunes coordonnées valide");
      }

      for (const email of emailArray) {
        if (hasItems(orgLists))
          for (const { value: listName } of orgLists) {
            let type;
            if (listName === "Adhérents") type = ESubscriptionType.SUBSCRIBER;
            else if (listName === "Abonnés") type = ESubscriptionType.FOLLOWER;

            if (type)
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
            else {
              const subscription = await addSubscription({
                email,
                orgs: [
                  {
                    org,
                    orgId: org._id
                  }
                ]
              }).unwrap();
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
            }
          }
        else
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

      // for (const phone of phoneArray) {
      //   for (const type of orgLists) {
      //     await addSubscription({
      //       phone,
      //       payload: {
      //         orgs: [
      //           {
      //             orgId: org._id,
      //             org,
      //             type
      //           }
      //         ]
      //       }
      //     });
      //   }
      // }

      //setValue("orgLists", []);
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
      <FormControl isInvalid={!!errors.emailList} mb={3}>
        <FormLabel>Entrez ou copiez-collez les adresses e-mails : </FormLabel>

        <TagsControl
          control={control}
          name="emailList"
          tags={tags}
          setTags={setTags}
          setValue={setValue}
        />

        <FormErrorMessage>
          <ErrorMessage errors={errors} name="emailList" />
        </FormErrorMessage>
      </FormControl>

      <ListsControl
        control={control}
        errors={errors}
        label="Liste(s):"
        lists={org.orgLists}
        name="orgLists"
        onChange={onChange}
      />

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
        <Button colorScheme="red" onClick={onCancel} mr={3}>
          Annuler
        </Button>

        <Button
          colorScheme="green"
          type="submit"
          isDisabled={
            Object.keys(errors).length > 0 ||
            Object.keys(isSubscriptionLoading).some(
              (_id) => !!isSubscriptionLoading[_id]
            )
          }
          isLoading={isLoading}
          data-cy="orgAddSubscribersSubmit"
        >
          Ajouter
        </Button>
      </Flex>
    </form>
  );
};

{
  /* <FormControl isInvalid={!!errors.phoneList} mb={3}>
        <FormLabel>
          Entrez les numéros de téléphone mobile séparés par un espace ou un
          retour à la ligne :{" "}
        </FormLabel>
        <Textarea
          ref={register()}
          name="phoneList"
          dark={{ _hover: { borderColor: "white" } }}
          onChange={onChange}
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="phoneList" />
        </FormErrorMessage>
      </FormControl> */
}

{
  /*<FormControl isRequired isInvalid={!!errors.orgLists} mb={3}>
        <CheckboxGroup>
          <Box
            display="flex"
            flexDirection="column"
            css={css`
              .chakra-checkbox__control {
                border-color: black;
              }
            `}
            color="black"
          >
            <Box
              display="flex"
              flexDirection="column"
              bg={"green.100"}
              borderRadius="lg"
              mb={3}
              p={3}
            >
              <Checkbox
                ref={register({ required: true })}
                name="orgLists"
                value={ESubscriptionType.FOLLOWER}
                data-cy="follower-checkbox"
              >
                Abonné
                <Text fontSize="smaller">
                Vous pourrez inviter cette personne aux discussions, événements,
                et projets de {orgTypeFull4(org.orgType)}.
              </Text>
              </Checkbox>
            </Box>

            <Checkbox
              ref={register({ required: true })}
              name="orgLists"
              value={ESubscriptionType.SUBSCRIBER}
              bg={"purple.100"}
              borderRadius="lg"
              p={3}
              data-cy="subscriber-checkbox"
            >
              Adhérent
              <Text fontSize="smaller">
                La personne aura également accès aux discussions, événements, et
                projets réservés aux adhérents.
                Donner accès au contenu réservé aux adhérents.
              </Text>
            </Checkbox>
          </Box>
        </CheckboxGroup> 

        <FormErrorMessage>
          <ErrorMessage
            errors={errors}
            name="orgLists"
            message="Veuillez cocher une case au minimum"
          />
        </FormErrorMessage>
      </FormControl>*/
}
