import { BellIcon, EmailIcon } from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Box,
  Button,
  ButtonProps,
  FormControl,
  FormErrorMessage,
  Icon,
  IconButton,
  InputGroup,
  InputLeftElement,
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverFooter,
  Tooltip,
  useToast
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaBellSlash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useAddSubscriptionMutation } from "features/api/subscriptionsApi";
import { HostTag } from "features/common";
import { IEvent } from "models/Event";
import { IOrg, orgTypeFull, orgTypeFull2, orgTypeFull5 } from "models/Org";
import {
  getFollowerSubscription,
  ISubscription,
  EOrgSubscriptionType
} from "models/Subscription";
import { useAppDispatch } from "store";
import { selectUserEmail, setUserEmail } from "store/userSlice";
import { emailR } from "utils/email";
import { AppQuery } from "utils/types";
import { SubscriptionEditPopover } from "./SubscriptionEditPopover";

export const SubscribePopover = ({
  event,
  org,
  query,
  subQuery,
  isIconOnly = false,
  notifType = "email",
  ...props
}: ButtonProps & {
  event?: IEvent;
  org?: IOrg;
  query: AppQuery<IEvent | IOrg | IOrg[]>;
  subQuery: AppQuery<ISubscription>;
  isIconOnly?: boolean;
  notifType?: "email" | "push";
}) => {
  const toast = useToast({ position: "top" });
  const dispatch = useAppDispatch();
  const userEmail = useSelector(selectUserEmail);
  const router = useRouter();

  //#region local state
  const followerSubscription = getFollowerSubscription({
    event,
    org,
    subQuery
  });
  const isFollowed = !!followerSubscription;
  const [isOpen, setIsOpen] = useState(false);
  const [isL, setIsLoading] = useState(false);
  const isLoading = isL || query.isLoading || subQuery.isLoading;
  //#endregion

  //#region form
  const { errors, handleSubmit, register } = useForm({
    mode: "onChange"
  });
  const [addSubscription] = useAddSubscriptionMutation();
  const addFollowerSubscription = async (email?: string) => {
    setIsLoading(true);
    let payload: Partial<ISubscription> = {};

    if (org) {
      payload.orgs = [
        {
          org,
          orgId: org._id,
          type: EOrgSubscriptionType.FOLLOWER,
          tagTypes: [
            { type: "Events", emailNotif: true, pushNotif: true },
            { type: "Projects", emailNotif: true, pushNotif: true },
            { type: "Topics", emailNotif: true, pushNotif: true }
          ]
        }
      ];
    } else if (event) {
      payload.events = [
        {
          event,
          eventId: event._id,
          tagTypes: [{ type: "Topics", emailNotif: true, pushNotif: true }]
        }
      ];
    }

    try {
      await addSubscription({
        ...payload,
        email: email || userEmail
      }).unwrap();

      query.refetch();
      subQuery.refetch();
      setIsLoading(false);
      toast({
        status: "success",
        title: `Vous êtes maintenant abonné ${
          org ? orgTypeFull2(org.orgType) : "à l'événement"
        } ${org ? org.orgName : event?.eventName}`
      });
    } catch (error) {
      setIsLoading(false);
      console.error(error);
      toast({
        status: "error",
        title: "Vous n'avez pas pu être abonné"
      });
    }
  };
  const onChange = () => {
    //clearErrors("email");
  };
  const onSubmit = async ({ email }: { email?: string }) => {
    if (!email) return;
    dispatch(setUserEmail(email));
    await addFollowerSubscription(email);
  };
  //#endregion

  if (!org && !event) return null;

  if (!userEmail)
    return (
      <Popover isLazy isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <PopoverTrigger>
          {isIconOnly ? (
            <IconButton
              aria-label="S'abonner"
              isLoading={isLoading}
              icon={<BellIcon boxSize={6} />}
              colorScheme="teal"
              onClick={async () => {
                setIsOpen(!isOpen);
              }}
              data-cy="subscribe-button"
            />
          ) : (
            <Button
              {...props}
              isLoading={isLoading}
              leftIcon={<BellIcon boxSize={6} />}
              colorScheme="teal"
              onClick={async () => {
                setIsOpen(!isOpen);
              }}
              data-cy="subscribe-button"
            >
              S'abonner{" "}
              {event
                ? "à l'événement"
                : org && org.orgUrl === "forum"
                ? "au forum"
                : org
                ? orgTypeFull2(org.orgType)
                : ""}
            </Button>
          )}
        </PopoverTrigger>

        <PopoverContent ml={0}>
          <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
            <PopoverBody>
              <Alert status="info" mb={3}>
                <AlertIcon />
                <Box>
                  En vous abonnant, vous acceptez de rendre votre adresse e-mail
                  visible à l'administrateur de cette organisation et de{" "}
                  <HostTag />
                </Box>
              </Alert>
              <FormControl isRequired isInvalid={!!errors["email"]}>
                <InputGroup>
                  <InputLeftElement
                    pointerEvents="none"
                    children={
                      notifType === "email" ? <EmailIcon /> : <BellIcon />
                    }
                  />

                  <Input
                    name="email"
                    placeholder="Entrez votre adresse e-mail"
                    ref={register({
                      required: "Veuillez saisir votre adresse e-mail",
                      pattern: {
                        value: emailR,
                        message: "Adresse e-mail invalide"
                      }
                    })}
                  />
                </InputGroup>
                <FormErrorMessage>
                  <ErrorMessage errors={errors} name="email" />
                </FormErrorMessage>
              </FormControl>
            </PopoverBody>
            <PopoverFooter>
              <Button
                colorScheme="green"
                type="submit"
                isLoading={isLoading}
                isDisabled={Object.keys(errors).length > 0}
              >
                Valider
              </Button>
            </PopoverFooter>
          </form>
        </PopoverContent>
      </Popover>
    );

  if (isIconOnly) {
    const label = `${isFollowed ? "Se désabonner" : "S'abonner"} ${
      org ? `à ${orgTypeFull5(org.orgType)}` : event ? "à l'événement" : ""
    }`;

    return (
      <Tooltip label={label} placement="right">
        <IconButton
          aria-label={label}
          isLoading={isLoading}
          icon={<Icon as={isFollowed ? FaBellSlash : BellIcon} boxSize={6} />}
          colorScheme="teal"
          onClick={async () => {
            if (isFollowed) {
              const unsubscribe = confirm(
                `Êtes-vous sûr de vouloir vous désabonner ${
                  org ? orgTypeFull(org.orgType) : "de l'événement"
                } ${org ? org.orgName : event?.eventName} ?`
              );

              if (unsubscribe) {
                const url = `/unsubscribe/${
                  org ? org.orgUrl : event?.eventUrl
                }?subscriptionId=${subQuery.data!._id}`;
                router.push(url);
                setIsOpen(false);
              }
            } else {
              addFollowerSubscription();
            }
          }}
          data-cy="subscribe-button"
        />
      </Tooltip>
    );
  }

  if (isFollowed) {
    return (
      <SubscriptionEditPopover
        event={event}
        org={org}
        notifType={notifType}
        userEmail={userEmail}
      />
    );
  }

  return (
    <Button
      isLoading={isLoading}
      leftIcon={<BellIcon boxSize={6} />}
      colorScheme="teal"
      onClick={() => addFollowerSubscription()}
      data-cy="subscribe-button"
    >
      {isIconOnly ? "" : "S'abonner"}
    </Button>
  );
};
