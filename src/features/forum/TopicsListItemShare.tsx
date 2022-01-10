import { LinkIcon } from "@chakra-ui/icons";
import {
  IconButton,
  IconButtonProps,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Tooltip,
  useToast
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FaShare } from "react-icons/fa";
import { LinkShare } from "features/common";
import { ITopic } from "models/Topic";

export const TopicsListItemShare = ({
  topic,
  ...props
}: IconButtonProps & { topic: Partial<ITopic> }) => {
  const toast = useToast({ position: "top" });
  const [isOpen, setIsOpen] = useState(false);

  let url = topic.org
    ? topic.org.orgUrl
    : topic.event?.eventUrl + "/discussions";
  if (topic.org?.orgUrl === "forum") url = "forum";
  url = `${process.env.NEXT_PUBLIC_URL}/${url}/${topic.topicName}`;

  return (
    <Popover closeOnBlur isOpen={isOpen} onClose={() => setIsOpen(false)}>
      <PopoverTrigger>
        <div>
          <Tooltip label="Partager">
            <IconButton
              icon={<FaShare />}
              boxSize={4}
              bg="transparent"
              _hover={{ bg: "transparent", color: "white" }}
              height="auto"
              minWidth={0}
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(!isOpen);
              }}
              {...props}
            />
          </Tooltip>
        </div>
      </PopoverTrigger>
      <PopoverContent width="auto">
        <PopoverBody onClick={(e) => e.stopPropagation()}>
          <LinkShare label="Copier l'adresse de la discussion" url={url} />
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
