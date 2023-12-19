import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import AdminMenu from "../../components/layout/AdminMenu";
import { toast } from "react-hot-toast";
import { Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/auth";

const { Option } = Select;

const UpdateProdct = () => {
  const navigate = useNavigate();
  const [auth] = useAuth();
  const params = useParams();
  const UrlSlug = params.slug;
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
  const [id, setId] = useState("");

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

  useEffect(() => {
    const getSingleProduct = async () => {
      try {
        const res = await fetch(`/get-product/${UrlSlug}`);
        const data = await res.json();
        if (res.status === 201) {
          setProductDetail(data.product);
          setId(data.product._id);
          setShipping(data.product.shipping);
          setCategory(data.product.category._id);
        }
        // const savedPhoto = await fetch(`product-photo/${id}`);
        // setPhoto(savedPhoto);
        // console.log(photo);
      } catch (error) {
        console.log(error);
      }
    };

    if (UrlSlug) getSingleProduct();
  }, [UrlSlug]);

  const updatePhoto = async () => {};

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const { name, description, quantity, price } = productDetail;

      const productData = new FormData();
      productData.append("name", name);
      productData.append("description", description);
      productData.append("quantity", quantity);
      console.log(photo);
      productData.append("price", price);

      photo && productData.append("photo", photo);

      productData.append("category", category);
      console.log(photo);
      // console.log(name, description, price, quantity, category, id, "hi");
      productData.append("shipping", shipping);

      // console.log(Array.from(productData));

      const data = await fetch(`/update-product/${id}`, {
        method: "PUT",
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

  const handleDelete = async () => {
    try {
      let answer = window.prompt("To Delete The Product Type YES");
      if (!answer) return;

      const res = await fetch(`/delete-product/${id}`, {
        method: "DELETE",
      });
      if (res.status === 201) {
        toast.success("Product delete successFully");
        navigate("/dashboard/admin/products");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <Layout title={"Dashboard -Update Category "}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Update Product</h1>
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
                value={category}
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
                  />
                </label>
              </div>
              <div className="mb-3">
                {photo ? (
                  <div className="text-center">
                    <img
                      src={URL.createObjectURL(photo)}
                      alt="Product_Photo"
                      height={"600px"}
                      className="img img-responsive"
                    />
                  </div>
                ) : (
                  <div className="text-center">
                    <img
                      src={`/product-photo/${id}`}
                      alt="Product_Photo"
                      height={"100px"}
                      className="img img-responsive"
                      onChange={updatePhoto}
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
                  value={shipping}
                >
                  <Option value="0">No</Option>
                  <Option value="1">Yes</Option>
                </Select>
              </div>
              <div className="mb-3">
                <button className="btn btn-primary" onClick={handleUpdate}>
                  Update PRODUCT
                </button>
              </div>
              <div className="mb-3">
                <button className="btn btn-danger" onClick={handleDelete}>
                  Delete PRODUCT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UpdateProdct;
