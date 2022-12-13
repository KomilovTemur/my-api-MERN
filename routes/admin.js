const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Admin = require("../model/Admin");

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
