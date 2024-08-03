import { Button, Flex } from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

import React, { useState } from "react";
import { RTEditor } from "features/common";
import { useSession } from "hooks/useSession";

export const DescriptionForm = ({
  onCancel,
  ...props
}: {
  description?: string;
  onCancel: () => void;
  onSubmit: (description: string) => void;
}) => {
  const { data: session } = useSession();
  //const toast = useToast({ position: "top" });
  //const [editUser] = useEditUserMutation();
  //const user = userQuery.data;

  const [isLoading, setIsLoading] = useState(false);
  const [description, setDescription] = useState(props.description || "");

  const onSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // await editUser({
      //   payload: { userDescription: description },
      //   slug: session.user.userId
      // }).unwrap();
      setIsLoading(false);
      // toast({
      //   title: "Votre présentation a été enregistrée",
      //   status: "success"
      // });
      props.onSubmit && props.onSubmit(description);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      // toast({
      //   title: "Votre présentation n'a pas pu être enregistrée.",
      //   status: "error"
      // });
    }
  };

  return (
    <form>
      <RTEditor
        defaultValue={props.description}
        //placeholder="Ajoutez ici votre présentation"
        session={session}
        onBlur={(html) => setDescription(html)}
      />

      <Flex justifyContent="space-between" mt={5}>
        <Button colorScheme="red" onClick={onCancel}>
          Annuler
        </Button>

        <Button colorScheme="green" isLoading={isLoading} onClick={onSubmit}>
          {props.description ? "Modifier" : "Ajouter"}
        </Button>
      </Flex>
    </form>
  );
};
