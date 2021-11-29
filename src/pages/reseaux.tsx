import { Button, Tooltip, useDisclosure } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { Detector } from "react-detect-offline";
import { FaRegMap } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Layout } from "features/layout";
import { MapModal } from "features/modals/MapModal";
import { useGetOrgsQuery } from "features/orgs/orgsApi";
import { selectOrgsRefetch } from "features/orgs/orgSlice";
import { OrgsList } from "features/orgs/OrgsList";
import { OrgTypes } from "models/Org";

const NetworksPage = (props: any) => {
  const orgsQuery = useGetOrgsQuery(void 0, {
    selectFromResult: (query) => ({
      ...query,
      data: query.data?.filter((org) => org.orgType === OrgTypes.NETWORK)
    })
  });

  const refetchOrgs = useSelector(selectOrgsRefetch);
  useEffect(() => {
    orgsQuery.refetch();
  }, [refetchOrgs]);

  const {
    isOpen: isMapModalOpen,
    onOpen: openMapModal,
    onClose: closeMapModal
  } = useDisclosure({ defaultIsOpen: false });

  return (
    <Layout pageTitle="Réseaux" {...props}>
      <Detector
        polling={{
          enabled: true,
          interval: 1000,
          timeout: 5000,
          url: `${process.env.NEXT_PUBLIC_API}/check`
        }}
        render={({ online }) => (
          <Tooltip
            label={
              !orgsQuery.data || !orgsQuery.data.length
                ? "Aucune organisations"
                : !online
                ? "Vous devez être connecté à internet pour afficher la carte des réseaux"
                : ""
            }
            placement="right"
            hasArrow
          >
            <span>
              <Button
                colorScheme="teal"
                isDisabled={
                  !online || !orgsQuery.data || !orgsQuery.data.length
                }
                leftIcon={<FaRegMap />}
                onClick={openMapModal}
                mb={3}
              >
                Carte des réseaux
              </Button>
            </span>
          </Tooltip>
        )}
      />

      <OrgsList orgsQuery={orgsQuery} />

      {isMapModalOpen && (
        <MapModal
          isOpen={isMapModalOpen}
          header="Carte des réseaux"
          orgs={
            orgsQuery.data?.filter(
              (org) =>
                typeof org.orgLat === "number" &&
                typeof org.orgLng === "number" &&
                org.orgName !== "aucourant"
            ) || []
          }
          onClose={closeMapModal}
        />
      )}
    </Layout>
  );
};

export default NetworksPage;
