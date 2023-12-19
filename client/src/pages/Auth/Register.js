import React, { useState } from "react";
import Layout from "../../components/layout/Layout";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const Navigate = useNavigate();

  const [userDetail, setUserDetail] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    password: "",
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
    console.log("1");
    // console.log(userDetail, "handlesubmit");
    const { name, email, phone, address, password, answer } = userDetail;
    console.log(name, email, phone, address, password);
    try {
      const res = await fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          email,
          phone,
          address,
          password,
          answer,
        }),
      });
      if (res.status === 201) {
        toast.success("Succesfully Registered");
        Navigate("/login");
      } else if (res.status === 402) {
        toast.error("Email Id Already Exist");
      } else {
        toast.error("Registeration UnSuccesfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Registeration UnSuccesfully");
    }
  };

  return (
    <>
      <Layout title={"Register -> E-Commerce"}>
        <div className="form-container">
          <h2>Register Form</h2>
          <form method="POST">
            <div className="mb-3">
              <input
                type="text"
                name="name"
                value={userDetail.name}
                onChange={handleChange}
                className="form-control"
                id="exampleInputName"
                placeholder="Enter Your Name"
                autoComplete="off"
                required
              />
            </div>
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
              <input
                type="text"
                name="phone"
                value={userDetail.number}
                onChange={handleChange}
                className="form-control"
                id="exampleInputPhone"
                placeholder="Enter Your Number"
                autoComplete="off"
                required
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                name="address"
                value={userDetail.address}
                onChange={handleChange}
                className="form-control"
                id="exampleInputAddress"
                placeholder="Enter Your Address"
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
                id="exampleInputAddress"
                placeholder="(Security Question) Fist School Name"
                autoComplete="off"
                required
              />
            </div>

            <button
              type="submit"
              onClick={handleSubmit}
              className="btn btn-primary"
            >
              Submit
            </button>
          </form>
        </div>
      </Layout>
      ;
    </>
  );
};

export default Register;
