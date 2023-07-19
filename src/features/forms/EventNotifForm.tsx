import { EmailIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Box,
  BoxProps,
  Button,
  Checkbox,
  CheckboxGroup,
  Flex,
  FormControl,
  FormErrorMessage,
  Heading,
  Radio,
  RadioGroup,
  Spinner,
  Stack,
  Table,
  Tbody,
  Td,
  Tr,
  useColorMode,
  useToast
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import React, { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { EmailControl, EntityButton, ErrorMessageText } from "features/common";
import { useAddEventNotifMutation } from "features/api/eventsApi";
import { IEvent } from "models/Event";
import { orgTypeFull } from "models/Org";
import { hasItems } from "utils/array";
import { Session } from "utils/auth";
import { handleError } from "utils/form";
import { equalsValue } from "utils/string";
import { AppQuery } from "utils/types";
import {
  getFollowerSubscription,
  isOrgSubscription
} from "models/Subscription";

export interface EventNotifFormState {
  email?: string;
  orgListsNames: string[];
}

export const EventNotifForm = ({
  event,
  eventQuery,
  session,
  onCancel,
  ...props
}: BoxProps & {
  event: IEvent<string | Date>;
  eventQuery: AppQuery<IEvent>;
  session: Session;
  onCancel?: () => void;
  onSubmit?: () => void;
}) => {
  const toast = useToast({ position: "top" });
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  //#region event
  const [addEventNotif] = useAddEventNotifMutation();
  //#endregion

  //#region local state
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState<"multi" | "single">();
  //#endregion

  //#region form
  const { control, register, errors, setError, setValue, watch } = useForm({
    mode: "onChange"
  });
  const email = watch("email");
  const orgListsNames = watch("orgListsNames");

  //#region form handlers
  const onChange = () => {};

  const onSubmit = async (form: EventNotifFormState) => {
    console.log("submitted", form);
    setIsLoading(true);

    let payload = {
      ...form
    };

    try {
      const { notifications } = await addEventNotif({
        eventId: event._id,
        payload
      }).unwrap();

      if (hasItems(notifications)) {
        const s = notifications.length > 1 ? "s" : "";

        toast({
          title: `Une invitation a été envoyée à ${
            form.email ? form.email : `${notifications.length} abonné${s}`
          }`,
          status: "success"
        });
      } else {
        toast({
          title: "Aucune invitation envoyée",
          status: "warning"
        });
      }

      setIsLoading(false);
      props.onSubmit && props.onSubmit();
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      handleError(error, (message, field) => {
        setError(field || "formErrorMessage", {
          type: "manual",
          message
        });
      });
    }
  };
  //#endregion
  //#endregion

  return (
    <Box
      bg={isDark ? "gray.500" : "lightcyan"}
      borderRadius="lg"
      pt={1}
      pb={3}
      px={3}
      mt={3}
      {...props}
    >
      <form onChange={onChange}>
        <RadioGroup name="type" my={3}>
          <Stack spacing={2}>
            <Radio
              isChecked={type === "multi"}
              onChange={() => {
                setType("multi");
              }}
            >
              Inviter des utilisateurs
              <EntityButton event={event} p={1} onClick={null} />
            </Radio>
            <Radio
              isChecked={type === "single"}
              onChange={() => {
                setType("single");
              }}
            >
              Inviter une adresse e-mail
            </Radio>
          </Stack>
        </RadioGroup>

        {type === "single" && (
          <EmailControl
            name="email"
            noLabel
            control={control}
            register={register}
            setValue={setValue}
            errors={errors}
            placeholder="Envoyer à cette adresse e-mail uniquement"
            mt={3}
            isMultiple={false}
          />
        )}

        {type === "multi" && (
          <FormControl isInvalid={!!errors.orgListsNames} isRequired>
            <CheckboxGroup>
              <Table bg={isDark ? "gray.500" : "lightblue"} borderRadius="lg">
                <Tbody>
                  {eventQuery.isLoading || eventQuery.isFetching ? (
                    <Tr>
                      <Td colSpan={2}>
                        <Spinner />
                      </Td>
                    </Tr>
                  ) : hasItems(event.eventOrgs) ? (
                    event.eventOrgs.map((org) => {
                      const lists = org.orgLists;

                      return (
                        <Fragment key={org._id}>
                          <Tr>
                            <Td colSpan={2}>
                              <Flex alignItems="center">
                                <HamburgerIcon mr={2} />
                                <Heading
                                  display="flex"
                                  alignItems="center"
                                  size="sm"
                                >
                                  Listes de {orgTypeFull(org.orgType)}
                                  <EntityButton org={org} ml={2} />
                                </Heading>
                              </Flex>
                            </Td>
                          </Tr>

                          {lists?.map((list) => {
                            let i = 0;
                            for (const subscription of list.subscriptions ||
                              []) {
                              if (
                                event.eventNotifications.find(
                                  ({ email, phone }) =>
                                    typeof subscription.user === "object"
                                      ? equalsValue(
                                          subscription.user.email,
                                          email
                                        ) ||
                                        equalsValue(
                                          subscription.user.phone,
                                          phone
                                        )
                                      : equalsValue(
                                          email,
                                          subscription.email
                                        ) ||
                                        equalsValue(phone, subscription.phone)
                                )
                              )
                                continue;

                              const followerSubscription =
                                getFollowerSubscription({ org, subscription });

                              if (
                                followerSubscription &&
                                isOrgSubscription(followerSubscription)
                              ) {
                                const { eventCategories, tagTypes } =
                                  followerSubscription;

                                if (
                                  !tagTypes?.find(
                                    ({ type, emailNotif, pushNotif }) =>
                                      type === "Events" &&
                                      (emailNotif || pushNotif)
                                  ) &&
                                  !eventCategories?.find(
                                    ({ catId, emailNotif, pushNotif }) =>
                                      (catId === event.eventCategory &&
                                        emailNotif) ||
                                      pushNotif
                                  )
                                )
                                  continue;
                              }

                              i++;
                            }
                            const s = i !== 1 ? "s" : "";

                            return (
                              <Tr key={list.listName}>
                                <Td>
                                  <Checkbox
                                    name="orgListsNames"
                                    ref={register({
                                      required:
                                        "Veuillez sélectionner une liste au minimum"
                                    })}
                                    value={list.listName + "." + org._id}
                                    icon={<EmailIcon />}
                                  >
                                    {list.listName}
                                  </Checkbox>
                                </Td>
                                <Td>
                                  {i} membre{s} n'{s ? "ont" : "a"} pas été
                                  invité
                                </Td>
                              </Tr>
                            );
                          })}
                        </Fragment>
                      );
                    })
                  ) : (
                    <Alert status="error">
                      <AlertIcon />
                      L'événement n'est organisé par aucune organisations.
                    </Alert>
                  )}
                </Tbody>
              </Table>
            </CheckboxGroup>
            <FormErrorMessage>
              <ErrorMessage errors={errors} name="orgListsNames" />
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

        <Flex justifyContent="space-between" mt={5}>
          {onCancel && (
            <Button colorScheme="red" onClick={onCancel}>
              Annuler
            </Button>
          )}

          <Button
            colorScheme="green"
            isDisabled={
              Object.keys(errors).length > 0 ||
              (type === "single" && !email) ||
              (type === "multi" && !hasItems(orgListsNames))
            }
            isLoading={isLoading}
            onClick={() =>
              onSubmit({
                email,
                orgListsNames
              })
            }
          >
            Envoyer {type === "single" ? "l'invitation" : "les invitations"}
          </Button>
        </Flex>
      </form>
    </Box>
  );
};
