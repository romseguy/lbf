import { Button, useDisclosure } from "@chakra-ui/react";
import { Layout } from "features/layout";
import { MapModal } from "features/modals/MapModal";
import { useGetOrgsQuery } from "features/orgs/orgsApi";
import { selectOrgsRefetch } from "features/orgs/orgSlice";
import { OrgsList } from "features/orgs/OrgsList";
import { OrgTypes } from "models/Org";
import { useEffect } from "react";
import { FaMapMarkerAlt, FaRegMap } from "react-icons/fa";
import { useSelector } from "react-redux";

const OrgsPage = (props: any) => {
  const orgsQuery = useGetOrgsQuery(void 0, {
    selectFromResult: (query) => ({
      ...query,
      data: query.data?.filter((org) => org.orgType !== OrgTypes.NETWORK)
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
    <Layout pageTitle="Organisations" {...props}>
      <Button
        colorScheme="teal"
        isDisabled={!orgsQuery.data || !orgsQuery.data.length}
        leftIcon={<FaRegMap />}
        onClick={openMapModal}
        mb={3}
      >
        Carte des organisations
      </Button>

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
    </Layout>
  );
};

export default OrgsPage;
