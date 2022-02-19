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
import {
  Textarea,
  ErrorMessageText,
  Button,
  ListsControl
} from "features/common";
import { useAddSubscriptionMutation } from "features/subscriptions/subscriptionsApi";
import { getLists, IOrg } from "models/Org";
import { ESubscriptionType } from "models/Subscription";
import { hasItems } from "utils/array";
import { emailR } from "utils/email";
import { handleError } from "utils/form";
import { phoneR } from "utils/string";

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

  //#region local state
  const [isLoading, setIsLoading] = useState(false);
  //#endregion

  //#region form
  const { clearErrors, control, errors, handleSubmit, register, setError } =
    useForm({
      mode: "onChange"
    });

  const onChange = () => clearErrors();

  const onSubmit = async (form: {
    emailList?: string;
    phoneList?: string;
    subscriptionType: { label: string; value: string }[];
  }) => {
    console.log("submitted", form);
    setIsLoading(true);
    const { emailList, phoneList, subscriptionType } = form;

    const emailArray: string[] = (emailList || "")
      .split(/(\s+)/)
      .filter((e: string) => e.trim().length > 0)
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
        if (hasItems(subscriptionType))
          for (const { value } of subscriptionType) {
            let type;
            if (value === "Adhérents") type = ESubscriptionType.SUBSCRIBER;
            else if (value === "Abonnés") type = ESubscriptionType.FOLLOWER;

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
                      { type: "Topics", emailNotif: true, pushNotif: true }
                    ]
                  }
                ]
              });
            else {
              console.log("todo: add to org list");
            }
          }
        else console.log("todo: add empty sub");
      }

      // for (const phone of phoneArray) {
      //   for (const type of subscriptionType) {
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

      //setValue("subscriptionType", []);
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
        <FormLabel>
          Entrez les adresses e-mails séparées par un espace ou un retour à la
          ligne :{" "}
        </FormLabel>
        <Textarea ref={register()} name="emailList" />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="emailList" />
        </FormErrorMessage>
      </FormControl>

      {/* <FormControl isInvalid={!!errors.phoneList} mb={3}>
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
      </FormControl> */}

      <ListsControl
        control={control}
        errors={errors}
        label="Liste(s):"
        lists={getLists(org)}
        name="subscriptionType"
        onChange={onChange}
      />

      {/*<FormControl isRequired isInvalid={!!errors.subscriptionType} mb={3}>
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
                name="subscriptionType"
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
              name="subscriptionType"
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
            name="subscriptionType"
            message="Veuillez cocher une case au minimum"
          />
        </FormErrorMessage>
      </FormControl>*/}

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

      <Flex>
        <Button onClick={onCancel} mr={3}>
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
