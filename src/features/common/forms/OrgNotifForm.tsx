import { HamburgerIcon, EmailIcon } from "@chakra-ui/icons";
import {
  RadioGroup,
  Stack,
  Radio,
  Spinner,
  FormControl,
  CheckboxGroup,
  Table,
  Tbody,
  Tr,
  Td,
  Flex,
  Checkbox,
  FormErrorMessage
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import React, { Fragment, useState } from "react";
import { useForm } from "react-hook-form";
import { IEvent } from "models/Event";
import { orgTypeFull, getSubscriptions, IOrg } from "models/Org";
import { SubscriptionTypes } from "models/Subscription";
import { ITopic } from "models/Topic";
import { hasItems } from "utils/array";
import { Spacer, EmailControl, EntityButton, Button } from "..";

export const OrgNotifForm = ({
  entity,
  org,
  query,
  onCancel,
  onSubmit
}: {
  entity: IEvent<string | Date> | ITopic;
  org: IOrg;
  query: any;
  onCancel: () => void;
  onSubmit: (
    form: { email?: string; orgListsNames?: string[] },
    type: "single" | "multi"
  ) => Promise<void>;
}) => {
  const {
    control,
    register,
    handleSubmit,
    errors,
    setError,
    clearErrors,
    watch,
    setValue,
    getValues,
    trigger
  } = useForm({
    mode: "onChange"
  });
  const orgListsNames = watch("orgListsNames");
  const [isLoading, setIsLoading] = useState(false);
  const [type, setType] = useState<"multi" | "single">();

  return (
    <form
      onSubmit={handleSubmit(async (form: { orgListsNames: string[] }) => {
        setIsLoading(true);
        await onSubmit(form, type);
        setIsLoading(false);
      })}
    >
      <RadioGroup name="type" my={3}>
        <Stack spacing={2}>
          <Radio
            isChecked={type === "multi"}
            onChange={() => {
              setType("multi");
            }}
          >
            Envoyer l'invitation à une ou plusieurs listes de diffusion
          </Radio>
          <Radio
            isChecked={type === "single"}
            onChange={() => {
              setType("single");
            }}
          >
            Envoyer l'invitation à une seule adresse e-mail
          </Radio>
        </Stack>
      </RadioGroup>
      {query.isLoading && <Spinner />}

      {(type === "single" || type === "multi") && (
        <Spacer borderWidth={1} mb={3} />
      )}

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
        />
      )}
      {type === "multi" && !query.isLoading && (
        <FormControl isInvalid={!!errors.orgListsNames} isRequired>
          <CheckboxGroup>
            <Table>
              <Tbody>
                <Fragment key={org._id}>
                  <Tr>
                    <Td pl={0} pt={0} colSpan={2}>
                      <Flex alignItems="center">
                        <HamburgerIcon mr={2} />
                        Listes de diffusion {orgTypeFull(org.orgType)}
                        <EntityButton org={org} pl={1} pr={2} py={1} ml={2} />
                      </Flex>
                    </Td>
                  </Tr>

                  {(org.orgLists || [])
                    .concat([
                      {
                        listName: "Liste des abonnés",
                        subscriptions: getSubscriptions(
                          org,
                          SubscriptionTypes.FOLLOWER
                        )
                      },
                      {
                        listName: "Liste des adhérents",
                        subscriptions: getSubscriptions(
                          org,
                          SubscriptionTypes.SUBSCRIBER
                        )
                      }
                    ])
                    .map((orgList) => {
                      let i = 0;
                      for (const subscription of orgList.subscriptions) {
                        if (
                          entity.eventNotified?.find(({ email, phone }) => {
                            return (
                              email === subscription.email ||
                              phone === subscription.phone
                            );
                          })
                        )
                          continue;

                        i++;
                      }
                      const s = i !== 1 ? "s" : "";

                      return (
                        <Tr key={orgList.listName}>
                          <Td>
                            <Checkbox
                              name="orgListsNames"
                              ref={register({
                                required:
                                  "Veuillez sélectionner une liste au minimum"
                              })}
                              value={orgList.listName + "." + org._id}
                              icon={<EmailIcon />}
                              isDisabled={i === 0}
                            >
                              {orgList.listName}
                            </Checkbox>
                          </Td>
                          <Td>
                            {i} membre{s} n'{s ? "ont" : "a"} pas été invité
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
      <Flex justifyContent="space-between" mt={3}>
        <Button onClick={onCancel}>Annuler</Button>

        {(type === "single" || hasItems(orgListsNames)) && (
          <Button
            colorScheme="green"
            type="submit"
            isLoading={isLoading}
            isDisabled={Object.keys(errors).length > 0}
          >
            Envoyer {type === "single" ? "l'invitation" : "les invitations"}
          </Button>
        )}
      </Flex>
    </form>
  );
};
