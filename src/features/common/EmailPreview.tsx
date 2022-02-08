import { Box, FlexProps, Heading } from "@chakra-ui/react";
import { createEventEmailNotif, createTopicEmailNotif } from "api/email";
import { PageContainer } from "features/common";
import DOMPurify from "isomorphic-dompurify";
import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { ITopic } from "models/Topic";
import { Session } from "next-auth";
import { isEvent, isTopic } from "utils/models";

export const EmailPreview = ({
  entity,
  event,
  org,
  session,
  ...props
}: FlexProps & {
  entity: IEvent<string | Date> | ITopic;
  event?: IEvent<string | Date>;
  org?: IOrg;
  session: Session;
}) => {
  const notif = isEvent(entity)
    ? createEventEmailNotif({
        email: session.user.email,
        event: entity,
        org: entity.eventOrgs[0],
        subscriptionId: session.user.userId
      })
    : isTopic(entity)
    ? createTopicEmailNotif({
        email: session.user.email,
        event,
        org,
        subscriptionId: session.user.userId,
        topic: entity
      })
    : {};

  return (
    <PageContainer bg="white" {...props}>
      <div
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(
            notif.html?.replaceAll("\\n", "<br/>") ||
              "L'aperçu n'a pas pu être affiché"
          )
        }}
      />
    </PageContainer>
  );
};
