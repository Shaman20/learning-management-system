const { DataTypes } = require("sequelize");
const db = require("./db");

const User = db.define(
  "users",
  {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    age: {
      type: DataTypes.INTEGER,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

User.sync()
  .then(() => {
    console.log("User table created or synchronized");
  })
  .catch((error) => {
    console.log("Error synchronizing user table", error);
  });

module.exports = User;
