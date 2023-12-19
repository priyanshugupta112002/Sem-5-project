import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet";
import { Toaster } from "react-hot-toast";

const Layout = ({ children, title, discription, keyword, author }) => {
  return (
    <div>
      <Helmet>
        <meta name="description" content={discription} />
        <meta name="keywords" content={keyword} />
        <meta name="author" content={author} />
        <title>{title}</title>
      </Helmet>
      <Header />
      <main style={{ minHeight: "70vh" }}>
        <Toaster />
        {children}
      </main>

      <Footer />
    </div>
  );
};
Layout.defaultProps = {
  title: "E-commerce app ->shop now",
  description: "mern stack project",
  keyword: "mern , react , mongodb ,node ,express , project",
  author: "Priyanshu Gupta",
};

export default Layout;
