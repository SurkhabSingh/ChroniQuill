const express = require("express");
const router = express.Router();
const post = require("../models/post");

router.get("", async (req, res) => {
  try {
    const locals = {
      title: "NodeJs",
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

module.exports = router;

// router.get("", async (req, res) => {
//   const locals = {
//     title: "NodeJs",
//     description: "NodeJs,Mongodb and Express ",
//   };
//   try {
//     const data = await post.find();
//     res.render("index", { locals, data });
//   } catch (error) {
//     console.log(error);
//   }
// });
