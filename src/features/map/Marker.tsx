import { Image, Tooltip } from "@chakra-ui/react";
import React, { useState } from "react";
import type { IEvent } from "models/Event";
import type { IOrg } from "models/Org";
import { getMarkerUrl } from "utils/maps";

const defaultStyles = `
  position: absolute;
  top: 50%;
  left: 50%;
  width: 18px;
  height: 18px;
  background-color: red;
  border: 2px solid #fff;
  border-radius: 100%;
  user-select: none;
  transform: translate(-50%, -50%);
  cursor: pointer;
`;

const wideStyles = `
  position: absolute;
  top: 50%;
  left: 50%;
  width: auto;
  height: auto;
  padding: 8px;
  color: black;
  background-color: white;
  border: 2px solid black;
  border-radius: 12px;
  user-select: none;
  transform: translate(-50%, -50%);
  cursor: pointer;
`;

export const Marker = ({
  item,
  lat,
  lng,
  zoomLevel,
  setItemToShow
}: {
  item: IEvent | IOrg;
  lat?: number;
  lng?: number;
  zoomLevel: number;
  setItemToShow: (item: IEvent | IOrg | null) => void;
}) => {
  const name = "eventName" in item ? item.eventName : item.orgName;
  const [fill, setFill] = useState("green");

  return (
    <Tooltip label={name}>
      <Image
        cursor="pointer"
        src={getMarkerUrl({
          id: "eventName" in item ? "event" : "org",
          fill,
          height: 25,
          width: 25
        })}
        onMouseEnter={() => setFill("blue")}
        onMouseLeave={() => setFill("green")}
        onClick={() => setItemToShow(item)}
      />
    </Tooltip>
  );

  // if (lat && lng) {
  // const world = latLng2World({ lat, lng });
  // const screen = world2Screen({ x: world.x, y: world.y }, zoomLevel);
  // }

  // const isWide = zoomLevel > 16;

  // const m = (
  //   <Box
  //     css={css(isWide ? wideStyles : defaultStyles)}
  //     _hover={{
  //       bgColor: "green",
  //       zIndex: 1
  //     }}
  //     onClick={() => setItemToShow(item)}
  //   >
  //     {isWide ? (
  //       <Link className="rainbow-text" size="larger">
  //         {name}
  //       </Link>
  //     ) : (
  //       ""
  //     )}
  //   </Box>
  // );

  // const m = (
  //     <Button
  //       cursor="pointer"
  //       leftIcon={<Icon as={FaMapMarkerAlt} boxSize={8} />}
  //       color="red"
  //       bg="transparent"
  //       _hover={{
  //         color: "green"
  //       }}
  //     >
  //       {name}
  //     </Button>
  // )

  // return (
  //   <div key={key}>{m}</div>
  // );
};
