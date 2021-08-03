import {
  ISubscription,
  IOrgSubscription,
  SubscriptionTypes
} from "models/Subscription";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
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
  ModalFooter,
  Stack,
  Tooltip,
  BoxProps,
  useToast
} from "@chakra-ui/react";
import { ErrorMessageText, Link } from "features/common";
import { useSession } from "hooks/useAuth";
import {
  ArrowForwardIcon,
  ArrowRightIcon,
  DeleteIcon,
  EmailIcon,
  WarningIcon
} from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import { emailR } from "utils/email";
import { ErrorMessage } from "@hookform/error-message";
import {
  getSubscription,
  useDeleteSubscriptionMutation,
  useEditSubscriptionMutation,
  useGetSubscriptionQuery
} from "features/subscriptions/subscriptionsApi";
import { useAppDispatch } from "store";
import { handleError } from "utils/form";
import { IoIosPerson, IoMdCheckmarkCircle } from "react-icons/io";
import { selectUserEmail, setUserEmail } from "features/users/userSlice";
import { useSelector } from "react-redux";
import { subscriptionRefetch } from "features/subscriptions/subscriptionSlice";

export const EmailSubscriptionsPopover = ({
  boxSize,
  ...props
}: BoxProps & { email?: string }) => {
  const router = useRouter();
  const { data: session } = useSession();
  const dispatch = useAppDispatch();

  const [mySubscription, setMySubscription] = useState<ISubscription>();

  const isStep1 = !session && !mySubscription;
  const isStep2 = (!session && mySubscription) || session;

  const userEmail =
    useSelector(selectUserEmail) ||
    mySubscription?.email ||
    mySubscription?.user?.email;

  const subQuery = useGetSubscriptionQuery(props.email || userEmail || "");
  useEffect(() => {
    setMySubscription(subQuery.data);
  }, [subQuery.data]);

  //const [editSubscription, editSubscriptionMutation] = useEditSubscriptionMutation();
  const [deleteSubscription, deleteSubscriptionMutation] =
    useDeleteSubscriptionMutation();

  const [isOpen, setIsOpen] = useState(false);
  const [currentOrgSubscription, setCurrentOrgSubscription] =
    useState<IOrgSubscription>();

  const toast = useToast({ position: "top" });
  const iconHoverColor = useColorModeValue("white", "lightgreen");
  const {
    isOpen: isOrgSubscriptionModalOpen,
    onOpen,
    onClose
  } = useDisclosure();

  const { clearErrors, errors, setError, handleSubmit, register } = useForm({
    mode: "onChange"
  });

  const onChange = () => {
    clearErrors("formErrorMessage");
  };

  const onSubmit = async ({ email }: { email: string }) => {
    dispatch(setUserEmail(email));
    const { error, data } = await dispatch(getSubscription.initiate(email));

    if (error) {
      handleError(error, (message) => {
        setError("formErrorMessage", { type: "manual", message });
      });
    } else {
      setMySubscription(data);
    }
  };

  const step1 = (
    <PopoverContent>
      <PopoverHeader>
        <Heading size="md">Gérer mes abonnements</Heading>
      </PopoverHeader>
      <PopoverBody>
        <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
          <ErrorMessage
            errors={errors}
            name="formErrorMessage"
            render={({ message }) => (
              <Stack isInline p={5} mb={5} shadow="md" color="red.500">
                <WarningIcon boxSize={5} />
                <Box>
                  <ErrorMessageText>{message}</ErrorMessageText>
                </Box>
              </Stack>
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
          onClick={handleSubmit(onSubmit)}
          colorScheme="green"
          type="submit"
          // isLoading={addSubscriptionMutation.isLoading}
          isDisabled={Object.keys(errors).length > 0}
        >
          Valider
        </Button>
      </PopoverFooter>
    </PopoverContent>
  );

  const step2 = (
    <PopoverContent>
      <PopoverHeader>
        <Heading size="md">
          <Link onClick={() => setMySubscription(undefined)}>
            {userEmail || "Mes abonnements"}
          </Link>
        </Heading>
      </PopoverHeader>
      <PopoverCloseButton />
      <PopoverBody>
        <>
          {subQuery.isLoading ? (
            <Spinner />
          ) : (
            <>
              <Heading size="sm">
                Organisations auxquelles vous êtes abonné(e)
              </Heading>

              {mySubscription &&
              Array.isArray(mySubscription.orgs) &&
              mySubscription.orgs.length > 0 ? (
                <List ml={3} my={3}>
                  {mySubscription.orgs
                    .filter(
                      (orgSubscription) =>
                        orgSubscription.type === SubscriptionTypes.FOLLOWER
                    )
                    .map((orgSubscription, index) => (
                      <ListItem mb={1} key={index}>
                        <ListIcon as={EmailIcon} color="green.500" mr={3} />

                        <Link
                          variant="underline"
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
                            {orgSubscription.org.orgName}
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
                                `Êtes vous sûr de vouloir vous désabonner de ${orgSubscription.org.orgName} ?`
                              );

                              if (unsubscribe) {
                                await deleteSubscription({
                                  subscriptionId: mySubscription._id,
                                  payload: {
                                    orgs: [orgSubscription]
                                  }
                                });

                                subQuery.refetch();
                                // so OrgPage knows
                                dispatch(subscriptionRefetch());

                                toast({
                                  title: `Vous avez été désabonné de ${orgSubscription.org.orgName}`,
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
                  Vous n'êtes abonné à aucune organisation.
                </Text>
              )}

              <Heading size="sm">
                Événements auxquels vous êtes abonné(e)
              </Heading>
              <Text fontSize="smaller" ml={3} my={2}>
                {mySubscription?.email
                  ? "Cet e-mail n'est abonnée à aucun événement."
                  : "Vous n'êtes abonné à aucun événement."}
              </Text>
            </>
          )}
        </>
      </PopoverBody>
    </PopoverContent>
  );

  return (
    <Box {...props}>
      <Popover isLazy isOpen={isOpen} onClose={() => setIsOpen(false)}>
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
              <Text display="inline">{currentOrgSubscription.org.orgName}</Text>{" "}
              <ArrowForwardIcon /> <EmailIcon color="green" />{" "}
              <ArrowForwardIcon /> {userEmail}
            </ModalHeader>
            <ModalCloseButton ml={5} data-cy="subscriptionPopoverCloseButton" />
            <ModalBody>
              TODO!
              {/* <OrgSubscriptionForm
                onCancel={onClose}
                onSubmit={async (subscriptionName) => {
                  onClose();
                  await router.push(`/${encodeURIComponent(subscriptionName)}`);
                }}
                onClose={() => {
                  onClose();
                }}
              /> */}
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
};
