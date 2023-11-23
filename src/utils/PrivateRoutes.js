import { Outlet, Navigate } from "react-router-dom";
import CryptoJS from "crypto-js";

const PrivateRoutes = () => {
  const token = localStorage.getItem("token");

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoutes;
