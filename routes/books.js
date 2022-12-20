const express = require("express");
const router = express.Router();
const Books = require("../model/Books");
const auth = require("../middleware/auth");
const Redis = require('redis');
const redisClient = Redis.createClient();
// Get all books
router.get("/", function (req, res, next) {
  Books.find()
    .limit(20)
    .exec((err, books) => {
      if (err) console.log(err.message);
      redisClient.setEx('books', 3600, "Alisher")
      res.json(books);
    });
});

// ? Adding new Book
router.post("/", auth, async (req, res) => {
  try {
    const books = await new Books(req.body);
    await books.save();
    res.json(books);
  } catch (err) {
    res.send(err);
  }
});

// search for books
router.get("/find/:id", async (req, res) => {
  try {
    const book = await Books.findById(req.params.id);
    res.json(book);
  } catch (err) {
    console.log(err.message);
  }
});

// update exist book
router.patch("/:id", auth, async (req, res) => {
  try {
    const book = await Books.findById(req.params.id);
    Object.assign(book, req.body);
    res.send({ data: book });
    book.save();
  } catch (err) {
    console.log(err.message);
  }
});

// delete book
router.delete("/:id", auth, async (req, res) => {
  const book = await Books.findById(req.params.id);
  await book.remove();
  res.json(book);
});

module.exports = router;
