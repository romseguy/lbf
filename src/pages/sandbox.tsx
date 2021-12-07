import React from "react";
import { styled } from "twin.macro";

const SandboxStyles = styled("div")((props) => {
  return `
  .scrollable-nav {
    // First four are essential.
    display: block;
    width: 100%; 
    overflow-x: scroll;
    white-space: nowrap;
    // You can change these below if you'd like
    height: auto;
    padding: 10px;
    margin: 0;
    padding-top: 8px;
    padding-bottom: 8px;
    z-index: 5;
    
  }
  
  // Make sure the navbar-items are inline block.
  .scrollable-nav .navbar-item {
    display: inline-block;
    margin: 0 24px;
  }
  .scrollable-nav::-webkit-scrollbar:horizontal {
    height: 6px;
  }
  
  .scrollable-nav::-webkit-scrollbar-thumb {
    border-radius: 8px;
    border: 2px solid green;
    /* should match background, can't be transparent */
    background-color: rgba(0, 0, 0, .5);
  }
  // This one is important.
  .scrollable-nav::-webkit-scrollbar {
    -webkit-appearance: none;
  }
  /* 
.scrollable-nav::-webkit-scrollbar:horizontal {
  width: 11px; // This one is optional in case you wanna do this vertically too
} */
  
      `;
});

const Sandbox = () => {
  return (
    <SandboxStyles>
      <div className="scrollable-nav">
        <div className="container">
          <div className="some-className">
            <a href="#" className="navbar-item">
              Sports
            </a>
            <a href="#" className="navbar-item">
              News
            </a>
            <a href="#" className="navbar-item">
              Science
            </a>
            <a href="#" className="navbar-item">
              Programming
            </a>
            <a href="#" className="navbar-item">
              Bla Blah
            </a>
          </div>
        </div>
      </div>
    </SandboxStyles>
  );
};

export default Sandbox;
