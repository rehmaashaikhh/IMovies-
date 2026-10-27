const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const { fetchUser } = require("../middlewares/fetchUser");

// Public key retrieval
router.get("/get-key", paymentController.getKey);

// 5-Step Razorpay Checkout flow
router.post("/create-order", fetchUser, paymentController.createOrder);
router.post("/verify", fetchUser, paymentController.verifyPayment);

// Direct Instant Payment flow (Bypasses Razorpay)
router.post("/confirm-direct", fetchUser, paymentController.confirmDirect);

module.exports = router;
