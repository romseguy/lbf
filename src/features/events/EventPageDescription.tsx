import { SmallAddIcon } from "@chakra-ui/icons";
import { IconButton, Text, Tooltip } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { FaNewspaper } from "react-icons/fa";
import { IEvent } from "models/Event";
import { sanitize, transformRTEditorOutput } from "utils/string";
import { AppQueryWithData } from "utils/types";
import { useSelector } from "react-redux";
import { selectIsMobile } from "store/uiSlice";

export const EventPageDescription = ({
  eventQuery,
  isCreator,
  setIsEdit
}: {
  eventQuery: AppQueryWithData<IEvent>;
  isCreator: boolean;
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const isMobile = useSelector(selectIsMobile);
  const event = eventQuery.data;
  const [description, setDescription] = useState<string | undefined>();
  useEffect(() => {
    if (!event.eventDescription) return setDescription(undefined);

    if (isMobile)
      setDescription(
        transformRTEditorOutput(event.eventDescription).body.innerHTML
      );
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
