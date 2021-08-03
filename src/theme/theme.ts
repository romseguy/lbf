import { extendTheme } from "@chakra-ui/react";
import { createBreakpoints, mode } from "@chakra-ui/theme-tools";
import styles from "theme/styles";

const fonts = { mono: `'Menlo', monospace` };

export const breakpoints = createBreakpoints({
  sm: "28em",
  md: "40em",
  lg: "52em",
  xl: "64em",
  "2xl": "80em"
});

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
        larger: {
          fontSize: "2xl",
          fontWeight: "bold"
        }
      },
      variants: {
        "without-underline": {
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
