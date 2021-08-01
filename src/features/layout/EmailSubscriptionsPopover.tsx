import type { ISubscription, IOrgSubscription } from "models/Subscription";
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
  BoxProps
} from "@chakra-ui/react";
import { ErrorMessageText, Link } from "features/common";
import { useSession } from "hooks/useAuth";
import {
  ArrowForwardIcon,
  ArrowRightIcon,
  EmailIcon,
  WarningIcon
} from "@chakra-ui/icons";
import { useForm } from "react-hook-form";
import { emailR } from "utils/email";
import { ErrorMessage } from "@hookform/error-message";
import { getSubscription } from "features/subscriptions/subscriptionsApi";
import { useAppDispatch } from "store";
import { handleError } from "utils/form";
import { IoMdCheckmarkCircle } from "react-icons/io";

export const EmailSubscriptionsPopover = (
  props: BoxProps & { email?: string }
) => {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    setMySubscription(undefined);
  }, [session]);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const xhr = async () => {
      if (props.email) {
        const { error, data } = await dispatch(
          getSubscription.initiate(props.email)
        );
        if (error) console.error(error);
        else setMySubscription(data);
      }
    };

    xhr();
  }, [props.email]);

  const [isOpen, setIsOpen] = useState(false);
  const [currentOrgSubscription, setCurrentOrgSubscription] =
    useState<IOrgSubscription>();
  const [mySubscription, setMySubscription] = useState<ISubscription>();
  const userEmail = mySubscription?.email || mySubscription?.user?.email;

  const iconHoverColor = useColorModeValue("white", "lightgreen");
  const {
    isOpen: isOrgSubscriptionModalOpen,
    onOpen,
    onClose
  } = useDisclosure();

  // const {
  //   data: mySubscription,
  //   refetch,
  //   isLoading
  // } = useGetSubscriptionQuery(session.user.userId);

  // useEffect(() => {
  //   refetch();
  // }, [router.asPath]);

  const { clearErrors, errors, setError, handleSubmit, register } = useForm({
    mode: "onChange"
  });

  const onChange = () => {
    clearErrors("formErrorMessage");
  };

  const onSubmit = async ({ email }: { email: string }) => {
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
        <Box>
          <>
            {mySubscription && mySubscription.orgs && (
              <>
                <Heading size="sm">Organisations</Heading>
                <List py={2}>
                  {mySubscription.orgs.map((orgSubscription, index) => (
                    <ListItem mb={1} key={index}>
                      <ListIcon as={IoMdCheckmarkCircle} color="green.500" />{" "}
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
                    </ListItem>
                  ))}
                </List>
              </>
            )}
          </>
        </Box>
      </PopoverBody>
    </PopoverContent>
  );

  return (
    <Box {...props}>
      <Popover isLazy isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <PopoverTrigger>
          <IconButton
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Abonnements"
            bg="transparent"
            _hover={{ bg: "transparent" }}
            icon={
              <Icon
                as={EmailIcon}
                _hover={{ color: iconHoverColor }}
                boxSize={14}
              />
            }
            data-cy="subscriptionPopover"
          />
        </PopoverTrigger>
        {!mySubscription && !session ? step1 : step2}
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
