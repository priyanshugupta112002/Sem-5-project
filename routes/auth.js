const express = require("express");
const {
  registerController,
  loginController,
  testController,
  forgetPassword,
} = require("../controllers/authController");
const { requireSignIn, IsAdmin } = require("../middlewares/authMiddleware");
const Router = express.Router();

Router.post("/register", registerController);
Router.post("/login", loginController);

Router.post("/password", forgetPassword);

// Router.get("/test", requireSignIn, IsAdmin, testController);
Router.get("/user-auth", requireSignIn, (req, res) => {
  res.status(201).json({ ok: true });
});

Router.get("/admin-auth", requireSignIn, IsAdmin, (req, res) => {
  res.status(201).json({ ok: true });
});

module.exports = Router;
