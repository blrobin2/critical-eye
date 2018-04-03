const Sequelize = require("sequelize");
const db = require("../db");

const User = db.define(
  "user",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    spotifyId: {
      type: Sequelize.STRING,
      unique: true
    },
    name: {
      type: Sequelize.STRING
    }
  },
  {
    timestamps: false
  }
);

module.exports = User;
