import { BellIcon, EmailIcon } from "@chakra-ui/icons";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverFooter,
  Button,
  FormControl,
  InputGroup,
  InputLeftElement,
  Input,
  FormErrorMessage,
  useToast
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { selectUserEmail, setUserEmail } from "features/users/userSlice";
import { useSession } from "hooks/useAuth";
import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import {
  getFollowerSubscription,
  IEventSubscription,
  IOrgSubscription,
  ISubscription,
  SubscriptionTypes
} from "models/Subscription";
import { useAppDispatch } from "store";
import { emailR } from "utils/email";
import { refetchSubscription } from "./subscriptionSlice";
import { useAddSubscriptionMutation } from "./subscriptionsApi";
import { SubscriptionEditPopover } from "./SubscriptionEditPopover";

export const SubscriptionPopover = ({
  event,
  org,
  query,
  subQuery,
  notifType = "email",
  ...props
}: {
  event?: IEvent;
  org?: IOrg;
  notifType?: "email" | "push";
  query: any;
  subQuery: any;
  isLoading?: boolean;
  onSubmit?: (subscribed: boolean) => void;
}) => {
  if (!org && !event) return null;

  const { data: session } = useSession();
  const toast = useToast({ position: "top" });
  const dispatch = useAppDispatch();
  const userEmail = useSelector(selectUserEmail) || session?.user.email;
  const isFollowed = !!getFollowerSubscription({ org, subQuery });

  const [addSubscription, addSubscriptionMutation] =
    useAddSubscriptionMutation();

  //#region local state
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // const [tooltipProps, setTooltipProps] = useState<{
  //   label?: string;
  //   closeDelay?: number;
  //   openDelay?: number;
  // }>({
  //   label: org
  //     ? "S'abonner pour recevoir une notification quand un événement est publié par cette organisation, ou quand une discussion est ajoutée à cette organisation."
  //     : "S'abonner pour recevoir une notification quand une discussion est ajoutée à cet événement."
  // });
  //#endregion

  //#region form
  const { errors, handleSubmit, register } = useForm({
    mode: "onChange"
  });
  //#endregion

  const onChange = () => {
    //clearErrors("email");
  };

  const addFollowerSubscription = async (email?: string) => {
    let payload: Partial<ISubscription> = {};

    if (org) {
      payload.orgs = [
        {
          org,
          orgId: org._id,
          type: SubscriptionTypes.FOLLOWER,
          tagTypes: [
            { type: "Events", emailNotif: true, pushNotif: true },
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
        payload,
        email: email || userEmail
      }).unwrap();

      query.refetch();
      subQuery.refetch();
    } catch (error) {
      console.error(error);
      toast({
        status: "error",
        title: "Vous n'avez pas pu être abonné"
      });
    }
  };

  const onStep1Submit = async ({ email }: { email?: string }) => {
    if (!email) return;
    setIsLoading(true);
    dispatch(setUserEmail(email));
    await addFollowerSubscription(email);
    setIsLoading(false);
    // setIsOpen(false);
    //props.onSubmit && props.onSubmit(true);
  };

  if (!userEmail)
    return (
      <Popover isLazy isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <PopoverTrigger>
          <Button
            isLoading={isLoading}
            leftIcon={
              notifType === "email" ? (
                <EmailIcon boxSize={6} />
              ) : (
                <BellIcon boxSize={6} />
              )
            }
            colorScheme="teal"
            onClick={async () => {
              setIsOpen(!isOpen);
            }}
            data-cy="subscribeToOrg"
          >
            S'abonner
          </Button>
        </PopoverTrigger>

        <PopoverContent ml={0}>
          <form onChange={onChange} onSubmit={handleSubmit(onStep1Submit)}>
            <PopoverBody>
              <FormControl id="email" isRequired isInvalid={!!errors["email"]}>
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

  return (
    <>
      {!subQuery.isLoading && !isFollowed ? (
        <Button
          isLoading={isLoading}
          leftIcon={
            notifType === "email" ? (
              <EmailIcon boxSize={6} />
            ) : (
              <BellIcon boxSize={6} />
            )
          }
          colorScheme="teal"
          onClick={async () => {
            setIsLoading(true);
            await addFollowerSubscription();
            setIsLoading(false);
          }}
          data-cy="subscribeToOrg"
        >
          S'abonner
        </Button>
      ) : (
        isFollowed && (
          <SubscriptionEditPopover
            event={event}
            org={org}
            notifType={notifType}
            userEmail={userEmail}
          />
        )
      )}
    </>
  );
};
