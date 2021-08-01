import type { IOrg } from "models/Org";
import type { IEvent } from "models/Event";
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
import { useAddSubscriptionMutation } from "./subscriptionsApi";
import { SubscriptionTypes } from "models/Subscription";

export const SubscriptionPopover = ({
  org,
  event,
  isDisabled,
  ...props
}: {
  org?: IOrg;
  event?: IEvent;
  isDisabled?: boolean;
  onSubmit?: () => void;
}) => {
  const { data: session } = useSession();
  const [addSubscription, addSubscriptionMutation] =
    useAddSubscriptionMutation();
  const [isOpen, setIsOpen] = useState(false);
  // const [isSubscribing, setIsSubscribing] = useState(false);
  const { clearErrors, errors, handleSubmit, register } = useForm({
    mode: "onChange"
  });

  const onChange = () => {
    //clearErrors("email");
  };

  const onSubmit = async ({ email }: { email: string }) => {
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

    setIsOpen(false);
    props.onSubmit && props.onSubmit();
  };

  return (
    <Popover isLazy isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <PopoverTrigger>
        <Button
          isDisabled={isDisabled}
          leftIcon={<EmailIcon />}
          colorScheme="teal"
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          {isDisabled ? "Abonné" : "S'abonner"}
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
            isLoading={addSubscriptionMutation.isLoading}
            isDisabled={Object.keys(errors).length > 0}
          >
            S'abonner
          </Button>
        </PopoverFooter>
      </PopoverContent>
    </Popover>
  );
};
