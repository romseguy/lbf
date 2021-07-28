import { mode } from "@chakra-ui/theme-tools";
import { Dict } from "@chakra-ui/utils";

const ReactSelectStyles = (props: Dict) => ({
  ".react-select-container": {
    ".react-select__control": {
      backgroundColor: mode("white", "whiteAlpha.100")(props),
      //border: 0,
      borderColor: mode("gray.200", "#7b8593")(props),
      ".react-select__placeholder": {
        color: mode("gray.400", "gray.400")(props)
      }
    },

    ".react-select__multi-value": {
      backgroundColor: mode("gray.400", "whiteAlpha.400")(props),
      //borderRadius: "md",
      ".react-select__multi-value__label": {
        color: mode("black", "white")(props)
      },
      ".react-select__multi-value__remove": {
        ":hover": {
          cursor: "pointer",
          color: "red",
          //borderRadius: "md",
          backgroundColor: mode("black", "white")(props)
        }
      }
    },

    ".react-select__clear-indicator": {
      cursor: "pointer",
      color: mode("black", "white")(props)
    },
    ".react-select__dropdown-indicator": {
      color: mode("black", "white")(props)
    },

    ".react-select__menu": {
      ".react-select__menu-list": {
        backgroundColor: mode("orange.300", "black")(props),
        color: mode("black", "white")(props),
        ".react-select__option": {
          backgroundColor: mode("white", "gray.700")(props),
          "&:hover": {
            cursor: "pointer",
            backgroundColor: mode("orange.200", "gray.500")(props),
            color: mode("black", "white")(props)
            //color: mode("white", "black")(props)
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
