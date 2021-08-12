import type { IEvent } from "models/Event";
import type { IOrg } from "models/Org";
import React, { useState } from "react";
import { css } from "twin.macro";
import DOMPurify from "isomorphic-dompurify";
import { Box, Text, Tooltip } from "@chakra-ui/react";
import { getStyleObjectFromString } from "utils/string";
import { Link } from "features/common";
import { DescriptionModal } from "features/modals/DescriptionModal";

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
  const name = "eventName" in item ? item.eventName : item.orgName;
  const [isDescriptionOpen, setIsDescriptionOpen] = useState<{
    [key: string]: boolean;
  }>({});
  const url = "eventName" in item ? item.eventUrl : item.orgUrl;
  const description =
    "eventName" in item ? item.eventDescription : item.orgDescription;

  // if (lat && lng) {
  // const world = latLng2World({ lat, lng });
  // const screen = world2Screen({ x: world.x, y: world.y }, zoomLevel);
  // }

  let additionalStyles;
  const isWide = zoomLevel > 16;

  if (isWide) {
    // console.log(getStyleObjectFromString(styles));
    additionalStyles = `
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
      css={css(additionalStyles || defaultStyles)}
      _hover={{ zIndex: 1 }}
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
