import { Button, Tooltip, useColorMode, useDisclosure } from "@chakra-ui/react";
import { Detector } from "react-detect-offline";
import { FaRegMap } from "react-icons/fa";
import { PageContainer } from "features/common";
import { Layout } from "features/layout";
import { MapModal } from "features/modals/MapModal";
import { useGetOrgsQuery } from "features/orgs/orgsApi";
import { OrgsList } from "features/orgs/OrgsList";
import { OrgTypes } from "models/Org";
import { PageProps } from "./_app";

const OrganisationsPage = (props: PageProps) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";

  const orgsQuery = useGetOrgsQuery(void 0, {
    selectFromResult: (query) => ({
      ...query,
      data: query.data?.filter((org) => org.orgType !== OrgTypes.NETWORK)
    })
  });

  const {
    isOpen: isMapModalOpen,
    onOpen: openMapModal,
    onClose: closeMapModal
  } = useDisclosure({ defaultIsOpen: false });

  return (
    <Layout pageTitle="Organisations" {...props}>
      <PageContainer>
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
                  ? "Vous devez être connecté à internet pour afficher la carte des organisations"
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
                  Carte des organisations
                </Button>
              </span>
            </Tooltip>
          )}
        />

        <OrgsList orgsQuery={orgsQuery} />

        {isMapModalOpen && (
          <MapModal
            isOpen={isMapModalOpen}
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
      </PageContainer>
    </Layout>
  );
};

export default OrganisationsPage;
