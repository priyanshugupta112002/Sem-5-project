import { useState, useEffect } from "react";

export default function useCategory() {
  const [category, setCategory] = useState([]);

  const getCategory = async () => {
    try {
      const res = await fetch("/category");
      const data = res.json();
      setCategory(data?.Category);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCategory();
  }, []);
  return category;
}
