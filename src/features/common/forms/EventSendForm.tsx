import {
  Box,
  Tr,
  Td,
  Table,
  Tbody,
  CheckboxGroup,
  Spinner,
  Checkbox,
  useColorMode,
  Button,
  Flex,
  useToast,
  FormErrorMessage,
  FormControl,
  Radio,
  RadioGroup,
  Stack,
  Alert,
  AlertIcon,
  Heading
} from "@chakra-ui/react";
import { EmailIcon } from "@chakra-ui/icons";
import { ErrorMessage } from "@hookform/error-message";
import { Session } from "next-auth";
import React, { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { EmailControl, EntityButton, ErrorMessageText } from "features/common";
import { usePostEventNotifMutation } from "features/events/eventsApi";
import { IEvent } from "models/Event";
import { SubscriptionTypes } from "models/Subscription";
import { hasItems } from "utils/array";
import { getSubscriptions } from "models/Org";
import { handleError } from "utils/form";

export const EventSendForm = ({
  event,
  eventQuery,
  session,
  onCancel,
  ...props
}: {
  event: IEvent<any>;
  eventQuery: any;
  session: Session;
  onCancel: () => void;
  onSubmit?: () => void;
}) => {
  const toast = useToast({ position: "top" });
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  //#region event
  const [postEventNotif, q] = usePostEventNotifMutation();
  //#endregion

  //#region local state
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState<"multi" | "single">();
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

  const onSubmit = async (form: {
    email?: string;
    orgListsNames: string[];
  }) => {
    console.log("submitted", form);
    setIsLoading(true);

    let payload = {
      ...form
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

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <RadioGroup name="type" my={3}>
        <Stack spacing={2}>
          <Radio
            isChecked={type === "multi"}
            onChange={() => {
              setType("multi");
            }}
          >
            Envoyer l'invitation à une ou plusieurs listes de diffusion des
            organisateurs de <EntityButton event={event} p={1} />
          </Radio>
          <Radio
            isChecked={type === "single"}
            onChange={() => {
              setType("single");
            }}
          >
            Envoyer l'invitation à une seule adresse e-mail
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
            <Table bg={isDark ? "gray.500" : "orange.100"} borderRadius="lg">
              <Tbody>
                {eventQuery.isLoading || eventQuery.isFetching ? (
                  <Tr>
                    <Td colSpan={2}>
                      <Spinner />
                    </Td>
                  </Tr>
                ) : (
                  event.eventOrgs.map((org) => {
                    const lists = (org.orgLists || []).concat([
                      {
                        listName: "Liste des abonnés",
                        subscriptions: getSubscriptions(
                          org,
                          SubscriptionTypes.FOLLOWER
                        )
                      },
                      {
                        listName: "Liste des adhérents",
                        subscriptions: getSubscriptions(
                          org,
                          SubscriptionTypes.SUBSCRIBER
                        )
                      }
                    ]);

                    return (
                      <Fragment key={org._id}>
                        <Tr>
                          <Td colSpan={2}>
                            <Heading
                              display="flex"
                              alignItems="center"
                              size="sm"
                            >
                              Listes de diffusion de l'organisateur
                              <EntityButton org={org} ml={2} />
                            </Heading>
                          </Td>
                        </Tr>

                        {lists.map((orgList) => {
                          let i = 0;
                          for (const subscription of orgList.subscriptions) {
                            if (
                              event.eventNotified?.find(({ email, phone }) => {
                                return (
                                  email === subscription.email ||
                                  phone === subscription.phone
                                );
                              })
                            )
                              continue;

                            i++;
                          }
                          const s = i !== 1 ? "s" : "";

                          return (
                            <Tr key={orgList.listName}>
                              <Td>
                                <Checkbox
                                  name="orgListsNames"
                                  ref={register({
                                    required:
                                      "Veuillez sélectionner une liste au minimum"
                                  })}
                                  value={orgList.listName + "." + org._id}
                                  icon={<EmailIcon />}
                                >
                                  {orgList.listName}
                                </Checkbox>
                              </Td>
                              <Td>
                                {i} membre{s} n'{s ? "ont" : "a"} pas été invité
                              </Td>
                            </Tr>
                          );
                        })}
                      </Fragment>
                    );
                  })
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

      {(type === "multi" || type === "single") && (
        <Flex justifyContent="space-between" mt={3}>
          <Button onClick={onCancel}>Annuler</Button>
          <Button colorScheme="green" type="submit" isLoading={isLoading}>
            Envoyer {type === "single" ? "l'invitation" : "les invitations"}
          </Button>
        </Flex>
      )}
    </form>
  );
};
