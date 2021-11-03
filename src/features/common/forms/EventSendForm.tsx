import {
  Alert,
  Tr,
  Td,
  Table,
  Tbody,
  Tag,
  CheckboxGroup,
  Spinner,
  Checkbox,
  useColorMode,
  Button,
  Flex,
  useToast,
  FormErrorMessage,
  FormControl
} from "@chakra-ui/react";
import { EmailIcon } from "@chakra-ui/icons";
import { ErrorMessage } from "@hookform/error-message";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { EmailControl } from "features/common";
import { usePostEventNotifMutation } from "features/events/eventsApi";
import { IEvent, StatusTypes } from "models/Event";
import { SubscriptionTypes } from "models/Subscription";
import { hasItems } from "utils/array";
import { Session } from "next-auth";
import { orgTypeFull4 } from "models/Org";

export const EventSendForm = ({
  event,
  eventQuery,
  session,
  ...props
}: {
  event: IEvent;
  eventQuery: any;
  session: Session;
  onSubmit: () => void;
}) => {
  const toast = useToast({ position: "top" });
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  console.log(event);

  //#region event
  const [postEventNotif, q] = usePostEventNotifMutation();
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

  const onSubmit = async (form: { email?: string; orgIds: any }) => {
    console.log("submitted", form);
    setIsLoading(true);

    let payload = {
      ...form,
      orgIds:
        typeof form.orgIds === "boolean"
          ? []
          : typeof form.orgIds === "string"
          ? [form.orgIds]
          : form.orgIds
    };

    try {
      const res = await postEventNotif({
        eventUrl: event.eventUrl,
        payload
      }).unwrap();

      if (hasItems(res.emailList)) {
        eventQuery.refetch();
        const s = res.emailList.length > 1 ? "s" : "";

        toast({
          title: `Une invitation a été envoyée à ${
            form.email ? form.email : `${res.emailList.length} abonné${s}`
          }`,
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
  };
  //#endregion

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Alert status="info" mt={3}>
        <Flex flexDirection="column">
          Pour envoyer un e-mail d'invitation aux abonnés des organisations de
          cet événément, cochez une ou plusieurs des cases correspondantes :
          <FormControl isInvalid={!!errors.orgIds}>
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
                      const followerSubscriptions = org.orgSubscriptions.filter(
                        (subscription) => {
                          return subscription.orgs.find((orgSubscription) => {
                            return (
                              orgSubscription.orgId === org._id &&
                              orgSubscription.type ===
                                SubscriptionTypes.FOLLOWER
                            );
                          });
                        }
                      );
                      const followerSubscriptionsCount =
                        followerSubscriptions.length;
                      const s = followerSubscriptionsCount > 1 ? "s" : "";

                      const notifiedCount = event.eventNotified?.filter(
                        ({ email, status }) =>
                          status === StatusTypes.OK &&
                          followerSubscriptions.find((followerSubscription) =>
                            typeof followerSubscription.user === "object"
                              ? followerSubscription.user.email === email
                              : followerSubscription.email === email
                          )
                      ).length;

                      return (
                        <Tr key={org.orgName} mb={1}>
                          <Td>
                            <Checkbox
                              icon={<EmailIcon />}
                              name="orgIds"
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
                              {!followerSubscriptionsCount
                                ? `Personne n'est abonné à ${orgTypeFull4(
                                    org.orgType
                                  )}`
                                : `${notifiedCount}/${followerSubscriptionsCount} abonné${s} invité${s}`}
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
              <ErrorMessage errors={errors} name="orgIds" />
            </FormErrorMessage>
          </FormControl>
          <EmailControl
            name="email"
            label="(facultatif) envoyer l'invitation seulement à l'adresse e-mail de votre choix :"
            control={control}
            register={register}
            setValue={setValue}
            errors={errors}
            placeholder="Envoyer à cette adresse e-mail uniquement"
            mt={3}
            isMultiple={false}
          />
          <Flex justifyContent="flex-end" mt={3}>
            <Button colorScheme="green" type="submit" isLoading={isLoading}>
              Envoyer {!!getValues("email") ? "une invitation" : ""}
            </Button>
          </Flex>
        </Flex>
      </Alert>
    </form>
  );
};
