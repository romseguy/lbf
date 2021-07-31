import type { IEvent } from "models/Event";
import type { IOrg } from "models/Org";
import {
  BrowserView,
  MobileView,
  isBrowser,
  isMobile
} from "react-device-detect";
import React, { forwardRef, Ref, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import ReactSelect from "react-select";
import { ErrorMessage } from "@hookform/error-message";
import {
  ChakraProps,
  Input,
  Button,
  FormControl,
  FormLabel,
  Box,
  Stack,
  FormErrorMessage,
  Textarea,
  useToast,
  Spinner,
  Text,
  Select,
  Checkbox,
  Flex,
  CheckboxGroup,
  useColorMode
} from "@chakra-ui/react";
import { EmailIcon, TimeIcon, WarningIcon } from "@chakra-ui/icons";
import {
  AddressControl,
  DatePicker,
  EmailControl,
  ErrorMessageText,
  RTEditor
} from "features/common";
import {
  useAddEventMutation,
  useEditEventMutation
} from "features/events/eventsApi";
import { useSession } from "hooks/useAuth";
import { handleError } from "utils/form";
import {
  addDays,
  addHours,
  addMinutes,
  addWeeks,
  getDay,
  getHours,
  intervalToDuration,
  isToday,
  parseISO,
  setHours,
  setMinutes,
  subHours
} from "date-fns";
import { getDetails } from "use-places-autocomplete";
import { useGetOrgsByCreatorQuery } from "features/orgs/orgsApi";
import tw, { css } from "twin.macro";
import { useEffect } from "react";

interface EventFormProps extends ChakraProps {
  event?: IEvent;
  initialEventOrgs?: IOrg[];
  onClose?: () => void;
  onCancel?: () => void;
  onSubmit?: (eventName: string) => void;
}

const repeatOptions: number[] = [];
for (let i = 1; i <= 10; i++) {
  repeatOptions[i] = i;
}

export const EventForm = ({
  initialEventOrgs = [],
  ...props
}: EventFormProps) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const defaultEventOrgs = props.event?.eventOrgs || initialEventOrgs;
  const [addEvent, addEventMutation] = useAddEventMutation();
  const [editEvent, editEventMutation] = useEditEventMutation();
  const toast = useToast({ position: "top" });

  const { orgs, refetch } = useGetOrgsByCreatorQuery(session?.user.userId, {
    selectFromResult: ({ data }) => {
      return { orgs: data };
    }
  });

  const {
    control,
    register,
    handleSubmit,
    errors,
    setError,
    clearErrors,
    watch,
    setValue,
    getValues
  } = useForm({
    mode: "onChange"
  });

  const eventNotif = watch("eventNotif");
  let eventOrgs = getValues("eventOrgs") || defaultEventOrgs;
  eventOrgs = eventOrgs.filter(
    (org: IOrg) =>
      Array.isArray(org.orgEmailList) && org.orgEmailList.length > 0
  );
  watch("eventOrgs");

  const now = new Date();
  // const now = setMinutes(setHours(new Date(), 23), 0);
  //const tomorrow = addDays(now, 1);

  let eventMinDefaultDate = null;
  let eventMaxDefaultDate = null;
  const eventMinDate = watch("eventMinDate");
  const eventMaxDate = watch("eventMaxDate");
  const eventMinDuration = 1;
  const start = eventMinDate || eventMinDefaultDate;
  const end = eventMaxDate || eventMaxDefaultDate;
  let canRepeat = false;
  const highlightDatesStart: Date[] = [];
  const highlightDatesEnd: Date[] = [];

  if (start && end) {
    const duration = intervalToDuration({
      start,
      end
    });
    canRepeat = duration && duration.days !== undefined && duration.days < 7;
    for (let i = 1; i <= 10; i++) {
      highlightDatesStart[i] = addWeeks(start, i);
      highlightDatesEnd[i] = addWeeks(end, i);
    }
  }

  useEffect(() => {
    if (eventMinDate && getHours(eventMinDate) !== 0 && !eventMaxDate) {
      setValue("eventMaxDate", addHours(eventMinDate, eventMinDuration));
      clearErrors("eventMaxDate");
    } else if (
      eventMinDate === undefined &&
      getHours(addHours(eventMinDate, 2)) === 1
    ) {
      setValue("eventMinDate", addHours(now, 12));
    }
  }, [eventMinDate]);

  useEffect(() => {
    if (eventNotif === false) {
      setValue("eventNotif", []);
    }
  }, [eventNotif]);

  if (props.event) {
    eventMinDefaultDate = parseISO(props.event.eventMinDate);
    eventMaxDefaultDate = parseISO(props.event.eventMaxDate);
  }

  const eventMinDateProps = {
    minDate: now,
    maxDate: end
  };

  const eventMaxDateProps: { minDate: Date | null } = {
    minDate: eventMinDate
      ? addHours(eventMinDate, eventMinDuration)
      : eventMinDefaultDate
      ? addHours(eventMinDefaultDate, eventMinDuration)
      : addHours(now, eventMinDuration)
  };

  const onChange = () => {
    clearErrors("formErrorMessage");
  };

  const onSubmit = async (form: IEvent) => {
    console.log("submitted", form);
    const payload = {
      ...form,
      eventNotif:
        typeof form.eventNotif === "boolean"
          ? []
          : typeof form.eventNotif === "string"
          ? [form.eventNotif]
          : form.eventNotif
    };

    try {
      if (props.event) {
        if (!form.eventNotif) {
          payload.eventNotif = [];
        }

        await editEvent({ payload, eventName: props.event.eventName }).unwrap();

        toast({
          title: "Votre événement a bien été modifié !",
          status: "success",
          isClosable: true
        });
      } else {
        await addEvent({
          ...payload,
          eventName: form.eventName,
          createdBy: session.user.userId
        }).unwrap();

        toast({
          title: "Votre événement a bien été ajouté !",
          status: "success",
          isClosable: true
        });
      }

      props.onSubmit && props.onSubmit(payload.eventName);
      props.onClose && props.onClose();
    } catch (error) {
      handleError(error, (message, field) => {
        if (field) {
          setError(field, { type: "manual", message });
        } else {
          setError("formErrorMessage", { type: "manual", message });
        }
      });
    }
  };

  const renderCustomInput = (label: string) => {
    const ExampleCustomInput = forwardRef(
      (
        { value, onClick }: { value?: string; onClick?: () => void },
        ref: Ref<HTMLButtonElement>
      ) => {
        let cursor = "pointer";
        let isDisabled = false;

        // if (
        //   label === "repeat" &&
        //   (!eventMinDate || !eventMaxDate)
        // ) {
        //   cursor = "not-allowed";
        //   isDisabled = true;
        // }

        return (
          <Button
            aria-label={label}
            onClick={onClick}
            ref={ref}
            isDisabled={isDisabled}
          >
            {value ? value : <TimeIcon cursor={cursor} />}
          </Button>
        );
      }
    );
    return <ExampleCustomInput />;
  };

  return (
    <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
      <ErrorMessage
        errors={errors}
        name="formErrorMessage"
        render={({ message }) => (
          <Stack isInline p={5} mb={5} shadow="md" color="red.500">
            <WarningIcon boxSize={5} />
            <Box>
              <ErrorMessageText>{message}</ErrorMessageText>
            </Box>
          </Stack>
        )}
      />

      <FormControl
        id="eventName"
        isRequired
        isInvalid={!!errors["eventName"]}
        mb={3}
      >
        <FormLabel>Nom de l'événement</FormLabel>
        <Input
          name="eventName"
          placeholder="Cliquez ici pour saisir le nom..."
          ref={register({
            required: "Veuillez saisir un nom d'événement",
            pattern: {
              value: /^[a-z0-9 ]+$/i,
              message:
                "Veuillez saisir un nom composé de lettres et de chiffres uniquement"
            }
          })}
          defaultValue={props.event && props.event.eventName}
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="eventName" />
        </FormErrorMessage>
      </FormControl>

      <FormControl
        id="eventMinDate"
        isRequired
        isInvalid={!!errors["eventMinDate"]}
        mb={3}
      >
        <FormLabel>Date de début</FormLabel>
        <Controller
          name="eventMinDate"
          control={control}
          defaultValue={eventMinDefaultDate}
          rules={{ required: "Veuillez saisir une date" }}
          render={(props) => {
            return (
              <DatePicker
                withPortal={isMobile ? true : false}
                customInput={renderCustomInput("minDate")}
                selected={props.value}
                onChange={(e) => {
                  clearErrors("eventMinDate");
                  props.onChange(e);
                }}
                showTimeSelect
                timeFormat="p"
                timeIntervals={60}
                onCalendarClose={() => {
                  if (eventMinDate) {
                    setValue(
                      "eventMaxDate",
                      addHours(eventMinDate, eventMinDuration)
                    );
                  }
                }}
                filterTime={(time) => {
                  if (end) {
                    if (
                      time.getTime() <=
                        subHours(end, eventMinDuration).getTime() &&
                      time.getTime() > addHours(now, eventMinDuration).getTime()
                    ) {
                      // console.log(
                      //   "allowing",
                      //   getHours(time),
                      //   getHours(subHours(end, eventMinDuration))
                      // );
                      return true;
                    }
                  } else if (getDay(time) === getDay(now)) {
                    if (
                      time.getTime() >=
                      addHours(now, eventMinDuration).getTime()
                    )
                      return true;
                  } else {
                    return true;
                  }

                  return false;
                }}
                dateFormat="Pp"
                {...eventMinDateProps}
              />
            );
          }}
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="eventMinDate" />
        </FormErrorMessage>
      </FormControl>

      <FormControl
        id="eventMaxDate"
        isRequired
        isInvalid={!!errors["eventMaxDate"]}
        // isDisabled={!eventMinDate}
        mb={3}
      >
        <FormLabel>Date de fin</FormLabel>
        <Controller
          name="eventMaxDate"
          control={control}
          defaultValue={eventMaxDefaultDate}
          rules={{ required: "Veuillez saisir une date" }}
          render={({ onChange, value }) => {
            return (
              <DatePicker
                // disabled={!eventMinDate}
                withPortal={isMobile ? true : false}
                customInput={renderCustomInput("maxDate")}
                selected={value}
                onChange={onChange}
                showTimeSelect
                timeFormat="p"
                timeIntervals={60}
                filterTime={(time) => {
                  if (start) {
                    if (
                      getHours(time) >=
                        getHours(addHours(start, eventMinDuration)) ||
                      getDay(time) !== getDay(start)
                    ) {
                      // console.log(
                      //   "allowing",
                      //   getHours(time),
                      //   getHours(addHours(start, eventMinDuration))
                      // );
                      return true;
                    }
                  } else if (
                    time.getTime() >
                    addHours(now, eventMinDuration + eventMinDuration).getTime()
                  ) {
                    // console.log(
                    //   "allowing",
                    //   getHours(time),
                    //   getHours(addHours(now, 2))
                    // );

                    return true;
                  }

                  return false;
                }}
                dateFormat="Pp"
                highlightDates={highlightDatesStart}
                {...eventMaxDateProps}
              />
            );
          }}
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="eventMaxDate" />
        </FormErrorMessage>
      </FormControl>

      {canRepeat && (
        <FormControl
          id="repeat"
          isInvalid={!!errors["repeat"]}
          // isDisabled={!eventMinDate || !eventMaxDate}
          mb={3}
        >
          <FormLabel>Répéter</FormLabel>

          <Select
            name="repeat"
            ref={register()}
            placeholder="-"
            css={css`
              ${isDark
                ? `
                color: white;
              `
                : `
                color: black;
              `}
            `}
          >
            {repeatOptions.map((i) => (
              <option key={`${i}w`} value={i}>
                {i > 1
                  ? `Répéter les ${i} prochaines semaines`
                  : `Répéter la semaine prochaine`}
              </option>
            ))}
          </Select>

          <FormErrorMessage>
            <ErrorMessage errors={errors} name="repeat" />
          </FormErrorMessage>
        </FormControl>
      )}

      <AddressControl
        name="eventAddress"
        isRequired
        defaultValue={props.event?.eventAddress || ""}
        errors={errors}
        control={control}
        mb={3}
        onSuggestionSelect={(suggestion) => {
          setIsLoading(true);

          getDetails({
            placeId: suggestion.place_id,
            fields: ["address_component"]
          })
            .then((details: any) => {
              details.address_components.forEach((component: any) => {
                const types = component.types;
                if (types.indexOf("locality") > -1) {
                  const city = component.long_name;

                  setValue("eventCity", city);
                  setIsLoading(false);
                }
              });
            })
            .catch((error) => {
              // TODO
              console.error(error);
              setIsLoading(false);
            });
        }}
      />

      <Input
        name="eventCity"
        ref={register()}
        defaultValue={props.event?.eventCity}
        display="none"
      />

      <EmailControl
        name="eventEmail"
        defaultValue={props.event?.eventEmail}
        errors={errors}
        register={register}
        mb={3}
      />

      <FormControl
        id="eventDescription"
        isInvalid={!!errors["eventDescription"]}
        mb={3}
      >
        <FormLabel>Description</FormLabel>
        <Controller
          name="eventDescription"
          control={control}
          defaultValue={props.event?.eventDescription || ""}
          render={(p) => {
            return (
              <RTEditor
                defaultValue={props.event?.eventDescription}
                onChange={(html: string) => {
                  p.onChange(html === "<p><br></p>" ? "" : html);
                }}
                placeholder="Insérez l'affiche de l'événement, une vidéo, etc"
              />
            );
          }}
        />

        <FormErrorMessage>
          <ErrorMessage errors={errors} name="eventDescription" />
        </FormErrorMessage>
      </FormControl>

      <FormControl mb={3} id="eventOrgs" isInvalid={!!errors["eventOrgs"]}>
        <FormLabel>Organisateurs</FormLabel>
        <Controller
          name="eventOrgs"
          className="react-select-container"
          classNamePrefix="react-select"
          as={ReactSelect}
          control={control}
          defaultValue={defaultEventOrgs}
          placeholder="Sélectionner..."
          menuPlacement="top"
          isClearable
          isMulti
          isSearchable
          closeMenuOnSelect
          styles={{
            placeholder: () => {
              return {
                color: "#A0AEC0"
              };
            },
            control: (defaultStyles: any) => {
              return {
                ...defaultStyles,
                borderColor: "#e2e8f0",
                paddingLeft: "8px"
              };
            }
          }}
          options={orgs}
          getOptionLabel={(option: IOrg) => `${option.orgName}`}
          getOptionValue={(option: IOrg) => option._id}
          onChange={([option]: [option: IOrg]) => option._id}
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="eventOrgs" />
        </FormErrorMessage>
      </FormControl>

      {props.event &&
        props.event.isApproved &&
        Array.isArray(eventOrgs) &&
        eventOrgs.length > 0 && (
          <FormControl id="eventNotif" mb={3}>
            <FormLabel>
              Envoyer un e-mail d'invitation aux abonné(e)s des organisations
              suivantes :
            </FormLabel>
            <CheckboxGroup>
              {eventOrgs.map((org: IOrg) => {
                return (
                  <Flex direction="row" key={org.orgName}>
                    <Checkbox
                      icon={<EmailIcon />}
                      name="eventNotif"
                      ref={register()}
                      mb={3}
                      mr={3}
                      value={org._id}
                    >
                      {org.orgName}
                    </Checkbox>
                  </Flex>
                );
              })}
            </CheckboxGroup>

            <FormErrorMessage>
              <ErrorMessage errors={errors} name="eventNotif" />
            </FormErrorMessage>
          </FormControl>
        )}

      <Flex justifyContent="space-between">
        <Button onClick={() => props.onCancel && props.onCancel()}>
          Annuler
        </Button>

        <Button
          colorScheme="green"
          type="submit"
          isLoading={
            isLoading ||
            addEventMutation.isLoading ||
            editEventMutation.isLoading
          }
          isDisabled={Object.keys(errors).length > 0}
          data-cy="eventFormSubmit"
        >
          {props.event ? "Modifier" : "Ajouter"}
        </Button>
      </Flex>
    </form>
  );
};

// let eventMinDefaultDate = setMinutes(addHours(tomorrow, 1), 0);
// let eventMaxDefaultDate = setMinutes(addHours(eventMinDefaultDate, 1), 0);

// let isEventMaxDateTomorrow = false;

// eventMaxDateProps.minDate = addHours(eventMinDate, 2);
// eventMaxDefaultDate = addHours(eventMinDate, 2);

// selected min date is close to midnight
// if (getHours(addHours(eventMinDate, 2)) === 1) {
//   console.log("midnight");

// isEventMaxDateTomorrow = true;
// } else {
//   eventMaxDateProps.minDate = addHours(eventMinDate, 2);
// }
