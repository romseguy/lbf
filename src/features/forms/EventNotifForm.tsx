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
  FormLabel,
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
import { getHours } from "date-fns";
import React, { Fragment, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  DatePicker,
  EmailControl,
  EntityButton,
  ErrorMessageText,
  renderCustomInput
} from "features/common";
//import { useAddEventNotifMutation } from "features/api/eventsApi";
import { formBoxProps } from "features/layout/theme";
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
import { useSelector } from "react-redux";
import { selectIsMobile } from "store/uiSlice";

type FormData = {
  email?: string;
  triggerDate: Date | null;
  orgListsNames: string[];
};

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
  const isMobile = useSelector(selectIsMobile);
  const now = new Date();
  const triggerDatePickerProps = {
    minDate: now,
    // maxDate: end && compareDesc(end, now) === 1 ? undefined : end,
    dateFormat: "Pp",
    showTimeSelect: true,
    timeFormat: "p",
    timeIntervals: 15,
    filterTime: (date: Date) => {
      if (getHours(date) <= getHours(now)) {
        //console.log("filtering out", date);
        return false;
      }

      //console.log("allowing", date);
      return true;
    }
  };

  //#region event
  //@ts-expect-error
  const [addEventNotif] = useAddEventNotifMutation();
  //#endregion

  //#region local state
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState<"multi" | "single">();
  //#endregion

  //#region form
  const defaultValues = {
    triggerDate: null
  };
  const { control, register, handleSubmit, errors, setError, setValue } =
    useForm<FormData>({
      defaultValues,
      mode: "onChange"
    });
  const email = useWatch<Pick<FormData, "email">>({ control, name: "email" });
  const orgListsNames = useWatch<Pick<FormData, "orgListsNames">>({
    control,
    name: "orgListsNames"
  });
  // const triggerDate = useWatch<Pick<FormData, "triggerDate">>({
  //   control,
  //   name: "triggerDate"
  // });
  // console.log(
  //   "🚀 ~ file: EventNotifForm.tsx:117 ~ triggerDate:",
  //   triggerDate
  // );

  //#region form handlers
  const onChange = () => {};

  const onSubmit = async (form: FormData) => {
    console.log("submitted", form);

    if (form.triggerDate) {
      toast({
        title: "L'envoi différé n'est pas encore disponible",
        status: "error"
      });
      return;
    }

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
      p={3}
      mt={3}
      {...props}
    >
      <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
        <Box {...formBoxProps(isDark)}>
          <FormControl>
            <FormLabel>
              À souhaitez-vous envoyer l'invitation à cet événement ?
              {/* <EntityButton event={event} p={1} onClick={null} /> */}
            </FormLabel>
            <RadioGroup name="type" my={3}>
              <Stack spacing={3}>
                <Radio
                  isChecked={type === "multi"}
                  onChange={() => {
                    setType("multi");
                  }}
                >
                  À une ou plusieurs listes de{" "}
                  {orgTypeFull(event.eventOrgs[0].orgType)}
                  <EntityButton org={event.eventOrgs[0]} ml={2} />
                </Radio>
                <Radio
                  isChecked={type === "single"}
                  onChange={() => {
                    setType("single");
                  }}
                >
                  À une adresse e-mail
                </Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
        </Box>

        {type === "single" && (
          <Box {...formBoxProps(isDark)}>
            <EmailControl
              name="email"
              //noLabel
              control={control}
              register={register}
              setValue={setValue}
              errors={errors}
              //placeholder="Envoyer à cette adresse e-mail uniquement"
              mb={5}
              isMultiple={false}
              isRequired
            />

            <FormControl
              //ref={refs.triggerDate}
              isInvalid={!!errors["triggerDate"]}
              //mb={3}
            >
              <FormLabel>Date d'envoi (optionnel)</FormLabel>
              <Controller
                name="triggerDate"
                control={control}
                render={(props) => {
                  return (
                    <DatePicker
                      withPortal={isMobile}
                      customInput={renderCustomInput({
                        label: "minDate"
                      })}
                      selected={props.value}
                      onChange={(e) => {
                        //clearErrors("triggerDate");
                        props.onChange(e);
                      }}
                      {...triggerDatePickerProps}
                    />
                  );
                }}
              />
              <FormErrorMessage>
                <ErrorMessage errors={errors} name="triggerDate" />
              </FormErrorMessage>
            </FormControl>
          </Box>
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
                                    icon={<EmailIcon />}
                                    isDisabled={list.subscriptions.length === 0}
                                    value={list.listName + "." + org._id}
                                  >
                                    {list.listName}
                                  </Checkbox>
                                </Td>
                                <Td>
                                  {!list.subscriptions.length ? (
                                    `Vous n'avez ajouté aucun membres à cette liste`
                                  ) : (
                                    <>
                                      {i} membre{s} n'{s ? "ont" : "a"} pas
                                      encore été invité
                                    </>
                                  )}
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
                      L'événement n'est organisé par aucun atelier.
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
            type="submit"
            isDisabled={
              Object.keys(errors).length > 0 ||
              (type === "single" && !email) ||
              (type === "multi" && !hasItems(orgListsNames))
            }
            isLoading={isLoading}
          >
            Envoyer {type === "single" ? "l'invitation" : "les invitations"}
          </Button>
        </Flex>
      </form>
    </Box>
  );
};
