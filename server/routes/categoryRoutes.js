const express = require("express");
const { requireSignIn, IsAdmin } = require("../middlewares/authMiddleware");
const {
  createCategoryController,
  updateCategoryController,
  categoryController,
  singleCategoryController,
  deleteCategory,
} = require("../controllers/categoryController");

const Router = express.Router();

//create Category
Router.post(
  "/create-category",
  requireSignIn,
  IsAdmin,
  createCategoryController
);

//update Category
Router.put(
  "/update-category/:id",
  requireSignIn,
  IsAdmin,
  updateCategoryController
);

Router.get("/category", categoryController);

Router.get("/single-category/:slug", singleCategoryController);

Router.delete("/delete-category/:id", requireSignIn, IsAdmin, deleteCategory);

module.exports = Router;
