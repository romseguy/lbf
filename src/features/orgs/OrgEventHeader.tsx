import { IOrg } from "models/Org";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { Heading, Grid } from "@chakra-ui/react";
import { useSession } from "hooks/useAuth";
import { Button, GridItem } from "features/common";
import { AddIcon } from "@chakra-ui/icons";
import tw, { css } from "twin.macro";
import { EventModal } from "features/modals/EventModal";

export const OrgEventHeader = ({
  org,
  isCreator,
  isLogin,
  setIsLogin
}: {
  org: IOrg;
  isCreator: boolean;
  isLogin: number;
  setIsLogin: (isLogin: number) => void;
}) => {
  const router = useRouter();
  const { data: session, loading: isSessionLoading } = useSession();
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);

  return (
    <>
      {isEventModalOpen && (
        <EventModal
          initialEventOrgs={[org]}
          onCancel={() => setIsEventModalOpen(false)}
          onSubmit={async (eventName) => {
            await router.push(`/${encodeURIComponent(eventName)}`);
          }}
          onClose={() => {
            setIsEventModalOpen(false);
          }}
        />
      )}
      {/* <Grid templateColumns="1fr auto" alignItems="center"> */}
      <Grid templateColumns="auto 1fr" alignItems="center">
        <GridItem
          css={css`
            @media (max-width: 730px) {
              & {
                padding-top: 12px;
                padding-bottom: 12px;
              }
            }
          `}
        >
          {/* <Heading size="sm">Événements</Heading> */}
        </GridItem>
        <GridItem
          css={css`
            padding-bottom: 12px;
            @media (max-width: 730px) {
              & {
                grid-column: 1;
              }
            }
          `}
        >
          <Button
            leftIcon={<AddIcon />}
            colorScheme="teal"
            onClick={() => {
              if (!isSessionLoading) {
                if (!session) setIsLogin(isLogin + 1);
                // TODO: check if user is SUB
                else if (isCreator) setIsEventModalOpen(true);
              }
            }}
            // dark={{ bg: "gray.700", _hover: { bg: "gray.600" } }}
          >
            Ajouter un événement
          </Button>
        </GridItem>
      </Grid>
    </>
  );
};
