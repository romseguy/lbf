import type { IOrg } from "models/Org";
import { Category, IEvent } from "models/Event";
import type {
  IEventSubscription,
  IOrgSubscription,
  ISubscription
} from "models/Subscription";
import React, { useEffect, useState } from "react";
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
  Tooltip,
  Box,
  Checkbox,
  CheckboxGroup,
  VStack,
  FormLabel,
  useToast,
  PopoverHeader,
  Text
} from "@chakra-ui/react";
import { useSession } from "hooks/useAuth";
import { BellIcon, EmailIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import { emailR } from "utils/email";
import { ErrorMessage } from "@hookform/error-message";
import {
  useAddSubscriptionMutation,
  useDeleteSubscriptionMutation,
  useEditSubscriptionMutation
} from "./subscriptionsApi";
import { SubscriptionTypes } from "models/Subscription";
import { useAppDispatch } from "store";
import { selectUserEmail, setUserEmail } from "features/users/userSlice";
import { useSelector } from "react-redux";
import { refetchSubscription } from "./subscriptionSlice";

const setAllItems = (
  checked: boolean
): { [key: number]: { checked: boolean } } =>
  Object.keys(Category).reduce((obj, key) => {
    const k = parseInt(key);
    if (k === 0) return obj;
    return { ...obj, [k]: { checked } };
  }, {});

export const SubscriptionPopover = ({
  org,
  event,
  query,
  subQuery,
  followerSubscription,
  notifType = "email",
  ...props
}: {
  org?: IOrg;
  event?: IEvent;
  query: any;
  subQuery: any;
  email?: string;
  followerSubscription?: IOrgSubscription | IEventSubscription;
  notifType?: "email" | "push";
  isLoading?: boolean;
  onSubmit?: (subscribed: boolean) => void;
}) => {
  if (!org && !event) return null;

  const { data: session } = useSession();
  const toast = useToast({ position: "top" });
  const dispatch = useAppDispatch();

  const userEmail = useSelector(selectUserEmail) || session?.user.email;
  const [addSubscription, addSubscriptionMutation] =
    useAddSubscriptionMutation();
  const [editSubscription, editSubscriptionMutation] =
    useEditSubscriptionMutation();
  const [deleteSubscription, deleteSubscriptionMutation] =
    useDeleteSubscriptionMutation();

  //#region local state
  const isStep1 = !userEmail;
  const isStep2 = !!userEmail;
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

  //#region form state
  const { clearErrors, errors, handleSubmit, register } = useForm({
    mode: "onChange"
  });

  const [checkedItems, setCheckedItems] = useState<{
    [key: number]: {
      checked: boolean;
    };
  }>({});
  useEffect(() => {
    if (subQuery.data)
      setCheckedItems(
        Object.keys(Category).reduce((obj, key) => {
          const k = parseInt(key);
          if (k === 0) return obj;
          if (
            !followerSubscription ||
            !("eventCategories" in followerSubscription)
          ) {
            console.log("no follower subscription => uncheck");
            return { ...obj, [k]: { checked: false } };
          }

          if (
            Array.isArray(followerSubscription.eventCategories) &&
            followerSubscription.eventCategories.length === 0
          ) {
            console.log("follower subscription => no selection => checking");
            return { ...obj, [k]: { checked: true } };
          }

          const checked = !!followerSubscription.eventCategories?.find(
            ({ catId, emailNotif, pushNotif }) => {
              return notifType === "email"
                ? catId === k && emailNotif
                : catId === k && pushNotif;
            }
          );

          return {
            ...obj,
            [k]: {
              checked
            }
          };
        }, {})
      );
  }, [subQuery.data]);

  const isAllCheckedItems = Object.keys(checkedItems).every(
    (key) => checkedItems[parseInt(key)].checked
  );
  //#endregion

  const onChange = () => {
    //clearErrors("email");
  };

  const onStep1Submit = async ({ email }: { email?: string }) => {
    if (!email) return;
    setIsLoading(true);
    dispatch(setUserEmail(email));
    dispatch(refetchSubscription());
    setIsLoading(false);
    // setIsOpen(false);
    //props.onSubmit && props.onSubmit(true);
  };

  const step1 = (
    <PopoverContent ml={0}>
      {/* <PopoverCloseButton /> */}
      <PopoverBody>
        <form onChange={onChange} onSubmit={handleSubmit(onStep1Submit)}>
          <FormControl id="email" isRequired isInvalid={!!errors["email"]}>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={notifType === "email" ? <EmailIcon /> : <BellIcon />}
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
      <PopoverFooter>
        <Button
          onClick={handleSubmit(onStep1Submit)}
          colorScheme="green"
          type="submit"
          isLoading={
            addSubscriptionMutation.isLoading || props.isLoading || isLoading
          }
          isDisabled={Object.keys(errors).length > 0}
        >
          Valider
        </Button>
      </PopoverFooter>
    </PopoverContent>
  );

  const onStep2Submit = async () => {
    let payload: Partial<ISubscription> = {};

    if (!subQuery.data || !followerSubscription) {
      if (org) {
        const eventCategories = Object.keys(checkedItems)
          .filter((key) => checkedItems[parseInt(key)].checked)
          .map((key) => {
            const k = parseInt(key);
            return {
              catId: k,
              emailNotif: notifType === "email",
              pushNotif: notifType === "push"
            };
          });
        payload.orgs = [
          {
            org,
            orgId: org._id,
            type: SubscriptionTypes.FOLLOWER,
            eventCategories
          }
        ];
        await addSubscription({ payload }).unwrap();
        toast({
          title: `Vous êtes maintenant abonné à ${
            org ? org.orgName : event!.eventName
          } !`,
          status: "success"
        });
      }
      return;
    }

    if ("eventCategories" in followerSubscription) {
      const eventCategories = Object.keys(checkedItems)
        .filter((key) => checkedItems[parseInt(key)].checked)
        .map((key) => {
          const k = parseInt(key);
          let eventCategory = followerSubscription.eventCategories?.find(
            ({ catId }) => catId === k
          );

          if (eventCategory) {
            console.log("already subscribed to category", eventCategory);
            if (notifType === "email")
              return { ...eventCategory, emailNotif: true };
            else if (notifType === "push")
              return { ...eventCategory, pushNotif: true };
            return eventCategory;
          }

          return {
            catId: k,
            emailNotif: notifType === "email",
            pushNotif: notifType === "push"
          };
        });
      payload.orgs = [{ ...followerSubscription, eventCategories }];

      await addSubscription({
        payload,
        email: userEmail
      }).unwrap();
      query.refetch();
      toast({
        title: `Votre abonnement à ${
          org ? org.orgName : event!.eventName
        } a bien été modifié !`,
        status: "success"
      });
    }
  };

  const step2 = (
    <PopoverContent>
      {/* <PopoverCloseButton /> */}
      <PopoverHeader>{userEmail}</PopoverHeader>
      <PopoverBody>
        <form onChange={onChange} onSubmit={handleSubmit(onStep2Submit)}>
          <FormControl>
            <Checkbox
              mb={1}
              isChecked={isAllCheckedItems}
              isIndeterminate={
                !isAllCheckedItems &&
                Object.keys(checkedItems).some((key) => {
                  const k = parseInt(key);
                  return checkedItems[k].checked;
                })
              }
              onChange={(e) => setCheckedItems(setAllItems(e.target.checked))}
            >
              S'abonner à tous les événements
            </Checkbox>

            <Box ml={3}>
              <FormLabel mb={1}>Catégories</FormLabel>
              {subQuery.isLoading || subQuery.isFetching ? (
                <Text>Chargement...</Text>
              ) : (
                <CheckboxGroup>
                  <VStack alignItems="flex-start">
                    {Object.keys(checkedItems).map((key) => {
                      const k = parseInt(key);
                      const cat = Category[k];

                      return (
                        <Checkbox
                          key={k}
                          isChecked={checkedItems[k].checked}
                          onChange={(e) =>
                            setCheckedItems({
                              ...checkedItems,
                              [k]: { checked: e.target.checked }
                            })
                          }
                        >
                          {cat.label}
                        </Checkbox>
                      );
                    })}
                  </VStack>
                </CheckboxGroup>
              )}
            </Box>
          </FormControl>

          {/* <FormControl>
            <Checkbox
              ref={register()}
              name="projectCategory"
              value="all"
              icon={<EmailIcon />}
            >
              Tous les projets
            </Checkbox>
          </FormControl> */}
        </form>
      </PopoverBody>

      <PopoverFooter>
        <Button
          onClick={handleSubmit(onStep2Submit)}
          colorScheme="green"
          type="submit"
          isDisabled={
            Object.keys(errors).length > 0 ||
            subQuery.isLoading ||
            subQuery.isFetching
          }
          isLoading={
            addSubscriptionMutation.isLoading || props.isLoading || isLoading
          }
        >
          Modifier l'abonnement
        </Button>
      </PopoverFooter>
    </PopoverContent>
  );

  return (
    <Popover isLazy isOpen={isOpen} onClose={() => setIsOpen(false)}>
      {/* <Tooltip {...tooltipProps} placement="top" hasArrow> */}
      <PopoverTrigger>
        <Button
          isLoading={props.isLoading || isLoading}
          leftIcon={notifType === "email" ? <EmailIcon /> : <BellIcon />}
          colorScheme="teal"
          onClick={async () => {
            // delete case
            // const subscriptionEntitySubscriptions = org
            //   ? subQuery.data?.orgs
            //   : subQuery.data?.events;
            // if (
            //   followerSubscription &&
            //   subQuery.data &&
            //   Array.isArray(subscriptionEntitySubscriptions) &&
            //   subscriptionEntitySubscriptions.length > 0
            // ) {
            //   setIsLoading(true);
            //   const payload = org
            //     ? { orgs: [followerSubscription as IOrgSubscription] }
            //     : { events: [followerSubscription as IEventSubscription] };

            //   await deleteSubscription({
            //     subscriptionId: subQuery.data._id,
            //     payload
            //   });
            //   dispatch(refetchSubscription());
            //   setIsLoading(false);
            //   props.onSubmit && props.onSubmit(false);
            //   return;
            // }

            // if (props.email || session) {
            //   onSubmit({
            //     email: props.email || session?.user.email
            //   });
            // } else
            if (isStep1) {
              setIsOpen(!isOpen);
            } else {
              setIsOpen(!isOpen);
            }
          }}
          data-cy="subscribeToOrg"
        >
          {notifType === "email"
            ? "Notifications e-mail"
            : "Notifications mobile"}
        </Button>
      </PopoverTrigger>
      {/* </Tooltip> */}
      {isStep1 ? step1 : step2}
    </Popover>
  );
};
