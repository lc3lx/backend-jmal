const asyncHandler = require("express-async-handler");
const paypal = require("@paypal/checkout-server-sdk");
const factory = require("./handlersFactory");
const ApiError = require("../utils/apiError");

const paypalClient = require("../config/paypal");

const Product = require("../models/productModel");
const Order = require("../models/orderModel");

// @desc    create cash order
// @route   POST /api/v1/orders
// @access  Protected/User
exports.createCashOrder = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;

  // 1) Get product
  const product = await Product.findById(productId);
  if (!product) {
    return next(new ApiError(`There is no product with id ${productId}`, 404));
  }

  // 2) Check if product is available
  if (product.stock <= 0) {
    return next(new ApiError(`Product is out of stock`, 400));
  }

  // 3) Create order
  const order = await Order.create({
    user: req.user._id,
    product: productId,
    price: product.price,
    totalOrderPrice: product.price,
    paymentMethodType: req.body.paymentMethodType || "cash",
  });

  // 4) After creating order, decrement product stock, increment product sold
  if (order) {
    product.stock -= 1;
    product.sold += 1;
    await product.save();
  }

  res.status(201).json({ status: "success", data: order });
});

exports.filterOrderForLoggedUser = asyncHandler(async (req, res, next) => {
  if (req.user.role === "user") req.filterObj = { user: req.user._id };
  next();
});
// @desc    Get all orders
// @route   POST /api/v1/orders
// @access  Protected/User-Admin-Manager
exports.findAllOrders = factory.getAll(Order);

// @desc    Get all orders
// @route   POST /api/v1/orders
// @access  Protected/User-Admin-Manager
exports.findSpecificOrder = factory.getOne(Order);

// @desc    Update order paid status to paid
// @route   PUT /api/v1/orders/:id/pay
// @access  Protected/Admin-Manager
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(
        `There is no such a order with this id:${req.params.id}`,
        404
      )
    );
  }

  // update order to paid
  order.isPaid = true;
  order.paidAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({ status: "success", data: updatedOrder });
});

// @desc    Update order with account details (Admin only)
// @route   PUT /api/v1/orders/:id/account
// @access  Protected/Admin-Manager
exports.updateOrderWithAccount = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    return next(
      new ApiError(`There is no such order with this id:${req.params.id}`, 404)
    );
  }

  // Update order with account details
  order.accountEmail = req.body.accountEmail;
  order.accountPassword = req.body.accountPassword;
  order.accountDetails = req.body.accountDetails;
  order.isDelivered = true;
  order.deliveredAt = Date.now();

  const updatedOrder = await order.save();

  res.status(200).json({ status: "success", data: updatedOrder });
});

// @desc    Create PayPal order
// @route   POST /api/v1/orders/paypal/create
// @access  Protected/User
exports.createPayPalOrder = asyncHandler(async (req, res, next) => {
  const { productId } = req.body;

  // 1) Get product
  const product = await Product.findById(productId);
  if (!product) {
    return next(new ApiError(`There is no product with id ${productId}`, 404));
  }

  // 2) Check if product is available
  if (product.stock <= 0) {
    return next(new ApiError(`Product is out of stock`, 400));
  }

  // 3) Create PayPal order
  const request = new paypal.orders.OrdersCreateRequest();
  request.prefer("return=representation");
  request.requestBody({
    intent: "CAPTURE",
    purchase_units: [
      {
        amount: {
          currency_code: "USD",
          value: product.price.toFixed(2),
        },
        description: product.title,
        custom_id: JSON.stringify({
          userId: req.user._id,
          productId: product._id,
        }),
      },
    ],
    application_context: {
      return_url: `${process.env.BASE_URL}/user/allorders`,
      cancel_url: `${process.env.BASE_URL}/products/${productId}`,
      brand_name: "StreamStore",
      user_action: "PAY_NOW",
    },
  });

  try {
    const order = await paypalClient.client().execute(request);

    // Get approval URL
    const approvalUrl = order.result.links.find(
      (link) => link.rel === "approve"
    ).href;

    res.status(200).json({
      status: "success",
      orderId: order.result.id,
      approvalUrl: approvalUrl,
    });
  } catch (err) {
    console.error("PayPal Error:", err);
    return next(new ApiError(`PayPal error: ${err.message}`, 500));
  }
});

// @desc    Capture PayPal order
// @route   POST /api/v1/orders/paypal/capture/:orderId
// @access  Protected/User
exports.capturePayPalOrder = asyncHandler(async (req, res, next) => {
  const { orderId } = req.params;

  const request = new paypal.orders.OrdersCaptureRequest(orderId);
  request.requestBody({});

  try {
    const capture = await paypalClient.client().execute(request);

    // Parse custom data
    const customData = JSON.parse(
      capture.result.purchase_units[0].payments.captures[0].custom_id ||
        capture.result.purchase_units[0].custom_id
    );
    const { userId, productId } = customData;

    // Get product
    const product = await Product.findById(productId);
    if (!product) {
      return next(new ApiError(`Product not found`, 404));
    }

    // Create order in database
    const order = await Order.create({
      user: userId,
      product: productId,
      price: product.price,
      totalOrderPrice: product.price,
      isPaid: true,
      paidAt: Date.now(),
      paymentMethodType: "paypal",
      paypalOrderId: orderId,
    });

    // Decrement product stock, increment product sold
    if (order) {
      product.stock -= 1;
      product.sold += 1;
      await product.save();
    }

    res.status(200).json({
      status: "success",
      data: order,
    });
  } catch (err) {
    console.error("PayPal Capture Error:", err);
    return next(new ApiError(`PayPal capture error: ${err.message}`, 500));
  }
});
