const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();
// User imports start here
const UserSchema = require("../models/UserSchema");
const AUTH = require("../middleware/auth");
const UTILS = require("../UTILS");
const ENV = process.env

/**
 * Register api
 * Email and password should be in body.
 * Password should be at least 6 characters long.
 * Email should be passing regex.
 * Email must be unique.
 */
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ msg: "Password and email are required" });

  if (password.length < 6) {
    return res
      .status(400)
      .json({ msg: "Password should be at least 6 characters long." });
  }

  if (!UTILS.isEmail(email))
    return res.status(400).json({ msg: `${email} email is not correct.` });

  const user = await UserSchema.findOne({ email });
  if (user)
    return res.status(400).json({ msg: `${email} email already exists` });

  const newUser = new UserSchema({ email, password });
  bcrypt.hash(password, 7, async (err, hash) => {
    if (err)
      return res.status(400).json({ msg: "Error while saving the password." });

    newUser.password = hash;
    const savedUserRes = await newUser.save();

    if (savedUserRes)
      return res.status(200).json({ msg: `${email} is successfully saved.` });
  });
});

/**
 * Login api
 * Email and password should be in body.
 */
router.post(`/login`, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ msg: "Email or password is missing." });
  }

  const user = await UserSchema.findOne({ email: email });
  if (!user) {
    return res
      .status(400)
      .json({ msg: `User with ${email} email is not found.` });
  }

  const encryptedPassword = await bcrypt.compare(password, user.password);
  const userSession = { email: user.email };
  req.session.user = userSession;

  if (encryptedPassword) {
    // Create token
    const token = jwt.sign(
      { user_id: user._id, email },
      ENV.TOKEN_KEY,
      { expiresIn: ENV.TOKEN_MAX_AGE }
    );

    const updateUser = await UserSchema.findOneAndUpdate(
      { email: email },
      { token: token },
      false,
      true
    );

    return res
      .status(200)
      .json({ msg: "You have logged in successfully", userSession, token });
  } else {
    return res.status(400).json({ msg: "Credentials are invalid." });
  }
});

// Session delete api
router.delete(`/logout`, async (req, res) => {
  if (req.session?.user?.email) {
    await UserSchema.findOneAndUpdate(
      { email: req.session.user.email },
      { token: null }
    );
    req.session.destroy((error) => {
      if (error) throw error;
      res.clearCookie("session-id");
      res.status(200).send("User is successfully logged out.");
    });
  } else {
    res.status(200).send("User is already logged out.");
  }
});

// Getting current logged in user sessions
router.get("/isAuth", async (req, res) => {
  if (req.session.user) {
    return res.json(req.session.user);
  } else {
    return res.status(401).json("User is unauthorized.");
  }
});

// Delete user and his session
router.delete("/delete", async (req, res) => {
  const { email } = req.body;
  const user = await UserSchema.findOne({ email: email });
  if (!user) {
    return res
      .status(400)
      .json({ msg: `User with ${email} email is not found.` });
  }
  await UserSchema.findOneAndDelete({ email: email })
    .exec()
    .then(() => {
      req.session.destroy((error) => {
        if (error) throw error;
        res.clearCookie("session-id");
      });
      res.status(200).json({ msg: "User is successfully deleted." });
    })
    .catch((err) => {
      throw err;
    });
});

// Authenticated endpoint
router.post("/dashboard", AUTH, (req, res) => {
  res.status(200).json({ msg: "Welcome to the dashboard 🙌." });
});

module.exports = router;
