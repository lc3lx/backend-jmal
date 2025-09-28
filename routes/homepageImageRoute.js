const express = require("express");
const {
  getHomepageImageValidator,
  createHomepageImageValidator,
  updateHomepageImageValidator,
  deleteHomepageImageValidator,
} = require("../utils/validators/homepageImageValidator");

const authService = require("../services/authService");

const {
  getHomepageImages,
  getHomepageImage,
  createHomepageImage,
  updateHomepageImage,
  deleteHomepageImage,
  uploadHomepageImage,
  resizeImage,
  getActiveSliderImages,
  getActiveDiscountImages,
} = require("../services/homepageImageService");

const router = express.Router();

// Public routes for getting active images
router.get("/slider/active", getActiveSliderImages);
router.get("/discount/active", getActiveDiscountImages);

// Admin routes
router
  .route("/")
  .get(getHomepageImages)
  .post(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadHomepageImage,
    resizeImage,
    createHomepageImageValidator,
    createHomepageImage
  );

router
  .route("/:id")
  .get(getHomepageImageValidator, getHomepageImage)
  .put(
    authService.protect,
    authService.allowedTo("admin", "manager"),
    uploadHomepageImage,
    resizeImage,
    updateHomepageImageValidator,
    updateHomepageImage
  )
  .delete(
    authService.protect,
    authService.allowedTo("admin"),
    deleteHomepageImageValidator,
    deleteHomepageImage
  );

module.exports = router;
