import React from "react";
import Header from "./header";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div>
      <Header />
      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
