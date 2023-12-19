import React from "react";
import Layout from "../components/layout/Layout";
const Contact = () => {
  return (
    <Layout title={"Contact US ->E-commerce app"}>
      <div className="row contactus">
        <div className="col-md-6">
          <img
            src="/images/contactus.jpeg"
            alt="contactus"
            style={{ width: "100% " }}
          />
        </div>
        <div className="col-md-4">
          <h1 className="bg-dark p-2 text-white text-center">Contact US </h1>
          <p className="text-justify mt-2">
            Any Auery and Info About Product Feel Free To Call Anytime We 24X7
            Available
          </p>
          <p className="mt-3">📧 www.ContactUs@gmail.com</p>
          <p className="mt-3">📲 12345 67890</p>
          <p className="mt-3">☎️ 1800 0202 0022 (toll free)</p>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
