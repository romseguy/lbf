import {
  Alert,
  AlertIcon,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  useColorMode,
  useToast
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import React from "react";
import { useForm } from "react-hook-form";
import {
  useEditSettingMutation,
  useGetSettingsQuery
} from "features/api/settingsApi";
import { ErrorMessageText } from "features/common";
import { handleError } from "utils/form";

import { selectIsMobile } from "store/uiSlice";
import { useSelector } from "react-redux";

interface AdminSettingsFormState {
  networkLabel: string;
}

export const AdminSettingsForm = ({
  setIsLoading
}: {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const isMobile = useSelector(selectIsMobile);
  const toast = useToast({ position: "top" });

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

  const onSubmit = async (form: AdminSettingsFormState) => {
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
    <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
      {networkLabelSetting && (
        <FormControl isRequired isInvalid={!!errors["networkLabel"]} mb={3}>
          <FormLabel>Network label</FormLabel>
          <Input
            name="networkLabel"
            ref={register({
              required: "Veuillez saisir la dénomination"
            })}
            defaultValue={networkLabelSetting.settingValue}
            placeholder="Exemple : atelier"
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
  );
};
