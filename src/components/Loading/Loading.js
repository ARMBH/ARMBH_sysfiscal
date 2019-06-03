import React from "react";
import ReactLoading from "react-loading";
import "./Loading.css";

const Loading = ({ type, color }) => (
  <div className="center">
    <div className="center">
      <ReactLoading type={type} color={color} height={"20%"} width={"20%"} />
    </div>
  </div>
);

export default Loading;
