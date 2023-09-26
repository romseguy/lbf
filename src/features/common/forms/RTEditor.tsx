import { Spinner, useToast } from "@chakra-ui/react";
import { Editor, IAllProps } from "@tinymce/tinymce-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import type { Editor as TinyMCEEditor } from "tinymce";
import theme from "features/layout/theme";
import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { useAppDispatch } from "store";
import { incrementRTEditorIndex, selectRTEditorIndex } from "store/uiSlice";
import { client } from "utils/api";
import { Session } from "utils/auth";

interface BlobInfo {
  id: () => string;
  name: () => string;
  filename: () => string;
  blob: () => Blob;
  base64: () => string;
  blobUri: () => string;
  uri: () => string | undefined;
}

interface UploadFailureOptions {
  remove?: boolean;
}

const bindEvent = (
  target: Document | Element,
  eventName: string,
  fun: () => void
) => {
  if (target.addEventListener) {
    target.removeEventListener(eventName, fun, false);
    target.addEventListener(eventName, fun, false);
  }
};

export const RTEditor = ({
  defaultValue,
  event,
  org,
  placeholder,
  readOnly,
  session,
  value,
  onBlur,
  onChange,
  ...props
}: IAllProps["init"] & {
  defaultValue?: string;
  event?: IEvent;
  org?: IOrg;
  session?: Session | null;
  setIsLoading?: (bool: boolean) => void;
  value?: string;
  onBlur?: (html: string) => void;
  onChange?: ({ html }: { html: string }) => void;
}) => {
  const dispatch = useAppDispatch();
  const toast = useToast({ position: "top" });

  const currentIndex = useSelector(selectRTEditorIndex);
  const [isLoading, setIsLoading] = useState(true);
  const [isTouched, setIsTouched] = useState(false);
  const [shortId, setShortId] = useState<string | undefined>();
  const [maxHeight, setMaxHeight] = useState(0);
  useEffect(() => setMaxHeight(window.innerHeight - 80), []);

  //#region tinymce
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const closeToolbar = useCallback(() => {
    const editor = editorRef.current;
    if (editor) {
      editor.on("keydown", (e) => {
        if (e.keyCode === 27) {
          //escape
        }
      });

      if (editor.queryCommandState("ToggleToolbarDrawer")) {
        try {
          editor.execCommand("ToggleToolbarDrawer");
        } catch (error) {
          console.error(error);
        }
      }
    }
  }, [editorRef]);
  const init: IAllProps["init"] = {
    branding: false,
    content_style: `
      @font-face {
        font-family: "Spectral";
        src: url("/fonts/Spectral-Regular.ttf");
      }
      body {
        /*font-family: -apple-system-ui-serif, ui-serif, Spectral, Georgia, serif;*/
        font-family: ${theme.fonts.spectral};
        font-size: 19px;
        text-align: justify;
      }
    `,
    convert_urls: false,
    document_base_url: process.env.NEXT_PUBLIC_URL + "/",
    file_picker_types: "image", // file image media
    file_picker_callback: onImageClick,
    height: props.height,
    image_upload_handler: uploadImage,
    language: "fr_FR",
    language_url: "/tinymce/langs/fr_FR.js",
    min_height: props.minHeight,
    max_height: props.maxHeight || maxHeight,
    text_patterns: [
      { start: "*", end: "*", format: "italic" },
      { start: "**", end: "**", format: "bold" },
      { start: "#", format: "h1" },
      { start: "##", format: "h2" },
      { start: "###", format: "h3" },
      { start: "####", format: "h4" },
      { start: "#####", format: "h5" },
      { start: "######", format: "h6" },
      // The following text patterns require the `lists` plugin
      { start: "1. ", cmd: "InsertOrderedList" },
      { start: "* ", cmd: "InsertUnorderedList" },
      { start: "- ", cmd: "InsertUnorderedList" }
    ],
    plugins: [
      "anchor",
      "autolink",
      "autoresize",
      "charmap",
      "code",
      "emoticons",
      "fullscreen",
      "help",
      //"hr",
      "image",
      "link",
      "lists",
      "media",
      //"paste",
      "searchreplace"
    ],
    contextmenu: false,
    menubar: false,
    statusbar: false,
    toolbar: [
      {
        name: "outils",
        items: [
          "fullscreen",
          "undo",
          "redo",
          "link",
          "anchor",
          "hr",
          "removeformat",
          "searchreplace"
        ]
      },
      {
        name: "texte",
        items: [
          //"fontsize",
          "forecolor",
          "alignleft",
          "aligncenter",
          "bold",
          "italic",
          "charmap"
        ]
      },
      {
        name: "media",
        items: ["emoticons", "link", "unlink", "image", "media", "code", "help"]
      }
    ]
  };
  // const init: IAllProps["init"] = {
  //   //#region styling
  //   branding: false,
  //   content_css: "default",
  //   content_style: `
  //   body {
  //     font-family:Helvetica,Arial,sans-serif;
  //     font-size:14px;
  //     overflow-y: scroll;
  //   }
  //   p { margin: 0; padding: 0; }
  //   `,
  //   height: props.height,
  //   max_height: 500,
  //   placeholder,
  //   //endregion

  //   language: "fr_FR",
  //   language_url: "/tinymce/langs/fr_FR.js",
  //   //contextmenu: "copy paste link",
  //   contextmenu: false,
  //   menubar: false,
  //   statusbar: false,
  //   plugins: [
  //     "anchor",
  //     "autolink",
  //     "charmap",
  //     "code",
  //     "emoticons",
  //     "fullscreen",
  //     "help",
  //     //"hr",
  //     "image",
  //     "link",
  //     "media",
  //     //"paste",
  //     "searchreplace"
  //   ],
  //   toolbar: [
  //     {
  //       name: "",
  //       items: [
  //         "fullscreen",
  //         "removeformat",
  //         "undo",
  //         "redo",
  //         "link",
  //         "anchor",
  //         "hr"
  //       ]
  //     },
  //     {
  //       name: "texte",
  //       items: [
  //         "fontsize",
  //         "forecolor",
  //         "alignleft",
  //         "aligncenter",
  //         "bold",
  //         "italic",
  //         "charmap"
  //       ]
  //     },
  //     {
  //       name: "media",
  //       items: ["emoticons", "link", "unlink", "image", "media", "code", "help"]
  //     }
  //   ],
  //   //extended_valid_elements: "a[id|name|href|target=_blank]",
  //   file_picker_types: "image",
  //   file_picker_callback: onImageClick,
  //   image_upload_handler: uploadImage,
  //   relative_urls: true,
  //   //remove_script_host: false,
  //   document_base_url: process.env.NEXT_PUBLIC_URL + "/",

  //   mobile: {
  //     //   toolbar_location: "bottom",
  //     toolbar_mode: "floating"
  //   }
  // };

  function onImageClick(
    cb: Function
    /*
      value: any,
      meta: Record<string, any>
      */
  ) {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.onchange = onFileInputChange;
    input.click();

    function onFileInputChange() {
      //@ts-expect-error
      const file = this.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result !== "string") return;
        const id = "blobid" + new Date().getTime();
        const blobCache = editorRef.current!.editorUpload.blobCache;
        const base64 = reader.result.split(",")[1];
        const blobInfo = blobCache.create(id, file, base64);
        blobCache.add(blobInfo);
        cb(blobInfo.blobUri(), { title: file.name });
      };
      reader.readAsDataURL(file);
    }
  }

  async function uploadImage(
    blobInfo: BlobInfo,
    success: (url: string) => void,
    failure: (err: string, options?: UploadFailureOptions) => void,
    progress?: (percent: number) => void
  ) {
    let formData = new FormData();
    const file = blobInfo.blob();

    if (file.size >= 10000000) {
      toast({
        status: "error",
        title: "L'image ne doit pas dépasser 10Mo."
      });
      return;
    }

    formData.append("files[]", file, blobInfo.filename());
    if (event) formData.append("eventId", event._id);
    else if (org) formData.append("orgId", org._id);
    else if (session) formData.append("userId", session.user.userId);

    try {
      const mutation = await client.post("/", formData);
      if (mutation.status !== 200) {
        failure("Erreur dans la sauvegarde des images", {
          remove: true
        });
        return;
      }
      if (typeof mutation.data.file !== "string") {
        failure("Réponse invalide", { remove: true });
        return;
      }

      let url = `${process.env.NEXT_PUBLIC_API2}/view?fileName=${mutation.data.file}`;
      if (event) url += `&eventId=${event._id}`;
      else if (org) url += `&orgId=${org._id}`;
      else if (session) url += `&userId=${session.user.userId}`;

      success(url);
    } catch (error) {
      console.error(error);
      failure("Erreur dans la sauvegarde des images", {
        remove: true
      });
    }
  }
  //#endregion

  useEffect(() => {
    dispatch(incrementRTEditorIndex());
    setShortId(`rteditor-${currentIndex + 1}`);
    //   if (editorRef.current) {
    //     console.log(editorRef.current.getContent());
    //   }
  }, []);

  return (
    <>
      {isLoading && (
        <div
          style={{
            position: "relative"
          }}
        >
          <Spinner />
        </div>
      )}

      {shortId && (
        <Editor
          disabled={readOnly}
          id={shortId}
          init={init}
          initialValue={isTouched ? undefined : defaultValue}
          tinymceScriptSrc="/tinymce/tinymce.min.js"
          value={value}
          onBlur={(e, editor) => {
            closeToolbar();
            onBlur && onBlur(editor.getContent());
          }}
          onEditorChange={(html, editor) => {
            onChange && onChange({ html });

            if (html !== defaultValue) {
              setIsTouched(true);
            }
          }}
          onInit={(evt, editor) => {
            setIsLoading(false);
            props.setIsLoading && props.setIsLoading(false);
            editorRef.current = editor;
            const target = editor.contentDocument.documentElement;

            if (target) {
              bindEvent(target, "click", () => {
                closeToolbar();
              });
            }
          }}
        />
      )}
    </>
  );
};
