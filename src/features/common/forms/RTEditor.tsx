import { Tooltip, useColorMode, useToast } from "@chakra-ui/react";
import styled from "@emotion/styled";
import axios from "axios";
import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { IUser } from "models/User";
import { Session, User } from "next-auth";
import type Quill from "quill";
import "quill/dist/quill.snow.css";
import { useCallback, useEffect, RefObject } from "react";
import { FaHeart } from "react-icons/fa";
import { useQuill } from "react-quilljs";
import { pickFile } from "utils/form";
import { getUniqueId } from "utils/string";

const tempImages = [];

export const formats = [
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

const ReactQuillStyles = styled("span")(
  (props: { height?: string; width?: string }) => {
    const { colorMode } = useColorMode();
    const bothColorModes = `
      .ql-editor {
        padding: 12px;
      }

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
          border: 1px solid #5F6774;
        }

        .ql-container {
          border: 1px solid #5F6774;
        }
      }

      .ql-toolbar {
        border: 1px solid #4F5765;

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
        border: 1px solid #4F5765;
      }
      `
    }
    `;
  }
);

const CustomToolbar = ({
  id,
  formats,
  event,
  org
}: {
  id: string;
  formats: string[];
  event?: IEvent;
  org?: IOrg;
}) => {
  return (
    <div id={id}>
      {formats.includes("size") && (
        <span className="ql-formats">
          <select className="ql-size" title="Taille du texte" />
        </span>
      )}
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
  );
};

export const RTEditor = ({
  defaultValue,
  event,
  org,
  session,
  onChange,
  readOnly,
  placeholder,
  ...props
}: {
  defaultValue?: string;
  event?: IEvent;
  org?: IOrg;
  session?: Session;
  onChange?: (html: string) => void;
  readOnly?: boolean;
  placeholder?: string;
  height?: string;
  width?: string;
  formats?: string[];
}) => {
  const toast = useToast({ position: "top" });
  const shortId = getUniqueId();

  const modules = (id: string) => ({
    history: {
      delay: 1000,
      maxStack: 50,
      userOnly: false
    },
    // imageUploader: {
    //   upload: (file: File) => {
    //     console.log(file);

    //     return new Promise((resolve, reject) => {
    //       setTimeout(() => {
    //         resolve(
    //           "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/JavaScript-logo.png/480px-JavaScript-logo.png"
    //         );
    //       }, 3500);
    //     });
    //   }
    // },
    toolbar: {
      container: "#" + id,
      handlers: {
        //image: () => {},
        insertHeart: () => {},
        undo: () => {},
        redo: () => {}
      }
    }
  });

  const options = {
    theme: "snow",
    modules: modules(shortId),
    formats: props.formats || formats,
    placeholder,
    readOnly
  };

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
  } = useQuill(options);

  const image = useCallback(() => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      //@ts-expect-error
      const file = input.files[0];

      if (/^image\//.test(file.type)) {
        if (file.size >= 50000000) {
          toast({
            status: "error",
            title: "L'image ne doit pas dépasser 10Mo."
          });
          return;
        }
        // const range = quill.getSelection();
        // const blob = window.URL.createObjectURL(file);
        // quill.insertEmbed(range.index, "image", blob);
        // tempImages.push({ blob, file });

        const data = new FormData();
        data.append("file", file);

        if (event) data.append("eventId", event._id);
        else if (org) data.append("orgId", org._id);
        else if (session) data.append("userId", session.user.userId);

        const mutation = await axios.post(process.env.NEXT_PUBLIC_API2, data, {
          onUploadProgress: (ProgressEvent) => {
            console.log(ProgressEvent);
            // setLoaded((ProgressEvent.loaded / ProgressEvent.total) * 100);
          }
        });

        let url = `${process.env.NEXT_PUBLIC_API2}/view?fileName=${mutation.data.file}`;

        if (event) url += `&eventId=${event._id}`;
        else if (org) url += `&orgId=${org._id}`;
        else if (session) url += `&userId=${session.user.userId}`;

        if (mutation.data) {
          const range = quill.getSelection();
          quill.insertEmbed(range.index, "image", url);
        }
      } else {
        alert("Vous devez sélectionner une image.");
      }
    };
  }, [quill]);

  // const image = useCallback(() => {
  //   const input = document.createElement("input");

  //   input.setAttribute("type", "file");
  //   input.setAttribute("accept", "image/*");
  //   input.click();

  //   input.onchange = () => {
  //     //@ts-expect-error
  //     const [file] = input.files;

  //     console.log(file);

  //     if (/^image\//.test(file.type)) {
  //       const range = quill.getSelection();
  //       const blob = URL.createObjectURL(file);

  //       quill.insertEmbed(range.index, "image", blob);
  //       quill.setSelection(range.index + 1);

  //       tempImage.push({ blob, file });
  //     } else {
  //       alert("Vous devez sélectionner une image.");
  //     }
  //   };
  // }, [quill]);

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
    const Image = Quill.import("formats/image");
    Image.sanitize = (url: any) => url;

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

    // const ImageCompress = require("quill-image-compress").default; // Install with 'yarn add quill-magic-url'
    // Quill.register("modules/imageCompress", ImageCompress);
    // const ImageUploader = require("quill-image-uploader").default; // Install with 'yarn add quill-magic-url'
    // Quill.register("modules/imageUploader", ImageUploader);
  }

  useEffect(() => {
    if (quill) {
      if (quill.root) {
        quill.root.innerHTML = defaultValue || "";
      }

      quill.on("text-change", () => {
        if (quill.root) {
        }
        const text = quill.getText();

        if (onChange && quill.root) onChange(quill.root.innerHTML);
      });

      quill.getModule("toolbar").addHandler("image", image);
      quill.getModule("toolbar").addHandler("insertHeart", insertHeart);
      quill.getModule("toolbar").addHandler("undo", undo);
      quill.getModule("toolbar").addHandler("redo", redo);
    }
  }, [quill, undo, redo, insertHeart]);

  useEffect(() => {
    if (quill && quill.root)
      quill.root.innerHTML = defaultValue === undefined ? "" : defaultValue;
  }, [defaultValue]);

  return (
    <ReactQuillStyles height={props.height} width={props.width}>
      <CustomToolbar
        id={shortId}
        formats={props.formats || formats}
        event={event}
        org={org}
      />
      <div ref={quillRef} />
    </ReactQuillStyles>
  );
};

// <button
//   onClick={(e) => {
//     e.preventDefault();
//     pickFile(async (file: File) => {
//       if (file.size >= 50000000) {
//         toast({
//           status: "error",
//           title: "Le fichier ne doit pas dépasser 50Mo."
//         });
//       } else {
//         if (event) {
//           const data = new FormData();
//           data.append("file", file, file.name);
//           data.append("eventId", event._id);

//           const { statusText } = await axios.post(
//             process.env.NEXT_PUBLIC_API2,
//             data,
//             {
//               onUploadProgress: (ProgressEvent) => {
//                 console.log(ProgressEvent);

//                 // setLoaded((ProgressEvent.loaded / ProgressEvent.total) * 100);
//               }
//             }
//           );

//           if (statusText === "OK") {
//             toast({
//               title: "Votre image a bien été ajoutée !",
//               status: "success"
//             });
//           }
//         }
//       }
//     });
//   }}
// >
//   <svg viewBox="0 0 18 18">
//     <rect className="ql-stroke" height="10" width="12" x="3" y="4" />
//     <circle className="ql-fill" cx="6" cy="7" r="1" />
//     <polyline
//       className="ql-even ql-fill"
//       points="5 12 5 11 7 9 8 10 11 7 13 9 13 12 5 12"
//     />
//   </svg>
// </button>
