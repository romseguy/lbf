import { AddIcon } from "@chakra-ui/icons";
import { Button, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { IEvent } from "models/Event";
import { sanitize, transformRTEditorOutput } from "utils/string";
import { AppQueryWithData } from "utils/types";

export const EventPageDescription = ({
  eventQuery,
  isCreator,
  isMobile,
  setIsEdit
}: {
  eventQuery: AppQueryWithData<IEvent>;
  isCreator: boolean;
  isMobile: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const event = eventQuery.data;
  const [description, setDescription] = useState<string | undefined>();
  useEffect(() => {
    if (!event.eventDescription) return setDescription(undefined);
    const doc = transformRTEditorOutput(event.eventDescription, isMobile);
    setDescription(doc.body.innerHTML);
  }, [event]);

  return (
    <>
      {description && description.length > 0 ? (
        <div className="rteditor">
          <div
            dangerouslySetInnerHTML={{
              __html: sanitize(description)
            }}
          />
        </div>
      ) : isCreator ? (
        <Button
          alignSelf="flex-start"
          colorScheme="teal"
          leftIcon={<AddIcon />}
          onClick={() => setIsEdit(true)}
        >
          Ajouter
        </Button>
      ) : (
        <Text fontStyle="italic">Aucune présentation.</Text>
      )}
    </>
  );
};
