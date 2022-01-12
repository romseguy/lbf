import React from "react";
import { styled } from "twin.macro";
import { RTEditor } from "features/common/forms/RTEditor";
import { Button } from "@chakra-ui/react";

const SandboxStyles = styled("div")((props) => {
  return `
  `;
});

const Sandbox = () => {
  return (
    <SandboxStyles>
      <RTEditor />
      <Button onClick={() => {}}>Valider</Button>
    </SandboxStyles>
  );
};

export default Sandbox;
