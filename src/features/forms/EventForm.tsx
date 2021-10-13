import {
  ChakraProps,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
  Select,
  Flex,
  useColorMode,
  Alert,
  AlertIcon,
  Tag,
  Tooltip,
  Checkbox,
  Box,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  PopoverCloseButton,
  PopoverHeader
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import {
  addHours,
  addWeeks,
  getDay,
  getHours,
  intervalToDuration,
  parseISO,
  setDay,
  subHours
} from "date-fns";
import { Session } from "next-auth";
import React, { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { Controller, useForm } from "react-hook-form";
import ReactSelect from "react-select";
import { css } from "twin.macro";
import usePlacesAutocomplete, { Suggestion } from "use-places-autocomplete";

import {
  AddressControl,
  DatePicker,
  EmailControl,
  ErrorMessageText,
  Link,
  renderCustomInput,
  RTEditor
} from "features/common";
import { UrlControl } from "features/common/forms/UrlControl";
import { PhoneControl } from "features/common/forms/PhoneControl";
import {
  useAddEventMutation,
  useEditEventMutation
} from "features/events/eventsApi";
import { withGoogleApi } from "features/map/GoogleApiWrapper";
import { useGetOrgsQuery } from "features/orgs/orgsApi";
import { Category, IEvent, VisibilityV } from "models/Event";
import type { IOrg } from "models/Org";
import { Visibility } from "models/Topic";
import { hasItems } from "utils/array";
import * as dateUtils from "utils/date";
import { handleError } from "utils/form";
import { unwrapSuggestion } from "utils/maps";
import { normalize } from "utils/string";

interface EventFormProps extends ChakraProps {
  session: Session;
  event?: IEvent;
  initialEventOrgs?: IOrg[];
  onCancel?: () => void;
  onSubmit?: (eventUrl: string) => void;
}

const repeatOptions: number[] = [];
for (let i = 1; i <= 10; i++) {
  repeatOptions[i] = i;
}

export const EventForm = withGoogleApi({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
})(({ initialEventOrgs = [], ...props }: EventFormProps) => {
  const toast = useToast({ position: "top" });
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  //#region event
  const [addEvent, addEventMutation] = useAddEventMutation();
  const [editEvent, editEventMutation] = useEditEventMutation();
  //#endregion

  //#region myOrgs
  const { data: myOrgs, isLoading: isQueryLoading } = useGetOrgsQuery({
    populate: "orgSubscriptions",
    createdBy: props.session.user.userId
  });
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
    getValues
  }: { [key: string]: any } = useForm({
    defaultValues: {
      eventEmail: props.event?.eventEmail,
      eventPhone: props.event?.eventPhone,
      eventWeb: props.event?.eventWeb
    },
    mode: "onChange"
  });

  watch(["eventAddress", "eventOrgs"]);
  const eventVisibility = watch("eventVisibility");

  const defaultEventOrgs = props.event?.eventOrgs || initialEventOrgs || [];
  const eventOrgs = getValues("eventOrgs") || defaultEventOrgs;
  const eventOrgsRules: { required: string | boolean } = {
    required:
      eventVisibility === Visibility.SUBSCRIBERS
        ? "Veuillez sélectionner une ou plusieurs organisations"
        : false
  };
  if (
    !errors.eventOrgs &&
    typeof eventOrgsRules.required === "string" &&
    Array.isArray(eventOrgs) &&
    !eventOrgs.length
  ) {
    setError("eventOrgs", {
      type: "manual",
      message: eventOrgsRules.required
    });
  }

  const visibilityOptions: string[] = eventOrgs
    ? [Visibility.PUBLIC, Visibility.SUBSCRIBERS]
    : [];
  //#endregion

  //#region local state
  const [isLoading, setIsLoading] = useState(false);
  const [isRepeat, setIsRepeat] = useState(hasItems(props.event?.otherDays));

  const [days, setDays] = useState<{
    [key: number]: {
      checked: boolean;
      isDisabled?: boolean;
      isOpen: boolean;
      startDate?: Date;
      endTime?: Date;
    };
  }>(
    dateUtils.days.reduce((obj, day, index) => {
      const otherDay = props.event?.otherDays?.find(
        ({ dayNumber }) => dayNumber === index
      );
      return {
        ...obj,
        [index]: {
          checked: !!otherDay,
          isOpen: false,
          startDate: otherDay?.startDate
            ? parseISO(otherDay.startDate)
            : undefined
        }
      };
    }, {})
  );

  const setDayState = (index: number, match = {}, nomatch = {}) => {
    return Object.keys(days).reduce(
      (obj, day, i) =>
        i === index
          ? {
              ...obj,
              [i]: {
                ...days[i],
                ...match
              }
            }
          : {
              ...obj,
              [i]: { ...days[i], ...nomatch }
            },
      {}
    );
  };

  const [suggestion, setSuggestion] = useState<Suggestion>();
  const {
    // ready,
    // value: autoCompleteValue,
    suggestions: { status, data },
    setValue: setAutoCompleteValue
    // clearSuggestions
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: {
        country: "fr"
      }
    },
    debounce: 300
  });
  const eventAddress = getValues("eventAddress") || props.event?.eventAddress;
  useEffect(() => {
    if (!suggestion) setAutoCompleteValue(eventAddress);
  }, [eventAddress]);
  //#endregion

  //#region event min and max dates
  const now = new Date();

  let eventMinDefaultDate =
    (props.event && parseISO(props.event.eventMinDate)) || null;
  let eventMaxDefaultDate =
    (props.event && parseISO(props.event.eventMaxDate)) || null;
  const eventMinDate = watch("eventMinDate");
  const eventMaxDate = watch("eventMaxDate");
  const eventMinDuration = 1;
  const start = eventMinDate || eventMinDefaultDate;
  const end = eventMaxDate || eventMaxDefaultDate;
  let canRepeat = false;
  let canRepeat1day = false;
  const highlightDatesStart: Date[] = [];
  const highlightDatesEnd: Date[] = [];

  if (start && end) {
    const duration = intervalToDuration({
      start,
      end
    });

    if (duration) {
      if (!duration.days) {
        let startDay: number = getDay(start);
        startDay = startDay === 0 ? 6 : startDay - 1;

        if (days[startDay] && !days[startDay].isDisabled) {
          setDays(setDayState(startDay, { checked: true, isDisabled: true }));
        }

        canRepeat = true;
        canRepeat1day = true;
      } else {
        if (duration.days < 7) canRepeat = true;
      }
    }

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
  //#endregion

  const onChange = () => {
    clearErrors("formErrorMessage");
  };

  const onSubmit = async (form: IEvent) => {
    console.log("submitted", form);
    setIsLoading(true);

    const eventEmail = form.eventEmail?.filter(({ email }) => email !== "");
    const eventPhone = form.eventPhone?.filter(({ phone }) => phone !== "");
    const eventWeb = form.eventWeb?.filter(({ url }) => url !== "");

    const otherDays: {
      dayNumber: number;
      startDate?: string;
    }[] = Object.keys(days)
      .filter((key) => {
        const day = days[parseInt(key)];
        return !day.isDisabled && day.checked;
      })
      .map((key) => {
        const dayNumber = parseInt(key);
        const day = days[dayNumber];
        if (day.startDate)
          return {
            dayNumber,
            startDate: days[dayNumber].startDate?.toISOString()
          };
        return { dayNumber };
      });

    let payload = {
      ...form,
      eventName: form.eventName.trim(),
      eventUrl: normalize(form.eventName),
      eventDescription:
        form.eventDescription === "<p><br></p>"
          ? ""
          : form.eventDescription?.replace(/\&nbsp;/g, " "),
      eventEmail:
        Array.isArray(eventEmail) && eventEmail.length > 0
          ? eventEmail
          : undefined,
      eventPhone:
        Array.isArray(eventPhone) && eventPhone.length > 0
          ? eventPhone
          : undefined,
      eventWeb:
        Array.isArray(eventWeb) && eventWeb.length > 0 ? eventWeb : undefined,
      otherDays
    };

    try {
      const sugg = suggestion || data[0];

      if (sugg) {
        const {
          lat: eventLat,
          lng: eventLng,
          city: eventCity
        } = await unwrapSuggestion(sugg);
        payload = { ...payload, eventLat, eventLng, eventCity };
      }

      console.log("payload", payload);

      if (props.event) {
        await editEvent({
          payload,
          eventUrl: props.event.eventUrl
        }).unwrap();

        toast({
          title: "Votre événement a bien été modifié !",
          status: "success",
          isClosable: true
        });
      } else {
        payload.createdBy = props.session.user.userId;
        const event = await addEvent(payload).unwrap();

        toast({
          title: "Votre événement a bien été ajouté !",
          status: "success",
          isClosable: true
        });
      }

      props.onSubmit && props.onSubmit(payload.eventUrl);
    } catch (error) {
      handleError(error, (message, field) => {
        if (field) {
          setError(field, { type: "manual", message });
        } else {
          setError("formErrorMessage", { type: "manual", message });
        }
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
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

      <FormControl
        id="eventName"
        isRequired
        isInvalid={!!errors["eventName"]}
        display="flex"
        flexDirection="column"
        mb={!props.event && getValues("eventName") ? 0 : 3}
      >
        <FormLabel>Nom de l'événement</FormLabel>
        <Input
          name="eventName"
          placeholder="Nom de l'événement"
          ref={register({
            required: "Veuillez saisir un nom d'événement"
            // pattern: {
            //   value: /^[A-zÀ-ú0-9 ]+$/i,
            //   message:
            //     "Veuillez saisir un nom composé de lettres et de chiffres uniquement"
            // }
          })}
          defaultValue={props.event && props.event.eventName}
        />
        {!props.event && getValues("eventName") && (
          <Tooltip label={`Adresse de la page de l'événement`}>
            <Tag mt={3} alignSelf="flex-end" cursor="help">
              {process.env.NEXT_PUBLIC_URL}/{normalize(getValues("eventName"))}
            </Tag>
          </Tooltip>
        )}
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="eventName" />
        </FormErrorMessage>
      </FormControl>

      <FormControl
        id="eventCategory"
        isInvalid={!!errors["eventCategory"]}
        onChange={async (e) => {
          clearErrors("eventOrgs");
        }}
        mb={3}
      >
        <FormLabel>Catégorie</FormLabel>
        <Select
          name="eventCategory"
          defaultValue={props.event ? props.event.eventCategory : undefined}
          ref={register()}
          placeholder="Catégorie de l'événement"
          color="gray.400"
        >
          {Object.keys(Category).map((key) => {
            const k = parseInt(key);
            return (
              <option key={key} value={key}>
                {Category[k].label}
              </option>
            );
          })}
        </Select>
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="eventCategory" />
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
                dateFormat="Pp"
                showTimeSelect
                timeFormat="p"
                timeIntervals={60}
                onChange={(e) => {
                  clearErrors("eventMinDate");
                  props.onChange(e);
                }}
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
          <Checkbox
            isChecked={isRepeat}
            onChange={(e) => setIsRepeat(e.target.checked)}
          >
            Autres jours
          </Checkbox>

          {isRepeat && (
            <Box mt={3}>
              {canRepeat1day &&
                dateUtils.days.map((label, index) => {
                  let selected = start;

                  const otherDay = props.event?.otherDays?.find(
                    ({ dayNumber, startDate }) =>
                      dayNumber === index && startDate
                  );

                  if (days[index].startDate) selected = days[index].startDate;
                  else if (otherDay?.startDate)
                    selected = parseISO(otherDay.startDate);

                  return (
                    <Popover
                      key={"day-" + index}
                      isOpen={!!days[index].isOpen}
                      onClose={() =>
                        setDays(setDayState(index, { isOpen: false }))
                      }
                    >
                      <PopoverTrigger>
                        <Link
                          variant="no-underline"
                          onClick={() => {
                            const day = days[index];

                            if (day.isDisabled) return;

                            if (day.checked && !day.isOpen) {
                              setDays(setDayState(index, { checked: false }));
                            } else {
                              setDays(
                                setDayState(
                                  index,
                                  {
                                    checked: true,
                                    isOpen: true
                                  },
                                  { isOpen: false }
                                )
                              );
                            }
                          }}
                        >
                          <Tag
                            variant={days[index].checked ? "solid" : "outline"}
                            bgColor={days[index].checked ? "green" : undefined}
                            cursor={
                              days[index].isDisabled ? "not-allowed" : "pointer"
                            }
                            mr={1}
                            mb={3}
                          >
                            {label}{" "}
                            {getHours(selected) !== getHours(start)
                              ? getHours(selected) + "h"
                              : ""}
                          </Tag>
                        </Link>
                      </PopoverTrigger>
                      <PopoverContent>
                        <PopoverHeader fontWeight="bold">
                          {dateUtils.days[index]}
                        </PopoverHeader>
                        <PopoverCloseButton />
                        <PopoverBody>
                          {/* <FormLabel>Heure de début</FormLabel> */}
                          <DatePicker
                            //withPortal
                            customInput={renderCustomInput(
                              "startDate" + index,
                              true
                            )}
                            selected={selected}
                            dateFormat="Pp"
                            showTimeSelect
                            showTimeSelectOnly
                            timeFormat="p"
                            timeIntervals={60}
                            onChange={(startDate: Date) => {
                              setDays(
                                setDayState(index, {
                                  startDate: setDay(startDate, index + 1)
                                })
                              );
                            }}
                          />
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  );
                })}

              <Select
                name="repeat"
                ref={register()}
                defaultValue={props.event?.repeat}
                placeholder="Ne pas répéter"
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
                <option key="all" value={99}>
                  Toutes les semaines
                </option>
                {repeatOptions.map(
                  (i) =>
                    i > 1 && (
                      <option key={`${i}w`} value={i}>
                        {`Toutes les ${i} semaines`}
                      </option>
                    )
                )}
              </Select>
            </Box>
          )}

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
        placeholder="Adresse de l'événement"
        onSuggestionSelect={(suggestion: Suggestion) => {
          setSuggestion(suggestion);
        }}
      />

      <EmailControl
        name="eventEmail"
        register={register}
        control={control}
        errors={errors}
        placeholder="Adresse e-mail de l'événement"
      />

      <PhoneControl
        name="eventPhone"
        register={register}
        control={control}
        errors={errors}
        placeholder="Numéro de téléphone de l'événement"
      />

      <UrlControl
        name="eventWeb"
        register={register}
        control={control}
        setValue={setValue}
        errors={errors}
        placeholder="Site internet de l'événement"
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
                event={props.event}
                session={props.session}
                defaultValue={props.event?.eventDescription}
                onChange={(html: string) => {
                  p.onChange(html === "<p><br></p>" ? "" : html);
                }}
                placeholder="Description de l'événement"
              />
            );
          }}
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="eventDescription" />
        </FormErrorMessage>
      </FormControl>

      {visibilityOptions.length > 0 && (
        <FormControl
          id="eventVisibility"
          isRequired
          isInvalid={!!errors["eventVisibility"]}
          onChange={async (e) => {
            clearErrors("eventOrgs");
          }}
          mb={3}
        >
          <FormLabel>Visibilité</FormLabel>
          <Select
            name="eventVisibility"
            defaultValue={props.event ? props.event.eventVisibility : undefined}
            ref={register({
              required: "Veuillez sélectionner la visibilité de l'événement"
            })}
            placeholder="Visibilité de l'événement"
            color="gray.400"
          >
            {visibilityOptions.map((key) => {
              return (
                <option key={key} value={key}>
                  {VisibilityV[key]}
                </option>
              );
            })}
          </Select>
          <FormErrorMessage>
            <ErrorMessage errors={errors} name="eventVisibility" />
          </FormErrorMessage>
        </FormControl>
      )}

      <FormControl
        mb={3}
        id="eventOrgs"
        isInvalid={!!errors["eventOrgs"]}
        isRequired={
          eventOrgsRules.required === false ? false : !!eventOrgsRules.required
        }
      >
        <FormLabel>Organisateurs</FormLabel>
        <Controller
          name="eventOrgs"
          rules={eventOrgsRules}
          as={ReactSelect}
          control={control}
          defaultValue={defaultEventOrgs}
          placeholder="Sélectionner une ou plusieurs organisations"
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
          className="react-select-container"
          classNamePrefix="react-select"
          options={myOrgs}
          getOptionLabel={(option: IOrg) => `${option.orgName}`}
          getOptionValue={(option: IOrg) => option._id}
          onChange={([option]: [option: IOrg]) => option._id}
        />
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="eventOrgs" />
        </FormErrorMessage>
      </FormControl>

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
});
