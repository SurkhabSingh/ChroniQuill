const express = require("express");
const router = express.Router();
const post = require("../models/Post");

router.get("", async (req, res) => {
  try {
    const locals = {
      title: "ChroniQuill",
      description: "NodeJs,Mongodb and Express ",
    };

    let perPage = 10;
    let page = req.query.page || 1;

    const data = await post
      .aggregate([{ $sort: { createdAt: -1 } }])
      .skip(perPage * page - perPage)
      .limit(perPage)
      .exec();

    const count = await post.countDocuments();
    const nextPage = parseInt(page) + 1;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render("index", {
      locals,
      data,
      current: page,
      nextPage: hasNextPage ? nextPage : null,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/about", (req, res) => {
  res.render("about");
});

router.get("/contact", (req, res) => {
  res.render("contact");
});

router.get("/post/:id", async (req, res) => {
  try {
    let slug = req.params.id;
    const data = await post.findById({ _id: slug });
    const locals = {
      title: data.title,
      description: "NodeJs,Mongodb and Express ",
    };
    res.render("post", { locals, data });
  } catch (error) {
    console.log(error);
  }
});

router.post("/search", async (req, res) => {
  try {
    const locals = {
      title: "Search",
      description: "NodeJs,Mongodb and Express ",
    };

    let searchTerm = req.body.searchTerm;
    const searchNoSpecialCharacter = searchTerm.replace(/[^a-zA-z0-9]/g, "");

    const data = await post.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialCharacter, "i") } },
        { body: { $regex: new RegExp(searchNoSpecialCharacter, "i") } },
      ],
    });

    res.render("search", {
      data,
      locals,
    });
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
