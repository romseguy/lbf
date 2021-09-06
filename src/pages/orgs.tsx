import { Button, useDisclosure } from "@chakra-ui/react";
import { Layout } from "features/layout";
import { MapModal } from "features/modals/MapModal";
import { useGetOrgsQuery } from "features/orgs/orgsApi";
import { selectOrgsRefetch } from "features/orgs/orgSlice";
import { OrgsList } from "features/orgs/OrgsList";
import { useEffect } from "react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useSelector } from "react-redux";

const OrgsPage = () => {
  const orgsQuery = useGetOrgsQuery(undefined);
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
    <Layout>
      <Button
        colorScheme="teal"
        isDisabled={!orgsQuery.data || !orgsQuery.data.length}
        leftIcon={<FaMapMarkerAlt />}
        onClick={openMapModal}
        mb={3}
      >
        Carte des organisations
      </Button>

      <OrgsList orgsQuery={orgsQuery} />

      {isMapModalOpen && (
        <MapModal
          isOpen={isMapModalOpen}
          items={
            orgsQuery.data?.filter(
              (org) =>
                typeof org.orgLat === "number" && typeof org.orgLng === "number"
            ) || []
          }
          onClose={closeMapModal}
        />
      )}
    </Layout>
  );
};

export default OrgsPage;
