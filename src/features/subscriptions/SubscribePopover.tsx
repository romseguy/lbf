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
  useToast,
  Alert,
  AlertIcon,
  Box
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
  ISubscription,
  ESubscriptionType
} from "models/Subscription";
import { useAppDispatch } from "store";
import { emailR } from "utils/email";
import { AppQuery } from "utils/types";
import { SubscriptionEditPopover } from "./SubscriptionEditPopover";
import { useAddSubscriptionMutation } from "./subscriptionsApi";
import { HostTag } from "features/common";

export const SubscribePopover = ({
  event,
  org,
  query,
  subQuery,
  notifType = "email"
}: {
  event?: IEvent;
  org?: IOrg;
  query: AppQuery<IEvent | IOrg>;
  subQuery: AppQuery<ISubscription>;
  notifType?: "email" | "push";
}) => {
  const { data: session } = useSession();
  const toast = useToast({ position: "top" });
  const dispatch = useAppDispatch();
  const userEmail = useSelector(selectUserEmail);

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
  const onChange = () => {
    //clearErrors("email");
  };
  const [addSubscription] = useAddSubscriptionMutation();
  const addFollowerSubscription = async (email?: string) => {
    let payload: Partial<ISubscription> = {};

    if (org) {
      payload.orgs = [
        {
          org,
          orgId: org._id,
          type: ESubscriptionType.FOLLOWER,
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
        ...payload,
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
  const onSubmit = async ({ email }: { email?: string }) => {
    if (!email) return;
    setIsLoading(true);
    dispatch(setUserEmail(email));
    await addFollowerSubscription(email);
    setIsLoading(false);
  };
  //#endregion

  if (!org && !event) return null;

  if (!userEmail)
    return (
      <Popover isLazy isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <PopoverTrigger>
          <Button
            isLoading={isLoading}
            leftIcon={<BellIcon boxSize={6} />}
            colorScheme="teal"
            onClick={async () => {
              setIsOpen(!isOpen);
            }}
            data-cy="subscribe-button"
          >
            S'abonner
          </Button>
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

  if (isFollowed)
    return (
      <SubscriptionEditPopover
        event={event}
        org={org}
        notifType={notifType}
        userEmail={userEmail}
      />
    );

  return (
    <Button
      isLoading={isLoading}
      leftIcon={<BellIcon boxSize={6} />}
      colorScheme="teal"
      onClick={async () => {
        setIsLoading(true);
        await addFollowerSubscription();
        setIsLoading(false);
      }}
      data-cy="subscribe-button"
    >
      S'abonner
    </Button>
  );
};
