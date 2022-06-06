import { Spinner, useToast } from "@chakra-ui/react";
import { Editor, IAllProps } from "@tinymce/tinymce-react";
import axios from "axios";
import { Session } from "lib/SessionContext";
import React, { useEffect, useRef, useState } from "react";
import type {
  Editor as TinyMCEEditor,
  EditorEvent,
  RawEditorSettings
} from "tinymce";
import { styled } from "twin.macro";
import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import {
  incrementRTEditorIndex,
  selectRTEditorIndex,
  useAppDispatch
} from "store";
import { useSelector } from "react-redux";
import { bindEvent } from "utils/element";

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

const RTEditorStyles = styled("div")((props) => {
  return ``;
});

export const RTEditor = ({
  defaultValue,
  event,
  org,
  placeholder,
  readOnly,
  session,
  onBlur,
  onChange,
  ...props
}: {
  defaultValue?: string;
  event?: IEvent;
  org?: IOrg;
  placeholder?: string;
  readOnly?: boolean;
  session?: Session | null;
  height?: string;
  width?: string;
  onBlur?: (html: string) => void;
  onChange?: ({ html }: { html: string }) => void;
}) => {
  const dispatch = useAppDispatch();
  const toast = useToast({ position: "top" });

  const currentIndex = useSelector(selectRTEditorIndex);
  const [shortId, setShortId] = useState<string | undefined>();
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const closeToolbar = () => {
    if (editorRef.current) {
      if (editorRef.current.queryCommandState("ToggleToolbarDrawer")) {
        try {
          editorRef.current.execCommand("ToggleToolbarDrawer");
        } catch (error) {
          console.error(error);
        }
      }
    }
  };

  const [isLoading, setIsLoading] = useState(true);
  const init: IAllProps["init"] = {
    // -- styling
    branding: false,
    content_css: "default",
    content_style: `
    body { 
      font-family:Helvetica,Arial,sans-serif;
      font-size:14px;
      overflow-y: scroll;
    }
    p { margin: 0; padding: 0; }
    `,
    height: props.height || undefined,
    placeholder,
    // --
    language: "fr_FR",
    language_url: "/tinymce/langs/fr_FR.js",
    max_height: 500,
    menubar: false,
    mobile: {
      toolbar_mode: "floating"
    },
    // plugins: [
    //   "advlist autolink lists link image charmap print preview anchor",
    //   "searchreplace visualblocks code fullscreen",
    //   "insertdatetime media table paste code help wordcount",
    //   "image media"
    // ],
    plugins: [
      "autolink code",
      "emoticons charmap fullscreen",
      "image link media paste searchreplace",
      "help"
    ],
    //contextmenu: "copy paste link",
    contextmenu: false,
    statusbar: false,
    toolbar:
      "fullscreen undo redo \
             emoticons | formatselect | \
            alignleft aligncenter bold italic charmap \
            | link unlink | image media \
            | removeformat | code help",
    file_picker_types: "image",
    file_picker_callback: function (
      cb: Function,
      value: any,
      meta: Record<string, any>
    ) {
      var input = document.createElement("input");
      input.setAttribute("type", "file");
      input.setAttribute("accept", "image/*");
      input.onchange = function () {
        //@ts-expect-error
        var file = this.files[0];
        var reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result !== "string") return;
          var id = "blobid" + new Date().getTime();
          var blobCache = editorRef.current!.editorUpload.blobCache;
          var base64 = reader.result.split(",")[1];
          var blobInfo = blobCache.create(id, file, base64);
          blobCache.add(blobInfo);
          cb(blobInfo.blobUri(), { title: file.name });
        };
        reader.readAsDataURL(file);
      };

      input.click();
    },
    image_upload_handler: async (
      blobInfo: BlobInfo,
      success: (url: string) => void,
      failure: (err: string, options?: UploadFailureOptions) => void,
      progress?: (percent: number) => void
    ) => {
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
        const mutation = await axios.post(
          process.env.NEXT_PUBLIC_API2,
          formData
        );
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
  };

  useEffect(() => {
    dispatch(incrementRTEditorIndex());
  }, []);

  useEffect(() => {
    setShortId(`rteditor-${currentIndex}`);
  }, [currentIndex]);

  // useEffect(() => {
  //   if (editorRef.current) {
  //     console.log(editorRef.current.getContent());
  //   }
  // }, [editorRef.current]);

  return (
    <RTEditorStyles>
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
          initialValue={defaultValue}
          tinymceScriptSrc="/tinymce/tinymce.min.js"
          onBlur={(e, editor) => {
            closeToolbar();
            onBlur && onBlur(editor.getContent());
          }}
          onEditorChange={(html, editor) => {
            onChange && onChange({ html });
          }}
          onInit={(evt, editor) => {
            setIsLoading(false);
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
    </RTEditorStyles>
  );
};
