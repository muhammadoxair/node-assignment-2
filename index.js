
require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const routes = require('./routes/routes');
const cors = require("cors");

var corsOptions = {
    origin: "http://localhost:8081"
  };
  

const PORT = process.env.PORT || 8080;
const DATABASE_URL = process.env.DATABASE_URL;
const BASE_API_URL = process.env.BASE_API_URL;

mongoose.connect(DATABASE_URL);
const database = mongoose.connection;

const app = express();


database.on('error', (error) => {
    console.log(error);
})
database.once('connected', () => {
    console.log('Database Connected');
})

app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(BASE_API_URL, routes)


app.listen(PORT, () => {
  console.log(`Server Started at ${PORT}`);
});
