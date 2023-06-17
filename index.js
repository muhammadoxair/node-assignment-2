require("dotenv").config();
const express = require("express");
const session = require("express-session");
const cors = require("cors");
const mongoose = require("mongoose");
const MongoDBStore = require("connect-mongodb-session")(session);
const router = express.Router();
// User imports start here
const routes = require("./routes/router");
const AUTH = require("./middleware/auth");
const {PORT, DATABASE_URL, BASE_API_URL, SESSION_SECRET_KEY, ORIGIN_URL} = process.env;

const app = express();
// User session will be valid for 24 hours
const MAX_AGE = 24 * 60 * 60 * 1000;

var corsOptions = {
  origin: ORIGIN_URL,
};

// MongoDB connection starts here
mongoose.connect(DATABASE_URL);
const database = mongoose.connection;

const mongoDBstore = new MongoDBStore({
  uri: DATABASE_URL,
  collection: "userSessions",
});

// Checking if MongoDB is connected
database.on("error", (error) => {
  console.log(error);
});
database.once("connected", () => {
  console.log("Database Connected");
});

// Middle ware starts here
app.use(
  session({
    secret: SESSION_SECRET_KEY,
    store: mongoDBstore,
    cookie: {
      maxAge: MAX_AGE,
      sameSite: false,
      secure: false,
    },
    resave: true,
    saveUninitialized: false,
  })
);

app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(BASE_API_URL, routes);

// Default route in case any endpoint donot match
app.use((req, res) => {
  res
    .status(404)
    .json({ msg: "You reached a route that is not defined on this server." });
});

app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});
