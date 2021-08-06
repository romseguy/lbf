import type { IOrg } from "models/Org";
import type { IEvent } from "models/Event";
import type { ISubscription } from "models/Subscription";
import React, { useState } from "react";
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
  FormErrorMessage
} from "@chakra-ui/react";
import { useSession } from "hooks/useAuth";
import { EmailIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import { emailR } from "utils/email";
import { ErrorMessage } from "@hookform/error-message";
import {
  useAddSubscriptionMutation,
  useDeleteSubscriptionMutation
} from "./subscriptionsApi";
import { SubscriptionTypes } from "models/Subscription";
import { useAppDispatch } from "store";
import {
  selectSubscribedEmail,
  setSubscribedEmail
} from "features/users/userSlice";
import { useSelector } from "react-redux";
import { refetchSubscription } from "./subscriptionSlice";

export const SubscriptionPopover = ({
  org,
  event,
  mySubscription,
  isFollowed,
  ...props
}: {
  org?: IOrg;
  event?: IEvent;
  mySubscription?: ISubscription;
  isFollowed?: boolean;
  isLoading?: boolean;
  onSubmit?: (subscribed: boolean) => void;
}) => {
  const { data: session } = useSession();
  const dispatch = useAppDispatch();
  const subscribedEmail = useSelector(selectSubscribedEmail);

  const [addSubscription, addSubscriptionMutation] =
    useAddSubscriptionMutation();
  const [deleteSubscription, deleteSubscriptionMutation] =
    useDeleteSubscriptionMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { clearErrors, errors, handleSubmit, register } = useForm({
    mode: "onChange"
  });

  const onChange = () => {
    //clearErrors("email");
  };

  const onSubmit = async ({ email }: { email: string }) => {
    setIsLoading(true);

    if (org) {
      await addSubscription({
        payload: {
          orgs: [
            {
              orgId: org._id,
              org,
              type: SubscriptionTypes.FOLLOWER
            }
          ]
        },
        email
      });
    } else if (event) {
      await addSubscription({
        payload: {
          events: [
            {
              event
            }
          ]
        },
        email
      });
    }

    dispatch(setSubscribedEmail(email));
    dispatch(refetchSubscription());
    setIsLoading(false);
    setIsOpen(false);
    props.onSubmit && props.onSubmit(true);
  };

  return (
    <Popover isLazy isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <PopoverTrigger>
        <Button
          isLoading={props.isLoading || isLoading}
          leftIcon={<EmailIcon />}
          colorScheme="teal"
          onClick={async () => {
            if (
              isFollowed &&
              org &&
              mySubscription &&
              Array.isArray(mySubscription.orgs) &&
              mySubscription.orgs.length > 0
            ) {
              setIsLoading(true);

              const orgSubscription = mySubscription.orgs.find(
                (orgSubscription) => {
                  return orgSubscription.orgId === org._id;
                }
              );

              if (orgSubscription) {
                await deleteSubscription({
                  subscriptionId: mySubscription._id,
                  payload: {
                    orgs: [orgSubscription]
                  }
                });
              }

              setIsLoading(false);
              props.onSubmit && props.onSubmit(false);
            } else {
              if (subscribedEmail || session) {
                onSubmit({ email: subscribedEmail || session.user.email });
              } else setIsOpen(!isOpen);
            }
          }}
          data-cy="subscribeToOrg"
        >
          {isFollowed ? "Se désabonner" : "S'abonner"}
        </Button>
      </PopoverTrigger>
      <PopoverContent ml={5}>
        {/* <PopoverCloseButton /> */}
        <PopoverBody>
          <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
            <FormControl id="email" isRequired isInvalid={!!errors["email"]}>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<EmailIcon />}
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
          </form>
        </PopoverBody>
        <PopoverFooter display="flex" justifyContent="space-between">
          <Button colorScheme="gray" onClick={() => setIsOpen(false)}>
            Annuler
          </Button>

          <Button
            onClick={handleSubmit(onSubmit)}
            colorScheme="green"
            type="submit"
            isLoading={
              addSubscriptionMutation.isLoading || props.isLoading || isLoading
            }
            isDisabled={Object.keys(errors).length > 0}
          >
            S'abonner
          </Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};
