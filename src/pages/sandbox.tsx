import { Spinner } from "@chakra-ui/spinner";
import { MapContainer } from "features/map/MapContainer";
import { getOrg } from "features/orgs/orgsApi";
import { IOrg } from "models/Org";
import React, { useEffect, useState } from "react";
import { useAppDispatch } from "store";

const Sandbox = () => {
  const dispatch = useAppDispatch();
  const [org, setOrg] = useState<IOrg | undefined>();
  const populate =
    "orgBanner orgEvents orgLogo orgProjects orgSubscriptions orgTopics orgs";

  useEffect(() => {
    const xhr = async () => {
      const orgQuery = await dispatch(
        getOrg.initiate({
          orgUrl: "reseau_solaris",
          populate
        })
      );

      if (orgQuery.data) {
        setOrg(orgQuery.data);
      }
    };

    xhr();
  }, []);

  if (!org) return <Spinner />;

  return (
    <>
      <MapContainer
        orgs={org.orgs}
        center={{
          lat:
            org.orgLat ||
            (Array.isArray(org.orgs) && org.orgs.length > 0
              ? org.orgs[0].orgLat
              : 0),
          lng:
            org.orgLng ||
            (Array.isArray(org.orgs) && org.orgs.length > 0
              ? org.orgs[0].orgLng
              : 0)
        }}
      />
    </>
  );
};

export default Sandbox;
