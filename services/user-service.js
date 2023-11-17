const User = require("../models/user-model");
const bcrypt = require("bcryptjs");

const signUp = async (
  firstName,
  lastName,
  emailAddress,
  password,
  age,
  role
) => {
  try {
    const existingUser = await User.findOne({ where: { emailAddress } });

    if (existingUser) {
      throw new Error("User with this email already exists");
    }

    // Decode the password and hash it before saving in the database
    const decodedPass = Buffer.from(password, "base64").toString("utf-8");
    const hashedPassword = await bcrypt.hash(decodedPass, 10);

    // Create a new user with the hashed password
    const user = await User.create({
      firstName: firstName.toUpperCase(),
      lastName: lastName.toUpperCase(),
      emailAddress: emailAddress.toLowerCase(),
      password: hashedPassword,
      age: parseInt(age),
      role: role.toUpperCase(),
    });

    return user;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  signUp,
};
