import { DeleteIcon } from "@chakra-ui/icons";
import {
  Input,
  Button,
  Checkbox,
  CheckboxGroup,
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
  Box,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  PopoverCloseButton,
  PopoverHeader,
  IconButton,
  InputGroup
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import {
  addHours,
  addWeeks,
  compareDesc,
  getDay,
  getDayOfYear,
  getHours,
  getMinutes,
  intervalToDuration,
  isBefore,
  parseISO,
  setDay
} from "date-fns";
import { Session } from "lib/SessionContext";
import React, { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { Controller, useForm, useWatch } from "react-hook-form";
import ReactSelect from "react-select";
import { css } from "twin.macro";
import { Suggestion } from "use-places-autocomplete";

import {
  AddressControl,
  DatePicker,
  EmailControl,
  ErrorMessageText,
  renderCustomInput,
  RTEditor
} from "features/common";
import { UrlControl } from "features/common/forms/UrlControl";
import { PhoneControl } from "features/common/forms/PhoneControl";
import {
  AddEventPayload,
  EditEventPayload,
  useAddEventMutation,
  useEditEventMutation
} from "features/events/eventsApi";
import { withGoogleApi } from "features/map/GoogleApiWrapper";
import { useGetOrgQuery, useGetOrgsQuery } from "features/orgs/orgsApi";
import {
  IEntity,
  IEntityAddress,
  IEntityBanner,
  IEntityCategory,
  IEntityEmail,
  IEntityLogo,
  IEntityPhone,
  IEntityStyles,
  IEntityWeb
} from "models/Entity";
import {
  IEvent,
  monthRepeatOptions,
  EventVisibilities,
  EEventVisibility
} from "models/Event";
import { getOrgEventCategories, IOrg } from "models/Org";
import { hasItems } from "utils/array";
import * as dateUtils from "utils/date";
import { handleError } from "utils/form";
import { unwrapSuggestion } from "utils/maps";
import { normalize } from "utils/string";
import { useLeaveConfirm } from "hooks/useLeaveConfirm";
import useFormPersist from "react-hook-form-persist";
import { isServer } from "utils/isServer";

type DaysMap = { [key: number]: DayState };
type DayState = {
  checked: boolean;
  isDisabled?: boolean;
  isOpen: boolean;
  dayNumber: number;
  startDate: Date | null;
  endTime: Date | null;
  monthRepeat?: number[];
};
type FormData = IEvent<Date | null> & { eventOrg: IOrg | null };

const repeatOptions: number[] = [];
for (let i = 1; i <= 10; i++) {
  repeatOptions[i] = i;
}

export const EventForm = withGoogleApi({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY
})(
  ({
    orgId,
    ...props
  }: {
    session: Session;
    event?: IEvent;
    orgId?: string;
    onCancel?: () => void;
    onSubmit?: (eventUrl: string) => void;
  }) => {
    const { colorMode } = useColorMode();
    const isDark = colorMode === "dark";
    const toast = useToast({ position: "top" });
    const now = new Date();
    const [addEvent, addEventMutation] = useAddEventMutation();
    const [editEvent, editEventMutation] = useEditEventMutation();
    const { data: myOrgs } = useGetOrgsQuery({
      createdBy: props.session.user.userId
    });

    //#region local state
    const [isLoading, setIsLoading] = useState(false);
    const [isRepeat, setIsRepeat] = useState(
      !!props.event?.repeat || hasItems(props.event?.otherDays)
    );
    const [suggestion, setSuggestion] = useState<Suggestion>();

    let hasMonthRepeat = false;
    const [days, setDays] = useState<DaysMap>(
      dateUtils.days.reduce((obj, day, index) => {
        const otherDay = props.event?.otherDays?.find(
          ({ dayNumber }) => dayNumber === index
        );

        if (otherDay && hasItems(otherDay.monthRepeat)) hasMonthRepeat = true;

        return {
          ...obj,
          [index]: {
            ...otherDay,
            checked: !!otherDay,
            isDisabled: !otherDay?.monthRepeat && hasMonthRepeat,
            isOpen: false,
            startDate: otherDay?.startDate
              ? parseISO(otherDay.startDate)
              : undefined,
            endTime: otherDay?.endTime ? parseISO(otherDay.endTime) : undefined
          }
        };
      }, {})
    );
    useEffect(() => {
      let i = 0;
      while (!hasMonthRepeat && i < dateUtils.days.length) {
        const day = days[i];
        if (Array.isArray(day.monthRepeat) && day.monthRepeat.length > 0)
          hasMonthRepeat = true;
        i++;
      }
    }, [days]);
    const setDayState = (
      index: number,
      match: Partial<DayState> = {},
      nomatch: Partial<DayState> = {}
    ) => {
      return Object.keys(days).reduce(
        (obj, key, i) =>
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

    const [duration, setDuration] = useState<Duration | undefined>();
    const [canRepeat, setCanRepeat] = useState(false);
    const [canRepeat1day, setCanRepeat1day] = useState(true);

    //#endregion

    //#region form
    const {
      control,
      register,
      handleSubmit,
      errors,
      setError,
      clearErrors,
      setValue,
      getValues,
      formState,
      watch
    } = useForm<FormData>({
      defaultValues: {
        eventName: props.event?.eventName || "",
        eventCategory: props.event?.eventCategory,
        eventMinDate: props.event ? parseISO(props.event.eventMinDate) : null,
        eventMaxDate: props.event ? parseISO(props.event.eventMaxDate) : null,
        eventDescription: props.event?.eventDescription || "",
        eventVisibility:
          props.event?.eventVisibility || EEventVisibility.PUBLIC,
        //eventOrgs: props.event?.eventOrgs || [],
        eventOrg: props.event ? props.event.eventOrgs[0] : null,
        eventAddress: props.event?.eventAddress || [],
        eventEmail: props.event?.eventEmail || [],
        eventPhone: props.event?.eventPhone || [],
        eventWeb: props.event?.eventWeb || [],
        repeat: props.event?.repeat
      },
      mode: "onChange"
    });
    useLeaveConfirm({ formState });

    const eventMinDate = useWatch<Date | null | undefined>({
      control,
      name: "eventMinDate"
    });
    useEffect(() => {
      if (!props.event && eventMinDate) {
        if (end) {
          if (isBefore(end, eventMinDate)) {
            setEnd(undefined);
            setValue("eventMaxDate", null);
          }
        } else {
          if (getHours(eventMinDate) !== 0) {
            setEnd(addHours(eventMinDate, eventMinDuration));
            setValue("eventMaxDate", addHours(eventMinDate, eventMinDuration));
            clearErrors("eventMaxDate");
          }
        }
      }
    }, [eventMinDate]);
    const eventMaxDate = useWatch<Date | null | undefined>({
      control,
      name: "eventMaxDate"
    });
    useEffect(() => {
      if (end?.toISOString() !== eventMaxDate?.toISOString()) {
        // console.log("setting end to", eventMaxDate);
        setEnd(eventMaxDate ? eventMaxDate : undefined);
      }
    }, [eventMaxDate]);

    const start = eventMinDate;
    const startDay = start
      ? getDay(start) === 0
        ? 6
        : getDay(start) - 1
      : undefined;
    const [end, setEnd] = useState<Date | null | undefined>(eventMaxDate);
    useEffect(() => {
      if (start && end) {
        const newDuration = intervalToDuration({ start, end });

        if (newDuration !== duration) {
          setDuration(newDuration);

          if (newDuration.days !== undefined) {
            setCanRepeat1day(newDuration.days === 0);
            setCanRepeat(newDuration.days === 0 ? true : newDuration.days < 6);
          }
        }
      }
    }, [start, end]);

    const eventOrg = useWatch<IOrg | null>({ control, name: "eventOrg" });
    const categories = eventOrg ? getOrgEventCategories(eventOrg) : [];
    const visibilities = eventOrg
      ? [
          EEventVisibility.PUBLIC,
          EEventVisibility.FOLLOWERS,
          EEventVisibility.SUBSCRIBERS
        ]
      : [];

    const eventAddress = useWatch<IEntityAddress[]>({
      control,
      name: "eventAddress"
    });
    const eventEmail = useWatch<IEntityEmail[]>({
      control,
      name: "eventEmail"
    });
    const eventPhone = useWatch<IEntityPhone[]>({
      control,
      name: "eventPhone"
    });
    const eventWeb = useWatch<IEntityWeb[]>({ control, name: "eventWeb" });

    const { data: org } = useGetOrgQuery({ orgUrl: orgId || "" });
    useEffect(() => {
      if (org) setValue("eventOrg", org);
    }, [org]);

    useEffect(() => {
      if (!hasItems(eventAddress)) {
        if (eventOrg) {
          if (eventOrg.orgAddress[0]) {
            setValue("eventAddress", eventOrg.orgAddress);
          }
        } else {
          setValue("eventAddress", []);
        }
      }
    }, [eventOrg]);

    //#region form handlers
    const onChange = () => {
      clearErrors("formErrorMessage");
    };

    const onSubmit = async (form: IEvent<Date> & { eventOrg: IOrg | null }) => {
      console.log("submitted", form);
      setIsLoading(true);

      const eventName = form.eventName.trim();
      let eventUrl = normalize(eventName);
      const eventAddress = form.eventAddress?.filter(
        ({ address }) => address !== ""
      );
      const eventEmail = form.eventEmail?.filter(({ email }) => email !== "");
      const eventPhone = form.eventPhone?.filter(({ phone }) => phone !== "");
      const eventWeb = form.eventWeb?.filter(({ url }) => url !== "");

      let payload = {
        ...form,
        eventName,
        // eventDescription: form.eventDescription
        //   ? normalizeQuill(form.eventDescription)
        //   : undefined,
        eventDescription: form.eventDescription,
        eventDescriptionHtml: form.eventDescription,
        eventOrgs: form.eventOrg ? [form.eventOrg] : [],
        eventAddress:
          Array.isArray(eventAddress) && eventAddress.length > 0
            ? eventAddress
            : [],
        eventEmail:
          Array.isArray(eventEmail) && eventEmail.length > 0 ? eventEmail : [],
        eventPhone:
          Array.isArray(eventPhone) && eventPhone.length > 0 ? eventPhone : [],
        eventWeb: Array.isArray(eventWeb) && eventWeb.length > 0 ? eventWeb : []
      };

      payload.otherDays = isRepeat
        ? Object.keys(days)
            .filter((key) => {
              const day = days[parseInt(key)];
              return !day.isDisabled && day.checked;
            })
            .map((key) => {
              const dayNumber = parseInt(key);
              const day = days[dayNumber];
              return {
                ...day,
                dayNumber,
                startDate: day.startDate?.toISOString(),
                endTime: day.endTime
                  ? day.endTime.toISOString()
                  : day.startDate
                  ? addHours(
                      day.startDate,
                      duration?.hours || eventMinDuration
                    ).toISOString()
                  : undefined
              };
            })
        : [];

      try {
        //const sugg = suggestion || data[0];
        const sugg = suggestion;

        if (sugg) {
          const {
            lat: eventLat,
            lng: eventLng,
            city: eventCity
          } = await unwrapSuggestion(sugg);
          payload = { ...payload, eventLat, eventLng, eventCity };
        }

        if (props.event) {
          await editEvent({
            eventId: props.event._id,
            payload
          }).unwrap();

          toast({
            title: "L'événement a été modifié !",
            status: "success"
          });
        } else {
          const event = await addEvent(payload).unwrap();
          eventUrl = event.eventUrl;

          toast({
            title: `Vous allez être redirigé vers l'événement : ${event.eventName}...`,
            status: "success"
          });
        }

        setIsLoading(false);
        props.onSubmit && props.onSubmit(eventUrl as string);
      } catch (error) {
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

    //#region componentDidMount
    const [eventDescriptionDefaultValue, setEventDescriptionDefaultValue] =
      useState<string>();
    const [storage, setStorage] = useState<Storage | undefined>();
    useEffect(() => {
      setStorage(window.localStorage);
      const formData = window.localStorage.getItem("storageKey");
      if (formData) {
        setEventDescriptionDefaultValue(JSON.parse(formData).eventDescription);
      }
    }, []);
    useFormPersist("storageKey", {
      watch,
      setValue,
      storage,
      exclude: props.event
        ? [
            "eventName",
            "eventMinDate",
            "eventMaxDate",
            "eventDescription",
            "eventOrg",
            "eventAddress",
            "eventEmail",
            "eventPhone",
            "eventWeb"
          ]
        : []
    });
    //#endregion

    const containerProps = {
      backgroundColor: isDark ? "gray.700" : "white",
      _hover: {
        borderColor: isDark ? "#5F6774" : "#CBD5E0"
      },
      borderColor: isDark ? "#677080" : "gray.200",
      borderWidth: "1px",
      borderRadius: "lg",
      mt: 3,
      p: 3
    };

    //#region datepicker props
    const eventMinDuration = 1;
    const eventMinDatePickerProps = {
      minDate: now,
      maxDate: end && compareDesc(end, now) === 1 ? undefined : end,
      dateFormat: "Pp",
      showTimeSelect: true,
      timeFormat: "p",
      timeIntervals: 15,
      filterTime: (date: Date) => {
        if (getHours(date) < 5) return false;

        if (end) {
          if (getDayOfYear(date) === getDayOfYear(end)) {
            if (getHours(date) >= getHours(end)) {
              //console.log("filtering out", date);
              return false;
            }
          }
        }

        if (
          getDayOfYear(date) === getDayOfYear(now) &&
          getHours(date) < getHours(now) + eventMinDuration
        ) {
          //console.log("filtering out", date);
          return false;
        }

        //console.log("allowing", date);
        return true;
      }
    };

    const eventMaxDateMinDate = eventMinDate
      ? addHours(eventMinDate, eventMinDuration)
      : props.event
      ? addHours(parseISO(props.event.eventMinDate), eventMinDuration)
      : addHours(now, eventMinDuration);
    const highlightDatesStart: Date[] = [];
    if (start) {
      for (let i = 1; i <= 10; i++) {
        highlightDatesStart[i] = addWeeks(start, i);
      }
    }
    const eventMaxDatePickerProps = {
      minDate:
        compareDesc(eventMaxDateMinDate, now) === 1 ? now : eventMaxDateMinDate,
      dateFormat: "Pp",
      showTimeSelect: true,
      timeFormat: "p",
      timeIntervals: 15,
      filterTime: (date: Date) => {
        if (getHours(date) < 5) return false;

        if (start) {
          if (isBefore(date, start)) return false;

          if (getDayOfYear(date) === getDayOfYear(start)) {
            if (getHours(date) < getHours(start) + eventMinDuration)
              return false;
          }
        }

        if (
          getDayOfYear(date) === getDayOfYear(now) &&
          getHours(date) < getHours(now) + eventMinDuration + eventMinDuration
        )
          return false;

        return true;
      },
      highlightDates: highlightDatesStart
    };
    //#endregion

    return (
      <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
        {/* eventName */}
        <FormControl
          isRequired
          isInvalid={!!errors["eventName"]}
          display="flex"
          flexDirection="column"
          mb={!props.event && getValues("eventName") ? 0 : 3}
        >
          <FormLabel>Nom de l'événement</FormLabel>
          <Input
            name="eventName"
            ref={register({
              required: "Veuillez saisir un nom d'événement"
              // pattern: {
              //   value: /^[A-zÀ-ú0-9 ]+$/i,
              //   message:
              //     "Veuillez saisir un nom composé de lettres et de chiffres uniquement"
              // }
            })}
            autoComplete="off"
            defaultValue={props.event ? props.event.eventName : ""}
            placeholder="Nom de l'événement"
          />
          {!errors.eventName && !props.event && getValues("eventName") && (
            <Tooltip label={`Adresse de la page de l'événement`}>
              <Tag mt={3} alignSelf="flex-end" cursor="help">
                {process.env.NEXT_PUBLIC_URL}/
                {normalize(getValues("eventName"))}
              </Tag>
            </Tooltip>
          )}
          <FormErrorMessage>
            <ErrorMessage errors={errors} name="eventName" />
          </FormErrorMessage>
        </FormControl>

        {/* eventMinDate */}
        <FormControl isRequired isInvalid={!!errors["eventMinDate"]} mb={3}>
          <FormLabel>Date de début</FormLabel>
          <Controller
            name="eventMinDate"
            control={control}
            rules={{ required: "Veuillez saisir une date" }}
            render={(props) => {
              return (
                <DatePicker
                  withPortal={isMobile}
                  customInput={renderCustomInput({
                    label: "minDate"
                  })}
                  selected={props.value}
                  onChange={(e) => {
                    clearErrors("eventMinDate");
                    props.onChange(e);
                  }}
                  {...eventMinDatePickerProps}
                />
              );
            }}
          />
          <FormErrorMessage>
            <ErrorMessage errors={errors} name="eventMinDate" />
          </FormErrorMessage>
        </FormControl>

        {/* eventMaxDate */}
        <FormControl isRequired isInvalid={!!errors["eventMaxDate"]} mb={3}>
          <FormLabel>Date de fin</FormLabel>

          <InputGroup>
            <Controller
              name="eventMaxDate"
              control={control}
              rules={{ required: "Veuillez saisir une date" }}
              render={({ onChange, value }) => {
                return (
                  <DatePicker
                    // disabled={!eventMinDate}
                    withPortal={isMobile}
                    customInput={renderCustomInput({ label: "maxDate" })}
                    selected={value}
                    onChange={onChange}
                    {...eventMaxDatePickerProps}
                  />
                );
              }}
            />

            {!!end && (
              <IconButton
                aria-label="Date de fin remise à zéro"
                icon={<DeleteIcon />}
                ml={3}
                onClick={() => {
                  setEnd(undefined);
                  setValue("eventMaxDate", null);
                }}
              />
            )}
          </InputGroup>

          <FormErrorMessage>
            <ErrorMessage errors={errors} name="eventMaxDate" />
          </FormErrorMessage>
        </FormControl>

        {/* otherDays */}
        {canRepeat1day && (
          <FormControl mb={3}>
            <Checkbox
              isChecked={isRepeat}
              isDisabled={!start || !end}
              onChange={(e) => setIsRepeat(e.target.checked)}
            >
              Autres jours
            </Checkbox>

            {isRepeat && (
              <Box mt={3}>
                {dateUtils.days.map((label, index) => {
                  const day = days[index];

                  const otherDay = props.event?.otherDays?.find(
                    ({ dayNumber, startDate }) =>
                      dayNumber === index && startDate
                  );

                  let defaultStart: Date | undefined;
                  if (day.startDate) {
                    defaultStart = day.startDate;
                  } else {
                    if (otherDay?.startDate)
                      defaultStart = parseISO(otherDay.startDate);
                    else if (start) defaultStart = setDay(start, index + 1);
                  }

                  let defaultEnd: Date | undefined;
                  if (day.endTime) {
                    defaultEnd = day.endTime;
                  } else {
                    if (otherDay?.endTime)
                      defaultEnd = parseISO(otherDay.endTime);
                    else if (end) defaultEnd = setDay(end, index + 1);
                  }

                  let tagLabel = label;

                  if (day.checked) {
                    if (defaultStart) {
                      const defaultStartHours = getHours(defaultStart);
                      const defaultStartMinutes =
                        getMinutes(defaultStart) !== 0
                          ? getMinutes(defaultStart)
                          : "";

                      if (defaultEnd) {
                        const defaultEndHours = getHours(defaultEnd);
                        const defaultEndMinutes =
                          getMinutes(defaultEnd) !== 0
                            ? getMinutes(defaultEnd)
                            : "";

                        tagLabel += ` ${defaultStartHours}h${defaultStartMinutes} - ${defaultEndHours}h${defaultEndMinutes}`;
                      } else
                        tagLabel += ` ${defaultStartHours}h${defaultStartMinutes}`;
                    }
                  }

                  const show =
                    defaultStart &&
                    start &&
                    getDay(defaultStart) !== getDay(start);

                  return (
                    <Popover
                      key={"day-" + index}
                      closeOnBlur
                      isOpen={!!days[index].isOpen}
                      isLazy
                      placement="bottom"
                      onClose={() =>
                        setDays(setDayState(index, { isOpen: false }))
                      }
                    >
                      <PopoverTrigger>
                        <Tag
                          variant={day.checked ? "solid" : "outline"}
                          bgColor={day.checked ? "green" : undefined}
                          cursor={day.isDisabled ? "not-allowed" : "pointer"}
                          mr={1}
                          mb={3}
                          onClick={() => {
                            if (day.isDisabled) return;

                            let newDays: DaysMap;

                            if (day.checked && !day.isOpen) {
                              newDays = setDayState(index, { checked: false });
                              newDays = Object.keys(days).reduce(
                                (obj, key, i) => {
                                  const dayNumber = parseInt(key);
                                  return {
                                    ...obj,
                                    [i]: {
                                      ...newDays[i],
                                      isDisabled: false
                                    }
                                  };
                                },
                                {}
                              );
                            } else {
                              newDays = setDayState(
                                index,
                                {
                                  checked: true,
                                  isOpen: true
                                },
                                { isOpen: false }
                              );
                              newDays = Object.keys(days).reduce(
                                (obj, key, i) => {
                                  const dayNumber = parseInt(key);
                                  let isDisabled = false;

                                  if (hasMonthRepeat && !newDays[i].monthRepeat)
                                    isDisabled = true;

                                  return {
                                    ...obj,
                                    [i]: {
                                      ...newDays[i],
                                      isDisabled
                                    }
                                  };
                                },
                                {}
                              );
                            }

                            setDays(newDays);
                          }}
                        >
                          {tagLabel}
                        </Tag>
                      </PopoverTrigger>

                      <PopoverContent>
                        <PopoverHeader fontWeight="bold">
                          {dateUtils.days[index]}
                        </PopoverHeader>
                        <PopoverCloseButton />
                        <PopoverBody>
                          {show && (
                            <>
                              <FormControl mb={3}>
                                <FormLabel>Heure de début</FormLabel>
                                <DatePicker
                                  //withPortal
                                  customInput={renderCustomInput({
                                    label: "startDate" + index,
                                    isTimeOnly: true
                                  })}
                                  selected={defaultStart}
                                  dateFormat="Pp"
                                  showTimeSelect
                                  showTimeSelectOnly
                                  timeFormat="p"
                                  timeIntervals={30}
                                  filterTime={(time) => {
                                    if (
                                      defaultEnd &&
                                      getHours(time) >= getHours(defaultEnd)
                                    )
                                      return false;
                                    return true;
                                  }}
                                  onChange={(startDate: Date) => {
                                    let endTime;
                                    if (defaultEnd) {
                                      if (
                                        getHours(defaultEnd) >
                                        getHours(startDate)
                                      )
                                        endTime = defaultEnd;
                                    }
                                    setDays(
                                      setDayState(index, {
                                        startDate: setDay(startDate, index + 1),
                                        endTime
                                      })
                                    );
                                  }}
                                />
                              </FormControl>

                              <FormControl mb={3}>
                                <FormLabel>Heure de fin</FormLabel>
                                <DatePicker
                                  //withPortal
                                  customInput={renderCustomInput({
                                    label: "startDate" + index,
                                    isTimeOnly: true
                                  })}
                                  selected={defaultEnd}
                                  dateFormat="Pp"
                                  showTimeSelect
                                  showTimeSelectOnly
                                  timeFormat="p"
                                  timeIntervals={30}
                                  filterTime={(time) => {
                                    if (
                                      defaultStart &&
                                      getHours(time) <= getHours(defaultStart)
                                    ) {
                                      return false;
                                    }
                                    // console.log("allowing", time);
                                    return true;
                                  }}
                                  onChange={(endDate: Date) => {
                                    const newDays = setDayState(index, {
                                      endTime: endDate
                                    });
                                    setDays(newDays);
                                  }}
                                />
                              </FormControl>
                            </>
                          )}

                          {day.checked && startDay === index && (
                            <FormControl>
                              <CheckboxGroup>
                                {Object.keys(monthRepeatOptions).map((key) => {
                                  const monthRepeatOption = parseInt(key);

                                  if (
                                    day.monthRepeat?.length === 3 &&
                                    !day.monthRepeat.includes(monthRepeatOption)
                                  )
                                    return null;

                                  return (
                                    <Checkbox
                                      key={monthRepeatOption}
                                      isChecked={day.monthRepeat?.includes(
                                        monthRepeatOption
                                      )}
                                      onChange={(e) => {
                                        let monthRepeat: number[];

                                        if (!e.target.checked) {
                                          monthRepeat =
                                            day.monthRepeat?.filter(
                                              (i) => i !== monthRepeatOption
                                            ) || [];
                                        } else {
                                          monthRepeat = [monthRepeatOption];

                                          if (day.monthRepeat)
                                            monthRepeat =
                                              day.monthRepeat.concat([
                                                monthRepeatOption
                                              ]);
                                        }

                                        setDays(
                                          setDayState(index, {
                                            monthRepeat
                                          })
                                        );
                                      }}
                                    >
                                      Le {monthRepeatOptions[monthRepeatOption]}{" "}
                                      {label} de chaque mois
                                    </Checkbox>
                                  );
                                })}
                              </CheckboxGroup>
                            </FormControl>
                          )}
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
                  );
                })}
              </Box>
            )}
          </FormControl>
        )}

        {/* repeat */}
        {canRepeat && !hasMonthRepeat && (
          <FormControl isInvalid={!!errors["repeat"]} mb={3}>
            <FormLabel>Fréquence</FormLabel>
            <Select
              name="repeat"
              ref={register()}
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
              {/* {repeatOptions.map(
                (i) =>
                  i > 1 && (
                    <option key={`${i}w`} value={i}>
                      {`Toutes les ${i} semaines`}
                    </option>
                  )
              )} */}
            </Select>
            <FormErrorMessage>
              <ErrorMessage errors={errors} name="repeat" />
            </FormErrorMessage>
          </FormControl>
        )}

        {/* eventDescription */}
        <FormControl isInvalid={!!errors["eventDescription"]} mb={3}>
          <FormLabel>Description</FormLabel>
          <Controller
            name="eventDescription"
            control={control}
            render={(renderProps) => {
              return (
                <RTEditor
                  defaultValue={
                    props.event?.eventDescription ||
                    eventDescriptionDefaultValue
                  }
                  event={props.event}
                  placeholder="Description de l'événement"
                  session={props.session}
                  onChange={({ html }) => {
                    renderProps.onChange(html);
                  }}
                />
              );
            }}
          />
          <FormErrorMessage>
            <ErrorMessage errors={errors} name="eventDescription" />
          </FormErrorMessage>
        </FormControl>

        {/* eventOrg */}
        <FormControl
          mb={3}
          isInvalid={!!errors["eventOrg"]}
          // isRequired={
          //   eventOrgsRules.required === false
          //     ? false
          //     : !!eventOrgsRules.required
          // }
        >
          <FormLabel>Organisé par...</FormLabel>
          <Controller
            name="eventOrg"
            //rules={eventOrgsRules}
            as={ReactSelect}
            control={control}
            closeMenuOnSelect
            isClearable
            //isMulti
            isSearchable
            menuPlacement="top"
            noOptionsMessage={() => "Aucun résultat"}
            options={myOrgs}
            getOptionLabel={(option: any) => option.orgName}
            getOptionValue={(option: any) => option._id}
            placeholder={
              hasItems(myOrgs)
                ? "Rechercher..."
                : "Vous n'avez créé aucune organisations"
            }
            styles={{
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
            onChange={(newValue: any /*, actionMeta*/) => newValue._id}
          />
          <FormErrorMessage>
            <ErrorMessage errors={errors} name="eventOrg" />
          </FormErrorMessage>
        </FormControl>

        {/* eventCategory */}
        {eventOrg && hasItems(eventOrg.orgEventCategories) && (
          <FormControl
            isInvalid={!!errors["eventCategory"]}
            onChange={async (e) => {
              clearErrors("eventOrgs");
            }}
            mb={3}
          >
            <FormLabel>Catégorie</FormLabel>
            <Select
              name="eventCategory"
              ref={register()}
              placeholder="Catégorie de l'événement"
              color="gray.400"
            >
              {categories.map(({ catId, label }) => (
                <option key={`cat-${catId}`} value={catId}>
                  {label}
                </option>
              ))}
            </Select>
            <FormErrorMessage>
              <ErrorMessage errors={errors} name="eventCategory" />
            </FormErrorMessage>
          </FormControl>
        )}

        <FormLabel>Coordonnées de l'événement</FormLabel>

        <AddressControl
          name="eventAddress"
          control={control}
          errors={errors}
          setValue={setValue}
          mb={3}
          containerProps={
            hasItems(eventAddress) ? { ...containerProps, mt: 0 } : { mb: 3 }
          }
          onSuggestionSelect={(suggestion: Suggestion) => {
            setSuggestion(suggestion);
          }}
        />

        <EmailControl
          name="eventEmail"
          register={register}
          control={control}
          errors={errors}
          setValue={setValue}
          mb={3}
          containerProps={
            hasItems(eventEmail) ? { ...containerProps, mt: 0 } : { mb: 3 }
          }
        />

        <PhoneControl
          name="eventPhone"
          register={register}
          control={control}
          errors={errors}
          setValue={setValue}
          mb={3}
          containerProps={hasItems(eventPhone) ? containerProps : { mb: 3 }}
        />

        <UrlControl
          name="eventWeb"
          register={register}
          control={control}
          errors={errors}
          setValue={setValue}
          mb={3}
          containerProps={
            hasItems(eventWeb) ? { ...containerProps, mb: 3 } : { mb: 3 }
          }
        />

        {/* eventVisibility */}
        {hasItems(visibilities) && (
          <FormControl
            isRequired
            isInvalid={!!errors["eventVisibility"]}
            onChange={async (e) => {
              clearErrors("eventOrgs");
            }}
            mb={3}
          >
            <FormLabel>Visibilité de l'événement</FormLabel>
            <Select
              name="eventVisibility"
              ref={register({
                required: "Veuillez sélectionner la visibilité de l'événement"
              })}
              placeholder="Visibilité de l'événement"
              color={isDark ? "whiteAlpha.400" : "gray.400"}
            >
              {visibilities.map((key) => {
                const visibility = key as EEventVisibility;
                return (
                  <option key={visibility} value={visibility}>
                    {EventVisibilities[visibility]}
                  </option>
                );
              })}
            </Select>
            <FormErrorMessage>
              <ErrorMessage errors={errors} name="eventVisibility" />
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

        <Flex justifyContent="space-between">
          {props.onCancel && (
            <Button colorScheme="red" onClick={props.onCancel}>
              Annuler
            </Button>
          )}

          <Button
            colorScheme="green"
            type="submit"
            isLoading={
              isLoading ||
              addEventMutation.isLoading ||
              editEventMutation.isLoading
            }
            isDisabled={Object.keys(errors).length > 0}
          >
            {props.event ? "Modifier" : "Ajouter"}
          </Button>
        </Flex>
      </form>
    );
  }
);

{
  /*
    const eventVisibility = useWatch<string>({
      control,
      name: "eventVisibility"
    });

    const eventOrgsRules: { required: string | boolean } = {
      required:
        eventVisibility === EEventVisibility.SUBSCRIBERS
          ? "Veuillez sélectionner une ou plusieurs organisations"
          : false
    };

    if (
      !errors.eventOrgs &&
      typeof eventOrgsRules.required === "string" &&
      !eventOrg
    )
      setError("eventOrg", {
        type: "manual",
        message: eventOrgsRules.required
      });
 */
}
