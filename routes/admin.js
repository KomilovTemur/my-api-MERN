const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Admin = require("../model/Admin");

// Creating new admin || user
router.post("/signUp", async (req, res) => {
  try {
    const { login, password } = req.body;
    const findLogin = await Admin.find({ login });
    if (findLogin.length === 0) {
      const admin = await new Admin({ login, password });
      await admin.save();
      const jwtData = {
        login,
        password,
      };
      const token = jwt.sign(jwtData, process.env.SECRETKEY, {
        expiresIn: "24h",
      });
      res.cookie("authorization", token, {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
      });
      res.json(admin);
    } else {
      res.json({ massage: "This login already taken" });
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  const { login, password } = req.body;
  const admin = await Admin.find({ login, password });
  if (admin.length === 0) {
    res.json({ error: "Email or passowd in incorrect" });
  } else {
    const jwtData = {
      login,
      password,
    };
    const token = jwt.sign(jwtData, process.env.SECRETKEY, {
      expiresIn: "24h",
    });
    res.cookie("authorization", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    });
    res.json(admin);
  }
});

module.exports = router;
