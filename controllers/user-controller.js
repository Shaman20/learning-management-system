const validateEmail = require("../helpers/email-validator");
const { validateRequiredFields } = require("../helpers/user-validator");
const userService = require('../services/user-service')

const signUp = async (req, res) => {
  const { firstName, lastName, emailAddress, password, age, role } = req.body;

  const requiredFields = [
    "firstName",
    "lastName",
    "emailAddress",
    "password",
    "age",
    "role",
  ];

  const missingFields = validateRequiredFields(req.body, requiredFields);

  if (missingFields.length > 0) {
    res.status(400).json({ errors: missingFields });
    return;
  } else if (!validateEmail(emailAddress)) {
    res.status(404).json({error: 'Invalid Email Address'})
    return;
  }

  try {
    const user = await userService.signUp(firstName, lastName, emailAddress, password, age, role)
    res.status(200).json({ msg: "Success", result: user});
  } catch (error) {
    console.log("Error in signup controller", error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

const login = async (req, res) => {
  const { emailAddress, password } = req.body;

  // Validate the email address
  if (!validateEmail(emailAddress)) {
    res.status(400).send("Invalid email address");
    return;
  }

  if (!password) {
    throw new Error("Invalid password");
  }

  try {
    const result = await userService.loginUser(emailAddress, password);
    res.status(200).json({ msg: "Login Successful", result: result });
  } catch (error) {
    console.error(error);
    res.status(400).json({ sucess: false, message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res
        .status(401)
        .json({ success: false, message: "Authorization header missing" });
    }

    // Call the logout function from userService to handle the logout process
    const userId = req.user.emailAddress;
    // Call a function from userService to handle the logout process
    await userService.logoutUser(userId);
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  signUp,
  login,
  logout
};
