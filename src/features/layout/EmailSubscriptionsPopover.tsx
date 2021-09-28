import { IOrgSubscription, SubscriptionTypes } from "models/Subscription";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { signIn } from "next-auth/client";
import {
  List,
  ListItem,
  ListIcon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  useColorModeValue,
  Icon,
  useDisclosure,
  IconButton,
  Spinner,
  Box,
  Heading,
  Text,
  Button,
  FormControl,
  InputGroup,
  InputLeftElement,
  Input,
  FormErrorMessage,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Tooltip,
  BoxProps,
  useToast,
  Alert,
  AlertIcon
} from "@chakra-ui/react";
import { ErrorMessageText, Link } from "features/common";
import { useSession } from "hooks/useAuth";
import { ArrowForwardIcon, DeleteIcon, EmailIcon } from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import { emailR } from "utils/email";
import { ErrorMessage } from "@hookform/error-message";
import {
  useDeleteSubscriptionMutation,
  useGetSubscriptionQuery
} from "features/subscriptions/subscriptionsApi";
import { useAppDispatch } from "store";
import { selectUserEmail } from "features/users/userSlice";
import { useSelector } from "react-redux";
import {
  refetchSubscription,
  selectSubscriptionRefetch
} from "features/subscriptions/subscriptionSlice";
import { OrgSubscriptionForm } from "features/forms/OrgSubscriptionForm";

export const EmailSubscriptionsPopover = ({ boxSize, ...props }: BoxProps) => {
  const router = useRouter();
  const { data: session } = useSession();
  const toast = useToast({ position: "top" });
  const dispatch = useAppDispatch();

  //#region sub
  const userEmail = useSelector(selectUserEmail) || session?.user.email;
  const subQuery = useGetSubscriptionQuery(userEmail);
  const subscriptionRefetch = useSelector(selectSubscriptionRefetch);
  useEffect(() => {
    // console.log("refetching subscription");
    subQuery.refetch();
  }, [subscriptionRefetch, userEmail]);
  const orgFollowerSubscriptions = subQuery.data?.orgs.filter(
    (orgSubscription) => orgSubscription.type === SubscriptionTypes.FOLLOWER
  );
  const eventSubscriptions = subQuery.data?.events;
  //const [editSubscription, editSubscriptionMutation] = useEditSubscriptionMutation();
  const [deleteSubscription, deleteSubscriptionMutation] =
    useDeleteSubscriptionMutation();
  //#endregion

  //#region local state
  const isStep1 = !session && (!subQuery.data || subQuery.isError);
  const isStep2 = (!session && subQuery.data) || session;
  const [isOpen, setIsOpen] = useState(false);
  const [currentOrgSubscription, setCurrentOrgSubscription] =
    useState<IOrgSubscription>();
  const [isLoading, setIsLoading] = useState(false);
  //#endregion

  const iconHoverColor = useColorModeValue("white", "lightgreen");
  const {
    isOpen: isOrgSubscriptionModalOpen,
    onOpen,
    onClose
  } = useDisclosure();

  //#region form
  const { clearErrors, errors, setError, handleSubmit, register } = useForm({
    mode: "onChange"
  });

  const onChange = () => {
    clearErrors("formErrorMessage");
  };

  const onSubmit = async ({ email }: { email: string }) => {
    setIsLoading(true);
    try {
      await signIn("email", { email });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
    // dispatch(setUserEmail(email));

    // const { error, data }: { error?: any; data?: ISubscription } =
    //   await dispatch(getSubscription.initiate(email));

    // if (error) {
    //   handleError(error, (message) => {
    //     setError("formErrorMessage", { type: "manual", message });
    //   });
    // } else {
    //   setMySubscription(data);
    // }
  };
  //#endregion

  const step1 = (
    <PopoverContent>
      <PopoverHeader>
        <Heading size="md">Connexion par e-mail</Heading>
      </PopoverHeader>
      <PopoverBody>
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

          <FormControl id="email" isRequired isInvalid={!!errors["email"]}>
            <InputGroup>
              <InputLeftElement pointerEvents="none" children={<EmailIcon />} />

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
        <Button
          colorScheme="gray"
          onClick={() => {
            onChange();
            setIsOpen(false);
          }}
        >
          Annuler
        </Button>

        <Button
          colorScheme="green"
          type="submit"
          isLoading={isLoading}
          isDisabled={Object.keys(errors).length > 0}
          onClick={handleSubmit(onSubmit)}
        >
          Connexion
        </Button>
      </PopoverFooter>
    </PopoverContent>
  );

  const step2 = (
    <PopoverContent>
      <PopoverHeader>
        <Heading size="md">{userEmail || "Mes abonnements"}</Heading>
      </PopoverHeader>
      <PopoverCloseButton />
      <PopoverBody>
        <>
          {subQuery.isLoading || subQuery.isFetching ? (
            <Spinner />
          ) : (
            <>
              <Heading size="sm">Organisations où je suis abonné :</Heading>

              {Array.isArray(orgFollowerSubscriptions) &&
              orgFollowerSubscriptions.length > 0 ? (
                <List ml={3} my={3}>
                  {orgFollowerSubscriptions.map((orgSubscription) =>
                    orgSubscription.org?.orgName ? (
                      <ListItem mb={1} key={orgSubscription.orgId}>
                        <ListIcon as={EmailIcon} color="green.500" mr={3} />

                        <Link
                          variant="underline"
                          aria-hidden
                          onClick={() => {
                            onOpen();
                            setCurrentOrgSubscription(orgSubscription);
                          }}
                        >
                          <Tooltip
                            label="Gérer les préférences de communication"
                            hasArrow
                            placement="bottom"
                          >
                            {orgSubscription.org?.orgName}
                          </Tooltip>
                        </Link>

                        <Tooltip
                          label="Se désabonner"
                          hasArrow
                          placement="right"
                        >
                          <IconButton
                            aria-label="Se désabonner"
                            bg="transparent"
                            _hover={{ bg: "transparent", color: "red" }}
                            icon={<DeleteIcon boxSize={4} />}
                            height="auto"
                            minWidth={0}
                            ml={3}
                            onClick={async () => {
                              const unsubscribe = confirm(
                                `Êtes vous sûr de vouloir vous désabonner de ${orgSubscription.org?.orgName} ?`
                              );

                              if (unsubscribe) {
                                if (subQuery.data) {
                                  await deleteSubscription({
                                    subscriptionId: subQuery.data._id,
                                    payload: {
                                      orgs: [orgSubscription]
                                    }
                                  });
                                }

                                subQuery.refetch();
                                // so OrgPage knows
                                dispatch(refetchSubscription());

                                toast({
                                  title: `Vous avez été désabonné de ${orgSubscription.org?.orgName}`,
                                  status: "success",
                                  isClosable: true
                                });
                              }
                            }}
                          />
                        </Tooltip>
                      </ListItem>
                    ) : null
                  )}
                </List>
              ) : (
                <Text fontSize="smaller" ml={3} my={2}>
                  {userEmail
                    ? "Cet e-mail n'est abonnée à aucune organisation."
                    : "Vous n'êtes abonné à aucune organisation."}
                </Text>
              )}

              <Heading size="sm">Événements où je suis abonné :</Heading>

              {Array.isArray(eventSubscriptions) &&
              eventSubscriptions.length > 0 ? (
                <List ml={3} my={3}>
                  {eventSubscriptions.map((eventSubscription) => (
                    <ListItem key={eventSubscription.eventId}>
                      <ListIcon as={EmailIcon} color="green.500" mr={3} />

                      <Link
                        variant="underline"
                        onClick={() => {
                          onOpen();
                          //setCurrentOrgSubscription(orgSubscription);
                        }}
                      >
                        <Tooltip
                          label="Gérer les préférences de communication"
                          hasArrow
                          placement="bottom"
                        >
                          {eventSubscription.event?.eventName}
                        </Tooltip>
                      </Link>

                      <Tooltip label="Se désabonner" hasArrow placement="right">
                        <IconButton
                          aria-label="Se désabonner"
                          bg="transparent"
                          _hover={{ bg: "transparent", color: "red" }}
                          icon={<DeleteIcon boxSize={4} />}
                          height="auto"
                          minWidth={0}
                          ml={3}
                          onClick={async () => {
                            const unsubscribe = confirm(
                              `Êtes vous sûr de vouloir vous désabonner de ${eventSubscription.event?.eventName} ?`
                            );

                            if (unsubscribe) {
                              if (subQuery.data) {
                                await deleteSubscription({
                                  subscriptionId: subQuery.data._id,
                                  payload: {
                                    events: [eventSubscription]
                                  }
                                });
                              }

                              subQuery.refetch();
                              // so EventPage knows
                              dispatch(refetchSubscription());

                              toast({
                                title: `Vous avez été désabonné de ${eventSubscription.event?.eventName}`,
                                status: "success",
                                isClosable: true
                              });
                            }
                          }}
                        />
                      </Tooltip>
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Text fontSize="smaller" ml={3} my={2}>
                  {userEmail
                    ? "Cet e-mail n'est abonnée à aucun événement."
                    : "Vous n'êtes abonné à aucun événement."}
                </Text>
              )}
            </>
          )}
        </>
      </PopoverBody>
    </PopoverContent>
  );

  return (
    <Box {...props}>
      <Popover
        isLazy
        isOpen={isOpen}
        onClose={() => {
          clearErrors("formErrorMessage");
          setIsOpen(false);
        }}
      >
        <PopoverTrigger>
          <IconButton
            onClick={() => {
              if (!isOpen && isStep2) {
                subQuery.refetch();
              }
              setIsOpen(!isOpen);
            }}
            aria-label="Abonnements"
            bg="transparent"
            _hover={{ bg: "transparent" }}
            icon={
              <Icon
                as={EmailIcon}
                _hover={{ color: iconHoverColor }}
                boxSize={boxSize}
              />
            }
            data-cy="subscriptionPopover"
          />
        </PopoverTrigger>
        {isStep1 ? step1 : step2}
      </Popover>

      {currentOrgSubscription && (
        <Modal
          isOpen={isOrgSubscriptionModalOpen}
          onClose={onClose}
          closeOnOverlayClick
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader fontSize="md">
              <Text display="inline">
                {currentOrgSubscription.org?.orgName}
              </Text>{" "}
              <ArrowForwardIcon /> <EmailIcon color="green" />{" "}
              <ArrowForwardIcon /> {userEmail}
            </ModalHeader>
            <ModalCloseButton ml={5} data-cy="subscriptionPopoverCloseButton" />
            <ModalBody>
              <OrgSubscriptionForm
                org={currentOrgSubscription.org}
                onCancel={onClose}
                onSubmit={async () => {
                  onClose();
                }}
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};
