import { useToast } from "@chakra-ui/react";
import { Editor } from "@tinymce/tinymce-react";
import React, { useEffect, useRef } from "react";
import type { Editor as TinyMCEEditor } from "tinymce";
import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import { Session } from "next-auth";
import { styled } from "twin.macro";
import axios from "axios";

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

const RTEditorStyles = styled("span")((props) => {
  return `
  
  `;
});

export const RTEditor = ({
  defaultValue,
  event,
  org,
  session,
  placeholder,
  readOnly,
  //onBlur,
  onChange,
  ...props
}: {
  defaultValue?: string;
  event?: IEvent;
  org?: IOrg;
  session?: Session | null;
  placeholder?: string;
  readOnly?: boolean;
  height?: string;
  width?: string;
  //onBlur?: ({ html }: { html: string }) => void;
  onChange?: ({ html }: { html: string }) => void;
}) => {
  const toast = useToast({ position: "top" });
  const editorRef = useRef<TinyMCEEditor | null>(null);

  // useEffect(() => {
  //   if (editorRef.current) {
  //     console.log(editorRef.current.getContent());
  //   }
  // }, [editorRef.current]);

  return (
    <RTEditorStyles>
      <Editor
        id="rteditor"
        tinymceScriptSrc="/tinymce/tinymce.min.js"
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue={defaultValue}
        init={{
          // -- styling
          branding: false,
          content_css: "default",
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
          height: props.height || undefined,
          placeholder,
          // --
          language: "fr_FR",
          language_url: "/tinymce/langs/fr_FR.js",
          menubar: false,
          // plugins: [
          //   "advlist autolink lists link image charmap print preview anchor",
          //   "searchreplace visualblocks code fullscreen",
          //   "insertdatetime media table paste code help wordcount",
          //   "image media"
          // ],
          plugins: [
            "autolink autoresize",
            "charmap fullscreen",
            "image link media paste searchreplace",
            "help"
          ],
          //autoresize_bottom_margin: 50,
          max_height: 500,
          contextmenu: "copy paste link",
          statusbar: false,
          toolbar:
            "fullscreen undo redo \
            | formatselect | \
            alignleft aligncenter bold italic charmap \
            | link image media \
            | removeformat | help",
          file_picker_types: "image",
          file_picker_callback: function (cb, value, meta) {
            var input = document.createElement("input");
            input.setAttribute("type", "file");
            input.setAttribute("accept", "image/*");
            input.onchange = function () {
              //@ts-expect-error
              var file = this.files[0];
              var reader = new FileReader();
              reader.onload = function () {
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
              failure("Erreur dans la sauvegarde des images", { remove: true });
            }
          }
        }}
        disabled={readOnly}
        onEditorChange={(html: string, editor: TinyMCEEditor) => {
          onChange && onChange({ html });
        }}
      />
    </RTEditorStyles>
  );
};
