import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/layout/AdminMenu";
import Layout from "../../components/layout/Layout";
import moment from "moment";
import { Select } from "antd";

const { Option } = Select;

const AdminOrder = () => {
  const [status, setStatus] = useState([
    "Not Process",
    "Process",
    "Cancel",
    "Shipped",
    "Delivered",
  ]);
  const [order, setOrder] = useState([]);

  const checkOrder = async () => {
    try {
      const res = await fetch("/All-Order", {
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

  useEffect(() => {
    checkOrder();
  }, []);

  const handleChange = async (orderId, value) => {
    try {
      const data = await fetch(`/order-status/${orderId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value }),
      });
      checkOrder();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Layout title={"All order Data"}>
      <div className="row">
        <div className="col-md-3">
          <AdminMenu />
        </div>

        <div className="col-md-9">
          <h1 className="text-center">All Order</h1>
          <p>
            {order?.map((o, i) => {
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
                        <td>
                          <Select
                            bordered={false}
                            onChange={(value) => {
                              handleChange(o._id, value);
                            }}
                            defaultValue={o?.status}
                          >
                            {status.map((s, i) => (
                              <Option key={i} value={s}>
                                {s}
                              </Option>
                            ))}
                          </Select>
                        </td>
                        <td>{o?.buyer.name}</td>
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
    </Layout>
  );
};
export default AdminOrder;
