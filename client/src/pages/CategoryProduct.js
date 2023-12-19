import React, { useState } from "react";
import Layout from "../components/layout/Layout";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const CategoryProduct = () => {
  const params = useParams();
  const [products, setProduct] = useState([]);
  const [category, setCategory] = useState([]);

  const getProductByCategory = async () => {
    try {
      const res = await fetch(`/product-categroy/${params.slug}`);
      const data = await res.json();
    } catch (error) {
      console.log(error);
      toast.error("Products can not fetch of this category");
    }
  };

  return (
    <Layout>
      <h1>helo</h1>
    </Layout>
  );
};

export default CategoryProduct;
