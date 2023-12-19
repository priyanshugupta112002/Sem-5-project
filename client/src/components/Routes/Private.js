import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Outlet } from "react-router-dom";
import Spinner from "../layout/Spinner";

const Private = () => {
  const [ok, setOk] = useState(false);
  const [auth] = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      // console.log(auth.token);
      const res = await fetch("/user-auth", {
        headers: {
          Authorization: auth?.token,
        },
      });
      const data = await res.json();
      if (res.ok || data.ok) {
        setOk(true);
      } else {
        setOk(false);
      }
    };
    if (auth?.token) authCheck();
  }, [auth?.token]);

  return ok ? <Outlet /> : <Spinner />;
};
export default Private;
