import {
  Alert,
  AlertIcon,
  Box,
  BoxProps,
  FormControl,
  Switch,
  useColorMode
} from "@chakra-ui/react";
import { ErrorMessage } from "@hookform/error-message";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useEditEventMutation } from "features/api/eventsApi";
import { useEditOrgMutation } from "features/api/orgsApi";
import { formBoxProps } from "features/layout/theme";
import { isEvent } from "models/Entity";
import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { handleError } from "utils/form";
import { AppQueryWithData } from "utils/types";
import { ErrorMessageText } from "..";

export const EntityConfigStyles = ({
  query,
  ...props
}: BoxProps & {
  query: AppQueryWithData<IEvent | IOrg>;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const [editEvent] = useEditEventMutation();
  const [editOrg] = useEditOrgMutation();
  const entity = (query.data || {}) as IEvent | IOrg;
  const isE = isEvent(entity);
  const edit = isE ? editEvent : editOrg;

  //#region form
  const { setError, errors, clearErrors } = useForm({
    mode: "onChange"
  });

  //#region form state
  const [isLoading, setIsLoading] = useState(false);
  //#endregion

  //#region form handlers
  const onChange = () => clearErrors("formErrorMessage");
  const onShowTitleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsLoading(true);
      const key = `${isE ? "event" : "org"}Styles`;
      const payload = {
        [key]: {
          showTitle: e.target.checked
        }
      };
      await edit({
        payload,
        eventId: entity._id
      }).unwrap();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      handleError(error, (message) =>
        setError("formErrorMessage", {
          type: "manual",
          message
        })
      );
    }
  };
  //#endregion
  //#endregion

  return (
    <Box {...props}>
      <form onChange={onChange}>
        <Box {...formBoxProps(isDark)} mb={0}>
          <FormControl>
            <Switch
              isChecked={
                isE ? entity.eventStyles.showTitle : entity.orgStyles.showTitle
              }
              isDisabled={isLoading}
              onChange={onShowTitleChange}
              display="flex"
              alignItems="center"
            >
              Afficher l'entête
            </Switch>
          </FormControl>
        </Box>

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
      </form>
    </Box>
  );
};
