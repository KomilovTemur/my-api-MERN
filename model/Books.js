const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const BooksSchema = new Schema({
  title: { type: String, required: true },
  isbn: String,
  pageCount: Number,
  publishedDate: Number,
  thumbnailUrl: String,
  shortDescription: String,
  longDescription: String,
  status: String,
  authors: Array,
  categories: Array,
});
module.exports = mongoose.model("books", BooksSchema);
