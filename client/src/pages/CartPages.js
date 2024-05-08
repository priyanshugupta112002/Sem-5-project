import React from "react";
import Layout from "../components/layout/Layout";
import { useAuth } from "../context/auth";
import { useCart } from "../context/cart";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useCart();

  const navigate = useNavigate();

  const removeItem = (pid) => {
    try {
      let myCart = [...cart];
      let index = myCart.findIndex((item) => item._id === pid);

      myCart.splice(index, 1);
      setCart(myCart);
      localStorage.setItem("cart", JSON.stringify(myCart));
    } catch (error) {
      console.log(error);
    }
  };

  const totalFunc = () => {
    try {
      let total = 0;
      cart?.map((c) => {
        total += c.price;
      });
      if (!isNaN(total)) {
        const formattedAmount = total.toLocaleString("en-IN", {
          style: "currency",
          currency: "INR",
          maximumFractionDigits: 2,
        });
        return formattedAmount;
      }
      return "";
    } catch (error) {
      console.log(error);
    }
  };

  const makePayment = async () => {
    try {
      const res = await fetch("/create-checkout-session", {
        method: "POST",
        headers: {
          Authorization: auth?.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart }),
      });
      const data = await res.json();
      window.location = data.url;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <h1 className="text-center bg-light p-3">
              {`hello ${auth?.token && auth?.user?.name}`}
            </h1>
            <h4 className="text-center">
              {cart?.length > 0
                ? `you have ${cart.length} products`
                : " you have no products in your cart"}
              {auth?.token ? "" : "please login to checkout"}
            </h4>
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            {cart?.map((c) => (
              <div className="row mb-2 p-3 card flex-row">
                <div className="col-md-4">
                  <img
                    src={`/product-photo/${c._id}`}
                    alt={c.name}
                    className="card-img-top"
                    width="100px"
                    height="100px"
                  />
                </div>
                <div className="col-md-8">
                  <h4>{c.name}</h4>
                  <p>{c.description.substring(0, 30)}</p>
                  <h4>Price :{c.price}</h4>
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      removeItem(c._id);
                    }}
                    l
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="col-md-4 text-center">
            <h4>Cart Summary</h4>
            <p>Total | checkout | Payment</p>
            <hr />
            <h4>Total : {totalFunc()}</h4>
            {auth?.user?.address ? (
              <>
                <h4>Current Address</h4>
                <h5>{auth?.user?.address}</h5>
                <button
                  className="btn btn-outline-warning"
                  onClick={() => navigate(`/dashboard/user/profile`)}
                >
                  Update Address
                </button>
                <button onClick={makePayment}>checkout</button>
              </>
            ) : (
              <div className="mb-3">
                {auth?.token ? (
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => {
                      navigate(`/dashboard/user/profile`);
                    }}
                  >
                    Update Address
                  </button>
                ) : (
                  <button
                    className="btn btn-outline-warning"
                    onClick={() => {
                      navigate(`/login`, {
                        state: `/cart`,
                      });
                    }}
                  >
                    Please Login to checkout
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CartPage;
