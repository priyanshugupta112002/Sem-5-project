const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.ObjectId,
        ref: "products",
      },
    ],
    buyer: {
      type: mongoose.ObjectId,
      ref: "users",
    },
    status: {
      type: String,
      default: "Not Process",
      enum: ["Not Process", "Process", "Cancel", "Shipped", "Delivered"],
    },
  },
  { timestamps: true }
);

const Order = new mongoose.model("order", orderSchema);
module.exports = Order;
