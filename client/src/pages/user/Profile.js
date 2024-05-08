import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import UserMenu from "../../components/layout/UserMenu";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
const Profile = () => {
  //context
  const [auth, setAuth] = useAuth();

  //state
  const [userDetail, setUserDetail] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    password: "",
  });

  useEffect(() => {
    const { name, email, address, phone, password } = auth?.user;

    setUserDetail({ name, email, address, phone, password });
  }, [auth?.user]);

  let name, value;

  const handleChange = (e) => {
    name = e.target.name;
    value = e.target.value;

    setUserDetail({ ...userDetail, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(userDetail, "handlesubmit");
    const { name, email, phone, address, password } = userDetail;
    console.log(name, email, phone, address, password);
    try {
      const res = await fetch("/update-profile", {
        method: "PUT",
        headers: {
          Authorization: auth?.token,
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          email,
          phone,
          address,
          password,
        }),
      });
      const data = await res.json();

      if (data.success === false) {
        toast.error(data.message);
      } else {
        setAuth({ ...auth, user: data?.updateUser });
        let ls = localStorage.getItem("auth");
        ls = JSON.parse(ls);
        ls.user = data.updateUser;
        localStorage.setItem("auth", JSON.stringify(ls));
        toast.success("Profile Updated Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Registeration UnSuccesfully");
    }
  };

  return (
    <Layout title={"Your Profile"}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
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
                  disabled
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
                />
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  name="phone"
                  value={userDetail.phone}
                  onChange={handleChange}
                  className="form-control"
                  id="exampleInputPhone"
                  placeholder="Enter Your Number"
                  autoComplete="off"
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
                />
              </div>

              <button
                type="submit"
                onClick={handleSubmit}
                className="btn btn-primary"
              >
                Update
              </button>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
