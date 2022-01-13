import { useToast } from "@chakra-ui/react";
import axios from "axios";
import Quill, { DeltaOperation } from "quill";
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";
import { Session } from "next-auth";
import { useCallback, useEffect, RefObject, useState } from "react";
import { useQuill } from "react-quilljs";
import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { getUniqueId } from "utils/string";
import { QuillEditorToolbar } from "./QuillEditorToolbar";
import { QuillEditorStyles } from "./QuillEditorStyles";

function deltaToHtml(deltaOps: DeltaOperation[]) {
  const converter = new QuillDeltaToHtmlConverter(deltaOps, {
    inlineStyles: true
  });
  const html = converter.convert();
  return html;
}

export const formats = [
  "size",
  "bold",
  "italic",
  "underline",
  "blockquote",
  "indent",
  "header",
  //"list",
  "color",
  "align",
  "link",
  "image",
  "imageBlot",
  "video",
  "undo",
  "redo"
];

export const QuillEditor = ({
  defaultValue,
  event,
  org,
  session,
  onBlur,
  onChange,
  readOnly,
  ...props
}: {
  defaultValue?: string;
  event?: IEvent;
  org?: IOrg;
  session?: Session | null;
  onBlur?: ({ html, quillHtml }: { html: string; quillHtml: string }) => void;
  onChange?: ({ html, quillHtml }: { html: string; quillHtml: string }) => void;
  readOnly?: boolean;
  placeholder?: string;
  height?: string;
  width?: string;
  formats?: string[];
}) => {
  const toast = useToast({ position: "top" });
  const shortId = getUniqueId();

  const [placeholder, setPlaceholder] = useState(props.placeholder);
  useEffect(() => {
    if (placeholder !== props.placeholder) setPlaceholder(placeholder);
  }, [props.placeholder]);

  const modules = (id: string) => ({
    history: {
      delay: 1000,
      maxStack: 50,
      userOnly: false
    },
    autoLinks: true,
    imageUploader: {
      upload: async (file: File) => {
        if (!/^image\//.test(file.type)) {
          toast({
            status: "error",
            title: "Vous devez sélectionner une image"
          });
          return;
        }

        if (file.size >= 10000000) {
          toast({
            status: "error",
            title: "L'image ne doit pas dépasser 10Mo."
          });
          return;
        }

        const formData = new FormData();
        formData.append("file", file);

        if (event) formData.append("eventId", event._id);
        else if (org) formData.append("orgId", org._id);
        else if (session) formData.append("userId", session.user.userId);

        const mutation = await axios.post(
          process.env.NEXT_PUBLIC_API2,
          formData
        );

        let url = `${process.env.NEXT_PUBLIC_API2}/view?fileName=${mutation.data.file}`;

        if (event) url += `&eventId=${event._id}`;
        else if (org) url += `&orgId=${org._id}`;
        else if (session) url += `&userId=${session.user.userId}`;

        return url;
      }
    },
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

    const AutoLinks = require("quill-auto-links").default; // or quill-magic-url
    Quill.register("modules/autoLinks", AutoLinks, true);

    // const ImageCompress = require("quill-image-compress").default;
    // Quill.register("modules/imageCompress", ImageCompress);

    const ImageUploader = require("utils/quill.imageUploader").default;
    Quill.register("modules/imageUploader", ImageUploader, true);
  }

  useEffect(() => {
    if (quill) {
      quill.on("selection-change", () => {
        if (onBlur && quill.root) {
          const delta = quill.getContents();
          onBlur({
            html: deltaToHtml(delta.ops),
            quillHtml: quill.root.innerHTML
          });
        }
      });

      quill.on("text-change", (/*delta, oldDelta, source*/) => {
        if (onChange && quill.root) {
          const delta = quill.getContents();
          onChange({
            html: deltaToHtml(delta.ops),
            quillHtml: quill.root.innerHTML
          });
        }
      });

      //quill.getModule("toolbar").addHandler("image", image);
      quill.getModule("toolbar").addHandler("insertHeart", () => {
        const cursorPosition = quill.getSelection().index;
        quill.insertText(cursorPosition, "♥");
        quill.setSelection(cursorPosition + 1);
      });
      quill.getModule("toolbar").addHandler("redo", () => quill.history.redo());
      quill.getModule("toolbar").addHandler("undo", () => quill.history.undo());
    }
  }, [quill]);

  useEffect(() => {
    if (quill && quill.root)
      quill.root.innerHTML =
        defaultValue === undefined
          ? localStorage.getItem("quillHtml") || ""
          : defaultValue;
  }, [quill, defaultValue]);

  return (
    <QuillEditorStyles height={props.height} width={props.width}>
      <QuillEditorToolbar
        id={shortId}
        formats={props.formats || formats}
        event={event}
        org={org}
      />
      <div ref={quillRef} />
    </QuillEditorStyles>
  );
};