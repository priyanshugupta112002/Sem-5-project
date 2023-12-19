import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const ProductDetail = () => {
  const params = useParams();
  const [product, setProduct] = useState({});
  const [relatedProduct, setRelatedProduct] = useState([]);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await fetch(`/get-product/${params.slug}`);
        const data = await res.json();
        setProduct(data?.product);
        similarProduuct(data?.product._id, data?.product.category._id);
      } catch (error) {
        console.log(error);
      }
    };

    getProduct();
  }, [params?.slug]);

  const similarProduuct = async (pid, cid) => {
    try {
      const res = await fetch(`/related-product/${pid}/${cid}`);
      const data = await res.json();
      setRelatedProduct(data?.product);
    } catch (error) {
      console.log(error);
      toast.error("something went wrong");
    }
  };

  return (
    <Layout>
      <div className="row container mt-2">
        <div className="col-md-6">
          <img
            src={`/product-photo/${product._id}`}
            alt={product.name}
            className="card-img-top"
            height="300"
            width={"300px"}
          />
        </div>
        <div className="col-md-6 ">
          <h1 className="text-center">Product Detail</h1>
          <h4>Name :{product.name}</h4>
          <h4>Description :{product.description}</h4>
          <h4>Price :{product.price}</h4>
          <h4>Category :{product?.category?.name}</h4>
          <button className="btn btn-secondary ms-1">ADD TO CART</button>
        </div>
        <div className="col-md-6">detail</div>
      </div>
      <hr />
      <div className="row">
        <h4>Similar Product</h4>
        {relatedProduct.length < 1 && (
          <p className="text-center">No Similar product</p>
        )}
        <div className="d-flex flex-wrap">
          {relatedProduct?.map((c) => (
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
                <button class="btn btn-secondary ms-1">Add To Cart</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
