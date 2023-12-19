import React from "react";
import Layout from "../../components/layout/Layout";
import UserMenu from "../../components/layout/UserMenu";

const Oders = () => {
  return (
    <Layout title={"Your Oders"}>
      <div className="container-flui p-3 m-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <h1>All Oders</h1>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Oders;
