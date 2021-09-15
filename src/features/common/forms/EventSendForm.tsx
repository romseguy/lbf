import React, { useState } from "react";
import {
  Box,
  Alert,
  AlertIcon,
  Tr,
  Td,
  Table,
  Tbody,
  Tag,
  CheckboxGroup,
  Spinner,
  Checkbox,
  useColorMode,
  FormLabel,
  Button,
  Flex,
  useToast,
  FormErrorMessage,
  FormControl
} from "@chakra-ui/react";
import { EmailIcon } from "@chakra-ui/icons";
import { SubscriptionTypes } from "models/Subscription";
import { IEvent } from "models/Event";
import { useForm } from "react-hook-form";
import { useEditEventMutation } from "features/events/eventsApi";
import { ErrorMessage } from "@hookform/error-message";

export const EventSendForm = ({
  event,
  eventQuery,
  ...props
}: {
  event: IEvent;
  eventQuery: any;
  onSubmit: () => void;
}) => {
  const toast = useToast({ position: "top" });
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  //#region event
  const [editEvent, q] = useEditEventMutation();
  const notifiedCount = Array.isArray(event.eventNotified)
    ? event.eventNotified.length
    : 0;
  //#endregion
  //#region local state
  const [isLoading, setIsLoading] = useState(false);

  //#endregion

  //#region form state
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
  //#endregion

  return (
    <form
      onSubmit={handleSubmit(async (form) => {
        console.log("submitted", form);
        setIsLoading(true);

        let payload = {
          eventNotif:
            typeof form.eventNotif === "boolean"
              ? []
              : typeof form.eventNotif === "string"
              ? [form.eventNotif]
              : form.eventNotif
        };

        try {
          const res = await editEvent({
            eventUrl: event.eventUrl,
            payload
          }).unwrap();
          if (Array.isArray(res.emailList) && res.emailList.length > 0) {
            eventQuery.refetch();
            toast({
              title: `Une invitation a été envoyée à ${
                res.emailList.length
              } abonné${res.emailList.length > 1 ? "s" : ""}`,
              status: "success",
              isClosable: true
            });
          } else {
            toast({
              title: "Aucune invitation envoyée",
              status: "warning",
              isClosable: true
            });
          }
          props.onSubmit && props.onSubmit();
        } catch (error) {
          console.error(error);
          toast({
            title: "Une erreur est survenue",
            status: "error",
            isClosable: true
          });
        } finally {
          setIsLoading(false);
        }
      })}
    >
      <Alert status="info" mt={3}>
        <Flex flexDirection="column">
          Pour envoyer un e-mail d'invitation aux abonnés des organisations de
          cet événément, cochez une ou plusieurs des cases correspondantes :
          <FormControl isInvalid={!!errors.eventNotif}>
            <CheckboxGroup>
              <Table
                backgroundColor={isDark ? "whiteAlpha.100" : "blackAlpha.100"}
                borderWidth="1px"
                borderRadius="lg"
                mt={2}
              >
                <Tbody>
                  {eventQuery.isLoading || eventQuery.isFetching ? (
                    <Tr>
                      <Td colSpan={3}>
                        <Spinner />
                      </Td>
                    </Tr>
                  ) : (
                    event.eventOrgs.map((org) => {
                      const orgFollowersCount = org.orgSubscriptions
                        .map((subscription) => {
                          return subscription.orgs.filter((orgSubscription) => {
                            return (
                              orgSubscription.orgId === org._id &&
                              orgSubscription.type ===
                                SubscriptionTypes.FOLLOWER
                            );
                          }).length;
                        })
                        .reduce((a, b) => a + b, 0);

                      const canSendCount = orgFollowersCount - notifiedCount;

                      return (
                        <Tr key={org.orgName} mb={1}>
                          <Td>
                            <Checkbox
                              icon={<EmailIcon />}
                              name="eventNotif"
                              ref={register({
                                required:
                                  "Veuillez sélectionner une organisation au minimum"
                              })}
                              value={org._id}
                            >
                              {org.orgName}
                            </Checkbox>
                          </Td>
                          <Td textAlign="right">
                            <Tag fontSize="smaller">
                              {canSendCount} abonnés n'ont pas encore reçu
                              d'invitation
                            </Tag>
                          </Td>
                        </Tr>
                      );
                    })
                  )}
                </Tbody>
              </Table>
            </CheckboxGroup>
            <FormErrorMessage>
              <ErrorMessage errors={errors} name="eventNotif" />
            </FormErrorMessage>
          </FormControl>
          <Flex justifyContent="flex-end" mt={3}>
            <Button colorScheme="green" type="submit" isLoading={isLoading}>
              Envoyer
            </Button>
          </Flex>
        </Flex>
      </Alert>
    </form>
  );
};
