import React from "react";
import Signin from "assets/divside.JPG";
import "./App.css";
// import SignUp from "./signin";
// import { Routes, Route } from "react-router";
// import Forgotpwd from "./ForgotPwd";

const Layout = ({ className, children }) => {
  return (
    <div className="scroll">
    <div className="container-fluid ">
      <div className="row">
        <div className="col-md-6 imgheight loginimage">
          <img src={Signin} alt="sideimg" />
        </div>

        <div className="col-md-6  ">
          <div className={className}>{children}</div>
        </div>
      </div>
    </div>
    </div>
  );
};
export default Layout;
