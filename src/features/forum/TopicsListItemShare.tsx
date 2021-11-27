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
import { ITopic } from "models/Topic";

export const TopicsListItemShare = ({
  topic,
  ...props
}: IconButtonProps & { topic: Partial<ITopic> }) => {
  const toast = useToast({ position: "top" });
  const [isOpen, setIsOpen] = useState(false);

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
          <Tooltip label="Copier l'adresse de la discussion" placement="left">
            <IconButton
              aria-label="Copier l'adresse de la discussion"
              icon={<LinkIcon />}
              onClick={(e) => {
                e.stopPropagation();
                navigator.clipboard.writeText(
                  `${process.env.NEXT_PUBLIC_URL}/${
                    topic.org ? topic.org.orgUrl : topic.event?.eventUrl
                  }/discussions/${topic.topicName}`
                );
                toast({
                  title: "Le lien a été copié dans votre presse-papiers",
                  status: "success"
                });
              }}
            />
          </Tooltip>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
