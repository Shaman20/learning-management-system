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

module.exports = {
  signUp,
};
