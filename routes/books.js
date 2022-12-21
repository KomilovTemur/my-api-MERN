const express = require("express");
const router = express.Router();
const Books = require("../model/Books");
const auth = require("../middleware/auth");
const { createClient } = require("redis");
const client = createClient({url: "redis://default:7gxVcYOUJxZ6TB79W4F3g2QgYRUh2LtN@redis-14579.c253.us-central1-1.gce.cloud.redislabs.com:14579"});
client.on("error", (err) => console.log(err));
client.connect();

async function setData(key, value) {
  await client.set(key, JSON.stringify(value));
}

async function getData(key) {
  return await client.get(key);
}

// cache middleware
function cache(req, res, next) {
  getData(`books${req.query.skip}`).then((data) => {
    if (data) {
      res.json(JSON.parse(data));
    } else {
      next();
    }
  });
}

// Get all books
router.get("/", cache, function (req, res, next) {
  if (req.query.skip == undefined) {
    res.redirect("/books?skip=10");
  } else {
    Books.find()
      .skip(req.query.skip)
      .limit(20)
      .exec((err, books) => {
        if (err) console.log(err.message);
        setData(`books${req.query.skip}`, books);
        res.json(books);
      });
  }
});

// Adding new Book
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
