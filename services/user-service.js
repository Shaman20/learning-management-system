const User = require("../models/user-model");
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken')

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

const loginUser = async (emailAddress, password) => {
  try {
    // Check for missing inputs
    if (!(emailAddress && password)) {
      throw new Error(emailAddress, password);
    }

    const user = await User.findOne({ where: { emailAddress } });

    const decodedPass = Buffer.from(password, "base64").toString("utf-8");

    if (user && (await bcrypt.compare(decodedPass, user.password))) {
      const token = jwt.sign(
        {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          emailAddress: user.emailAddress,
        },
        process.env.TOKEN_KEY,
        {
          expiresIn: "1h",
        }
      );

      // Store the token in the user record
      user.token = token;
      await user.save(); // Save the user record to store the token

      return { user, token };
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    throw error;
  }
}

const logoutUser = async(emailAddress) => {
  try {
    const user = await User.findOne({ where: { emailAddress } });

    if (user) {
      await user.save();
    } else {
      throw new Error("User not found");
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  signUp,
  loginUser,
  logoutUser
};
