import { extendTheme } from "@chakra-ui/react";
import { createBreakpoints, mode } from "@chakra-ui/theme-tools";
import styles from "theme/styles";

const fonts = { mono: `'Menlo', monospace` };

export const breakpoints = createBreakpoints({
  sm: "28em",
  md: "40em",
  lg: "52em",
  xl: "64em",
  "2xl": "80em",
  nav: "1003px"
});

export const scrollbarStyles = `
  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  /* Thumb */
  &::-webkit-scrollbar-thumb {
    background: rgba(49, 151, 149, 0.35);
    border-radius: 8px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(49, 151, 149, 1);
  }

  &::-webkit-scrollbar-thumb:active {
    background: #2c7a7b;
  }

  &::-webkit-scrollbar-thumb:horizontal {
    /*border-right: solid 2px rgba(33, 33, 33, 0.5);
    border-left: solid 2px rgba(33, 33, 33, 0.5);*/
  }

  /* Buttons */
  &::-webkit-scrollbar-button {
    border-style: solid;
    width: 16px;
  }

  /* Left */
  &::-webkit-scrollbar-button:horizontal:decrement {
    border-width: 5px 10px 5px 0;
    border-color: transparent #319795 transparent transparent;
  }

  &::-webkit-scrollbar-button:horizontal:decrement:hover {
    border-color: transparent #2c7a7b transparent transparent;
  }

  /* Right */
  &::-webkit-scrollbar-button:horizontal:increment {
    border-width: 5px 0 5px 10px;
    border-color: transparent transparent transparent #319795;
  }

  &::-webkit-scrollbar-button:horizontal:increment:hover {
    border-color: transparent transparent transparent #2c7a7b;
  }
`;

export const tableStyles = `
  th {
    padding: 4px;
  }
  td {
    padding: 8px;
  }

  @media (max-width: ${breakpoints.sm}) {
    td,
    th {
      padding: 2px;
    }
    td {
      padding-right: 12px;
    }
  }
`;

const theme = extendTheme({
  components: {
    FormLabel: {
      baseStyle: {
        fontWeight: "bold"
      }
    },
    Input: {
      baseStyle: {
        ".chakra-ui-dark &": {
          border: "1px solid white",
          _hover: {
            border: "1px solid white"
          }
        }
      }
    },
    Link: {
      sizes: {
        smaller: {
          fontSize: "smaller"
        },
        larger: {
          fontSize: "2xl",
          fontWeight: "bold"
        }
      },
      variants: {
        "no-underline": {
          _hover: {
            textDecoration: "none"
          }
        },
        underline: {
          textDecoration: "underline"
        }
      }
    },
    Spacer: {
      baseStyle: {
        border: "1px solid orange.300 !important",
        ".chakra-ui-dark &": {
          border: "1px solid white !important"
        }
      }
    }
  },
  styles,
  colors: {
    black: "#16161D"
  },
  fonts,
  breakpoints
});

export default theme;
