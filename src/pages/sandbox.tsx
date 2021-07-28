import React, { useState, useEffect } from "react";
import { Layout } from "features/layout";

const Sandbox: React.FC = () => {
  return (
    <Layout>
      {/* <RTEditor /> */}
      <div className="ql-editor css-5gzia5">
        <p>test</p>
        <p className="ql-indent-1">aujoud'hui</p>
        <h1>un titre</h1>
        <p>
          <strong>IDK</strong>
        </p>
        <p>
          <strong className="ql-size-huge">fgfd</strong>
        </p>
      </div>
    </Layout>
  );
};

export default Sandbox;
