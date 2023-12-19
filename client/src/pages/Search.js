import React from "react";
import Layout from "../components/layout/Layout";
import { useSearch } from "../context/search";

const Search = () => {
  const [values, setValue] = useSearch();

  return (
    <Layout title={"Search Engine"}>
      <div className="container">
        <div className="text-center">
          <h1>Search Result</h1>
          <h6>
            {values?.result.length < 1
              ? " No Product Found"
              : `Found ${values?.result.length}`}
          </h6>
          <div className="d-flex flex-wrap mt-4">
            {values?.result.map((c) => (
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
                  <button class="btn btn-primary ms-1">More Details</button>
                  <button class="btn btn-secondary ms-1">Add To Cart</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Search;
