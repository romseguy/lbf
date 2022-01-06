import React from "react";
import { styled } from "twin.macro";

const SandboxStyles = styled("div")((props) => {
  return `
  margin: 12px;
  `;
});

const Sandbox = () => {
  return <SandboxStyles>sandbox</SandboxStyles>;
};

export default Sandbox;
