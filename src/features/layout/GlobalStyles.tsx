import { Global, css } from "@emotion/react";
import { breakpoints } from "theme/theme";

export const GlobalStyles = () => (
  <Global
    styles={css`
      //#region fonts
      @font-face {
        font-family: "DancingScript";
        src: url("/fonts/DancingScript-Regular.ttf");
        src: url("/fonts/DancingScript-Bold.ttf");
        src: url("/fonts/DancingScript-SemiBold.ttf");
      }
      /* @font-face {
        font-family: "Aladin";
        src: url("/fonts/Aladin-Regular.ttf");
      } */
      //#endregion

      //#region global
      html,
      body,
      #__next {
        height: 100%;
      }

      body,
      #__next {
        display: flex;
        flex-direction: column;
      }
      //#endregion

      //#region large screens
      @media (min-width: ${breakpoints["2xl"]}) {
        .chakra-ui-light {
          background: white;
        }
        .chakra-ui-dark {
          background: black;
        }
      }
      //#endregion

      //#region google maps
      .cluster > div {
        background: green;
        border-radius: 50%;
        color: white;
      }
      //#endregion

      //#region quill
      /* .ql-editor {
        padding: 0;

        a {
          text-decoration: underline;
        }

        a.clip {
          text-overflow: ellipsis;
          display: inline-block;
          white-space: nowrap;
          overflow: hidden;
          max-width: 75px;
          vertical-align: top;
        }

        blockquote {
          border-left: 4px solid #ccc;
          margin-bottom: 5px;
          margin-top: 5px;
          padding-left: 16px;
        }

        ul {
          padding: 0;
        }
      } */
      //#endregion

      //#region linear rainbow text
      .rainbow-text {
        background-clip: text;
        -webkit-background-clip: text;
        background-image: linear-gradient(
          to left,
          violet,
          indigo,
          blue,
          green,
          yellow,
          orange,
          red
        );
        color: transparent;
        -webkit-text-fill-color: transparent;
      }
      .rainbow-text-animated {
        animation: rainbow 5s infinite;
        -ms-animation: rainbow 5s infinite;
        -webkit-animation: rainbow 5s infinite;
        @keyframes rainbow {
          0% {
            color: orange;
          }
          10% {
            color: purple;
          }
          20% {
            color: red;
          }
          30% {
            color: CadetBlue;
          }
          40% {
            color: yellow;
          }
          50% {
            color: coral;
          }
          60% {
            color: green;
          }
          70% {
            color: cyan;
          }
          80% {
            color: DeepPink;
          }
          90% {
            color: DodgerBlue;
          }
          100% {
            color: orange;
          }
        }
      }
      //#endregion

      //#region rainbow-conic text
      .rainbow-conic-text {
        cursor: default;
        /* Set the background size and repeat properties. */
        /* Animate the text when loading the element. */
        /* This animates it on page load and when hovering out. */
        animation: rainbow-conic-text-animation-rev 0.5s ease forwards;
      }

      .chakra-ui-light .rainbow-conic-text {
        /* Create a conic gradient. */
        /* Double percentages to avoid blur (#000 10%, #fff 10%, #fff 20%, ...). */
        /* background: #ffffff;
        background-color: #ffffff; */
        background: conic-gradient(
          #000000 16.666%,
          #000000 16.666%,
          #a7489b 33.333%,
          #000000 33.333%,
          #000000 50%,
          #000000 50%,
          #000000 66.666%,
          #a7489b 66.666%,
          #ffee00 83.333%,
          #a7489b 83.333%
            /* #a7489b 66.666%,
          #ff0000 83.333%,
          #a7489b 83.333% */
        );
        /* Use the text as a mask for the background. */
        /* This will show the gradient as a text color rather than element bg. */
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .chakra-ui-dark .rainbow-conic-text {
        /* Create a conic gradient. */
        /* Double percentages to avoid blur (#000 10%, #fff 10%, #fff 20%, ...). */
        background: #ca4246;
        background-color: #ca4246;
        /* background: conic-gradient(
          #ca4246 16.666%,
          #ca4246 16.666%,
          #ffee00 33.333%,
          #ffee00 33.333%,
          #a7489b 50%,
          #8b9862 50%,
          #8b9862 66.666%,
          #ffee00 66.666%,
          #81e6d9 83.333%,
          #ffee00 83.333%
        ); */
        background: conic-gradient(
          #ffffff 16.666%,
          #ffffff 16.666%,
          #ff0000 33.333%,
          #ffffff 33.333%,
          #ffffff 50%,
          #ffffff 50%,
          #81e6d9 66.666%,
          #ffffff 66.666%,
          #ffffff 83.333%,
          #ffffff 83.333%
        );
        /* Use the text as a mask for the background. */
        /* This will show the gradient as a text color rather than element bg. */
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      /* Add animation on hover. */
      .rainbow-conic-text:hover {
        animation: rainbow-conic-text-animation 0.5s ease forwards;
      }

      /* Move the background and make it larger. */
      /* Animation shown when hovering over the text. */
      @keyframes rainbow-conic-text-animation {
        0% {
          background-size: 57%;
          background-position: 0 0;
        }
        20% {
          background-size: 57%;
          background-position: 0 1em;
        }
        100% {
          background-size: 300%;
          background-position: -9em 1em;
        }
      }

      /* Move the background and make it smaller. */
      /* Animation shown when entering the page and after the hover animation. */
      @keyframes rainbow-conic-text-animation-rev {
        0% {
          background-size: 300%;
          background-position: -9em 1em;
        }
        20% {
          background-size: 57%;
          background-position: 0 1em;
        }
        100% {
          background-size: 57%;
          background-position: 0 0;
        }
      }
      //#endregion

      //#region react-toggle
      .react-toggle {
        touch-action: pan-x;

        display: inline-block;
        position: relative;
        cursor: pointer;
        background-color: transparent;
        border: 0;
        padding: 0;

        -webkit-touch-callout: none;
        -webkit-user-select: none;
        -khtml-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;

        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
        -webkit-tap-highlight-color: transparent;
      }

      .react-toggle-screenreader-only {
        border: 0;
        clip: rect(0 0 0 0);
        height: 1px;
        margin: -1px;
        overflow: hidden;
        padding: 0;
        position: absolute;
        width: 1px;
      }

      .react-toggle--disabled {
        cursor: not-allowed;
        opacity: 0.5;
        -webkit-transition: opacity 0.25s;
        transition: opacity 0.25s;
      }

      .react-toggle-track {
        width: 50px;
        height: 24px;
        padding: 0;
        border-radius: 30px;
        background-color: #4d4d4d;
        -webkit-transition: all 0.2s ease;
        -moz-transition: all 0.2s ease;
        transition: all 0.2s ease;
      }

      .react-toggle:hover:not(.react-toggle--disabled) .react-toggle-track {
        background-color: #000000;
      }

      .react-toggle--checked .react-toggle-track {
        background-color: #19ab27;
      }

      .react-toggle--checked:hover:not(.react-toggle--disabled)
        .react-toggle-track {
        background-color: #128d15;
      }

      .react-toggle-track-check {
        position: absolute;
        width: 14px;
        height: 10px;
        top: 0px;
        bottom: 0px;
        margin: 4px 0 0 0;
        line-height: 0;
        left: 8px;
        opacity: 0;
        -webkit-transition: opacity 0.25s ease;
        -moz-transition: opacity 0.25s ease;
        transition: opacity 0.25s ease;
      }

      .react-toggle--checked .react-toggle-track-check {
        opacity: 1;
        -webkit-transition: opacity 0.25s ease;
        -moz-transition: opacity 0.25s ease;
        transition: opacity 0.25s ease;
      }

      .react-toggle-track-x {
        position: absolute;
        width: 10px;
        height: 10px;
        top: 0px;
        bottom: 0px;
        margin: 4px 0 0 0;
        line-height: 0;
        right: 10px;
        opacity: 1;
        -webkit-transition: opacity 0.25s ease;
        -moz-transition: opacity 0.25s ease;
        transition: opacity 0.25s ease;
      }

      .react-toggle--checked .react-toggle-track-x {
        opacity: 0;
      }

      .react-toggle-thumb {
        transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1) 0ms;
        position: absolute;
        top: 1px;
        left: 1px;
        width: 22px;
        height: 22px;
        border: 1px solid #4d4d4d;
        border-radius: 50%;
        background-color: #fafafa;

        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;

        -webkit-transition: all 0.25s ease;
        -moz-transition: all 0.25s ease;
        transition: all 0.25s ease;
      }

      .react-toggle--checked .react-toggle-thumb {
        left: 27px;
        border-color: #19ab27;
      }

      .react-toggle--focus .react-toggle-thumb {
        -webkit-box-shadow: 0px 0px 3px 2px #0099e0;
        -moz-box-shadow: 0px 0px 3px 2px #0099e0;
        box-shadow: 0px 0px 2px 3px #0099e0;
      }

      .react-toggle:active:not(.react-toggle--disabled) .react-toggle-thumb {
        -webkit-box-shadow: 0px 0px 5px 5px #0099e0;
        -moz-box-shadow: 0px 0px 5px 5px #0099e0;
        box-shadow: 0px 0px 5px 5px #0099e0;
      }
      //#endregion

      //#region tinymce
      .tox-tinymce-aux {
        z-index: 4000 !important;
      }
      //#endregion

      //#region toast
      .chakra-ui-light {
        .chakra-toast {
          .chakra-alert {
            background: rgba(255, 255, 255, 0.66);
          }
        }
      }

      .chakra-ui-dark {
        .chakra-toast {
          .chakra-alert {
            background: rgba(0, 0, 0, 0.66);
          }
        }
      }
      //#endregion
    `}
  />
);
