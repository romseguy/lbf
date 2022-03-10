import { Button, Flex, useToast } from "@chakra-ui/react";
import { Session } from "next-auth";
import React, { useState } from "react";
import { RTEditor } from "features/common";
import { useEditUserMutation } from "features/users/usersApi";
import { IUser } from "models/User";
import { AppQueryWithData } from "utils/types";

export const UserDescriptionForm = ({
  session,
  userQuery,
  onCancel,
  ...props
}: {
  session: Session;
  userQuery: AppQueryWithData<IUser>;
  onCancel: () => void;
  onSubmit: () => void;
}) => {
  const toast = useToast({ position: "top" });

  const [editUser] = useEditUserMutation();
  const user = userQuery.data;

  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState<string | undefined>();

  const onSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await editUser({
        payload: { userDescription: description },
        slug: session.user.userId
      }).unwrap();
      userQuery.refetch();
      setIsLoading(false);
      toast({
        title: "Votre présentation a été enregistrée",
        status: "success"
      });
      props.onSubmit && props.onSubmit();
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      toast({
        title: "Votre présentation n'a pas pu être enregistrée.",
        status: "error"
      });
    }
  };

  return (
    <form>
      <RTEditor
        defaultValue={user.userDescription}
        placeholder="Ajoutez ici votre présentation"
        session={session}
        onBlur={(html) => setDescription(html)}
      />

      <Flex justifyContent="space-between" mt={5}>
        <Button colorScheme="red" onClick={onCancel}>
          Annuler
        </Button>

        <Button colorScheme="green" isLoading={isLoading} onClick={onSubmit}>
          {user.userDescription ? "Modifier" : "Ajouter"}
        </Button>
      </Flex>
    </form>
  );
};
