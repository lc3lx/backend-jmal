const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Order must be belong to user"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "Order must contain a product"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    totalOrderPrice: {
      type: Number,
      required: [true, "Total price is required"],
    },
    paymentMethodType: {
      type: String,
      enum: ["card", "cash", "paypal"],
      default: "cash",
    },
    paypalOrderId: {
      type: String,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
    // Account credentials (to be filled by admin after payment)
    accountEmail: {
      type: String,
      default: null,
    },
    accountPassword: {
      type: String,
      default: null,
    },
    accountDetails: {
      type: String,
      default: null,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    deliveredAt: Date,
  },
  { timestamps: true }
);

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    select: "name profileImg email phone",
  }).populate({
    path: "product",
    select: "title imageCover category duration",
  });

  next();
});

module.exports = mongoose.model("Order", orderSchema);
