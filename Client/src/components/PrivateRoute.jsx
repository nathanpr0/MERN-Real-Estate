import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export default function PrivateRoute() {
  const account = useSelector((state) => state["user"]);
  return account["currentUser"] ? <Outlet /> : <Navigate to="/sign-in" />;
}
