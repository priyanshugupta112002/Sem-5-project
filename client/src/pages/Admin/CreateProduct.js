import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import AdminMenu from "../../components/layout/AdminMenu";
import { toast } from "react-hot-toast";
import { Select } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/auth";

const { Option } = Select;

const CreateProduct = () => {
  const navigate = useNavigate();
  const [auth] = useAuth();
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [productDetail, setProductDetail] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "",
  });
  const [photo, setPhoto] = useState("");
  const [shipping, setShipping] = useState("");

  const getAllCategory = async () => {
    try {
      const res = await fetch("/category");
      const data = await res.json();
      if (res.status === 201) {
        // console.log(data);
        // console.log(data.Category);
        setCategories(data.Category);
      } else {
        throw new Error();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting categories");
    }
  };
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const { name, description, quantity, price } = productDetail;
      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("quantity", quantity);
      productData.append("price", price);
      productData.append("photo", photo);
      productData.append("category", category);
      productData.append("shipping", shipping);

      console.log(Array.from(productData));

      const data = await fetch("/create-product", {
        method: "POST",
        headers: {
          Authorization: auth?.token,
        },
        body: productData,
      });

      if (data.status === 201) {
        toast.success("Product created succesfully");
        navigate("/dashboard/admin/products");
      } else {
        toast.error("Something Went Wrong");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDetail = async (e) => {
    const value = e.target.value;
    const name = e.target.name;
    setProductDetail({ ...productDetail, [name]: value });
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  return (
    <Layout title={"Dashboard -Create Category "}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Create Product</h1>
            <div className="m-1 w-75">
              <Select
                bordered={false}
                placeholder={"Select a Categoty"}
                size="large"
                showSearch
                className="form-select mb-3"
                onChange={(value) => {
                  setCategory(value);
                }}
              > 
                {/* in this value (c.name)is used for searcg in database but for store a product we use c._id */}
                {categories?.map((c) => (
                  <Option key={c._id} value={c._id}>
                    {c.name}
                  </Option>
                ))}
              </Select>
              <div className="mb-3">
                <label className="btn btn-outline-secondary col-md-12">
                  {photo ? photo.name : "Upload Photo"}
                  <input
                    type="file"
                    name="photo"
                    accept="image/*"
                    onChange={(e) => {
                      setPhoto(e.target.files[0]);
                    }}
                    hidden
                  ></input>
                </label>
              </div>
              <div className="mb-3">
                {photo && (
                  <div className="text-center">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="Product_Photo"
                      height={"200px"}
                      className="img img-responsive"
                    />
                  </div>
                )}
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  name="name"
                  value={productDetail.name}
                  placeholder="Write a name"
                  className="form-control"
                  onChange={handleDetail}
                />
              </div>
              <div className="mb-3 h-40px">
                <textarea
                  type="text"
                  name="description"
                  value={productDetail.description}
                  placeholder="Write Product's description"
                  className="form-control"
                  onChange={handleDetail}
                />
              </div>
              <div className="mb-3">
                <input
                  type="number"
                  name="price"
                  value={productDetail.price}
                  placeholder="Price of Product"
                  className="form-control"
                  onChange={handleDetail}
                />
              </div>

              <div className="mb-3">
                <input
                  type="number"
                  name="quantity"
                  value={productDetail.quantity}
                  placeholder="Quantity of Product"
                  className="form-control"
                  onChange={handleDetail}
                />
              </div>
              <div className="mb-3">
                <Select
                  bordered={false}
                  placeholder="Select Shipping"
                  size="Large"
                  showSearch
                  className="forn-select mb-3"
                  onChange={(value) => {
                    setShipping(value);
                  }}
                >
                  <Option value="0">No</Option>
                  <Option value="1">Yes</Option>
                </Select>
              </div>
              <div className="mb-3">
                <button className="btn btn-primary" onClick={handleCreate}>
                  CREATE PRODUCT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateProduct;
