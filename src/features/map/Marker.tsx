import type { IEvent } from "models/Event";
import type { IOrg } from "models/Org";
import React, { useState } from "react";
import { css } from "twin.macro";
import DOMPurify from "isomorphic-dompurify";
import { Box, Icon, Text, Tooltip } from "@chakra-ui/react";
import { getStyleObjectFromString } from "utils/string";
import { Link } from "features/common";
import { DescriptionModal } from "features/modals/DescriptionModal";
import {
  FaMap,
  FaMapMarked,
  FaMapMarkedAlt,
  FaMapMarker,
  FaMapMarkerAlt
} from "react-icons/fa";
import { IoIosPeople } from "react-icons/io";
import { CalendarIcon } from "@chakra-ui/icons";

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

export const Marker = ({
  key,
  item,
  lat,
  lng,
  zoomLevel
}: {
  key: string;
  item: IEvent | IOrg;
  lat?: number;
  lng?: number;
  zoomLevel: number;
}) => {
  const isEvent = "eventName" in item;
  const name = "eventName" in item ? item.eventName : item.orgName;
  const [isDescriptionOpen, setIsDescriptionOpen] = useState<{
    [key: string]: boolean;
  }>({});
  const url = "eventName" in item ? item.eventUrl : item.orgUrl;
  const description =
    "eventName" in item ? item.eventDescription : item.orgDescription;
  const address = "eventName" in item ? item.eventAddress : item.orgAddress;

  // if (lat && lng) {
  // const world = latLng2World({ lat, lng });
  // const screen = world2Screen({ x: world.x, y: world.y }, zoomLevel);
  // }

  let wideStyles;
  const isWide = zoomLevel > 16;

  if (isWide) {
    // console.log(getStyleObjectFromString(styles));
    wideStyles = `
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
  }

  const m = (
    <Box
      css={css(wideStyles || defaultStyles)}
      _hover={{
        bgColor: "green",
        zIndex: 1
      }}
      onClick={() => {
        setIsDescriptionOpen({
          ...isDescriptionOpen,
          [name]: true
        });
      }}
    >
      {isWide ? (
        <Link className="rainbow-text" size="larger">
          {name}
        </Link>
      ) : (
        ""
      )}
    </Box>
  );

  return (
    <div key={key}>
      {isWide ? m : <Tooltip label={name}>{m}</Tooltip>}

      {/* <Button
        cursor="pointer"
        leftIcon={<Icon as={FaMapMarkerAlt} boxSize={8} />}
        color="red"
        bg="transparent"
        _hover={{
          color: "green"
        }}
      >
        {name}
      </Button> */}

      <DescriptionModal
        defaultIsOpen={false}
        isOpen={isDescriptionOpen[name]}
        onClose={() => {
          setIsDescriptionOpen({
            ...isDescriptionOpen,
            [name]: false
          });
        }}
        header={
          <>
            <Box display="inline-flex" alignItems="center">
              {isEvent ? (
                <Icon as={CalendarIcon} mr={1} boxSize={6} />
              ) : (
                <Icon as={IoIosPeople} mr={1} boxSize={6} />
              )}{" "}
              <Link
                href={`/${url}`}
                css={css`
                  letter-spacing: 0.1em;
                `}
                size="larger"
                className="rainbow-text"
              >
                {name}
              </Link>
            </Box>
            <br />
            <Box display="inline-flex" alignItems="center">
              <Icon as={FaMapMarkerAlt} mr={1} color="red" />
              {address}
            </Box>
          </>
        }
      >
        {description &&
        description.length > 0 &&
        description !== "<p><br></p>" ? (
          <div className="ql-editor">
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(description)
              }}
            />
          </div>
        ) : (
          <Text fontStyle="italic">Aucune description.</Text>
        )}
      </DescriptionModal>
    </div>
  );
};
