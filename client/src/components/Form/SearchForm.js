import React from "react";
import { useSearch } from "../../context/search";
import { useNavigate } from "react-router-dom";
const SearchForm = () => {
  const [values, setValue] = useSearch();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/search/${values.keyword}`);
      const data = await res.json();
      setValue({ ...values, result: data.result });
      console.log(values.result);
      navigate("/search");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <form className="d-flex" role="search">
        <input
          className="form-control me-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          value={values.keyword}
          onChange={(e) => setValue({ ...values, keyword: e.target.value })}
        />
        <button
          className="btn btn-outline-success"
          type="submit"
          onClick={handleSubmit}
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchForm;
