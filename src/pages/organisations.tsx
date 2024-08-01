import { Button, Tooltip, useDisclosure } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FaRegMap } from "react-icons/fa";
import { Column } from "features/common";
import { Layout } from "features/layout";
import { MapModal } from "features/modals/MapModal";
import { useGetOrgsQuery } from "features/api/orgsApi";
import { OrgsList } from "features/orgs/OrgsList";
import { EOrgType } from "models/Org";
import { PageProps } from "main";

const OrganisationsPage = (props: PageProps) => {
  const [isOffline, setIsOffline] = useState(false);
  useEffect(() => {
    window.addEventListener("offline", () => setIsOffline(true));
    window.addEventListener("online", () => setIsOffline(false));
  }, []);

  const orgsQuery = useGetOrgsQuery(void 0, {
    selectFromResult: (query) => ({
      ...query,
      data: query.data?.filter((org) => org.orgType !== EOrgType.NETWORK)
    })
  });

  const {
    isOpen: isMapModalOpen,
    onOpen: openMapModal,
    onClose: closeMapModal
  } = useDisclosure({ defaultIsOpen: false });

  return (
    <Layout {...props} pageTitle="Organisations">
      <Column>
        <Tooltip
          label={
            !orgsQuery.data || !orgsQuery.data.length
              ? "Aucun ateliers"
              : isOffline
              ? "Vous devez être connecté à internet pour Afficher la carte des organisations"
              : ""
          }
          placement="right"
          hasArrow
        >
          <span>
            <Button
              colorScheme="teal"
              isDisabled={
                isOffline || !orgsQuery.data || !orgsQuery.data.length
              }
              leftIcon={<FaRegMap />}
              onClick={openMapModal}
              mb={3}
            >
              Carte des organisations
            </Button>
          </span>
        </Tooltip>

        {/* <OrgsList orgsQuery={orgsQuery} /> */}

        {isMapModalOpen && (
          <MapModal
            isOpen={isMapModalOpen}
            orgs={
              orgsQuery.data?.filter(
                (org) =>
                  typeof org.orgLat === "number" &&
                  typeof org.orgLng === "number" &&
                  org.orgName !== "forum"
              ) || []
            }
            onClose={closeMapModal}
          />
        )}
      </Column>
    </Layout>
  );
};

export default OrganisationsPage;
