import { BoxProps } from "@chakra-ui/react";

export const formBoxProps = (isDark?: boolean): BoxProps => ({
  borderColor: isDark ? "whiteAlpha.300" : "gray.200",
  borderRadius: "lg",
  borderWidth: 1,
  p: 3,
  mb: 3
});

export const rainbowTextCss = (isDark?: boolean) => `
background-clip: text;
background-image: linear-gradient(to left, ${
  /*isDark
    ? "violet, violet, lightgreen, lightgreen, yellow, orange, red"
    : "red, green, green, brown, green, green, brown"*/
  isDark
    ? "violet, violet, lightgreen, lightgreen, yellow, orange, red"
    : "violet, purple, teal, teal, orange, orange, red"
});
color: transparent;
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;
`;

// https://stackoverflow.com/a/66926531
export const scrollbarCss = `
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
    display: none;
    /*border-style: solid;
    width: 16px;*/
  }

  /* Left */
  &::-webkit-scrollbar-button:horizontal:decrement {
    /*border-width: 5px 10px 5px 0;*/
    /*border-width: 5px 0px 0px 0px;*/
    border-color: transparent #319795 transparent transparent;
  }

  &::-webkit-scrollbar-button:horizontal:decrement:hover {
    border-color: transparent #2c7a7b transparent transparent;
  }

  /* Right */
  &::-webkit-scrollbar-button:horizontal:increment {
    /*border-width: 5px 0 5px 10px;*/
    border-color: transparent transparent transparent #319795;
  }

  &::-webkit-scrollbar-button:horizontal:increment:hover {
    border-color: transparent transparent transparent #2c7a7b;
  }
`;
