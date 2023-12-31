import { EmailIcon, PhoneIcon } from "@chakra-ui/icons";
import {
  Text,
  PopoverContent,
  PopoverHeader,
  IconButton,
  Link,
  PopoverBody,
  Button,
  Popover,
  PopoverCloseButton,
  PopoverTrigger,
  Spinner,
  ButtonProps,
  useDisclosure
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useGetSubscriptionQuery } from "features/api/subscriptionsApi";
import { SubscriptionEditForm } from "features/forms/SubscriptionEditForm";
import { IEvent } from "models/Event";
import { IOrg, orgTypeFull } from "models/Org";
import { getFollowerSubscription, ISubscription } from "models/Subscription";
import { AppQuery } from "utils/types";
import { useSelector } from "react-redux";
import { selectUserEmail } from "store/userSlice";

export const SubscriptionEditPopover = ({
  event,
  notifType = "email",
  org,
  buttonProps,
  isIconOnly,
  isSelf = true
}: {
  event?: IEvent;
  org?: IOrg;
  notifType?: "email" | "push";
  buttonProps?: ButtonProps & { "data-cy"?: string };
  isIconOnly?: boolean;
  isSelf?: boolean;
}) => {
  const userEmail = useSelector(selectUserEmail);
  const [isLoading, setIsLoading] = useState(false);
  const { onOpen, onClose, isOpen } = useDisclosure();
  const subQuery = useGetSubscriptionQuery({
    email: userEmail
  }) as AppQuery<ISubscription>;
  const followerSubscription = getFollowerSubscription({
    event,
    org,
    subQuery
  });

  if (!followerSubscription) return null;

  return (
    <Popover
      isLazy
      isOpen={isOpen}
      onClose={() => {
        //onSubmit({ silent: true });
        onClose();
      }}
    >
      <PopoverTrigger>
        {isIconOnly ? (
          <IconButton
            aria-label={`Notifications ${notifType}`}
            icon={notifType === "email" ? <EmailIcon /> : <PhoneIcon />}
            colorScheme="teal"
            variant="outline"
            onClick={onOpen}
            {...buttonProps}
          />
        ) : (
          <Button
            leftIcon={
              notifType === "email" ? (
                <EmailIcon boxSize={6} />
              ) : (
                <PhoneIcon boxSize={6} />
              )
            }
            colorScheme="teal"
            onClick={onOpen}
            data-cy="subscribe-button"
          >
            {notifType === "email"
              ? "Notifications e-mail"
              : "Notifications mobile"}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent>
        <PopoverCloseButton />
        {isSelf && subQuery.data ? (
          <PopoverHeader>
            <Text>{userEmail}</Text>
            <Link
              href={`/unsubscribe/${
                org ? org.orgUrl : event?.eventUrl
              }?subscriptionId=${subQuery.data._id}`}
              fontSize="smaller"
              variant="underline"
              onClick={onClose}
            >
              Se désabonner{" "}
              {org
                ? org.orgUrl === "forum"
                  ? "du forum"
                  : orgTypeFull(org.orgType)
                : "de l'événement"}
            </Link>
          </PopoverHeader>
        ) : (
          userEmail && (
            <PopoverHeader>
              <Text>Abonnement de {userEmail}</Text>
            </PopoverHeader>
          )
        )}

        <PopoverBody>
          {isLoading || subQuery.isLoading || subQuery.isFetching ? (
            <Spinner />
          ) : (
            <SubscriptionEditForm
              followerSubscription={followerSubscription}
              notifType={notifType}
              org={org}
              setIsLoading={setIsLoading}
              subQuery={subQuery}
              userEmail={userEmail}
              isSelf={isSelf}
            />
          )}
        </PopoverBody>
        {/* <PopoverFooter></PopoverFooter> */}
      </PopoverContent>
    </Popover>
  );
};

// if (!followerSubscription) {
//   console.log("no follower subscription => unchecking all");
//   return { ...obj, [k]: { checked: false } };
// }

// if (!("eventCategories" in followerSubscription)) {
//   console.log(
//     "follower subscription => undefined eventCategories => checking all"
//   );
//   return {
//     ...obj,
//     [k]: { checked: true }
//   };
// }

// addEventOrOrgSubscription({
//   form,
//   followerSubscription,
//   eventCategories,
//   notifType,
//   setIsLoading,
//   topics,
//   userEmail,
//   addSubscription
// });
