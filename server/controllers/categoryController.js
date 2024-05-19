const { default: slugify } = require("slugify");
const category = require("../models/categoryModel");

const createCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(422).send({ message: "Name is required" });
    }
    const existingCategory = await category.findOne({ name });
    if (existingCategory) {
      res.status(422).json({
        success: false,
        message: "Category aldready exist",
      });
    }
    const Category = await new category({ name, slug: slugify(name) });
    await Category.save();
    res.status(201).json({
      success: true,
      message: "category created",
      Category,
    });
  } catch (error) {
    console.log(error);
    res.status(422).send({
      success: false,
      message: "Error in category controller",
      error,
    });
  }
};

const updateCategoryController = async (req, res) => {
  try {
    const name = req.body.updateName;
    const { id } = req.params;
    console.log(name, id);
    const Category = await category.findByIdAndUpdate(
      id,
      { name, slug: slugify(name) },
      { new: true }
    );
    res.status(201).send({
      success: true,
      message: "category update",
      Category,
    });
  } catch (error) {
    console.log(error);
    return res.status(422).send({
      success: false,
      maessage: "error in updateController",
      error,
    });
  }
};

const categoryController = async (req, res) => {
  try {
    const Category = await category.find({});
    res.status(201).json({
      success: true,
      message: "All Category List",
      Category,
    });
  } catch (error) {
    console.log(error);
    res.send(422).send({
      success: true,
      message: "Error in category Controller",
      error,
    });
  }
};

const singleCategoryController = async (req, res) => {
  try {
    const Category = await category.findOne({ slug: req.params.slug });
    res.status(201).send({
      success: true,
      message: "Get The Product",
      Category,
    });
  } catch (error) {
    console.log(error);
    res.status(422).send({
      success: false,
      message: "error in get single category",
      error,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const Category = await category.findByIdAndDelete(id);

    res.status(201).send({
      success: true,
      message: "Category Deleted",
      Category,
    });
  } catch (error) {
    console.log(error);
    res.status(422).send({
      success: false,
      message: "error in delete Category",
      error,
    });
  }
};

module.exports = {
  createCategoryController,
  updateCategoryController,
  categoryController,
  singleCategoryController,
  deleteCategory,
};
