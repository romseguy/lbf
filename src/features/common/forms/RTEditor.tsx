import { Spinner, useColorMode } from "@chakra-ui/react";
import { useToast } from "hooks/useToast";

import { Editor, IAllProps } from "@tinymce/tinymce-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import type { Editor as TinyMCEEditor } from "tinymce";
import { useAppDispatch } from "store";
import {
  incrementRTEditorIndex,
  selectIsMobile,
  selectRTEditorIndex
} from "store/uiSlice";
import { MB } from "utils/string";
import { client } from "utils/api";
import {
  AddDocumentPayload,
  useAddDocumentMutation
} from "features/api/documentsApi";
import { getImageDimensions } from "utils/image";

type ProgressFn = (percent: number) => void;
type UploadHandler = (
  blobInfo: BlobInfo,
  progress: ProgressFn
) => Promise<string>;

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
  editor: TinyMCEEditor,
  eventName: string,
  fun: () => void
) => {
  const target = editor.contentDocument.documentElement;
  if (target && target.addEventListener) {
    target.removeEventListener(eventName, fun, false);
    target.addEventListener(eventName, fun, false);
  }
};

export const RTEditor = ({
  defaultValue,
  placeholder,
  readOnly,
  value,
  onBlur,
  onChange,
  ...props
}: IAllProps["init"] & {
  defaultValue?: string;
  setIsLoading?: (bool: boolean) => void;
  value?: string;
  onBlur?: (html: string) => void;
  onChange?: ({ html }: { html: string }) => void;
}) => {
  const { colorMode } = useColorMode();
  const isDark = colorMode === "dark";
  const dispatch = useAppDispatch();
  const isMobile = useSelector(selectIsMobile);
  const toast = useToast({ position: "top" });
  const [addDocument] = useAddDocumentMutation();

  const currentIndex = useSelector(selectRTEditorIndex);
  useEffect(() => {
    dispatch(incrementRTEditorIndex());
    setShortId(`rteditor-${currentIndex + 1}`);
    //   if (editorRef.current) {
    //     console.log(editorRef.current.getContent());
    //   }
  }, []);
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
    // image
    images_upload_handler,
    file_picker_types: "image", // file image media
    file_picker_callback: onImageClick,

    branding: false,
    browser_spellcheck: true,
    content_css: isDark ? "dark" : undefined,
    content_style: `
      body {
        font-family: 'Spectral', Georgia, ui-serif, serif;
        font-size: ${isMobile ? "16px" : "19px"};
        text-align: justify;
      }
      hr {
        border-top-width: 3px;
        margin: 0 24px;
      }
      p {
        margin: 0;
        padding: 0;
      }
    `,
    convert_urls: false,
    font_css: "/fonts/spectral.css",
    document_base_url: process.env.NEXT_PUBLIC_URL + "/",
    //font_family_formats: "Spectral",
    font_family_formats:
      "Spectral;Andale Mono=andale mono,times;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Trebuchet MS=trebuchet ms,geneva;Verdana=verdana,geneva;",
    height: props.height,
    language: "fr_FR",
    language_url: "/tinymce/langs/fr_FR.js",
    link_default_target: "_blank",
    min_height: props.minHeight,
    max_height: props.maxHeight || maxHeight,
    placeholder,
    skin: isDark ? "oxide-dark" : undefined,
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
          "emoticons",
          "blockquote",
          "image",
          "link",
          "anchor",
          "hr",
          //"removeformat",
          "searchreplace"
        ]
      },
      {
        name: "texte",
        items: [
          //"fontfamily",
          "styles",
          "fontsizeinput",
          "forecolor",
          "alignjustify",
          "aligncenter",
          "bold",
          "italic",
          "strikethrough",
          "charmap"
        ]
      },
      {
        name: "media",
        items: ["link", "unlink", "media", "code", "help"]
      }
    ]
  };

  function images_upload_handler(
    blobInfo: BlobInfo,
    progress: ProgressFn
  ): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const file = blobInfo.blob();

      if (file.size >= 10 * MB) {
        toast({
          status: "error",
          title: "L'image ne doit pas dépasser 10Mo."
        });
        reject("L'image ne doit pas dépasser 10Mo.");
      }

      const { width, height } = await getImageDimensions(file);
      let payload: AddDocumentPayload = {
        documentName: blobInfo.filename(),
        documentHeight: height,
        documentWidth: width,
        documentTime: new Date().getTime(),
        documentBytes: file.size
      };
      const { documentId } = await addDocument(payload).unwrap();

      if (documentId) {
        const formData = new FormData();
        formData.append("file", file, blobInfo.filename());
        formData.append("fileId", documentId);
        const xhr = new XMLHttpRequest();
        xhr.overrideMimeType("application/json");
        //xhr.responseType = "json";
        xhr.withCredentials = false;
        xhr.open("POST", process.env.NEXT_PUBLIC_API2);

        xhr.upload.onprogress = (e) => {
          progress((e.loaded / e.total) * 100);
        };

        xhr.onload = () => {
          if (xhr.status !== 200) {
            reject({ message: "HTTP Error: " + xhr.status, remove: true });
            return;
          }
          const data = JSON.parse(xhr.responseText);
          if (!data || typeof data.file !== "string") {
            reject("Invalid JSON: " + xhr.responseText);
            return;
          }
          resolve(process.env.NEXT_PUBLIC_FILES + "/" + data.file);
        };

        xhr.onerror = () => {
          reject(
            "Image upload failed due to a XHR Transport error. Code: " +
              xhr.status
          );
        };
        xhr.send(formData);
      }
    });
  }

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
            bindEvent(editor, "click", () => {
              closeToolbar();
            });
          }}
        />
      )}
    </>
  );
};

{
  /*

  async function uploadImage(
    blobInfo: BlobInfo,
    success: (url: string) => void,
    failure: (err: string, options?: UploadFailureOptions) => void,
    progress?: (percent: number) => void
  ) {
    try {
      const file = blobInfo.blob();

      if (file.size >= 10 * MB) {
        toast({
          status: "error",
          title: "L'image ne doit pas dépasser 10Mo."
        });
        return;
      }
      const { width, height } = await getImageDimensions(file);
      let payload: AddDocumentPayload = {
        documentName: blobInfo.filename(),
        documentHeight: height,
        documentWidth: width,
        documentTime: new Date().getTime(),
        documentBytes: file.size
      };
      const doc = await addDocument(payload).unwrap();

      let formData = new FormData();
      formData.append("files[]", file, blobInfo.filename());
      formData.append("fileId", doc._id);

      // if (event) formData.append("fileId", event._id);
      // else if (org) formData.append("fileId", org._id);
      // else if (session) formData.append("userId", session.user.userId);
      const mutation = await client.post("/", formData);
      if (mutation.status !== 200) {
        failure("Erreur dans la sauvegarde des images", {
          remove: true
        });
        return;
      }
      return;
      if (typeof mutation.data.file !== "string") {
        failure("Réponse invalide", { remove: true });
        return;
      }

      let url = `${process.env.NEXT_PUBLIC_API2}/view?fileName=${mutation.data.file}`;
      // if (event) url += `&eventId=${event._id}`;
      // else if (org) url += `&orgId=${org._id}`;
      // else if (session) url += `&userId=${session.user.userId}`;

      success(url);
    } catch (error) {
      console.error(error);
      failure("Erreur dans la sauvegarde des images", {
        remove: true
      });
    }
  }

  */
}
