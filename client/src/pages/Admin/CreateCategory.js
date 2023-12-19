import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import AdminMenu from "../../components/layout/AdminMenu";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/auth";
import { Modal } from "antd";
import CategoryForm from "../../components/Form/CategoryForm";

const CreateCategory = () => {
  const [auth] = useAuth();
  const [categories, setCategory] = useState([]);
  const [name, setName] = useState("");
  const [visible, setVisisble] = useState(false);
  const [selected, setSelected] = useState(null);
  const [updateName, setUpdateName] = useState("");

  const getAllCategory = async () => {
    try {
      const res = await fetch("/category");
      const data = await res.json();
      if (res.status === 201) {
        // console.log(data);
        // console.log(data.Category);
        setCategory(data.Category);
      } else {
        throw new Error();
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in getting categories");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/create-category", {
        method: "POST",
        headers: {
          Authorization: auth?.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      console.log(data.Category.name);
      if (res.status === 201) {
        toast.success(`${data.Category.name} is created`);
        getAllCategory();
      } else {
        toast.error("Not created");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong in the input form");
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  const handleUpdateSubmit = async (e) => {
    console.log(updateName);
    e.preventDefault();
    try {
      const res = await fetch(`/update-category/${selected._id}`, {
        method: "PUT",
        headers: {
          Authorization: auth?.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          updateName,
        }),
      });
      if (res.status === 201) {
        toast.success("Category Updated");
        setUpdateName("");
        setVisisble(false);
        setSelected(null);
        getAllCategory();
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
      toast.error("some went wrong while updating");
    }
  };
  const handleDelete = async (pid) => {
    try {
      const res = await fetch(`/delete-category/${pid}`, {
        method: "DELETE",
        headers: {
          Authorization: auth?.token,
        },
      });
      if (res.status === 201) {
        toast.success("Category Daleted");
        getAllCategory();
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.log(error);
      toast.error("some went wrong while updating");
    }
  };

  return (
    <Layout title={"Dashboard -Create Product "}>
      <div className="container-fluid m-3 p-3">
        <div className="row">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1>Manage category</h1>
            <div className="p-3 w-50">
              <CategoryForm
                handleSubmit={handleSubmit}
                value={name}
                setValue={setName}
              />
            </div>
            <div className="w-75">
              <table className="table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {categories?.map((c) => (
                    <>
                      <tr>
                        <td key={c._id}>{c.name}</td>
                        <td>
                          <button
                            className="btn btn-primary ms-2"
                            onClick={() => {
                              setVisisble(true);
                              setUpdateName(c.name);
                              setSelected(c);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="btn btn-danger ms-2"
                            onClick={() => handleDelete(c._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            </div>
            <Modal
              onCancel={() => setVisisble(false)}
              footer={null}
              visible={visible}
            >
              <CategoryForm
                value={updateName}
                setValue={setUpdateName}
                handleSubmit={handleUpdateSubmit}
              />
            </Modal>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CreateCategory;
