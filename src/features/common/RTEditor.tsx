import Quill, { QuillOptionsStatic } from "quill";
import "quill/dist/quill.snow.css";
import { useCallback, useEffect, RefObject } from "react";
import { useQuill } from "react-quilljs";
import styled from "@emotion/styled";
import { BoxProps, Tooltip, useColorMode } from "@chakra-ui/react";
import { FaHeart } from "react-icons/fa";

const ReactQuillStyles = styled("span")(
  (props: { height?: string; width?: string }) => {
    const { colorMode } = useColorMode();
    const bothColorModes = `
    &:hover {
      .ql-toolbar {
        border: 1px solid #cbd5e0;
      }

      .ql-container {
        border: 1px solid #cbd5e0;
      }
    }

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

    .ql-container.ql-disabled {
      * {
        cursor: not-allowed;
      }
    }

    .ql-container {
      width: ${props.width ? props.width : ""};
      height: ${props.height ? props.height : ""};
      border: 1px solid #e2e8f0;
      border-bottom-left-radius: 6px;
      border-bottom-right-radius: 6px;

      & > .ql-editor.ql-blank::before {
        font-size: 16px;
        color: ${colorMode === "dark" ? "#7b8593" : "#bfc7ce"};
        font-style: normal;
        overflow: hidden;
        white-space: nowrap;
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
          border: 1px solid white;
        }

        .ql-container {
          border: 1px solid white;
        }
      }

      .ql-toolbar {
        border: 1px solid #7b8593;

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
        border: 1px solid #7b8593;
      }
      `
    }

    `;
  }
);

const defaultToolbar = {
  container: [
    ["bold", "italic", "underline", "blockquote"], // toggled buttons

    // [{ header: 1 }, { header: 2 }], // custom button values
    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ list: "ordered" }, { list: "bullet" }],
    // [{ indent: "-1" }, { indent: "+1" }], // outdent/indent

    [{ color: [] }], // dropdown with defaults from theme
    [{ align: [] }],

    ["link", "image", "video"],

    ["undo", "redo"],

    ["clean"] // remove formatting button
  ],
  handlers: {
    undo: () => {},
    redo: () => {}
  }
};

export const RTEditor = ({
  defaultValue,
  onChange,
  readOnly,
  placeholder,
  toolbar = defaultToolbar,
  ...props
}: {
  defaultValue?: string;
  onChange?: (html: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  toolbar?: any;
  height?: string;
  width?: string;
}) => {
  const modules = {
    history: {
      delay: 1000,
      maxStack: 50,
      userOnly: false
    },
    toolbar: {
      container: "#toolbar",
      handlers: {
        insertHeart: () => {},
        undo: () => {},
        redo: () => {}
      }
    }
  };
  const formats = [
    "size",
    "bold",
    "italic",
    "underline",
    "blockquote",
    "header",
    "list",
    "color",
    "align",
    "link",
    "image",
    "video",
    "undo",
    "redo"
  ];

  const {
    quill,
    quillRef,
    Quill
  }: {
    Quill: any;
    quillRef: RefObject<any>;
    quill: any;
    editorRef: RefObject<any>;
    editor: Quill | undefined;
  } = useQuill({
    theme: "snow",
    modules,
    formats,
    placeholder,
    readOnly
  });

  const insertHeart = useCallback(() => {
    const cursorPosition = quill.getSelection().index;
    quill.insertText(cursorPosition, "♥");
    quill.setSelection(cursorPosition + 1);
  }, [quill]);

  const undo = useCallback(() => {
    return quill!.history.undo();
  }, [quill]);

  const redo = useCallback(() => {
    return quill!.history.redo();
  }, [quill]);

  if (Quill && !quill) {
    var icons = Quill.import("ui/icons");
    icons[
      "undo"
    ] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18px" height="18px">
      <path d="M0 0h24v24H0z" fill="none"/>
      <path class="ql-fill" d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/>
      </svg>`;
    icons[
      "redo"
    ] = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18px" height="18px">
      <path d="M0 0h24v24H0z" fill="none"/>
      <path class="ql-fill" d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"/>
      </svg>`;
  }

  useEffect(() => {
    if (quill) {
      // quill.clipboard.dangerouslyPasteHTML(defaultValue);
      quill.root.innerHTML = defaultValue || "";

      quill.on("text-change", () => {
        const html = quill.root.innerHTML;
        const text = quill.getText();

        onChange && onChange(html);
      });

      quill.getModule("toolbar").addHandler("undo", undo);
      quill.getModule("toolbar").addHandler("redo", redo);
      quill.getModule("toolbar").addHandler("insertHeart", insertHeart);
    }
  }, [quill, undo, redo, insertHeart]);

  useEffect(() => {
    // console.log("RTE: NEW DEFAULT VALUE", typeof defaultValue, defaultValue);
    if (quill)
      quill.root.innerHTML = defaultValue === undefined ? "" : defaultValue;
  }, [defaultValue]);

  return (
    <ReactQuillStyles height={props.height} width={props.width}>
      <div id="toolbar">
        <span className="ql-formats">
          <select className="ql-size" title="Taille du texte">
            <option value="small">Petit</option>
            <option selected />
            <option value="large">Grand</option>
            <option value="huge">Très grand</option>
          </select>
        </span>
        <span className="ql-formats">
          <select className="ql-color" title="Texte en couleur" />

          <Tooltip label="Texte en gras">
            <button className="ql-bold" />
          </Tooltip>
          <Tooltip label="Texte en italique">
            <button className="ql-italic" />
          </Tooltip>
          <Tooltip label="Texte souligné">
            <button className="ql-underline" />
          </Tooltip>
        </span>
        <span className="ql-formats">
          <Tooltip label="Citation">
            <button className="ql-blockquote" />
          </Tooltip>
          <select className="ql-align" title="Aligner le texte" />
        </span>
        <span className="ql-formats">
          <Tooltip label="Annuler">
            <button className="ql-undo" />
          </Tooltip>
          <Tooltip label="Refaire">
            <button className="ql-redo" />
          </Tooltip>
        </span>
        <span className="ql-formats">
          <Tooltip label="Insérer une image">
            <button className="ql-image" />
          </Tooltip>
          <Tooltip label="Insérer une vidéo">
            <button className="ql-video" />
          </Tooltip>
          <Tooltip label="Insérer un lien">
            <button className="ql-link" />
          </Tooltip>
        </span>
        <span className="ql-formats">
          <Tooltip label="Supprimer le formatage">
            <button className="ql-clean" />
          </Tooltip>
          <Tooltip label="Insérer un ♥">
            <button className="ql-insertHeart">
              <FaHeart />
            </button>
          </Tooltip>
        </span>
      </div>
      <div ref={quillRef} />
    </ReactQuillStyles>
  );
};
