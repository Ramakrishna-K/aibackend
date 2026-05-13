

// import express from "express";
// import bcrypt from "bcryptjs";
// import generateToken from "../utils/generateToken.js";
// import protect from "../middleware/authMiddleware.js";

// const router = express.Router();

// // Dummy Database
// let users = [];

// /* =========================
//    REGISTER
// ========================= */
// router.post("/register", async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     // Check user already exists
//     const userExists = users.find(
//       (user) => user.email === email
//     );

//     if (userExists) {
//       return res.status(400).json({
//         message: "User already exists",
//       });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(
//       password,
//       10
//     );

//     // Create user
//     const newUser = {
//       id: Date.now(),
//       name,
//       email,
//       password: hashedPassword,
//     };

//     // Save user
//     users.push(newUser);

//     // NO TOKEN
//     // NO COOKIE

//     res.status(201).json({
//       message: "Registration Successful",
//       user: {
//         id: newUser.id,
//         name: newUser.name,
//         email: newUser.email,
//       },
//     });
//   } catch (error) {
//     console.log(error);

//     res.status(500).json({
//       message: "Server Error",
//     });
//   }
// });

// /* =========================
//    LOGIN
// ========================= */
// router.post("/login", async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find user
//     const user = users.find(
//       (user) => user.email === email
//     );

//     if (!user) {
//       return res.status(400).json({
//         message: "Invalid Email",
//       });
//     }

//     // Compare password
//     const isMatch = await bcrypt.compare(
//       password,
//       user.password
//     );

//     if (!isMatch) {
//       return res.status(400).json({
//         message: "Invalid Password",
//       });
//     }

//     // Generate token
//     const token = generateToken(user.id);

//     // Save cookie
//     res.cookie("token", token, {
//       httpOnly: true,
//       secure: false,
//       sameSite: "lax",
//       maxAge: 7 * 24 * 60 * 60 * 1000,
//     });

//     res.status(200).json({
//       message: "Login Successful",
//       token,
//       user: {
//         id: user.id,
//         name: user.name,
//         email: user.email,
//       },
//     });
//   } catch (error) {
//     console.log(error);

//     res.status(500).json({
//       message: "Server Error",
//     });
//   }
// });

// /* =========================
//    PROFILE
// ========================= */
// router.get("/profile", protect, (req, res) => {
//   res.json({
//     message: "Protected Route Accessed",
//     user: req.user,
//   });
// });

// /* =========================
//    LOGOUT
// ========================= */
// router.post("/logout", (req, res) => {
//   res.clearCookie("token");

//   res.json({
//     message: "Logged Out",
//   });
// });

// export default router;


import express from "express";
import bcrypt from "bcryptjs";

import generateToken from "../utils/generateToken.js";
import protect from "../middleware/authMiddleware.js";

import User from "../models/User.js";

const router = express.Router();


/* =========================
   REGISTER
========================= */
router.post("/register", async (req, res) => {

  try {

    const { name, email, password } =
      req.body;

    // CHECK USER
    const userExists =
      await User.findOne({ email });

    if (userExists) {

      return res.status(400).json({
        message: "User already exists",
      });
    }

    // HASH PASSWORD
    const hashedPassword =
      await bcrypt.hash(password, 10);

    // CREATE USER
    const newUser = await User.create({

      name,
      email,
      password: hashedPassword,

    });

    res.status(201).json({

      message: "Registration Successful",

      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      },

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});


/* =========================
   LOGIN
========================= */
router.post("/login", async (req, res) => {

  try {

    const { email, password } =
      req.body;

    // FIND USER
    const user =
      await User.findOne({ email });

    if (!user) {

      return res.status(400).json({
        message: "Invalid Email",
      });
    }

    // CHECK PASSWORD
    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {

      return res.status(400).json({
        message: "Invalid Password",
      });
    }

    // TOKEN
    const token =
      generateToken(user._id);

    // COOKIE
    res.cookie("token", token, {

      httpOnly: true,
      secure: false,
      sameSite: "lax",

      maxAge:
        7 * 24 * 60 * 60 * 1000,

    });

    res.status(200).json({

      message: "Login Successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
});


/* =========================
   PROFILE
========================= */
router.get(
  "/profile",
  protect,
  (req, res) => {

    res.json({
      message:
        "Protected Route Accessed",

      user: req.user,
    });
  }
);


/* =========================
   LOGOUT
========================= */
router.post("/logout", (req, res) => {

  res.clearCookie("token");

  res.json({
    message: "Logged Out",
  });
});

export default router;