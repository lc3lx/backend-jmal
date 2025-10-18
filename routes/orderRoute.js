const express = require("express");
const {
  createCashOrder,
  findAllOrders,
  findSpecificOrder,
  filterOrderForLoggedUser,
  updateOrderToPaid,
  updateOrderWithAccount,
  createPayPalOrder,
  capturePayPalOrder,
} = require("../services/orderService");

const authService = require("../services/authService");

const router = express.Router();

router.use(authService.protect);

// Create cash order
router.post("/", authService.allowedTo("user"), createCashOrder);

// PayPal routes
router.post(
  "/paypal/create",
  authService.allowedTo("user"),
  createPayPalOrder
);
router.post(
  "/paypal/capture/:orderId",
  authService.allowedTo("user"),
  capturePayPalOrder
);

// Get all orders
router.get(
  "/",
  authService.allowedTo("user", "admin", "manager"),
  filterOrderForLoggedUser,
  findAllOrders
);

// Get specific order
router.get("/:id", findSpecificOrder);

// Update order payment status
router.put(
  "/:id/pay",
  authService.allowedTo("admin", "manager"),
  updateOrderToPaid
);

// Update order with account details
router.put(
  "/:id/account",
  authService.allowedTo("admin", "manager"),
  updateOrderWithAccount
);

module.exports = router;
