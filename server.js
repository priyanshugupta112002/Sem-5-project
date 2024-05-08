const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const { connectDB } = require("./config/db");
const auth = require("./routes/categoryRoutes");

//test objext
const app = express();
dotenv.config();

//database connect
connectDB();

//middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));

//Routes
// app.use(authRoutes);
app.use(require("./routes/auth"));
app.use(require("./routes/categoryRoutes"));
app.use(require("./routes/productRoute"));

const PORT = process.env.PORT || 8080;

app.get("/", (req, res) => {
  res.send({ message: "home page" });
});

app.listen(PORT, () => {
  console.log(`server start at port ${PORT}`);
});
