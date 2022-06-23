import { extendTheme } from "@chakra-ui/react";
import { createBreakpoints, mode } from "@chakra-ui/theme-tools";
import { Dict } from "@chakra-ui/utils";

const fonts = { mono: `'Menlo', monospace` };

export const breakpoints = createBreakpoints({
  sm: "28em",
  md: "40em",
  lg: "52em",
  xl: "64em",
  "2xl": "80em",
  nav: "1003px"
});

export const pxBreakpoints = {
  sm: 448,
  md: 640,
  lg: 832,
  xl: 1024,
  "2xl": 1280
};

export const getViewportWidth = () => {
  const screenWidth = window.innerWidth - 15;
  let marginAround = 2 * (5 * 12 + 20 + 84);

  if (screenWidth < pxBreakpoints["2xl"]) {
    marginAround = 2 * (4 * 12 + 20);
  }

  return screenWidth - marginAround;
};

export const bannerWidth = 1154;
export const logoHeight = 110;

// https://stackoverflow.com/a/66926531
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
        field: {
          //backgroundColor: "gray.100"
        }
      },
      variants: {
        /**
         * Input component will use "outline" styles by default.
         * Styles set here will override anything in { baseStyle } and { sizes }
         */
        outline: {
          field: {
            background: "white",
            border: "1px solid",
            borderColor: "inherit",
            _focus: {
              zIndex: 1,
              borderColor: "#3182ce",
              boxShadow: "0 0 0 1px #3182ce"
            },
            _hover: { borderColor: "gray.300" }
          }
        },
        filled: {
          field: {
            background: "gray.100",
            border: "2px solid",
            borderColor: "transparent",
            _focus: {
              background: "transparent",
              borderColor: "#3182ce"
            },
            _hover: {
              background: "gray.300"
            }
          }
        },
        flushed: {
          field: {
            background: "transparent",
            borderBottom: "1px solid",
            borderColor: "inherit",
            borderRadius: 0,
            paddingX: 0,
            _focus: {
              borderColor: "#3182ce",
              boxShadow: "0 0 0 1px #3182ce"
            }
          }
        },
        unstyled: {
          field: {
            background: "transparent",
            borderRadius: "md",
            height: "auto",
            paddingX: 0
          }
        }
      },
      defaultProps: {
        /**
         * Set either or both of these to null to use only what's in { baseStyle }
         */
        size: "md",
        variant: "outline"
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
    Select: {
      baseStyle: {
        field: {
          backgroundColor: "white",
          ".chakra-ui-dark &": {
            backgroundColor: "whiteAlpha.300"
          }
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
  styles: {
    global: (props: Dict) => ({})
  },
  colors: {
    black: "#16161D"
  },
  fonts,
  breakpoints
});

export default theme;
