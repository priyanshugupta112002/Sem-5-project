const productSchema = require("../models/productModel");
const categorySchmea = require("../models/categoryModel");
const fs = require("fs");
const slugify = require("slugify");

const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity } = req.fields;
    const { photo } = req.files;
    console.log("create-product");

    if (!name || !description || !price || !category || !quantity) {
      return res.status(422).send({
        success: false,
        message: "Fill all the Fields",
      });
    } else if (!photo && photo.size > 5000) {
      return res.status(422).send({
        success: false,
        message: "Either Image is not found OR size is larger than 5mb",
      });
    }
    const product = new productSchema({ ...req.fields, slug: slugify(name) });
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();
    res.status(201).json({
      success: true,
      message: "Product Created Successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(422).send({
      succeess: false,
      message: "error in create Product Controller",
      error,
    });
  }
};

const getProductController = async (req, res) => {
  try {
    const product = await productSchema
      .find({})
      .select("-photo")
      .populate("category")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(201).json({
      succeess: true,
      totalProduct: product.length,
      message: "All Products",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(201).send({
      success: false,
      message: "Error in get Product Controller",
      error,
    });
  }
};

const getSingleProductController = async (req, res) => {
  try {
    // const {name}=req.params.slug;
    const product = await productSchema
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(201).json({
      succeess: true,
      message: "Get the single searched product",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(422).send({
      success: false,
      message: "Error in get single product controller",
      error,
    });
  }
};

const productPhotoController = async (req, res) => {
  try {
    console.log("photo");
    const product = await productSchema
      .findById(req.params.pid)
      .select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(201).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(422).send({
      success: false,
      message: "Error in product photo controller",
      error,
    });
  }
};

const deleteProductController = async (req, res) => {
  try {
    const product = await productSchema
      .findByIdAndDelete(req.params.pid)
      .select("-photo");
    res.status(201).send({
      success: true,
      message: "Product deleted",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(422).send({
      success: false,
      message: "eroor while deleting product",
      error,
    });
  }
};

const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity } = req.fields;
    const { photo } = req.files;
    console.log(name, description, price, category, quantity, photo);

    if (!name || !description || !price || !category || !quantity) {
      return res.status(422).send({
        success: false,
        message: "Fill all the Fields",
      });
    } else if (photo && photo.size > 5000) {
      return res.status(422).send({
        success: false,
        message: "Either Image is not found OR size is larger than 5mb",
      });
    }
    const product = await productSchema.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
    }

    await product.save();
    res.status(201).send({
      success: true,
      message: "Product Updated Successfully",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(422).send({
      success: false,
      message: "error in update Product Controller",
      error,
    });
  }
};

const productFilterController = async (req, res) => {
  try {
    const { checked, radio } = req.body;
    let args = {};
    if (checked.length > 0) args.category = checked;
    if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
    const product = await productSchema.find(args);
    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(422).send({
      success: false,
      message: "Error While Filter Product",
      error,
    });
  }
};
const productCountController = async (req, res) => {
  try {
    const total = await productSchema.find({}).estimatedDocumentCount();

    res.status(201).send({
      success: true,
      total,
    });
  } catch (error) {
    console.log(error);
    res.status(422).send({
      success: false,
      error,
    });
  }
};
const productListController = async (req, res) => {
  try {
    const perPage = 6;
    const page = req.params.page ? req.params.page : 1;
    const product = await productSchema
      .find({})
      .select("-photo")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ createdAt: -1 });
    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(422).send({
      success: false,
      error,
    });
  }
};
const searchProductController = async (req, res) => {
  try {
    const { keyword } = req.params;
    const result = await productSchema
      .find({
        $or: [
          { name: { $regex: keyword, $options: "i" } },
          { description: { $regex: keyword, $options: "i" } },
        ],
      })
      .select("-photo");
    res.json({ result });
  } catch (error) {
    console.log(error);
    res.status(201).send({
      success: false,
      error,
    });
  }
};

const relatedProductController = async (req, res) => {
  try {
    const { pid, cid } = req.params;
    const product = await productSchema
      .find({
        category: cid,
        _id: { $ne: pid },
      })
      .select("-photo")
      .limit(3)
      .populate("category");

    res.status(201).json({
      product,
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(422).send({
      success: false,
      error,
    });
  }
};

const productCategoryController = async (req, res) => {
  try {
    const category = await categorySchmea.findOne({ slug: req.params.slug });
    const product = await productSchema.find({ category }).populate("category");
    res.status(201).json({
      success: true,
      product,
      category,
    });
  } catch (error) {
    console.log(error);
    res.status(422).send({
      success: false,
      error,
    });
  }
};

module.exports = {
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
};
