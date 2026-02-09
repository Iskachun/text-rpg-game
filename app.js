const express = require("express");
const session = require("express-session");
const path = require("path");
const bcrypt = require("bcrypt");
const data = require("./data");

var app = express();

// middleware: parse JSON (kan beholdes hvis du bruker JSON andre steder)
app.use(express.json());

// NYTT: middleware for å parse form-data (HTML forms)
app.use(express.urlencoded({ extended: true }));

// middleware: session
app.use(
  session({
    secret: "something-idk",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, sameSite: "lax" },
  })
);