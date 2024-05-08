import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import UserMenu from "../../components/layout/UserMenu";
import { useSearchParams } from "react-router-dom";
import { useCart } from "../../context/cart";
import { useAuth } from "../../context/auth";
import moment from "moment";
const Oders = () => {
  const [cart, setCart] = useCart();
  const [auth, setAuth] = useAuth();
  const [order, setOrder] = useState([]);

  const [searchParams] = useSearchParams();
  useEffect(() => {
    const placrOrder = async () => {
      try {
        const res = await fetch("/submit-order", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cart, auth }),
        });
        const data = await res.json();

        if ((data.status = 202)) {
          setCart([]);
        }
      } catch (error) {
        console.log(Error);
      }
    };
    const checkOrder = async () => {
      try {
        const res = await fetch(`/get-order/${auth?.user?.id}`, {
          method: "GET",
        });
        const data = await res.json();
        setOrder(data.order);
        console.log(data.order);
        console.log(order);
      } catch (error) {
        console.log(error);
      }
    };
    const params = Object.fromEntries([...searchParams]);
    if (params.success) {
      placrOrder();
    }
    checkOrder();
    console.log(order);
  }, []);

  return (
    <Layout title={"Your Oders"}>
      <div className="container-flui p-3 m-3">
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <h1>All Oders</h1>
            <p>
              {order?.map((o, i) => {
                console.log(o);
                return (
                  <div className="border shadow">
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Status</th>
                          <th scope="col">Buyer</th>
                          <th scope="col">Date</th>
                          <th scope="col">Payment</th>
                          <th scope="col">Quantity</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{i + 1}</td>
                          <td>{o.status}</td>
                          <td>{o.buyer.name}</td>
                          <td>{moment(o?.createAt).fromNow()}</td>
                          <td>
                            <p>SuccessFull</p>
                          </td>
                          <td>{o.products.length}</td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="container">
                      {o?.products.map((c, i) => (
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
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Oders;
