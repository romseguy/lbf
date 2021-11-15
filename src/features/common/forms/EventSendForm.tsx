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
import { EmailIcon, HamburgerIcon } from "@chakra-ui/icons";
import { ErrorMessage } from "@hookform/error-message";
import { Session } from "next-auth";
import React, { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { EmailControl, EntityButton, ErrorMessageText } from "features/common";
import { usePostEventNotifMutation } from "features/events/eventsApi";
import { IEvent } from "models/Event";
import { SubscriptionTypes } from "models/Subscription";
import { hasItems } from "utils/array";
import { getSubscriptions, orgTypeFull } from "models/Org";
import { handleError } from "utils/form";
import { equalsValue } from "utils/string";

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
  onCancel?: () => void;
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
  const email = watch("email");
  const orgListsNames = watch("orgListsNames");

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
    <Box
      bg={isDark ? "gray.500" : "orange.100"}
      borderRadius="lg"
      pt={1}
      pb={3}
      px={3}
      mt={3}
    >
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
              organisateurs de{" "}
              <EntityButton event={event} p={1} onClick={null} />
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
                          listName: "Abonnés",
                          subscriptions: getSubscriptions(
                            org,
                            SubscriptionTypes.FOLLOWER
                          )
                        },
                        {
                          listName: "Adhérents",
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
                              <Flex alignItems="center">
                                <HamburgerIcon mr={2} />
                                <Heading
                                  display="flex"
                                  alignItems="center"
                                  size="sm"
                                >
                                  Listes de diffusion {orgTypeFull(org.orgType)}
                                  <EntityButton org={org} ml={2} />
                                </Heading>
                              </Flex>
                            </Td>
                          </Tr>

                          {lists.map((list) => {
                            let i = 0;
                            for (const subscription of list.subscriptions ||
                              []) {
                              if (
                                event.eventNotified?.find(({ email, phone }) =>
                                  typeof subscription.user === "object"
                                    ? equalsValue(
                                        subscription.user.email,
                                        email
                                      ) ||
                                      equalsValue(
                                        subscription.user.phone,
                                        phone
                                      )
                                    : equalsValue(email, subscription.email) ||
                                      equalsValue(phone, subscription.phone)
                                )
                              )
                                continue;

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

        <Flex justifyContent="space-between" mt={3}>
          {onCancel && <Button onClick={onCancel}>Annuler</Button>}

          <Button
            colorScheme="green"
            type="submit"
            isLoading={isLoading}
            isDisabled={
              Object.keys(errors).length > 0 ||
              (type === "single" && !email) ||
              (type === "multi" && !hasItems(orgListsNames))
            }
          >
            Envoyer {type === "single" ? "l'invitation" : "les invitations"}
          </Button>
        </Flex>
      </form>
    </Box>
  );
};
