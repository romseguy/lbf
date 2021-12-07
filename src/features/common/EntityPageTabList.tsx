import { TabList, TabListProps } from "@chakra-ui/react";
import React from "react";
import { css } from "twin.macro";

export const EntityPageTabList = ({
  children,
  ...props
}: TabListProps & {
  children: React.ReactElement | React.ReactElement[];
}) => {
  return (
    <TabList
      as="nav"
      css={css`
        // https://stackoverflow.com/a/66926531
        // First four are essential
        display: block;
        width: 100%;
        overflow-x: scroll;
        white-space: nowrap;
        // Optional
        height: auto;
        padding: 10px;
        // This one is important.
        &::-webkit-scrollbar {
          -webkit-appearance: none;
        }
        &::-webkit-scrollbar:horizontal {
          height: 6px;
        }
        &::-webkit-scrollbar-thumb {
          border-radius: 8px;
          border: 2px solid #319795;
          /* should match background, can't be transparent */
          background-color: #319795;
        }
        /* 
          // This one is optional in case you wanna do this vertically too
          &::-webkit-scrollbar:horizontal {
            width: 11px; 
          }
          */
      `}
      {...props}
    >
      {children}
    </TabList>
  );
};
