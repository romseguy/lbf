import { SmallAddIcon } from "@chakra-ui/icons";
import { IconButton, Text, Tooltip } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaNewspaper } from "react-icons/fa";
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
        <Tooltip placement="right" label={`Ajouter une affiche à l'événement`}>
          <IconButton
            aria-label={`Ajouter une affiche à l'événement`}
            alignSelf="flex-start"
            colorScheme="teal"
            icon={
              <>
                <SmallAddIcon />
                <FaNewspaper />
              </>
            }
            pr={1}
            onClick={() => setIsEdit(true)}
          />
        </Tooltip>
      ) : (
        <Text fontStyle="italic">Aucune présentation.</Text>
      )}
    </>
  );
};
