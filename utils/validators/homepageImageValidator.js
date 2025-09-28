const { check } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const HomepageImage = require("../../models/homepageImageModel");

exports.getHomepageImageValidator = [
  check("id").isMongoId().withMessage("Invalid homepage image id format"),
  validatorMiddleware,
];

exports.createHomepageImageValidator = [
  check("type")
    .notEmpty()
    .withMessage("Type is required")
    .isIn(["slider", "discount"])
    .withMessage("Type must be either slider or discount"),
  check("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters"),
  check("description")
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 5 })
    .withMessage("Description must be at least 5 characters"),
  check("order").optional().isNumeric().withMessage("Order must be a number"),
  check("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
  check("backgroundColor")
    .optional()
    .isString()
    .withMessage("backgroundColor must be a string"),
  validatorMiddleware,
];

exports.updateHomepageImageValidator = [
  check("id").isMongoId().withMessage("Invalid homepage image id format"),
  check("type")
    .optional()
    .isIn(["slider", "discount"])
    .withMessage("Type must be either slider or discount"),
  check("title")
    .optional()
    .isLength({ min: 3 })
    .withMessage("Title must be at least 3 characters"),
  check("description")
    .optional()
    .isLength({ min: 5 })
    .withMessage("Description must be at least 5 characters"),
  check("order").optional().isNumeric().withMessage("Order must be a number"),
  check("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be a boolean"),
  check("backgroundColor")
    .optional()
    .isString()
    .withMessage("backgroundColor must be a string"),
  validatorMiddleware,
];

exports.deleteHomepageImageValidator = [
  check("id").isMongoId().withMessage("Invalid homepage image id format"),
  validatorMiddleware,
];
