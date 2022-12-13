const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdminSchema = new Schema({
  login: String,
  password: String,
})


module.exports = mongoose.model("admin", AdminSchema);