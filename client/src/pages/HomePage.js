import React, { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import toast from "react-hot-toast";
import { Checkbox, Radio } from "antd";
import { Prices } from "../components/Prices";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart";
import "../../src/style/homePage.css";
const HomePage = () => {
  const [cart, setCart] = useCart([]);
  const [product, setProduct] = useState([]);
  const [category, setCategory] = useState([]);
  const [checked, setChecked] = useState([]);
  const [radio, setRadio] = useState([]);
  const [total, setToatal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const getAllCategory = async () => {
    try {
      const res = await fetch("/category");
      const data = await res.json();
      if (res.status === 201) {
        setCategory(data.Category);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleFilter = (value, id) => {
    let all = [...checked];
    if (value) {
      all.push(id);
    } else {
      all.filter((c) => c !== id);
    }
    setChecked(all);
  };

  useEffect(() => {
    const getAllProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/product-List/${page}`, {
          method: "GET",
        });
        setLoading(false);
        const data = await res.json();
        setProduct(data?.product);
      } catch (error) {
        setLoading(false);
        console.log(error);
        toast.error("Something went wrong while fetching prodcut");
      }
    };

    if (!radio.length || !checked.length) getAllProduct();
  }, [checked.length, radio.length, page]);

  // const loadMore = async () => {
  //   try {
  //     setLoading(true);
  //     const res = await fetch(`/product-List/${page}`);
  //     const data = await res.json();
  //     setLoading(false);
  //     setProduct([...product, ...data?.product]);
  //   } catch (error) {
  //     setLoading(false);
  //     console.log(error);
  //     toast.error("Can not fetch more product");
  //   }
  // };
  // useEffect(() => {
  //   if (page === 1) return;
  //   loadMore();
  // }, [page]);

  useEffect(() => {
    const getFilterProduct = async () => {
      try {
        const res = await fetch("/product-filter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            checked,
            radio,
          }),
        });
        const data = await res.json();
        setProduct(data.product);
      } catch (error) {
        console.log(error);
        toast.error("Can not get the Product");
      }
    };

    if (radio.length || checked.length) getFilterProduct();
  }, [checked, radio]);

  const getTotal = async () => {
    try {
      const res = await fetch("/product-count");
      const data = await res.json();
      setToatal(data?.total);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllCategory();
    getTotal();
  }, []);

  return (
    <Layout title={"All Product - Best Offer"}>
      <div className="row mt-3">
        <div className="col-md-2">
          <h4 className="text-center">Filter By Category</h4>
          <div className="d-flex flex-column">
            {category?.map((c) => (
              <Checkbox
                key={c._id}
                onChange={(e) => handleFilter(e.target.checked, c._id)}
              >
                {c.name}
              </Checkbox>
            ))}
          </div>

          {/* price filter */}

          <h4 className="text-center mt-4">Filter By Price</h4>
          <div className="d-flex flex-column">
            <Radio.Group onChange={(e) => setRadio(e.target.value)}>
              {Prices?.map((p) => (
                <div key={p._id}>
                  <Radio value={p.array}>{p.name}</Radio>
                </div>
              ))}
            </Radio.Group>
          </div>
          <div className="d-flex flex-column">
            <button
              className="btn btn-danger"
              onClick={() => window.location.reload()}
            >
              RESET FILTER
            </button>
          </div>
        </div>

        <div className="col-md-9">
          <h1 className="text-center">All Product</h1>

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
                  <p className="card-text">
                    {c.description.substring(0, 30)}..
                  </p>
                  <p className="card-text">Rs {c.price}</p>
                  <button
                    class="btn btn-primary ms-1"
                    onClick={() => navigate(`/product/${c.slug}`)}
                  >
                    More Details
                  </button>
                  <button
                    class="btn btn-secondary ms-1"
                    onClick={() => {
                      setCart([...cart, c]);
                      toast.success("item added to cart");
                      localStorage.setItem(
                        "cart",
                        JSON.stringify([...cart, c])
                      );
                    }}
                  >
                    Add To Cart
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="m-2 p-3">
            {product && product.length < total && (
              <button
                className="btn btn-warning"
                onClick={(e) => {
                  e.preventDefault();
                  setPage(page + 1);
                }}
              >
                {loading ? "Loading..." : "loadmore"}
              </button>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
