import { FlexProps } from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

import { Column } from "features/common";
import { isEvent, isTopic } from "models/Entity";
import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { ITopic } from "models/Topic";
import { Session } from "utils/auth";
import { createEventEmailNotif, createTopicEmailNotif } from "utils/email";
import { sanitize } from "utils/string";

export const EmailPreview = ({
  entity,
  event,
  //org,
  session,
  ...props
}: FlexProps & {
  entity: IEvent<string | Date> | ITopic;
  event: IEvent<string | Date>;
  //org?: IOrg;
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
        //org,
        subscriptionId: session.user.userId,
        topic: entity
      })
    : undefined;

  return (
    <Column bg="#F9F9F9" {...props}>
      <div
        dangerouslySetInnerHTML={{
          __html: sanitize(
            notif
              ? notif.html //.replaceAll("\\n", "<br/>")
              : "L'aperçu n'a pas pu être affiché"
          )
        }}
      />
    </Column>
  );
};
