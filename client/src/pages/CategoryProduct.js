import React, { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const CategoryProduct = () => {
  const params = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState([]);
  // const [category, setCategory] = useState([]);

  const getProductByCategory = async () => {
    try {
      const res = await fetch(`/product-categroy/${params.slug}`);
      const data = await res.json();
      setProduct(data.product);
    } catch (error) {
      console.log(error);
      toast.error("Products can not fetch of this category");
    }
  };

  useEffect(() => {
    getProductByCategory();
  }, [params.slug]);

  return (
    <Layout>
      <div className="d-flex flex-wrap">
        {product?.map((c) => (
          <div className="card m-2" style={{ width: "18rem" }}>
            <img
              src={`/product-photo/${c._id}`}
              alt={c.name}
              className="card-img-top"
            />
            <div className="card-body">
              <h5 className="card-title">{c.name}</h5>
              <p className="card-text">{c.description.substring(0, 30)}..</p>
              <p className="card-text">Rs {c.price}</p>
              <button
                class="btn btn-primary ms-1"
                onClick={() => navigate(`/product/${c.slug}`)}
              >
                More Details
              </button>
              <button class="btn btn-secondary ms-1">Add To Cart</button>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default CategoryProduct;
