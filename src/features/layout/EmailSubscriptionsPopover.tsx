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
  const userEmail = useSelector(selectUserEmail) || session?.user.email;

  //#region sub
  const subQuery = useGetSubscriptionQuery(userEmail);
  const subscriptionRefetch = useSelector(selectSubscriptionRefetch);
  useEffect(() => {
    console.log("refetching subscription");
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
  //#endregion

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

  return (
    <Box {...props}>
      <Popover
        isLazy
        isOpen={isOpen}
        offset={[-140, 0]}
        onClose={() => {
          clearErrors("formErrorMessage");
          setIsOpen(false);
        }}
      >
        <PopoverTrigger>
          <IconButton
            onClick={() => {
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
