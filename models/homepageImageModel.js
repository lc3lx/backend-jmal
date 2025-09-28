const mongoose = require("mongoose");

const homepageImageSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["slider", "discount"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    backgroundColor: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient queries
homepageImageSchema.index({ type: 1, isActive: 1, order: 1 });

// Virtual for image URL
const setImageURL = (doc) => {
  if (doc.image) {
    const imageUrl = `${process.env.BASE_URL}/homepage/${doc.image}`;
    console.log("Setting homepage image URL:", imageUrl);
    doc.image = imageUrl;
  }
};

// findOne, findAll and update
homepageImageSchema.post("init", (doc) => {
  setImageURL(doc);
});

// create
homepageImageSchema.post("save", (doc) => {
  setImageURL(doc);
});

module.exports = mongoose.model("HomepageImage", homepageImageSchema);
