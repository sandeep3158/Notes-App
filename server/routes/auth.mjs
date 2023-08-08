import express from "express";
import { body, validationResult } from "express-validator";
import User from "../models/User.mjs"; // Assuming the User model is defined in a file named "User.mjs"
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import fetchUser from '../middleware/fetchUser.mjs'; // Assuming the fetchUser middleware is defined in a file named "fetchUser.mjs"

const router = express.Router();
const secret_key = process.env.Secret_key;
// Route 1: Create a User using POST /api/auth/createuser (No Login required)
router.post(
  "/createuser",
  [
    body("name").isLength({ min: 3 }),
    body("email").isEmail(),
    body("password").isLength({ min: 3 }),
  ],
  async (req, res) => {
    let success = false;
    try {
      // check whether email is already exist
      const { name, email,password } = req.body;
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ success, error: "Sorry user already exist" })
      }

      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success,errors: errors.array() });
      }

      const salt = await bcrypt.genSalt(10);
      let securePass = await bcrypt.hash(password, salt);
      user = await User.create({ name, email, password: securePass });
      console.log("Data inserted Successfully");
      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, secret_key);
      success = true;
      res.json({ success, authToken });
    } catch (error) {
      console.error(error);
      res.status(500).send("Server Error");
    }
  }
);

// Route 2: Authenticate a user "api/auth/login" (No Login required)
router.post(
  "/login",
  [
    body("email", "Enter a valid Email").isEmail(),
    body("password", "Password can't be blank").exists(),
  ],
  async (req, res) => {
    let success = false;
    // If there are errors, return bad request and errors

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false
        res.status(400).json({
          success, error: "Please enter valid credentials",
        });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success = false
        res.status(400).json({
          success,
          error: "Please enter valid credentials",
        });
      }
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, secret_key);
      success = true;
      res.json({ success, authToken })



    } catch (error) {
      console.error(error.message);
      res.status(500).send("Server Error");
    }
  }
);

// Route 3: To get login user details 'api/auth/getuser' (Login required)
router.post("/getuser", fetchUser, async (req, res) => {
  try {
    let userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    res.send(user);
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

export default router;
