const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const asyncHandler = require("express-async-handler");

const factory = require("./handlersFactory");
const { uploadSingleImage } = require("../middlewares/uploadImageMiddleware");
const HomepageImage = require("../models/homepageImageModel");

// Upload single image
exports.uploadHomepageImage = uploadSingleImage("image");

// Image processing
exports.resizeImage = asyncHandler(async (req, res, next) => {
  const filename = `homepage-${req.body.type}-${uuidv4()}-${Date.now()}.jpeg`;

  if (req.file) {
    // Different sizes for different types
    const dimensions =
      req.body.type === "slider"
        ? { width: 800, height: 400 }
        : { width: 600, height: 300 };

    await sharp(req.file.buffer)
      .resize(dimensions.width, dimensions.height)
      .toFormat("jpeg")
      .jpeg({ quality: 95 })
      .toFile(`uploads/homepage/${filename}`);

    // Save image into our db
    req.body.image = filename;
  }

  next();
});

// @desc    Get list of homepage images
// @route   GET /api/v1/homepage-images
// @access  Public
exports.getHomepageImages = factory.getAll(HomepageImage);

// @desc    Get specific homepage image by id
// @route   GET /api/v1/homepage-images/:id
// @access  Public
exports.getHomepageImage = factory.getOne(HomepageImage);

// @desc    Create homepage image
// @route   POST  /api/v1/homepage-images
// @access  Private/Admin-Manager
exports.createHomepageImage = asyncHandler(async (req, res) => {
  console.log("Creating homepage image with data:", req.body);
  const doc = await HomepageImage.create(req.body);
  console.log("Created homepage image:", doc);
  res.status(201).json({
    status: "success",
    data: doc,
  });
});

// @desc    Update specific homepage image
// @route   PUT /api/v1/homepage-images/:id
// @access  Private/Admin-Manager
exports.updateHomepageImage = factory.updateOne(HomepageImage);

// @desc    Delete specific homepage image
// @route   DELETE /api/v1/homepage-images/:id
// @access  Private/Admin
exports.deleteHomepageImage = factory.deleteOne(HomepageImage);

// @desc    Get active slider images
// @route   GET /api/v1/homepage-images/slider/active
// @access  Public
exports.getActiveSliderImages = asyncHandler(async (req, res) => {
  console.log("Fetching active slider images...");
  const images = await HomepageImage.find({
    type: "slider",
    isActive: true,
  }).sort({ order: 1 });

  console.log("Found slider images:", images.length);
  res.status(200).json({
    status: "success",
    results: images.length,
    data: images,
  });
});

// @desc    Get active discount images
// @route   GET /api/v1/homepage-images/discount/active
// @access  Public
exports.getActiveDiscountImages = asyncHandler(async (req, res) => {
  const images = await HomepageImage.find({
    type: "discount",
    isActive: true,
  }).sort({ order: 1 });

  res.status(200).json({
    status: "success",
    results: images.length,
    data: images,
  });
});
