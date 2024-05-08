const { bcryptPassword, comparePassword } = require("../helpers/authHelper");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const orderSchema = require("../models/orderModule");

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
const updateProfile = async (req, res) => {
  try {
    const { name, password, phone, address } = req.body;
    const userExist = await User.findById(req.user._id);

    if (password && password.length < 6) {
      return res.status(422).send({
        success: false,
        message: "Password should be grater than 6 digit ",
      });
    }

    const hashedPssword = password ? await bcryptPassword(password) : undefined;
    const updateUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        name: name || userExist.name,
        phone: phone || userExist.phone,
        address: address || userExist.address,
        password: hashedPssword || userExist.password,
      },
      { new: true }
    );
    console.log(updateUser);
    res.status(201).json({
      success: true,
      message: "Profile Updated",
      updateUser,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({
      success: false,
      message: error,
    });
  }
};
const getAllOrderController = async (req, res) => {
  try {
    const order = await orderSchema
      .find({})
      .sort({ createdAt: -1 })
      .populate("buyer", "name")
      .populate("products", "-photo");
    res.status(202).json({
      succeess: true,
      order,
    });
  } catch (error) {
    console.log(error);
    res.status(404).send({ success: false, error });
  }
};

const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { value } = req.body;
    console.log(orderId, value);
    const data = await orderSchema.findByIdAndUpdate(
      orderId,
      { status: value },
      { new: true }
    );
    res.status(202).json(data);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: true,
      error,
    });
  }
};

module.exports = {
  registerController,
  loginController,
  testController,
  forgetPassword,
  updateProfile,
  getAllOrderController,
  orderStatusController,
};
