const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const requireSignIn = async (req, res, next) => {
  try {
    //is gives the id  or decode =req.user.id

    const decode = jwt.verify(
      req.headers.authorization,
      process.env.JWT_SECRET
    );
    console.log(decode);
    req.user = decode;
    console.log(req.user);
    next();
  } catch (error) {
    console.log(error);
  }
};

// admins access
const IsAdmin = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    console.log(user.role);
    if (user.role != 1) {
      return res.status(401).send({
        success: false,
        message: "UnAuthorized Access",
      });
    } else {
      next();
    }
  } catch (error) {
    console.log(error);
    res.status(401).send({
      success: false,
      message: "UnAuthorized User",
    });
  }
};

module.exports = { requireSignIn, IsAdmin };
