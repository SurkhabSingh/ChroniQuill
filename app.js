require("dotenv").config();

const express = require("express");

const expressLayouts = require("express-ejs-layouts");

const connectDB = require("./server/config/db");

const post = require("./server/models/post");

const app = express();
const PORT = 5000 || process.env.PORT;

connectDB();

app.use(express.static("public"));

app.use(expressLayouts);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");


app.use("/", require("./server/routes/main"));

app.listen(PORT, () => {
  console.log(`APP listening on PORT ${PORT}`);
});

// // function insertPostData() {
// //   post.insertMany([
// //     {
// //       title: "dummyData",
// //       body: "Body of dummy data",
// //     },
// //   ]);
// // }

// function generateDummyPosts() {
//   return {
//     title: `Post ${Math.floor(Math.random() * 1000)}`,
//     body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed et sem eu lorem eleifend dapibus. Ut vitae ultricies leo`,
//   };
// }
// const dummyPosts = Array.from({ length: 20 }, generateDummyPosts);
// // console.log(dummyPosts);

// function insertPostData() {
//   post.insertMany(dummyPosts);
// }
// insertPostData();