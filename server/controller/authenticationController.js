require("dotenv").config();
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const authenticationModel = require("../model/authenticationModel");
const generateTokenAndSetCookie = require("../utils/generateTokenAndSetCookie");
const {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendResetPasswordEmail,
  sendSuccessfullPasswordResetMail,
} = require("../mailtrap/email");
const asyncHandler = require("../utils/AsyncHandler");
const SECRET = process.env.JWT_SECRET_KEY;

module.exports = {
  login: asyncHandler(async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await authenticationModel.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid Credentials" });
      }
      const passCompare = await bcryptjs.compare(password, user.password);
      if (!passCompare) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid Credentials" });
      }
      generateTokenAndSetCookie(res, user._id);
      res.status(200).json({
        success: true,
        message: "Login successful",
        user: {
          ...user._doc,
          password: undefined,
        },
      });
    } catch (error) {
      res.status(500).send("Error in login user");
    }
  }),

  logout: asyncHandler(async (req, res) => {
    try {
      await res.clearCookie("token");

      res.status(200).send("Logout successful");
    } catch (error) {
      console.log(error);
    }
  }),

  verify: asyncHandler((req, res) => {
    res.status(200).send("Verified");
  }),

  update: asyncHandler(async (req, res) => {
    try {
      const { username, password } = req.body;

      if (!username && !password) {
        return res.status(400).send("Data not provided");
      }

      if (username) {
        await authenticationModel.findByIdAndUpdate(req.userID, {
          username,
        });
      }
      if (password) {
        const salt = await bcryptjs.genSalt(10);
        const encryptedPass = await bcryptjs.hash(password, salt);

        await authenticationModel.findByIdAndUpdate(req.userID, {
          password: encryptedPass,
        });
      }

      res.status(201).send("Data update successfully");
    } catch (error) {
      res.status(500).send("Error in updation");
    }
  }),

  getAdmin: asyncHandler(async (req, res) => {
    try {
      const user = await authenticationModel.findById({ _id: req.userID });
      res.status(200).json(user);
    } catch (error) {
      res.status(500).send("Error in getting user");
    }
  }),
  getSingleAdmin: asyncHandler(async (req, res) => {
    const id = req.params.id;
    try {
      const user = await authenticationModel.findById(id);
      res.status(200).json(user);
    } catch (error) {
      res.status(500).send("Error in getting user");
    }
  }),

  createUser: asyncHandler(async (req, res) => {
    const { username, password, email, city } = req.body;
    try {
      if (!password || !username || !email || !city) {
        return res.status(400).json({ message: "Missing required fields" });
      }
      const userAlreadyExists = await authenticationModel.findOne({ email });
      if (userAlreadyExists) {
        return res
          .status(400)
          .json({ message: "User with this email already exists" });
      }
      const encryptedPass = await bcryptjs.hash(password, 10);
      const verificationToken = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      const user = new authenticationModel({
        username,
        email,
        city,
        password: encryptedPass,
        verificationToken,
        verificationTokenExpiresAt: Date.now() + 15 * 60 * 1000,
      });
      await user.save();

      //jwt
      generateTokenAndSetCookie(res, user._id);

      //send verification email
      await sendVerificationEmail(user.email, verificationToken);

      res.status(200).json({
        success: true,
        message: "Successfully Registered",
        user: {
          ...user._doc,
          password: undefined,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error in creating user" });
    }
  }),
  resendVerificationEmail: asyncHandler(async (req, res) => {
    const { email } = req.body;

    try {
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // Find user by email
      const user = await authenticationModel.findOne({ email });

      if (!user) {
        return res
          .status(404)
          .json({
            message:
              "No account exists associated with the provided email address.",
          });
      }

      // Check if the user is already verified
      if (user.isVerified === true) {
        return res.status(400).json({ message: "User is already verified" });
      }

      // Generate a new verification token
      const newVerificationToken = Math.floor(
        100000 + Math.random() * 900000
      ).toString();
      const verificationTokenExpiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes expiry

      // Update the user document with the new token and expiry time
      user.verificationToken = newVerificationToken;
      user.verificationTokenExpiresAt = verificationTokenExpiresAt;

      await user.save();

      // Resend the verification email
      await sendVerificationEmail(user.email, newVerificationToken);

      res.status(200).json({
        success: true,
        message: "Verification email has been resent",
      });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Error in resending verification email" });
    }
  }),

  verifyEmail: asyncHandler(async (req, res) => {
    const { code } = req.body;
    try {
      const user = await authenticationModel.findOne({
        verificationToken: code,
        verificationTokenExpiresAt: { $gt: Date.now() },
      });
      if (!user) {
        return res.status(400).json({ message: "Invalid verification code" });
      }
      user.isVerified = true;
      user.verificationToken = undefined;
      user.verificationTokenExpiresAt = undefined;
      await user.save();
      await sendWelcomeEmail(user.email, user.username);
      res.status(200).json({
        success: true,
        message: "Email verified successfully",
        user: {
          ...user._doc,
          password: undefined,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error in verifying email" });
    }
  }),
  forgotPassword: asyncHandler(async (req, res) => {
    const { email } = req.body;
    try {
      const user = await authenticationModel.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ message: "User with this email does not exist" });
      }
      const resetToken = crypto.randomBytes(20).toString("hex");
      user.resetPasswordToken = resetToken;
      user.resetPasswordExpiresAt = Date.now() + 1 * 60 * 60 * 1000; //1 hour
      await user.save();
      await sendResetPasswordEmail(
        user.email,
        `${process.env.FRONTEND_DOMAIN_NAME}/reset-password/${resetToken}`
      );
      res
        .status(200)
        .json({ message: "Reset password email sent successfully" });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ message: "Error in sending reset password email" });
    }
  }),
  resetPassword: asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
      const user = await authenticationModel.findOne({
        resetPasswordToken: token,
        resetPasswordExpiresAt: { $gt: Date.now() },
      });
      if (!user) {
        return res
          .status(400)
          .json({ message: "Reset password token expired or invalid" });
      }

      const hashedPassword = await bcryptjs.hash(password, 10);
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordExpiresAt = undefined;
      await user.save();

      //send email for succesfully reseting the password
      await sendSuccessfullPasswordResetMail(user.email);
      res
        .status(200)
        .json({ success: true, message: "Password Reset Successfull" });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error in resetting password" });
    }
  }),
  checkAuth: asyncHandler(async (req, res) => {
    try {
      const user = await authenticationModel
        .findOne({ _id: req.userId })
        .select("-password");
      if (!user) {
        return res.status(401).json({ message: "User not authenticated" });
      }
      res.status(200).json({
        success: true,
        user,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Error in checking authentication" });
    }
  }),
};
