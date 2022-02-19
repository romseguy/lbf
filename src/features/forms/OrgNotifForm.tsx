import { HamburgerIcon, EmailIcon } from "@chakra-ui/icons";
import {
  RadioGroup,
  Stack,
  Radio,
  Spinner,
  FormControl,
  CheckboxGroup,
  Text,
  Table,
  Tbody,
  Tr,
  Td,
  Flex,
  Checkbox,
  FormErrorMessage,
  Box,
  useColorMode,
  Heading,
  Alert,
  AlertIcon
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import React, { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { css } from "twin.macro";
import {
  EmailControl,
  EntityButton,
  Button,
  ErrorMessageText
} from "features/common";
import { IEvent } from "models/Event";
import { orgTypeFull, getSubscriptions, IOrg, getLists } from "models/Org";
import { ESubscriptionType } from "models/Subscription";
import { ITopic } from "models/Topic";
import { hasItems } from "utils/array";
import { isTopic } from "utils/models";
import { equalsValue } from "utils/string";
import { AppQuery } from "utils/types";

export const OrgNotifForm = ({
  entity,
  org,
  query,
  onCancel,
  onSubmit
}: {
  entity: IEvent<string | Date> | ITopic;
  org: IOrg;
  query: AppQuery<IOrg>;
  onCancel?: () => void;
  onSubmit: (
    form: { email?: string; orgListsNames?: string[] },
    type?: "single" | "multi"
  ) => Promise<void>;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  //#region local state
  const isT = isTopic(entity);
  const [isLoading, setIsLoading] = useState(false);
  const lists = getLists(org);
  const [type, setType] = useState<"multi" | "single">();
  //#endregion

  //#region form
  const { control, register, handleSubmit, errors, watch, setValue } = useForm({
    mode: "onChange"
  });
  const email = watch("email");
  const orgListsNames = watch("orgListsNames");
  //#endregion

  return (
    <form
      onSubmit={handleSubmit(async (form: { orgListsNames: string[] }) => {
        setIsLoading(true);
        await onSubmit(form, type);
        setIsLoading(false);
      })}
    >
      <RadioGroup name="type" cursor="pointer" my={3}>
        <Stack spacing={2}>
          <Radio
            isChecked={type === "multi"}
            onChange={() => {
              setType("multi");
            }}
          >
            Inviter les membres d'une ou plusieurs listes à{" "}
            {isT ? "cette discussion" : "cet événement"}
          </Radio>
          <Radio
            isChecked={type === "single"}
            onChange={() => {
              setType("single");
            }}
          >
            Inviter une personne à {isT ? "cette discussion" : "cet événement"}
          </Radio>
        </Stack>
      </RadioGroup>

      {query.isLoading && <Spinner />}

      {type !== undefined && (
        <Box
          bg={isDark ? "gray.500" : "orange.100"}
          borderRadius="lg"
          p={3}
          mb={3}
          mt={1}
        >
          {type === "single" && !query.isLoading && (
            <EmailControl
              name="email"
              noLabel
              control={control}
              register={register}
              setValue={setValue}
              errors={errors}
              placeholder="Envoyer à cette adresse e-mail uniquement"
              isMultiple={false}
              inputProps={{ bg: isDark ? "gray.700" : "white" }}
            />
          )}

          {type === "multi" && !query.isLoading && (
            <FormControl isInvalid={!!errors.orgListsNames} isRequired>
              <CheckboxGroup>
                <Table>
                  <Tbody
                    css={css`
                      td {
                        border-bottom-color: ${isDark ? "white" : "lightgray"};
                      }
                    `}
                  >
                    <Fragment key={org._id}>
                      <Tr>
                        <Td pl={0} pt={0} colSpan={2}>
                          <Flex alignItems="center">
                            <HamburgerIcon mr={2} />
                            <Heading
                              display="flex"
                              alignItems="center"
                              size="sm"
                            >
                              Listes de diffusion {orgTypeFull(org.orgType)}
                              <EntityButton
                                org={org}
                                pl={1}
                                pr={2}
                                py={1}
                                ml={2}
                              />
                            </Heading>
                          </Flex>
                        </Td>
                      </Tr>

                      {lists?.map((list) => {
                        let i = 0;
                        for (const subscription of list.subscriptions || []) {
                          const notified = isT
                            ? entity.topicNotifications
                            : entity.eventNotifications;

                          if (
                            notified?.find(({ email, phone }) =>
                              typeof subscription.user === "object"
                                ? equalsValue(subscription.user.email, email) ||
                                  equalsValue(subscription.user.phone, phone)
                                : equalsValue(email, subscription.email) ||
                                  equalsValue(phone, subscription.phone)
                            )
                          )
                            continue;

                          i++;
                        }
                        const s = i !== 1 ? "s" : "";

                        return (
                          <Tr
                            key={list.listName}
                            bg={isDark ? undefined : "white"}
                          >
                            <Td>
                              <Checkbox
                                name="orgListsNames"
                                ref={register({
                                  required:
                                    "Veuillez sélectionner une liste au minimum"
                                })}
                                value={list.listName + "." + org._id}
                                icon={<EmailIcon />}
                                isDisabled={i === 0}
                              >
                                {list.listName}
                              </Checkbox>
                            </Td>
                            <Td>
                              {!hasItems(list.subscriptions) ? (
                                list.listName === "Abonnés" ? (
                                  "0 abonnés"
                                ) : list.listName === "Adhérents" ? (
                                  "0 adhérents"
                                ) : (
                                  "0 membres"
                                )
                              ) : (
                                <Text>
                                  {i} membre{s} n'{s ? "ont" : "a"} pas été
                                  invité
                                </Text>
                              )}
                            </Td>
                          </Tr>
                        );
                      })}
                    </Fragment>
                  </Tbody>
                </Table>
              </CheckboxGroup>
              <FormErrorMessage>
                <ErrorMessage errors={errors} name="orgListsNames" />
              </FormErrorMessage>
            </FormControl>
          )}

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

          <Flex justifyContent="space-between" mt={3}>
            {onCancel && <Button onClick={onCancel}>Annuler</Button>}

            {type && (
              <Button
                colorScheme="green"
                type="submit"
                isLoading={isLoading}
                isDisabled={
                  Object.keys(errors).length > 0 ||
                  (type === "single" && !email) ||
                  (type === "multi" && !hasItems(orgListsNames))
                }
              >
                Envoyer {type === "single" ? "l'invitation" : "les invitations"}
              </Button>
            )}
          </Flex>
        </Box>
      )}
    </form>
  );
};
