const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    lowercase: true,
  },
});
const category = new mongoose.model("categories", categorySchema); //USER is convertd into samm and prural and collection is user which is gone to stored
module.exports = category;
