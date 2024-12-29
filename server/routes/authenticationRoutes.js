const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyTokenMiddleware");
const authenticationConstroller = require("../controller/authenticationController");

router.post("/login", authenticationConstroller.login);
router.post("/logout", authenticationConstroller.logout);
router.post("/verify-token", verifyToken, authenticationConstroller.verify);
router.put("/update", verifyToken, authenticationConstroller.update);
router.get("/get-admin", verifyToken, authenticationConstroller.getAdmin);
router.get("/getadmin/:id", authenticationConstroller.getSingleAdmin);
router.post("/createUser", authenticationConstroller.createUser);
router.post("/verifyEmail", authenticationConstroller.verifyEmail);
router.post(
  "/verificationEmailResend",
  authenticationConstroller.resendVerificationEmail
);
router.post("/forgotPassword", authenticationConstroller.forgotPassword);
router.post("/resetPassword/:token", authenticationConstroller.resetPassword);
router.get("/check-auth", verifyToken, authenticationConstroller.checkAuth);

module.exports = router;
