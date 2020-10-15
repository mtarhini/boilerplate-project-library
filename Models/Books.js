const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create Schema
const BookSchema = new Schema(
  {
    title: { type: String, required: true },
    comments: { type: Array, default: [] },
  },
  {
    collection: "books",
  }
);

module.exports = Book = mongoose.model("book", BookSchema);
