import React from "react";
import SideBar from "../sidebar";
import { Outlet } from "react-router-dom";
import Loading from "../Loading";
import { useDispatch, useSelector } from "react-redux";
import { getLoading } from "../../store";
import { useEffect } from "react";

const Layout = () => {
  const loading = useSelector(getLoading);

  return (
    <div className="flex h-full relative">
      {loading ? <Loading /> : <></>}
      <SideBar />
      <Outlet />
    </div>
  );
};

export default Layout;
