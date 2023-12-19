import React from "react";
import Layout from "../../components/layout/Layout";
import AdminMenu from "../../components/layout/AdminMenu";

const User = () => {
  return (
    <Layout title={"Dashboard -All User"}>
      <div className="row">
        <div className="col-md-3">
          <AdminMenu />
        </div>
        <div className="col-md-9">
          <h1>All User</h1>
        </div>
      </div>
    </Layout>
  );
};

export default User;
