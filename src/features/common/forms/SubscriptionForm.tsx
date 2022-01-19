import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  CheckboxGroup,
  Box,
  Checkbox,
  Alert,
  AlertIcon,
  Flex,
  Text
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { css } from "twin.macro";
import { useAddSubscriptionMutation } from "features/subscriptions/subscriptionsApi";
import { IOrg, orgTypeFull4 } from "models/Org";
import { SubscriptionTypes } from "models/Subscription";
import { emailR } from "utils/email";
import { handleError } from "utils/form";
import { phoneR } from "utils/string";
import { Textarea, ErrorMessageText, Button } from "..";

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
  const [addSubscription, addSubscriptionMutation] =
    useAddSubscriptionMutation();

  const [isLoading, setIsLoading] = useState(false);

  //#region form
  const { register, handleSubmit, errors, setError, clearErrors, setValue } =
    useForm({
      mode: "onChange"
    });

  const onSubmit = async (form: {
    emailList: string;
    phoneList: string;
    subscriptionType: string;
  }) => {
    try {
      setIsLoading(true);
      console.log("submitted", form);
      const { emailList, phoneList, subscriptionType } = form;

      const emailArray: string[] = emailList
        .split(/(\s+)/)
        .filter((e: string) => e.trim().length > 0)
        .filter((email: string) => emailR.test(email));

      const phoneArray: string[] = phoneList
        .split(/(\s+)/)
        .filter((e: string) => e.trim().length > 0)
        .filter((phone: string) => phoneR.test(phone));

      if (!emailArray.length && !phoneArray.length) {
        throw new Error("Aucunes coordonnées valide");
      }

      for (const email of emailArray) {
        for (const type of subscriptionType) {
          await addSubscription({
            email,
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

      for (const phone of phoneArray) {
        for (const type of subscriptionType) {
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

      clearErrors();
      setValue("subscriptionType", []);
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
    <form
      onChange={() => clearErrors("formErrorMessage")}
      onSubmit={handleSubmit(onSubmit)}
    >
      <FormControl id="emailList" isInvalid={!!errors.emailList} mb={3}>
        <FormLabel>
          Entrez les e-mails séparées par un espace ou un retour à la ligne :{" "}
        </FormLabel>
        <Textarea
          ref={register()}
          name="emailList"
          dark={{ _hover: { borderColor: "white" } }}
          onChange={() => clearErrors("formErrorMessage")}
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="emailList" />
        </FormErrorMessage>
      </FormControl>

      <FormControl id="phoneList" isInvalid={!!errors.phoneList} mb={3}>
        <FormLabel>
          Entrez les numéros de téléphone mobile séparés par un espace ou un
          retour à la ligne :{" "}
        </FormLabel>
        <Textarea
          ref={register()}
          name="phoneList"
          dark={{ _hover: { borderColor: "white" } }}
          onChange={() => clearErrors("formErrorMessage")}
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="phoneList" />
        </FormErrorMessage>
      </FormControl>

      <FormControl
        id="subscriptionType"
        isRequired
        isInvalid={!!errors.subscriptionType}
        mb={3}
      >
        <FormLabel>Ajouter les coordonnées en tant que :</FormLabel>
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
            <Checkbox
              ref={register({ required: true })}
              name="subscriptionType"
              value={SubscriptionTypes.FOLLOWER}
              bg={"green.100"}
              borderRadius="lg"
              mb={3}
              p={3}
              data-cy="follower-checkbox"
            >
              Abonné
              <Text fontSize="smaller">
                Vous pourrez inviter cette personne aux discussions, événements,
                et projets de {orgTypeFull4(org.orgType)}.
              </Text>
            </Checkbox>

            <Checkbox
              ref={register({ required: true })}
              name="subscriptionType"
              value={SubscriptionTypes.SUBSCRIBER}
              bg={"purple.100"}
              borderRadius="lg"
              p={3}
              data-cy="subscriber-checkbox"
            >
              Adhérent
              <Text fontSize="smaller">
                La personne aura également accès aux discussions, événements, et
                projets réservés aux adhérents.
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
