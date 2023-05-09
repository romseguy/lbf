import {
  Button,
  Flex,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Tabs,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Spinner,
  Text,
  Alert,
  AlertIcon,
  useColorMode,
  useToast
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  useEditSettingMutation,
  useGetSettingsQuery
} from "features/api/settingsApi";
import {
  ErrorMessageText,
  TabContainer,
  TabContainerContent,
  TabContainerHeader
} from "features/common";
import { Layout } from "features/layout";
import { handleError } from "utils/form";

interface AdminFormState {
  networkLabel: string;
}

const AdminPage = () => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const toast = useToast({ position: "top" });

  const [isLoading, setIsLoading] = useState(false);

  const settingsQuery = useGetSettingsQuery();
  const networkLabelSetting = settingsQuery.data?.find(
    ({ settingName }) => settingName === "networkLabel"
  );
  const [editSetting] = useEditSettingMutation();

  const { register, control, errors, clearErrors, setError, handleSubmit } =
    useForm();

  const onChange = () => {
    clearErrors("formErrorMessage");
  };

  const onSubmit = async (form: AdminFormState) => {
    try {
      console.log(form);
      setIsLoading(true);

      if (networkLabelSetting)
        await editSetting({
          settingId: networkLabelSetting._id,
          payload: { settingValue: form.networkLabel }
        }).unwrap();

      toast({
        title: `La modification a été effectuée !`,
        status: "success"
      });

      settingsQuery.refetch();
      setIsLoading(false);
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
    <Layout pageTitle="Administration">
      <Tabs
        background={isDark ? "black" : "lightcyan"}
        borderWidth={1}
        lazyBehavior="keepMounted"
      >
        <TabList>
          <Tab>Réseaux</Tab>
          <Tab>Organisations</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <TabContainer>
              <TabContainerHeader heading="Configuration"></TabContainerHeader>
              <TabContainerContent p={3}>
                {isLoading ||
                settingsQuery.isLoading ||
                settingsQuery.isFetching ? (
                  <Spinner />
                ) : Array.isArray(settingsQuery.data) &&
                  settingsQuery.data.length > 0 ? (
                  <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
                    {networkLabelSetting && (
                      <FormControl
                        isRequired
                        isInvalid={!!errors["networkLabel"]}
                        mb={3}
                      >
                        <FormLabel>Dénomination</FormLabel>
                        <Input
                          name="networkLabel"
                          ref={register({
                            required: "Veuillez saisir la dénomination"
                          })}
                          control={control}
                          defaultValue={networkLabelSetting.settingValue}
                          placeholder="Exemple : planète"
                        />

                        <FormErrorMessage>
                          <ErrorMessage errors={errors} name="networkLabel" />
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

                    <Flex>
                      <Button colorScheme="green" type="submit">
                        Valider
                      </Button>
                    </Flex>
                  </form>
                ) : (
                  <Text fontStyle="italic">Aucun paramètres.</Text>
                )}
              </TabContainerContent>
            </TabContainer>
          </TabPanel>

          <TabPanel>
            <TabContainer>
              <TabContainerHeader heading="Configuration"></TabContainerHeader>
              <TabContainerContent>todoo</TabContainerContent>
            </TabContainer>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Layout>
  );
};

export default AdminPage;
