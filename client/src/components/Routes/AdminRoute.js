import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Spinner from "../layout/Spinner";
import { useAuth } from "../../context/auth";

const AdminRoute = () => {
  const [ok, setOk] = useState(false);
  const [auth] = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      // console.log(auth.token);
      const res = await fetch("/admin-auth", {
        headers: {
          Authorization: auth?.token,
        },
      });
      console.log(res);
      console.log(res.ok);
      if (res.ok) {
        setOk(true);
      } else {
        setOk(false);
      }
    };
    if (auth?.token) authCheck();
  }, [auth?.token]);

  return ok ? <Outlet /> : <Spinner path="" />;
};
export default AdminRoute;
