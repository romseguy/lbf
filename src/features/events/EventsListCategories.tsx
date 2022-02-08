import {
  AddIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  Icon,
  SettingsIcon
} from "@chakra-ui/icons";
import {
  Alert,
  AlertIcon,
  Badge,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SpaceProps,
  Table,
  Tag,
  Tbody,
  Td,
  Text,
  Tooltip,
  Tr,
  useColorMode,
  useDisclosure,
  useToast
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import { Session } from "next-auth";
import React, { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { IoIosPeople } from "react-icons/io";
import { DeleteButton, ErrorMessageText } from "features/common";
import { useEditOrgMutation } from "features/orgs/orgsApi";
import { useEditUserMutation } from "features/users/usersApi";
import { EventCategory, IEvent } from "models/Event";
import { IOrg, IOrgEventCategory, orgTypeFull } from "models/Org";
import api from "utils/api";
import { handleError } from "utils/form";

export const EventsListCategories = ({
  events,
  org,
  orgQuery,
  selectedCategories,
  setSelectedCategories,
  session,
  isLogin,
  setIsLogin,
  ...props
}: SpaceProps & {
  events: IEvent<string | Date>[];
  org?: IOrg;
  orgQuery?: { refetch: () => void };
  selectedCategories: number[];
  setSelectedCategories: (selectedCategories: number[]) => void;
  session: Session | null;
  isLogin: number;
  setIsLogin: (isLogin: number) => void;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const toast = useToast({ position: "top" });

  const [editUser, editUserMutation] = useEditUserMutation();
  const [editOrg, editOrgMutation] = useEditOrgMutation();

  const {
    isOpen: isCategoriesModalOpen,
    onOpen: openCategoriesModal,
    onClose: closeCategoriesModal
  } = useDisclosure();
  const onClose = () => {
    setIsAdd(false);
    closeCategoriesModal();
  };

  const categories = useMemo((): IOrgEventCategory[] => {
    if (org && org.orgEventCategories) return org.orgEventCategories;

    let arr = [];

    for (const key of Object.keys(EventCategory)) {
      if (key === "0") continue;
      arr.push(EventCategory[parseInt(key)]);
    }

    return arr;
  }, [org]);

  const [isAdd, setIsAdd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { errors, handleSubmit, register, setError } = useForm();

  const onSubmit = async (form: { category: string }) => {
    setIsLoading(true);
    try {
      await editOrg({
        orgUrl: org?.orgUrl,
        payload: {
          orgEventCategories: org?.orgEventCategories
            ? org.orgEventCategories.concat({
                index: `${org.orgEventCategories.length}`,
                label: form.category
              })
            : categories.concat({ index: "0", label: form.category })
        }
      });
      toast({ status: "success", title: "La catégorie a bien été ajoutée !" });
      orgQuery?.refetch();
      setIsLoading(false);
      setIsAdd(false);
    } catch (error) {
      setIsLoading(false);
      handleError(error, (message, field) => {
        setError(field || "formErrorMessage", {
          type: "manual",
          message
        });
      });
    }
  };

  return (
    <Flex flexWrap="nowrap" overflowX="auto" {...props}>
      {categories.map((category) => {
        const { bgColor = "gray" } = category;
        const index = parseInt(category.index);
        const eventsCount = events.filter(
          (event) => event.eventCategory === index
        ).length;
        const isSelected = selectedCategories.includes(index);

        return (
          <Link
            key={index}
            variant="no-underline"
            onClick={() => {
              setSelectedCategories(
                selectedCategories.includes(index)
                  ? selectedCategories.filter((sC) => sC !== index)
                  : selectedCategories.concat([index])
              );
            }}
          >
            <Tag
              variant={isSelected ? "solid" : "outline"}
              color={isDark ? "white" : isSelected ? "white" : "black"}
              bgColor={
                isSelected
                  ? bgColor === "transparent"
                    ? isDark
                      ? "whiteAlpha.300"
                      : "blackAlpha.600"
                    : bgColor
                  : undefined
              }
              mr={1}
              whiteSpace="nowrap"
            >
              {category.label}{" "}
              {eventsCount > 0 && (
                <Badge colorScheme="green" ml={1}>
                  {eventsCount}
                </Badge>
              )}
            </Tag>
          </Link>
        );
      })}

      {session && org && (
        <>
          <Tooltip label="Gérer les catégories d'événement">
            <IconButton
              aria-label="Gérer les catégories d'événement"
              icon={<SettingsIcon />}
              size="xs"
              _hover={{ bg: "teal", color: "white" }}
              onClick={openCategoriesModal}
            />
          </Tooltip>

          <Modal
            closeOnOverlayClick={false}
            isOpen={isCategoriesModalOpen}
            onClose={onClose}
          >
            <ModalOverlay />
            <ModalContent maxWidth="xl">
              <ModalHeader display="flex" flexDirection="column">
                <Flex alignItems="center">
                  <Icon as={IoIosPeople} color="green" mr={3} boxSize={6} />
                  {org.orgName}
                </Flex>
                <Flex alignItems="center">
                  <SettingsIcon mr={3} />
                  Catégories d'événements
                </Flex>
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Button
                  colorScheme="teal"
                  rightIcon={isAdd ? <ChevronDownIcon /> : <ChevronRightIcon />}
                  mb={5}
                  onClick={() => {
                    setIsAdd(!isAdd);
                  }}
                >
                  Ajouter une catégorie
                </Button>

                {isAdd ? (
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <FormControl
                      isInvalid={!!errors.category}
                      isRequired
                      mb={3}
                    >
                      <FormLabel>Nom de la catégorie</FormLabel>
                      <Input
                        name="category"
                        ref={register({
                          required: "Veuillez saisir un nom de catégorie"
                        })}
                      />
                      <FormErrorMessage>
                        <ErrorMessage errors={errors} name="category" />
                      </FormErrorMessage>
                    </FormControl>

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

                    <Flex justifyContent="space-between">
                      <Button onClick={() => setIsAdd(false)}>Annuler</Button>
                      <Button
                        colorScheme="green"
                        isLoading={isLoading}
                        type="submit"
                      >
                        Ajouter
                      </Button>
                    </Flex>
                  </form>
                ) : categories.length > 0 ? (
                  <Table>
                    <Tbody>
                      {categories.map(({ label }) => (
                        <Tr key={`cat-${label}`}>
                          <Td>{label}</Td>
                          <Td textAlign="right">
                            <DeleteButton
                              isIconOnly
                              placement="bottom"
                              header={
                                <>
                                  Êtes vous sûr de vouloir supprimer la
                                  catégorie{" "}
                                  <Text
                                    display="inline"
                                    color="red"
                                    fontWeight="bold"
                                  >
                                    {label}
                                  </Text>{" "}
                                  ?
                                </>
                              }
                              onClick={async () => {
                                try {
                                  await editOrg({
                                    orgUrl: org.orgUrl,
                                    payload: [
                                      `orgEventCategories.label=${label}`
                                    ]
                                  });
                                  orgQuery?.refetch();
                                  toast({
                                    status: "success",
                                    title: "La catégorie a bien été supprimée !"
                                  });
                                } catch (error) {
                                  console.error(error);
                                  toast({
                                    status: "error",
                                    title:
                                      "La catégorie n'a pas pu être supprimée"
                                  });
                                }
                              }}
                            />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                ) : (
                  <Alert status="warning">
                    <AlertIcon />
                    Aucune catégories
                  </Alert>
                )}
              </ModalBody>
            </ModalContent>
          </Modal>
        </>
      )}

      {!org && (
        <Tooltip label="Suggérer une nouvelle catégorie">
          <IconButton
            aria-label="Suggérer une nouvelle catégorie"
            colorScheme="teal"
            icon={<AddIcon />}
            size="xs"
            onClick={async () => {
              if (!session) {
                setIsLogin(isLogin + 1);
              } else {
                const category = prompt(
                  "Entrez le nom de la nouvelle catégorie que vous voulez proposer"
                );

                if (category) {
                  try {
                    const { error } = await api.post(`admin/suggestCategory`, {
                      category
                    });

                    if (error) throw error;

                    await editUser({
                      slug: session.user.userName,
                      payload: {
                        suggestedCategoryAt: new Date().toISOString()
                      }
                    });

                    toast({
                      status: "success",
                      title: "Merci de votre contribution !",
                      isClosable: true
                    });
                  } catch (error: any) {
                    toast({
                      duration: null,
                      status: "error",
                      title:
                        error.message ||
                        "Une erreur est survenue, merci de reporter le bug sur le forum",
                      isClosable: true
                    });
                  }
                }
              }
            }}
          />
        </Tooltip>
      )}
    </Flex>
  );
};
