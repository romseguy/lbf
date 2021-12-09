import "quill/dist/quill.snow.css";
import { useColorMode } from "@chakra-ui/react";
import { theme } from "@chakra-ui/theme";
import { styled } from "twin.macro";

const tabSize = 10;

export const RTEditorStyles = styled("span")(
  (props: { height?: string; width?: string }) => {
    const { colorMode } = useColorMode();
    const isDark = colorMode === "dark";
    const bothColorModes = `
      .ql-toolbar {
        border: 1px solid #e2e8f0;
        padding: 0;
        text-align: center;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;

        button {
          padding: 0;
        }

        .ql-picker-label {
          padding: 0;
        }

        & > .ql-formats {
          margin: 0 8px 0 0;
        }

        // & > .ql-formats > button {
        //     padding: 0 2px 0 0;
        //     width: auto;
        // }

        // & > .ql-formats > button:hover {
        //     & > svg > .ql-stroke {
        //     }
        //     & > svg > .ql-fill {
        //     }
        // }

        .ql-picker.ql-size {
          width: auto;
          .ql-picker-label {
            padding-right: 16px;
            padding-left: 4px;
          }
        }

        .ql-insertHeart {
          padding: 0;
        }
      }

      .ql-container {
        width: ${props.width ? props.width : ""};
        height: ${props.height ? props.height : ""};
        border: 1px solid #e2e8f0;
        border-bottom-left-radius: 6px;
        border-bottom-right-radius: 6px;

        .ql-editor {
          padding: 12px;
          tab-size: ${tabSize};
          -moz-tab-size: ${tabSize};
          -o-tab-size:  ${tabSize};
          max-height: 250px;
          overflow: auto;
        }

        .ql-editor.ql-blank::before {
          font-size: 16px;
          color: ${
            isDark ? theme.colors.whiteAlpha["400"] : theme.colors.gray["400"]
          };
          font-style: normal;
          overflow: hidden;
          white-space: nowrap;
        }
      }

      .ql-container.ql-disabled {
        * {
          cursor: not-allowed;
        }
      }

      &:hover {
        .ql-toolbar {
          border: 1px solid #cbd5e0;
        }

        .ql-container {
          border: 1px solid #cbd5e0;
        }
      }

      .image-uploading {
        position: relative;
        display: inline-block;
      }

      .image-uploading img {
        max-width: 98% !important;
        filter: blur(5px);
        opacity: 0.3;
      }

      .image-uploading::before {
        content: "";
        box-sizing: border-box;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 30px;
        height: 30px;
        margin-top: -15px;
        margin-left: -15px;
        border-radius: 50%;
        border: 3px solid #ccc;
        border-top-color: #1e986c;
        z-index: 1;
        animation: spinner 0.6s linear infinite;
      }

      @keyframes spinner {
        to {
          transform: rotate(360deg);
        }
      }
    `;

    return `
    ${bothColorModes}
    ${
      colorMode === "dark" &&
      `
      &:hover {
        .ql-toolbar {
          border: 1px solid #5F6774;
        }

        .ql-container {
          border: 1px solid #5F6774;
        }
      }

      .ql-toolbar {
        border: 1px solid #677080;

        .ql-stroke {
          stroke: white;
        }
        
        .ql-fill {
          fill: white;
        }

        .ql-size {
          color: white;
        }
        
        .ql-picker-options {
          color: white;
          background: black;
        }

      }

      .ql-container {
        border: 1px solid #677080;
      }
      `
    }
    `;
  }
);
