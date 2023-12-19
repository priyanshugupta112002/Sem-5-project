import React, { useState } from "react";
import Layout from "../../components/layout/Layout";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/auth";

const Login = () => {
  const [auth, setAuth] = useAuth();
  const Navigate = useNavigate();
  const location = useLocation();

  const [userDetail, setUserDetail] = useState({
    email: "",
    password: "",
  });

  let name, value;
  const handleChange = (e) => {
    name = e.target.name;
    value = e.target.value;

    setUserDetail({ ...userDetail, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("1");
    // console.log(userDetail, "handlesubmit");
    const { email, password } = userDetail;
    console.log(email, password);
    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await res.json();
      console.log(data);
      if (res.status === 201) {
        setAuth({ ...auth, user: data.user, token: data.token });
        localStorage.setItem("auth", JSON.stringify(data));
        Navigate(location.state || "/");
      } else {
        toast.error("Invalid Credentails");
      }
    } catch (error) {
      console.log(error);
      toast.error("Login UnSuccesfully");
    }
  };

  return (
    <>
      <Layout title={"Login -> E-Commerce"}>
        <div className="form-container">
          <h2>Login Form</h2>
          <form method="POST">
            <div className="mb-3">
              <input
                type="email"
                name="email"
                value={userDetail.email}
                onChange={handleChange}
                className="form-control"
                id="exampleInputEmail"
                placeholder="Enter Your Email"
                autoComplete="off"
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="password"
                name="password"
                value={userDetail.password}
                onChange={handleChange}
                className="form-control"
                id="exampleInputPassword"
                placeholder="Enter Your Password"
                autoComplete="off"
                required
              />
            </div>

            <div className="mb-3">
              <button
                type="button"
                onClick={() => {
                  Navigate("/Forgot-passowrd");
                }}
                className="btn btn-primary"
              >
                forgot Password
              </button>
            </div>

            <button
              type="submit"
              onClick={handleSubmit}
              className="btn btn-primary"
            >
              Login
            </button>
          </form>
        </div>
      </Layout>
      ;
    </>
  );
};

export default Login;
