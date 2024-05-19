const bcryt = require("bcrypt");

const bcryptPassword = async (password) => {
  try {
    const saltPassword = 12;
    const hashedPassword = await bcryt.hash(password, saltPassword);
    return hashedPassword;
  } catch (error) {
    console.log(error, "errorn in bcrypt password");
  }
};

const comparePassword = async (password, hashedPassword) => {
  return await bcryt.compare(password, hashedPassword);
};

module.exports = { bcryptPassword, comparePassword };
