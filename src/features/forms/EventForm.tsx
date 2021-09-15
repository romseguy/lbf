import type { AppSession } from "hooks/useAuth";
import { IEvent, VisibilityV } from "models/Event";
import type { IOrg } from "models/Org";
import { isMobile } from "react-device-detect";
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
  FormErrorMessage,
  useToast,
  Select,
  Checkbox,
  Flex,
  CheckboxGroup,
  useColorMode,
  Alert,
  AlertIcon,
  Tag,
  Table,
  Tbody,
  Tr,
  Td,
  Spinner,
  InputGroup,
  InputLeftAddon,
  InputLeftElement
} from "@chakra-ui/react";
import { EmailIcon, PhoneIcon, TimeIcon } from "@chakra-ui/icons";
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
import { handleError } from "utils/form";
import {
  addHours,
  addWeeks,
  getDay,
  getHours,
  intervalToDuration,
  parseISO,
  subHours
} from "date-fns";
import usePlacesAutocomplete, {
  getDetails,
  getGeocode,
  getLatLng,
  Suggestion
} from "use-places-autocomplete";
import { useGetOrgsQuery } from "features/orgs/orgsApi";
import { css } from "twin.macro";
import { useEffect } from "react";
import { SubscriptionTypes } from "models/Subscription";
import { normalize } from "utils/string";
import { useSelector } from "react-redux";
import { refetchOrgs, selectOrgsRefetch } from "features/orgs/orgSlice";
import { unwrapSuggestion } from "utils/maps";
import { Visibility } from "models/Topic";
import { withGoogleApi } from "features/map/GoogleApiWrapper";

interface EventFormProps extends ChakraProps {
  session: AppSession;
  event?: IEvent;
  initialEventOrgs?: IOrg[];
  onClose?: () => void;
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
  //#region event
  const [addEvent, addEventMutation] = useAddEventMutation();
  const [editEvent, editEventMutation] = useEditEventMutation();
  const notifiedCount =
    props.event && Array.isArray(props.event.eventNotified)
      ? props.event.eventNotified.length
      : 0;
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
    getValues,
    trigger
  } = useForm({
    mode: "onChange"
  });

  watch(["eventAddress", "eventOrgs"]);
  const eventAddress = getValues("eventAddress") || props.event?.eventAddress;
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
  const eventNotif = watch("eventNotif");
  useEffect(() => {
    if (eventNotif === false) {
      setValue("eventNotif", []);
    }
  }, [eventNotif]);
  //#endregion

  //#region local state
  const toast = useToast({ position: "top" });
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const [isLoading, setIsLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<Suggestion>();
  const {
    ready,
    value: autoCompleteValue,
    suggestions: { status, data },
    setValue: setAutoCompleteValue,
    clearSuggestions
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: {
        country: "fr"
      }
    },
    debounce: 300
  });
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

    let payload = {
      ...form,
      eventUrl: normalize(form.eventName),
      eventDescription:
        form.eventDescription === "<p><br></p>"
          ? ""
          : form.eventDescription?.replace(/\&nbsp;/g, " "),
      eventNotif:
        typeof form.eventNotif === "boolean"
          ? []
          : typeof form.eventNotif === "string"
          ? [form.eventNotif]
          : form.eventNotif
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

      if (props.event) {
        const res = await editEvent({
          payload,
          eventUrl: props.event.eventUrl
        }).unwrap();

        toast({
          title:
            Array.isArray(res.emailList) && res.emailList.length > 0
              ? `Une invitation a été envoyée à ${res.emailList.length} abonné${
                  res.emailList.length > 1 ? "s" : ""
                }`
              : "Votre événement a bien été modifié !",
          status: "success",
          isClosable: true
        });
      } else {
        const event = await addEvent({
          ...payload,
          createdBy: props.session.user.userId
        }).unwrap();

        toast({
          title: "Votre événement a bien été ajouté !",
          status: "success",
          isClosable: true
        });
      }

      props.onSubmit && props.onSubmit(payload.eventUrl);
      props.onClose && props.onClose();
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
        mb={3}
      >
        <FormLabel>Nom de l'événement</FormLabel>
        <Input
          name="eventName"
          placeholder="Nom de l'événement"
          ref={register({
            required: "Veuillez saisir un nom d'événement",
            pattern: {
              value: /^[A-zÀ-ú0-9 ]+$/i,
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
        placeholder="Adresse de l'événement"
        onSuggestionSelect={(suggestion: Suggestion) => {
          setSuggestion(suggestion);
        }}
      />

      <EmailControl
        name="eventEmail"
        defaultValue={props.event?.eventEmail}
        errors={errors}
        register={register}
        mb={3}
        placeholder="Adresse e-mail de l'événement"
      />

      <FormControl id="eventPhone" isInvalid={!!errors["eventPhone"]} mb={3}>
        <FormLabel>Numéro de téléphone</FormLabel>
        <InputGroup>
          <InputLeftElement pointerEvents="none" children={<PhoneIcon />} />
          <Input
            name="eventPhone"
            placeholder="Numéro de téléphone de l'événement"
            ref={register({
              pattern: {
                value: /^[0-9]{10,}$/i,
                message: "Numéro de téléphone invalide"
              }
            })}
            defaultValue={props.event?.eventPhone}
            pl={10}
          />
        </InputGroup>
        <FormErrorMessage>
          <ErrorMessage errors={errors} name="eventPhone" />
        </FormErrorMessage>
      </FormControl>

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
            defaultValue={
              props.event
                ? props.event.eventVisibility
                : Visibility[Visibility.PUBLIC]
            }
            ref={register({
              required: "Veuillez sélectionner la visibilité de la discussion"
            })}
            placeholder="Sélectionnez la visibilité de la discussion..."
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
