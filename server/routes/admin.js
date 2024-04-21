const express = require("express");
const router = express.Router();
const post = require("../models/Post");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Post = require("../models/Post");
const jwtSecret = process.env.JWT_SECRET;

const adminLayouts = "../views/layouts/admin";

const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
};

router.get("/admin", async (req, res) => {
  try {
    const locals = {
      title: "Admin",
      description: "NodeJs,Mongodb and Express ",
    };
    res.render("admin/index", { locals, layout: adminLayouts });
  } catch (error) {
    console.log(error);
  }
});

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await User.create({ username, password: hashedPassword });
      res.status(201).json({ message: "User Created", user });
    } catch (error) {
      if (error.code === 11000) {
        res.status(409).json({ message: "User already in use" });
        res.redirect("/admin");
      }
      res.status(500).json({ message: "Internal server error" });
    }
  } catch (error) {
    console.log(error);
  }
});

router.post("/admin", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      res.status(401).json({ message: "Invalid Credentials" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign({ userId: user._id }, jwtSecret);
    res.cookie("token", token, { httpOnly: true });

    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

router.get("/dashboard", authMiddleware, async (req, res) => {
  const locals = {
    title: "Dashboard",
    description: "NodeJs,Mongodb and Express ",
  };
  try {
    const data = await post.find();
    res.render("admin/dashboard", {
      data,
      locals,
      layout: adminLayouts,
    });
  } catch (error) {}
});

router.get("/add-post", authMiddleware, async (req, res) => {
  const locals = {
    title: "Add Post",
    description: "NodeJs,Mongodb and Express ",
  };
  try {
    const data = await post.find();
    res.render("admin/add-post", {
      data,
      locals,
      layout: adminLayouts,
    });
  } catch (error) {}
});

router.post("/add-post", authMiddleware, async (req, res) => {
  console.log(req.body);
  try {
    res.redirect("/dashboard");
    const newPost = new post({
      title: req.body.title,
      body: req.body.body,
    });
    await Post.create(newPost);
  } catch (error) {
    console.log(error);
  }
});

router.put("/edit-post/:id", authMiddleware, async (req, res) => {
  try {
    await post.findByIdAndUpdate(req.params.id, {
      title: req.body.title,
      body: req.body.body,
      updatedAt: Date.now(),
    });
    // res.redirect(`/edit-post/${req.params.id}`);
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

router.get("/edit-post/:id", authMiddleware, async (req, res) => {
  const locals = {
    title: "Edit Post",
    description: "NodeJs,Mongodb and Express ",
  };
  try {
    const data = await post.findOne({ _id: req.params.id });
    res.render("admin/edit-post", {
      data,
      layout: adminLayouts,
      locals,
    });
  } catch (error) {
    console.log(error);
  }
});

router.delete("/delete-post/:id", authMiddleware, async (req, res) => {
  try {
    await post.deleteOne({ _id: req.params.id });
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
});

router.get("/logout", authMiddleware, async (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

module.exports = router;
