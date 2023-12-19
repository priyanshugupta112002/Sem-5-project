const express = require("express");
const { requireSignIn, IsAdmin } = require("../middlewares/authMiddleware");
const {
  createProductController,
  getProductController,
  getSingleProductController,
  productPhotoController,
  deleteProductController,
  updateProductController,
  productFilterController,
  productCountController,
  productListController,
  searchProductController,
  relatedProductController,
  productCategoryController,
} = require("../controllers/productController");
const formidableMiddleware = require("express-formidable");

const Router = express.Router();

Router.post(
  "/create-product",
  requireSignIn,
  IsAdmin,
  formidableMiddleware(),
  createProductController
);
Router.put(
  "/update-product/:pid",
  requireSignIn,
  IsAdmin,
  formidableMiddleware(),
  updateProductController
);

Router.get("/get-product", getProductController);

Router.get("/get-product/:slug", getSingleProductController);

//get photo
Router.get("/product-photo/:pid", productPhotoController);

Router.delete("/delete-product/:pid", deleteProductController);

// Filter Product
Router.post("/product-filter", productFilterController);

//count
Router.get("/product-count", productCountController);

//Product per Page
Router.get("/product-List/:page", productListController);

//search Router
Router.get("/search/:keyword", searchProductController);

Router.get("/related-product/:pid/:cid", relatedProductController);

//Category wise route
Router.get("/product-categroy/:slug", productCategoryController);

module.exports = Router;
