import { Global, css } from "@emotion/react";
import { breakpoints } from "theme/theme";
import tw from "twin.macro";

export const GlobalStyles = () => (
  <Global
    styles={css`
      @font-face {
        font-family: "DancingScript";
        src: url("/fonts/DancingScript-Regular.ttf");
        src: url("/fonts/DancingScript-Bold.ttf");
        src: url("/fonts/DancingScript-SemiBold.ttf");
      }

      @font-face {
        font-family: "Aladin";
        src: url("/fonts/Aladin-Regular.ttf");
      }

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

      @media (min-width: ${breakpoints["2xl"]}) {
        .chakra-ui-light {
          background: lightblue;
        }
        .chakra-ui-dark {
          background: black;
        }
      }

      ${GoogleMapStyles}
      ${RainbowTextStyles}
      ${ReactToggleStyles}

      .ql-editor {
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
      }
    `}
  />
);

const GoogleMapStyles = `
  .cluster > div {
    background: green;
    border-radius: 50%;
    color: white;
  }
`;

const RainbowTextStyles = `
  .rainbow-text {
    /* Create a conic gradient. */
    /* Double percentages to avoid blur (#000 10%, #fff 10%, #fff 20%, ...). */
    background: #ca4246;
    background-color: #ca4246;
    background: conic-gradient(
      #ca4246 16.666%,
      #e16541 16.666%,
      #e16541 33.333%,
      #f18f43 33.333%,
      #f18f43 50%,
      #8b9862 50%,
      #8b9862 66.666%,
      #476098 66.666%,
      #476098 83.333%,
      #a7489b 83.333%
    );

    /* Set the background size and repeat properties. */
    background-size: 57%;
    background-repeat: repeat;

    /* Use the text as a mask for the background. */
    /* This will show the gradient as a text color rather than element bg. */
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;

    /* Animate the text when loading the element. */
    /* This animates it on page load and when hovering out. */
    animation: rainbow-text-animation-rev 0.5s ease forwards;

    cursor: pointer;
  }

  /* Add animation on hover. */
  .rainbow-text:hover {
    animation: rainbow-text-animation 0.5s ease forwards;
  }

  /* Move the background and make it larger. */
  /* Animation shown when hovering over the text. */
  @keyframes rainbow-text-animation {
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
  @keyframes rainbow-text-animation-rev {
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
`;

const ReactToggleStyles = `
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
`;
