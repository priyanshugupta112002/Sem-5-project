import React, { useState } from "react";
import Layout from "../../components/layout/Layout";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const Navigate = useNavigate();

  const [userDetail, setUserDetail] = useState({
    email: "",
    newPassword: "",
    answer: "",
  });

  let name, value;
  const handleChange = (e) => {
    name = e.target.name;
    value = e.target.value;

    setUserDetail({ ...userDetail, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("1");
    // console.log(userDetail, "handlesubmit");
    const { email, newPassword, answer } = userDetail;
    console.log(email, newPassword, answer);
    try {
      const res = await fetch("/password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          newPassword,
          answer,
        }),
      });
      const data = await res.json();
      console.log(data);
      if (res.status === 201) {
        Navigate("/login");
      } else {
        toast.error("Invalid Credentails");
      }
    } catch (error) {
      console.log(error);
      toast.error("Login UnSuccesfully");
    }
  };

  return (
    <Layout title={"Forgot Passowrd"}>
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
              type="text"
              name="answer"
              value={userDetail.answer}
              onChange={handleChange}
              className="form-control"
              id="exampleInputAnswer"
              placeholder="Your First School Name"
              autoComplete="off"
              required
            />
          </div>
          <div className="mb-3">
            <input
              type="password"
              name="newPassword"
              value={userDetail.newPassword}
              onChange={handleChange}
              className="form-control"
              id="exampleInputPassword"
              placeholder="Enter New Password"
              autoComplete="off"
              required
            />
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            className="btn btn-primary"
          >
            Reset
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ForgotPassword;
