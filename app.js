require("dotenv").config();

const express = require("express");

const expressLayouts = require("express-ejs-layouts");
const methodOverride = require("method-override");
const cookieParse = require("cookie-parser");
const MongoStore = require("connect-mongo");
const session = require("express-session");
const connectDB = require("./server/config/db");

const post = require("./server/models/Post");

const app = express();
const PORT = 5000 || process.env.PORT;

connectDB();

app.use(methodOverride("_method"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParse());
app.use(
  session({
    secret: "Keyboard Cat",
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL }),
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
  })
);

app.use(express.static("public"));

app.use(expressLayouts);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.use("/", require("./server/routes/main"));
app.use("/", require("./server/routes/admin"));

app.listen(PORT, () => {
  console.log(`APP listening on PORT ${PORT}`);
});
