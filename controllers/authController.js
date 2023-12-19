const { bcryptPassword, comparePassword } = require("../helpers/authHelper");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const registerController = async (req, res) => {
  try {
    console.log("2");
    console.log(req.body, "registerController");

    const { name, email, password, phone, address, answer } = req.body;
    // console.log(name, email, password, phone, address);

    if (!name || !email || !password || !phone || !address || !answer) {
      return res
        .status(422)
        .send({ success: false, message: "fill the details properly" });
    }
    //check user
    const existingUser = await User.findOne({ email });

    //user exist
    if (existingUser) {
      return res.status(402).send({
        success: false,
        message: "User Already Exist",
      });
    }
    const hashPssword = await bcryptPassword(password);

    const user = new User({
      name,
      email,
      password: hashPssword,
      phone,
      address,
      answer,
    });
    await user.save();

    res.status(201).send({
      success: true,
      message: "User Registered",
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(422).send({
      success: false,
      mmessage: "error in registration",
      error,
    });
  }
};

const loginController = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(422).send({
        success: false,
        message: "fill the details",
      });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      const match = await comparePassword(password, userExist.password);

      if (match) {
        const token = jwt.sign({ _id: userExist._id }, process.env.JWT_SECRET, {
          expiresIn: "7d",
        });

        res.status(201).json({
          success: true,
          message: "login succesfully ",
          user: {
            id: userExist._id,
            name: userExist.name,
            email: userExist.email,
            phone: userExist.phone,
            address: userExist.address,
            role: userExist.role,
          },
          token,
        });
      } else {
        return res.status(422).send({
          success: false,
          message: "invalid credentials",
        });
      }
    } else {
      return res.status(422).send({
        success: false,
        message: "invalid credentials",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(422).send({
      success: false,
      message: "Error in login",
      error,
    });
  }
};

const testController = async (req, res) => {
  console.log("hello");
  res.send({
    message: "done protected",
  });
};

const forgetPassword = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email || !answer || !newPassword) {
      return res.status(422).send({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const userExist = await User.findOne({ email, answer });
    if (!userExist) {
      return res.status(422).send({
        success: false,
        message: "Wrong Credentials",
      });
    }
    const hashed = await bcryptPassword(newPassword);
    await User.findByIdAndUpdate(userExist._id, { password: hashed });

    res.status(201).send({
      success: true,
      message: "Password Changed Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      message: error,
    });
  }
};

module.exports = {
  registerController,
  loginController,
  testController,
  forgetPassword,
};
