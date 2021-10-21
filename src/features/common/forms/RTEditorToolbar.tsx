import { Tooltip } from "@chakra-ui/react";
import { IEvent } from "models/Event";
import { IOrg } from "models/Org";
import React from "react";
import { FaHeart } from "react-icons/fa";

export const RTEditorToolbar = ({
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
      {formats.includes("list") && (
        <span className="ql-formats">
          <button className="ql-list" value="ordered"></button>
          <button className="ql-list" value="bullet"></button>
        </span>
      )}
      <span className="ql-formats">
        <button className="ql-indent" value="-1"></button>
        <button className="ql-indent" value="+1"></button>
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
