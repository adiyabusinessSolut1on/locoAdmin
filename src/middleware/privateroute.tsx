import React from "react";
import { Navigate, Outlet } from "react-router-dom";

interface PrivateRouteProps {
  token: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = () => {
  const token = localStorage.getItem("user");
  const isValidToken = token ? true : false;
  console.log("Tokaen in Private", isValidToken);
  console.log(token);
  return isValidToken ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
