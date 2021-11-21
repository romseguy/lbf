import { mode } from "@chakra-ui/theme-tools";
import { Dict } from "@chakra-ui/utils";

export type StyleProps = {
  [key: string]: string | number | { [key: string]: string | number };
};

const ReactSelectStyles = (props: Dict) => ({
  ".react-select-container": {
    ".react-select__control": {
      backgroundColor: mode("white", "gray.700")(props),
      borderColor: mode("gray.200", "#4F5765")(props),
      paddingLeft: 0,

      "&:hover": {
        borderColor: mode("#CBD5E0", "#5F6774")(props)
      },

      ".react-select__clear-indicator": {
        cursor: "pointer",
        color: mode("black", "white")(props)
      },
      ".react-select__dropdown-indicator": {
        color: mode("black", "white")(props)
      },

      ".react-select__value-container": {
        ".react-select__placeholder": {
          color: mode("gray.400", "gray.400")(props),
          paddingLeft: "12px"
        },

        ".react-select__single-value": {
          color: mode("black", "white")(props),
          px: 2,
          py: 1
        },

        ".react-select__input-container": {
          color: mode("black", "white")(props),
          bgColor: mode("blackAlpha.100", "whiteAlpha.300")(props),
          borderRadius: "lg",
          px: 2,
          py: 1
        },

        ".react-select__multi-value": {
          backgroundColor: mode("gray.400", "whiteAlpha.400")(props),
          borderRadius: "md",
          ".react-select__multi-value__label": {
            color: mode("black", "white")(props)
          },
          ".react-select__multi-value__remove": {
            ":hover": {
              backgroundColor: "transparent",
              color: "red"
            }
          }
        }
      }
    },

    ".react-select__menu": {
      backgroundColor: mode("white", "gray.700")(props),

      ".react-select__menu-list": {
        padding: 0,
        borderWidth: "2px",
        borderRadius: "md",
        borderColor: "#2684FF",
        backgroundColor: mode("white", "transparent")(props),
        color: mode("black", "white")(props),

        ".react-select__option": {
          backgroundColor: mode("white", "transparent")(props),
          color: mode("black", "white")(props),
          "&:hover": {
            cursor: "pointer",
            backgroundColor: mode("orange.100", "whiteAlpha.400")(props),
            color: mode("black", "white")(props)
          }
        }
      }
    }
  }
});

export default {
  global: (props: Dict) => {
    const customGlobalStyles = {
      //...theme.styles.global(props),
      ...ReactSelectStyles(props)
    };

    return customGlobalStyles;
  }
};
